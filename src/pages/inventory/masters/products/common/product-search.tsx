import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

const searchOptions = [
  { id: "Product", name: "Product" },
  { id: "ProductCode", name: "ProductCode" },
  { id: "GroupName", name: "GroupName" },
  { id: "ManualBarcode", name: "ManualBarcode" },
  { id: "Unit", name: "Unit" },
];

const initialSearchData = {
  searchOption: "Product",
  searchText: "",
  searchInactive: false,
};

const SearchCommon: React.FC<{  isMaximized?: boolean;modalHeight?: any,isGlobal?:boolean}> =React.memo(({ isMaximized,modalHeight,isGlobal }) => {
  const { t } = useTranslation("inventory");
       const { getFormattedValue } = useNumberFormat();
           const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });
               useEffect(() => {
                 let gridHeightMobile = modalHeight - 500;
                 let gridHeightWindows = modalHeight -(isGlobal?500:330) ;
                 setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
               }, [isMaximized, modalHeight]);
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "siNo",
        caption: t("si_no"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
        showInPdf:true
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
        visible:false
      },
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "product",
        caption: t("product"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "category",
        caption: t("category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "taxCategory",
        caption: t("tax_category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "unit",
        caption: t("unit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.salesPrice == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.salesPrice),
                    false,
                    4
                  );
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesPrice == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.salesPrice),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
        cellRender: (
          cellElement: any,
          cellInfo: any
        ) => {
          
            return cellElement.data?.purchasePrice == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.purchasePrice),
                  false,
                  4
                );
          
              }
      },
      {
        dataField: "brandName",
        caption: t("brand_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
        cellRender: (
          cellElement: any,
          cellInfo: any
        ) => {
          
            return cellElement.data?.stock == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.stock),
                  false,
                  4
                );
          
              }
      },
      {
        dataField: "isActive",
        caption: t("is_active"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true
      },
      {
        dataField: "reOrderLevel",
        caption: t("re_order_level"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
        cellRender: (
          cellElement: any,
          cellInfo: any
        ) => {
          
            return cellElement.data?.reOrderLevel == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.reOrderLevel),
                  false,
                  4
                );
          
              }
      },
      {
        dataField: "reOrderQty",
        caption: t("re_order_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
        cellRender: (
          cellElement: any,
          cellInfo: any
        ) => {
          
            return cellElement.data?.reOrderQty == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.reOrderQty),
                  false,
                  4
                );
          
              }
      },
      {
        dataField: "canSell",
        caption: t("can_sell"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "canPurchase",
        caption: t("can_purchase"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "canManufacture",
        caption: t("can_manufacture"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "itemAlias",
        caption: t("item_alias"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "itemType",
        caption: t("item_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "commodityCode",
        caption: t("commodity_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "productGroupId",
        caption: t("product_group_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "taxCategoryId",
        caption: t("tax_category_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "basicUnitId",
        caption: t("basic_unit_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "productCategoryId",
        caption: t("product_category_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "batchCriteria",
        caption: t("batch_criteria"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "hsnCode",
        caption: t("hsn_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "stockMin",
        caption: t("stock_min"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
        cellRender: (
          cellElement: any,
          cellInfo: any
        ) => {
          
            return cellElement.data?.stockMin == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.stockMin),
                  false,
                  4
                );
          
              }
      },
      {
        dataField: "stockMax",
        caption: t("stock_max"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
        cellRender: (
          cellElement: any,
          cellInfo: any
        ) => {
          
            return cellElement.data?.stockMax == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.stockMax),
                  false,
                  4
                );
          
              }
      },
      {
        dataField: "isRawMaterial",
        caption: t("is_raw_material"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "isFinishedGood",
        caption: t("is_finished_good"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "unitQty",
        caption: t("unit_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "packingSlip",
        caption: t("packing_slip"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "mannualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "isWeighingScale",
        caption: t("is_weighing_scale"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "batchNo",
        caption: t("batch_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "netWt",
        caption: t("net_wt"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
        cellRender: (
          cellElement: any,
          cellInfo: any
        ) => {
          
            return cellElement.data?.netWt == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.netWt),
                  false,
                  4
                );
          
              }
      },
      {
        dataField: "unitName",
        caption: t("unit_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
    ],
    []
  );

  return (
    <div className="border border-gray-200 rounded-md px-4 pb-4 pt-1">
      <ErpDevGrid
        columns={columns}
        gridHeader={t("products")}
        dataUrl={Urls.products}
        initialSort={[{ selector: "productCode", desc: false }]}
        gridId="grd_products"
        hideGridAddButton
        gridAddButtonType="popup"
        gridAddButtonIcon="ri-add-line"
        heightToAdjustOnWindowsInModal={gridHeight.windows}
      />
    </div>
  );
});

export default SearchCommon;
