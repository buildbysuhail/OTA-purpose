/**
 * RPOS UI Initial State Data
 * Default values for UI state - resets on page refresh
 */

import {
  RPosUIFlags,
  RPosUIPanels,
  RPosUILoading,
  RPosUISearch,
  RPosUISelection,
  RPosUIFormState,
  RPosUIState,
} from "../rpos-ui-type";

// ============================================================================
// UI FLAGS INITIAL STATE
// ============================================================================
export const initialRPosUIFlags: RPosUIFlags = {
  showProductStock: false,
  showGroupCategory: false,
  showRePrintConfirmation: false,
  showUserConfig: false,
  showLargeView: false,
  showTables: false,
  showPaymentPanel: false,
  showPrevilageCard: false,
  showQtyPanel: false,
  showKeyboard: false,
  showNumbers: true,
};

// ============================================================================
// UI PANELS INITIAL STATE
// ============================================================================
export const initialRPosUIPanels: RPosUIPanels = {
  isPaymentPanelOpen: false,
  isTableSelectionOpen: false,
  isSplitPanelOpen: false,
  isMergePanelOpen: false,
  isPendingOrderPanelOpen: false,
  isKeyboardPanelOpen: false,
  isDescriptionPanelOpen: false,
  isProductSearchOpen: false,
  isKitchenMessageOpen: false,
  isCustomerSearchOpen: false,
  isWaiterListOpen: false,
  isSettlementOpen: false,
  isOrderLookupOpen: false,
  isTenderOpen: false,
  isPreviousOrdersOpen: false,
  isOtherMenusOpen: false,
};

// ============================================================================
// UI LOADING INITIAL STATE
// ============================================================================
export const initialRPosUILoading: RPosUILoading = {
  isInitializing: true,
  isLoadingProducts: false,
  isLoadingGroups: false,
  isLoadingTables: false,
  isLoadingOrder: false,
  isSaving: false,
  isPrinting: false,
  isSearching: false,
};

// ============================================================================
// UI SEARCH INITIAL STATE
// ============================================================================
export const initialRPosUISearch: RPosUISearch = {
  productSearchQuery: "",
  descriptionSearchQuery: "",
  customerSearchQuery: "",
  orderSearchQuery: "",
};

// ============================================================================
// UI SELECTION INITIAL STATE
// ============================================================================
export const initialRPosUISelection: RPosUISelection = {
  activeItemGridRow: 0,
  selectedProductGroupId: null,
  selectedGroupCategoryId: null,
  selectedTableIndex: null,
  selectedSeatIndex: null,
};

// ============================================================================
// UI FORM STATE INITIAL
// ============================================================================
export const initialRPosUIFormState: RPosUIFormState = {
  isEdit: false,
  isDirty: false,
  isReturnFromPaymentPanel: false,
  isSettlementTransaction: false,
  isBillingActive: false,
  isTableLoaded: false,
  isLoggedIn: true,
  isFirstLoad: true,
  isAuthorisedToModify: false,
  isTransButtonClicked: false,
};

// ============================================================================
// COMBINED UI INITIAL STATE
// ============================================================================
export const initialRPosUIState: RPosUIState = {
  flags: initialRPosUIFlags,
  panels: initialRPosUIPanels,
  loading: initialRPosUILoading,
  search: initialRPosUISearch,
  selection: initialRPosUISelection,
  form: initialRPosUIFormState,
};
