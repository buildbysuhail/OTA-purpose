

import VoucherType from "../../../enums/voucher-types";

export const TemplateTypes: {
  id: number;
  name: string;
  template_group_id: VoucherType | string;
}[] = [
    // Others
    {
      id: 1,
      name: "asset_depreciation",
      template_group_id: VoucherType.AssetDepreciation,
    },
    {
      id: 2,
      name: "barcode",
      template_group_id: "barcode"
    },
    {
      id: 3,
      name: "cheque",
      template_group_id: "Cheque"
    },
    {
      id: 4,
      name: "customer_balance_report",
      template_group_id: "CBR"
    },
    // HR Related
    {
      id: 5,
      name: "salary_process",
      template_group_id: VoucherType.SalaryProcess,
    },
    {
      id: 6,
      name: "leave_entry",
      template_group_id: VoucherType.LeaveEntry
    },
    // Accounting & Finance Related
    {
      id: 7,
      name: "multi_journal",
      template_group_id: VoucherType.MultiJournal,
    },
    {
      id: 8,
      name: "bank_reconciliation",
      template_group_id: VoucherType.BankReconciliation,
    },
    {
      id: 9,
      name: "journal_voucher",
      template_group_id: VoucherType.JournalVoucher,
    },
    {
      id: 10,
      name: "opening_balance",
      template_group_id: VoucherType.OpeningBalance,
    },
    {
      id: 11,
      name: "closing_balance",
      template_group_id: VoucherType.ClosingBalance,
    },
    {
      id: 12,
      name: "tax_on_expenses",
      template_group_id: VoucherType.TaxOnExpensePayment,
    },
    // Branch Transfer Related
    {
      id: 13,
      name: "branch_transfer_out",
      template_group_id: VoucherType.BranchTransferOut,
    },
    {
      id: 14,
      name: "branch_transfer_in",
      template_group_id: VoucherType.BranchTransferIn,
    },
    {
      id: 15,
      name: "inter_branch_transfer",
      template_group_id: VoucherType.InterBranchTransfer,
    },
    // Stock & Inventory Related
    {
      id: 16,
      name: "damage_expiry_substitute",
      template_group_id: VoucherType.DamageExpirySubstitute,
    },
    {
      id: 17,
      name: "goods_delivery_return",
      template_group_id: VoucherType.GoodsDeliveryReturn,
    },
    {
      id: 18,
      name: "excess_stock",
      template_group_id: VoucherType.ExcessStock,
    },
    {
      id: 19,
      name: "goods_receipt_note",
      template_group_id: VoucherType.GoodsReceiptNote,
    },
    {
      id: 20,
      name: "good_request",
      template_group_id: VoucherType.GoodRequest,
    },
    {
      id: 21,
      name: "damage_entry",
      template_group_id: VoucherType.DamageEntry,
    },
    {
      id: 22,
      name: "service_inventory",
      template_group_id: VoucherType.ServiceInventory,
    },
    {
      id: 23,
      name: "production",
      template_group_id: VoucherType.Production
    },
    {
      id: 24,
      name: "goods_receipt_return",
      template_group_id: VoucherType.GoodsReceiptReturn,
    },
    {
      id: 25,
      name: "shortage_stock",
      template_group_id: VoucherType.ShortageStock,
    },
    {
      id: 26,
      name: "material_receipt",
      template_group_id: VoucherType.MaterialReceipt,
    },
    {
      id: 27,
      name: "stock_transfer",
      template_group_id: VoucherType.StockTransfer,
    },
    {
      id: 28,
      name: "stock_transfer_shortage_special",
      template_group_id: VoucherType.StockTransferShortageSpecial,
    },
    {
      id: 29,
      name: "stock_transfer_excess_special",
      template_group_id: VoucherType.StockTransferExcessSpecial,
    },
    // Payment & Receipt Related
    {
      id: 30,
      name: "cash_payment",
      template_group_id: VoucherType.CashPayment
    },
    {
      id: 31,
      name: "cheque_receipt",
      template_group_id: VoucherType.ChequeReceipt,
    },
    {
      id: 32,
      name: "bank_receipt",
      template_group_id: VoucherType.BankReceipt
    },
    {
      id: 33,
      name: "cheque_payment",
      template_group_id: VoucherType.ChequePayment,
    },
    {
      id: 34,
      name: "cash_receipt",
      template_group_id: VoucherType.CashReceipt,
    },
    {
      id: 35,
      name: "bank_payment",
      template_group_id: VoucherType.BankPayment,
    },
    {
      id: 36,
      name: "cash_payment_estimate",
      template_group_id: VoucherType.CashPaymentEstimate,
    },
    {
      id: 37,
      name: "payment_advice",
      template_group_id: "PARP"
    },
    {
      id: 38,
      name: "receipt_advice",
      template_group_id: "RARP"
    },
    // Purchase Related
    {
      id: 39,
      name: "purchase_invoice",
      template_group_id: VoucherType.PurchaseInvoice,
    },
    {
      id: 40,
      name: "purchase_return",
      template_group_id: VoucherType.PurchaseReturn,
    },
    {
      id: 41,
      name: "purchase_order",
      template_group_id: VoucherType.PurchaseOrder,
    },
    {
      id: 42,
      name: "purchase_return_estimate",
      template_group_id: VoucherType.PurchaseReturnEstimate,
    },
    {
      id: 43,
      name: "purchase_estimation",
      template_group_id: VoucherType.PurchaseEstimate,
    },
    {
      id: 44,
      name: "purchase_quotation",
      template_group_id: VoucherType.PurchaseQuotation,
    },
    {
      id: 45,
      name: "purchase_order_transit",
      template_group_id: VoucherType.PurchaseOrderTransist,
    },
    {
      id: 46,
      name: "request_for_quotation",
      template_group_id: VoucherType.RequestForQuotation,
    },
    // Sales Related
    {
      id: 47,
      name: "invoice",
      template_group_id: VoucherType.SalesInvoice
    },
    {
      id: 48,
      name: "debit_note",
      template_group_id: VoucherType.DebitNote
    },
    {
      id: 49,
      name: "sales_quotation",
      template_group_id: VoucherType.SalesQuotation
    },
    {
      id: 50,
      name: "sales_order",
      template_group_id: VoucherType.SalesOrder
    },
    {
      id: 51,
      name: "sales_estimate",
      template_group_id: VoucherType.SalesEstimate
    },
    {
      id: 52,
      name: "delivery_challan",
      template_group_id: VoucherType.DeliveryChallan
    },
    {
      id: 53,
      name: "cash_receipt_estimate",
      template_group_id: VoucherType.CashReceiptEstimate
    },
    {
      id: 54,
      name: "goods_delivery_note",
      template_group_id: VoucherType.GoodsDeliveryNote
    },
    {
      id: 55,
      name: "sale_return_estimate",
      template_group_id: VoucherType.SaleReturnEstimate
    },
    {
      id: 56,
      name: "credit_note",
      template_group_id: VoucherType.CreditNote
    },
    {
      id: 57,
      name: "sales_return",
      template_group_id: VoucherType.SalesReturn
    },
  ];

export const accTransaction = [
  VoucherType.TaxOnExpensePayment,
  VoucherType.ChequeReceipt,
  VoucherType.MultiJournal,
  VoucherType.ChequePayment,
  VoucherType.CashReceipt,
  VoucherType.DebitNote,
  VoucherType.BankPayment,
  VoucherType.CashReceiptEstimate,
  VoucherType.OpeningBalance,
  VoucherType.CashPaymentEstimate,
  VoucherType.CashPayment,
  VoucherType.CreditNote,
  VoucherType.JournalVoucher,
  VoucherType.JournalVoucherSpecial
];