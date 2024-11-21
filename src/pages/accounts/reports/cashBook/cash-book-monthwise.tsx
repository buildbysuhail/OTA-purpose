import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashBookDayWise from "./cash-book-daywise";

interface CashBookMonthWiseProps {
  contentProps?: any
  enablefilter?: boolean;
}
// interface CashBookMonthWiseFilters {
//   from: Date
// }
const CashBookMonthWise = ({contentProps, enablefilter = false}:CashBookMonthWiseProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // const [filter, setFilter] =useState<CashBookMonthWiseFilters>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    // {
    //   dataField: "siNo",
    //   caption: t('si_no'),
    //   dataType: "number",
    //   allowSearch: true, 
    //   allowFiltering: true,
    //   width: 80,
    // },
    {
      dataField: "year",
      caption: t("year"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      visible:false,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "monthNum",
      caption: t("month_num"),
      dataType: "number",
      visible:false,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "month",
      caption: t("month"),
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
      width: 200,
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
    },
    {
      dataField: "monthBal",
      caption: t("month_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
    },
    {
      dataField: "closingBalance",
      caption:  t("closing_balance"),
      dataType: "number",
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
                  dataUrl= {Urls.acc_reports_cash_book_monthwise}
                  method={ActionType.POST}
                  postData = {contentProps}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                  // CashBookMonthWise
                  childPopupProps={{
                    content: <CashBookDayWise />,
                    title: t("cash_book_daywise"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "month",
                    bodyProps: "year,monthNum,ledgerID",
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

export default CashBookMonthWise;