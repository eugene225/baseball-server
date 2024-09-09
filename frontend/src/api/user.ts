import axios, { AxiosError } from 'axios';

// API URL 상수 정의
const API_URL = 'http://52.65.47.31:3000/api/v1/users';

// 사용자 정보 타입 정의
interface UserInfo {
  nickname: string;
  myTeam: string;
  // 필요한 다른 필드를 여기에 추가하세요
}

// 업데이트된 사용자 정보 타입 정의
interface UpdatedUserInfo {
  nickname?: string;
  myTeam?: string;
  // 필요한 다른 필드를 여기에 추가하세요
}

// 에러 응답 데이터의 타입 정의
interface ErrorResponse {
  message: string;
}

// 사용자 정보를 가져오는 API 호출 함수
export const fetchUserInfo = async (userId: string, accessToken: string): Promise<UserInfo> => {
  try {
    const response = await axios.get<UserInfo>(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '사용자 정보를 가져오는 데 실패했습니다.';
      throw new Error(errorMessage);
    } else {
      throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
    }
  }
};

// 사용자 정보를 업데이트하는 API 호출 함수
export const updateUserInfo = async (
  userId: string,
  accessToken: string,
  updatedInfo: UpdatedUserInfo
): Promise<UserInfo> => {
  try {
    const response = await axios.patch<UserInfo>(`${API_URL}/${userId}`, updatedInfo, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '사용자 정보를 업데이트하는 데 실패했습니다.';
      throw new Error(errorMessage);
    } else {
      throw new Error('사용자 정보를 업데이트하는 데 실패했습니다.');
    }
  }
};

// 비공개 일기장 목록을 가져오는 API 호출 함수
interface PrivateDiary {
  // 비공식 일기장의 데이터 구조를 정의하세요
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export const fetchPrivateDiaries = async (
  userId: string,
  accessToken: string
): Promise<PrivateDiary[]> => {
  try {
    const response = await axios.get<PrivateDiary[]>(`${API_URL}/${userId}/private-diaries`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '비공개 일기장 목록을 가져오는 데 실패했습니다.';
      throw new Error(errorMessage);
    } else {
      throw new Error('비공개 일기장 목록을 가져오는 데 실패했습니다.');
    }
  }
};
