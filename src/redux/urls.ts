import config from "../config";

export const domain = config.api.APP_API_URL;
export const signupUrl = import.meta.env.VITE_SIGNUP;
export const companyName = import.meta.env.VITE_COMPANY_NAME;

export const cdnUrl = import.meta.env.VITE_CDN_URL;
export const projectName = import.meta.env.VITE_PROJECT_NAME;

console.log(`Urls,  : project_name_data`, projectName);

const Urls = {
  domain,
  upload: "/",
  user: "/user",
  imgBaseUrl: "/",
  host: `${domain}/`,
  baseUrl: `${domain}/api`,

  // Dropdown - core
  data_countries: "/Data/Countries/",
  data_currencies: "/Data/Currencies/",
  data_industries: "/Data/Industries/",
  data_stock_valuation_methods: "/Data/StockValuationMethods/",
  data_salesRoute: "/Data/SalesRoutes/",
  data_form_type: "/Data/FormTypes/",
  data_warehouse: "/Data/Warehouses/",
  data_employees: "/Data/Employees",
  data_user_types: "/Data/UserTypes/",
  data_duties_taxes: "/Data/Duties&Taxes/",
  data_batchcriteria: "/Data/BatchCriterias/",
  data_pricectegory: "/Data/PriceCategories/",
  data_languages: "/Data/Languages/",
  data_counters: "/Data/Counters/",

  // Dropdown - accounts
  data_acc_groups: "/Accounts/Data/AccGroups/",
  data_Bank_Cards: "/Accounts/BankCards/",
  data_acc_ledgers: "/Accounts/Data/AccLedgers/",
  data_costcentres: "/Accounts/Data/CostCentres/",
  data_parties: "/Accounts/Data/Parties/",
  data_party_categories: "/Accounts/Data/PartyCategories/",
  data_privilage_cards: "/Accounts/Data/PrivilageCards/",
  data_projects: "/Accounts/Data/Projects/{partyID}}",
  data_upis: "/Accounts/Data/UPIs/",
  data_bankcards: "/Accounts/BankCards/",
  data_vouchertype: "/Accounts/Data/VoucherType",
  data_InputCalamity: "/Accounts/Data/InputCalamity",
  data_FormTypeBySI: "/Accounts/Data/FormTypeBySI",
  data_FormTypeBySR: "/Accounts/Data/FormTypeBySR",
  data_VPrefixForSI: "/Accounts/Data/VPrefixForSI",
  data_VPrefixForSR: "/Accounts/Data/VPrefixForSR",
  data_CashLedgers: "/Accounts/Data/CashLedgers",
  data_SuspenseAccount: "/Accounts/Data/SuspenseAccount",
  data_BankAccounts: "/Accounts/Data/BankAccounts",
  data_SalesAccount: "/Accounts/Data/SalesAccount",
  data_FormTypeByPI: "/Accounts/Data/FormTypeByPI",
  data_FormTypeByPR: "/Accounts/Data/FormTypeByPR",


  // Dropdown - inventory
  data_productgroup: "/Inventory/Data/ProductGroup",
  data_products: "/Inventory/Data/Products",
  data_brands: "/Inventory/Data/Brands",
  data_color: "/Inventory/Data/Color",
  data_warranty: "/Inventory/Data/Warranty",
  data_sections: "/Inventory/Data/Sections",
  data_groupcategory: "/Inventory/Data/GroupCategory",

  //Dropdown - settings
  data_base_currency: "/Core/ExchangeRates/GetExchangeRatesData/",
  data_company_id: "/Core/Branch/GetBranchData",

  // Auth
  login: "/login/",
  logout: "/logout/",
  password_reset: "/passwordReset/",
  password_reset_confirm: "/resetPassword/",
  social_signup: "/socialSignup/",
  set_branch: "/Subscription/Auth/SetBranch/",
  SendEmailToken: "/Subscription/Auth/SendEmailToken",
  ValidateToken: "/Subscription/Auth/ValidateToken",

  // App
  application_setting: "/Core/ApplicationSettings/",
  getUserAppSetting: "/User/getUserAppSetting/",
  updateUserAppSetting: "/User/updateUserAppSetting",

  // AccountSettings/Profile
  uploadUserImage: "/Subscription/Profile/UploadUserImage/",
  changeEmailRequest_profile: "/Subscription/Profile/ChangeEmailRequest/",
  verifyEmail_profile: "/Subscription/Profile/VerifyEmail/",
  changePhoneRequest_profile: "/Subscription/Profile/ChangePhoneRequest/",
  changePhone: "/Subscription/Profile/ChangePhone/",
  verifyPhone_profile: "/Subscription/Profile/VerifyPhone/",
  updateUserBasicInfo: "/Subscription/Profile/ChangeBasicInfo/",
  getUserBasicInfo: "/Subscription/Profile/GetBasicInfo/",
  getEmail_profile: "/Subscription/Profile/GetEmail/",
  getPhone_profile: "/Subscription/Profile/GetPhone/",
  getImage_profile: "/Subscription/Profile/GetProfileImage/",
  getUserSession: "/Core/LoginSessions/GetAllAsync/",
  logoutUserSession: "/Core/LoginSessions/InActiveSession/",
  uploadCompanyLogo: "/Subscription/WorkSpace/UploadCompanyLogo/",
  changeEmailRequest_workspace: "/Subscription/WorkSpace/ChangeEmailRequest/",
  verifyEmail_workspace: "/Subscription/WorkSpace/VerifyEmail/",
  updateCompanyEmail_workspace:
    "/Subscription/WorkSpace/UpdateCompanyEmailAsync/",
  UpdateCompanyPhone_workspace:
    "/Subscription/WorkSpace/UpdateCompanyPhoneAsync/",
  changePhoneRequest_workspace: "/Subscription/WorkSpace/ChangePhoneRequest/",
  changePhone_workspace: "/Subscription/WorkSpace/UpdateCompanyPhoneAsync/",
  verifyPhone_workspace: "/Subscription/WorkSpace/VerifyPhone/",
  changeBasicInfo_workspace: "/Subscription/WorkSpace/ChangeBasicInfo/",
  changeAddress_workspace: "/Subscription/WorkSpace/ChangeAddress/",
  getBasicInfo_workspace: "/Subscription/WorkSpace/GetBasicInfo/",
  getEmail_workspace: "/Subscription/WorkSpace/GetEmail/",
  getPhone_workspace: "/Subscription/WorkSpace/GetPhone/",
  getLogo_workspace: "/Subscription/WorkSpace/GetLogo/",
  getAddress_workspace: "/Subscription/WorkSpace/GetAddress/",
  delete_workspace: "/Subscription/WorkSpace/DeleteWorkspace/",
  get_members: "/Subscription/WorkSpace/GetMembers/",

  // AccountSettings/Security
  updatePassword: "/Subscription/AccountSettings/Security/ResetPassword/",

  // AccountSettings/Preferences
  updateLanguage: "/Core/Preferences/UpdateLanguage/",
  updatePreference: "/Core/Preferences/UpdatePreference/",
  updateDateRegion: "/Core/Preferences/UpdateDateRegion/",
  updateUserThemes: "/Core/Preferences/UpdateUserThemes/",
  getLanguage: "/Core/Preferences/GetLanguage/",
  getPreference: "/Core/Preferences/GetPreference/",
  getDateRegion: "/Core/Preferences/GetDateRegion/",
  getUserThemes: "/Core/Preferences/GetUserThemes/",

  // AccountSettings/UserBranches
  userBranches: "/Core/UserBranches/",
  deleteUserBranches: "/Core/UserBranches/{Id}/",
  //setting
  //setting/userManagement
  Users: "/Subscription/User/",
  // getUserSubscripeByName:'/Subscription/User/GetUser/:id?UserName=',
  patchUserSubscriped: "/Subscription/User/EditUser/",
  UserTypes: "/Core/UserType/",
  usreRights: "/Core/UserRights",
  user_rights: "/Core/UserRights/",

  //setting/Administrations
  CompanyProfiles: "/Core/CompanyProfile/",
  Branch: "/Core/Branch/",
  BranchInfo: "/Core/Branch/BranchInfo",
  BankPosSettings: "/Core/BankPOS/AddCounter/",
  deleteInactiveTransactions: "/Core/DeleteInActive/",

  //setting/system
  Counter: "/Core/Counter/",
  Voucher: "/Core/Vouchers/",
  FinancialYear: "/Core/FinancialYear/",
  DayClose: "/Core/DayClose/",
  Remainder: "/Core/Remainder/",
  userActionReport: "/Core/UserAction/",
  currencyExchange: "/Core/ExchangeRates/",
  postCurrency: "/Accounts/Currency/",
  authorization_settings: "/Core/Authorization/",
  reset_data_base: "/Core/ResetDataBase/",
  application_settings: "/Core/ApplicationSettings/",
  sql_commands: "/Core/SQLCommand",
  notification_provider: "/Core/NotificationProvider/",
  notification_transaction: "/Core/TransactionNotification",
  notification_template: "/Core/NotificationTemplate",
  headers_footers: "/Core/HeaderFooter/",
  //setings/AdvanceOptions
  // advanceOptions:"/Core/AdvancedOptions",
  revertBillModifications: "/Core/AdvancedOptions",
  branchDataReset: "/Core/AdvancedOptions/BranchDataReset",
  // refresh all branches
  refreshAllBranches: "/Core/RefreshAllBranch/RefreshAllBranch/",
  //barcode
  barcodePrintGrid: "/Core/BarcodePrint/GetBarcodePrintGrid/",
  barcodePrintTransaction: "/Core/BarcodePrint/GetBarcodePrintGridFromTransaction/",
  // Accounts Start
  // Masters
  account_group: "/Accounts/AccGroup/",
  account_ledger: "/Accounts/AccLedger/",
  cost_center: "/Accounts/CostCenter/",
  account_privilege_card: "/Accounts/PrivilegeCards",
  branch_ledger: "/Accounts/BranchLedgers/",
  account_party_category: "/Accounts/PartyCategory/",
  account_currency_master: "/Accounts/Currency/",
  chart_of_accounts: "/Accounts/ChartofAccounts/",
  parties: "/Accounts/Parties/",
  cust_supp_ledger: "/Accounts/CustSuppLedger",
  //Reports
  acc_reports_aging_payable: "/Accounts/RptAging/AgingPayable/",
  acc_reports_aging_receivable: "/Accounts/RptAging/AgingReceivable/",
  acc_reports_aging_payable_direct: "/Accounts/RptAging/AgingPayableskiptake/",
  acc_reports_aging_receivable_direct: "/Accounts/RptAging/AgingReceivableSkiptake/",
  // Accounts End


  //Templates
  templates: "/Core/Template/",
  crm_templates: "/Core/Template/CRM/",

  // Tax Treatments
  tax_treatment: "api/tax_treatment/",

  //Import Excel
  import_parties: "/Accounts/Import/Parties"
};

export default Urls;
