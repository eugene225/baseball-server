import axios from 'axios';
import { GameSchedule, TeamRank } from '../types/data';

const API_URL = `${process.env.REACT_APP_AI_URL}`;

export const getKboRank = async (): Promise<TeamRank[]> => {
  try {
    const response = await fetch(`${API_URL}/kbo/rank`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.status === 'success' && Array.isArray(json.data)) {
      return json.data;
    } else {
      console.warn('Unexpected response format:', json);
      return [];
    }
  } catch (error) {
    console.error('Error fetching KBO rank:', error);
    return [];
  }
};

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