import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { FC, useEffect, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import NetSalesReportFilter, {
  NetSalesReportFilterInitialState,
} from "./net-sales-filter";
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

interface NetSalesProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}

const NetSalesReport: FC<NetSalesProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<any>(NetSalesReportFilterInitialState);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "slNo",
        caption: t("SiNo"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 50,
        showInPdf: true,
      },
      {
        dataField: "vNo",
        caption: t("v_no"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "transDate",
        caption: t("trans_date"),
        dataType: "date",
        format: "dd-MMM-yyyy",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 110,
        showInPdf: true,
      },
      {
        dataField: "party",
        caption: t("party"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 184,
        showInPdf: true,
      },
      {
        dataField: "vType",
        caption: t("v_type"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "salesAmt",
        caption: t("sales_amt"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.salesAmt == null
                ? 0
                : getFormattedValue(cellElement.data.salesAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesAmt == null
              ? 0
              : getFormattedValue(cellElement.data.salesAmt);
          }
        },
      },
      {
        dataField: "cashAmt",
        caption: t("cash_amt"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cashAmt == null
                ? 0
                : getFormattedValue(cellElement.data.cashAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cashAmt == null
              ? 0
              : getFormattedValue(cellElement.data.cashAmt);
          }
        },
      },
      {
        dataField: "creditAmt",
        caption: t("credit_amt"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.creditAmt == null
                ? 0
                : getFormattedValue(cellElement.data.creditAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.creditAmt == null
              ? 0
              : getFormattedValue(cellElement.data.creditAmt);
          }
        },
      },
      {
        dataField: "bankAmt",
        caption: t("bank_amt"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 110,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.bankAmt == null
                ? 0
                : getFormattedValue(cellElement.data.bankAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.bankAmt == null
              ? 0
              : getFormattedValue(cellElement.data.bankAmt);
          }
        },
      },
      {
        dataField: "saleReturnAmt",
        caption: t("sale_return_amt"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 110,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.saleReturnAmt == null
                ? 0
                : getFormattedValue(cellElement.data.saleReturnAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.saleReturnAmt == null
              ? 0
              : getFormattedValue(cellElement.data.saleReturnAmt);
          }
        },
      },
      {
        dataField: "balance",
        caption: t("balance"),
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
              cellElement.data?.balance == null
                ? 0
                : getFormattedValue(cellElement.data.balance);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.balance == null
              ? 0
              : getFormattedValue(cellElement.data.balance);
          }
        },
      },
      {
        dataField: "couponAmt",
        caption: t("coupon_amt"),
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
              cellElement.data?.couponAmt == null
                ? 0
                : getFormattedValue(cellElement.data.couponAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.couponAmt == null
              ? 0
              : getFormattedValue(cellElement.data.couponAmt);
          }
        },
      },
      // {
      //   dataField: "createdDate",
      //   caption: t("created_date"),
      //   dataType: "date",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   allowSorting: true,
      //   width: 100,
      // },
      {
        dataField: "grossValue",
        caption: t("gross_value"),
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
              cellElement.data?.grossValue == null
                ? 0
                : getFormattedValue(cellElement.data.grossValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.grossValue == null
              ? 0
              : getFormattedValue(cellElement.data.grossValue);
          }
        },
      },
      {
        dataField: "vatAmount",
        caption: t("vat_amount"),
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
              cellElement.data?.vatAmount == null
                ? 0
                : getFormattedValue(cellElement.data.vatAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.vatAmount == null
              ? 0
              : getFormattedValue(cellElement.data.vatAmount);
          }
        },
      },
      {
        dataField: "netSales",
        caption: t("net_sales"),
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
              cellElement.data?.netSales == null
                ? 0
                : getFormattedValue(cellElement.data.netSales);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netSales == null
              ? 0
              : getFormattedValue(cellElement.data.netSales);
          }
        },
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "datetime",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 184,
        format: "dd-MMM-yyyy hh:mm a",
        showInPdf: true,
      },
    ];
    // Filter columns based on the `visible` property
    return baseColumns.filter((column) => {
      if (
        column.dataField == "slNo" ||
        column.dataField == "vNo" ||
        column.dataField == "transDate"
      ) {
        return filter.groupByParty == false;
      }
      if (column.dataField == "createdDate") {
        return (
          location.pathname.includes("inventory/net_sales_transfer_report") &&
          filter.groupByParty==false
        );
      }
      if (
        column.dataField == "grossValue" ||
        column.dataField == "vatAmount" ||
        column.dataField == "netSales"
      ) {
        return location.pathname.includes("inventory/net_sales_report");
      }
      return true;
    });
  }, [t, filter]);

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
  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = useMemo(() => {
    const _summaryItems: SummaryConfig[] = [
      {
        column: "party",
        summaryType: "max",
        customizeText: customizeTotal,
      },
      {
        column: "salesAmt",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cashAmt",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "creditAmt",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "bankAmt",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "saleReturnAmt",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "balance",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "couponAmt",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "grossValue",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "vatAmount",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "netSales",
        summaryType: "custom",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
    ];

    return _summaryItems.filter((column) => {
      if (
        column.column == "grossValue" ||
        column.column == "vatAmount" ||
        column.column == "netSales"
      ) {
        return clientSession.isAppGlobal == false;
      }
      return true;
    });
  }, [clientSession]);
  const locationn = useLocation();
  const [key, setKey] = useState(1);

  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [locationn]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                key={key}
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: true,
                  paging: true,
                  sorting: false,
                  summary: false,
                }}
                filterText="{salesRouteID > 0 && Route Name :  [salesRoute]} {salesmanID > 0 && , Sales Man : [salesman]} From Date : {dateFrom} To Date : {dateTo}"
                columns={columns}
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<NetSalesReportFilter />}
                onFilterChanged={(filter: any) => {
                  setFilter(filter);
                }}
                filterWidth={790}
                filterHeight={270}
                filterInitialData={NetSalesReportFilterInitialState}
                reload={true}
                gridId={gridId}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NetSalesReport;
