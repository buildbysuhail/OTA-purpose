import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APIClient } from '../../helpers/api-client';
import debounce from 'lodash/debounce';
import { DataGrid } from 'devextreme-react';
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling, Summary, TotalItem ,Selection} from 'devextreme-react/cjs/data-grid';
import { useTranslation } from 'react-i18next';
import CustomStore from 'devextreme/data/custom_store';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  productDataUrl?: string;
  batchDataUrl?: string;
  keyId?:string;
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
          const response = await api.postAsync(  queryString && queryString !== "" ? `${url}?${queryString}` : `${url}?skip=0`, payload);
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
      key: "productID", // Adjust to "specialPriceID" if needed
      async load(loadOptions: any) {
        const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
        const queryString = paramNames
          .filter((paramName) => loadOptions[paramName] !== undefined && loadOptions[paramName] !== null && loadOptions[paramName] !== "")
          .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
          .join("&");
  
        try {
          // const payload = {
          //   productID, // Pass selected productID to API
          // };
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
  
const ERPProductSearch: React.FC<InputProps> = ({ label, productDataUrl,batchDataUrl,keyId, onChange, ...rest }) => {
    const [store, setStore] = useState<any>();
    const [productDetailStore, setProductDetailStore] = useState<any>();
    const [showProductGrid, setShowProductGrid] = useState(false);
    const [showBatchGrid, setShowBatchGrid] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const dataGridRef = useRef<any>(null);
    const { t } = useTranslation("inventory");

    const debouncedFetch = useMemo(
        () =>
          debounce(async (value: string) => {
            const result = await createStore(value, productDataUrl);
            setStore(result);
            const loadResult = await result.load() as LoadResult;
            setShowProductGrid(loadResult.totalCount > 0); 
          }, 500),
        [productDataUrl]
      );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

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



//   const handleKeyDown = useCallback((e: any) => {
//     if (e.event.key === 'Enter' && e.component.getSelectedRowKeys().length > 0) {
//       setShowProductGrid(false);
//       setShowBatchGrid(true);
//       // Optional: Populate productDetailStore based on selected row
//       // const selectedRow = e.component.getSelectedRowsData()[0];
//       // Fetch product details using selectedRow.productID
//     }
//   }, []);

  const handleKeyDown = useCallback(
    async (e: any) => {
      if (e.event.key === 'Enter' && e.component.getSelectedRowKeys().length > 0) {
        const selectedRow = e.component.getSelectedRowsData()[0];
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
  // Cancel any pending debounced calls on component unmount.
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);
  
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
        value={inputValue}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
     </div>
     {showProductGrid && (
        <div className="w-full">
          <DataGrid
            loadPanel={{ enabled: false }}
            dataSource={store}
            height={300}
            keyExpr={"productID"}
            showBorders={true}
            showRowLines={true}
            remoteOperations={{ filtering: true, paging: true, sorting: true }}
            onKeyDown={handleKeyDown}
          >
             <Selection mode="single" />
    
            <Paging pageSize={10} />
            <Scrolling mode="virtual" />
            <RemoteOperations
              filtering={false}
              sorting={false}
              paging={false}
            />
            <Column
              dataField="productCode"
              caption={t("product_code")}
              allowEditing={false}
              dataType="string"
              width={100}
            />
            <Column
              dataField="productID"
              caption={t("productID")}
              allowEditing={false}
              dataType="string"
              width={150}
              visible={false}
            />
            <Column
              dataField="productName"
              caption={t("ProductName")}
              dataType="string"
              allowEditing={true}
              minWidth={150}
            />
        
          </DataGrid>
        </div>
      )}

     
        {showBatchGrid && (
        <div className="w-full">
          <DataGrid
            loadPanel={{ enabled: false }}
            dataSource={productDetailStore}
            height={300}
            keyExpr={"productID"}
            showBorders={true}
            showRowLines={true}
            remoteOperations={{ filtering: true, paging: true, sorting: true }}
          >
            <KeyboardNavigation
              editOnKeyPress={false}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"row"}
            />
            <Paging pageSize={10} />
            <Scrolling mode="virtual" />
            <RemoteOperations
              filtering={false}
              sorting={false}
              paging={false}
            />
            <Column
              dataField="mrp"
              caption={t("mrp")}
              allowEditing={false}
              dataType="string"
              width={100}
            />
            <Column
              dataField="stock"
              caption={t("stock")}
              allowEditing={false}
              dataType="string"
              width={150}
              visible={false}
            />
            <Column
              dataField="unit"
              caption={t("unit")}
              dataType="string"
              allowEditing={true}
              minWidth={150}
            />
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


// disabl loader
// virtualscrollin
// debounce
// rowwie selection
// keydown to grid


// delete
// key = specialPriceID
// api = delete_special_price_scheme

