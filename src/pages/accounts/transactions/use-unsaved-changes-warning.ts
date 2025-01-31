import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash';
import { customJsonParse, modelToBase64 } from '../../../utilities/jsonConverter';
import { AccTransactionData, AccTransactionRow } from './acc-transaction-types';
import { useAppSelector } from '../../../utilities/hooks/useAppDispatch';

export const useUnsavedChangesWarning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  const pendingLocation = useRef<string | null>(null);
  const currentPath = useRef(location.pathname);
  const isInitialMount = useRef(true);
  const navigationAttempted = useRef(false);
  const lastNavigationTime = useRef(Date.now());
  const _formState = useAppSelector(x => x.AccTransaction);

  const hasUnsavedChanges = useCallback(() => {
    try {
      debugger;
      if (!_formState || !_formState.prev) return false;
      const currentStateCompare = {
        transaction: _formState.transaction,
        row: _formState.row
      };
      if(!_formState) return false;

      const _prevState: {
        transaction: AccTransactionData;
        row: AccTransactionRow
      } = customJsonParse(atob(_formState.prev));

      if (!_prevState || Object.keys(_prevState).length !== 2) return false;

      const base64 = modelToBase64(currentStateCompare);
      const isEqual = _formState.prev === base64;
      console.log(`isEqual: ${isEqual}`);
      
      return !isEqual;
    } catch (error) {
      console.error('Error checking for unsaved changes:', error);
      return false;
    }
  }, [_formState]);

  // Handle page refresh and close
  useEffect(() => {
      debugger;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      debugger;
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
        setIsModalOpen(true);
        setIsLeavingPage(true);
        return '';
      }
    };

    const handleVisibilityChange = () => {
      debugger;
      if (document.visibilityState === 'hidden' && hasUnsavedChanges()) {
        // setIsModalOpen(true);
        setIsLeavingPage(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasUnsavedChanges]);

  // Prevent navigation attempts
  useEffect(() => {
    const blockNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isNavigationLink = target.tagName === 'A' ||
        target.closest('a') ||
        target.hasAttribute('href') ||
        target.role === 'link';

      if (isNavigationLink && hasUnsavedChanges()) {
        e.preventDefault();
        e.stopPropagation();
        const href = (target.closest('a')?.getAttribute('href') || target.getAttribute('href'));
        if (href) {
          pendingLocation.current = href;
        }
        setIsModalOpen(true);
        setIsLeavingPage(false);
      }
    };

    document.addEventListener('click', blockNavigation, true);
    return () => document.removeEventListener('click', blockNavigation, true);
  }, [hasUnsavedChanges]);

  // Handle history changes and location updates
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const now = Date.now();
    if (now - lastNavigationTime.current < 100) {
      return;
    }
    lastNavigationTime.current = now;

    if (location.pathname !== currentPath.current && !navigationAttempted.current) {
      if (hasUnsavedChanges()) {
        pendingLocation.current = location.pathname;
        navigationAttempted.current = true;
        window.history.pushState(null, '', currentPath.current);
        // setIsModalOpen(true);
        setIsLeavingPage(false);
        return;
      }
    }
  }, [location, hasUnsavedChanges]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        pendingLocation.current = window.location.pathname;
        window.history.pushState(null, '', currentPath.current);
        setIsModalOpen(true);
        setIsLeavingPage(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasUnsavedChanges]);

  const handleStay = useCallback(() => {
    setIsModalOpen(false);
    setIsLeavingPage(false);
    pendingLocation.current = null;
    navigationAttempted.current = false;
    window.history.pushState(null, '', currentPath.current);
  }, []);

  const handleLeave = useCallback(() => {
    if (isLeavingPage) {
      // If user is trying to refresh or close the page
      window.removeEventListener('beforeunload', () => { });
      window.location.reload();
      return;
    }

    const targetLocation = pendingLocation.current;
    setIsModalOpen(false);
    setIsLeavingPage(false);
    navigationAttempted.current = false;

    if (targetLocation) {
      setTimeout(() => {
        navigate(targetLocation);
      }, 0);
    }
    pendingLocation.current = null;
  }, [navigate, isLeavingPage]);

  // Reset navigation attempt flag when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      navigationAttempted.current = false;
    }
  }, [isModalOpen]);

  return {
    isModalOpen,
    handleStay,
    handleLeave,
    hasUnsavedChanges,
    isLeavingPage
  };
};