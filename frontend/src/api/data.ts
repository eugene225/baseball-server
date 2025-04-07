const API_URL = `${process.env.REACT_APP_AI_URL}`;

export const getKboRank = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_AI_URL}/kbo/rank`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching KBO rank:', error);
    return [];
  }
};
