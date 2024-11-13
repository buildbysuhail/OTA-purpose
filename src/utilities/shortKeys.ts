interface ShortcutConfig {
  event: string;
  key: string;
  description: string;
  action: () => void;
}
enum ShortKeyEvents {
  POPUP_CLOSE_EVENT = 'popup-close-event',
  GO_TO_PREVIOUS_PAGE = 'go-to-previos-page',
  GO_TO_NEXT_PAGE = 'go-to-next-page',
  GO_TO_HOME = 'go-to-home'
}

const shortKeys: ShortcutConfig[] = [
  {
    event: ShortKeyEvents.POPUP_CLOSE_EVENT,
    key: 'ctrl+shift+b',
    description: 'Close all popups',
    action: () => {
      const event = new CustomEvent(ShortKeyEvents.POPUP_CLOSE_EVENT);
      document.dispatchEvent(event);
    }
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

initializeShortKeys();

export { ShortKeyEvents };
export default shortKeys;