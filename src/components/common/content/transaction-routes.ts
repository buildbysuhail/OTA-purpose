import { UserAction } from "../../../helpers/user-right-helper";
import { Countries, UserModel } from "../../../redux/slices/user-session/reducer";

export interface TransactionRoute {
  formCode: string;
  action: UserAction;
  voucherType: string;
  transactionType: string;
  formType: string;
  title: string;
  drCr: string;
  visibleFn?: (userSession: UserModel) => boolean;
}
export const transactionRoutes: TransactionRoute[] = [
  // Cash Payments
  {
    formCode: "CP",
    action: UserAction.Show,
    voucherType: "CP",
    transactionType: "CashPayment",
    formType: "",
    title: "Cash Payment",
    drCr: "Dr",
  },
  // Cash Receipt
  {
    formCode: "CR",
    action: UserAction.Show,
    voucherType: "CR",
    transactionType: "CashReceipt",
    formType: "",
    title: "Cash Receipt",
    drCr: "Cr"
  },

  // Cash Payment Estimate
  {
    formCode: "CPE",
    action: UserAction.Show,
    voucherType: "CPE",
    transactionType: "CashPaymentEstimate",
    formType: "",
    title: "Cash Payment Estimate",
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India
  },
  // Cash Receipt Estimate
  {
    formCode: "CRE",
    action: UserAction.Show,
    voucherType: "CRE",
    transactionType: "CashReceiptEstimate",
    formType: "",
    title: "Cash Receipt Estimate",
    drCr: "Cr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India
  },
  // Bank Payment
  {
    formCode: "BP",
    action: UserAction.Show,
    voucherType: "BP",
    transactionType: "BankPayment",
    formType: "",
    title: "Bank Payment",
    drCr: "Dr"
  },
  // Bank Receipt
  {
    formCode: "BR",
    action: UserAction.Show,
    voucherType: "BR",
    transactionType: "BankReceipt",
    formType: "",
    title: "Bank Receipt",
    drCr: "Cr"
  },
  // Cheque Payment
  {
    formCode: "CQP",
    action: UserAction.Show,
    voucherType: "CQP",
    transactionType: "ChequePayment",
    formType: "",
    title: "Cheque Payment",
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India
  },
  // Cheque Receipt 
  {
    formCode: "CQR",
    action: UserAction.Show,
    voucherType: "CQR",
    transactionType: "ChequeReceipt",
    formType: "",
    title: "Cheque Receipt",
    drCr: "Cr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India
  },
  // Opening Balance
  {
    formCode: "OB",
    action: UserAction.Show,
    voucherType: "OB",
    transactionType: "OpeningBalance",
    formType: "",
    title: "Opening Balance",
    drCr: ""
  },
  // Journal Entry
  {
    formCode: "JV",
    action: UserAction.Show,
    voucherType: "JV",
    transactionType: "JournalEntry",
    formType: "",
    title: "Journal Entry",
    drCr: ""
  },
  // Multi Journal Entry
  {
    formCode: "MJV",
    action: UserAction.Show,
    voucherType: "MJV",
    transactionType: "MultiJournalEntry",
    formType: "",
    title: "Multi Journal Entry",
    drCr: ""
  },
  // Journal Entry Special
  {
    formCode: "JVSP",
    action: UserAction.Show,
    voucherType: "JVSP",
    transactionType: "JournalEntrySpecial",
    formType: "",
    title: "Journal Entry Special",
    drCr: "",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India
  },
  // Debit Note
  {
    formCode: "DN",
    action: UserAction.Show,
    voucherType: "DN",
    transactionType: "DebitNote",
    formType: "",
    title: "Debit Note",
    drCr: "Dr"
  },
  // Credit Note
  {
    formCode: "CN",
    action: UserAction.Show,
    voucherType: "CN",
    transactionType: "CreditNote",
    formType: "",
    title: "Credit Note",
    drCr: "Cr"
  },
  // TX Payment
  {
    formCode: "TXP",
    action: UserAction.Show,
    voucherType: "TXP",
    transactionType: "TXPayment",
    formType: "VAT",
    title: "Tax On Expense Payment",
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.Saudi
  },
  // Bank Reconciliation
  {
    formCode: "BRC",
    action: UserAction.Show,
    voucherType: "",
    transactionType: "BankReconciliation",
    formType: "",
    title: "Bank Reconciliation",
    drCr: ""
  },
  // Post Dated Cheques
  {
    formCode: "PDC",
    action: UserAction.Show,
    voucherType: "",
    transactionType: "PDC",
    formType: "",
    title: "Post Dated Cheques",
    drCr: ""
  },
];