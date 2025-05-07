import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputId?:string;
  label?: string;
  productDataUrl?: string;
  batchDataUrl?: string;
  keyId?: string;
  onProductSelected?: (data: any) => void;
  onRowSelected?: (data: any) => void;
  checkboxLabel?: string; 
  value?: string; 
  clearAfterSelection?: boolean; 
}

interface LoadResult {
  data: any[];
  totalCount: number;
  summary?: any;
  groupCount?: number;
}
const api = new APIClient();

const createStore = async (value: string,byCode:boolean, productDataUrl?: string) => {
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
          searchByCode:byCode
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

const ERPProductSearch: React.FC<InputProps> = ({inputId,label, productDataUrl, batchDataUrl, keyId, onRowSelected,onProductSelected,checkboxLabel, onChange, value, clearAfterSelection = true, ...rest }) => {
  const [store, setStore] = useState<any>();
  const [productDetailStore, setProductDetailStore] = useState<any>();
  const [showProductGrid, setShowProductGrid] = useState(false);
  const [showBatchGrid, setShowBatchGrid] = useState(false);
  const [inputValue, setInputValue] = useState({
                                                    searchValue:value,
                                                    searchByCode:false,

                                              });
  const dataGridRef = useRef<any>(null);
  const batchGridRef = useRef<any>(null);
  const { t } = useTranslation("inventory");

useEffect(() => {
  console.log(value);
  
  setInputValue((prev) => ({
    ...prev,
    searchValue: value,
  }));
},[value])

  const debouncedFetch = useMemo(
    () =>
      debounce(async (value: string) => {
        let byCode = inputValue.searchByCode;
        const result = await createStore(value,byCode,productDataUrl);
        setStore(result);
        const loadResult = await result.load() as LoadResult;
        setShowProductGrid(loadResult.totalCount > 0);
      }, 200),
    [productDataUrl,inputValue.searchByCode]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue((prev) => ({
      ...prev,
      searchValue: value,
    }));
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
      const grid: any = dataGridRef.current?.instance();
      
      // Handle ArrowDown to select next row
      if (e.event.key === 'ArrowDown') {
        e.event.preventDefault();
        const rows = grid.getVisibleRows();
        const selectedRowKeys = grid.getSelectedRowKeys();
        
        if (rows.length > 0 && selectedRowKeys.length > 0) {
          const currentIndex = rows.findIndex((row: any) => row.key === selectedRowKeys[0]);
          const nextIndex = currentIndex < rows.length - 1 ? currentIndex + 1 : currentIndex;
          
          grid.selectRowsByIndexes([nextIndex]);
          grid.navigateToRow(grid.getKeyByRowIndex(nextIndex));
        }
        return;
      }
      
      // Handle ArrowUp to select previous row
      if (e.event.key === 'ArrowUp') {
        e.event.preventDefault();
        const rows = grid.getVisibleRows();
        const selectedRowKeys = grid.getSelectedRowKeys();
        
        if (rows.length > 0 && selectedRowKeys.length > 0) {
          const currentIndex = rows.findIndex((row: any) => row.key === selectedRowKeys[0]);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          
          grid.selectRowsByIndexes([prevIndex]);
          grid.navigateToRow(grid.getKeyByRowIndex(prevIndex));
        }
        return;
      }
      
      // Original Enter key functionality
      if ((e.event.key === 'NumpadEnter' || e.event.key === 'Enter') && grid.getSelectedRowKeys().length > 0) {
        const selectedRow = grid.getSelectedRowsData()[0];
        if(onProductSelected){
          onProductSelected(selectedRow)
        }
        try {
          if(!isNullOrUndefinedOrEmpty(batchDataUrl)) {
          const batchStore = await createBatchStore(selectedRow.productID, batchDataUrl);
          setProductDetailStore(batchStore);
          setShowBatchGrid(true);
          }
          
          setShowProductGrid(false);
        } catch (err) {
          setShowBatchGrid(false);
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
        if(clearAfterSelection) {
        // setInputValue((prev) => ({
        //   ...prev,
        //   searchValue: '', // Clear the searchValue
        // }))
      }
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
    <div className="flex items-center gap-4">
        {/* {label && (
          <label htmlFor={rest.id || rest.name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )} */}
      <div className=" relative ">
      
        <ERPInput
          noLabel
          type="text"
          id="test"
          placeholder="Search Here"
          value={inputValue.searchValue}
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          disableEnterNavigation
        />
          {showProductGrid && (
           <div className="absolute top-full  left-0     mt-1 z-10 w-auto min-w-[300px] max-w-full md:max-w-[600px] lg:max-w-[800px] min-h-[200px] max-h-[400px] shadow-lg bg-white">
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
            <Paging pageSize={30} />
            <Scrolling mode="virtual" />
            <KeyboardNavigation enabled={true} editOnKeyPress={false}  enterKeyDirection="row" />
            <Column dataField="productCode" caption={t("product_code")} dataType="string" width={100} />
            <Column dataField="productID" caption={t("productID")} dataType="number" visible={false} />
            <Column dataField="productName" caption={t("ProductName")} dataType="string" minWidth={150} />
          </DataGrid>
        </div>
      )}

      {showBatchGrid && !isNullOrUndefinedOrEmpty(batchDataUrl) && (
            <div className="absolute top-full  left-0    mt-1 z-10 w-auto min-w-[300px] max-w-full md:max-w-[600px] lg:max-w-[800px] min-h-[200px] max-h-[400px] shadow-lg bg-white">
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
        <ERPCheckbox
          id='searchByCode'
          checked={inputValue.searchByCode}
          label={ checkboxLabel || t('Code')}
          onChange={e => setInputValue(prev => ({ ...prev, searchByCode: e.target.checked }))}
        />
    </div>
  );
};

export default ERPProductSearch;

// delete
// key = specialPriceID
// api = delete_special_price_scheme