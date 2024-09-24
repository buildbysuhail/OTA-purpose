import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { usertypecompo } from "./thunk";


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
  name: 'userTypeData',
  initialState,
  reducers: {
    // You can add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase( usertypecompo.pending, (state) => {
        // You can set a loading state here if needed
      })
      .addCase( usertypecompo.fulfilled, (state, action: PayloadAction<any>) => {
        
        // Replace the entire state with the new data
        return action.payload;
        
      })
      .addCase( usertypecompo.rejected, (state, action) => {
        // Handle the error state here if needed
      });
  },
});

export const {} = industriesSlice.actions;

export default industriesSlice.reducer;