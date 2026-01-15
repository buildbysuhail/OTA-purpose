import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  initialRPosOperationalState,
  initialRPosPrintConfig,
  initialRPosProductConfig,
  initialRPosMultiUnit,
  initialRPosDiningContext,
  initialRPosSessionInfo,
  initialRPosCustomerInfo,
  initialRPosPaymentConfig,
  initialRPosWaiterConfig,
  initialRPosVoucherState,
  initialRPosKitchenContext,
} from "../type/rpos-type-data.ts/rpos-operational-data";
import {
  RPosOperationalState,
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
  ServeType,
  VoucherType,
  Kitchen,
} from "../type/rpos-operational";

const rPosOperationalSlice = createSlice({
  name: "rPosOperational",
  initialState: initialRPosOperationalState,
  reducers: {
    // ========================================================================
    // PRINT CONFIG
    // ========================================================================
    setPrintConfig(
      state,
      action: PayloadAction<Partial<RPosPrintConfig>>
    ) {
      state.printConfig = { ...state.printConfig, ...action.payload };
    },
    resetPrintConfig(state) {
      state.printConfig = initialRPosPrintConfig;
    },

    // ========================================================================
    // PRODUCT CONFIG
    // ========================================================================
    setProductConfig(
      state,
      action: PayloadAction<Partial<RPosProductConfig>>
    ) {
      state.productConfig = { ...state.productConfig, ...action.payload };
    },
    resetProductConfig(state) {
      state.productConfig = initialRPosProductConfig;
    },

    // ========================================================================
    // MULTI-UNIT
    // ========================================================================
    setMultiUnit(state, action: PayloadAction<RPosMultiUnit>) {
      state.multiUnit = action.payload;
    },
    resetMultiUnit(state) {
      state.multiUnit = initialRPosMultiUnit;
    },

    // ========================================================================
    // DINING CONTEXT
    // ========================================================================
    setDiningContext(
      state,
      action: PayloadAction<Partial<RPosDiningContext>>
    ) {
      state.dining = { ...state.dining, ...action.payload };
    },
    setTableNo(state, action: PayloadAction<string>) {
      state.dining.tableNo = action.payload;
      state.dining.isTableSelected = action.payload !== "";
    },
    setSeatNo(state, action: PayloadAction<string>) {
      state.dining.seatNo = action.payload;
      state.dining.isSeatSelected = action.payload !== "";
    },
    setServeType(state, action: PayloadAction<ServeType>) {
      state.dining.serveType = action.payload;
    },
    setNumberOfGuests(state, action: PayloadAction<number>) {
      state.dining.numberOfGuests = action.payload;
    },
    setSplittingContext(
      state,
      action: PayloadAction<{
        invTransMasterId: number;
        tableId: number;
        tableNumber: string;
      }>
    ) {
      state.dining.splittingInvTransMasterId = action.payload.invTransMasterId;
      state.dining.splittingTableId = action.payload.tableId;
      state.dining.splittingTableNumber = action.payload.tableNumber;
    },
    clearSplittingContext(state) {
      state.dining.splittingInvTransMasterId = 0;
      state.dining.splittingTableId = 0;
      state.dining.splittingTableNumber = "";
    },
    setMergeContext(
      state,
      action: PayloadAction<{ tableId: number; tableNumber: string }>
    ) {
      state.dining.mergeTableId = action.payload.tableId;
      state.dining.mergeTableNumber = action.payload.tableNumber;
    },
    clearMergeContext(state) {
      state.dining.mergeTableId = 0;
      state.dining.mergeTableNumber = "";
    },
    setPendingOrder(
      state,
      action: PayloadAction<RPosDiningContext["pendingOrder"]>
    ) {
      state.dining.pendingOrder = action.payload;
    },
    clearPendingOrder(state) {
      state.dining.pendingOrder = {
        tableId: 0,
        tableNumber: "",
        token: "",
        isLoaded: false,
      };
    },
    resetDiningContext(state) {
      state.dining = initialRPosDiningContext;
    },

    // ========================================================================
    // SESSION INFO
    // ========================================================================
    setSessionInfo(state, action: PayloadAction<Partial<RPosSessionInfo>>) {
      state.session = { ...state.session, ...action.payload };
    },
    resetSessionInfo(state) {
      state.session = initialRPosSessionInfo;
    },

    // ========================================================================
    // CUSTOMER INFO
    // ========================================================================
    setCustomerInfo(state, action: PayloadAction<Partial<RPosCustomerInfo>>) {
      state.customer = { ...state.customer, ...action.payload };
    },
    setCustomerAddress(
      state,
      action: PayloadAction<Partial<RPosCustomerInfo["address"]>>
    ) {
      state.customer.address = { ...state.customer.address, ...action.payload };
    },
    clearCustomerInfo(state) {
      state.customer = initialRPosCustomerInfo;
    },

    // ========================================================================
    // PAYMENT CONFIG
    // ========================================================================
    setPaymentConfig(
      state,
      action: PayloadAction<Partial<RPosPaymentConfig>>
    ) {
      state.payment = { ...state.payment, ...action.payload };
    },
    resetPaymentConfig(state) {
      state.payment = initialRPosPaymentConfig;
    },

    // ========================================================================
    // WAITER CONFIG
    // ========================================================================
    setWaiterConfig(state, action: PayloadAction<Partial<RPosWaiterConfig>>) {
      state.waiter = { ...state.waiter, ...action.payload };
    },
    resetWaiterConfig(state) {
      state.waiter = initialRPosWaiterConfig;
    },

    // ========================================================================
    // VOUCHER STATE
    // ========================================================================
    setVoucherState(state, action: PayloadAction<Partial<RPosVoucherState>>) {
      state.voucher = { ...state.voucher, ...action.payload };
    },
    setVoucherType(state, action: PayloadAction<VoucherType>) {
      state.voucher.voucherType = action.payload;
    },
    resetVoucherState(state) {
      state.voucher = initialRPosVoucherState;
    },

    // ========================================================================
    // KITCHEN CONTEXT
    // ========================================================================
    setKitchenContext(
      state,
      action: PayloadAction<Partial<RPosKitchenContext>>
    ) {
      state.kitchen = { ...state.kitchen, ...action.payload };
    },
    setAvailableKitchens(state, action: PayloadAction<Kitchen[]>) {
      state.kitchen.availableKitchens = action.payload;
      state.kitchen.lastLoadedAt = new Date().toISOString();
    },
    setDefaultKitchen(state, action: PayloadAction<number | null>) {
      state.kitchen.defaultKitchenId = action.payload;
    },
    resetKitchenContext(state) {
      state.kitchen = initialRPosKitchenContext;
    },

    // ========================================================================
    // BULK OPERATIONS
    // ========================================================================
    updateOperationalState(
      state,
      action: PayloadAction<Partial<RPosOperationalState>>
    ) {
      return { ...state, ...action.payload };
    },
    resetOperationalState() {
      return initialRPosOperationalState;
    },

    // ========================================================================
    // NEW ORDER - Reset transient operational state for new order
    // ========================================================================
    prepareForNewOrder(state) {
      state.dining = {
        ...initialRPosDiningContext,
        serveType: state.voucher.defaultServeType,
        seats: state.dining.seats,
      };
      state.customer = initialRPosCustomerInfo;
      state.multiUnit = initialRPosMultiUnit;
    },
  },
});

export const {
  // Print Config
  setPrintConfig,
  resetPrintConfig,
  // Product Config
  setProductConfig,
  resetProductConfig,
  // Multi-Unit
  setMultiUnit,
  resetMultiUnit,
  // Dining Context
  setDiningContext,
  setTableNo,
  setSeatNo,
  setServeType,
  setNumberOfGuests,
  setSplittingContext,
  clearSplittingContext,
  setMergeContext,
  clearMergeContext,
  setPendingOrder,
  clearPendingOrder,
  resetDiningContext,
  // Session Info
  setSessionInfo,
  resetSessionInfo,
  // Customer Info
  setCustomerInfo,
  setCustomerAddress,
  clearCustomerInfo,
  // Payment Config
  setPaymentConfig,
  resetPaymentConfig,
  // Waiter Config
  setWaiterConfig,
  resetWaiterConfig,
  // Voucher State
  setVoucherState,
  setVoucherType,
  resetVoucherState,
  // Kitchen Context
  setKitchenContext,
  setAvailableKitchens,
  setDefaultKitchen,
  resetKitchenContext,
  // Bulk
  updateOperationalState,
  resetOperationalState,
  prepareForNewOrder,
} = rPosOperationalSlice.actions;

export default rPosOperationalSlice.reducer;
