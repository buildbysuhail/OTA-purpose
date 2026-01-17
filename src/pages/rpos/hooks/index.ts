/**
 * RPOS Custom Hooks - Centralized exports
 *
 * Performance Hooks:
 * - useDebounce: Delay value updates
 * - useThrottle: Limit function execution rate
 * - useOptimistic: Optimistic UI updates
 * - useKeyboardShortcut: Keyboard shortcuts
 * - useMediaQuery/useBreakpoints: Responsive design
 *
 * Business Logic Hooks:
 * - useOrderManagement: Order CRUD operations
 * - usePaymentCalculation: Payment calculations
 */

// Performance hooks
export { useDebounce } from './useDebounce';
export { useThrottle } from './useThrottle';
export { useOptimistic } from './useOptimistic';
export { useKeyboardShortcut } from './useKeyboardShortcut';
export { useMediaQuery, useBreakpoints } from './useMediaQuery';

// Business logic hooks
export { useOrderManagement } from './useOrderManagement';
export { usePaymentCalculation } from './usePaymentCalculation';
export { useTableSelection } from './useTableSelection';
export type { SeatLetter, UseTableSelectionOptions, UseTableSelectionReturn } from './useTableSelection';
