import React, { useEffect, useState } from 'react';
import styles from './SchedulePage.module.css';
import { GameSchedule } from '../../types/data';
import { getSchedule } from '../../api/data';

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<GameSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const today = new Date();
        const data = await getSchedule(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate()
        );
        setSchedules(data);
      } catch (err) {
        setError('경기 일정을 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>오늘의 경기</h1>
      <div className={styles.scheduleGrid}>
        {schedules.length === 0 ? (
          <div className={styles.noGames}>오늘 예정된 경기가 없습니다.</div>
        ) : (
          schedules.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.teamInfo}>
                <span className={styles.team}>{game.away_team}</span>
                <span className={styles.vs}>VS</span>
                <span className={styles.team}>{game.home_team}</span>
              </div>
              <div className={styles.gameInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Play Ball</span>
                  <span className={`${styles.infoValue} ${styles.time}`}>{game.time}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>경기장</span>
                  <span className={`${styles.infoValue} ${styles.stadium}`}>{game.stadium}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>중계</span>
                  <span className={`${styles.infoValue} ${styles.tv}`}>{game.tv}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SchedulePage;