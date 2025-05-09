import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';

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
  try {
    const permission = await Notification.requestPermission();

    switch (permission) {
    case 'granted':
      try {
        // 기존 토큰 삭제
        await deleteToken(messaging);
        console.log('기존 FCM 토큰 삭제 완료');

        // 새로운 토큰 생성
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.getRegistration()
        });
        console.log('새로운 FCM 토큰 생성 완료');
        return { success: true, token };
      } catch (error) {
        console.error('FCM 토큰 생성 실패:', error);
        return {
          success: false,
          error: 'FCM 토큰 생성에 실패했습니다. 브라우저 설정을 확인해주세요.',
          details: error
        };
      }

    case 'denied':
      console.warn('FCM 권한이 거부되었습니다.');
      return {
        success: false,
        error: '알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요.',
        permission: 'denied'
      };

    case 'default':
      console.warn('FCM 권한 요청이 취소되었습니다.');
      return {
        success: false,
        error: '알림 권한 요청이 취소되었습니다. 알림을 받으려면 권한을 허용해주세요.',
        permission: 'default'
      };

    default:
      return {
        success: false,
        error: '알 수 없는 권한 상태입니다.',
        permission
      };
    }
  } catch (error) {
    console.error('FCM 권한 요청 중 오류 발생:', error);
    return {
      success: false,
      error: '알림 권한 요청 중 오류가 발생했습니다.',
      details: error
    };
  }
};

export const onForegroundMessage = (cb: (payload: any) => void) => {
  onMessage(messaging, cb);
};
