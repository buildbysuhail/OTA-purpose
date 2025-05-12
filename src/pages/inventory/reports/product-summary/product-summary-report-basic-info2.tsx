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
      showInPdf:true,
    },
    {
      dataField: "sPrice",
      caption: t("s_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
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
      showInPdf:true,
    },
    {
      dataField: "wStock",
      caption: t("w_stock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "pPrice",
      caption: t("p_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "brandName",
      caption: t("brand_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "batchNo",
      caption: t("batch_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    }
  ];
  // useEffect(() => {
  //   if (batchID !== null) {
  //     onBatchIDChange(batchID);
  //   }
  // }, [batchID, onBatchIDChange]);
  const onInitialDataLoad = (loadedData: ProductSummaryReport[]) => { updateFilterWithBatchID(loadedData); };
  const onRowClick = (e: any) => { updateFilterWithBatchID(undefined, e.data); };
  const customizeSummaryRow = (itemInfo: { value: any }) => {
    const value = itemInfo.value;
    if (value === null || value === undefined || value === "" || isNaN(value)) {
      return "0";
    }
    return getFormattedValue(value) || "0";
  };

  const batchInfoSummaryItems: SummaryConfig[] = [
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
                key="grd_product_summary_batch_info"
                summaryItems={batchInfoSummaryItems}
                onInitialDataLoad={onInitialDataLoad}
                onRowClick={onRowClick}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
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
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
                postData={filter?.filter}
                reload={reloadBase2}
                changeReload={() => {
                  console.log('onReloadChange2');
                  onReloadChange2 && onReloadChange2();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(ProductSummaryReport2);