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
  searchCriteria: string;
    searchText: string;
    voucherType: string;
    warehouseId: number;
    inSearch: boolean;
    popupSearchUrl: string;
}

const ProductModalGrid = ({ modalHeight, isMaximized,
    searchCriteria,
    searchText,
    voucherType,
    warehouseId,
    inSearch,
  popupSearchUrl}: ProductModalGridProps) => {
const { t } = useTranslation('inventory');

  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 120;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);



const columns: DevGridColumn[] = useMemo(() => [
  {
    dataField: "productCode",
    caption: t("product_code"),
    dataType: "string",
    width: 100,
    allowFiltering: true,
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
             hideGridAddButton={true}
             enableScrollButton={false}
            columns={columns}
            heightToAdjustOnWindowsInModal={gridHeight.windows}
            gridHeader={"Item Search"}
            dataUrl={`${popupSearchUrl}/${1}`}
            gridId="grd_acc_group"
            gridAddButtonType="popup"
            reload={true}
            gridAddButtonIcon="ri-add-line"
            selectionMode="multiple"
            initialFilters={
              [
                {
                  field: "productCode",
                  value: searchCriteria=="pCode" ?searchText:"",
                  operation: "startswith",
                  initialFocus: searchCriteria=="pCode" ? true : false,
                },
                {
                  field: "productName",
                  value: searchCriteria=="product" ? searchText:"",
                  operation: "startswith",
                  initialFocus: searchCriteria=="product" ? true : false,
                }
             ]
            }
          />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductModalGrid;