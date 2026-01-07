// src/Android/lib/backButton.ts
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

let lastBackPress = 0;
const DOUBLE_PRESS_DELAY = 2000; // 2 seconds
let backButtonListenerRegistered = false;
let exitToastShown = false;

interface BackButtonConfig {
  onBackPressed?: () => boolean; // Return true to prevent default behavior
  showExitConfirmation?: boolean;
  exitConfirmationMessage?: string;
}

let currentConfig: BackButtonConfig = {
  showExitConfirmation: true,
  exitConfirmationMessage: 'Press back again to exit',
};

// Stack to track modal/popup states
const modalStack: string[] = [];

/**
 * Register a modal/popup that should be closed on back press
 */
export function registerModal(id: string): void {
  if (!modalStack.includes(id)) {
    modalStack.push(id);
  }
}

/**
 * Unregister a modal/popup
 */
export function unregisterModal(id: string): void {
  const index = modalStack.indexOf(id);
  if (index > -1) {
    modalStack.splice(index, 1);
  }
}

/**
 * Check if there are any open modals
 */
export function hasOpenModals(): boolean {
  return modalStack.length > 0;
}

/**
 * Get the topmost modal ID
 */
export function getTopModal(): string | undefined {
  return modalStack[modalStack.length - 1];
}

/**
 * Clear all modals from the stack
 */
export function clearModalStack(): void {
  modalStack.length = 0;
}

/**
 * Show a toast message for exit confirmation
 */
function showExitToast(message: string): void {
  if (exitToastShown) return;

  exitToastShown = true;

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'back-button-exit-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    z-index: 99999;
    animation: fadeInUp 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  toast.textContent = message;

  // Add animation keyframes if not already added
  if (!document.getElementById('back-button-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'back-button-toast-styles';
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      @keyframes fadeOutDown {
        from {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        to {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Remove toast after delay
  setTimeout(() => {
    toast.style.animation = 'fadeOutDown 0.3s ease-out forwards';
    setTimeout(() => {
      toast.remove();
      exitToastShown = false;
    }, 300);
  }, DOUBLE_PRESS_DELAY - 300);
}

/**
 * Handle the back button press
 */
async function handleBackButton(): Promise<void> {
  // Check if custom handler wants to handle this
  if (currentConfig.onBackPressed?.()) {
    return;
  }

  // Check for open modals/popups
  if (hasOpenModals()) {
    // Dispatch a custom event that modals can listen to
    const topModal = getTopModal();
    const event = new CustomEvent('capacitor-back-button', {
      detail: { modalId: topModal },
      bubbles: true,
    });
    document.dispatchEvent(event);
    return;
  }

  // Check if we can navigate back in browser history
  if (window.history.length > 1) {
    // Check if we're on the home/root path
    const isHomePage = window.location.pathname === '/' ||
                       window.location.pathname === '/dashboard' ||
                       window.location.pathname === '/login' ||
                       window.location.pathname === '/pos';

    if (!isHomePage) {
      window.history.back();
      return;
    }
  }

  // On home page - handle exit confirmation
  if (currentConfig.showExitConfirmation) {
    const now = Date.now();

    if (now - lastBackPress < DOUBLE_PRESS_DELAY) {
      // Double press detected - exit app
      await App.exitApp();
    } else {
      // First press - show confirmation
      lastBackPress = now;
      showExitToast(currentConfig.exitConfirmationMessage || 'Press back again to exit');
    }
  } else {
    // No confirmation needed - exit immediately
    await App.exitApp();
  }
}

/**
 * Initialize the Android back button handler
 */
export async function initBackButtonHandler(config?: BackButtonConfig): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('Back button handler: Not a native platform, skipping');
    return;
  }

  if (Capacitor.getPlatform() !== 'android') {
    console.log('Back button handler: Not Android, skipping');
    return;
  }

  if (backButtonListenerRegistered) {
    console.log('Back button handler: Already registered');
    return;
  }

  if (config) {
    currentConfig = { ...currentConfig, ...config };
  }

  try {
    // Listen for back button events
    await App.addListener('backButton', async (data: { canGoBack: boolean }) => {
      console.log('Back button pressed, canGoBack:', data.canGoBack);
      await handleBackButton();
    });

    backButtonListenerRegistered = true;
    console.log('Android back button handler initialized');
  } catch (error) {
    console.error('Failed to initialize back button handler:', error);
  }
}

/**
 * Update the back button configuration
 */
export function updateBackButtonConfig(config: Partial<BackButtonConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Set a custom back button handler
 */
export function setCustomBackHandler(handler: () => boolean): void {
  currentConfig.onBackPressed = handler;
}

/**
 * Remove the custom back button handler
 */
export function removeCustomBackHandler(): void {
  currentConfig.onBackPressed = undefined;
}
