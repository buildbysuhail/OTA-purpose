import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashSummaryReportFilter, { CashSummaryReportFilterInitialState } from "../cashSummary/cash-summary-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";

const DailySummaryGlobal = () => {
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance
          return {
            ...exportCell,
            text: cellInfo.value,
            bold: cellElement.data.isGroup == true ? true : false,
            // alignment: "right",
            // alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.date === "TOTAL"
              ? "#DC143C"
              : cellElement.data.date === "Expenses" || cellElement.data.date === "Finished Goods"
                ? "#000000"
                : cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense"
                  ? "#2E8B57"
                  : "",
            font: {
              ...exportCell.font,
              color: cellElement.data.date === "TOTAL"
                ? { argb: 'FFDC143C' } // Crimson
                : cellElement.data.date === "Expenses" || cellElement.data.date === "Finished Goods"
                  ? { argb: 'FF000000' } // Black
                  : cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense"
                    ? { argb: 'FF2E8B57' } // Green
                    : '',
              size: 10,
              style:cellElement.data.date === "TOTAL"|| cellElement.data.date === "Expenses" || cellElement.data.date === "Finished Goods" || cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense" ? 'bold' : 'normal',
              bold:cellElement.data.date === "TOTAL"|| cellElement.data.date === "Expenses" || cellElement.data.date === "Finished Goods" || cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.date === "Expenses" || cellElement.data.date === "Finished Goods" ? 'font-bold text-black' : cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense" ? 'font-bold text-[#2E8B57]' : ''}`}>
                {moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY")}
          </span>
          )
        }
      }

    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance
          return {
            ...exportCell,
            text: cellInfo.value,
            bold: cellElement.data.isGroup == true ? true : false,
            // alignment: "right",
            // alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.party === "Product Name"
              ? '#2E8B57'
              : cellElement.data.party === "OPENING BALANCE" ||
                cellElement.data.party === "CLOSING BALANCE" ||
                cellElement.data.party === "INCOME" ||
                cellElement.data.party === "EXPENSE" ||
                cellElement.data.date === "Finished Goods"
                ? '#040404'
                : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.party === "Product Name"
                ? { argb: '#ff2e8b57' }
                : cellElement.data.party === "OPENING BALANCE" ||
                  cellElement.data.party === "CLOSING BALANCE" ||
                  cellElement.data.party === "INCOME" ||
                  cellElement.data.party === "EXPENSE" ||
                  cellElement.data.date === "Finished Goods"
                  ? { argb: '#ff040404' }
                  : '',
              size: 10,
              style: cellElement.data.party === "Product Name" ||
                cellElement.data.party === "OPENING BALANCE" ||
                cellElement.data.party === "CLOSING BALANCE" ||
                cellElement.data.party === "INCOME" ||
                cellElement.data.party === "EXPENSE" ||
                cellElement.data.date === "Finished Goods" ? 'bold' : 'normal',
              bold: cellElement.data.party === "Product Name" ||
                cellElement.data.party === "OPENING BALANCE" ||
                cellElement.data.party === "CLOSING BALANCE" ||
                cellElement.data.party === "INCOME" ||
                cellElement.data.party === "EXPENSE" ||
                cellElement.data.date === "Finished Goods" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.party === "Product Name" ? 'font-bold text-[#2E8B57]' : cellElement.data.party === "OPENING BALANCE" || cellElement.data.party === "CLOSING BALANCE" || cellElement.data.party === "INCOME" || cellElement.data.party === "EXPENSE" || cellElement.data.date === "Finished Goods" ? 'font-bold text-black' : ''}`}>
            {cellElement.data.party}
          </span>)
        }
      }
    },
    {
      dataField: "billed",
      caption: t("billed"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.billed;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(parseFloat(balance))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.date === "TOTAL"
              ? '#DC143C'
              : cellElement.data.date === "Expenses" ||
                cellElement.data.party === "OPENING BALANCE" ||
                cellElement.data.party === "CLOSING BALANCE" ||
                cellElement.data.party === "INCOME" ||
                cellElement.data.party === "EXPENSE" ||
                cellElement.data.date === "Finished Goods"
                ? '#040404'
                : cellElement.data.date === "Indirect Expense" ||
                  cellElement.data.date === "Direct Expense" ||
                  cellElement.data.billed === "Quantity"
                  ? '#2E8B57'
                  : cellElement.data.party === "Product Name"
                    ? '#2E8B57'
                    : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.date === "TOTAL"
                ? { argb: 'FFDC143C' } 
                 // ARGB for '#DC143C'
                : cellElement.data.date === "Expenses" ||
                  cellElement.data.party === "OPENING BALANCE" ||
                  cellElement.data.party === "CLOSING BALANCE" ||
                  cellElement.data.party === "INCOME" ||
                  cellElement.data.party === "EXPENSE" ||
                  cellElement.data.date === "Finished Goods"
                  ? { argb: 'FF040404' }  // ARGB for '#040404'
                  : cellElement.data.date === "Indirect Expense" ||
                    cellElement.data.date === "Direct Expense" ||
                    cellElement.data.billed === "Quantity"
                    ? { argb: 'FF2E8B57' }  // ARGB for '#2E8B57'
                    : cellElement.data.party === "Product Name"
                      ? { argb: 'FF2E8B57' }  // ARGB for '#2E8B57'
                      : '',
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ||
                  cellElement.data.date === "Expenses" ||
                  cellElement.data.party === "OPENING BALANCE" ||
                  cellElement.data.party === "CLOSING BALANCE" ||
                  cellElement.data.party === "INCOME" ||
                  cellElement.data.party === "EXPENSE" ||
                  cellElement.data.date === "Finished Goods" ||
                  cellElement.data.date === "Indirect Expense" ||
                  cellElement.data.date === "Direct Expense" ||
                  cellElement.data.billed === "Quantity" ||
                  cellElement.data.party === "Product Name" ? 'bold' : 'normal',
              bold: cellElement.data.date === "TOTAL" ||
                cellElement.data.date === "Expenses" ||
                cellElement.data.party === "OPENING BALANCE" ||
                cellElement.data.party === "CLOSING BALANCE" ||
                cellElement.data.party === "INCOME" ||
                cellElement.data.party === "EXPENSE" ||
                cellElement.data.date === "Finished Goods" ||
                cellElement.data.date === "Indirect Expense" ||
                cellElement.data.date === "Direct Expense" ||
                cellElement.data.billed === "Quantity" ||
                cellElement.data.party === "Product Name" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.date === "Expenses" || cellElement.data.party === "OPENING BALANCE" || cellElement.data.party === "CLOSING BALANCE" || cellElement.data.party === "INCOME" || cellElement.data.party === "EXPENSE" || cellElement.data.date === "Finished Goods" ? 'font-bold text-black' : cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense" || cellElement.data.billed === "Quantity" ? 'font-bold text-[#2E8B57]' : ''}`}>
            {cellElement.data.billed == null || cellElement.data.billed == '' ? '' : getFormattedValue(parseFloat(cellElement.data.billed))}
          </span>)
        }
      }
    },
    {
      dataField: "received",
      caption: t("received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.received;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.isGroup == true ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.date === "TOTAL"
              ? '#DC143C'
              : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.date === "TOTAL"
                ? { argb: 'FFDC143C' }
                : '',
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.date === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {getFormattedValue(cellElement.data.received)}
          </span>)
        }
      }
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.isGroup == true ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.date === "TOTAL"
              ? '#DC143C'
              : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.date === "TOTAL"
                ? { argb: 'FFDC143C' }
                : '',
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.date === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {getFormattedValue(cellElement.data.balance)}
          </span>)
        }
      }
    },
    {
      dataField: "runningBalance",
      caption: t("runningBalance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.runningBalance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.isGroup == true ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.date === "TOTAL"
              ? '#DC143C'
              : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.date === "TOTAL"
                ? { argb: 'FFDC143C' }
                : '',
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.date === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {getFormattedValue(cellElement.data.runningBalance)}
          </span>)
        }
      }
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf: true,
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.quantity;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance, false, 4)
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.isGroup == true ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.date === "TOTAL"
              ? '#DC143C'
              : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.date === "TOTAL"
                ? { argb: '#FFDC143C' }
                : '',
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.date === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span>
            {getFormattedValue(cellElement.data.quantity, false, 4)}
          </span>)
        }
      }
    },
    {
      dataField: "netAmt",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.netAmt;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance, false, 4)
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.isGroup == true ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.date === "TOTAL"
              ? '#DC143C'
              : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.date === "TOTAL"
                ? { argb: '#FFDC143C' }
                : '',
              size: 10,
              style:
                cellElement.data.date === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.date === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span>
            {getFormattedValue(cellElement.data.netAmt, false, 4)}
          </span>)
        }
      }
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  showTotalCount={false}
                  columns={columns}
                  filterText="from {fromDate} to {toDate}"
                  gridHeader={t("daily_summary_report")}
                  dataUrl={Urls.acc_reports_daily_summary_global}
                  method={ActionType.POST}
                  gridId="grd_daily_summary_global"
                  enablefilter={true}
                  showFilterInitially={true}
                  // filterWidth="100"
                  filterContent={<CashSummaryReportFilter />}
                  filterInitialData={CashSummaryReportFilterInitialState}
                  hideGridAddButton={true}
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DailySummaryGlobal;
