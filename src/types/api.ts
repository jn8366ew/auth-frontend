// API 관련 타입 정의

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    PROFILE: '/api/auth/profile/',
    TOKEN_REFRESH: '/api/auth/token/refresh/',
    HEALTH: '/api/auth/health/',
  },
} as const;
