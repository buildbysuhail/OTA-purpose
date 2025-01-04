import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setBranch, userSession } from "./thunk";
import { IdTextDto, IdTextLogoDto } from "../../../base/id-text-is-default-dto";
import Cookies from "js-cookie";
import { customJsonParse, modelToBase64 } from "../../../utilities/jsonConverter";
export interface BranchSelectDto {
  id: number;
  name?: string;
  userName?: string;
  clientId: number;
  clientName?: string;
  logo?: string;
  isActive: boolean;
}
export enum Countries {
  India = 48,
  Saudi = 1,
}
export interface UserModel {
  userId: number;
  userName: string;
  counterName: string;
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
  currency: {
    currencyName: string;
    subUnit: string;
    currencySymbol: string;
    subUnitSymbol: string;
    currencyCode: string;
  };
  headerFooter: {
    header7: string;
    header8: string;
    header9: string;
  };
  currencySymbol: string | null;
  taxDecimalPoint: number;
  unitPriceDecimalPoint: number;
  language: string;
  countryId?: Countries;
  companies: IdTextLogoDto[];
  branches: BranchSelectDto[];
  finFrom?: Date | null;
  finTo?: Date | null;
  financialYearStatus:string;
  employeeId: number | 0;
  productVersion: string | "";
  dbIdValue: string | "";
  counterwiseCashLedgerId: number | 0; // Adjust the type as per your requirements (e.g., string, number, etc.)
  counterAssignedCashLedgerId: number | 0;
  systemCode: string | "";
  systemName: string | "";
}
export const initialUserSessionData: UserModel = {
  userId: 0,
  displayName: "",
  userTypeCode: "",
  userTypeName: "",
  userimage: "",
  email: "",
  currentClientId: 0,
  currentClientName: "",
  currentBranchId: 0,
  currentBranchAddress: [],
  currentBranchName: "",
  currency: {
    currencyCode: "",
    currencyName: "",
    currencySymbol: "",
    subUnit: "",
    subUnitSymbol: ""
  },
  currencySymbol: null,
  taxDecimalPoint: 0,
  unitPriceDecimalPoint: 0,
  language: "",
  finFrom: null,
  finTo: null,
  companies: [], // Initializing as an empty array
  branches: [], // Initializing as an empty array
  productVersion: "",
  dbIdValue: "",
  employeeId: 0,
  counterwiseCashLedgerId: 0,
  counterAssignedCashLedgerId: 0,
  systemCode: "",
  systemName: "",
  financialYearStatus: "Closed",
  userName: "",
  counterName: "",
  headerFooter: {
    header7: "",
    header8: "",
    header9: ""
  }
};
let ass = localStorage.getItem("up");
  
    export const up: UserModel = ass != undefined && ass != null && ass != "" 
    ? customJsonParse(atob(ass)) : initialUserSessionData;
// export const initialState : login  =  {loading: false, token: ""};
const userSessionSlice = createSlice({
  name: "userSession",
  initialState: up,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserModel>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSession?.fulfilled, (state, action) => {
      if (action.payload.isOk) {
        
        localStorage.setItem("up", modelToBase64(action.payload.item));
        return action.payload.item;
      }
    });
    builder.addCase(setBranch.fulfilled, (state, action) => {
      if (action.payload.isOk) {
        // localStorage.setItem("up", modelToBase64(action.payload.item));
        // return  action.payload.item;
      }
    });
  },
});

export const { setUserSession } = userSessionSlice.actions;

export default userSessionSlice.reducer;
