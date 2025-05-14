import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState, } from "react"
import { useTranslation } from "react-i18next";
import { DataGrid } from "devextreme-react";
import { Toolbar, Item, Editing, Column, Lookup, Scrolling, RemoteOperations, Paging, KeyboardNavigation, DataGridTypes, FilterRow } from "devextreme-react/cjs/data-grid";
import { APIClient } from "../../helpers/api-client";
import CustomStore from "devextreme/data/custom_store";


const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== "";
const api = new APIClient();
interface ProductModalGridProps {
  isMaximized?: boolean;
  modalHeight?: any;
  gridData?: [];
  initialSearchValue?: string;
}

const ProductModalGrid = ({ modalHeight, isMaximized,gridData ,initialSearchValue}: ProductModalGridProps) => {
const { t } = useTranslation('inventory');
  const modalGridRef = useRef<any>(null);
const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 150;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);


// const initialFilter = useMemo(() => {
//     if (initialSearchValue) {
//       const field = "productName";
//       return [field, "contains", initialSearchValue]; 
//     }
//     return undefined; 
//   }, [initialSearchValue]);
// Set the initial filter for server-side filtering (only for the first load)
  const initialFilter = useMemo(() => {
    if (initialSearchValue && isInitialLoad) {
      const field = "productName";
      return [field, "contains", initialSearchValue];
    }
    return undefined;
  }, [initialSearchValue, isInitialLoad]);

  // Set the FilterRow input field for the productName column and manage filter state
  useEffect(() => {
    if (modalGridRef.current && initialSearchValue) {
      const gridInstance = modalGridRef.current.instance();

      // Temporarily disable filter application to avoid extra API calls
      gridInstance.option("filterRow.applyFilter", "onClick");

      // Set the FilterRow input field to display initialSearchValue
      gridInstance.columnOption("productName", "filterValue", initialSearchValue);
      gridInstance.columnOption("productName", "selectedFilterOperation", "contains");

      // Re-enable filter application
      gridInstance.option("filterRow.applyFilter", "auto");

      // Mark the initial load as complete to clear the filterValue prop
      setIsInitialLoad(false);
    }
  }, [initialSearchValue]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-1 gap-3">
        
            <DataGrid
              dataSource={gridData}
              height={gridHeight.windows}
              ref={modalGridRef}
              key="exchRateID"
              showBorders={true}
              showRowLines={true}
               loadPanel={{ enabled: false }}
              keyExpr={"ProductID"}
              remoteOperations={{ filtering: true, paging: true, sorting: true }}
              filterValue={initialFilter}
              >
              <KeyboardNavigation
                editOnKeyPress={true}
                enterKeyAction={"startEdit"}
                enterKeyDirection={"row"}
              />
              <Paging pageSize={100}></Paging>
              <Scrolling mode="virtual" />
                <FilterRow visible={true} applyFilter="auto" />
             <Column dataField="productCode" caption={t("product_code")} dataType="string" width={100} allowFiltering={false}  />
             <Column dataField="productID" caption={t("productID")} dataType="number" visible={false} allowFiltering={false}  />
             <Column dataField="productName" caption={t("ProductName")} dataType="string" minWidth={150} allowFiltering={true}  selectedFilterOperation="startswith" />
            </DataGrid>
          </div>
     
        </div>
      </div>


    </Fragment>
  );
};

export default ProductModalGrid;