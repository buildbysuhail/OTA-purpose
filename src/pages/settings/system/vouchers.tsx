import React, { Fragment, useEffect, useMemo, useState } from "react";

import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleVoucherPopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";
import { VoucherManage } from "./voucher-manage";

const SystemVoucher = () => {
  const MemoizedVoucherManage = useMemo(() => React.memo(VoucherManage), []);
  const { t } = useTranslation("system");
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      isLocked:true,
      showInPdf:true,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "formType",
      caption: t("form_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      showInPdf:true,
    },
    {
      dataField: "lastVoucherPrefix",
      caption: t("lastVoucher_prefix"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      showInPdf:true,
    },
    {
      dataField: "lastVoucherNumber",
      caption: t("lastVoucher_number"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      showInPdf:true,
    },
    {
      dataField: "descriptions",
      caption: t("descriptions"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false,
    },
    {
      dataField: "id",
      caption: t("id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      visible:false,
    },
    {
      dataField: "printDesignFileName",
      caption: t("printDesign_fileName"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible: false,
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible: false
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      visible: false
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      visible: false
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      visible: false
    },

    {
      dataField: "defaultVoucher",
      caption: t("default_voucher"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      visible:false,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      isLocked:false,
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => {
        return (
          <ERPGridActions
            view={{ type: "popup", action: () => toggleVoucherPopup({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            edit={{ type: "popup", action: () => toggleVoucherPopup({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
          // delete={{
          //   confirmationRequired: true,
          //   confirmationMessage: "Are you sure you want to delete this item?",
          //   // url:Urls?.UserTypes,key:cellElement?.data?.id   (voucher have no delete)
          // }}
          />
        )
      },
    },
  ], []);
  useEffect(() => {
    dispatch(toggleVoucherPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("voucher")}
                  dataUrl={Urls.Voucher}
                  gridId="grd_voucher"
                  popupAction={toggleVoucherPopup}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleVoucherPopup({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.voucher?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.voucher.isOpen || false}
        title={t("voucher")}
        isForm={true}
        width="w-full max-w-[600px]"
        closeModal={() => { dispatch(toggleVoucherPopup({ isOpen: false, key: null,reload: false })); }}
        content={<MemoizedVoucherManage />}
      />
    </Fragment>
  );
};
export default React.memo(SystemVoucher);