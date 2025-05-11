import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import { fetchUserInfo, updateUserInfo } from '../../api/user';
import { deleteFcmToken, getFcmToken } from '../../api/fcm';
import { getDeviceType, requestPermission, messaging } from '../../config/firebaseConfig';
import { deleteToken } from 'firebase/messaging';
import { UserInfo } from '../../types/auth';
import { TEAMS } from '../../types/teams';
import { useLoading } from '../../hooks/useLoading';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function MyPage(): JSX.Element {
  const [userInfo, setUserInfo] = useState<UserInfo>({ nickname: '', myTeam: '' });
  const [newNickname, setNewNickname] = useState('');
  const [newMyTeam, setNewMyTeam] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isNotificationToggling, setIsNotificationToggling] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { isLoading, withLoading } = useLoading();
  const navigate = useNavigate();

  const getUserFromLocalStorage = () => JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const user = getUserFromLocalStorage();
      const deviceType = getDeviceType(navigator.userAgent);
      if (!user?.userId || !user?.accessToken) return;

      try {
        const [data, fcmResponse] = await withLoading(Promise.all([
          fetchUserInfo(user.userId, user.accessToken),
          getFcmToken(user.userId, user.accessToken, deviceType).then(res => res.json()).catch(() => null),
        ]));

        if (isMounted) {
          setUserInfo({ nickname: data.nickname || '', myTeam: data.myTeam || '' });
          setNewNickname(data.nickname || '');
          setNewMyTeam(data.myTeam || '');
          setIsNotificationEnabled(!!fcmResponse?.fcmToken);
          setIsPageLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        if (isMounted) {
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    init();
    return () => { isMounted = false; };
  }, [navigate]);

  const handleSaveChanges = async () => {
    const user = getUserFromLocalStorage();
    if (!user?.userId || !user?.accessToken) return;

    setIsSaving(true);
    try {
      await updateUserInfo(user.userId, user.accessToken, {
        nickname: newNickname,
        myTeam: newMyTeam,
      });
      setUserInfo({ nickname: newNickname, myTeam: newMyTeam });
      setSaveMessage('수정되었습니다');
    } catch (err) {
      console.error('Error updating user info:', err);
      setSaveMessage('수정 실패. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleNotificationToggle = async () => {
    const user = getUserFromLocalStorage();
    if (!user?.userId || !user?.accessToken) return;

    setIsNotificationToggling(true);
    try {
      if (!isNotificationEnabled) {
        const result = await requestPermission(user.userId, user.accessToken);
        if (!result.success || !result.token) {
          alert(result.error);
          return;
        }
        setIsNotificationEnabled(true);
      } else {
        const deviceType = getDeviceType(navigator.userAgent);
        await Promise.all([
          deleteToken(messaging),
          deleteFcmToken(user.userId, user.accessToken, deviceType),
        ]);
        setIsNotificationEnabled(false);
      }
    } catch (err) {
      console.error('알림 설정 실패:', err);
      alert('알림 설정 변경에 실패했습니다.');
    } finally {
      setIsNotificationToggling(false);
    }
  };

  const handleDiaryBlockClick = () => {
    navigate('/private-diaries');
  };

  if (isPageLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className={styles.myPage}>
      {isLoading && <LoadingSpinner fullScreen />}
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
            disabled={isSaving}
          />
        </div>
        <div className={styles.formGroup}>
          <span>마이팀</span>
          <select
            className={styles.select}
            value={newMyTeam}
            onChange={(e) => setNewMyTeam(e.target.value)}
            disabled={isSaving}
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
          disabled={isSaving}
        >
          {isSaving ? (
            <div className={styles.buttonContent}>
              <LoadingSpinner size={20} />
              <span>저장 중...</span>
            </div>
          ) : (
            '변경사항 저장'
          )}
        </button>
        {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}
        <div className={styles.notificationToggle}>
          <span>알림 허용</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isNotificationEnabled}
              onChange={handleNotificationToggle}
              disabled={isNotificationToggling}
            />
            <span className={styles.slider}></span>
          </label>
          {isNotificationToggling && (
            <div className={styles.miniSpinner}>
              <LoadingSpinner size={16} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.diariesBlock} onClick={handleDiaryBlockClick}>
        <h2>
          <span role="img" aria-label="lock">🔒</span> 비공개 일기장 목록
        </h2>
      </div>
    </div>
  );
}

export default MyPage;
