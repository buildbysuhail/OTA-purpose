import { Fragment } from "react";
import Urls from "../../../redux/urls";

import { Link } from "react-router-dom";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleFinancialYearPopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { FinancialYearManage } from "./financial-year-manage";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";

// import { UserTypeManage } from './user-type-manage';

const FinancialYear = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: "Serial Number",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      isLocked: true,
    },
    {
      dataField: "fromDate",
      caption: "From Date",
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "toDate",
      caption: "To Date",
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "status",
      caption: "Status",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "remarks",
      caption: "Remarks",
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "visibleOnStartup",
      caption: "Visible on Startup",
      dataType: "boolean",
      allowSorting: true,
      allowSearch: false,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "createdUser",
      caption: "Created By",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "createdDate",
      caption: "Created Date",
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "modifiedUser",
      caption: "Modified By",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "modifiedDate",
      caption: "Modified Date",
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "id",
      caption: "ID",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      isLocked: true,
    },
    {
      dataField: "openingStockValue",
      caption: "Opening Stock Value",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
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
        debugger;
        return (
          <ERPGridActions
            view={{ type: "popup", action: toggleFinancialYearPopup }}
            edit={{ type: "popup", action: toggleFinancialYearPopup }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              // action: () => handleDelete(cellInfo?.data?.id),
            }}
            itemId={cellElement?.data?.userTypeCode || ""}
          />
        );
      },
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("financial_year")}
                  dataUrl={Urls.FinancialYear}
                  gridId="grd_financial_year"
                  popupAction={toggleFinancialYearPopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.financialYear.isOpen || false}
        title={t("financial_year")}
        width="w-full max-w-[60rem]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleFinancialYearPopup({ isOpen: false }));
        }}
        content={<FinancialYearManage itemKey={rootState.PopupData.financialYear.key}/>}
      />
    </Fragment>
  );
};

export default FinancialYear;
