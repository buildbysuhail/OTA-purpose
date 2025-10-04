import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../helpers/api-client";
import ErpDevGrid from "../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../types/dev-grid-column";
import { useDispatch } from "react-redux";
import { generateUniqueKey } from "../../utilities/Utils";
import ERPCheckbox from "./erp-checkbox";
import Urls from "../../redux/urls";
import { formStateHandleFieldChange, formStateHandleFieldChangeKeysOnly } from "../../pages/inventory/transactions/reducer";
import { TransactionDetail } from "../../pages/inventory/transactions/transaction-types";

const isNotEmpty = (value: any) => value !== undefined && value !== null && value !== "";
const api = new APIClient();

// ----------------------------------------------------------------------------
// Memoized Checkboxes
// ----------------------------------------------------------------------------
interface RelatedInfoCheckboxesProps {
  relatedInfo: {
    showStockDetails: boolean;
    allWarehouseProducts: boolean;
  };
  onChange: (key: any, val: boolean) => void;
}

const RelatedInfoCheckboxes = React.memo<RelatedInfoCheckboxesProps>(
  ({ relatedInfo, onChange }) => {
    const { t } = useTranslation("inventory");
    return (
      <div className="flex items-center justify-start gap-4 mb-2">
        <ERPCheckbox
          id="showStockDetails"
          label={t("show_stock_details")}
          checked={relatedInfo.showStockDetails}
          onChange={e => onChange("showStockDetails", e.target.checked)}
        />
        <ERPCheckbox
          id="allWarehouseProducts"
          label={t("all_warehouse_products")}
          checked={relatedInfo.allWarehouseProducts}
          onChange={e => onChange("allWarehouseProducts", e.target.checked)}
        />
      </div>
    );
  }
);


// ----------------------------------------------------------------------------
// Memoized Grid Container
// ----------------------------------------------------------------------------
interface GridContainerProps {
  columns: DevGridColumn[];
  gridHeight: number;
  popupSearchUrl: string;
  warehouseId: number;
  searchCriteria: string;
  searchText: string;
  gridRef: React.Ref<any>;
  handleEnter: (e: any) => void;
  searchColumn: keyof TransactionDetail;
  rowIndex: number;
  onNextCellFind?: (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]) => void;
  onClose?: () => void;
}
const GridContainer = React.memo(({
  columns,
  gridHeight,
  popupSearchUrl,
  warehouseId,
  searchCriteria,
  searchText,
  gridRef,
  handleEnter,
}: GridContainerProps) => {


  return (
    <ErpDevGrid
      ref={gridRef}
      hideGridAddButton
      enableScrollButton={false}
      pageSize={30}
      columns={columns}
      heightToAdjustOnWindowsInModal={gridHeight}
      dataUrl={`${popupSearchUrl}/${warehouseId}/true/true`}
      gridId="grd_acc_group"
      gridAddButtonType="popup"
      reload
      gridAddButtonIcon="ri-add-line"
      selectionMode="multiple"
      onKeyDown={handleEnter}
      initialFilters={
        searchCriteria == "pCode"
          ? [
            {
              field: "productCode",
              value: searchCriteria == "pCode" ? searchText : "",
              operation: "startswith",
              initialFocus: searchCriteria == "pCode" ? true : false,
            },
          ] : [
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
  );
});



interface ProductModalGridProps {
  isMaximized?: boolean;
  modalHeight?: any;
  searchCriteria: string;
  searchText: string;
  voucherType: string;
  userConfig: any;
  warehouseId: number;
  inSearch: boolean;
  transactionType: string;
  popupSearchUrl: string;
  searchColumn: keyof TransactionDetail;
  rowIndex: number;
  onClose?: () => void;
  onNextCellFind?: (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]) => void;
}

const ProductModalGrid = ({
  modalHeight,
  isMaximized,
  searchCriteria,
  searchText,
  voucherType,
  warehouseId,
  inSearch,
  userConfig,
  transactionType,
  searchColumn,
  rowIndex,
  onClose,
  onNextCellFind,
  popupSearchUrl,
}: ProductModalGridProps) => {
  const { t } = useTranslation("inventory");
  const dispatch = useDispatch();
  const gridRef = useRef<any>(null);

  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });
  const [relatedGridHeight, setRelatedGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });
  // Keep checkbox state here
  const [relatedInfo, setRelatedInfo] = useState({ showStockDetails: true, allWarehouseProducts: false });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 700;
    let gridHeightWindows = modalHeight - 750;
    setRelatedGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = relatedInfo.showStockDetails ? modalHeight - 300 : modalHeight - 160;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight, relatedInfo.showStockDetails]);

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
            rowIndex,
            searchColumn: searchCriteria
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
        caption: t("product_id"),
        dataType: "number",
        visible: false,
        allowFiltering: false,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        minWidth: 150,
        allowFiltering: true,
        selectedFilterOperation: "startswith",
      },
    ], [t]
  );

  const stockDetails: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "warehouseName",
        caption: t("warehouse_name"),
        dataType: "string",
        minWidth: 150,
      },
      {
        dataField: "stockDetails",
        caption: t("stock_details"),
        dataType: "string",
        width: 100,
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        width: 100,
      },
    ], [t]
  );

  const unitPrice: DevGridColumn[] = useMemo(
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
        caption: t("product_id"),
        dataType: "number",
        visible: false,
        allowFiltering: false,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        minWidth: 150,
        allowFiltering: true,
        selectedFilterOperation: "startswith",
      },
    ], [t]
  );

  const handleRelatedInfoChange = useCallback(
    async (key: keyof typeof relatedInfo, value: boolean) => {
      if (key == "allWarehouseProducts") {
        const updatedUserConfig = {
          ...userConfig,
          allWarehouseProducts: value,
        };
        await api.post(`${Urls.inv_transaction_base}${transactionType}/UpdateLocalSettings`, updatedUserConfig);
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: { userConfig: { allWarehouseProducts: value } },
          })
        );
        setRelatedInfo(prev => ({ ...prev, [key]: value }));
      }
      else {
        setRelatedInfo(prev => ({ ...prev, [key]: value }));
      }
    }, []
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <RelatedInfoCheckboxes relatedInfo={{ ...relatedInfo, allWarehouseProducts: userConfig.allWarehouseProducts }} onChange={handleRelatedInfoChange} />
          <div className="grid grid-cols-1 gap-3">
            <GridContainer
              columns={columns}
              gridHeight={gridHeight.windows}
              popupSearchUrl={popupSearchUrl}
              warehouseId={warehouseId}
              searchCriteria={searchCriteria}
              searchText={searchText}
              gridRef={gridRef}
              handleEnter={handleEnterKeyDown}
              searchColumn={searchColumn}
              rowIndex={rowIndex}
              onNextCellFind={onNextCellFind}
              onClose={onClose}
            />

            {relatedInfo.showStockDetails &&
              <div className="flex justify-between items-start gap-5">
                <div className="basis-1/2">
                  <ErpDevGrid
                    hideGridHeader
                    hideGridAddButton
                    hideDefaultExportButton
                    enableScrollButton={false}
                    ShowGridPreferenceChooser={false}
                    showPrintButton={false}
                    showChooserOnGridHead
                    chooserClass="absolute z-10 pointer-events-auto"
                    hideDefaultSearchPanel
                    allowSearching={false}
                    showFilterRow={false}
                    allowExport={false}
                    enablefilter={false}
                    remoteOperations={false}
                    columns={stockDetails}
                    heightToAdjustOnWindowsInModal={relatedGridHeight.windows}
                    gridId="grd_warehouse_products"
                    reload
                    gridAddButtonIcon="ri-add-line"
                    showTotalCount={false}
                  />
                </div>

                <div className="basis-1/2">
                  <ErpDevGrid
                    hideGridHeader
                    hideGridAddButton
                    hideDefaultExportButton
                    enableScrollButton={false}
                    ShowGridPreferenceChooser={false}
                    showPrintButton={false}
                    showChooserOnGridHead
                    chooserClass="absolute z-10 pointer-events-auto"
                    hideDefaultSearchPanel
                    allowSearching={false}
                    showFilterRow={false}
                    allowExport={false}
                    enablefilter={false}
                    remoteOperations={false}
                    columns={stockDetails}
                    heightToAdjustOnWindowsInModal={relatedGridHeight.windows}
                    gridId="grd_stock_details"
                    reload
                    showTotalCount={false}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductModalGrid;
