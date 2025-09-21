import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const KakaoCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const { setSocialLoginData } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(searchParamsKey);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const userId = params.get('user_id');
        const email = params.get('email');
        const firstName = params.get('first_name');
        const isNewUser = params.get('is_new_user') === 'true';

        if (!accessToken || !refreshToken) {
          throw new Error('토큰이 없습니다.');
        }

        const userData = {
          id: parseInt(userId || '0', 10),
          username: email || '',
          email: email || '',
          first_name: firstName || '',
          last_name: '',
          is_verified: true,
          created_at: new Date().toISOString(),
        };

        setSocialLoginData(accessToken, refreshToken, userData);

        window.history.replaceState({}, document.title, '/auth/kakao/callback');

        navigate('/login/success', { replace: true });

      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        navigate('/login', {
          replace: true,
          state: { error: '로그인 처리 중 오류가 발생했습니다.' }
        });
      }
    };

    if (searchParamsKey) {
      processCallback();
    }
  }, [searchParamsKey, setSocialLoginData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default KakaoCallbackPage;