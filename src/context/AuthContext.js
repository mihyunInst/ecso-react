import React, { createContext, useContext, useState, useEffect } from 'react';
import ecsoApi from '../api/ecsoApi';


const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
 };
 

 export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 새로고침시 기본 사용자 정보 얻어오기
  useEffect(() => {
    const saved = sessionStorage.getItem("ecso-ui");
    if(saved != null) {
      setUser(JSON.parse(saved));
    }
  }, []);
 
  const login = (userData) => {
    sessionStorage.setItem("ecso-ui", JSON.stringify(userData));
    setUser(userData);
  };
 
  const logout = async() => {
    try {
      await ecsoApi.post('/auth/logout');
      sessionStorage.clear();
      setUser(null);
      window.location.href = '/';

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
 
  return (
    <AuthContext.Provider value={{ 
      loading, 
      user, 
      login, 
      logout }}>
      {children}
    </AuthContext.Provider>
  );
};
