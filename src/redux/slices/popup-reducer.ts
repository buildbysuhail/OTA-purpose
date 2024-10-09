import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface popupDataProps {
  isOpen?: boolean | false;
  key?: any | null;
  mode?: "add" | "edit" | "view";
}
interface popupData {
  userType: popupDataProps
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
}
const initialState: popupData = {
  userType: { isOpen: false, key: null, mode: "edit" },
  user: { isOpen: false, key: null, mode: "edit" },
  counter: { isOpen: false, key: null, mode: "edit" },
  voucher: { isOpen: false, key: null, mode: "edit" },
  financialYear: { isOpen: false, key: null, mode: "edit" },
  deleteInactiveTransactions: { isOpen: false, key: null, mode: "edit" },
  companyProfile: { isOpen: false, key: null, mode: "edit" },
  bankPos: { isOpen: false, key: null, mode: "edit" },
  branch: { isOpen: false, key: null, mode: "edit" },
  dayClose: { isOpen: false, key: null, mode: "edit" },
  reminder: { isOpen: false, key: null, mode: "edit" },
  userActionReport: { isOpen: false, key: null, mode: "edit" },
  importExport: { isOpen: false, key: null, mode: "edit" },
  currencyExchange: { isOpen: false, key: null, mode: "edit" },
  resetDataBase: { isOpen: false, key: null, mode: "edit" },
  commands: { isOpen: false, key: null, mode: "edit" },
  accountGroup: { isOpen: false, key: null, mode: "edit" },
  accountLedger: { isOpen: false, key: null, mode: "edit" },
  costCentre: { isOpen: false, key: null, mode: "edit" },
  branchLedger: { isOpen: false, key: null, mode: "edit" },
  authorizationSettings: { isOpen: false, key: null, mode: "edit" },
  barcodeprint: { isOpen: false, key: null, mode: "edit" },
  exchangeRates: { isOpen: false, key: null, mode: "edit" },
  branchGrid: { isOpen: false, key: null, mode: "edit" },
  privilegeCard: { isOpen: false, key: null, mode: "edit" },
  partyCategory: { isOpen: false, key: null, mode: "edit" },
  currencyMaster: { isOpen: false, key: null, mode: "edit" },
  revertBillModifications: { isOpen: false, key: null, mode: "edit" },
  resetBranchDataForSync: { isOpen: false, key: null, mode: "edit" },
};

const popupDataSlice = createSlice({
  name: 'popupData',
  initialState,
  reducers: {
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
  },
});

// Extract the actions
export const {
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
  toggleAccountLedgerPopup,
  toggleCostCentrePopup,
  toggleBranchLedgerPopup,
  toggleAuthorizationSettingsPopup,
  toggleBranchGridPopup,
  toggleRevertBillModifications,
  toggleResetBranchDataForSync,
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
