import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { unstable_usePrompt as usePrompt } from 'react-router-dom';
import { isEqual } from 'lodash'; // For deep comparison
import { AccTransactionData, AccTransactionRow } from './acc-transaction-types';
import { isDirtyAccTransaction } from './functions';
import { useAppSelector } from '../../../utilities/hooks/useAppDispatch';
import { RootState } from '../../../redux/store';
import { customJsonParse } from '../../../utilities/jsonConverter';

/**
 * Custom hook to warn users about unsaved changes when navigating away.
 * @param initialState - The initial state of the form or component.
 * @param currentState - The current state of the form or component.
 */
export const useUnsavedChangesWarning = (currentState: any) => {

  const navigate = useNavigate();
  const location = useLocation();

  const formState = useAppSelector((state: RootState) => state.AccTransaction);

  // Handle browser navigation events (e.g., closing tab, refreshing)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const _prevState: { transaction: AccTransactionData; row: AccTransactionRow } = customJsonParse(atob(formState.prev))
      const keys = Object.keys(_prevState).length;
      const _isEqual = isEqual(_prevState, currentState);
  const _s_isDirty =
      _isEqual === false && // Explicitly check for `false`
      _prevState !== undefined && // Explicitly check not undefined
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
    const isOnAccountsRoute = location.pathname.includes('accounts/transactions');
const _s_isDirty =isDirtyAccTransaction(formState.prev, currentState);
    // usePrompt({when: isDirty, message: 'You have unsaved changes. Are you sure you want to leave?'});
    if (_s_isDirty && isOnAccountsRoute) {
      alert("SAveChanges")
      navigate(1)
    }
  }, [navigate]);

  return ;
};