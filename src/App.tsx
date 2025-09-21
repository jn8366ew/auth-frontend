import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage, LoginSuccessPage, ApiDocsPage } from './pages';
import KakaoCallbackPage from './pages/KakaoCallbackPage';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/success" element={<LoginSuccessPage />} />
            <Route path="/docs" element={<ApiDocsPage />} />
            <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
