import React from 'react';
import { SocialProvider } from '../../types/accounts';
import { authService } from '../../services/authService';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  isLoading?: boolean;
  className?: string;
}

const providerConfig = {
  kakao: {
    name: '카카오',
    backgroundColor: '#FEE500',
    textColor: '#000000',
    icon: '💬',
  },
  naver: {
    name: '네이버',
    backgroundColor: '#03C75A',
    textColor: '#FFFFFF',
    icon: 'N',
  },
};

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  isLoading = false,
  className = '',
}) => {
  const config = providerConfig[provider];

  const handleClick = () => {
    try {
      authService.startSocialLogin(provider);
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`${config.name} 로그인 설정에 오류가 있습니다: ${errorMessage}`);
    }
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
    border: 'none',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    minHeight: '44px',
    opacity: isLoading ? 0.6 : 1,
    transition: 'opacity 0.2s ease',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      style={buttonStyle}
      className={`social-login-button social-login-${provider} ${className}`}
    >
      <span className="social-icon" style={{ fontSize: '16px' }}>
        {config.icon}
      </span>
      <span className="social-text">
        {isLoading ? '로그인 중...' : `${config.name}로 로그인`}
      </span>
    </button>
  );
};

export default SocialLoginButton;