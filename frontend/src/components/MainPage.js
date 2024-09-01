import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import axios from 'axios'; // axios를 사용해 API 호출

function MainPage() {
  // 로그인 상태와 사용자 정보를 관리하는 state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ nickname: '', myTeam: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 유저 정보 가져오기
      if (user) {
        try {
          const response = await axios.get(`/api/v1/${user.userId}`, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // 토큰을 헤더에 포함
            },
          });
          setUserInfo({ nickname: response.data.nickname, myTeam: response.data.myTeam });
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          // 토큰 만료 등의 이유로 요청 실패 시, 로컬 스토리지 초기화 및 로그아웃 처리 가능
          localStorage.removeItem('user');
          setIsLoggedIn(false);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="main-page">
      <h1>⚾️ Let's BaseBall ⚾️</h1>
      
      {isLoggedIn ? (
        <div className="user-info">
          <p>닉네임: {userInfo.nickname}</p>
          <p>마이팀: {userInfo.myTeam}</p>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="auth-button">로그인</Link>
          <Link to="/signup" className="auth-button">회원가입</Link>
        </div>
      )}

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
