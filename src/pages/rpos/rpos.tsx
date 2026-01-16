import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RPosDropdownPanel from "./rpos-DropdownPanel";
import { useTranslation } from "react-i18next";

// Import the new TableSelectionPanel component
import { TableSelectionPanel } from "./components";

// Redux actions - UI
import {
  setSearchQuery,
  togglePanel,
  closePanel,
  setUiFlag,
  setFormState,
  setSelection,
  setLoading,
} from "./reducers/ui-reducer";

// Redux actions - Operational
import {
  setServeType,
  setTableNo,
  setSeatNo,
  setNumberOfGuests,
  setCustomerInfo,
  setVoucherType,
  setVoucherState,
  prepareForNewOrder,
  clearCustomerInfo,
  clearPendingOrder,
  setPendingOrder,
  setSessionInfo,
} from "./reducers/operational-reducer";

// Redux actions - Transaction
import {
  addOrderItem,
  incrementOrderItemQty,
  decrementOrderItemQty,
  removeOrderItem,
  setPayType,
  setCashReceived,
  calculateSummary,
  clearOrderItems,
  prepareNewTransaction,
  setOrderItems,
  setVoucherIds,
} from "./reducers/transaction-reducer";

// RTK Query hooks
import {
  useGetProductGroupsQuery,
  useGetProductsByGroupQuery,
  useLazySearchProductsQuery,
  useSaveOrderMutation,
  useSaveKOTMutation,
  useGetPendingOrderByTableQuery,
  useLazyLoadOrderQuery,
  useGetWaitersQuery,
  ProductGroup,
  ProductItem,
} from "./api";

// Types
import { VoucherType } from "./type/rpos-operational";

// Types (additional imports for component use)
import type { ServeType } from "./type/rpos-operational";
import type { RPosUIState } from "./type/rpos-ui-type";
import type { RPosOperationalState } from "./type/rpos-operational";
import type { RPosTransactionState, RPosOrderItem } from "./type/rpos-transaction";
import ERPAlert from "../../components/ERPComponents/erp-sweet-alert";

// Type for Redux state
interface RootState {
  RPosUi: RPosUIState;
  RPosOperational: RPosOperationalState;
  RPosTransaction: RPosTransactionState;
}

// Fallback mock data - used when API is not ready
const MOCK_CATEGORIES = ["Chinese", "Main Courses", "Sample", "Beverages"];
const MOCK_PRODUCTS: Record<string, ProductItem[]> = {
  Chinese: [{
    productId: 1, productBatchId: 1, productCode: "TST001", productName: "Test Item",
    barcode: "1001", rate: 100, mrp: 100, taxPercent: 0, taxAmount: 0,
    unitId: 1, unitName: "PCS", kitchenId: 1, kitchenName: "Main Kitchen",
    stock: 100, groupId: 1
  }],
  "Main Courses": [
    {
      productId: 2, productBatchId: 2, productCode: "KHO001", productName: "Khoya Kaju (Full)",
      barcode: "1002", rate: 80, mrp: 80, taxPercent: 0, taxAmount: 0,
      unitId: 1, unitName: "PCS", kitchenId: 1, kitchenName: "Main Kitchen",
      stock: 100, groupId: 2
    },
    {
      productId: 3, productBatchId: 3, productCode: "PAN001", productName: "Paneer Labadar",
      barcode: "1003", rate: 100, mrp: 100, taxPercent: 0, taxAmount: 0,
      unitId: 1, unitName: "PCS", kitchenId: 1, kitchenName: "Main Kitchen",
      stock: 100, groupId: 2
    },
  ],
  Sample: [],
  Beverages: [],
};

export default function RPos() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Redux state selectors
  const uiState = useSelector((state: RootState) => state.RPosUi);
  const operationalState = useSelector((state: RootState) => state.RPosOperational);
  const transactionState = useSelector((state: RootState) => state.RPosTransaction);

  // Local UI state for category selection (ephemeral, no need for Redux)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["dine_in"]);

  // RTK Query hooks for data fetching with caching
  const {
    data: productGroups = [],
    isLoading: isLoadingGroups,
    isError: isGroupsError
  } = useGetProductGroupsQuery();

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts
  } = useGetProductsByGroupQuery(
    { groupId: selectedGroupId ?? 0 },
    { skip: selectedGroupId === null }
  );

  // Lazy search for products
  const [searchProducts, { data: searchResults, isLoading: isSearching }] = useLazySearchProductsQuery();

  // Mutations for save operations
  const [saveOrder, { isLoading: isSavingOrder }] = useSaveOrderMutation();
  const [saveKOT, { isLoading: isSavingKOT }] = useSaveKOTMutation();

  // Lazy query for loading orders
  const [loadOrder, { isLoading: isLoadingOrder }] = useLazyLoadOrderQuery();

  // Get waiters for dropdown
  const { data: waiters = [] } = useGetWaitersQuery();

  // Select first group when groups are loaded
  useEffect(() => {
    if (productGroups.length > 0 && selectedGroupId === null) {
      setSelectedGroupId(productGroups[0].productGroupId);
    }
  }, [productGroups, selectedGroupId]);

  // Get display items - use search results if searching, otherwise use products from selected group
  const searchQuery = uiState.search.productSearchQuery;
  const displayProducts = useMemo(() => {
    if (searchQuery && searchQuery.length >= 2) {
      return searchResults ?? [];
    }
    return products;
  }, [searchQuery, searchResults, products]);

  // Trigger search when search query changes
useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchProducts({ searchTerm: searchQuery });
    }
  }, [searchQuery, searchProducts]);



  const selectedCategoryName = productGroups.find(g => g.productGroupId === selectedGroupId)?.groupName ?? MOCK_CATEGORIES[0];

  const menuItems = displayProducts.length > 0
    ? displayProducts
    : (MOCK_PRODUCTS[selectedCategoryName] ?? []);

  // Derived state
  const orderItems = transactionState.activeOrder.items;
  const summary = transactionState.summary;
  const dining = operationalState.dining;
  const payment = transactionState.payment;
  const voucherType = operationalState.voucher.voucherType;
  const isEdit = uiState.form.isEdit;
  const isBillingActive = uiState.form.isBillingActive;

  // Map serve type to UI key
  const serveTypeToKey = (serveType: ServeType): string => {
    switch (serveType) {
      case "DINE IN": return "dine_in";
      case "TAKE AWAY": return "pick_up";
      case "DELIVERY": return "delivery";
      default: return "dine_in";
    }
  };

  const keyToServeType = (key: string): ServeType => {
    switch (key) {
      case "dine_in": return "DINE IN";
      case "pick_up": return "TAKE AWAY";
      case "delivery": return "DELIVERY";
      default: return "DINE IN";
    }
  };

  const orderType = serveTypeToKey(dining.serveType);

  // Handlers
  const handleOrderTypeChange = useCallback((type: string) => {
    dispatch(setServeType(keyToServeType(type)));
  }, [dispatch]);

  const handleTableSelect = useCallback((tableNumber: string) => {
    dispatch(setTableNo(tableNumber));
  }, [dispatch]);

  const handleAddItem = useCallback((item: ProductItem) => {
    const orderItem: RPosOrderItem = {
      rowIndex: 0, // Will be set by reducer
      productBatchId: item.productBatchId,
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      description: "",
      quantity: 1,
      unitId: item.unitId,
      unitName: item.unitName,
      rate: item.rate,
      grossAmount: item.rate,
      discountPercent: 0,
      discountAmount: 0,
      taxAmount: item.taxAmount,
      vatAmount: 0,
      cstAmount: 0,
      netAmount: item.rate + item.taxAmount,
      kitchenId: item.kitchenId,
      kitchenName: item.kitchenName,
      isKOTPrinted: false,
      isPrinted: false,
      remarks: "",
    };
    dispatch(addOrderItem(orderItem));
    dispatch(calculateSummary());
  }, [dispatch]);

  const handleIncrementQty = useCallback((rowIndex: number) => {
    dispatch(incrementOrderItemQty(rowIndex));
    dispatch(calculateSummary());
  }, [dispatch]);

  const handleDecrementQty = useCallback((rowIndex: number) => {
    dispatch(decrementOrderItemQty(rowIndex));
    dispatch(calculateSummary());
  }, [dispatch]);

  const handleRemoveItem = useCallback((rowIndex: number) => {
    dispatch(removeOrderItem(rowIndex));
    dispatch(calculateSummary());
  }, [dispatch]);

  const handleSearchChange = useCallback((value: string) => {
    dispatch(setSearchQuery({ key: "productSearchQuery", value }));
  }, [dispatch]);

  // ============================================================================
  // ORDER/BILLING MODE HANDLERS - Matching WinForms btnOrder_Click/btnBilling_Click
  // ============================================================================

  /**
   * Switch to Order mode (KOT) - Equivalent to WinForms btnOrder_Click
   * VoucherType: SO (Sales Order)
   */
  const handleOrderMode = useCallback(() => {
        //   // Set voucher type to SO (Sales Order/KOT)
    // dispatch(setVoucherType("SO"));
    // // Reset for new transaction if needed
    // handleNewOrder(false);
if (operationalState?.printConfig?.onlyDirectBilling) {
          ERPAlert.show({
            title: t("Direct Billing Mode activated. This option is not available"),
            icon: "warning",
          });
    }      
    const preserveCustomerInfo = uiState?.flags?.showGroupCategory;
    const savedCustomerInfo = preserveCustomerInfo
    ? {
        customerName: operationalState.customer.customerName,
        mobileNo: operationalState.customer.mobileNo,
        address: { ...operationalState.customer.address },
        notes1: operationalState.customer.notes1,
      }
    : null;

     dispatch(setFormState({ key: "isBillingActive", value: false }));


  }, [dispatch, voucherType, orderItems.length]);

  /**
   * Switch to Billing mode - Equivalent to WinForms btnBilling_Click
   * VoucherType: SI (Sales Invoice)
   */
  const handleBillingMode = useCallback(() => {
    // Don't switch if already in billing mode
    if (voucherType === "SI") return;

    // Set voucher type to SI (Sales Invoice)
    dispatch(setVoucherType("SI"));
    dispatch(setFormState({ key: "isBillingActive", value: true }));
    dispatch(setVoucherState({ formType: "VAT" })); // Enable VAT for billing

    // Reset for new transaction if needed
    handleNewOrder(false);
  }, [dispatch, voucherType]);

  // ============================================================================
  // NEW ORDER/CANCEL HANDLER - Matching WinForms SetForNewTransaction/ClearControls
  // ============================================================================

  /**
   * Prepare for new transaction - Equivalent to WinForms SetForNewTransaction + ClearControls
   * @param clearGrid - Whether to clear the order items grid
   */
  const handleNewOrder = useCallback((clearGrid: boolean = true) => {
    // Reset transaction state (items, payment, summary)
    if (clearGrid) {
      dispatch(prepareNewTransaction());
    }

    // Reset operational state for new order (table, customer, etc.)
    dispatch(prepareForNewOrder());

    // Reset form state
    dispatch(setFormState({ key: "isEdit", value: false }));
    dispatch(setFormState({ key: "isReturnFromPaymentPanel", value: false }));
    dispatch(setFormState({ key: "isSettlementTransaction", value: false }));

    // Clear customer info
    dispatch(clearCustomerInfo());

    // Clear pending order context
    dispatch(clearPendingOrder());

    // Clear local panel states
    setIsTablePanelOpen(false);
    setIsCustomerPanelOpen(false);
    setIsGuestsPanelOpen(false);
    setIsCommentsPanelOpen(false);
    setShowInputBox(false);
    setPopupVisible(false);

    // Reset serve type to default
    dispatch(setServeType(operationalState.voucher.defaultServeType || "DINE IN"));

    // Clear search
    dispatch(setSearchQuery({ key: "productSearchQuery", value: "" }));

    // TODO: Get next voucher number from API
    // GetNextVrNo(VOUCHERTYPE) equivalent
  }, [dispatch, operationalState.voucher.defaultServeType]);

  /**
   * Cancel current transaction - Equivalent to WinForms btnCancel_Click
   */
  const handleCancel = useCallback(() => {
    handleNewOrder(true);

    // If showWaiterAfterSave is enabled, show waiter selection
    if (operationalState.waiter.showWaiterAfterSave) {
      // TODO: Open waiter selection panel
    }
  }, [handleNewOrder, operationalState.waiter.showWaiterAfterSave]);

  // ============================================================================
  // LOAD PENDING ORDER - Matching WinForms LoadPendingOrderItemsByTableAndSeat
  // ============================================================================

  /**
   * Load pending order by table number
   */
  const handleLoadOrderByTable = useCallback(async () => {
    if (!dining.tableNo) {
      console.warn("No table selected");
      return;
    }

    try {
      dispatch(setLoading({ key: "isLoadingOrder", value: true }));

      // This would call the API to get pending order for the table
      // const result = await loadOrder(invTransMasterId).unwrap();

      // For now, just set the pending order context
      dispatch(setPendingOrder({
        tableId: 0, // Would come from API
        tableNumber: dining.tableNo,
        token: "",
        isLoaded: true,
      }));

      // Set edit mode
      dispatch(setFormState({ key: "isEdit", value: true }));

    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      dispatch(setLoading({ key: "isLoadingOrder", value: false }));
    }
  }, [dispatch, dining.tableNo]);

  // ============================================================================
  // VALIDATION - Matching WinForms Validate() function
  // ============================================================================

  /**
   * Validate transaction before save
   * Returns error message or null if valid
   */
  const validateTransaction = useCallback((): string | null => {
    const serveType = dining.serveType;

    // Check if items exist
    if (orderItems.length === 0) {
      return "No items in order";
    }

    // For DINE IN, table is required (unless table-wise is disabled)
    if ((serveType === "DINE IN") && !dining.tableNo) {
      return "Please select table for dine-in order";
    }

    // For DELIVERY, customer details may be required
    if (serveType === "DELIVERY" && !operationalState.customer.mobileNo) {
      // This is optional validation - can be configured
      // return "Please enter customer mobile for delivery";
    }

    // Check for zero price items if warning is set to "Block"
    const zeroPriceItems = orderItems.filter(item => item.rate <= 0);
    if (zeroPriceItems.length > 0 && operationalState.productConfig.zeroPriceWarning === "Block") {
      return "Order contains items with zero price";
    }

    return null;
  }, [orderItems, dining, operationalState.customer.mobileNo, operationalState.productConfig.zeroPriceWarning]);

  const handlePaymentMethodChange = useCallback((method: string) => {
    switch (method) {
      case "cash":
        dispatch(setPayType("Cash"));
        break;
      case "card":
      case "other":
        dispatch(setPayType("General"));
        break;
      case "due":
        dispatch(setPayType("Credit"));
        break;
    }
  }, [dispatch]);

  const handleOptionSelection = (option: string) => {
    setSelectedOptions([option]);
  };

  // Save order handler - Equivalent to WinForms btnSave_Click + LoadbtnSave
  const handleSaveOrder = useCallback(async (printBill: boolean = false) => {
    // Validate before save
    const validationError = validateTransaction();
    if (validationError) {
      // TODO: Show toast/alert with error message
      console.error("Validation failed:", validationError);
      return;
    }

    // For billing mode, show payment panel first (like WinForms)
    if (isBillingActive && !payment.payLater && !uiState.form.isReturnFromPaymentPanel) {
      // Show payment panel
      setShowInputBox(true);
      dispatch(setFormState({ key: "isReturnFromPaymentPanel", value: false }));
      return;
    }

    // If edit mode, check for supervisor authorization (like WinForms)
    if (isEdit && !uiState.form.isSettlementTransaction) {
      // TODO: Show supervisor password dialog if required
      // For now, proceed without authorization check
    }

    try {
      dispatch(setLoading({ key: "isSaving", value: true }));

      // Build transaction data matching RPosTransactionData interface
      const transactionData = {
        master: {} as any, // Will be populated by server
        details: [],
        invAccTransactions: [],
        couponDetails: [],
        privilegeCardDetails: [],
        bankCardDetails: [],
        upiDetails: [],
      };

      const result = await saveOrder({
        transactionData,
        voucherType: operationalState.voucher.voucherType,
        formType: operationalState.voucher.formType || "RPOS",
        tableNo: dining.tableNo,
        seatNo: dining.seatNo,
        serveType: dining.serveType,
        isPaid: !payment.payLater,
        printKOT: false,
        printBill: printBill,
      }).unwrap();

      if (result.success) {
        console.log("Order saved:", result.voucherNumber);

        // Print if enabled (like WinForms chkPrintAfterSave)
        if (operationalState.printConfig.printAfterSave && printBill) {
          // TODO: Trigger print
        }

        // Clear for new transaction (like WinForms HoldSummaryUntilNextBill logic)
        handleNewOrder(true);

        // Show waiter selection if configured
        if (operationalState.waiter.showWaiterAfterSave) {
          // TODO: Open waiter selection panel
        }
      }
    } catch (error) {
      console.error("Failed to save order:", error);
      // TODO: Show error toast
    } finally {
      dispatch(setLoading({ key: "isSaving", value: false }));
    }
  }, [
    validateTransaction,
    isBillingActive,
    payment.payLater,
    uiState.form.isReturnFromPaymentPanel,
    isEdit,
    uiState.form.isSettlementTransaction,
    dispatch,
    operationalState,
    dining,
    saveOrder,
    handleNewOrder,
  ]);

  // Save KOT handler - For order mode (SO voucher type)
  const handleSaveKOT = useCallback(async (printKOT: boolean = false) => {
    // Validate before save
    const validationError = validateTransaction();
    if (validationError) {
      console.error("Validation failed:", validationError);
      return;
    }

    // Filter items that haven't been printed to KOT yet
    const kotItems = orderItems.filter(item => !item.isKOTPrinted);
    if (kotItems.length === 0) {
      console.warn("No new items to send to kitchen");
      return;
    }

    try {
      dispatch(setLoading({ key: "isSaving", value: true }));

      const result = await saveKOT({
        items: kotItems,
        tableNo: dining.tableNo,
        seatNo: dining.seatNo,
        tokenNumber: dining.pendingOrder.token || "",
        waiterId: operationalState.session.waiterId,
        waiterName: operationalState.session.waiterName,
        serveType: dining.serveType,
        kitchenRemarks: operationalState.customer.notes1 || "",
      }).unwrap();

      if (result.success) {
        console.log("KOT saved:", result.voucherNumber);

        // Update token number from response
        if (result.voucherNumber) {
          dispatch(setPendingOrder({
            ...dining.pendingOrder,
            token: result.voucherNumber,
            isLoaded: true,
          }));
        }

        // Print KOT if enabled
        if (printKOT && operationalState.printConfig.printKOTFromOrder) {
          // TODO: Trigger KOT print
        }

        // For TAKE AWAY / DELIVERY, WinForms also creates TSI (Temp Sales Invoice)
        // This is handled by the backend API

        // Clear for new transaction
        handleNewOrder(true);
      }
    } catch (error) {
      console.error("Failed to save KOT:", error);
    } finally {
      dispatch(setLoading({ key: "isSaving", value: false }));
    }
  }, [
    validateTransaction,
    orderItems,
    dispatch,
    dining,
    operationalState,
    saveKOT,
    handleNewOrder,
  ]);

  // Panel states from local state for now (will migrate to Redux panels later)
  const [isTablePanelOpen, setIsTablePanelOpen] = useState(false);
  const [isTableSelectionModalOpen, setIsTableSelectionModalOpen] = useState(false);
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);
  const [isGuestsPanelOpen, setIsGuestsPanelOpen] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);

  const toggleTablePanel = () => {
    setIsTablePanelOpen(prev => !prev);
    setIsCustomerPanelOpen(false);
    setIsGuestsPanelOpen(false);
    setIsCommentsPanelOpen(false);
  };

  // Open full table selection modal (frmTableView equivalent)
  const openTableSelectionModal = useCallback(() => {
    setIsTableSelectionModalOpen(true);
    setIsTablePanelOpen(false);
  }, []);

  // Handle table selection from the new modal
  const handleTableSelectionComplete = useCallback((tableNo: string, seatNo: string, tableId: number) => {
    dispatch(setTableNo(tableNo));
    dispatch(setSeatNo(seatNo));
    setIsTableSelectionModalOpen(false);
  }, [dispatch]);

  // Handle view KOT from table selection
  const handleViewKOTFromTable = useCallback((tableNo: string, tableId: number) => {
    // TODO: Navigate to KOT view or open KOT panel for this table
    console.log("View KOT for table:", tableNo, tableId);
  }, []);

  const toggleCustomerPanel = () => {
    setIsCustomerPanelOpen(prev => !prev);
    setIsTablePanelOpen(false);
    setIsGuestsPanelOpen(false);
    setIsCommentsPanelOpen(false);
  };

  const toggleGuestsPanel = () => {
    setIsGuestsPanelOpen(prev => !prev);
    setIsTablePanelOpen(false);
    setIsCustomerPanelOpen(false);
    setIsCommentsPanelOpen(false);
  };

  const toggleCommentsPanel = () => {
    setIsCommentsPanelOpen(prev => !prev);
    setIsTablePanelOpen(false);
    setIsCustomerPanelOpen(false);
    setIsGuestsPanelOpen(false);
  };

  // Get button text based on order type
  const getButtonText = (): string => {
    switch (orderType) {
      case "dine_in":
        return selectedOptions.length === 0 ? "dine_in" : selectedOptions.join(", ");
      case "delivery":
        return "delivery";
      case "pick_up":
        return "pick_up";
      default:
        return "dine_in";
    }
  };

  const renderOrderTypeButtons = () => {
    const getVisibleButtons = () => {
      switch (orderType) {
        case "dine_in":
          return (
            <>
              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "table" ? "border-t-2 border-[#f90303]" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("table");
                    toggleTablePanel();
                  }}
                >
                  <i className="ri-restaurant-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isTablePanelOpen}
                  setIsOpen={setIsTablePanelOpen}
                  title={t("table_no")}
                  content={
                    <div className="p-4 min-w-[320px]">
                      {/* Quick Table Input */}
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="text"
                          value={dining.tableNo}
                          onChange={(e) => handleTableSelect(e.target?.value)}
                          placeholder={t("table_no")}
                          className="w-20 p-2 border rounded-md text-center"
                        />
                        <input
                          type="text"
                          value={dining.seatNo}
                          onChange={(e) => dispatch(setSeatNo(e.target?.value))}
                          placeholder={t("seat")}
                          className="w-16 p-2 border rounded-md text-center"
                        />
                        <button
                          className="px-3 py-2 bg-[#f97316] text-white rounded-md hover:bg-orange-600 text-sm"
                          onClick={() => setIsTablePanelOpen(false)}
                        >
                          {t("view_kot")}
                        </button>
                        <button
                          className="px-3 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                          onClick={() => {
                            handleLoadOrderByTable();
                            setIsTablePanelOpen(false);
                          }}
                          disabled={!dining.tableNo || isLoadingOrder}
                        >
                          {isLoadingOrder ? t("loading") : t("load")}
                        </button>
                      </div>

                      {/* Quick Number Buttons */}
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleTableSelect(num.toString())}
                            className={`p-2 border rounded-md hover:bg-gray-100 text-center transition-colors ${
                              dining.tableNo === num.toString() ? "bg-primary text-white border-primary" : ""
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      {/* Open Full Table View Button */}
                      <button
                        onClick={openTableSelectionModal}
                        className="w-full py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 flex items-center justify-center gap-2 mb-4"
                      >
                        <i className="ri-layout-grid-line"></i>
                        {t("view_all_tables")}
                      </button>

                      {/* Legend */}
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="flex flex-wrap justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#5638a8] rounded"></div>
                            <span className="text-gray-600">{t("available")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#be1e21] rounded"></div>
                            <span className="text-gray-600">{t("occupied")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#249664] rounded"></div>
                            <span className="text-gray-600">{t("kot_printed")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "user" ? "border-t-2 border-[#f90303]" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("user");
                    toggleCustomerPanel();
                  }}
                >
                  <i className="ri-user-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isCustomerPanelOpen}
                  setIsOpen={setIsCustomerPanelOpen}
                  title={t("customer_details")}
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("mobile")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.mobileNo}
                            onChange={(e) => dispatch(setCustomerInfo({ mobileNo: e.target.value }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("name")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.customerName}
                            onChange={(e) => dispatch(setCustomerInfo({ customerName: e.target.value }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("add")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.address.line1}
                            onChange={(e) => dispatch(setCustomerInfo({ address: { ...operationalState.customer.address, line1: e.target.value } }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("locality")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.address.line2}
                            onChange={(e) => dispatch(setCustomerInfo({ address: { ...operationalState.customer.address, line2: e.target.value } }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "group" ? "border-t-2 border-[#f90303]" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("group");
                    toggleGuestsPanel();
                  }}
                >
                  <i className="ri-group-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isGuestsPanelOpen}
                  setIsOpen={setIsGuestsPanelOpen}
                  title={t("no_of_persons")}
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("no_of_persons")}:</label>
                          <input
                            type="number"
                            value={dining.numberOfGuests}
                            onChange={(e) => dispatch(setNumberOfGuests(parseInt(e.target.value) || 1))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "edit" ? "border-t-2 border-[#f90303]" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("edit");
                    toggleCommentsPanel();
                  }}
                >
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isCommentsPanelOpen}
                  setIsOpen={setIsCommentsPanelOpen}
                  title={t("comments")}
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("comments")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.notes1}
                            onChange={(e) => dispatch(setCustomerInfo({ notes1: e.target.value }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500 w-[158px]"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>
            </>
          );

        case "delivery":
        case "pick_up":
          return (
            <>
              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "user" ? "border-t-2 border-[#f90303]" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("user");
                    toggleCustomerPanel();
                  }}
                >
                  <i className="ri-user-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isCustomerPanelOpen}
                  setIsOpen={setIsCustomerPanelOpen}
                  title={t("customer_details")}
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("mobile")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.mobileNo}
                            onChange={(e) => dispatch(setCustomerInfo({ mobileNo: e.target.value }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("name")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.customerName}
                            onChange={(e) => dispatch(setCustomerInfo({ customerName: e.target.value }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("add")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.address.line1}
                            onChange={(e) => dispatch(setCustomerInfo({ address: { ...operationalState.customer.address, line1: e.target.value } }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("locality")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.address.line2}
                            onChange={(e) => dispatch(setCustomerInfo({ address: { ...operationalState.customer.address, line2: e.target.value } }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "edit" ? "border-t-2 border-[#f90303]" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("edit");
                    toggleCommentsPanel();
                  }}
                >
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isCommentsPanelOpen}
                  setIsOpen={setIsCommentsPanelOpen}
                  title={t("comments")}
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right me-4 font-bold">{t("comments")}:</label>
                          <input
                            type="text"
                            value={operationalState.customer.notes1}
                            onChange={(e) => dispatch(setCustomerInfo({ notes1: e.target.value }))}
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500 w-[158px]"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <div className="flex border border-gray-300 flex-wrap">
        {getVisibleButtons()}
        <button
          className="flex-1 w-full p-3 flex justify-center items-center bg-[#ff7800] text-white"
          onClick={() => orderType === "dine_in" && setIsPopupOpen(true)}
        >
          {t(getButtonText())}
        </button>
      </div>
    );
  };

  // Get payment method key for radio buttons
  const getPaymentMethodKey = (): string => {
    switch (payment.payType) {
      case "Cash": return "cash";
      case "Credit": return "due";
      case "General": return "card";
      default: return "cash";
    }
  };

  return (
    <div className="flex lg:h-[91vh] xl:h-[92vh] bg-gray-200 text-gray-800 font-sans">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Action Bar - Order/Billing Mode Toggle (like WinForms btnOrder/btnBilling) */}
        <div className="bg-[#610536] p-1 flex items-center space-x-1">
          {/* Order Mode Button (KOT) */}
          <button
            className={`px-4 py-2 rounded text-white font-semibold transition-colors ${
              voucherType === "SO"
                ? "bg-[#a11b3c]"
                : "bg-[#610536] hover:bg-[#7a1045]"
            }`}
            onClick={handleOrderMode}
          >
            {t("order")}
          </button>

          {/* Billing Mode Button */}
          <button
            className={`px-4 py-2 rounded text-white font-semibold transition-colors ${
              voucherType === "SI"
                ? "bg-[#a11b3c]"
                : "bg-[#610536] hover:bg-[#7a1045]"
            }`}
            onClick={handleBillingMode}
          >
            {t("billing")}
          </button>

          {/* Pending Orders Button */}
          <button
            className="px-4 py-2 rounded bg-[#610536] hover:bg-[#7a1045] text-white font-semibold transition-colors"
            onClick={() => {
              // TODO: Open pending orders panel
            }}
          >
            {t("pending")}
          </button>

          {/* Settlement Button */}
          <button
            className="px-4 py-2 rounded bg-[#610536] hover:bg-[#7a1045] text-white font-semibold transition-colors"
            onClick={() => {
              // TODO: Open settlement panel
            }}
          >
            {t("settlement")}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Cancel/New Order Button */}
          {/* <button
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
            onClick={handleCancel}
          >
            {t("cancel")}
          </button> */}

          {/* Edit Mode Indicator */}
          {/* {isEdit && (
            <span className="px-3 py-1 bg-yellow-500 text-black rounded text-sm font-semibold">
              {t("edit_mode")}
            </span>
          )} */}
        </div>

        {/* Order Type and Search Bar */}
        <div className="bg-gray-300 p-2 flex justify-between items-center gap-2">
          {/* Search Input */}
          <div className="flex-1 max-w-[40%]">
            <input
              type="text"
              placeholder={t("search_item")}
              className="w-full p-2 rounded rounded-md"
              value={uiState.search.productSearchQuery}
              onChange={(e) => handleSearchChange(e.target?.value)}
            />
          </div>

          {/* Waiter Selection - Like WinForms cbwaiter */}
          <div className="w-32">
            <select
              className="w-full p-2 rounded rounded-md bg-white"
              value={operationalState.session.waiterId}
              onChange={(e) => {
                const selectedWaiter = waiters.find(w => w.employeeId === parseInt(e.target.value));
                if (selectedWaiter) {
                  dispatch(setSessionInfo({
                    waiterId: selectedWaiter.employeeId,
                    waiterName: selectedWaiter.employeeName,
                  }));
                }
              }}
            >
              <option value="">{t("waiter")}</option>
              {waiters.map((waiter) => (
                <option key={waiter.employeeId} value={waiter.employeeId}>
                  {waiter.employeeName}
                </option>
              ))}
            </select>
          </div>

          {/* Serve Type Buttons */}
          <div className="flex space-x-2">
            {["dine_in", "delivery", "pick_up"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded rounded-md ${
                  orderType === type ? "bg-primary text-white" : "bg-white"
                }`}
                onClick={() => handleOrderTypeChange(type)}
              >
                {t(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Popup for Dine in options */}
        {isPopupOpen && orderType === "dine_in" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">{t("select_options")}</h2>
                {["dine_in", "ac", "dining"].map((option) => (
                  <div key={option} className="flex items-center justify-between py-2 border-b">
                    <span>{t(option)}</span>
                    <input
                      type="radio"
                      name="diningOption"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelection(option)}
                      className="form-radio text-red-600"
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-md me-2"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className="px-4 py-2 bg-[#f90303] text-white rounded-md"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    {t("done")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu and Order Summary */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-gray-800 text-white flex flex-col">
            <nav className="flex-1 overflow-y-auto">
              {isLoadingGroups ? (
                <div className="p-3 text-gray-400">{t("loading")}...</div>
              ) : isGroupsError ? (
                // Fallback to mock categories
                MOCK_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left p-3 hover:bg-gray-700 ${
                      selectedCategoryName === category ? "bg-gray-700" : ""
                    }`}
                    onClick={() => setSelectedGroupId(null)}
                  >
                    {category}
                  </button>
                ))
              ) : (
                productGroups.map((group) => (
                  <button
                    key={group.productGroupId}
                    className={`w-full text-left p-3 hover:bg-gray-700 ${
                      selectedGroupId === group.productGroupId ? "bg-gray-700" : ""
                    }`}
                    onClick={() => setSelectedGroupId(group.productGroupId)}
                  >
                    {group.groupName}
                  </button>
                ))
              )}
            </nav>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4 overflow-y-auto">
            {(isLoadingProducts || isFetchingProducts || isSearching) ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">{t("loading")}...</div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.productId}
                    className="p-4 bg-white shadow rounded rounded-md text-center hover:bg-gray-50 transition-colors"
                    onClick={() => handleAddItem(item)}
                  >
                    {item.productName}
                    <br />₹{item.rate.toFixed(2)}
                  </button>
                ))}
                {menuItems.length === 0 && (
                  <div className="col-span-4 text-center text-gray-500 py-8">
                    {searchQuery ? t("no_products_found") : t("select_category")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-[43%] bg-white shadow-md overflow-y-auto flex flex-col">
            {renderOrderTypeButtons()}

            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th>{t("items")}</th>
                    <th className="text-center">{t("qty")}</th>
                    <th className="text-right">{t("price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.rowIndex} className="border-b">
                      <td className="py-2 flex items-center">
                        <button onClick={() => handleRemoveItem(item.rowIndex)}>
                          <i className="ri-close-circle-line text-[#f90303] me-2 rtl:ml-2"></i>
                        </button>
                        {item.productName}
                      </td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => handleDecrementQty(item.rowIndex)}
                          className="px-2 text-gray-500"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleIncrementQty(item.rowIndex)}
                          className="px-2 text-gray-500"
                        >
                          +
                        </button>
                      </td>
                      <td className="py-2 text-right">
                        ₹{item.netAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowInputBox(!showInputBox)}
                className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-3 py-1 rounded rounded-full hover:bg-gray-600 transition-colors"
              >
                {showInputBox ? (
                  <i className="ri-arrow-down-s-line"></i>
                ) : (
                  <i className="ri-arrow-up-s-line"></i>
                )}
              </button>
              {showInputBox && (
                <div className="w-[100%] absolute bottom-full mb-0 bg-gray-700 p-4 border border-gray-700 rounded-none shadow-lg">
                  <div className="bg-gray-700 p-4 text-white rounded-md">
                    <div className="flex justify-between mb-4">
                      <span>{t("sub_total")}</span>
                      <span>{summary.totalQuantity}</span>
                      <span>{summary.subTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mb-4">
                      <span>{t("discount")}</span>
                      <button
                        onClick={() => setPopupVisible(!popupVisible)}
                        className="flex items-center space-x-1"
                      >
                        <span>{t("more")}</span>
                        <i className="ri-arrow-down-s-line"></i>
                      </button>
                      <span>({summary.totalDiscount.toFixed(2)})</span>
                    </div>

                    {popupVisible && (
                      <div className="bg-gray-600 p-3 rounded mb-4">
                        <button
                          onClick={() => setPopupVisible(false)}
                          className="flex items-center space-x-1"
                        >
                          <i className="ri-close-line"></i>
                          <span>{t("close")}</span>
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">{t("delivery_charge")}</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">{t("container_charge")}</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <span>{t("tax")}</span>
                      <button className="flex items-center space-x-1">
                        <span>{t("more")}</span>
                        <i className="ri-arrow-down-s-line"></i>
                      </button>
                      <span>{summary.totalTax.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">{t("round_off")}</label>
                        <input
                          type="number"
                          value={payment.roundOff}
                          onChange={(e) => dispatch(setPayType("General"))}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">{t("customer_paid")}</label>
                        <input
                          type="number"
                          value={payment.cashReceived}
                          onChange={(e) => dispatch(setCashReceived(parseFloat(e.target.value) || 0))}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">{t("return_to_customer")}</label>
                        <input
                          type="number"
                          value={Math.max(0, payment.cashReceived - summary.grandTotal)}
                          readOnly
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">{t("tip")}</label>
                        <input
                          type="number"
                          value={payment.cashTip}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2 bg-gray-800 flex justify-between items-center font-bold">
              <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
                {t("split")}
              </button>
              <span className="text-white">
                {t("total")}:₹{summary.grandTotal.toFixed(2)}
              </span>
            </div>

            <div className="bg-gray-600 p-2 flex justify-center items-center">
              <div className="flex space-x-2">
                <div className="flex items-center">
                  {["cash", "card", "due", "other"].map((method) => (
                    <label key={method} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={getPaymentMethodKey() === method}
                        onChange={() => handlePaymentMethodChange(method)}
                        className="form-radio text-[#f90303]"
                      />
                      <span className="text-white pr-1">{t(method)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-2 flex justify-center items-center">
              <div className="flex space-x-2">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={!payment.payLater}
                    onChange={(e) => dispatch(setPayType(e.target.checked ? "Cash" : "Credit"))}
                    className="me-2"
                  />
                  <p className="pr-1">{t("its_paid")}</p>
                </label>
              </div>
            </div>

            <div className="flex space-x-2 p-2 ml-1">
              <button
                className="px-4 py-2 bg-primary text-white rounded rounded-md rtl:ml-2 disabled:opacity-50"
                onClick={() => handleSaveOrder(false)}
                disabled={isSavingOrder || orderItems.length === 0}
              >
                {isSavingOrder ? t("saving") : t("save")}
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded rounded-md disabled:opacity-50"
                onClick={() => handleSaveOrder(true)}
                disabled={isSavingOrder || orderItems.length === 0}
              >
                {t("save_print")}
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded rounded-md disabled:opacity-50"
                onClick={() => handleSaveOrder(true)}
                disabled={isSavingOrder || orderItems.length === 0}
              >
                {t("save_ebill")}
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded rounded-md disabled:opacity-50"
                onClick={() => handleSaveKOT(false)}
                disabled={isSavingKOT || orderItems.length === 0}
              >
                {isSavingKOT ? t("saving") : t("kot")}
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded rounded-md disabled:opacity-50"
                onClick={() => handleSaveKOT(true)}
                disabled={isSavingKOT || orderItems.length === 0}
              >
                {t("kot_print")}
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded rounded-md disabled:opacity-50"
                disabled={orderItems.length === 0}
              >
                {t("hold")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Selection Modal - Full frmTableView equivalent */}
      {isTableSelectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <TableSelectionPanel
            isOpen={isTableSelectionModalOpen}
            onClose={() => setIsTableSelectionModalOpen(false)}
            mode="MarkOccupied"
            onSelect={handleTableSelectionComplete}
            onLoadOrder={(tableNo, tableId) => {
              handleTableSelect(tableNo);
              handleLoadOrderByTable();
              setIsTableSelectionModalOpen(false);
            }}
            onViewKOT={handleViewKOTFromTable}
            currentTableNo={dining.tableNo}
          />
        </div>
      )}
    </div>
  );
}
