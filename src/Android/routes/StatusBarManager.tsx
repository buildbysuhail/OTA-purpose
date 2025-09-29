// src/routes/StatusBarManager.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setLightStatusBar, setDarkStatusBar } from '../lib/statusBar';

export function StatusBarManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/login') || pathname.startsWith('/splash')) {
      setDarkStatusBar();
    } else {
      setLightStatusBar();
    }
  }, [pathname]);

  return null;
}
