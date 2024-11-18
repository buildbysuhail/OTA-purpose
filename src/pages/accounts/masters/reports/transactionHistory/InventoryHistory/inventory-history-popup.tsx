import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../../redux/urls";
import { ActionType } from "../../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../../redux/slices/popup-reducer";

interface InventoryHistoryPopup {

  from: Date
}
const InventoryHistoryPopup = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<InventoryHistoryPopup>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("si_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
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
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "oldInvTransactionID",
      caption: t("old_invTransaction_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false
    },
    {
      dataField: "invTransactionMasterID",
      caption: t('invTransaction_master_id'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false
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
                  gridHeader={t("inventory_transaction_history_popup")}
                  dataUrl= {Urls.acc_reports_inventory_history_popup}
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

export default InventoryHistoryPopup;