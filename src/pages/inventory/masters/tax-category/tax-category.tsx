import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { TaxCategoryManage } from "./tax-category-manage";
import { toggleTaxCategory } from "../../../../redux/slices/popup-reducer";


const TaxCategory = () => {
  const MemoizedTaxCategoryManage = useMemo(() => React.memo(TaxCategoryManage), []);
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
    },
    {
      dataField: "id",
      caption: t("id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "taxCategoryName",
      caption: t("tax_category_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200
    },
    {
      dataField: "sVatPerc",
      caption: t("s_VAT_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "pVatPerc",
      caption: t("p_VAT_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "sCstPerc",
      caption: t("s_cst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "pCstPerc",
      caption: t("p_cst_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "string",
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
      cellRender: (cellElement: any) => {
        return (
          <ERPGridActions
            view={{ type: "popup", action: () => toggleTaxCategory({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            edit={{ type: "popup", action: () => toggleTaxCategory({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            delete={{
              onSuccess: () => { dispatch(toggleTaxCategory({ isOpen: false, key: null, reload: true, })); },
              confirmationRequired: true,
              confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
              url: Urls?.taxCategory, key: cellElement?.data?.id
            }}
          />
        )
      },
    },
  ], []);

  useEffect(() => {
    dispatch(toggleTaxCategory({ ...rootState, reload: true }));
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
                  gridHeader={t("tax_category")}
                  dataUrl={Urls.taxCategory}
                  gridId="grd_taxCategory"
                  popupAction={toggleTaxCategory}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleTaxCategory({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.taxCategory?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.taxCategory.isOpen || false}
        title={t("tax_category")}
        isForm={true}
        width={600}
        height={320}
        closeModal={() => { dispatch(toggleTaxCategory({ isOpen: false })); }}
        content={<MemoizedTaxCategoryManage />}
      />
    </Fragment>
  );
};
export default React.memo(TaxCategory);