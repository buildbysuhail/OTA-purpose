/**
 * RPOS API - Centralized Exports
 * All RTK Query APIs and hooks for RPOS module
 */

// Base Query
export { rposBaseQuery } from "./base-query";
export type { QueryArgs, QueryError } from "./base-query";

// Main API
export { default as rposApi } from "./rpos-api";

// Export all hooks
export {
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
} from "./rpos-api";

// Export types
export type {
  ProductGroup,
  ProductItem,
  TableInfo,
  CustomerSearch,
  Waiter,
  SaveOrderRequest,
  SaveOrderResponse,
  KOTRequest,
  SettlementRequest,
} from "./rpos-api";
