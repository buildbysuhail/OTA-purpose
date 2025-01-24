import React, {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportDataGridToExcel } from "devextreme/excel_exporter";
import { DataGrid, GroupItem } from "devextreme-react/data-grid";
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
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
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
import {
  useAppDispatch,
  useAppSelector,
} from "../../utilities/hooks/useAppDispatch";
import ERPButton from "./erp-button";
import { popupDataProps } from "../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { formatDate } from "devextreme/localization";
import { ActionType } from "../../redux/types";
import ERPModal from "./erp-modal";
import ErpGridGlobalFilter from "./erp-grid-global-filter";
import dxDataGrid, { dxDataGridColumn } from "devextreme/ui/data_grid";
import ERPAlert from "./erp-sweet-alert";
import { StockLedgerFilterInitialState } from "../../pages/inventory/reports/stock-ledger/stock-ledger-report-filter";
import ERPToast from "./erp-toast";
import moment from "moment";
import {
  identifyDateFormat,
  isNullOrUndefinedOrEmpty,
  mergeObjectsRemovingIdenticalKeys,
} from "../../utilities/Utils";
// import dxDataGrid, { Grouping} from "devextreme/ui/data_grid";
import type { Column as ColumnType } from "devextreme/ui/data_grid";
import { RootState } from "../../redux/store";
import { UserModel } from "../../redux/slices/user-session/reducer";
import { arabicFontBase64 } from "./arabicFont";
import { transactionRoutes } from "../common/content/transaction-routes";

interface ToolbarItem {
  item: React.ReactNode;
  location: "before" | "after";
}
export interface SummaryConfig {
  column: string;
  summaryType: "sum" | "min" | "max" | "avg" | "count" | "custom";
  valueFormat?: string;
  showInGroupFooter?: true | false;
  alignByColumn?: true | false;
  customizeText?: (itemInfo: { value: any }) => string;
}
type FilterOperation =
  | "="
  | "<>"
  | ">"
  | ">="
  | "<"
  | "<="
  | "startswith"
  | "endswith"
  | "contains"
  | "notcontains"
  | "between";

interface ERPDevGridProps {
  showTotalCount?: boolean;
  summaryItems?: SummaryConfig[];
  columns: DevGridColumn[];
  showSerialNo?: boolean;
  gridId: string;
  rowData?: string;
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
  ShowGridPreferenceChooser?: boolean;
  showColumnHeaderscustom?: boolean;
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
  initialFilters?: Array<{
    field: string;
    value: any;
    operation: FilterOperation;
  }>;
  allowSorting?: boolean;
  allowSearching?: boolean;
  showFilterRow?: boolean;
  remoteOperations?:
    | boolean
    | {
        filtering?: boolean;
        sorting?: boolean;
        paging?: boolean;
        summary?: boolean;
        groupPaging?: boolean;
        grouping?: boolean;
      };
  focusedRowEnabled?: boolean;
  onRowClick?: (e: any) => void;
  onFilterChanged?: (e: any) => void;
  onCellClick?: (e: any) => void;
  onRowDblClick?: (e: any) => void;
  onSelectionChanged?: (e: any) => void;
  onSelectionChangedByRootState?: (e: any, state: RootState) => void;
  onKeyDown?: (e: any) => void;
  onExporting?: (e: any) => void;
  onContentReady?: (e: any) => void;
  customToolbarItems?: ToolbarItem[];
  hideDefaultExportButton?: boolean;
  hideDefaultSearchPanel?: boolean;
  hideGridHeader?: boolean;
  gridHeader?: string;
  filterText?: string;
  condition?: any;
  hideGridAddButton?: boolean;
  gridAddButtonType?: "link" | "popup";
  gridAddButtonIcon?: string | "";
  gridAddButtonText?: string | "Add";
  heightToAdjustOnWindows?: number;
  heightToAdjustOnMobile?: number;
  heightToAdjustOnWindowsInModal?: number;
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
  cellRenderDynamic?: (
    cellElement: any,
    cellInfo: any,
    filter?: any
  ) => React.ReactNode;
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
    title: string;
    width: string;
    isForm: boolean;
    content: any;
    drillDownCells: string;
    drillDownDisplayCells?: string;
    bodyProps?: string;
    isMaximized?: boolean;
    isTransactionScreen?: boolean;
    enableFilter?: boolean;
    origin?: string;
    enableFn?: (data: any) => boolean;
  };
  childPopupPropsDynamic?: (data?: any) => {
    title: string;
    width: string;
    isForm: boolean;
    content: any;
    drillDownCells: string;
    drillDownDisplayCells?: string;
    bodyProps?: string;
    enableFilter?: boolean;
    isTransactionScreen?: boolean;
    origin?: string;
    enableFn?: (data: any) => boolean;
  };
  originDynamic?: (data: any) => any;
  postDataDynamic?: (data: any) => any;
  [key: string]: any; // To allow other props to be passed
  enableScrollButton?: boolean;
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
  initialFilters?: Array<{
    field: string;
    value: any;
    operation: FilterOperation;
  }>,
  paramNames: string[] = [
    "skip",
    "take",
    "requireTotalCount",
    "sort",
    "filter",
  ],
  bodyProps?: any,
  setFilterValidations?: any,
  setShowFilter?: any,
  setTotalRowCount?: any
) => {
  return new CustomStore({
    key: keyExpr,
    load: async (loadOptions: any) => {
      if (initialFilters && initialFilters.length > 0 && !loadOptions.filter) {
        loadOptions.filter = initialFilters.map((f) => {
          if (f.value instanceof Date) {
            // Format the date as ISO string
            return [
              f.field,
              f.operation,
              formatDate(f.value, "yyyy-MM-ddTHH:mm:ss"),
            ];
          }
          return [f.field, f.operation, f.value];
        });
      }

      const params = Object.fromEntries(
        paramNames
          .filter((paramName) => isNotEmpty(loadOptions[paramName]))
          .map((paramName) => [
            paramName,
            JSON.stringify(loadOptions[paramName]),
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
        setFilterValidations(undefined);
        const result =
          method === ActionType.GET
            ? await api.get(dataUrl, queryString)
            : method === ActionType.POST
            ? await api.postAsync(
                dataUrl,
                filterData != undefined && Object.keys(filterData).length > 0
                  ? filterData
                  : postData != undefined
                  ? postData
                  : {},
                queryString
              )
            : null;

        if (
          result != undefined &&
          result.isOk != undefined &&
          result.isOk == false
        ) {
          ERPToast.show(result.message, "error");
        }

        if (
          result != undefined &&
          result.isOk != undefined &&
          result.isOk == false
        ) {
          setFilterValidations(result.validations);
          setShowFilter(true);
        } else {
          setFilterValidations(undefined);
        }
        setTotalRowCount((prev: number) =>
          prev <= 0
            ? result.dataRowCount != undefined && result.dataRowCount != null
              ? result.dataRowCount
              : result.totalCount
            : prev
        );
        return result != undefined
          ? result.isOk != undefined && result.isOk == false
            ? {
                data: [],
                totalCount: -1,
                summary: {},
                groupCount: 0,
              }
            : {
                data: result.data,
                totalCount: result.totalCount,
              }
          : {
              data: [],
              totalCount: -1,
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
// Forward the ref
const ERPDevGrid: React.FC<ERPDevGridProps> = forwardRef(
  (
    {
      showTotalCount = true,
      summaryItems = [],
      columns,
      showSerialNo,
      gridId,
      dataUrl,
      data,
      postData,
      rowData,
      filterInitialData,
      enablefilter = false,
      filterContent = <></>,
      filterWidth = "w-full max-w-[1000px]",
      method = ActionType.GET,
      height,
      className = "custom-data-grid",
      showBorders = true,
      showColumnLines = false,
      ShowGridPreferenceChooser = true,
      showColumnHeaderscustom = true,
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
      showFilterRow = true,
      remoteOperations = true,
      condition,
      focusedRowEnabled = false,
      onRowClick,
      onFilterChanged,
      onCellClick,
      onRowDblClick,
      onSelectionChanged,
      onSelectionChangedByRootState,
      onKeyDown,
      onExporting,
      onContentReady,
      customToolbarItems = [],
      hideDefaultExportButton = false,
      hideDefaultSearchPanel = false,
      hideGridHeader = false,
      gridHeader = "",
      filterText = "",
      hideGridAddButton = false,
      gridAddButtonType = "link",
      gridAddButtonIcon = "ri-add-line",
      gridAddButtonText = "Add",
      heightToAdjustOnMobile = 200,
      heightToAdjustOnWindows = showTotalCount ? 150 : 100,
      heightToAdjustOnWindowsInModal,
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
      cellRenderDynamic,
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
        title: "",
        width: "mw-100",
        isForm: false,
        content: null,
        drillDownCells: "",
        bodyProps: "",
        isTransactionScreen: false,
      },
      childPopupPropsDynamic,
      originDynamic,
      postDataDynamic,
      enableScrollButton = true,
      ...props
    },
    ref
  ) => {
    const gridRef = useRef<any>(null); // Use `any` for the instance
    useImperativeHandle(ref, () => ({
      instance: () => gridRef.current?.instance(), // Safely access instance()
    }));

    const { t } = useTranslation("main");
    const dispatch = useAppDispatch();
    const userSession = useAppSelector(
      (state: RootState) => state.UserSession as any
    );
    const [gridHeight, setGridHeight] = useState<{
      mobile: number;
      windows: number;
    }>({ mobile: 500, windows: 500 });
    const [addButtonText, setAddButtonText] = useState<string>(
      gridAddButtonText == "Add" ? t("add") : gridAddButtonText
    );
    const onPopupOpenClick = useCallback(() => {
      popupAction &&
        dispatch(popupAction({ isOpen: true, key: null, reload: false }));
    }, [dispatch, popupAction]);

    useEffect(() => {
      let wh = window.innerHeight;
      let gridHeightMobile =
        heightToAdjustOnMobile !== undefined
          ? wh - heightToAdjustOnMobile
          : heightToAdjustOnWindowsInModal ?? 400;

      let gridHeightWindows =
        heightToAdjustOnWindowsInModal !== undefined
          ? heightToAdjustOnWindowsInModal
          : wh - heightToAdjustOnWindows < 300
          ? 300
          : wh - heightToAdjustOnWindows;
      setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [
      heightToAdjustOnMobile,
      heightToAdjustOnWindows,
      heightToAdjustOnWindowsInModal,
    ]);

    const [gridCols, setGridCols] = useState<DevGridColumn[]>(columns);
    const rootState = useAppSelector(x => x)
    const [preferences, setPreferences] = useState<GridPreference>();
    const initialFilterState = useMemo(
      () => filterInitialData || {},
      [filterInitialData]
    );
    const [filter, setFilter] = useState<any>({});
    const [filterValidations, setFilterValidations] = useState<any>({});
    const [filterShowCount, setFilterShowCount] = useState<number>(0);
    const [isChildOpen, setIsChildOpen] = useState<{
      isOpen: boolean;
      props: any;
      key?: string;
      drillDownDisplayCells?: string[];
      data?: any;
    }>({ isOpen: false, props: {}, key: "", drillDownDisplayCells: [] });
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [bodyProps, setBodyProps] = useState({});
    const [_filterInitialData, set_filterInitialData] =
      useState(filterInitialData);
    const [_reload, set_reload] = useState(reload);
    const [isPdfMode, setIsPdfMode] = useState(false);
    useEffect(() => {
      set_reload(reload);
    }, [reload]);
    useEffect(() => {
      setGridCols(columns);
    }, []);
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
    const onApplyFilter = useCallback((_filter: any) => {
      const dss = { ..._filter };
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
      onFilterChanged != undefined && onFilterChanged(dss);
    }, []); // Add any other dependencies here
    // const onCloseFilter = useCallback(() => {
    //   console.log(`filterShowCountww: ${filterShowCount}`);
    //   if (filterShowCount == 0) {
    //
    //     setFilter({});
    //     setFilterShowCount((prev) => prev + 1);
    //     console.log(`filterShowCount333: ${filterShowCount}`);
    //   }
    //   setShowFilter(false);
    // }, []);

    const [currentStore, setCurrentStore] = useState<CustomStore<
      any,
      any
    > | null>(null);
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
            bodyProps,
            setFilterValidations,
            setShowFilter,
            setTotalRowCount
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
    }, [
      data,
      keyExpr,
      dataUrl,
      allowEditing,
      method,
      filter,
      _reload,
      isPdfMode,
    ]);
    const [gridInstance, setGridInst] = useState<dxDataGrid | null>(null);
    const memoizedStore = useMemo(() => store, [store]);
    //SAfvan
    // const switchPdf = useCallback((e: any) => {
    //   setIsPdfMode((prevpdf: boolean) => {
    //     setGridCols((prev: any) => {

    //       if (!prevpdf) {
    //         // to pdf
    //         if (preferences) {
    //           return preferences.columnPreferences.filter(x => x.visible == false && x.showInPdf == true)
    //         }
    //       } else {
    //         if (preferences) {
    //           return preferences.columnPreferences.filter(x => x.visible == false)
    //         }
    //       }
    //       return prev;
    //     })
    //     return !prevpdf;  // Return the previous value if no change
    //   });
    // }, [preferences, gridInstance]);
    const switchToPdf = useCallback(() => {
      setGridCols((prev: any) => {
        if (preferences) {
          const cols = preferences.columnPreferences.filter(
            (x) => x.visible == false && x.showInPdf == true
          );
          return cols;
        }
        return prev;
      });
    }, [preferences, gridInstance]);
    const onGridReady = (e: any) => {
      setGridInst(e.component);
    };

    const formatStringWithConditions = (
      formatString: string,
      formState: any
    ): string => {
      // Helper function to format dates in dd/MM/yyyy format
      const formatDate = (dateStr: string): string => {
        const format = identifyDateFormat(dateStr);
        let date;

        // Explicit handling for ISO 8601
        if (format == "Unknown format") {
          date = moment(dateStr).local();
        } else if (format === "ISO 8601") {
          date = moment(dateStr).local(); // ISO 8601 is natively supported
        } else {
          date = moment(dateStr, format).local();
        }

        const str = date.format("DD/MM/YYYY");
        return str;
      };

      // Function to evaluate and replace placeholders and conditions
      const evaluateExpression = (expression: string, data: any): boolean => {
        // Create a safer scope for evaluating the expression by passing 'data' as an argument
        try {
          return new Function(...Object.keys(data), `return ${expression};`)(
            ...Object.values(data)
          );
        } catch (error) {
          console.error("Error evaluating expression:", error);
          return false; // Return false in case of error
        }
      };

      // Replace placeholders and conditions
      return formatString.replace(/{([^}]+)}/g, (match, placeholder) => {
        // Handle conditional expressions using '&&'
        if (placeholder.includes("&&")) {
          const [condition, trueValue] = placeholder.split("&&");
          const conditionResult = evaluateExpression(
            condition.trim(),
            formState
          );
          const result = conditionResult
            ? trueValue.replace(
                /\[([^\]]+)\]/g,
                (innerMatch: any, innerPlaceholder: any) => {
                  if (
                    innerPlaceholder.includes("date") ||
                    innerPlaceholder.includes("Date")
                  ) {
                    // If the placeholder is a date, format it
                    return formatDate(formState[innerPlaceholder]);
                  }
                  return formState[innerPlaceholder] || "N/A"; // Return the value from formState, or "N/A" if not found
                }
              )
            : "";

          return result;
        } else if (placeholder.includes("___")) {
          const [l, r] = placeholder.split("___");
          const result = r
            ? r.replace(
                /\(([^\]]+)\)/g,
                (innerMatch: any, innerPlaceholder: any) => {
                  if (
                    innerPlaceholder.includes("date") ||
                    innerPlaceholder.includes("Date")
                  ) {
                    // If the placeholder is a date, format it
                    return rowData != undefined
                      ? formatDate(rowData[innerPlaceholder])
                      : "N/A";
                  }
                  return rowData != undefined
                    ? rowData[innerPlaceholder] || "N/A"
                    : "N/A"; // Return the value from formState, or "N/A" if not found
                }
              )
            : "";

          return result;
        } else if (placeholder.includes("****")) {
          const [l, r] = placeholder.split("****");
          const result = r
            ? r.replace(
                /\(([^\]]+)\)/g,
                (innerMatch: any, innerPlaceholder: any) => {
                  if (
                    innerPlaceholder.includes("date") ||
                    innerPlaceholder.includes("Date")
                  ) {
                    // If the placeholder is a date, format it
                    return formatDate(postData[innerPlaceholder]);
                  }
                  return postData != undefined
                    ? postData[innerPlaceholder] || "N/A"
                    : "N/A"; // Return the value from formState, or "N/A" if not found
                }
              )
            : "";

          return result;
        } else if (placeholder.includes("---")) {
          const [l, r] = placeholder.split("---");
          const result = r
            ? r.replace(
                /\(([^\]]+)\)/g,
                (innerMatch: any, innerPlaceholder: any) => {
                  if (
                    innerPlaceholder.includes("date") ||
                    innerPlaceholder.includes("Date") ||
                    innerPlaceholder.includes("finFrom") ||
                    innerPlaceholder.includes("finTo")
                  ) {
                    // If the placeholder is a date, format it
                    return formatDate(userSession[innerPlaceholder]);
                  }
                  return userSession != undefined
                    ? userSession[innerPlaceholder] || "N/A"
                    : "N/A"; // Return the value from formState, or "N/A" if not found
                }
              )
            : "";

          return result;
        } else if (formState[placeholder] !== undefined) {
          // Handle regular placeholders
          if (placeholder.includes("date") || placeholder.includes("Date")) {
            // If the placeholder is a date, format it
            return formatDate(formState[placeholder]);
          }
          return formState[placeholder] || "N/A";
        }
        return "N/A";
      });
    };

    const header = useMemo(() => {
      if (!filterText || !filter) return filterText || "";

      const data = filter;
      const _gridHeader = filterText.toString();
      // Dynamically replace placeholders using a regular expression

      return formatStringWithConditions(_gridHeader, data);
    }, [gridHeader, filter]);

    const onExportingHandler = useCallback(
      (e: any) => {
        if (onExporting) {
          onExporting(e);
        } else {
          // Helper function to get rendered cell value
          const getCellDisplayValue = (
            cellElement: any,
            cellInfo: any,
            column: any
          ) => {
            if (column.cellRenderDynamic) {
              return column.cellRenderDynamic(
                cellElement,
                cellInfo,
                filter,
                e.format
              );
            }
            if (column.cellRender) {
              return column.cellRender(cellElement, cellInfo, filter, e.format);
            }
            return cellElement.data[column.dataField];
          };

          if (e.format === "pdf") {
            const doc = new jsPDF({
              orientation: "landscape",
              unit: "pt",
              format: "a4",
            });

            const arabicFont = arabicFontBase64;
            doc.addFileToVFS("Amiri-Regular.ttf", arabicFont);
            doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
            doc.setFont("Amiri");

            const pageTitle = `${gridHeader} - ${
              !filterText || !filter
                ? filterText || ""
                : formatStringWithConditions(filterText.toString(), filter)
            }`;

            let currentY = 30;

            // Header content remains the same
            if (
              userSession.headerFooter != undefined &&
              !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading7)
            ) {
              doc.setFontSize(13);
              doc.text(userSession.headerFooter.heading7, 40, currentY, {
                align: "left",
              });
              currentY += 15;
            }
            if (
              userSession.headerFooter != undefined &&
              !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading8)
            ) {
              doc.setFontSize(9);
              doc.text(userSession.headerFooter.heading8, 40, currentY, {
                align: "left",
              });
              currentY += 15;
            }
            if (
              userSession.headerFooter != undefined &&
              !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading9)
            ) {
              doc.setFontSize(9);
              doc.text(userSession.headerFooter.heading9, 40, currentY, {
                align: "left",
              });
              currentY += 15;
            }

            doc.setFont("Amiri");
            doc.setFontSize(12);
            doc.text(pageTitle, 40, currentY, { align: "left" });
            doc.setFontSize(10);

            const originalColumnVisibility = e.component
              .getVisibleColumns()
              .map((column: any) => ({
                dataField: column.dataField,
                visible: column.visible,
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
              (colField) =>
                !preferences?.columnPreferences.find(
                  (colPref) => colPref.dataField === colField && colPref.width
                )
            );

            const pdfColumnsWidths = preferences
              ? preferences.columnPreferences
                  .filter((colPref) => colPref.showInPdf)
                  .map((colPref) => colPref.width || 0)
              : gridCols
                  .filter((col) => col.showInPdf)
                  .map((col) => col.width || 100);

            if (columnsWithoutWidth.length > 0) {
              const specifiedWidthTotal = pdfColumnsWidths
                .filter((width) => width > 0)
                .reduce((sum, width) => sum + width, 0);
              const remainingWidth = pageWidth - specifiedWidthTotal;
              const defaultColumnWidth =
                remainingWidth / columnsWithoutWidth.length;

              pdfColumnsWidths.forEach((width, index) => {
                if (width === 0) {
                  pdfColumnsWidths[index] =
                    defaultColumnWidth < 300 ? 300 : defaultColumnWidth;
                }
              });
            }

            // Customize the export to PDF to use rendered values
            const customizeCell = (options: any) => {
              if (options.gridCell.rowType != "data") return;
              // const column = e.component.columnOption(options.gridCell.column.dataField);
              const column = gridCols.find(
                (x) => x.dataField == options.gridCell.column.dataField
              );

              if (column && column.cellRender) {
                const renderResult = column.cellRender(
                  { data: options.gridCell.data },
                  options.gridCell,
                  filter,
                  options.pdfCell
                );

                let isDefined = renderResult !== undefined;
                let isObject = typeof renderResult === "object";
                let isValidReactElement = React.isValidElement(renderResult);

                if (isDefined && isObject && !isValidReactElement) {
                  options.pdfCell = renderResult;
                } else {
                  options.pdfCell = options.pdfCell; // Retain the original value
                }
              }
            };

            e.component.beginUpdate();
            e.component.option("wordWrapEnabled", true);
            e.component.getVisibleColumns().forEach((column: any) => {
              if (!pdfVisibleColumns.includes(column.dataField)) {
                e.component.columnOption(column.dataField, "visible", false);
              }
            });

            exportDataGridToPdf({
              jsPDFDocument: doc,
              component: e.component,
              columnWidths: pdfColumnsWidths,
              topLeft: { x: 0, y: currentY },
              customizeCell: customizeCell,
            }).then(() => {
              originalColumnVisibility.forEach((column: any) => {
                e.component.columnOption(
                  column.dataField,
                  "visible",
                  column.visible
                );
              });

              e.component.option("wordWrapEnabled", false);
              e.component.endUpdate();
              e.component.repaint();
              doc.save(`${gridId}.pdf`);
            });
          } else if (e.format === "xlsx") {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet(gridHeader);

            const totalColumns = e.component.getVisibleColumns().length;
            const lastColumnLetter = String.fromCharCode(64 + totalColumns);
            let currentRow = 1;
            let mergeRange = `A${currentRow}:${lastColumnLetter}${currentRow}`;

            // Header section remains the same
            if (
              userSession.headerFooter != undefined &&
              !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading7)
            ) {
              worksheet.mergeCells(mergeRange);
              worksheet.getCell(`A${currentRow}`).value =
                userSession.headerFooter.heading7;
              worksheet.getCell(`A${currentRow}`).font = {
                bold: true,
                size: 13,
              };
              worksheet.getCell(`A${currentRow}`).alignment = {
                horizontal: "left",
              };
              currentRow += 1;
            }
            if (
              userSession.headerFooter != undefined &&
              !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading8)
            ) {
              mergeRange = `A${currentRow}:${lastColumnLetter}${currentRow}`;
              worksheet.mergeCells(mergeRange);
              worksheet.getCell(`A${currentRow}`).value =
                userSession.headerFooter.heading8;
              worksheet.getCell(`A${currentRow}`).font = { size: 9 };
              worksheet.getCell(`A${currentRow}`).alignment = {
                horizontal: "left",
              };
              currentRow += 1;
            }
            if (
              userSession.headerFooter != undefined &&
              !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading9)
            ) {
              mergeRange = `A${currentRow}:${lastColumnLetter}${currentRow}`;
              worksheet.mergeCells(mergeRange);
              worksheet.getCell(`A${currentRow}`).value =
                userSession.headerFooter.heading9;
              worksheet.getCell(`A${currentRow}`).font = { size: 9 };
              worksheet.getCell(`A${currentRow}`).alignment = {
                horizontal: "left",
              };
              currentRow += 1;
            }

            const pageTitle = `${gridHeader} - ${header}`;
            mergeRange = `A${currentRow}:${lastColumnLetter}${currentRow}`;
            worksheet.mergeCells(mergeRange);
            worksheet.getCell(`A${currentRow}`).value = pageTitle;
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
            worksheet.getCell(`A${currentRow}`).alignment = {
              horizontal: "left",
            };
            currentRow += 2;

            // Customize the export to Excel to use rendered values

            const customizeCell = (options: any) => {
              if (options.gridCell.rowType != "data") return;
              // const column = e.component.columnOption(options.gridCell.column.dataField);
              const column = gridCols.find(
                (x) => x.dataField == options.gridCell.column.dataField
              );

              if (column) {
                const renderResult = column.cellRender
                  ? column.cellRender(
                      { data: options.gridCell.data },
                      options.gridCell,
                      filter,
                      options.excelCell.style
                    )
                  : undefined;

                let isDefined = renderResult !== undefined;
                let isObject = typeof renderResult === "object";
                let isValidReactElement = React.isValidElement(renderResult);

                if (isDefined && isObject && !isValidReactElement) {
                  options.excelCell.style = {
                    ...renderResult,
                    alignment: renderResult.alignmentExcel,
                  };
                  options.excelCell.value = renderResult.text;
                } else {
                  options.excelCell = options.excelCell; // Retain the original value
                }
                // options.excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              }
            };

            exportDataGridToExcel({
              component: e.component,
              worksheet,
              autoFilterEnabled: true,
              topLeftCell: `A${currentRow}`,
              customizeCell,
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
      [onExporting, gridId, preferences, gridCols, header]
    );
    const handleInvoke = useCallback(
      (row: any) => {
        // Extracting data from row
        const transactionMasterID = parseInt(row.id || "0", 10);
        const c = row.form || "";
        const vchr = c.split(" ");
        const vchtype = vchr[0];
        const voucherform = c.substring(c.indexOf(" ") + 1);
    
        const vchNoRaw = row.vchNo || "";
        const vno = vchNoRaw.split(" ");
        const prefix = vno[0];
        const vchno = vno[1] || "0";
        const financialYearID = parseInt(row.financialYearID || "0", 10);
    
        const tr = transactionRoutes.find((x) => x.voucherType === vchtype);
    
        // Validate and invoke logic
        if (parseInt(vchno, 10) > 0) {
          const transactionData = {
            transactionMasterID,
            formType: voucherform,
            voucherPrefix: prefix,
            voucherType: vchtype,
            financialYearID,
            voucherNo: parseInt(vchno, 10),
            formCode: tr?.formCode,
            transactionType: tr?.transactionType,
            title: tr?.title,
            drCr: tr?.drCr,
          };
          return transactionData;
        } else {
          return null;
        }
      },
      [transactionRoutes] // Dependencies
    );
    const handleCellClick = useCallback(
      (event: any) => {
        const dynamicProps = childPopupPropsDynamic
          ? childPopupPropsDynamic(event.column?.dataField)
          : childPopupProps;

        // Check if the clicked cell's field matches dynamicProps.drillDownCells
        const _drillDownCells = dynamicProps?.drillDownCells.split(",");
        const _drillDownCell = _drillDownCells.find(
          (x: string) => x === event.column?.dataField
        );
        const _drillDownDisplayCells =
          dynamicProps?.drillDownDisplayCells?.split(",");

        if (
          _drillDownCell !== undefined &&
          _drillDownCell !== undefined &&
          event.data[_drillDownCell] != undefined &&
          event.data[_drillDownCell] != null &&
          event.data[_drillDownCell] != 0 &&
          event.data[_drillDownCell] != "" &&
          (dynamicProps?.enableFn == undefined ||
            (_drillDownCell !== undefined &&
              dynamicProps?.enableFn != undefined &&
              dynamicProps?.enableFn(event.data)))
        ) {
          let updatedBodyProps: any = {};
          // Ensure dynamicProps.bodyProps is a string before splitting and iterating over it
          if (!dynamicProps.isTransactionScreen) {
            dynamicProps?.bodyProps != undefined
              ? dynamicProps?.bodyProps?.split(",").forEach((prop: string) => {
                  const trimmedProp = prop.trim();
                  updatedBodyProps[trimmedProp] = event.data[trimmedProp];
                })
              : {};
          } else {
            updatedBodyProps = handleInvoke(event.data);
          }
          const pdata =
            postDataDynamic != undefined
              ? postDataDynamic(_drillDownCell)
              : postData;
          const _updatedBodyProps = mergeObjectsRemovingIdenticalKeys(
            pdata,
            updatedBodyProps
          );
          onCellClick && onCellClick(event);
          setBodyProps(updatedBodyProps);
          setIsChildOpen({
            isOpen: true,
            props: _updatedBodyProps,
            key: _drillDownCell,
            drillDownDisplayCells: _drillDownDisplayCells,
            data: event.data,
          });
          // const sd = 223;
        }
      },
      [postDataDynamic, postData]
    );

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
      //
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
    const handleRowPrepared = useCallback(
      (e: any) => {
        if (
          e.rowType === "data" &&
          condition != undefined &&
          condition(e.data)
        ) {
          e.rowElement.style.display = "none"; // Hide row
        }
      },
      [condition] // Add dependencies here
    );

    const [totalRowCount, setTotalRowCount] = useState<number>(0);
    const [isAtBottom, setIsAtBottom] = useState(false);

    // Handle scroll events
    const handleScroll = useCallback(() => {
      if (gridRef.current) {
        const gridInstance = gridRef.current.instance();
        const scrollTop = gridInstance.getScrollable().scrollTop();
        const scrollHeight = gridInstance.getScrollable().scrollHeight();
        const clientHeight = gridInstance.getScrollable().clientHeight();

        if (scrollTop + clientHeight >= scrollHeight) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
      }
    }, []);

    const scrollTo = useCallback((position: number) => {
      if (gridRef.current) {
        const gridInstance = gridRef.current.instance();
        const scrollable = gridInstance.getScrollable();
        const scrollHeight = scrollable.scrollHeight();
        scrollable.scrollTo({ top: position === 0 ? 0 : scrollHeight });
      }
    }, []);

    // Attach scroll event listener
    useEffect(() => {
      if (gridRef.current && enableScrollButton) {
        const gridInstance = gridRef.current.instance();
        gridInstance.getScrollable().on("scroll", handleScroll);

        return () => {
          gridInstance.getScrollable().off("scroll", handleScroll);
        };
      }
    }, [enableScrollButton, handleScroll]);

    return (
      <Fragment>
        <div className={className}>
          <DataGrid
            // wordWrapEnabled={wordWrapEnabled}
            ref={gridRef}
            onInitialized={onGridReady}
            dataSource={memoizedStore}
            height={gridHeight.windows}
            showBorders={showBorders}
            remoteOperations={remoteOperations}
            focusedRowEnabled={focusedRowEnabled}
            allowColumnReordering={allowColumnReordering}
            allowColumnResizing={allowColumnResizing}
            columnAutoWidth={columnAutoWidth}
            onRowPrepared={handleRowPrepared}
            columnHidingEnabled={columnHidingEnabled}
            // columns={gridCols}
            onRowClick={onRowClick}
            onSelectionChanged={(e) => onSelectionChangedByRootState != undefined 
              ? onSelectionChangedByRootState(e, rootState) :  onSelectionChanged && onSelectionChanged(e)}
            onKeyDown={onKeyDown}
            onExporting={onExportingHandler}
            onContentReady={onContentReady}
            showColumnLines={showColumnLines}
            showRowLines={showRowLines}
            rowAlternationEnabled={true}
            showColumnHeaders={showColumnHeaderscustom}
            onCellClick={handleCellClick}
            onRowDblClick={onRowDblClick}
            onCellPrepared={onCellPrepared}
            // columnRenderingMode={columnRenderingMode}
            // rowRenderingMode={rowRenderingMode}
            keyExpr={keyExpr}
            dateSerializationFormat={dateSerializationFormat}
            // loadPanelEnabled={true}
            hoverStateEnabled={hoverStateEnabled}
            {...props} // Spread additional props to DataGrid
          >
            <ColumnFixing enabled={true} />
            <Scrolling mode={scrollingMode} showScrollbar="always" />
            {allowPaging && (
              <Paging defaultPageSize={pageSize} pageSize={pageSize} />
            )}
            {allowFiltering && (
              <FilterRow visible={false}>
                {initialFilters.map((filter: any, index: any) => (
                  <Column
                    key={index}
                    dataField={filter.field}
                    filterValue={filter.value}
                    selectedFilterOperation={filter.operation}
                  />
                ))}
              </FilterRow>
            )}
            {allowSearching && <SearchPanel visible={true} />}
            <FilterRow
          visible={showFilterRow} />
            <HeaderFilter visible={false} />
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
                formats={["pdf", "xlsx"]}
                allowExportSelectedData={false}
              />
            ) : (
              <Export enabled={false}></Export>
            )}

            <Toolbar>
              {!hideGridHeader && (
                <Item location="before">
                  <div className="flex  flex-col">
                    <div className={`box-title !text-xs !font-medium`}>
                      <span className="text-sm dark:!text-dark-text">{gridHeader}</span>&nbsp;{""}
                      {header}
                    </div>
                  </div>
                </Item>
              )}
              {enableScrollButton && (
                <Item>
                  <div
                    title={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
                  >
                    <button
                      type="button"
                      onClick={() => scrollTo(isAtBottom ? 0 : 100)}
                      className="dark:bg-dark-bg-header dark:text-dark-text flex items-center justify-center w-10 h-10 rounded-full shadow-md hover:shadow-lg focus:outline-none mr-2"
                    >
                      {isAtBottom ? "↑" : "↓"}
                    </button>
                  </div>
                </Item>
              )}
              {!hideDefaultSearchPanel && <Item name="searchPanel" />}
              {!hideDefaultExportButton && allowExport && (
                <Item name="exportButton" />
              )}

              {enablefilter == true && (
                <Item>
                  <ErpGridGlobalFilter
                    width={filterWidth}
                    title={gridHeader}
                    gridId={gridId}
                    validations={filterValidations}
                    initialData={filter}
                    content={
                      filterContent
                      // <LedgerReportFilter /> // Pass standalone JSX content
                    }
                    toogleFilter={showFilter}
                    onApplyFilters={(filters) => onApplyFilter(filters)}
                    // onClose={onCloseFilter}
                  />
                </Item>
              )}
              {ShowGridPreferenceChooser && (
                <Item>
                  <GridPreferenceChooser
                    columns={columns}
                    gridId={gridId}
                    onApplyPreferences={onApplyPreferences}
                  />
                </Item>
              )}

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
                ?.filter((item: any) => item.location === "before")
                .map((toolbarItem: any, index: any) => (
                  <Item key={index} location="before">
                    {toolbarItem.item}
                  </Item>
                ))}
              {customToolbarItems
                ?.filter((item: any) => item.location === "after")
                .map((toolbarItem: any, index: any) => (
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
                caption={
                  column.captionDynamic != undefined
                    ? column.captionDynamic(filter)
                    : column.caption
                }
                groupIndex={column.groupIndex}
                dataType={column.dataType}
                allowSorting={column.allowSorting}
                allowSearch={column.allowSearch}
                allowFiltering={column.allowFiltering ?? false}
                width={column.width}
                minWidth={column.minWidth}
                fixed={column.fixed}
                fixedPosition={column.fixedPosition}
                cellRender={
                  column.cellRenderDynamic === undefined &&
                  column.cellRender === undefined &&
                  column.cellRenderDynamicRootState === undefined
                    ? undefined
                    : (cellElement: any, cellInfo: any) => {
                        if (column.cellRenderDynamic) {
                          return column.cellRenderDynamic(
                            cellElement,
                            cellInfo,
                            filter
                          );
                        }
                        if (column.cellRenderDynamicRootState) {
                          return column.cellRenderDynamicRootState(
                            cellElement,
                            cellInfo,
                            rootState
                          );
                        }
                        if (column.cellRender) {
                          return column.cellRender(
                            cellElement,
                            cellInfo,
                            filter
                          );
                        }
                      }
                }
                visible={
                  column.visibleDynamic != undefined
                    ? column.visibleDynamic(filter)
                    : column.visible || false
                }
              />
            ))}

            {summaryItems.length > 0 && (
              <Summary>
                {summaryItems?.map((config: any, index: number) => (
                  <GroupItem
                    // key={`summaryItem_${index}`}
                    column={config.column}
                    summaryType={config.summaryType}
                    valueFormat={config.valueFormat}
                    customizeText={config.customizeText}
                    showInGroupFooter={config.showInGroupFooter}
                    alignByColumn={config.alignByColumn}
                  />
                ))}
              </Summary>
            )}
            {/* <Grouping autoExpandAll={true} allowCollapsing={false} /> */}
          </DataGrid>
          {showTotalCount == true && (
            <div className="p-3 bg-gray border dark:border-dark-border border-gray">
              <span className="text-gray font-semibold">Total Records: </span>
              <span className="text-gray">{totalRowCount}</span>
            </div>
          )}
        </div>
        {(childPopupProps || childPopupPropsDynamic) && (
          <ERPModal
            isOpen={isChildOpen.isOpen}
            minHeight={800}
            title={
              childPopupPropsDynamic
                ? childPopupPropsDynamic(isChildOpen.key).title
                : childPopupProps?.title
            }
            width={
              childPopupPropsDynamic
                ? childPopupPropsDynamic(isChildOpen.key).width
                : childPopupProps?.width
            }
            isForm={
              childPopupPropsDynamic
                ? childPopupPropsDynamic(isChildOpen.key).isForm
                : childPopupProps?.isForm
            }
            origin={
              originDynamic
                ? originDynamic(isChildOpen.key)
                : childPopupPropsDynamic
                ? childPopupPropsDynamic(isChildOpen.key).origin
                : childPopupProps?.origin
            }
            closeModal={() => setIsChildOpen({ isOpen: false, props: {} })}
            content={
              childPopupPropsDynamic
                ? childPopupPropsDynamic(isChildOpen.key).content
                : childPopupProps?.content
            }
            rowData={isChildOpen.data}
            isTransactionScreen={
              childPopupPropsDynamic
                ? childPopupPropsDynamic(isChildOpen.key).isTransactionScreen
                : childPopupProps?.isTransactionScreen
            }
            contentProps={isChildOpen.props}
          />
        )}
      </Fragment>
    );
  }
);
const _DrillDownCellTemplate = ({
  data,
  field,
  inputFormat = "DD-MM-YYYY",
}: {
  data: any;
  field: string;
  inputFormat?: string;
}) => {
  if (
    data.value !== undefined &&
    data.value !== null &&
    data.value !== "" &&
    data.value !== 0
  ) {
    console.log(data.column.dataType);

    return (
      <a
        href="#"
        style={{ color: "#1976d2", textDecoration: "underline" }}
        onClick={(e) => {
          e.preventDefault();
          // Handle drill-down logic here
        }}
      >
        {data.column.dataType === "date"
          ? moment(data.data[field], inputFormat).local().format("DD/MMM/YYYY") // Change this format as needed
          : data.value.toString()}
      </a>
    );
  }

  return <span>{data.value}</span>;
};
const DrillDownCellTemplate = React.memo(_DrillDownCellTemplate);
export default React.memo(ERPDevGrid);
export { DrillDownCellTemplate };
