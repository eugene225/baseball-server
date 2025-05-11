import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import { fetchUserInfo, updateUserInfo } from '../../api/user';
import { TEAMS } from '../../types/teams';
import { deleteFcmToken, getFcmToken, saveFcmToken } from '../../api/fcm';
import { getDeviceType, requestPermission, messaging } from '../../config/firebaseConfig';
import { UserInfo } from '../../types/auth';
import { deleteToken } from 'firebase/messaging';

function MyPage(): JSX.Element {
  const [userInfo, setUserInfo] = useState<UserInfo>({ nickname: '', myTeam: '' });
  const [newNickname, setNewNickname] = useState<string>('');
  const [newMyTeam, setNewMyTeam] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchAndSetUserInfo = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const deviceType = getDeviceType(navigator.userAgent);
      if (user) {
        try {
          const [data, fcmResponse] = await Promise.all([
            await fetchUserInfo(user.userId, user.accessToken),
            await getFcmToken(user.userId, user.accessToken, deviceType)
              .then(response => response.json())
              .catch(() => null)
          ]);

          if (isMounted) {
            setUserInfo({ nickname: data.nickname || '', myTeam: data.myTeam || '' });
            setNewNickname(data.nickname || '');
            setNewMyTeam(data.myTeam || '');
            setIsNotificationEnabled(fcmResponse?.fcmToken ? true : false);
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          if (isMounted) {
            localStorage.removeItem('user');
            navigate('/login');
          }
        }
      }
    };

    fetchAndSetUserInfo();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSaveChanges = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setIsSaving(true);
      try {
        await updateUserInfo(user.userId, user.accessToken, { nickname: newNickname, myTeam: newMyTeam });
        setUserInfo({ nickname: newNickname, myTeam: newMyTeam });
        setSaveMessage('수정되었습니다');
      } catch (error) {
        console.error('Error updating user info:', error);
        setSaveMessage('수정 실패. 다시 시도해 주세요.');
      } finally {
        setIsSaving(false);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    }
  };

  // FCM 데이터 관리 함수
  const handleNotificationToggle = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.userId || !user?.accessToken) return;

    try {
      if (!isNotificationEnabled) {
        const result = await requestPermission(user.userId, user.accessToken);
        if (!result.success || !result.token) {
          alert(result.error);
          return;
        }
        setIsNotificationEnabled(true);
      } else {
        // 알림 비활성화 시 토큰 삭제
        const deviceType = getDeviceType(navigator.userAgent);
        try {
          await deleteToken(messaging);
          await deleteFcmToken(user.userId, user.accessToken, deviceType);
          console.log('FCM 토큰 삭제 완료');
          setIsNotificationEnabled(false);
        } catch (error) {
          console.error('FCM 토큰 삭제 실패:', error);
          alert('알림 설정 변경에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const handleDiaryBlockClick = () => {
    navigate('/private-diaries');
  };

  return (
    <div className={styles.myPage}>
      <h1 className={styles.title}>마이페이지</h1>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <span>닉네임</span>
          <input
            className={styles.input}
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <div className={styles.formGroup}>
          <span>마이팀</span>
          <select
            className={styles.select}
            value={newMyTeam || ''}
            onChange={(e) => setNewMyTeam(e.target.value)}
          >
            <option value="">팀을 선택하세요</option>
            {TEAMS.map((team) => (
              <option key={team.value} value={team.value}>
                {team.value.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSaveChanges}
          className={`${styles.button} ${isSaving ? styles.saving : ''}`}
        >
          {isSaving ? '저장 중...' : '변경사항 저장'}
        </button>
        {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}
        <div className={styles.notificationToggle}>
          <span>알림 허용</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isNotificationEnabled}
              onChange={handleNotificationToggle}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      <div className={styles.diariesBlock} onClick={handleDiaryBlockClick}>
        <div>
          <h2>
            <span role="img" aria-label="lock">🔒</span> 비공개 일기장 목록
          </h2>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
