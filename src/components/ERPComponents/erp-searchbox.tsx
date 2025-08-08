import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
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
import ERPInput from "../../components/ERPComponents/erp-input";
import { isNullOrUndefinedOrEmpty } from "../../utilities/Utils";
import ERPCheckbox from "./erp-checkbox";
import ERPModal from "./erp-modal";
import { set } from "lodash";
import ProductModalGrid from "./erp-searchbox-modalContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formStateHandleFieldChangeKeysOnly } from "../../pages/inventory/transactions/purchase/reducer";
import Urls from "../../redux/urls";
import { TransactionDetail } from "../../pages/inventory/transactions/purchase/transaction-types";
import { inputBox } from "../../redux/slices/app/types";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import CustomStore from "devextreme/data/custom_store";
import GridPreferenceChooser from "../ERPComponents/erp-gridpreference";
import { DevGridColumn, GridPreference } from "../types/dev-grid-column";
    import { DataType } from "devextreme/common";
import { applyGridColumnPreferences, getInitialPreference } from "../../utilities/dx-grid-preference-updater";
import usePreferenceData from "../../utilities/hooks/usePreference";

interface InputProps {
  id?: string,
  inputId?: string;
  label?: string;
  productDataUrl?: string;
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
  textAlign?: "left" | "right" | "center";
  onNextCellFind?: (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]) => void;
  customStyle?: inputBox
  appState?: any
}

const api = new APIClient();

const ERPProductSearch = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      inputId,
      label,
      productDataUrl,
      batchDataUrl,
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
      onNextCellFind,
      textAlign,
      customStyle,
      appState,
      ...rest
    },
    ref
  ) => {
    const [gridData, setGridData] = useState<any[]>([]);
    const [showProductGrid, setShowProductGrid] = useState(false);
    const [needsFirstRowSelection, setNeedsFirstRowSelection] = useState(false);
    const [showBatchGrid, setShowBatchGrid] = useState(false);
    const [batchGridData, setBatchGridData] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState({
      searchValue: value || "",
      searchByCode: false,
    });
    const [hasSelectedFirstRow, setHasSelectedFirstRow] = useState(false);
    const [batchInitialized, setBatchInitialized] = useState(false);
    
    const dataGridRef = useRef<any>(null);
    const batchGridRef = useRef<any>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRef;
    const portalContainerRef = useRef<HTMLElement | null>(null);
    const debouncedFetchRef = useRef<any>(null);
    const isMounted = useRef<boolean>(true);
    const searchTracker = useRef<Map<string, 'pending' | 'completed'>>(new Map());
    
    const { t } = useTranslation("inventory");
    const dispatch = useDispatch();
    const formState = useSelector(
      (state: RootState) => state.InventoryTransaction
    );
    const applicationSettings = useSelector(
      (state: RootState) => state.ApplicationSettings
    );
    const appStater = useAppSelector(
      (state: RootState) => state?.AppState?.appState
    );


// Add this after the other hooks, before the event handlers
const productGridColumns = useMemo(() => [
  {
    dataField: "productName",
    caption: t("product_name"),
    dataType: "string" as DataType,
    minWidth: 150
  },
  {
    dataField: "productCode",
    caption: t("product_code"),
    dataType: "string" as DataType,
    width: 100
  },
  {
    dataField: "productID",
    caption: t("productID"),
    dataType: "number" as DataType,
    visible: false
  },
  {
    dataField: "arabicName",
    caption: t("arabic_name"),
    dataType: "string" as DataType,
    width: 150
  },
  {
    dataField: "stock",
    caption: t("stock"),
    dataType: "number" as DataType,
    width: 100
  },
  {
    dataField: "stockDetails",
    caption: t("stock_details"),
    dataType: "string" as DataType,
    minWidth: 150
  }
], [t]);

const batchGridColumns = useMemo(() => [
  {
    dataField: "productBatchID",
    caption: t("productBatchID"),
    dataType: "number" as DataType,
    width: 150
  },
  {
    dataField: "productCode",
    caption: t("productCode"),
    dataType: "string" as DataType,
    width: 150
  },
  {
    dataField: "autoBarcode",
    caption: t("autoBarcode"),
    dataType: "string" as DataType,
    width: 150
  },
  {
    dataField: "sPrice",
    caption: t("sprice"),
    dataType: "number" as DataType,
    width: 100
  },
  {
    dataField: "pPrice",
    caption: t("pPrice"),
    dataType: "number" as DataType,
    width: 100
  },
  {
    dataField: "mrp",
    caption: t("mrp"),
    dataType: "number" as DataType,
    width: 100
  },
  {
    dataField: "stock",
    caption: t("stock"),
    dataType: "number" as DataType,
    width: 100
  },
  {
    dataField: "unitID",
    caption: t("unitID"),
    dataType: "number" as DataType,
    minWidth: 100
  },
  {
    dataField: "unit",
    caption: t("unit"),
    dataType: "string" as DataType,
    minWidth: 100
  },
  {
    dataField: "brandID",
    caption: t("brandID"),
    dataType: "number" as DataType,
    minWidth: 100
  },
  {
    dataField: "brandName",
    caption: t("brandName"),
    dataType: "string" as DataType,
    minWidth: 100
  }
], [t]);
const gridId = showProductGrid == true ? `${formState.transactionType}-productSearch`
            : showBatchGrid == true ?`${formState.transactionType}-productSearch`: "";
        const columns = (showProductGrid == true ? productGridColumns
            : showBatchGrid == true ? batchGridColumns: [] as any)
            const{gridCols,onApplyPreferences, preferences}= usePreferenceData(columns,gridId)
    // Initialize portal container
    useEffect(() => {
      portalContainerRef.current = document.getElementById("portal-root");
      if (!portalContainerRef.current) {
        const portalDiv = document.createElement("div");
        portalDiv.id = "portal-root";
        document.body.appendChild(portalDiv);
        portalContainerRef.current = portalDiv;
      }
    }, []);

    // Update input value when prop changes
    useEffect(() => {
      setInputValue((prev) => ({
        ...prev,
        searchValue: value || "",
      }));
    }, [value]);

    // Auto-select first row when data changes and grid is shown
    useEffect(() => {
      if (gridData && gridData.length > 0 && showProductGrid && needsFirstRowSelection && dataGridRef.current) {
        // Wait for grid to be fully rendered
        const timer = setTimeout(() => {
          try {
            const gridInstance = dataGridRef.current?.instance?.();
            if (gridInstance) {
              const firstRowData = gridData[0];
              if (firstRowData && firstRowData.productID) {
                // Clear selection first
                gridInstance.clearSelection();
                
                // Select first row
                gridInstance.selectRows([firstRowData.productID], false);
                
                // Set focused row
                gridInstance.option("focusedRowIndex", 0);
                gridInstance.option("focusedRowEnabled", true);
                
                // Navigate to row
                gridInstance.navigateToRow(firstRowData.productID);
                
                // Clear the flag
                setNeedsFirstRowSelection(false);
                
                console.log('✅ Auto-selected first row via effect:', firstRowData.productID);
              }
            }
          } catch (error) {
            console.error('Error in auto-select effect:', error);
          }
        }, 200);
        
        return () => clearTimeout(timer);
      }
    }, [gridData, showProductGrid, needsFirstRowSelection]);

    // Cache for API responses to prevent duplicate calls
    const apiCacheRef = useRef<Map<string, any>>(new Map());
    const lastSearchValue = useRef("");
    const pendingRequestsRef = useRef<Map<string, Promise<any>>>(new Map());
    
    // Create store function with caching to prevent duplicate API calls
    const createStore = useCallback(async (
      value: string,
      payload: any,
      productDataUrl?: string,
      requestId?: string
    ) => {
      // Clear cache when search value changes
      apiCacheRef.current.clear();
      pendingRequestsRef.current.clear();
      
      let apiCallMade = false;
      
      return new CustomStore({
        key: "productID",
        async load(loadOptions: any) {
          // Check if this is still the current request
          if (requestId && lastSearchValue.current !== value) {
            console.log('Skipping outdated request for:', value);
            return { data: [], totalCount: 0 };
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

          const cacheKey = `${value}-${queryString}`;
          
          // Check if we have cached data
          if (apiCacheRef.current.has(cacheKey)) {
            console.log('Returning cached data for:', value);
            return apiCacheRef.current.get(cacheKey);
          }
          
          // Check if request is already pending
          if (pendingRequestsRef.current.has(cacheKey)) {
            console.log('Request already pending for:', value);
            return pendingRequestsRef.current.get(cacheKey);
          }
          
          // Prevent multiple API calls for the same search
          if (apiCallMade && loadOptions.skip === 0) {
            console.log('API call already made for:', value);
            return apiCacheRef.current.get(cacheKey) || { data: [], totalCount: 0 };
          }

          try {
            const url = productDataUrl || "";
            console.log('Making API call for:', value, 'skip:', loadOptions.skip);
            
            const requestPromise = api.postAsync(
              queryString && queryString !== ""
                ? `${url}?${queryString}`
                : `${url}?skip=0`,
              payload
            ).then(response => {
              const result = response !== undefined && response !== null
                ? {
                    data: response.data,
                    totalCount: response.totalCount,
                  }
                : {
                    data: [],
                    totalCount: 0,
                    summary: {},
                    groupCount: 0,
                  };
              
              // Cache the result
              apiCacheRef.current.set(cacheKey, result);
              pendingRequestsRef.current.delete(cacheKey);
              
              if (loadOptions.skip === 0) {
                apiCallMade = true;
              }
              
              return result;
            }).catch(err => {
              pendingRequestsRef.current.delete(cacheKey);
              throw new Error("Data Loading Error");
            });
            
            // Store pending request
            pendingRequestsRef.current.set(cacheKey, requestPromise);
            
            return requestPromise;
          } catch (err) {
            throw new Error("Data Loading Error");
          }
        },
      });
    }, []);

    const createBatchStore = useCallback(async (productID: string, batchDataUrl?: string) => {
      // Make a direct API call for batch data
      try {
        const url = `${batchDataUrl}${productID}`;
        console.log('Fetching batch data for productID:', productID);
        
        const response = await api.getAsync(`${url}?skip=0&take=30&requireTotalCount=true`);
        
        if (response && response.data) {
          return response.data;
        }
        return [];
      } catch (err) {
        console.error('Error fetching batch data:', err);
        return [];
      }
    }, []);

    // Track if a fetch is in progress to prevent duplicates
    // Using multiple tracking mechanisms to absolutely prevent duplicate API calls:
    // 1. searchTracker: Maps search terms to their status (pending/completed)
    // 2. activeSearchTerm: The currently active search
    // 3. pendingSearch: A search that's been scheduled but not started
    const fetchInProgress = useRef(false);
    const activeSearchTerm = useRef<string>("");
    const pendingSearch = useRef<string>("");
    
    // Create a simple non-debounced fetch function
    const performSearch = useCallback(async (
      searchValue: string,
      byCode: boolean
    ) => {
      // Check if we're already searching for this exact value
      const searchStatus = searchTracker.current.get(searchValue);
      if (searchStatus === 'pending') {
        console.log(`⏳ Search already pending for: "${searchValue}"`);
        return;
      }
      
      if (!searchValue || searchValue.trim() === "" || searchValue.trim() === "%") {
        activeSearchTerm.current = "";
        pendingSearch.current = "";
        searchTracker.current.clear();
        setGridData([]);
        setShowProductGrid(false);
        setHasSelectedFirstRow(false);
        setNeedsFirstRowSelection(false);
        return;
      }
      
      // Clear previous searches and mark this as pending
      searchTracker.current.clear(); // Clear old searches
      searchTracker.current.set(searchValue, 'pending');
      
      let payload: any = {};
      
      if (searchType === "modal") {
        searchTracker.current.delete(searchValue);
        return;
      } else if (searchType === "grid") {
        if (searchKey === "pCode") {
          payload.searchByCode = true;
          payload.searchByCodeAndName = false;
          
          let searchText = "";
          if (useInSearch && searchValue.length > 2) {
            searchText = "%" + searchValue;
          } else {
            searchText = searchValue;
          }
          payload.searchText = searchText;
        } else if (searchKey === "product") {
          payload.searchByCodeAndName = searchByCodeAndName;
          payload.searchByCode = false;
          
          let searchText = "";
          if (useInSearch && searchValue.length > 2) {
            searchText = "%" + searchValue;
          } else {
            searchText = searchValue;
          }

          if (advancedProductSearching) {
            searchText = searchText.replace(/ /g, "%");
          }
          payload.searchText = searchText;
        } else {
          payload.searchText = searchValue;
          payload.searchByCode = byCode;
          payload.productName = searchValue;
        }

        try {
          activeSearchTerm.current = searchValue;
          
          const url = productDataUrl || "";
          console.log(`✅ API call START for: "${searchValue}"`);
          
          const response = await api.postAsync(
            `${url}?skip=0&take=100&requireTotalCount=true`,
            payload
          );
          
          console.log(`✅ API call END for: "${searchValue}", got ${response?.data?.length || 0} items`);
          
          // Mark as completed
          searchTracker.current.set(searchValue, 'completed');
          
          // Only update if this search is still relevant
          if (activeSearchTerm.current === searchValue && isMounted.current && response) {
            // Update grid data
            setGridData(response.data || []);
            setShowProductGrid(true);
            setNeedsFirstRowSelection(true); // Flag that we need to select first row
            setHasSelectedFirstRow(false); // Reset flag for new data
            
            console.log('✅ Grid data updated, flagged for first row selection');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          searchTracker.current.delete(searchValue); // Remove on error to allow retry
          if (activeSearchTerm.current === searchValue && isMounted.current) {
            setGridData([]);
            setShowProductGrid(false);
            setHasSelectedFirstRow(false);
            setNeedsFirstRowSelection(false);
          }
        }
      }
    }, [productDataUrl, searchType, searchKey, searchByCodeAndName, advancedProductSearching, useInSearch]);
    
    // Create debounced version only once
    useEffect(() => {
      const debouncedSearch = debounce((searchValue: string, byCode: boolean) => {
        performSearch(searchValue, byCode);
      }, 200); // Increased delay to 800ms to ensure single call
      
      debouncedFetchRef.current = debouncedSearch;
      
      return () => {
        debouncedSearch.cancel();
        activeSearchTerm.current = "";
        pendingSearch.current = "";
        searchTracker.current.clear();
      };
    }, [performSearch]);

    // Handle input change
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      setInputValue((prev) => ({
        ...prev,
        searchValue: value,
      }));
      
      setShowBatchGrid(false);
      setBatchInitialized(false);
      
      // Cancel any pending debounced calls
      if (debouncedFetchRef.current) {
        debouncedFetchRef.current.cancel();
        // Clear the tracker when cancelling to allow new search
        searchTracker.current.clear();
      }
      
      // Reset when input is cleared
      if (!value || value.trim() === "") {
        activeSearchTerm.current = "";
        pendingSearch.current = "";
        searchTracker.current.clear();
        setGridData([]);
        setShowProductGrid(false);
        setHasSelectedFirstRow(false);
        setNeedsFirstRowSelection(false);
      } else if (value.length >= 1 && searchType !== "modal") {
        // Always schedule the search if we have a debounced function
        if (debouncedFetchRef.current) {
          console.log(`📝 Scheduling search for: "${value}"`);
          debouncedFetchRef.current(value, inputValue.searchByCode);
        }
      }
      
      if (onChange) onChange(e);
    };

    // Calculate position for the DataGrid
    const getGridPosition = useCallback(() => {
      if (inputRef && "current" in inputRef && inputRef.current && gridContainerRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const containerRect = gridContainerRef.current.getBoundingClientRect();
        const isRtl = appStater?.dir === "rtl";
        return {
          top: inputRect.bottom + window.scrollY,
          left: containerRect.left + window.scrollX,
          right: window.innerWidth - (containerRect.right + window.scrollX),
          width: containerRect.width,
        };
      }
      return { top: 0, left: 0, width: "100%" };
    }, [inputRef, appStater?.dir]);

    // Focus input on mount
    useEffect(() => {
      if (inputRef && "current" in inputRef && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [inputRef]);

    // Handle product grid content ready - Auto-select first row
    const handleProductGridContentReady = useCallback((e: any) => {
      const gridInstance = e.component;
      
      // Select first row when grid is ready and we need selection
      if (needsFirstRowSelection) {
        const selectFirstRow = () => {
          const visibleRows = gridInstance.getVisibleRows();
          if (visibleRows && visibleRows.length > 0) {
            const firstRowData = visibleRows[0].data;
            if (firstRowData && firstRowData.productID) {
              gridInstance.clearSelection();
              gridInstance.selectRows([firstRowData.productID], false);
              gridInstance.option("focusedRowIndex", 0);
              gridInstance.navigateToRow(firstRowData.productID);
              setNeedsFirstRowSelection(false); // Clear the flag
              console.log('✅ First row auto-selected:', firstRowData.productID);
            }
          }
        };
        
        // Try immediately
        selectFirstRow();
        
        // Also try with a small delay if immediate didn't work
        if (needsFirstRowSelection) {
          setTimeout(selectFirstRow, 100);
        }
      }
    }, [needsFirstRowSelection]);

    // Handle grid key down
    const handleGridKeyDown = useCallback(
      async (e: any) => {
        console.log(`Grid key: ${e.event.key}`);
        if (e.event.key === "Enter" || e.event.key === "NumpadEnter") {
          const gridInstance = dataGridRef.current.instance();
          const focusedRowIndex = gridInstance.option("focusedRowIndex");
          const rowData = e.data ? e.data : gridInstance.getVisibleRows()[focusedRowIndex]?.data;
          
          if (rowData?.productID > 0) {
            if (onProductSelected) {
              onProductSelected(rowData);
            }
            
            try {
              if (!isNullOrUndefinedOrEmpty(batchDataUrl)) {
                const batchData = await createBatchStore(
                  rowData.productID,
                  batchDataUrl
                );
                if (isMounted.current) {
                  setBatchGridData(batchData);
                  setShowBatchGrid(true);
                  setShowProductGrid(false);
                  setBatchInitialized(false);
                }
              } else {
                setShowProductGrid(false);
                if (inputRef && "current" in inputRef && inputRef.current) {
                  inputRef.current.focus();
                }
              }
            } catch (err) {
              setShowProductGrid(false);
              if (inputRef && "current" in inputRef && inputRef.current) {
                inputRef.current.focus();
              }
            }
          }
        } else if (e.event.key === "Escape") {
          setShowProductGrid(false);
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          e.event.preventDefault();
        }
      },
      [batchDataUrl, onProductSelected, inputRef, createBatchStore]
    );

    // Handle batch grid content ready
    const handleBatchContentReady = useCallback((e: any) => {
      if (!batchInitialized) {
        const grid = e.component;
        grid.option("focusedRowIndex", 0);
        grid.selectRows([grid.getKeyByRowIndex(0)]);
        grid.navigateToRow(grid.getKeyByRowIndex(0));
        grid.focus();
        setBatchInitialized(true);
      }
    }, [batchInitialized]);

    // Handle batch focused row changed
    const handleBatchFocusedRowChanged = useCallback((e: any) => {
      e.component.selectRows([e.row.key], false);
    }, []);

    // Handle batch grid key down
    const handleBatchGridKeyDown = useCallback(
      async (e: any) => {
        console.log(`Batch grid key: ${e.event.key}`);
        if (e.event.key === "Enter") {
          const gridInstance = batchGridRef.current.instance();
          const allSelected = await gridInstance.getSelectedRowsData();
          const selected = allSelected[0];
          
          if (onRowSelected) {
            onRowSelected(selected, inputValue.searchValue);
          }
          
          setShowBatchGrid(false);
          setBatchInitialized(false);
          
          if (clearAfterSelection) {
            setInputValue((prev) => ({
              ...prev,
              searchValue: "",
            }));
            lastSearchValue.current = "";
          }
          
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
        } else if (e.event.key === "Escape") {
          setShowBatchGrid(false);
          setBatchInitialized(false);
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          e.event.preventDefault();
        }
      },
      [onRowSelected, clearAfterSelection, inputRef, inputValue.searchValue]
    );

    // Handle input key down
    const handleInputKeyDown = useCallback(
      async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        debugger;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key) && showProductGrid && dataGridRef.current) {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            const grid: any = dataGridRef.current.instance();
            const rows = grid.getVisibleRows();
            if (rows.length > 0) {
              // Ensure first row is selected
              const firstRowKey = gridData[0]?.productID;
              const firstRowKeyIndex = rows.findIndex((x: any) => x.data.productID == firstRowKey);
              if (firstRowKey) {
                grid.clearSelection();
                grid.selectRows([firstRowKey], false);
                grid.option("focusedRowIndex", firstRowKeyIndex);
                grid.navigateToRow(firstRowKey);
                grid.focus();
                e.preventDefault();
              }
            }
          } else if (e.key === "Enter") {
            if (searchType !== "modal") {
              const gridInstance = dataGridRef.current?.instance?.();
              if (gridInstance) {
                const focusedRowIndex = gridInstance.option("focusedRowIndex");
                const rowData = gridInstance.getVisibleRows()[focusedRowIndex]?.data;
                handleGridKeyDown({ event: { key: "Enter" }, data: rowData });
                return;
              }
              rest?.onKeyDown && rest?.onKeyDown(value, e);
            } else {
              if (!isNullOrUndefinedOrEmpty(e.currentTarget.value)) {
                if (searchKey === "product") {
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
            setBatchInitialized(false);
            e.preventDefault();
          } else if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
            const input = e.target as HTMLInputElement;
            const { selectionStart, selectionEnd, value } = input;
            let shouldNavigate = true;
            
            if (e.key === "ArrowRight" && (selectionStart !== value.length || selectionEnd !== value.length)) {
              shouldNavigate = false;
            } else if (e.key === "ArrowLeft" && (selectionStart !== 0 || selectionEnd !== 0)) {
              shouldNavigate = false;
            }
            
            if (shouldNavigate && rest.onKeyDown) {
              rest?.onKeyDown(value, e);
              e.preventDefault();
            }
          }
        } else {
          if (rest.onKeyDown) {
            rest?.onKeyDown(value, e);
          }
        }
      },
      [showProductGrid, searchType, rest.onKeyDown, searchKey, rowIndex, formState, dispatch, handleGridKeyDown]
    );

    // Handle focus trap
    useEffect(() => {
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (!gridContainerRef.current || !showProductGrid) return;
        
        const focusableElements = gridContainerRef.current.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

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

    // Handle modal close
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
    }, [dispatch]);

    // Hide error messages
    useEffect(() => {
      const style = document.createElement('style');
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

    // Cleanup on unmount
    useEffect(() => {
      isMounted.current = true;
      
      return () => {
        isMounted.current = false;
        if (debouncedFetchRef.current) {
          debouncedFetchRef.current.cancel();
        }
        searchTracker.current.clear();
      };
    }, []);

    // Render DataGrid portal
    const renderDataGridPortal = () => {
      if (!portalContainerRef.current) return null;
      
      const direction = appStater?.dir || "ltr";
      const { top, left, right, width } = getGridPosition();
      
      const positionStyle: React.CSSProperties = {
        top: `${top}px`,
        width: "100%",
        minWidth: "300px",
        maxWidth: "800px",
        minHeight: "200px",
        maxHeight: "400px",
        ...(direction === "rtl"
          ? { right: `${right}px`, left: undefined }
          : { left: `${left}px`, right: undefined }),
      };
    
      
      return createPortal(
        <>
          {searchType === "grid" && (
            <>
              {showProductGrid && gridData.length > 0 && (
                <div
                  className="absolute mt-0 !z-[100] bg-white shadow-lg"
                  style={positionStyle}
                >
                 <GridPreferenceChooser
                                        ref={dataGridRef}
                                        gridId={`${formState.transactionType}-productSearch`}
                                        columns={
                                          (formState.gridColumns ?? []) as DevGridColumn[]
                                        }
                                        onApplyPreferences={onApplyPreferences}
                                        showChooserName={true}
                                        eclipseClass="m-0 p-0 font-medium"
                                      />
                  <DataGrid
                    ref={dataGridRef}
                    loadPanel={{ enabled: false }}
                    rtlEnabled={appStater?.dir === "rtl"}
                    dataSource={gridData}
                    height={300}
                    keyExpr={"productID"}
                    showBorders={true}
                    showRowLines={true}
                    selectedRowKeys={gridData.length > 0 && gridData[0].productID ? [gridData[0].productID] : []}
                    onContentReady={handleProductGridContentReady}
                    onInitialized={(e) => {
                      console.log('Grid initialized with data count:', gridData.length);
                      // Force selection on initialization
                      if (gridData.length > 0 && needsFirstRowSelection) {
                        const firstRow = gridData[0];
                        if (firstRow && firstRow.productID) {
                          setTimeout(() => {
                            if (e.component) {
                              e.component.selectRows([firstRow.productID], false);
                              e.component.option("focusedRowIndex", 0);
                              e.component.navigateToRow(firstRow.productID);
                              setNeedsFirstRowSelection(false);
                              console.log('✅ Selected first row on init');
                            }
                          }, 50);
                        }
                      }
                    }}
                    onFocusedRowChanged={(e) => {
                      // Keep selection in sync with focused row
                      console.log('onFocusedRowChanged');
                      
                      if (e.row && e.row.data && e.row.data.productID) {
                        e.component.selectRows([e.row.data.productID], false);
                      }
                    }}
                    repaintChangesOnly={false}
                    cacheEnabled={false}
                    remoteOperations={false}
                    focusedRowEnabled={true}
                    autoNavigateToFocusedRow={true}
                    onKeyDown={handleGridKeyDown}
                    onRowClick={(e) => {
                      // Ensure row is selected on click
                      if (e.data && e.data.productID) {
                        e.component.selectRows([e.data.productID], false);
                      }
                    }}
                    tabIndex={0}
                    width="100%"
                  >
                    <Selection 
                      mode="single" 
                      showCheckBoxesMode="none"
                      allowSelectAll={false}
                      selectAllMode="page"
                    />
                    <Paging pageSize={30} />
                    <Scrolling mode="virtual" />
                    <KeyboardNavigation
                      enabled={true}
                      editOnKeyPress={false}
                      enterKeyDirection="row"
                    />
                   {gridCols?.map((column, index) => (
                                 <Column
                                   key={column.dataField}
                                   allowResizing={true}
                                   dataField={column.dataField}
                                   caption={column.caption }
                                   format={column.format}
                                   dataType={column.dataType ?? "string"}
                                   allowSorting={column.allowSorting}
                                   minWidth={column.minWidth}
                                   visible={column.visible || false }
                                   sortOrder={column.sortOrder}
                                   sortIndex={column.sortIndex}
                                 />
                               ))}
                  </DataGrid>
                </div>
              )}
              {showBatchGrid && batchGridData.length > 0 && !isNullOrUndefinedOrEmpty(batchDataUrl) && (
                <div
                  className="absolute mt-1 !z-[100] bg-white shadow-lg"
                  style={positionStyle}
                >
                  <DataGrid
                    ref={batchGridRef}
                    loadPanel={{ enabled: false }}
                    rtlEnabled={appStater?.dir === "rtl"}
                    className="custom-data-grid-dark-only"
                    dataSource={batchGridData}
                    height={300}
                    keyExpr={"productBatchID"}
                    showBorders={true}
                    showRowLines={true}
                    remoteOperations={false}
                    focusedRowEnabled={true}
                    onContentReady={handleBatchContentReady}
                    onFocusedRowChanged={handleBatchFocusedRowChanged}
                    onKeyDown={handleBatchGridKeyDown}
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
                       {gridCols?.map((column, index) => (
                                 <Column
                                   key={column.dataField}
                                   allowResizing={true}
                                   dataField={column.dataField}
                                   caption={column.caption }
                                   format={column.format}
                                   dataType={column.dataType ?? "string"}
                                   allowSorting={column.allowSorting}
                                   minWidth={column.minWidth}
                                   visible={column.visible || false }
                                   sortOrder={column.sortOrder}
                                   sortIndex={column.sortIndex}
                                 />
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
            <ERPInput
              localInputBox={customStyle}
              textAlignStyle={textAlign}
              ignoreRandomId={true}
              noLabel={noLabel}
              label={label}
              type="text"
              id={inputId || "test"}
              placeholder={placeholder}
              labelDirection={labelDirection}
              contextClassName={contextClassNametwo?.replace("!px-1", "")}
              value={inputValue.searchValue}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              disableEnterNavigation
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
            />
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
              title={t("privilege_card")}
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
                    formState.formElements.productSearchPopupWindow.data.rowIndex
                  }
                  searchColumn={
                    formState.formElements.productSearchPopupWindow.data.searchColumn
                  }
                  popupSearchUrl={`${Urls.inv_transaction_base}${formState.transactionType}/ItemPopUpSearch`}
                  searchCriteria={
                    formState.formElements.productSearchPopupWindow.data.searchCriteria
                  }
                  searchText={
                    formState.formElements.productSearchPopupWindow.data.searchText
                  }
                  voucherType={
                    formState.formElements.productSearchPopupWindow.data.voucherType
                  }
                  warehouseId={
                    formState.formElements.productSearchPopupWindow.data.warehouseId
                  }
                  inSearch={
                    formState.formElements.productSearchPopupWindow.data.inSearch
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