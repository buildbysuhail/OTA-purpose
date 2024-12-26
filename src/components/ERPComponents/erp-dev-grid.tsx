import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportDataGridToExcel } from "devextreme/excel_exporter";
import { DataGrid } from "devextreme-react/data-grid";
import { FilterRow, HeaderFilter, Paging, Scrolling, SearchPanel, ColumnFixing, ColumnChooser, Selection, Grouping, Toolbar, Item, Export, Editing, StateStoring, Column, Summary, TotalItem } from 'devextreme-react/data-grid';
import CustomStore from "devextreme/data/custom_store";
import { jsPDF } from "jspdf";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import { DevGridColumn, GridPreference } from "../types/dev-grid-column";
import { applyGridColumnPreferences, getInitialPreference } from "../../utilities/dx-grid-preference-updater";
import GridPreferenceChooser from "../../components/ERPComponents/erp-gridpreference";
import { APIClient } from "../../helpers/api-client";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import ERPButton from "./erp-button";
import { popupDataProps } from "../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { formatDate } from "devextreme/localization";
import { ActionType } from "../../redux/types";
import ERPModal from "./erp-modal";
import ErpGridGlobalFilter from "./erp-grid-global-filter";
import dxDataGrid from "devextreme/ui/data_grid";
// import dxDataGrid, { Grouping} from "devextreme/ui/data_grid";

interface ToolbarItem {
  item: React.ReactNode;
  location: "before" | "after";
}
export interface SummaryConfig {
  column: string;
  summaryType: 'sum' | 'min' | 'max' | 'avg' | 'count';
  valueFormat?: string;
  customizeText?: (itemInfo: { value: any }) => string;
}
type FilterOperation = "=" | "<>" | ">" | ">=" | "<" | "<=" | "startswith" | "endswith" | "contains" | "notcontains" | "between";

interface ERPDevGridProps {
  summaryItems?: SummaryConfig[];
  columns: DevGridColumn[];
  showSerialNo?: boolean;
  gridId: string;
  dataUrl?: string;
  filterInitialData?: any;
  enablefilter?: boolean;
  filterContent?: React.ReactNode;
  filterWidth?: string;
  data?: any;
  postData?: any;
  method?: ActionType;
  height?: number | string;
  className?: string;
  showBorders?: boolean;
  showColumnLines?: boolean;
  showRowLines?: boolean;
  pageSize?: number;
  allowPaging?: boolean;
  allowSelection?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  allowExport?: boolean;
  exportFormats?: string[];
  allowColumnReordering?: boolean;
  allowColumnResizing?: boolean;
  allowColumnChooser?: boolean;
  allowFiltering?: boolean;
  initialFilters?: Array<{ field: string; value: any; operation: FilterOperation }>,
  allowSorting?: boolean;
  allowSearching?: boolean;
  remoteOperations?:
  | boolean
  | { filtering?: boolean; sorting?: boolean; paging?: boolean };
  onRowClick?: (e: any) => void;
  onCellClick?: (e: any) => void;
  onRowDblClick?: (e: any) => void;
  onSelectionChanged?: () => void;
  onExporting?: (e: any) => void;
  onContentReady?: (e: any) => void;
  customToolbarItems?: ToolbarItem[];
  hideDefaultExportButton?: boolean;
  hideDefaultSearchPanel?: boolean;
  hideGridHeader?: boolean;
  gridHeader?: string;
  hideGridAddButton?: boolean;
  gridAddButtonType?: "link" | "popup";
  gridAddButtonIcon?: string | "";
  gridAddButtonText?: string | "Add";
  heightToAdjustOnWindows?: number;
  heightToAdjustOnMobile?: number;
  popupAction?: (value: popupDataProps) => { type: string; payload: popupDataProps; };
  defaultColumnWidth?: number;
  columnAutoWidth?: boolean;
  columnHidingEnabled?: boolean;
  stateStoring?: {
    enabled: boolean;
    type: "localStorage" | "sessionStorage" | "custom";
    storageKey?: string;
    customLoad?: () => Promise<any>;
    customSave?: (state: any) => Promise<void>;
  };
  scrollingMode?: "standard" | "virtual" | "infinite";
  allowGrouping?: boolean;
  groupPanelVisible?: boolean;
  allowEditing?: boolean;
  editMode?: "row" | "form" | "popup" | "batch";
  onRowUpdating?: (e: any) => void;
  onRowInserting?: (e: any) => void;
  onRowRemoving?: (e: any) => void;
  rowRender?: (row: any) => React.ReactNode;
  cellRender?: (cell: any) => React.ReactNode;
  locale?: string;
  columnRenderingMode?: any;
  rowRenderingMode?: "standard" | "virtual";
  keyExpr?: string | string[];
  dateSerializationFormat?: string;
  loadPanelEnabled?: boolean;
  hoverStateEnabled?: boolean;
  wordWrapEnabled?: boolean;
  initialPreferences?: GridPreference;
  paramNames?: string[];
  reload?: boolean;
  changeReload?: (action: boolean) => void;
  showFilterInitially?: boolean;
  childPopupProps?: {
    title: string,
    width: string,
    isForm: boolean,
    content: any,
    drillDownCells: string,
    bodyProps?: string,
    enableFilter?: boolean,
    enableFn?: (data: any) => boolean
  }
  childPopupPropsDynamic?: (data?: any) => {
    title: string,
    width: string,
    isForm: boolean,
    content: any,
    drillDownCells: string,
    bodyProps?: string,
    enableFilter?: boolean,
    enableFn?: () => boolean
  }
}
const api = new APIClient();
const createStore = async (
  keyExpr: string | string[] | undefined,
  dataUrl: string,
  enablefilter: boolean,
  allowEditing?: boolean,
  method?: ActionType,
  postData?: any,
  filterData?: any,
  initialFilters?: Array<{ field: string; value: any; operation: FilterOperation }>,
  paramNames: string[] = ["skip", "take", "requireTotalCount", "sort", "filter"],
  bodyProps?: any,
) => {
  return new CustomStore({
    key: keyExpr,
    load: async (loadOptions: any) => {
      if (initialFilters && initialFilters.length > 0 && !loadOptions.filter) {
        loadOptions.filter = initialFilters.map(f => {
          if (f.value instanceof Date) {
            // Format the date as ISO string
            return [f.field, f.operation, formatDate(f.value, 'yyyy-MM-ddTHH:mm:ss')];
          }
          return [f.field, f.operation, f.value];
        });
      }

      const params = Object.fromEntries(
        paramNames
          .filter((paramName) => isNotEmpty(loadOptions[paramName]))
          .map((paramName) => [
            paramName,
            JSON.stringify(loadOptions[paramName])
          ])
      );

      // Append filterData to params
      if (enablefilter && filterData) {
        Object.entries(filterData).forEach(([key, value]) => {
          params[key] = JSON.stringify(value);
        });
      }

      const queryString = new URLSearchParams(params).toString();

      try {
        const result = method === ActionType.GET
          ? await api.get(dataUrl, queryString)
          : method === ActionType.POST
            ? await api.postAsync(dataUrl, filterData != undefined && Object.keys(filterData).length > 0 ? filterData: postData != undefined ?  postData : {}, queryString)
            : null;

        return result
          ? {
            data: result.data,
            totalCount: result.totalCount,
          }
          : {
            data: [],
            totalCount: 0,
            summary: {},
            groupCount: 0,
          };
      } catch (err) {
        console.error("Load failed:", err);
        return {
          data: [],
          totalCount: 0,
          summary: {},
          groupCount: 0,
        };
      }
    },
    ...(allowEditing && {
      insert: async (values) => {
        // Implement insert logic
      },
      update: async (key, values) => {
        // Implement update logic
      },
      remove: async (key) => {
        // Implement remove logic
      },
    }),
  });
};
const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== "";
const ERPDevGrid: React.FC<ERPDevGridProps> = ({
  summaryItems = [],
  columns,
  showSerialNo,
  gridId,
  dataUrl,
  data,
  postData,
  filterInitialData,
  enablefilter = false,
  filterContent = <></>,
  filterWidth = "w-full max-w-[1000px]",
  method = ActionType.GET,
  height,
  className = "custom-data-grid",
  showBorders = true,
  showColumnLines = false,
  showRowLines = true,
  pageSize = 100,
  allowPaging = true,
  allowSelection = true,
  selectionMode = "single",
  allowExport = true,
  exportFormats = ["pdf", "excel"],
  allowColumnReordering = true,
  allowColumnResizing = true,
  allowColumnChooser = false,
  allowFiltering = true,
  initialFilters = [],
  allowSorting = true,
  allowSearching = true,
  remoteOperations = true,
  onRowClick,
  onCellClick,
  onRowDblClick,
  onSelectionChanged,
  onExporting,
  onContentReady,
  customToolbarItems = [],
  hideDefaultExportButton = false,
  hideDefaultSearchPanel = false,
  hideGridHeader = false,
  gridHeader = "",
  hideGridAddButton = false,
  gridAddButtonType = "link",
  gridAddButtonIcon = "ri-add-line",
  gridAddButtonText = "Add",
  heightToAdjustOnMobile = 200,
  heightToAdjustOnWindows = 100,
  popupAction,
  changeReload,
  defaultColumnWidth,
  columnAutoWidth = true,
  columnHidingEnabled = false,
  stateStoring,
  scrollingMode = "virtual",
  allowGrouping = false,
  groupPanelVisible = false,
  allowEditing = false,
  editMode = "row",
  onRowUpdating,
  onRowInserting,
  onRowRemoving,
  rowRender,
  cellRender,
  locale,
  columnRenderingMode = "standard",
  rowRenderingMode = "standard",
  keyExpr,
  dateSerializationFormat,
  loadPanelEnabled = true,
  hoverStateEnabled = true,
  wordWrapEnabled = true,
  initialPreferences,
  reload,
  showFilterInitially = false,
  paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"],
  childPopupProps = {
    title: '',
    width: 'mw-100',
    isForm: false,
    content: null,
    drillDownCells: '',
    bodyProps: '',
    enableFilter: false,
  },
  childPopupPropsDynamic
}) => {
  const { t } = useTranslation("main");
  const dispatch = useAppDispatch();
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number }>({ mobile: 500, windows: 500 });
  const [addButtonText, setAddButtonText] = useState<string>(gridAddButtonText == "Add" ? t("add") : gridAddButtonText);
  const onPopupOpenClick = useCallback(() => { popupAction && dispatch(popupAction({ isOpen: true, key: null, reload: false })); }, [dispatch, popupAction]);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - heightToAdjustOnMobile; // Assuming 200px is the height to minus for mobile
    let gridHeightWindows = (wh - heightToAdjustOnWindows)<300?300:wh - heightToAdjustOnWindows; // Assuming 100px is the height to minus for windows
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  const [gridCols, setGridCols] = useState<DevGridColumn[]>(columns);
  const [preferences, setPreferences] = useState<GridPreference>();
  const initialFilterState = useMemo(() => filterInitialData || {}, [filterInitialData]);
  const [filter, setFilter] = useState<any>({});
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const [isChildOpen, setIsChildOpen] = useState<{ isOpen: boolean; props: any, key?: string }>({ isOpen: false, props: {}, key:"" });
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [bodyProps, setBodyProps] = useState({});
  const [_filterInitialData, set_filterInitialData] = useState(filterInitialData);
  const [_reload, set_reload] = useState(reload);
  const [isPdfMode, setIsPdfMode] = useState(false);
  useEffect(() => {
    set_reload(reload);
  }, [reload]);
  useEffect(() => {
    if (filterInitialData && Object.keys(filter).length === 0) {
      setFilter(filterInitialData);
    }
  }, [filterInitialData]);
  useEffect(() => {
    if (gridId != "" && columns != undefined && columns != null) {
      onApplyPreferences(getInitialPreference(gridId, columns));
    }
  }, [gridId]);
  const onApplyPreferences = useCallback(
    (pref: GridPreference) => {
      setPreferences(pref);
      const updatedColumns = applyGridColumnPreferences(columns, pref);
      setGridCols(updatedColumns);
    },
    [columns]
  ); // Add any other dependencies here
  const onApplyFilter = useCallback(
    (_filter: any) => {

      const dss = { ..._filter }
      console.log(`prev:${filter}`);
      console.log(filter);
      console.log(`latest:${_filter}`);
      console.log(_filter);
      console.log(dss);
      
      if (filterShowCount == 0) {
        setFilterShowCount((prev) => prev + 1);
        console.log(`filterShowCountsfdfdfdfd: ${filterShowCount}`);
      }
      setFilter(dss);
    },
    []
  ); // Add any other dependencies here
  const onCloseFilter = useCallback(
    () => {
      console.log(`filterShowCountww: ${filterShowCount}`);
      if (filterShowCount == 0) {
        setFilter({});
        setFilterShowCount((prev) => prev + 1);
        console.log(`filterShowCount333: ${filterShowCount}`);
      }
      setShowFilter(false);
    },
    []
  );

  const [currentStore, setCurrentStore] = useState<CustomStore<any, any> | null>(null);
  const [store, setStore] = useState<CustomStore | null>(null);
  useEffect(() => {
    const fetchStore = async () => {
      if (data) {
        setStore(data);
        return;
      }
      if (!dataUrl) {
        setStore(null);
        return;
      }
      if (filterShowCount === 0 && enablefilter && showFilterInitially) {
        setShowFilter(true);
        return;
      } else {
        setShowFilter(false);
      }
      console.log(`reload: ${_reload}`);
      if (_reload !== undefined && _reload !== true) {
        // Return the current store without reloading
        setStore(currentStore);
        return;
      }
      try {
        const newStore = await createStore(
          keyExpr,
          dataUrl ?? "",
          enablefilter,
          allowEditing,
          method,
          postData,
          filter,
          initialFilters,
          paramNames,
          bodyProps
        );
        setCurrentStore(newStore);
        setStore(newStore);
        if (_reload === true) {
          changeReload && changeReload(false);
        }
      } catch (error) {
        console.error("Error creating store:", error);
        setStore(null);
      } finally {
      }
    };
    fetchStore();
  }, [data, keyExpr, dataUrl, allowEditing, method, filter, _reload,  isPdfMode]);
  const [gridInstance, setGridInst] = useState<dxDataGrid | null>(null);
  const memoizedStore = useMemo(() => store, [store]);

  const switchPdf = useCallback((e: any) => {
    setIsPdfMode((prevpdf: boolean) => {
      setGridCols((prev: any) => {
        
        if (!prevpdf) {
          // to pdf
          if (preferences) {
            return preferences.columnPreferences.filter(x => x.visible == false && x.showInPdf == true)
          }
        } else {
          if (preferences) {
            return preferences.columnPreferences.filter(x => x.visible == false)
          }
        }
        return prev;
      })
      return !prevpdf;  // Return the previous value if no change
    });
  }, [preferences, gridInstance]);
  const switchToPdf = useCallback(() => {
    setGridCols((prev: any) => {
      if (preferences) {
        const cols = preferences.columnPreferences.filter(x => x.visible == false && x.showInPdf == true);
        return cols;
      }
      return prev;
    })
  }, [preferences, gridInstance]);
  const onGridReady = (e: any) => {
    setGridInst(e.component); // Store the instance when the grid is ready
  };
  const onExportingHandler = useCallback((e: any) => {
    if (onExporting) {
      onExporting(e);
    } else {
      if (e.format === "pdf") {
        const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
        // Store original column visibility states
        const pageTitle = gridHeader;
        doc.setFontSize(16);
        doc.text(pageTitle, 40, 30);
        doc.setFontSize(10);

        const originalColumnVisibility = e.component.getVisibleColumns().map((column: any) => ({
          dataField: column.dataField,
          visible: column.visible
        }));

        const pdfVisibleColumns = preferences
          ? preferences.columnPreferences
            .filter((colPref) => colPref.showInPdf)
            .map((colPref) => colPref.dataField)
          : gridCols
            .filter((col) => col.showInPdf)
            .map((col) => col.dataField);

        const pageWidth = doc.internal.pageSize.getWidth() - 80;

        const columnsWithoutWidth = pdfVisibleColumns.filter(
          (colField) => !preferences?.columnPreferences.find(
            (colPref) => colPref.dataField === colField && colPref.width
          )
        );

        const pdfColumnsWidths = preferences
          ? preferences.columnPreferences
            .filter((colPref) => colPref.showInPdf)
            .map((colPref) => {
              if (!colPref.width) {
                return 0;
              }
              return colPref.width || 150;
            })
          : gridCols
            .filter((col) => col.showInPdf)
            .map((col) => col.width || 100);

        if (columnsWithoutWidth.length > 0) {
          const specifiedWidthTotal = pdfColumnsWidths
            .filter(width => width > 0)
            .reduce((sum, width) => sum + width, 0);
          const remainingWidth = pageWidth - specifiedWidthTotal;
          const defaultColumnWidth = remainingWidth / columnsWithoutWidth.length;

          pdfColumnsWidths.forEach((width, index) => {
            if (width === 0) {
              pdfColumnsWidths[index] = defaultColumnWidth < 300 ? 300 : defaultColumnWidth;
            }
          });
        }

        e.component.beginUpdate();
        e.component.option('wordWrapEnabled', true);
        e.component.getVisibleColumns().forEach((column: any) => {
          if (!pdfVisibleColumns.includes(column.dataField)) {
            e.component.columnOption(column.dataField, "visible", false);
          }
        });

        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: e.component,
          columnWidths: pdfColumnsWidths,
        }).then(() => {
          doc.save(`${gridId}.pdf`);
        });
      } else if (e.format === "xlsx") {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(gridHeader);

        exportDataGridToExcel({ 
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `${gridId}.xlsx`
            );
          });
        });
      }
    }
  },
    [onExporting, gridId, preferences, gridCols]
  );
  
  const handleCellClick = useCallback((event: any) => {
    const dynamicProps = childPopupPropsDynamic ? childPopupPropsDynamic(event.column?.dataField) : childPopupProps;
    
    // Check if the clicked cell's field matches dynamicProps.drillDownCells
    const _drillDownCells = dynamicProps?.drillDownCells.split(',');
    const _drillDownCell = _drillDownCells.find((x: string) => x === event.column?.dataField);
  
    if ((_drillDownCell !== undefined && dynamicProps?.enableFn == undefined) || 
        (_drillDownCell !== undefined && dynamicProps?.enableFn != undefined && dynamicProps?.enableFn(event.data))) {
      const updatedBodyProps: { [key: string]: any } = {};
  
      // Ensure dynamicProps.bodyProps is a string before splitting and iterating over it
      dynamicProps?.bodyProps != undefined ? dynamicProps?.bodyProps?.split(',').forEach((prop: string) => {
        const trimmedProp = prop.trim();
        updatedBodyProps[trimmedProp] = event.data[trimmedProp];
      }): {};
  
      // Update bodyProps state
      onCellClick && onCellClick(event);
      setBodyProps(updatedBodyProps);
      setIsChildOpen({ isOpen: true, props: updatedBodyProps, key: _drillDownCell});
      // const sd = 223;
    }
  }, []);
  
const onCellPrepared = useCallback((e: any) => {
//   // Get dynamic properties
//   const dynamicProps = childPopupPropsDynamic ? childPopupPropsDynamic() : childPopupProps;

//   // Check if the column is drill-down enabled
//   const _drillDownCells = dynamicProps?.drillDownCells?.split(',');
//   const _drillDownCell = _drillDownCells?.find((x: string) => x === e.column.dataField);
//   const val = e.row?.data?.[e.column.dataField];

//   if (
//     e.rowType === 'data' &&
//     val !== undefined &&
//     ((_drillDownCell && !dynamicProps?.enableFn) || 
//     (_drillDownCell && dynamicProps?.enableFn?.(e.row?.data)))
//   ) {
//     debugger;
//     const dfd = e.cellElement.innerHTML;
//     const isIn = (e.cellElement.innerHTML as string).includes('<span');
//     if (e.cellElement && isIn == true) {
//       e.cellElement.style.cursor = 'pointer';
//       e.cellElement.innerHTML = `<a class="drill-down-link">${val}</a>`;
      
//     } else {
//       console.error('Cell element not found');
//     }
//   }
}, []);
  return (
    <Fragment>
      <div className={className}>
        <DataGrid
     
          // wordWrapEnabled={wordWrapEnabled}
          onInitialized={onGridReady}
          dataSource={memoizedStore}
          height={gridHeight.windows}
          showBorders={showBorders}
          remoteOperations={remoteOperations}
          allowColumnReordering={allowColumnReordering}
          allowColumnResizing={allowColumnResizing}
          columnAutoWidth={columnAutoWidth}
          columnHidingEnabled={columnHidingEnabled}
          // columns={gridCols}
          onRowClick={onRowClick}
          onSelectionChanged={onSelectionChanged}
          onExporting={onExportingHandler}
          onContentReady={onContentReady}
          showColumnLines={showColumnLines}
          showRowLines={showRowLines}
          rowAlternationEnabled={true}
          onCellClick={handleCellClick}
          onRowDblClick={onRowDblClick}
          onCellPrepared={onCellPrepared}
          // columnRenderingMode={columnRenderingMode}
          // rowRenderingMode={rowRenderingMode}
          keyExpr={keyExpr}
          dateSerializationFormat={dateSerializationFormat}
          // loadPanelEnabled={true}
          hoverStateEnabled={hoverStateEnabled}>
          <ColumnFixing enabled={true} />
          <Scrolling mode={scrollingMode} showScrollbar="always" />
          {allowPaging && (
            <Paging defaultPageSize={pageSize} pageSize={pageSize} />
          )}
          {allowFiltering && <FilterRow visible={false}>
            {initialFilters.map((filter, index) => (
              <Column
                key={index}
                dataField={filter.field}
                filterValue={filter.value}
                selectedFilterOperation={filter.operation}
              />
            ))}
          </FilterRow>}
          {allowSearching && <SearchPanel visible={false} />}
          <HeaderFilter visible={false} />
          {allowColumnChooser && <ColumnChooser enabled={true} />}
          {allowSelection && <Selection mode={selectionMode} />}
          {allowGrouping && <Grouping />}
          {groupPanelVisible && (<Grouping contextMenuEnabled={true} expandMode="rowClick" />)}
          {allowEditing && (
            <Editing
              mode={editMode}
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            />
          )}
          {allowExport ? (
            <Export
              enabled={true}
              formats={["pdf", "xlsx"]}
              allowExportSelectedData={true}
            />
          ) : (
            <Export enabled={false}></Export>
          )}

          <Toolbar>
            {!hideGridHeader && (filterInitialData == undefined || filterInitialData == null) && (
              <Item location="before">
                <div className="flex  flex-col">
                  <div className="box-title !text-xl !font-medium">
                    {gridHeader}
                  </div>
                </div>
              </Item>
            )}
            {!hideDefaultSearchPanel && <Item name="searchPanel" />}
            {!hideDefaultExportButton && allowExport && (
              <Item name="exportButton" />
            )}
            
            {enablefilter == true &&  
              <Item>
                <ErpGridGlobalFilter
                  width={filterWidth}
                  gridId={gridId}
                  initialData={filter}
                  content={
                    filterContent
                    // <LedgerReportFilter /> // Pass standalone JSX content
                  }
                  toogleFilter={showFilter}
                  onApplyFilters={(filters) => onApplyFilter(filters)}
                  onClose={onCloseFilter}
                />
              </Item>
              }
            <Item>
              <GridPreferenceChooser
                columns={columns}
                gridId={gridId}
                onApplyPreferences={onApplyPreferences}
              />
            </Item>

            {!hideGridAddButton && (
              <Item>
                <div>
                  {gridAddButtonType == "link" && (<Link to="#" className="ti-btn-primary-full ti-btn ti-btn-full ">Add<i className="ri-user-add-line"></i></Link>)}
                  {gridAddButtonType == "popup" && (
                    <ERPButton
                      variant="primary"
                      onClick={onPopupOpenClick}
                      title={addButtonText}
                      startIcon={gridAddButtonIcon}>
                    </ERPButton>
                  )}
                </div>
              </Item>
            )}
            {customToolbarItems
              ?.filter((item) => item.location === "before")
              .map((toolbarItem, index) => (
                <Item key={index} location="before">
                  {toolbarItem.item}
                </Item>
              ))}
            {customToolbarItems
              ?.filter((item) => item.location === "after")
              .map((toolbarItem, index) => (
                <Item key={index} location="after">
                  {toolbarItem.item}
                </Item>
              ))}
          </Toolbar>
          {gridCols?.map((column) => (
            <Column
              customizeText={column.customizeText}
              allowEditing={column.allowEditing || false}
              key={column.dataField}
              dataField={column.dataField}
              caption={column.captionDynamic != undefined ? column.captionDynamic(filter) : column.caption}
              dataType={column.dataType}
              allowSorting={column.allowSorting}
              allowSearch={column.allowSearch}
              allowFiltering={column.allowFiltering ?? false}
              width={column.width}
              minWidth={column.minWidth}
              fixed={column.fixed}
              fixedPosition={column.fixedPosition}
              cellRender={column.cellRender}
              visible={column.visibleDynamic != undefined ? column.visibleDynamic(filter) :  column.visible || false}
            />
          ))}
          {summaryItems.length > 0 && (
            <Summary>
              {summaryItems.map((config, index) => (
                <TotalItem
                  key={index}
                  column={config.column}
                  summaryType={config.summaryType}
                  valueFormat={config.valueFormat}
                  customizeText={config.customizeText}
                />
              ))}
            </Summary>
          )}
             <Grouping
        autoExpandAll={true}
        allowCollapsing={false}
    />
        </DataGrid>
      </div>
      {(childPopupProps || childPopupPropsDynamic) && (
  <ERPModal
    isOpen={isChildOpen.isOpen}
    title={childPopupPropsDynamic 
      ? childPopupPropsDynamic(isChildOpen.key).title 
      : childPopupProps?.title}
    width={childPopupPropsDynamic 
      ? childPopupPropsDynamic(isChildOpen.key).width 
      : childPopupProps?.width}
    isForm={childPopupPropsDynamic 
      ? childPopupPropsDynamic(isChildOpen.key).isForm 
      : childPopupProps?.isForm}
    closeModal={() => setIsChildOpen({ isOpen: false, props: {} })}
    content={childPopupPropsDynamic 
      ? childPopupPropsDynamic(isChildOpen.key).content 
      : childPopupProps?.content}
    contentProps={isChildOpen.props}
  />
)}
    </Fragment>
  );
};
const _DrillDownCellTemplate = ({ data }: { data: any }) => {
  debugger;
  if (data.value != undefined  && data.value != null && data.value != '' && data.value != 0) {
    return (
      <a
        href="#"
        style={{ color: '#1976d2', textDecoration: 'underline' }}
        onClick={(e) => {
          e.preventDefault();
          // Handle drill-down logic here
        }}
      >
        {data.value.toString()}
      </a>
    );
  }

  return <span>{data.value}</span>;
};
const DrillDownCellTemplate = React.memo(_DrillDownCellTemplate);
export default React.memo(ERPDevGrid);
export { DrillDownCellTemplate };