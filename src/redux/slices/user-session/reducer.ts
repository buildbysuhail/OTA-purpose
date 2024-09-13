import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setBranch, userSession } from "./thunk";
import { IdTextDto, IdTextLogoDto } from "../../../base/id-text-is-default-dto";
import Cookies from "js-cookie";
import { modelToBase64 } from "../../../utilities/jsonConverter";
export interface BranchSelectDto {
  id: number;
  name?: string;
  clientId: number;
  clientName?: string;
  logo?: string;
  isActive: boolean;
}
export const initialUserSessionData: UserModel = {
  userId: 0,
  displayName: '',
  userimage: '',
  userTypeId: 0,
  userTypeName: '',
  email: '',
  currentClientId: 0,
  currentClientName: '',
  currentBranchId: 0,
  currentBranchName: '',
  currency: null,
  currencySymbol: null,
  taxDecimalPoint: 0,
  unitPriceDecimalPoint: 0,
  language: 'en',
  companies: [],
  branches: [],
};
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
  branches: BranchSelectDto[];
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
    setUserSession: (state, action: PayloadAction<UserModel>) => {   
      debugger;   
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userSession.fulfilled, (state, action) => {
      if(action.payload.isOk) {        
      Cookies.set("ut", modelToBase64(action.payload.item), { expires: 30 }); 
        return  action.payload.item;        
      }
    });
    builder.addCase(setBranch.fulfilled, (state, action) => {
      if(action.payload.isOk) {
        return  action.payload.item;        
      }
    });
  },
});

export const {
  setUserSession,
  
} = userSessionSlice.actions

export default userSessionSlice.reducer;