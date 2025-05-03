import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { toggleTaxCategoryIndia } from "../../../../redux/slices/popup-reducer";
import { TaxCategoryManageIndia } from "./tax-category-manage-india";

const TaxCategoryIndia = () => {
  const MemoizedTaxCategoryManage = useMemo(() => React.memo(TaxCategoryManageIndia), []);
  const { t } = useTranslation('inventory');
  const dispatch = useAppDispatch();
  const rootState = useRootState();

  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "siNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf: true
    },
    {
      dataField: "taxCategoryID",
      caption: t("id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      visible: false
    },
    {
      dataField: "taxCategoryName",
      caption: t("tax_category_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      showInPdf: true
    },
    {
      dataField: "s_SGSTPerc",
      caption: t("s_sgst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "p_SGSTPerc",
      caption: t("p_sgst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "s_CGSTPerc",
      caption: t("s_cgst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "p_CGSTPerc",
      caption: t("p_cgst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "s_IGSTPerc",
      caption: t("s_igst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "p_IGSTPerc",
      caption: t("p_igst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "s_CessPerc",
      caption: t("s_cess_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "p_CessPerc",
      caption: t("p_cess_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "s_CalamityCessPerc",
      caption: t("s_calamity_cess"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "p_CalamityCessPerc",
      caption: t("p_calamity_cess"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "s_AdditionalCessPerc",
      caption: t("s_additional_cess"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "p_AdditionalCessPerc",
      caption: t("p_additional_cess"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "createdUser",
      caption: t("created_by"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: false
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "datetime",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_by"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: false
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "datetime",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false
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
            view={{ type: "popup", action: () => toggleTaxCategoryIndia({ isOpen: true, key: cellElement?.data?.taxCategoryID, reload: false }) }}
            edit={{ type: "popup", action: () => toggleTaxCategoryIndia({ isOpen: true, key: cellElement?.data?.taxCategoryID, reload: false }) }}
            delete={{
              onSuccess: () => { dispatch(toggleTaxCategoryIndia({ isOpen: false, key: null, reload: true, })); },
              confirmationRequired: true,
              confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
              url: Urls?.gstCategory, key: cellElement?.data?.taxCategoryID
            }}
          />
        )
      },
    },
  ], []);

  useEffect(() => {
    dispatch(toggleTaxCategoryIndia({ ...rootState, reload: true }));
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
                  gridHeader={t("gst_category")}
                  dataUrl={Urls.gstCategory}
                  gridId="grd_gstCategory"
                  popupAction={toggleTaxCategoryIndia}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleTaxCategoryIndia({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.taxCategoryIndia?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.taxCategoryIndia.isOpen || false}
        title={t("gst_category")}
        isForm={true}
        width={600}
        height={440}
        closeModal={() => { dispatch(toggleTaxCategoryIndia({ isOpen: false })); }}
        content={<MemoizedTaxCategoryManage />}
      />
    </Fragment>
  );
};

export default React.memo(TaxCategoryIndia);