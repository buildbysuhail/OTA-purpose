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
  data_states: "/Data/States/",
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
  data_templates: "/Data/Templates/",
  data_cashLedger: "/Data/CashLedgers/",
  // Dropdown - accounts
  data_acc_groups: "/Accounts/Data/AccGroups/",
  data_acc_Branches: "/Data/BranchWithoutDefault",
  data_acc_ledgers: "/Accounts/Data/AccLedgers/",
   data_acc_ledgers_Code: "/Accounts/Data/LedgerCode/",
  data_costcentres: "/Accounts/Data/CostCentres/",
  data_parties: "/Accounts/Data/Parties/",
  data_party_categories: "/Accounts/Data/PartyCategories/",
  data_privilage_cards: "/Accounts/Data/PrivilageCards/",
  data_projects: "/Accounts/Data/Projects/",
  data_projects_by_ledgerid: "/Accounts/Data/ProjectsByLedger/",
  data_upis: "/Accounts/Data/UPIs/",
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
  data_PurchaseAccount: "/Accounts/Data/PurchaseAccount/",
  data_BranchRecPayAccount: "/Accounts/Data/BranchRecPayAccount/",
  data_CustSupp: "/Accounts/Data/CustomerAndSupplier/",

  // Dropdown - inventory
  data_productgroup: "/Inventory/Data/ProductGroup",
  data_products: "/Inventory/Data/Products",
  data_brands: "/Inventory/Data/Brands",
  data_color: "/Inventory/Data/Color",
  data_warranty: "/Inventory/Data/Warranty",
  data_sections: "/Inventory/Data/Sections",
  data_groupcategory: "/Inventory/Data/GroupCategory",
  data_getNextLedgerCode: "/Accounts/AccLedger/GetNextLedgerCode/",
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
  getInputBox: "/Core/Preferences/ResetTheme",
  // AccountSettings/UserBranches
  userBranches: "/Core/UserBranches/",
  deleteUserBranches: "/Core/UserBranches/{Id}/",
  //setting
  //setting/userManagement
  Users: "/Subscription/User/",
  // getUserSubscripeByName:'/Subscription/User/GetUser/:id?UserName=',
  patchUserSubscriped: "/Subscription/User/EditUser/",
  UserTypes: "/Core/UserType/",
  user_rights: "/Core/UserRights/",

  //setting/Administrations
  CompanyProfiles: "/Core/CompanyProfile/",
  CompanyProfileIndia: "/Core/CompanyDetails/",
  Branch: "/Subscription/Branch/",
  BranchInfo: "/Core/Branch/BranchInfo/",
  branch_code: "/Branch/GetNextBranchCode/",
  BankPosSettings: "/Core/BankPOS/AddCounter/",
  deleteInactiveTransactions: "/Core/DeleteInActive/",

  //setting/system
  get_userLedger_by_user_id:"/api/Accounts/AccLedger/GetUserLedgerByUserID/",
  
  counter_settings: "/Core/CounterSettings/",
  counter_settings_current_data: "/Core/CounterSettings/GetCurrentCounter/",
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
  application_settings_virtual: "/Core/ApplicationSettings/Virtual/",
  application_settings_GetSettingsScreen:'/Core/Preferences/GetSettingsScreen',
  application_settings_UpdateSettingsScreen:'/Core/Preferences/UpdateSettingsScreen',
  sql_commands: "/Core/SQLCommand/",
  notification_provider: "/Core/NotificationProvider/",
  notification_transaction: "/Core/TransactionNotification",
  notification_template: "/Core/NotificationTemplate/",
  headers_footers: "/Core/HeaderFooter/",
  eWayBill: "/Core/EWayBillGST/",
  eInvoiceGST: "/Core/EInvoiceGST/",
  //setings/AdvanceOptions
  // advanceOptions:"/Core/AdvancedOptions",
  revertBillModifications: "/Core/AdvancedOptions/",
  branchDataReset: "/Core/AdvancedOptions/BranchDataReset/",
  // refresh all branches
  refreshAllBranches: "/Core/RefreshAllBranch/RefreshAllBranch/",
  //barcode
  barcodePrintGrid: "/Core/BarcodePrint/GetBarcodePrintGrid/",
  barcodePrintTransaction: "/Core/BarcodePrint/GetBarcodePrintGridFromTransaction/",
  // Accounts Start
  // Masters
  hide_Ledger: "/Accounts/HideLedger/",
  account_group: "/Accounts/AccGroup/",
  account_ledger: "/Accounts/AccLedger/",
  cost_center: "/Accounts/CostCenter/",
  account_privilege_card: "/Accounts/PrivilegeCards/",
  branch_ledger: "/Accounts/BranchLedgers/",
  account_party_category: "/Accounts/PartyCategory/",
  account_currency_master: "/Accounts/Currency/",
  chart_of_accounts: "/Accounts/ChartofAccounts/",
  chart_of_accounts_new: "/Accounts/ChartofAccounts/chartOfAccounts",
  parties: "/Accounts/Parties/",
  get_next_party_code: "/Accounts/Parties/GetNextPartyCode/",
  cust_supp_ledger: "/Accounts/CustSuppLedger/",
  upi: "/Accounts/UPI/",
  acc_group_order: "/Accounts/AccGroupOrderArrangement/",
  bankCards: "/Accounts/BankCards/",
  acc_user_config:"",
  acc_attachment_upload:"/Core/AttachmentInfo/Upload/",
  acc_attachmentInfo_download:"/Core/AttachmentInfo/Download/",
  //Reports Start
  acc_reports_ledger: "/Accounts/RptLedgerReport/LedgerReport/",
  acc_reports_cash_book: "/Accounts/RptCashBook/CashBookLedgerSummary/",
  acc_reports_cash_book_monthwise: "/Accounts/RptCashBook/CashBookMonthwiseSummary/",
  acc_reports_cash_book_daywise: "/Accounts/RptCashBook/CashBookDaywiseSummary/",
  acc_reports_cash_book_transactionwise: "/Accounts/RptCashBook/CashBookDetailed/",
  acc_reports_day_book_detailed: "/Accounts/RptDayBook/DayBookDetailed/",
  acc_reports_day_book_summary: "/Accounts/RptDayBook/DayBookSummary/",
  acc_reports_day_book_billwise: "/Accounts/RptDayBook/DayBookSummaryBillwise/",
  acc_reports_payment: "/Accounts/RptPaymentReport/PaymentReport/",
  acc_reports_collection: "/Accounts/RptCollectionReport/CollectionReport/",
  acc_reports_cash_summary: "/Accounts/RptCashSummaryReport/CashSummary/",
  acc_reports_cash_summary_ledgerwise: "/Accounts/RptCashSummaryReport/CashSummaryLedgerwise/",
  acc_reports_transaction: "/Accounts/RptReports/TransactionReport/",
  acc_reports_inventory_history: "/Accounts/RptTransactionHistory/TransactionHistoryInventory/",
  acc_reports_inventory_history_popup: "/Accounts/RptTransactionHistory/ShowTransHistoryInventoryPopUp/",
  acc_reports_inventory_history_details: "/Accounts/RptTransactionHistory/ShowTransHistoryInventoryDetails/",
  acc_reports_accounts_history: "/Accounts/RptTransactionHistory/TransactionHistoryAccounts/",
  acc_reports_accounts_history_popup: "/Accounts/RptTransactionHistory/ShowTransHistoryAccountsPopUp/",
  acc_reports_daily_summary_global: "/Accounts/RptDailySummaryReport/DailySummaryReportGlobal/",
  acc_reports_daily_summary: "/Accounts/RptDailySummaryReport/DailySummaryReport/",
  acc_reports_daily_summary_detailed: "/Accounts/RptDailySummaryReport/DailySummaryDetailedReport/",
  acc_reports_daily_summary_credit_details: "/Accounts/RptDailySummaryReport/CreditSalesReportDaily/",
  acc_reports_daily_summary_receipt_details: "/Accounts/RptDailySummaryReport/SelectCashReceiptReportDaily/",
  acc_reports_billwise_profit: "/Accounts/RptBillWsieProfitReport/BillwiseProfit/",
  acc_reports_billwise_profit_global: "/Accounts/RptBillWsieProfitReport/BillwiseProfitGlobal/",
  acc_reports_party_summary_basic_info: "/Accounts/RptPartyWiseSummary/BasicInfo/",
  acc_reports_party_summary_ledger: "/Accounts/RptPartyWiseSummary/Ledger/",
  acc_reports_party_summary_payment: "/Accounts/RptPartyWiseSummary/Payment/",
  acc_reports_party_summary_collections: "/Accounts/RptPartyWiseSummary/collections/",
  acc_reports_party_summary_purchase: "/Accounts/RptPartyWiseSummary/Purchase/",
  acc_reports_party_summary_sales: "/Accounts/RptPartyWiseSummary/Sales/",
  acc_reports_party_summary_purchase_return: "/Accounts/RptPartyWiseSummary/PurchaseReturn/",
  acc_reports_party_summary_purchase_order: "/Accounts/RptPartyWiseSummary/PurchaseOrder/",
  acc_reports_party_summary_sales_return: "/Accounts/RptPartyWiseSummary/SalesReturn/",
  acc_reports_party_summary_sales_order: "/Accounts/RptPartyWiseSummary/SalesOrder/",

  acc_reports_payable: "/Accounts/RptOutstandingReport/Payable/",
  acc_reports_receivable: "/Accounts/RptOutstandingReport/Receivable/",

  acc_reports_aging_payable: "/Accounts/RptAging/AgingPayable/",
  acc_reports_aging_receivable: "/Accounts/RptAging/AgingReceivable/",
  acc_reports_aging_analysis: "/Accounts/RptAging/AgingAnalysisReport/",

  acc_reports_trial_balance: "/Accounts/RptReports/TrialBalance/",
  acc_reports_trial_balance_detailed: "/Accounts/RptReports/TrialBalancePeriodwise/",
  acc_reports_balance_sheet: "/Accounts/RptReports/BalanceSheet/",
  acc_reports_balance_sheet_vertical: "/Accounts/RptReports/BalanceSheetDetailed/",
  acc_reports_account_ledger_balance_view: "/Accounts/RptReports/AccountLedgerBalanceView/",
  acc_reports_profit_and_loss: "/Accounts/RptReports/ProfitAndLoss/",
  acc_reports_profit_and_loss_detailed: "/Accounts/RptReports/ProfitAndLossDetailed/",
  acc_reports_account_ledger_balance_view_sub_group_inc: "/Accounts/RptReports/AccountLedgerBalanceViewSubGroupIncluded/",
  acc_reports_closing_stock_details: "/Accounts/RptReports/ClosingStockDetails/",


  acc_reports_outstanding_aging_receivable: "/Accounts/RptAging/OutstandingAgingReceivable/",
  acc_reports_outstanding_aging_payable: "/Accounts/RptAging/OutstandingAgingPayable/",

//inventory
inv_reports_price_list:"",
inv_reports_stock_ledger:"",
inv_reports_balance_report:"",
inv_reports_opening_stock:"",
inv_reports_stock_flow:"",

//Report End

  // Transaction
  
  acc_transaction_base: "/api/Accounts/",
  acc_transaction_ledger_bill_wise: "/Accounts/BillwiseMaster",
  acc_transaction_is_bill_wise_trans_adjustment_exists: "/Accounts/IsBillwiseTransAdjustmentExists",

  // Accounts End
  //Grid Preference
  grid_preference:"/Core/GridPreference",
  //Templates
  templates: "/Core/Template/",
  crm_templates: "/Core/Template/CRM/",

  // Tax Treatments
  tax_treatment: "api/tax_treatment/",

  //Import Excel
  import_parties: "/Accounts/Import/Parties/",
  import_parties_excel: "/Accounts/Import/PartiesExcel/",
  download_party_format: "/Accounts/Import/DownloadPartyFormat/",
  import_privilegeCards: "/Accounts/Import/PrivilegeCards/",
  import_privilegeCards_Excel: "/Accounts/Import/PrivilegeCardsExcel/",
  download_privilegeCards_format: "/Accounts/Import/DownloadPrivilegeCardsFormat/",

  // Inventory
  productGroup: "/Inventory/ProductGroup/",
  productCategory: "/Inventory/ProductCategory/",
  brands: "/Inventory/Brands/",
  priceCategory: "/Inventory/PriceCategory/",
  unitOfMeasure: "/Inventory/UnitofMeasures/",
  vehicles: "/Inventory/Vehicles/",
  Warehouse: "/Inventory/Warehouse/",
  taxCategory: "/Inventory/TaxCategory/",
  sales_man_route: "/Inventory/SalesManRoute/",
  salesRoute: "/Inventory/SalesRoute/",
  section: "/Inventory/Section/",
  group_category: "/Inventory/GroupCategory/",

  //Transaction
    // common
    get_last_voucher_no: "/Core/TransactionBase/GetNextVoucherNumber/",
    get_ledger_balance: "/Core/TransactionBase/GetLedgerBalance/",
    upsert_bill_modified_history: "/Core/TransactionBase/UpsertBillModifiedHistory/",
    unlock_acc_transaction_master: "/Core/TransactionBase/UnlockAccTransactionMaster/",
    ledgerDataForTransaction: "/Core/TransactionBase/ledgerDataForTransaction/",
    voucher_selector: "/Core/VoucherSelector/",

};

export default Urls;
