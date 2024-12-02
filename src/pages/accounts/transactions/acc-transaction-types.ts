// AccTransaction interface
export interface AccTransactionProps {
  voucherType: string;
  formCode: string;
  voucherPrefix: string;
  formType: string;
  title: string;
  drCr: string;
  voucherNo?: number;
}
export interface AccTransactionData {
  master: AccTransactionMaster;
  details: AccTransactionRow[];
  attachments: any[];
}

// AccTransactionMasterInput interface
export interface AccTransactionMaster {
  accTransMasterID: number;
  departmentId: number;
  costCentreId: number;
  billwiseMasterId: number;
  employeeId: number;
  invTransactionId: number;
  transactionDate: string;
  totalAmount?: number;
  prevTransDate: string;
  bankDate: string;
  voucherPrefix: string;
  voucherNumber: number;
  referenceNumber: string;
  referenceDate: string;
  dueDate: string;
  particulars: string;
  isLocked: boolean; 
  totalDebit?: number;
  billwiseTotalAdjAmt?: number;
  billwiseAdjAmt?: number;
  totalCredit?: number;
  totDiscount?: number;
  empIncentive?: number;
  commonNarration: string;
  remarks: string;
  voucherType: string;
  formType: string;
  debitNoteTransId: number;
  creditNoteTransId: number;
  currencyId: number;
  accTransDetailId: number;
  adjustedTransDetailId: number;
  currencyRate?: number;
  isPosted: boolean;
  randomKey: number;
  onlineTrans: string;
  isEdit: boolean;
  checkStatus: string;
  checkBouncedDate: string;
  drCr: string;
  isSalesView: boolean;
  branchId: number;
  counterId: number;
  refBranchId: number;
  uuid: string;
  manualInvoiceNumber: string;
}

// AccTransactionMasterInput interface
export interface AccTransactionMasterValidations {
  accTransMasterID: string;
  departmentId: string;
  costCentreId: string;
  billwiseMasterId: string;
  employeeId: string;
  invTransactionId: string;
  transactionDate: string;

  prevTransDate: string;
  bankDate: string;
  voucherPrefix: string;
  voucherNumber: string;
  referenceNumber: string;
  referenceDate: string;
  dueDate: string;
  particulars: string;
  totalDebit: string;
  billwiseTotalAdjAmt: string;
  billwiseAdjAmt: string;
  totalCredit: string;
  totDiscount: string;
  empIncentive: string;
  commonNarration: string;
  remarks: string;
  voucherType: string;
  formType: string;
  debitNoteTransId: string;
  creditNoteTransId: string;
  currencyId: string;
  accTransDetailId: string;
  adjustedTransDetailId: string;
  currencyRate: string;
  isPosted: string;
  randomKey: string;
  onlineTrans: string;
  isEdit: string;
  checkStatus: string;
  checkBouncedDate: string;
  drCr: string;
  isSalesView: string;
  branchId: string;
  counterId: string;
  refBranchId: string;
  uuid: string;
  manualInvoiceNumber: string;
}

// Initial object with default values
export const initialAccTransactionMasterValidations: AccTransactionMasterValidations = {
  accTransMasterID: "",
  departmentId: "",
  costCentreId: "",
  billwiseMasterId: "",
  employeeId: "",
  invTransactionId: "",
  transactionDate: "",

  prevTransDate: "",
  bankDate: "",
  voucherPrefix: "",
  voucherNumber: "",
  referenceNumber: "",
  referenceDate: "",
  dueDate: "",
  particulars: "",
  totalDebit: "",
  billwiseTotalAdjAmt: "",
  billwiseAdjAmt: "",
  totalCredit: "",
  totDiscount: "",
  empIncentive: "",
  commonNarration: "",
  remarks: "",
  voucherType: "",
  formType: "",
  debitNoteTransId: "",
  creditNoteTransId: "",
  currencyId: "",
  accTransDetailId: "",
  adjustedTransDetailId: "",
  currencyRate: "",
  isPosted: "",
  randomKey: "",
  onlineTrans: "",
  isEdit: "",
  checkStatus: "",
  checkBouncedDate: "",
  drCr: "",
  isSalesView: "",
  branchId: "",
  counterId: "",
  refBranchId: "",
  uuid: "",
  manualInvoiceNumber: "",
};
// AccDetailInput interface
export interface AccTransactionRow {
  accTransMasterID: number;
  accTransactionDetailId: number;
  ledgerId: number;
  ledgerCode: string;
  ledgerName: string;
  ledger: string;
  drCr: string;
  relatedLedgerId: number;
  amount?: number;
  AmountFC?: number;
  hasDiscount?: boolean;
  discount?: number;
  debit?: number;
  credit?: number;
  randomKey: number;

  incentives?: number;
  projectSiteId: number;
  narration: string;
  currencyId: number;
  currencyName: string;
  exchangeRate?: number;
  adjAmount?: number;
  bankDate: string;
  chequeNumber: string;
  particularsLedgerId: number;
  isDr: boolean;
  isDisplay: boolean;
  voucherType: string;
  checkStatus: string;
  checkBouncedDate: string;
  billwiseData: BillwiseData[];
  branchId: number;
  costCentreId: number;
  costCentreName: number;
  projectId: number;
  ProjectName: number;

  bankName: string;
  nameOnCheque: string;

  firstCreditLedgerId?: number;
  firstDebitLedgerId?: number;
}
export const AccTransactionRowInitialData: AccTransactionRow = {
  accTransMasterID: 0,
  accTransactionDetailId: 0,
  ledgerId: 0,
  relatedLedgerId: 0,
  amount: undefined,
  discount: undefined,
  debit: undefined,
  credit: undefined,
  randomKey: 0,

  incentives: undefined,
  projectSiteId: 0,
  narration: "",
  currencyId: 1,
  exchangeRate: undefined,
  adjAmount: undefined,
  bankDate: new Date().toISOString(),
  chequeNumber: "",
  particularsLedgerId: 0,
  isDr: true,
  isDisplay: false,
  voucherType: "",
  checkStatus: "",
  checkBouncedDate: new Date(2000, 0, 1).toISOString(), // January 1, 2000
  billwiseData: [],
  branchId: 0,
  costCentreId: 0,
  projectId: 0,

  bankName: "",
  nameOnCheque: "",

  firstCreditLedgerId: undefined,
  firstDebitLedgerId: undefined,
  ledgerCode: "",
  ledger: "",
  drCr: "",
  ledgerName: "",
  currencyName: "",
  ProjectName: 0,
  costCentreName: 0
}
export const accTransactionInitialData: AccTransactionData = {
  master: {
    accTransMasterID: 0,
    departmentId: 0,
    costCentreId: 0,
    billwiseMasterId: 0,
    employeeId: 0,
    invTransactionId: 0,
    transactionDate: new Date().toISOString(),
    totalAmount: 0.00,
    prevTransDate: new Date().toISOString(),
    bankDate: new Date().toISOString(),
    voucherPrefix: "",
    voucherNumber: 0,
    referenceNumber: "",
    referenceDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    particulars: "",
    totalDebit: undefined,
    billwiseTotalAdjAmt: undefined,
    billwiseAdjAmt: undefined,
    totalCredit: undefined,
    totDiscount: undefined,
    empIncentive: undefined,
    commonNarration: "",
    remarks: "",
    voucherType: "",
    formType: "",
    debitNoteTransId: 0,
    creditNoteTransId: 0,
    currencyId: 0,
    accTransDetailId: 0,
    adjustedTransDetailId: 0,
    currencyRate: undefined,
    isPosted: false,
    randomKey: 0,
    onlineTrans: "",
    isEdit: false,
    checkStatus: "",
    checkBouncedDate: new Date().toISOString(),
    drCr: "",
    isSalesView: false,
    branchId: 0,
    counterId: 0,
    refBranchId: 0,
    uuid: "",
    manualInvoiceNumber: "",
    isLocked: false
  },
  details: [],
  attachments: []
};
export interface BillwiseData {
  SiNo: number;
  Select: boolean;
  VrType: string;
  BillNo: number;
  Date: string;
  Amount: number;
  AdjAmount: number;
  Balance: number;
  AmountToAssign: number;
  BalanceAfter: number;
  PartyName: string;
  RefDate: string;
  AccTransDetailID: string;
  RafNo: string;
  FormType: string;
  FinancilaYearID: string;
  VoucherPrefix: string;
}
export interface AccUserConfig {
  keepNarrationForJV: boolean;
  clearDetailsAfterSaveAccounts: boolean;
  mnuShowConfirmationForEditOnAccounts: boolean;
  presetCostenterId: number
}
export interface AccTransactionFormState {
  formCode: string; // FORMCODE
  isCleared: boolean; // IsCleared
  isBounced: boolean; // IsBounced
  isEntryControl: boolean; // IsEntryControl
  isEdit: boolean; // isEdit
  dtLedgerCodes: any[]; // DtLedgerCodes (DataTable converted to array)
  isBahamdoonPOSReceipt: boolean;
  billwiseData: BillwiseData[];
  showbillwise: false;
  showSaveDialog: false;
  accTransDetailsID: number; // AccTransDetailsID
  accTransDetailsIDCr: number; // AccTransDetailsIDCr
  chequeStatus: string; // ChequeStatus
  isInvoker: boolean; // IsInvoker
  foreignCurrency: boolean; // Foreign currency flag
  costCenterVisible: boolean; // CostCenterVisible
  blnDetailsNotCleared: boolean; // blnDetailsNotCleared
  dsLedgerDetails: any[]; // dsLedgerDetails (DataSet converted to array)
  isPDC: boolean; // isPDC
  firstDebitLedgerID: number; // FirstDebitLedgerID
  firstCreditLedgerID: number; // FirstCreditLedgerid
  title: string; // Form title
  masterAccountID: number; // Master account ID
  masterBalance: number; // Master account balance
  masterAccountName: string; // Master account name
  row: AccTransactionRow;
  rowProcessing: boolean;
  transactionProcessing: boolean;
  transactionLoading: boolean;
  unlocking: boolean;
  transaction: AccTransactionData;
  total: string;
  printOnSave: boolean
  printPreview: boolean
  printCheque: boolean
  keepNarration: boolean
  amountInWords: string,
  userConfig: AccUserConfig;
}
export const accTransactionFormStateInitialData: AccTransactionFormState = {
  formCode: "",
  isCleared: false,
  isBounced: false,
  isEntryControl: false,
  isEdit: false,
  dtLedgerCodes: [],
  billwiseData: [],
  showbillwise: false,
  showSaveDialog: false,
  accTransDetailsID: 0,
  accTransDetailsIDCr: 0,
  chequeStatus: "P",
  isInvoker: false,
  foreignCurrency: false,
  costCenterVisible: false,
  blnDetailsNotCleared: false,
  dsLedgerDetails: [],
  isPDC: false,
  firstDebitLedgerID: 0,
  firstCreditLedgerID: 0,
  title: "",
  row: AccTransactionRowInitialData,
  rowProcessing: false,
  transactionProcessing: false,
  transactionLoading: false,
  transaction: accTransactionInitialData,
  masterAccountID: 0,
  masterBalance: 0,
  masterAccountName: "",
  printOnSave: false,
  printPreview: false,
  printCheque: false,
  keepNarration: false,
  amountInWords: 'Zero Only',
  userConfig: { clearDetailsAfterSaveAccounts: true, keepNarrationForJV: true, mnuShowConfirmationForEditOnAccounts: true, presetCostenterId: 0 },
  isBahamdoonPOSReceipt: false,
  unlocking: false,
  total: "0"
}