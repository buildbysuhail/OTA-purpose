import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import IncomeExpenseStatementFilter, { IncomeExpenseStatementFilterInitialState } from "./income-expense-statement-filter";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";

const IncomExpenseStatement = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const [filter, setFilter] = useState<any>(IncomeExpenseStatementFilterInitialState);
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "accGroupID",
      caption: t('accGroupID'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span  className={`${ cellElement.data.isGroup?'font-bold text-[#2E8B57]' :cellElement.data.isSubGroup? 'font-bold text-[#DC143C]':''}`}>
          {cellElement.data.accGroupID}
        </span>
      ),
    },
    {
      dataField: "ledgerID",
      caption: t('ledgerID'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf:true,
    },
    {
      dataField: "accGroupName",
      caption: t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span  className={`${ cellElement.data.isGroup?'font-bold text-[#2E8B57]' :cellElement.data.isSubGroup? 'pl-6 font-bold text-[#DC143C]':''}`}>
          {cellElement.data.accGroupName}
        </span>
      ),
    },
    {
      dataField: "ledgerCode",
      caption: t("code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span  className={`${ cellElement.data.isGroup?'font-bold text-[#2E8B57]' :cellElement.data.isSubGroup? 'font-bold text-[#DC143C]':''}`}>
      {`${cellElement.data?.debit == null||cellElement.data?.debit==0 ? '' : getFormattedValue(cellElement.data.debit)}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span  className={`${ cellElement.data.isGroup?'font-bold text-[#2E8B57]' :cellElement.data.isSubGroup? 'font-bold text-[#DC143C]':''}`}>
        {`${cellElement.data?.credit == null ||cellElement.data?.credit == 0? '' : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span
        className={`${ cellElement.data.isGroup?'font-bold text-[#2E8B57]' :cellElement.data.isSubGroup? 'font-bold text-[#DC143C]':''}`}
        >
          {`${cellElement.data?.balance == null
            ? ''
            : cellElement.data.balance < 0
              ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
              : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
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
                 remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  allowGrouping={true}
                  columns={columns}
                  filterText="from {fromDate} to {toDate} "
                  gridHeader={t("income_expense_statement")}
                  dataUrl={Urls.acc_reports_income_expense_statement }
                  method={ActionType.POST}
                  gridId="grd_expense_report"
                  popupAction={toggleCostCentrePopup}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth="100"
                  filterContent={<IncomeExpenseStatementFilter />}
                  filterInitialData={IncomeExpenseStatementFilterInitialState}
                  hideGridAddButton={true}
                  reload={true}
                  childPopupProps={{
                    content: <CashBookMonthWise postData={
                     {asonDate: filter.toDate,fromDate:filter.fromDate} 
                      }
                    />,
                    title: t("cash_book_monthwise"),
                    isForm: true,
                    width: "mw-100",
                    drillDownCells: "ledgerID",
                    bodyProps: "ledgerID",
                    
                    enableFn: (data: any) => data.ledgerID<=0 ? false  : true
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
export default IncomExpenseStatement;