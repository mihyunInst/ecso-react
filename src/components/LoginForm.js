import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import logo from '../logo.svg';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userEmail: '',
    userPw: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/auth/login', formData);
      console.log(response.data);
      const result = response.data;
      // Context에 사용자 정보 저장
      login(result.user, result.token);

    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert("이메일 또는 패스워드 일치하지 않습니다");
    }

  };


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900">
      <div className="flex justify-center">
        <img src={logo} alt="ECSO Logo" className="w-64 h-32" />
      </div>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">로그인</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 bg-gray-700 border-2 border-gray-600 rounded-lg p-3 focus-within:border-blue-500 transition-colors">
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="userEmail"
                placeholder="이메일"
                value={formData.userEmail}
                onChange={handleChange}
                autoComplete='off'
                required
                className="flex-1 outline-none text-sm bg-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 bg-gray-700 border-2 border-gray-600 rounded-lg p-3 focus-within:border-blue-500 transition-colors">
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="userPw"
                placeholder="비밀번호"
                value={formData.userPw}
                onChange={handleChange}
                autoComplete='off'
                required
                className="flex-1 outline-none text-sm bg-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            로그인
          </button>

          <div className="flex justify-between pt-4 text-sm">
            <a
              href="/find-account"
              className="text-gray-400 hover:text-white transition-colors"
            >
              계정 찾기
            </a>
            <a href="/sign-up" className="text-gray-400 hover:text-white transition-colors">
              회원가입
            </a>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="text-center text-gray-400 text-sm">
            처음 방문하시나요?
            <a href="/sign-up" className="text-blue-400 hover:text-blue-300 ml-2">
              새 계정 만들기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;