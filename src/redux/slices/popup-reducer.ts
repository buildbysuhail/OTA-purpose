import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface popupDataProps {
  isOpen: boolean;
  key: any;
}
interface popupData {
  userType: popupDataProps
  user:popupDataProps
  counter:popupDataProps
  voucher:popupDataProps
  financialYear:popupDataProps
  deleteInactiveTransactions:popupDataProps
  companyProfile:popupDataProps
  bankPos:popupDataProps
  branch:popupDataProps
  dayClose:popupDataProps
  reminder:popupDataProps
  userActionReport:popupDataProps
  importExport:popupDataProps
  currencyExchange:popupDataProps
  resetDataBase:popupDataProps
  commands:popupDataProps
}
const initialState: popupData = {
  userType: {isOpen:false, key: null},
  user:{isOpen:false, key: null},
  counter:{isOpen:false, key: null},
  voucher:{isOpen:false, key: null},
  financialYear:{isOpen:false, key: null},
  deleteInactiveTransactions:{isOpen:false, key: null},
  companyProfile:{isOpen:false, key: null},
  bankPos:{isOpen:false, key: null},
  branch:{isOpen:false, key: null},
  dayClose:{isOpen:false, key: null},
  reminder:{isOpen:false, key: null},
  userActionReport:{isOpen:false, key: null},
  importExport:{isOpen:false, key: null},
  currencyExchange:{isOpen:false, key: null},
  resetDataBase:{isOpen:false, key: null},
  commands:{isOpen:false, key: null},
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
           
      state.voucher= action.payload;
    },
    toggleFinancialYearPopup: (state, action: PayloadAction<popupDataProps>) => { 
           
      state.financialYear= action.payload;
    },
    toggleDeleteInactiveTransactionPopup: (state, action: PayloadAction<popupDataProps>) => { 
           
      state.deleteInactiveTransactions= action.payload;
    },
    toggleCompanyProfilePopup: (state, action: PayloadAction<popupDataProps>) => { 
           
      state.companyProfile= action.payload;
    },
    toggleBankPosPopup: (state, action: PayloadAction<popupDataProps>) => { 
           
      state.bankPos= action.payload;
    },
    toggleBranchPopup: (state, action: PayloadAction<popupDataProps>) => { 
           
      state.branch= action.payload;
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
