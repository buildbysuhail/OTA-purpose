import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";
import { FormField } from "../../../../../utilities/form-types";
import { ActionType } from "../../../../../redux/types";
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

  const handleShowClick = () => {
    setShowGrid(true);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <ErpDevGrid
        columns={columns}
        gridHeader={t("stock")}
        dataUrl={`${Urls.products}SelectItemStockSummary`}
        method={ActionType.POST}
        postData={{ productBatchID: getFieldProps("batch.productBatchID").value }}
        gridId="grd_stockGcc"
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
  );
});

export default StockCommon;
