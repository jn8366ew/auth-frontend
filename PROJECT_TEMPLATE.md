# Auth Frontend Project Template

## Project Overview

**Auth Frontend** is a React TypeScript application that provides authentication functionality integrated with a Django backend API. The application supports both traditional email/password login and social authentication (Kakao, Naver).

### Tech Stack
- **Frontend Framework**: React 19.1.1 with TypeScript 4.9.5
- **Routing**: React Router DOM 7.9.1
- **State Management**: React Context API
- **Styling**: CSS with custom globals
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Testing**: Jest + React Testing Library

## Implemented Features

### Authentication System
- ✅ Email/password login
- ✅ Kakao/Naver social login
- ✅ JWT token-based authentication
- ✅ Automatic token refresh
- ✅ User session management

### Core Components
- **LoginForm** (`src/components/accounts/LoginForm.tsx`): Login form with validation
- **AuthContext** (`src/context/AuthContext.tsx`): Authentication state management
- **AuthService** (`src/services/authService.ts`): API communication layer

## Project Structure

```
src/
├── components/
│   ├── accounts/
│   │   ├── LoginForm.tsx          # Email/password login form
│   │   ├── SocialLoginButton.tsx  # Social login buttons
│   │   └── index.ts               # Components export
│   └── common/
│       └── index.ts               # Common components export
├── context/
│   ├── AuthContext.tsx            # Authentication state management
│   └── index.ts                   # Context exports
├── hooks/
│   └── index.ts                   # Custom hooks (placeholder)
├── pages/
│   ├── LoginPage.tsx              # Main login page
│   ├── LoginSuccessPage.tsx       # Post-login success page
│   ├── KakaoCallbackPage.tsx      # OAuth callback handler
│   └── index.ts                   # Pages export
├── services/
│   ├── authService.ts             # Authentication API service
│   └── index.ts                   # Services export
├── styles/
│   └── globals.css                # Global CSS styles
├── types/
│   ├── accounts.ts                # Authentication type definitions
│   ├── api.ts                     # API response types
│   └── index.ts                   # Types export
├── utils/
│   ├── constants.ts               # Application constants
│   ├── validation.ts              # Form validation utilities
│   └── index.ts                   # Utils export
└── App.tsx                        # Main application component
```

## API Documentation

### Environment Variables
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_KAKAO_CLIENT_ID=your_kakao_client_id
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id
```

### API Endpoints

#### 1. POST `/api/auth/login/`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
**Error (400):**
```json
{
  "message": "Invalid credentials",
  "details": {
    "email": ["This field is required."],
    "password": ["This field is required."]
  }
}
```

#### 2. POST `/api/auth/register/`
**Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123",
  "password_confirm": "password123"
}
```
**Response (201):**
```json
{
  "id": 123,
  "username": "newuser",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### 3. GET `/api/auth/profile/`
**Headers:** `Authorization: Bearer <access_token>`
**Response (200):**
```json
{
  "id": 123,
  "username": "user",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### 4. POST `/api/auth/logout/`
**Headers:** `Authorization: Bearer <access_token>`
**Request:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

#### 5. POST `/api/auth/token/refresh/`
**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Django User Model Requirements
```python
# Django User model fields
class User(AbstractUser):
    id: int
    username: str
    email: str  # Used for login
    first_name: str
    last_name: str
    is_verified: bool
    created_at: datetime
```

## Authentication Flow

### Traditional Login
1. User enters email/password
2. Frontend calls `POST /api/auth/login/`
3. Backend returns access/refresh tokens
4. Frontend stores tokens and calls `GET /api/auth/profile/`
5. User data stored in context and localStorage

### Social Login (Kakao/Naver)
1. User clicks social login button
2. Frontend redirects to OAuth provider
3. OAuth provider redirects to callback URL with tokens
4. Frontend extracts tokens from URL parameters
5. User data stored in context and localStorage

### Token Refresh
1. Access token expires during API call
2. Frontend automatically calls `POST /api/auth/token/refresh/`
3. New tokens stored and original request retried

## Development Setup

```bash
# Install dependencies
npm install

# Set environment variables in .env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_KAKAO_CLIENT_ID=your_client_id
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback

# Start development server
npm start
```

## Routes
- `/` → Login page
- `/login` → Login page
- `/login/success` → Success page
- `/auth/kakao/callback` → OAuth callback handler
