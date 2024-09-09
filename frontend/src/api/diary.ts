import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../types/global';
import { CreateDiaryData, Diary } from '../types/diary';

// API URL 상수
const API_URL = 'http://52.65.47.31:3000/api/v1/diary';

// 공개 일기장 목록을 가져오는 API 호출 함수의 반환 타입 정의
export const fetchPublicDiaries = async (): Promise<Diary[]> => {
  try {
    const response = await axios.get<Diary[]>(`${API_URL}/public`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '공개 일기장 목록을 가져오는 데 실패했습니다.';
      throw new Error(errorMessage);
    } else {
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
