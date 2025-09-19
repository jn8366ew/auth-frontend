# 🔐 Auth Frontend

> Django Auth API와 연동되는 React TypeScript 프론트엔드

## 📋 프로젝트 정보

- **기술 스택**: React 19.1.1, TypeScript 4.9.5
- **빌드 도구**: Create React App 5.0.1
- **백엔드**: Django Auth API (JWT 기반)

## 🏗️ 프로젝트 구조

```
auth-frontend/
├── 📁 public/                    # 정적 파일
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── 📁 src/
│   ├── 📁 components/           # UI 컴포넌트
│   │   ├── 📁 accounts/         # 인증 관련 컴포넌트
│   │   │   └── index.ts         ✅
│   │   ├── 📁 common/           # 공통 컴포넌트
│   │   │   └── index.ts         ✅
│   │   └── index.ts             ✅
│   │
│   ├── 📁 pages/                # 페이지 컴포넌트
│   │   └── index.ts             ✅
│   │
│   ├── 📁 services/             # API 서비스
│   │   └── index.ts             ✅
│   │
│   ├── 📁 types/                # TypeScript 타입
│   │   ├── accounts.ts          ✅ Django User 모델 매칭
│   │   ├── api.ts               ✅ API 응답 타입
│   │   └── index.ts             ✅
│   │
│   ├── 📁 hooks/                # 커스텀 훅
│   │   └── index.ts             ✅
│   │
│   ├── 📁 context/              # React Context
│   │   └── index.ts             ✅
│   │
│   ├── 📁 utils/                # 유틸리티
│   │   ├── constants.ts         ✅ API URL, 상수
│   │   ├── validation.ts        ✅ 폼 검증
│   │   └── index.ts             ✅
│   │
│   ├── 📁 styles/               # 스타일
│   │   └── globals.css          ✅ CSS 변수, 글로벌 스타일
│   │
│   ├── App.tsx                  # 메인 컴포넌트
│   ├── index.tsx                # 앱 진입점
│   └── ...                      # CRA 기본 파일들
│
├── .env                         # 환경변수 ⚠️ 수동 생성 필요
├── package.json                 # 의존성 관리
└── README.md                    # 이 파일
```

## 🔗 백엔드 API 연동

### Django 엔드포인트
- `POST /api/auth/register/` - 회원가입
- `POST /api/auth/login/` - 로그인
- `POST /api/auth/token/refresh/` - 토큰 갱신
- `GET /api/auth/profile/` - 프로필 조회
- `GET /api/auth/health/` - 상태 확인

### 타입 정의 (Django 모델 매칭)
```typescript
// types/accounts.ts
interface User {
  id: number;
  username: string;
  email: string;           // 로그인 필드
  first_name: string;
  last_name: string;
  is_verified: boolean;
  created_at: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}
```

## ⚙️ 개발 환경

### 필수 환경변수 (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_NAME=Auth Frontend
REACT_APP_VERSION=0.1.0
```

### 개발 명령어
```bash
npm start       # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm test        # 테스트 실행
```

### 패키지 의존성
```json
{
  "react": "^19.1.1",
  "typescript": "^4.9.5",
  "@types/react": "^19.1.13"
}
```

## 📝 코딩 규칙

### 컴포넌트 패턴
```tsx
interface ComponentProps {
  prop: string;
  optional?: boolean;
}

export const Component: React.FC<ComponentProps> = ({ prop, optional = false }) => {
  return <div>{prop}</div>;
};

export default Component;
```

### Import/Export 규칙
```tsx
// 각 폴더의 index.ts에서 export
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';

// 사용할 때
import { LoginForm, RegisterForm } from '../components/accounts';
```

---

**개발환경**: Windows 10, Node.js v22.17.0, npm v10.9.2