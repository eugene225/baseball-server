// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Main Page</Link></li>
        <li><Link to="/diary">야구 일기</Link></li>
        <li><Link to="/log">직관 Log</Link></li>
        <li><Link to="/teams">실시간 팀 현황</Link></li>
        <li><Link to="/chat">채팅방</Link></li>
      </ul>
      <div className="auth-buttons">
        <Link to="/login" className="auth-button">로그인</Link>
        <Link to="/signup" className="auth-button">회원가입</Link>
      </div>
    </nav>
  );
}

export default Navbar;
