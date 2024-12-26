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
];

