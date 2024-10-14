import React, { Fragment, useCallback, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleBankCardsPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { AccountGroupManage } from "../account-groups/account-group-manage";
import { useTranslation } from "react-i18next";
import { BankCardsManage } from "./bank-cards-manage";

const AccountGroupType = () => {

  const MemoizedBankCardsManage = useMemo(() => React.memo(BankCardsManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();

  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "s.No",
    //   caption: t("SiNo"),
      caption: ("Payment Type ID"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    //   isLocked: true,
    },
    {
      dataField: "id",
    //   caption: t('id'),
      caption: ('Branch ID'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "accGroupName",
    //   caption: t("acc_group"),
      caption:("Ledger ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "shortName",
    //   caption: t("short_name"),
      caption: ("Payment Type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "parentGroup",
      caption: t("parent_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "remarks",
    //   caption: t("remarks"),
      caption: ("Payment Name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "isEditable",
    //   caption: t("is_editable"),
      caption: ("Created User ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "isDeletable",
    //   caption: t("is_deletable"),
      caption: ("Created Date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "isProtected",
    //   caption: t("is_protected"),
      caption: ("Modified User ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "isCommon",
    //   caption: t("is_common"),
      caption: ("Modified Date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "createdUser",
    //   caption: t("created_user"),
      caption: ("Remark"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
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
            view={{ type: "popup", action: () => toggleBankCardsPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            edit={{ type: "popup", action: () => toggleBankCardsPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              // action: () => handleDelete(cellInfo?.data?.id),
            }}
          />
        )
      },
    }
  ], []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                //   gridHeader={t("acc_group")}
                  gridHeader={"Bank Cards"}
                  dataUrl={Urls.account_group}
                  gridId="grd_acc_group"
                  popupAction={toggleBankCardsPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.accountGroup?.reload}
                  gridAddButtonIcon=""
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.accountGroup.isOpen || false}
        // title={t("acc_group")}
        title={"Bank Cards"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBankCardsPopup({ isOpen: false, key: null }));
        }}
        content={<BankCardsManage />}
      />
    </Fragment>
  );
};

export default React.memo(AccountGroupType);
