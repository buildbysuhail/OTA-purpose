import React, { Fragment, useEffect, useMemo, useState } from "react";

import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleBranchGridPopup, } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";
import BranchManage from "./branch-info-manage";
import { BranchGridManage } from "./branch-manage";

const BranchGrid = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "branchCode",
      caption: t("branch_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "companyID",
      caption: t("company_id"),
      dataType: "number",
      visible:false,
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "country",
      caption: t("country"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "bState",
      caption: t("state"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "district",
      caption: t("district"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "city",
      caption: t("city"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },

    {
      dataField: "pinCode",
      caption: t("pin_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "mobile",
      caption: t("mobile"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "phone",
      caption: t("phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "email",
      caption: t("email"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "fax",
      caption: t("fax"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false
    },
    {
      dataField: "tin",
      caption: t("tin"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false
    },
    {
      dataField: "registrationNumber",
      caption: t("registration_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      visible:false
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
            view={{ type: "popup", action: () => toggleBranchGridPopup({ isOpen: true, key: cellElement?.data?.branchID }) }}
            edit={{ type: "popup", action: () => toggleBranchGridPopup({ isOpen: true, key: cellElement?.data?.branchID }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: t("delete_this_item"),
              url: Urls?.Branch, key: cellElement?.data?.branchID
            }}
          />
        )
      },
    },
  ],
    []
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("branch")}
                  dataUrl={Urls.Branch}
                  gridId="grd_branch"
                  popupAction={toggleBranchGridPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.branch?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.branchGrid.isOpen || false}
        title={t("branch")}
        isForm={true}
        width="w-full max-w-[800px]"
        closeModal={() => {
          dispatch(toggleBranchGridPopup({ isOpen: false }));
        }}
        content={<BranchGridManage />}
      />
    </Fragment>
  );
};

export default React.memo(BranchGrid);
