import { Fragment, useState } from "react";
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

interface AccountPayableAgingReport {
  from: Date
}
const AccountPayableAgingReport = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<AccountPayableAgingReport>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('si_no'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "ledgername",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 220,
    },
    {
      dataField: "Debit",
      caption: t('debit'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "Credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "period1",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "period2",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "period3",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    
    // {
    //   dataField: "actions",
    //   caption: t("actions"),
    //   allowSearch: false,
    //   allowFiltering: false,
    //   fixed: true,
    //   fixedPosition: "right",
    //   width: 180,
    //   cellRender: (cellElement: any, cellInfo: any) => (
    //     <ERPGridActions
    //       view={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
    //       edit={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
    //       delete={{
    //         confirmationRequired: true,
    //         confirmationMessage: "Are you sure you want to delete this item?",
    //         // action: () => handleDelete(cellInfo?.data?.id),
    //       }}
    //     />
    //   ),
    // },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("account_payable_aging_report")}
                  dataUrl={Urls.acc_reports_aging_payable}
                  method={ActionType.POST}
                  postData={filter}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // gridAddButtonType="popup"
                  reload={true}
                  gridAddButtonIcon=""
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Fragment>
  );
};

export default AccountPayableAgingReport;