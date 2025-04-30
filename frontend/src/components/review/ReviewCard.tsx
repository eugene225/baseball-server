import React from 'react';
import styles from './ReviewCard.module.css';

type ReviewProps = {
    content: string;
    rating: number;
    author: string;
    team: string;
    time: string;
    matchInfo: string;   // 예: "24.04.18 vs 한화"
    stadium: string;     // 예: "잠실야구장"
};

const ReviewCard = ({ content, rating, author, team, time, matchInfo, stadium }: ReviewProps) => (
  <div className={styles.reviewCard}>
    <div className={styles.reviewHeader}>
      <strong>{team}</strong> | <span>{author}</span>
    </div>

    <div className={styles.matchInfo}>
        🏟️ {matchInfo} | <span>{stadium}</span>
    </div>

    <div className={styles.reviewBody}>
      <p>{content}</p>
    </div>

    <div className={styles.reviewFooter}>
      <span className={styles.reviewStars}>
        {'⭐'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
      <small>{time}</small>
    </div>
  </div>
);
export default ReviewCard;