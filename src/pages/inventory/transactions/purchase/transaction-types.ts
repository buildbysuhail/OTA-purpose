import moment from "moment";
import { Dispatch } from "react";
import { AnyAction, DeepPartial } from "redux";
import { inputBox } from "../../../../redux/slices/app/types";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";
import { initialFormElements } from "./transaction-type-data";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { SummaryConfig } from "../../../../components/ERPComponents/erp-purchase-grid/dataGrid";
import { PrintResponse } from "../../../use-print-type";

// primitives we don't recurse into
type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;

// treat only plain objects as nestable
type IsPlainObject<T> =
  T extends Primitive ? false :
  T extends Function ? false :
  T extends readonly any[] ? false :
  T extends object ? true : false;

// leaf-only dot keys: "a" | "b.c" | "b.d.e" (no "b")
type Prev = [never, 0, 1, 2]; // allows depth up to 5

type LeafDotKeys<T, D extends number = 5> =
  [D] extends [never] ? never :
  {
    [K in Extract<keyof T, string>]:
    NonNullable<T[K]> extends object
    ? `${K}` | `${K}.${LeafDotKeys<NonNullable<T[K]>, Prev[D]>}`
    : `${K}`;
  }[Extract<keyof T, string>];

export type TransactionDetailKeys = LeafDotKeys<TransactionDetail>;
export type PrintResponseKeys = LeafDotKeys<PrintResponse>;
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
  transactionMasterID?: number;
  financialYearID?: number;
  isTeller?: boolean | false;
  // localInputBox?: inputBox;
}

export interface TransactionData {
  master: TransactionMaster;
  masterValidations?: TransactionValidationsData;
  details: TransactionDetail[];
  invAccTransactions: InvAccTransaction[];
  attachments: any[]
}

export interface InvAccTransaction {
  invTransAccountsID: number;
  invTransactionMasterID: number;
  ledgerID: number;
  debit: number;
  credit: number;
  remarks: string;
  ledgerName: string;
  amount: number;
  amountFC: number;
  isIncome: boolean;
  slNo: number;
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
  progress: number;
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
  invTransactionMasterID: number;
  branchID: number;
  financialYearID: number;
  counterID: number;
  employeeID: number;
  createdUserID: number;
  inventoryLedgerID: number; // cbDebitLedger
  ledgerID: number;
  partyName: string;
  displayName: string;
  referalAgentID: number;
  tableId: number;
  seatNumber: string;
  tokenNumber: string;
  kotMasterID: number;
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
  toWarehouseID: number;
  voucherType: string;
  voucherForm: string;
  orderNumber?: number;
  gRNMasterID: number;
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
  vehicleID: number;
  driverID: number;
  salesManID: number;
  deliveryManID: number;
  totalGross: number;
  totalDiscount: number;
  billDiscount: number;
  grandTotal: number;
  grandTotalFc?: number;
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
  counterShiftID: number;
  priceCategoryID: number;
  refBranchID: number;
  refInvTransactionMasterID: number;
  isPosted: boolean;
  privCardID: number;
  privAddAmount: number;
  privRedeem: number;
  orderCardNo: number;
  isInvoiced: boolean;
  mannualInvoiceNumber: string;
  inout: string;
  cashAmt: number;
  bankAmt: number;
  creditAmt: number;
  currencyID: number;
  exchangeRate: number;
  costCentreID: number;
  cashrOrCredit: string;
  couponAmt: number;
  projectID: number;
  customerType: string;
  taxOnDiscount: number;
  draftTransactionMasterID: number;
  randomKey: number;
  tableNo: string;
  employeeName: string;
  deliveryMan: string;
  pdtVerified: string;
  pdtRemarks: string;
  counterName: string;
  particulars: string; //new
  lb: boolean; //new
  hasCashPaid: boolean; //new
  hasroundOff: boolean; //new
  supplyType: string; //new
  labelDesignID: number;
  prevTransDate: string;
  oldLedgerID: number;
  dueDays: number;
  billWiseString: string;
  accTransactionDetailIDForBillwise: number;
  master2: TransactionMaster2
  master3: TransactionMaster3
}

export interface TransactionMaster3 {
  invTransactionMasterID: number;
  branchID: number;
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
export interface TransactionMaster2 {
  invTransactionMasterID: number;
  creditCardDetails: string;
  cashTip: number;
  cardTip: number;
  notes1: string;
  notes2: string;
}
export interface TransactionMaster3Validations { }
export interface TransactionMasterValidations { }
export interface CommonParams {
  result: DeepPartial<TransactionFormState>;
  formStateHandleFieldChangeKeysOnly?: any;
}

export interface TransactionDetail {
  invTransactionDetailID?: number;
  slNo: string;
  pCode: string;
  mrp: number;
  barCode: string;
  productBatchID: number;
  product: string;
  productID: number;
  brand: string;
  brandID: number;
  qty: number;
  qtyTag?: number;
  free: number;
  multiFactor: number;
  unit: string;
  unitID: number;
  unitDecimalPoint: number;
  unitPrice: number;
  unitPriceTag: number;
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
  lpr: number;//LastPurchaseRate
  lpc: number;//lastPurchaseCost
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
  actionCol: boolean;
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
  grTransDetailsIDTag?: number;
  arabicName: string;
  supplierReferenceProductCode: string;
  poTransDetailsID: number;
  poTransDetailsIDTag: number;
  ratePlusTax: number;
  warehouseID: number;
  warehouseName: string;
  sortOrder: number;
  profitPercentage: number;
  schemeDiscount: number;
  moreDetails: TransactionDetailsMore;
  memoEditor: string;
  rowNumber: number;
  actualSalesPrice: number;
  unit2: string;
  unit3: string;
  btnPrintBarcodeStd: string;
  isValid?: boolean;
  hsnCode: string;
  details2?: TransactionDetails2;
  gRTransDetailID: number;
  pOTransDetailID: number;
  pO_PITransDetailIDs: number;
  pO_PITransDetailQtys: number;
}

export interface TransactionDetailsMore {
  memo?: string
}
export interface TransactionDetails2 {
  invTransactionDetailID: number;
  branchID: number;
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
  presetCostenterId?: number;
  counterAssignedCashLedgerId?: number;
  outerPageBg?: string;
  innerPageBg?: string;
  inputBoxStyle?: inputBox;
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
  duplicationMessage?: boolean;
  setDefaultQuantity?: boolean;
  useInSearch?: boolean;
  useCodeSearch?: boolean;
  gridFontSize?: number;
  gridIsBold?: boolean;
  gridRowHeight?: number;
  gridBorderColor?: string;
  gridHeaderBg?: string;
  footerPosition?: "bottom" | "right";
  gridHeaderFontColor?: string;
  gridBorderRadius?: number;
  barCodePrev?: boolean;
  footerBg?: string;
  showColumnBorder?: boolean;
  activeRowBg?: string;
  useNewFooter?: boolean;
  themeName?: string;
  gridHeaderRowHeight?: number;
  gridFooterBg?: string;
  gridFooterFontColor?: string;
  enableVoucherPrefix?: boolean;
}

export type FormElementsState = {
  [key in keyof typeof initialFormElements]: FormElementState;
};

export interface LoadData {
  formType?: string;
  vPrefix?: string;
  vNumber?: string;
}

export interface SummaryItems {
  qty: number;
  gross: number;
  netValue: number;
  discount: number;
  vatAmount: number;
  cst: number;
  total: number;
  profit: number;
  grossFc: number;
  totalAddExpense: number;
  nosQty: number;
  pCode: string;
  barCode: string;
  margin: number;
  salesPrice: string;
  cgst: number;
  sgst: number;
  igst: number;
  cessAmt: number;
  additionalCess: number;
}

export interface ProductDisplayDto {
  image: string;
  productName: string;
  productCode: string;
  groupName: string;
  productCategoryName: string;
  unitName: string;
  stockMin: string;
  stockMax: string;
  itemType: string;
  mfgDate: string;
  expiryDate: string;
  batchNo: string;
  warehouseName: string;
  brandName: string;
  autoBarcode: string;
  stdSalesPrice: string;
  stdPurchasePrice: string;
  stock: string;
  minSalePrice: string;
}

export interface TransactionFormState {
  store: any;
  formCode: string;
  userRightsFormCode: string;
  isEntryControl: boolean;
  isEdit: boolean;
  isRowEdit: boolean;
  ledgerDataLoading: boolean;
  saving: boolean;
  savingCompleted?: boolean;
  ledgerBalanceLoading: boolean;
  ledgerBalance: number;
  ledgerData: any;
  groupName: any;
  dtLedgerCodes: any[];
  summary: SummaryItems;
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
  printOnSave: boolean;
  printPreview: boolean;
  printCheque: boolean;
  amountInWords: string;
  template?: any;
  templates?: [];
  templatesData?: TemplateState<TransactionDetail>[];
  userConfig?: UserConfig;
  formElements: FormElementsState;
  openUnsavedPrompt?: boolean;
  foreignCurrency: boolean;
  enableDebitAccount: boolean;
  inSearch: boolean;
  enableTaxNumber: boolean;
  tmpVoucherNo?: number;
  dummyCode?: any;
  dummyProducts?: boolean;
  remarks?: string;
  prevTransactionDate?: string;
  lb?: boolean;
  autoCalculation?: boolean;
  priceCategory: string;
  netTotal: number;
  netAmount: number;
  loadData: LoadData;
  isProductSummaryOpen: boolean;
  isPartyWiseSummaryOpen: boolean;
  isFormStateDetailOpen?: boolean;
  selectedRow?: TransactionDetail;
  gridColumns: ColumnModel[];
  isPostedTransaction: boolean;
  isInv: boolean;
  summaryConfig: SummaryConfig<TransactionDetail>[];
  showQuantityFactors: { visible: boolean; rowIndex: number };
  showPcode: boolean;
  batchEntryData: { visible: boolean; data: string; rowIndex: number };
  serialNoEntryData: { visible: boolean; data: string; rowIndex: number };
  batchSelectionData: string;
  popupSearchSelectionData: string;
  quantityFactorData: string;
  currentCell?: CurrentCell;
  batchesUnits?: UnitByBatchDetailsDto[];
  productInfo: boolean;
  ShowProductBatchUnitDetails: boolean;
  showProductInformation?: { show: boolean; index: number };
  barcodeTemplate?: any;
  barcodeData?: any;
  barcodePrevOpen?: boolean;
  ledgerDetails: boolean;
  loading?: loadingResult;
  dataWarranty: [];
  dataBrands: [];
  headerMorePop: boolean;
  showGridTheme: boolean;
  // stockUpdate: boolean;
  batchGridShowKey?: number;
  orderStatus?: string;
  selectedTheme?: any
  currentTheme?: any
  themeChangeCountdown?: number
  isInitialLedger?: boolean;
  memoEditor: { visible: boolean; data: string; rowIndex: number };
  headerMenuOpen: boolean;
  documentModal: boolean;
  pendingOrdListMasterIDs?: string;
  pendingOrdListBranchIDs?: string;
  gridMenuOpen: boolean;
  billwiseData?: BillwiseData[];
  billwiseDrCr?: string;
  billwiseDetails?: string;
  showbillwise?: boolean;
  ledgerBillWiseLoading?: boolean;
}
interface loadingResult {
  isLoading: boolean;
  text: string;
}
export interface CurrentCell {
  reCenterRow?: boolean
  column: string;
  rowIndex: number;
  data: TransactionDetail;
}
export type PartialTransactionFormFields = {
  [K in keyof TransactionFormState]?: TransactionFormState[K];
};
export interface ColumnModel {
  dataField?: string;
  decimalPoint?: number;
  formStateOptionKey?: string;
  cssClass?: string;
  caption?: string;
  dataType?: "string" | "number" | "cb" | "date" | "boolean" | any;
  allowEditing?: boolean;
  alignment?: "center" | "left" | "right";
  format?: string;
  visible?: boolean;
  isLocked?: boolean;
  width?: number;
  readOnly?: boolean;
  idField?: string; //for cb
  field?: { valueKey: string; labelKey: string };
  cellRender?: (
    cellElement: any,
    cellInfo: any,
    filter?: any,
    pdfCell?: any
  ) => any;
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

export interface GridQtyFactors {
  id: string;
  slNo: number;
  width: number;
  height: number;
  nos: number;
  total: number;
}

export interface LoadProductDetailsByAutoBarcodeProps {
  detail: TransactionDetail;
  productBatchID: number;
  autoBarcode: string;
  productCode: string;
  useProductCode: boolean;
  searchText: string;
  searchColumn: string;
  rowIndex: number;
  setFocusToNextColumn: boolean;
}

interface ProductBatchDetailsForAutoBarcodeData {
  serialNumber: string;
  productCode: string;
  productName: string;
  commodityCode: string;
  basicUnitID: number;
  unitName: string;
  taxCategoryID: number;
  productCategoryID: number;
  productGroupID: number;
  autoBarcode: string;
  manualBarcode: string;
  mfgDate?: string;
  expiryDate?: string;
  batchNo: string;
  productID: number;
  stdSalesPrice: number;
  stdPurchasePrice: number;
  mrp: number;
  modelNumber: string;
  specification: string;
  brandID: number;
  brandName: string;
  upcCode: string;
  partNumber: string;
  margingPerc: number;
  stock: number;
  sVatPerc: number;
  pVatPerc: number;
  salesExciseTaxPerc: number;
  purchaseExciseTaxPerc: number;
  productBatchID: number;
  lastPurchaseCost: number;
  lastPurchaseRate: number;
  stockMax: number;
  minSalePrice: number;
  groupBarCode: string;
  warranty: string;
  colour: string;
  defPurchaseUnitID: number;
  unit2: string;
  unit2ID?: number;
  unit2Qty?: number;
  unit2SalesPrice?: number;
  unit2Barcode: string;
  unit2MRP?: number;
  unit2MinSalesRate?: number;
  unit3: string;
  unit3ID?: number;
  unit3Qty?: number;
  unit3SalesPrice?: number;
  unit3Barcode: string;
  unit3MRP?: number;
  unit3MinSalesRate?: number;
  itemType: string;
  location: string;
  itemNameinSecondLanguage: string;
  p_SGSTPerc: number;
  p_CGSTPerc: number;
  p_IGSTPerc: number;
  p_CessPerc: number;
  p_AdditionalCessPerc: number;
  p_CalamityCessPerc: number;
  hsnCode: string;
  // new fields
  supplierReferenceProductCode: string;
  stockDetails: string;
  actualSalesPrice: number;
  listedProductPrice: number;
  hasListedProductPrice: boolean;
  defUnitName: string;
  multiFactor: number;
  defUnitMultiFactor: number;
  isUnit2BarCode: boolean;
  isUnit3BarCode: boolean;
  isBasicUnitBarcode: boolean;
  isMultiUnitBarCode: boolean;
  stickerQty: number;
  units: UnitByBatchDetailsDto[];
}

export interface DataAutoBarcode {
  products: ProductBatchDetailsForAutoBarcodeData[];
  productId: number;
  units: UnitByBatchDetailsDto[];
  isShowItemPopUp: boolean;
}
export interface BarcodeLabel {
  labelCount: number;
  productCode: string;
  productName: string;
  arabicName: string;
  salesPrice: string;
  salesPrice2: string;
  salesPrice3: string;
  cost: string;
  autoBarcode: string;
  manualBarcode: string;
  costCode: string;
  note1: string;
  note2: string;
  note3: string;
  note4: string;
  unit: string;
  unitRemarks: string;
  unit1Remarks: string;
  unit2Remarks: string;
  unit3Remarks: string;
  qty: string;
  salesPriceWithVAT: string;
  salesPrice2WithVAT: string;
  salesPrice3WithVAT: string;
  batchNo: string;
  expiryDate: string;
  partNumber: string;
  mfdDate: string;
  packingDate: string;
  warrantyPeriod: string;
  expiryDays: string;
  brand: string;
  groupName: string;
  specification: string;
  itemAliasName: string;
  unit2: string;
  unit2SalesPrice: string;
  unit3: string;
  unit3SalesPrice: string;
  partyCode: string;
  productDescription: string;
  voucherNo: string;
  transDate: string;
  siNo: string;
  size: string;
  productId: number;
  invQty: number;
  isCalculate: boolean;
  reQty: number;
  vatPerc: number;
  pPrice: number;
  mrp: number;
  msp: number;
  sPrice: number;
  showPreview: boolean;
  pluCode: string;
}
export enum EmployeeType {
  All = "All",
  Purchaser = "PUR",
  SalesMan = "SMAN",
  Receipt = "RPT",
  Purchaser_SalesMan = "PURSMAN",
  Purchaser_Receipt = "PURRPT",
  SalesMan_Receipt = "SMANRPT",
  Accountant = "ACCT",
  Driver = "DV",
  Deliveryman = "DMAN",
}
export interface ExcelRowData {
  Barcode: string;
  Quantity: number;
  Disc_per?: number;
  Discount?: number;
  MRP?: number;
  SalesPrice: number;
  PurchasePrice: number;
  PartyName?: string;
}
export interface UnitByBatchDetailsDto {
  unitCode?: string;
  productBatchID?: number; // C# long -> TS number
  value?: number;
  label?: string;
  multiFactor?: string;
  unitDescription?: string;
  decimalPoints?: number;
}
export interface BillwiseData {
  accTransactionDetailID: number;
  adjustedAmount: number;
  amount: number;
  balance: number;
  balanceAfter: number;
  billWiseMasterID: number;
  billwiseAmount: number;
  drCr: "Dr" | "Cr"; // Enum-like string values for debit or credit
  financialYearID: number;
  formType: string;
  ledgerID: number;
  partyName: string;
  referenceDate: string; // ISO date string
  referenceNumber: string;
  slNo: number;
  transactionDate: string; // ISO date string
  voucherNumber: number;
  voucherPrefix: string;
  voucherType: string;
}
