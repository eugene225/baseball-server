import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import { fetchUserInfo } from '../api/user'; // 분리한 API 호출 함수 가져오기

// 사용자 정보를 표시하는 컴포넌트
const UserInfo = ({ userInfo }) => (
  <div className="user-info">
    <p>닉네임: {userInfo.nickname}</p>
    <p>마이팀: {userInfo.myTeam}</p>
  </div>
);

// 인증 버튼 컴포넌트
const AuthButtons = () => (
  <div className="auth-buttons">
    <Link to="/login" className="auth-button">로그인</Link>
    <Link to="/signup" className="auth-button">회원가입</Link>
  </div>
);

// MainPage 컴포넌트
function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ nickname: '', myTeam: '' });

  useEffect(() => {
    const fetchAndSetUserInfo = async () => {
      const user = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 유저 정보 가져오기
      if (user) {
        try {
          const data = await fetchUserInfo(user.userId, user.accessToken);
          setUserInfo({ nickname: data.nickname, myTeam: data.myTeam });
          setIsLoggedIn(true);
        } catch (error) {
          // 오류 처리: 로컬 스토리지 초기화 및 로그아웃 처리
          localStorage.removeItem('user');
          setIsLoggedIn(false);
        }
      }
    };

    fetchAndSetUserInfo();
  }, []); // 빈 배열로 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <div className="main-page">
      <h1>⚾️ Let's BaseBall ⚾️</h1>
      
      {isLoggedIn ? <UserInfo userInfo={userInfo} /> : <AuthButtons />}

      <div className="board-container">
        <Link to="/diary" className="board-item">
          <div className="board-content">
            <span className="emoji">📓</span>
            <h2>야구 일기</h2>
            <p>나만의 야구 일기를 기록하세요.</p>
          </div>
        </Link>
        <Link to="/log" className="board-item">
          <div className="board-content">
            <span className="emoji">📅</span>
            <h2>직관 Log</h2>
            <p>직관한 경기의 정보를 기록합니다.</p>
          </div>
        </Link>
        <Link to="/teams" className="board-item">
          <div className="board-content">
            <span className="emoji">🏆</span>
            <h2>실시간 팀 현황</h2>
            <p>팀의 현재 상태를 확인하세요.</p>
          </div>
        </Link>
        <Link to="/chat" className="board-item">
          <div className="board-content">
            <span className="emoji">💬</span>
            <h2>채팅방</h2>
            <p>다른 팬들과 소통하세요.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
