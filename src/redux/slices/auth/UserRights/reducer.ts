import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRights } from "./thunk";

export const initialUserRightsState: UserRights[] = [{formCode: '', userRights: ''}];

const userRightsSlice = createSlice({
  name: "userRightsSlice",
  initialState: initialUserRightsState,  // Change this line
  reducers: { 
    setUserRights: (state, action: PayloadAction<UserRights[]>) => {
      return action.payload;
    },
  },
});

export const {
  setUserRights
} = userRightsSlice.actions;

export default userRightsSlice.reducer;
