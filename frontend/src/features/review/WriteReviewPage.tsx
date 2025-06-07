import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './WriteReviewPage.module.css';
import { getSchedule } from '../../api/data';
import { GameSchedule } from '../../types/data';

const WriteReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [review, setReview] = useState({
    content: '',
    rating: 5,
    matchInfo: '',
    stadium: ''
  });
  const [schedules, setSchedules] = useState<GameSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<GameSchedule | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async (date: Date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const schedules = await getSchedule(year, month, day);
      setSchedules(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedMatch(null);
    setReview({
      ...review,
      matchInfo: '',
      stadium: '',
      content: ''
    });

    if (date) {
      fetchSchedules(date);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log('Review submitted:', review);
    navigate('/');
  };

  const handleMatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const match = schedules.find(schedule => schedule.id.toString() === e.target.value);
    if (match) {
      setSelectedMatch(match);
      setReview({
        ...review,
        matchInfo: `${match.home_team} vs ${match.away_team}`,
        stadium: match.stadium
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          ←
        </button>
        <h1>경기 리뷰 작성</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>경기 날짜</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="날짜를 선택하세요"
            className={styles.datePicker}
            maxDate={new Date()}
            showPopperArrow={false}
          />
        </div>

        {loading && (
          <div className={styles.loading}>
            경기 일정을 불러오는 중...
          </div>
        )}

        {!loading && selectedDate && schedules.length > 0 && (
          <div className={styles.inputGroup}>
            <label>경기 선택</label>
            <select
              value={selectedMatch?.id.toString() || ''}
              onChange={handleMatchChange}
              required
              className={styles.select}
            >
              <option value="">경기를 선택하세요</option>
              {schedules.map(match => (
                <option key={match.id} value={match.id}>
                  {match.home_team} vs {match.away_team} ({match.stadium}, {match.time})
                </option>
              ))}
            </select>
          </div>
        )}

        {!loading && selectedDate && schedules.length === 0 && (
          <div className={styles.noGames}>
            선택한 날짜에 진행된 경기가 없습니다.
          </div>
        )}

        {selectedMatch && (
          <>
            <div className={styles.matchInfo}>
              <div className={styles.matchInfoItem}>
                <span className={styles.label}>경기 정보</span>
                <span className={styles.value}>{review.matchInfo}</span>
              </div>
              <div className={styles.matchInfoItem}>
                <span className={styles.label}>구장</span>
                <span className={styles.value}>{review.stadium}</span>
              </div>
            </div>
          </>
        )}

        <div className={styles.ratingSection}>
          <label>평점</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${star <= review.rating ? styles.active : ''}`}
                onClick={() => setReview({ ...review, rating: star })}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>리뷰 내용</label>
          <textarea
            value={review.content}
            onChange={(e) => setReview({ ...review, content: e.target.value })}
            placeholder="경기 관람 후기를 작성해주세요"
            required
            rows={6}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          리뷰 등록하기
        </button>
      </form>
    </div>
  );
};

export default WriteReviewPage;