import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  centered = false,
  size = 40, // 디폴트 값 설정
}) => {
  return (
    <div
      className={`
        ${styles.loadingSpinner}
        ${fullScreen ? styles.fullscreen : ''}
        ${centered ? styles.centered : ''}
      `}
    >
      <div
        className={styles.spinner}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${size / 10}px`,
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
