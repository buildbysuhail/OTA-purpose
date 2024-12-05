
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getApplicationSettings } from './thunk';
import { ApplicationSettingsInitialState } from './application-settings-types';
import { ApplicationSettingsType } from '../../../pages/settings/system/application-settings-types/application-settings-types';

const applicationSettingsSlice = createSlice({
  name: 'applicationSettings',
  initialState: ApplicationSettingsInitialState, // Use `initialState` here
  reducers: {
    setApplicationSettings: (state, action: PayloadAction<ApplicationSettingsType>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    
    // builder.addCase(getApplicationSettings.fulfilled, (state, action: PayloadAction<any>) => {
    //   console.log(action.payload);
      
    //   return action.payload;
    // });
  },
});

export const { setApplicationSettings } = applicationSettingsSlice.actions;
export default applicationSettingsSlice.reducer;