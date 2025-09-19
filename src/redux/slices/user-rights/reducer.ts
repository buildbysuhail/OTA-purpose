import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IdTextDto, IdTextLogoDto } from "../../../base/id-text-is-default-dto";
import Cookies from "js-cookie";
import { customJsonParse, modelToBase64 } from "../../../utilities/jsonConverter";
import { getStorageString } from "../../../utilities/storage-utils";

export interface UserTypeRights {
  formCode: string;
  userRights: string;
}
export const initialState: UserTypeRights[] = new Array<UserTypeRights>();


// let ass =await getStorageString("up");
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

// export const createUserRightsSlice = (preloadedData: UserTypeRights[]) => {
//   return createSlice({
//     name: "userRights",
//     initialState: preloadedData, // 🟢 REAL DATA AS INITIAL STATE
//     reducers: {
//       setUserRights: (state, action: PayloadAction<UserTypeRights[]>) => {
//         return action.payload;
//       },
//     },
//     // 🟢 NO extraReducers needed - data is already loaded!
//   });
// };