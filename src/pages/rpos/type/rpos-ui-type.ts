/**
 * RPOS UI State Types
 * Ephemeral/temporary state that doesn't persist across sessions
 * Reset on page refresh is acceptable
 */

// ============================================================================
// UI FLAGS - General visibility and display states
// ============================================================================
export interface RPosUIFlags {
  showProductStock: boolean;
  showGroupCategory: boolean;
  showRePrintConfirmation: boolean;
  showUserConfig: boolean;
  showLargeView: boolean;
  showTables: boolean;
  showPaymentPanel: boolean;
  showPrevilageCard: boolean;
  showQtyPanel: boolean;
  showKeyboard: boolean;
  showNumbers: boolean;
}

// ============================================================================
// PANEL STATES - Which panels/modals are currently visible
// ============================================================================
export interface RPosUIPanels {
  // Main panels
  isPaymentPanelOpen: boolean;
  isTableSelectionOpen: boolean;
  isSplitPanelOpen: boolean;
  isMergePanelOpen: boolean;
  isPendingOrderPanelOpen: boolean;
  isKeyboardPanelOpen: boolean;
  isDescriptionPanelOpen: boolean;
  isProductSearchOpen: boolean;

  // Feature modals
  isKitchenMessageOpen: boolean;
  isCustomerSearchOpen: boolean;
  isWaiterListOpen: boolean;
  isSettlementOpen: boolean;
  isOrderLookupOpen: boolean;
  isTenderOpen: boolean;
  isPreviousOrdersOpen: boolean;
  isOtherMenusOpen: boolean;
}

// ============================================================================
// LOADING STATES - Track API/data loading states
// ============================================================================
export interface RPosUILoading {
  isInitializing: boolean;
  isLoadingProducts: boolean;
  isLoadingGroups: boolean;
  isLoadingTables: boolean;
  isLoadingOrder: boolean;
  isSaving: boolean;
  isPrinting: boolean;
  isSearching: boolean;
}

// ============================================================================
// SEARCH & FILTER STATES
// ============================================================================
export interface RPosUISearch {
  productSearchQuery: string;
  descriptionSearchQuery: string;
  customerSearchQuery: string;
  orderSearchQuery: string;
}

// ============================================================================
// GRID/LIST SELECTION STATES
// ============================================================================
export interface RPosUISelection {
  activeItemGridRow: number;
  selectedProductGroupId: number | null;
  selectedGroupCategoryId: number | null;
  selectedTableIndex: number | null;
  selectedSeatIndex: number | null;
}

// ============================================================================
// FORM EDIT STATES
// ============================================================================
export interface RPosUIFormState {
  isEdit: boolean;
  isDirty: boolean;
  isReturnFromPaymentPanel: boolean;
  isSettlementTransaction: boolean;
  isBillingActive: boolean;
  isTableLoaded: boolean;
  isLoggedIn: boolean;
  isFirstLoad: boolean;
  isAuthorisedToModify: boolean;
  isTransButtonClicked: boolean;
}

// ============================================================================
// COMBINED UI STATE
// ============================================================================
export interface RPosUIState {
  flags: RPosUIFlags;
  panels: RPosUIPanels;
  loading: RPosUILoading;
  search: RPosUISearch;
  selection: RPosUISelection;
  form: RPosUIFormState;
}
