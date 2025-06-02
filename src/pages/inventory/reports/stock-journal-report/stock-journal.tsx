import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { FC, useEffect, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import StockJournalReportFilter, {
  StockJournalReportFilterInitialState,
} from "./stock-journal-filter";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
interface StockJournalSummaryProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const StockJournalReport: FC<StockJournalSummaryProps> = ({
  gridHeader,
  dataUrl,
  gridId,
}) => {
  const { t } = useTranslation("accountsReport");
  const userSession = useSelector((state: RootState) => state.UserSession);
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "date",
        caption: t("date"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 70,
        showInPdf: true,
        format: "dd-MMM-yyyy",
        groupIndex: 0,
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
        dataField: "vType",
        caption: t("v_type"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 70,
        showInPdf: true,
      },
      {
        dataField: "barcode",
        caption: t("barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 80,
        showInPdf: true,
      },
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 80,
      },
      {
        dataField: "productName",
        caption: t("product"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "brandName",
        caption: t("brand_name"),
        dataType: "string",
        width: 100,
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        showInPdf: true,
      },
      {
        dataField: "unitName",
        caption: t("unit"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 80,
        showInPdf: true,
      },
      {
        dataField: "qty",
        caption: t("quantity"),
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
              cellElement.data?.qty == null
                ? ""
                : getFormattedValue(cellElement.data.qty,false,4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.qty == null
              ? ""
              : getFormattedValue(cellElement.data.qty,false,4);
          }
        },
      },
      {
        dataField: "cost",
        caption: t("cost"),
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
              cellElement.data?.cost == null
                ? ""
                : getFormattedValue(cellElement.data.cost,false,3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cost == null
              ? ""
              : getFormattedValue(cellElement.data.cost,false,3);
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
              cellElement.data?.total == null
                ? ""
                : getFormattedValue(cellElement.data.total,false,4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.total == null
              ? ""
              : getFormattedValue(cellElement.data.total,false,4);
          }
        },
      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "fromWarehouse",
        caption: t("from_warehouse"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "toWarehouse",
        caption: t("to_warehouse"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
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
              cellElement.data?.salesPrice == null
                ? ""
                : getFormattedValue(cellElement.data.salesPrice,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesPrice == null
              ? ""
              : getFormattedValue(cellElement.data.salesPrice,false,2);
          }
        },
      },
      {
        dataField: "totalSalesValue",
        caption: t("total_sales_value"),
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
              cellElement.data?.totalSalesValue == null
                ? ""
                : getFormattedValue(cellElement.data.totalSalesValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalSalesValue == null
              ? ""
              : getFormattedValue(cellElement.data.totalSalesValue);
          }
        },
      },
      {
        dataField: "si",
        caption: t("sl"),
        dataType: "number",
        width: 100,
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        showInPdf: true,
      },
    ];
    return baseColumns.filter((column) => {
      if (
        column.dataField == "groupName" ||
        column.dataField == "brandName" ||
        column.dataField == "si"
      ) {
        return userSession.dbIdValue != "543140180640";
      }
      return true;
    });
  }, [t, userSession.dbIdValue]);
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
      column: "productName",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "qty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cost",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "total",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totalSalesValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      isGroupItem: true,
      showInGroupFooter: true,
      column: "qty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      isGroupItem: true,
      showInGroupFooter: true,
      column: "cost",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      isGroupItem: true,
      showInGroupFooter: true,
      column: "total",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      isGroupItem: true,
      showInGroupFooter: true,
      column: "totalSalesValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];
  const location = useLocation();
  const [key, setKey] = useState(1);
  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);
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
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                filterText="From {fromDate} To {toDate}"
                columns={columns}
                moreOption={true}
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<StockJournalReportFilter />}
                filterWidth={700}
                filterHeight={340}
                filterInitialData={StockJournalReportFilterInitialState}
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
export default StockJournalReport;
