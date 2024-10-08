import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import MyPage from './components/MyPage';
import PublicDiaryPage from './components/diary/PublicDiaryPage';
import DiaryCreationPage from './components/diaryEntry/DiaryCreationPage';
import DiaryListPage from './components/diaryEntry/DiaryListPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/diary" element={<PublicDiaryPage />} />
        <Route path="/diary-entry-create" element={<DiaryCreationPage />} />
        <Route path="/diary-list/:diaryId" element={<DiaryListPage />} />
        <Route path="/diaries/:diaryId/new-entry" Component={DiaryCreationPage} />
      </Routes>
    </Router>
  );
}

export default App;
