export interface DevGridColumn {
    dataField: string
    caption?: string
    width?: number
    alignment?: string
    isLocked?: boolean
    showInPdf?: boolean
  }
  
  export interface ColumnPreference {
    dataField: string
    isLocked: boolean
    caption: string
    width: number
    alignment: string
    visible: boolean
    readOnly: boolean
    fontBold: boolean
    fontColor: string
    fontSize: number
    displayOrder: number
    showInPdf: boolean
    groupIndex?: number
  }
  
  export interface GridPreference {
    gridId: string
    columnPreferences: ColumnPreference[]
    orientation: "portrait" | "landscape"
  }
  
  export const initialGridPreference: GridPreference = {
    gridId: "",
    columnPreferences: [],
    orientation: "portrait",
  }