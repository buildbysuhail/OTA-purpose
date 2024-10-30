import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface popupDataProps {
  isOpen?: boolean | false;
  key?: any | null;
  mode?: "add" | "edit" | "view";
  reload?: boolean;
}
interface popupData {
  userType: popupDataProps
  userTypePrivilege: popupDataProps
  user: popupDataProps
  counter: popupDataProps
  voucher: popupDataProps
  financialYear: popupDataProps
  deleteInactiveTransactions: popupDataProps
  companyProfile: popupDataProps
  bankPos: popupDataProps
  branch: popupDataProps
  dayClose: popupDataProps
  reminder: popupDataProps
  userActionReport: popupDataProps
  importExport: popupDataProps
  currencyExchange: popupDataProps
  resetDataBase: popupDataProps
  commands: popupDataProps
  accountGroup: popupDataProps
  accountLedger: popupDataProps
  costCentre: popupDataProps
  branchLedger: popupDataProps
  authorizationSettings: popupDataProps
  barcodeprint: popupDataProps
  exchangeRates: popupDataProps
  branchGrid: popupDataProps
  privilegeCard: popupDataProps
  partyCategory: popupDataProps
  currencyMaster: popupDataProps
  revertBillModifications: popupDataProps
  resetBranchDataForSync: popupDataProps
  refreshAllBranches: popupDataProps
  bankCard: popupDataProps
  chartOfAccounts: popupDataProps
  parties: popupDataProps
  headAndFooter: popupDataProps
  miscellaneousSettings: popupDataProps
  eWayBillTaxPro: popupDataProps
  eInvoiceGST: popupDataProps
  upi:popupDataProps
  productGroup:popupDataProps
  productCategory:popupDataProps
  brands:popupDataProps
  priceCategory:popupDataProps
  unitOfMeasure:popupDataProps
  vehicles:popupDataProps
}
const initialState: popupData = {
  upi: { isOpen: false, key: null, mode: "edit", reload: true },
  miscellaneousSettings: { isOpen: false, key: null, mode: "edit", reload: true },
  headAndFooter: { isOpen: false, key: null, mode: "edit", reload: true },
  userTypePrivilege: { isOpen: false, key: null, mode: "edit", reload: true },
  userType: { isOpen: false, key: null, mode: "edit", reload: true },
  user: { isOpen: false, key: null, mode: "edit", reload: true },
  counter: { isOpen: false, key: null, mode: "edit", reload: true },
  voucher: { isOpen: false, key: null, mode: "edit", reload: true },
  financialYear: { isOpen: false, key: null, mode: "edit", reload: true },
  deleteInactiveTransactions: { isOpen: false, key: null, mode: "edit", reload: true },
  companyProfile: { isOpen: false, key: null, mode: "edit", reload: true },
  bankPos: { isOpen: false, key: null, mode: "edit", reload: true },
  branch: { isOpen: false, key: null, mode: "edit", reload: true },
  dayClose: { isOpen: false, key: null, mode: "edit", reload: true },
  reminder: { isOpen: false, key: null, mode: "edit", reload: true },
  userActionReport: { isOpen: false, key: null, mode: "edit", reload: true },
  importExport: { isOpen: false, key: null, mode: "edit", reload: true },
  currencyExchange: { isOpen: false, key: null, mode: "edit", reload: true },
  resetDataBase: { isOpen: false, key: null, mode: "edit", reload: true },
  commands: { isOpen: false, key: null, mode: "edit", reload: true },
  accountGroup: { isOpen: false, key: null, mode: "edit", reload: true },
  accountLedger: { isOpen: false, key: null, mode: "edit", reload: true },
  costCentre: { isOpen: false, key: null, mode: "edit", reload: true },
  branchLedger: { isOpen: false, key: null, mode: "edit", reload: true },
  authorizationSettings: { isOpen: false, key: null, mode: "edit", reload: true },
  barcodeprint: { isOpen: false, key: null, mode: "edit", reload: true },
  exchangeRates: { isOpen: false, key: null, mode: "edit", reload: true },
  branchGrid: { isOpen: false, key: null, mode: "edit", reload: true },
  privilegeCard: { isOpen: false, key: null, mode: "edit", reload: true },
  partyCategory: { isOpen: false, key: null, mode: "edit", reload: true },
  currencyMaster: { isOpen: false, key: null, mode: "edit", reload: true },
  revertBillModifications: { isOpen: false, key: null, mode: "edit", reload: true },
  resetBranchDataForSync: { isOpen: false, key: null, mode: "edit", reload: true },
  refreshAllBranches: { isOpen: false, key: null, mode: "edit", reload: true },
  bankCard: { isOpen: false, key: null, mode: "edit", reload: true },
  chartOfAccounts: { isOpen: false, key: null, mode: "edit", reload: true },
  parties: { isOpen: false, key: null, mode: "edit", reload: true },
  eWayBillTaxPro: { isOpen: false, key: null, mode: "edit", reload: true },
  eInvoiceGST: { isOpen: false, key: null, mode: "edit", reload: true },
  productGroup: { isOpen: false, key: null, mode: "edit", reload: true },
  productCategory: { isOpen: false, key: null, mode: "edit", reload: true },
  brands: { isOpen: false, key: null, mode: "edit", reload: true },
  priceCategory: { isOpen: false, key: null, mode: "edit", reload: true },
  unitOfMeasure: { isOpen: false, key: null, mode: "edit", reload: true },
  vehicles: { isOpen: false, key: null, mode: "edit", reload: true },
};

const popupDataSlice = createSlice({
  name: 'popupData',
  initialState,
  reducers: {
    toggleUserTypePrivilegePopup: (state, action: PayloadAction<popupDataProps>) => {

      state.userTypePrivilege = action.payload;
    },
    toggleUserTypePopup: (state, action: PayloadAction<popupDataProps>) => {

      state.userType = action.payload;
    },
    toggleUserPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.user = action.payload;
    },
    toggleCounterPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.counter = action.payload;
    },
    toggleVoucherPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.voucher = action.payload;
    },
    toggleFinancialYearPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.financialYear = action.payload;
    },
    toggleDeleteInactiveTransactionPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.deleteInactiveTransactions = action.payload;
    },
    toggleCompanyProfilePopup: (state, action: PayloadAction<popupDataProps>) => {

      state.companyProfile = action.payload;
    },
    toggleBankPosPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.bankPos = action.payload;
    },
    toggleBranchPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.branch = action.payload;
    },
    toggleDayClosePopup: (state, action: PayloadAction<popupDataProps>) => {

      state.dayClose = action.payload;
    },
    toggleRemainderPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.reminder = action.payload;
    },
    toggleUserActionPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.userActionReport = action.payload;
    },
    toggleImportExportPopup: (state, action: PayloadAction<popupDataProps>) => {

      state.importExport = action.payload;
    },
    toggleCurrencyExchangePopup: (state, action: PayloadAction<popupDataProps>) => {
      state.currencyExchange = action.payload;
    },
    toggleResetDataBasePopup: (state, action: PayloadAction<popupDataProps>) => {
      state.resetDataBase = action.payload;
    },
    toggleCommandsPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.commands = action.payload;
    },
    toggleAccountGroupPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.accountGroup = action.payload;
    },
    toggleBankCardsPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.bankCard = action.payload;
    },
    toggleSMSIntegrationPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.accountGroup = action.payload;
    },
    toggleAccountLedgerPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.accountLedger = action.payload;
    },
    toggleCostCentrePopup: (state, action: PayloadAction<popupDataProps>) => {
      state.costCentre = action.payload;
    },
    toggleBranchLedgerPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.branchLedger = action.payload;
    },
    toggleAuthorizationSettingsPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.authorizationSettings = action.payload;
    },
    toggleBarcodePrintPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.barcodeprint = action.payload;
    },
    toggleExchangeRatesPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.exchangeRates = action.payload;
    },
    toggleBranchGridPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.branchGrid = action.payload;
    },
    togglePrivilegeCardPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.privilegeCard = action.payload;
    },
    togglePartyCategoryPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.partyCategory = action.payload;
    },
    toggleCurrencyMasterPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.currencyMaster = action.payload;
    },
    toggleRevertBillModifications: (state, action: PayloadAction<popupDataProps>) => {
      state.revertBillModifications = action.payload;
    },
    toggleResetBranchDataForSync: (state, action: PayloadAction<popupDataProps>) => {
      state.resetBranchDataForSync = action.payload;
    },
    toggleRefreshAllBranches: (state, action: PayloadAction<popupDataProps>) => {
      state.refreshAllBranches = action.payload;
    },
    toggleChartOfAccounts: (state, action: PayloadAction<popupDataProps>) => {
      state.chartOfAccounts = action.payload;
    },
    toggleParties: (state, action: PayloadAction<popupDataProps>) => {
      state.parties = action.payload;
    },
    toggleHeaderFooterPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.headAndFooter = action.payload;
    },
    toggleMiscellaneousSettingsPopup: (state, action: PayloadAction<popupDataProps>) => {
      state.miscellaneousSettings = action.payload;
    },
    toggleEWayBillTaxPro: (state, action: PayloadAction<popupDataProps>) => {
      state.eWayBillTaxPro = action.payload;
    },
    toggleEInvoiceGST: (state, action: PayloadAction<popupDataProps>) => {
      state.eInvoiceGST = action.payload;
    },
    toggleUpi: (state, action: PayloadAction<popupDataProps>) => {
      state.upi = action.payload;
    },
    toggleProductGroup: (state, action: PayloadAction<popupDataProps>) => {
      state.productGroup = action.payload;
    },
    toggleProductCategory: (state, action: PayloadAction<popupDataProps>) => {
      state.productCategory = action.payload;
    },
    toggleBrands: (state, action: PayloadAction<popupDataProps>) => {
      state.brands = action.payload;
    },
    togglePriceCategory: (state, action: PayloadAction<popupDataProps>) => {
      state.priceCategory = action.payload;
    },
    toggleUnitOfMeasure: (state, action: PayloadAction<popupDataProps>) => {
      state.unitOfMeasure = action.payload;
    },
    toggleVehicles: (state, action: PayloadAction<popupDataProps>) => {
      state.vehicles = action.payload;
    },

  },
});

// Extract the actions
export const {
  toggleUpi,
  toggleMiscellaneousSettingsPopup,
  toggleHeaderFooterPopup,
  toggleUserTypePrivilegePopup,
  toggleCurrencyMasterPopup,
  togglePartyCategoryPopup,
  togglePrivilegeCardPopup,
  toggleExchangeRatesPopup,
  toggleBarcodePrintPopup,
  toggleUserTypePopup,
  toggleUserPopup,
  toggleCounterPopup,
  toggleVoucherPopup,
  toggleFinancialYearPopup,
  toggleDeleteInactiveTransactionPopup,
  toggleCompanyProfilePopup,
  toggleBankPosPopup,
  toggleBranchPopup,
  toggleDayClosePopup,
  toggleRemainderPopup,
  toggleUserActionPopup,
  toggleImportExportPopup,
  toggleCurrencyExchangePopup,
  toggleResetDataBasePopup,
  toggleCommandsPopup,
  toggleAccountGroupPopup,
  toggleBankCardsPopup,
  toggleSMSIntegrationPopup,
  toggleAccountLedgerPopup,
  toggleCostCentrePopup,
  toggleBranchLedgerPopup,
  toggleAuthorizationSettingsPopup,
  toggleBranchGridPopup,
  toggleRevertBillModifications,
  toggleResetBranchDataForSync,
  toggleRefreshAllBranches,
  toggleChartOfAccounts,
  toggleParties,
  toggleEWayBillTaxPro,
  toggleEInvoiceGST,
  toggleProductGroup,
  toggleProductCategory,
  toggleBrands,
  togglePriceCategory,
  toggleUnitOfMeasure,
  toggleVehicles,
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
