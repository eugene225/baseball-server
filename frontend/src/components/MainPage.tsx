import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainPage.css';
import { fetchUserInfo } from '../api/user';
import { FaUser, FaSignOutAlt, FaBook, FaCalendarAlt, FaTrophy, FaComments } from 'react-icons/fa';

// 사용자 정보를 표시하는 컴포넌트의 Props 타입 정의
interface UserInfoProps {
  userInfo: {
    nickname: string;
    myTeam: string;
  };
  onLogout: () => void;
}

// 사용자 정보를 표시하는 컴포넌트
const UserInfo: React.FC<UserInfoProps> = ({ userInfo, onLogout }) => {
  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent the default link behavior
    onLogout(); // Call the logout function
  };

  return (
    <div className="user-info">
      <div className="user-profile">
        <FaUser className="user-icon" />
        <div className="user-details">
          <p className="user-name">{userInfo.nickname}</p>
          <p className="user-team">{userInfo.myTeam}</p>
        </div>
      </div>
      <a href="#" className="logout-link" onClick={handleLogout}>
        <FaSignOutAlt /> 로그아웃
      </a>
    </div>
  );
};

// MainPage 컴포넌트의 상태 타입 정의
interface User {
  nickname: string;
  myTeam: string;
}

function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>({ nickname: '', myTeam: '' });
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchAndSetUserInfo = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.userId && user.accessToken) {
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>야구 다이어리</h1>
        <p className="subtitle">당신의 야구 경험을 기록하고 공유하세요</p>
      </header>

      {isLoggedIn ? <UserInfo userInfo={userInfo} onLogout={handleLogout} /> : null}

      <div className="board-container">
        {isLoggedIn ? (
          <Link to="/mypage" className="board-item">
            <div className="board-content">
              <FaUser className="feature-icon" />
              <h2>마이페이지</h2>
              <p>내 정보를 확인하고 수정하세요.</p>
            </div>
          </Link>
        ) : (
          <Link to="/login" className='board-item'>
            <div className="board-content">
              <FaUser className="feature-icon" />
              <h2>로그인 / 회원가입</h2>
              <p>로그인을 해야 합니다.</p>
            </div>
          </Link>
        )}
        <Link to="/diary" className="board-item">
          <div className="board-content">
            <FaBook className="feature-icon" />
            <h2>야구 일기</h2>
            <p>나만의 야구 일기를 기록하세요.</p>
          </div>
        </Link>
        <div className={`board-item ${!isLoggedIn ? 'disabled' : ''}`}>
          <div className="board-content" onClick={isLoggedIn ? () => navigate('/log') : undefined}>
            <FaCalendarAlt className="feature-icon" />
            <h2>직관 Log</h2>
            <p>직관한 경기의 정보를 기록합니다.</p>
          </div>
        </div>
        <div className={`board-item ${!isLoggedIn ? 'disabled' : ''}`}>
          <div className="board-content" onClick={isLoggedIn ? () => navigate('/teams') : undefined}>
            <FaTrophy className="feature-icon" />
            <h2>실시간 팀 현황</h2>
            <p>팀의 현재 상태를 확인하세요.</p>
          </div>
        </div>
        <div className={`board-item ${!isLoggedIn ? 'disabled' : ''}`}>
          <div className="board-content" onClick={isLoggedIn ? () => navigate('/chat') : undefined}>
            <FaComments className="feature-icon" />
            <h2>채팅방</h2>
            <p>다른 팬들과 소통하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
