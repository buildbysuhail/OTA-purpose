import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ledgercompo } from "./thunk";


interface ledger {
  // Define properties of a ledger here
  // For example:
  ledgerID: string;
  ledgerName: string;
  // ... other properties
//   "ledgerID": 1,
//   "ledgerName": "Cash",
//   "ledgerCode": "CS"
}

// Define the initial state
const initialState: ledger[] = [];

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    // You can add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(ledgercompo.pending, (state) => {
        // You can set a loading state here if needed
      })
      .addCase(ledgercompo.fulfilled, (state, action: PayloadAction<ledger[]>) => {
        
        // Replace the entire state with the new data
        return action.payload;
        
      })
      .addCase(ledgercompo.rejected, (state, action) => {
        // Handle the error state here if needed
      });
  },
});

export const {} = ledgerSlice.actions;

export default ledgerSlice.reducer;
