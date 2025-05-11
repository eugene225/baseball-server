
const API_URL = `${ process.env.REACT_APP_API_URL }/v1/fcm`;

export const saveFcmToken = async (userId: string, token: string, fcmToken: string, deviceType: string) => {
  return fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      fcmToken,
      deviceType
    }),
  });
};

export const getFcmToken = async (userId: string, token: string, deviceType: string) => {
  return fetch(`${API_URL}/token?userId=${userId}&deviceType=${deviceType}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFcmToken = async (userId: string, token: string, deviceType: string) => {
  return fetch(`${API_URL}/token?userId=${userId}&deviceType=${deviceType}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
