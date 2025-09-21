# 🔐 Auth Frontend

Django Auth API와 연동되는 React TypeScript 인증 시스템

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
# .env 파일 생성 후 아래 내용 추가:
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_KAKAO_CLIENT_ID=your_kakao_client_id
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback

# 개발 서버 실행
npm start
```

## 주요 기능

- ✅ 이메일/비밀번호 로그인
- ✅ 카카오/네이버 소셜 로그인
- ✅ JWT 토큰 기반 인증
- ✅ 자동 토큰 갱신
- ✅ 사용자 세션 관리

## 기술 스택

- React 19.1.1 + TypeScript 4.9.5
- React Router DOM 7.9.1
- React Context API (상태 관리)

## 백엔드 API

Django 백엔드가 다음 엔드포인트를 제공해야 합니다:

- `POST /api/auth/login/` - 로그인
- `POST /api/auth/register/` - 회원가입
- `GET /api/auth/profile/` - 프로필 조회
- `POST /api/auth/logout/` - 로그아웃
- `POST /api/auth/token/refresh/` - 토큰 갱신