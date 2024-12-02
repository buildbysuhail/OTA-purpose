import React, { useEffect, useRef } from 'react';

interface ShortcutConfig {
  event: string;
  key: string;
  description: string;
  action: () => void;
}
export const popupStack: (() => void)[] = [];
export const addPopupToStack = (closeFunction: () => void) => {
  popupStack.push(closeFunction);
};
export const removePopupFromStack = (closeFunction: () => void) => {
  const index = popupStack.indexOf(closeFunction);
  if (index > -1) {
    popupStack.splice(index, 1);
  }
};

enum ShortKeyEvents {
  POPUP_CLOSE_EVENT = 'popup-close-event',
  CLOSE_ONE_POPUP = 'close-one-popup',
  GO_TO_PREVIOUS_PAGE = 'go-to-previos-page',
  GO_TO_NEXT_PAGE = 'go-to-next-page',
  GO_TO_HOME = 'go-to-home',
  FOCUS_SEARCHBAR = "focus-searchbar"
}

const shortKeys: ShortcutConfig[] = [
  {
    event: ShortKeyEvents.POPUP_CLOSE_EVENT,
    key: "ctrl+shift+b",
    description: "Close all popups",
    action: () => {
      // const event = new CustomEvent(ShortKeyEvents.POPUP_CLOSE_EVENT);
      // document.dispatchEvent(event);
      while (popupStack.length > 0) {
        const closePopup = popupStack.pop();
        if (closePopup) closePopup();
      }
    },
  },
  {
    event: ShortKeyEvents.CLOSE_ONE_POPUP,
    key: "ctrl+q",
    description: "Close the top popup",
    action: () => {
      // const event = new CustomEvent(ShortKeyEvents.CLOSE_ONE_POPUP);
      // document.dispatchEvent(event);
      if (popupStack.length > 0) {
        const closeTopPopup = popupStack.pop();
        if (closeTopPopup) closeTopPopup();
      }
    },
  },
  {
    event: ShortKeyEvents.GO_TO_PREVIOUS_PAGE,
    key: 'shift+b',
    description: 'Go to previous page',
    action: () => {
      window.history.back();
    }
  },
  {
    event: ShortKeyEvents.GO_TO_NEXT_PAGE,
    key: 'alt+f',
    description: 'Go to next page',
    action: () => {
      window.history.forward();
    }
  },
  {
    event: ShortKeyEvents.GO_TO_HOME,
    key: 'ctrl+x',
    description: 'Go to Home',
    action: () => {
      window.location.assign('/');
    }
  },
  {
    event: ShortKeyEvents.FOCUS_SEARCHBAR,
    key: 'ctrl+shift+f',
    description: 'focus the searchbar',
    action: () => {
      const strategies = [
        () => document.getElementById('search-input'),
        () => document.querySelector('input[type="search"]'),
        () => document.querySelector('input[placeholder="Search"]'),
        () => Array.from(document.querySelectorAll('input'))
          .find(input =>
            input.getAttribute('aria-label')?.toLowerCase().includes('search') ||
            input.name?.toLowerCase().includes('search')
          )
      ];

      for (const strategy of strategies) {
        const searchInput = strategy();
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
          searchInput.select();
          break;
        }
      }
    },
  }
];

const handleKeyPress = (event: KeyboardEvent) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLSelectElement
  ) {
    return;
  }

  const shortcut = shortKeys.find((s) => {
    const modifiers = s.key.split('+');
    const matchedModifiers = modifiers.filter((modifier) => {
      switch (modifier) {
        case 'ctrl':
          return event.ctrlKey;
        case 'alt':
          return event.altKey;
        case 'shift':
          return event.shiftKey;
        default:
          return event.key.toLowerCase() === modifier.toLowerCase();
      }
    });
    return matchedModifiers.length === modifiers.length && event.key.toLowerCase() === modifiers[modifiers.length - 1].toLowerCase();
  });

  if (shortcut) {
    event.preventDefault();
    shortcut.action();
  }
};

let isInitialized = false;

export const initializeShortKeys = () => {
  if (!isInitialized) {
    document.addEventListener('keydown', handleKeyPress);
    isInitialized = true;
  }
};

export const cleanupShortKeys = () => {
  if (isInitialized) {
    document.removeEventListener('keydown', handleKeyPress);
    isInitialized = false;
  }
};

export const getFocusableElements = () => {
  return Array.from(
    document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
  );
};
export const handleNavigation = (e: React.KeyboardEvent<HTMLElement>) => {
  const isShiftKey = e.shiftKey;
  if (e.key === "Enter") {
    e.preventDefault();
    const focusableElements = getFocusableElements();
    const currentElement = e.target as HTMLElement;
    const currentIndex = focusableElements.indexOf(currentElement);

    const jumpToAttr = currentElement.getAttribute('data-jump-to');
    if (jumpToAttr) {
      const jumpTargetElement = focusableElements.find(
        (el) => el.getAttribute('data-jump-target') === jumpToAttr
      ) as HTMLElement;
      if (jumpTargetElement) {
        jumpTargetElement.focus();
        return;
      }
    }

    let nextIndex = isShiftKey ? currentIndex - 1 : currentIndex + 1;

    while (nextIndex >= 0 && nextIndex < focusableElements.length) {
      const nextElement = focusableElements[nextIndex] as HTMLElement;
      const skipAttr = nextElement.getAttribute('data-skip');
      if (skipAttr !== 'true') {
        break;
      }
      nextIndex = isShiftKey ? nextIndex - 1 : nextIndex + 1;
    }

    if (nextIndex >= 0 && nextIndex < focusableElements.length) {
      (focusableElements[nextIndex] as HTMLElement).focus();
    }
  }
};

export const useSearchInputFocus = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    document.addEventListener('keydown', handleShortcut);
    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return searchInputRef;
};

initializeShortKeys();

export { ShortKeyEvents };
export default shortKeys;