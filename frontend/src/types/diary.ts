export interface CreateDiaryData {
    title: string;
    description: string;
    isPublic: boolean;
}

// 일기장 반환타입
export interface Diary {
  id: number;
  title: string;
  description: string;
  creator: string;
  isPublic: boolean;
  createdAt: string;
}

// 일기 데이터 타입 정의
export interface DiaryCardContent {
    date: string;
    team: string;
    opponent: string;
    score: string;
    weather: string;
    title: string;
    entry: string;
    lineup: string[];
  }

export interface DiaryEntry {
    id: number;
    title: string;
    content: string;
    myTeam: string;
    opponent: string;
    awayTeamScore: number;
    homeTeamScore: number;
    weather: string;
    lineUp: PlayerDto[];
    diaryId: number;
    authorNickname: string;
    createdAt: string;
    updatedAt?: string;
}

export interface PlayerDto {
  id: number;
  name: string;
  position: string;
  team: string;
}