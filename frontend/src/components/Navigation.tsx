import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // 메뉴가 열려있을 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="main-navigation" role="navigation" aria-label="메인 네비게이션">
      <div className="nav-container">
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          <div className="menu-icon"></div>
          <div className="menu-icon"></div>
          <div className="menu-icon"></div>
        </button>

        <div id="nav-menu" className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                홈
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/diary" className={`nav-link ${location.pathname.includes('/diary') ? 'active' : ''}`}>
                일기장
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/mypage" className={`nav-link ${location.pathname === '/mypage' ? 'active' : ''}`}>
                    마이페이지
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/log" className={`nav-link ${location.pathname === '/log' ? 'active' : ''}`}>
                    기록
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/team-status" className={`nav-link ${location.pathname === '/team-status' ? 'active' : ''}`}>
                    팀 현황
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
                    채팅방
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="auth-section">
            {isLoggedIn ? (
              <button
                className="auth-button logout"
                onClick={onLogout}
                aria-label="로그아웃"
              >
                로그아웃
              </button>
            ) : (
              <Link to="/login" className="auth-button login">
                로그인/회원가입
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;