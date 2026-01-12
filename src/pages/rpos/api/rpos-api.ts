/**
 * RPOS API - Main RTK Query API
 * Central API for all RPOS operations with automatic caching
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { rposBaseQuery } from "./base-query";

// Import types
import {
  RPosOrderItem,
  KitchenMessage,
  PendingOrder,
  SettlementInvoice,
  RPosTransactionData,
} from "../type/rpos-transaction";
import { Kitchen } from "../type/rpos-operational";

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Product Types
export interface ProductGroup {
  productGroupId: number;
  groupName: string;
  groupCode: string;
  parentGroupId: number | null;
  imageUrl?: string;
  sortOrder: number;
}

export interface ProductItem {
  productId: number;
  productBatchId: number;
  productCode: string;
  productName: string;
  barcode: string;
  rate: number;
  mrp: number;
  taxPercent: number;
  taxAmount: number;
  unitId: number;
  unitName: string;
  kitchenId: number;
  kitchenName: string;
  imageUrl?: string;
  stock: number;
  groupId: number;
}

// Table Types
export interface TableInfo {
  tableId: number;
  tableNo: string;
  seatCount: number;
  status: "available" | "occupied" | "reserved";
  currentOrderId?: number;
  floorId: number;
  floorName: string;
}

// Customer Types
export interface CustomerSearch {
  partyId: number;
  customerName: string;
  mobileNo: string;
  address: string;
  balance: number;
}

// Waiter Types
export interface Waiter {
  employeeId: number;
  employeeName: string;
  code: string;
}

// Order Save Request
export interface SaveOrderRequest {
  transactionData: RPosTransactionData;
  voucherType: string;
  formType: string;
  tableNo: string;
  seatNo: string;
  serveType: string;
  isPaid: boolean;
  printKOT: boolean;
  printBill: boolean;
}

// Order Save Response
export interface SaveOrderResponse {
  success: boolean;
  invTransMasterId: number;
  accTransMasterId: number;
  voucherNumber: string;
  message?: string;
  printToken?: string;
}

// KOT Request
export interface KOTRequest {
  items: RPosOrderItem[];
  tableNo: string;
  seatNo: string;
  tokenNumber: string;
  waiterId: number;
  waiterName: string;
  serveType: string;
  kitchenRemarks?: string;
}

// Settlement Request
export interface SettlementRequest {
  invoiceIds: number[];
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  discountAmount: number;
  roundOff: number;
  bankLedgerId?: number;
  upiLedgerId?: number;
}

// ============================================================================
// RTK QUERY API DEFINITION
// ============================================================================

export const rposApi = createApi({
  reducerPath: "rposApi",
  baseQuery: rposBaseQuery,
  tagTypes: [
    "Products",
    "ProductGroups",
    "Tables",
    "PendingOrders",
    "Kitchens",
    "Customers",
    "Waiters",
    "Order",
    "Settlement",
  ],
  endpoints: (builder) => ({
    // ========================================================================
    // PRODUCT GROUP ENDPOINTS
    // ========================================================================
    getProductGroups: builder.query<ProductGroup[], void>({
      query: () => ({
        url: "/Inventory/Data/ProductGroup",
        method: "GET",
        // RTK Query handles caching via keepUnusedDataFor
      }),
      providesTags: ["ProductGroups"],
    }),

    getGroupCategories: builder.query<ProductGroup[], number>({
      query: (groupId) => ({
        url: "/Inventory/Data/GroupCategory",
        params: `groupId=${groupId}`,
        method: "GET",
        // RTK Query handles caching via keepUnusedDataFor
      }),
      providesTags: ["ProductGroups"],
    }),

    // ========================================================================
    // PRODUCT ENDPOINTS
    // ========================================================================
    getProductsByGroup: builder.query<ProductItem[], { groupId: number; priceCategoryId?: number }>({
      query: ({ groupId, priceCategoryId = 0 }) => ({
        url: "/RPOS/Products/ByGroup",
        params: `groupId=${groupId}&priceCategoryId=${priceCategoryId}`,
        method: "GET",
      }),
      providesTags: (result, error, { groupId }) => [
        { type: "Products", id: groupId },
      ],
    }),

    searchProducts: builder.query<ProductItem[], { searchTerm: string; priceCategoryId?: number }>({
      query: ({ searchTerm, priceCategoryId = 0 }) => ({
        url: "/RPOS/Products/Search",
        params: `searchTerm=${encodeURIComponent(searchTerm)}&priceCategoryId=${priceCategoryId}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getProductByBarcode: builder.query<ProductItem, string>({
      query: (barcode) => ({
        url: "/RPOS/Products/ByBarcode",
        params: `barcode=${encodeURIComponent(barcode)}`,
        method: "GET",
      }),
    }),

    // ========================================================================
    // TABLE ENDPOINTS
    // ========================================================================
    getTables: builder.query<TableInfo[], number | void>({
      query: (floorId) => ({
        url: "/RPOS/Tables",
        params: floorId ? `floorId=${floorId}` : "",
        method: "GET",
      }),
      providesTags: ["Tables"],
    }),

    getTableStatus: builder.query<TableInfo, string>({
      query: (tableNo) => ({
        url: "/RPOS/Tables/Status",
        params: `tableNo=${tableNo}`,
        method: "GET",
      }),
      providesTags: (result, error, tableNo) => [
        { type: "Tables", id: tableNo },
      ],
    }),

    // ========================================================================
    // KITCHEN ENDPOINTS
    // ========================================================================
    getKitchens: builder.query<Kitchen[], void>({
      query: () => ({
        url: "/Inventory/Data/Kitchens",
        method: "GET",
        // RTK Query handles caching via keepUnusedDataFor
      }),
      providesTags: ["Kitchens"],
    }),

    sendKitchenMessage: builder.mutation<{ success: boolean }, KitchenMessage>({
      query: (message) => ({
        url: "/RPOS/Kitchen/Message",
        method: "POST",
        body: message,
      }),
    }),

    // ========================================================================
    // PENDING ORDER ENDPOINTS
    // ========================================================================
    getPendingOrders: builder.query<PendingOrder[], { serveType?: string }>({
      query: ({ serveType }) => ({
        url: "/RPOS/PendingOrders",
        params: serveType ? `serveType=${serveType}` : "",
        method: "GET",
      }),
      providesTags: ["PendingOrders"],
    }),

    getPendingOrderByTable: builder.query<PendingOrder, string>({
      query: (tableNo) => ({
        url: "/RPOS/PendingOrders/ByTable",
        params: `tableNo=${tableNo}`,
        method: "GET",
      }),
      providesTags: (result, error, tableNo) => [
        { type: "PendingOrders", id: tableNo },
      ],
    }),

    loadOrder: builder.query<RPosTransactionData, number>({
      query: (invTransMasterId) => ({
        url: "/RPOS/Order/Load",
        params: `invTransMasterId=${invTransMasterId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // ========================================================================
    // ORDER SAVE ENDPOINTS
    // ========================================================================
    saveOrder: builder.mutation<SaveOrderResponse, SaveOrderRequest>({
      query: (orderData) => ({
        url: "/RPOS/Order/Save",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["PendingOrders", "Tables"],
    }),

    saveKOT: builder.mutation<SaveOrderResponse, KOTRequest>({
      query: (kotData) => ({
        url: "/RPOS/Order/SaveKOT",
        method: "POST",
        body: kotData,
      }),
      invalidatesTags: ["PendingOrders", "Tables"],
    }),

    holdOrder: builder.mutation<SaveOrderResponse, SaveOrderRequest>({
      query: (orderData) => ({
        url: "/RPOS/Order/Hold",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["PendingOrders"],
    }),

    voidOrder: builder.mutation<{ success: boolean }, number>({
      query: (invTransMasterId) => ({
        url: "/RPOS/Order/Void",
        method: "POST",
        body: { invTransMasterId },
      }),
      invalidatesTags: ["PendingOrders", "Tables"],
    }),

    // ========================================================================
    // SETTLEMENT ENDPOINTS
    // ========================================================================
    getSettlementInvoices: builder.query<SettlementInvoice[], void>({
      query: () => ({
        url: "/RPOS/Settlement/Invoices",
        method: "GET",
      }),
      providesTags: ["Settlement"],
    }),

    processSettlement: builder.mutation<SaveOrderResponse, SettlementRequest>({
      query: (settlementData) => ({
        url: "/RPOS/Settlement/Process",
        method: "POST",
        body: settlementData,
      }),
      invalidatesTags: ["Settlement", "PendingOrders"],
    }),

    // ========================================================================
    // CUSTOMER ENDPOINTS
    // ========================================================================
    searchCustomers: builder.query<CustomerSearch[], string>({
      query: (searchTerm) => ({
        url: "/Accounts/Data/Customers",
        params: `searchTerm=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),

    getCustomerByMobile: builder.query<CustomerSearch, string>({
      query: (mobileNo) => ({
        url: "/RPOS/Customer/ByMobile",
        params: `mobileNo=${mobileNo}`,
        method: "GET",
      }),
    }),

    // ========================================================================
    // WAITER ENDPOINTS
    // ========================================================================
    getWaiters: builder.query<Waiter[], void>({
      query: () => ({
        url: "/Data/Employees",
        method: "GET",
        // RTK Query handles caching via keepUnusedDataFor
      }),
      providesTags: ["Waiters"],
    }),

    // ========================================================================
    // PRINT ENDPOINTS
    // ========================================================================
    getPrintData: builder.query<unknown, string>({
      query: (printToken) => ({
        url: "/PrintHelper/PrintData",
        params: `token=${printToken}`,
        method: "GET",
      }),
    }),

    // ========================================================================
    // CONFIG ENDPOINTS
    // ========================================================================
    getRPosConfig: builder.query<Record<string, unknown>, void>({
      query: () => ({
        url: "/RPOS/Config",
        method: "GET",
        // RTK Query handles caching via keepUnusedDataFor
      }),
    }),
  }),
});

// ============================================================================
// EXPORT HOOKS
// ============================================================================
export const {
  // Product Groups
  useGetProductGroupsQuery,
  useGetGroupCategoriesQuery,
  // Products
  useGetProductsByGroupQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetProductByBarcodeQuery,
  useLazyGetProductByBarcodeQuery,
  // Tables
  useGetTablesQuery,
  useGetTableStatusQuery,
  // Kitchens
  useGetKitchensQuery,
  useSendKitchenMessageMutation,
  // Pending Orders
  useGetPendingOrdersQuery,
  useGetPendingOrderByTableQuery,
  useLoadOrderQuery,
  useLazyLoadOrderQuery,
  // Order Save
  useSaveOrderMutation,
  useSaveKOTMutation,
  useHoldOrderMutation,
  useVoidOrderMutation,
  // Settlement
  useGetSettlementInvoicesQuery,
  useProcessSettlementMutation,
  // Customers
  useSearchCustomersQuery,
  useLazySearchCustomersQuery,
  useGetCustomerByMobileQuery,
  useLazyGetCustomerByMobileQuery,
  // Waiters
  useGetWaitersQuery,
  // Print
  useGetPrintDataQuery,
  useLazyGetPrintDataQuery,
  // Config
  useGetRPosConfigQuery,
} = rposApi;

export default rposApi;
