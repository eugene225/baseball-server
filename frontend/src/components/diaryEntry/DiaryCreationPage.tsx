import React, { useState, useEffect } from 'react';
import './DiaryCreationPage.css';
import { Team, TEAMS } from '../../types/teams';
import { fetchPlayersByTeam } from '../../api/player';
import { DiaryEntry, PlayerDto } from '../../types/diary';
import { Weather } from '../../types/global';

const DiaryCreationPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [opponentTeam, setOpponentTeam] = useState<string>('');
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [entry, setEntry] = useState<string>('');
  const [lineup, setLineup] = useState<PlayerDto[]>(Array(9).fill({ id: 0, name: '', position: '' }));
  const [startingPitcher, setStartingPitcher] = useState<string>('');
  const [players, setPlayers] = useState<PlayerDto[]>([]);

  useEffect(() => {
    // Fetch teams and set initial state if needed
  }, []);

  // Handle team selection and fetch players
  const handleTeamChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const team = event.target.value;
    setSelectedTeam(team);
    try {
      const fetchedPlayers = await fetchPlayersByTeam(team);
      setPlayers(fetchedPlayers);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  // Update lineup for each position
  const handleLineupChange = (index: number, playerId: string) => {
    const selectedPlayer = players.find((player) => player.name === playerId);
    if (selectedPlayer) {
      const newLineup = [...lineup];
      newLineup[index] = selectedPlayer;
      setLineup(newLineup);
    }
  };

  // Save the diary entry logic
  const handleSaveEntry = () => {
    const newEntry: DiaryEntry = {
      id: Date.now(), // Temporary ID, will be replaced by backend
      title,
      content: entry,
      myTeam: selectedTeam,
      opponent: opponentTeam,
      awayTeamScore: parseInt(awayScore, 10),
      homeTeamScore: parseInt(homeScore, 10),
      weather,
      lineUp: lineup,
      diaryId: Date.now(), // Temporary diaryId, will be replaced by backend
      authorNickname: 'currentUserNickname', // Placeholder for the current user's nickname
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Saving diary entry:', newEntry);
    // Logic to save the entry, e.g., POST request to API
  };

  return (
    <div className="diary-creation-page">
      <h1>일기 작성하기</h1>
      <div className="input-group">
        <div className="input-label">경기 날짜</div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
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
        <select value={opponentTeam} onChange={(e) => setOpponentTeam(e.target.value)}>
          <option value="">상대 팀 선택</option>
          {TEAMS.filter((team) => team.value !== selectedTeam).map((team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <div className="input-label">최종 스코어</div>
        <div className="score-group">
          <input
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="원정팀"
          />
          <span className="score-separator">:</span>
          <input
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="홈팀"
          />
        </div>
      </div>
      <div className="input-group">
        <div className="input-label">날씨</div>
        <select value={weather} onChange={(e) => setWeather(e.target.value as Weather)}>
          <option value="">날씨 선택</option>
          {Object.keys(Weather).map((key) => (
            <option key={key} value={Weather[key as keyof typeof Weather]}>
              {Weather[key as keyof typeof Weather]}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <div className="input-label">제목</div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="input-group">
        <div className="input-label">선발 투수</div>
        <select value={startingPitcher} onChange={(e) => setStartingPitcher(e.target.value)}>
          <option value="">선발 투수 선택</option>
          {players.map((player) => (
            <option key={player.id} value={player.name}>
              {player.name} ({player.position})
            </option>
          ))}
        </select>
      </div>
      <div className="lineup-group">
        {lineup.map((player, index) => (
          <div key={index} className="lineup-item">
            <div className="input-label">{index + 1}번 타자</div>
            <select value={player.name} onChange={(e) => handleLineupChange(index, e.target.value)}>
              <option value="">선수 선택</option>
              {players.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="input-group">
        <div className="input-label">일기 내용</div>
        <textarea value={entry} onChange={(e) => setEntry(e.target.value)}></textarea>
      </div>
      <button onClick={handleSaveEntry}>일기 저장하기</button>
    </div>
  );
};

export default DiaryCreationPage;
