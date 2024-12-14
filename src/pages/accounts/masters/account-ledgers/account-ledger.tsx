import React, { Fragment, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleAccountLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { AccountLedgerManage } from "./account-ledger-manage";
import { useTranslation } from "react-i18next";

const AccountLedgerType = () => {
  const MemoizedAccountLedgerManage = useMemo(() => React.memo(AccountLedgerManage), []);
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
      showInPdf:true,
    },
    {
      dataField: "id",
      caption: t('id'),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "ledgerCode",
      caption: t('ledger_code'),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
      showInPdf:true,
    },
    {
      dataField: "ledger",
      caption: t('ledger'),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "accountGroup",
      caption: t("acc_group"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "aliasName",
      caption: t("alias_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      showInPdf:true
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
      dataField: "isEditable",
      caption: t("is_editable"),
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
      dataField: "accountGroupID",
      caption: t("account_group_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false
    },
    {
      dataField: "isBillwiseApplicable",
      caption: t("is_billwise_applicable"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false,
    },
    {
      dataField: "isActive",
      caption: t("is_active"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true
    },
    {
      dataField: "isCostCentreApplicable",
      caption: t("is_cost_center_applicable"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
      dataField: "actions",
      caption: t("actions"),
      isLocked: true,
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleAccountLedgerPopup({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
          edit={{ type: "popup", action: () => toggleAccountLedgerPopup({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
          delete={{
            onSuccess: () => {
              dispatch(
                toggleAccountLedgerPopup({
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
            url: Urls?.account_ledger,
            key: cellElement?.data?.id,
          }}
        />
      ),
    },
  ], [t]);
  useEffect(() => {
    dispatch(toggleAccountLedgerPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("acc_ledger")}
                dataUrl={Urls.account_ledger}
                gridId="grd_user_type"
                popupAction={toggleAccountLedgerPopup}
                gridAddButtonType="popup"
                changeReload={(reload: any) => { dispatch(toggleAccountLedgerPopup({ ...rootState, reload: reload })) }}
                reload={rootState?.PopupData?.accountLedger?.reload}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}>
              </ErpDevGrid>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.accountLedger.isOpen || false}
        title={t("acc_ledger")}
        width="w-full max-w-[700px]"
        isForm={true}
        closeModal={() => { dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null, reload: false })); }}
        content={<MemoizedAccountLedgerManage />}
      />
    </Fragment>
  );
};

export default React.memo(AccountLedgerType);