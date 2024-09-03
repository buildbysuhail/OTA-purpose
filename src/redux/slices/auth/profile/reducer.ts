import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserSession, IUserSession } from "./thunk";

export const initialState: IUserSession = {
  userId: 0,
  displayName: '',
  userImageSm: '',
  email: '',
  group: '',
  currentClientId: 0,
  currentClientName: '',
  currentBranchId: 0,
  currentBranchName: '',
  permissions: [],
  currency: null,
  currencyDecimalPoints: null,
  currencySymbol: null,
  taxDecimalPoint: 0,
  unitPriceDecimalPoint: 0,
  language: '',
  companies: [],
  branches: []
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: { 
    setUserImageSm: (state, action: PayloadAction<string>) => {
      state.userImageSm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserSession .fulfilled, (state, action) => {
      state = action.payload;
    });
  },
});

export const {
  setUserImageSm
} = ProfileSlice.actions

export default ProfileSlice.reducer;