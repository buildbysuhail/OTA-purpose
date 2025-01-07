import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import TrialBalanceReportFilter, { TrialBalanceReportFilterInitialState } from "./trial-balance-report-filter";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
interface TrialBalance {
  from: Date
}
const TrialBalance = () => {
  const [filter, setFilter] = useState<any>(TrialBalanceReportFilterInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const { getFormattedValue } = useNumberFormat()
  const columns: DevGridColumn[] = [
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span style={{color: cellElement.data.isGroup == true ? 'rgb(61 108 161)' : cellElement.data.particulars == "TOTAL" ? 'rgb(241 55 66)' : '' }} className={`${cellElement.data.isGroup == true ? 'font-bold' : cellElement.data.particulars == "TOTAL" ? 'font-bold text-red' : 'pl-4'}`}>
          {/* {cellElement.data.particulars} */}
          {
            cellElement.data.isGroup != true  ? (<DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>) :(<>{cellElement.data.particulars}</>)
          }
          
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
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : ''}`}>
          {cellElement.data.ledgerNameInArabic}
        </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.particulars == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null||cellElement.data.isGroup == true? '0' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.particulars == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "isGroup",
      caption: t("is_group"),
      dataType: "boolean",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green' : cellElement.data.particulars == "TOTAL" ? 'pl-4 font-bold text-red' : ''}`}>
          {cellElement.data.isGroup}
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
                  remoteOperations={{ filtering: false, paging: false, sorting: false }}
                  filterText="as of {asonDate}"
                  gridHeader={t("trial_balance")}
                  dataUrl={Urls.acc_reports_trial_balance}
                  method={ActionType.POST}
                  gridId="grd_trial_balance"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  filterWidth="100"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<TrialBalanceReportFilter />}
                  filterInitialData={TrialBalanceReportFilterInitialState}
                  onFilterChanged = {(filter: any) => {setFilter(filter)}}
                  childPopupProps={{
                    content: <CashBookMonthWise postData={filter}
                    />,
                    title: t("cash_book_monthwise"),
                    isForm: true,
                    width: "mw-100",
                    drillDownCells: "particulars",
                    bodyProps: "ledgerID",
                    origin:"trialBalance",
                    enableFn: (data: any) => data?.isGroup == false && data?.particulars != "TOTAL"
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
export default TrialBalance;