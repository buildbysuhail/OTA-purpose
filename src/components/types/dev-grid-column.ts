
export const initialGridPreference: GridPreference = {
    font: "",
    fontSize: 10,
    bold: false,
    rowHeigh: 5,
    alternativeColor: "rgb(25,118,210,1)",
    backgroundHeadColor: "rgb(25,118,210,1)",
    foreHeadColor: "rgb(25,118,210,1)",
    gridLine: "rgb(25,118,210,1)",
    backgroundColor: "rgb(25,118,210,1)",
    foreColor: "rgb(25,118,210,1)",
    orientation:"portrait",
    columnPreferences: [],
    
    // groupIndex:0
  };
export interface DevGridColumn {
    dataField?: string;
    caption?: string;
    dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
    allowSorting?: boolean;
    allowSearch?: boolean |true;
    allowFiltering?: boolean;
    minWidth?: number;
    fixed?: boolean;
    isLocked?: boolean | false;
    fixedPosition?: 'left' | 'right';
    width?: number;
    alignment?: "center" | "left" | "right";
    showInPdf?: boolean | false;
    allowEditing?: boolean;
    format?: string;
    visible?: boolean;
    visibleDynamic?: (filter: any) => boolean;
    captionDynamic?: (filter: any) => string;
    groupIndex?:any;
    editorOptions?: any;
    validationRules?: any;
    customizeText?:(cellElement: any) => string;
    cellRender?: (cellElement: any, cellInfo: any, filter?: any, pdfCell?: any) => any;
    cellRenderDynamic?: (cellElement: any, cellInfo: any, filter?: any, pdfCell?: any) => React.ReactNode;
    cellRenderDynamicRootState?: (cellElement: any, cellInfo: any, state?: any) => React.ReactNode;
  }
  const initialColumnPreference: ColumnPreference = {
    dataField: '',
    format: '',
    isLocked: false,
    caption: "Column Header",        // string: the text to display in the header
    width: 150,                         // number: column width in pixels
    minWidth: 150,                         // number: column width in pixels
    alignment: 'left',                      // 'left' | 'center' | 'right': text alignment
    visible: true,                      // boolean: whether the column is visible
    readOnly: false,                    // boolean: whether the column is read-only
    fontBold: false,                    // boolean: whether the font is bold
    fontColor: "#000000",               // string: font color in hex
    fontSize: 12,   
    showInPdf: true,                    // number: font size
    displayOrder: 1  ,                // number: the order in which the column appears
    groupIndex:0
  };
  export interface Preferences {
    [dataField: string]: ColumnPreference;
  }
  export interface ColumnPreference {
    caption: string;
    isLocked: boolean;
    dataField: string;
    format?: string;
    width?: number;
    minWidth?: number;
    alignment: 'left' | 'center' | 'right';
    visible: boolean;
    readOnly: boolean;
    fontBold: boolean;
    fontColor: string;
    fontSize: number;
    showInPdf: boolean;
    displayOrder: number;
    groupIndex?:any
  }
  export interface GridPreference {
    font: string;
    fontSize: number;
    bold: boolean;
    rowHeigh: number;
    alternativeColor: string;
    backgroundHeadColor: string;
    foreHeadColor: string;
    gridLine: string;
    backgroundColor: string;
    foreColor: string;
    orientation:"portrait"|"landscape";
    columnPreferences: Array<ColumnPreference>;
  }