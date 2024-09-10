import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { industries } from "./thunk";

interface Country {
  // Define properties of a country here
  // For example:
  id: string;
  name: string;
  // ... other properties
}

// Define the initial state
const initialState: Country[] = [];

const industriesSlice = createSlice({
  name: 'Industries',
  initialState,
  reducers: {
    // You can add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(industries.pending, (state) => {
        // You can set a loading state here if needed
      })
      .addCase(industries.fulfilled, (state, action: PayloadAction<any>) => {
        
        // Replace the entire state with the new data
        return action.payload;
        
      })
      .addCase(industries.rejected, (state, action) => {
        // Handle the error state here if needed
      });
  },
});

export const {} = industriesSlice.actions;

export default industriesSlice.reducer;
