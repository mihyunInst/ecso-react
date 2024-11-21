// src/contexts/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 초기 상태는 세션스토리지 확인
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('accessToken') ? true : false;
  });

  // 로그인 함수
  const login = (userData, tokens) => {
    setUser(userData);
    setIsAuthenticated(true);

    
    // localStorage: 브라우저를 닫아도 유지
    // sessionStorage: 브라우저를 닫으면 삭제
    sessionStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.clear();
  };

  // 사용자 정보 업데이트 함수
  const updateUser = (newUserData) => {
    setUser(newUserData);
    sessionStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};