import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../redux/types";
import { useSearchParams } from "react-router-dom";

interface TrialBalance {

  from: Date
}
const TrialBalance = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<TrialBalance>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
     {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSearch: true,
      visible:false,
      allowFiltering: true,
      width: 150,
    },

    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green-500 text-lg' : ''}`}>
  {cellElement.data.particulars}
</span>
      ),
    },
    {
      dataField: "groupNameInArabic",
      caption: t("arabic_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green-500 text-lg' : ''}`}>
  {cellElement.data.groupNameInArabic}
</span>
      ),
    },
    {
      dataField: "ledgerNameInArabic",
      caption: t("account_name_in_arabic"),
      dataType: "string", 
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-green-500 text-lg' : ''}`}>
  {cellElement.data.ledgerNameInArabic}
</span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "isGroup",
      caption: t("is_group"),
      dataType: "boolean",
      allowSearch: true,
      visible:false,
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
                  remoteOperations={{filtering:false,paging:false,sorting:false}}
                  gridHeader={t("trial_balance")}
                  dataUrl= {Urls.acc_reports_trial_balance}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
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

export default TrialBalance;