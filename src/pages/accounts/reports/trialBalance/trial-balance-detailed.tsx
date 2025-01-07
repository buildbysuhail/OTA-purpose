import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import TrialBalancePeriodwiseReportFilter, { TrialBalancePeriodwiseReportFilterInitialState } from "./trial-balance-report-filter-periodwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";

interface TrialBalancePeriodwise {
  from: Date
}
const TrialBalancePeriodwise = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<any>(TrialBalancePeriodwiseReportFilterInitialState);
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] = useState<TrialBalancePeriodwise>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "accGroupID",
      caption: t("acc_group_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {cellElement.data.accGroupID}
        </span>
      ),
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "accGroupName",
      caption: t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {cellElement.data.accGroupName}
        </span>
      ),
    },
    {
      dataField: "ledgerName",
      caption: t("account_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.ledgerName === "TOTAL" ? (<span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.ledgerName === "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {cellElement.data.ledgerName}
        </span>) :
          <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
      }
    },
    {
      dataField: "openingDebit",
      caption: t("opening_debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.openingDebit == 0 || cellElement.data?.openingDebit == null ? '' : cellElement.data.openingDebit < 0 ? getFormattedValue(-1 * cellElement.data.openingDebit) : getFormattedValue(cellElement.data.openingDebit)}`}
        </span>
      ),
    },
    {
      dataField: "openingCredit",
      caption: t("opening_credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.openingCredit == 0 || cellElement.data?.openingCredit == null ? '' : cellElement.data.openingCredit < 0 ? getFormattedValue(-1 * cellElement.data.openingCredit) : getFormattedValue(cellElement.data.openingCredit)}`}
        </span>
      ),
    },
    {
      dataField: "openingBalance",
      caption: t("opening_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.openingBalance == 0 || cellElement.data?.openingBalance == null ? '' : cellElement.data.openingBalance < 0 ? getFormattedValue(-1 * cellElement.data.openingBalance) : getFormattedValue(cellElement.data.openingBalance)} ${cellElement.data?.openingBalance == 0 || cellElement.data?.openingBalance == null ? '' : cellElement.data?.openingBalance >= 0 ? 'Dr' : 'Cr'}`}
        </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red ' : ''}`}>
          {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}

        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "periodBalance",
      caption: t("period_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.periodBalance == 0 || cellElement.data?.periodBalance == null ? '' : cellElement.data.periodBalance < 0 ? getFormattedValue(-1 * cellElement.data.periodBalance) : getFormattedValue(cellElement.data.periodBalance)} ${cellElement.data?.periodBalance == 0 || cellElement.data?.periodBalance == null ? '' : cellElement.data?.periodBalance >= 0 ? 'Dr' : 'Cr'}`}
        </span>
      ),
    },
    {
      dataField: "closingDebit",
      caption: t("closing_debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.closingDebit == 0 || cellElement.data?.closingDebit == null ? '' : cellElement.data.closingDebit < 0 ? getFormattedValue(-1 * cellElement.data.closingDebit) : getFormattedValue(cellElement.data.closingDebit)}`}

        </span>
      ),
    },
    {
      dataField: "closingCredit",
      caption: t("closing_credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.closingCredit == 0 || cellElement.data?.closingCredit == null ? '' : cellElement.data.closingCredit < 0 ? getFormattedValue(-1 * cellElement.data.closingCredit) : getFormattedValue(cellElement.data.closingCredit)}`}
        </span>
      ),
    },
    {
      dataField: "closingBalance",
      caption: t("closing_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data.closingBalance < 0 ? getFormattedValue(-1 * cellElement.data.closingBalance) : getFormattedValue(cellElement.data.closingBalance)} ${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data?.closingBalance >= 0 ? 'Dr' : 'Cr'}`}
        </span>
      ),
    },
    {
      dataField: "isGroup",
      caption: t("is_group"),
      dataType: "boolean",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {cellElement.data.isGroup}
        </span>
      ),
    },
    {
      dataField: "groupNameInArabic",
      caption: t("arabic_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : ''}`}>
          {cellElement.data.groupNameInArabic}
        </span>
      ),
    },
    {
      dataField: "ledgerNameInArabic",
      caption: t("account_name_in_arabic"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {cellElement.data.ledgerNameInArabic}
        </span>
      ),
    },
    {
      dataField: "ledgerCode",
      caption: t("ledger_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
                  remoteOperations={{ filtering: false, paging: false, sorting: false }}
                  filterText="from {asonDate} to {toDate}"
                  gridHeader={t("trial_balance_periodwise")}
                  dataUrl={Urls.acc_reports_trial_balance_detailed}
                  method={ActionType.POST}
                  gridId="grd_trial_balance_detailed"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  filterWidth="100"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<TrialBalancePeriodwiseReportFilter />}
                  filterInitialData={TrialBalancePeriodwiseReportFilterInitialState}
                  onFilterChanged = {(filter: any) => {setFilter(filter)}}
                  childPopupProps={{
                    content: <CashBookMonthWise postData={{filter}}
                    />,
                    title: t("cash_book_monthwise"),
                    isForm: true,
                    width: "mw-100",
                    drillDownCells: "ledgerName",
                    bodyProps: "ledgerID",
                    enableFn: (data: any) => data?.isGroup == false && data?.ledgerName != "TOTAL"
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
export default TrialBalancePeriodwise;