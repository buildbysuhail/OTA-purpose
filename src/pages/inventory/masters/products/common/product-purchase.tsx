import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { FormField } from "../../../../../utilities/form-types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

const PurchaseCommon: React.FC<{
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ getFieldProps }) => {
  const { t } = useTranslation("inventory");
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "voucherNumber",
        caption: t("voucher_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        // width: 100,
      },
      {
        dataField: "voucherPrefix",
        caption: t("voucher_prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        // width: 100,
      },
      {
        dataField: "transactionDate",
        caption: t("transaction_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        format: "dd-MMM-yyyy",
      },
      {
        dataField: "partyName",
        caption: t("party_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unitPrice",
        caption: t("unit_price"),
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
              cellElement.data?.unitPrice == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.unitPrice),
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
            return cellElement.data?.unitPrice == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.unitPrice),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "netAmount",
        caption: t("net_amount"),
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
              cellElement.data?.netAmount == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.netAmount),
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
            return cellElement.data?.netAmount == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.netAmount),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "quantity",
        caption: t("quantity"),
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
              cellElement.data?.quantity == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.quantity),
                    false,
                    2
                  );
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.quantity == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.quantity),
                  false,
                  2
                );
          }
        },
      },
      {
        dataField: "unitName",
        caption: t("unit_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
    ],
    [t]
  );
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0"; // Ensure "0" is displayed when value is missing
      }
      return getFormattedValue(value, false, 2) || "0"; // Ensure formatted output or fallback to "0"
    };
  }, []);

  //   const summaryItems: SummaryConfig[] = [
  //     {
  //       column: "partyName",
  //       summaryType: "custom",
  //       valueFormat: "string",
  //       displayFormat: "TOTAL",
  //     },
  //     {
  //       column: "netAmount",
  //       summaryType: "sum",
  //       valueFormat: "currency",
  //       customizeText: customizeSummaryRow,
  //     },
  //     {
  //       column: "quantity",
  //       summaryType: "sum",
  //       valueFormat: "currency",
  //       customizeText: customizeSummaryRow,
  //     },
  //   ];

  return (
    <div className="grid grid-cols-1 gap-3">
      <ErpDevGrid
        // summaryItems={summaryItems}
        // remoteOperations={{
        //     filtering: true,
        //     paging: true,
        //     sorting: true,
        //     summary: false,
        //   }}
        columns={columns}
        gridHeader={t("purchase")}
        dataUrl={`${Urls.products}SelectProductPurchaseSummary`}
        method={ActionType.POST}
        postData={{ productID: getFieldProps("batch.productID").value }}
        gridId="grd_purchaseGcc"
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

export default PurchaseCommon;
