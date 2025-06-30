import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { DataGrid } from "devextreme-react";
import {
  Toolbar,
  Item,
  Editing,
  Column,
  Lookup,
  Scrolling,
  RemoteOperations,
  Paging,
  KeyboardNavigation,
  DataGridTypes,
  FilterRow,
} from "devextreme-react/cjs/data-grid";
import { APIClient } from "../../helpers/api-client";
import ErpDevGrid from "../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../types/dev-grid-column";
import Urls from "../../redux/urls";
import { TransactionDetail } from "../../pages/inventory/transactions/purchase/transaction-types";
import { useDispatch } from "react-redux";
import { formStateHandleFieldChange } from "../../pages/inventory/transactions/purchase/reducer";
import { generateUniqueKey } from "../../utilities/Utils";

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
  searchColumn: keyof TransactionDetail;
  rowIndex: number;
  onClose?: () => void;
  onNextCellFind?: (rowIndex: number, column: string) => void;
}

const ProductModalGrid = ({
  modalHeight,
  isMaximized,
  searchCriteria,
  searchText,
  voucherType,
  warehouseId,
  inSearch,
  searchColumn,
  rowIndex,
  onClose,
  onNextCellFind,
  popupSearchUrl,
}: ProductModalGridProps) => {
  const { t } = useTranslation("inventory");

  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });
  const [selectedRows, setSelectedRows] = useState<TransactionDetail[]>([]);
  const dispatch = useDispatch();
  const gridRef = useRef<any>(null);
  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 120;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  const handleEnterKeyDown = (e: any) => {
    if (e.event.key === "Enter") {
      e.event?.preventDefault();
      const gridInstance = gridRef.current?.instance();
      if (gridInstance) {
        
        const selectedRowsData = gridInstance.getSelectedRowsData();
        if (selectedRowsData.length > 0) {
          const res = {
            items: selectedRowsData,
            key: generateUniqueKey(),
            rowIndex
          };

          dispatch(
            formStateHandleFieldChange({
              fields: { popupSearchSelectionData: JSON.stringify(res) },
            })
          );
          if (onClose) {
            onNextCellFind?.(rowIndex, searchColumn);
            onClose();
          }
        }
      }
    }
  };

  const columns: DevGridColumn[] = useMemo(
    () => [
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
    ],
    [t]
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-1 gap-3">
            <ErpDevGrid
              ref={gridRef}
              hideGridAddButton={true}
              enableScrollButton={false}
              pageSize={30}
              columns={columns}
              heightToAdjustOnWindowsInModal={gridHeight.windows}
              gridHeader={"Item Search"}
              dataUrl={`${popupSearchUrl}/${warehouseId}/${true}/${true}`}
              gridId="grd_acc_group"
              gridAddButtonType="popup"
              reload={true}
              gridAddButtonIcon="ri-add-line"
              selectionMode="multiple"
              onKeyDown={(e: any) => {
                handleEnterKeyDown(e);
              }}
              initialFilters={
                searchCriteria == "pCode"
                  ? [
                      {
                        field: "productCode",
                        value: searchCriteria == "pCode" ? searchText : "",
                        operation: "startswith",
                        initialFocus: searchCriteria == "pCode" ? true : false,
                      },
                    ]
                  : [
                      {
                        field: "productName",
                        value: searchCriteria == "product" ? searchText : "",
                        operation: "startswith",
                        initialFocus:
                          searchCriteria == "product" ? true : false,
                      },
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
