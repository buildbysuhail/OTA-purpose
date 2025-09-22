 import { getFcmMessaging, VAPID_KEY } from "./firebase";

  declare global {
    interface Window {
      go?: {
        main?: {
          App?: {
            Notify: (title: string, message: string) => Promise<void>;
          };
        };
      };
    }
  }

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
      if (this.isInitialized) {
        console.log('✅ Already initialized, returning cached token:', this.fcmToken);
        return this.fcmToken;
      }

      try {
        const messaging = await getFcmMessaging();
        if (!messaging) {
          console.log('❌ Firebase messaging not available');
          this.isInitialized = true;
          return null;
        }

        console.log('🔐 Requesting notification permission...');
        if (Notification.permission !== "granted") {
          const permission = await withTimeout(Notification.requestPermission(), 5000);
          if (permission !== 'granted') {
            console.log('❌ Notification permission denied:', permission);
            this.isInitialized = true;
            return null;
          }
        }
        console.log('✅ Notification permission granted');

        const { getToken, onMessage } = await import("firebase/messaging");
        
        console.log('🎫 Getting FCM token...');
        let token = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts && !token) {
          attempts++;
          console.log(`🔄 Token attempt ${attempts}/${maxAttempts}`);
          try {
            const timeoutMs = window.location.hostname === 'localhost' ? 8000 : 15000;
            token = await withTimeout(getToken(messaging, { vapidKey: VAPID_KEY }), timeoutMs);
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
        }

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

    async notify(title: string, body: string) {
      console.log('🔔 Showing notification:', title, body);
      if (window.go?.main?.App?.Notify) {
        console.log('📱 Using Wails Go backend notification (fallback)');
        try {
          await window.go.main.App.Notify(title, body);
        } catch (err) {
          console.error('❌ Wails notification error:', err);
          if (Notification.permission === "granted") {
            console.log('🌐 Falling back to web notification');
            new Notification(title, { body });
          }
        }
      } else if (Notification.permission === "granted") {
        console.log('🌐 Using web notification (FCM)');
        new Notification(title, { body });
      } else {
        console.warn("⚠️ No notification method available");
      }
    },
  };