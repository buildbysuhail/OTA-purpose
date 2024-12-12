import { Fragment, useCallback, useEffect, useMemo } from "react";
import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { UserTypeManage } from "./user-type-manage";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";
import React from "react";

const UserTypes = () => {
  const MemoizedUserTypeManage = useMemo(() => React.memo(UserTypeManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("userManage");
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "userTypeName",
      caption: t("usertype"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      isLocked: true,
    },
    {
      dataField: "userTypeCode",
      caption: t("code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => {
        return (
          <ERPGridActions
            view={{ type: "popup", action: () => toggleUserTypePopup({ isOpen: true, key: cellElement?.data?.userTypeCode,reload: false }) }}
            edit={{ type: "popup", action: () => toggleUserTypePopup({ isOpen: true, key: cellElement?.data?.userTypeCode,reload: false }) }}
            delete={{
              onSuccess: () => {
                dispatch(
                  toggleUserTypePopup({
                    isOpen: false,
                    key: null,
                    reload: true,
                  })
                );
              },
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              // action: () => handleDelete(cellInfo?.data?.id),
              url: Urls?.UserTypes, key: cellElement?.data?.userTypeCode
            }}
          />
        )
      },
    }
  ], []);
  useEffect(() => {
    dispatch(toggleUserTypePopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6 bg-[#fafafa]">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            {/* <div className="box-body"> */}
            <div className="grid grid-cols-1 gap-3">
              <ERPDevGrid
                columns={columns}
                gridHeader={t("usertype")}
                dataUrl={Urls.UserTypes}
                gridId="grd_user_type"
                popupAction={toggleUserTypePopup}
                gridAddButtonType="popup"
                changeReload={(reload: any) => {
                  dispatch(
                    toggleUserTypePopup({ ...rootState, reload: reload })
                  );
                }}
                reload={rootState?.PopupData?.userType?.reload}
                gridAddButtonIcon="ri-add-line"
              ></ERPDevGrid>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.userType.isOpen || false}
        title={t("usertype")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleUserTypePopup({ isOpen: false }));
        }}
        content={<MemoizedUserTypeManage />}
      />
    </Fragment>
  );
};
export default React.memo(UserTypes);