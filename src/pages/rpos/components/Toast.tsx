import { FC, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Toast Notification Component - User feedback system
 * Benefits:
 * - Non-blocking notifications
 * - Auto-dismiss with configurable duration
 * - Multiple toast types (success, error, warning, info)
 * - Stacking support
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const ToastItem: FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>;
      case 'error':
        return <i className="ri-error-warning-fill text-red-600 text-xl"></i>;
      case 'warning':
        return <i className="ri-alert-fill text-yellow-600 text-xl"></i>;
      case 'info':
        return <i className="ri-information-fill text-blue-600 text-xl"></i>;
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4
        transition-all duration-300 transform min-w-[300px] max-w-md
        ${getTypeClasses()}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {getIcon()}
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <i className="ri-close-line text-lg"></i>
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 */
const ToastContainer: FC<{
  toasts: Array<{ id: string; message: string; type: ToastType; duration?: number }>;
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

/**
 * Toast Manager - Singleton pattern
 */
class ToastManager {
  private toasts: Array<{ id: string; message: string; type: ToastType; duration?: number }> = [];
  private container: HTMLDivElement | null = null;
  private root: any = null;

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
      this.root = createRoot(this.container);
    }
  }

  private render() {
    this.ensureContainer();
    this.root.render(
      <ToastContainer toasts={this.toasts} onClose={(id) => this.remove(id)} />
    );
  }

  private add(message: string, type: ToastType, duration?: number) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    this.toasts.push({ id, message, type, duration });
    this.render();
    return id;
  }

  private remove(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.render();
  }

  success(message: string, duration = 3000) {
    return this.add(message, 'success', duration);
  }

  error(message: string, duration = 4000) {
    return this.add(message, 'error', duration);
  }

  warning(message: string, duration = 3500) {
    return this.add(message, 'warning', duration);
  }

  info(message: string, duration = 3000) {
    return this.add(message, 'info', duration);
  }

  dismiss(id: string) {
    this.remove(id);
  }

  dismissAll() {
    this.toasts = [];
    this.render();
  }
}

// Export singleton instance
export const toast = new ToastManager();

/**
 * Usage Examples:
 *
 * toast.success("Order saved successfully!");
 * toast.error("Failed to save order. Please try again.");
 * toast.warning("Table already occupied!");
 * toast.info("KOT sent to kitchen");
 *
 * // Custom duration
 * toast.success("Done!", 5000);
 *
 * // Manual dismiss
 * const id = toast.info("Processing...", 0); // 0 = no auto-dismiss
 * setTimeout(() => toast.dismiss(id), 2000);
 */
