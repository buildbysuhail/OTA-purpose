interface DevGridColumn {
    dataField?: string;
    caption?: string;
    dataType?: 'string' | 'number' | 'date' | 'boolean';
    allowSorting?: boolean;
    allowSearch?: boolean;
    allowFiltering?: boolean;
    minWidth?: number;
    fixed?: boolean;
    isLocked?: boolean | false;
    fixedPosition?: 'left' | 'right';
    width?: number;
    alignment?: "center" | "left" | "right";
    showInPdf?: boolean;
    cellRender?: (cellElement: any, cellInfo: any) => React.ReactNode;
  }