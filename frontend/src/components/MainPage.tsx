import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import { useAuth } from '../contexts/AuthContext';

interface UserInfoProps {
  nickname: string;
  myTeam: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ nickname, myTeam }) => {
  return (
    <div className="user-info">
      <div className="user-profile">
        <div className="user-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className="user-details">
          <h3 className="user-name">{nickname}</h3>
          <p className="user-team">{myTeam}</p>
        </div>
      </div>
    </div>
  );
};

const MainPage: React.FC = () => {
  const { isLoggedIn, userInfo } = useAuth();

  return (
    <div className="main-page">
      <main className="main-content">
        <header className="main-header">
          <h1>야구 다이어리</h1>
          <p className="subtitle">당신의 야구 경험을 기록하고 공유하세요</p>
        </header>

        {isLoggedIn && userInfo && (
          <UserInfo nickname={userInfo.nickname} myTeam={userInfo.myTeam} />
        )}

        <div className="board-container" role="navigation" aria-label="메인 메뉴">
          <Link to="/mypage" className="board-item" tabIndex={0}>
            <div className="board-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h2>마이페이지</h2>
              <p>개인 정보 관리</p>
            </div>
          </Link>

          {!isLoggedIn && (
            <Link to="/login" className="board-item" tabIndex={0}>
              <div className="board-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <h2>로그인/회원가입</h2>
                <p>계정 생성 및 로그인</p>
              </div>
            </Link>
          )}

          <Link to="/diary" className="board-item" tabIndex={0}>
            <div className="board-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <h2>일기장</h2>
              <p>야구 경험 기록하기</p>
            </div>
          </Link>

          <Link to="/log" className={`board-item ${!isLoggedIn ? 'disabled' : ''}`} tabIndex={isLoggedIn ? 0 : -1} aria-disabled={!isLoggedIn}>
            <div className="board-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <h2>기록</h2>
              <p>경기 기록 관리</p>
            </div>
          </Link>

          <Link to="/team-status" className={`board-item ${!isLoggedIn ? 'disabled' : ''}`} tabIndex={isLoggedIn ? 0 : -1} aria-disabled={!isLoggedIn}>
            <div className="board-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h2>팀 현황</h2>
              <p>팀 정보 및 통계</p>
            </div>
          </Link>

          <Link to="/chat" className={`board-item ${!isLoggedIn ? 'disabled' : ''}`} tabIndex={isLoggedIn ? 0 : -1} aria-disabled={!isLoggedIn}>
            <div className="board-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h2>채팅방</h2>
              <p>실시간 소통</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
