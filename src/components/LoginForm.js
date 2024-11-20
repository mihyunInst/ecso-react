import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  //const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:80/api/login', formData);
      console.log('Login success:', response.data);
      // 로그인 성공 시 토큰 저장
      localStorage.setItem('token', response.data.token);
      // 대시보드로 이동
      //navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">로그인</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 bg-gray-700 border-2 border-gray-600 rounded-lg p-3 focus-within:border-blue-500 transition-colors">
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
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