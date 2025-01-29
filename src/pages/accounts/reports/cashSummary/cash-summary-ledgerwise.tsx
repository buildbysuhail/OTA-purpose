import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useSearchParams } from "react-router-dom";
import CashSummaryReportFilter, { CashSummaryReportFilterInitialState } from "./cash-summary-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

interface CashSummaryLedgerwise {
  from: Date
}
const CashSummaryLedgerwise = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue} = useNumberFormat()
  const [filter, setFilter] =useState<CashSummaryLedgerwise>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
            textColor: cellElement.data.particulars === "TOTAL" || cellElement.data.particulars==="Opening Balance"? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.particulars === "TOTAL"|| cellElement.data.particulars==="Opening Balance"? { argb: 'FFFF0000' }:"",
              size: 15,
            }
          } : undefined;
        }
        else {
          return(<span className={`${cellElement.data.particulars==="TOTAL" ||cellElement.data.particulars==="Opening Balance"? 'font-bold text-[#DC143C] ' : ''}`}>
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
      width: 180,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
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
            textColor: cellElement.data.particulars === "TOTAL" || cellElement.data.particulars==="Opening Balance"? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars==="Opening Balance"? { argb: 'FFFF0000' }:"",
              size: 15,
            },
          };
        }
        else {
          return( <span className={`${cellElement.data.particulars==="TOTAL" ||cellElement.data.particulars==="Opening Balance"? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1* cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
            </span>)
       
          }}
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
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
            textColor: cellElement.data.particulars === "TOTAL" || cellElement.data.particulars==="Opening Balance"? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars==="Opening Balance"? { argb: 'FFFF0000' }:"",
              size: 15,
            },
          };
        }
        else {
          return (  <span className={`${cellElement.data.particulars==="TOTAL" ||cellElement.data.particulars==="Opening Balance"? 'font-bold text-[#DC143C] ' : ''}`}>
            {`${ cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1* cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
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
      width: 200,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
             if (exportCell != undefined) {
               const balance = cellElement.data?.balance;
               const isDebit = balance >= 0;
               const value =
                 balance == null
                   ? ""
                   : balance < 0
                   ? getFormattedValue(-1 * balance) + " Cr"
                   : getFormattedValue(balance) + " Dr";
               return {
                 ...exportCell,
                 text: value,
                 bold: true,
                 alignment: "right",
                 textColor: cellElement.data.particulars === "TOTAL" || cellElement.data.particulars==="Opening Balance"? '#FF0000' : '',
                 font: {
                   ...exportCell.font,
                   color:cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars==="Opening Balance"? { argb: 'FFFF0000' }:"",
                   size: 15,
                   Bold:true
                 },
               };
             }
             else {
              return(<span className={`${cellElement.data.particulars==="TOTAL" ||cellElement.data.particulars==="Opening Balance"? 'font-bold text-[#DC143C]' : ''}`}>
                {`${cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1* cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}
                 ${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data?.balance >= 0 ? 'Dr' : 'Cr' }`}
               </span>)
              }}
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
                 remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  filterText=" from {fromDate} to {toDate}"
                  gridHeader={t("cash_summary_ledgerwise")}
                  dataUrl= {Urls.acc_reports_cash_summary_ledgerwise}
                  method={ActionType.POST}
                  gridId="grd_cash_summary_ledgerwise"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  filterWidth="100"
                  showFilterInitially={true}
                  filterContent={<CashSummaryReportFilter/>}
                  filterInitialData={CashSummaryReportFilterInitialState}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Fragment>
  );
};

export default CashSummaryLedgerwise;