import { useEffect, useRef } from 'react';

/**
 * Hook to manage HTML element attributes
 */
export const useDocumentAttributes = (attributes: Record<string, any>) => {
  const previousAttributes = useRef<Record<string, any>>({});

  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Remove old attributes that are no longer present
    Object.keys(previousAttributes.current).forEach(key => {
      if (!(key in attributes)) {
        htmlElement.removeAttribute(key);
      }
    });

    // Set new attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        htmlElement.setAttribute(key, String(value));
      } else {
        htmlElement.removeAttribute(key);
      }
    });

    // Store current attributes for next render
    previousAttributes.current = attributes;

    // Cleanup on unmount
    return () => {
      Object.keys(attributes).forEach(key => {
        htmlElement.removeAttribute(key);
      });
    };
  }, [JSON.stringify(attributes)]); // Use JSON.stringify for deep comparison
};

/**
 * Hook to manage body element className
 */
export const useBodyClass = (className: string | undefined) => {
  const previousClass = useRef<string>('');

  useEffect(() => {
    if (className) {
      // Store original class if this is the first run
      if (previousClass.current === '' && document.body.className) {
        previousClass.current = document.body.className;
      }
      document.body.className = className;
    }
    
    return () => {
      // Restore original class or clear
      if (previousClass.current) {
        document.body.className = previousClass.current;
      } else {
        document.body.className = '';
      }
    };
  }, [className]);
};

/**
 * Hook to manage CSS variables on root element
 */
export const useCSSVariables = (variables: Record<string, string | undefined>) => {
  const previousVariables = useRef<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove old variables that are no longer present
    Object.keys(previousVariables.current).forEach(key => {
      if (!(key in variables) || !variables[key]) {
        root.style.removeProperty(key);
      }
    });

    // Set new variables
    Object.entries(variables).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(key, value);
      } else {
        root.style.removeProperty(key);
      }
    });

    // Store current variables for next render
    previousVariables.current = Object.fromEntries(
      Object.entries(variables).filter(([_, value]) => value !== undefined)
    ) as Record<string, string>;

    // Cleanup on unmount
    return () => {
      Object.keys(variables).forEach(key => {
        if (variables[key]) {
          root.style.removeProperty(key);
        }
      });
    };
  }, [JSON.stringify(variables)]); // Use JSON.stringify for deep comparison
};