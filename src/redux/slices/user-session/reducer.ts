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
export enum Countries {
  India = 48,
  Saudi = 1,
}
export const initialUserSessionData: UserModel = {
  userId: 0,
  displayName: '',
  userimage: '',
  userTypeCode: "",
  userTypeName: '',
  email: '',
  currentClientId: 0,
  currentClientName: '',
  currentBranchAddress: [],
  currentBranchId: 0,
  currentBranchName: '',
  currency: null,
  currencySymbol: null,
  taxDecimalPoint: 0,
  unitPriceDecimalPoint: 0,
  language: 'en',
  companies: [],
  branches: [],
  presetCostCenterId: 0,
  productVersion: ""
};
export interface UserModel {
  userId: number;
  displayName: string;
  userimage: string;
  userTypeCode: string;
  userTypeName: string;
  email: string;
  currentClientId: number;
  currentClientName: string;
  currentBranchId: number;
  currentBranchAddress: string[];
  currentBranchName: string;
  currency: string | null;
  currencySymbol: string | null;
  taxDecimalPoint: number;
  unitPriceDecimalPoint: number;
  language: string;
  countryId?: Countries;
  companies: IdTextLogoDto[];
  branches: BranchSelectDto[];
  finFrom?: Date | null;
  finTo?: Date | null;
  presetCostCenterId: number | 0;
  productVersion: string | "";
  dbIdValue: string | "";

}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: UserModel = {
  userId: 0,
  displayName: '',
  userTypeCode: '',
  userTypeName: '',
  userimage: '',
  email: '',
  currentClientId: 0,
  currentClientName: '',
  currentBranchId: 0,
  currentBranchAddress: [],
  currentBranchName: '',
  currency: null,
  currencySymbol: null,
  taxDecimalPoint: 0,
  unitPriceDecimalPoint: 0,
  language: '',
  finFrom: null, finTo: null,
  companies: [], // Initializing as an empty array
  branches: [] // Initializing as an empty array
  ,
  presetCostCenterId: 0,
  productVersion: "",
  dbIdValue: ""
};
const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserModel>) => {

      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userSession?.fulfilled, (state, action) => {
      if (action.payload.isOk) {
        debugger;
        Cookies.set("up", modelToBase64(action.payload.item), { expires: 30 });
        return action.payload.item;
      }
    });
    builder.addCase(setBranch.fulfilled, (state, action) => {
      if (action.payload.isOk) {
        // Cookies.set("up", modelToBase64(action.payload.item), { expires: 30 }); 
        // return  action.payload.item;        
      }
    });
  },
});

export const {
  setUserSession,

} = userSessionSlice.actions

export default userSessionSlice.reducer;