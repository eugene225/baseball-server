import React from 'react';
import html2canvas from 'html2canvas';
import './DiaryEntryCard.css';
import { DiaryEntry as DiaryEntryType } from '../../types/diary';

// Props 타입 정의
interface DiaryEntryProps {
  diaryEntry: DiaryEntryType;
}

const DiaryEntryCard: React.FC<DiaryEntryProps> = ({ diaryEntry }) => {

  const handleSaveAsImage = () => {
    const element = document.querySelector('.diary-card') as HTMLElement;
    const button = document.querySelector('.save-button') as HTMLElement;

    if (button) button.style.display = 'none';

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'diary-entry.png';
      link.click();

      if (button) button.style.display = 'block';
    });
  };

  return (
    <div className="diary-card">
      <div className="diary-card-header">
        <h2>{diaryEntry.title}</h2>
        <div className="diary-card-date">{new Date(diaryEntry.createdAt).toLocaleDateString()}</div>
        <div>작성자: {diaryEntry.authorNickname}</div>
      </div>
      <div className="diary-card-body">
        <div className="diary-card-left">
          <div className="diary-card-info">
            <div>우리 팀 {diaryEntry.myTeam}</div>
            <div>상대 팀 {diaryEntry.opponent}</div>
            <div>스코어 {diaryEntry.homeTeamScore} : {diaryEntry.awayTeamScore}</div>
            <div>날씨 {diaryEntry.weather}</div>
          </div>
          <div className="diary-card-entry">{diaryEntry.content}</div>
        </div>
        <div className="diary-card-right">
          <h3>선발 라인업</h3>
          <table>
            <thead>
              <tr>
                <th>타자 번호</th>
                <th>선수 이름</th>
              </tr>
            </thead>
            <tbody>
              {diaryEntry.lineUp.map((player, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={handleSaveAsImage} className="save-button">이미지로 저장</button>
    </div>
  );
};

export default DiaryEntryCard;
