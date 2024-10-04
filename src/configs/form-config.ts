import { initialDataCounter } from "../pages/settings/system/counters-manage-type";
import { initialDataRemainder } from "../pages/settings/system/remainder-manage-type";
import { initialDataVoucher } from "../pages/settings/system/vouchers-manage-type";
import { initialDataUser, initialDataUserType } from "../pages/settings/userManagement/user-manage-types";
import { ActionType } from "../redux/types";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const FORM_ENDPOINTS: ApiEndpoint[] = [
  { url: Urls.Users, initialData: initialDataUser },
  { url: Urls.UserTypes, initialData: initialDataUserType},
  { url: Urls.account_group, initialData: initialDataUser },
  { url: Urls.account_ledger, initialData: initialDataUser },
  { url: Urls.Counter, initialData: initialDataCounter },
  { url: Urls.Voucher, initialData: initialDataVoucher },
  { url: Urls.Remainder, initialData: initialDataRemainder},
] as const;