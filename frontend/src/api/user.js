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
