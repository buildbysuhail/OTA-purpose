import React, { Fragment } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { ProductSummaryFilter } from "./product-summary-master";

interface ProductSummaryReport {
  productID: string;
  productCode: string;
  productName: string;
  groupName: string;
  stockIn: number;
  stockOut: number;
  stock: number;
  productCategoryName: string;
  supplyMethod: string;
  hsnCode: string;
  commodityCode: string;
  remarks: string;
  taxCategoryName: string;
  unitName: string;
  marginPercentage: number;
  itemType: string;
}

interface ProductSummaryReport {
  productBatchID: number;
  autoBarcode: string;
  sPrice: number;
  stockIn: number;
  stockOut: number;
  stock: number;
  wStock: number;
  pPrice: number;
  brandName: string;
  batchNo: string;
}

const ProductSummaryReport1: React.FC<{filter?:ProductSummaryFilter; 
  onReloadChange: () => void; 
  reloadBase: boolean; 
  }> = ({ filter, onReloadChange, reloadBase}) => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();

  const basicInfoColumns: DevGridColumn[] = [
    {
      dataField: "productID",
      caption: t("product_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "stockIn",
      caption: t("stock_in"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "stockOut",
      caption: t("stock_out"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "stock",
      caption: t("stock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productCategoryName",
      caption: t("product_category_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "supplyMethod",
      caption: t("supply_method"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "hsnCode",
      caption: t("hsn_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "commodityCode",
      caption: t("commodity_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "taxCategoryName",
      caption: t("tax_category_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "marginPercentage",
      caption: t("margin_percentage"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "itemType",
      caption: t("item_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    }
  ];
  
  
  
  const customizeSummaryRow = (itemInfo: { value: any }) => {
    const value = itemInfo.value;
    if (value === null || value === undefined || value === "" || isNaN(value)) {
      return "0";
    }
    return getFormattedValue(value) || "0";
  };

  const basicInfoSummaryItems: SummaryConfig[] = [
    {
      column: "stockIn",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stockOut",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stock",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
              key="product_summary_basic_info"
                summaryItems={basicInfoSummaryItems}

                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={basicInfoColumns}
                gridHeader={t("product_summary_basic_info")}
                dataUrl={Urls.product_summary_basic_info}
                method={ActionType.POST}
                gridId="grd_product_summary_basic_info"
                hideGridAddButton={true}
                postData={filter?.filter}
                reload={reloadBase}
                changeReload={onReloadChange}
                heightToAdjustOnWindows={800}
              />
            </div>
          </div>
        </div>
      
      </div>
    </Fragment>
  );
};

export default React.memo(ProductSummaryReport1);