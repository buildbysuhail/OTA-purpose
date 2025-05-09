import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";
import { FormField } from "../../../../../utilities/form-types";
import { ActionType } from "../../../../../redux/types";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { productDto } from "../products-type";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";

const StockCommon: React.FC<{
  formState: any;
  handleFieldChange: (
    fields:
      | string
      | {
        [fieldId: string]: any;
      },
    value?: any
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ formState, handleFieldChange, getFieldProps }) => {
  const { t } = useTranslation("inventory");
  const [showGrid, setShowGrid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "siNo",
        caption: t("si_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "transactionDate",
        caption: t("date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "partyName",
        caption: t("particulars"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherType",
        caption: t("voucher_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherForm",
        caption: t("form"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherNumber",
        caption: t("voucher_no"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "inwardQty",
        caption: t("inward_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "outwardQty",
        caption: t("outward_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "balance",
        caption: t("balance"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit",
        caption: t("unit"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherPrefix",
        caption: t("prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
    ], [t]
  );

  const modalColumns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "warehouseName",
        caption: t("warehouse_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "stock",
        caption: "stock",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "stockDetails",
        caption: "stock_details",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "warehouseID",
        caption: "warehouse_id",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
    ], []
  );

  const handleShowClick = () => {
    setShowGrid(true);
  };

  const handleWhWClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = (reload: boolean) => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-2">
          <ERPCheckbox
            {...getFieldProps("product.warehouse")}
            label={t("warehouse")}
            onChange={(e) => handleFieldChange('product.warehouse', e.target.checked)}
          />
          <ERPDataCombobox
            {...getFieldProps("batch.warehouseID")}
            id="warehouseID"
            field={{
              id: "warehouseID",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_warehouse
            }}
            onChangeData={(data: productDto) =>
              handleFieldChange("batch.warehouseID", data.batch.warehouseID)
            }
            noLabel={true}
            className="flex-2 min-w-[200px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <ERPButton
            title="show"
            variant="primary"
            onClick={handleShowClick}
          />
          <ERPButton
            title="wh/w"
            variant="secondary"
            onClick={handleWhWClick}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <ErpDevGrid
          columns={columns}
          gridHeader={t("stock")}
          dataUrl={`${Urls.products}SelectItemStockSummary`}
          method={ActionType.POST}
          postData={{ productBatchID: getFieldProps("batch.productBatchID").value }}
          gridId="grd_stock"
          heightToAdjustOnWindows={800}
          hideDefaultExportButton={true}
          hideDefaultSearchPanel={true}
          hideGridAddButton={true}
          hideGridHeader={true}
          enableScrollButton={false}
          ShowGridPreferenceChooser={false}
          showPrintButton={false}
          allowSearching={false}
          allowExport={false}
        />
      </div>
      <ERPModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Warehouse Details"
        height={450}
        width={800}
        content={
          <ErpDevGrid
            columns={modalColumns}
            gridHeader="Warehouse Details"
            dataUrl={`${Urls.products}SelectWarehouseDetails`} // Adjust the URL as needed
            method={ActionType.POST}
            postData={{ productBatchID: getFieldProps("batch.productBatchID").value }}
            gridId="grd_warehouse"
            heightToAdjustOnWindows={600}
            // hideDefaultExportButton={true}
            // hideDefaultSearchPanel={true}
            hideGridAddButton={true}
            hideGridHeader={true}
            // enableScrollButton={false}
            // ShowGridPreferenceChooser={false}
            // showPrintButton={false}
            // allowSearching={false}
            // allowExport={false}
          />
        }
      />
    </>
  );
});

export default StockCommon;
