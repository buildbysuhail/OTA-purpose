import React from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { RefreshCcw, Plus } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
export const ProductManageIndia: React.FC<{
  formState: any;
  handleFieldChange: (
    fields:
      | string
      | {
          [fieldId: string]: any;
        },
    value?: any
  ) => void;

  getFieldProps: (fieldId: string, type?: any) => FormField;
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
            <div className="grid grid-cols-2 gap-4">
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
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
              <ERPCheckbox
                  {...getFieldProps("product.manual")} // Notice the type hint
                  label={t("manual")}       
                  onChange={(e) => handleFieldChange('product.manual', e.target.checked)}
                />
                <ERPButton
                  title={t("create_new")}
                  variant="secondary"
                  className="mt-[15px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ERPDataCombobox
                {...getFieldProps("product.productName")}
                id="productName"
                field={{
                  id: "productName",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("product.productName", data.product.productName)}
                label={t("product_name")}
                className="w-full"
                required={true}
                options={[]}
              />

              <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 items-center gap-1">
              <div className="flex items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("product.productCategoryID")}
                  field={{
                    id: "productCategoryID",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.productCategoryID", data.product.productCategoryID)}
                  label={t("product_category")}
                  className="w-full"
                  required={true}
                  options={[]}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("product.productGroupId")}
                  field={{
                    id: "productGroupId",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.productGroupId", data.product.productGroupId)}
                  label={t("product_group")}
                  className="w-full"
                  required={true}
                  options={[]}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <ERPDataCombobox
                {...getFieldProps("product.groupCategory")}
                field={{
                  id: "groupCategory",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("product.groupCategory", data.product.groupCategory)}
                label={t("group_category")}
                options={[]}
              />

              <ERPDataCombobox
                {...getFieldProps("product.section")}
                field={{
                  id: "section",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("product.section", data.product.section)}
                label={t("section")}
                options={[]}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.baseUnit")}
                  field={{
                    id: "baseUnit",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.baseUnit", data.product.baseUnit)}
                  label={t("base_unit")}
                  className="w-full"
                  required={true}
                  options={[]}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
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
                // onChangeData={(data: any) => handleFieldChange("product.upcBarcode", data.product.upcBarcode)}
                onChange={(e) => handleFieldChange('product.upcBarcode', e.target.checked)}
              />

              <ERPCheckbox
                {...getFieldProps("product.mu")}
                label={t("mu")}
                // onChangeData={(data: any) => handleFieldChange("product.mu", data.product.mu)}
                onChange={(e) => handleFieldChange('product.mu', e.target.checked)}
              />

              <ERPCheckbox
                {...getFieldProps("product.mr")}
                label={t("mr")}
                // onChangeData={(data: any) => handleFieldChange("product.mr", data.product.mr)}
                onChange={(e) => handleFieldChange('product.mr', e.target.checked)}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-1">
              <div className="flex items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("product.taxCategoryID")}
                  field={{
                    id: "taxCategoryID",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.taxCategoryID", data.product.taxCategoryID)}
                  label={t("tax_category")}
                  className="w-full"
                  options={[]}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <ERPCheckbox
                {...getFieldProps("product.isWeighingScaleItem")}
                label={t("is_weighing_scale_item")}
                onChange={(e) => handleFieldChange('product.isWeighingScaleItem', e.target.checked)}
                // onChangeData={(data: any) => handleFieldChange("product.isWeighingScaleItem", data.product.isWeighingScaleItem)}
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
                {...getFieldProps("product.mrp")}
                label={t("mrp")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.mrp", data.product.mrp)}
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
                {...getFieldProps("product.msp")}
                label={t("msp")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.msp", data.product.msp)}
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
              {...getFieldProps("product.foreignLanguage")}
              label={t("foreign_language")}
              placeholder=""
              required={false}
              onChangeData={(data: any) => handleFieldChange("product.foreignLanguage", data.product.foreignLanguage)}
            />

            <div className="flex items-center gap-1">
              <ERPCheckbox
                {...getFieldProps("product.batchCriteria")}
                label={t("batch_criteria")}
                className="w-1/4"
                onChange={(e) => handleFieldChange('product.batchCriteria', e.target.checked)}
                // onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.product.batchCriteria)}
              />

              <ERPDataCombobox
                {...getFieldProps("product.batchCriteriaType")}
                field={{
                  id: "batchCriteriaType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                className="w-full"
                noLabel={true}
                onChangeData={(data: any) => handleFieldChange("product.batchCriteriaType", data.product.batchCriteriaType)}
                options={[]}
              />
            </div>

            <div className="grid grid-cols-2 items-end gap-2">
              <ERPDataCombobox
                {...getFieldProps("product.productType")}
                id= "productType"
                field={{
                  id: "productType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChangeData={(data: any) => handleFieldChange("product.productType", data.product.productType)}
                label={t("product_type")}
                options={[{ value: "Inventory", label: t("inventory") }]}
              />

              <div className="flex items-center gap-2">
                <ERPButton
                  title={t("kit")}
                  variant="secondary"
                />
                <ERPCheckbox

                  {...getFieldProps("product.details")}
                  label={t("details")}
                  onChange={(e) => handleFieldChange('product.details', e.target.checked)}
                  // onChangeData={(data: any) => handleFieldChange("product.details", data.product.details)}
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ERPDataCombobox
                {...getFieldProps("product.defaultVendor")}
                field={{
                  id: "defaultVendor",
                  valueKey: "id",
                  labelKey: "name",
                }}
                className="w-full"
                onChangeData={(data: any) => handleFieldChange("product.defaultVendor", data.product.defaultVendor)}
                label={t("default_vendor")}
                options={[]}
              />

              <ERPInput
                {...getFieldProps("product.avgCost")}
                label={t("avg_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                disabled={true}
                onChangeData={(data: any) => handleFieldChange("product.avgCost", data.product.avgCost)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductManageIndia;
