import React, { useMemo, useCallback } from "react";
import { PathValue, productDto, ProductFieldPath } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { toggleAccountGroupPopup } from "../../../../../redux/slices/popup-reducer";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";

const ProductDetailsIndiaBatches: React.FC<{
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
  const handleCellClick = useCallback(
    (e: any) => {
      if (e?.data) {
        // You can change this to set individual fields if needed
        handleFieldChange("batch", e.data);
      }
    },
    [handleFieldChange]
  );

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
      onCellClick={handleCellClick}
    />
  );
});

export default ProductDetailsIndiaBatches;
