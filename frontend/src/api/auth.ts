import axios, { AxiosError } from 'axios';

// API URL 상수 정의
const API_URL = 'http://52.65.47.31:3000/api/v1/auth';

// 회원가입 데이터 타입 정의
interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  // 필요한 다른 필드를 여기에 추가하세요
}

// 로그인 데이터 타입 정의
interface SignInData {
  email: string;
  password: string;
}

// 응답 데이터 타입 정의
interface AuthResponse {
  userId: number,
  accessToken: string;
  // 필요한 다른 필드를 여기에 추가하세요
}

// 에러 응답 데이터 타입 정의
interface ErrorResponse {
  message: string;
}

// 회원가입 API 호출 함수
export const signUp = async (signUpData: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/signup`, signUpData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '회원가입 실패';
      throw new Error(errorMessage);
    } else {
      throw new Error('회원가입 실패');
    }
  }
};

// 로그인 API 호출 함수
export const signIn = async (signInData: SignInData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/signin`, signInData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '로그인 실패';
      throw new Error(errorMessage);
    } else {
      throw new Error('로그인 실패');
    }
  }
};
