import { Dispatch, SetStateAction } from "react";
import { inputBox } from "../../../redux/slices/app/types";
import moment from "moment";

// AccTransaction interface
export interface AccTransactionProps {
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
}
export interface AccTransactionData {
  master: AccTransactionMaster;
  masterValidations?: AccTransactionMasterValidations;
  details: AccTransactionRow[];
  attachments: any[];
}
export interface AccTransactionValidationsData {
  master: AccTransactionMasterValidations;
  details: AccTransactionRow[];
  attachments: any[];
}

// const initialFormElements = {
//   foreignCurrency: {
//     visible: true,
//     disabled: false,
//     label: "Foreign Currency",
//   },
//   voucherPrefix: { visible: true, disabled: false, label: "Prefix" },
//   voucherNumber: { visible: true, disabled: false, label: "Voucher Number" },
//   btnDown: { visible: true, disabled: false, label: "" },
//   transactionDate: {
//     visible: true,
//     disabled: false,
//     label: "Transaction Date",
//   },
//   referenceNumber: {
//     visible: true,
//     disabled: false,
//     label: "Reference Number",
//   },
//   pnlMasters: { visible: true, disabled: false, label: "" },
//   dxGrid: { visible: true, disabled: false, label: "" },
//   referenceDate: { visible: true, disabled: false, label: "Reference Date" },
//   masterAccount: { visible: true, disabled: false, label: "Default Account" },
//   jvDrCr: { visible: false, disabled: false, label: "Dr/Cr" },
//   employee: { visible: true, disabled: false, label: "Employee" },
//   remarks: { visible: true, disabled: false, label: "Remarks" },
//   commonNarration: { visible: true, disabled: false, label: "Notes" },
//   ledgerCode: { visible: true, disabled: false, label: "Ledger Code" },
//   ledgerID: { visible: true, disabled: false, label: "Ledger" },
//   amount: { visible: true, disabled: false, label: "Amount" },
//   drCr: { visible: false, disabled: false, label: "Amount" },
//   narration: { visible: true, disabled: false, label: "Narration" },
//   currencyID: { visible: true, disabled: false, label: "Currency" },
//   exchangeRate: { visible: true, disabled: false, label: "Exchange Rate" },
//   hasDiscount: { visible: true, disabled: false, label: "Has Discount" },
//   discount: { visible: true, disabled: false, label: "Discount" },
//   chequeNumber: { visible: true, disabled: false, label: "Cheque Number" },
//   bankDate: { visible: false, disabled: false, label: "Bank Date" },
//   nameOnCheque: { visible: true, disabled: false, label: "Name on Cheque" },
//   bankName: { visible: true, disabled: false, label: "Bank Name" },
//   projectId: { visible: false, disabled: false, label: "Project" },
//   costCentreID: { visible: false, disabled: false, label: "Cost Centre" },
//   lblGroupName: { visible: true, disabled: false, label: "Group Name" },
//   printOnSave: { visible: true, disabled: false, label: "Print on Save" },
//   printPreview: { visible: true, disabled: false, label: "Print Preview" },
//   printCheque: { visible: true, disabled: false, label: "Print Cheque" },
//   keepNarration: { visible: false, disabled: false, label: "Keep Narration" },
//   btnBillWise: { visible: true, disabled: false, label: "Bill Wise" },
//   btnAdd: { visible: true, disabled: false, label: "Add" },
//   btnEdit: { visible: true, disabled: false, label: "Edit" },
//   btnDelete: { visible: true, disabled: false, label: "Delete" },
//   btnPrint: { visible: true, disabled: false, label: "Print" },
//   btnRef: { visible: true, disabled: false, label: "..." },
//   btnSave: { visible: true, disabled: false, label: "Save" },
//   btnPrintCheque: { visible: true, disabled: false, label: "Print Cheque" },
//   btnAttachment: { visible: true, disabled: false, label: "Attachments" },
//   lnkUnlockVoucher: { visible: false, disabled: false, label: "Unlock" },
// };
// export type FormElementsState = {
//   [key in keyof typeof initialFormElements]: FormElementState;
// };


export interface FormElementState {
  visible: boolean;
  disabled: boolean;
  label: string;
  reload?: boolean;
  accLedgerType?: number;
  [key: string]: any; 
}
// AccTransactionMasterInput interface
export interface AccTransactionMaster {
  accTransactionMasterID: number;
  departmentId: number;
  costCentreID: number;
  billwiseMasterId: number;
  employeeID: number;
  invTransactionId: number;
  transactionDate: string;
  totalAmount?: number;
  prevTransDate: string;
  // bankDate: string;
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
  // accTransactionDetailID: number;
  adjustedTransDetailId: number;
  currencyRate?: number;
  currencyName?: number;
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
  accTransactionMasterID: string;
  departmentId: string;
  costCentreID: string;
  billwiseMasterId: string;
  employeeID: string;
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
  accTransactionDetailID: string;
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
    accTransactionMasterID: "",
    departmentId: "",
    costCentreID: "",
    billwiseMasterId: "",
    employeeID: "",
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
    accTransactionDetailID: "",
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
export interface AccTransactionRowForOutPut extends AccTransactionRow {

}
export interface AccTransactionRow {
  slNo?: number;
  accTransactionMasterID: number;
  accTransactionDetailID: number;
  ledgerID: number;
  ledgerCode: string;
  ledgerName: string;
  accGroupName: string;
  ledger: string;
  drCr: string;
  relatedLedgerID: number;
  relatedLedgerCode: string;
  particulars: string;
  amount?: number;
  amountFC?: number;
  hasDiscount?: boolean;
  discount?: number;
  debit?: number;
  credit?: number;
  randomKey: number;

  incentives?: number;
  projectSiteId: number;
  narration: string;
  currencyId: number;
  exchangeRate: number;
  adjAmount?: number;
  bankDate: string;
  chqDate: string;
  chequeNumber: string;
  particularsLedgerId: number;
  isDr: boolean;
  isDisplay: boolean;
  voucherType: string;
  checkStatus: string;
  checkBouncedDate: string;
  billwiseData: BillwiseData[];
  billwiseDetails: string;
  branchId: number;
  costCentreID: number;
  costCentreName: string;
  projectId: number;
  projectName: string;

  bankName: string;
  nameOnCheque: string;

  firstCreditLedgerId?: number;
  firstDebitLedgerId?: number;
}
export const AccTransactionMasterInitialData: AccTransactionMaster  = {
  accTransactionMasterID: 0,
  departmentId: 0,
  costCentreID: 0,
  billwiseMasterId: 0,
  employeeID: 0,
  invTransactionId: 0,
  transactionDate: new Date().toISOString(),
  totalAmount: 0.00,
  prevTransDate: new Date().toISOString(),
  // bankDate: new Date().toISOString(),
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
  // accTransactionDetailID: 0,
  adjustedTransDetailId: 0,
  currencyRate: 1,
  isPosted: false,
  randomKey: 0,
  onlineTrans: "",
  isEdit: false,
  checkStatus: "",
  checkBouncedDate: moment.utc("2000-01-01").startOf("day").toISOString(),
  drCr: "Dr",
  isSalesView: false,
  branchId: 0,
  counterId: 0,
  refBranchId: 0,
  uuid: "",
  manualInvoiceNumber: "",
  isLocked: false
}
export const AccTransactionRowInitialData: AccTransactionRow = {
  accTransactionMasterID: 0,
  accTransactionDetailID: 0,
  ledgerID: 0,
  relatedLedgerID: 0,
  amount: undefined,
  discount: 0,
  debit: undefined,
  credit: undefined,
  randomKey: 0,

  incentives: undefined,
  projectSiteId: 0,
  narration: "",
  currencyId: 1,
  adjAmount: undefined,
  bankDate: moment.utc("2000-01-01").startOf("day").toISOString(),
  chequeNumber: "",
  particularsLedgerId: 0,
  isDr: true,
  isDisplay: false,
  voucherType: "",
  checkStatus: "",
  checkBouncedDate: moment.utc("2000-01-01").startOf("day").toISOString(), // January 1, 2000
  billwiseData: [],
  branchId: 0,
  costCentreID: 0,
  projectId: 0,

  bankName: "",
  nameOnCheque: "",

  firstCreditLedgerId: undefined,
  firstDebitLedgerId: undefined,
  ledgerCode: "",
  ledger: "",
  drCr: "Dr",
  ledgerName: "",
  projectName: "",
  costCentreName: "",
  billwiseDetails: "",
  chqDate: "",
  accGroupName: "",
  exchangeRate: 1,
  relatedLedgerCode: "",
  particulars: ""
}
export const accTransactionInitialData: AccTransactionData = {
  master: AccTransactionMasterInitialData,
  details: [],
  attachments: [],
  masterValidations: initialAccTransactionMasterValidations
};
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
export interface AccUserConfig {
  maxWidth?: any;
  keepNarrationForJV?: boolean;
  clearDetailsAfterSaveAccounts?: boolean;
  mnuShowConfirmationForEditOnAccounts?: boolean;
  maximizeBillwiseScreenInitially?: boolean;
  alignment?: "left" | "center" | "right";
  presetCostenterId?: number
  counterAssignedCashLedgerId?: number
  outerPageBg?:string;
  innerPageBg?:string;
  inputBoxStyle?:inputBox
}
export interface AccTransactionFormState {
  store: any;
  formCode: string; // FORMCODE
  isCleared: boolean; // IsCleared
  isBounced: boolean; // IsBounced
  isEntryControl: boolean; // IsEntryControl
  isEdit: boolean; // isEdit
  isRowEdit: boolean; // isRowEdit
  IsBillwiseTransAdjustmentExists: boolean;
  ledgerDataLoading: boolean;
  saving: boolean;
  ledgerBalanceLoading: boolean;
  ledgerBalance: number;
  ledgerBillWiseLoading: boolean;
  ledgerData: any;
  groupName: any;
  ledgerIsBillWiseAdjustExistLoading: boolean;
  dtLedgerCodes: any[]; // DtLedgerCodes (DataTable converted to array)
  isBahamdoonPOSReceipt: boolean;
  billwiseData: BillwiseData[];
  billwiseDrCr: string;
  showbillwise: boolean;
  showSaveDialog: boolean;
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
  masterBalanceLoading: boolean; // Master account balance
  masterAccountName: string; // Master account name
  previousNarration: string;
  row: AccTransactionRow;
  prev: string;
  rowProcessing: boolean;
  transactionProcessing: boolean;
  transactionLoading: boolean;
  unlocking: boolean;
  transaction: AccTransactionData;
  transactionType: string;
  total: number;
  printOnSave: boolean
  printPreview: boolean
  printCheque: boolean
  keepNarration: boolean
  amountInWords: string,
  template?: any,
  templates?: [],
  userConfig?: AccUserConfig;
  formElements: FormElementsState
}
export const initialFormElements:{ [key: string]: FormElementState } = {
  foreignCurrency: {
    visible: true,
    disabled: false,
    label: "Foreign Currency",
  },
  voucherPrefix: { visible: true, disabled: true, label: "prefix" },
  voucherNumber: { visible: true, disabled: false, label: "voucher_number" },
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
  },
  pnlMasters: { visible: true, disabled: false, label: "" },
  dxGrid: { visible: true, disabled: false, label: "" },
  referenceDate: { visible: true, disabled: false, label: "reference_date" },
  masterAccount: { visible: true, disabled: false, label: "default_account" },
  jvDrCr: { visible: false, disabled: false, label: "dr/cr" },
  employee: { visible: true, disabled: false, label: "employee" },
  remarks: { visible: true, disabled: false, label: "remarks" },
  commonNarration: { visible: true, disabled: false, label: "notes" },
  ledgerCode: { visible: true, disabled: false, label: "ledger_code" },
  ledgerID: { visible: true, disabled: false, label: "ledger" },
  amount: { visible: true, disabled: false, label: "amount" },
  drCr: { visible: false, disabled: false, label: "dr/cr" },
  narration: { visible: true, disabled: false, label: "narration" },
  currencyID: { visible: true, disabled: false, label: "currency" },
  exchangeRate: { visible: true, disabled: false, label: "exchange_rate" },
  hasDiscount: { visible: true, disabled: false, label: "discount" },
  discount: { visible: true, disabled: false, label: "discount" },
  chequeNumber: { visible: true, disabled: false, label: "cheque_number" },
  bankDate: { visible: false, disabled: false, label: "bank_date" },
  nameOnCheque: { visible: true, disabled: false, label: "Name on Cheque" },
  bankName: { visible: true, disabled: false, label: "bank_name" },
  projectId: { visible: false, disabled: false, label: "project" },
  costCentreID: { visible: false, disabled: false, label: "cost_centre" },
  lblGroupName: { visible: true, disabled: false, label: "group_name" },
  printOnSave: { visible: true, disabled: false, label: "print_on_save" },
  printPreview: { visible: true, disabled: false, label: "print_preview" },
  printCheque: { visible: true, disabled: false, label: "print_cheque" },
  keepNarration: { visible: false, disabled: false, label: "keep_narration" },
  btnBillWise: { visible: false, disabled: false, label: "billwise" },
  btnAdd: { visible: true, disabled: false, label: "Add" },
  btnEdit: { visible: true, disabled: false, label: "edit" },
  linkEdit: { visible: false, disabled: false, label: "linkEdit" },
  btnDelete: { visible: true, disabled: false, label: "delete" },
  btnPrint: { visible: true, disabled: true, label: "print" },
  btnRef: { visible: true, disabled: false, label: "..." },
  btnSave: { visible: true, disabled: false, label: "save" },
  btnPrintCheque: { visible: true, disabled: false, label: "print_cheque" },
  btnAttachment: { visible: true, disabled: false, label: "attachments" },
  lnkUnlockVoucher: { visible: false, disabled: false, label: "Unlock" },
};
export type FormElementsState = {
  [key in keyof typeof initialFormElements]: FormElementState;
};
export const accTransactionFormStateInitialData: AccTransactionFormState = {
  formCode: "",
  isCleared: false,
  isBounced: false,
  isEntryControl: false,
  isEdit: false,
  dtLedgerCodes: [],
  billwiseData: [],
  showbillwise: false,
  billwiseDrCr: "",
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
  userConfig: {
    clearDetailsAfterSaveAccounts: true,
    keepNarrationForJV: true,
    mnuShowConfirmationForEditOnAccounts: true,
    maximizeBillwiseScreenInitially: true,
    alignment: "center",
    presetCostenterId: 0,
    counterAssignedCashLedgerId: 0,
    maxWidth: " ",
    outerPageBg: "",
    innerPageBg: "",
    inputBoxStyle: {
      inputStyle: "normal",
      inputSize: "md",
      checkButtonInputSize: "md",
      inputHeight: 0,
      fontSize: 14,
      fontWeight: 400,
      labelFontSize: 14,
      otherLabelFontSize: 14,
      inputBgColor: "255, 255, 255",
      borderColor: "128, 128, 128",
      selectColor: "255, 255, 255",
      fontColor: "128, 128, 128",
      labelColor: "128, 128, 128",
      borderFocus: "128, 128, 128",
      borderRadius: 4,
      adjustA: 0,
      adjustB: 0,
      adjustC: 0,
      adjustD: 0,
      marginTop: 0,
      marginBottom: 0,
      focusForeColor: "128, 128, 128",
      focusBgColor: "255, 255, 255",
    }
  },
  isBahamdoonPOSReceipt: false,
  unlocking: false,
  total: 0,
  previousNarration: "",
  isRowEdit: false,
  IsBillwiseTransAdjustmentExists: false,
  // formElements: initialFormElements
  ledgerDataLoading: false,
  ledgerBillWiseLoading: false,
  ledgerIsBillWiseAdjustExistLoading: false,
  ledgerData: undefined,
  ledgerBalanceLoading: false,
  ledgerBalance: 0,
  masterBalanceLoading: false,
  groupName: undefined,
  formElements: initialFormElements,
  saving: false,
  store: undefined,
  transactionType: "",
  prev: ""
}
export interface PrintTransProps {
  masterAccount: string;
  details: AccTransactionRow[];
  voucherType: string;
  formType: string;
  vrPrefix: string;
  vrNumber: string;
  isPrintPreview: boolean;
}
