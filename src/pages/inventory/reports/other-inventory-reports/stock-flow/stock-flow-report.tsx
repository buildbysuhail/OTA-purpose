import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import ErpDevGrid, {
  DrillDownCellTemplate,
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useMemo, useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import StockFlowReportFilter, {
  StockFlowReportFilterInitialState,
} from "./stock-flow-report-filter";
import Urls from "../../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import StockSummaryLedgerReport from "../stock-summary-report/stock-summary-ledger-report";

const StockFlowReport = () => {
  const { t } = useTranslation("accountsReport");
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const [filter, setFilter] = useState<any>(StockFlowReportFilterInitialState);
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 130,
        showInPdf: true,
        groupIndex: 0,
      },
      {
        dataField: "productCode",
        caption: t("code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 75,
      },
      {
        dataField: "productName",
        caption: t("product"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 130,
        showInPdf: true,
        cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
          if (exportCell !== undefined) {
            const value = cellElement.data?.productName == null ? "0" : cellElement.data.productName.toString();
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return (
              <DrillDownCellTemplate
                data={cellElement}
                field="productName"
              />
            );
          }
        },
      },
      {
        dataField: "opStk",
        caption: t("op_stk"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 60,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.opStk == null
                ? 0
                : getFormattedValue(cellElement.data.opStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.opStk == null
              ? 0
              : getFormattedValue(cellElement.data.opStk);
          }
        },
      },
      {
        dataField: "opVal",
        caption: t("op_val"),
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
              cellElement.data?.opVal == null
                ? 0
                : getFormattedValue(cellElement.data.opVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.opVal == null
              ? 0
              : getFormattedValue(cellElement.data.opVal);
          }
        },
      },
      {
        dataField: "piStk",
        caption: t("pi_stk"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 60,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.piStk == null
                ? 0
                : getFormattedValue(cellElement.data.piStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.piStk == null
              ? 0
              : getFormattedValue(cellElement.data.piStk);
          }
        },
      },
      {
        dataField: "piVal",
        caption: t("pi_val"),
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
              cellElement.data?.piVal == null
                ? 0
                : getFormattedValue(cellElement.data.piVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.piVal == null
              ? 0
              : getFormattedValue(cellElement.data.piVal);
          }
        },
      },
      {
        dataField: "srStk",
        caption: t("sr_stk"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 60,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.srStk == null
                ? 0
                : getFormattedValue(cellElement.data.srStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.srStk == null
              ? 0
              : getFormattedValue(cellElement.data.srStk);
          }
        },
      },
      {
        dataField: "srVal",
        caption: t("sr_val"),
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
              cellElement.data?.srVal == null
                ? 0
                : getFormattedValue(cellElement.data.srVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.srVal == null
              ? 0
              : getFormattedValue(cellElement.data.srVal);
          }
        },
      },
      {
        dataField: "siStk",
        caption: t("si_stk"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 60,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.siStk == null
                ? 0
                : getFormattedValue(cellElement.data.siStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.siStk == null
              ? 0
              : getFormattedValue(cellElement.data.siStk);
          }
        },
      },
      {
        dataField: "siVal",
        caption: t("si_val"),
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
              cellElement.data?.siVal == null
                ? 0
                : getFormattedValue(cellElement.data.siVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.siVal == null
              ? 0
              : getFormattedValue(cellElement.data.siVal);
          }
        },
      },
      {
        dataField: "prStk",
        caption: t("pr_stk"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 60,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.prStk == null
                ? 0
                : getFormattedValue(cellElement.data.prStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.prStk == null
              ? 0
              : getFormattedValue(cellElement.data.prStk);
          }
        },
      },
      {
        dataField: "prVal",
        caption: t("pr_val"),
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
              cellElement.data?.prVal == null
                ? 0
                : getFormattedValue(cellElement.data.prVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.prVal == null
              ? 0
              : getFormattedValue(cellElement.data.prVal);
          }
        },
      },
      {
        dataField: "clStk",
        caption: t("cl_stk"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 60,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.clStk == null
                ? 0
                : getFormattedValue(cellElement.data.clStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.clStk == null
              ? 0
              : getFormattedValue(cellElement.data.clStk);
          }
        },
      },
      {
        dataField: "clVal",
        caption: t("cl_val"),
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
              cellElement.data?.clVal == null
                ? 0
                : getFormattedValue(cellElement.data.clVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.clVal == null
              ? 0
              : getFormattedValue(cellElement.data.clVal);
          }
        },
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        visible: false,
        width: 100,
      },
      {
        dataField: "warehouse",
        caption: t("warehouse"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
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
        dataField: "stInStk",
        caption: t("st_in_stk"),
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
              cellElement.data?.stInStk == null
                ? 0
                : getFormattedValue(cellElement.data.stInStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stInStk == null
              ? 0
              : getFormattedValue(cellElement.data.stInStk);
          }
        },
      },
      {
        dataField: "stInVal",
        caption: t("st_in_val"),
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
              cellElement.data?.stInVal == null
                ? 0
                : getFormattedValue(cellElement.data.stInVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stInVal == null
              ? 0
              : getFormattedValue(cellElement.data.stInVal);
          }
        },
      },
      {
        dataField: "stOutStk",
        caption: t("st_out_stk"),
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
              cellElement.data?.stOutStk == null
                ? 0
                : getFormattedValue(cellElement.data.stOutStk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stOutStk == null
              ? 0
              : getFormattedValue(cellElement.data.stOutStk);
          }
        },
      },
      {
        dataField: "stOutVal",
        caption: t("st_out_val"),
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
              cellElement.data?.stOutVal == null
                ? 0
                : getFormattedValue(cellElement.data.stOutVal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stOutVal == null
              ? 0
              : getFormattedValue(cellElement.data.stOutVal);
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
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "sectionName",
        caption: t("section"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "expiryDate",
        caption: t("expiry_date"),
        dataType: "date",
        format:"dd-MMM-yyyy",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "adjstk",
        caption: t("adj_stk"),
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
              cellElement.data?.adjstk == null
                ? 0
                : getFormattedValue(cellElement.data.adjstk);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.adjstk == null
              ? 0
              : getFormattedValue(cellElement.data.adjstk);
          }
        },
      },
      {
        dataField: "adjval",
        caption: t("adj_val"),
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
              cellElement.data?.adjval == null
                ? 0
                : getFormattedValue(cellElement.data.adjval);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.adjval == null
              ? 0
              : getFormattedValue(cellElement.data.adjval);
          }
        },
      },
    ];
    return baseColumns.filter((column) => {
      if (
        column.dataField == "expiryDate"
      ) {
        return !clientSession.isAppGlobal;
      }
      if (
        column.dataField == "adjstk"||
        column.dataField == "adjval"
      ) {
        return clientSession.isAppGlobal;
      }
      return true;
    });
  }, [t, clientSession.isAppGlobal]);
  const customizeSummaryTotal = (itemInfo: any) => `Net Total`;
  const customizeSummaryGroup = (itemInfo: any) => `Sub Total`;
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

  const summaryItems: SummaryConfig[] = [
    {
      column: "productName",
      summaryType: "max",
      customizeText: customizeSummaryTotal,
    },
    {
      column: "opStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "opVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "piStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "piVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "srStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "srVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "siStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "siVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "prStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "prVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "clStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "clVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stInStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stInVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stOutStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stOutVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "adjstk",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "adjval",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "productName",
      summaryType: "max",
      isGroupItem: true,
      showInGroupFooter: true,
      customizeText: customizeSummaryGroup,
    },
    {
      column: "opStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "opVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "piStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "piVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "srStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "srVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "siStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "siVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "prStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "prVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "clStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "clVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "stInStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "stInVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "stOutStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "stOutVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "adjstk",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
    {
      column: "adjval",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      isGroupItem: true,
      showInGroupFooter: true,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                filterText="{dateFrom} To {dateTo}
                 {productID > 0 && ,   Product : [product]} 
                {counterID > 0 && ,  Group Name :[productGroup]}"
                columns={columns}
                gridHeader={t("stock_flow_report")}
                dataUrl={Urls.stock_flow_report}
                hideGridAddButton={true}
                allowGrouping={true}
                autoExpandAll={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<StockFlowReportFilter />}
                filterWidth={790}
                filterHeight={240}
                onFilterChanged={(filter: any) => {
                  setFilter(filter);
                }}
                filterInitialData={StockFlowReportFilterInitialState}
                reload={true}
                gridId="grd_stock_flow_report"
                childPopupProps={{
                  content: <StockSummaryLedgerReport />,
                  title: "Stock Ledger Report",
                  isForm: false,
                  width: 1000,
                  drillDownCells: "productName",
                  bodyProps: "productID,productName",
                  enableFn: (data: any) => data?.productID != 0,
                  origin: "stockflow",
                }}
                postData={{
                  ...filter,
                  fromDate: filter.dateFrom,
                  toDate: filter.dateTo,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default StockFlowReport;
