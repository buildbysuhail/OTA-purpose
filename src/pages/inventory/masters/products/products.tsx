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
        allowFiltering: false,
        showInPdf:true,
        width: 50,
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 50
      },
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100,
      },
      {
        dataField: "product",
        caption: t("product"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "category",
        caption: t("category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "taxCategory",
        caption: t("tax_category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "unit",
        caption: t("unit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "brandName",
        caption: t("brand_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "isActive",
        caption: t("is_active"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "reOrderLevel",
        caption: t("re_order_level"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "reOrderQty",
        caption: t("re_order_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "canSell",
        caption: t("can_sell"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "canPurchase",
        caption: t("can_purchase"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "canManufacture",
        caption: t("can_manufacture"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "itemAlias",
        caption: t("item_alias"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "itemType",
        caption: t("item_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "commodityCode",
        caption: t("commodity_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "productGroupID",
        caption: t("product_group_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "taxCategoryID",
        caption: t("tax_category_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "basicUnitID",
        caption: t("basic_unit_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "productCategoryID",
        caption: t("product_category_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "batchCriteria",
        caption: t("batch_criteria"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "hsnCode",
        caption: t("hsn_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "stockMin",
        caption: t("stock_min"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "stockMax",
        caption: t("stock_max"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "isRawMaterial",
        caption: t("is_raw_material"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "isFinishedGood",
        caption: t("is_finished_good"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "unitQty",
        caption: t("unit_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "packingSlip",
        caption: t("packing_slip"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "mannualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
      },
      {
        dataField: "isWeighingScale",
        caption: t("is_weighing_scale"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "batchNo",
        caption: t("batch_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "netWt",
        caption: t("net_wt"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible:false,
        width: 100
      },
      {
        dataField: "unitName",
        caption: t("unit_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
        width: 100
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
              view={{ type: "popup", action: () => toggleProducts({ isOpen: true, key: cellElement?.data?.productID, reload: false }) }}
              edit={{ type: "popup", action: () => toggleProducts({ isOpen: true, key: cellElement?.data?.productID, reload: false }) }}
              delete={{
                
                onSuccess: () => { dispatch(toggleProducts({ isOpen: false, key: null, reload: true, })); },
                confirmationRequired: true,
                confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
                url: Urls?.products, key: cellElement?.data?.productID
              }}
            />
          )
        },
      },
    ], []);

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
                  initialSort={[{ selector: "productCode", desc: false }]}
                  gridId="grd_products"
                  popupAction={toggleProducts}
                  gridAddButtonType="popup"
                allowExport={true}
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
        height={820}
        closeModal={() => { dispatch(toggleProducts({ isOpen: false })); }}
        content={<MemoizedProductsManage />}
      />
    </Fragment>
  );
};
export default React.memo(Products);
