import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportDataGridToExcel } from "devextreme/excel_exporter";
import { DataGrid } from "devextreme-react";
import {
  FilterRow,
  HeaderFilter,
  Paging,
  Scrolling,
  SearchPanel,
  ColumnFixing,
  ColumnChooser,
  Selection,
  Grouping,
  Toolbar,
  Item,
  Export,
  Editing,
  StateStoring,
  Column,
} from "devextreme-react/cjs/data-grid";

import CustomStore from "devextreme/data/custom_store";
import { jsPDF } from "jspdf";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import { DevGridColumn, GridPreference } from "../types/dev-grid-column";
import {
  applyGridColumnPreferences,
  getInitialPreference,
} from "../../utilities/dx-grid-preference-updater";
import GridPreferenceChooser from "../../components/ERPComponents/erp-gridpreference";
import { APIClient } from "../../helpers/api-client";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import ERPButton from "./erp-button";
import { popupDataProps } from "../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { formatDate } from "devextreme/localization";
import { ActionType } from "../../redux/types";
import ERPModal from "./erp-modal";

interface ToolbarItem {
  item: React.ReactNode;
  location: "before" | "after";
}
type FilterOperation = "=" | "<>" | ">" | ">=" | "<" | "<=" | "startswith" | "endswith" | "contains" | "notcontains" | "between";

interface ERPDevGridProps {
  columns: DevGridColumn[];
  showSerialNo?: boolean;
  gridId: string;
  dataUrl?: string;
  data?: any;
  method?: ActionType;
  postData?: any;
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
  childPopupProps?: {
    title: string,
    width: string,
    isForm: boolean,
    content: any,
    buttonField: string,
    bodyProps: string
  }
}
const api = new APIClient();
const createStore = (
  keyExpr: string | string[] | undefined,
  dataUrl: string,
  allowEditing?: boolean,
  method?: ActionType,
  postData?: any,
  initialFilters?: Array<{ field: string; value: any; operation: FilterOperation }>,
  paramNames: string[] = ["skip", "take", "requireTotalCount", "sort", "filter"],
  bodyProps?: string
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

      debugger;
      const params = Object.fromEntries(
        paramNames
          .filter((paramName) => isNotEmpty(loadOptions[paramName]))
          .map((paramName) => [
            paramName,
            JSON.stringify(loadOptions[paramName])
          ])
      );

      // Append bodyProps to params
      if (bodyProps != undefined) {
        Object.entries(bodyProps).forEach(([key, value]) => {
          params[key] = JSON.stringify(value);
        });
      }


      const queryString = new URLSearchParams(params).toString();

      debugger;
      try {
        const result = method == ActionType.GET ? await api.get(dataUrl, queryString) : method == ActionType.POST ? await api.postAsync(dataUrl, postData, queryString) : null;
        debugger;
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
  columns,
  showSerialNo,
  gridId,
  dataUrl,
  data,
  method = ActionType.GET,
  postData,
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
  columnHidingEnabled = true,
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
  paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"],
  childPopupProps
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });


  const [addButtonText, setAddButtonText] = useState<string>(
    gridAddButtonText == "Add" ? t("add") : gridAddButtonText
  );
  const onPopupOpenClick = useCallback(() => {
    popupAction && dispatch(popupAction({ isOpen: true, key: null }));
  }, [dispatch, popupAction]);

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - heightToAdjustOnMobile; // Assuming 200px is the height to minus for mobile
    let gridHeightWindows = wh - heightToAdjustOnWindows; // Assuming 100px is the height to minus for windows
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);

  const [gridCols, setGridCols] = useState<DevGridColumn[]>(columns);
  const [preferences, setPreferences] = useState<GridPreference>();
  const [isChildOpen, setIsChildOpen] = useState<boolean>(false);
  const [bodyProps, setBodyProps] = useState({});
  useEffect(() => {
    console.log("preferer useeff");

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

  const isNotEmpty = (value: any) =>
    value !== undefined && value !== null && value !== "";
  const store = useMemo(() => {
    if (data) {
      return data;
    }
    if(!dataUrl)
    {
      return null;
    }
    return createStore(
      keyExpr,
      dataUrl ?? "",
      allowEditing,
      method,
      postData,
      initialFilters,
      paramNames,
      childPopupProps?.bodyProps
    );
  }, [data, keyExpr, dataUrl, allowEditing, method, postData, initialFilters, reload, childPopupProps?.bodyProps]);

  // const store = data != undefined && data != null ? data : useMemo(
  //   () => {
  //     debugger;
  //     if (reload) {
  //       const newStore = createStore(keyExpr, dataUrl??"", allowEditing, method, postData, initialFilters,undefined, childPopupProps?.bodyProps);
  //       setCurrentStore(newStore);  // Update current store whenever reload is true
  //       return newStore;
  //     }
  //     return currentStore;
  //   },
  //   [keyExpr, dataUrl, allowEditing, reload, childPopupProps?.bodyProps]
  // );

  const onExportingHandler = useCallback((e: any) => {
    if (onExporting) {
      onExporting(e);
    } else {
      if (e.format === "pdf") {
        const doc = new jsPDF();
        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: e.component,
          columnWidths: [40, 40, 40, 100],
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
    debugger;
    // Check if the clicked cell's field matches childPopupProps.buttonField
    if (event.column?.dataField === childPopupProps?.buttonField) {
      const updatedBodyProps: { [key: string]: any } = {};

      // Ensure childPopupProps.bodyProps is a string before splitting and iterating over it
      childPopupProps?.bodyProps?.split(',').forEach((prop: string) => {
        const trimmedProp = prop.trim();
        updatedBodyProps[trimmedProp] = event.data[trimmedProp];
      });

      // Update bodyProps state
      setBodyProps(updatedBodyProps);
      setIsChildOpen(true);
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
          // columnRenderingMode={columnRenderingMode}
          // rowRenderingMode={rowRenderingMode}
          keyExpr={keyExpr}
          dateSerializationFormat={dateSerializationFormat}
          // loadPanelEnabled={true}
          hoverStateEnabled={hoverStateEnabled}

        >
          <ColumnFixing enabled={true} />
          <Scrolling mode={scrollingMode} />
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
          <HeaderFilter visible={true} />
          {allowColumnChooser && <ColumnChooser enabled={true} />}
          {allowSelection && <Selection mode={selectionMode} />}
          {allowGrouping && <Grouping />}
          {groupPanelVisible && (
            <Grouping contextMenuEnabled={true} expandMode="rowClick" />
          )}
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
            {!hideGridHeader && (
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
                  {gridAddButtonType == "link" && (
                    <Link
                      to="#"
                      className="ti-btn-primary-full ti-btn ti-btn-full "
                    >
                      Add<i className="ri-user-add-line"></i>
                    </Link>
                  )}
                  {gridAddButtonType == "popup" && (
                    <ERPButton
                      variant="primary"
                      onClick={onPopupOpenClick}
                      title={addButtonText}
                      startIcon={gridAddButtonIcon}
                    ></ERPButton>
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
              allowEditing={column.allowEditing || false}
              key={column.dataField}
              dataField={column.dataField}
              caption={column.caption}
              dataType={column.dataType}
              allowSorting={column.allowSorting}
              allowSearch={column.allowSearch}
              allowFiltering={column.allowFiltering}
              width={column.width}
              minWidth={column.minWidth}
              fixed={column.fixed}
              fixedPosition={column.fixedPosition}
              cellRender={column.cellRender}
              visible={column.visible}
            />
          ))}
        </DataGrid>
      </div>
      {childPopupProps &&
        <ERPModal
          isOpen={isChildOpen}
          title={childPopupProps.title}
          width={childPopupProps.width}
          isForm={childPopupProps.isForm}
          closeModal={() => {
            setIsChildOpen(false);
          }}
          content={childPopupProps.content}
          contentProps={bodyProps}
        />
      }
    </Fragment>
  );
};

export default React.memo(ERPDevGrid);
