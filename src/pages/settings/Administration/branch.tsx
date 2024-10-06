import React, { Fragment, useEffect, useMemo, useState } from "react";

import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import {toggleBranchGridPopup,} from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";
import BranchManage from "./branch-info-manage";
import { BranchGridManage } from "./branch-manage";

const BranchGrid = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
      {
        dataField:"branchCode",
        caption: "Branch Code",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField:"branchName",
        caption: "Branch Name",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"companyID",
        caption: "Company ID",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField:"country",
        caption: "Country",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"bState",
        caption: "State",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"district",
        caption: "District",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"city",
        caption: "City",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"address1",
        caption: "Address1",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"address2",
        caption: "Address2",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
   
      {
        dataField:"pinCode",
        caption: "Pin Code",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"mobile",
        caption: "Mobile",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"phone",
        caption: "Phone",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"email",
        caption: "Email",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
      },
      {
        dataField:"fax",
        caption: "Fax",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"tin",
        caption: "TIN",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"registrationNumber",
        caption: "Registration Number",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"createdDate",
        caption: "Created Date",
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"modifiedDate",
        caption: "Modified Date",
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"remarks",
        caption: "Remarks",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField:"actions",
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
                    confirmationMessage: "Are you sure you want to delete this item?",
                    url:Urls?.Branch,key:cellElement?.data?.branchID
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
                  gridHeader="Branch"
                  dataUrl={Urls.Branch}
                  gridId="grd_branch"
                  popupAction={toggleBranchGridPopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.branchGrid.isOpen || false}
        title={"Branch"}
        isForm={true}
        width="w-full max-w-[800px]"
        closeModal={() => {
          dispatch(toggleBranchGridPopup({ isOpen: false }));
        }}
        content={<BranchGridManage/>}
      />
    </Fragment>
  );
};

export default React.memo(BranchGrid);
