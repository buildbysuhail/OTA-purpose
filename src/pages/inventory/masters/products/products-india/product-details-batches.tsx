import React, { useMemo, useCallback } from "react";
import { PathValue, productDto, ProductFieldPath } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { toggleAccountGroupPopup } from "../../../../../redux/slices/popup-reducer";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { APIClient } from "../../../../../helpers/api-client";
import Urls from "../../../../../redux/urls";

const api = new APIClient();
const ProductDetailsBatches: React.FC<{
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;
  t: any;
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ handleFieldChange, t, getFieldProps }) => {

  const columns: DevGridColumn[] = useMemo(() => [
    { dataField: "batchNo", caption: t("Batch No"), width: 60, dataType: "string" },
    { dataField: "autoBarcode", caption: t("Auto Barcode"), width: 70, dataType: "string" },
    { dataField: "mannualBarcode", caption: t("Manual Barcode"), width: 70, dataType: "string" },
    { dataField: "godown", caption: t("Godown"), width: 75, dataType: "string" },
    { dataField: "stdSalesPrice", caption: t("Sales Rate"), width: 75, dataType: "number", alignment: "right" },
    { dataField: "minSalePrice", caption: t("Min Sale Price"), width: 75, dataType: "number", alignment: "right" },
    { dataField: "mrp", caption: t("MRP"), width: 100, dataType: "number", alignment: "right" },
    { dataField: "specification", caption: t("Specification"), width: 100, dataType: "string" },
    { dataField: "defSalesUnitId", caption: t("DefSalesUnitID"), width: 100, dataType: "number", alignment: "center" },
    { dataField: "defPurchaseUnitId", caption: t("DefPurchaseUnitID"), width: 100, dataType: "number", alignment: "center" },
    { dataField: "defReportUnitId", caption: t("DefReportUnitID"), width: 100, dataType: "number", alignment: "center" },
    { dataField: "mfgDate", caption: t("Mfg Date"), width: 100, dataType: "date" },
    { dataField: "expiryDate", caption: t("Expiry Date"), width: 100, dataType: "date" },
    { dataField: "productBatchId", caption: t("ProductBatchID"), width: 100, visible: false, dataType: "number" },
    { dataField: "productId", caption: t("ProductID"), width: 100, visible: false, dataType: "number" },
    { dataField: "brandId", caption: t("BrandID"), width: 100, visible: false, dataType: "number" },
    { dataField: "shelfId", caption: t("ShelfID"), width: 100, visible: false, dataType: "number" },
    { dataField: "warehouseId", caption: t("WarehouseID"), width: 100, visible: false, dataType: "number" },
    { dataField: "openingStock", caption: t("OpeningStock"), width: 100, dataType: "number", alignment: "right" },
    { dataField: "isActive", caption: t("IsActive"), width: 100, visible: false, dataType: "boolean", alignment: "center" },
    { dataField: "unit2SalesPrice", caption: t("Unit2SalesPrice"), width: 100, visible: false, dataType: "number", alignment: "right" },
    { dataField: "unit3SalesPrice", caption: t("Unit3SalesPrice"), width: 100, visible: false, dataType: "number", alignment: "right" },
    { dataField: "location", caption: t("Location"), width: 100, dataType: "string" },
    { dataField: "lastPurchasePrice", caption: t("LastPurchasePrice"), width: 100, dataType: "number", alignment: "right" },
    { dataField: "displayCost", caption: t("DisplayCost"), width: 100, visible: false, dataType: "number", alignment: "right" },
    { dataField: "apc", caption: t("APC"), width: 100, dataType: "string" },
    { dataField: "stock", caption: t("Stock"), width: 100, dataType: "number", alignment: "right" },
  ], [t]);


  // ✅ Handle cell click
  // const handleCellClick = useCallback(
  //   (e: any) => {
  //     if (e?.data) {
  //       // You can change this to set individual fields if needed
  //       handleFieldChange("batch", e.data);
  //     }
  //   },
  //   [handleFieldChange]
  // );
  const appSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const { getFormattedValue } = useNumberFormat()
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  return (
    <ErpDevGrid
      columns={columns}
      height={300}
      gridHeader=""
      hideGridAddButton={true}
      data={getFieldProps("batches").value}
      gridId="grd_acc_group"
      popupAction={toggleAccountGroupPopup}
      gridAddButtonType="popup"
      gridAddButtonIcon="ri-add-line"
      pageSize={40}
      // onCellClick={handleCellClick}
      onSelectionChanged={async(e) => {
        debugger;
        const obj = getFieldProps("*") as any as productDto;
        const modifiedData = {...obj};
        const row = e.selectedRowsData[0];

        if (!row) return;
      
        modifiedData.batch.productBatchID = row.productBatchID;
          modifiedData.batch.warehouseID = +row.warehouseID || 0;
          modifiedData.product.stdSalesPrice = +row.stdSalesPrice || 0;
          modifiedData.product.mrp = +row.mrp || 0;
          modifiedData.product.stdPurchasePrice = +row.stdPurchasePrice || 0;
          modifiedData.batch.msp = +row.minSalePrice || 0;
          modifiedData.batch.brandID = +row.brandID || 0;
          modifiedData.batch.displayCost = +row.displayCost === 0 ? +row.purchasePrice : +row.displayCost;
        
          modifiedData.batch.autoBarcode = row.autoBarcode?.toString() || "";
          modifiedData.batch.batchNo = row.batchNo?.toString() || "";
          modifiedData.batch.manualBarcode = row.mannualBarcode?.toString() || "";
          modifiedData.batch.openingStock = +row.openingStock || 0;
          
          modifiedData.batch.stock = parseFloat(getFormattedValue((row.stock || 0),false,3));
          modifiedData.batch.aPC = row.apc?.toString() || "";
          modifiedData.batch.specification = row.specification?.toString() || "";
          modifiedData.batch.isActive = Boolean(row.isActive);

          modifiedData.batch.defSalesUnitID = +row.defSalesUnitID || 0;
          modifiedData.batch.defPurchaseUnitID = +row.defPurchaseUnitID || 0;
          modifiedData.batch.defReportUnitID = +row.defReportUnitID || 0;

          modifiedData.batch.expiryDate = row.expiryDate ? new Date(row.expiryDate) : undefined;
          modifiedData.batch.mfgDate = row.mfgDate ? new Date(row.mfgDate) : undefined;
          
          modifiedData.batch.location = row.location?.toString() || "";
if(!modifiedData.elements) {
  modifiedData.elements = {flavorVisible: false, hasDisabled: false, mbVisible: false};
}
          modifiedData.elements.flavorVisible = true;
          modifiedData.elements.mbVisible = true;
          if(appSettings.productsSettings.allowMultiUnits) {

            const qString = new URLSearchParams({ productBatchID: row.productBatchID }).toString();
            const units = await api.getAsync(`${Urls.products}SelectProductUnits`, qString);
            handleFieldChange("units", units??[])
          }

        if (clientSession.isAppGlobal) {
      
         
          
         
        } else {
          
        }
        handleFieldChange("elements.hasDisabled", true);
      }}
    />
  );
});

export default ProductDetailsBatches;
