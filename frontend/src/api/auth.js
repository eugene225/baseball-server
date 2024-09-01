// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://52.65.47.31:3000/api/v1/auth'; // 백엔드 API URL

export const signUp = async (signUpData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, signUpData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : '회원가입 실패');
  }
};

export const signIn = async (signInData) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, signInData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response ? error.response.data.message : '로그인 실패');
  }
};
