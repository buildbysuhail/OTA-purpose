import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppInitialState, AppState, Locale, TableState } from './types';
import { getAppState, uploadAppState } from './thunk';
import usFlag from '../../../assets/images/flags/us_flag.png'

// Define the initial state
const initialState: AppInitialState = {
  syncing: false,
  appState: {
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
    //
    pdfTemplates: null,
    tableState: {
      _items_items: {
        sku: false,
        type: false,
        available_qty: false,
        reorder_point: false,
        default_purchase_price: false,
        sales_account_name: false,
        purchase_account_name: false,
        sales_description: false,
        purchase_description: false,
        code: false,
      },
      _sales_customers: { email_1: false, first_name: false, last_name: false, payment_terms_name: false, website: false },
      _sales_estimates: { reference: false, sales_person_name: false, sub_total: false, expected_delivery_date: false },
      _sales_retainer_invoice: { reference_number: false, estimate: false },
      _sales_sales_orders: { reference: false, expected_delivery_date: false, is_tax: false },
      _sales_sales_return: { reference: false, balance_due: false, expected_delivery_date: false },
      _sales_delivery_challans: { reference_number: false, company_name: false, sales_invoice_status: false },
      _sales_invoices: { sale_order: false, is_tax: false, reference: false, balance_due: false },
      _sales_payments_received: { reference_number: false },
      _sales_recurring_invoices: { end_date: false, sales_person_name: false },
      _purchase_vendors: { email_1: false, first_name: false, last_name: false, phone_2: false, payment_terms_name: false, website: false },
      _purchase_expenses: { reference: false },
      _purchase_purchase_order: { reference: false, expected_delivery_date: false },
      _purchase_bills: { reference_number: false, expected_delivery_date: false, balance_due: false },
      _purchase_payments_made: { reference_number: false, invoice_numbers: false, status: false },
      _purchase_recurring_bills: { last_bill_date: false },
      _purchase_recurring_expenses: { last_bill_date: false, next_bill_date: false },
    },
    locale: { code: 'en', name: 'English', rtl: false, flag:usFlag },
  },
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
    setPdfTemplates: (state, action: PayloadAction<any>) => {
      state.appState.pdfTemplates = action.payload;
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.appState.locale = action.payload;
    },
    setTableState: (state, action: PayloadAction<TableState>) => {
      state.appState.tableState = action.payload;
    },
  },
});

// Extract the actions
export const {
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
  setPdfTemplates,
  setLocale,
  setTableState,
} = appStateSlice.actions;

export default appStateSlice.reducer;
