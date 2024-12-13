import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { togglePrivilegeCardPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { PrivilegeCardManage } from "./privilege-card-manage";
import { useTranslation } from "react-i18next";

const PrivilegeCard = () => {
  const MemoizedPrivilegeCardrManage = useMemo(() => React.memo(PrivilegeCardManage), []);
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const { t } = useTranslation("masters");
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "privilegeCardsID",
      caption: t("privilege_card_id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "branchID",
      caption: t("branch_ID"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "cardNumber",
      caption: t("card_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "cardHolderName",
      caption: t("card_holder_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "phone",
      caption: t("phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "mobile",
      caption: t("mobile"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    // {
    //   dataField: "email",
    //   caption: t("email"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    // {
    //   dataField: "dob",
    //   caption: t("date_of_birth"),
    //   dataType: "date",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    // {
    //   dataField: "changeID",
    //   caption: t("change_ID"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    {
      dataField: "cardType",
      caption: t("card_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    // {
    //   dataField: "priceCategoryID",
    //   caption: t("price_category_ID"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 170,
    // },
    {
      dataField: "priceCategoryName",
      caption: t("price_category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "expiryDate",
      caption: t("expiry_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "activatedDate",
      caption: t("activate_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    // {
    //   dataField: "createdUserID",
    //   caption: t("created_user_ID"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    {
      dataField: "oBalance",
      caption: t("opening_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => togglePrivilegeCardPopup({ isOpen: true, key: cellElement?.data?.privilegeCardsID,reload: false }) }}
          edit={{ type: "popup", action: () => togglePrivilegeCardPopup({ isOpen: true, key: cellElement?.data?.privilegeCardsID,reload: false }) }}
          delete={{
            onSuccess: () => {
              dispatch(
                togglePrivilegeCardPopup({
                  isOpen: false,
                  key: null,
                  reload: true,
                })
              );
            },
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url: Urls?.account_privilege_card,
            key: cellElement?.data?.privilegeCardsID
          }}
        />
      ),
    },
  ], [t]);
  useEffect(() => {
    dispatch(togglePrivilegeCardPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("privilege_card")}
                  dataUrl={Urls.account_privilege_card}
                  gridId="grd_privilege_card"
                  popupAction={togglePrivilegeCardPopup}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      togglePrivilegeCardPopup({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.privilegeCard?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.privilegeCard.isOpen || false}
        title={t("privilege_card")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null,reload: false }));
        }}
        content={<MemoizedPrivilegeCardrManage />}
      />
    </Fragment>
  );
};
export default React.memo(PrivilegeCard);