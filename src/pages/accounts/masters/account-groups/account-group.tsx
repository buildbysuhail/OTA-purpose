import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleAccountGroupPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import {  useAppDispatch,  useAppSelector,} from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { AccountGroupManage } from "./account-group-manage";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
const AccountGroupType = () => {
  const MemoizedAccountGroupManage = useMemo(
    () => React.memo(AccountGroupManage),
    []
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation("masters");
  const rootState = useRootState();
  const _rootState = useAppSelector((state: RootState) => state.PopupData);
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "siNo",
        caption: t("SiNo"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        isLocked: true,
        showInPdf:true,
      },
      {
        dataField: "id",
        caption: t("id"),
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
        showInPdf:true,
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
        showInPdf:true,
      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "isEditable",
        caption: t("is_editable"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "isDeletable",
        caption: t("is_deletable"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "isProtected",
        caption: t("is_protected"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
      },
      {
        dataField: "isCommon",
        caption: t("is_common"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
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
        visible:false,
      },
      {
        dataField: "parentGroupId",
        caption: t("parent_group_id"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible: false,
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        visible:false,
      },
      {
        dataField: "displayOrder",
        caption: t("display_order"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
      },
      {
        dataField: "actions",
        caption: t("actions"),
        isLocked: true,
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any, cellInfo: any) => {
          return (
            <ERPGridActions
              view={{
                type: "popup",
                action: () =>
                  toggleAccountGroupPopup({
                    isOpen: true,
                    key: cellElement?.data?.id,
                    reload: false,
                  }),
              }}
              edit={{
                type: "popup",
                action: () =>
                  toggleAccountGroupPopup({
                    isOpen: true,
                    key: cellElement?.data?.id,
                    reload: false,
                  }),
                // , visible:cellElement?.data?.isEditable == true
              }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleAccountGroupPopup({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                visible: cellElement?.data?.isDeletable == true,
                confirmationRequired: true,
                confirmationMessage:
                  "Are you sure you want to delete this item?",
                url: Urls?.account_group,
                key: cellElement?.data?.id,
              }}
            />
          );
        },
      },
    ],
    []
  );
  useEffect(() => {
    dispatch(toggleAccountGroupPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("acc_group")}
                dataUrl={Urls.account_group}
                gridId="grd_acc_group"
                popupAction={toggleAccountGroupPopup}
                gridAddButtonType="popup"
                changeReload={(reload: any) => {
                  dispatch(
                    toggleAccountGroupPopup({ ...rootState, reload: reload })
                  );
                }}
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
          dispatch(toggleAccountGroupPopup({ isOpen: false, key: null, reload: false }));
        }}
        content={<MemoizedAccountGroupManage />}
      />
    </Fragment>
  );
};

export default React.memo(AccountGroupType);
