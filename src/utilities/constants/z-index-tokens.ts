/**
 * Z-Index Token System
 *
 * Centralized z-index values to maintain consistent layering across the application.
 * This prevents z-index conflicts and makes the stacking order predictable.
 *
 * Usage:
 * import { Z_INDEX } from '@/utilities/constants/z-index-tokens';
 * style={{ zIndex: Z_INDEX.MODAL }}
 */

export const Z_INDEX = {
  /**
   * BASE (1)
   * Default layer for regular content
   */
  BASE: 1,

  /**
   * DROPDOWN (10)
   * Comboboxes, select dropdowns, autocomplete results
   */
  DROPDOWN: 10,

  /**
   * STICKY (20)
   * Sticky headers, table headers, persistent navigation
   */
  STICKY: 20,

  /**
   * BACKDROP (30)
   * Modal/dialog backdrops, overlay backgrounds
   * Used to prevent interaction with content below
   */
  BACKDROP: 30,

  /**
   * FOOTER (40)
   * Transaction footer, bottom navigation bars
   */
  FOOTER: 40,

  /**
   * DROPUP (50)
   * Footer dropup panels, expandable content areas
   */
  DROPUP: 50,

  /**
   * SIDEBAR (53)
   * Side panels, slide-out menus, resizable sidebars
   */
  SIDEBAR: 53,

  /**
   * MODAL (60)
   * Dialog boxes, popups, modal windows
   */
  MODAL: 60,

  /**
   * TOOLTIP (70)
   * Tooltips, popovers, contextual help
   */
  TOOLTIP: 70,

  /**
   * NOTIFICATION (80)
   * Toast notifications, alerts, snackbars
   */
  NOTIFICATION: 80,

  /**
   * CRITICAL (100)
   * Critical UI elements that must appear above everything else
   * Grid headers, barcode scanners, important overlays
   */
  CRITICAL: 100,

  /**
   * CONFETTI (9999)
   * Celebration effects, particles, decorative overlays
   * Intentionally high to appear above all functional UI
   */
  CONFETTI: 9999,
} as const;

/**
 * Type for z-index token keys
 */
export type ZIndexToken = keyof typeof Z_INDEX;

/**
 * Get z-index value by token name
 */
export const getZIndex = (token: ZIndexToken): number => {
  return Z_INDEX[token];
};

/**
 * Check if a z-index value is higher than another token
 */
export const isAbove = (value: number, token: ZIndexToken): boolean => {
  return value > Z_INDEX[token];
};

/**
 * Get the next z-index level above a given token
 */
export const getNextLevel = (token: ZIndexToken): number => {
  return Z_INDEX[token] + 1;
};

export default Z_INDEX;
