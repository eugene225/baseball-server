
export interface GameSchedule {
    id: string | number;
    away_team: string;
    home_team: string;
    time: string;       // 경기 시간 (예: "18:30")
    stadium: string;    // 경기장 이름
    tv: string;         // 중계 방송 정보
}

export interface TeamRank {
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