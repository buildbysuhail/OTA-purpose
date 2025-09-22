// src/NotificationService.ts
import { getFcmMessaging, isWeb, VAPID_KEY } from "./firebase";

declare global {
  interface Window {
    Wails?: {
      Notify: (title: string, message: string) => void;
    };
    go?: any; // for Wails bridge
  }
}

// Helper function to add timeout to promises
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export const NotificationService = {
  fcmToken: null as string | null,
  isInitialized: false,

  async init() {
    console.log('🔄 Initializing NotificationService...');
    console.log('Environment check - isWeb:', isWeb);
    console.log('Wails detected:', !!window.Wails);
    console.log('Localhost detected:', window.location.hostname === 'localhost');
    
    if (this.isInitialized) {
      console.log('✅ Already initialized, returning cached token:', this.fcmToken);
      return this.fcmToken;
    }
    
    if (isWeb) {
      try {
        const messaging = await getFcmMessaging();
        if (!messaging) {
          console.log('❌ Firebase messaging not available');
          this.isInitialized = true;
          return null;
        }

        // Request notification permission
        console.log('🔐 Requesting notification permission...');
        if (Notification.permission !== "granted") {
          const permission = await withTimeout(
            Notification.requestPermission(), 
            5000
          );
          if (permission !== 'granted') {
            console.log('❌ Notification permission denied:', permission);
            this.isInitialized = true;
            return null;
          }
        }
        console.log('✅ Notification permission granted');

        // Import Firebase functions
        const { getToken, onMessage } = await import("firebase/messaging");
        
        // Get FCM token with retries
        console.log('🎫 Getting FCM token...');
        let token = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts && !token) {
          attempts++;
          console.log(`🔄 Token attempt ${attempts}/${maxAttempts}`);
          
          try {
            // Use shorter timeout for localhost
            const timeoutMs = window.location.hostname === 'localhost' ? 8000 : 15000;
            
            token = await withTimeout(
              getToken(messaging, { vapidKey: VAPID_KEY }), 
              timeoutMs
            );
            
            if (token) {
              console.log("✅ FCM Token received:", token.substring(0, 20) + "...");
              this.fcmToken = token;
              break;
            }
          } catch (error) {
            console.error(`❌ Token attempt ${attempts} failed:`, error);
            
            if (attempts < maxAttempts) {
              console.log(`⏳ Waiting 1 second before retry...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

        if (!token) {
          console.error('❌ Failed to get FCM token after all attempts');
          // Don't fail completely - still set up message listener
        }

        // Set up message listener regardless of token status
        console.log('📨 Setting up message listener...');
        try {
          onMessage(messaging, (payload) => {
            console.log('📨 Foreground message received:', payload);
            const title = payload.notification?.title || "Notification";
            const body = payload.notification?.body || "";
            NotificationService.notify(title, body);
          });
          console.log('✅ Message listener set up successfully');
        } catch (listenerError) {
          console.error('❌ Failed to set up message listener:', listenerError);
        }

        this.isInitialized = true;
        return token;

      } catch (err) {
        console.error("❌ FCM initialization error:", err);
        this.isInitialized = true;
        return null;
      }
    } else {
      console.log("🖥️ Running in Wails desktop, skipping FCM setup.");
      this.isInitialized = true;
      return null;
    }
  },

  getToken() {
    return this.fcmToken;
  },

  async refreshToken() {
    console.log('🔄 Refreshing FCM token...');
    this.isInitialized = false;
    this.fcmToken = null;
    return await this.init();
  },

  notify(title: string, body: string) {
    console.log('🔔 Showing notification:', title, body);
    
    // Try Wails Go backend first
    if (window.go?.main?.App?.Notify) {
      console.log('📱 Using Wails Go backend notification');
      window.go.main.App.Notify(title, body);
    } else if (window.Wails?.Notify) {
      console.log('📱 Using Wails frontend notification');
      window.Wails.Notify(title, body);
    } else if (isWeb && Notification.permission === "granted") {
      console.log('🌐 Using web notification');
      new Notification(title, { body });
    } else {
      console.warn("⚠️ No notification method available");
    }
  },
};
