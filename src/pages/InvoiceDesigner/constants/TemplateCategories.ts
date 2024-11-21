export type TemplateGroupTypes =
  | "delivery_challan"
  | "sales_estimate"
  | "sales_invoice"
  | "sales_order"
  | "sales_return"
  | "purchase_invoice"
  | "purchase_order"
  | "vendor_credit"
  | "journal_entry"
  | "retainer_invoice"
  | "customer"
  | "vendor"
  | "payment_receipts"
  | "retainer_payment_receipts"
  | "payment_made"
  | "qty_adjustment"
  | "value_adjustment"
  | "credit_note"
  | "balance_sheet"
  | "barcode";

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
];
