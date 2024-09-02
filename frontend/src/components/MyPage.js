import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import { fetchUserInfo, updateUserInfo } from '../api/user'; // Import necessary API functions

// MyPage 컴포넌트
function MyPage() {
  const [userInfo, setUserInfo] = useState({ nickname: '', myTeam: '' });
  const [newNickname, setNewNickname] = useState('');
  const [newMyTeam, setNewMyTeam] = useState('');
  const navigate = useNavigate(); // For programmatic navigation

  const teams = [
    "LG_TWINS",
    "SAMSUNG_LIONS",
    "KIWOOM_HEROS",
    "HANHWA_EAGLES",
    "KT_WIZ",
    "DOOSAN_BEARS",
    "NC_DINOS",
    "SSG_LANDERS",
    "KIA_TIGERS",
  ];

  useEffect(() => {
    const fetchAndSetUserInfo = async () => {
      const user = JSON.parse(localStorage.getItem('user')); // Fetch user info from localStorage
      if (user) {
        try {
          const data = await fetchUserInfo(user.userId, user.accessToken);
          setUserInfo({ nickname: data.nickname, myTeam: data.myTeam });
          setNewNickname(data.nickname);
          setNewMyTeam(data.myTeam);
        } catch (error) {
          // Handle errors (e.g., redirect to login)
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    fetchAndSetUserInfo();
  }, [navigate]);

  const handleSaveChanges = async () => {
    const user = JSON.parse(localStorage.getItem('user')); // Fetch user info from localStorage
    if (user) {
      try {
        await updateUserInfo(user.userId, user.accessToken, { nickname: newNickname, myTeam: newMyTeam });
        setUserInfo({ nickname: newNickname, myTeam: newMyTeam });
      } catch (error) {
        // Handle update error
        console.error('Error updating user info:', error);
      }
    }
  };

  const handleDiaryBlockClick = () => {
    navigate('/private-diaries'); // Redirect to the private diaries page
  };

  return (
    <div className="my-page">
      <h1>마이페이지</h1>
      <div className="user-info-form">
        <label>
          <span>닉네임:</span>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </label>
        <label>
          <span>마이팀:</span>
          <select
            value={newMyTeam}
            onChange={(e) => setNewMyTeam(e.target.value)}
          >
            <option value="">팀을 선택하세요</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSaveChanges}>변경사항 저장</button>
      </div>
      <div className="private-diaries-block" onClick={handleDiaryBlockClick}>
        <div className="block-content">
          <h2>
            <span role="img" aria-label="lock">🔒</span> 비공개 일기장 목록
          </h2>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
