import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  customJsonParse,
  modelToBase64,
  modelToBase64Unicode,
} from "../utilities/jsonConverter";
import { AccTransactionData, AccTransactionRow } from "./accounts/transactions/acc-transaction-types";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
import { useDispatch } from "react-redux";
import { accFormStateHandleFieldChange } from "./accounts/transactions/reducer";
import { history as _history } from "../history";
import { setTransactionForHistory } from "../helpers/transaction-modified-util";

export const useUnsavedChangesWarning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  const pendingLocation = useRef<string | null>(null);
  const currentPath = useRef(location.pathname);
  const previousPath = useRef<string>(document.referrer || "/");
  const isInitialMount = useRef(true);
  const navigationAttempted = useRef(false);
  const lastNavigationTime = useRef(Date.now());
    const _accFormState = useAppSelector((x) => x.AccTransaction);
  const _invFormState = useAppSelector((x) => x.InventoryTransaction);
  const dispatch = useDispatch();

  // Determine which form state to use based on flags
  // Determine which form state to use based on flags
  const _formState = useMemo(() => {
    // First check if flags explicitly indicate which state to use
    if ((_accFormState as any)?.isAcc === true) return _accFormState as any;
    if ((_invFormState as any)?.isInv === true) return _invFormState as any;
    
    // Fallback: use whichever state has data
    if ((_accFormState as any)?.prev || (_accFormState as any)?.transaction) return _accFormState as any;
    if ((_invFormState as any)?.prev || (_invFormState as any)?.transaction) return _invFormState as any;
    
    // Last resort: return the first non-null state
    return (_accFormState as any) || (_invFormState as any) || null;
  }, [_accFormState, _invFormState]);

  // Determine transaction type for navigation
  const getTransactionType = useCallback(() => {
    if (_accFormState?.isAcc) {
      return _accFormState.transactionType;
    }
    if (_invFormState?.isInv) {
      return _invFormState.transactionType;
    }
    return null;
  }, [_accFormState, _invFormState]);

  // Determine the base path for navigation
  const getBasePath = useCallback(() => {
    if (_accFormState?.isAcc) {
      return '/accounts/transactions';
    }
    if (_invFormState?.isInv) {
      return '/inventory/transactions'; // Adjust this path as needed
    }
    return '/';
  }, [_accFormState, _invFormState]);
  const hasUnsavedChanges = useCallback(async () => {
    
    try {
      if (!_formState || !_formState.prev) return false;

      const currentStateCompare = {
        transaction: _formState.transaction,
        row: _formState.row,
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

      const base64 = await modelToBase64Unicode(
        setTransactionForHistory(currentStateCompare)
      );
      const isEqual = _formState.prev === base64;
      console.log(`isEqual fgfgdf: ${isEqual}`);

      return !isEqual;
    } catch (error) {
      console.error("Error checking for unsaved changes:", error);
      return false;
    }
  }, [_formState]);

  // Handle page refresh and close
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // const unsavedChanges = await hasUnsavedChanges();
      hasUnsavedChanges()
        .then((unsavedChanges) => {
          console.log("Unsaved changes 88: ", unsavedChanges);
          // Should hit here if executed
          if (unsavedChanges) {
            e.preventDefault();
            e.returnValue = "";
            // setIsModalOpen(true);
            setIsLeavingPage(true);
            console.log("1");

            return "";
          }
        })
        .catch((error) => console.error(error));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Prevent navigation attempts
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // const unsavedChanges = await hasUnsavedChanges();
      hasUnsavedChanges()
        .then((unsavedChanges) => {
          console.log("Unsaved changes 114: ", unsavedChanges);
          // Should hit here if executed
          if (unsavedChanges) {
            e.preventDefault();
            e.returnValue = "";
            // setIsModalOpen(true);
            setIsLeavingPage(true);
            console.log("1");

            return "";
          }
        })
        .catch((error) => console.error(error));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const blockNavigation = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const closestAnchor = target?.closest("a") as HTMLElement | null;

      let isNavigationLink = false;

      if (target) {
        const tagName = target.tagName.toLowerCase();
        const closestTag = closestAnchor?.tagName.toLowerCase();

        const isDirectLink = tagName === "a";
        const isClosestLink = !!closestAnchor && closestTag === "a";
        const hasHref = target.hasAttribute("href");
        const hasLinkRole = target.getAttribute("role") === "link";
        const isPopupType = (target as any).type === "popup";
        const isClosestPopup = (closestAnchor as any)?.type === "popup";

        if (
          (isDirectLink || isClosestLink || hasHref || hasLinkRole) &&
          ((!isClosestLink && !isPopupType) || (isClosestLink && !isClosestPopup))
        ) {
          isNavigationLink = true;
        }
      }
      if (isNavigationLink) {
        // const unsavedChanges = await hasUnsavedChanges();
        hasUnsavedChanges()
          .then((unsavedChanges) => {
            if (unsavedChanges) {
              e.preventDefault();
              e.stopPropagation();
              console.log("3");

              const href =
                target?.closest("a")?.getAttribute("href") ||
                target?.getAttribute("href");
              if (href) {
                console.log("4");

                pendingLocation.current = href;
              }
              setIsModalOpen(true);
              setIsLeavingPage(false);

              previousPath.current = window.location.pathname;
            }
          })
          .catch((error) => console.error(error));
      }
    };

    document.addEventListener("click", blockNavigation, true);
    return () => document.removeEventListener("click", blockNavigation, true);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const unlisten = _history.listen(({ action, location: newLocation }) => {
      
      if (action === "POP" || action === "PUSH" || action === "REPLACE") {
        const intendedPath =
          location.pathname == newLocation.pathname
            ? pendingLocation.current
            : newLocation.pathname;

        hasUnsavedChanges()
          .then((unsavedChanges) => {
            
            if (unsavedChanges) {
              const transactionType = getTransactionType();
              const basePath = getBasePath();
              // Re-push the same state to prevent navigation
              window.history.pushState(
                null,
                "",
                `${basePath}/${transactionType}`
              );
              // pendingLocation.current = `/accounts/transactions/${_formState.transactionType}`;
              setIsLeavingPage(false);
              setIsModalOpen(true);
              pendingLocation.current =
                intendedPath == null ? pendingLocation.current : intendedPath;
            } else {
              // If no unsaved changes, allow navigation and update the previousPath ref
              pendingLocation.current =
                intendedPath == null ? pendingLocation.current : intendedPath;
            }
          })
          .catch((error) => console.error(error));
      }
    });

    // Cleanup: Stop listening when the component unmounts
    return () => unlisten();
  }, [hasUnsavedChanges]);

  const handleStay = useCallback(() => {
    console.log("10");

    setIsModalOpen(false);
    setIsLeavingPage(false);
    // pendingLocation.current = null;
    navigationAttempted.current = false;
    // window.history.pushState(null, '', currentPath.current);
  }, []);

  const handleLeave = useCallback(() => {
    console.log("11");
    
    if (isLeavingPage) {
      console.log("12");
      // If user is trying to refresh or close the page
      window.removeEventListener("beforeunload", () => {});
      window.location.reload();
      return;
    }

    const targetLocation = pendingLocation.current;
    setIsModalOpen(false);
    setIsLeavingPage(false);
    navigationAttempted.current = false;

    // Dispatch action to reset formState.prev before navigating
    dispatch(accFormStateHandleFieldChange({ fields: { prev: undefined } }));

    if (targetLocation) {
      console.log("13");

      setTimeout(() => {
        navigate(targetLocation);
      }, 0);
    }
    console.log("14");

    pendingLocation.current = null;
  }, [navigate, isLeavingPage, dispatch]);

  // Reset navigation attempt flag when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      console.log("15");

      navigationAttempted.current = false;
    }
  }, [isModalOpen]);

  return {
    isModalOpen,
    handleStay,
    handleLeave,
    hasUnsavedChanges,
    isLeavingPage,
    setIsModalOpen,
  };
};
