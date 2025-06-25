import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState, } from "react"
import { useTranslation } from "react-i18next";
import { DataGrid } from "devextreme-react";
import { Toolbar, Item, Editing, Column, Lookup, Scrolling, RemoteOperations, Paging, KeyboardNavigation, DataGridTypes, FilterRow } from "devextreme-react/cjs/data-grid";
import { APIClient } from "../../helpers/api-client";
import ErpDevGrid from "../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../types/dev-grid-column";
import Urls from "../../redux/urls";


const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== "";
const api = new APIClient();
interface ProductModalGridProps {
  isMaximized?: boolean;
  modalHeight?: any;
  gridData?: [];
  searchCriteria: string;
    searchText: string;
    voucherType: string;
    warehouseId: number;
    inSearch: boolean;
    popupSearchUrl: string;
}

const ProductModalGrid = ({ modalHeight, isMaximized,gridData ,searchCriteria,
    searchText,
    voucherType,
    warehouseId,
    inSearch,
  popupSearchUrl}: ProductModalGridProps) => {
const { t } = useTranslation('inventory');
  const modalGridRef = useRef<any>(null);
const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 80;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);


// const initialFilter = useMemo(() => {
//     if (searchText) {
//       const field = "productName";
//       return [field, "contains", searchText]; 
//     }
//     return undefined; 
//   }, [searchText]);
// Set the initial filter for server-side filtering (only for the first load)
  const initialFilter = useMemo(() => {
    if (searchText && isInitialLoad) {
      const field = "productName";
      return [field, "contains", searchText];
    }
    return undefined;
  }, [searchText, isInitialLoad]);

  // Set the FilterRow input field for the productName column and manage filter state
  useEffect(() => {
    if (modalGridRef.current && searchText) {
      const gridInstance = modalGridRef.current.instance();

      // Temporarily disable filter application to avoid extra API calls
      gridInstance.option("filterRow.applyFilter", "onClick");

      // Set the FilterRow input field to display searchText
      gridInstance.columnOption("productName", "filterValue", searchText);
      gridInstance.columnOption("productName", "selectedFilterOperation", "contains");

      // Re-enable filter application
      gridInstance.option("filterRow.applyFilter", "auto");

      // Mark the initial load as complete to clear the filterValue prop
      setIsInitialLoad(false);
    }
  }, [searchText]);
const columns: DevGridColumn[] = useMemo(() => [
  {
    dataField: "productCode",
    caption: t("product_code"),
    dataType: "string",
    width: 100,
    allowFiltering: false,
  },
  {
    dataField: "productID",
    caption: t("productID"),
    dataType: "number",
    visible: false,
    allowFiltering: false,
  },
  {
    dataField: "productName",
    caption: t("ProductName"),
    dataType: "string",
    minWidth: 150,
    allowFiltering: true,
    selectedFilterOperation: "startswith",
  },
], [t]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-1 gap-3">
        
          <ErpDevGrid
                          columns={columns}
                          gridHeader={"Item Search"}
                          dataUrl={`${popupSearchUrl}/${1}`}
                          gridId="grd_acc_group"
                          gridAddButtonType="popup"
                          reload={true}
                          gridAddButtonIcon="ri-add-line"
                          
                        />
            {/* <ErpDevGrid
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
            </DataGrid> */}
          </div>
     
        </div>
      </div>


    </Fragment>
  );
};

export default ProductModalGrid;