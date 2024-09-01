import axios from 'axios';

const API_URL = 'http://52.65.47.31:3000/api/v1/users';

// 사용자 정보를 가져오는 API 호출 함수
export const fetchUserInfo = async (userId, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw new Error(error.response ? error.response.data.message : '사용자 정보를 가져오는 데 실패했습니다.');
  }
};

// 사용자 정보를 업데이트하는 API 호출 함수
export const updateUserInfo = async (userId, accessToken, updatedInfo) => {
    try {
      const response = await axios.put(`${API_URL}/${userId}`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update user info:', error);
      throw new Error(error.response ? error.response.data.message : '사용자 정보를 업데이트하는 데 실패했습니다.');
    }
  };
  
  // 비공개 일기장 목록을 가져오는 API 호출 함수
  export const fetchPrivateDiaries = async (userId, accessToken) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}/private-diaries`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 토큰을 헤더에 포함
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch private diaries:', error);
      throw new Error(error.response ? error.response.data.message : '비공개 일기장 목록을 가져오는 데 실패했습니다.');
    }
  };
