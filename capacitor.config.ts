import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.polosys.app',
  appName: 'polosys-erp',
  webDir: 'build',

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
    },

    LiveUpdate: {
      appId: 'com.polosys.app',   // ✅ MUST match server metadata
      channel: 'development',     // ✅ MUST match server channel
      autoUpdateStrategy: 'background', // ✅ valid
      maxVersions: 2              // optional but recommended
    }
  }
};

export default config;
