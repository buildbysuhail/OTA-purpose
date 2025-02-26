

import VoucherType from "../../../enums/voucher-types";

export const TemplateTypes: {
  id: number;
  name: string;
  template_group_id: VoucherType | string;
}[] = [
    {
      id: 1,
      name: "invoice",
      template_group_id: VoucherType.SalesInvoice,
    },
    {
      id: 2,
      name: "barcode",
      template_group_id: "barcode",
    },
    {
      id: 3,
      name: "cash_payment",
      template_group_id: VoucherType.CashPayment,
    },
    {
      id: 4,
      name: "tax_on_expenses",
      template_group_id: VoucherType.TaxOnExpensePayment,
    },
    {
      id: 5,
      name: "damage_expiry_substitute",
      template_group_id: VoucherType.DamageExpirySubstitute,
    },
    {
      id: 6,
      name: "goods_delivery_return",
      template_group_id: VoucherType.GoodsDeliveryReturn,
    },
    {
      id: 7,
      name: "cheque_receipt",
      template_group_id: VoucherType.ChequeReceipt,
    },
    {
      id: 8,
      name: "branch_transfer_out",
      template_group_id: VoucherType.BranchTransferOut,
    },
    {
      id: 9,
      name: "bank_receipt",
      template_group_id: VoucherType.BankReceipt,
    },
    {
      id: 10,
      name: "multi_journal",
      template_group_id: VoucherType.MultiJournal,
    },
    {
      id: 11,
      name: "purchase_invoice",
      template_group_id: VoucherType.PurchaseInvoice,
    },
    {
      id: 12,
      name: "salary_process",
      template_group_id: VoucherType.SalaryProcess,
    },
    {
      id: 13,
      name: "excess_stock",
      template_group_id: VoucherType.ExcessStock,
    },
    {
      id: 14,
      name: "cheque_payment",
      template_group_id: VoucherType.ChequePayment,
    },
    {
      id: 15,
      name: "cash_receipt",
      template_group_id: VoucherType.CashReceipt,
    },
    {
      id: 16,
      name: "debit_note",
      template_group_id: VoucherType.DebitNote,
    },
    {
      id: 17,
      name: "sales_quotation",
      template_group_id: VoucherType.SalesQuotation,
    },
    {
      id: 18,
      name: "sales_order",
      template_group_id: VoucherType.SalesOrder,
    },
    {
      id: 19,
      name: "sales_estimate",
      template_group_id: VoucherType.SalesEstimate,
    },
    {
      id: 20,
      name: "goods_receipt_note",
      template_group_id: VoucherType.GoodsReceiptNote,
    },
    {
      id: 21,
      name: "bank_payment",
      template_group_id: VoucherType.BankPayment,
    },
    {
      id: 22,
      name: "delivery_challan",
      template_group_id: VoucherType.DeliveryChallan,
    },
    {
      id: 23,
      name: "good_request",
      template_group_id: VoucherType.GoodRequest,
    },
    {
      id: 24,
      name: "damage_entry",
      template_group_id: VoucherType.DamageEntry,
    },
    {
      id: 25,
      name: "service_inventory",
      template_group_id: VoucherType.ServiceInventory,
    },
    {
      id: 26,
      name: "production",
      template_group_id: VoucherType.Production,
    },
    {
      id: 27,
      name: "cash_receipt_estimate",
      template_group_id: VoucherType.CashReceiptEstimate,
    },
    {
      id: 28,
      name: "goods_receipt_return",
      template_group_id: VoucherType.GoodsReceiptReturn,
    },
    {
      id: 29,
      name: "purchase_return",
      template_group_id: VoucherType.PurchaseReturn,
    },
    {
      id: 30,
      name: "opening_balance",
      template_group_id: VoucherType.OpeningBalance,
    },
    {
      id: 31,
      name: "cash_payment_estimate",
      template_group_id: VoucherType.CashPaymentEstimate,
    },
    {
      id: 32,
      name: "goods_delivery_note",
      template_group_id: VoucherType.GoodsDeliveryNote,
    },
    {
      id: 33,
      name: "shortage_stock",
      template_group_id: VoucherType.ShortageStock,
    },
    {
      id: 34,
      name: "material_receipt",
      template_group_id: VoucherType.MaterialReceipt,
    },
    {
      id: 35,
      name: "stock_transfer",
      template_group_id: VoucherType.StockTransfer,
    },
    {
      id: 36,
      name: "stock_transfer_shortage_special",
      template_group_id: VoucherType.StockTransferShortageSpecial,
    },
    {
      id: 37,
      name: "purchase_order",
      template_group_id: VoucherType.PurchaseOrder,
    },
    {
      id: 38,
      name: "bank_reconciliation",
      template_group_id: VoucherType.BankReconciliation,
    },
    {
      id: 39,
      name: "sale_return_estimate",
      template_group_id: VoucherType.SaleReturnEstimate,
    },
    {
      id: 40,
      name: "credit_note",
      template_group_id: VoucherType.CreditNote,
    },
    {
      id: 41,
      name: "journal_voucher",
      template_group_id: VoucherType.JournalVoucher,
    },
    {
      id: 42,
      name: "closing_balance",
      template_group_id: VoucherType.ClosingBalance,
    },
    {
      id: 43,
      name: "leave_entry",
      template_group_id: VoucherType.LeaveEntry,
    },
    {
      id: 44,
      name: "branch_transfer_in",
      template_group_id: VoucherType.BranchTransferIn,
    },
    {
      id: 45,
      name: "purchase_return_estimate",
      template_group_id: VoucherType.PurchaseReturnEstimate,
    },
    {
      id: 46,
      name: "inter_branch_transfer",
      template_group_id: VoucherType.InterBranchTransfer,
    },
    {
      id: 47,
      name: "sales_return",
      template_group_id: VoucherType.SalesReturn,
    },
    {
      id: 48,
      name: "asset_depreciation",
      template_group_id: VoucherType.AssetDepreciation,
    },
    {
      id: 49,
      name: "purchase_estimation",
      template_group_id: VoucherType.PurchaseEstimate,
    },
    {
      id: 50,
      name: "purchase_quotation",
      template_group_id: VoucherType.PurchaseQuotation,
    },
    {
      id: 51,
      name: "stock_transfer_excess_special",
      template_group_id: VoucherType.StockTransferExcessSpecial,
    },
    {
      id: 52,
      name: "purchase_order_transit",
      template_group_id: VoucherType.PurchaseOrderTransist,
    },
    {
      id: 53,
      name: "request_for_quotation",
      template_group_id: VoucherType.RequestForQuotation,
    },
    {
      id: 54,
      name: "payment_advice",
      template_group_id: "PARP",
    },
    {
      id: 55,
      name: "receipt_advice",
      template_group_id: "RARP",
    },
    {
      id: 56,
      name: "cheque",
      template_group_id: "Cheque"
    },
  ];