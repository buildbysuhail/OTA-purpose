import React, { Fragment, useCallback, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleUpi } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { UpiManage } from "./upi-manage";
const Upi = () => {

  const MemoizedUpiManage = useMemo(() => React.memo(UpiManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
        dataField: "paymentTypeID",
        caption: t("payment_type_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "branchID",
        caption: t('branch_ID'),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "ledgerID",
        caption: t("ledger_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "paymentType",
        caption: t("payment_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "paymentName",
        caption: t("payment_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "createdUserID",
        caption: t("created_user_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "modifiedUserID",
        caption: t("modified_user_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "remark",
        caption: t("remarks"),
        dataType: "string",
        allowSorting: true,
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
            view={{ type: "popup", action: () => toggleUpi({ isOpen: true, key: cellElement?.data?.paymentTypeID }) }}
            edit={{ type: "popup", action: () => toggleUpi({ isOpen: true, key: cellElement?.data?.paymentTypeID }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              url:Urls?.account_group,key:cellElement?.data?.id
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
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("upi")}
                  dataUrl={Urls.upi}
                  gridId="grd_acc_group"
                  popupAction={toggleUpi}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.accountGroup?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.upi.isOpen || false}
        title={t("upi")}                                                                                    
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleUpi({ isOpen: false, key: null }));
        }}
        content={<MemoizedUpiManage />}
      />
    </Fragment>
  );
};

export default React.memo(Upi);
