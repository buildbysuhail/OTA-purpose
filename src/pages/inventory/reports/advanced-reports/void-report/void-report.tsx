import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import VoidReportFilter, {
  VoidReportFilterInitialState,
} from "./void-report-filter";

const VoidReport = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "counter",
      caption: t("counter"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 75,
    },
    {
      dataField: "user",
      caption: t("user"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 50,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 75,
      format: "dd-MMM-yyyy",
      // cellRender: (
      //   cellElement: any,
      //   cellInfo: any,
      //   filter: any,
      //   exportCell: any
      // ) => {
      //   return cellElement.data.date == null || cellElement.data.date == ""
      //     ? ""
      //     : moment(cellElement.data.date, "YYYY-MM-DD").format("DD-MMM-YYYY");
      // },
    },
    {
      dataField: "barcode",
      caption: t("barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 67,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 350,
    },
    {
      dataField: "qty",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 60,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.qty == null
              ? 0
              : getFormattedValue(cellElement.data.qty);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.qty == null
            ? 0
            : getFormattedValue(cellElement.data.qty);
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
      showInPdf: true,
      width: 80,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.total == null
              ? 0
              : getFormattedValue(cellElement.data.total);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.total == null
            ? 0
            : getFormattedValue(cellElement.data.total);
        }
      },
    },
    {
      dataField: "status",
      caption: t("status"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 80,
    },
    {
      dataField: "systemDate",
      caption: t("system_date"),
      dataType: "datetime",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 110,
      format: "dd-MMM-yyyy hh:mm a",
    },
    {
      dataField: "systemName",
      caption: t("system_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 105,
    },
    {
      dataField: "shiftName",
      caption: t("shift_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 75,
    },
    {
      dataField: "voucherNo",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
    },
    {
      dataField: "prefix",
      caption: t("prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeTotal = (itemInfo: any) => `TOTAL`;
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
      return getFormattedValue(value,false,undefined,0,0,true) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "product",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "total",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "qty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
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
                columns={columns}
                gridHeader={t("void_report")}
                filterText="{counterID > 0 && , Counter : [counter]} {userID > 0 &&, User : [user]} From : {fromDate} To : {toDate}"
                dataUrl={Urls.void_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<VoidReportFilter />}
                filterWidth={600}
                filterHeight={140}
                filterInitialData={VoidReportFilterInitialState}
                reload={true}
                gridId="grd_void_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default VoidReport;
