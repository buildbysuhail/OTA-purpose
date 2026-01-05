// src/lib/statusBar.ts
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Sets status bar to light theme: white background with dark icons
 * This is the default style for most app screens
 */
export async function setLightStatusBar() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Style.Dark = dark icons (for light backgrounds)
    await StatusBar.setStyle({ style: Style.Dark });

    if (Capacitor.getPlatform() === 'android') {
      // Set white background color
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      // Don't overlay WebView - status bar has its own space
      await StatusBar.setOverlaysWebView({ overlay: false });
    }

    // Ensure status bar is visible
    await StatusBar.show();
  } catch (error) {
    console.warn('Failed to set light status bar:', error);
  }
}

/**
 * Sets status bar to dark theme: dark background with light icons
 * Used for login/splash screens
 */
export async function setDarkStatusBar() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Style.Light = light icons (for dark backgrounds)
    await StatusBar.setStyle({ style: Style.Light });

    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#0D47A1' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }

    await StatusBar.show();
  } catch (error) {
    console.warn('Failed to set dark status bar:', error);
  }
}

/**
 * Sets status bar to transparent with dark icons
 * Used for scanner overlay where camera preview is visible
 */
export async function setTransparentStatusBar() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: Style.Dark });

    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#00000000' }); // Transparent
      await StatusBar.setOverlaysWebView({ overlay: true });
    }
  } catch (error) {
    console.warn('Failed to set transparent status bar:', error);
  }
}

/**
 * Hides the status bar completely
 */
export async function hideStatusBar() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.hide();
  } catch (error) {
    console.warn('Failed to hide status bar:', error);
  }
}

/**
 * Shows the status bar
 */
export async function showStatusBar() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.show();
  } catch (error) {
    console.warn('Failed to show status bar:', error);
  }
}
