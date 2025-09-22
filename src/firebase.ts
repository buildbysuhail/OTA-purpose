import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyDew0yCTc27JJ-U-qIvmEhvZ-cY38Es4uc",
  authDomain: "polotest-8acab.firebaseapp.com",
  projectId: "polotest-8acab",
  storageBucket: "polotest-8acab.firebasestorage.app",
  messagingSenderId: "464969509116",
  appId: "1:464969509116:web:5a80ce61b4f7a766ae8f79",
  measurementId: "G-LDT01JMLWP",
};



export const VAPID_KEY = "BHTFUhjeaCEZgOx2tMPJQFROxkwqWgHLJtIe28GkGR1pzda2JPfd-BiSTLyhxMO81CZWtXhT5xhVZqlIli_ksxM";

export const app = initializeApp(firebaseConfig);

let messagingInstance: any = null;

export const getFcmMessaging = async () => {
  if (messagingInstance) {
    console.log('✅ Using cached messaging instance');
    return messagingInstance;
  }

  try {
    console.log('🔧 Setting up Firebase messaging...');
    console.log('User Agent:', navigator.userAgent);
    
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '0.0.0.0';
    const isWails = navigator.userAgent.includes('wv') || !!window.go?.main?.App;

    if (isLocalhost || isWails) {
      console.log(isLocalhost ? '🏠 Running on localhost' : '🖥️ Running in Wails WebView');
      console.log('Using direct messaging setup (no service worker)');
      try {
        const { getMessaging } = await import("firebase/messaging");
        messagingInstance = getMessaging(app);
        console.log('✅ Firebase messaging initialized (direct mode)');
        return messagingInstance;
      } catch (error) {
        console.error('❌ Direct messaging setup failed:', error);
        messagingInstance = null;
        return null;
      }
    }

    console.log('🌐 Production mode - setting up service worker...');
    
    // Clear existing registrations
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.scope.includes('firebase-cloud-messaging')) {
        console.log('🧹 Clearing existing FCM service worker');
        await registration.unregister();
      }
    }

    // Register service worker
    console.log('📝 Registering service worker...');
    const registration = await Promise.race([
      navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/firebase-cloud-messaging-push-scope',
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service worker registration timeout')), 10000)
      )
    ]) as ServiceWorkerRegistration;
    
    console.log('✅ Service Worker registered:', registration);

    // Initialize messaging
    console.log('🚀 Initializing Firebase messaging...');
    const { getMessaging } = await import("firebase/messaging");
    messagingInstance = getMessaging(app);
    
    console.log('✅ Firebase messaging initialized');
    return messagingInstance;
    
  } catch (error) {
    console.error('❌ Error setting up Firebase messaging:', error);
    
    // Fallback: try direct messaging without service worker
    console.log('🔄 Trying fallback messaging setup...');
    try {
      const { getMessaging } = await import("firebase/messaging");
      messagingInstance = getMessaging(app);
      console.log('✅ Fallback messaging initialized');
      return messagingInstance;
    } catch (fallbackError) {
      console.error('❌ Fallback messaging failed:', fallbackError);
      messagingInstance = null;
      return null;
    }
  }
};