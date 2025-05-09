import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';
import { useAuth } from '../../contexts/AuthContext';
import ReviewCard from '../review/ReviewCard';
import { TEAMS } from '../../types/teams';

interface UserInfoProps {
  nickname: string;
  myTeam: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ nickname, myTeam }) => {
  return (
    <div className={styles.userInfo}>
      <div className={styles.userProfile}>
        <div className={styles.userIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className={styles.userDetails}>
          <h3 className={styles.userName}>{nickname}</h3>
          <p className={styles.userTeam}>{myTeam}</p>
        </div>
      </div>
    </div>
  );
};

const dummyReviews = [
  {
    content: '재밌는 경기였어요!',
    rating: 5,
    author: '홍길동',
    team: 'LG 트윈스',
    time: '2025-04-30 12:00',
    matchInfo: '2025.04.30 vs 한화',
    stadium: '잠실야구장',
  },
  {
    content: '심판 판정이 아쉬웠음...',
    rating: 3,
    author: '김철수',
    team: '두산 베어스',
    time: '2025-04-29 20:45',
    matchInfo: '2025.04.29 vs SK 와이번스',
    stadium: '고척 스카이돔',
  },
];

const MainPage: React.FC = () => {
  const { isLoggedIn, userInfo } = useAuth();
  const [reviews, setReviews] = useState(dummyReviews);

  useEffect(() => {
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setReviews(sortedReviews);
  }, []);

  return (
    <div className={styles.mainPage}>
      <main>
        <header className={styles.mainHeader}>
          <h1>야구 다이어리</h1>
          <p className={styles.subtitle}>당신의 야구 경험을 기록하고 공유하세요</p>
        </header>

        {isLoggedIn && userInfo ? (
          <UserInfo nickname={userInfo.nickname} myTeam={userInfo.myTeam} />
        ) : (
          <div className={styles.loginPrompt}>
            <Link to="/login" className={styles.loginButton}>
              로그인/회원가입
            </Link>
          </div>
        )}

        {!userInfo?.myTeam && (
          <div className={styles.setupGuide}>
            <h2>마이팀을 설정해주세요!</h2>
            <p>마이팀을 설정하면 해당 팀의 채팅방에 참여할 수 있습니다.</p>
            <Link to="/mypage" className={styles.setupButton}>
              마이팀 설정하기
            </Link>
          </div>
        )}

        <div role="navigation" aria-label="메인 메뉴">
        </div>

        <section className={styles.reviewFeed}>
          <div className={styles.reviewList}>
            {reviews.map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </div>

          <button className={styles.floatingWriteButton} disabled>
            +
          </button>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
