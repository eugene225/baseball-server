import React, { useState, useEffect } from 'react';
import './PublicDiaryPage.css';
import { fetchPublicDiaries } from '../../api/diary';
import CreateDiaryModal from './CreateDiaryModal';
import { Diary } from '../../types/diary';
import { AxiosError } from 'axios';
import { ErrorResponse, useNavigate } from 'react-router-dom';

const PublicDiaryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.accessToken || '';
      setAccessToken(token);

      const loadDiaries = async () => {
        try {
          const data = await fetchPublicDiaries(token);
          setDiaries(data || []);
        } catch (error) {
          const errorType = error as AxiosError<ErrorResponse>;
          setError(errorType.message);
        } finally {
          setLoading(false);
        }
      };

      loadDiaries();
    };

    fetchAccessToken();
  }, []);

  const handleCardClick = (diaryId: number) => {
    navigate(`/diary-list/${diaryId}`); // 클릭한 일기장의 ID를 기반으로 라우팅
  };

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
          <div key={diary.id} className="diary-card" onClick={() => handleCardClick(diary.id)}>
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
