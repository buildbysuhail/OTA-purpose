export type TemplateGroupTypes =
  | "sales_invoice"
  | "barcode"
  | "balance_sheet"
  | "cash_payment"
  | "cash_receipt"
  | "bank_payment"
  | "bank_receipt"
  | "cheque_payment"
  | "cheque_receipt"
  | "opening_balance"
  | "debit_note"
  | "credit_note"
  | "journal_entry"
  | "multi_journal_entry"
  | "closing_balance"
  | "pdc"
  | "bank_reconciliation"
  | "tax_on_expenses_payments"
  | "cash_payment_estimate"
  | "cash_receipt_estimate";

export const TemplateTypes: {
  id: number;
  name: string;
  template_group_id: TemplateGroupTypes;
}[] = [
  {
    id: 1,
    name: "Invoice",
    template_group_id: "sales_invoice",
  },
  {
    id: 2,
    name: "Barcode",
    template_group_id: "barcode",
  },
  {
    id: 3,
    name: "balance sheet",
    template_group_id: "balance_sheet",
  },
  {
    id: 4,
    name: "cash payment",
    template_group_id: "cash_payment"
},
{
    id: 5,
    name: "cash receipt",
    template_group_id: "cash_receipt"
},
{
    id: 6,
    name: "bank payment",
    template_group_id: "bank_payment"
},
{
    id: 7,
    name: "bank receipt",
    template_group_id: "bank_receipt"
},
{
    id: 8,
    name: "cheque payment",
    template_group_id: "cheque_payment"
},
{
    id: 9,
    name: "cheque receipt",
    template_group_id: "cheque_receipt"
},
{
    id: 10,
    name: "opening balance",
    template_group_id: "opening_balance"
},
{
    id: 11,
    name: "debit note",
    template_group_id: "debit_note"
},
{
    id: 12,
    name: "credit note",
    template_group_id: "credit_note"
},
{
    id: 13,
    name: "journal entry",
    template_group_id: "journal_entry"
},
{
    id: 14,
    name: "multi journal entry",
    template_group_id: "multi_journal_entry"
},
{
    id: 15,
    name: "closing balance",
    template_group_id: "closing_balance"
},
{
    id: 16,
    name: "pdc",
    template_group_id: "pdc"
},
{
    id: 17,
    name: "bank reconciliation",
    template_group_id: "bank_reconciliation"
},
{
  id: 18,
  name: "tax on expenses payments",
  template_group_id: "tax_on_expenses_payments"
},
{
  id: 19,
  name: "cash payment estimate",
  template_group_id: "cash_payment_estimate"
},
{
  id: 20,
  name: "cash receipt estimate",
  template_group_id: "cash_receipt_estimate"
}
];

