import { useState } from 'react';
import SmallLogo from './SmallLogo';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigator = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // 카테고리
  const { user, logout } = useAuth();


  return (
    <header className="bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <SmallLogo />
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => navigate(`/category/${category}`)}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
              >
                {category}
              </button>
            ))}
          </nav>

          {/* 마이페이지 */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/myPage')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white font-bold"
            >
              <span>{user?.rankTitle}</span>
              <span>{user?.userName}</span>
            </button>
          </div>
          <button className='font-bold' onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  )
}

export default Navigator;