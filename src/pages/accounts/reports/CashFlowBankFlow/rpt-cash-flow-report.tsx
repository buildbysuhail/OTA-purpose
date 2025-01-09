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
import CashBookDayWise from "../cashBook/cash-book-daywise";
import CashBankFlowDetailedReport from "./cash-bank-flow-detailed-report";
import CashBankFlowDetailedSummaryReport from "./cash-bank-flow-summary-report";




const CashFlowReport = () => {
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
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.month === "TOTAL" ? (<span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.month}
        </span>) :
          <DrillDownCellTemplate data={cellElement} field="month"></DrillDownCellTemplate>
      }
    },
    {
      dataField: "debit",
      caption: t("inFlow"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-red' : ''}`}>
        {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : getFormattedValue(cellElement.data.debit)}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("outFlow"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-red' : ''}`}>
         {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "monthBal",
      caption: t("netFlow"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : getFormattedValue(cellElement.data.monthBal)}`}
        </span>
      ),
    },
    {
      dataField: "showSummary",
      caption: t('show_summary'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true, 
      width: 80,
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
                remoteOperations={{filtering:false,paging:false,sorting:false}}
                  allowGrouping={true}
                  columns={columns}
                  filterText=" as of {--- (finTo)}"
                  gridHeader={t("cash_flow_report")}
                  dataUrl={Urls.acc_reports_cash_flow }
                  method={ActionType.POST}
                  gridId="grd_cash_flow"
                  popupAction={toggleCostCentrePopup}
                  enablefilter={false}
                  showFilterInitially={false}
                  filterContent={<CashBookReportFilter />}
                  filterInitialData={CashBookReportFilterInitialState}
                  onFilterChanged = {(filter: any) => {setFilter(filter)}}
                  reload={true}
                  hideGridAddButton={true}
                  // childPopupProps={{
                  //   content: <CashBankFlowDetailedSummaryReport postData={{...filter,
                  //     reportType:"Cash",
                  //   }} />,
                  //   title: t("cash_flow_report_detailed"),
                  //   isForm: false,
                  //   width: "mw-100",
                  //   drillDownCells: "month",
                  //   bodyProps: "year,monthNum,month",
                  //   origin:"cash_flow", 
                  //   enableFn: (data: any) => data?.month != "TOTAL"
                  // }}
                  // childPopupProps={{
                  //   content: <CashBankFlowDetailedReport />,
                  //   title: t("cash_flow_detailed"),
                  //   isForm: false,
                  //   width: "mw-100",
                  //   drillDownCells: "month",
                  //   bodyProps: "year,monthNum,reportType,asonDate",
                  // }}
                  childPopupPropsDynamic={(dataField: string) => ({
                    title:dataField == "showSummary"? t("cash_flow_report_summary"):t("cash_flow_report_detailed"),
                    width: "700px",
                    isForm: false,
                    content: 
                    dataField == "showSummary" ?
                    <CashBankFlowDetailedSummaryReport postData={{...filter,
                      reportType:"Cash",
                    }} />
                    :  
                    dataField == "month" ?
                    <CashBankFlowDetailedReport postData={
                      { ...filter,
                        reportType:"Cash",
                      }} />
                      : null,
                    origin:"cash_flow",
                    drillDownCells: dataField == "showSummary" ? "showSummary" : "month",
                    bodyProps: dataField == "showSummary" ? "year,monthNum,month" : "year,monthNum",
                  })}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default CashFlowReport;