import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import { fetchUserInfo, updateUserInfo } from '../api/user';

interface UserInfo {
  nickname: string;
  myTeam: string;
}

const teams: Array<string> = [
  'LG_TWINS',
  'SAMSUNG_LIONS',
  'KIWOOM_HEROS',
  'HANHWA_EAGLES',
  'KT_WIZ',
  'DOOSAN_BEARS',
  'NC_DINOS',
  'SSG_LANDERS',
  'KIA_TIGERS',
];

function MyPage(): JSX.Element {
  const [userInfo, setUserInfo] = useState<UserInfo>({ nickname: '', myTeam: '' });
  const [newNickname, setNewNickname] = useState<string>('');
  const [newMyTeam, setNewMyTeam] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
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
            {teams.map((team) => (
              <option key={team} value={team}>
                {team.replace('_', ' ')}
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
