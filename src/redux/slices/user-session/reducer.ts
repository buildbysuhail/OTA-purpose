import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setBranch, userSession } from "./thunk";
import { IdTextDto, IdTextLogoDto } from "../../../base/id-text-is-default-dto";
import Cookies from "js-cookie";
import { customJsonParse, modelToBase64 } from "../../../utilities/jsonConverter";
import { getStorageString } from "../../../utilities/storage-utils";
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
  Oman = 104,
  Qatar = 124,
  Kuwait = 118,
  UAE = 120,
  Malaysia = 50,
  UnitedStates = 9
}
export interface CompanyDetails {
  Name: string;
  NameInSecondLanguage: string;
  BuildingNumber: string;
  StreetName: string;
  City: string;
  District: string;
  Country: string;
  PinCode: string;
  Mobile: string;
  TelePhone: string;
  TaxNumber: string;
  Email: string;
  AdditionalNumber: string;
}

export interface BranchDetails {
  Name: string;
  Address1: string;
  Address2: string;
  City: string;
  District: string;
  Country: string;
  PinCode: string;
  Mobile: string;
  Phone: string;
  TaxNumber: string;
  Email: string;
}
export interface HeaderFooter {
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  heading5: string;
  heading6: string;
  heading7: string;
  heading8: string;
  heading9: string;
  heading10: string;

  footer1: string;
  footer2: string;
  footer3: string;
  footer4: string;
  footer5: string;
  footer6: string;
  footer7: string;
  footer8: string;
  footer9: string;
  footer10: string;
}
export const initialCompanyDetails: CompanyDetails = {
  Name: "",
  NameInSecondLanguage: "",
  BuildingNumber: "",
  StreetName: "",
  City: "",
  District: "",
  Country: "",
  PinCode: "",
  Mobile: "",
  TelePhone: "",
  TaxNumber: "",
  Email: "",
  AdditionalNumber: ""
};

export const initialBranchDetails: BranchDetails = {
  Name: "",
  Address1: "",
  Address2: "",
  City: "",
  District: "",
  Country: "",
  PinCode: "",
  Mobile: "",
  Phone: "",
  TaxNumber: "",
  Email: ""
};

export const initialHeaderFooter: HeaderFooter = {
  heading1: "",
  heading2: "",
  heading3: "",
  heading4: "",
  heading5: "",
  heading6: "",
  heading7: "",
  heading8: "",
  heading9: "",
  heading10: "",

  footer1: "",
  footer2: "",
  footer3: "",
  footer4: "",
  footer5: "",
  footer6: "",
  footer7: "",
  footer8: "",
  footer9: "",
  footer10: ""
};
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
  headerFooter: HeaderFooter;
  general: {
    syncState: string;
  };
  currentCompanyDetails: CompanyDetails;
  currentBranchDetails: BranchDetails;
  currencySymbol: string | null;
  taxDecimalPoint: number;
  unitPriceDecimalPoint: number;
  language: string;
  countryId?: Countries;
  companies: IdTextLogoDto[];
  branches: BranchSelectDto[];
  finFrom?: Date | null;
  finTo?: Date | null;
  finId?: number | null;
  financialYearStatus:string;
  employeeId: number | 0;
  productVersion: string | "";
  dbIdValue: string | "";
  isMaintainShift: boolean | false;
  counterwiseCashLedgerId: number | 0; // Adjust the type as per your requirements (e.g., string, number, etc.)
  counterAssignedCashLedgerId: number | 0;
  systemCode: string | "";
  systemName: string | "";
  counter_vr_prefix?: string | "";
  asUpdate?: boolean;
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
  isMaintainShift: false,
  systemCode: "",
  systemName: "",
  financialYearStatus: "Closed",
  userName: "",
  counterName: "",
  headerFooter: initialHeaderFooter,
  general: {
    syncState: ""
  },
  currentCompanyDetails: initialCompanyDetails,
  currentBranchDetails: initialBranchDetails,
  asUpdate: true
};

  // let ass =await getStorageString("up");
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
   setUserSessionItem: <
  K extends keyof UserModel
>(
  state: UserModel,
  action: PayloadAction<{ key: K; value: UserModel[K] }>
) => {
  state[action.payload.key] = action.payload.value;
},
  },

});

export const { setUserSession, setUserSessionItem } = userSessionSlice.actions;

export default userSessionSlice.reducer;
// export const createUserSessionSlice = (preloadedData: UserModel) => {
//   return createSlice({
//     name: "userSession",
//     initialState: preloadedData, // 🟢 REAL DATA AS INITIAL STATE
//     reducers: {
//       setUserSession: (state, action: PayloadAction<UserModel>) => {
//         return action.payload;
//       },
//       setUserSessionItem: <K extends keyof UserModel>(
//         state: UserModel,
//         action: PayloadAction<{ key: K; value: UserModel[K] }>
//       ) => {
//         state[action.payload.key] = action.payload.value;
//       },
//     },
//     // 🟢 NO extraReducers needed - data is already loaded!
//   });
// };