import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import CashBookReportFilter, { CashBookReportFilterInitialState } from "../cashBook/cash-book-report-filter";
import CashBankFlowDetailedReport from "./cash-bank-flow-detailed-report";
import CashBankFlowDetailedSummaryReport from "./cash-bank-flow-summary-report";

const BankFlowReport = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<any>(CashBookReportFilterInitialState);
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  // const [filter, setFilter] = useState<IncomeRepor>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "year",
      caption: t('year'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true, 
      width: 80,
      showInPdf:true,
    },
    {
      dataField: "monthNum",
      caption: t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      width: 300,
      showInPdf:true,
      // cellRender: (cellElement: any, cellInfo: any) => (
      //   <span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
      //     {cellElement.data.accGroupName}
      //   </span>
      // ),
    },
    {
          dataField: "month",
          caption: t("month"),
          dataType: "string",
          width: 100,
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
              const balance = cellElement.data?.month;
              const isDebit = balance >= 0;
              const value =
                balance == null
                  ? ""
                  : balance < 0
                    ? getFormattedValue(-1 * balance) + " Cr"
                    : getFormattedValue(balance) + " Dr";
              return exportCell != undefined ? {
                ...exportCell,
                text:( cellElement.data.isSubGroup?"   ":"")+(cellInfo.value??""),
                bold: true,
                // alignment: "right",
                alignment : {
                  horizontal: "right",
                  indent: 2,
                },
                textColor: cellElement.data?.month==="TOTAL"?'#DC143C': '',
                font: {
                  ...exportCell.font,
                  color:cellElement.data?.month==="TOTAL"?{ argb: 'FFFF0000' }: '',
                  size: 15,
                }
              } : undefined;
            }
            else {
            return cellElement.data.month === "TOTAL" ? (<span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
              {cellElement.data.month}
            </span>) :
              <DrillDownCellTemplate data={cellElement} field="month"></DrillDownCellTemplate>
          }
        }
        },
        {
          dataField: "debit",
          caption: t("inFlow"),
          dataType: "number",
          allowSearch: true,
          allowFiltering: true,
          // width: 300,
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
                textColor: cellElement.data.month === "TOTAL" ? '#FF0000' : '',
                font: {
                  ...exportCell.font,
                  color:cellElement.data.month === "TOTAL" ? { argb: 'FFFF0000' }:'',
                  size: 15,
                },
              };
            }
            else {
              return ( <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
                {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : getFormattedValue(cellElement.data.debit)}`}
                </span>)
            }}
        },
        {
          dataField: "credit",
          caption: t("outFlow"),
          dataType: "number",
          allowSearch: true,
          allowFiltering: true,
          // width: 300,
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
                textColor: cellElement.data.month === "TOTAL" ? '#FF0000' : '',
                font: {
                  color:cellElement.data.month === "TOTAL" ? { argb: 'FFFF0000' }:'',
                  ...exportCell.font,
                  size: 15,
                },
              };
            }
            else {
              return ( <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
                {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : getFormattedValue(cellElement.data.credit)}`}
               </span>)
            }}
        },
        {
          dataField: "monthBal",
          caption: t("netFlow"),
          dataType: "number",
          allowSearch: true,
          allowFiltering: true,
          // width: 300,
          showInPdf:true,
          cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
            if (exportCell != undefined) {
              const balance = cellElement.data?.monthBal;
              const isDebit = balance >= 0;
              const value =
                balance == null
                  ? ""
                  : getFormattedValue(balance);
    
              return {
                ...exportCell,
                text: value,
                bold: true,
                alignment: "right",
                textColor: cellElement.data.month === "TOTAL" ? '#FF0000' : '',
                font: {
                  color:cellElement.data.month === "TOTAL" ? { argb: 'FFFF0000' }:'',
                  ...exportCell.font,
                  size: 15,
                },
              };
            }
            else {
         return (  <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : getFormattedValue(cellElement.data.monthBal)}`}
        </span>)
            }}
        },
    {
      dataField: "showSummary",
      caption: t('show_summary'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true, 
      width: 100,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement} field="showSummary"></DrillDownCellTemplate>
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
                
                  allowGrouping={true}
                  columns={columns}
                   filterText=" as of {--- (finTo)}"
                  gridHeader={t("bank_flow_report")}
                  dataUrl={Urls.acc_reports_bank_flow}
                  method={ActionType.POST}
                  gridId="grd_bank_flow"
                  popupAction={toggleCostCentrePopup}
                  remoteOperations={{filtering:false,paging:false,sorting:false}}
                  enablefilter={false}
                  showFilterInitially={false}
                  filterContent={<CashBookReportFilter />}
                  filterInitialData={CashBookReportFilterInitialState}
                  onFilterChanged = {(filter: any) => {setFilter(filter)}}
                  reload={true}
                  hideGridAddButton={true}
                  // childPopupProps={{
                  //   content: <CashBankFlowDetailedSummaryReport postData={{...filter,
                  //     reportType:"Bank",
                  //   }} />,
                  //   title: t("bank_flow_report_detailed"),
                  //   isForm: false,
                  //   width: "mw-100",
                  //   drillDownCells: "month",
                  //   bodyProps: "year,monthNum",
                  //   origin:"bank_flow", 
                  //   enableFn: (data: any) => data?.month != "TOTAL"
                  // }}
                  // childPopupProps={{
                  //   content: <CashBankFlowDetailedReport postData={
                  //     { ...filter,
                  //       reportType:"Bank",
                  //     }} />,
                  //   title: t("bank_flow_report_detailed"),
                  //   isForm: false,
                  //   width: "mw-100",
                  //   drillDownCells: "month",
                  //   bodyProps: "year,monthNum",
                  //   origin:"bank_flow",
                  //   enableFn: (data: any) => data?.month != "TOTAL"
                  // }}
                  childPopupPropsDynamic={(dataField: string) => ({
                    title:dataField == "showSummary"? t("bank_flow_report_summary"):t("bank_flow_report_detailed"),
                    width: "max-w-[1500px]",
                    isForm: false,
                    content: 
                    dataField == "showSummary" ?
                    <CashBankFlowDetailedSummaryReport  />
                    :  
                    dataField == "month" ?
                    <CashBankFlowDetailedReport  />
                      : null
                      ,
                    drillDownCells: dataField == "showSummary" ? "showSummary" : "month",
                    bodyProps: dataField == "showSummary" ? "year,monthNum,month" : "year,monthNum",
                  })}
                  postData={{...filter,
                    reportType:"Bank",
                  }}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default BankFlowReport;