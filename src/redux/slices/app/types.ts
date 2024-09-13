export interface Locale {
  code: string;
  name: string;
  rtl: boolean;
}

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
  pdfTemplates: any;
  locale: Locale;
  tableState?: TableState;
}
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
}
export interface AppInitialState {
  syncing: boolean;
  appState: AppState;
}
