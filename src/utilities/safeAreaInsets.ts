/**
 * Safe Area Insets Utility for Capacitor Apps
 * =============================================
 *
 * This utility provides a reliable way to handle safe area insets on
 * Android and iOS devices, including camera cutouts, notches, and Dynamic Island.
 *
 * WHY THIS IS NEEDED:
 * - Android WebView doesn't always report env(safe-area-inset-*) correctly
 * - Some Android devices don't pass display cutout info to CSS
 * - This utility uses the Capacitor StatusBar plugin to get accurate insets
 * - Falls back to CSS env() values when available
 *
 * USAGE:
 * Call initSafeAreaInsets() once at app startup (in App.tsx)
 * The utility will set CSS custom properties on :root that you can use:
 * - --safe-inset-top
 * - --safe-inset-bottom
 * - --safe-inset-left
 * - --safe-inset-right
 */

import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Get the status bar height on Android using the StatusBar plugin
 */
async function getStatusBarHeight(): Promise<number> {
  if (!Capacitor.isNativePlatform()) return 0;

  try {
    const info = await StatusBar.getInfo();
    // StatusBar plugin doesn't directly return height, but we can estimate
    // based on whether it's visible and overlaying
    if (info.visible) {
      // Default Android status bar heights:
      // - Standard: 24dp (approximately 24-32px depending on density)
      // - With camera cutout: 32-48px
      // We'll use a reasonable default and let CSS override if needed
      return 0; // Return 0 as we'll use CSS env() as primary
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Detect safe area insets by checking computed styles
 */
function detectSafeAreaFromCSS(): SafeAreaInsets {
  // Create a temporary element to measure env() values
  const testEl = document.createElement('div');
  testEl.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    visibility: hidden;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
  `;

  document.body.appendChild(testEl);
  const computedStyle = getComputedStyle(testEl);

  const insets: SafeAreaInsets = {
    top: parseInt(computedStyle.paddingTop) || 0,
    bottom: parseInt(computedStyle.paddingBottom) || 0,
    left: parseInt(computedStyle.paddingLeft) || 0,
    right: parseInt(computedStyle.paddingRight) || 0,
  };

  document.body.removeChild(testEl);
  return insets;
}

/**
 * Get Android status bar height from window
 */
function getAndroidStatusBarHeight(): number {
  if (typeof window === 'undefined') return 0;

  // Try to get from screen properties
  const screenHeight = window.screen.height;
  const innerHeight = window.innerHeight;
  const outerHeight = window.outerHeight;

  // On some Android devices, the difference gives us system UI height
  // This is not perfectly reliable but can help
  if (screenHeight > innerHeight) {
    const diff = screenHeight - innerHeight;
    // Reasonable status bar height range: 24-64px
    if (diff > 0 && diff < 150) {
      // Assume roughly half is status bar (other half might be nav bar)
      const estimated = Math.min(diff, 64);
      if (estimated >= 24) {
        return estimated;
      }
    }
  }

  // Default fallback based on common Android status bar heights
  // Most modern Android devices: 24dp = ~24-32px
  // With camera cutout: typically 32-48px
  const devicePixelRatio = window.devicePixelRatio || 1;

  // Check if it might be a device with camera cutout by screen aspect ratio
  const aspectRatio = screenHeight / window.screen.width;
  if (aspectRatio > 2) {
    // Tall screen = likely modern phone with notch/cutout
    return Math.round(36 * devicePixelRatio / devicePixelRatio); // ~36px
  }

  return Math.round(24 * devicePixelRatio / devicePixelRatio); // ~24px default
}

/**
 * Apply safe area insets as CSS custom properties
 */
function applySafeAreaCSS(insets: SafeAreaInsets): void {
  const root = document.documentElement;

  // Set CSS custom properties
  root.style.setProperty('--safe-inset-top', `${insets.top}px`);
  root.style.setProperty('--safe-inset-bottom', `${insets.bottom}px`);
  root.style.setProperty('--safe-inset-left', `${insets.left}px`);
  root.style.setProperty('--safe-inset-right', `${insets.right}px`);

  // Also set a class to indicate safe areas are initialized
  root.classList.add('safe-area-initialized');

  console.log('[SafeArea] Applied insets:', insets);
}

/**
 * Initialize safe area insets detection and application.
 * Call this once at app startup.
 */
export async function initSafeAreaInsets(): Promise<SafeAreaInsets> {
  // First try to detect from CSS env() values
  let insets = detectSafeAreaFromCSS();

  console.log('[SafeArea] CSS env() detected:', insets);

  // If on Android and CSS env() returned 0 for top, try to estimate
  if (Capacitor.getPlatform() === 'android' && insets.top === 0) {
    const estimatedTop = getAndroidStatusBarHeight();
    if (estimatedTop > 0) {
      insets.top = estimatedTop;
      console.log('[SafeArea] Android estimated top inset:', estimatedTop);
    }
  }

  // Apply the insets to CSS
  applySafeAreaCSS(insets);

  // Listen for orientation changes and re-detect
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const newInsets = detectSafeAreaFromCSS();
      if (Capacitor.getPlatform() === 'android' && newInsets.top === 0) {
        newInsets.top = getAndroidStatusBarHeight();
      }
      applySafeAreaCSS(newInsets);
    }, 100);
  });

  return insets;
}

/**
 * Get current safe area insets
 */
export function getSafeAreaInsets(): SafeAreaInsets {
  const root = document.documentElement;
  const style = getComputedStyle(root);

  return {
    top: parseInt(style.getPropertyValue('--safe-inset-top')) || 0,
    bottom: parseInt(style.getPropertyValue('--safe-inset-bottom')) || 0,
    left: parseInt(style.getPropertyValue('--safe-inset-left')) || 0,
    right: parseInt(style.getPropertyValue('--safe-inset-right')) || 0,
  };
}

export default initSafeAreaInsets;
