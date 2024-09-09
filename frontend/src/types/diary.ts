// 일기장 생성 데이터 타입 정의
export interface CreateDiaryData {
    title: string;
    description: string;
    isPublic: boolean;
}

// 일기장 반환타입
export interface Diary {
  id: string;
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