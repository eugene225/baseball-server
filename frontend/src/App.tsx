import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import MyPage from './components/MyPage';
import PublicDiaryPage from './components/diary/PublicDiaryPage';
import DiaryCreationPage from './components/diaryEntry/DiaryCreationPage';
import DiaryListPage from './components/diaryEntry/DiaryListPage';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import TeamRankPage from './components/teamRank/TeamRankPage';

const App: React.FC = () => {
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
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
