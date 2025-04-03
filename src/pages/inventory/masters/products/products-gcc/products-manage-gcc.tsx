import React from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Ellipsis } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";

export const ProductManageGcc: React.FC<{
  formState: any;
  handleFieldChange: (
    fields:
      | string
      | {
          [fieldId: string]: any;
        },
    value?: any
  ) => void;
 
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({formState,handleFieldChange,getFieldProps}) => {
  const { t } = useTranslation("inventory");


  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        <div className="flex justify-end">
          <ERPInput
            {...getFieldProps("barcode")}
            label={t("barcode")}
            placeholder={t("barcode")}
            required={false}
            onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
          />
        </div>

        <div className="flex gap-1">
          <div className="grid grid-cols-1 gap-1 border border-[#ccc] rounded-md p-2 w-1/2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <ERPInput
                  {...getFieldProps("product.productCode")}
                  label={t("product_code")}
                  placeholder={t("enter_product_code")}
                  required={false}
                  className="w-full"
                  onChangeData={(data: any) => handleFieldChange("product.productCode", data.product.productCode)}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <ERPCheckbox
                  {...getFieldProps("product.manual")}
                  label={t("manual")}
                  onChange={(data) => handleFieldChange("product.manual", data.target.checked)}
                  className="flex"
                />

                <ERPButton
                  title={t("create_new")}
                  variant="secondary"
                  className="mt-[15px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.productName")}
                  id="productName"
                  field={{
                    id: "productName",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.productName", data.productName)}
                  label={t("product_name")}
                  className="w-full"
                  required={true}
                  options={[]}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.productGroupId")}
                  id="productGroupId"
                  field={{
                    id: "productGroupId",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.productGroupId", data.productGroupId)}
                  label={t("product_group")}
                  className="w-full"
                  required={true}
                  options={[]}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.baseUnit")}
                  id="baseUnit"
                  field={{
                    id: "baseUnit",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.baseUnit", data.baseUnit)}
                  label={t("base_unit")}
                  className="w-full"
                  required={true}
                  options={[]}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </div>

              <ERPInput
                {...getFieldProps("product.unitQty")}
                label={t("unit_qty")}
                placeholder="1"
                type="number"
                required={false}
                className="w-full"
                onChangeData={(data: any) => handleFieldChange("product.unitQty", data.product.unitQty)}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <ERPCheckbox
                {...getFieldProps("product.upcBarcode")}
                label={t("upc_barcode")}
                onChange={(data) => handleFieldChange("product.upcBarcode", data.target.checked)}
              />

              <ERPCheckbox
                {...getFieldProps("product.mu")}
                label={t("mu")}
                onChange={(data) => handleFieldChange("product.mu", data.target.checked)}
              />

              <ERPCheckbox
                {...getFieldProps("product.mr")}
                label={t("mr")}
                onChange={(data) => handleFieldChange("product.mr", data.target.checked)}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-1">
              <ERPDataCombobox
                {...getFieldProps("product.defaultVendor")}
                id="defaultVendor"
                field={{
                  id: "defaultVendor",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("product.defaultVendor", data.defaultVendor)}
                label={t("default_vendor")}
                className="w-full"
                options={[]}
              />

              <ERPCheckbox
                {...getFieldProps("product.isWeighingScaleItem")}
                label={t("is_weighing_scale_item")}
                onChange={(data) => handleFieldChange("product.isWeighingScaleItem", data.target.checked)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 border border-[#ccc] rounded-md p-2 w-1/2">
            <div className="grid grid-cols-4 gap-1">
              <ERPInput
                {...getFieldProps("product.purchasePrice")}
                label={t("purchase_price")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.purchasePrice", data.product.purchasePrice)}
              />

              <ERPInput
                {...getFieldProps("product.salesPrice")}
                label={t("sales_price")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.salesPrice", data.product.salesPrice)}
              />

              <ERPInput
                {...getFieldProps("product.markup")}
                label={t("markup") + "%"}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.markup", data.product.markup)}
              />

              <ERPInput
                {...getFieldProps("product.displayCost")}
                label={t("display_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.displayCost", data.product.displayCost)}
              />

              <ERPInput
                {...getFieldProps("product.minSalePrice")}
                label={t("min_sale_price")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.minSalePrice", data.product.minSalePrice)}
              />

              <ERPInput
                {...getFieldProps("product.opStock")}
                label={t("op_stock")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.opStock", data.product.opStock)}
              />

              <ERPInput
                {...getFieldProps("product.avgCost")}
                label={t("avg_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.avgCost", data.product.avgCost)}
              />

              <ERPInput
                {...getFieldProps("product.stock")}
                label={t("stock")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.stock", data.product.stock)}
              />
            </div>

            <ERPInput
              {...getFieldProps("product.productArabic")}
              label={t("product_(arabic)")}
              placeholder=""
              required={false}
              onChangeData={(data: any) => handleFieldChange("product.productArabic", data.product.productArabic)}
            />

            <div className="flex items-center gap-1">
              <ERPCheckbox
                {...getFieldProps("product.batchCriteria")}
                label={t("batch_criteria")}
                className="w-1/4"
                onChange={(data) => handleFieldChange("product.batchCriteria", data.target.checked)}
              />

              <ERPDataCombobox
                {...getFieldProps("product.batchCriteriaType")}
                id="batchCriteriaType"
                field={{
                  id: "batchCriteriaType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                className="w-full"
                noLabel={true}
                onChangeData={(data: any) => handleFieldChange("product.batchCriteriaType", data.batchCriteriaType)}
                options={[]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ERPDataCombobox
                {...getFieldProps("product.productType")}
                id="productType"
                field={{
                  id: "productType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChangeData={(data: any) => handleFieldChange("product.productType", data.productType)}
                label={t("product_type")}
                options={[{ value: "Inventory", label: t("inventory") }]}
              />
              <ERPDataCombobox
                {...getFieldProps("product.taxCategoryID")}
                id="taxCategoryID"
                field={{
                  id: "taxCategoryID",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("product.taxCategoryID", data.taxCategoryID)}
                label={t("tax_category")}
                className="w-full"
                options={[]}
              />
            </div>
            <div className="flex items-center gap-4">
              <ERPButton
                title={t("kit")}
                variant="secondary"
              />
              <ERPCheckbox
                {...getFieldProps("product.details")}
                label={t("details")}
                onChange={(data) => handleFieldChange("product.details", data.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
});

export default ProductManageGcc;
