import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.polosys.app',
  appName: 'polosys-erp',
  webDir: 'dist',
  server: {
    url: 'http://192.168.20.3:5173', // your Vite Network IP
    cleartext: true
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
    },

    LiveUpdate: {
      appId: 'com.polosys.app',
      channel: 'development',
      autoUpdateStrategy: 'background',
      maxVersions: 2
    },

    // StatusBar Configuration
    // https://capacitorjs.com/docs/apis/status-bar
    // NOTE: Dynamic theme switching is handled in src/Android/lib/statusBar.ts
    StatusBar: {
      // overlaysWebView: false = Status bar has its own space (not overlay)
      // WebView content starts BELOW the status bar
      // NOTE: Not available on Android 15+ (system enforces edge-to-edge)
      overlaysWebView: false,

      // Style values (confusing naming!):
      // 'LIGHT' = DARK icons (for light backgrounds) - what we want
      // 'DARK'  = LIGHT icons (for dark backgrounds)
      // 'DEFAULT' = Follow system appearance
      style: 'LIGHT',

      // Solid white background ensures dark icons are visible (Android only)
      backgroundColor: '#FFFFFF'
    }
  },

  // iOS-specific configuration
  ios: {
    // Enables edge-to-edge content on iOS
    // Your app will extend under the status bar and home indicator
    contentInset: 'automatic',

    // Allow scrolling content to extend under bars
    allowsLinkPreview: true,

    // Use WKWebView (default, but explicit for clarity)
    preferredContentMode: 'mobile'
  },

  // Android-specific configuration
  android: {
    // Use edge-to-edge display mode
    // This allows your app to draw behind system bars
    backgroundColor: '#FFFFFF',

    // Allow mixed content for development server
    allowMixedContent: true
  }
};

export default config;
