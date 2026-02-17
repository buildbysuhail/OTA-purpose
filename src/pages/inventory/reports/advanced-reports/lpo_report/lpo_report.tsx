import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import GridId from "../../../../../redux/gridId";
import LPOReportFilter, { LPOReportFilterInitialState, } from "./lpo_report-filter";

const LPOReport = () => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = [
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 90,
    },
    {
      dataField: "mannualBarcode",
      caption: t("manual_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 150,
    },
    {
      dataField: "stock",
      caption: t("stock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stock == null
              ? 0
              : getFormattedValue(cellElement.data.stock, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stock == null
            ? 0
            : getFormattedValue(cellElement.data.stock, false, 4);
        }
      },
    },
    {
      dataField: "reOrderQty",
      caption: t("re_order_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.reOrderQty == null
              ? 0
              : getFormattedValue(cellElement.data.reOrderQty, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.reOrderQty == null
            ? 0
            : getFormattedValue(cellElement.data.reOrderQty, false, 4);
        }
      },
    },
    {
      dataField: "stockMin",
      caption: t("stock_min"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockMin == null
              ? 0
              : getFormattedValue(cellElement.data.stockMin, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stockMin == null
            ? 0
            : getFormattedValue(cellElement.data.stockMin, false, 4);
        }
      },
    },
    {
      dataField: "stockMax",
      caption: t("stock_max"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockMax == null
              ? 0
              : getFormattedValue(cellElement.data.stockMax, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stockMax == null
            ? 0
            : getFormattedValue(cellElement.data.stockMax, false, 4);
        }
      },
    },
    {
      dataField: "salesPrice",
      caption: t("sales_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.salesPrice == null
              ? 0
              : getFormattedValue(cellElement.data.salesPrice, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.salesPrice == null
            ? 0
            : getFormattedValue(cellElement.data.salesPrice, false, 4);
        }
      },
    },
    {
      dataField: "purchasePrice",
      caption: t("purchase_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.purchasePrice == null
              ? 0
              : getFormattedValue(cellElement.data.purchasePrice, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.purchasePrice == null
            ? 0
            : getFormattedValue(cellElement.data.purchasePrice, false, 4);
        }
      },
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.mrp == null
              ? 0
              : getFormattedValue(cellElement.data.mrp, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.mrp == null
            ? 0
            : getFormattedValue(cellElement.data.mrp, false, 4);
        }
      },
    },
    {
      dataField: "supplier",
      caption: t("supplier"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 150,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                filterText="{supplierID > 0 &&  Supplier : [supplier]}
                {supplierID <= 0 &&  All Suppliers}
                {productID > 0 &&   Product : [product]}
                {productID <= 0 &&  All Products}
                {productGroupID > 0 &&   Group : [productGroup]}
                {productGroupID <= 0 &&   All Groups}
                {productCategoryID > 0 &&   Category : [productCategory]}
                {productCategoryID <= 0 &&    All Category}"
                gridHeader={t("lpo_report")}
                dataUrl={Urls.lpo_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<LPOReportFilter />}
                filterWidth={700}
                filterHeight={200}
                filterInitialData={LPOReportFilterInitialState}
                reload={true}
                gridId={GridId.lpo_report}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default LPOReport;
