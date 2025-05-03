import firebase from 'firebase/compat';

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC7BIbqMQz0VNsEcvZkHydMdPq68I3qpN4',
  authDomain: 'baseball-server.firebaseapp.com',
  projectId: 'baseball-server',
  storageBucket: 'baseball-server.firebasestorage.app',
  messagingSenderId: '614956512934',
  appId: '1:614956512934:web:c34f0be5bf2e9d0a95e667',
  measurementId: 'G-ZV2W2GJNC5'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/favicon-32x32.png', // 원하는 아이콘 경로로 변경
  });
});
