import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DiaryEntryCard from './\bDiaryEntryCard';
import { DiaryEntry as DiaryEntryType } from '../../types/diary';
import { fetchDiaryEntries } from '../../api/diary';
import './DiaryListPage.css';

const DiaryListPage: React.FC = () => {
  const { diaryId } = useParams<{ diaryId: string }>();
  const location = useLocation();
  const [diaryEntries, setDiaryEntries] = React.useState<DiaryEntryType[]>([]);
  const [loading, setLoading] = React.useState(true);

  const diary = location.state?.diary; // 전달된 일기장 정보

  React.useEffect(() => {
    const loadDiaryEntries = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const entries = await fetchDiaryEntries(Number(diaryId), user.accessToken);
        setDiaryEntries(entries);
      } catch (error) {
        console.error('Failed to fetch diary entries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDiaryEntries();
  }, [diaryId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="diary-list-page">
      <header className="page-header">
        {diary && (
          <>
            <h1 className="diary-title">{diary.title}</h1>
            <p className="diary-meta"><strong>작성자:</strong> {diary.creator}</p>
            <p className="diary-meta"><strong>공개 여부:</strong> {diary.isPublic ? '공개' : '비공개'}</p>
          </>
        )}
        <button className="write-diary-button">일기 쓰기</button>
      </header>
      <div className="diary-entries-container">
        {diaryEntries.map((entry) => (
          <DiaryEntryCard key={entry.id} diaryEntry={entry} />
        ))}
      </div>
    </div>
  );
};

export default DiaryListPage;
