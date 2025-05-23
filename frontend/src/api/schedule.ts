import axios from 'axios';
import { GameSchedule } from '../types/data';

const API_URL = process.env.REACT_APP_AI_URL;

export const getSchedule = async (year: number, month: number, day?: number): Promise<GameSchedule[]> => {
  const params = new URLSearchParams({
    year: year.toString(),
    month: month.toString(),
  });

  if (day) {
    params.append('day', day.toString());
  }

  const response = await axios.get(`${API_URL}/kbo/schedule?${params}`);
  return response.data;
};