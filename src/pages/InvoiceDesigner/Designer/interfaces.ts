import { TemplateGroupTypes } from "../constants/TemplateCategories";

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

type TemplateKindType = "standard" | "spreadsheet" | "premium" | "universal" | "retail";

export interface TemplateState {
  id?: string | number | undefined;
  thumbImage?: string;
  propertiesState?: PropertiesState;
  headerState?: HeaderState;
  itemTableState?: ItemTableState;
  totalState?: TotalState;
  footerState?: FooterState;
}

export interface PropertiesState {
  template_type?: TemplateTypes;
  template_kind?: TemplateKindType;
  template_group?: TemplateGroupTypes;

  templateName?: string;
  pageSize?: { label?: string; value?: string };
  orientation?: "portrait" | "landscape";
  // Martgins
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  /// background
  bg_color?: string;
  bg_image_position?: string;

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
