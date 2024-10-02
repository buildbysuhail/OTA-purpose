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
};

const popupDataSlice = createSlice({
  name: 'popupData',
  initialState,
  reducers: {
    toggleUserTypePopup: (state, action: PayloadAction<popupDataProps>) => {
debugger;
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
      state.commands = action.payload;
    },
  },
});

// Extract the actions
export const {
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
  toggleAccountGroupPopup
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
