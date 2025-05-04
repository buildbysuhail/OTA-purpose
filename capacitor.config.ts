import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.polosys.app',
  appName: 'polosys-erp',
  webDir: 'build',
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,   // launch screen delay in ms
      "launchAutoHide": true,       // hide splash screen after launching
      "backgroundColor": "#ffffff", // background color of splash screen
      "androidScaleType": "CENTER_CROP",  // scaling for Android
      "showSpinner": false         // set to true if you want a spinner
    }
  }
};

export default config;
