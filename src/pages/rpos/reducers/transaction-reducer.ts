import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  initialRPosTransactionState,
  initialRPosPaymentState,
  initialRPosAmountSummary,
  initialRPosVoucherIds,
} from "../type/rpos-type-data.ts/rpos-transaction-data";
import {
  RPosTransactionState,
  RPosOrderItem,
  RPosPaymentState,
  RPosAmountSummary,
  RPosVoucherIds,
} from "../type/rpos-transaction";

const rPosTransactionSlice = createSlice({
  name: "rPosTransaction",
  initialState: initialRPosTransactionState,
  reducers: {
    // ========================================================================
    // VOUCHER IDS
    // ========================================================================
    setVoucherIds(state, action: PayloadAction<Partial<RPosVoucherIds>>) {
      state.activeOrder.voucherIds = {
        ...state.activeOrder.voucherIds,
        ...action.payload,
      };
    },
    resetVoucherIds(state) {
      state.activeOrder.voucherIds = initialRPosVoucherIds;
    },

    // ========================================================================
    // ORDER ITEMS
    // ========================================================================
    addOrderItem(state, action: PayloadAction<RPosOrderItem>) {
      const existingIndex = state.activeOrder.items.findIndex(
        (item) =>
          item.productBatchId === action.payload.productBatchId &&
          item.rate === action.payload.rate
      );

      if (existingIndex >= 0) {
        // Increment quantity if same product and rate
        state.activeOrder.items[existingIndex].quantity +=
          action.payload.quantity;
        // Recalculate amounts
        const item = state.activeOrder.items[existingIndex];
        item.grossAmount = item.quantity * item.rate;
        item.netAmount =
          item.grossAmount -
          item.discountAmount +
          item.taxAmount +
          item.vatAmount;
      } else {
        // Add new item with next row index
        const maxRowIndex = state.activeOrder.items.reduce(
          (max, item) => Math.max(max, item.rowIndex),
          0
        );
        state.activeOrder.items.push({
          ...action.payload,
          rowIndex: maxRowIndex + 1,
        });
      }
      state.activeOrder.isDirty = true;
    },

    updateOrderItem(
      state,
      action: PayloadAction<{ rowIndex: number; updates: Partial<RPosOrderItem> }>
    ) {
      const { rowIndex, updates } = action.payload;
      const itemIndex = state.activeOrder.items.findIndex(
        (item) => item.rowIndex === rowIndex
      );
      if (itemIndex >= 0) {
        state.activeOrder.items[itemIndex] = {
          ...state.activeOrder.items[itemIndex],
          ...updates,
        };
        state.activeOrder.isDirty = true;
      }
    },

    updateOrderItemQuantity(
      state,
      action: PayloadAction<{ rowIndex: number; quantity: number }>
    ) {
      const { rowIndex, quantity } = action.payload;
      const itemIndex = state.activeOrder.items.findIndex(
        (item) => item.rowIndex === rowIndex
      );
      if (itemIndex >= 0) {
        const item = state.activeOrder.items[itemIndex];
        item.quantity = quantity;
        item.grossAmount = item.quantity * item.rate;
        item.netAmount =
          item.grossAmount -
          item.discountAmount +
          item.taxAmount +
          item.vatAmount;
        state.activeOrder.isDirty = true;
      }
    },

    incrementOrderItemQty(state, action: PayloadAction<number>) {
      const itemIndex = state.activeOrder.items.findIndex(
        (item) => item.rowIndex === action.payload
      );
      if (itemIndex >= 0) {
        const item = state.activeOrder.items[itemIndex];
        item.quantity += 1;
        item.grossAmount = item.quantity * item.rate;
        item.netAmount =
          item.grossAmount -
          item.discountAmount +
          item.taxAmount +
          item.vatAmount;
        state.activeOrder.isDirty = true;
      }
    },

    decrementOrderItemQty(state, action: PayloadAction<number>) {
      const itemIndex = state.activeOrder.items.findIndex(
        (item) => item.rowIndex === action.payload
      );
      if (itemIndex >= 0) {
        const item = state.activeOrder.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.grossAmount = item.quantity * item.rate;
          item.netAmount =
            item.grossAmount -
            item.discountAmount +
            item.taxAmount +
            item.vatAmount;
          state.activeOrder.isDirty = true;
        }
      }
    },

    removeOrderItem(state, action: PayloadAction<number>) {
      state.activeOrder.items = state.activeOrder.items.filter(
        (item) => item.rowIndex !== action.payload
      );
      state.activeOrder.isDirty = true;
    },

    clearOrderItems(state) {
      state.activeOrder.items = [];
      state.activeOrder.isDirty = false;
    },

    setOrderItems(state, action: PayloadAction<RPosOrderItem[]>) {
      state.activeOrder.items = action.payload;
      state.activeOrder.isDirty = false;
    },

    // ========================================================================
    // PAYMENT STATE
    // ========================================================================
    setPaymentState(state, action: PayloadAction<Partial<RPosPaymentState>>) {
      state.payment = { ...state.payment, ...action.payload };
    },

    setCashReceived(state, action: PayloadAction<number>) {
      state.payment.cashReceived = action.payload;
    },

    setCardAmount(state, action: PayloadAction<number>) {
      state.payment.cardAmount = action.payload;
    },

    setUpiAmount(state, action: PayloadAction<number>) {
      state.payment.upiAmount = action.payload;
    },

    setDiscountPercent(state, action: PayloadAction<number>) {
      state.payment.discountPercent = action.payload;
    },

    setDiscountAmount(state, action: PayloadAction<number>) {
      state.payment.discountAmount = action.payload;
    },

    setRoundOff(state, action: PayloadAction<number>) {
      state.payment.roundOff = action.payload;
    },

    setPayType(
      state,
      action: PayloadAction<"General" | "Credit" | "Cash">
    ) {
      state.payment.payType = action.payload;
    },

    setPayLater(state, action: PayloadAction<boolean>) {
      state.payment.payLater = action.payload;
    },

    resetPaymentState(state) {
      state.payment = initialRPosPaymentState;
    },

    // ========================================================================
    // AMOUNT SUMMARY
    // ========================================================================
    setSummary(state, action: PayloadAction<Partial<RPosAmountSummary>>) {
      state.summary = { ...state.summary, ...action.payload };
    },

    calculateSummary(state) {
      const items = state.activeOrder.items;

      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalGross = items.reduce((sum, item) => sum + item.grossAmount, 0);
      const totalDiscount = items.reduce(
        (sum, item) => sum + item.discountAmount,
        0
      );
      const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
      const totalVat = items.reduce((sum, item) => sum + item.vatAmount, 0);
      const subTotal = items.reduce((sum, item) => sum + item.netAmount, 0);

      const additionalAmount = state.summary.additionalAmount;
      const grandTotal = subTotal + additionalAmount + state.payment.roundOff;
      const cashReceived =
        state.payment.cashReceived +
        state.payment.cardAmount +
        state.payment.upiAmount;
      const balance = grandTotal - cashReceived;

      state.summary = {
        ...state.summary,
        subTotal,
        totalQuantity,
        totalGross,
        totalDiscount,
        totalTax,
        totalVat,
        grandTotal,
        cashReceived,
        balance,
      };
    },

    resetSummary(state) {
      state.summary = initialRPosAmountSummary;
    },

    // ========================================================================
    // MERGE/INACTIVE MASTER IDS
    // ========================================================================
    addMasterIdToInactive(state, action: PayloadAction<number>) {
      if (!state.masterIdsToInactive.includes(action.payload)) {
        state.masterIdsToInactive.push(action.payload);
      }
    },

    removeMasterIdFromInactive(state, action: PayloadAction<number>) {
      state.masterIdsToInactive = state.masterIdsToInactive.filter(
        (id) => id !== action.payload
      );
    },

    clearMasterIdsToInactive(state) {
      state.masterIdsToInactive = [];
    },

    addMergeTableMasterId(state, action: PayloadAction<number>) {
      if (!state.mergeTableMasterIds.includes(action.payload)) {
        state.mergeTableMasterIds.push(action.payload);
      }
    },

    removeMergeTableMasterId(state, action: PayloadAction<number>) {
      state.mergeTableMasterIds = state.mergeTableMasterIds.filter(
        (id) => id !== action.payload
      );
    },

    clearMergeTableMasterIds(state) {
      state.mergeTableMasterIds = [];
    },

    // ========================================================================
    // DIRTY FLAG
    // ========================================================================
    setOrderDirty(state, action: PayloadAction<boolean>) {
      state.activeOrder.isDirty = action.payload;
    },

    // ========================================================================
    // BULK OPERATIONS
    // ========================================================================
    updateTransactionState(
      state,
      action: PayloadAction<Partial<RPosTransactionState>>
    ) {
      return { ...state, ...action.payload };
    },

    resetTransactionState() {
      return initialRPosTransactionState;
    },

    // ========================================================================
    // NEW ORDER - Reset all transaction state for new order
    // ========================================================================
    prepareNewTransaction(state) {
      state.activeOrder = {
        voucherIds: initialRPosVoucherIds,
        items: [],
        isDirty: false,
      };
      state.payment = initialRPosPaymentState;
      state.summary = initialRPosAmountSummary;
      state.masterIdsToInactive = [];
      state.mergeTableMasterIds = [];
    },
  },
});

export const {
  // Voucher IDs
  setVoucherIds,
  resetVoucherIds,
  // Order Items
  addOrderItem,
  updateOrderItem,
  updateOrderItemQuantity,
  incrementOrderItemQty,
  decrementOrderItemQty,
  removeOrderItem,
  clearOrderItems,
  setOrderItems,
  // Payment State
  setPaymentState,
  setCashReceived,
  setCardAmount,
  setUpiAmount,
  setDiscountPercent,
  setDiscountAmount,
  setRoundOff,
  setPayType,
  setPayLater,
  resetPaymentState,
  // Summary
  setSummary,
  calculateSummary,
  resetSummary,
  // Master IDs
  addMasterIdToInactive,
  removeMasterIdFromInactive,
  clearMasterIdsToInactive,
  addMergeTableMasterId,
  removeMergeTableMasterId,
  clearMergeTableMasterIds,
  // Dirty Flag
  setOrderDirty,
  // Bulk
  updateTransactionState,
  resetTransactionState,
  prepareNewTransaction,
} = rPosTransactionSlice.actions;

export default rPosTransactionSlice.reducer;
