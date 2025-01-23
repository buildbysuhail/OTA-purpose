import VoucherType from "../../../enums/voucher-types";
import { UserAction } from "../../../helpers/user-right-helper";
import { Countries, UserModel } from "../../../redux/slices/user-session/reducer";
import { TransactionTitles } from "./transaction-titles";
export enum TransactionBase {
  Accounts = "/accounts/transactions",
}
export interface TransactionRoute {
  formCode: string;
  transactionBase: TransactionBase;
  action: UserAction;
  voucherType: string;
  transactionType: string;
  formType: string;
  title: string;
  drCr: string;
  shortKey?: string;
  shortKeyList?:string;
  visibleFn?: (userSession: UserModel) => boolean;
}
export const transactionRoutes: TransactionRoute[] = [
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "CP",
    action: UserAction.Show,
    voucherType: VoucherType.CashPayment,
    transactionType: "CashPayment",
    formType: "",
    title: TransactionTitles.CashPayment,
    drCr: "Dr",
    shortKey:"ctrl+alt+c"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "CR",
    action: UserAction.Show,
    voucherType: VoucherType.CashReceipt,
    transactionType: "CashReceipt",
    formType: "",
    title: TransactionTitles.CashReceipt,
    drCr: "Cr",
    shortKey: "ctrl+alt+r"
  },
  // {
  //   transactionBase: TransactionBase.Accounts,
  //   formCode: "CPE",
  //   action: UserAction.Show,
  //   voucherType: VoucherType.CashPaymentEstimate,
  //   transactionType: "CashPaymentEstimate",
  //   formType: "",
  //   title: TransactionTitles.CashPaymentEstimate,
  //   drCr: "Dr",
  //   shortKey: "ctrl+alt+shift+c",
  //   visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  // },
  // {
  //   transactionBase: TransactionBase.Accounts,
  //   formCode: "CRE",
  //   action: UserAction.Show,
  //   voucherType: VoucherType.CashReceiptEstimate,
  //   transactionType: "CashReceiptEstimate",
  //   formType: "",
  //   title: TransactionTitles.CashReceiptEstimate,
  //   drCr: "Cr",
  //   shortKey: "ctrl+alt+shift+r",
  //   visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  // },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "BP",
    action: UserAction.Show,
    voucherType: VoucherType.BankPayment,
    transactionType: "BankPayment",
    formType: "",
    title: TransactionTitles.BankPayment,
    drCr: "Dr",
    shortKey: "ctrl+alt+b"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "BR",
    action: UserAction.Show,
    voucherType: VoucherType.BankReceipt,
    transactionType: "BankReceipt",
    formType: "",
    title: TransactionTitles.BankReceipt,
    drCr: "Cr",
    shortKey: "ctrl+alt+k"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "CQP",
    action: UserAction.Show,
    voucherType: VoucherType.ChequePayment,
    transactionType: "ChequePayment",
    formType: "",
    title: TransactionTitles.ChequePayment,
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "CQR",
    action: UserAction.Show,
    voucherType: VoucherType.ChequeReceipt,
    transactionType: "ChequeReceipt",
    formType: "",
    title: TransactionTitles.ChequeReceipt,
    drCr: "Cr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "OB",
    action: UserAction.Show,
    voucherType: VoucherType.OpeningBalance,
    transactionType: "OpeningBalance",
    formType: "",
    title: TransactionTitles.OpeningBalance,
    drCr: "",
    shortKey: "ctrl+alt+o"
  },
  // {
  //   transactionBase: TransactionBase.Accounts,
  //   formCode: "JV",
  //   action: UserAction.Show,
  //   voucherType: VoucherType.JournalVoucher,
  //   transactionType: "JournalEntry",
  //   formType: "",
  //   title: TransactionTitles.JournalEntry,
  //   drCr: "",
  //   shortKey: "ctrl+alt+j"
  // },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "MJV",
    action: UserAction.Show,
    voucherType: VoucherType.MultiJournal,
    transactionType: "MultiJournalEntry",
    formType: "",
    title: TransactionTitles.MultiJournalEntry,
    drCr: "",
    shortKey: "ctrl+alt+m"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "JVSP",
    action: UserAction.Show,
    voucherType: VoucherType.JournalVoucherSpecial,
    transactionType: "JournalEntrySpecial",
    formType: "",
    title: TransactionTitles.JournalEntrySpecial,
    drCr: "",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.India,
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "DN",
    action: UserAction.Show,
    voucherType: VoucherType.DebitNote,
    transactionType: "DebitNote",
    formType: "",
    title: TransactionTitles.DebitNote,
    drCr: "Dr",
    shortKey: "ctrl+alt+d"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "CN",
    action: UserAction.Show,
    voucherType: VoucherType.CreditNote,
    transactionType: "CreditNote",
    formType: "",
    title: TransactionTitles.CreditNote,
    drCr: "Cr",
    shortKey: "ctrl+alt+n"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "TXP",
    action: UserAction.Show,
    voucherType: VoucherType.TaxOnExpensePayment,
    transactionType: "TXPayment",
    formType: "VAT",
    title: TransactionTitles.TaxOnExpensePayment,
    drCr: "Dr",
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.Saudi,
  },
  // {
  //   transactionBase: TransactionBase.Accounts,
  //   formCode: "BRC",
  //   action: UserAction.Show,
  //   voucherType: VoucherType.BankReconciliation,
  //   transactionType: "BankReconciliation",
  //   formType: "",
  //   title: TransactionTitles.BankReconciliation,
  //   drCr: "",
  // },
  // {
  //   transactionBase: TransactionBase.Accounts,
  //   formCode: "PDC",
  //   action: UserAction.Show,
  //   voucherType: VoucherType.PostDatedCheques,
  //   transactionType: "PDC",
  //   formType: "",
  //   title: TransactionTitles.PostDatedCheques,
  //   drCr: "",
  // },
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