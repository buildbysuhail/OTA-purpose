import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { DrillDownCellTemplate, } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import DaywiseSummaryWithProfitFilter, { DaywiseSummaryWithProfitFilterInitialState, } from "./daywise-summary-with-profit-filter";
import DaywiseSummaryWithProfitDrillDown from "./daywise-summary-with-profit-drilldown";

const DaywiseSummaryWithProfit = () => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<any>(
    DaywiseSummaryWithProfitFilterInitialState
  );
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      format: "dd-MMM-yyyy",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          return {
            ...exportCell,
            text: cellInfo.value,
            bold: true,
            alignment: "left",
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM" ||
                cellElement.data.date === "SALES" ||
                cellElement.data.date === "SALES RETURN"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM" ||
                  cellElement.data.date === "SALES" ||
                  cellElement.data.date === "SALES RETURN"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM" ||
                  cellElement.data.date === "SALES" ||
                  cellElement.data.date === "SALES RETURN"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM" ||
                  cellElement.data.date === "SALES" ||
                  cellElement.data.date === "SALES RETURN"
                  ? true
                  : false,
            },
          };
        } else {
          return cellElement.data.date === "TOTAL" ||
            cellElement.data.date === "SUM" ||
            cellElement.data.date === "SALES" ||
            cellElement.data.date === "SALES RETURN" ? (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM" ||
                cellElement.data.date === "SALES" ||
                cellElement.data.date === "SALES RETURN"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {cellElement.data.date}
              {/* {filter.showSalesReturn == true
                ? moment(cellElement.data.date, "DD/MM/YYYY", false).isValid()
                  ? moment(cellElement.data.date, "DD/MM/YYYY").format(
                      "DD-MMM-YYYY"
                    )
                  : cellElement.data.date
                : moment(
                    cellElement.data.date,
                    "MM/DD/YYYY HH:mm:ss",
                    false
                  ).isValid()
                ? moment(cellElement.data.date, "MM/DD/YYYY HH:mm:ss").format(
                    "DD-MMM-YYYY"
                  )
                : cellElement.data.date} */}
            </span>
          ) : (
            <DrillDownCellTemplate data={cellElement} field="date" />
          );
        }
      },
    },
    {
      dataField: "totalGross",
      caption: t("total_gross"),
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
          const balance = cellElement.data?.totalGross;
          const value = balance == null ? "" : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.totalGross == null
                ? ""
                : getFormattedValue(cellElement.data.totalGross)
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "totalVAT",
      caption: t("total_vat"),
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
          const balance = cellElement.data?.totalVAT;
          const value =
            balance == null ? "" : getFormattedValue(balance, false, 4);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.totalVAT == null
                ? ""
                : getFormattedValue(cellElement.data.totalVAT, false, 4)
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "totalDiscount",
      caption: t("total_discount"),
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
          const balance = cellElement.data?.totalDiscount;
          const value = balance == null ? "" : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.totalDiscount == null
                ? ""
                : getFormattedValue(cellElement.data.totalDiscount)
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "billDiscount",
      caption: t("bill_discount"),
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
          const balance = cellElement.data?.billDiscount;
          const value = balance == null ? "" : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.billDiscount == null
                ? ""
                : getFormattedValue(cellElement.data.billDiscount)
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
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
          const balance = cellElement.data?.grandTotal;
          const value = balance == null ? "" : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.grandTotal == null
                ? ""
                : getFormattedValue(cellElement.data.grandTotal)
                }`}
            </span>
          );
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
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.cost;
          const value = balance == null ? "" : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.cost == null
                ? ""
                : getFormattedValue(cellElement.data.cost)
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "profit",
      caption: t("profit"),
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
          const balance = cellElement.data?.profit;
          const value = balance == null ? "" : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.profit == null
                ? ""
                : getFormattedValue(cellElement.data.profit)
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "gpPercentage",
      caption: t("gp_%"),
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
          const balance = cellElement.data?.gpPercentage;
          const value = balance == null ? "" : getFormattedValue(balance,false,3);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.gpPercentage == null
                ? ""
                : getFormattedValue(cellElement.data.gpPercentage,false,3)
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "markupPercentage",
      caption: t("markup_%"),
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
          const balance = cellElement.data?.markupPercentage;
          const value = balance == null ? "" : getFormattedValue(balance,false,3);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor:
              cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "#FF0000"
                : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? "bold"
                  : "normal",
              bold:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "SUM"
                  ? true
                  : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {`${cellElement.data?.markupPercentage == null
                ? ""
                : getFormattedValue(cellElement.data.markupPercentage,false,3)
                }`}
            </span>
          );
        }
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
                // summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
                columns={columns}
                filterText="{showSalesReturn == true && Sales and Return  Summary with Profit Between :} 
                 {showSalesReturn == false && Sales Summary with Profit Between :} 
                  {fromDate} - {toDate}
                 {salesRouteID > 0 && ,: of Route : [routeName]} 
                {costCenterID > 0 && , : of costcenterName : [costCenterName]}"
                gridHeader={t("day_wise")}
                dataUrl={Urls.daywise_summary_with_profit}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                onFilterChanged={(filter: any) => {
                  setFilter(filter);
                }}
                filterContent={<DaywiseSummaryWithProfitFilter />}
                filterWidth={790}
                filterHeight={270}
                filterInitialData={DaywiseSummaryWithProfitFilterInitialState}
                reload={true}
                gridId="grd_daywise_summary_with_profit"
                childPopupProps={{
                  content: <DaywiseSummaryWithProfitDrillDown />,
                  title: filter.showSalesReturn
                    ? t("day_wise_sales_and_return_summary_with_profit")
                    : t("day_wise_sales_summary_with_profit"),
                  isForm: false,
                  width: 1000,
                  drillDownCells: "date,",
                  bodyProps: "date",
                  enableFn: (data: any) => data?.date != null || data?.date != "",
                  origin: filter.showSalesReturn ? "return" : "sales",
                }}
                postData={{ ...filter }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DaywiseSummaryWithProfit;
