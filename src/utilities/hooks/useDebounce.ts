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



// Alternative approach - more explicit control
export const useDebouncedInput = <T>(
  initialValue: T,
  onDebouncedChange: (value: T, e?: any) => void,
  delay: number = 300,
  e?: any
) => {
  const [value, setValue] = useState<T>(initialValue);
  const eventRef = useRef<any>(null);
  const debouncedValue = useDebounce(value, delay);
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    // Only trigger onDebouncedChange if user has actually interacted with the input
    if (hasUserInteracted.current && debouncedValue !== initialValue) {
      onDebouncedChange(debouncedValue, eventRef.current );
    }
  }, [debouncedValue]);

  useEffect(() => {
    setValue(initialValue);
    // Reset interaction flag when initialValue changes externally
    hasUserInteracted.current = false;
  }, [initialValue]);

  const handleChange = useCallback((newValue: T, e?: any) => {
    hasUserInteracted.current = true;
     eventRef.current = e;
    setValue(newValue);
  }, []);

  return {
    value,
    debouncedValue,
    setValue: handleChange,
    onChange: handleChange
  };
};

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay = 400
) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}
