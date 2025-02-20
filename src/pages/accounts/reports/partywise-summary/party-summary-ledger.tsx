import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { PartySummaryFilter } from "./party-summary-master";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";
const PartySummaryLedger: React.FC<PartySummaryFilter> = ({ filter }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
        cellRender: (
                          cellElement: any,
                          cellInfo: any,
                          filter: any,
                          exportCell: any
                        ) => {
                           return  (cellElement.data.date==null||cellElement.data.date==""?"":moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY")) ; // Ensures proper formatting
                        }
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "particulars",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.particulars;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: cellInfo.value,
            bold: cellElement.data.particulars === "TOTAL" ? true : '',

            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return ( <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
          {cellElement.data.particulars}
        </span>)
}}
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : '',
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return ( <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
        </span>)
        }}
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : '',
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (   <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>)
}}
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)+ ' Cr'
                : getFormattedValue(balance)+' Dr';
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold:  true,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor:  '#FF0000' ,
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: { argb: 'FFFF0000' },
              size: 10,
              style:  'bold',
              bold:  true ,
            }
          } : undefined;
        }
        else {
          return (  <span className={`${"font-bold text-[#DC143C]"}`}>
          {`${cellElement.data?.balance == null
            ? '0'
            : cellElement.data.balance < 0
              ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
              : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
        </span>)
}}
    },
    {
      dataField: "ledger",
      caption: t("ledger"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "invTransactionID",
      caption: t("invTransaction_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "chequeNumber",
      caption: t("cheque_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "checkStatus",
      caption: t("check_status"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "chequeDate",
      caption: t("cheque_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "costCenter",
      caption: t("cost_center"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "accTransactionDetailID",
      caption: t("accTransaction_detail_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 heightToAdjustOnWindows={280}
                  columns={columns}
                  gridHeader={t("party_summary_ledger_report")}
                  dataUrl={Urls.acc_reports_party_summary_ledger}
                  method={ActionType.POST}
                  gridId="grd_party_summary_ledger_report"
                  postData={filter}
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
    </Fragment>
  );
};
export default PartySummaryLedger;