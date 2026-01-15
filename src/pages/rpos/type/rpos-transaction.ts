/**
 * RPOS Transaction State Types
 * Business transaction data from server (NOT persisted locally)
 * Server is always the source of truth
 */

import { TransactionDetail, TransactionMaster } from "../../inventory/transactions/transaction-types";

// ============================================================================
// TRANSACTION DATA - Core order/invoice data
// ============================================================================
export interface RPosTransactionData {
  master: TransactionMaster;
  details: TransactionDetail[];
  invAccTransactions: InvAccTransaction[];
  couponDetails: CouponDetail[];
  privilegeCardDetails: PrivilegeCardDetail[];
  bankCardDetails: SettlementDetail[];
  upiDetails: SettlementDetail[];
}

// ============================================================================
// ACCOUNTING TRANSACTION
// ============================================================================
export interface InvAccTransaction {
  accTransDetailId: number;
  accTransMasterId: number;
  ledgerId: number;
  debit: number;
  credit: number;
}

// ============================================================================
// COUPON DETAILS
// ============================================================================
export interface CouponDetail {
  couponId: number;
  couponNumber: string;
  couponHolderName: string;
  couponAmount: number;
  couponBalance: number;
  paymentCouponAmount: number;
}

// ============================================================================
// PRIVILEGE CARD DETAILS
// ============================================================================
export interface PrivilegeCardDetail {
  privilegeCardId: number;
  cardNumber: string;
  cardHolderName: string;
  oldPrevPoints: number;
  addPrevPoints: number;
  redeemPoints: number;
  netPrevPoints: number;
  redeemAmount: number;
}

// ============================================================================
// SETTLEMENT/PAYMENT DETAILS
// ============================================================================
export interface SettlementDetail {
  id: number;
  type: "CASH" | "CARD" | "UPI" | "BANK";
  amount: number;
  ledgerId: number;
  cardNumber?: string;
  referenceNumber?: string;
}

// ============================================================================
// ORDER ITEM - Single line item in order
// ============================================================================
export interface RPosOrderItem {
  rowIndex: number;
  productBatchId: number;
  productId: number;
  productCode: string;
  productName: string;
  description: string;
  quantity: number;
  unitId: number;
  unitName: string;
  rate: number;
  grossAmount: number;
  discountPercent: number;
  discountAmount: number;
  taxAmount: number;
  vatAmount: number;
  cstAmount: number;
  netAmount: number;
  kitchenId: number;
  kitchenName: string;
  isKOTPrinted: boolean;
  isPrinted: boolean;
  remarks: string;
}

// ============================================================================
// PAYMENT STATE - Payment form values
// ============================================================================
export interface RPosPaymentState {
  cashReceived: number;
  cardAmount: number;
  upiAmount: number;
  couponAmount: number;
  redeemAmount: number;
  discountPercent: number;
  discountAmount: number;
  taxOnDiscount: number;
  roundOff: number;
  cashTip: number;
  cardTip: number;
  payType: "General" | "Credit" | "Cash";
  payLater: boolean;
  creditCardNumber: string;
  bankLedgerId: number;
  upiLedgerId: number;
}

// ============================================================================
// AMOUNT SUMMARY - Calculated totals
// ============================================================================
export interface RPosAmountSummary {
  subTotal: number;
  totalQuantity: number;
  totalGross: number;
  totalDiscount: number;
  totalTax: number;
  totalVat: number;
  additionalAmount: number;
  grandTotal: number;
  cashReceived: number;
  balance: number;
  exchangeRate: number;
  fcAmount: number;
}

// ============================================================================
// KITCHEN MESSAGE
// ============================================================================
export interface KitchenMessage {
  id?: number;
  kitchenId: number;
  kitchenName?: string;
  tableNo: string;
  seatNo: string;
  orderNumber: string;
  tokenNumber: string;
  waiter: string;
  serveType: string;
  kitchenRemarks: string;
  createdDate?: string;
}

export interface KitchenMessageMaster {
  messageId: number;
  masterName: string;
}

// ============================================================================
// PENDING ORDER
// ============================================================================
export interface PendingOrder {
  invTransactionMasterId: number;
  voucherType: string;
  voucherNumber: string;
  prefix: string;
  tableNo: string;
  seatNo: string;
  tokenNumber: string;
  inOut: string;
  grandTotal: number;
  address2: string;
  customerName: string;
}

// ============================================================================
// SETTLEMENT INVOICE
// ============================================================================
export interface SettlementInvoice {
  invTransactionMasterId: number;
  voucherType: string;
  billNo: string;
  prefix: string;
  inOut: string;
  token: string;
  grandTotal: number;
  address2: string;
}

// ============================================================================
// VOUCHER IDENTIFIERS
// ============================================================================
export interface RPosVoucherIds {
  invTransMasterId: number;
  accTransMasterId: number;
  partyAccTransDetailId: number;
  partyCashRcvdTransDetailId: number;
  guidTransaction: string;
}

// ============================================================================
// COMBINED TRANSACTION STATE (In-memory only, not persisted)
// ============================================================================
export interface RPosTransactionState {
  // Current active order
  activeOrder: {
    voucherIds: RPosVoucherIds;
    items: RPosOrderItem[];
    isDirty: boolean;
  };

  // Current payment form state
  payment: RPosPaymentState;

  // Calculated summary
  summary: RPosAmountSummary;

  // Tables to merge/inactive
  masterIdsToInactive: number[];
  mergeTableMasterIds: number[];
}
