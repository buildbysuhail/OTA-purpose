import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid, { SummaryConfig } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { FormField } from "../../../../../utilities/form-types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import moment from "moment";

const SalesCommon: React.FC<{
    getFieldProps: (fieldId: string, type?: string) => FormField;
      isMaximized?: boolean;
    modalHeight?: any
    isGlobal?: boolean
}> = React.memo(({ getFieldProps,isMaximized,modalHeight,isGlobal }) => {
    const { t } = useTranslation('inventory');
     const { getFormattedValue } = useNumberFormat();
   const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });
      useEffect(() => {
        let gridHeightMobile = modalHeight - 500;
        let gridHeightWindows = modalHeight - (isGlobal?500:300);
        setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
      }, [isMaximized, modalHeight]);

    const columns: DevGridColumn[] = useMemo(() => [
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
            dataType: "date",
            allowSorting: true,
            allowSearch: true,
            format:"dd-MMM-yyyy"
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
    ], [t]);
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
                columns={columns}
                gridHeader={t("sales")}
                dataUrl={`${Urls.products}SelectProductSalesSummary`}
                method={ActionType.POST}
                postData={{ productID: getFieldProps("batch.productID").value }}
                gridId="grd_salesGcc"
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
    );
});

export default SalesCommon;
