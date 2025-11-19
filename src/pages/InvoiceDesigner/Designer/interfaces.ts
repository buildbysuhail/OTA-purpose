import VoucherType from "../../../enums/voucher-types";
import { ActionState } from "../../../redux/slices/templates/thunk";
import { PrintDetailDto } from "../../use-print-type";

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
  export interface TemplateDto {
    id?: string | number | undefined;
    branchId?: number;
    templateType?: string;
    templateKind?: string;
    templateGroup?: string;
    templateName?: string;
    thumbImage?: string;
    background_image?: string;
    background_image_header?: string;
    background_image_footer?: string;
    signature_image?: string;
    content?: string;
    isCurrent?: boolean;
    formType?:string;
    customerType?:string;
  }
export interface TemplateState<T> {
  id?: number | undefined ;
  thumbImage?: string;
  background_image?: string;
  background_image_header?: string;
  background_image_footer?: string;
  signature_image?: string;
  propertiesState?: PropertiesState;
  headerState: HeaderState;
  tableState?: TableColumn<T>[];
  itemTableMasterState?: ItemTableMasterState;
  totalState?: TotalState;
  footerState?: FooterState;
  barcodeState?: BarcodeState;
  isCurrent?: boolean;
  templateType?: string;
  templateKind?: string;
  templateGroup?: string;
  templateName?: string;
  templateDescription?: string;
  formType?:string;
  customerType?:string;
      
}
export interface HistoryComponent {
  id: number;
  field: any;
  value: any
 }
export interface CustomElementType {
 height?: number;
 elements: PlacedComponent[];
 thumbImage:string
 background_image?: string;
 bg_image_position?:string;
 background_color?: string;
 bg_image_objectFit?:string;
 isFirstOnly?: boolean;
 }
export interface LabelState {
  columnsPerRow?: number;
  rowsPerPage?: number
  labelHeight: number;
  labelWidth: number;
  background_image?: string;
  bg_image_position?:string;
  bg_image_objectFit?:string;
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
  line = 4,
  image = 5,
  qrCode=6,
  container=7,
}

export interface PlacedComponent {
  id: string;
  type: DesignerElementType;
  content: string;
  format?:string;
  x: number;
  y: number;
  textAlign?: "left" | "center" | "right";
  verticalAlign?:"top"|"middle"|"bottom";
  textUnderLine?:boolean;
  fontSize: number;
  direction:"ltr"|"rtl"
  fontStyle: "normal" | "italic";
  font: string;
  arabicFont?:string;
  fontColor?:string;
  fontWeight?:string;
  width: number;
  height: number;
  rotate:number;
  lineThickness?:number;
  lineColor?:string;
  lineWidth?:number;
  lineType?:"solid"|"dotted"|"dashed";
  imgFit?:string;
  imgPosition?:string;
  imgFromDevice?:boolean;
  containerId?: string; 
  children?: PlacedComponent[]; 
  containerProps?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRound?:number;
    borderStyle?: "solid" | "dashed" | "dotted" | "none";
    padding?: number;
    autoResize?: boolean; // Enable auto-resize based on content
    minHeight?: number;
    maxHeight?: number;
  };
  barcodeProps?: {
    format: string;
    field:string;
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

  qrCodeProps: QRCodeProps;

}
export type QRCodeProps = {
  // Core data
  value: string;

  // Size & padding
  width?: number;
  height?: number;
  margin?: number; // pixel margin

  // Error correction
  level?: "L" | "M" | "Q" | "H";

  // Output options
  image?: string; // Logo/image source
  imageOptions?: {
    hideBackgroundDots?: boolean;
    imageSize?: number;
    margin?: number;
    crossOrigin?: "anonymous" | "use-credentials";
  };
  type?: "canvas" | "svg";

  // Base dot style
  dotsOptions?: {
    color?: string;
    gradient?: {
      type?: "linear" | "radial";
      rotation?: number;
      colorStops: { offset: number; color: string }[];
    };
    type?:
      | "rounded"
      | "dots"
      | "classy"
      | "classy-rounded"
      | "square"
      | "extra-rounded";
  };

  // Background style
  backgroundOptions?: {
    color?: string;
    gradient?: {
      type?: "linear" | "radial";
      rotation?: number;
      colorStops: { offset: number; color: string }[];
    };
  };

  // Corner squares (outer corner shapes)
  cornersSquareOptions?: {
    color?: string;
    gradient?: {
      type?: "linear" | "radial";
      rotation?: number;
      colorStops: { offset: number; color: string }[];
    };
    type?:
      | "square"
      | "extra-rounded"
      | "dot"
      | "classy"
      | "classy-rounded";
  };

  // Corner dots (inner shapes inside corner squares)
  cornersDotOptions?: {
    color?: string;
    gradient?: {
      type?: "linear" | "radial";
      rotation?: number;
      colorStops: { offset: number; color: string }[];
    };
    type?:
      | "square"
      | "dot";
  };
};

export type AreaProps = {
  bgColor: string;
  isRepeat: boolean;
  height: number;
  width: number;
};
 export interface tableColumns {
    caption?: string;
    field: string;
    textAlign: "left" | "center" | "right";
    fontStyle: "normal" | "italic";
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
  template_formType?:string;
  template_customerType?:string;
  ask_start_index?:boolean;
  templateName?: string;
  pageSize?: string;
  width?:number;
  height?:number;
  orientation?: "portrait" | "landscape";
  // Martgins
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
  /// background
  bg_color?: string;
  bg_image_position?: string;
  bg_image_objectFit?:string;
  select_printer?:boolean;
  printer?: string;

  /// Font
  font_family?: string;
  arabic_fontFamily?:string;
  font_size?: number;
  font_color?: string;
  font_weight?: number;
  fontStyle?: "normal" | "italic";

  // font_style?: string;

  /// Label Properties
  label_font_size?: number;
  label_font_color?: string;
  label_font_weight?: number;
  label_font_style?:"normal"|"italic";
 
  print_on_same_page?:boolean;
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
  docTitleUnderline?: boolean;
  showBalanceDue?: boolean;

  hasPhoneField?: boolean;
  phoneLabel?: string;

  hasfaxField?: boolean;
  faxLabel?: string;

  hasEmailField?: boolean;
  emailLabel?: string;

  bgColor?: string;
  isFirstOnly?: boolean;
  bg_image_header_position?: string;
  bg_image_header_objectFit?:string;
  headerHeight?: number;
  showHeader?: boolean;

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
  /// Vender Name
  showVender?: boolean;
  venderNameFontSize?: number;
  venderNameFontColor?: string;
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

    /// Font
  font_size?: number;
  font_color?: string;
  font_weight?: number;
  fontStyle?: "normal" | "italic";

  /// Label Properties
  label_font_size?: number;
  label_font_color?: string;
  label_font_weight?: number;
  label_font_style?:"normal"|"italic";

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
  accountTransactionInfo?:accountTransactionInfo;
  adviceTransInfo?:adviceTransInfo;

  customElements:CustomElementType,
}
export interface accountTransactionInfo {

  showPaymentMode?: boolean;
  paymentMode?: string;

  showDateField?: boolean;
  dateField?: string;

  showReferenceField?: boolean;
  referenceField?: string;

  showOverPayment?: boolean;
  overPayment?: string;

  showPaymentRefund?: boolean;
  paymentRefund?: string;

  //  amtReceivedLabel?: string;
  //  currencySymbolPosition?: "after" | "before";

  //  amtReceivedFontSize?: number;
  //  amtReceivedFontColor?: string;
  //  amtReceivedBgColor?: string;
   
}
export interface adviceTransInfo {
  showVoucherNumber?: boolean;
  voucherNumber?: string;

  showPrefix?: boolean;
  showFormType?: boolean;

  showPaymentMode?: boolean;
  paymentMode?: string;

  showDateField?: boolean;
  dateField?: string;

  showReferenceField?: boolean;
  referenceField?: string;

  showPaymentAmount?: boolean;
  paymentAmount?: string;

  showBank?: boolean;
  bank?: string;
   
}
export interface ItemTableMasterState {
  showTableRowBorder?: boolean;
  showTableColBorder?: boolean;
  tableRowBorderColor?: string;
  tableColBorderColor?: string;
  /// Table Header
  headerRepeatOnPage?:boolean;
  showTableHeaderBg?: boolean;
  tableHeaderBgColor?: string;
  headerFontColor?: string;
  headerFontSize?: number;
  headerFontWeight?: number;
  headerFontFamily?: string;
  arabicHeaderFontFamily?:string;
  headerFontStyle?:  "normal" | "italic";
  /// Item Row
  showRowBg?: boolean;
  itemRowBgColor?: string;
  itemRowFontColor?: string;
  itemRowFontSize?: number;
  itemRowFontWeight?: number;
  itemRowFontFamily?: string;
  arabicItemRowFontFamily?:string;
  itemRowFontStyle?:  "normal" | "italic";
  /////// Labels
  showLineItemNumber?: boolean;
  lineItemNumberLabel?: string;
  lineItemNumberWidth?: string;
}
export interface TableColumn<T> {
  label: string;
  width: number;
  field: keyof T;
  format: string;
  show: boolean;
  key: string;
}
export const initialTableColumn: TableColumn<PrintDetailDto> = {
  label: "",
  width: 50,
  field: "slNo",
  show: true,
  key:"",
  format: "NONE"
}

export const templateDesignerFormatOptions = [
  { label: "NONE", value: "NONE" },
  { label: "###", value: "###" },
  { label: "###0", value: "###0" },
  { label: "###0.0", value: "###0.0" },
  { label: "###0.00", value: "###0.00" },
  { label: "C###0.00", value: "C###0.00" },
  { label: "###0.000", value: "###0.000" },
  { label: "###0.0000", value: "###0.0000" },
  { label: "###,###0.00", value: "###,###0.00" },
  { label: "***###0.00/-***", value: "***###0.00/-***" },
  { label: "hh:mm:ss tt", value: "hh:mm:ss tt" },
  { label: "HH:mm:ss", value: "HH:mm:ss" },
  { label: "dd-MM-yyyy", value: "dd-MM-yyyy" },
  { label: "dd-MM-yyyy HH:mm:ss", value: "dd-MM-yyyy HH:mm:ss" },
  { label: "d-M-yyyy", value: "d-M-yyyy" },
  { label: "dd-MMM-yyyy", value: "dd-MMM-yyyy" },
  { label: "MM/yy", value: "MM/yy" },
  { label: "dd", value: "dd" },
  { label: "MM", value: "MM" },
  { label: "yyyy", value: "yyyy" },
  { label: "yyyy-MM-dd", value: "yyyy-MM-dd" },
  { label: "MM-dd-yyyy", value: "MM-dd-yyyy" },  
  { label: "BIZ", value: "BIZ" },
  { label: "SHRINK", value: "SHRINK" },
  { label: "Qty", value: "Qty" },
  { label: "Qty1", value: "Qty1" },
  { label: "Qty2", value: "Qty2" },
  { label: "Qty3", value: "Qty3" },
  { label: "AR_NUM", value: "AR_NUM" },
  { label: "AR_DIG2", value: "AR_DIG2" },
  { label: "AR_DIG3", value: "AR_DIG3" },
  { label: "AR_DATE", value: "AR_DATE" }
];

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

  currencyPosition?: "after" | "before";

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

    /// Total(Subtotal, Tax)
   amtReceivedFontSize?: number;
   amtReceivedFontColor?: string;
   amtReceivedBgColor?: string;
   amtReceivedLabel?: string;
   amtWidth?:number;
   amtHeight?:number;

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
  customElements?:CustomElementType,
}

export const initialBacodeTemplateState = <T>(): ActionState<TemplateState<T>> => ({
// export const initialBacodeTemplateState: ActionState<TemplateState> = {
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
      orientation: "portrait",
      height: 300,
      width: 300,
      language_prefer: "Eng",
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      bg_color: "#FFFFFF",
    },
    barcodeState: {
      placedComponents: [],
      labelState: { columnsPerRow: 1, labelHeight: 200, labelWidth: 300, rowsPerPage: 1 }
    },
    headerState : {
    showLogo: false,
    logo: '',
    logoSize: 50,
    showOrgName: true,
    showOrgAddress: true,
    showDocTitle: true,
    docTitle: 'Document Title',
    docTitleUnderline: false,
    showBalanceDue: false,

    hasPhoneField: false,
    phoneLabel: 'Phone',

    hasfaxField: false,
    faxLabel: 'Fax',

    hasEmailField: false,
    emailLabel: 'Email',

    bgColor: '#ffffff',
    isFirstOnly: false,
    bg_image_header_position: 'center',
    bg_image_header_objectFit: 'cover',
    headerHeight: 100,
    showHeader: true,

    docTitleFontSize: 16,
    docTitleFontColor: '#000000',

    OrganizationFontSize: 14,
    OrganizationFontColor: '#000000',
    OrganizationPhone: '',
    OrganizationFax: '',
    show_balance_due: false,
    showStatusStamp: false,

    showReceivedFrom: false,
    receivedFromLabel: 'Received From',

    showVender: false,
    venderNameFontSize: 12,
    venderNameFontColor: '#000000',

    customerNameFontSize: 12,
    customerNameFontColor: '#000000',
    hasBillTo: false,
    billTo: '',
    hasShipTo: false,
    shipTo: '',

    orgNameFontSize: 14,
    orgNameFontColor: '#000000',

    showNumberField: false,
    numberField: 'Document Number',

    showReasonField: false,
    reasonLabel: 'Reason',
    showAccountField: false,
    accountLabel: 'Account',
    showAdjTypeField: false,
    adjTypeLabel: 'Adjustment Type',
    showCreateUserField: false,
    createUserLabel: 'Created By',
    showBranchField: false,
    branchLabel: 'Branch',

    showNotesLabel: false,
    notesLabel: 'Notes',
    showAmount: false,
    amountLabel: 'Amount',

    showDateField: false,
    dateField: 'Date',

    showTerms: false,
    terms: '',

    showDueDate: false,
    due_date: 'Due Date',

    showReference: false,
    reference: '',

    showSalesPerson: false,
    salesPerson: '',

    showProject: false,
    project: '',

    showEWayBill: false,
    eWayBill: '',

    showPlaceOfSupply: false,
    placeOfSupply: '',

    showSubject: false,
    subject: '',

    showTransactionType: false,
    transactionType: '',

    showSupplyDate: false,
    supplyDate: '',

    showShipmentDate: false,
    shipmentDateLabel: 'Shipment Date',

    showAssociatedInvNo: false,
    showAssociatedInvDate: false,

    recieptInfo: {
        showReceiptTable: false,
        showReceiptNumber: false,
        receiptNumberLabel: 'Receipt Number',
        showReceiptDate: false,
        receiptDateLabel: 'Receipt Date',
        showReceiptReference: false,
        receiptReferenceLabel: 'Reference',
        showReceiptMode: false,
        receiptModeLabel: 'Payment Mode',
        showReceiptAmount: false,
        receiptAmountLabel: 'Amount',
        amtReceivedLabel: 'Amount Received',
        currencySymbolPosition: 'before',
        amtReceivedFontSize: 12,
        amtReceivedFontColor: '#000000',
        amtReceivedBgColor: '#ffffff',
    },

    accountSummary: {
        showAccountSummary: false,
        accountSummaryLabel: 'Account Summary',
        showOpeningBalance: false,
        openingBalanceLabel: 'Opening Balance',
        showInvoicedAmount: false,
        invoicedAmountLabel: 'Invoiced Amount',
        showAmountPaid: false,
        amountPaidLabel: 'Amount Paid',
        showBalanceDue: false,
        balanceDueLabel: 'Balance Due',
    },

    accountTransactionInfo: {},
    adviceTransInfo: {},

    customElements: { height: 0, elements: [] ,thumbImage:""},

    }
  },
});
