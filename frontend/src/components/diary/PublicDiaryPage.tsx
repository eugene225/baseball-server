import React, { useState, useEffect } from 'react';
import './PublicDiaryPage.css';
import { fetchPublicDiaries, fetchDeleteDiary } from '../../api/diary'; // 삭제 API 추가
import CreateDiaryModal from './CreateDiaryModal';
import { Diary } from '../../types/diary';
import { AxiosError } from 'axios';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Font Awesome의 휴지통 아이콘 가져오기

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
          <div key={diary.id} className="diary-card" onClick={() => handleCardClick(diary)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{diary.title}</h2>
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 이벤트와 구분
                  handleDeleteDiary(diary.id);
                }}
                className="delete-diary-icon"/>
            </div>
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
