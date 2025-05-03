import React, { Fragment, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { ProductSummaryFilter } from "./product-summary-master";

interface ProductSummaryReportByTransaction {
  vNo: string;
  vPrefix: string;
  voucherType: string;
  voucherForm: string;
  date: string;
  ledgerName: string;
  partyName: string;
  address1: string;
  quantity: number;
  unitName: string;
  unitPrice: number;
  grossValue: number;
  rateWithTax: number;
  netValue: number;
  totalVatAmount: number;
  netAmount: number;
}

const ProductSummaryReportByTransaction: React.FC<{ filter: ProductSummaryFilter; setFilter: React.Dispatch<React.SetStateAction<any>>; onReloadChange: () => void; reloadBase: boolean; voucherType: string }> = ({ filter, setFilter, onReloadChange, reloadBase, voucherType }) => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "vNo",
        caption: t("voucher_no"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 60,
      },
      {
        dataField: "vPrefix",
        caption: t("v_prefix"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 70,
      },
      {
        dataField: "date",
        caption: t("date"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        width: 75,
        format: "dd-MMM-yyyy"
      },
      {
        dataField: "ledgerName",
        caption: t("ledger_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 75,
      },
      {
        dataField: "partyName",
        caption: t("party_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
      },
      {
        dataField: "address1",
        caption: t("address1"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
      },
      {
        dataField: "voucherForm",
        caption: t("voucher_form"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 75,
      },
      {
        dataField: "quantity",
        caption: t("quantity"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 48,
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
                : getFormattedValue(cellElement.data.quantity, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.quantity == null
              ? ""
              : getFormattedValue(cellElement.data.quantity, false, 4);
          }
        },
      },
      {
        dataField: "unitName",
        caption: t("unit_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 50,
      },
      {
        dataField: "unitPrice",
        caption: t("unit_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 60,
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
                : getFormattedValue(cellElement.data.unitPrice, false, 3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.unitPrice == null
              ? ""
              : getFormattedValue(cellElement.data.unitPrice, false, 3);
          }
        },
      },
      {
        dataField: "grossValue",
        caption: t("gross_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.grossValue == null
                ? ""
                : getFormattedValue(cellElement.data.grossValue, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.grossValue == null
              ? ""
              : getFormattedValue(cellElement.data.grossValue, false, 4);
          }
        },
      },
      {
        dataField: "rateWithTax",
        caption: t("rate_with_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.rateWithTax == null
                ? ""
                : getFormattedValue(cellElement.data.rateWithTax, false, 3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.rateWithTax == null
              ? ""
              : getFormattedValue(cellElement.data.rateWithTax, false, 3);
          }
        },
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.netValue == null
                ? ""
                : getFormattedValue(cellElement.data.netValue, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netValue == null
              ? ""
              : getFormattedValue(cellElement.data.netValue, false, 4);
          }
        },
      },
      {
        dataField: "totalVatAmount",
        caption: t("total_vat_amount"),
        dataType: "number",
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
              cellElement.data?.totalVatAmount == null
                ? ""
                : getFormattedValue(cellElement.data.totalVatAmount, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalVatAmount == null
              ? ""
              : getFormattedValue(cellElement.data.totalVatAmount, false, 4);
          }
        },
      },
      {
        dataField: "netAmount",
        caption: t("net_amount"),
        dataType: "number",
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
                : getFormattedValue(cellElement.data.netAmount, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netAmount == null
              ? ""
              : getFormattedValue(cellElement.data.netAmount, false, 4);
          }
        },
      },
      //not seen in time of OT
      {
        dataField: "xRate",
        caption: t("x_rate"),
        dataType: "number",
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
              cellElement.data?.xRate == null
                ? ""
                : getFormattedValue(cellElement.data.xRate, false, 6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.xRate == null
              ? ""
              : getFormattedValue(cellElement.data.xRate, false, 6);
          }
        },
      },
      //only seen in time of OT
      {
        dataField: "voucherType",
        caption: t("voucher_type"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      }];
    return baseColumns
      .filter((column) => {
        if (column.dataField == "voucherType") {
          return voucherType == "OT";
        }
        if (column.dataField == "xRate") {
          return voucherType !== "OT";
        }

        return true;
      })
    // .map((column) => {
    //   if (column.dataField == "uPI" && !clientSession.isAppGlobal) {
    //     return {
    //       ...column,
    //       caption: "QRPay",
    //     };
    //   }
    //   return column;
    // });
  }, [t, filter]);
  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = (itemInfo: { value: any }) => {
    const value = itemInfo.value;
    if (value === null || value === undefined || value === "" || isNaN(value)) {
      return "0";
    }
    return getFormattedValue(value, false, 2) || "0";
  };
  const summaryItems: SummaryConfig[] = [
    {
      column: "ledgerName",
      summaryType: "custom",
    },
    {
      column: "quantity",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "netValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "netAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: true, paging: false, sorting: true, summary: true }}
                columns={columns}
                gridHeader={t("product_summary_report_by_transaction")}
                dataUrl={Urls.product_summary_transaction}
                method={ActionType.POST}
                gridId="grd_product_summary_report_by_transaction"
                hideGridAddButton={true}
                postData={{ ...filter.filter, voucherType: voucherType }}
                // filterHeight={270}
                // filterWidth={600}
                reload={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductSummaryReportByTransaction;