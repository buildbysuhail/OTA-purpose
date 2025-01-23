import { createSlice } from "@reduxjs/toolkit";
import { LoginData, loginUser, LoginValidations } from "./thunk";
import { ResponseModel } from "../../../../base/response-model";
import { StateBase } from "../../../../base/state-base";
import { IIdTextIsDefaultDto } from "../../../../base/id-text-is-default-dto";
import jwtHelper from "../../../../helpers/jwt_helper";

export interface IUserSession extends StateBase {
  token: string;
  userId: number,
 
}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: IUserSession = {
  loading: false,
  token: '',
  userId: 0
};
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      if(action.payload.isOk) {
        // let userSession = jwtHelper.getUserDetailsFromToken(action.payload.item.token, action.payload.item.permissionToken);
        state.token = action.payload.item.token; 
      }       
      state.loading = false;
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