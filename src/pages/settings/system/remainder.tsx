import React, { Fragment, useMemo } from "react";
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
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] =useMemo( () => [
    {
      dataField: "remaindersID",
      caption: t("remainder_id"),
      dataType: "number",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: true,
    },
    {
      dataField: "remainderName",
      caption: t("remainder_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      isLocked: true,
    },
    {
      dataField: "descriptions",
      caption: t("descriptions"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "remaindingDate",
      caption: t("reminding_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "numberOfDays",
      caption: t("number_of_days"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },

    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => {
        return (
          <ERPGridActions
            view={{ type:"popup", action: () => toggleRemainderPopup({ isOpen: true, key: cellElement?.data?.remaindersID }) }}
            edit={{ type:"popup", action: () => toggleRemainderPopup({ isOpen: true, key: cellElement?.data?.remaindersID }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              url:Urls?.Remainder,key:cellElement?.data?.remaindersID 
            }}
          />
        )
      },
    },
  ],[]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("remainders")}
                  dataUrl={Urls.Remainder}
                  gridId="grd_remainder"
                  popupAction={toggleRemainderPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.reminder?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.reminder.isOpen || false}
        title={t("remainders")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleRemainderPopup({ isOpen: false }));
        }}
        content={<RemainderManage/>}
      />
    </Fragment>
  );
};

export default React.memo(Remainders);
