import axios from 'axios';

const API_URL = 'http://52.65.47.31:3000/api/v1/players';

export const fetchPlayersByTeam = async (team: string) => {
  const response = await axios.get(`${API_URL}/${team}`);
  return response.data;
};