import React, { Fragment, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleProducts } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ProductMaster, { } from "./products-manage";


const Products = () => {

  const MemoizedProductsManage = useMemo(() => React.memo(ProductMaster), []);
  const { t } = useTranslation('inventory');
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() =>
    [
      {
        dataField: "siNo",
        caption: t("si_no"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
      },
      {
        dataField: "productId",
        caption: t("product_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
      },
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "product",
        caption: t("product"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "category",
        caption: t("category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "taxCategory",
        caption: t("tax_category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "unit",
        caption: t("unit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "brandName",
        caption: t("brand_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "isActive",
        caption: t("is_active"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "reOrderLevel",
        caption: t("re_order_level"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "reOrderQty",
        caption: t("re_order_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "canSell",
        caption: t("can_sell"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "canPurchase",
        caption: t("can_purchase"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "canManufacture",
        caption: t("can_manufacture"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "itemAlias",
        caption: t("item_alias"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "itemType",
        caption: t("item_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "commodityCode",
        caption: t("commodity_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "productGroupId",
        caption: t("product_group_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "taxCategoryId",
        caption: t("tax_category_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "basicUnitId",
        caption: t("basic_unit_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "productCategoryId",
        caption: t("product_category_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "batchCriteria",
        caption: t("batch_criteria"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "hsnCode",
        caption: t("hsn_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "stockMin",
        caption: t("stock_min"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "stockMax",
        caption: t("stock_max"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "isRawMaterial",
        caption: t("is_raw_material"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "isFinishedGood",
        caption: t("is_finished_good"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "unitQty",
        caption: t("unit_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "packingSlip",
        caption: t("packing_slip"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "mannualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "isWeighingScale",
        caption: t("is_weighing_scale"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "batchNo",
        caption: t("batch_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "netWt",
        caption: t("net_wt"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
      },
      {
        dataField: "unitName",
        caption: t("unit_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true
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
              view={{ type: "popup", action: () => toggleProducts({ isOpen: true, key: cellElement?.data?.productId, reload: false }) }}
              edit={{ type: "popup", action: () => toggleProducts({ isOpen: true, key: cellElement?.data?.productId, reload: false }) }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleProducts({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                confirmationRequired: true,
                confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
                url: Urls?.products, key: cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(toggleProducts({ ...rootState, reload: true }));
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
                  gridHeader={t("products")}
                  dataUrl={Urls.products}
                  gridId="grd_products"
                  popupAction={toggleProducts}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleProducts({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.products?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.products.isOpen || false}
        title={t("products")}
        width={1200}
        isForm={true}
        closeModal={() => { dispatch(toggleProducts({ isOpen: false })); }}
        content={<MemoizedProductsManage />}
      />
    </Fragment>
  );
};
export default React.memo(Products);
