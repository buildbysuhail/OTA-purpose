import { useState, useEffect, useCallback, useRef } from 'react';


export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};


// Alternative approach - more explicit control
export const useDebouncedInput = <T>(
  initialValue: T,
  onDebouncedChange: (value: T) => void,
  delay: number = 300
) => {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    // Only trigger onDebouncedChange if user has actually interacted with the input
    if (hasUserInteracted.current && debouncedValue !== initialValue) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange, initialValue]);

  useEffect(() => {
    setValue(initialValue);
    // Reset interaction flag when initialValue changes externally
    hasUserInteracted.current = false;
  }, [initialValue]);

  const handleChange = useCallback((newValue: T) => {
    hasUserInteracted.current = true;
    setValue(newValue);
  }, []);

  return {
    value,
    debouncedValue,
    setValue: handleChange,
    onChange: handleChange
  };
};