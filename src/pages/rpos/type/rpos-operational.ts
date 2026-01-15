/**
 * RPOS Operational State Types
 * Runtime configuration and session data
 * Persists during session (optionally to localStorage/sessionStorage)
 * Can be initialized from server on login
 */

// ============================================================================
// SERVE TYPE - Dining mode enumeration
// ============================================================================
export type ServeType = "DINE IN" | "TAKE AWAY" | "DELIVERY";

// ============================================================================
// VOUCHER TYPE - Transaction type enumeration
// ============================================================================
export type VoucherType = "SO" | "SI" | "TSI" | "SR" | "MRG" | "SPT";

// ============================================================================
// PRINT CONFIGURATION
// ============================================================================
export interface RPosPrintConfig {
  printAfterSave: boolean;
  onlyDirectBilling: boolean;
  printKOTFromBilling: boolean;
  printKOTFromOrder: boolean;
  printKitchenWiseFromOrder: boolean;
  printKitchenWiseFromBilling: boolean;
  isKOTPrintingPC: boolean;
  isBillingPC: boolean;
  enableGTPSPrint: boolean;
  printSettlement: boolean;
  hideBillingOption: boolean;
}

// ============================================================================
// PRODUCT DISPLAY CONFIGURATION
// ============================================================================
export interface RPosProductConfig {
  productViewStyle: "NAME" | "CODE" | "IMAGE";
  productButtonHeight: number;
  defaultPriceCategoryId: number;
  zeroPriceWarning: "Warn" | "Block" | "Allow";
  enableCodeSearchFiltering: boolean;
  comboModelProductSearch: boolean;
  showRateBeforeTax: boolean;
  disableAutoIncrementQty: boolean;
  disableRateEditOption: boolean;
  imageLocationPath: string;
  kioskImageLocationPath: string;
}

// ============================================================================
// MULTI-UNIT SELECTION
// ============================================================================
export interface RPosMultiUnit {
  id: number;
  rate: number;
  name: string;
}

// ============================================================================
// DINING CONTEXT - Current table/seat/order context
// ============================================================================
export interface RPosDiningContext {
  tableNo: string;
  seatNo: string;
  isTableSelected: boolean;
  isSeatSelected: boolean;
  autoSeatSelect: boolean;
  serveType: ServeType;
  numberOfGuests: number;

  // Splitting context
  splittingInvTransMasterId: number;
  splittingTableId: number;
  splittingTableNumber: string;

  // Merging context
  mergeTableId: number;
  mergeTableNumber: string;

  // Pending order context
  pendingOrder: {
    tableId: number;
    tableNumber: string;
    token: string;
    isLoaded: boolean;
  };

  // Available seats
  seats: string[];
}

// ============================================================================
// SESSION INFO - Current user session data
// ============================================================================
export interface RPosSessionInfo {
  userId: number;
  userName: string;
  employeeId: number;
  waiterId: number;
  waiterName: string;
  shiftId: number;
  terminalId: string;
  branchId: number;
  counterWiseCashLedgerId: number;
}

// ============================================================================
// CUSTOMER INFO - Current customer context
// ============================================================================
export interface RPosCustomerInfo {
  partyId: number;
  customerType: "B2B" | "B2C" | "";
  customerName: string;
  taxRegNumber: string;
  mobileNo: string;
  telephoneCallingNumber: string;
  address: {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
  };
  notes1: string;
  notes2: string;
}

// ============================================================================
// PAYMENT CONFIGURATION
// ============================================================================
export interface RPosPaymentConfig {
  disableCardPayment: boolean;
  disablePaymentPopupForCreditParties: boolean;
  doNotPopupPaymentWindowInBilling: boolean;
  enablePayLaterOption: boolean;
  deliveryChargeAmount: number;
  defaultCashLedgerId: number;
}

// ============================================================================
// WAITER/EMPLOYEE CONFIGURATION
// ============================================================================
export interface RPosWaiterConfig {
  showWaiterAfterSave: boolean;
  settleOrderWithLastSelectedEmployee: boolean;
  enableCounterShift: boolean;
  prevDeliveryManId: number;
  prevSalesManId: number;
}

// ============================================================================
// VOUCHER STATE - Current voucher/transaction mode
// ============================================================================
export interface RPosVoucherState {
  voucherType: VoucherType;
  voucherPrefix: string;
  formType: string; // "VAT" | ""
  defaultServeType: ServeType;
}

// ============================================================================
// KITCHEN CONTEXT
// ============================================================================
export interface RPosKitchenContext {
  availableKitchens: Kitchen[];
  defaultKitchenId: number | null;
  lastLoadedAt: string | null;
}

export interface Kitchen {
  kitchenId: number;
  kitchenName: string;
  branchId: number;
}

// ============================================================================
// COMBINED OPERATIONAL STATE
// ============================================================================
export interface RPosOperationalState {
  printConfig: RPosPrintConfig;
  productConfig: RPosProductConfig;
  multiUnit: RPosMultiUnit;
  dining: RPosDiningContext;
  session: RPosSessionInfo;
  customer: RPosCustomerInfo;
  payment: RPosPaymentConfig;
  waiter: RPosWaiterConfig;
  voucher: RPosVoucherState;
  kitchen: RPosKitchenContext;
}
