import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../types/global';
import { CreateDiaryData, Diary, DiaryCardContent, DiaryEntry } from '../types/diary';

// API URL 상수
const API_URL = 'http://52.65.47.31:3000/api/v1/diarys';

// 공개 일기장 목록을 가져오는 API 호출 함수의 반환 타입 정의
export const fetchPublicDiaries = async (token: string): Promise<Diary[]> => {
  try {
    // 요청 헤더에 인증 토큰 추가
    const response = await axios.get<Diary[]>(`${API_URL}/public`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰을 헤더에 추가
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '공개 일기장 목록을 가져오는 데 실패했습니다.';
      console.error('API 호출 에러:', errorMessage); // 에러 메시지 로깅
      throw new Error(errorMessage);
    } else {
      console.error('API 호출 에러:', error);
      throw new Error('공개 일기장 목록을 가져오는 데 실패했습니다.');
    }
  }
};

// 일기장을 생성하는 API 호출 함수
export const createDiary = async (diaryData: CreateDiaryData, accessToken: string): Promise<void> => {
  try {
    await axios.post(API_URL, diaryData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '일기장을 생성하는 데 실패했습니다.';
      throw new Error(errorMessage);
    } else {
      throw new Error('일기장을 생성하는 데 실패했습니다.');
    }
  }
};

export const fetchDiaryEntries = async (diaryId: number): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(`${API_URL}/${diaryId}`);
  return response.data;
};
