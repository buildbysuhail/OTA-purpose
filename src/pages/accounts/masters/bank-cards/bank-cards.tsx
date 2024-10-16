import React, { Fragment, useCallback, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleBankCardsPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { BankCardsManage } from "./bank-cards-manage";

const BankCards = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "paymentTypeID",
      caption: ("Payment Type ID"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "branchID",
      caption: ('Branch ID'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "ledgerID",
      caption: ("Ledger ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "paymentType",
      caption: ("Payment Type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "paymentName",
      caption: "Payment Name",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "createdUserID",
      caption: ("createdUserID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "createdDate",
      caption: ("Created Date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "modifiedUserID",
      caption: ("Modified User ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "modifiedDate",
      caption: ("Modified Date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "remark",
      caption: ("Remark"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleBankCardsPopup({ isOpen: true, key: cellInfo?.data?.paymentTypeID }) }}
          edit={{ type: "popup", action: () => toggleBankCardsPopup({ isOpen: true, key: cellInfo?.data?.paymentTypeID }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url: Urls?.data_bankcards,
            key: cellElement?.data?.paymentTypeID,
          }}
        />
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={"Bank Cards"}
                  dataUrl={Urls.data_bankcards}
                  gridId="grd_bank_cards"
                  popupAction={toggleBankCardsPopup}
                  gridAddButtonType="popup"
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

export default BankCards;
