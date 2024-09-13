import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import './DiaryCreationPage.css';
import { Team, TEAMS } from '../../types/teams';
import { fetchPlayersByTeam } from '../../api/player';
import { CreateDiaryEntryRequestDto, PlayerDto } from '../../types/diary';
import { Weather } from '../../types/global';
import { createDiaryEntry } from '../../api/diary';

const DiaryCreationPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [opponentTeam, setOpponentTeam] = useState<string>('');
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [weather, setWeather] = useState<Weather>(Weather.SUNNY);
  const [entry, setEntry] = useState<string>('');
  const [lineup, setLineup] = useState<PlayerDto[]>(
    Array(10).fill({ id: 0, name: '', position: '' }).map(() => ({ id: 0, name: '', position: '' }))
  );
  const [players, setPlayers] = useState<PlayerDto[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [playerSearchResults, setPlayerSearchResults] = useState<{ [key: string]: PlayerDto[] }>({});

  const navigate = useNavigate(); // Initialize useNavigate
  const { diaryId } = useParams<{ diaryId: string }>();

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

  const handleLineupChange = (index: number, playerName: string) => {
    const selectedPlayer = players.find((player) => player.name === playerName);
    if (selectedPlayer) {
      const newLineup = [...lineup];
      newLineup[index] = selectedPlayer;
      setLineup(newLineup);
      setFocusedIndex(null);
      setPlayerSearchResults(prev => ({ ...prev, [index.toString()]: [] }));
    }
  };

  const handlePlayerSearch = (searchTerm: string, index: number | null) => {
    if (searchTerm === '') {
      setPlayerSearchResults(prev => ({ ...prev, [index === null ? 'startingPitcher' : index.toString()]: [] }));
      setFocusedIndex(null);
    } else {
      const filtered = players.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPlayerSearchResults(prev => ({ ...prev, [index === null ? 'startingPitcher' : index.toString()]: filtered }));
      setFocusedIndex(index);
    }
  };

  const handleSelectPlayer = (playerName: string, index: number | null) => {
    if (index !== null) {
      handleLineupChange(index, playerName);
    } else {
      setFocusedIndex(null);
      setPlayerSearchResults(prev => ({ ...prev, 'startingPitcher': [] }));
    }
  };

  const handleSaveEntry = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('User Not Found : Local Storage');
    }

    const accessToken = JSON.parse(user).accessToken;
    if (!diaryId || !accessToken) {
      console.error('Diary ID or access token is missing');
      return;
    }

    const lineUpIds = lineup.map(player => player.id);

    const newEntry: CreateDiaryEntryRequestDto = {
      date: selectedDate,
      myTeam: selectedTeam,
      opponent: opponentTeam,
      homeTeamScore: parseInt(homeScore, 10),
      awayTeamScore: parseInt(awayScore, 10),
      weather: weather as Weather,
      title,
      content: entry,
      lineUp: lineUpIds,
    };

    try {
      await createDiaryEntry(Number(diaryId), newEntry, accessToken);
      console.log('Diary entry saved successfully');
      navigate('/diaries'); // Navigate to the diary list page after saving
    } catch (error) {
      console.error('Failed to save diary entry:', error);
    }
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
      <div className="lineup-group">
        {lineup.map((player, index) => (
          <div key={index} className="lineup-item">
            <div className="input-label">
              {index === 0 ? '선발 투수' : `${index}번 타자`}
            </div>
            <input
              type="text"
              value={player.name}
              placeholder="선수 이름을 입력하세요"
              onChange={(e) => {
                const newLineup = [...lineup];
                newLineup[index] = { ...newLineup[index], name: e.target.value };
                setLineup(newLineup);
                handlePlayerSearch(e.target.value, index);
              }}
              onFocus={() => setFocusedIndex(index)}
            />
            {focusedIndex === index && playerSearchResults[index.toString()]?.length > 0 && (
              <ul className="autocomplete-list">
                {playerSearchResults[index.toString()].map((p) => (
                  <li key={p.id} onClick={() => handleSelectPlayer(p.name, index)}>
                    {p.name} ({p.position})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="input-group">
        <div className="input-label">일기 내용</div>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
      </div>
      <button onClick={handleSaveEntry}>저장</button>
    </div>
  );
};

export default DiaryCreationPage
