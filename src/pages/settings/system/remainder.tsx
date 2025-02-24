import React, { Fragment, useEffect, useMemo } from "react";
import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleRemainderPopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { RemainderManage } from "./remainder-manage";
import { useTranslation } from "react-i18next";

const Remainders = () => {
  const MemoizedRemainderManage = useMemo(() => React.memo(RemainderManage), []);
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const { t } = useTranslation("system");
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "remaindersID",
      caption: t("remainder_id"),
      dataType: "number",
      allowSorting: true,
      allowFiltering: true,
      width: 150,
      visible: false,
    },
    {
      dataField: "remainderName",
      caption: t("remainder_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      isLocked: true,
      showInPdf: true,
    },
    {
      dataField: "descriptions",
      caption: t("descriptions"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 250,
      showInPdf: true,
    },
    {
      dataField: "remaindingDate",
      caption: t("reminding_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf: true,
    },
    {
      dataField: "numberOfDays",
      caption: t("number_of_days"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      isLocked: false,
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      Actionswidth:100,
      cellRender: (cellElement: any) => {
        return (
          <ERPGridActions
            view={{ type: "popup", action: () => toggleRemainderPopup({ isOpen: true, key: cellElement?.data?.remaindersID, reload: false }) }}
            edit={{ type: "popup", action: () => toggleRemainderPopup({ isOpen: true, key: cellElement?.data?.remaindersID, reload: false }) }}
            delete={{
              onSuccess: () => { dispatch(toggleRemainderPopup({ isOpen: false, key: null, reload: true, })); },
              confirmationRequired: true,
              confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
              url: Urls?.Remainder, key: cellElement?.data?.remaindersID
            }}
          />
        )
      },
    },
  ], []);
  useEffect(() => {
    dispatch(toggleRemainderPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("remainders")}
                  dataUrl={Urls.Remainder}
                  gridId="grd_remainder"
                  popupAction={toggleRemainderPopup}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleRemainderPopup({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.reminder?.reload}
                  gridAddButtonIcon="ri-add-line"
                  ERPGridActionsstyle={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.reminder.isOpen || false}
        title={t("remainders")}
        width={800}
        height={300}
        isForm={true}
        closeModal={() => { dispatch(toggleRemainderPopup({ isOpen: false })); }}
        content={<MemoizedRemainderManage />}
      />
    </Fragment>
  );
};
export default React.memo(Remainders);