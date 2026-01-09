/**
 * StatusBar Utility for Capacitor Apps
 * =====================================
 *
 * Uses the official Capacitor StatusBar API:
 * https://capacitorjs.com/docs/apis/status-bar
 *
 * IMPORTANT NOTES:
 * ================
 *
 * Style enum values:
 * - Style.Dark ('DARK')    = LIGHT colored icons (for DARK backgrounds)
 * - Style.Light ('LIGHT')  = DARK colored icons (for LIGHT backgrounds)
 * - Style.Default          = Follows device appearance settings
 *
 * NOTE: The naming is confusing! Style refers to the STATUS BAR style,
 * not the icon color. A "Dark" status bar has light icons.
 *
 * Platform Limitations:
 * - Android 15+: overlaysWebView and backgroundColor no longer work
 *   as the system enforces edge-to-edge display
 * - iOS: Requires UIViewControllerBasedStatusBarAppearance = YES in Info.plist
 *
 * SOLUTION FOR VISIBLE ICONS:
 * ===========================
 * Use overlaysWebView: FALSE on Android (pre-15). This gives the status bar
 * its own solid background color, ensuring icons are always visible.
 */

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Initialize status bar at app startup.
 * Sets up proper defaults for Android and iOS.
 */
export async function initializeStatusBar(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Set style first - Light style = dark icons for light backgrounds
    await StatusBar.setStyle({ style: Style.Light });

    if (Capacitor.getPlatform() === 'android') {
      // Use overlaysWebView: false so status bar has its own space
      // This ensures icons are always visible with solid background
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
    }

    await StatusBar.show();
    console.log('[StatusBar] Initialized successfully');
  } catch (error) {
    console.warn('[StatusBar] Initialization failed:', error);
  }
}

/**
 * Sets status bar for LIGHT theme screens (white/light backgrounds).
 * - Dark icons on white/light background
 * - Use this for main app screens with light headers
 */
export async function setLightStatusBar(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Style.Light = dark icons (for light backgrounds)
    await StatusBar.setStyle({ style: Style.Light });

    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }

    await StatusBar.show();
  } catch (error) {
    console.warn('[StatusBar] Failed to set light theme:', error);
  }
}

/**
 * Sets status bar for DARK theme screens (dark backgrounds).
 * - Light icons on dark background
 * - Use this for sidebar, login screens, dark mode
 *
 * @param backgroundColor - Background color for Android (default: #111c43)
 */
export async function setDarkStatusBar(backgroundColor: string = '#111c43'): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Style.Dark = light icons (for dark backgrounds)
    await StatusBar.setStyle({ style: Style.Dark });

    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: backgroundColor });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }

    await StatusBar.show();
  } catch (error) {
    console.warn('[StatusBar] Failed to set dark theme:', error);
  }
}

/**
 * Sets status bar with custom color matching your header.
 *
 * @param color - Header background color (hex, e.g. #3B82F6)
 * @param useLightIcons - true for light/white icons, false for dark icons
 */
export async function setStatusBarColor(color: string, useLightIcons: boolean = false): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Style.Dark = light icons, Style.Light = dark icons
    await StatusBar.setStyle({
      style: useLightIcons ? Style.Dark : Style.Light
    });

    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }

    await StatusBar.show();
  } catch (error) {
    console.warn('[StatusBar] Failed to set custom color:', error);
  }
}

/**
 * Sets status bar to transparent/overlay mode.
 * USE WITH CAUTION: Icons may become invisible on certain backgrounds!
 *
 * Only use this for:
 * - Camera preview screens
 * - Full-screen image galleries
 * - Immersive media players
 *
 * @param useLightIcons - true for light/white icons, false for dark icons
 */
export async function setTransparentStatusBar(useLightIcons: boolean = false): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({
      style: useLightIcons ? Style.Dark : Style.Light
    });

    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#00000000' });
      await StatusBar.setOverlaysWebView({ overlay: true });
    }

    await StatusBar.show();
  } catch (error) {
    console.warn('[StatusBar] Failed to set transparent theme:', error);
  }
}

/**
 * Sets status bar to follow device appearance (light/dark mode).
 * Uses Style.Default which automatically adapts to system theme.
 */
export async function setDefaultStatusBar(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: Style.Default });
    await StatusBar.show();
  } catch (error) {
    console.warn('[StatusBar] Failed to set default theme:', error);
  }
}

/**
 * Hides the status bar completely.
 */
export async function hideStatusBar(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.hide();
  } catch (error) {
    console.warn('[StatusBar] Failed to hide:', error);
  }
}

/**
 * Shows the status bar.
 */
export async function showStatusBar(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.show();
  } catch (error) {
    console.warn('[StatusBar] Failed to show:', error);
  }
}

/**
 * Gets current status bar information.
 * Returns visibility, style, color, and overlay status.
 */
export async function getStatusBarInfo() {
  if (!Capacitor.isNativePlatform()) {
    return { visible: true, style: 'LIGHT', color: '#FFFFFF', overlays: false };
  }

  try {
    return await StatusBar.getInfo();
  } catch (error) {
    console.warn('[StatusBar] Failed to get info:', error);
    return null;
  }
}

/**
 * Gets the current platform.
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (!Capacitor.isNativePlatform()) return 'web';
  return Capacitor.getPlatform() as 'ios' | 'android';
}

/**
 * Checks if running on a native platform.
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}
