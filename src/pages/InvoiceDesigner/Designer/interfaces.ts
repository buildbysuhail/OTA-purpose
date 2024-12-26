import VoucherType from "../../../enums/voucher-types";
import { ActionState } from "../../../redux/slices/templates/thunk";

type TemplateTypes =
  | "standard"
  | "standard_japanese"
  | "spreadsheet"
  | "spreadsheet_lite"
  | "spreadsheet_compact"
  | "premium_minimal"
  | "premium_grand"
  | "universal_lite"
  | "universal_simple"
  | "retail_standard";

type TemplateKindType =
  | "standard"
  | "spreadsheet"
  | "premium"
  | "universal"
  | "retail";

export interface TemplateState {
  id?: string | number | undefined;
  thumbImage?: string;
  background_image?: string;
  background_image_header?: string;
  background_image_footer?: string;
  signature_image?: string;
  propertiesState?: PropertiesState;
  headerState?: HeaderState;
  itemTableState?: ItemTableState;
  totalState?: TotalState;
  footerState?: FooterState;
  barcodeState?: BarcodeState;
  isCurrent?: boolean;
}
export interface HistoryComponent {
  id: number;
  field: any;
  value: any
 }
export interface LabelState {
  columnsPerRow?: number;
  rowsPerPage?: number;
  labelHeight: number;
  labelWidth: number;
  background_image?: string;
  bg_image_position?:string;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  gap?: {
    hgap?: number;
    vgap?: number; 
  };
  orientation?:"landscape"|"portrait"
}
export interface BarcodeState {
  placedComponents: PlacedComponent[];
  labelState?: LabelState;
}
export enum DesignerElementType {
  text = 1,
  barcode = 2,
  field = 3,
  table= 4,
  line = 5,
  image = 6,
  qrCode=7,
  area=8,
}

export interface PlacedComponent {
  id: number;
  type: DesignerElementType;
  content: string;
  x: number;
  y: number;
  textAlign?: "left" | "center" | "right";
  fontSize: number;
  fontStyle: "normal" | "bold" | "italic";
  font: string;
  width: number;
  height: number;
  rotate:number;
  lineThickness?:string;
  lineColor?:string;
  lineHeight?:number;
  lineType?:"solid"|"dotted"|"dashed";
  imgFit?:string;
  barcodeProps?: {
    format: string;
    barWidth: number;
    height: number;
    margin: number;
    background: string;
    lineColor: string;
    showText: boolean;
    textAlign: "left" | "center" | "right";
    font: string;
    fontSize: number;
    textMargin: number;
    fontStyle: "normal" | "bold" | "italic";
  };
 tableProps: {
    showBorder: boolean;
    columns: tableColumns[]
  };
  qrCodeProps: QRCodeProps;
  areaProps:AreaProps;
}
export type QRCodeProps = {
  value: string;
  size: number;
  level: "L" | "M" | "Q" | "H";
  bgColor: string;
  fgColor: string;
  marginSize: number;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
};

export type AreaProps = {
  bgColor: string;
  isRepeat: boolean;
  height: string;
  width: string;
};
 export interface tableColumns {
    caption?: string;
    field: string;
    textAlign: "left" | "center" | "right";
    fontStyle: "normal" | "bold" | "italic";
    font: string;
    fontSize: number;
    width: number;
    textColor:string;
    bgColor:string;
    isRepeat?:boolean;
  };
export interface PropertiesState {
  template_type?: TemplateTypes;
  template_kind?: TemplateKindType;
  template_group?: VoucherType | string;
  language_prefer?:"Eng"|"Arb";
  templateName?: string;
  pageSize?: string;
  width?:string;
  height?:string;
  orientation?: "portrait" | "landscape";
  // Martgins
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  /// background
  bg_color?: string;
  bg_image_position?: string;

  printer?: string;

  /// Font
  font?: string;
  font_size?: number;
  font_color?: string;
  font_weight?: number;
  // font_style?: string;

  /// Label Properties
  label_font_size?: number;
  label_font_color?: string;
  label_font_weight?: number;

  // Payment Stub
  showPaymentStubSettings?: boolean;
  includePaymentStub?: boolean;
  payment_stub_label?: string;
  amount_enclosed_label?: string;
  payment_stub_position?: "same_page" | "new_page";
}

export interface HeaderState {
  showLogo?: boolean;
  logo?: string;
  logoSize?: number;
  showOrgName?: boolean;
  showOrgAddress?: boolean;
  showDocTitle?: boolean;
  docTitle?: string;
  showBalanceDue?: boolean;

  hasPhoneField?: boolean;
  phoneLabel?: string;

  hasfaxField?: boolean;
  faxLabel?: string;

  bgColor?: string;
  isFirstOnly?: boolean;
  bg_image_header_position?: string;
  headerHeight?: number;

  /// Document Title
  docTitleFontSize?: number;
  docTitleFontColor?: string;

  /// Organization
  OrganizationFontSize?: number;
  OrganizationFontColor?: string;
  OrganizationPhone?: string;
  OrganizationFax?: string;
  show_balance_due?: boolean;
  showStatusStamp?: boolean;

  // for payment reciept
  showReceivedFrom?: boolean;
  receivedFromLabel?: string;

  /// Customer Name
  customerNameFontSize?: number;
  customerNameFontColor?: string;
  hasBillTo?: boolean;
  billTo?: string;
  hasShipTo?: boolean;
  shipTo?: string;

  /// Organization
  orgNameFontSize?: number;
  orgNameFontColor?: string;

  /// Document Information
  showNumberField?: boolean;
  numberField?: string;

  // Inventory Adj fields
  showReasonField?: boolean;
  reasonLabel?: string;
  showAccountField?: boolean;
  accountLabel?: string;
  showAdjTypeField?: boolean;
  adjTypeLabel?: string;
  showCreateUserField?: boolean;
  createUserLabel?: string;
  showBranchField?: boolean;
  branchLabel?: string;
  //

  // for journal
  showNotesLabel?: boolean;
  notesLabel?: string;
  showAmount?: boolean;
  amountLabel?: string;

  // Other Invoice fields
  showDateField?: boolean;
  dateField?: string;

  showTerms?: boolean;
  terms?: string;

  showDueDate?: boolean;
  due_date?: string;

  showReference?: boolean;
  reference?: string;

  showSalesPerson?: boolean;
  salesPerson?: string;

  showProject?: boolean;
  project?: string;

  showEWayBill?: boolean;
  eWayBill?: string;

  showPlaceOfSupply?: boolean;
  placeOfSupply?: string;

  showSubject?: boolean;
  subject?: string;

  showTransactionType?: boolean;
  transactionType?: string;

  showSupplyDate?: boolean;
  supplyDate?: string;

  showShipmentDate?: boolean;
  shipmentDateLabel?: string;

  showAssociatedInvNo?: boolean;
  showAssociatedInvDate?: boolean;
  // Reciepts Informations
  recieptInfo?: {
    showReceiptTable?: boolean;

    showReceiptNumber?: boolean;
    receiptNumberLabel?: string;

    showReceiptDate?: boolean;
    receiptDateLabel?: string;

    showReceiptReference?: boolean;
    receiptReferenceLabel?: string;

    showReceiptMode?: boolean;
    receiptModeLabel?: string;

    showReceiptAmount?: boolean;
    receiptAmountLabel?: string;
    //
    amtReceivedLabel?: string;
    currencySymbolPosition?: "after" | "before";

    amtReceivedFontSize?: number;
    amtReceivedFontColor?: string;
    amtReceivedBgColor?: string;
  };

  // Statement Informations (customer and vendors)
  accountSummary?: {
    showAccountSummary?: boolean;
    accountSummaryLabel?: string;

    showOpeningBalance?: boolean;
    openingBalanceLabel?: string;

    showInvoicedAmount?: boolean;
    invoicedAmountLabel?: string;

    showAmountPaid?: boolean;
    amountPaidLabel?: string;

    showBalanceDue?: boolean;
    balanceDueLabel?: string;
  };
}

export interface ItemTableState {
  showTableBorder?: boolean;
  tableBorderColor?: string;
  /// Table Header
  headerFontSize?: number;
  showTableHeaderBg?: boolean;
  tableHeaderBgColor?: string;
  headerFontColor?: string;
  /// Item Row
  showRowBg?: boolean;
  itemRowBgColor?: string;
  itemRowFontColor?: string;
  itemRowFontSize?: number;

  // Item Description
  itemDescriptionFontColor?: string;
  itemDescriptionFontSize?: number;

  /////// Labels
  showLineItemNumber?: boolean;
  lineItemNumberLabel?: string;
  lineItemNumberWidth?: string;

  showLineItem?: boolean;
  lineItemLabel?: string;
  lineItemWidth?: string;

  showDiscription?: boolean;
  discriptionLabel?: string;

  showAccountDetails?: boolean;
  accountDetailsLabel?: string;
  accountDetailsWidth?: string;

  showQuantity?: boolean;
  quantityLabel?: string;
  quantityWidth?: string;
  showQtyUnit?: boolean;

  showCustomerDetails?: boolean;

  showHsnSac?: boolean;
  hsnSacLabel?: string;
  hsnSacWidth?: string;

  showRate?: boolean;
  rateLabel?: string;
  rateWidth?: string;

  showTax?: boolean;
  taxLabel?: string;
  taxWidth?: string;

  showTaxPercentage?: boolean;
  taxPercentageLabel?: string;
  taxPercentageWidth?: string;

  showTaxAmount?: boolean;
  taxAmountLabel?: string;
  taxAmountWidth?: string;

  showDiscount?: boolean;
  discountLabel?: string;
  discountWidth?: string;

  showAmount?: boolean;
  amountLabel?: string;
  amountWidth?: string;

  addTaxToAmount?: boolean;

  // Jouranl Table Items
  showAccountCode?: boolean;
  showContactDetails?: boolean;

  //Qty Adjustments
  showQtyAdjustment?: boolean;
  qtyAdjustmentWidth?: string;
  qtyAdjustmentLabel?: string;

  // Value Adjustments
  showValueAdjustment?: boolean;
  valueAdjustmentLabel?: string;
  valueAdjustmentWidth?: string;

  // Customer & Vendor Statements
  statementTable?: {
    showStatementTable?: boolean;

    showDateField?: boolean;
    dateFieldLabel?: string;

    showTransactionTypeField?: boolean;
    transactionTypeFieldLabel?: string;

    showTransactionDetailsField?: boolean;
    transactionDetailsFieldLabel?: string;

    showAmountField?: boolean;
    amountFieldLabel?: string;

    showPaymentField?: boolean;
    paymentFieldLabel?: string;

    showRefundField?: boolean;
    refundFieldLabel?: string;

    showBalanceField?: boolean;
    balanceFieldLabel?: string;
  };
}

export interface TotalState {
  showTotalSection?: boolean;
  showAmoutInWords?: boolean;

  /////// LABELS
  showSubTotalLabel?: boolean;
  subTotalLabel?: string;

  shippingLabel?: string;

  showDicount?: boolean;

  showTotalTaxableAmount?: boolean;
  totalTaxableAmountlabel?: string;

  showTax?: boolean;

  showTotal?: boolean;
  totalInfoLabel?: string;

  currencyPosition?: { label?: string; value?: string };

  showQuantity?: boolean;
  quantityInfoLabel?: string;

  showPaymentDetail?: boolean;

  paymentMadeLabel?: string;
  balanceAmountLabel?: string;

  creditsAppliedLabel?: string;
  writeOffAmountLabel?: string;
  refundLabel?: string;
  creditsRemainingLabel?: string;

  /////// LAYOUT
  /// Total(Subtotal, Tax)
  totalFontSize?: number;
  totalFontColor?: string;
  showTotalBgColor?: boolean;
  totalBgColor?: string;

  /// Balance Due
  balanceFontSize?: number;
  balanceFontColor?: string;
  showBalanceBgColor?: boolean;
  balanceBgColor?: string;

  // Tax Summary Table
  showTaxSummaryTable?: boolean;
  taxSummaryTitle?: string;
  taxDetailsLabel?: string;
  showTaxableAmountLabel?: boolean;
  taxableAmountLabel?: string;
  showTaxAmountLabel?: boolean;
  taxAmountLabel?: string;
  showTotalAmountLabel?: boolean;
  totalAmountLabel?: string;
  totalLabel?: string;
}

export interface FooterState {
  /// Notes
  showNotesLabel?: boolean;
  notesLabel?: string;
  noteFontSize?: number;

  /// Payment Options
  showOnlinePaymentLink?: boolean;
  onlinePaymentLink?: string;
  /// Invoice QR Code
  showInvoiceQRCode?: boolean;
  /// Terms and Conditions
  showTermsAndConditions?: boolean;
  termsLabel?: string;
  termsFontSize?: number;
  /// Signature
  showSignature?: boolean;
  signatureLabel?: string;
  // signatureImage?: string;
  signatureName?: string;
  /// Additional Signature
  showAdditionalSignature?: boolean;
  additionalSignatureLabel?: string;
  additionalSignatureName?: string;
  /// Footer
  footerFontSize?: number;
  footerFontColor?: string;
  bg_color?: string;

  /// page number
  show_page_number?: boolean;

  bg_image_footer_position?: string;
}
export const initialTemplateState: ActionState<TemplateState> = {
  loading: false,
  error: null,
  data: {
    id: undefined,
    thumbImage: "",
    background_image: "",
    background_image_footer: "",
    background_image_header: "",
    propertiesState: {
      template_type: "standard",
      template_kind: "standard",
      template_group: "sales_invoice",
      templateName: "",
      pageSize: "Custom",
      orientation: "portrait",
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
      bg_color: "#FFFFFF",
      bg_image_position: "center",
      font: "Arial",
      font_size: 12,
      font_color: "#000000",
      font_weight: 400,
      label_font_size: 10,
      label_font_color: "#000000",
      label_font_weight: 400,
      showPaymentStubSettings: false,
      includePaymentStub: false,
      payment_stub_label: "",
      amount_enclosed_label: "",
      payment_stub_position: "same_page",
    },
    headerState: {
      showLogo: false,
      logo: "",
      logoSize: 50,
      showOrgName: true,
      showOrgAddress: true,
      showDocTitle: true,
      docTitle: "",
      showBalanceDue: false,
      hasPhoneField: false,
      phoneLabel: "",
      hasfaxField: false,
      faxLabel: "",
      bgColor: "#FFFFFF",
      isFirstOnly: false,
      bg_image_header_position: "center",
      headerHeight: 50,
      docTitleFontSize: 16,
      docTitleFontColor: "#000000",
      OrganizationFontSize: 12,
      OrganizationFontColor: "#000000",
      show_balance_due: false,
      showStatusStamp: false,
      showReceivedFrom: false,
      receivedFromLabel: "",
      customerNameFontSize: 12,
      customerNameFontColor: "#000000",
      hasBillTo: false,
      billTo: "",
      hasShipTo: false,
      shipTo: "",
      orgNameFontSize: 12,
      orgNameFontColor: "#000000",
      showNumberField: false,
      numberField: "",
      showReasonField: false,
      reasonLabel: "",
      showAccountField: false,
      accountLabel: "",
      showAdjTypeField: false,
      adjTypeLabel: "",
      showCreateUserField: false,
      createUserLabel: "",
      showBranchField: false,
      branchLabel: "",
      showNotesLabel: false,
      notesLabel: "",
      showAmount: false,
      amountLabel: "",
      showDateField: false,
      dateField: "",
      showTerms: false,
      terms: "",
      showDueDate: false,
      due_date: "",
      showReference: false,
      reference: "",
      showSalesPerson: false,
      salesPerson: "",
      showProject: false,
      project: "",
      showEWayBill: false,
      eWayBill: "",
      showPlaceOfSupply: false,
      placeOfSupply: "",
      showSubject: false,
      subject: "",
      showTransactionType: false,
      transactionType: "",
      showSupplyDate: false,
      supplyDate: "",
      showShipmentDate: false,
      shipmentDateLabel: "",
      showAssociatedInvNo: false,
      showAssociatedInvDate: false,
      recieptInfo: {
        showReceiptTable: false,
        showReceiptNumber: false,
        receiptNumberLabel: "",
        showReceiptDate: false,
        receiptDateLabel: "",
        showReceiptReference: false,
        receiptReferenceLabel: "",
        showReceiptMode: false,
        receiptModeLabel: "",
        showReceiptAmount: false,
        receiptAmountLabel: "",
        amtReceivedLabel: "",
        currencySymbolPosition: "before",
        amtReceivedFontSize: 12,
        amtReceivedFontColor: "#000000",
        amtReceivedBgColor: "#FFFFFF",
      },
      accountSummary: {
        showAccountSummary: false,
        accountSummaryLabel: "",
        showOpeningBalance: false,
        openingBalanceLabel: "",
        showInvoicedAmount: false,
        invoicedAmountLabel: "",
        showAmountPaid: false,
        amountPaidLabel: "",
        showBalanceDue: false,
        balanceDueLabel: "",
      },
    },
    itemTableState: {
      showTableBorder: true,
      tableBorderColor: "#000000",
      headerFontSize: 12,
      showTableHeaderBg: false,
      tableHeaderBgColor: "#FFFFFF",
      headerFontColor: "#000000",
      showRowBg: false,
      itemRowBgColor: "#FFFFFF",
      itemRowFontColor: "#000000",
      itemRowFontSize: 12,
      itemDescriptionFontColor: "#000000",
      itemDescriptionFontSize: 12,
      showLineItemNumber: true,
      lineItemNumberLabel: "Item No.",
      lineItemNumberWidth: "10%",
      showLineItem: true,
      lineItemLabel: "Item",
      lineItemWidth: "20%",
      showDiscription: true,
      discriptionLabel: "Description",
      showAccountDetails: false,
      accountDetailsLabel: "",
      accountDetailsWidth: "20%",
      showQuantity: true,
      quantityLabel: "Quantity",
      quantityWidth: "10%",
      showQtyUnit: false,
      showCustomerDetails: false,
      showHsnSac: false,
      hsnSacLabel: "",
      hsnSacWidth: "10%",
      showRate: true,
      rateLabel: "Rate",
      rateWidth: "10%",
      showTax: false,
      taxLabel: "",
      taxWidth: "",
      showTaxPercentage: false,
      taxPercentageLabel: "",
      taxPercentageWidth: "",
      showTaxAmount: false,
      taxAmountLabel: "",
      taxAmountWidth: "",
      showDiscount: false,
      discountLabel: "",
      discountWidth: "",
      showAmount: true,
      amountLabel: "Amount",
      amountWidth: "10%",
      addTaxToAmount: false,
      showAccountCode: false,
      showContactDetails: false,
      showQtyAdjustment: false,
      qtyAdjustmentWidth: "",
      qtyAdjustmentLabel: "",
      showValueAdjustment: false,
      valueAdjustmentLabel: "",
      valueAdjustmentWidth: "",
      statementTable: {
        showStatementTable: false,
        showDateField: false,
        dateFieldLabel: "",
        showTransactionTypeField: false,
        transactionTypeFieldLabel: "",
        showTransactionDetailsField: false,
        transactionDetailsFieldLabel: "",
        showAmountField: false,
        amountFieldLabel: "",
        showPaymentField: false,
        paymentFieldLabel: "",
        showRefundField: false,
        refundFieldLabel: "",
        showBalanceField: false,
        balanceFieldLabel: "",
      },
    },
    totalState: {
      showTotalSection: true,
      showAmoutInWords: false,
      showSubTotalLabel: true,
      subTotalLabel: "Subtotal",
      shippingLabel: "Shipping",
      showDicount: false,
      showTotalTaxableAmount: false,
      totalTaxableAmountlabel: "",
      showTax: false,
      showTotal: true,
      totalInfoLabel: "Total",
      currencyPosition: { label: "USD", value: "USD" },
      showQuantity: true,
      quantityInfoLabel: "Quantity",
      showPaymentDetail: false,
      paymentMadeLabel: "",
      balanceAmountLabel: "",
      creditsAppliedLabel: "",
      writeOffAmountLabel: "",
      refundLabel: "",
      creditsRemainingLabel: "",
      totalFontSize: 14,
      totalFontColor: "#000000",
      showTotalBgColor: false,
      totalBgColor: "#FFFFFF",
      balanceFontSize: 14,
      balanceFontColor: "#000000",
      showBalanceBgColor: false,
      balanceBgColor: "#FFFFFF",
      showTaxSummaryTable: false,
      taxSummaryTitle: "",
      taxDetailsLabel: "",
      showTaxableAmountLabel: false,
      taxableAmountLabel: "",
      showTaxAmountLabel: false,
      taxAmountLabel: "",
      showTotalAmountLabel: false,
      totalAmountLabel: "",
      totalLabel: "Total",
    },
    footerState: {
      showNotesLabel: false,
      notesLabel: "",
      noteFontSize: 12,
      showOnlinePaymentLink: false,
      onlinePaymentLink: "",
      showInvoiceQRCode: false,
      showTermsAndConditions: false,
      termsLabel: "",
      termsFontSize: 12,
      showSignature: false,
      signatureLabel: "",
      signatureName: "",
      showAdditionalSignature: false,
      additionalSignatureLabel: "",
      additionalSignatureName: "",
      footerFontSize: 12,
      footerFontColor: "#000000",
      bg_color: "#FFFFFF",
      show_page_number: false,
      bg_image_footer_position: "center",
    },
  },
};
export const initialBacodeTemplateState: ActionState<TemplateState> = {
  loading: false,
  error: null,
  data: {
    id: 0,
    thumbImage: "",
    propertiesState: {
      template_type: "standard",
      template_kind: "standard",
      template_group: "barcode",
      templateName: "Barcode 1",
      pageSize: "A4",
      orientation:"portrait",
      height:'300',
      width:'300',
      language_prefer:"Eng",
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      bg_color: "#FFFFFF",
    },
    barcodeState: {
       placedComponents:[],
       labelState: {columnsPerRow:1, labelHeight:200,labelWidth:300, rowsPerPage: 1}
    },
  },
};
