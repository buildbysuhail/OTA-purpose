// src/routes/StatusBarManager.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setLightStatusBar, setDarkStatusBar } from '../lib/statusBar';

// Routes that should have dark status bar (light icons on dark background)
const DARK_STATUS_BAR_ROUTES = ['/login', '/splash'];

export function StatusBarManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldUseDarkStatusBar = DARK_STATUS_BAR_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    if (shouldUseDarkStatusBar) {
      setDarkStatusBar();
    } else {
      // Default: white background with dark icons
      setLightStatusBar();
    }
  }, [pathname]);

  // Also set light status bar on initial mount
  useEffect(() => {
    setLightStatusBar();
  }, []);

  return null;
}
