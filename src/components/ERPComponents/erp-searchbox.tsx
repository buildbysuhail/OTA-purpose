import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { APIClient } from '../../helpers/api-client';
import debounce from 'lodash/debounce';
import { DataGrid } from 'devextreme-react';
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling, Summary, TotalItem } from 'devextreme-react/cjs/data-grid';
import { useTranslation } from 'react-i18next';
import CustomStore from 'devextreme/data/custom_store';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  productDataUrl?: string;
  batchDataUrl?: string;
  keyId?:string;
}

const api = new APIClient();
// Demo data to be used until API is available.

const ERPProductSearch: React.FC<InputProps> = ({ label, productDataUrl,keyId, onChange, ...rest }) => {
    const [store, setStore] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation("inventory");
  function isNotEmpty(value: string | undefined | null) {
    return value !== undefined && value !== null && value !== "";
  }
  const createStore = async (value: string) => {
  return new CustomStore({
    key: "productID",
    async load(loadOptions: any) {
      const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
      const queryString = paramNames
        .filter((paramName) => isNotEmpty(loadOptions[paramName]))
        .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
        .join("&");

      try {
        debugger;
        const payload = {
                // Or however you access it
                productName: value,
              };
        const url =`${productDataUrl}`
        const response = await api.postAsync(queryString && queryString != "" ? `${url}?${queryString}` : `${url}?${'skip=0'}`,payload);
        const result = response;
        return result !== undefined && result != null
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
}
const debouncedFetch = async(value: string) => 
{
  const result = await createStore(value); // or pass input if needed
    setStore(result)
};
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
  }

  if (onChange) onChange(e);
};
  // Cleanup debounce on unmount
  // useEffect(() => {
  //   return () => {
  //     debouncedFetch.cancel();  
  //   };
  // }, [debouncedFetch]);

  // const customDataSource = useMemo(() => {
  //   return new CustomStore({
  //       key: keyId || 'productID', 
  //     load: () => {
  //       // Return results as a Promise.
  //       // return Promise.resolve(results);
  //       return Promise.resolve(results.length ? results : demoData);
  //     },
  //   });
  // }, [results]);
  
  return (
    <div className=''>
     <div className="mb-4">
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
     <div className="w-full">
              <DataGrid
                // dataSource={openMB.data}
                
                dataSource={store}
                height={300}
                keyExpr={"productID"}
                showBorders={true}
                showRowLines={true}
                remoteOperations={{ filtering: true, paging: true, sorting: true }}
                >

                <KeyboardNavigation
                  editOnKeyPress={true}
                  enterKeyAction={"moveFocus"}
                  enterKeyDirection={"column"}
                />
            {/* Summary Section */}
            
                <Paging pageSize={10} />

                <Scrolling mode="standard" />

                <RemoteOperations
                  filtering={false}
                  sorting={false}
                  paging={false}
                />

                <Column
                  dataField="productID"
                  caption={t("productID")}
                  allowEditing={false}
                  dataType="string"
                  width={150}
                />

                <Column
                  dataField="ProductName"
                  caption={t("ProductName")}
                  dataType="string"
                  allowEditing={true}
                  minWidth={150}
                />

                <Editing
                  allowUpdating={true}
                  allowAdding={false}
                  allowDeleting={false}
                  mode="cell"
                />
              </DataGrid>
            </div>

    </div>

  );
};

export default ERPProductSearch;

// delete
// key = specialPriceID
// api = delete_special_price_scheme
// disabl loader
// virtualscrollin
// debounce
// rowwie selection