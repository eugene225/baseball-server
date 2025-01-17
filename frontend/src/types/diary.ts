import { Weather } from './global';
import { Position } from './global';

// 일기장 생성 데이터 타입 정의
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

// 플레이어 DTO
export interface PlayerDto {
  id: number;
  name: string;
  position: string;
}

export interface CreateDiaryEntryRequestDto {
  date: string;
  myTeam: string;
  opponent: string;
  homeTeamScore: number;
  awayTeamScore: number;
  weather: Weather;
  title: string;
  content: string;
  lineUp: {orderNum: number, playerId: number}[];
}

export interface LineUpPlayerDto {
  orderNum: number,
  playerId: number,
  playerName: string,
  playerPosition: Position,
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
  lineUp: LineUpPlayerDto[];
  diaryId: number;
  authorNickname: string;
  createdAt: Date;
  updatedAt: Date;
}