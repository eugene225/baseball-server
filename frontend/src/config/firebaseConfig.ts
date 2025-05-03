import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyC7BIbqMQz0VNsEcvZkHydMdPq68I3qpN4',
  authDomain: 'baseball-server.firebaseapp.com',
  projectId: 'baseball-server',
  messagingSenderId: '614956512934',
  appId: '1:614956512934:web:c34f0be5bf2e9d0a95e667',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 알림 권한 요청하고 토큰 받기
export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });
    console.log('FCM Token OK !');
    return token;
  } else {
    console.warn('FCM 권한 거부됨');
    return null;
  }
};

export const onForegroundMessage = (cb: (payload: any) => void) => {
  onMessage(messaging, cb);
};
