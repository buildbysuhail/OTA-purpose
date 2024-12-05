
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getApplicationSettings } from './thunk';
import { ApplicationSettingsInitialState } from './application-settings-types';
import { ApplicationSettingsType } from '../../../pages/settings/system/application-settings-types/application-settings-types';
import { ApplicationMainSettings } from '../../../pages/settings/system/application-settings-types/application-settings-types-main';

const applicationSettingsSlice = createSlice({
  name: 'applicationSettings',
  initialState: ApplicationSettingsInitialState, // Use `initialState` here
  reducers: {
    setApplicationSettings: (state, action: PayloadAction<ApplicationSettingsType>) => {
      return action.payload;
    },
    setApplicationSettingsWithType: <T extends keyof ApplicationSettingsType>(
      state: ApplicationSettingsType,
      action: PayloadAction<{
        type: T;
        settingName: keyof ApplicationSettingsType[T];
        value: any;
      }>
    ) => {
      const { type, settingName, value } = action.payload;

      // Safely update the nested value
      if (state[type]) {
        state[type][settingName] = value;
      }
    },
    
    setApplicationMainSettings: (state, action: PayloadAction<{
      key: keyof ApplicationMainSettings;
      value: ApplicationMainSettings[keyof ApplicationMainSettings];
    }>) => {
      
      const { key, value } = action.payload;
      (state.mainSettings[key] as typeof value) = value;
    },
  },
  extraReducers: (builder) => {
    
    // builder.addCase(getApplicationSettings.fulfilled, (state, action: PayloadAction<any>) => {
    //   console.log(action.payload);
      
    //   return action.payload;
    // });
  },
});

export const { setApplicationSettings, setApplicationMainSettings, setApplicationSettingsWithType } = applicationSettingsSlice.actions;
export default applicationSettingsSlice.reducer;