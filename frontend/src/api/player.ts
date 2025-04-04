import axios from 'axios';

const API_URL = `${ process.env.REACT_APP_API_URL }/v1/players`;

export const fetchPlayersByTeam = async (team: string) => {
  const response = await axios.get(`${API_URL}/${team}`);
  return response.data;
};