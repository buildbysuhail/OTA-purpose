import { useEffect, useRef, useCallback } from 'react';
import { useAppState } from './useAppState';
import { useAppSelector } from './useAppDispatch';
import { RootState } from '../../redux/store';
import { registerModal, unregisterModal } from '../../Android/lib/backButton';

interface SwipeConfig {
  /** Minimum distance (px) to trigger swipe. Default: 40 */
  threshold?: number;
  /** Edge zone width (px) where swipe-to-open starts. Default: 40 */
  edgeWidth?: number;
  /** Maximum vertical movement allowed (px). Default: 100 */
  maxVerticalMovement?: number;
  /** Enable haptic feedback on Capacitor. Default: true */
  hapticFeedback?: boolean;
}

const SIDEBAR_MODAL_ID = 'app-sidebar';

/**
 * Hook to enable native-feeling edge swipe to open sidebar.
 *
 * LTR mode: Swipe RIGHT from LEFT edge to open
 * RTL mode: Swipe LEFT from RIGHT edge to open
 *
 * Also supports: Swipe on sidebar to close it
 */
export function useSidebarSwipe(config: SwipeConfig = {}) {
  const {
    threshold = 40,
    edgeWidth = 40,
    maxVerticalMovement = 100,
    hapticFeedback = true,
  } = config;

  const { appState, updateAppState } = useAppState();
  const deviceInfo = useAppSelector((state: RootState) => state.DeviceInfo);

  // Refs to track touch state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isEdgeSwipe = useRef(false);
  const isSidebarSwipe = useRef(false);
  const sidebarElement = useRef<HTMLElement | null>(null);

  // Check if sidebar is currently open
  const isSidebarOpen = appState.toggled === 'open';

  // Open sidebar
  const openSidebar = useCallback(() => {
    if (window.innerWidth <= 992) {
      updateAppState({ ...appState, toggled: 'open' });

      // Register sidebar with back button handler
      registerModal(SIDEBAR_MODAL_ID);

      // Show overlay
      setTimeout(() => {
        const overlay = document.querySelector('#responsive-overlay');
        if (overlay) {
          overlay.classList.add('active');
        }
      }, 50);

      // Haptic feedback
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  }, [appState, updateAppState, hapticFeedback]);

  // Close sidebar
  const closeSidebar = useCallback(() => {
    if (window.innerWidth <= 992) {
      updateAppState({ ...appState, toggled: 'close' });

      // Unregister sidebar from back button handler
      unregisterModal(SIDEBAR_MODAL_ID);

      // Hide overlay
      const overlay = document.querySelector('#responsive-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }

      // Haptic feedback
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  }, [appState, updateAppState, hapticFeedback]);

  // Handle back button event to close sidebar
  useEffect(() => {
    const handleBackButton = (event: CustomEvent<{ modalId?: string }>) => {
      if (event.detail?.modalId === SIDEBAR_MODAL_ID && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('capacitor-back-button', handleBackButton as EventListener);

    return () => {
      document.removeEventListener('capacitor-back-button', handleBackButton as EventListener);
    };
  }, [isSidebarOpen, closeSidebar]);

  // Sync modal registration with sidebar state
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 992) {
      registerModal(SIDEBAR_MODAL_ID);
    } else {
      unregisterModal(SIDEBAR_MODAL_ID);
    }

    return () => {
      unregisterModal(SIDEBAR_MODAL_ID);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    // Only enable on mobile devices
    if (!deviceInfo?.isMobile && window.innerWidth > 992) {
      return;
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchCurrentX.current = touch.clientX;

      const screenWidth = window.innerWidth;
      const isRTL = document.documentElement.dir === 'rtl';

      // Detect edge swipe for opening sidebar
      // LTR: Left edge (0 to edgeWidth)
      // RTL: Right edge (screenWidth - edgeWidth to screenWidth)
      const isLeftEdge = touch.clientX < edgeWidth;
      const isRightEdge = touch.clientX > screenWidth - edgeWidth;

      // For opening: detect the appropriate edge based on layout direction
      const isOpenEdge = isRTL ? isRightEdge : isLeftEdge;

      isEdgeSwipe.current = !isSidebarOpen && isOpenEdge;

      // Check if touch started on sidebar (for closing)
      sidebarElement.current = document.querySelector('.app-sidebar');
      if (isSidebarOpen && sidebarElement.current) {
        const sidebarRect = sidebarElement.current.getBoundingClientRect();
        // In LTR: sidebar is on left, so check if touch is within sidebar bounds
        // In RTL: sidebar is on right, so check if touch is within sidebar bounds
        if (isRTL) {
          isSidebarSwipe.current = touch.clientX >= sidebarRect.left;
        } else {
          isSidebarSwipe.current = touch.clientX <= sidebarRect.right;
        }
      } else {
        isSidebarSwipe.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isEdgeSwipe.current && !isSidebarSwipe.current) return;

      const touch = e.touches[0];
      touchCurrentX.current = touch.clientX;

      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // Cancel if vertical movement is too large (user is scrolling)
      if (deltaY > maxVerticalMovement) {
        isEdgeSwipe.current = false;
        isSidebarSwipe.current = false;
        return;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = touchCurrentX.current - touchStartX.current;
      const deltaY = Math.abs((e.changedTouches[0]?.clientY || 0) - touchStartY.current);

      // Check if it was a valid horizontal swipe
      if (deltaY <= maxVerticalMovement) {
        const isRTL = document.documentElement.dir === 'rtl';

        // Swipe directions
        const swipedRight = deltaX > threshold;  // Moved finger to the right
        const swipedLeft = deltaX < -threshold;  // Moved finger to the left

        // Open sidebar logic:
        // LTR: Swipe right (from left edge)
        // RTL: Swipe left (from right edge)
        const shouldOpen = isRTL ? swipedLeft : swipedRight;

        // Close sidebar logic:
        // LTR: Swipe left (on sidebar)
        // RTL: Swipe right (on sidebar)
        const shouldClose = isRTL ? swipedRight : swipedLeft;

        // Open sidebar from edge
        if (isEdgeSwipe.current && shouldOpen && !isSidebarOpen) {
          openSidebar();
        }

        // Close sidebar by swiping on it
        if (isSidebarSwipe.current && shouldClose && isSidebarOpen) {
          closeSidebar();
        }
      }

      // Reset state
      isEdgeSwipe.current = false;
      isSidebarSwipe.current = false;
      sidebarElement.current = null;
    };

    // Add listeners with passive: true for better scroll performance
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    deviceInfo?.isMobile,
    isSidebarOpen,
    threshold,
    edgeWidth,
    maxVerticalMovement,
    openSidebar,
    closeSidebar,
  ]);

  return {
    isSidebarOpen,
    openSidebar,
    closeSidebar,
  };
}

export default useSidebarSwipe;
