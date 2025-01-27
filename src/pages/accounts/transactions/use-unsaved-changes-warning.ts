import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { unstable_usePrompt as usePrompt } from 'react-router-dom';
import { isEqual } from 'lodash'; // For deep comparison
import { AccTransactionData, AccTransactionRow } from './acc-transaction-types';

/**
 * Custom hook to warn users about unsaved changes when navigating away.
 * @param initialState - The initial state of the form or component.
 * @param currentState - The current state of the form or component.
 */
export const useUnsavedChangesWarning = (currentState: any) => {

      const [prevState, setPrevState] = useState<{ transaction: AccTransactionData; row: AccTransactionRow }>();
  const navigate = useNavigate();

  // Handle browser navigation events (e.g., closing tab, refreshing)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const keys = Object.keys(prevState??{}).length;
      const _isEqual = isEqual(prevState, currentState);
  const _s_isDirty =
      _isEqual === false && // Explicitly check for `false`
      prevState !== undefined && // Explicitly check not undefined
      keys === 2; // Explicit strict equality
      // usePrompt({when: isDirty, message: 'You have unsaved changes. Are you sure you want to leave?'});
      if(_s_isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome and other browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Handle in-app navigation using React Router
  useEffect(() => {
    debugger;
    const keys = Object.keys(prevState??{}).length;
    const _isEqual = isEqual(prevState, currentState);
const _s_isDirty =
    _isEqual === false && // Explicitly check for `false`
    prevState !== undefined && // Explicitly check not undefined
    keys === 2; // Explicit strict equality
    // usePrompt({when: isDirty, message: 'You have unsaved changes. Are you sure you want to leave?'});
    if(_s_isDirty) {
      alert("SAveChanges")
      navigate(1)
    }
  }, [navigate]);

  return {setPrevState };
};