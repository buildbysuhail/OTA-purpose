import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Payment Calculation Hook - Memoized payment calculations
 * Benefits:
 * - Optimized calculations with useMemo
 * - Prevents unnecessary re-calculations
 * - Type-safe
 *
 * @example
 * const { grandTotal, balance, changeAmount } = usePaymentCalculation();
 */
export function usePaymentCalculation() {
  // Granular selectors
  const summary = useSelector((state: any) => state.RPosTransaction.summary);
  const payment = useSelector((state: any) => state.RPosTransaction.payment);

  /**
   * Calculate grand total (memoized)
   */
  const grandTotal = useMemo(() => {
    return summary.subTotal + summary.additionalAmount + payment.roundOff;
  }, [summary.subTotal, summary.additionalAmount, payment.roundOff]);

  /**
   * Calculate total cash received (memoized)
   */
  const totalReceived = useMemo(() => {
    return payment.cashReceived + payment.cardAmount + payment.upiAmount;
  }, [payment.cashReceived, payment.cardAmount, payment.upiAmount]);

  /**
   * Calculate balance/change amount (memoized)
   */
  const balance = useMemo(() => {
    return grandTotal - totalReceived;
  }, [grandTotal, totalReceived]);

  /**
   * Calculate change to return (memoized)
   */
  const changeAmount = useMemo(() => {
    return Math.max(0, totalReceived - grandTotal);
  }, [totalReceived, grandTotal]);

  /**
   * Check if payment is sufficient (memoized)
   */
  const isPaymentSufficient = useMemo(() => {
    return totalReceived >= grandTotal;
  }, [totalReceived, grandTotal]);

  /**
   * Check if exact payment (memoized)
   */
  const isExactPayment = useMemo(() => {
    return Math.abs(totalReceived - grandTotal) < 0.01; // Within 1 paisa
  }, [totalReceived, grandTotal]);

  return {
    // Calculated values
    grandTotal,
    totalReceived,
    balance,
    changeAmount,

    // Validation flags
    isPaymentSufficient,
    isExactPayment,

    // Summary breakdowns
    subTotal: summary.subTotal,
    totalDiscount: summary.totalDiscount,
    totalTax: summary.totalTax,
    totalQuantity: summary.totalQuantity,
    roundOff: payment.roundOff,
  };
}
