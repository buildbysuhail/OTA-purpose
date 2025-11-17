import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { DrillDownCellTemplate, } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { FC } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../../utilities/Utils";
interface DaywiseSummaryWithProfitProps {
  postData?: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  origin?: any;
}
const DaywiseSummaryWithProfitDrillDown: FC<DaywiseSummaryWithProfitProps> = ({ postData, contentProps, rowData, origin, }) => {
  const { t } = useTranslation("accountsReport");
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
          return (
            <span
              className={`${cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "SUM" ||
                cellElement.data.date === "SALES" ||
                cellElement.data.date === "SALES RETURN"
                ? "font-bold text-[#DC143C]"
                : ""
                }`}
            >
              {/* {filter.showSalesReturn == true
                ? moment(cellElement.data.date, "DD/MM/YYYY", true).isValid()
                  ? moment(cellElement.data.date, "DD/MM/YYYY").format(
                      "DD-MMM-YYYY"
                    )
                  : cellElement.data.date
                : moment(
                    cellElement.data.date,
                    "MM/DD/YYYY HH:mm:ss",
                    true
                  ).isValid()
                ? moment(cellElement.data.date, "MM/DD/YYYY HH:mm:ss").format(
                    "DD-MMM-YYYY"
                  )
                : cellElement.data.date} */}
              {cellElement.data.date}
            </span>
          );
        }
      },
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell !== undefined) {
          const value = cellElement.data?.voucherNumber == null ? "0" : cellElement.data.voucherNumber.toString();
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
              field="voucherNumber"
            />
          );
        }
      },
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
                postData={mergeObjectsRemovingIdenticalKeys(
                  postData,
                  contentProps
                )}
                filterText={`${t('day_wise_sales')}${origin == "return" ? " and Return" : ""} ${t('summary_with_profit_on')} : {**** (date)}`}
                dataUrl={Urls.daywise_summary_with_profit_by_date}
                hideGridAddButton={true}
                method={ActionType.POST}
                reload={true}
                gridId="grd_daywise_summary_with_profit_by_date"
                rowData={rowData}
                childPopupProps={{
                  content: null,
                  title: "",
                  isForm: false,
                  isTransactionScreen: true,
                  drillDownCells: "voucherNumber,",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DaywiseSummaryWithProfitDrillDown;
