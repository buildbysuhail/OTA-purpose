import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { toggleProductCategory } from "../../../../redux/slices/popup-reducer";
import { ProductCategoryManage } from "./product-category-manage";


const ProductCategory = () => {
  
const MemoizedProductCategoryManage = useMemo(() => React.memo(ProductCategoryManage), []);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo( () => [
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
        dataField: "productCategoryCode",
        caption: t("category_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        visible:false
      },
      {
        dataField: "productCategoryName",
        caption: t("category_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200
      },
      {
        dataField: "shortName",
        caption: t("short_name"),
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
        width:150
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "modifiedUser",
        caption: t("modified_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:150

      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "isCommon",
        caption: t("is_common"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
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
              view={{ type: "popup", action: () => toggleProductCategory({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              edit={{ type: "popup", action: () => toggleProductCategory({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              delete={{
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.productCategory,key:cellElement?.data?.id
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
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("product_category")}
                  dataUrl={Urls.productCategory}
                  gridId="grd_productCategory"
                  popupAction={toggleProductCategory}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.productCategory?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.productCategory.isOpen || false}
        title={t("product_category")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleProductCategory({ isOpen: false }));
        }}
        content={<MemoizedProductCategoryManage/>}
      />
    </Fragment>
  );
};
export default React.memo(ProductCategory);