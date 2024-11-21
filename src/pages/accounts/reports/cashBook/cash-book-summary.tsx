import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashBookMonthWise from "./cash-book-monthwise";
import LedgerReportFilter from "../ledger-report-filter";
import CashBookDayWise from "./cash-book-daywise";
import CashBookReportFilter, { CashBookReportFilterInitialState } from "./cash-book-report-filter";

interface CashBookSummary {
  from: Date
}
const CashBookSummary = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<CashBookSummary>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    // {
    //   dataField: "SiNo",
    //   caption: t('si_no'),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 80,
    // },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.ledgerName}
  </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
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
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
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
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.balance}
  </span>
      ),
    },
    
    {
      dataField: "branch",
      caption:  t("branch"),
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
                showSerialNo={true}
                  columns={columns}
                  gridHeader={t("cash_book")}
                  dataUrl= {Urls.acc_reports_cash_book}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true} 
                  enablefilter={true}
                  filterContent={<CashBookReportFilter/>}
                  filterInitialData={CashBookReportFilterInitialState}
                  childPopupProps={{
                    content: <CashBookMonthWise />,
                    title: t("cash_book_monthwise"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "ledgerName",
                    bodyProps: "ledgerID"
                    
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