import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import LedgerReportFilter, { LedgerReportFilterInitialState } from "../ledger-report-filter";


interface BalancesheetDetailsProps {
  postData: any;
  groupName?: string;
}
const BalancesheetDetails:FC<BalancesheetDetailsProps> = ({postData , groupName }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "accGroupName",
      // caption: "accGroupName",
      caption: t("group_name"),

      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 120,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
    },
    {
      dataField: "branch",
      caption:  t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    // {
    //   dataField: "branchID",
    //   caption: "branchID",
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    // {
    //   dataField: "ledgerID",
    //   caption: "ledgerID",
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 170,
    // },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 170,
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
                  gridHeader={groupName}
                  dataUrl= {Urls.acc_reports_account_ledger_balance_view}
                  postData={postData}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  gridId="grd_balancesheet_detals"
                  // reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BalancesheetDetails;