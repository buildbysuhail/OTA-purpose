/**
 * RPOS UI Components - Centralized exports
 *
 * Loading States:
 * - Skeleton: Loading placeholders
 * - ProductGridSkeleton, OrderTableSkeleton, CategorySidebarSkeleton
 *
 * User Feedback:
 * - toast: Notification system
 * - Tooltip: Contextual help
 * - KeyboardShortcutTooltip: Keyboard hint tooltips
 *
 * Error Handling:
 * - ErrorBoundary: Graceful error recovery
 */

// Skeleton loaders
export {
  Skeleton,
  ProductGridSkeleton,
  OrderTableSkeleton,
  CategorySidebarSkeleton,
} from './Skeleton';

// Toast notifications
export { toast } from './Toast';
export type { ToastType } from './Toast';

// Tooltips
export { Tooltip, KeyboardShortcutTooltip } from './Tooltip';

// Error boundary
export { ErrorBoundary } from './ErrorBoundary';

// Table selection
export { TableSelectionPanel } from './TableSelectionPanel';
