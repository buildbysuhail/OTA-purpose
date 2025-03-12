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

export const ProductManageIndia: React.FC = React.memo(() => {
  const { t } = useTranslation("inventory");
  const { handleFieldChange, getFieldProps, } = useFormManager<productDto>({ initialData: initialProductData, });

  return (
    <div className="w-full modal-content">
      {/* <div className="text-center text-xl font-bold mb-4">PRODUCTS</div> */}

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
                  onChangeData={(data: any) => handleFieldChange("product.productCode", data.productCode)}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <ERPCheckbox
                  {...getFieldProps("product.manual")}
                  label={t("manual")}
                  onChangeData={(data: any) => handleFieldChange("product.manual", data.manual)}
                  className="flex"
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
                  onChangeData={(data: any) => handleFieldChange("product.productCategoryID", data.productCategoryID)}
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
                  onChangeData={(data: any) => handleFieldChange("product.productGroupId", data.productGroupId)}
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
                onChangeData={(data: any) => handleFieldChange("product.groupCategory", data.groupCategory)}
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
                onChangeData={(data: any) => handleFieldChange("product.section", data.section)}
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
                  onChangeData={(data: any) => handleFieldChange("product.baseUnit", data.baseUnit)}
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
                onChangeData={(data: any) => handleFieldChange("product.unitQty", data.unitQty)}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <ERPCheckbox
                {...getFieldProps("product.upcBarcode")}
                label={t("upc_barcode")}
                onChangeData={(data: any) => handleFieldChange("product.upcBarcode", data.upcBarcode)}
              />

              <ERPCheckbox
                {...getFieldProps("product.mu")}
                label={t("mu")}
                onChangeData={(data: any) => handleFieldChange("product.mu", data.mu)}
              />

              <ERPCheckbox
                {...getFieldProps("product.mr")}
                label={t("mr")}
                onChangeData={(data: any) => handleFieldChange("product.mr", data.mr)}
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
                  onChangeData={(data: any) => handleFieldChange("product.taxCategoryID", data.taxCategoryID)}
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
                onChangeData={(data: any) => handleFieldChange("product.isWeighingScaleItem", data.isWeighingScaleItem)}
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
                onChangeData={(data: any) => handleFieldChange("product.purchasePrice", data.purchasePrice)}
              />

              <ERPInput
                {...getFieldProps("product.salesPrice")}
                label={t("sales_price")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.salesPrice", data.salesPrice)}
              />

              <ERPInput
                {...getFieldProps("product.markup")}
                label={t("markup") + "%"}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.markup", data.markup)}
              />

              <ERPInput
                {...getFieldProps("product.displayCost")}
                label={t("display_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.displayCost", data.displayCost)}
              />

              <ERPInput
                {...getFieldProps("product.mrp")}
                label={t("mrp")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.mrp", data.mrp)}
              />

              <ERPInput
                {...getFieldProps("product.opStock")}
                label={t("op_stock")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.opStock", data.opStock)}
              />

              <ERPInput
                {...getFieldProps("product.msp")}
                label={t("msp")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.msp", data.msp)}
              />

              <ERPInput
                {...getFieldProps("product.stock")}
                label={t("stock")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.stock", data.stock)}
              />
            </div>

            <ERPInput
              {...getFieldProps("product.foreignLanguage")}
              label={t("foreign_language")}
              placeholder=""
              required={false}
              onChangeData={(data: any) => handleFieldChange("product.foreignLanguage", data.foreignLanguage)}
            />

            <div className="flex items-center gap-1">
              <ERPCheckbox
                {...getFieldProps("product.batchCriteria")}
                label={t("batch_criteria")}
                className="w-1/4"
                onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.batchCriteria)}
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
                onChangeData={(data: any) => handleFieldChange("product.batchCriteriaType", data.batchCriteriaType)}
                options={[]}
              />
            </div>

            <div className="grid grid-cols-2 items-end gap-2">
              <ERPDataCombobox
                {...getFieldProps("product.productType")}
                field={{
                  id: "productType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChangeData={(data: any) => handleFieldChange("product.productType", data.productType)}
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
                  onChangeData={(data: any) => handleFieldChange("product.details", data.details)}
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
                onChangeData={(data: any) => handleFieldChange("product.defaultVendor", data.defaultVendor)}
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
                onChangeData={(data: any) => handleFieldChange("product.avgCost", data.avgCost)}
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
