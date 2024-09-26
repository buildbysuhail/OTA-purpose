import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface popupData {
  userType: boolean
}
const initialState: popupData = {
  userType: false,
};

const popupDataSlice = createSlice({
  name: 'popupData',
  initialState,
  reducers: {
    toggleUserTypePopup: (state, action: PayloadAction<boolean>) => { 
      debugger;     
      state.userType = action.payload;
    },
  },
});

// Extract the actions
export const {
  toggleUserTypePopup,
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
