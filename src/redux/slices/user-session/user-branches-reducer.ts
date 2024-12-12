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
export interface UserBranches {
  branches: BranchSelectDto[]
}
// export const initialState : login  =  {loading: false, token: ""};
export const initialUserSessionData: UserBranches = {
  branches: [], // Initializing as an empty array
};
const userBranchesSlice = createSlice({
  name: "userBranches",
  initialState: initialUserSessionData,
  reducers: {
    setUserBranches: (state, action: PayloadAction<BranchSelectDto[]>) => {
      state.branches = action.payload;
    },
  },
});

export const { setUserBranches } = userBranchesSlice.actions;

export default userBranchesSlice.reducer;
