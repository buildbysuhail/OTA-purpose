import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  Fragment,
} from "react";
import { createPortal } from "react-dom";
import { APIClient } from "../../helpers/api-client";
import debounce from "lodash/debounce";
import { DataGrid } from "devextreme-react";
import {
  Column,
  KeyboardNavigation,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/cjs/data-grid";
import { useTranslation } from "react-i18next";
import CustomStore from "devextreme/data/custom_store";
import ERPInput from "../../components/ERPComponents/erp-input";
import { isNullOrUndefinedOrEmpty } from "../../utilities/Utils";
import ERPCheckbox from "./erp-checkbox";
import ERPModal from "./erp-modal";
import ProductModalGrid from "./erp-searchbox-modalContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Urls from "../../redux/urls";
import { inputBox } from "../../redux/slices/app/types";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { DevGridColumn } from "../types/dev-grid-column";
import GridPreferenceChooser from "../../components/ERPComponents/erp-gridpreference";
import usePreferenceData from "../../utilities/hooks/usePreference";
import { SortDescriptor } from "devextreme/data";
import { formStateHandleFieldChangeKeysOnly } from "../../pages/inventory/transactions/reducer";
import { TransactionDetail } from "../../pages/inventory/transactions/transaction-types";
import { getInitialPreference } from "../../utilities/dx-grid-preference-updater";
interface InputProps {
  id?: string;
  inputId?: string;
  label?: string;
  productGridId?: string;
  batchGridId?: string;
  productDataUrl?: string;
  closeIfNodata?: boolean;
  batchDataUrl?: string;
  keyId?: string;
  onProductSelected?: (data: any) => void;
  onRowSelected?: (data: any, rowValue?: string) => void;
  onEnterKeyDown?: () => void;
  onChange?: (e: any) => void;
  onKeyDown?: (value: any, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  checkboxLabel?: string;
  value?: string;
  clearAfterSelection?: boolean;
  showCheckBox?: boolean;
  searchType?: "grid" | "normal" | "modal";
  placeholder?: string;
  labelDirection?: "horizontal" | "vertical";
  contextClassNametwo?: string;
  noLabel?: boolean;
  useInSearch?: boolean;
  useCodeSearch?: boolean;
  searchByCodeAndName?: boolean;
  advancedProductSearching?: boolean;
  searchKey?: string;
  rowIndex?: number;
  height?: number;
  isMobileInput?:boolean;
  textAlign?: "left" | "right" | "center";
  onNextCellFind?: (
    rowIndex: number,
    column: string,
    excludedColumns?: (keyof TransactionDetail)[]
  ) => void;
  customStyle?: inputBox;
  appState?: any;
  showInputSymbol?:boolean;
  disabled?: boolean;
  zIndexController?: number;
}

interface LoadResult {
  data: any[];
  totalCount: number;
  summary?: any;
  groupCount?: number;
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
const api = new APIClient();

const createStore = async (
  value: string,
  payload: any,
  productDataUrl?: string,
  initialSort: SortDescriptor<any>[] = [],
  initialFilters?: Array<{
    field: string;
    value: any;
    operation: FilterOperation;
  }>
) => {
  let isInitialLoad = true; // Track initial load
  return new CustomStore({
    key: "productID",
    async load(loadOptions: any) {
      if (
        !loadOptions.sort ||
        (Array.isArray(loadOptions.sort) && loadOptions.sort.length === 0)
      ) {
        loadOptions.sort = initialSort;
      }
      // if (
      //     initialFilters &&
      //     initialFilters.length > 0 &&
      //     isInitialLoad &&
      //     !loadOptions.filter
      //   ) {

      //   }
      const paramNames = [
        "skip",
        "take",
        "requireTotalCount",
        "sort",
        "filter",
      ];
      const queryString = paramNames
        .filter(
          (paramName) =>
            loadOptions[paramName] !== undefined &&
            loadOptions[paramName] !== null &&
            loadOptions[paramName] !== ""
        )
        .map(
          (paramName) =>
            `${paramName}=${JSON.stringify(loadOptions[paramName])}`
        )
        .join("&");

      try {
        const url = productDataUrl || "";
        const response = await api.postAsync(
          queryString && queryString !== ""
            ? `${url}?${queryString}`
            : `${url}?skip=0`,
          payload
        );
        const result = response;
        return result !== undefined && result !== null
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
        throw new Error("Data Loading Error");
      }
    },
  });
};

const createStoreWithCache = async (
  value: string,
  payload: any,
  productDataUrl?: string,
  initialSort: SortDescriptor<any>[] = [],
  closeIfNodata?: boolean
) => {
  let cachedResult: any = null;
  let hasFetchedOnce = false;
  const api = new APIClient();

  return new CustomStore({
    key: "productID",
    async load(loadOptions: any) {
      // Only make API call on first load
      if (!hasFetchedOnce) {
        hasFetchedOnce = true;
        console.log("🔵 Making API call for:", value);

        if (
          !loadOptions.sort ||
          (Array.isArray(loadOptions.sort) && loadOptions.sort.length === 0)
        ) {
          loadOptions.sort = initialSort;
        }

        const paramNames = [
          "skip",
          "take",
          "requireTotalCount",
          "sort",
          "filter",
        ];
        const queryString = paramNames
          .filter(
            (paramName) =>
              loadOptions[paramName] !== undefined &&
              loadOptions[paramName] !== null &&
              loadOptions[paramName] !== ""
          )
          .map(
            (paramName) =>
              `${paramName}=${JSON.stringify(loadOptions[paramName])}`
          )
          .join("&");

        try {
          const url = productDataUrl || "";
          const response = await api.postAsync(
            queryString && queryString !== ""
              ? `${url}?${queryString}`
              : `${url}?skip=0`,
            payload
          );

          cachedResult = response;

          return cachedResult !== undefined && cachedResult !== null
            ? {
                data: cachedResult.data,
                totalCount: cachedResult.totalCount,
              }
            : {
                data: [],
                totalCount: 0,
                summary: {},
                groupCount: 0,
              };
        } catch (err) {
          console.error("API call failed:", err);
          throw new Error("Data Loading Error");
        }
      }

      // Return cached result for subsequent calls
      console.log("🟢 Returning cached result for:", value);
      return cachedResult !== undefined && cachedResult !== null
        ? {
            data: cachedResult.data,
            totalCount: cachedResult.totalCount,
          }
        : {
            data: [],
            totalCount: 0,
            summary: {},
            groupCount: 0,
          };
    },
  });
};

const createBatchStore = async (productID: string, warehouseId: number, batchDataUrl?: string) => {
  
  return new CustomStore({
    key: "productBatchID",
    async load(loadOptions: any) {
      const paramNames = [
        "skip",
        "take",
        "requireTotalCount",
        "sort",
        "filter",
      ];
      const queryString = paramNames
        .filter(
          (paramName) =>
            loadOptions[paramName] !== undefined &&
            loadOptions[paramName] !== null &&
            loadOptions[paramName] !== ""
        )
        .map(
          (paramName) =>
            `${paramName}=${JSON.stringify(loadOptions[paramName])}`
        )
        .join("&");

      try {
        const url = `${batchDataUrl}${productID}/${warehouseId??1}` || "";
        const response = await api.getAsync(
          queryString && queryString !== ""
            ? `${url}?${queryString}`
            : `${url}?skip=0`
        );
        const result = response;
        return result !== undefined && result !== null
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
        throw new Error("Batch Data Loading Error");
      }
    },
  });
};

const createBatchStoreWithCache = async (
  productID: string,
  warehouseId: number,
  batchDataUrl?: string
) => {
  let cachedResult: any = null;
  let hasFetchedOnce = false;
  const api = new APIClient();

  return new CustomStore({
    key: "productBatchID",
    async load(loadOptions: any) {
      if (!hasFetchedOnce) {
        hasFetchedOnce = true;
        console.log("🔵 Making BATCH API call for product:", productID);

        const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
        const queryString = paramNames
          .filter(
            (paramName) =>
              loadOptions[paramName] !== undefined &&
              loadOptions[paramName] !== null &&
              loadOptions[paramName] !== ""
          )
          .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
          .join("&");

        try {
          const url = `${batchDataUrl}${productID}/${warehouseId ?? 1}` || "";
          const response = await api.getAsync(
            queryString && queryString !== "" ? `${url}?${queryString}` : `${url}?skip=0`
          );

          cachedResult = response;
          return cachedResult !== undefined && cachedResult !== null
            ? { data: cachedResult.data, totalCount: cachedResult.totalCount }
            : { data: [], totalCount: 0, summary: {}, groupCount: 0 };
        } catch (err) {
          console.error("Batch API call failed:", err);
          throw new Error("Batch Data Loading Error");
        }
      }

      console.log("🟢 Returning cached BATCH result for product:", productID);
      return cachedResult !== undefined && cachedResult !== null
        ? { data: cachedResult.data, totalCount: cachedResult.totalCount }
        : { data: [], totalCount: 0, summary: {}, groupCount: 0 };
    },
  });
};

const ERPProductSearch = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      inputId,
      label,
      productDataUrl,
      closeIfNodata,
      batchDataUrl,
      productGridId = "product-search-grid",
      batchGridId = "batch-search-grid",
      keyId,
      onRowSelected,
      onProductSelected,
      onEnterKeyDown,
      checkboxLabel,
      onChange,
      value,
      placeholder,
      noLabel,
      labelDirection = "vertical",
      contextClassNametwo,
      clearAfterSelection = true,
      showCheckBox = true,
      searchType = "grid",
      useInSearch = false,
      useCodeSearch = false,
      searchByCodeAndName = true,
      advancedProductSearching = false,
      searchKey = "",
      rowIndex,
      height,
      isMobileInput,
      onNextCellFind,
      textAlign,
      customStyle,
      appState,
      showInputSymbol = true,
       disabled = false,
       zIndexController = 9999  ,
      ...rest
    },
    ref
  ) => {
    const { t } = useTranslation("inventory");
    const productColumns: DevGridColumn[] = useMemo(
      () => [
        // ====
        {
          dataField: "productName",
          caption: t("product_name"),
          dataType: "string",
          minWidth: 150,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          cellRender: (cellElement: any, cellInfo: any) => {
            const modified = cellElement?.data?.productName.replace(/^\s+/, (m: any) => "\u00A0".repeat(m.length))
            return (
              <>{modified}</>
            );
          },
        },
        {
          dataField: "productCode",
          caption: t("product_code"),
          dataType: "string",
          width: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "productID",
          caption: t("productID"),
          dataType: "number",
          visible: false,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "arabicName",
          caption: t("arabic_name"),
          dataType: "string",
          width: 150,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "stock",
          caption: t("stock"),
          dataType: "number",
          width: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "stockDetails",
          caption: t("stock_details"),
          dataType: "string",
          minWidth: 150,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
      ],
      [t]
    );

    const batchColumns: DevGridColumn[] = useMemo(
      () => [
        {
          dataField: "productBatchID",
          caption: t("product_batch_id"),
          dataType: "number",
          width: 150,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "productCode",
          caption: t("product_code"),
          dataType: "string",
          width: 150,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "autoBarcode",
          caption: t("auto_barcode"),
          dataType: "string",
          width: 150,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "sPrice",
          caption: t("s_price"),
          dataType: "number",
          width: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "pPrice",
          caption: t("p_price"),
          dataType: "number",
          width: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "mrp",
          caption: t("mrp"),
          dataType: "number",
          width: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "stock",
          caption: t("stock"),
          dataType: "number",
          width: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "unitID",
          caption: t("unit_id"),
          dataType: "number",
          minWidth: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "unit",
          caption: t("unit"),
          dataType: "string",
          minWidth: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "brandID",
          caption: t("brandID"),
          dataType: "number",
          minWidth: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
        {
          dataField: "brandName",
          caption: t("brand_name"),
          dataType: "string",
          minWidth: 100,
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
        },
      ],
      [t]
    );
    const [store, setStore] = useState<any>();
    const [showProductGrid, setShowProductGrid] = useState(false);
    const [showBatchGrid, setShowBatchGrid] = useState(false);
    const [productDetailStore, setProductDetailStore] = useState<any>();
    const [inputValue, setInputValue] = useState({
      searchValue: value,
      searchByCode: false,
    });
      const [productGridReady, setProductGridReady] = useState<any>(false);
    const dataGridRef = useRef<any>(null);
    const batchGridRef = useRef<any>(null);
    const productIDRef = useRef<number | undefined>(undefined);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRef;
    const fetchInProgressRef = useRef(false);
    const [isLoading, setIsLoading] = useState(false);

    const [productInitialPreferences, setProductInitialPreferences] = useState<any>(null);
    const [batchInitialPreferences, setBatchInitialPreferences] = useState<any>(null);

    const dispatch = useDispatch();
    const portalContainerRef = useRef<HTMLElement | null>(null);
    const formState = useSelector(
      (state: RootState) => state.InventoryTransaction
    );
    const applicationSettings = useSelector(
      (state: RootState) => state.ApplicationSettings
    );
    const appStater = useAppSelector(
      (state: RootState) => state?.AppState?.appState
    );
    // Use the hook for product grid preferences
    const {
      onApplyPreferences: onApplyProductPreferences,
      gridCols: productGridCol,
    } = usePreferenceData(productColumns, productGridId );

    // Use the hook for batch grid preferences
    const {
      onApplyPreferences: onApplyBatchPreferences,
      gridCols: batchGridCol,
    } = usePreferenceData(batchColumns, batchGridId );

    const preferenceChooserRef = useRef<{
      handleDragStart: (e: React.DragEvent<HTMLElement>) => void;
      handleDragEnd: (e: React.DragEvent<HTMLElement>) => void;
      handleDropping: (eFromDataGrid?: boolean) => void;
      handleColumnPreferenceChange: (
        dataField: string,
        key: string,
        value: any,
        eFromDataGrid?: boolean
      ) => void;
    }>(null);


useEffect(() => {
  const fetchProductPreferences = async () => {
    try {
      console.log("🔵 Fetching product preferences");
      const productPref = await getInitialPreference(
        productGridId,
        productColumns,
        new APIClient()
      );
      setProductInitialPreferences(productPref);
      onApplyProductPreferences(productPref);
    } catch (error) {
      console.error("Failed to fetch product preferences:", error);
    }
  };

  // Fetch on mount and when gridId changes
  if (productGridId) {
    fetchProductPreferences();
  }
}, [productGridId]);

// STEP 3: Add listener for preference updates (when user saves)

useEffect(() => {
  if (productInitialPreferences) {
    console.log("✅ Applying updated product preferences");
    onApplyProductPreferences(productInitialPreferences);
  }
}, [productInitialPreferences]);
// 4. Add this useEffect to fetch batch preferences when needed:

useEffect(() => {
  const fetchBatchPreferences = async () => {
    if (showBatchGrid) {  
      try {
        console.log("🔵 Fetching batch preferences");
        const batchPref = await getInitialPreference(
          batchGridId,
          batchColumns,
          new APIClient()
        );
        setBatchInitialPreferences(batchPref);
        onApplyBatchPreferences(batchPref);
      } catch (error) {
        console.error("Failed to fetch batch preferences:", error);
      }
    }
  };

  fetchBatchPreferences();
}, [showBatchGrid, batchGridId]);

useEffect(() => {
  if (batchInitialPreferences) {
    console.log("✅ Applying updated batch preferences");
    onApplyBatchPreferences(batchInitialPreferences);
  }
}, [batchInitialPreferences]);

    // Initialize portal container
    useEffect(() => {
      portalContainerRef.current = document.getElementById("portal-root");
      if (!portalContainerRef.current) {
        // Create portal container if it doesn't exist
        const portalDiv = document.createElement("div");
        portalDiv.id = "portal-root";
        document.body.appendChild(portalDiv);
        portalContainerRef.current = portalDiv;
      }
    }, []);

    useEffect(() => {
      if (showBatchGrid == false) {
        productIDRef.current = undefined;
      }
    }, [showBatchGrid]);

    useEffect(() => {
      const loadLedgerData = async () => {
        if ((formState.batchGridShowKey ?? 0) > 0) {
          productIDRef.current = formState.batchGridShowKey;
          setShowBatchGrid(true);
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                batchGridShowKey: 0,
              },
            })
          );
          const batchStore = await createBatchStoreWithCache(
            (formState.batchGridShowKey ?? 0).toString(),
            formState.transaction.master.fromWarehouseID,
            batchDataUrl
          );
          setProductDetailStore(batchStore);
        }
      };
      loadLedgerData();
    }, [formState.batchGridShowKey]);

    useEffect(() => {
      setInputValue((prev) => ({
        ...prev,
        searchValue: value,
      }));
    }, [value]);

    // Calculate position for the DataGrid
    const getGridPosition = useCallback(() => {
      if (
        inputRef &&
        "current" in inputRef &&
        inputRef.current &&
        gridContainerRef.current
      ) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const containerRect = gridContainerRef.current.getBoundingClientRect();
        const isRtl = appStater?.dir === "rtl";
        return {
          top: inputRect.bottom + window.scrollY, // Position below input
          left: containerRect.left + window.scrollX,
          right: window.innerWidth - (containerRect.right + window.scrollX),
          width: containerRect.width, // Match container width
        };
        
      }
      return { top: 0, left: 0, width: "100%" };
    }, [inputRef]);

    const debouncedFetch = useMemo(
      () =>
        debounce(async (value: string, byCode: boolean) => {
      if (fetchInProgressRef.current) {
        console.log("Fetch already in progress, skipping...");
        return;
      }
         console.log("debouncedFetch called with:", value);

          if (value.trim() == "" || value.trim() == "%") {
            setIsLoading(false);
            setShowProductGrid(false);
            return;
          }
          fetchInProgressRef.current = true;
          setIsLoading(true); // Start loading
          try{
            let payload: any = {};
             if (searchType === "modal") {
            setIsLoading(false);
            fetchInProgressRef.current = false;
            return;
            } 
             if (searchType === "grid") {
            // Build payload based on searchKey
            if (searchKey == "pCode") {
              payload.searchByCode = true;
              payload.searchByCodeAndName = false;
              if (value.trim() === "%") {
                setIsLoading(false);
                fetchInProgressRef.current = false;
                return ;
              }

              let searchText = "";

              if (useInSearch && value.length > 2) {
                searchText = "%" + value;
              } else {
                searchText = value;
              }
              payload.searchText = searchText;
            } else if (searchKey == "product") {
              payload.searchByCodeAndName = searchByCodeAndName;
              payload.searchByCode = false;
              if (value.trim() === "%") {
                setIsLoading(false);
                fetchInProgressRef.current = false;
                return ;
              }

              let searchText = "";

              if (useInSearch && value.length > 2) {
                searchText = "%" + value;
              } else {
                searchText = value;
              }

              if (advancedProductSearching) {
                searchText = searchText.replace(/ /g, "%");
              }
              payload.searchText = searchText;
            } else {
              payload.searchText = value;
              payload.searchByCode = byCode;
              payload.productName = value;
            }

    
          // ⭐ CRITICAL CHANGE: Use createStoreWithCache instead of createStore
          // This prevents the double-load issue
          const store = await createStoreWithCache(
            value,
            payload,
            productDataUrl,
            [
              {
                selector:
                  formState.formElements.productSearchPopupWindow.data
                    .searchCriteria === "product"
                    ? "productCode"
                    : "productCode",
                desc: true,
              },
            ],
            closeIfNodata
          );

          //  CRITICAL CHANGE: Remove the manual store.load() call
          // Just set the store and let DataGrid handle loading
          setStore(store);
          setShowProductGrid(true);        

          }
        } catch (error) {
        console.error("Fetch error:", error);
        setShowProductGrid(false);
      } finally {
        setIsLoading(false);
        fetchInProgressRef.current = false;
      }
        }, 300),
      [
        productDataUrl,
        searchType,
        searchKey,
        useInSearch,
        searchByCodeAndName,
        advancedProductSearching,
        closeIfNodata,
        formState.formElements.productSearchPopupWindow.data.searchCriteria
      ]
    );


const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {    
      if (disabled) return;
      const value = e.target.value;
    // Update input value immediately
      setInputValue((prev) => ({
        ...prev,
        searchValue: value,
      }));
    // Reset grid ready state
      setProductGridReady(false);
      setShowBatchGrid(false);
      if (searchKey == "barCode") {
        return;
      }
      
      debouncedFetch.cancel();
   // If input is empty or too short, immediately hide everything
      if (!value || value.trim() === "" || value.length < 1) {
        setIsLoading(false);
        setShowProductGrid(false);
        setShowBatchGrid(false);
        setProductInitialized(false);
        fetchInProgressRef.current = false;
        setStore(null);
        return;
      };     
      if (value.length >= 1 && !isNullOrUndefinedOrEmpty(value)  ) {    

        if (searchType !== "modal") {
           debouncedFetch(value, inputValue.searchByCode);
          setProductInitialized(false); 
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();

            const val = inputRef.current.value;
            inputRef.current.setSelectionRange(val.length, val.length);
          }
        }
      } 
      if (onChange) onChange(e);    
    };

// Add this useEffect to cleanup on unmount
    useEffect(() => {
      return () => {
        debouncedFetch.cancel();
        fetchInProgressRef.current = false;
      };
    }, [debouncedFetch]);

    useEffect(() => {
      if (inputRef && "current" in inputRef && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [inputRef]);



// Clear loading state when grid closes
useEffect(() => {
  if (!showProductGrid && !showBatchGrid) {
    setIsLoading(false);
  }
}, [showProductGrid, showBatchGrid]);

const handleEnterAction = async () => {
  try {
    const gridInstance = dataGridRef.current.instance();

    // Focused row key
    const focusedRowKey = gridInstance.option("focusedRowKey");

    // Find row data
    const focusedRowData = gridInstance
      .getDataSource()
      .items()
      .find((row: any) => row.productID === focusedRowKey);

    let rowData = focusedRowData;

    if (!rowData) {
      const selectedRows = await gridInstance.getSelectedRowsData();
      rowData =
        selectedRows && selectedRows.length > 0 ? selectedRows[0] : null;
    }

    if (rowData && rowData.productID > 0) {
      if (onProductSelected) onProductSelected(rowData);

      if (!isNullOrUndefinedOrEmpty(batchDataUrl)) {
        const batchStore = await createBatchStoreWithCache(
          rowData.productID,
          formState.transaction.master.fromWarehouseID,
          batchDataUrl
        );
        setProductDetailStore(batchStore);
        setShowBatchGrid(true);
        setShowProductGrid(false);
      } else {
        setShowProductGrid(false);

        if (inputRef && "current" in inputRef && inputRef.current) {
          if (isMobileInput) {
            inputRef.current.blur();
          } else {
            inputRef.current.focus();
          }
        }
      }
    }
  } catch (err) {
    setShowProductGrid(false);
    if (inputRef && "current" in inputRef && inputRef.current) {
      if (isMobileInput) {
        inputRef.current.blur();
      } else {
        inputRef.current.focus();
      }
    }
  }
};

const handleBatchEnterAction = async () => {
  try {
          const gridInstance = batchGridRef.current.instance();
          const allSelected = await gridInstance.getSelectedRowsData();
          const selected = allSelected[0];
          if (onRowSelected) {
            onRowSelected(selected, inputValue.searchValue);
          }
          setShowBatchGrid(false);
          if (clearAfterSelection) {
            setInputValue((prev) => ({
              ...prev,
              searchValue: "",
            }));
          }
          if (inputRef && "current" in inputRef && inputRef.current) {
            if (isMobileInput) {
              inputRef.current.blur();
            } else {
              inputRef.current.focus();
            }
          }
  } catch (err) {
    console.log("batchselect",err);  
  }
};

const handleGridDoubleClick =async (e: any) => {
  if (disabled) return;
  await handleEnterAction();
};

const handleBatchGridDoubleClick =async (e: any) => {
  if (disabled) return;
  await handleBatchEnterAction();
};

    const handleGridKeyDown = useCallback(
      async (e: any) => {
        if (disabled) return;
        const key = e.event?.key;
        if (!key) {
          return;
        }
        if (key === "ArrowLeft" || key === "ArrowRight") {
          e.event.preventDefault();
          e.event.propagation();
          return
        }
        
        if (key === "Enter" || key === "NumpadEnter") {
          await handleEnterAction();
          return;
        }
         if (key === "Escape") {
          setShowProductGrid(false);
          setProductInitialized(false);
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
            const val = inputRef.current.value;
            inputRef.current.setSelectionRange(val.length, val.length);
          }
           return;
        } else {
          if (
            !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)
          ) {
            setShowProductGrid(false);
            setProductInitialized(false);

            if (inputRef && "current" in inputRef && inputRef.current) {
              inputRef.current.focus();
              const val = inputRef.current.value;
              inputRef.current.setSelectionRange(val.length, val.length);
            }
          }
        }
      },
      [batchDataUrl, onProductSelected, inputRef]
    );

    const handleBatchGridKeyDown = useCallback(
      async (e: any) => {
        if (disabled) return;
        console.log(`Batch grid key: ${e.event.key}`); 
        if (e.event.key === "Enter") {
            await handleBatchEnterAction()
        }
        // else if (e.event.key === 'Escape') {
        //   dispatch(formStateHandleFieldChangeKeysOnly({fields: {formElements:{dgvProductBatches: {visible: false}}}}));
        //   setShowProductGrid(true);
        //   e.event.preventDefault();
        // }
        else if (e.event.key === "Escape") {
          setShowBatchGrid(false);
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          e.event.preventDefault();
        }
      },
      [onRowSelected, clearAfterSelection, inputRef, inputValue]
    );

    const [batchInitialized, setBatchInitialized] = useState(false);

    const handleBatchContentReady = useCallback((e: any) => {
    if (!batchInitialized) {
      const grid = e.component;
      // focus and select row 0 on first open
      const key = grid.getKeyByRowIndex(0);
      grid.selectRows([key], false);
      grid.option("focusedRowIndex", 0);
      grid.focus();
      setBatchInitialized(true);
     }
    },
   [batchInitialized]
    );

    const handleBatchFocusedRowChanged = useCallback((e: any) => {
      // whenever focus moves (via arrow keys), select that row
      if (!e.row) {
        return;
      }
      setTimeout(() => {
        e.component.selectRows([e.row.key], false);
      }, 0);
    }, []);

    const handleInputKeyDown = useCallback(
  async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.currentTarget.value;
    console.log(`Input key: ${value}`);
    
    // ============================================================
    // PHASE 1: Block arrow keys ONLY during loading/grid showing
    // ============================================================
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      if (isLoading || showProductGrid || showBatchGrid) {
        e.preventDefault();
        e.stopPropagation();
        
        // Handle grid navigation if NOT loading and grid is ready
        if (!isLoading && showProductGrid && dataGridRef.current && productGridReady) {
          if (e.key === "ArrowDown") {
            const grid: any = dataGridRef.current.instance();
            const rows = grid.getVisibleRows();
            if (rows.length > 0) {
              grid.selectRowsByIndexes([0]);
              grid.navigateToRow(grid.getKeyByRowIndex(0));
              grid.focus();
            }
          } else if (e.key === "ArrowUp") {
            const grid: any = dataGridRef.current.instance();
            const rows = grid.getVisibleRows();
            if (rows.length > 0) {
              grid.selectRowsByIndexes([0]);
              grid.navigateToRow(grid.getKeyByRowIndex(0));
              grid.option("focusedRowIndex", 0);
              grid.focus();
            }
          }
        }
        
        return; // Exit early
      }
    }
    
    // ============================================================
    // PHASE 2: Handle other keys when grid is visible
    // ============================================================
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key) &&
      showProductGrid &&
      dataGridRef.current &&
      !isLoading
    ) {
      if (e.key === "Enter") {
        if (searchType !== "modal") {
          rest?.onKeyDown && rest?.onKeyDown(value, e);
        } else {
          if (!isNullOrUndefinedOrEmpty(e.currentTarget.value)) {
            if (searchKey == "product") {
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {
                    formElements: {
                      productSearchPopupWindow: {
                        visible: true,
                        data: {
                          searchColumn: searchKey,
                          rowIndex: rowIndex,
                          searchCriteria: searchKey,
                          searchText: e.currentTarget.value,
                          voucherType: formState.transaction.master.voucherType,
                          warehouseId: 1,
                          inSearch: formState.inSearch,
                        },
                      },
                    },
                  },
                })
              );
              e.preventDefault();
            } else {
              rest?.onKeyDown && rest?.onKeyDown(value, e);
            }
          } else {
            rest?.onKeyDown && rest?.onKeyDown(value, e);
          }
        }
      } else if (e.key === "Escape") {
        setShowProductGrid(false);
        setShowBatchGrid(false);
        setIsLoading(false);
        e.preventDefault();
        e.stopPropagation();
      } else if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        const input = e.target as HTMLInputElement;
        const { selectionStart, selectionEnd, value } = input;
        let shouldNavigate = true;
        
        if (
          e.key === "ArrowRight" &&
          (selectionStart !== value.length || selectionEnd !== value.length)
        ) {
          shouldNavigate = false;
        } else if (
          e.key === "ArrowLeft" &&
          (selectionStart !== 0 || selectionEnd !== 0)
        ) {
          shouldNavigate = false;
        }
        
        if (shouldNavigate && rest.onKeyDown) {
          rest?.onKeyDown(value, e);
          e.preventDefault();
        }
      }
    } 
    // ============================================================
    // PHASE 3: No grid showing, pass to parent
    // ============================================================
    else {
      if (rest.onKeyDown) {
        rest?.onKeyDown(value, e);
      }
    }
  },
  [
    disabled,
    isLoading,
    showProductGrid,
    showBatchGrid,
    productGridReady,
    dataGridRef,
    searchType,
    rest.onKeyDown,
    formState,
    searchKey,
    rowIndex,
  ]
);

    useEffect(() => {
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (!gridContainerRef.current || !showProductGrid) return;
        const focusableElements = gridContainerRef.current.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleFocusTrap);
      return () => document.removeEventListener("keydown", handleFocusTrap);
    }, [showProductGrid]);

    const onClose = useCallback(() => {
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            formElements: {
              productSearchPopupWindow: { visible: false, data: "" },
            },
          },
        })
      );
    }, []);

  
    const handleProductFocusedRowChanged = useCallback((e: any) => {
      const gridInstance = e.component;
      if (e?.row?.key !== undefined) {
        gridInstance.selectRows([e.row.key], false);
      }
    }, []);

    const [productInitialized, setProductInitialized] = useState(false);
    const [isGridInitializing, setIsGridInitializing] = useState(true);

    const handleProductGridContentReady = useCallback((e: any) => {
         console.log("handleProductGridContentReady called")
        const gridInstance = e.component;
        const visibleRows = gridInstance.getVisibleRows();
        const hasValidData = visibleRows.length > 0 && visibleRows[0].data?.productID;

            // Handle closeIfNodata here instead of in debouncedFetch
    if (!hasValidData && closeIfNodata && visibleRows.length === 0) {
      setShowProductGrid(false);
      setIsLoading(false);
      setProductGridReady(false);
      return;
    }
    // Only set ready if we have valid data
    if (hasValidData) {
      setProductGridReady(true);

      if (!productInitialized) {
        if (!isMobileInput) {
          gridInstance.option("focusedRowIndex", 0);
          gridInstance.focus();
        }
        setProductInitialized(true);
      }
    }
      },
      [productInitialized,closeIfNodata]
    );
      // It will helps to fix the product grid moving isSecureContext, check it 
        useEffect(() => {
          const handleKeyDown = (e:any) => {
            if (isGridInitializing && e.key === "ArrowDown") {
              e.preventDefault(); 
            }
          };
          window.addEventListener("keydown", handleKeyDown);
          return () => window.removeEventListener("keydown", handleKeyDown);
        }, []);    

    useEffect(() => {
      const style = document.createElement("style");
      style.textContent = `
      .dx-error-row { display: none !important; }
      .dx-datagrid .dx-error-row { display: none !important; }
      .dx-error-message { display: none !important; }
    `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }, []);
  
    // Render DataGrid components in a portal
    const renderDataGridPortal = () => {
      if (!portalContainerRef.current) return null;
      const direction = appStater?.dir || "ltr";
      const { top, left, right, width } = getGridPosition();
      // build a positionStyle that uses left in LTR, right in RTL
      const positionStyle: React.CSSProperties = {
        top: `${top}px`,
        width: "100%",
        minWidth: "300px",
        maxWidth: "800px",
        minHeight: "200px",
        maxHeight: "400px",
        zIndex: zIndexController,
        // conditionally assign left or right
        ...(direction === "rtl"
          ? { right: `${right}px`, left: undefined }
          : { left: `${left}px`, right: undefined }),
      };
      return createPortal(
        <>
          {searchType === "grid" && (
            <>
              {showProductGrid && (
                <Fragment>
                  {/* {productGridReady.toString}safvan */}
                  <div
                    className="absolute mt-0 z-50 bg-white dark:bg-dark-bg shadow-lg"
                    style={positionStyle}
                    
                  >
                    <GridPreferenceChooser
                      ref={preferenceChooserRef}
                      columns={productColumns}
                      gridId={productGridId}
                      onApplyPreferences={onApplyProductPreferences}
                      showChooserOnGridHead={true}
                      initialPreferences={productInitialPreferences}
                      eclipseClass={
                        "absolute z-10 top-[-5px] left-[2px] pointer-events-auto"
                      }
                    />
                    <DataGrid
                      id={productGridId}
                      ref={dataGridRef}
                      className="custom-data-grid-dark-only"
                      loadPanel={{ enabled: false }}
                      rtlEnabled={appStater?.dir === "rtl"}
                      dataSource={store}
                      height={300}
                      keyExpr={"productID"}
                      allowColumnReordering={true}
                      allowColumnResizing
                      columnResizingMode={"widget"}
                      columnAutoWidth={false}
                      showBorders={true}
                      showRowLines={true}
                      remoteOperations={{
                        filtering: true,
                        paging: true,
                        sorting: true,
                        grouping: false,
                        summary: false,
                        groupPaging: false,
                      }}
                      focusedRowEnabled={true}
                      onFocusedRowChanged={handleProductFocusedRowChanged}
                      onContentReady={handleProductGridContentReady}
                      onKeyDown={handleGridKeyDown}
                      onCellDblClick={handleGridDoubleClick}
                      tabIndex={0}
                      width="100%"
                    >
                      <Selection mode="single" />
                      <Paging pageSize={30} />
                      <Scrolling mode="virtual" showScrollbar="always" />
                      <KeyboardNavigation
                        enabled={true}
                        editOnKeyPress={false}
                        enterKeyDirection="row"
                      />
                      {productGridCol.map((col) => (
                        <Column key={col.dataField} {...col} />
                      ))}
                    </DataGrid>
                  </div>
                </Fragment>
              )}
              {showBatchGrid && !isNullOrUndefinedOrEmpty(batchDataUrl) && (             
                <div
                  className="absolute mt-1 !z-[100] bg-white dark:bg-dark-bg shadow-lg"
                  style={positionStyle}
                >
                  <GridPreferenceChooser
                    ref={preferenceChooserRef}
                    columns={batchColumns}
                    gridId={batchGridId}
                    onApplyPreferences={onApplyBatchPreferences}
                    showChooserOnGridHead={true}
                    initialPreferences={batchInitialPreferences}
                    eclipseClass={"absolute z-10 pointer-events-auto"}
                  />
                  <DataGrid
                    // id={batchGridId}
                    ref={batchGridRef}
                    loadPanel={{ enabled: false }}
                    rtlEnabled={appStater?.dir === "rtl"}
                    className="custom-data-grid-dark-only"
                    dataSource={productDetailStore}
                    height={300}
                    keyExpr={"productBatchID"}
                    allowColumnReordering={true}
                    allowColumnResizing
                    columnResizingMode={"widget"}
                    columnAutoWidth={false}
                    showBorders={true}
                    showRowLines={true}
                    remoteOperations={{
                      filtering: true,
                      paging: true,
                      sorting: true,
                      grouping: false,
                      summary: false,
                      groupPaging: false,
                    }}
                    // paging={{}}
                    focusedRowEnabled={true}
                    onContentReady={handleBatchContentReady}
                    onFocusedRowChanged={handleBatchFocusedRowChanged}
                    onKeyDown={handleBatchGridKeyDown}
                    onCellDblClick={handleBatchGridDoubleClick}
                    tabIndex={0}
                    width="100%"
                  >
                    <Scrolling
                      mode="virtual"
                      showScrollbar="always"
                      renderAsync={false}
                      useNative={"auto"}
                      rowRenderingMode="virtual"
                      preloadEnabled={true}
                    />
                    <KeyboardNavigation
                      enabled={true}
                      editOnKeyPress={false}
                      enterKeyDirection="row"
                    />
                    <Paging pageSize={30} />
                    <Selection mode="single" />
                    {batchGridCol.map((col) => (
                      <Column key={col.dataField} {...col} />
                    ))}
                  </DataGrid>
                </div>              
              )}
            </>
          )}
        </>,
        portalContainerRef.current
      );
    };

    return (
      <>
        <div
          className="flex items-center w-full"
          style={{ width: "100%", minWidth: "100%", maxWidth: "100%" }}
        >
          <div className="relative flex-1" ref={gridContainerRef}>
            {/* <p>mj233333333333-2</p> */}
            <ERPInput
              localInputBox={customStyle}
              textAlignStyle={textAlign}
              ignoreRandomId={isMobileInput ?false: true}
              noLabel={noLabel}
              height_={height}
              isMobileInput={isMobileInput}
              label={label}
              type="text"
              id={inputId || "test"}
              placeholder={placeholder}
              autoFocus={isMobileInput ? false : true }
              labelDirection={labelDirection}
              contextClassName={contextClassNametwo?.replace("!px-1", "")} // Remove !px-1 to avoid padding
              value={inputValue.searchValue}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              disableEnterNavigation
              disabled={disabled}
              ref={inputRef}
              onFocus={(e) => {
                console.log("Focused on ERPProductSearch input");
                if (rest.onFocus) {
                  rest.onFocus(e);
                }
              }}
              onBlur={(e) => {
                console.log("Blurred from ERPProductSearch input");
                if (rest.onBlur) {
                  rest.onBlur(e);
                }
              }}
              focused={showProductGrid } // || batchInitialized
            />
              {productInitialized && showInputSymbol &&(
              <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                <span className="invisible">{inputValue.searchValue}</span>
                <span className="animate-blink text-black">|</span>
              </div>
              )}                   
          </div>
          {showCheckBox && (
            <ERPCheckbox
              id="searchByCode"
              checked={inputValue.searchByCode}
              label={checkboxLabel || t("Code")}
              onChange={(e) =>
                setInputValue((prev) => ({
                  ...prev,
                  searchByCode: e.target.checked,
                }))
              }
            />
          )}
        </div>
        {formState.formElements.productSearchPopupWindow.visible &&
          searchType === "modal" && (
            <ERPModal
              isOpen={formState.formElements.productSearchPopupWindow.visible}
              title={t("item_search")}
              width={1000}
              height={900}
              isForm={true}
              closeModal={onClose}
              content={
                <ProductModalGrid
                  transactionType={formState.transactionType}
                  userConfig={formState.userConfig}
                  onNextCellFind={onNextCellFind}
                  onClose={onClose}
                  rowIndex={
                    formState.formElements.productSearchPopupWindow.data
                      .rowIndex
                  }
                  searchColumn={
                    formState.formElements.productSearchPopupWindow.data
                      .searchColumn
                  }
                  popupSearchUrl={`${Urls.inv_transaction_base}${formState.transactionType}/ItemPopUpSearch`}
                  searchCriteria={
                    formState.formElements.productSearchPopupWindow.data
                      .searchCriteria
                  }
                  searchText={
                    formState.formElements.productSearchPopupWindow.data
                      .searchText
                  }
                  voucherType={
                    formState.formElements.productSearchPopupWindow.data
                      .voucherType
                  }
                  warehouseId={
                    formState.formElements.productSearchPopupWindow.data
                      .warehouseId
                  }
                  inSearch={
                    formState.formElements.productSearchPopupWindow.data
                      .inSearch
                  }
                />
              }
            />
          )}
        {renderDataGridPortal()}
      </>
    );
  }
);

export default React.memo(ERPProductSearch);
