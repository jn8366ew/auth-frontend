import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { User, LoginData, RegisterData, AuthContextType, SocialProvider } from '../types/accounts';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializeStarted = useRef(false);
  const socialLoginCompleted = useRef(false);

  const isAuthenticated = !!token && !!user;

  const loadUserProfile = useCallback(async () => {
    try {
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // ?�큰??만료?�었거나 ?�효?��? ?��? 경우 ?�동 로그?�웃
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }, []);

  useEffect(() => {
    if (initializeStarted.current) return;
    initializeStarted.current = true;

    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const savedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (savedToken) {
          setToken(savedToken);
          
          // 소셜 로그인으로 저장된 사용자 데이터가 있으면 profile API 호출 생략
          if (savedUserData && !socialLoginCompleted.current) {
            try {
              const userData = JSON.parse(savedUserData);
              setUser(userData);
            } catch (error) {
              console.error('Failed to parse saved user data:', error);
              // 파싱 실패시에만 profile API 호출
              await loadUserProfileSafely();
            }
          } else if (!socialLoginCompleted.current) {
            // 일반 로그인의 경우에만 profile API 호출
            await loadUserProfileSafely();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    const loadUserProfileSafely = async () => {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // 토큰이 만료되었거나 유효하지 않은 경우 자동 로그아웃
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);

      setToken(response.access);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);

      await loadUserProfile();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      await authService.register(data);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const startSocialLogin = (provider: SocialProvider) => {
    authService.startSocialLogin(provider);
  };

  const setSocialLoginData = useCallback((accessToken: string, refreshToken: string, userData: User) => {
    socialLoginCompleted.current = true; // 소셜 로그인 완료 플래그 설정
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      // 백엔드 로그아웃 API 호출
      await authService.logout();
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
    } finally {
      // 클라이언트 사이드 상태 초기화
      socialLoginCompleted.current = false; // 소셜 로그인 플래그 초기화
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    startSocialLogin,
    setSocialLoginData,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;


