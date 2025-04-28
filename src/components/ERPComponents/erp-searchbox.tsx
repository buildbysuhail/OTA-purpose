import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APIClient } from '../../helpers/api-client';
import debounce from 'lodash/debounce';
import { DataGrid } from 'devextreme-react';
import { Column, KeyboardNavigation, Paging, Scrolling, Selection } from 'devextreme-react/cjs/data-grid';
import { useTranslation } from 'react-i18next';
import CustomStore from 'devextreme/data/custom_store';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  productDataUrl?: string;
  batchDataUrl?: string;
  keyId?: string;
  onProductSelected?: (data: any) => void;
  onRowSelected?: (data: any) => void;
  searchByCode?: boolean;
}
interface LoadResult {
  data: any[];
  totalCount: number;
  summary?: any;
  groupCount?: number;
}
const api = new APIClient();
// Demo data to be used until API is available.
// function isNotEmpty(value: string | undefined | null) {
//     return value !== undefined && value !== null && value !== "";
//   }
const createStore = async (value: string, productDataUrl?: string) => {
  return new CustomStore({
    key: "productID",
    async load(loadOptions: any) {
      // Create query string for additional parameters.
      const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
      const queryString = paramNames
        .filter((paramName) => loadOptions[paramName] !== undefined && loadOptions[paramName] !== null && loadOptions[paramName] !== "")
        .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
        .join("&");

      try {
        const payload = {
          productName: value,
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

const ERPProductSearch: React.FC<InputProps> = ({ label, productDataUrl, batchDataUrl, keyId, onRowSelected,onProductSelected, searchByCode, onChange, ...rest }) => {
  const [store, setStore] = useState<any>();
  const [productDetailStore, setProductDetailStore] = useState<any>();
  const [showProductGrid, setShowProductGrid] = useState(false);
  const [showBatchGrid, setShowBatchGrid] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dataGridRef = useRef<any>(null);
  const batchGridRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("inventory");

  const debouncedFetch = useMemo(
    () =>
      debounce(async (value: string) => {
        const result = await createStore(value, productDataUrl);
        setStore(result);
        const loadResult = await result.load() as LoadResult;
        setShowProductGrid(loadResult.totalCount > 0);
      }, 1000),
    [productDataUrl]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowBatchGrid(false)
    if (value.length >= 3) {
      debouncedFetch(value);
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

  // Cancel any pending debounced calls on component unmount.
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleGridKeyDown = useCallback(
    async (e: any) => {
      if (e.event.key === 'Enter' && e.component.getSelectedRowKeys().length > 0) {
        const selectedRow = e.component.getSelectedRowsData()[0];
        if(onProductSelected){
          onProductSelected(selectedRow)
        }
        try {
          const batchStore = await createBatchStore(selectedRow.productID, batchDataUrl);
          setProductDetailStore(batchStore);
          setShowProductGrid(false);
          setShowBatchGrid(true);
        } catch (err) {
          setShowBatchGrid(false); // Hide batch grid on error
        }
      }
    },
    [batchDataUrl]
  );

  const handleBatchGridKeyDown = useCallback(
    (e: any) => {
      if (e.event.key === 'Enter' && e.component.getSelectedRowKeys().length > 0) {
        const selectedRow = e.component.getSelectedRowsData()[0];
        if (onRowSelected) {
          onRowSelected(selectedRow); // Call the onRowSelected callback with selected row data
        }
        setShowBatchGrid(false); // Optionally hide the batch grid
        setInputValue(''); // Optionally clear the input
      }
    },
    [onRowSelected]
  );

  const handleBatchContentReady = useCallback(() => {
    if (batchGridRef.current) {
      const gridInstance = batchGridRef.current.instance();
      const visibleRows = gridInstance.getVisibleRows();
      if (visibleRows.length > 0) {
        gridInstance.selectRowsByIndexes([0]);
        gridInstance.navigateToRow(gridInstance.getKeyByRowIndex(0));
        setTimeout(() => {
          // const cellElement = gridInstance.getCellElement(0, 0);
          // if (cellElement) {
          //   cellElement.focus();
          // }
          gridInstance.focus();
        }, 100);
      }
    }
  }, []);

   const handleInputKeyDown = useCallback(
       async (e: React.KeyboardEvent<HTMLInputElement>) => {
        debugger;
         if (e.key === 'ArrowDown' && showProductGrid && dataGridRef.current) {
           const grid: any = dataGridRef.current.instance();
           const rows = grid.getVisibleRows();
           if (rows.length > 0) {
             grid.selectRowsByIndexes([0]);
             grid.navigateToRow(grid.getKeyByRowIndex(0));
       
             setTimeout(() => {
              grid.focus();
              // const cell = grid.getCellElement(0, 0);
              // -            cell?.focus();
             }, 100);
  
           }
         }
         
       },
       [showProductGrid]
     );



  return (
    <div className=''>
      <div className="mb-4 relative">
        {label && (
          <label htmlFor={rest.id || rest.name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          {...rest}
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {showProductGrid && (
        <div className="w-full">
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
            
          >
            <Selection mode="single" />
            <Paging pageSize={10} />
            <Scrolling mode="virtual" />
            <KeyboardNavigation enabled={true} editOnKeyPress={false} enterKeyAction="moveFocus" enterKeyDirection="row" />
            <Column dataField="productCode" caption={t("product_code")} dataType="string" width={100} />
            <Column dataField="productID" caption={t("productID")} dataType="number" visible={false} />
            <Column dataField="productName" caption={t("ProductName")} dataType="string" minWidth={150} />
          </DataGrid>
        </div>
      )}

      {showBatchGrid && (
        <div className="w-full">
          <DataGrid
            ref={batchGridRef}
            loadPanel={{ enabled: false }}
            dataSource={productDetailStore}
            height={300}
            keyExpr={"productBatchID"}
            showBorders={true}
            showRowLines={true}
            remoteOperations={{ filtering: true, paging: true, sorting: true }}
            onKeyDown={handleBatchGridKeyDown}
            onContentReady={handleBatchContentReady}
          >
            <KeyboardNavigation
              editOnKeyPress={false}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"row"}
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
            {/* <Editing
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={false}
            mode="row"
        /> */}
          </DataGrid>
        </div>
      )}

    </div>

  );
};

export default ERPProductSearch;

// delete
// key = specialPriceID
// api = delete_special_price_scheme