import { LoginData, RegisterData, LoginResponse, User, SocialProvider, SocialLoginData, SocialLoginResponse } from '../types/accounts';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // API 요청 헬퍼 함수
  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAccessToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw error;
    }
  }

  // 로그인
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await this.apiRequest<LoginResponse>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // 토큰 저장
    this.setTokens(response.access, response.refresh);
    
    return response;
  }

  // 회원가입
  async register(data: RegisterData): Promise<User> {
    const response = await this.apiRequest<User>('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response;
  }

  // 소셜 로그인 시작 (리다이렉트)
  startSocialLogin(provider: SocialProvider): void {
    const loginUrl = this.getSocialLoginUrl(provider);
    window.location.href = loginUrl;
  }

  // 소셜 로그인 URL 생성
  getSocialLoginUrl(provider: SocialProvider): string {
    const redirectUri = provider === 'kakao'
      ? process.env.REACT_APP_KAKAO_REDIRECT_URI
      : `${this.baseURL}/auth/${provider}/callback/`;

    if (!redirectUri) {
      throw new Error(`${provider.toUpperCase()} redirect URI가 설정되지 않았습니다.`);
    }

    const configs = {
      kakao: {
        baseUrl: 'https://kauth.kakao.com/oauth/authorize',
        clientId: process.env.REACT_APP_KAKAO_CLIENT_ID,
      },
      naver: {
        baseUrl: 'https://nid.naver.com/oauth2.0/authorize',
        clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      },
    };

    const config = configs[provider];
    if (!config.clientId) {
      throw new Error(`${provider.toUpperCase()} 클라이언트 ID가 설정되지 않았습니다.`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      ...(provider === 'naver' && { state: Math.random().toString(36).substr(2, 11) }),
    });

    return `${config.baseUrl}?${params.toString()}`;
  }

  // 프로필 조회
  async getProfile(): Promise<User> {
    const response = await this.apiRequest<User>('/api/auth/profile/', {
      method: 'GET',
    });

    // 사용자 정보 저장
    this.setUserData(response);
    
    return response;
  }

  // 토큰 갱신
  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    const response = await this.apiRequest<LoginResponse>('/api/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // 새 토큰 저장
    this.setTokens(response.access, response.refresh);
    
    return response;
  }

  // 상태 확인
  async healthCheck(): Promise<{ status: string; message: string }> {
    return await this.apiRequest<{ status: string; message: string }>('/api/auth/health/', {
      method: 'GET',
    });
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      
      // 백엔드에 로그아웃 요청 (토큰 무효화)
      if (refreshToken) {
        await this.apiRequest('/api/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
      // API 호출이 실패해도 클라이언트 사이드 로그아웃은 진행
    } finally {
      // 항상 클라이언트 사이드 토큰 및 데이터 정리
      this.clearTokens();
      this.clearUserData();
    }
  }

  // 토큰 관리
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // 사용자 데이터 관리
  private setUserData(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  getUserData(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  private clearUserData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // 인증 상태 확인
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  // 토큰 만료 확인 (JWT 디코딩)
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('토큰 파싱 에러:', error);
      return true;
    }
  }
}

// 싱글톤 인스턴스 생성
export const authService = new AuthService();
export default authService;
