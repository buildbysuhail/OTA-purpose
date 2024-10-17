import { TemplateState } from "../Designer/interfaces";
import { TemplateGroupTypes } from "../constants/TemplateCategories";

export interface DeafultTemplateProps {
  content: TemplateState;
  is_default: boolean;
  is_primary: boolean;
  voucher_type: TemplateGroupTypes;

  status?: "current";
  logo?: string | null;
  background?: string | null;
  preview?: string | null;
}

const DefaultBillTemplates: DeafultTemplateProps[] = [
  /* ################  Standard Template  ################ */
  // {
  //   content: {
  //     totalState: {
  //       showTotalSection: true,
  //       showSubTotalLabel: true,
  //       showDicount: true,
  //       showTax: true,
  //       showQuantity: true,
  //       showPaymentDetail: true,
  //       showAmoutInWords: true,
  //       subTotalLabel: "Sub Total",
  //       shippingLabel: "Shipping",
  //     },
  //     propertiesState: {
  //       bg_color: "#ffffff",
  //       font: "Poppins",
  //       font_size: 12,
  //       font_color: "#000000",
  //       font_weight: 400,

  //       label_font_size: 12,
  //       label_font_color: "#000000",
  //       label_font_weight: 400,
  //       pageSize: "A4",
  //       margins: {
  //         top: 40,
  //         bottom: 40,
  //         left: 30,
  //         right: 30,
  //       },
  //       templateName: "Standard Template (Bill)",
  //     template_type: "standard",
  //     template_kind: "standard",
  //     },
      
      
  //   headerState: {
  //     showDocTitle: true,
  //     docTitle: "Bill",
  //     showLogo: true,
  //     logoSize: 60,
  //     showOrgName: true,
  //     showOrgAddress: true,

  //     showNumberField: true,
  //     numberField: "Bill #",
  //     showDateField: true,
  //     dateField: "Date",
  //     showTerms: true,
  //     terms: "Terms",
  //     showDueDate: true,
  //     due_date: "Due Date",
  //     showReference: true,
  //     reference: "P.O.#",
  //     showSalesPerson: true,
  //     salesPerson: "Sales Person",
  //     showProject: true,
  //     project: "Project 1",
  //     showEWayBill: true,
  //     eWayBill: "E-Way Bill#",
  //     showPlaceOfSupply: true,
  //     placeOfSupply: "Place of Supply",
  //     showSubject: true,
  //     subject: "Subject",
  //     showStatusStamp: true,
  //   },
  //   footerState: {
  //     notesLabel: "Notes",
  //     noteFontSize: 12,
  //   },
  //   itemTableState: {
  //     amountLabel: "Amount",
  //     amountWidth: "10%",
  //     discountLabel: "Discount",
  //     discountWidth: "10%",
  //     discriptionLabel: "Description",
  //     headerFontColor: "#ffffff",
  //     headerFontSize: 11,
  //     hsnSacLabel: "HSN/SAC",
  //     hsnSacWidth: "10%",
  //     itemRowBgColor: "#ffffff",
  //     itemRowFontSize: 12,
  //     lineItemLabel: "Item",
  //     lineItemNumberLabel: "S.No.",
  //     lineItemNumberWidth: "10%",
  //     lineItemWidth: "30%",
  //     quantityLabel: "Qty",
  //     quantityWidth: "10%",
  //     rateLabel: "Rate",
  //     rateWidth: "10%",
  //     showAmount: true,
  //     showDiscount: true,
  //     showDiscription: true,
  //     showHsnSac: true,
  //     showLineItem: true,
  //     showLineItemNumber: true,
  //     showQuantity: true,
  //     showRate: true,
  //     showTableBorder: true,
  //     showTableHeaderBg: true,
  //     showTax: true,
  //     tableBorderColor: "#a3a3a3",
  //     tableHeaderBgColor: "#3b3b3b",
  //     taxLabel: "Tax",
  //     taxWidth: "10%",
  //   },
    
    
  // },
];

export default DefaultBillTemplates;
