import { useCallback, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import type { DebouncedFunc } from "lodash"; // Import DebouncedFunc from lodash

// Generic debounce hook using lodash.debounce
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): DebouncedFunc<T> {
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create debounced function using lodash.debounce
  const debouncedCallback = useCallback(
    debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay),
    [delay]
  ) as DebouncedFunc<T>;

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}

export default useDebounce;