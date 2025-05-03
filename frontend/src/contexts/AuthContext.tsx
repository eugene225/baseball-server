import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserInfo } from '../api/user';
import {AuthContextType} from '../types/auth';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ nickname: string; myTeam: string } | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.accessToken) {
        try {
          const userData = await fetchUserInfo(user.userId, user.accessToken);
          setIsLoggedIn(true);
          setUserInfo({
            nickname: userData.nickname,
            myTeam: userData.myTeam
          });
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          logout();
        }
      } else {
        logout();
      }
    };

    checkUserStatus();
  }, []);

  const login = async (userId: string, accessToken: string) => {
    localStorage.setItem('user', JSON.stringify({ userId, accessToken }));
    try {
      const userData = await fetchUserInfo(userId, accessToken);
      setIsLoggedIn(true);
      setUserInfo({
        nickname: userData.nickname,
        myTeam: userData.myTeam
      });
    } catch (error) {
      console.error('Failed to fetch user info after login:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};