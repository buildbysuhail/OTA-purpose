import { UserAction } from "../../../helpers/user-right-helper";

export interface TransactionRoute {
  formCode: string;
  action: UserAction;
  voucherType: string;
  transactionType: string;
  voucherPrefix: string;
  formType: string;
  title: string;
  drCr: string;
  voucherNo: number;
}
export const transactionRoutes = [
  {
    formCode: "CP",
    action: UserAction.Show,
    voucherType: "",
    transactionType: "cash-payment",
    formType: "",
    voucherPrefix: "",
    title: "",
    drCr: "",
  },
  {
    formCode: "CP",
    action: UserAction.Show,
    voucherType: "",
    transactionType: "cash-e-payment",
    formType: "",
    voucherPrefix: "",
    title: "",
    drCr: ""
  },
  // Add more routes as needed
];