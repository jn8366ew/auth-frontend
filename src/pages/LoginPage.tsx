import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/accounts';
import { LoginData } from '../types/accounts';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      console.log('로그인 시도:', data);
      await login(data);
      console.log('로그인 성공');
      
      // 로그인 성공 페이지로 이동
      navigate('/login/success', { replace: true });
    } catch (error) {
      console.error('로그인 에러:', error);
      alert(`로그인에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🔐 Auth Frontend</h1>
          <p>Django Auth API와 연동되는 인증 시스템</p>
        </div>
        
        <div className="form-container">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
        
        <div className="page-footer">
          <p>
            계정이 없으신가요? <a href="/register">회원가입</a>
          </p>
          <p className="mt-4">
            <a href="/docs" className="text-blue-600 hover:text-blue-800 underline">
              📚 API 문서 보기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
