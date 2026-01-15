/**
 * RPOS Transaction Initial State Data
 * Default values for transaction state (in-memory only)
 * Server is always source of truth - these are just defaults
 */

import {
  RPosPaymentState,
  RPosAmountSummary,
  RPosVoucherIds,
  RPosTransactionState,
} from "../rpos-transaction";

// ============================================================================
// VOUCHER IDS INITIAL STATE
// ============================================================================
export const initialRPosVoucherIds: RPosVoucherIds = {
  invTransMasterId: 0,
  accTransMasterId: 0,
  partyAccTransDetailId: 0,
  partyCashRcvdTransDetailId: 0,
  guidTransaction: "",
};

// ============================================================================
// PAYMENT STATE INITIAL
// ============================================================================
export const initialRPosPaymentState: RPosPaymentState = {
  cashReceived: 0,
  cardAmount: 0,
  upiAmount: 0,
  couponAmount: 0,
  redeemAmount: 0,
  discountPercent: 0,
  discountAmount: 0,
  taxOnDiscount: 0,
  roundOff: 0,
  cashTip: 0,
  cardTip: 0,
  payType: "General",
  payLater: false,
  creditCardNumber: "",
  bankLedgerId: 0,
  upiLedgerId: 0,
};

// ============================================================================
// AMOUNT SUMMARY INITIAL STATE
// ============================================================================
export const initialRPosAmountSummary: RPosAmountSummary = {
  subTotal: 0,
  totalQuantity: 0,
  totalGross: 0,
  totalDiscount: 0,
  totalTax: 0,
  totalVat: 0,
  additionalAmount: 0,
  grandTotal: 0,
  cashReceived: 0,
  balance: 0,
  exchangeRate: 1,
  fcAmount: 0,
};

// ============================================================================
// COMBINED TRANSACTION INITIAL STATE
// ============================================================================
export const initialRPosTransactionState: RPosTransactionState = {
  activeOrder: {
    voucherIds: initialRPosVoucherIds,
    items: [],
    isDirty: false,
  },
  payment: initialRPosPaymentState,
  summary: initialRPosAmountSummary,
  masterIdsToInactive: [],
  mergeTableMasterIds: [],
};
