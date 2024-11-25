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
import OutstandingAgingReportFilter, { OutstandingAgingReportFilterInitialState } from "./outstanding-aging-report-filter";
import OutstandingAccountAgingAnalysis from "./outstanding-account-aging-analysis";


const OutstandingAccountPayableAgingReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('si_no'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "ledgername",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.ledgername}
  </span>
      ),
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
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.balance}
  </span>
      ),
    },
    {
      dataField: "period1",
      caption: 10 + t("days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.period1}
  </span>
      ),
    },
    {
      dataField: "period2",
      caption: 20 + t("days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.period2}
  </span>
      ),
    },
    {
      dataField: "period3",
      caption: 30 + t("days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.period3}
  </span>
      ),
    },
    {
      dataField: "period4",
      caption: 60 + t("days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.period4}
  </span>
      ),
    },
    {
      dataField: "period5",
      caption: 90 + t("days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.period5}
  </span>
      ),
    },
    {
      dataField: "period6",
      caption: 120 + t("days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.period6}
  </span>
      ),
    },
    {
      dataField: "period7",
      caption: 150 + t("days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.period7}
  </span>
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("account_payable_aging_report")}
                  dataUrl={Urls.acc_reports_outstanding_aging_payable}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  filterWidth="100"
                  showFilterInitially={true}
                  filterContent={<OutstandingAgingReportFilter />}
                  filterInitialData={OutstandingAgingReportFilterInitialState}
                  childPopupProps={{
                    content: <OutstandingAccountAgingAnalysis />,
                    title: t("account_aging_analysis"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "ledgername",
                    bodyProps: "asonDate,partyType,salesRouteID,p1,p2,p3,p4,p5,p6,p7,ledgerID,costCenterID,"
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

export default OutstandingAccountPayableAgingReport;