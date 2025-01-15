import { UserAction } from "../../../helpers/user-right-helper";
import { Countries, UserModel } from "../../../redux/slices/user-session/reducer";
import { TransactionTitles } from "./transaction-titles";

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
  {
    formCode: "CP",
    action: UserAction.Show,
    voucherType: "CP",
    transactionType: "CashPayment",
    formType: "",
    title: TransactionTitles.CashPayment,
    drCr: "Dr",
  },
  {
    formCode: "CR",
    action: UserAction.Show,
    voucherType: "CR",
    transactionType: "CashReceipt",
    formType: "",
    title: TransactionTitles.CashReceipt,
    drCr: "Cr",
  },
  {
    formCode: "CPE",
    action: UserAction.Show,
    voucherType: "CPE",
    transactionType: "CashPaymentEstimate",
    formType: "",
    title: TransactionTitles.CashPaymentEstimate,
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    formCode: "CRE",
    action: UserAction.Show,
    voucherType: "CRE",
    transactionType: "CashReceiptEstimate",
    formType: "",
    title: TransactionTitles.CashReceiptEstimate,
    drCr: "Cr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    formCode: "BP",
    action: UserAction.Show,
    voucherType: "BP",
    transactionType: "BankPayment",
    formType: "",
    title: TransactionTitles.BankPayment,
    drCr: "Dr",
  },
  {
    formCode: "BR",
    action: UserAction.Show,
    voucherType: "BR",
    transactionType: "BankReceipt",
    formType: "",
    title: TransactionTitles.BankReceipt,
    drCr: "Cr",
  },
  {
    formCode: "CQP",
    action: UserAction.Show,
    voucherType: "CQP",
    transactionType: "ChequePayment",
    formType: "",
    title: TransactionTitles.ChequePayment,
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    formCode: "CQR",
    action: UserAction.Show,
    voucherType: "CQR",
    transactionType: "ChequeReceipt",
    formType: "",
    title: TransactionTitles.ChequeReceipt,
    drCr: "Cr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    formCode: "OB",
    action: UserAction.Show,
    voucherType: "OB",
    transactionType: "OpeningBalance",
    formType: "",
    title: TransactionTitles.OpeningBalance,
    drCr: "",
  },
  {
    formCode: "JV",
    action: UserAction.Show,
    voucherType: "JV",
    transactionType: "JournalEntry",
    formType: "",
    title: TransactionTitles.JournalEntry,
    drCr: "",
  },
  {
    formCode: "MJV",
    action: UserAction.Show,
    voucherType: "MJV",
    transactionType: "MultiJournalEntry",
    formType: "",
    title: TransactionTitles.MultiJournalEntry,
    drCr: "",
  },
  {
    formCode: "JVSP",
    action: UserAction.Show,
    voucherType: "JVSP",
    transactionType: "JournalEntrySpecial",
    formType: "",
    title: TransactionTitles.JournalEntrySpecial,
    drCr: "",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    formCode: "DN",
    action: UserAction.Show,
    voucherType: "DN",
    transactionType: "DebitNote",
    formType: "",
    title: TransactionTitles.DebitNote,
    drCr: "Dr",
  },
  {
    formCode: "CN",
    action: UserAction.Show,
    voucherType: "CN",
    transactionType: "CreditNote",
    formType: "",
    title: TransactionTitles.CreditNote,
    drCr: "Cr",
  },
  {
    formCode: "TXP",
    action: UserAction.Show,
    voucherType: "TXP",
    transactionType: "TXPayment",
    formType: "VAT",
    title: TransactionTitles.TaxOnExpensePayment,
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.Saudi,
  },
  {
    formCode: "BRC",
    action: UserAction.Show,
    voucherType: "",
    transactionType: "BankReconciliation",
    formType: "",
    title: TransactionTitles.BankReconciliation,
    drCr: "",
  },
  {
    formCode: "PDC",
    action: UserAction.Show,
    voucherType: "",
    transactionType: "PDC",
    formType: "",
    title: TransactionTitles.PostDatedCheques,
    drCr: "",
  },
];

export const exludedRoutes=[
  {title:TransactionTitles.ChequePayment,countries:[Countries.Saudi]},
  {title:TransactionTitles.ChequeReceipt,countries:[Countries.Saudi]},
]
export const isChooseVoucherEnabled = (title: string, userSession: UserModel) => [
  {title:TransactionTitles.CashPayment,countries:[Countries.Saudi]},
  {title:TransactionTitles.CashReceipt,countries:[Countries.Saudi]},
  {title:TransactionTitles.BankPayment,countries:[Countries.Saudi]},
  {title:TransactionTitles.BankReceipt,countries:[Countries.Saudi]},
  {title:TransactionTitles.OpeningBalance,countries:[Countries.Saudi]},
  {title:TransactionTitles.JournalEntry,countries:[Countries.Saudi]},
  {title:TransactionTitles.DebitNote,countries:[Countries.Saudi]},
  {title:TransactionTitles.CreditNote,countries:[Countries.Saudi]},
  {title:TransactionTitles.MultiJournalEntry,countries:[Countries.Saudi]},
].find(x => userSession.countryId != undefined &&  x.title == title && 
  (x.countries == undefined || (x.countries != undefined && x.countries.find(x => x == userSession.countryId)!= undefined)) )