import React, { useEffect, useMemo, useState } from "react";
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
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

const StockCommon: React.FC<{
  isMaximized?: boolean;
    modalHeight?: any
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
}> = React.memo(({ formState, handleFieldChange, getFieldProps,isMaximized,modalHeight }) => {
  const { t } = useTranslation("inventory");
  const [showGrid, setShowGrid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getFormattedValue } = useNumberFormat();
    const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });
        useEffect(() => {
          let gridHeightMobile = modalHeight - 500;
          let gridHeightWindows = modalHeight - 500;
          setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
        }, [isMaximized, modalHeight]);
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
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        format: "dd-MMM-yyyy"
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
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.inwardQty == null
                ? ""
                : getFormattedValue(
                  Number.parseFloat(cellElement.data.inwardQty),
                  false,
                  4
                );
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.inwardQty == null
              ? ""
              : getFormattedValue(
                Number.parseFloat(cellElement.data.inwardQty),
                false,
                4
              );
          }
        },
      },
      {
        dataField: "outwardQty",
        caption: t("outward_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.outwardQty == null
                ? ""
                : getFormattedValue(
                  Number.parseFloat(cellElement.data.outwardQty),
                  false,
                  4
                );
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.outwardQty == null
              ? ""
              : getFormattedValue(
                Number.parseFloat(cellElement.data.outwardQty),
                false,
                4
              );
          }
        },
      },
      {
        dataField: "balance",
        caption: t("balance"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.balance == null
                ? ""
                : getFormattedValue(
                  Number.parseFloat(cellElement.data.balance),
                  false,
                  4
                );
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.balance == null
              ? ""
              : getFormattedValue(
                Number.parseFloat(cellElement.data.balance),
                false,
                4
              );
          }
        },
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
        caption: t("stock"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "stockDetails",
        caption: t("stock_details"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "warehouseID",
        caption: t("warehouse_id"),
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
            title={t("show")}
            variant="primary"
            onClick={handleShowClick}
          />
          <ERPButton
            title={t("wh/w")}
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
          heightToAdjustOnWindowsInModal={gridHeight.windows}
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
        title={t("warehouse_details")}
        height={450}
        width={800}
        content={
          <ErpDevGrid
            columns={modalColumns}
            gridHeader={t("warehouse_details")}
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
