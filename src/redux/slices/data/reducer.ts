import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { countries } from "./thunk";

interface Country {
  // Define properties of a country here
  // For example:
  id: string;
  name: string;
  // ... other properties
}

// Define the initial state
const initialState: Country[] = [];

const countriesSlice = createSlice({
  name: 'countries',
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
export const {} = countriesSlice.actions;

export default countriesSlice.reducer;
