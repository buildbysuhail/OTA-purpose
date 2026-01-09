/**
 * StatusBarManager Component
 * ==========================
 *
 * Manages status bar appearance based on:
 * 1. Current route (login = dark, others = light)
 * 2. Sidebar visibility (when sidebar is open, use dark status bar)
 *
 * The status bar color changes to match the visible UI element:
 * - White header visible → White status bar + dark icons
 * - Dark sidebar visible → Dark status bar + light icons
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setLightStatusBar, setDarkStatusBar } from '../lib/statusBar';
import { RootState } from '../../redux/store';

// Routes that should ALWAYS have dark status bar (light icons on dark background)
const DARK_STATUS_BAR_ROUTES = ['/login', '/splash'];

// Your sidebar dark background color (must match CSS)
const SIDEBAR_DARK_COLOR = '#111c43';

export function StatusBarManager() {
  const { pathname } = useLocation();

  // Get sidebar toggle state from Redux
  const appState = useSelector((state: RootState) => state.AppState?.appState);
  const isSidebarOpen = appState?.toggled === 'open';

  useEffect(() => {
    // Check if we're on a route that requires dark status bar
    const isOnDarkRoute = DARK_STATUS_BAR_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    if (isOnDarkRoute) {
      // Dark route (login, splash) - use dark status bar
      setDarkStatusBar(SIDEBAR_DARK_COLOR);
    } else if (isSidebarOpen) {
      // Sidebar is open - match the dark sidebar background
      setDarkStatusBar(SIDEBAR_DARK_COLOR);
    } else {
      // Default - white status bar with dark icons
      setLightStatusBar();
    }
  }, [pathname, isSidebarOpen]);

  // Initial setup on mount
  useEffect(() => {
    setLightStatusBar();
  }, []);

  return null;
}

/**
 * Hook to manually control status bar from any component.
 * Use this when you need to change status bar in response to UI events.
 */
export function useStatusBar() {
  return {
    setLight: () => setLightStatusBar(),
    setDark: (bgColor?: string) => setDarkStatusBar(bgColor),
  };
}
