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
  popupAction?: (value: popupDataProps) => {
    type: string;
    payload: popupDataProps;
  };
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
  initialPreferences?: GridPreference;
  paramNames?: string[];
  reload?: boolean;
  showFilterInitially?: boolean;
  childPopupProps?: {
    title: string,
    width: string,
    isForm: boolean,
    content: any,
    drillDownCells: string,
    bodyProps?: string,
    enableFilter?: boolean,
    enable?: boolean
  }
}
const api = new APIClient();
const createStore = (
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
      if (enablefilter == true && filterData != undefined && filterData != null) {
        Object.entries(filterData).forEach(([key, value]) => {
          params[key] = JSON.stringify(value);
        });
      }
      const queryString = new URLSearchParams(params).toString();
      try {
        const result = method == ActionType.GET ? await api.get(dataUrl, queryString) : method == ActionType.POST ? await api.postAsync(dataUrl, filterData != undefined && filterData != null ? filterData : postData ? postData : {}, queryString) : null;
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
  enablefilter = true,
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
  allowColumnChooser = true,
  allowFiltering = true,
  initialFilters = [],
  allowSorting = true,
  allowSearching = true,
  remoteOperations = true,
  onRowClick,
  onCellClick,
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
    enable: true
  }
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number }>({ mobile: 500, windows: 500 });
  const [addButtonText, setAddButtonText] = useState<string>(gridAddButtonText == "Add" ? t("add") : gridAddButtonText);
  const onPopupOpenClick = useCallback(() => { popupAction && dispatch(popupAction({ isOpen: true, key: null })); }, [dispatch, popupAction]);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - heightToAdjustOnMobile; // Assuming 200px is the height to minus for mobile
    let gridHeightWindows = wh - heightToAdjustOnWindows; // Assuming 100px is the height to minus for windows
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  const [gridCols, setGridCols] = useState<DevGridColumn[]>(columns);
  const [preferences, setPreferences] = useState<GridPreference>();
  const [filter, setFilter] = useState<any>(filterInitialData);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const [isChildOpen, setIsChildOpen] = useState<{ isOpen: boolean; props: any }>({ isOpen: false, props: {} });
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [bodyProps, setBodyProps] = useState({});
  const [_filterInitialData, set_filterInitialData] = useState(filterInitialData);
  useEffect(() => {
    if (gridId != "" && columns != undefined && columns != null) {
      onApplyPreferences(getInitialPreference(gridId, columns));
    }
  }, [gridId]);
  const onApplyPreferences = useCallback(
    (pref: GridPreference) => {
      // Your logic to handle preference changes
      // For example:
      setPreferences(pref);
      const updatedColumns = applyGridColumnPreferences(columns, pref);
      setGridCols(updatedColumns);
    },
    [columns]
  ); // Add any other dependencies here
  const onApplyFilter = useCallback(
    (_filter: any) => {
      debugger;
      const dss = { ..._filter }
      console.log(`prev:${filter}`);
      console.log(`latest:${_filter}`);
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
      debugger;
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
  const store = useMemo(() => {
    if (data) {
      return data;
    }
    else if (!dataUrl) {
      return null;
    }
    debugger;
    if (filterShowCount == 0 && enablefilter == true && showFilterInitially) {
      setShowFilter(true);
      return;
    } else {
      setShowFilter(false);
    }
    return createStore(
      keyExpr,
      dataUrl ?? "",
      enablefilter,
      allowEditing,
      method,
      postData,
      filter,
      initialFilters,
      paramNames,
      bodyProps,
    );
  }, [data, keyExpr, dataUrl, allowEditing, method, filter, reload, postData]);
  const onExportingHandler = useCallback((e: any) => {
    if (onExporting) {
      onExporting(e);
    } else {
      if (e.format === "pdf") {
        const doc = new jsPDF();
        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: e.component,
          // columnWidths: [40, 40, 40, 100],
          customizeCell({ gridCell, pdfCell }) {
            // if (gridCell.rowType === 'data') {
            //   pdfCell.styles = {
            //     ...pdfCell.styles,
            //     'font-family': 'Arial',
            //     'font-size': 10
            //   };
            // }
          },
        }).then(() => {
          doc.save("DataGrid.pdf");
        });
      } else if (e.format === "xlsx") {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Main sheet");
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
  }, [onExporting, gridId]);
  const handleCellClick = useCallback((event: any) => {
    // Check if the clicked cell's field matches childPopupProps.drillDownCells
    const _drillDownCells = childPopupProps?.drillDownCells.split(',')
    const _drillDownCell = _drillDownCells.find((x: string) => x == event.column?.dataField)
    if (_drillDownCell != undefined) {
      const updatedBodyProps: { [key: string]: any } = {};
      // Ensure childPopupProps.bodyProps is a string before splitting and iterating over it
      childPopupProps?.bodyProps?.split(',').forEach((prop: string) => {
        const trimmedProp = prop.trim();
        updatedBodyProps[trimmedProp] = event.data[trimmedProp];
      });
      debugger;
      // Update bodyProps state
      onCellClick && onCellClick(event);
      setBodyProps(updatedBodyProps);
      childPopupProps?.bodyProps && setIsChildOpen({ isOpen: true, props: updatedBodyProps });
    }
  }, []);
  const onCellPrepared = useCallback((e: any) => {
    const _drillDownCells = childPopupProps?.drillDownCells.split(',')
    const _drillDownCell = _drillDownCells.find((x: string) => x == e.column.dataField)
    if (e.rowType === "data" && _drillDownCell != undefined) {
      e.cellElement.innerHTML = `<a href="#" style="color: #1976d2; text-decoration: underline;">${e.row?.data?.[e.column.dataField]}</a>`;
      e.cellElement.onclick = (event: any) => {
        event.preventDefault();
      };
    }
  }, []);
  return (
    <Fragment>
      <div className={className}>
        <DataGrid
          dataSource={store}
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
          {allowFiltering && <FilterRow visible={true}>
            {initialFilters.map((filter, index) => (
              <Column
                key={index}
                dataField={filter.field}
                filterValue={filter.value}
                selectedFilterOperation={filter.operation}
              />
            ))}
          </FilterRow>}
          {allowSearching && <SearchPanel visible={true} />}
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
              formats={exportFormats}
              allowExportSelectedData={true}
            />
          ) : (
            <Export enabled={false}></Export>
          )}
          {stateStoring && (
            <StateStoring
              enabled={stateStoring.enabled}
              type={stateStoring.type}
              storageKey={stateStoring.storageKey}
              customLoad={stateStoring.customLoad}
              customSave={stateStoring.customSave}
            />
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
                  initialData={_filterInitialData}
                  content={
                    filterContent
                    // <LedgerReportFilter /> // Pass standalone JSX content
                  }
                  toogleFilter={showFilter}
                  onApplyFilters={(filters) => onApplyFilter(filters)}
                  onClose={onCloseFilter}
                />
              </Item>}
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
              caption={column.caption}
              dataType={column.dataType}
              allowSorting={column.allowSorting}
              allowSearch={column.allowSearch}
              allowFiltering={column.allowFiltering ?? false}
              width={column.width}
              minWidth={column.minWidth}
              fixed={column.fixed}
              fixedPosition={column.fixedPosition}
              cellRender={column.cellRender}
              visible={column.visible || false}
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
        </DataGrid>
      </div>
      {childPopupProps &&
        <ERPModal
          isOpen={isChildOpen.isOpen}
          title={childPopupProps.title}
          width={childPopupProps.width}
          isForm={childPopupProps.isForm}
          closeModal={() => {
            setIsChildOpen({ isOpen: false, props: {} });
          }}
          content={childPopupProps.content}
          contentProps={isChildOpen.props}
        />
      }
    </Fragment>
  );
};
export default React.memo(ERPDevGrid);