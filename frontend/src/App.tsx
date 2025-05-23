import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import SignUpPage from './features/auth/SignUpPage';
import PublicDiaryPage from './features/diary/PublicDiaryPage';
import DiaryCreationPage from './features/diaryEntry/DiaryCreationPage';
import DiaryListPage from './features/diaryEntry/DiaryListPage';
import Layout from './features/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import TeamRankPage from './features/teamRank/TeamRankPage';
import ChatListPage from './features/chat/ChatListPage';
import ChatRoomPage from './features/chat/ChatRoomPage';
import MainPage from './features/main/MainPage';
import MyPage from './features/myPage/MyPage';
import SchedulePage from './features/schedule/SchedulePage';

const App: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .catch((err) => {
          console.error('Firebase Service Worker 등록 실패: ', err);
        });
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/diary" element={<PublicDiaryPage />} />
            <Route path="/diary-entry-create" element={<DiaryCreationPage />} />
            <Route path="/diary-list/:diaryId" element={<DiaryListPage />} />
            <Route path="/diaries/:diaryId/new-entry" element={<DiaryCreationPage />} />
            <Route path="/team-rank" element={<TeamRankPage />} />
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/chat/:team" element={<ChatRoomPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
