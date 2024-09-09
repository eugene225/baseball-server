import React, { useState, useEffect } from 'react';
import './PublicDiaryPage.css';
import { fetchPublicDiaries } from '../../api/diary';
import CreateDiaryModal from './CreateDiaryModal';

// 일기 데이터의 타입 정의
interface Diary {
  id: string;
  title: string;
  description: string;
  creator: string;
  isPublic: boolean;
  createdAt: string;
}

const PublicDiaryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>(''); // accessToken 상태 추가

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.accessToken || '';
      setAccessToken(token);

      const loadDiaries = async () => {
        try {
          const data = await fetchPublicDiaries();
          setDiaries(data || []);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      loadDiaries();
    };

    fetchAccessToken();
  }, []);

  return (
    <div className="public-diary-page">
      <h1 className="page-title">공개 일기장</h1>
      <button className="create-diary-button" onClick={openModal}>
        일기장 만들기
      </button>

      {isModalOpen && <CreateDiaryModal closeModal={closeModal} accessToken={accessToken} />}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && diaries.length === 0 && <p>일기장이 없습니다.</p>}
      <div className="diary-list">
        {diaries.map((diary) => (
          <div key={diary.id} className="diary-card">
            <h2>{diary.title}</h2>
            <p>{diary.description}</p>
            <p><strong>작성자:</strong> {diary.creator}</p>
            <p><strong>공개 여부:</strong> {diary.isPublic ? '공개' : '비공개'}</p>
            <p><strong>작성일:</strong> {new Date(diary.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicDiaryPage;
