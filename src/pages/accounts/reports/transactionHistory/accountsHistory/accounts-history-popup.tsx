import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";

interface AccountsHistoryPopupProps {
  contentProps?: any
  enablefilter?: boolean;
}
const AccountsHistoryPopup = ({contentProps}:AccountsHistoryPopupProps) => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "vchNo",
      caption:  t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
    },
    {
      dataField: "accountName",
      caption: t("account_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "oldAccTransactionMasterID",
      caption: t("oldAccTransactionMasterId"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "accTransactionMasterID",
      caption: t("accTransactionMasterId"),
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
                heightToAdjustOnWindows={window.innerHeight-649}
                  columns={columns}
                  gridHeader={t("accounts_transaction_history_popup")}
                  dataUrl= {Urls.acc_reports_accounts_history_popup}
                  method={ActionType.POST}
                  postData ={contentProps.oldAccTransactionMasterID!=0?contentProps:null}
                  gridId="grd_accounts_history_popup"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                    childPopupProps={{
                      content: <AccountsHistoryPopup/>,
                      title: t("accounts_transaction_history_popup"),
                      isForm: false,
                      width: "mw-100",
                      drillDownCells: "vchNo",
                      bodyProps: "oldAccTransactionMasterID"
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

export default AccountsHistoryPopup;