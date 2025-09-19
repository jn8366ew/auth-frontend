// 애플리케이션 상수들

// API 관련 상수
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_DATA: 'auth_user_data',
} as const;

// 앱 설정
export const APP_CONFIG = {
  NAME: 'Auth Frontend',
  VERSION: '0.1.0',
  DESCRIPTION: 'Django Auth API와 연동되는 리액트 인증 시스템',
} as const;

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
} as const;

// 폼 검증 규칙
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 4,
  USERNAME_MAX_LENGTH: 150,
  NAME_MAX_LENGTH: 30,
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
