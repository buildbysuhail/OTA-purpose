import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClientSessionModel {
  isDemoVersion: boolean;
  demoExpiryDate: string;
  softwareDate: string;
}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: ClientSessionModel = {
  isDemoVersion: true,
  demoExpiryDate: "",
  softwareDate: ""
};
const clientSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setClientSession: (state, action: PayloadAction<ClientSessionModel>) => {
      return action.payload;
    },
  },
});

export const { setClientSession } = clientSessionSlice.actions;

export default clientSessionSlice.reducer;
