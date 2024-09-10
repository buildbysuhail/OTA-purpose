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

const countriesDataSlice = createSlice({
  name: 'countriesData',
  initialState,
  reducers: {
    // You can add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(countries.pending, (state) => {
        // You can set a loading state here if needed
      })
      .addCase(countries.fulfilled, (state, action: PayloadAction<any>) => {
        
        // Replace the entire state with the new data
        return action.payload;
        
      })
      .addCase(countries.rejected, (state, action) => {
        // Handle the error state here if needed
      });
  },
});

// Extract the actions
export const {} = countriesDataSlice.actions;

export default countriesDataSlice.reducer;
