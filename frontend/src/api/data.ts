const API_URL = `${process.env.REACT_APP_AI_URL}`;

export const getKboRank = async () => {
  const response = await fetch(`${API_URL}/kbo/rank`);
  return response.json();
};
