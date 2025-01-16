import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import DayBookReportFilter, { DayBookReportFilterInitialState } from "./day-book-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const DayBookDetailed = () => {
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      format: 'MMMM dd, yyyy',
      showInPdf:true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf:true,
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
    // {
    //   dataField: "ledger",
    //   caption: t("account"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    {
      dataField: "particulars",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
                ? getFormattedValue(-1 * balance) + " Cr"
                : getFormattedValue(balance) + " Dr";
          return exportCell != undefined ? {
            ...exportCell,
            text: cellInfo.value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' }:"",
              size: 20,
            }
          } : undefined;
        }
        else {
          return(   <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {cellElement.data.particulars}
          </span>)
        }}
      
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
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
              ?cellElement.data.particulars === "TOTAL" ?  getFormattedValue(-1 * balance):(-1*balance)
              :cellElement.data.particulars === "TOTAL" ?  getFormattedValue(balance):balance;

          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' }:"",
              size: 15,
            },
          };
        }
        else {
          return(  <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == null || cellElement.data?.debit == 0
              ? ''
              : cellElement.data.particulars === "TOTAL"
                ? getFormattedValue(cellElement.data.debit)
                : cellElement.data.debit}`}
          </span>)
      
            }}
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ?cellElement.data.particulars === "TOTAL" ?  getFormattedValue(-1 * balance):(-1*balance)
                :cellElement.data.particulars === "TOTAL" ?  getFormattedValue(balance):balance;

          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' }:"",
              size: 15,
            },
          };
        }
        else {
          return( <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == null || cellElement.data?.credit == 0
              ? ''
              : cellElement.data.particulars === "TOTAL"
                ? getFormattedValue(cellElement.data.credit)
                : cellElement.data.credit}`}
          </span>)
       
            }}
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);

          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor:  '#FF0000' ,
            font: {
              ...exportCell.font,
              color:{ argb: 'FFFF0000' },
              size: 15,
            },
          };
        }
        else {
return( <span className={`${"font-bold text-[#DC143C]"}`}>
  {`${cellElement.data?.balance == null
    ? '0'
    : cellElement.data.balance < 0
      ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
      : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
</span>)
  }   
  },
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
                  columns={columns}
                  filterText="from {dateFrom} to {dateTo} {costCenterID > 0 && , Cost Center: [CostCenterName]}"
                  gridHeader={t("day_book_detailed")}
                  dataUrl={Urls.acc_reports_day_book_detailed}
                  method={ActionType.POST}
                  gridId="grd_day_book_detailed"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth="100"
                  filterContent={<DayBookReportFilter />}
                  filterInitialData={DayBookReportFilterInitialState}
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
export default DayBookDetailed;