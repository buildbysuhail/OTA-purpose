import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppInitialState, AppState, Locale, TableState,inputBox } from './types';
import { getAppState, uploadAppState } from './thunk';
import usFlag from '../../../assets/images/flags/us_flag.png'

 export const appInitialState: AppState = {
   dir: 'ltr',
   decimals: 2,
   mode: 'light',
   class: "light",
   dataMenuStyles: "dark",
   dataNavLayout: "vertical",
   dataHeaderStyles: "color",
   dataVerticalStyle: "overlay",
   toggled: "",
   dataNavStyle: "",
   horStyle: "",
   dataPageStyle: "regular",
   dataWidth: "fullwidth",
   dataMenuPosition: "fixed",
   dataHeaderPosition: "fixed",
   loader: "disable",
   iconOverlay: "",
   colorPrimaryRgb: "",
   colorPrimary: "",
   bodyBg: "",
   Light: "",
   darkBg: "",
   inputBorder: "",
   bgImg: "",
   iconText: "",
   body: {
     class: ""
   },
   scrollbarWidth: "sm",
   scrollbarColor: '128, 128, 128',
   inputBox: {
     inputStyle: "normal",
     inputSize: "sm",
     checkButtonInputSize: "sm",
     inputHeight: 2.0,
     fontSize: 13,
     fontWeight: 400,
     labelFontSize: 13,
     otherLabelFontSize: 13,
     borderColor: '128, 128, 128',
     selectColor:'128, 128, 128', 
     fontColor: '128, 128, 128',
     labelColor:'128, 128, 128',
     borderFocus: '128, 128, 128',
     borderRadius: 5,
     adjustA: 0,
     adjustB: 0,
     adjustC: 0,
     adjustD: 0,
     marginTop: 0,
     marginBottom: 0,
   },
   locale: { code: 'en', name: 'English', rtl: false, flag:usFlag },
 }
 export const initialState: AppInitialState = {
   syncing: false,
   appState: appInitialState,
   softwareDate: ''
 };

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<AppState>) => {
      state.appState = action.payload;
    },
    setDirection: (state, action: PayloadAction<'ltr' | 'rtl'>) => {
      state.appState.dir = action.payload;
    },
    setDecimals: (state, action: PayloadAction<number>) => {
      state.appState.decimals = action.payload;
    },
    setMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.appState.mode = action.payload;
      state.appState.class = action.payload;
      state.appState.dataHeaderStyles = action.payload;
      state.appState.darkBg = "";
      state.appState.bodyBg = "";
      state.appState.dataMenuStyles = action.payload == "dark" ? "dark" :state.appState.dataNavLayout == 'horizontal' ? 'light' : "dark";
      state.appState.inputBorder = "";
      state.appState.Light = "";      
      
    },
    setClass: (state, action: PayloadAction<string>) => {
      state.appState.class = action.payload;
    },
    setDataMenuStyles: (state, action: PayloadAction<string>) => {
      state.appState.dataMenuStyles = action.payload;
    },
    setDataNavLayout: (state, action: PayloadAction<'vertical' | 'horizontal'>) => {
      state.appState.dataNavLayout = action.payload;
    },
    setDataHeaderStyles: (state, action: PayloadAction<string>) => {
      state.appState.dataHeaderStyles = action.payload;
    },
    setDataVerticalStyle: (state, action: PayloadAction<string>) => {
      state.appState.dataVerticalStyle = action.payload;
    },
    setToggled: (state, action: PayloadAction<string>) => {
      state.appState.toggled = action.payload;
    },
    setDataNavStyle: (state, action: PayloadAction<string>) => {
      state.appState.dataNavStyle = action.payload;
    },
    setHorStyle: (state, action: PayloadAction<string>) => {
      state.appState.horStyle = action.payload;
    },
    setDataPageStyle: (state, action: PayloadAction<string>) => {
      state.appState.dataPageStyle = action.payload;
    },
    setDataWidth: (state, action: PayloadAction<string>) => {
      state.appState.dataWidth = action.payload;
    },
    setDataMenuPosition: (state, action: PayloadAction<string>) => {
      state.appState.dataMenuPosition = action.payload;
    },
    setDataHeaderPosition: (state, action: PayloadAction<string>) => {
      state.appState.dataHeaderPosition = action.payload;
    },
    setLoader: (state, action: PayloadAction<'enable' | 'disable'>) => {
      state.appState.loader = action.payload;
    },
    setIconOverlay: (state, action: PayloadAction<string>) => {
      state.appState.iconOverlay = action.payload;
    },
    setColorPrimaryRgb: (state, action: PayloadAction<string>) => {
      state.appState.colorPrimaryRgb = action.payload;
    },
    setColorPrimary: (state, action: PayloadAction<string>) => {
      state.appState.colorPrimary = action.payload;
    },
    setBodyBg: (state, action: PayloadAction<string>) => {
      state.appState.bodyBg = action.payload;
    },
    setLight: (state, action: PayloadAction<string>) => {
      state.appState.Light = action.payload;
    },
    setDarkBg: (state, action: PayloadAction<string>) => {
      state.appState.darkBg = action.payload;
    },
    setInputBorder: (state, action: PayloadAction<string>) => {
      state.appState.inputBorder = action.payload;
    },
    setBgImg: (state, action: PayloadAction<string>) => {
      state.appState.bgImg = action.payload;
    },
    setIconText: (state, action: PayloadAction<string>) => {
      state.appState.iconText = action.payload;
    },
    setBodyClass: (state, action: PayloadAction<string>) => {
      state.appState.body.class = action.payload;
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.appState.locale = action.payload;
      
    },
    setScrollbarWidth: (state, action: PayloadAction<"sm" | "md" | "lg">) => {
      state.appState.scrollbarWidth = action.payload;
    },
    setScrollbarColor: (state, action: PayloadAction<string>) => {
      state.appState.scrollbarColor = action.payload;
    },
    setInputBox: (state, action: PayloadAction<Partial<inputBox>>) => {
      state.appState.inputBox = {
        ...state.appState.inputBox,
        ...action.payload
      };
    }
  },
});

// Extract the actions
export const {
  setInputBox,
  setScrollbarColor,
  setScrollbarWidth,
  setAppState,
  setDirection,
  setDecimals,
  setMode,
  setClass,
  setDataMenuStyles,
  setDataNavLayout,
  setDataHeaderStyles,
  setDataVerticalStyle,
  setToggled,
  setDataNavStyle,
  setHorStyle,
  setDataPageStyle,
  setDataWidth,
  setDataMenuPosition,
  setDataHeaderPosition,
  setLoader,
  setIconOverlay,
  setColorPrimaryRgb,
  setColorPrimary,
  setBodyBg,
  setLight,
  setDarkBg,
  setInputBorder,
  setBgImg,
  setIconText,
  setBodyClass,
  setLocale,
} = appStateSlice.actions;

export default appStateSlice.reducer;
