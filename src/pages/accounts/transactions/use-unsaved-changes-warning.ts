import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { customJsonParse, modelToBase64, modelToBase64Unicode } from '../../../utilities/jsonConverter';
import { AccTransactionData, AccTransactionRow } from './acc-transaction-types';
import { useAppSelector } from '../../../utilities/hooks/useAppDispatch';
import { useDispatch } from 'react-redux';
import { accFormStateHandleFieldChange } from './reducer';
import { setTransactionForHistory } from './functions';
import { history as _history } from '../../../history'

export const useUnsavedChangesWarning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  const pendingLocation = useRef<string | null>(null);
  const currentPath = useRef(location.pathname);
  const previousPath = useRef<string>(document.referrer || "/")
  const isInitialMount = useRef(true);
  const navigationAttempted = useRef(false);
  const lastNavigationTime = useRef(Date.now());
  const _formState = useAppSelector(x => x.AccTransaction);
  const dispatch = useDispatch();

  // const hasUnsavedChanges = useCallback(() => {
  //   try {
  //     if (!_formState || !_formState.prev) return false;
  //     const currentStateCompare = {
  //       transaction: _formState.transaction,
  //       row: _formState.row
  //     };
  //     if (!_formState) return false;

  //     const _prevState: {
  //       transaction: AccTransactionData;
  //       row: AccTransactionRow
  //     } = customJsonParse(atob(_formState.prev));

  //     if (!_prevState || Object.keys(_prevState).length !== 2) return false;

  //     const base64 = modelToBase64(currentStateCompare);
  //     const isEqual = _formState.prev === base64;
  //     console.log(`isEqual: ${isEqual}`);

  //     return !isEqual;
  //   } catch (error) {
  //     console.error('Error checking for unsaved changes:', error);
  //     return false;
  //   }
  // }, [_formState]);

  const hasUnsavedChanges = useCallback(async () => {
    try {
      if (!_formState || !_formState.prev) return false;
      
      const currentStateCompare = {
        transaction: _formState.transaction,
        row: _formState.row
      };
  
      if (!_formState) return false;
  
      const _prevState = await new Promise((resolve, reject) => {
        try {
          resolve(customJsonParse(atob(_formState.prev)));
        } catch (error) {
          reject(error);
        }
      });
  
      if (!_prevState || Object.keys(_prevState).length !== 2) return false;
  
      const base64 = await modelToBase64Unicode(setTransactionForHistory(currentStateCompare));
      const isEqual = _formState.prev === base64;
      console.log(`isEqual fgfgdf: ${isEqual}`);
      
  
      return !isEqual;
    } catch (error) {
      console.error('Error checking for unsaved changes:', error);
      return false;
    }
  }, [_formState]);
  

  // Handle page refresh and close
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // const unsavedChanges = await hasUnsavedChanges();
      hasUnsavedChanges().then((unsavedChanges) => {
        console.log("Unsaved changes 88: ", unsavedChanges);
           // Should hit here if executed
        if (unsavedChanges) {
          e.preventDefault();
          e.returnValue = '';
          // setIsModalOpen(true);
          setIsLeavingPage(true);
          console.log('1');
          
          return '';
        }
     }).catch(error => console.error(error));
      
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Prevent navigation attempts
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // const unsavedChanges = await hasUnsavedChanges();
      hasUnsavedChanges().then((unsavedChanges) => {
        console.log("Unsaved changes 114: ", unsavedChanges);
         // Should hit here if executed
        if (unsavedChanges) {
          e.preventDefault();
          e.returnValue = '';
          // setIsModalOpen(true);
          setIsLeavingPage(true);
          console.log('1');
          
          return '';
        }
     }).catch(error => console.error(error));
      
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  useEffect(() => {
    
    const blockNavigation = async (e: MouseEvent) => {
      debugger
      const target = e.target as any;
      const isNavigationLink =
      target?.tagName === "a" ||
      target?.tagName === "A" ||
        target?.closest("a") ||
        target?.hasAttribute("href") ||
        target?.role === "link" ;
        console.log("🔹 Clicked Element:", target);
        console.log("🔹 Tag Name:", target?.tagName);
        console.log("🔹 Attributes:", target?.attributes);
        console.log("🔹 Role:", target?.getAttribute("role"));
        console.log("🔹 Closest <a>:", target?.closest("a"));
        console.log("🔹 Closest [role='link']:", target?.closest("[role='link']"));
        console.log("🔹 Closest [role='button']:", target?.closest("[role='button']"));
        console.log("🔹 Closest [href]:", target?.closest("[href]"));
      if (isNavigationLink) {
        // const unsavedChanges = await hasUnsavedChanges();
        hasUnsavedChanges().then((unsavedChanges) => {
          if (unsavedChanges) {
            e.preventDefault();
            e.stopPropagation();
            console.log('3');
            
            const href = (target?.closest('a')?.getAttribute('href') || target?.getAttribute('href'));
            if (href) {
              console.log('4');
              
              pendingLocation.current = href;
            }
            setIsModalOpen(true);
            setIsLeavingPage(false);
            
        previousPath.current = window.location.pathname;
          }
       }).catch(error => console.error(error));
        
      }
    };
  
    document.addEventListener('click', blockNavigation, true);
    return () => document.removeEventListener('click', blockNavigation, true);
  }, [hasUnsavedChanges]);

  // Handle history changes and location updates
  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     console.log('5');
      
  //     isInitialMount.current = false;
  //     return;
  //   }
  
  //   const now = Date.now();
  //   if (now - lastNavigationTime.current < 100) {
  //     console.log('6');
      
  //     return;
  //   }
  //   lastNavigationTime.current = now;
  
  //   if (location.pathname !== currentPath.current && !navigationAttempted.current) {
  //     console.log('7');
      
  //     hasUnsavedChanges().then((unsavedChanges) => {
  //       if (unsavedChanges) {
  //         console.log('8');
          
  //         pendingLocation.current = location.pathname;
  //         navigationAttempted.current = true;
  //         // window.history.pushState(null, '', currentPath.current);
  //         setIsLeavingPage(false);
  //       }
  //     });
  //   }
  // }, [location, hasUnsavedChanges]);

  // Handle browser back/forward buttons
  // useEffect(() => {
  //   const handlePopState = async (e: PopStateEvent) => {
  //     console.log('9');
      
  //     debugger;
  //     const unsavedChanges = await hasUnsavedChanges();
  //     // hasUnsavedChanges().then((unsavedChanges) => {
  //       console.log("Unsaved changes: 213 ", unsavedChanges);
  //        // Should hit here if executed
  //       if (unsavedChanges) {
  //       //   e.preventDefault();
  //       // console.log("window.location.pathname ", window.location.pathname);
  //       // console.log("currentPath.current ", currentPath.current);
  //       //   pendingLocation.current = `/accounts/transactions/${_formState.transactionType}`;
  //       //   window.history.pushState(null, '', `/accounts/transactions/${_formState.transactionType}`);
  //       //   setIsModalOpen(true);
  //       //   setIsLeavingPage(false);
  //       window.history.pushState(null, '', `/accounts/transactions/${_formState.transactionType}`);
  //       }
  //   //  }).catch(error => console.error(error));
      
  //   };
  
  //   window.addEventListener('popstate', handlePopState);
  //   return () => window.removeEventListener('popstate', handlePopState);
  // }, [hasUnsavedChanges]);
  // useEffect(() => {
  //   const handlePopState = async (e: PopStateEvent) => {
  //     const nextPath = e.state?.path || window.location.pathname || "/"; // Get next path from history

  //     const unsavedChanges = await hasUnsavedChanges();
  // debugger;
  //     if (unsavedChanges) {
  //       debugger;
  //       // Re-push the same state to prevent navigation
  //       window.history.pushState(null, '', window.location.href);
  //       // pendingLocation.current = `/accounts/transactions/${_formState.transactionType}`;
  //       setIsLeavingPage(false);
  //       setIsModalOpen(true);
  //     }
      
  //     previousPath.current = nextPath;
  //   };
  
  //   // Push an initial state when the component mounts
  //   window.history.pushState(null, '', window.location.href);
  
  //   // Listen for back/forward button events
  //   window.addEventListener('popstate', handlePopState);
  
  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [hasUnsavedChanges]);

  useEffect(() => {
    const unlisten = _history.listen(({ action, location: newLocation }) => {
      debugger;
      if (action === 'POP' || action === 'PUSH' || action === 'REPLACE') {
        const intendedPath = location.pathname ==  newLocation.pathname ? pendingLocation.current: newLocation.pathname;

        hasUnsavedChanges().then((unsavedChanges) => {
          debugger
          if (unsavedChanges) {
            debugger;
            // Re-push the same state to prevent navigation
            window.history.pushState(null, '', `/accounts/transactions/${_formState.transactionType}`);
            // pendingLocation.current = `/accounts/transactions/${_formState.transactionType}`;
            setIsLeavingPage(false);
            setIsModalOpen(true);
            pendingLocation.current = intendedPath == null ? pendingLocation.current: intendedPath;
          } else {
            // If no unsaved changes, allow navigation and update the previousPath ref
            pendingLocation.current = intendedPath == null ? pendingLocation.current: intendedPath;
          }
        }).catch((error) => console.error(error));
      }
    });

    // Cleanup: Stop listening when the component unmounts
    return () => unlisten();
  }, [hasUnsavedChanges]);

  const handleStay = useCallback(() => {
    console.log('10');
    
    setIsModalOpen(false);
    setIsLeavingPage(false);
    // pendingLocation.current = null;
    navigationAttempted.current = false;
    // window.history.pushState(null, '', currentPath.current);
  }, []);

  const handleLeave = useCallback(() => {
    console.log('11');
    debugger;
    if (isLeavingPage) {
      
      console.log('12');
      // If user is trying to refresh or close the page
      window.removeEventListener('beforeunload', () => { });
      window.location.reload();
      return;
    }

    const targetLocation = pendingLocation.current;
    setIsModalOpen(false);
    setIsLeavingPage(false);
    navigationAttempted.current = false;

    // Dispatch action to reset formState.prev before navigating
    dispatch(accFormStateHandleFieldChange({fields: {prev: undefined}}));

    if (targetLocation) {
      console.log('13');
      
      setTimeout(() => {
        navigate(targetLocation);
      }, 0);
    }
    console.log('14');
    
    pendingLocation.current = null;
  }, [navigate, isLeavingPage, dispatch]);

  // Reset navigation attempt flag when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      console.log('15');
      
      navigationAttempted.current = false;
    }
  }, [isModalOpen]);

  return {
    isModalOpen,
    handleStay,
    handleLeave,
    hasUnsavedChanges,
    isLeavingPage,
    setIsModalOpen
  };
};