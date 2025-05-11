import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserInfo } from '../api/user';
import {AuthContextType} from '../types/auth';
import { deleteFcmToken } from '../api/fcm';
import { getDeviceType, onForegroundMessage } from '../config/firebaseConfig';
import { useLoading } from '../hooks/useLoading';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ nickname: string; myTeam: string } | null>(null);
  const { isLoading, withLoading } = useLoading();

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.accessToken) {
        try {
          const userData = await withLoading(fetchUserInfo(user.userId, user.accessToken));
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
  }, [withLoading]);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {});

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (userId: string, accessToken: string) => {
    localStorage.setItem('user', JSON.stringify({ userId, accessToken }));
    try {
      const userData = await withLoading(fetchUserInfo(userId, accessToken));
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

  const logout = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.userId && user?.accessToken) {
      try {
        const deviceType = getDeviceType(navigator.userAgent);
        await withLoading(deleteFcmToken(user.userId, user.accessToken, deviceType));
      } catch (error) {
        console.error('Failed to delete FCM token:', error);
      }
    }
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout, isLoading }}>
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