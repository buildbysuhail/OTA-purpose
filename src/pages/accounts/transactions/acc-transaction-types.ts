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
}

// AccTransactionMasterInput interface
export interface AccTransactionMaster {
  accTransactionMasterId: number;
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
  accTransactionMasterId: string;
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
  accTransactionMasterId: "",
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
  accTransactionMasterId: number;
  accTransactionDetailId: number;
  ledgerId: number;
  ledgerCode: string;
  ledgerName: string;
  ledger: string;
  drCr: string;
  relatedLedgerId: number;
  amount?: number;
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
  projectId: number;

  bankName: string;
  nameOnCheque: string;

  firstCreditLedgerId?: number;
  firstDebitLedgerId?: number;
}
export const accDetailInitialData: AccTransactionRow = {
  accTransactionMasterId: 0,
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
  currencyName: ""
}
export const accTransactionInitialData: AccTransactionData = {
  master: {
    accTransactionMasterId: 0,
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
  },
  details: [
    {
      ledgerId: 4343,
      ledgerCode: 'LC001',
      ledger: 'Cash Account',
      amount: 5000.00,
      drCr: 'Dr',
      chequeNumber: 'CHQ001',
      bankDate: new Date('2024-01-19').toISOString(),
      narration: 'Payment for supplies',
      billwiseData: [],
      accTransactionDetailId: 34,
      discount: 0,
      costCentreId: 43,
      checkStatus: 'Cleared',
      adjAmount: 5000.00,
      nameOnCheque: 'John Doe',
      bankName: 'ABC Bank',
      debit: 5000.00,
      credit: 0,
      projectId: 343,
      accTransactionMasterId: 0,
      relatedLedgerId: 0,
      randomKey: 0,
      projectSiteId: 0,
      currencyId: 0,
      particularsLedgerId: 0,
      isDr: false,
      isDisplay: false,
      voucherType: "",
      checkBouncedDate: new Date().toISOString(),
      branchId: 0,
      ledgerName: "",
      currencyName: ""
    },
    {
      ledgerId: 4343,
      ledgerCode: 'LC001',
      ledger: 'Cash Account',
      amount: 5000.00,
      drCr: 'Dr',
      chequeNumber: 'CHQ001',
      bankDate: new Date('2024-01-19').toISOString(),
      narration: 'Payment for supplies',
      billwiseData: [],
      accTransactionDetailId: 34,
      discount: 0,
      costCentreId: 43,
      checkStatus: 'Cleared',
      adjAmount: 5000.00,
      nameOnCheque: 'John Doe',
      bankName: 'ABC Bank',
      debit: 5000.00,
      credit: 0,
      projectId: 343,
      accTransactionMasterId: 0,
      relatedLedgerId: 0,
      randomKey: 0,
      projectSiteId: 0,
      currencyId: 0,
      particularsLedgerId: 0,
      isDr: false,
      isDisplay: false,
      voucherType: "",
      checkBouncedDate: new Date().toISOString(),
      branchId: 0,
      ledgerName: "",
      currencyName: ""
    },
    // Add more sample data here
  ],
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

export interface AccTransactionFormState {
  formCode: string; // FORMCODE
  voucherType: string; // VOUCHERTYPE
  isCleared: boolean; // IsCleared
  isBounced: boolean; // IsBounced
  isEntryControl: boolean; // IsEntryControl
  prevTransDate: string; // PrevTransDate
  isRowEdit: boolean; // IsRowEdit
  accTransMasterID: number; // AccTransMasterID
  dtLedgerCodes: any[]; // DtLedgerCodes (DataTable converted to array)
  billwiseData: BillwiseData[]; 
  showbillwise: false,
  showSaveDialog: false,
  accTransDetailsID: number; // AccTransDetailsID
  accTransDetailsIDCr: number; // AccTransDetailsIDCr
  chequeStatus: string; // ChequeStatus
  isInvoker: boolean; // IsInvoker
  foreignCurrency: boolean; // IsInvoker
  costCenterVisible: boolean; // CostCenterVisible
  blnDetailsNotCleared: boolean; // blnDetailsNotCleared
  dsLedgerDetails: any[]; // dsLedgerDetails (DataSet converted to array)
  isLocked: boolean; // isLocked
  onlineTrans: string; // Online_Trans
  isPDC: boolean; // isPDC
  firstDebitLedgerID: number; // FirstDebitLedgerID
  firstCreditLedgerID: number; // FirstCreditLedgerid
  title: string;
  masterAccountID: number;
  masterBalance: number;
  masterAccountName: string;
  row: AccTransactionRow;
  rowProcessing: boolean;
  transactionProcessing: boolean;
  transactionLoading: boolean;
  transaction: AccTransactionData;
  printOnSave: boolean
  printPreview: boolean
  printCheque: boolean
  keepNarration: boolean
  amountInWords: string
}
export const accTransactionFormStateInitialData: AccTransactionFormState = {
  formCode: "",
  voucherType: "",
  isCleared: false,
  isBounced: false,
  isEntryControl: false,
  prevTransDate: new Date().toISOString(),
  isRowEdit: false,
  accTransMasterID: 0,
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
  isLocked: false,
  onlineTrans: "",
  isPDC: false,
  firstDebitLedgerID: 0,
  firstCreditLedgerID: 0,
  title: "",
  row: accDetailInitialData,
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
  amountInWords: 'Zero Only'
}