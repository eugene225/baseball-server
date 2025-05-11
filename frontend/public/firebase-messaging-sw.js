importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC7BIbqMQz0VNsEcvZkHydMdPq68I3qpN4',
  authDomain: 'baseball-server.firebaseapp.com',
  projectId: 'baseball-server',
  messagingSenderId: '614956512934',
  appId: '1:614956512934:web:c34f0be5bf2e9d0a95e667',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const { title, body, icon, url } = payload.data || {};

  if (title && body) {
    self.registration.showNotification(title, {
      body,
      icon: icon || '/favicon-32x32.png',
      data: { url },
    });
  }
});

self.addEventListener('notificationclick', function (event) {
  const targetUrl = event.notification.data?.url;

  event.notification.close();

  if (targetUrl) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  }
});
