import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import Urls from "../../../redux/urls";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { toggleUserPopup } from "../../../redux/slices/popup-reducer";
import { UserManage } from "./user-manage";

const Users = () => {
  const MemoizedUsersManage = useMemo(() => React.memo(UserManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("userManage");
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: false,
      width: 60,
    },
    {
      dataField: "id",
      caption: t("id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
      visible: false
    },
    {
      dataField: "user",
      caption: t("user"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "password",
      caption: t("password"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 140,
    },
    {
      dataField: "counter",
      caption: t("counter"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "userType",
      caption: t("usertype"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
      visible: false,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
      visible: false
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
      visible: false,
    },
    {
      dataField: "employeeID",
      caption: t("employee_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "employeeName",
      caption: t("employee_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "maxDiscPercAllowed",
      caption: t("max_dis%"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "passkey",
      caption: t("passkey"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
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
            view={{ type: "popup", action: () => toggleUserPopup({ isOpen: true, key: cellElement?.data?.user,reload: false }) }}
            edit={{ type: "popup", action: () => toggleUserPopup({ isOpen: true, key: cellElement?.data?.user,reload: false }) }}
          // delete={{
          //   confirmationRequired: true,
          //   confirmationMessage: "Are you sure you want to delete this item?",
          //   url:Urls?.Users,key:cellElement?.data?.user
          // }}
          //user can't delete
          />
        )
      },
    }
  ], []);
  useEffect(() => {
    dispatch(toggleUserPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6 bg-[#fafafa]">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("users")}
                dataUrl={Urls.Users}
                gridId="grd_users"
                popupAction={toggleUserPopup}
                gridAddButtonType="popup"
                changeReload={(reload: any) => {
                  dispatch(
                    toggleUserPopup({ ...rootState, reload: reload })
                  );
                }}
                reload={rootState?.PopupData?.user?.reload}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
              ></ErpDevGrid>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.user.isOpen || false}
        title={t("users")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleUserPopup({ isOpen: false, key: null,reload: false }));
        }}
        content={<MemoizedUsersManage />}
      />
    </Fragment>
  );
};
export default React.memo(Users);