import React, { Fragment, useCallback, useEffect, useMemo } from "react";
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
import { Countries } from "../../../../redux/slices/user-session/reducer";
const Upi = () => {

  const MemoizedUpiManage = useMemo(() => React.memo(UpiManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("masters");
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
      visible:false,
    },
    {
      dataField: "branchID",
      caption: t('branch_ID'),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      visible:false,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_ID"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false,
    },
    {
      dataField: "bank",
      caption: t("bank"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      showInPdf:true,
    },
    {
      dataField: "paymentType",
      caption: t("payment_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "paymentName",
      caption: t("payment_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      showInPdf:true,
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
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
      dataField: "modifiedUser",
      caption: t("modified_user"),
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
      showInPdf:true,
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
            view={{ type: "popup", action: () => toggleUpi({ isOpen: true, key: cellElement?.data?.paymentTypeID,reload: false }) }}
            edit={{ type: "popup", action: () => toggleUpi({ isOpen: true, key: cellElement?.data?.paymentTypeID,reload: false }) }}
            delete={{
              onSuccess: () => {
                dispatch(
                  toggleUpi({
                    isOpen: false,
                    key: null,
                    reload: true,
                  })
                );
              },
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              url: Urls?.account_group, key: cellElement?.data?.paymentTypeID
            }}
          />
        )
      },
    }
  ], []);
  useEffect(() => {
    dispatch(toggleUpi({ ...rootState, reload: true }));
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
                  gridHeader={rootState.UserSession.countryId == Countries.India ? t("upi") : t("qr_pay")}
                  dataUrl={Urls.upi}
                  gridId="grd_acc_group"
                  popupAction={toggleUpi}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleUpi({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.upi?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.upi.isOpen || false}
        title={rootState.UserSession.countryId == Countries.India ? t("upi") : t("qr_pay")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleUpi({ isOpen: false, key: null,reload: false }));
        }}
        content={<MemoizedUpiManage />}
      />
    </Fragment>
  );
};
export default React.memo(Upi);