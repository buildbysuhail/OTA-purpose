import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

export interface ClientSessionModel {
  isDemoVersion: boolean;
  demoExpiryDate: string;
  softwareDate: string;
  counterShiftId?: number;
  isAppGlobal: boolean;
}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: ClientSessionModel = {
  isDemoVersion: true,
  demoExpiryDate: "",
  softwareDate: "",
  isAppGlobal: false
};
const clientSessionSlice = createSlice({
  name: "clientSession",
  initialState,
  reducers: {
    setClientSession: (state, action: PayloadAction<ClientSessionModel>) => {
      return {
        ...action.payload,
        softwareDate: moment().local().format("DD/MM/YYYY"),
      };
    },

    setSoftwareDate: (state, action: PayloadAction<string>) => {
      state.softwareDate = action.payload;
    },
  },
});

export const { setClientSession, setSoftwareDate } = clientSessionSlice.actions;

export default clientSessionSlice.reducer;
