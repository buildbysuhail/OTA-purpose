import moment from "moment";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { inputBox } from "../../../../redux/slices/app/types";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";

// Transaction interface
export interface TransactionProps {
  voucherType?: string;
  transactionType?: string;
  formCode?: string;
  voucherPrefix?: string;
  formType?: string;
  title?: string;
  drCr?: string;
  voucherNo?: number;
  transactionMasterID?: number,
  financialYearID?: number,
  isTeller?: boolean | false,
}
export interface TransactionData {
  master: TransactionMaster;
  master3: TransactionMaster3;
  masterValidations?: TransactionValidationsData;
  details: TransactionDetail[];
  attachments: any[];
}
export interface Attachments {
  id?: string;
  key: string;
  name: string;
  size: number;
  aType: "url" | "file" | "base64";
  type: string;
  isNew: boolean;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
  progress: number
}
export interface TransactionValidationsData {
  master: TransactionMasterValidations;
  master3: TransactionMaster3Validations;
  details: TransactionDetail[];
  attachments: Attachments[];
}

export interface FormElementState {
  visible: boolean;
  disabled: boolean;
  label: string;
  reload?: boolean;
  accLedgerType?: number;
  [key: string]: any;
}

export interface TransactionMaster {
  invTransactionMasterId: number;
  branchId: number;
  financialYearId: number;
  counterId: number;
  employeeID: number;
  createdUserId: number;
  inventoryLedgerID: number; // cbDebitLedger
  ledgerID: number;
  partyName: string;
  referalAgentId: number;
  tableId: number;
  seatNumber: string;
  tokenNumber: string;
  kotMasterId: number;
  noOfGuests: number;
  deviceCode: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  voucherPrefix: string;
  voucherNumber: number;
  transactionDate: string;
  remarks: string;
  fromWarehouseID: number;
  toWarehouseId: number;
  voucherType: string;
  voucherForm: string;
  orderNumber: number;
  orderDate: string;
  quotationNumber: string;
  quotationDate: string;
  dueDate: string;
  deliveryNoteNumber: string;
  deliveryDate: string;
  purchaseInvoiceNumber: string;
  purchaseInvoiceDate: string;
  despatchDocumentNumber: string;
  despatchDate: string;
  vehicleId: number;
  driverId: number;
  salesManId: number;
  deliveryManId: number;
  totalGross: number;
  totalDiscount: number;
  billDiscount: number;
  grandTotal: number;
  totalProfit: number;
  roundAmount: number;
  cashReceived: number;
  cashReturned: number;
  srAmount: number;
  salesManIncentive: number;
  advanceAmt: number;
  shortageAmount: number;
  adjustmentAmount: number;
  stockUpdate: boolean;
  accUpdate: boolean;
  gatePassNo: string;
  vatAmount: number;
  isLocked: boolean;
  counterShiftId: number;
  priceCategoryID: number;
  refBranchId: number;
  refInvTransactionMasterId: number;
  isPosted: boolean;
  privCardId: number;
  privAddAmount: number;
  privRedeem: number;
  orderCardNo: number;
  isInvoiced: boolean;
  mannualInvoiceNumber: string;
  inout: string;
  cashAmt: number;
  bankAmt: number;
  creditAmt: number;
  currencyId: number;
  exchangeRate: number;
  costCentreID: number;
  cashrOrCredit: string;
  couponAmt: number;
  projectID: number;
  customerType: string;
  taxOnDiscount: number;
  draftTransactionMasterId: number;
  randomKey: number;
  tableNo: string;
  employeeName: string;
  deliveryMan: string;
  pdtVerified: string;
  pdtRemarks: string;
  counterName: string;
  creditCardDetails: string;
  cashTip: number;
  cardTip: number;
  notes1: string;
  notes2: string;
  referenceDate: string; //new
  referenceNumber: string; //new
  particulars: string;//new
}
export interface TransactionMaster3 {
  invTransactionMasterId: number; 
  branchId: number; 
  totSchemeDiscount: number; 
  totSGST: number; 
  totCGST: number; 
  totIGST: number; 
  totCess: number; 
  totAdditionalCess: number; 
  totCalamityCess: number; 
  totTCS: number; 
  totTDS: number; 
  shipLegalName: string;
  shipTradeName: string;
  shipGstIn: string; 
  shipPinCode: number; 
  shipAddress1: string; 
  shipAddress2: string; 
  shipLocation: string; 
  shipStateCode: number;
}

export interface TransactionMaster3Validations {

}
export interface TransactionMasterValidations {
  
}
export interface TransactionDetail {
  slNo: number; 
  invTransactionDetailId: number; 
  branchId: number; 
  invTransactionMasterId: number; 
  productId: number; 
  productBatchId: number; 
  productDescription: string; 
  quantity: number; 
  free: number; 
  qtyInNumbers: number; 
  unitId: number; 
  totalQty: number; 
  barcodeQty: number; 
  unitPrice: number; 
  valuationPrice: number; 
  rateWithTax: number; 
  grossValue: number; 
  vatPercentage: number; 
  totalVatAmount: number; 
  discountPer1: number; 
  discountAmt1: number; 
  totalDiscount: number; 
  netValue: number; 
  netAmount: number; 
  costPerItem: number; 
  totalProfit: number; 
  marginPer: number; 
  marginAmt: number; 
  stdSalesPrice: number; 
  mrp: number; 
  invStatus: string; 
  salesManId: number; 
  modelNo: string; 
  specification: string; 
  color: string; 
  qtyIn: number; 
  qtyOut: number; 
  qtyNOsIn: number; 
  qtyNosOut: number; 
  voucherType: string; 
  wareHouseId: number; 
  fromWarehouseID: number; 
  toWarehouseId: number; 
  cstPerc: number; 
  cst: number; 
  supplierLedgerId: number; 
  transDate: string; 
  updateStdPurchasePrice: boolean; 
  additionalExpense: number; 
  xRate: number; 
  adjQty: number; 
  updateStdPurchasePriceWithCost: boolean; 
  updateStdPurchasePriceWithAvg: boolean; 
  supplierProductRefCode: string; 
  updateModifiedDate: boolean; 
  randomKey: number; 

  warranty: string; 
  brandId: number; 
  brandName: string; 
  batchNo: string; 
  location: string; 
  lastPurchaseCost: number; 
  stock: number; 
  hsnCode: string; 
  stdPurchasePrice: number; 
  multiFactor: number; 
  minSalePrice: number; 
  supplierReferenceProductCode: string; 
  other: TransactionDetails2;
}
export interface TransactionDetails2 {
  invTransactionDetailId: number;
  branchId: number;
  cessPerc: number;
  cessAmt: number; 
  sgstPerc: number; 
  sgst: number; 
  cgstPerc: number; 
  cgst: number; 
  igstPerc: number; 
  igst: number;
  calamityCessPerc: number; 
  calamityCess: number; 
  additionalCessPerc: number; 
  additionalCess: number;
}
export const initialTransactionDetailData: TransactionDetail = {
  invTransactionDetailId: 0,
  branchId: 0,
  invTransactionMasterId: 0,
  productId: 0,
  productBatchId: 0,
  productDescription: "",
  quantity: 0,
  free: 0,
  qtyInNumbers: 0,
  unitId: 0,
  totalQty: 0,
  barcodeQty: 0,
  unitPrice: 0,
  valuationPrice: 0,
  rateWithTax: 0,
  grossValue: 0,
  vatPercentage: 0,
  totalVatAmount: 0,
  discountPer1: 0,
  discountAmt1: 0,
  totalDiscount: 0,
  netValue: 0,
  netAmount: 0,
  costPerItem: 0,
  totalProfit: 0,
  marginPer: 0,
  marginAmt: 0,
  stdSalesPrice: 0,
  mrp: 0,
  invStatus: "",
  salesManId: 0,
  modelNo: "",
  specification: "",
  color: "",
  qtyIn: 0,
  qtyOut: 0,
  qtyNOsIn: 0,
  qtyNosOut: 0,
  voucherType: "",
  wareHouseId: 0,
  fromWarehouseID: 0,
  toWarehouseId: 0,
  cstPerc: 0,
  cst: 0,
  supplierLedgerId: 0,
  transDate: new Date().toISOString(), // Default to current date in ISO format
  updateStdPurchasePrice: false,
  additionalExpense: 0,
  xRate: 0,
  adjQty: 0,
  updateStdPurchasePriceWithCost: false,
  updateStdPurchasePriceWithAvg: false,
  supplierProductRefCode: "",
  updateModifiedDate: false,
  randomKey: 0,

  warranty: "",
  brandId: 0,
  brandName: "",
  batchNo: "",
  location: "",
  lastPurchaseCost: 0,
  stock: 0,
  hsnCode: "",
  stdPurchasePrice: 0,
  multiFactor: 0,
  minSalePrice: 0,
  supplierReferenceProductCode: "",
  other: {
    invTransactionDetailId: 0,
    branchId: 0,
    cessPerc: 0,
    cessAmt: 0,
    sgstPerc: 0,
    sgst: 0,
    cgstPerc: 0,
    cgst: 0,
    igstPerc: 0,
    igst: 0,
    calamityCessPerc: 0,
    calamityCess: 0,
    additionalCessPerc: 0,
    additionalCess: 0,
  },
  slNo: 0
};
// Initial object with default values
export const initialTransactionMasterValidations: TransactionValidationsData = {
  master: {},
  master3: {},
  details: [],
  attachments: []
};



export const TransactionMasterInitialData: TransactionMaster = {
  invTransactionMasterId: 0,
  branchId: 0,
  financialYearId: 0,
  counterId: 0,
  employeeID: 0,
  createdUserId: 0,
  inventoryLedgerID: 0,
  ledgerID: 0,
  partyName: "",
  referalAgentId: 0,
  tableId: 0,
  seatNumber: "",
  tokenNumber: "",
  kotMasterId: 0,
  noOfGuests: 0,
  deviceCode: "",
  address1: "",
  address2: "",
  address3: "",
  address4: "",
  voucherPrefix: "",
  voucherNumber: 0,
  transactionDate: new Date().toISOString(),
  remarks: "",
  fromWarehouseID: 0,
  toWarehouseId: 0,
  voucherType: "",
  voucherForm: "",
  orderNumber: 0,
  orderDate: new Date().toISOString(),
  quotationNumber: "",
  quotationDate: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  deliveryNoteNumber: "",
  deliveryDate: new Date().toISOString(),
  purchaseInvoiceNumber: "",
  purchaseInvoiceDate: new Date().toISOString(),
  despatchDocumentNumber: "",
  despatchDate: new Date().toISOString(),
  vehicleId: 0,
  driverId: 0,
  salesManId: 0,
  deliveryManId: 0,
  totalGross: 0,
  totalDiscount: 0,
  billDiscount: 0,
  grandTotal: 0,
  totalProfit: 0,
  roundAmount: 0,
  cashReceived: 0,
  cashReturned: 0,
  srAmount: 0,
  salesManIncentive: 0,
  advanceAmt: 0,
  shortageAmount: 0,
  adjustmentAmount: 0,
  stockUpdate: true,
  accUpdate: true,
  gatePassNo: "",
  vatAmount: 0,
  isLocked: false,
  counterShiftId: 0,
  priceCategoryID: 0,
  refBranchId: 0,
  refInvTransactionMasterId: 0,
  isPosted: true,
  privCardId: 0,
  privAddAmount: 0.0,
  privRedeem: 0.0,
  orderCardNo: 0,
  isInvoiced: true,
  mannualInvoiceNumber: "",
  inout: "IN",
  cashAmt: 0.0,
  bankAmt: 0.0,
  creditAmt: 0.0,
  currencyId: 1,
  exchangeRate: 1.0,
  costCentreID: 0,
  cashrOrCredit: "",
  couponAmt: 0.0,
  projectID: 0,
  customerType: "",
  taxOnDiscount: 0.0,
  draftTransactionMasterId: 0,
  randomKey: 0,
  tableNo: "",
  employeeName: "",
  deliveryMan: "",
  pdtVerified: "",
  pdtRemarks: "0",
  counterName: "",
  creditCardDetails: "",
  cashTip: 0.0,
  cardTip: 0.0,
  notes1: "",
  notes2: "",
  referenceDate: new Date().toISOString(),
  referenceNumber: "",
  particulars: ""
}
export const TransactionMaster3InitialData: TransactionMaster3 = {
  totSchemeDiscount: 0.0,
  totSGST: 0.0,
  totCGST: 0.0,
  totIGST: 0.0,
  totCess: 10.0,
  totAdditionalCess: 0.0,
  totCalamityCess: 0.0,
  totTCS: 0.0,
  totTDS: 0.0,
  shipLegalName: "",
  shipTradeName: "",
  shipGstIn: "",
  shipPinCode: 0,
  shipAddress1: "0",
  shipAddress2: "0",
  shipLocation: "0",
  shipStateCode: 0,
  invTransactionMasterId: 0,
  branchId: 0
}
export const transactionInitialData: TransactionData = {
  master: TransactionMasterInitialData,
  master3: TransactionMaster3InitialData,
  details: [],
  attachments: [],
  masterValidations: initialTransactionMasterValidations
};

export interface UserConfig {
  maxWidth?: any;
  gridMaxWidth?: any;
  gridHeight?: any;
  keepNarrationForJV?: boolean;
  clearDetailsAfterSaveAccounts?: boolean;
  mnuShowConfirmationForEditOnAccounts?: boolean;
  maximizeBillwiseScreenInitially?: boolean;
  alignment?: "left" | "center" | "right";
  presetCostenterId?: number
  counterAssignedCashLedgerId?: number
  outerPageBg?: string;
  innerPageBg?: string;
  inputBoxStyle?: inputBox
  isExpanded?: boolean;
}
export interface TransactionFormState {
  store: any;
  formCode: string; 
  isEntryControl: boolean; 
  isEdit: boolean; 
  isRowEdit: boolean; 
  ledgerDataLoading: boolean;
  saving: boolean;
  ledgerBalanceLoading: boolean;
  ledgerBalance: number;
  ledgerData: any;
  groupName: any;
  dtLedgerCodes: any[]; 
  showPartySelection: boolean;
  showSaveDialog: boolean;
  customerType: string; 
  isInvoker: boolean;
  title: string; 
  partyId?: string;
  prev: string;
  rowProcessing: boolean;
  transactionProcessing: boolean;
  transactionLoading: boolean;
  unlocking: boolean;
  transaction: TransactionData;
  transactionType: string;
  total: number;
  printOnSave: boolean
  printPreview: boolean
  printCheque: boolean
  amountInWords: string,
  template?: any,
  templates?: [],
  templatesData?: TemplateState[]
  userConfig?: UserConfig;
  formElements: FormElementsState
  openUnsavedPrompt?: boolean
  foreignCurrency: boolean
  enableDebitAccount: boolean
  enableTaxNumber: boolean
  tmpVoucherNo?: number
  dummyCode?: any
}
export const initialFormElements: { [key: string]: FormElementState } = {
  voucherPrefix: { visible: true, disabled: true, label: "prefix" },
  voucherNumber: { visible: true, disabled: false, label: "voucher_number" },
  voucherNumberUpDownBtns: { visible: true, disabled: false, label: "voucher_number" },
  btnDown: { visible: true, disabled: false, label: "" },
  transactionDate: {
    visible: true,
    disabled: false,
    label: "transaction_date",
  },
  referenceNumber: {
    visible: true,
    disabled: false,
    label: "reference_number",
  }, employee: { visible: true, disabled: false, label: "purchaser" },
  pnlMasters: { visible: true, disabled: false, label: "" },
  costCentreID: { visible: false, disabled: false, label: "cost_centre" },
  partyCode: { visible: true, disabled: false, label: "code" },
  ledgerID: { visible: true, disabled: false, label: "party" },
  invoiceValue: { visible: true, disabled: false, label: "invoice_value" },
  dxGrid: { visible: true, disabled: false, label: "" },
  referenceDate: { visible: true, disabled: false, label: "reference_date" },
  btnBarcode: { visible: true, disabled: false, label: "barcode" },
  btnDelete: { visible: true, disabled: true, label: "delete" },
  btnEdit: { visible: true, disabled: true, label: "edit" },
  btnError: { visible: false, disabled: false, label: "error" },
  btnGRNPrint: { visible: true, disabled: false, label: "grn_print" },
  btnPrint: { visible: true, disabled: false, label: "print" },
  btnProductSumary: { visible: true, disabled: false, label: "product_sumary" },
  btnSave: { visible: true, disabled: true, label: "save" },
  btnSet: { visible: false, disabled: false, label: "set" },
  btnSize: { visible: false, disabled: false, label: "size" },
  btnbrowse: { visible: true, disabled: true, label: "browse" },
  cbBrand: { visible: true, disabled: false, label: "brand" },
  cbColour: { visible: false, disabled: false, label: "color" },
  cbCostCentre: { visible: false, disabled: false, label: "cost_centre" },
  cbDummyCode: { visible: false, disabled: false, label: "dummy_code" },
  cbEmployee: { visible: true, disabled: false, label: "purchaser" },
  cbDebitAccount: { visible: true, disabled: false, label: "" },
  chkDebitAccount: { visible: true, disabled: false, label: "debit_account" },
  chkTaxNumber: { visible: true, disabled: false, label: "" },
  cbProject: { visible: true, disabled: false, label: "project" },
  cbWarehouse: { visible: false, disabled: false, label: "warehouse" },
  cbWarranty: { visible: false, disabled: false, label: "warranty" },
  chkDummyBillWithInventory: { visible: false, disabled: false, label: "dummy_bill_with_inventory" },
  chkIsLocked: { visible: false, disabled: false, label: "is_locked" },
  chkRound: { visible: true, disabled: false, label: "round" },
  chkSelectDebitAccount: { visible: true, disabled: true, label: "select_debit_account" },
  chkTemporaryVATNumber: { visible: true, disabled: false, label: "temporary_vat_number" },
  dgvInventory: { visible: true, disabled: false, label: "" },
  dgvProduct: { visible: true, disabled: false, label: "" },
  dgvProductBatches: { visible: true, disabled: false, label: "" },
  //editButton1: { visible: false, disabled: false, label: "editbutton1" },
  lblGrandTotalFC: { visible: true, disabled: false, label: "grand_total_fc" },
  lblPosted: { visible: false, disabled: false, label: "posted" },
  lblTotFC: { visible: false, disabled: false, label: "tot_fc" },
  lblWarehouse: { visible: false, disabled: false, label: "warehouse" },
  lblproductName: { visible: true, disabled: false, label: "product_name" },
  linklblpath: { visible: true, disabled: true, label: "path" },
  pnlAmountSummary: { visible: true, disabled: false, label: "amount_summary" },
  pnlBatch: { visible: false, disabled: false, label: "batch" },
  pnlBatchUnitDetails: { visible: false, disabled: false, label: "batch_unit_details" },
  pnlGRN: { visible: false, disabled: false, label: "grn" },
  pnlImport: { visible: true, disabled: false, label: "import" },
  pnlLoadVoucher: { visible: false, disabled: false, label: "load_voucher" },
  pnlMore: { visible: false, disabled: false, label: "more" },
  pnlProductBatches: { visible: false, disabled: false, label: "product_batches" },
  pnlProductInfo: { visible: false, disabled: false, label: "product_info" },
  pnlSearch: { visible: false, disabled: false, label: "search" },
  pnlSettings: { visible: false, disabled: false, label: "settings" },
  pnlSize: { visible: false, disabled: false, label: "size" },
 // productCombo: { visible: true, disabled: false, label: "product_combo" },
  progressBar1: { visible: false, disabled: false, label: "progressbar1" },
  //saveButton1: { visible: false, disabled: true, label: "save_button1" },
  txtData: { visible: false, disabled: false, label: "txt_data" },
  txtDespatchNo: { visible: true, disabled: false, label: "despatch_no" },
  txtFilePath: { visible: true, disabled: true, label: "file_path" },
  txtFindBarcode: { visible: false, disabled: false, label: "find_barcode" },
  printOnSave: { visible: false, disabled: false, label: "print_on_save" },
  lnkUnlockVoucher: { visible: false, disabled: false, label: "Unlock" },
  asasa: { visible: true, disabled: false, label: "dfdf" },
};
export type FormElementsState = {
  [key in keyof typeof initialFormElements]: FormElementState;
};
export const TransactionFormStateInitialData: TransactionFormState = {
  formCode: "",
  isEntryControl: false,
  isEdit: false,
  dtLedgerCodes: [],
  showSaveDialog: false,
  isInvoker: false,
  title: "",
  rowProcessing: false,
  transactionProcessing: false,
  transactionLoading: false,
  transaction: transactionInitialData,
  printOnSave: false,
  printPreview: false,
  printCheque: false,
  amountInWords: 'Zero Only',
  openUnsavedPrompt: false,
  userConfig: {
    clearDetailsAfterSaveAccounts: true,
    keepNarrationForJV: true,
    mnuShowConfirmationForEditOnAccounts: true,
    maximizeBillwiseScreenInitially: true,
    alignment: "center",
    presetCostenterId: 0,
    counterAssignedCashLedgerId: 0,
    maxWidth: "",
    outerPageBg: "",
    innerPageBg: "",
    inputBoxStyle: {
      inputStyle: "normal",
      inputSize: "sm",
      checkButtonInputSize: "sm",
      inputHeight: 0,
      fontSize: 14,
      fontWeight: 400,
      labelFontSize: 14,
      otherLabelFontSize: 14,
      inputBgColor: "255, 255, 255",
      borderColor: "128, 128, 128",
      buttonFocusBg: "89, 137, 232",
      selectColor: "255, 255, 255",
      fontColor: "128, 128, 128",
      labelColor: "128, 128, 128",
      borderFocus: "128, 128, 128",
      borderRadius: 4,
      adjustA: 0,
      adjustB: 0,
      adjustC: 0,
      adjustD: 0,
      marginTop: 8,
      marginBottom: 6,
      focusForeColor: "128, 128, 128",
      focusBgColor: "255, 255, 255",
      bold: true
    }
  },
  unlocking: false,
  total: 0,
  isRowEdit: false,
  // formElements: initialFormElements
  ledgerDataLoading: false,
  ledgerData: undefined,
  ledgerBalanceLoading: false,
  ledgerBalance: 0,
  groupName: undefined,
  formElements: initialFormElements,
  saving: false,
  store: undefined,
  templatesData: [],
  transactionType: "",
  prev: "",
  showPartySelection: false,
  customerType: "",
  partyId: "",
  foreignCurrency: false,
  enableDebitAccount: false,
  enableTaxNumber: false
}
export interface PrintTransProps {
  masterAccount: string;
  details: TransactionDetail[];
  voucherType: string;
  formType: string;
  vrPrefix: string;
  vrNumber: string;
  isPrintPreview: boolean;
}
export interface VoucherElementProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
}