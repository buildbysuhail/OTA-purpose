import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import ItemWiseGroupedBrandwiseSalesFilter, {
  ItemWiseGroupedBrandwiseSalesFilterInitialState,
} from "./itemwise-grouped-brandwise-sales-filter";
import { erpParseFloat } from "../../../../../utilities/Utils";

const ItemWiseGroupedBrandwiseSales = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "warehouse",
      caption: t("warehouse"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },

    {
      dataField: "pCode",
      caption: t("p_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "partyType",
      caption: t("party_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "route",
      caption: t("route"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
      format: "dd-MMM-yyyy",
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "year",
      caption: t("year"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
      showInPdf: true,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.qty == null
              ? ""
              : getFormattedValue(cellElement.data.qty, false, 3);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.qty == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.qty), false, 3);
        }
      },
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
      showInPdf: true,
    },
    {
      dataField: "unitPrice",
      caption: t("unit_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
      showInPdf: true,
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
              : getFormattedValue(cellElement.data.unitPrice, false, 2);
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
                parseFloat(cellElement.data.unitPrice),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "total",
      caption: t("total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.total == null
              ? ""
              : getFormattedValue(cellElement.data.total, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.total == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.total), false, 4);
        }
      },
    },
    {
      dataField: "salesMan",
      caption: t("sales_man"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "stdPurchasePrice",
      caption: t("std_purchase_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stdPurchasePrice == null
              ? ""
              : getFormattedValue(cellElement.data.stdPurchasePrice, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stdPurchasePrice == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.stdPurchasePrice),
                false,
                2
              );
        }
      },
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);
  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "route",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "total",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "qty",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value, false, 3));
      },
    },
    {
      column: "unitPrice",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value, false, 2));
      },
    },
    {
      column: "stdPurchasePrice",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value, false, 2));
      },
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                filterText=": {fromDate} - {toDate}"
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                gridHeader={t("grouped_brandwise_sales_summary")}
                dataUrl={Urls.itemwise_grouped_brandwise_sales}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<ItemWiseGroupedBrandwiseSalesFilter />}
                filterWidth={365}
                filterHeight={200}
                filterInitialData={
                  ItemWiseGroupedBrandwiseSalesFilterInitialState
                }
                reload={true}
                gridId="grd_grouped_brandwise_sales_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ItemWiseGroupedBrandwiseSales;
