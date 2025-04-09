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
import Urls from "../../../../../redux/urls";

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
}> = React.memo(({ formState, handleFieldChange, getFieldProps }) => {
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

        <div className="flex flex-wrap gap-1">
          <div className="flex-1 min-w-[300px] border border-[#ccc] rounded-md p-2">
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex flex-1 min-w-[200px] items-center gap-2">
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

              <div className="flex flex-wrap items-center gap-4">
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

            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex flex-1 min-w-[200px] items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.productName")}
                  id="productName"
                  field={{
                    id: "productName",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_products,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.productName", data.productName)}
                  label={t("product_name")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-1 min-w-[200px] items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.productGroupID")}
                  id="productGroupID"
                  field={{
                    id: "productGroupID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_productgroup,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.productGroupID", data.productGroupID)}
                  label={t("product_group")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex flex-1 min-w-[200px] items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.baseUnit")}
                  id="baseUnit"
                  field={{
                    id: "baseUnit",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_units,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.baseUnit", data.baseUnit)}
                  label={t("base_unit")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-1 min-w-[200px]">
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
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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

            <div className="flex flex-wrap gap-2">
              <div className="flex flex-1 min-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("product.defaultVendor")}
                  id="defaultVendor"
                  field={{
                    id: "defaultVendor",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_acc_ledgers,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.defaultVendor", data.defaultVendor)}
                  label={t("default_vendor")}
                  className="w-full"
                />
              </div>

              <div className="flex flex-1 min-w-[200px] items-center">
                <ERPCheckbox
                  {...getFieldProps("product.isWeighingScaleItem")}
                  label={t("is_weighing_scale_item")}
                  onChange={(data) => handleFieldChange("product.isWeighingScaleItem", data.target.checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[300px] border border-[#ccc] rounded-md p-2">
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.purchasePrice")}
                  label={t("purchase_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.purchasePrice", data.product.purchasePrice)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.salesPrice")}
                  label={t("sales_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.salesPrice", data.product.salesPrice)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.markup")}
                  label={t("markup") + "%"}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.markup", data.product.markup)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.displayCost")}
                  label={t("display_cost")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.displayCost", data.product.displayCost)}
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.minSalePrice")}
                  label={t("min_sale_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.minSalePrice", data.product.minSalePrice)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.opStock")}
                  label={t("op_stock")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.opStock", data.product.opStock)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.avgCost")}
                  label={t("avg_cost")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.avgCost", data.product.avgCost)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.stock")}
                  label={t("stock")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.stock", data.product.stock)}
                />
              </div>
            </div>

            <div className="mb-3">
              <ERPInput
                {...getFieldProps("product.productArabic")}
                label={t("product_(arabic)")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.productArabic", data.product.productArabic)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 mb-3">
              <div className="flex items-center">
                <ERPCheckbox
                  {...getFieldProps("product.batchCriteria")}
                  label={t("batch_criteria")}
                  onChange={(data) => handleFieldChange("product.batchCriteria", data.target.checked)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("product.batchCriteriaType")}
                  id="batchCriteriaType"
                  field={{
                    id: "batchCriteriaType",
                    valueKey: "value",
                    labelKey: "label",
                    getListUrl: Urls.data_batchcriteria,
                  }}
                  className="w-full"
                  noLabel={true}
                  onChangeData={(data: any) => handleFieldChange("product.batchCriteriaType", data.batchCriteriaType)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex-1 min-w-[200px]">
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
                  options={[
                    { value: "Inventory", label: "Inventory" },
                    { value: "Dummy", label: "Dummy" },
                    { value: "Service", label: "Service" },
                    { value: "Discount", label: "Discount" },
                    { value: "Other", label: "Other" },
                    { value: "Fixed Asset", label: "Fixed Asset" },
                  ]}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("product.taxCategoryID")}
                  id="taxCategoryID"
                  field={{
                    id: "taxCategoryID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_taxCategory,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.taxCategoryID", data.taxCategoryID)}
                  label={t("tax_category")}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
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
    </div>
  );
});

export default ProductManageGcc;