import React, { Fragment, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleBankCardsPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { BankCardsManage } from "./bank-cards-manage";

const BankCards = () => {
  const MemoizedBankCardsManage = useMemo(() => React.memo(BankCardsManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("masters");
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
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
      visible:false
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
      minWidth: 150,
      showInPdf:true,
    },
    {
      dataField: "paymentName",
      caption: t("payment_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
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
      isLocked:true,
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleBankCardsPopup({ isOpen: true, key: cellElement?.data?.paymentTypeID,reload: false }) }}
          edit={{ type: "popup", action: () => toggleBankCardsPopup({ isOpen: true, key: cellElement?.data?.paymentTypeID,reload: false }) }}
          delete={{
            onSuccess: () => {
              dispatch(
                toggleBankCardsPopup({
                  isOpen: false,
                  key: null,
                  reload: true,
                })
              );
            },
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url: Urls?.bankCards,
            key: cellInfo?.data?.paymentTypeID
          }}
        />
      ),
    },
  ];
  useEffect(() => {
    dispatch(toggleBankCardsPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("bank_cards")}
                  dataUrl={Urls.bankCards}
                  gridId="grd_bank_cards"
                  popupAction={toggleBankCardsPopup}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleBankCardsPopup({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.bankCard?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.bankCard.isOpen || false}
        title={t("bank_cards")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBankCardsPopup({ isOpen: false, key: null,reload: false }));
        }}
        content={<MemoizedBankCardsManage />}
      />
    </Fragment>
  );
};
export default React.memo(BankCards);