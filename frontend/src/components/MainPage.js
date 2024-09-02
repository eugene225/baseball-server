import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainPage.css';
import { fetchUserInfo } from '../api/user';

// 사용자 정보를 표시하는 컴포넌트
const UserInfo = ({ userInfo, onLogout }) => {
  const handleLogout = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    onLogout(); // Call the logout function
  };

  return (
    <div className="user-info">
      <p>닉네임: {userInfo.nickname} / 마이팀: {userInfo.myTeam}</p>
      <a href="#" className="logout-link" onClick={handleLogout}>로그아웃</a>
    </div>
  );
};

// MainPage 컴포넌트
function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ nickname: '', myTeam: '' });
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchAndSetUserInfo = async () => {
      const user = JSON.parse(localStorage.getItem('user')); // Fetch user info from localStorage
      if (user) {
        try {
          const data = await fetchUserInfo(user.userId, user.accessToken);
          setUserInfo({ nickname: data.nickname, myTeam: data.myTeam });
          setIsLoggedIn(true);
        } catch (error) {
          // Error handling: clear localStorage and set logged out state
          localStorage.removeItem('user');
          setIsLoggedIn(false);
        }
      }
    };

    fetchAndSetUserInfo();
  }, []); // Empty array means this effect runs only once

  const handleMyPageClick = () => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if not logged in
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="main-page">
      <h1>⚾️ Let's BaseBall ⚾️</h1>

      {isLoggedIn ? <UserInfo userInfo={userInfo} onLogout={handleLogout} /> : null}

      <div className="board-container">
        {isLoggedIn ? (
          <Link to="/mypage" className="board-item">
            <div className="board-content">
              <h2>마이페이지</h2>
              <p>내 정보를 확인하고 수정하세요.</p>
            </div>
          </Link>
        ) : (
          <div className="board-item" onClick={handleMyPageClick}>
            <div className="board-content">
              <h2>로그인 / 회원가입</h2>
              <p>로그인을 해야 합니다.</p>
            </div>
          </div>
        )}
        <Link to="/diary" className="board-item">
          <div className="board-content">
            <span className="emoji">📓</span>
            <h2>야구 일기</h2>
            <p>나만의 야구 일기를 기록하세요.</p>
          </div>
        </Link>
        <div className={`board-item ${!isLoggedIn ? 'disabled' : ''}`}>
          <div className="board-content" onClick={isLoggedIn ? () => navigate('/log') : undefined}>
            <span className="emoji">📅</span>
            <h2>직관 Log</h2>
            <p>직관한 경기의 정보를 기록합니다.</p>
          </div>
        </div>
        <div className={`board-item ${!isLoggedIn ? 'disabled' : ''}`}>
          <div className="board-content" onClick={isLoggedIn ? () => navigate('/teams') : undefined}>
            <span className="emoji">🏆</span>
            <h2>실시간 팀 현황</h2>
            <p>팀의 현재 상태를 확인하세요.</p>
          </div>
        </div>
        <div className={`board-item ${!isLoggedIn ? 'disabled' : ''}`}>
          <div className="board-content" onClick={isLoggedIn ? () => navigate('/chat') : undefined}>
            <span className="emoji">💬</span>
            <h2>채팅방</h2>
            <p>다른 팬들과 소통하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
