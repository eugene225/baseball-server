import React from 'react';
import html2canvas from 'html2canvas';
import './DiaryCard.css';

// Props 타입 정의
interface DiaryCardProps {
  date: string;
  team: string;
  opponent: string;
  score: string;
  weather: string;
  title: string;
  entry: string;
  lineup: string[];
}

const DiaryCard: React.FC<DiaryCardProps> = ({
  date,
  team,
  opponent,
  score,
  weather,
  title,
  entry,
  lineup
}) => {

  const handleSaveAsImage = () => {
    const element = document.querySelector('.diary-card') as HTMLElement; // 카드 엘리먼트를 선택합니다.
    const button = document.querySelector('.save-button') as HTMLElement; // 버튼을 선택합니다.

    // 버튼을 숨깁니다.
    if (button) button.style.display = 'none';

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png'); // 캔버스를 이미지 데이터로 변환합니다.
      const link = document.createElement('a'); // 다운로드 링크를 생성합니다.
      link.href = imgData; // 이미지 데이터를 링크에 설정합니다.
      link.download = 'diary-card.png'; // 파일 이름을 설정합니다.
      link.click(); // 링크를 클릭하여 파일을 다운로드합니다.

      // 버튼을 다시 보이도록 합니다.
      if (button) button.style.display = 'block';
    });
  };

  return (
    <div className="diary-card">
      <div className="diary-card-header">
        <h2>{title}</h2>
        <div className="diary-card-date">{date}</div>
      </div>
      <div className="diary-card-body">
        <div className="diary-card-left">
          <div className="diary-card-info">
            <div>우리 팀: {team}</div>
            <div>상대 팀: {opponent}</div>
            <div>스코어: {score}</div>
            <div>날씨: {weather}</div>
          </div>
          <div className="diary-card-entry">{entry}</div>
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
              {lineup.map((player, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{player}</td>
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

export default DiaryCard;
