import { createSlice } from "@reduxjs/toolkit";
import { LoginData, loginUser, LoginValidations } from "./thunk";
import { ResponseModel } from "../../../../base/response-model";
import { StateBase } from "../../../../base/state-base";
import { IIdTextIsDefaultDto } from "../../../../base/id-text-is-default-dto";
import jwtHelper from "../../../../helpers/jwt_helper";

export interface IUserSession extends StateBase {
  token: string;
  userId: number,
  displayName: string,
  email: string,
  group: string,
  currentClientId: number,
  currentClientName: string,
  currentBranchId:number,
  currentBranchName: string,
  permissions: string[],
  currency: any,
  currencyDecimalPoints: any,
  currencySymbol: any,
  taxDecimalPoint: number,
  unitPriceDecimalPoint:number,
  language: string;
  companies: Array<IIdTextIsDefaultDto>;
  branches: Array<IIdTextIsDefaultDto>;
}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: IUserSession = {
  loading: false,
  token: '',
  userId: 0,
  displayName: '',
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
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      if(action.payload.isOk) {
        debugger;
        let userSession = jwtHelper.getUserDetailsFromToken(action.payload.item.token, action.payload.item.permissionToken);
        state = userSession;        
      state.loading = false;
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loginUser.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export const {
  
} = loginSlice.actions

export default loginSlice.reducer;