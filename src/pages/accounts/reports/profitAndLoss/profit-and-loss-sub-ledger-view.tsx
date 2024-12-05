import { FC,   useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useSearchParams } from "react-router-dom";


interface ProfitAndLossSubledgerwiseViewProps {
  postData: any;
  // accGroupID: isOpenDetails.key,
  //             expAccGroupID:0,
  //             dateFrom: filter.fromDate,
  //             asOnDate: filter.toDate,
  groupName?: string;
}


const ProfitAndLossSubledgerwiseView:FC<ProfitAndLossSubledgerwiseViewProps> = ({postData , groupName }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "branchID",
      caption: t('branch_id'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "accGroupName",
      caption:  t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      width: 150,
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
      width: 150,
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
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.balance}
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
                  gridHeader={groupName}
                  dataUrl= {Urls.acc_reports_account_ledger_balance_view_sub_group_inc}
                  postData={postData}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={true}
                  method={ActionType.POST}
   
                  gridId="grd_profit_and_loss_detailed"
                  // popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  // gridAddButtonType="popup"
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

export default ProfitAndLossSubledgerwiseView;