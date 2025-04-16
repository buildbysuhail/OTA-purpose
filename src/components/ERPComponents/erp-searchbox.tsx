import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { APIClient } from '../../helpers/api-client';
import debounce from 'lodash/debounce';
import { DataGrid } from 'devextreme-react';
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling, Summary, TotalItem } from 'devextreme-react/cjs/data-grid';
import { useTranslation } from 'react-i18next';
import CustomStore from 'devextreme/data/custom_store';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  apiUrl?: string;
  keyId?:string;
}

const api = new APIClient();
// Demo data to be used until API is available.
const demoData = [
    { productID: 'P001', ProductName: 'Demo Product 1' },
    { productID: 'P002', ProductName: 'Demo Product 2' },
    { productID: 'P003', ProductName: 'Demo Product 3' },
    { productID: 'P004', ProductName: 'Demo Product 4' },
  ];
const CustomInput: React.FC<InputProps> = ({ label, apiUrl,keyId, onChange, ...rest }) => {
    const [results, setResults] = useState<any[]>(demoData);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation("inventory");

  const fetchData = useCallback(
    async (query: string) => {
      if (!apiUrl) return;
      setLoading(true);
      try {
        const result: any = await api.get(apiUrl,query); // Send query as param
        setResults(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  // Debounced version of fetchData
  const debouncedFetch = useMemo(() => debounce(fetchData, 500), [apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length >= 3) {
      debouncedFetch(value);
    } else {
      setResults([]);
    }
    if (onChange) onChange(e);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();  
    };
  }, [debouncedFetch]);

  const customDataSource = useMemo(() => {
    return new CustomStore({
        key: keyId || 'productID', 
      load: () => {
        // Return results as a Promise.
        // return Promise.resolve(results);
        return Promise.resolve(results.length ? results : demoData);
      },
    });
  }, [results]);
  
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
                dataSource={customDataSource}
                height={300}
                key={keyId}
                showBorders={true}
                showRowLines={true}
                
                >

                <KeyboardNavigation
                  editOnKeyPress={true}
                  enterKeyAction={"moveFocus"}
                  enterKeyDirection={"column"}
                />
            {/* Summary Section */}
            <Summary>
                <TotalItem
                column="productID"
                summaryType="count"
                displayFormat="Total: {0}"
                />
             </Summary>
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

export default CustomInput;
