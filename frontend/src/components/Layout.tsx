import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './Layout.css';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;