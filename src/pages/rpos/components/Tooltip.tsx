import { FC, ReactNode, useState, useRef, useEffect } from 'react';

/**
 * Tooltip Component - Context help for users
 * Benefits:
 * - Improved accessibility
 * - Better UX for icon-only buttons
 * - Keyboard shortcut hints
 */

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  position = 'bottom',
  delay = 300,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (position) {
          case 'top':
            top = triggerRect.top - tooltipRect.height - 8;
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'bottom':
            top = triggerRect.bottom + 8;
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'left':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            left = triggerRect.left - tooltipRect.width - 8;
            break;
          case 'right':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            left = triggerRect.right + 8;
            break;
        }

        setCoords({ top, left });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
    switch (position) {
      case 'top':
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none transition-opacity duration-200"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          <div className={getArrowClasses()} />
          {content}
        </div>
      )}
    </>
  );
};

/**
 * Simple tooltip for keyboard shortcuts
 */
export const KeyboardShortcutTooltip: FC<{
  shortcut: string;
  description: string;
  children: ReactNode;
}> = ({ shortcut, description, children }) => {
  return (
    <Tooltip
      content={
        <div className="flex flex-col items-center">
          <div className="text-xs mb-1">{description}</div>
          <div className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">{shortcut}</div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

/**
 * Usage Examples:
 *
 * <Tooltip content="Create new order">
 *   <button>New Order</button>
 * </Tooltip>
 *
 * <KeyboardShortcutTooltip shortcut="F2" description="New Order">
 *   <button><i className="ri-add-line" /></button>
 * </KeyboardShortcutTooltip>
 */
