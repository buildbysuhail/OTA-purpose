import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import CollectionReportFilter, {  IncomeReportFilterInitialState } from "./income-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import IncomeReportFilter from "./income-report-filter";
import ExpenseReportFilter, { ExpenseReportFilterInitialState } from "./expense-report-filter";

const ExpenseReport = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  // const [filter, setFilter] = useState<IncomeRepor>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t('sl_no'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "accGroupName",
      caption: t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.accGroupName}
        </span>
      ),
    },
    {
      dataField: "ledger",
      caption: t("ledger"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-red' : ''}`}>
      {`${cellElement.data?.debit == null ? '0' : getFormattedValue(cellElement.data.debit)}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-red' : ''}`}>
        {`${cellElement.data?.credit == null ? '0' : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span
          className={`${"font-bold text-red"
            }`}
        >
          {`${cellElement.data?.balance == null
            ? '0'
            : cellElement.data.balance < 0
              ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
              : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
        </span>
      ),
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
    },
    {
      dataField: "costCentreName",
      caption: t("cost_centre_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
                  allowGrouping={true}
                  columns={columns}
                  gridHeader={t("expense_report")}
                  dataUrl={Urls.acc_reports_income_expense_report }
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<ExpenseReportFilter />}
                  filterInitialData={ExpenseReportFilterInitialState}
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
export default ExpenseReport;