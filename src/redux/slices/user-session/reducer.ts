import { createSlice } from "@reduxjs/toolkit";
import { userSession } from "./thunk";
import { IdTextDto, IdTextLogoDto } from "../../../base/id-text-is-default-dto";

export interface UserModel {
  userId: number;
  displayName: string;
  userimage: string;
  userTypeId: number;
  userTypeName: string;
  email: string;
  currentClientId: number;
  currentClientName: string;
  currentBranchId: number;
  currentBranchName: string;
  currency: string | null;
  currencySymbol: string | null;
  taxDecimalPoint: number;
  unitPriceDecimalPoint: number;
  language: string;
  companies: IdTextLogoDto[];
  branches: IdTextDto[];
}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: UserModel = {
  userId: 0,
  displayName: '',
  userTypeId: 0,
  userTypeName: '',
  userimage: '',
  email: '',
  currentClientId: 0,
  currentClientName: '',
  currentBranchId: 0,
  currentBranchName: '',
  currency: null,
  currencySymbol: null,
  taxDecimalPoint: 0,
  unitPriceDecimalPoint: 0,
  language: '',
  companies: [],  // Initializing as an empty array
  branches: []    // Initializing as an empty array
};
const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(userSession.fulfilled, (state, action) => {
      if(action.payload.isOk) {
        return  action.payload.item;        
      }
    });
  },
});

export const {
  
} = userSessionSlice.actions

export default userSessionSlice.reducer;