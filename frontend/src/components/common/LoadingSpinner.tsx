import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  return (
    <div className={`${styles.loadingSpinner} ${fullScreen ? styles.fullscreen : ''}`}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;