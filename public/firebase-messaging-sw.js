// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// const firebaseConfig = {
//   apiKey: "AIzaSyB8Y3mfWUGyxznD1USlKaQIt2JZKDvjtCs",
//   authDomain: "tttt-c6029.firebaseapp.com",
//   projectId: "tttt-c6029",
//   storageBucket: "tttt-c6029.firebasestorage.app",
//   messagingSenderId: "185898721418",
//   appId: "1:185898721418:web:9b555d98737ac42fbe8d73",
//   measurementId: "YOUR_MEASUREMENT_ID",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDew0yCTc27JJ-U-qIvmEhvZ-cY38Es4uc",
  authDomain: "polotest-8acab.firebaseapp.com",
  projectId: "polotest-8acab",
  storageBucket: "polotest-8acab.firebasestorage.app",
  messagingSenderId: "464969509116",
  appId: "1:464969509116:web:5a80ce61b4f7a766ae8f79",
  measurementId: "G-LDT01JMLWP",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Background Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
