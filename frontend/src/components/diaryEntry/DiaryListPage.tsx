import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDiaryEntries } from '../../api/diary';
import { DiaryEntry as DiaryEntryType } from '../../types/diary';
import DiaryEntryCard from './\bDiaryEntryCard';

const DiaryListPage: React.FC = () => {
  const { diaryId } = useParams<{ diaryId: string }>();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    return <div>Loading...</div>;
  }

  if (!diaryEntries.length) {
    return <div>일기장을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="diary-list-page">
      <h1>일기 목록</h1>
      {diaryEntries.map((diary) => (
        <DiaryEntryCard key={diary.id} diaryEntry={diary} />
      ))}
    </div>
  );
};

export default DiaryListPage;
