import React, { Fragment, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { toggleFinancialYearPopup } from "../../../redux/slices/popup-reducer";
import Urls from "../../../redux/urls";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { FinancialYearManage } from "./financial-year-manage";
const FinancialYear = () => {

  const MemoizedFinancialYearManage = useMemo(() => React.memo(FinancialYearManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();

  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      isLocked: true,
    },
    {
      dataField: "id",
      caption: t("id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      isLocked: false,
    },
    {
      dataField: "fromDate",
      caption: t("from_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "toDate",
      caption: t("to_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "status",
      caption: t("status"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "visibleOnStartup",
      caption: t("visible_on_startup"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: false,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "createdUser",
      caption: t("created_by"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      visible:false
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_by"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      visible:false
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false
    },
    {
      dataField: "openingStockValue",
      caption: t("opening_stock_value"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
            view={{ type: "popup", action: () => toggleFinancialYearPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            edit={{ type: "popup", action: () => toggleFinancialYearPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              url:Urls?.FinancialYear,key:cellElement?.data?.id
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
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("financial_year")}
                  dataUrl={Urls.FinancialYear}
                  gridId="grd_fin_year"
                  popupAction={toggleFinancialYearPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.financialYear?.reload}
                  gridAddButtonIcon=""
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.financialYear.isOpen || false}
        title={t("financial_year")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleFinancialYearPopup({ isOpen: false, key: null }));
        }}
        content={<MemoizedFinancialYearManage />}
      />
    </Fragment>
  );
};

export default React.memo(FinancialYear);
