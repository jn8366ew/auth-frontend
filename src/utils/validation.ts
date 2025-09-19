// 폼 검증 유틸리티 함수들
import { VALIDATION_RULES } from './constants';

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return '이메일을 입력해주세요.';
  }
  
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식이 아닙니다.';
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return '비밀번호를 입력해주세요.';
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return `비밀번호는 최소 ${VALIDATION_RULES.PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`;
  }
  
  return null;
};

export const validatePasswordConfirm = (
  password: string, 
  passwordConfirm: string
): string | null => {
  if (!passwordConfirm) {
    return '비밀번호 확인을 입력해주세요.';
  }
  
  if (password !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }
  
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) {
    return '사용자명을 입력해주세요.';
  }
  
  if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
    return `사용자명은 최대 ${VALIDATION_RULES.USERNAME_MAX_LENGTH}자까지 가능합니다.`;
  }
  
  // Django 사용자명 규칙: 문자, 숫자, @/./+/-/_ 만 허용
  const usernameRegex = /^[\w.@+-]+$/;
  if (!usernameRegex.test(username)) {
    return '사용자명은 문자, 숫자, @/./+/-/_ 만 사용 가능합니다.';
  }
  
  return null;
};

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name) {
    return `${fieldName}을 입력해주세요.`;
  }
  
  if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return `${fieldName}은 최대 ${VALIDATION_RULES.NAME_MAX_LENGTH}자까지 가능합니다.`;
  }
  
  return null;
};

// 전체 폼 검증 함수들
export const validateLoginForm = (data: { email: string; password: string }) => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (data: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}) => {
  const errors: Record<string, string> = {};
  
  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const firstNameError = validateName(data.first_name, '이름');
  if (firstNameError) errors.first_name = firstNameError;
  
  const lastNameError = validateName(data.last_name, '성');
  if (lastNameError) errors.last_name = lastNameError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const passwordConfirmError = validatePasswordConfirm(data.password, data.password_confirm);
  if (passwordConfirmError) errors.password_confirm = passwordConfirmError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
