import React, { useState } from 'react';
import './DiaryCreationPage.css';
import { Team, TEAMS } from '../../types/teams';

const DiaryCreationPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [opponentTeam, setOpponentTeam] = useState<string>('');
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [entry, setEntry] = useState<string>('');
  const [lineup, setLineup] = useState<string[]>(Array(9).fill(''));
  const [startingPitcher, setStartingPitcher] = useState<string>('');

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(event.target.value);
  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedTeam(event.target.value);
  const handleOpponentTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => setOpponentTeam(event.target.value);
  const handleHomeScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => setHomeScore(event.target.value);
  const handleAwayScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => setAwayScore(event.target.value);
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  const handleWeatherChange = (event: React.ChangeEvent<HTMLInputElement>) => setWeather(event.target.value);
  const handleEntryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setEntry(event.target.value);

  const handleLineupChange = (index: number, value: string) => {
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
          {TEAMS.map((team: Team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <div className="input-label">상대 팀</div>
        <select value={opponentTeam} onChange={(e) => handleOpponentTeamChange}>
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
