import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { employeecompo } from "./thunk";


interface Country {
  // Define properties of a country here
  // For example:
  id: string;
  name: string;
  // ... other properties
}

// Define the initial state
const initialState: Country[] = [];

const employeeDataSlice = createSlice({
  name: 'employeeData',
  initialState,
  reducers: {
    // You can add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase( employeecompo.pending, (state) => {
        // You can set a loading state here if needed
      })
      .addCase( employeecompo.fulfilled, (state, action: PayloadAction<any>) => {
        
        // Replace the entire state with the new data
        return action.payload;
        
      })
      .addCase( employeecompo.rejected, (state, action) => {
        // Handle the error state here if needed
      });
  },
});

export const {} = employeeDataSlice.actions;

export default employeeDataSlice.reducer;