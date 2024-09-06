import React, { useState } from 'react';
import './DiaryCreationPage.css';

// 팀 목록 정의
const TEAMS = [
  { value: 'LG_TWINS', label: 'LG 트윈스' },
  { value: 'SAMSUNG_LIONS', label: '삼성 라이온즈' },
  { value: 'KIWOOM_HEROS', label: '키움 히어로즈' },
  { value: 'HANHWA_EAGLES', label: '한화 이글스' },
  { value: 'KT_WIZ', label: 'KT 위즈' },
  { value: 'DOOSAN_BEARS', label: '두산 베어스' },
  { value: 'NC_DINOS', label: 'NC 다이노스' },
  { value: 'SSG_LANDERS', label: 'SSG 랜더스' },
  { value: 'KIA_TIGERS', label: 'KIA 타이거즈' },
];

const DiaryCreationPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [opponentTeam, setOpponentTeam] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [title, setTitle] = useState('');
  const [weather, setWeather] = useState('');
  const [entry, setEntry] = useState('');
  const [lineup, setLineup] = useState(Array(9).fill(''));
  const [startingPitcher, setStartingPitcher] = useState('');

  const handleDateChange = (event) => setSelectedDate(event.target.value);
  const handleTeamChange = (event) => setSelectedTeam(event.target.value);
  const handleOpponentTeamChange = (event) => setOpponentTeam(event.target.value);
  const handleHomeScoreChange = (event) => setHomeScore(event.target.value);
  const handleAwayScoreChange = (event) => setAwayScore(event.target.value);
  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleWeatherChange = (event) => setWeather(event.target.value);
  const handleEntryChange = (event) => setEntry(event.target.value);

  const handleLineupChange = (index, value) => {
    const newLineup = [...lineup];
    newLineup[index] = value;
    setLineup(newLineup);
  };

  const handleSaveEntry = () => {
    // 일기 저장 로직 구현
    console.log('Saving diary entry:', { title, weather, entry, selectedDate, selectedTeam, opponentTeam, homeScore, awayScore, lineup, startingPitcher });
  };

  return (
    <div className="diary-creation-page">
      <h1>일기 작성하기</h1>
      <div className="input-group">
        <div className="input-label">경기 날짜</div>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>
      <div className="input-group">
        <div className="input-label">우리 팀</div>
        <select value={selectedTeam} onChange={handleTeamChange}>
          <option value="">팀 선택</option>
          {TEAMS.map((team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <div className="input-label">상대 팀</div>
        <select value={opponentTeam} onChange={handleOpponentTeamChange}>
          <option value="">팀 선택</option>
          {TEAMS.filter(team => team.value !== selectedTeam).map((team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>
      </div>
      <div className="score-group">
        <div className="input-label">최종 스코어</div>
        <input type="number" value={awayScore} onChange={handleAwayScoreChange} placeholder="원정팀" />
        <span className="score-separator">:</span>
        <input type="number" value={homeScore} onChange={handleHomeScoreChange} placeholder="홈팀" />
      </div>
      <div className="weather-group">
        <div className="input-label">날씨</div>
        <div className="weather-item">
          <input type="radio" id="sunny" name="weather" value="☀️" checked={weather === '☀️'} onChange={handleWeatherChange} />
          <label htmlFor="sunny">☀️</label>
        </div>
        <div className="weather-item">
          <input type="radio" id="cloudy" name="weather" value="🌥️" checked={weather === '🌥️'} onChange={handleWeatherChange} />
          <label htmlFor="cloudy">🌥️</label>
        </div>
        <div className="weather-item">
          <input type="radio" id="rainy" name="weather" value="🌧️" checked={weather === '🌧️'} onChange={handleWeatherChange} />
          <label htmlFor="rainy">🌧️</label>
        </div>
      </div>
      <div className="input-group">
        <div className="input-label">제목</div>
        <input type="text" value={title} onChange={handleTitleChange} />
      </div>
      <div className="input-group">
        <div className="input-label">선발 투수</div>
        <input type="text" value={startingPitcher} onChange={(e) => setStartingPitcher(e.target.value)} placeholder="선발 투수 이름" />
      </div>
      <div className="lineup-group">
        {lineup.map((player, index) => (
          <div key={index} className="lineup-item">
            <div className="input-label">{index + 1}번 타자</div>
            <input
              type="text"
              value={player}
              onChange={(e) => handleLineupChange(index, e.target.value)}
              placeholder={`타자 ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <div className="input-group">
        <div className="input-label">일기 내용</div>
        <textarea value={entry} onChange={handleEntryChange}></textarea>
      </div>
      <button onClick={handleSaveEntry}>일기 저장하기</button>
    </div>
  );
};

export default DiaryCreationPage;
