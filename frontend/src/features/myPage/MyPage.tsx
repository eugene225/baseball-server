import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import { fetchUserInfo, updateUserInfo } from '../../api/user';
import { TEAMS } from '../../types/teams';
import {deleteFcmToken, saveFcmToken} from '../../api/fcm';
import {requestPermission} from '../../config/firebaseConfig';
import {UserInfo} from '../../types/auth';

function MyPage(): JSX.Element {
  const [userInfo, setUserInfo] = useState<UserInfo>({ nickname: '', myTeam: '' });
  const [newNickname, setNewNickname] = useState<string>('');
  const [newMyTeam, setNewMyTeam] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [allowNotification, setAllowNotification] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetUserInfo = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user) {
        try {
          const data = await fetchUserInfo(user.userId, user.accessToken);
          setUserInfo({ nickname: data.nickname, myTeam: data.myTeam });
          setNewNickname(data.nickname);
          setNewMyTeam(data.myTeam);
          setAllowNotification(!!data.fcmToken);
        } catch (error) {
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    fetchAndSetUserInfo();
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
  const handleNotificationToggle = async (checked: boolean) => {
    setAllowNotification(checked);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.userId || !user?.accessToken) return;

    if (checked) {
      const token = await requestPermission();
      if (token) {
        try {
          await saveFcmToken(user.userId, user.accessToken, token);
          console.log('FCM 토큰 저장 완료');
        } catch (err) {
          console.error('FCM 저장 실패:', err);
          setAllowNotification(false);
        }
      } else {
        setAllowNotification(false);
      }
    } else {
      try {
        await deleteFcmToken(user.userId, user.accessToken);
        console.log('FCM 토큰 삭제 완료');
      } catch (err) {
        console.error('FCM 삭제 실패:', err);
      }
    }
  };

  const handleDiaryBlockClick = () => {
    navigate('/private-diaries');
  };

  return (
    <div className="my-page">
      <h1>마이페이지</h1>
      <div className="user-info-form">
        <label>
          <span>닉네임:</span>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </label>
        <label>
          <span>마이팀:</span>
          <select
            value={newMyTeam}
            onChange={(e) => setNewMyTeam(e.target.value)}
          >
            <option value="">팀을 선택하세요</option>
            {TEAMS.map((team) => (
              <option key={team.value} value={team.value}>
                {team.value.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={handleSaveChanges}
          className={isSaving ? 'saving' : ''}
        >
          {isSaving ? '저장 중...' : '변경사항 저장'}
        </button>
        {saveMessage && <p className="save-message">{saveMessage}</p>}
        <label className="notification-toggle">
          <span>알림 허용:</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={allowNotification}
              onChange={(e) => handleNotificationToggle(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </label>
      </div>
      <div className="private-diaries-block" onClick={handleDiaryBlockClick}>
        <div className="block-content">
          <h2>
            <span role="img" aria-label="lock">🔒</span> 비공개 일기장 목록
          </h2>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
