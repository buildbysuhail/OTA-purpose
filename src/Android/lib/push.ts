// src/lib/push.ts
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
  PermissionStatus,
} from '@capacitor/push-notifications';

// Optional: Capawesome alternative for direct FCM token access
// import { FirebaseMessaging } from '@capacitor-firebase/messaging';

export async function registerPush(onToken?: (t: string) => void) {
  if (!Capacitor.isNativePlatform()) return;

  const permStatus: PermissionStatus = await PushNotifications.checkPermissions();
  if (permStatus.receive === 'prompt') {
    const req = await PushNotifications.requestPermissions();
    if (req.receive !== 'granted') return;
  } else if (permStatus.receive !== 'granted') {
    return;
  }

  await PushNotifications.register();

  PushNotifications.addListener('registration', (token: Token) => {
    // token.value is the FCM/APNs token depending on platform
    onToken?.(token.value);
  });

  PushNotifications.addListener('registrationError', (err) => {
    console.error('Push registration error', err);
  });

  PushNotifications.addListener(
    'pushNotificationReceived',
    (notification: PushNotificationSchema) => {
      // Foreground notification received
      console.log('Foreground push', notification);
    }
  );

  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (action: ActionPerformed) => {
      // Tapped a notification
      console.log('Notification action', action);
    }
  );

  // Alternative: Capawesome get FCM token explicitly
  // const { token } = await FirebaseMessaging.getToken();
  // onToken?.(token);
}
