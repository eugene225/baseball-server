import axios from 'axios';

const API_URL = 'http://52.65.47.31:3000/api/v1/diary';

// 공개 일기장 목록을 가져오는 API 호출 함수
export const fetchPublicDiaries = async () => {
  try {
    const response = await axios.get(`${API_URL}/public`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch public diaries:', error);
    throw new Error(error.response ? error.response.data.message : '공개 일기장 목록을 가져오는 데 실패했습니다.');
  }
};

// 일기장을 생성하는 API 호출 함수
export const createDiary = async (diaryData, accessToken) => {
    try {
      const response = await axios.post(API_URL, diaryData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create diary:', error);
      throw new Error(error.response ? error.response.data.message : '일기장을 생성하는 데 실패했습니다.');
    }
  };