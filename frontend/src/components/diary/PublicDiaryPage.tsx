import React, { useState, useEffect } from 'react';
import './PublicDiaryPage.css';
import { fetchPublicDiaries, fetchDiaryEntries } from '../../api/diary';
import CreateDiaryModal from './CreateDiaryModal';
import { Diary, DiaryEntry } from '../../types/diary';
import { AxiosError } from 'axios';

const PublicDiaryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState<boolean>(false);
  const [entriesError, setEntriesError] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchEntries = async (diaryId: number) => {
    setEntriesLoading(true);
    try {
      const data = await fetchDiaryEntries(diaryId, accessToken);
      setEntries(data);
      setSelectedDiary(diaries.find(diary => diary.id === diaryId) || null);
    } catch (error) {
      const errorType = error as AxiosError;
      setEntriesError(errorType.message);
    } finally {
      setEntriesLoading(false);
    }
  };

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
          const errorType = error as AxiosError;
          setError(errorType.message);
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
          <div key={diary.id} className="diary-card" onClick={() => fetchEntries(diary.id)}>
            <h2>{diary.title}</h2>
            <p>{diary.description}</p>
            <p><strong>작성자:</strong> {diary.creator}</p>
            <p><strong>공개 여부:</strong> {diary.isPublic ? '공개' : '비공개'}</p>
            <p><strong>작성일:</strong> {new Date(diary.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {selectedDiary && (
        <div className="entries-section">
          <h2>{selectedDiary.title} 일기 내용</h2>
          {entriesLoading && <p>Loading entries...</p>}
          {entriesError && <p>{entriesError}</p>}
          {!entriesLoading && !entriesError && entries.length === 0 && <p>일기가 없습니다.</p>}
          <div className="entries-list">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <h3>{entry.title}</h3>
                <p>{entry.content}</p>
                <p><strong>작성일:</strong> {new Date(entry.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicDiaryPage;
