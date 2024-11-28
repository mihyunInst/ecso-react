import React, { useEffect, useState } from 'react';
import Navigator from './Navigator';
import ecsoApi from '../api/ecsoApi';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [userInfo, setUserInfo] = useState(JSON.parse(sessionStorage.getItem("ecso-ui")));
  const [isEditing, setIsEditing] = useState(false);
  const [newPhone, setNewPhone] = useState(userInfo.phone);
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawalChecked, setWithdrawalChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ecsoApi.get("/user/info");
      console.log(response);
    }
    fetchData();

  },[]);

  const handlePhoneUpdate = () => {
    setUserInfo(prev => ({
      ...prev,
      phone: newPhone
    }));
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleWithdrawal = () => {
    if (withdrawalChecked) {
      alert('회원 탈퇴가 완료되었습니다.');
    }
  };

  const InfoTab = () => (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">내 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">이름</label>
          <div className="text-gray-100">{userInfo.userName}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">전화번호</label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePhoneUpdate}
                className="px-4 py-2 bg-blue-600 text-gray-100 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-100">{userInfo.userPhone}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
              >
                수정
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
          <div className="text-gray-100">{userInfo.userEmail}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">채택된 수</label>
          <div className="text-gray-100">{userInfo.adoptionCount}회</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">수강 학기</label>
          <div className="text-gray-100">{userInfo.classTerm}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">랭크</label>
          <div className="text-gray-100">{userInfo.rankTitle}</div>
        </div>
      </div>

      {showSuccess && (
        <div className="mt-4 bg-green-900 text-green-100 px-4 py-3 rounded-md">
          전화번호가 성공적으로 수정되었습니다.
        </div>
      )}
    </div>
  );

  const WithdrawTab = () => (
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-red-800">
      <h2 className="text-2xl font-bold mb-6 text-red-400">회원 탈퇴</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="withdrawal"
            checked={withdrawalChecked}
            onChange={(e) => setWithdrawalChecked(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
          />
          <label htmlFor="withdrawal" className="text-gray-300">
            회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없음에 동의합니다.
          </label>
        </div>
        <button
          onClick={handleWithdrawal}
          disabled={!withdrawalChecked}
          className={`px-4 py-2 rounded-md ${withdrawalChecked
              ? 'bg-red-600 text-gray-100 hover:bg-red-700'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-red-500`}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigator />

      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-4xl mx-auto p-6">
          {/* 탭 메뉴 */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'info'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
              onClick={() => setActiveTab('info')}
            >
              내 정보
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'withdraw'
                  ? 'text-red-400 border-b-2 border-red-400'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
              onClick={() => setActiveTab('withdraw')}
            >
              회원 탈퇴
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === 'info' && <InfoTab />}
          {activeTab === 'withdraw' && <WithdrawTab />}
        </div>
      </div>
    </div>
  );
};

export default MyPage;