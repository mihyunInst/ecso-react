// components/MainForm.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Navigator from './Navigator';

export default function MainForm() {
  const [latestPosts, setLatestPosts] = useState([]); // 최신글
  const [topPosts, setTopPosts] = useState([]); // 조회수top5
  const [topUsers, setTopUsers] = useState([]); // 랭크높은유저top10
  const [searchTerm, setSearchTerm] = useState(''); // 검색
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {

        //const response = await ecsoApi.get("/post/postType");
        //setCategories();
        //setLatestPosts(latestResponse.data);
        //setTopPosts(topResponse.data);
        //setTopUsers(usersResponse.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, []);

  // const categories = [
  //   'JAVA', 'DB', 'HTML/CSS', 'JAVASCRIPT', 'JDBC', 'SPRING', 'OTHER'
  // ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* 헤더 */}
      <Navigator />
      
      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색창 */}
        <div className="mb-8">
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              검색
            </button>
          </form>
        </div>

        {/* 게시글 & 유저 랭킹 그리드 */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 최신 글 */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-white">최신 등록 글</h2>
            <ul className="space-y-3">
              {latestPosts.map((post) => (
                <li
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                >
                  <h3 className="font-medium text-gray-200">{post.title}</h3>
                  <div className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 인기 글 */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-white">인기 글 TOP 5</h2>
            <ul className="space-y-3">
              {topPosts.map((post) => (
                <li
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                >
                  <h3 className="font-medium text-gray-200">{post.title}</h3>
                  <div className="text-sm text-gray-400">
                    조회수: {post.views}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 상위 랭킹 유저 */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-white">TOP 10 회원</h2>
            <ul className="space-y-3">
              {topUsers.map((user, index) => (
                <li key={user.id} className="flex items-center space-x-3 p-2">
                  <span className="text-gray-400">#{index + 1}</span>
                  <img
                    src={user.profileImage || '/default-avatar.png'}
                    alt="User"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-gray-200">{user.nickname}</span>
                  <span className="text-gray-400">점수: {user.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Your Website. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}