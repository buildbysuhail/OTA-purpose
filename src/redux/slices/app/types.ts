
import usFlag from "../../../assets/images/flags/us_flag.png";
import arFlag from "../../../assets/images/flags/ar_flag.png";

export interface Locale {
  code: string;
  name: string;
  rtl: boolean;
  flag: string;
}


export const languagesData: Locale[] = [
  { code: 'en', name: 'English', flag: usFlag, rtl: false },
  { code: 'ar', name: 'Arabic', flag: arFlag, rtl: true },
]
export interface TableState {
  _items_items: Record<string, boolean>;
  _sales_customers: Record<string, boolean>;
  _sales_estimates: Record<string, boolean>;
  _sales_retainer_invoice: Record<string, boolean>;
  _sales_sales_orders: Record<string, boolean>;
  _sales_sales_return: Record<string, boolean>;
  _sales_delivery_challans: Record<string, boolean>;
  _sales_invoices: Record<string, boolean>;
  _sales_payments_received: Record<string, boolean>;
  _sales_recurring_invoices: Record<string, boolean>;
  _purchase_vendors: Record<string, boolean>;
  _purchase_expenses: Record<string, boolean>;
  _purchase_purchase_order: Record<string, boolean>;
  _purchase_bills: Record<string, boolean>;
  _purchase_payments_made: Record<string, boolean>;
  _purchase_recurring_bills: Record<string, boolean>;
  _purchase_recurring_expenses: Record<string, boolean>;
}

export interface AppState {
  direction?: string;
  dir: "ltr" | "rtl";
  decimals: number;
  mode: "light" | "dark";
  class: string;
  dataMenuStyles: string;
  dataNavLayout: "vertical" | "horizontal";
  dataHeaderStyles: string;
  dataVerticalStyle: string;
  toggled: string;
  dataNavStyle: string;
  horStyle: string;
  dataPageStyle: string;
  dataWidth: string;
  dataMenuPosition: string;
  dataHeaderPosition: string;
  loader: "enable" | "disable";
  iconOverlay: string;
  colorPrimaryRgb: string;
  colorPrimary: string;
  bodyBg: string;
  Light: string;
  darkBg: string;
  inputBorder: string;
  bgImg: string;
  iconText: string;
  body: {
    class: string;
  };
  locale: Locale;
  scrollbarWidth: "sm" | "md" | "lg";
  scrollbarColor: string;
  inputBox: inputBox;
}
export const initialThemeData: Theme = {
  direction: "ltr",  // default to left-to-right
  mode: "light",     // default to light mode
  navLayout: null,   // initialize as null, can be assigned a specific layout later
  navigationMenuStyle: null,  // initialize as null
  sidemenuLayoutStyles: null, // initialize as null
  pageStyle: null,    // initialize as null
  headerStyle: null,  // initialize as null
  menuStyle: null,    // initialize as null
  menuPosition: null, // initialize as null
  headerPosition: 'fixed',  // default position for header
  colorPrimaryRgb: '255,255,255',  // default white color in RGB format
  scrollbarWidth: "sm",
  scrollbarColor: '219,223,225',
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
    selectColor: '128, 128, 128',
    borderFocus: '128, 128, 128',
    fontColor: '128, 128, 128',
    labelColor: '128, 128, 128',
    borderRadius: 5,
    adjustA: 0,
    adjustB: 0,
    adjustC: 0,
    adjustD: 0,
    marginTop: 0,
    marginBottom: 0,
    focusForeColor: "white",
    focusBgColor: "gold",
    defaultBgColor: "transparent",
  },
};
export interface Theme {
  direction: "ltr" | "rtl";
  mode: "light" | "dark";
  navLayout: string | null;
  navigationMenuStyle: string | null;
  sidemenuLayoutStyles: string | null;
  pageStyle: string | null;
  headerStyle: string | null;
  menuStyle: string | null;
  menuPosition: string | null;
  headerPosition: string;
  colorPrimaryRgb: string;
  scrollbarWidth: "sm" | "md" | "lg";
  scrollbarColor: string;
  inputBox: inputBox;

}
export interface inputBox {
  inputStyle: "normal" | "filled" | "outlined" | "standard";
  inputSize: "sm" | "md" | "lg" | "customize",
  checkButtonInputSize: "sm" | "md" | "lg";
  inputHeight: number,
  fontSize: number;
  fontWeight: number;
  labelFontSize: number;
  otherLabelFontSize: number;
  borderColor: string;
  selectColor: string;
  fontColor: string;
  labelColor: string;
  borderFocus: string;
  borderRadius: number;
  adjustA: number;
  adjustB: number;
  adjustC: number;
  adjustD: number;
  marginTop: number;
  marginBottom: number;
  focusForeColor: string,
  focusBgColor: string,
  defaultBgColor?: string;
}
export interface AppInitialState {
  syncing: boolean;
  softwareDate: string;
  appState: AppState;
}
