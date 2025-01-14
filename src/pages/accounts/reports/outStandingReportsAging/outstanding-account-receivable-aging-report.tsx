import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import OutstandingAgingReportFilter, { OutstandingAgingReportFilterInitialState } from "./outstanding-aging-report-filter";
import OutstandingAccountAgingAnalysis from "./outstanding-account-aging-analysis";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";


const OutstandingAccountReceivableAgingReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
   const [filter, setFilter] = useState<any>(OutstandingAgingReportFilterInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] = useState<OutstandingAccountReceivableAgingReport>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('SiNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf:true,
    },
    {
      dataField: "ledgername",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.ledgername === "TOTAL" ? (<span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.ledgername}`}
        </span>) :
          <DrillDownCellTemplate data={cellElement} field="ledgername"></DrillDownCellTemplate>
      }
    },
    // {
    //   dataField: "debit",
    //   caption: t('debit'),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    // {
    //   dataField: "credit",
    //   caption: t("credit"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={'font-bold text-[#DC143C]'}>
          {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '0' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
        </span>
      ),
    },
    {
      dataField: "period1",
      captionDynamic: (filter: any) => `<${filter.p1?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      visibleDynamic: (filter: any) => filter.p1 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : '0'}`}>
          {`${cellElement.data?.period1 == 0 || cellElement.data?.period1 == null ? '' : cellElement.data.period1 < 0 ? getFormattedValue(-1 * cellElement.data.period1) : getFormattedValue(cellElement.data.period1)}`}
        </span>
      ),
    },
    {
      dataField: "period2",
      captionDynamic: (filter: any) => `${filter.p1?.toString()}-${filter.p2?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      visibleDynamic: (filter: any) => filter.p2 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : '0'}`}>
          {`${cellElement.data?.period2 == 0 || cellElement.data?.period2 == null ? '' : cellElement.data.period2 < 0 ? getFormattedValue(-1 * cellElement.data.period2) : getFormattedValue(cellElement.data.period2)}`}
        </span>
      ),
    },
    {
      dataField: "period3",
      captionDynamic: (filter: any) => `${filter.p2?.toString()}-${filter.p3?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      visibleDynamic: (filter: any) => filter.p3 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : '0'}`}>
          {`${cellElement.data?.period3 == 0 || cellElement.data?.period3 == null ? '' : cellElement.data.period3 < 0 ? getFormattedValue(-1 * cellElement.data.period3) : getFormattedValue(cellElement.data.period3)}`}
        </span>
      ),
    },
    {
      dataField: "period4",
      captionDynamic: (filter: any) => `${filter.p3?.toString()}-${filter.p4?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      visibleDynamic: (filter: any) => filter.p4 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : '0'}`}>
          {`${cellElement.data?.period4 == 0 || cellElement.data?.period4 == null ? '' : cellElement.data.period4 < 0 ? getFormattedValue(-1 * cellElement.data.period4) : getFormattedValue(cellElement.data.period4)}`}
        </span>
      ),
    },
    {
      dataField: "period5",
      captionDynamic: (filter: any) => `${filter.p4?.toString()}-${filter.p5?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      visibleDynamic: (filter: any) => filter.p5 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : '0'}`}>
          {`${cellElement.data?.period5 == 0 || cellElement.data?.period5 == null ? '' : cellElement.data.period5 < 0 ? getFormattedValue(-1 * cellElement.data.period5) : getFormattedValue(cellElement.data.period5)}`}
        </span>
      ),
    },
    {
      dataField: "period6",
      captionDynamic: (filter: any) => `${filter.p5?.toString()}-${filter.p6?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      visibleDynamic: (filter: any) => filter.p6 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : '0'}`}>
          {`${cellElement.data?.period6 == 0 || cellElement.data?.period6 == null ? '' : cellElement.data.period6 < 0 ? getFormattedValue(-1 * cellElement.data.period6) : getFormattedValue(cellElement.data.period6)}`}
        </span>
      ),
    },
    {
      dataField: "period7",
      captionDynamic: (filter: any) => `>${Math.max(...[filter.p1,filter.p2,filter.p3,filter.p4,filter.p5,filter.p6])?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      // visibleDynamic: (filter: any) => filter.p6 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.period7 == 0 || cellElement.data?.period7 == null ? '0' : cellElement.data.period7 < 0 ? getFormattedValue(-1 * cellElement.data.period7) : getFormattedValue(cellElement.data.period7)}`}
        </span>
      ),
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
                  filterText="as of {asonDate}{salesRouteID > 0 &&, Sales Route :[salesRouteName]}{partyCategoryID > 0 &&, Party Category : [partyCategoryName]}{costCentreID > 0 &&, Cost Centre : [costCentreName]}"
                  gridHeader={t("account_receivable_aging_report")}
                  dataUrl={Urls.acc_reports_outstanding_aging_receivable}
                  method={ActionType.POST}
                  gridId="grd_aging_receivable"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  filterWidth="100"
                  remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<OutstandingAgingReportFilter />}
                  filterInitialData={OutstandingAgingReportFilterInitialState}
                  onFilterChanged = {(filter: any) => {setFilter(filter)}}
                  childPopupProps={{
                    content: <OutstandingAccountAgingAnalysis  />,
                    title: t("account_aging_analysis"),
                    isForm: true,
                    width: "mw-100",
                    drillDownCells: "ledgername",
                    bodyProps: "ledgerID",
                    //"asonDate,partyType,salesRouteID,p1,p2,p3,p4,p5,p6,p7,ledgerID,costCenterID,"
                    enableFn: (data: any) => data?.ledgername != "TOTAL"
                  }}
                  postData={{ ...filter, PartyType: "AR" }}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OutstandingAccountReceivableAgingReport;