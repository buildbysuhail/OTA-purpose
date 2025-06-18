import React, { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { APIClient } from '../../helpers/api-client';
import debounce from 'lodash/debounce';
import { DataGrid } from 'devextreme-react';
import { Column, KeyboardNavigation, Paging, Scrolling, Selection } from 'devextreme-react/cjs/data-grid';
import { useTranslation } from 'react-i18next';
import CustomStore from 'devextreme/data/custom_store';
import ERPInput from "../../components/ERPComponents/erp-input";
import {
  isNullOrUndefinedOrEmpty,
} from "../../utilities/Utils";
import ERPCheckbox from './erp-checkbox';
import ERPModal from './erp-modal';
import { set } from 'lodash';
import ProductModalGrid from './erp-searchbox-modalContent';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputId?: string;
  label?: string;
  productDataUrl?: string;
  batchDataUrl?: string;
  keyId?: string;
  onProductSelected?: (data: any) => void;
  onRowSelected?: (data: any) => void;
  onEnterKeyDown?: () => void;
  checkboxLabel?: string;
  value?: string;
  clearAfterSelection?: boolean;
  showCheckBox?: boolean;
  searchType?: "grid" | "normal" | "modal";
  placeholder?: string;
  labelDirection?: "horizontal" | "vertical";
  contextClassNametwo?: string;
  noLabel?: boolean;
}

interface LoadResult {
  data: any[];
  totalCount: number;
  summary?: any;
  groupCount?: number;
}

const api = new APIClient();

const createStore = async (value: string, byCode: boolean, productDataUrl?: string) => {
  return new CustomStore({
    key: "productID",
    async load(loadOptions: any) {
      const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
      const queryString = paramNames
        .filter((paramName) => loadOptions[paramName] !== undefined && loadOptions[paramName] !== null && loadOptions[paramName] !== "")
        .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
        .join("&");

      try {
        const payload = {
          productName: value,
          searchByCode: byCode,
        };
        const url = productDataUrl || "";
        const response = await api.postAsync(queryString && queryString !== "" ? `${url}?${queryString}` : `${url}?skip=0`, payload);
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

const createBatchStore = async (productID: string, batchDataUrl?: string) => {
  return new CustomStore({
    key: "productBatchID",
    async load(loadOptions: any) {
      const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
      const queryString = paramNames
        .filter((paramName) => loadOptions[paramName] !== undefined && loadOptions[paramName] !== null && loadOptions[paramName] !== "")
        .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
        .join("&");

      try {
        const url = `${batchDataUrl}${productID}` || "";
        const response = await api.getAsync(queryString && queryString !== "" ? `${url}?${queryString}` : `${url}?skip=0`);
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

const createModalStore = async (productDataUrl?: string) => {
  return new CustomStore({
    key: "productID",
    async load(loadOptions: any) {
      const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
      const queryString = paramNames
        .filter((paramName) => loadOptions[paramName] !== undefined && loadOptions[paramName] !== null && loadOptions[paramName] !== "")
        .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
        .join("&");

      const url = `${productDataUrl}?${queryString}`;

      try {
        const response = await api.getAsync(url);
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

const ERPProductSearch = forwardRef<HTMLInputElement, InputProps>(({
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
  ...rest
}, ref) => {
  const [store, setStore] = useState<any>();
  const [productDetailStore, setProductDetailStore] = useState<any>();
  const [modalStore, setModalStore] = useState<any>(null);
  const [showProductGrid, setShowProductGrid] = useState(false);
  const [showBatchGrid, setShowBatchGrid] = useState(false);
  const [inputValue, setInputValue] = useState({
    searchValue: value,
    searchByCode: false,
  });
  const dataGridRef = useRef<any>(null);
  const batchGridRef = useRef<any>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("inventory");

  useEffect(() => {
    setInputValue((prev) => ({
      ...prev,
      searchValue: value,
    }));
  }, [value]);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (value: string) => {
        let byCode = inputValue.searchByCode;
        if (searchType === "modal") {
          const store = await createModalStore(productDataUrl);
          setModalStore(store);
          setShowProductGrid(true);
        } else if (searchType === "grid") {
          const store = await createStore(value, byCode, productDataUrl);
          setStore(store);
          const loadResult = await store.load() as LoadResult;
          setShowProductGrid(loadResult.totalCount > 0);
        }
      }, 200),
    [productDataUrl, inputValue.searchByCode, searchType]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue((prev) => ({
      ...prev,
      searchValue: value,
    }));
    setShowBatchGrid(false);
    if (value.length >= 3) {
      if (searchType !== "modal") {
        debouncedFetch(value);
      }
    } else {
      setStore({
        data: [],
        totalCount: 0,
        summary: {},
        groupCount: 0,
      });
      setShowProductGrid(false);
    }
    if (onChange) onChange(e);
  };

  useEffect(() => () => {
    debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleGridKeyDown = useCallback(
    async (e: any) => {
      console.log(`Grid key: ${e.event.key}`);
      if (e.event.key === 'Enter' || e.event.key === 'NumpadEnter') {
        const grid: any = dataGridRef.current?.instance();
        const selectedRowKeys = grid.getSelectedRowKeys();
        if (selectedRowKeys.length > 0) {
          const selectedRow = grid.getSelectedRowsData()[0];
          if (onProductSelected) {
            onProductSelected(selectedRow);
          }
          try {
            if (!isNullOrUndefinedOrEmpty(batchDataUrl)) {
              const batchStore = await createBatchStore(selectedRow.productID, batchDataUrl);
              setProductDetailStore(batchStore);
              setShowBatchGrid(true);
              setShowProductGrid(false);
            } else {
              setShowProductGrid(false);
              if (ref && 'current' in ref && ref.current) {
                ref.current.focus();
              }
            }
          } catch (err) {
            setShowProductGrid(false);
            if (ref && 'current' in ref && ref.current) {
              ref.current.focus();
            }
          }
        }
      } else if (e.event.key === 'Escape') {
        setShowProductGrid(false);
        if (ref && 'current' in ref && ref.current) {
          ref.current.focus();
        }
        e.event.preventDefault();
      }
    }, [batchDataUrl, onProductSelected, ref]
  );

  const handleBatchGridKeyDown = useCallback(
    (e: any) => {
      console.log(`Batch grid key: ${e.event.key}`);
      if (e.event.key === 'Enter' && e.component.getSelectedRowKeys().length > 0) {
        const selectedRow = e.component.getSelectedRowsData()[0];
        if (onRowSelected) {
          onRowSelected(selectedRow);
        }
        setShowBatchGrid(false);
        if (clearAfterSelection) {
          setInputValue((prev) => ({
            ...prev,
            searchValue: '',
          }));
        }
        if (ref && 'current' in ref && ref.current) {
          ref.current.focus();
        }
      } else if (e.event.key === 'Escape') {
        setShowBatchGrid(false);
        setShowProductGrid(true);
        e.event.preventDefault();
      }
    },
    [onRowSelected, clearAfterSelection, ref]
  );

  const handleBatchContentReady = useCallback(() => {
    if (batchGridRef.current) {
      const gridInstance = batchGridRef.current.instance();
      const visibleRows = gridInstance.getVisibleRows();
      if (visibleRows.length > 0) {
        gridInstance.selectRowsByIndexes([0]);
        gridInstance.navigateToRow(gridInstance.getKeyByRowIndex(0));
        gridInstance.focus();
      }
    }
  }, []);

  const handleInputKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(`Input key: ${e.key}`);
      if (showProductGrid && dataGridRef.current) {
        if (e.key === "ArrowDown") {
          const grid: any = dataGridRef.current.instance();
          const rows = grid.getVisibleRows();
          if (rows.length > 0) {
            grid.selectRowsByIndexes([0]);
            grid.navigateToRow(grid.getKeyByRowIndex(0));
            grid.focus();
            e.preventDefault();
          }
        } else if (e.key === "ArrowUp") {
          const grid: any = dataGridRef.current.instance();
          const rows = grid.getVisibleRows();
          if (rows.length > 0) {
            grid.selectRowsByIndexes([rows.length - 1]);
            grid.navigateToRow(grid.getKeyByRowIndex(rows.length - 1));
            grid.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === "Enter" && searchType === "modal" && inputValue.searchValue && inputValue.searchValue.length >= 3) {
        debouncedFetch(inputValue.searchValue);
        e.preventDefault();
      } else if (e.key === "Escape" && showProductGrid) {
        setShowProductGrid(false);
        e.preventDefault();
      } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        const input = e.target as HTMLInputElement;
        const { selectionStart, selectionEnd, value } = input;
        let shouldNavigate = true;
        if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
          if (e.key === "ArrowRight" && (selectionStart !== value.length || selectionEnd !== value.length)) {
            shouldNavigate = false;
          } else if (e.key === "ArrowLeft" && (selectionStart !== 0 || selectionEnd !== 0)) {
            shouldNavigate = false;
          }
        }
        if (shouldNavigate && rest.onKeyDown) {
          rest.onKeyDown(e);
          e.preventDefault();
        }
      }
    },
    [showProductGrid, inputValue.searchValue, searchType, debouncedFetch, rest.onKeyDown]
  );

  useEffect(() => {
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!gridContainerRef.current || !showProductGrid) return;
      const focusableElements = gridContainerRef.current.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [showProductGrid]);

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative w-full" ref={gridContainerRef}>
          <ERPInput
            ignoreRandomId={true}
            noLabel={noLabel}
            label={label}
            type="text"
            id={inputId || "test"}
            placeholder={placeholder}
            labelDirection={labelDirection}
            contextClassName={contextClassNametwo}
            value={inputValue.searchValue}
            onChange={handleChange}
            onKeyDown={handleInputKeyDown}
            onEnterKeyDown={onEnterKeyDown}
            disableEnterNavigation
            ref={ref}
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
          {searchType === "grid" && (
            <>
              {showProductGrid && (
                <div className="absolute top-full left-0 mt-0 z-10 w-auto min-w-[300px] max-w-full md:max-w-[600px] lg:max-w-[800px] min-h-[200px] max-h-[400px] shadow-lg bg-white">
                  <DataGrid
                    ref={dataGridRef}
                    loadPanel={{ enabled: false }}
                    dataSource={store}
                    height={300}
                    keyExpr={"productID"}
                    showBorders={true}
                    showRowLines={true}
                    remoteOperations={{ filtering: true, paging: true, sorting: true }}
                    onKeyDown={handleGridKeyDown}
                    tabIndex={0}
                  >
                    <Selection mode="single" />
                    <Paging pageSize={30} />
                    <Scrolling mode="virtual" />
                    <KeyboardNavigation enabled={true} editOnKeyPress={false} enterKeyDirection="row" />
                    <Column dataField="productCode" caption={t("product_code")} dataType="string" width={100} />
                    <Column dataField="productID" caption={t("productID")} dataType="number" visible={false} />
                    <Column dataField="productName" caption={t("ProductName")} dataType="string" minWidth={150} />
                  </DataGrid>
                </div>
              )}
              {showBatchGrid && !isNullOrUndefinedOrEmpty(batchDataUrl) && (
                <div className="absolute top-full left-0 mt-1 z-10 w-auto min-w-[300px] max-w-full md:max-w-[600px] lg:max-w-[800px] min-h-[200px] max-h-[400px] shadow-lg bg-white">
                  <DataGrid
                    ref={batchGridRef}
                    loadPanel={{ enabled: false }}
                    className='custom-data-grid-dark-only'
                    dataSource={productDetailStore}
                    height={300}
                    keyExpr={"productBatchID"}
                    showBorders={true}
                    showRowLines={true}
                    remoteOperations={{ filtering: true, paging: true, sorting: true }}
                    onKeyDown={handleBatchGridKeyDown}
                    onContentReady={handleBatchContentReady}
                    tabIndex={0}
                  >
                    <KeyboardNavigation
                      editOnKeyPress={false}
                      enterKeyDirection="row"
                    />
                    <Paging pageSize={10} />
                    <Selection mode="single" />
                    <Column dataField="productBatchID" caption={t("productBatchID")} dataType="number" width={150} />
                    <Column dataField="productCode" caption={t("productCode")} dataType="string" width={150} />
                    <Column dataField="autoBarcode" caption={t("autoBarcode")} dataType="string" width={150} />
                    <Column dataField="sPrice" caption={t("sprice")} dataType="number" width={100} />
                    <Column dataField="pPrice" caption={t("pPrice")} dataType="number" width={100} />
                    <Column dataField="mrp" caption={t("mrp")} dataType="number" width={100} />
                    <Column dataField="stock" caption={t("stock")} dataType="number" width={100} />
                    <Column dataField="unitID" caption={t("unitID")} dataType="number" minWidth={100} />
                    <Column dataField="unit" caption={t("unit")} dataType="string" minWidth={100} />
                    <Column dataField="brandID" caption={t("brandID")} dataType="number" minWidth={100} />
                    <Column dataField="brandName" caption={t("brandName")} dataType="string" minWidth={100} />
                  </DataGrid>
                </div>
              )}
            </>
          )}
        </div>
        {showCheckBox && (
          <ERPCheckbox
            id='searchByCode'
            checked={inputValue.searchByCode}
            label={checkboxLabel || t('Code')}
            onChange={e => setInputValue(prev => ({ ...prev, searchByCode: e.target.checked }))}
          />
        )}
      </div>
      {searchType === "modal" && (
        <ERPModal
          isOpen={showProductGrid}
          title={t("privilege_card")}
          width={1000}
          height={800}
          isForm={true}
          closeModal={() => { setShowProductGrid(false) }}
          content={
            <ProductModalGrid gridData={modalStore}
              initialSearchValue={inputValue.searchValue}
            />}
        />
      )}
    </>
  );
});

export default React.memo(ERPProductSearch);