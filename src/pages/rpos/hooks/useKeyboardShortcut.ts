import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcut hook - Handle keyboard shortcuts efficiently
 * Perfect for: POS quick actions (F1-F12, Ctrl+S, etc.)
 *
 * @example
 * useKeyboardShortcut('F2', () => handleNewOrder());
 * useKeyboardShortcut('ctrl+s', (e) => {
 *   e.preventDefault();
 *   handleSaveOrder();
 * });
 */
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: { enabled?: boolean; preventDefault?: boolean } = {}
) {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const isKey = key.toLowerCase().includes('+')
        ? checkModifierKey(event, key)
        : event.key.toLowerCase() === key.toLowerCase();

      if (isKey) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [key, callback, enabled, preventDefault]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}

function checkModifierKey(event: KeyboardEvent, combination: string): boolean {
  const parts = combination.toLowerCase().split('+');
  const modifiers = parts.slice(0, -1);
  const key = parts[parts.length - 1];

  const hasCtrl = modifiers.includes('ctrl') ? event.ctrlKey : !event.ctrlKey;
  const hasAlt = modifiers.includes('alt') ? event.altKey : !event.altKey;
  const hasShift = modifiers.includes('shift') ? event.shiftKey : !event.shiftKey;

  return (
    event.key.toLowerCase() === key &&
    hasCtrl &&
    hasAlt &&
    hasShift
  );
}
