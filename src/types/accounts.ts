// Django User 모델과 매칭되는 타입 정의

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
