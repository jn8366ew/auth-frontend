import React, { useEffect } from 'react';

const ApiDocsPage: React.FC = () => {
  useEffect(() => {
    // 정적 HTML 페이지로 리다이렉트
    window.location.href = '/docs.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">API 문서로 이동 중...</p>
        <p className="text-sm text-gray-500 mt-2">
          자동으로 이동되지 않으면 <a href="/docs.html" className="text-blue-600 underline">여기를 클릭</a>하세요.
        </p>
      </div>
    </div>
  );
};

export default ApiDocsPage;
