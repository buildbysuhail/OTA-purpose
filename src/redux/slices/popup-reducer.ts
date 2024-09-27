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
      debugger;     
      state.deleteInactiveTransactions= action.payload;
    },
    toggleCompanyProfilePopup: (state, action: PayloadAction<boolean>) => { 
      debugger;     
      state.companyProfile= action.payload;
    },
    toggleBankPosPopup: (state, action: PayloadAction<boolean>) => { 
      debugger;     
      state.bankPos= action.payload;
    },
    toggleBranchPopup: (state, action: PayloadAction<boolean>) => { 
      debugger;     
      state.branch= action.payload;
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
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
