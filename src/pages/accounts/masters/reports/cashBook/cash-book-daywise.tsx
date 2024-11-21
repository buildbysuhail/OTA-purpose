import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import CashBookDetailed from "./cash-book-detailed";
interface CashBookMonthDayWiseProps {
  contentProps?: any
  enablefilter?: boolean;
}
const CashBookDayWise = ({contentProps, enablefilter = false}:CashBookMonthDayWiseProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // const [filter, setFilter] =useState<CashBookDayWise>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "monthBal",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },

    {
      dataField: "closingBalance",
      caption: t("closing_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
                  gridHeader={t("cash_book_daywise")}
                  dataUrl= {Urls.acc_reports_cash_book_daywise}
                  method={ActionType.POST}
                  postData = {contentProps}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  childPopupProps={{
                    content: <CashBookDetailed/>,
                    title: t("cash_book_detailed"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "transactionDate",
                    bodyProps: "transactionDate,year,monthNum,ledgerID",
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

export default CashBookDayWise;