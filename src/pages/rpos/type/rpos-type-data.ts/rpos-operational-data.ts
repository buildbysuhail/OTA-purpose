/**
 * RPOS Operational Initial State Data
 * Default values for operational/session state
 * Can be persisted to localStorage/sessionStorage
 */

import {
  RPosPrintConfig,
  RPosProductConfig,
  RPosMultiUnit,
  RPosDiningContext,
  RPosSessionInfo,
  RPosCustomerInfo,
  RPosPaymentConfig,
  RPosWaiterConfig,
  RPosVoucherState,
  RPosKitchenContext,
  RPosOperationalState,
} from "../rpos-operational";

// ============================================================================
// PRINT CONFIG INITIAL STATE
// ============================================================================
export const initialRPosPrintConfig: RPosPrintConfig = {
  printAfterSave: false,
  onlyDirectBilling: false,
  printKOTFromBilling: false,
  printKOTFromOrder: false,
  printKitchenWiseFromOrder: false,
  printKitchenWiseFromBilling: false,
  isKOTPrintingPC: false,
  isBillingPC: false,
  enableGTPSPrint: false,
  printSettlement: false,
  hideBillingOption: false,
};

// ============================================================================
// PRODUCT CONFIG INITIAL STATE
// ============================================================================
export const initialRPosProductConfig: RPosProductConfig = {
  productViewStyle: "NAME",
  productButtonHeight: 50,
  defaultPriceCategoryId: 0,
  zeroPriceWarning: "Warn",
  enableCodeSearchFiltering: false,
  comboModelProductSearch: false,
  showRateBeforeTax: false,
  disableAutoIncrementQty: false,
  disableRateEditOption: false,
  imageLocationPath: "",
  kioskImageLocationPath: "",
};

// ============================================================================
// MULTI-UNIT INITIAL STATE
// ============================================================================
export const initialRPosMultiUnit: RPosMultiUnit = {
  id: 0,
  rate: 0,
  name: "",
};

// ============================================================================
// DINING CONTEXT INITIAL STATE
// ============================================================================
export const initialRPosDiningContext: RPosDiningContext = {
  tableNo: "",
  seatNo: "",
  isTableSelected: false,
  isSeatSelected: false,
  autoSeatSelect: true,
  serveType: "DINE IN",
  numberOfGuests: 1,
  splittingInvTransMasterId: 0,
  splittingTableId: 0,
  splittingTableNumber: "",
  mergeTableId: 0,
  mergeTableNumber: "",
  pendingOrder: {
    tableId: 0,
    tableNumber: "",
    token: "",
    isLoaded: false,
  },
  seats: ["A", "B", "C", "D", "E", "F", "G", "H"],
};

// ============================================================================
// SESSION INFO INITIAL STATE
// ============================================================================
export const initialRPosSessionInfo: RPosSessionInfo = {
  userId: 0,
  userName: "",
  employeeId: 0,
  waiterId: 0,
  waiterName: "",
  shiftId: 0,
  terminalId: "",
  branchId: 0,
  counterWiseCashLedgerId: 0,
};

// ============================================================================
// CUSTOMER INFO INITIAL STATE
// ============================================================================
export const initialRPosCustomerInfo: RPosCustomerInfo = {
  partyId: 0,
  customerType: "",
  customerName: "",
  taxRegNumber: "",
  mobileNo: "",
  telephoneCallingNumber: "",
  address: {
    line1: "",
    line2: "",
    line3: "",
    line4: "",
  },
  notes1: "",
  notes2: "",
};

// ============================================================================
// PAYMENT CONFIG INITIAL STATE
// ============================================================================
export const initialRPosPaymentConfig: RPosPaymentConfig = {
  disableCardPayment: false,
  disablePaymentPopupForCreditParties: false,
  doNotPopupPaymentWindowInBilling: false,
  enablePayLaterOption: false,
  deliveryChargeAmount: 0,
  defaultCashLedgerId: 0,
};

// ============================================================================
// WAITER CONFIG INITIAL STATE
// ============================================================================
export const initialRPosWaiterConfig: RPosWaiterConfig = {
  showWaiterAfterSave: false,
  settleOrderWithLastSelectedEmployee: false,
  enableCounterShift: true,
  prevDeliveryManId: 0,
  prevSalesManId: 0,
};

// ============================================================================
// VOUCHER STATE INITIAL
// ============================================================================
export const initialRPosVoucherState: RPosVoucherState = {
  voucherType: "SO",
  voucherPrefix: "",
  formType: "",
  defaultServeType: "DINE IN",
};

// ============================================================================
// KITCHEN CONTEXT INITIAL STATE
// ============================================================================
export const initialRPosKitchenContext: RPosKitchenContext = {
  availableKitchens: [],
  defaultKitchenId: null,
  lastLoadedAt: null,
};

// ============================================================================
// COMBINED OPERATIONAL INITIAL STATE
// ============================================================================
export const initialRPosOperationalState: RPosOperationalState = {
  printConfig: initialRPosPrintConfig,
  productConfig: initialRPosProductConfig,
  multiUnit: initialRPosMultiUnit,
  dining: initialRPosDiningContext,
  session: initialRPosSessionInfo,
  customer: initialRPosCustomerInfo,
  payment: initialRPosPaymentConfig,
  waiter: initialRPosWaiterConfig,
  voucher: initialRPosVoucherState,
  kitchen: initialRPosKitchenContext,
};
