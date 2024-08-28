// src/components/MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-page">
      <h1>⚾️ Let's BaseBall ⚾️</h1>
      <div className="auth-buttons">
        <Link to="/login" className="auth-button">로그인</Link>
        <Link to="/signup" className="auth-button">회원가입</Link>
      </div>
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
