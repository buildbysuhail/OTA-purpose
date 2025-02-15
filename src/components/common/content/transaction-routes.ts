import VoucherType from "../../../enums/voucher-types";
import { UserAction } from "../../../helpers/user-right-helper";
import { Countries, UserModel } from "../../../redux/slices/user-session/reducer";
import { TransactionListTitles, TransactionTitles } from "./transaction-titles";
import { Wallet, CreditCard, FileText } from "lucide-react"; // Import icons from lucide-react

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
  listTitle: string;
  drCr: string;
  shortKey?: string;
  shortKeyList?: string;
  icon?: React.ElementType; // Changed to React.ElementType to accept Lucide icons
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
    listTitle: TransactionListTitles.CashPayment,
    drCr: "Dr",
    shortKey: "ctrl+alt+c",
    icon: Wallet // Using Wallet icon from lucide-react
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "CR",
    action: UserAction.Show,
    voucherType: VoucherType.CashReceipt,
    transactionType: "CashReceipt",
    formType: "",
    title: TransactionTitles.CashReceipt,
    listTitle: TransactionListTitles.CashReceipt,
    drCr: "Cr",
    shortKey: "ctrl+alt+r",
    icon: CreditCard 
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "BP",
    action: UserAction.Show,
    voucherType: VoucherType.BankPayment,
    transactionType: "BankPayment",
    formType: "",
    title: TransactionTitles.BankPayment,
    listTitle: TransactionListTitles.BankPayment,
    drCr: "Dr",
    shortKey: "ctrl+alt+b",
    icon: FileText 
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "BR",
    action: UserAction.Show,
    voucherType: VoucherType.BankReceipt,
    transactionType: "BankReceipt",
    formType: "",
    title: TransactionTitles.BankReceipt,
    listTitle: TransactionListTitles.BankReceipt,
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
    listTitle: TransactionListTitles.ChequePayment,
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
    listTitle: TransactionListTitles.ChequeReceipt,
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
    listTitle: TransactionListTitles.OpeningBalance,
    drCr: "",
    shortKey: "ctrl+alt+o"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "JV",
    action: UserAction.Show,
    voucherType: VoucherType.JournalVoucher,
    transactionType: "JournalEntry",
    formType: "",
    title: TransactionTitles.JournalEntry,
    listTitle: TransactionListTitles.JournalEntry,
    drCr: "",
    shortKey: "ctrl+alt+j"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "MJV",
    action: UserAction.Show,
    voucherType: VoucherType.MultiJournal,
    transactionType: "MultiJournalEntry",
    formType: "",
    title: TransactionTitles.MultiJournalEntry,
    listTitle: TransactionListTitles.MultiJournalEntry,
    drCr: "",
    shortKey: "ctrl+alt+m"
  },
  {
    transactionBase: TransactionBase.Accounts,
    formCode: "DN",
    action: UserAction.Show,
    voucherType: VoucherType.DebitNote,
    transactionType: "DebitNote",
    formType: "",
    title: TransactionTitles.DebitNote,
    listTitle: TransactionListTitles.DebitNote,
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
    listTitle: TransactionListTitles.CreditNote,
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
    listTitle: TransactionListTitles.TaxOnExpensePayment,
    visibleFn: (userSession: UserModel) => userSession.countryId == Countries.Saudi,
  },
];

export const exludedRoutes = [
  {title: TransactionTitles.ChequePayment, countries: [Countries.Saudi]},
  {title: TransactionTitles.ChequeReceipt, countries: [Countries.Saudi]},
];

export const isChooseVoucherEnabled = (title: string, userSession: UserModel) => [
  {title: TransactionTitles.CashPayment, countries: [Countries.Saudi]},
  {title: TransactionTitles.CashReceipt, countries: [Countries.Saudi]},
  {title: TransactionTitles.BankPayment, countries: [Countries.Saudi]},
  {title: TransactionTitles.BankReceipt, countries: [Countries.Saudi]},
  {title: TransactionTitles.OpeningBalance, countries: [Countries.Saudi]},
  {title: TransactionTitles.JournalEntry, countries: [Countries.Saudi]},
  {title: TransactionTitles.DebitNote, countries: [Countries.Saudi]},
  {title: TransactionTitles.CreditNote, countries: [Countries.Saudi]},
  {title: TransactionTitles.MultiJournalEntry, countries: [Countries.Saudi]},
].find(x => userSession.countryId != undefined && x.title == title && 
  (x.countries == undefined || (x.countries != undefined && x.countries.find(x => x == userSession.countryId) != undefined)));