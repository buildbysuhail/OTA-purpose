import { ActionType } from "../redux/types";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const DATA_ENDPOINTS: ApiEndpoint[] = [
  { url: Urls.data_languages, method: ActionType.GET as const },
  { url: Urls.data_countries, method: ActionType.GET as const },
  { url: Urls.data_currencies, method: ActionType.GET as const },
  { url: Urls.data_industries, method: ActionType.GET as const },
  { url: Urls.data_stock_valuation_methods, method: ActionType.GET as const },
  { url: Urls.data_salesRoute, method: ActionType.GET as const },
  { url: Urls.data_counters, method: ActionType.GET as const },

  // Dropdown - accounts
  { url: Urls.data_acc_groups, method: ActionType.GET as const },
  { url: Urls.data_acc_ledgers, method: ActionType.GET as const },
  { url: Urls.data_costcentres, method: ActionType.GET as const },
  { url: Urls.data_parties, method: ActionType.GET as const },
  { url: Urls.data_party_categories, method: ActionType.GET as const },
  { url: Urls.data_privilage_cards, method: ActionType.GET as const },
  { url: Urls.data_projects, method: ActionType.GET as const },
  { url: Urls.data_upis, method: ActionType.GET as const },
  { url: Urls.data_pricectegory, method: ActionType.GET as const },
  { url: Urls.data_FormTypeBySI, method: ActionType.GET as const },
  { url: Urls.data_FormTypeBySR, method: ActionType.GET as const },
  { url: Urls.data_FormTypeByPI, method: ActionType.GET as const },
  { url: Urls.data_FormTypeByPR, method: ActionType.GET as const },
  { url: Urls.data_BankAccounts, method: ActionType.GET as const },
  { url: Urls.data_PurchaseAccount, method: ActionType.GET as const },
  { url: Urls.data_acc_Branches, method: ActionType.GET as const },

  // settings
  { url: Urls.data_base_currency, method: ActionType.GET as const },
  { url: Urls.data_company_id, method: ActionType.GET as const },
  { url: Urls.data_user_types, method: ActionType.GET as const },
  { url: Urls.data_employees, method: ActionType.GET as const },
  { url: Urls.data_warehouse, method: ActionType.GET as const },
  { url: Urls.data_vouchertype, method: ActionType.GET as const },
  { url: Urls.sql_commands, method: ActionType.POST as const },
  // { url: Urls.advanceOptions, method: ActionType.POST as const },
    { url: Urls.revertBillModifications, method: ActionType.POST as const },
      { url: Urls.branchDataReset, method: ActionType.POST as const },
  ////////
  { url: Urls.updateLanguage, method: ActionType.POST as const },
  { url: Urls.updateUserThemes, method: ActionType.POST as const },
  { url: Urls.updateLanguage, method: ActionType.POST as const },
] as const;
