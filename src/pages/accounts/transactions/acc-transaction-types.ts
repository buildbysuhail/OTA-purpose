// AccTransaction interface
export interface AccTransaction {
  master: AccMasterInput;
  details: AccDetailInput[];
}

// AccMasterInput interface
export interface AccMasterInput {
  accTransactionMasterId: number;
  departmentId: number;
  costCentreId: number;
  billwiseMasterId: number;
  employeeId: number;
  invTransactionId: number;
  transactionDate: Date;

  prevTransDate: Date;
  bankDate: Date;
  voucherPrefix: string;
  voucherNumber: number;
  referenceNumber: string;
  referenceDate: Date;
  dueDate: Date;
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
  checkBouncedDate: Date;
  drCr: string;
  isSalesView: boolean;
  branchId: number;
  counterId: number;
  refBranchId: number;
  uuid: string;
  manualInvoiceNumber: string;
}

// AccDetailInput interface
export interface AccDetailInput {
  accTransactionMasterId: number;
  accTransactionDetailId: number;
  ledgerId: number;
  relatedLedgerId: number;
  amount?: number;
  discount?: number;
  debit?: number;
  credit?: number;
  randomKey: number;

  incentives?: number;
  projectSiteId: number;
  narration: string;
  currencyId: number;
  exchangeRate?: number;
  adjAmount?: number;
  bankDate: Date;
  chequeNumber: string;
  particularsLedgerId: number;
  isDr: boolean;
  isDisplay: boolean;
  voucherType: string;
  checkStatus: string;
  checkBouncedDate: Date;
  billwiseDetails: string;
  branchId: number;
  costCentreId: number;
  projectId: number;

  bankName: string;
  nameOnCheque: string;

  firstCreditLedgerId?: number;
  firstDebitLedgerId?: number;
}
export const AccDetailInitialData: AccDetailInput = {
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
  bankDate: new Date(),
  chequeNumber: "",
  particularsLedgerId: 0,
  isDr: true,
  isDisplay: false,
  voucherType: "",
  checkStatus: "",
  checkBouncedDate: new Date(2000, 0, 1), // January 1, 2000
  billwiseDetails: "",
  branchId: 0,
  costCentreId: 0,
  projectId: 0,

  bankName: "",
  nameOnCheque: "",

  firstCreditLedgerId: undefined,
  firstDebitLedgerId: undefined,
}
export const AccTransactionInitialData: AccTransaction = {
  master: {
    accTransactionMasterId: 0,
    departmentId: 0,
    costCentreId: 0,
    billwiseMasterId: 0,
    employeeId: 0,
    invTransactionId: 0,
    transactionDate: new Date(),

    prevTransDate: new Date(),
    bankDate: new Date(),
    voucherPrefix: "",
    voucherNumber: 0,
    referenceNumber: "",
    referenceDate: new Date(),
    dueDate: new Date(),
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
    checkBouncedDate: new Date(),
    drCr: "",
    isSalesView: false,
    branchId: 0,
    counterId: 0,
    refBranchId: 0,
    uuid: "",
    manualInvoiceNumber: "",
  },
  details: [
    AccDetailInitialData
  ],
};