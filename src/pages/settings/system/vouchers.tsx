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
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo( () => [
    {
      dataField: "siNo",
      caption: "Serial No",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "voucherType",
      caption: "Voucher Type",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "formType",
      caption: "Form Type",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "lastVoucherPrefix",
      caption: "LastVoucher Prefix",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "lastVoucherNumber",
      caption: "LastVoucher Number",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "descriptions",
      caption: "Descriptions",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "id",
      caption: "Id",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "printDesignFileName",
      caption: "PrintDesign FileName",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "createdUser",
      caption: "CreatedUser",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "createdDate",
      caption: "Created Date",
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "modifiedUser",
      caption: "Modified User",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "modifiedDate",
      caption: "Modified Date",
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },

    {
      dataField: "defaultVoucher",
      caption: "default Voucher",
      dataType: "boolean",
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
      cellRender: (cellElement: any) => {
        return (
          <ERPGridActions
            view={{ type: "popup", action: () => toggleVoucherPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            edit={{ type: "popup", action: () => toggleVoucherPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              // action: () => handleDelete(cellInfo?.data?.id),
            }}
          />
        )
      },
    },
  ],[]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader="Voucher"
                  dataUrl={Urls.Voucher}
                  gridId="grd_voucher"
                  popupAction={toggleVoucherPopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.voucher.isOpen || false}
        title={"Add New Voucher"}
        isForm={true}
        width="w-full max-w-[600px]"
        closeModal={() => {
          dispatch(toggleVoucherPopup({ isOpen: false }));
        }}
        content={<VoucherManage/>}
      />
    </Fragment>
  );
};

export default SystemVoucher;
