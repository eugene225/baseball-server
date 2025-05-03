
const API_URL = `${ process.env.REACT_APP_API_URL }/v1/fcm`;

export const saveFcmToken = async (userId: string, token: string, fcmToken: string) => {
  return fetch(`${API_URL}/${userId}/fcm-token`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fcmToken }),
  });
};

export const deleteFcmToken = async (userId: string, token: string) => {
  return fetch(`${API_URL}/${userId}/fcm-token`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
