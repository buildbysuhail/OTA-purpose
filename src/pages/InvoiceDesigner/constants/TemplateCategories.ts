// export type TemplateGroupTypes =
//   | "sales_invoice"
//   | "barcode"
//   | "balance_sheet"
//   | "cash_payment"
//   | "cash_receipt"
//   | "bank_payment"
//   | "bank_receipt"
//   | "cheque_payment"
//   | "cheque_receipt"
//   | "opening_balance"
//   | "debit_note"
//   | "credit_note"
//   | "journal_entry"
//   | "multi_journal_entry"
//   | "closing_balance"
//   | "pdc"
//   | "bank_reconciliation"
//   | "tax_on_expenses_payments"
//   | "cash_payment_estimate"
//   | "cash_receipt_estimate";

import VoucherType from "../../../enums/voucher-types";

export const TemplateTypes: {
  id: number;
  name: string;
  template_group_id: VoucherType | string;
}[] = [
  {
    id: 1,
    name: "Invoice",
    template_group_id: VoucherType.SalesInvoice,
  },
  {
    id: 2,
    name: "Barcode",
    template_group_id: "barcode",
  },
  {
    id: 3,
    name: "Cash Payment",
    template_group_id: VoucherType.CashPayment,
  },
  {
    id: 4,
    name: "Tax on Expenses",
    template_group_id: VoucherType.TaxOnExpenses,
  },
  {
    id: 5,
    name: "Damage Expiry Substitute",
    template_group_id: VoucherType.DamageExpirySubstitute,
  },
  {
    id: 6,
    name: "Goods Delivery Return",
    template_group_id: VoucherType.GoodsDeliveryReturn,
  },
  {
    id: 7,
    name: "Cheque Receipt",
    template_group_id: VoucherType.ChequeReceipt,
  },
  {
    id: 8,
    name: "Branch Transfer Out",
    template_group_id: VoucherType.BranchTransferOut,
  },
  {
    id: 9,
    name: "Bank Receipt",
    template_group_id: VoucherType.BankReceipt,
  },
  {
    id: 10,
    name: "Multi Journal",
    template_group_id: VoucherType.MultiJournal,
  },
  {
    id: 11,
    name: "Purchase Invoice",
    template_group_id: VoucherType.PurchaseInvoice,
  },
  {
    id: 12,
    name: "Salary Process",
    template_group_id: VoucherType.SalaryProcess,
  },
  {
    id: 13,
    name: "Excess Stock",
    template_group_id: VoucherType.ExcessStock,
  },
  {
    id: 14,
    name: "Cheque Payment",
    template_group_id: VoucherType.ChequePayment,
  },
  {
    id: 15,
    name: "Cash Receipt",
    template_group_id: VoucherType.CashReceipt,
  },
  {
    id: 16,
    name: "Debit Note",
    template_group_id: VoucherType.DebitNote,
  },
  {
    id: 17,
    name: "Sales Quotation",
    template_group_id: VoucherType.SalesQuotation,
  },
  {
    id: 18,
    name: "Sales Order",
    template_group_id: VoucherType.SalesOrder,
  },
  {
    id: 19,
    name: "Sales Estimate",
    template_group_id: VoucherType.SalesEstimate,
  },
  {
    id: 20,
    name: "Goods Receipt Note",
    template_group_id: VoucherType.GoodsReceiptNote,
  },
  {
    id: 21,
    name: "Bank Payment",
    template_group_id: VoucherType.BankPayment,
  },
  {
    id: 22,
    name: "Delivery Challan",
    template_group_id: VoucherType.DeliveryChallan,
  },
  {
    id: 23,
    name: "Good Request",
    template_group_id: VoucherType.GoodRequest,
  },
  {
    id: 24,
    name: "Damage Entry",
    template_group_id: VoucherType.DamageEntry,
  },
  {
    id: 25,
    name: "Service Inventory",
    template_group_id: VoucherType.ServiceInventory,
  },
  {
    id: 26,
    name: "Production",
    template_group_id: VoucherType.Production,
  },
  {
    id: 27,
    name: "Cash Receipt Estimate",
    template_group_id: VoucherType.CashReceiptEstimate,
  },
  {
    id: 28,
    name: "Goods Receipt Return",
    template_group_id: VoucherType.GoodsReceiptReturn,
  },
  {
    id: 29,
    name: "Purchase Return",
    template_group_id: VoucherType.PurchaseReturn,
  },
  {
    id: 30,
    name: "Opening Balance",
    template_group_id: VoucherType.OpeningBalance,
  },
  {
    id: 31,
    name: "Cash Payment Estimate",
    template_group_id: VoucherType.CashPaymentEstimate,
  },
  {
    id: 32,
    name: "Goods Delivery Note",
    template_group_id: VoucherType.GoodsDeliveryNote,
  },
  {
    id: 33,
    name: "Shortage Stock",
    template_group_id: VoucherType.ShortageStock,
  },
  {
    id: 34,
    name: "Material Receipt",
    template_group_id: VoucherType.MaterialReceipt,
  },
  {
    id: 35,
    name: "Stock Transfer",
    template_group_id: VoucherType.StockTransfer,
  },
  {
    id: 36,
    name: "Stock Transfer Shortage Special",
    template_group_id: VoucherType.StockTransferShortageSpecial,
  },
  {
    id: 37,
    name: "Purchase Order",
    template_group_id: VoucherType.PurchaseOrder,
  },
  {
    id: 38,
    name: "Bank Reconciliation",
    template_group_id: VoucherType.BankReconciliation,
  },
  {
    id: 39,
    name: "Sale Return Estimate",
    template_group_id: VoucherType.SaleReturnEstimate,
  },
  {
    id: 40,
    name: "Credit Note",
    template_group_id: VoucherType.CreditNote,
  },
  {
    id: 41,
    name: "Journal Voucher",
    template_group_id: VoucherType.JournalVoucher,
  },
  {
    id: 42,
    name: "Closing Balance",
    template_group_id: VoucherType.ClosingBalance,
  },
  {
    id: 43,
    name: "Leave Entry",
    template_group_id: VoucherType.LeaveEntry,
  },
  {
    id: 44,
    name: "Branch Transfer In",
    template_group_id: VoucherType.BranchTransferIn,
  },
  {
    id: 45,
    name: "Purchase Return Estimate",
    template_group_id: VoucherType.PurchaseReturnEstimate,
  },
  {
    id: 46,
    name: "Inter-Branch Transfer",
    template_group_id: VoucherType.InterBranchTransfer,
  },
  {
    id: 47,
    name: "Sales Return",
    template_group_id: VoucherType.SalesReturn,
  },
  {
    id: 48,
    name: "Asset Depreciation",
    template_group_id: VoucherType.AssetDepreciation,
  },
  {
    id: 49,
    name: "Purchase Estimation",
    template_group_id: VoucherType.PurchaseEstimation,
  },
  {
    id: 50,
    name: "Purchase Quotation",
    template_group_id: VoucherType.PurchaseQuotation,
  },
  {
    id: 51,
    name: "Stock Transfer Excess Special",
    template_group_id: VoucherType.StockTransferExcessSpecial,
  },
  {
    id: 52,
    name: "Purchase Order Transit",
    template_group_id: VoucherType.PurchaseOrderTransist,
  },
  {
    id: 53,
    name: "Request For Quotation",
    template_group_id: VoucherType.RequestForQuotation,
  },
  {
    id: 54,
    name: "Balance sheet",
    template_group_id: "BalanceSheet",
  },
  {
    id: 55,
    name: "Profit & Loss",
    template_group_id: "ProfitAndLoss",
  },
  
];

