import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import './DiaryEntryCard.css';
import { DiaryEntry as DiaryEntryType } from '../../types/diary';

interface DiaryEntryProps {
  diaryEntry: DiaryEntryType;
}

const DiaryEntryCard: React.FC<DiaryEntryProps> = ({ diaryEntry }) => {
  const entryRef = useRef<HTMLDivElement>(null); // 각 일기장 카드를 참조할 ref

  const handleSaveAsImage = () => {
    const element = entryRef.current; // 현재 항목의 ref를 사용
    const button = document.querySelector('.save-button') as HTMLElement;

    if (button) button.style.display = 'none';

    if (element) {
      html2canvas(element, {
        useCORS: true,
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'diary-entry.png';
        link.click();

        if (button) button.style.display = 'block';
      });
    }
  };

  return (
    <div className="diary-entry-card" ref={entryRef}> {/* ref를 추가 */}
      <div className="diary-entry-card-header">
        <h2>{diaryEntry.title}</h2>
        <div className="diary-entry-card-date">{new Date(diaryEntry.createdAt).toLocaleDateString()}</div>
        <div>작성자: {diaryEntry.authorNickname}</div>
      </div>
      <div className="diary-entry-card-body">
        <div className="diary-entry-card-left">
          <div className="diary-entry-card-info">
            <div>우리 팀 {diaryEntry.myTeam}</div>
            <div>상대 팀 {diaryEntry.opponent}</div>
            <div>스코어 {diaryEntry.awayTeamScore} : {diaryEntry.homeTeamScore}</div>
            <div>날씨 {diaryEntry.weather}</div>
          </div>
          <div className="diary-entry-card-entry">{diaryEntry.content}</div>
        </div>
        <div className="diary-entry-card-right">
          <h3>선발 라인업</h3>
          <div className="starting-pitcher-info">
            <h4>
              선발 투수: {diaryEntry.lineUp[0] ? diaryEntry.lineUp[0].name : '선발 투수 정보가 없습니다.'}
            </h4>
          </div>
          <table>
            <thead>
              <tr>
                <th>타자 번호</th>
                <th>선수 이름</th>
              </tr>
            </thead>
            <tbody>
              {diaryEntry.lineUp.slice(1).map((player, index) => (
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
