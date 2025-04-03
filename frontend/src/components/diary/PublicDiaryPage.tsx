import React, { useState, useEffect } from 'react';
import './PublicDiaryPage.css';
import { fetchPublicDiaries, fetchDeleteDiary } from '../../api/diary';
import CreateDiaryModal from './CreateDiaryModal';
import { Diary } from '../../types/diary';
import { AxiosError } from 'axios';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaBook, FaUser, FaGlobe, FaCalendarAlt } from 'react-icons/fa';

const PublicDiaryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const navigate = useNavigate();

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

  const handleCardClick = (diary: Diary) => {
    navigate(`/diary-list/${diary.id}`, { state: { diary } });
  };

  const handleDeleteDiary = async (diaryId: number) => {
    if (window.confirm('정말로 이 일기장을 삭제하시겠습니까?')) {
      try {
        await fetchDeleteDiary(diaryId, accessToken);
        setDiaries(diaries.filter((diary) => diary.id !== diaryId)); // 삭제된 일기장 제거
      } catch (error) {
        const errorType = error as AxiosError<ErrorResponse>;
        setError(errorType.message);
      }
    }
  };

  return (
    <div className="public-diary-page">
      <header className="page-header">
        <h1 className="page-title">공개 일기장</h1>
        <p className="page-subtitle">다른 사용자들의 야구 일기를 둘러보세요</p>
      </header>

      <button className="create-diary-button" onClick={openModal}>
        <FaPlus /> 일기장 만들기
      </button>

      {isModalOpen && <CreateDiaryModal closeModal={closeModal} accessToken={accessToken} />}

      {loading && <div className="loading-container"><div className="loading-spinner"></div><p>로딩 중...</p></div>}
      {error && <div className="error-container"><p>{error}</p></div>}
      {!loading && !error && diaries.length === 0 && (
        <div className="empty-state">
          <FaBook className="empty-icon" />
          <p>아직 일기장이 없습니다.</p>
          <p>첫 번째 일기장을 만들어보세요!</p>
        </div>
      )}

      <div className="diary-list">
        {diaries.map((diary) => (
          <div key={diary.id} className="diary-card" onClick={() => handleCardClick(diary)}>
            <div className="diary-card-header">
              <h2>{diary.title}</h2>
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 이벤트와 구분
                  handleDeleteDiary(diary.id);
                }}
                className="delete-diary-icon"/>
            </div>
            <p className="diary-description">{diary.description}</p>
            <div className="diary-meta">
              <div className="meta-item">
                <FaUser className="meta-icon" />
                <span>{diary.creator}</span>
              </div>
              <div className="meta-item">
                <FaGlobe className="meta-icon" />
                <span>{diary.isPublic ? '공개' : '비공개'}</span>
              </div>
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>{new Date(diary.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicDiaryPage;
