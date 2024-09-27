import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface popupData {
  userType: boolean
  user:boolean
  counter:boolean
  voucher:boolean
  financialYear:boolean
}
const initialState: popupData = {
  userType: false,
  user:false,
  counter:false,
  voucher:false,
  financialYear:false
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
  },
});

// Extract the actions
export const {
  toggleUserTypePopup,
  toggleUserPopup,
  toggleCounterPopup,
  toggleVoucherPopup,
  toggleFinancialYearPopup,
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
