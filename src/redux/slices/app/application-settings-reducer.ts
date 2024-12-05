
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getApplicationSettings } from './thunk';
import { ApplicationSettingsInitialState } from './application-settings-types';

const applicationSettingsSlice = createSlice({
  name: 'applicationSettings',
  initialState: ApplicationSettingsInitialState, // Use `initialState` here
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(getApplicationSettings.fulfilled, (state, action: PayloadAction<any>) => {
      
      return action.payload;
    });
  },
});

export default applicationSettingsSlice.reducer;