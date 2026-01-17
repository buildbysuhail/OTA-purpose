import { useState, useCallback } from 'react';

/**
 * Optimistic UI hook - Updates UI immediately, reverts on error
 * Perfect for: Add to cart, increment quantity, toggle favorites
 *
 * @example
 * const [items, setItems] = useState([]);
 * const { execute, isLoading, error } = useOptimistic();
 *
 * const handleAddItem = async (newItem) => {
 *   await execute(
 *     // Optimistic update
 *     () => setItems([...items, newItem]),
 *     // API call
 *     () => saveOrderMutation(newItem),
 *     // Rollback on error
 *     () => setItems(items)
 *   );
 * };
 */
export function useOptimistic<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      optimisticUpdate: () => void,
      apiCall: () => Promise<T>,
      rollback: () => void
    ): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      // Apply optimistic update immediately
      optimisticUpdate();

      try {
        // Execute actual API call
        const result = await apiCall();
        return result;
      } catch (err) {
        // Rollback on error
        rollback();
        setError(err instanceof Error ? err : new Error('Unknown error'));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { execute, isLoading, error };
}
