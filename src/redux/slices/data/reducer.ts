import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

export interface ClientSessionModel {
  ledgers?: [];

}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: ClientSessionModel = {
};
const dataContainerSlice = createSlice({
  name: "dataContainer",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<{key: keyof(ClientSessionModel), value: any}>) => {
      state[key] = value
    },

  },
});

export const { setData } = dataContainerSlice.actions;

export default dataContainerSlice.reducer;
