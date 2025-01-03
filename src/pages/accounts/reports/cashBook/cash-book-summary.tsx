import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import CashBookReportFilter, { CashBookReportFilterInitialState } from "./cash-book-report-filter";
import CashBookMonthWise from "./cash-book-monthwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const CashBookSummary = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const [isOpenDetails, setIsOpenDetails] = useState<{ isOpen: boolean; key: number; groupName?: string }>({ isOpen: false, key: 0 });
  const [filter, setFilter] = useState<any>(CashBookReportFilterInitialState);
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.ledgerName === "TOTAL" ? (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.ledgerName}
        </span>) :
          <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
      }
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
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
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
        </span>
      ),
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
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
                  filterWidth="100"
                  filterText="As On Date : {asonDate}"
                  gridHeader={t("day_book_summary")}
                  dataUrl={Urls.acc_reports_cash_book}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  enablefilter={true}
                  filterContent={<CashBookReportFilter />}
                  filterInitialData={CashBookReportFilterInitialState}
                  reload={true}
                  hideGridAddButton={true}
                  childPopupProps={{
                    content: <CashBookMonthWise postData={
                      { asOnDate: filter?.asonDate }} />,
                    title: t("cash_book_monthwise"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "ledgerName,",
                    bodyProps: "ledgerID",
                    enableFn: (data: any) => data?.ledgerID != 0
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

export default CashBookSummary;