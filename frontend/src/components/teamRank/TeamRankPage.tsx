import React, { useEffect, useState } from 'react';
import { getKboRank } from '../../api/data';
import './TeamRankPage.css';

interface TeamRank {
  rank: string;          // 순위
  team: string;          // 팀명
  games: string;         // 경기수
  wins: string;          // 승
  losses: string;        // 패
  draws: string;         // 무
  win_rate: string;      // 승률
  games_behind: string;  // 게임차
  streak: string;        // 연속
}

const TeamRankPage: React.FC = () => {
  const [rankings, setRankings] = useState<TeamRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await getKboRank();
        setRankings(data);
        setLoading(false);
      } catch (err) {
        setError('순위 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="team-rank-container">
      <div className="rank-header">
        <h1>KBO 리그 순위</h1>
        <div className="season-info">2025 시즌</div>
      </div>

      <div className="rank-table">
        <div className="table-header">
          <div className="rank-col">순위</div>
          <div className="team-col">팀</div>
          <div className="record-col">승-패-무</div>
          <div className="rate-col">승률</div>
          <div className="games-col">게임차</div>
          <div className="streak-col">연속</div>
        </div>

        {rankings.map((team) => (
          <div key={team.rank} className={`table-row ${parseInt(team.rank) <= 5 ? 'top-five' : ''}`}>
            <div className="rank-col">
              <span className="rank-number">{team.rank}</span>
            </div>
            <div className="team-col">
              <span className="team-name">{team.team}</span>
            </div>
            <div className="record-col">
              <span className="wins">{team.wins}승</span>
              <span className="separator">-</span>
              <span className="losses">{team.losses}패</span>
              <span className="separator">-</span>
              <span className="draws">{team.draws}무</span>
            </div>
            <div className="rate-col">
              <span className="win-rate">{parseFloat(team.win_rate).toFixed(3)}</span>
            </div>
            <div className="games-col">
              <span className="games-behind">{team.games_behind}</span>
            </div>
            <div className="streak-col">
              <span className="streak">{team.streak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRankPage;