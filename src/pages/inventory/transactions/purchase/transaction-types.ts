import moment from "moment";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { inputBox } from "../../../../redux/slices/app/types";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";
import { initialFormElements } from "./transaction-type-data";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";

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
  // master3: TransactionMaster3;
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
  // master3: TransactionMaster3Validations;
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
  grandTotalFc: number;
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
  lb: boolean;//new
  hasCashPaid: boolean;//new
  hasroundOff: boolean;//new
  cashPaid: number;//new
  supplyType: string;//new
  other: TransactionMaster3;
  labelDesignID:number;
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
  pCode: string;
  mrp: number;
  barCode: string;
  productBatchID: number;
  product: string;
  productID: number;
  brand: string;
  brandID: number;
  qty: number;
  free: number;
  unit: string;
  unitID: number;
  unitPrice: number;
  gross: number;
  discPerc: number;
  discount: number;
  netValue: number;
  total: number;
  stock: number;
  manualBarcode: string;
  stockDetails: string;
  margin: number;
  salesPrice: number;
  lpr: number;
  lpc: number;
  stickerQty: number;
  profit: number;
  size: string;
  vatPerc: number;
  vatAmount: number;
  cst: number;
  cstPerc: number;
  cost: number;
  batchNo: string;
  mfdDate: string; // or Date
  expDate: string; // or Date
  expDays: number;
  bd: string;
  btnPrintBarcode: string;
  barcodePrinted: boolean;
  batchCreated: boolean;
  removeCol: boolean;
  productDescription: string;
  serial: string;
  minSalePrice: number;
  additionalExpense: number;
  unitPriceFC: number;
  colour: string;
  warranty: string;
  nosQty: number;
  totalAddExpense: number;
  grossConvert: number;
  grossFC: number;
  unitID2: number;
  unit2Qty: number;
  unit2SalesRate: number;
  unit2MRP: number;
  unit2MBarcode: string;
  unit2StickerQty: number;
  unitID3: number;
  unit3Qty: number;
  unit3SalesRate: number;
  unit3MRP: number;
  unit3MBarcode: string;
  unit3StickerQty: number;
  tagQty: number;
  barcodeTagPrinted: boolean;
  barcodeUnit2Printed: boolean;
  barcodeUnit3Printed: boolean;
  location: string;
  grTransDetailsID: number;
  arabicName: string;
  supplierReferenceProductCode: string;
  poTransDetailsID: number;
  ratePlusTax: number;
  warehouseID: number;
  sortOrder: number;
  profitPercentage: number;
  schemeDiscount: number;
  memo: string;
  memoEditor: string;
  rowNumber: number;
  actualSalesPrice: number;
  unit2: string;
  unit3: string;
  btnPrintBarcodeStd: string;

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
  useBarcode?: boolean;
  resizeGrid?: boolean;
  showProductInfoPopup?: boolean;
  showPurchaserOnly?: boolean;
  useSupplierProductCode?: boolean;
  presetWarehouseId?: number;
  counterWiseWarehouseId?: number;
  enableItemCodeSearchInNameColumn?: boolean;
  holdSameCode?: boolean;
  printPreview?: boolean;
  dummyProducts?: boolean;
  duplicationMessage?: boolean;
  setDefaultQuantity?: boolean;
}

export type FormElementsState = {
  [key in keyof typeof initialFormElements]: FormElementState;
};
export interface LoadData {
  formType?: string;
  vPrefix?: string;
  vNumber?: string;}
export interface TransactionFormState {
  store: any;
  formCode: string; 
  userRightsFormCode: string; 
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
  inSearch:boolean;
  enableTaxNumber: boolean
  tmpVoucherNo?: number
  dummyCode?: any
  remarks?: string;
  lb?: boolean;
  autoCalculation?: boolean;
  priceCategory: string;
  netTotal: number;
  netAmount: number;
  loadData: LoadData;
  isProductSummaryOpen: boolean;
  isPartyWiseSummaryOpen: boolean;
  selectedRow?: TransactionDetail;
  gridColumns?: DevGridColumn[];
  
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