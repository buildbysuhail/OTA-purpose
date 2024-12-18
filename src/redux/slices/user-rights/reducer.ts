import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IdTextDto, IdTextLogoDto } from "../../../base/id-text-is-default-dto";
import Cookies from "js-cookie";
import { customJsonParse, modelToBase64 } from "../../../utilities/jsonConverter";

export interface UserTypeRights {
  formCode: string;
  userRights: string;
}
export const initialState: UserTypeRights[] = new Array<UserTypeRights>();
export interface UserTypeRights {
  formCode: string;
  userRights: string;
}
let ass = localStorage.getItem("up");
  
    export const up: UserTypeRights[] = ass != undefined && ass != null && ass != "" 
    ? customJsonParse(atob(ass)) : initialState;
const userRightsSlice = createSlice({
  name: "userRights",
  initialState:up,
  reducers: {
    setUserRights: (state, action: PayloadAction<UserTypeRights[]>) => {
      return action.payload;
    },
  },
});

export const { setUserRights } = userRightsSlice.actions;

export default userRightsSlice.reducer;
