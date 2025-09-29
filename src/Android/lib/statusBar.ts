// src/lib/statusBar.ts
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export async function setLightStatusBar() {
  if (!Capacitor.isNativePlatform()) return;
  // Dark icons on light background
  await StatusBar.setStyle({ style: Style.Dark });
  if (Capacitor.getPlatform() === 'android') {
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  }
}

export async function setDarkStatusBar() {
  if (!Capacitor.isNativePlatform()) return;
  // Light icons on dark background
  await StatusBar.setStyle({ style: Style.Light });
  if (Capacitor.getPlatform() === 'android') {
    await StatusBar.setBackgroundColor({ color: '#0D47A1' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  }
}
