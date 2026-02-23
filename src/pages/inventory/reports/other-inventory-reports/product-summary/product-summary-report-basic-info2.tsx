import React, { Fragment } from "react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../../redux/types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
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

const ProductSummaryReport2: React.FC<{
  filter?: ProductSummaryFilter;
  onReloadChange2: () => void;
  reloadBase2: boolean;
  updateFilterWithBatchID: (
    loadedData?: ProductSummaryReport[],
    rowData?: ProductSummaryReport
  ) => void;
}> = ({ filter, onReloadChange2, reloadBase2, updateFilterWithBatchID }) => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();

  const batchInfoColumns: DevGridColumn[] = [
    {
      dataField: "productBatchID",
      caption: t("product_batch_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "sPrice",
      caption: t("s_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.sPrice == null
              ? ""
              : getFormattedValue(cellElement.data.sPrice, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sPrice == null
            ? ""
            : getFormattedValue(cellElement.data.sPrice, false, 2);
        }
      },
    },
    {
      dataField: "stockIn",
      caption: t("stock_in"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockIn == null
              ? ""
              : getFormattedValue(cellElement.data.stockIn, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stockIn == null
            ? ""
            : getFormattedValue(cellElement.data.stockIn, false, 2);
        }
      },
    },
    {
      dataField: "stockOut",
      caption: t("stock_out"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockOut == null
              ? ""
              : getFormattedValue(cellElement.data.stockOut, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stockOut == null
            ? ""
            : getFormattedValue(cellElement.data.stockOut, false, 2);
        }
      },
    },
    {
      dataField: "stock",
      caption: t("stock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stock == null
              ? ""
              : getFormattedValue(cellElement.data.stock, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stock == null
            ? ""
            : getFormattedValue(cellElement.data.stock, false, 2);
        }
      },
    },
    {
      dataField: "wStock",
      caption: t("w_stock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.wStock == null
              ? ""
              : getFormattedValue(cellElement.data.wStock, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.wStock == null
            ? ""
            : getFormattedValue(cellElement.data.wStock, false, 2);
        }
      },
    },
    {
      dataField: "pPrice",
      caption: t("p_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.pPrice == null
              ? ""
              : getFormattedValue(cellElement.data.pPrice, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.pPrice == null
            ? ""
            : getFormattedValue(cellElement.data.pPrice, false, 4);
        }
      },
    },
    {
      dataField: "brandName",
      caption: t("brand_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "batchNo",
      caption: t("batch_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
  ];
  // useEffect(() => {
  //   if (batchID !== null) {
  //     onBatchIDChange(batchID);
  //   }
  // }, [batchID, onBatchIDChange]);
  const onInitialDataLoad = (loadedData: ProductSummaryReport[]) => {
    updateFilterWithBatchID(loadedData);
  };
  const onRowClick = (e: any) => {
    updateFilterWithBatchID(undefined, e.data);
  };
  return (
    <Fragment>
      <div className="grid grid-cols-12">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-0 pb-0">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                key="grd_product_summary_batch_info"
                // summaryItems={batchInfoSummaryItems}
                onInitialDataLoad={onInitialDataLoad}
                onRowClick={onRowClick}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={batchInfoColumns}
                dataUrl={Urls.product_summary_basic_info_batch_details}
                method={ActionType.POST}
                gridId="grd_product_summary_batch_info"
                hideGridAddButton={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                enableScrollButton={false}
                ShowGridPreferenceChooser={true}
                showPrintButton={false}
                postData={filter?.filter}
                reload={reloadBase2}
                changeReload={() => {
                  console.log("onReloadChange2");
                  onReloadChange2 && onReloadChange2();
                }}
                heightToAdjustOnWindows={800}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(ProductSummaryReport2);
