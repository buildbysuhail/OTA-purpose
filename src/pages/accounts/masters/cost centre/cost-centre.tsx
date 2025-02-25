import React, { Fragment, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { CostCentreManage } from "./cost-centre-manage";

const CostCentre = () => {
  const MemoizedCostCentreManage = useMemo(() => React.memo(CostCentreManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("masters");
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "costCentreID",
      caption: t('cost_centre_id'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      visible: false,
    },
    {
      dataField: "costCentreName",
      caption: t('cost_centre_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      showInPdf: true
    },
    {
      dataField: "shortName",
      caption: t("short_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      showInPdf: true,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 220,
      showInPdf: true,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      isLocked: true,
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 180,
      Actionswidth:100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: true, key: cellElement?.data?.costCentreID, reload: false }) }}
          edit={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: true, key: cellElement?.data?.costCentreID, reload: false }) }}
          delete={{
            onSuccess: () => { dispatch(toggleCostCentrePopup({ isOpen: false, key: null, reload: true, })); },
            confirmationRequired: true,
            confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
            url: Urls?.cost_center,
            key: cellElement?.data?.costCentreID,
          }}
        />
      ),
    },
  ];
  useEffect(() => { dispatch(toggleCostCentrePopup({ ...rootState, reload: true })); }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("cost_centre")}
                  dataUrl={Urls.cost_center}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleCostCentrePopup({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.costCentre?.reload}
                  gridAddButtonIcon="ri-add-line"
                  ERPGridActionsstyle={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.costCentre.isOpen || false}
        title={t("cost_centre")}
        width={600}
        height={315}
        isForm={true}
        closeModal={() => { dispatch(toggleCostCentrePopup({ isOpen: false, key: null, reload: false })); }}
        content={<MemoizedCostCentreManage />}
      />
    </Fragment>
  );
};
export default React.memo(CostCentre);