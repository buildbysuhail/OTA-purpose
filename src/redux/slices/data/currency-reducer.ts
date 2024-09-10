import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { countries, currencies, industries } from "./thunk";

interface Country {
  // Define properties of a country here
  // For example:
  id: string;
  name: string;
  // ... other properties
}

// Define the initial state
const initialState: Country[] = [];

const curenciesSlice = createSlice({
  name: 'curencies',
  initialState,
  reducers: {
    // You can add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(currencies.pending, (state) => {
        // You can set a loading state here if needed
      })
      .addCase(currencies.fulfilled, (state, action: PayloadAction<any>) => {
        
        // Replace the entire state with the new data
        return action.payload;
        
      })
      .addCase(currencies.rejected, (state, action) => {
        // Handle the error state here if needed
      });
  },
});

export const {} = curenciesSlice.actions;

export default curenciesSlice.reducer;
