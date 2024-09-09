import React from 'react';
import DiaryCard from './DiaryCard';

// 일기 데이터 타입 정의
interface Diary {
  date: string;
  team: string;
  opponent: string;
  score: string;
  weather: string;
  title: string;
  entry: string;
  lineup: string[];
}

// mockDiaries 데이터 정의
const mockDiaries: Diary[] = [
  {
    date: '2024-09-01',
    team: 'LG 트윈스',
    opponent: '삼성 라이온즈',
    score: '4:3',
    weather: '☀️',
    title: '승리의 날!',
    entry: '오늘은 정말 멋진 경기를 봤다. 우리의 팀이 끝까지 포기하지 않고 승리해서 너무 기뻤다!',
    lineup: ['선수1', '선수2', '선수3', '선수4', '선수5', '선수6', '선수7', '선수8', '선수9']
  },
  {
    date: '2024-09-02',
    team: 'NC 다이노스',
    opponent: '두산 베어스',
    score: '2:5',
    weather: '🌧️',
    title: '아쉬운 패배',
    entry: '경기가 비 때문에 지연되었고, 결과적으로 우리 팀이 패했다. 하지만 다음 경기를 기대해본다.',
    lineup: ['선수A', '선수B', '선수C', '선수D', '선수E', '선수F', '선수G', '선수H', '선수I']
  }
];

const DiaryListPage = () => {
  return (
    <div className="diary-list-page">
      <h1>일기 목록</h1>
      {mockDiaries.map((diary, index) => (
        <DiaryCard key={index} {...diary} />
      ))}
    </div>
  );
};

export default DiaryListPage;
