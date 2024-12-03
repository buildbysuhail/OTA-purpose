import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IdTextDto, IdTextLogoDto } from "../../../base/id-text-is-default-dto";
import Cookies from "js-cookie";
import { modelToBase64 } from "../../../utilities/jsonConverter";

export interface UserTypeRights {
  formCode: string;
  userRights: string;
}
export const initialState: UserTypeRights[] = new Array<UserTypeRights>();
export interface UserTypeRights {
  formCode: string;
  userRights: string;
}
const userRightsSlice = createSlice({
  name: "userRights",
  initialState,
  reducers: {
    setUserRights: (state, action: PayloadAction<UserTypeRights[]>) => {
      return action.payload;
    },
  },
});

export const { setUserRights } = userRightsSlice.actions;

export default userRightsSlice.reducer;
