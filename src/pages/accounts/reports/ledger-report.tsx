import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../redux/types";
import { useSearchParams } from "react-router-dom";
import LedgerReportFilter, { LedgerReportFilterInitialState } from "./ledger-report-filter";

interface LedgerReport {
  from: Date
}
const LedgerReport = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] =useState<LedgerReport>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
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
      caption:  t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.particulars}
  </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.debit}
  </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.credit}
  </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.balance}
  </span>
      ),
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
                  gridHeader={t("ledger_report")}
                  dataUrl= {Urls.acc_reports_ledger}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<LedgerReportFilter/>}
                  filterInitialData={LedgerReportFilterInitialState}
                  reload={true} 
                  gridId="grd_cost_centre"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LedgerReport;