import React, { createContext, useContext, useState, useEffect } from 'react';
import ecsoApi, { getCookie } from '../api/ecsoApi';



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // user 상태만 관리 (토큰은 쿠키에서 관리되므로 제거)
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 컴포넌트 마운트 시 쿠키에서 사용자 정보 확인
  useEffect(() => {
    const userInfo = getCookie('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
      setIsAuthenticated(true);
    }
  }, []);

  // 로그인 함수 - 쿠키는 서버에서 설정하므로 단순화
  const login = (userInfo) => {
    if (userInfo) {
      setUser(JSON.parse(userInfo));
      setIsAuthenticated(true);
    }
  };

  // 로그아웃 함수 - 서버에 요청하여 쿠키 제거
  const logout = async () => {
    try {
      await ecsoApi.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 사용자 정보 업데이트
  const updateUser = async (newUserData) => {
    try {
      await ecsoApi.put('/api/user/profile', newUserData);
      // 서버가 새로운 userInfo 쿠키를 설정할 것임
      const updatedUserInfo = getCookie('userInfo');
      if (updatedUserInfo) {
        setUser(JSON.parse(updatedUserInfo));
      }
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  };

  // 인증 상태 확인 함수
  const checkAuth = async () => {
    try {
      const response = await ecsoApi.get('/auth/check');
      const userInfo = getCookie('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};