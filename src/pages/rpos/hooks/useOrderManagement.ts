import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOrderItem,
  incrementOrderItemQty,
  decrementOrderItemQty,
  removeOrderItem,
  clearOrderItems,
  prepareNewTransaction,
} from '../reducers/transaction-reducer';
import {
  prepareForNewOrder,
  clearCustomerInfo,
  clearPendingOrder,
} from '../reducers/operational-reducer';
import { setFormState, setSearchQuery } from '../reducers/ui-reducer';
import type { RPosOrderItem } from '../type/rpos-transaction';
import type { ProductItem } from '../api';

/**
 * Order Management Hook - Encapsulates all order manipulation logic
 * Benefits:
 * - Single source of truth for order operations
 * - Auto-calculates summary (no double dispatch)
 * - Optimized with useCallback
 * - Type-safe
 *
 * @example
 * const { addItem, incrementQty, newOrder, validateOrder } = useOrderManagement();
 */
export function useOrderManagement() {
  const dispatch = useDispatch();

  // Selectors - Granular for performance
  const orderItems = useSelector((state: any) => state.RPosTransaction.activeOrder.items);
  const dining = useSelector((state: any) => state.RPosOperational.dining);
  const productConfig = useSelector((state: any) => state.RPosOperational.productConfig);
  const customerMobile = useSelector((state: any) => state.RPosOperational.customer.mobileNo);

  /**
   * Add product to order - Auto-calculates summary
   */
  const addItem = useCallback(
    (product: ProductItem) => {
      const orderItem: RPosOrderItem = {
        rowIndex: 0, // Set by reducer
        productBatchId: product.productBatchId,
        productId: product.productId,
        productCode: product.productCode,
        productName: product.productName,
        description: '',
        quantity: 1,
        unitId: product.unitId,
        unitName: product.unitName,
        rate: product.rate,
        grossAmount: product.rate,
        discountPercent: 0,
        discountAmount: 0,
        taxAmount: product.taxAmount,
        vatAmount: 0,
        cstAmount: 0,
        netAmount: product.rate + product.taxAmount,
        kitchenId: product.kitchenId,
        kitchenName: product.kitchenName,
        isKOTPrinted: false,
        isPrinted: false,
        remarks: '',
      };
      dispatch(addOrderItem(orderItem));
    },
    [dispatch]
  );

  /**
   * Increment item quantity - Auto-calculates summary
   */
  const incrementQty = useCallback(
    (rowIndex: number) => {
      dispatch(incrementOrderItemQty(rowIndex));
    },
    [dispatch]
  );

  /**
   * Decrement item quantity - Auto-calculates summary
   */
  const decrementQty = useCallback(
    (rowIndex: number) => {
      dispatch(decrementOrderItemQty(rowIndex));
    },
    [dispatch]
  );

  /**
   * Remove item from order - Auto-calculates summary
   */
  const removeItem = useCallback(
    (rowIndex: number) => {
      dispatch(removeOrderItem(rowIndex));
    },
    [dispatch]
  );

  /**
   * Clear all order items
   */
  const clearItems = useCallback(() => {
    dispatch(clearOrderItems());
  }, [dispatch]);

  /**
   * Prepare for new order - Resets all state
   */
  const newOrder = useCallback(
    (clearGrid: boolean = true) => {
      if (clearGrid) {
        dispatch(prepareNewTransaction());
      }
      dispatch(prepareForNewOrder());
      dispatch(setFormState({ key: 'isEdit', value: false }));
      dispatch(setFormState({ key: 'isReturnFromPaymentPanel', value: false }));
      dispatch(setFormState({ key: 'isSettlementTransaction', value: false }));
      dispatch(clearCustomerInfo());
      dispatch(clearPendingOrder());
      dispatch(setSearchQuery({ key: 'productSearchQuery', value: '' }));
    },
    [dispatch]
  );

  /**
   * Validate order before save
   * Returns error message or null if valid
   */
  const validateOrder = useCallback((): string | null => {
    // Check if items exist
    if (orderItems.length === 0) {
      return 'no_items_in_order';
    }

    // For DINE IN, table is required
    if (dining.serveType === 'DINE IN' && !dining.tableNo) {
      return 'please_select_table_for_dine_in';
    }

    // For DELIVERY, mobile may be required
    if (dining.serveType === 'DELIVERY' && !customerMobile) {
      // Optional validation - can be configured
      // return 'please_enter_customer_mobile_for_delivery';
    }

    // Check for zero price items if blocking is enabled
    const zeroPriceItems = orderItems.filter((item: RPosOrderItem) => item.rate <= 0);
    if (zeroPriceItems.length > 0 && productConfig.zeroPriceWarning === 'Block') {
      return 'order_contains_zero_price_items';
    }

    return null;
  }, [orderItems, dining, customerMobile, productConfig]);

  return {
    // State
    orderItems,
    itemCount: orderItems.length,

    // Actions
    addItem,
    incrementQty,
    decrementQty,
    removeItem,
    clearItems,
    newOrder,
    validateOrder,
  };
}
