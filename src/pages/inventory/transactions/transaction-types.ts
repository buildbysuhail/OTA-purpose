import { Dispatch } from "react";
import { AnyAction, DeepPartial } from "redux";
import { inputBox } from "../../../redux/slices/app/types";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import { initialFormElements } from "./transaction-type-data";
import { SummaryConfig } from "../../../components/ERPComponents/erp-purchase-grid/dataGrid";
import { PrintResponse } from "../../use-print-type";
import { List } from "lodash";

// primitives we don't recurse into
type Primitive = string | number | boolean | bigint | symbol | undefined | Date;

// treat only plain objects as nestable
type IsPlainObject<T> =
  T extends Primitive ? false :
  T extends Function ? false :
  T extends readonly any[] ? false :
  T extends object ? true : false;

// leaf-only dot keys: "a" | "b.c" | "b.d.e" (no "b")
type Prev = [never, 0, 1, 2]; // allows depth up to 5

type LeafDotKeys<T, D extends number = 5> = [D] extends [never] ? never :
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
  isPos?: boolean | false;
  // localInputBox?: inputBox;
}

export interface TransactionData {
  master: TransactionMaster;
  masterValidations?: TransactionValidationsData;
  details: TransactionDetail[];
  invAccTransactions: InvAccTransaction[];
  attachments: any[];
  couponDetails: CouponDetails[]; // new
  privilegeCardDetails: PrivilegeCardDetails; //new
  bankCardDetails: SettlementDetails[]; //new
  uPIDetails: SettlementDetails[]; //new
  eInvoiceStatus?: string
  ewbStatus?: string
  postedTransactionLabel?: string
  hasApproved?: boolean
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
  quotationNumber: number;
  quotationDate: string;
  dueDate: string;
  deliveryNoteNumber: string;
  deliveryDate: string;
  refDate: string;
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
  master2: TransactionMaster2;
  master3: TransactionMaster3;
  lblSRAmount: string; //new
  totalTax?: number; //new
  advAmntFroSO: number;
  refInvTransactionMasterSOID: number;
  itemTaxDetails: any;
  taxableDetails: any;
  note1: string;
  note2: string;

  // stock
  stockCountPrefix?: string;
  stockCountVrNumber?: number;
  fType?: string;
  name?: string;
  address?: string;  // Check use the address1
  purInvNumber?: number;
  toBranchWarehouseID?: number; // for stock branch transfer
  itemLoadVoucherPrefix?: string;
  itemLoadVoucherNumber?: number;
  soTotalAdvance?: string;
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
  boxQty?: number;
  qtyTag?: number;
  schemeFreeQty?: number;
  free: number;
  multiFactor: number;
  unit: string;
  unitID: number;
  unitDecimalPoint: number;
  unitPrice: number;
  unitPriceTag: number;
  gross: number;
  discPerc: number;
  unitDiscount: number; //sales
  purchasePrice: number; //sales
  purchaseRate: number; //sales
  discount: number;
  netValue: number;
  total: number;
  stock: number;
  manualBarcode: string;
  stockDetails: string;
  margin: number;
  salesPrice: number;
  lpr: number; //LastPurchaseRate
  lpc: number; //lastPurchaseCost
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
  mfgDate: string; // or Date
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
  supplierID?: number;
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
  moreDetail: TransactionDetailsMore;
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
  netConvert?: string;
  customer_LSP?: number;
  nLA_StdSalesPrice?: number;
  refBranchID?: number;
  itemType?: string;
  image?: string;
  schemeType?: string;
  schemeID?: number;
  isSchemeItem?: string;
  schemeQtyLimit?: number;
  isSchemeProcessed?: string;

  isQtyFreezed: boolean; // new 
  memo: string; // new
  flavors: string; // new
  smCode: string; // new
  salesman: string; // new
  salesmanID: number; // new
  adjQty: number; // For SO,GD,SRV
  gatePass: string; // For SI india
  purchaseCost: number; // For SI india
  taxCategoryID: number; // For SI india
  productCategoryID: number; // For SI india

  // stock
  stockTo?: number;
  stockMax?: number;
  fromWhouseStock?: string;
  toWhouseStock?: string;
  salesTotal?: number;
}

export interface TransactionDetailsMore {
  memo?: string;
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
  presetPriceCategoryId?: number;
  counterAssignedCashLedgerId?: number;
  outerPageBg?: string;
  scrollbarColor?: string;
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
  editInNewTab?: boolean;
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
  printOnSave?: boolean;
  focusToQtyAfterBarcode?: boolean;
  // sales
  askConfirmationForRemoveItem?: boolean;
  allowExcessCashReceipt?: boolean;
  notSetDefaultCustomer?: boolean;
  discAmtReadOnly?: boolean;
  setDefaultCashReceived?: boolean;
  enableSalesMan?: boolean;
  qtyDecimalPoint?: number;
  roundOff?: boolean;
  qtyAfterBarcode?: boolean;
  clearDetailsAfterSave?: boolean;
  showPrintConfirmation?: boolean;
  showRateBeforeTax?: boolean;
  blockZeroFigureEntry?: boolean;
  holdSalesMan?: boolean;
  autoIncrementQty?: boolean;
  initialFocusToCustomer?: boolean;
  showSearchPopupWindowAutomatically?: boolean;
  enableVoucherPrefixAndDate?: boolean;
  showCustomersAfterSales?: boolean;
  UserSalesPriceForTransfer?: boolean;
  showSrInProductInfoPopup?: boolean;
  setDefaultCashPaid?: boolean;
  showProductInfoPopupForSq?: boolean;
  blockNonStockItemsSO?: boolean;
  stockOutConfirmation?: boolean;
  taxOnMRP?: boolean;
  taxOnFreeItem?: boolean;
  //india
  autoEwayBill?: boolean;
  disableEinvoice?: boolean;
  dummyBill?: boolean;

  // stock
  userSalesPriceForStockTransfer?: boolean;
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
  row?: TransactionDetail
  formCode: string;
  userRightsFormCode: string;
  isEntryControl: boolean;
  isEdit: boolean;
  isRowEdit: boolean;
  ledgerDataLoading: boolean;
  saving: boolean;
  savingCompleted?: boolean;
  deleting: boolean;
  deletingCompleted?: boolean;
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
  template23?: any;
  templatesas?: [];
  templatesDataas?: TemplateState<TransactionDetail>[];
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
  showQuantityFactors: { visible: boolean; rowIndex: number; qtyDesc: string };
  showQuantityFactorsM: { visible: boolean; rowIndex: number; qtyDesc: string };
  showPcode: boolean;
  batchEntryData: { visible: boolean; data: string; rowIndex: number };
  serialNoEntryData: { visible: boolean; data: string; rowIndex: number, productName: string };
  imfData: { visible: boolean, data: string, rowIndex: number, slNo: number },
  batchSelectionData: string;
  popupSearchSelectionData: string;
  quantityFactorData: string;
  quantityFactorDataM: string;
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
  selectedTheme?: any;
  currentTheme?: any;
  themeChangeCountdown?: number;
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
  ledgerBillWiseSaving?: boolean;
  tenderOpen?: boolean;
  templateChooserModal?: boolean;
  srOpen?: boolean;
  vatChecked?: boolean;
  message?: string;

  //Sales
  privilegeCardOpen?: boolean;
  schemeDiscount: number;
  postCashMasterId: number;
  randomKey: number;
  allowStockUpdate: boolean;
  isAccUpdate: boolean;
  isEditBill: boolean;
  pnlVisibleCnt: number;
  accTransMasterId: number;
  invTransMasterId: number;
  srVoucherNumber: string;
  srVoucherPrefix: string;
  srFormType: string;
  prevTransDate?: Date;
  giftClaimed: boolean;
  giftBatchId: number;
  giftProductQty: number;
  giftProductPrice: number;
  creditStopped: boolean;
  obParent?: any; // frmSalesInvoices reference
  obChild?: any;
  giftProductBatchId: number;
  giftModels: GiftModel[];
  isInvokingTrans: boolean;
  isSaveClicked: boolean;
  partyAccTransDetailId: number;
  partyCashRcvdTransDetailId: number;
  partyBankRcvdTransDetailId: number;
  defaultPriceCategoryId: number;
  oldLedgerId: number;
  privilegeCardId: number;
  dsBillWiseTrans: any;
  constructorFlag: boolean;
  dtTemp: any;
  closeAfterSave: boolean;
  address2: string;
  address3: string;
  showPrintConfirmation: boolean;
  previousGrandTotal: number;
  oldPartyLedId: number;
  sbCashReceived: number;
  sbBillDiscount: number;
  isSalesBookingLoaded: boolean;
  isAuthorized: boolean;
  itemSearch: boolean;
  oldQuoteVatPercentage: number;
  isWindowLoaded: boolean;
  nlaStdSalesPrice: number;
  advanceAmtFromSo: number;
  currentLoadedPrefix: string;
  currentLoadedVno: string;
  initialVrType: string;
  initialFormType: string;
  initialVrPrefix: string;
  initialTitle: string;
  guidTransaction: string;
  isCsi: boolean;
  isConsolidateSo: boolean;
  dtCouponDetails: any;
  selectedPartiesDefaultPriceCategoryId: number;
  blnCreateCreditNoteAutomatically: boolean;
  showEInvoice: boolean;
  giftOrCashCouponSelector: boolean;
  printAddressLabel: boolean;
  draftMode: boolean;
  draftModeModal?: boolean;
  createInterfaceFromOtherVoucher?: boolean;
  skipZeroQty: boolean;
  isUserConfigOpen?: boolean;
  privConfig?: string;
  gatePassPrint?: boolean;
  lastChoosedTemplate?: TemplateState<unknown>; // nizam
  itemPopup?: { isOpen?: boolean, index?: number }
  taxBreakdown?: { name: string, amount: number }[];
  billDiscountPerc?: number;
  creditAccount?: boolean;
  debitAccount?: boolean;

  // einvoiceLabel?: string;
  // eWBLabel?: string;

  // Stocks
  chkCostFromExcel?: boolean;
  wStockListOpen?: boolean;
  allowMultiUnits?: boolean;
  dateCheckbox?: boolean;
  allPositiveStockToZero?: boolean;
  allNegativeStockToZero?: boolean;
  branchCheckbox?: boolean; // for stock branch transfer
  checkedSO?: boolean; // Item load request - sales order
  checkedSI?: boolean; // Item load request - sales
}
export interface GiftModel {
  productBatchID: number;
  productID: number;
  productName: string;
  productCode: string;
  barcode: string;
}

interface loadingResult {
  isLoading: boolean;
  text: string;
}
export interface CurrentCell {
  reCenterRow?: boolean;
  column: string;
  rowIndex: number;
  data: TransactionDetail;
  key?: string;
}
export type PartialTransactionFormFields = {
  [K in keyof TransactionFormState]?: TransactionFormState[K];
};
export type ColumnModel = {
  // dataField?: keyof TransactionDetail | keyof TransactionDetails2 | keyof TransactionDetailsMore|"supplier"|"avgSales"|"sold"|"salesLast30Days"|"salesLast90Days"|"supplierRefCode"|"lastSoldDate"|"poPendingQty"|"salesLast180Days"|"pqPendingQty"|"status";
  dataField?: string
  decimalPoint?: number;
  formStateOptionKey?: string;
  cssClass?: string;
  caption?: string | number;
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
  detailsOptionKey?: any
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

export interface GridQtyFactorsM {
  id: string;
  slNo: number;
  mann: number;
  kg: number;
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
  validateBarcode?: boolean;
}

interface ProductBatchDetailsForAutoBarcodeData {
  serialNumber: string;
  productCode: string;
  productName: string;
  commodityCode: string;
  basicUnitID: number;
  unitName: string;
  defUnitSPrice?: number;
  taxCategoryID: number;
  productCategoryID: number;
  productGroupID: number;
  autoBarcode: string;
  mannualBarcode: string;
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
  unitSPrice?: number;
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


  costPerItem: number;
  puchaseExciseTaxPerc: number;
  defSalesUnitID: number;

  isWeighingScaleItem: boolean;
  // ---------------- GST / TAX BREAKUP ----------------
  s_CGSTPerc: number;
  s_SGSTPerc: number;
  s_IGSTPerc: number;
  s_CessPerc: number;
  s_AdditionalCessPerc: number;
  s_CalamityCessPerc: number;

  muQty: number;
  isMannualBarCode: boolean;

  priceCategoryPrice: number;
  priceCategoryDiscPerc: number;

  schemeDiscount: number;
  schemeID: number;
  schemeType?: string;
  schemeQtyLimit: number;
  schemeFreeQty: number;
  specialSchemePrice: number;

  isSchemeProcessed?: string;

  partyLastSalesRate: number;
  blnCustLastPriceLoaded: boolean;

  weighingPrice: number;
  weighingQty: number;

  isCheckDuplicate: boolean;
  isCheckQtyLimit: boolean;
  units: UnitByBatchDetailsDto[];

  barCode?: string | null;
  actualBasicUnitID: number;
  scstPerc: number;
  pcstPerc: number;
  productUnitRemarks?: string | null;
  lastSoldSerialWisePrice?: number | null;

  // stock
  mulUnitManualBarcode?: string | null;
  toWareHouseStockDetails?: string;
  fromWareHouseStockDetails?: string;
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
export interface CouponDetails {
  cardID: number;
  cardNumber: string;
  amount: number;
  cardType: string;
  customerName: string;
  totalAmount: number;
  cardHolderName: string;
  couponID: number;
  oBalance: number;
}
export interface PrivilegeCardDetails {
  privilegeCardsID: number;
  branchID: number;
  cardNumber: string;
  cardHolderName: string;
  address1: string;
  address2: string;
  phone: string;
  mobile: string;
  priceCategoryID: number;
  expiryDate: Date;
  activatedDate: Date;
  createdUserID: number;
  createdDate: Date;
  modifiedUserID: number;
  modifiedDate: Date;
  cardType: string;
  oBalance: number;
  cardBalance: number;
  dob: Date;
  email: string;
  changeID: number;
  adjustAmt: number;
  marginWiseBalancePoint: number;
  totalBalance: number;
}
export interface SettlementDetails {
  invTransactionMasterID: number;
  paymentTypeID: number;
  description: string;
  amount: number;
  ledgerId: number;
  transactionDate: Date;
  ledgerName: string;
  paymentName: string;
  paymentType: string;
}
export type LoadSrParams = {
  voucherNumber: string;
  voucherPrefix: string;
  voucherForm: string;
};