import React, { Fragment, useCallback, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleAccountGroupPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { AccountGroupManage } from "./account-group-manage";
import { useTranslation } from "react-i18next";
const AccountGroupType = () => {
  const MemoizedAccountGroupManage = useMemo(() => React.memo(AccountGroupManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("masters");
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "siNo",
      caption: t("SiNo"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      isLocked: true,
    },
    {
      dataField: "id",
      caption: t('id'),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      visible: false,
    },
    {
      dataField: "accountGroup",
      caption: t("acc_group"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200
    },
    {
      dataField: "shortName",
      caption: t("short_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,

    },
    {
      dataField: "parentGroup",
      caption: t("parent_group"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "isEditable",
      caption: t("is_editable"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,

    },
    {
      dataField: "isDeletable",
      caption: t("is_deletable"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,

    },
    {
      dataField: "isProtected",
      caption: t("is_protected"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,

    },
    {
      dataField: "isCommon",
      caption: t("is_common"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,

    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,

    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,

    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,

    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "reasonForModification",
      caption: t("reason_for_modification"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "parentGroupId",
      caption: t("parent_group_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false
    },
    {
      dataField: "arabicName",
      caption: t("arabic_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "displayOrder",
      caption: t("display_order"),
      dataType: "number",
      allowSorting: true,
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
            view={{ type: "popup", action: () => toggleAccountGroupPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            edit={{
              type: "popup", action: () => toggleAccountGroupPopup({ isOpen: true, key: cellElement?.data?.id })
              // , visible:cellElement?.data?.isEditable == true
            }}
            delete={{
              visible: cellElement?.data?.isDeletable == true,
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              url: Urls?.account_group, key: cellElement?.data?.id
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
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("acc_group")}
                dataUrl={Urls.account_group}
                gridId="grd_acc_group"
                popupAction={toggleAccountGroupPopup}
                gridAddButtonType="popup"
                reload={rootState?.PopupData?.accountGroup?.reload}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
              ></ErpDevGrid>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.accountGroup.isOpen || false}
        title={t("acc_group")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
        }}
        content={<MemoizedAccountGroupManage />}
      />
    </Fragment>
  );
};

export default React.memo(AccountGroupType);
