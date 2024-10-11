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
  | "credit_note";

export const TemplateTypes: {
  id: number;
  name: string;
  template_group_id: TemplateGroupTypes;
}[] = [
  {
    id: 1,
    name: "Estimate",
    template_group_id: "sales_estimate",
  },
  // {
  //   id: 2,
  //   name: "Retainer Invoice",
  //   template_group_id: "retainer_invoice",
  // },
  // {
  //   id: 3,
  //   name: "Sales Order",
  //   template_group_id: "sales_order",
  // },
  // {
  //   id: 4,
  //   name: "Sales Return",
  //   template_group_id: "sales_return",
  // },
  // {
  //   id: 5,
  //   name: "Delivery Challan",
  //   template_group_id: "delivery_challan",
  // },
  {
    id: 6,
    name: "Invoice",
    template_group_id: "sales_invoice",
  },

  // {
  //   id: 7,
  //   name: "Purchase Order",
  //   template_group_id: "purchase_order",
  // },
  // {
  //   id: 8,
  //   name: "Bill",
  //   template_group_id: "purchase_invoice",
  // },

  // {
  //   id: 9,
  //   name: "Vendor Credit",
  //   template_group_id: "vendor_credit",
  // },
  // {
  //   id: 10,
  //   name: "Journals",
  //   template_group_id: "journal_entry",
  // },
  // {
  //   id: 11,
  //   name: "Customer Statement",
  //   template_group_id: "customer",
  // },
  // {
  //   id: 12,
  //   name: "Vendor Statement",
  //   template_group_id: "vendor",
  // },
  // {
  //   id: 13,
  //   name: "Payment Receipts",
  //   template_group_id: "payment_receipts",
  // },
  // {
  //   id: 14,
  //   name: "Retainer Payment Receipts",
  //   template_group_id: "retainer_payment_receipts",
  // },
  // {
  //   id: 15,
  //   name: "Payment Made",
  //   template_group_id: "payment_made",
  // },

  // {
  //   id: 16,
  //   name: "Quantity Adjustment",
  //   template_group_id: "qty_adjustment",
  // },
  // {
  //   id: 17,
  //   name: "Value Adjustment",
  //   template_group_id: "value_adjustment",
  // },
  // {
  //   id: 18,
  //   name: "Credit Notes",
  //   template_group_id: "credit_note",
  // },
];
