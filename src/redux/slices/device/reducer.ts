import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAppState, uploadAppState } from './thunk';
import usFlag from '../../../assets/images/flags/us_flag.png'
import { DeviceState } from './types';
import { Device, DeviceInfo } from '@capacitor/device';

// Define the initial state

const initialState: DeviceState = {
  platform: "web",
  isWeb: true,
  isMobile: false,
  isTablet:false,
  isDesktop: false
};

const isElectron = () => {
  // Check if window and process exist
  if (typeof window !== 'undefined' && typeof window.process === 'object') {
    return true;
  }

  // Check if electron specific versions exist
  if (
    typeof window !== 'undefined' &&
    typeof window.require === 'function' &&
    typeof window.require('electron') !== 'undefined'
  ) {
    return true;
  }

  // Check user agent for Electron
  return navigator.userAgent.toLowerCase().indexOf(' electron/') !== -1;
};
// Function to detect tablet using User Agent
const isTabletDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
};
const deviceStateSlice = createSlice({
  name: 'deviceState',
  initialState,
  reducers: {
    setDeviceInfo: (state, action: PayloadAction<DeviceInfo>) => { 
      try {
        const info = action.payload;
        const width = window.innerWidth;
        
        // Check if running in Electron
        const runningInElectron = isElectron();
        
        // Determine if tablet
        const isTablet = !runningInElectron && 
          width > 768 && 
          width <= 1024 && 
          isTabletDevice();
        
        // Determine if mobile
        const isMobile = ['ios', 'android'].includes(info.platform) 
          ? !isTablet
          : (!runningInElectron && width <= 768);
        
        // // Determine if desktop
        // const isDesktop = runningInElectron || 
        //   (info.platform === 'web' && width > 1024 && !isTabletDevice());

          state.platform = runningInElectron ? 'electron' : info.platform; 
          state.isWeb = info.platform === 'web' && !runningInElectron;
          state.isMobile = isMobile;
          state.isTablet = isTablet;
          state.isDesktop = runningInElectron;

      } catch (error) {
        console.error('Error getting device info:', error);
      }
    },
  },
});

// Extract the actions
export const {
  setDeviceInfo
} = deviceStateSlice.actions;

export default deviceStateSlice.reducer;
