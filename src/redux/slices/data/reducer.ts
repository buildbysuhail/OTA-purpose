import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

export interface ledgerData {
  ledgers?: any[];
  costCentres?:any[];
}
// export const initialState : login  =  {loading: false, token: ""};
export const initialState: ledgerData = {};
const dataContainerSlice = createSlice({
  name: "dataContainer",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<{ key:  keyof(ledgerData); value: any }>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { setData } = dataContainerSlice.actions;

export default dataContainerSlice.reducer;
