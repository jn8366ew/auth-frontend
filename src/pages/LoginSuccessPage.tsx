import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // 로그인되지 않은 상태라면 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 오류가 발생해도 로그인 페이지로 이동
      navigate('/login', { replace: true });
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* 환영 메시지 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            로그인 성공
          </h1>
          
          <p className="text-gray-600 mb-8">
            안녕하세요, <span className="font-semibold text-indigo-600">{user.first_name || user.username}</span>님!
            <br />
            성공적으로 로그인되었습니다.
          </p>

          {/* 사용자 정보 카드 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">이메일</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccessPage;
