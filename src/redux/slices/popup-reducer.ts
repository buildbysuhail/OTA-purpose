import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface popupData {
  userType: boolean
  user:boolean
  counter:boolean
  voucher:boolean
  financialYear:boolean
  deleteInactiveTransactions:boolean
  companyProfile:boolean
  bankPos:boolean
  branch:boolean
  dayClose:boolean
  reminder:boolean
  userActionReport:boolean
  importExport:boolean
  currencyExchange:boolean
  resetDataBase:boolean
  commands:boolean
}
const initialState: popupData = {
  userType: false,
  user:false,
  counter:false,
  voucher:false,
  financialYear:false,
  deleteInactiveTransactions:false,
  companyProfile:false,
  bankPos:false,
  branch:false,
  dayClose:false,
  reminder:false,
  userActionReport:false,
  importExport:false,
  currencyExchange:false,
  resetDataBase:false,
  commands:false,
};

const popupDataSlice = createSlice({
  name: 'popupData',
  initialState,
  reducers: {
    toggleUserTypePopup: (state, action: PayloadAction<boolean>) => { 
           
      state.userType = action.payload;
    },
    toggleUserPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.user = action.payload;
    },
    toggleCounterPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.counter = action.payload;
    },
    toggleVoucherPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.voucher= action.payload;
    },
    toggleFinancialYearPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.financialYear= action.payload;
    },
    toggleDeleteInactiveTransactionPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.deleteInactiveTransactions= action.payload;
    },
    toggleCompanyProfilePopup: (state, action: PayloadAction<boolean>) => { 
           
      state.companyProfile= action.payload;
    },
    toggleBankPosPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.bankPos= action.payload;
    },
    toggleBranchPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.branch= action.payload;
    },
    toggleDayClosePopup: (state, action: PayloadAction<boolean>) => { 
           
      state.dayClose = action.payload;
    },
    toggleRemainderPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.reminder = action.payload;
    },
    toggleUserActionPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.userActionReport = action.payload;
    },
    toggleImportExportPopup: (state, action: PayloadAction<boolean>) => { 
           
      state.importExport = action.payload;
    },
    toggleCurrencyExchangePopup: (state, action: PayloadAction<boolean>) => {     
      state.currencyExchange = action.payload;
    },
    toggleResetDataBasePopup: (state, action: PayloadAction<boolean>) => {     
      state.resetDataBase = action.payload;
    },
    toggleCommandsPopup: (state, action: PayloadAction<boolean>) => {     
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
  toggleCommandsPopup
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
