import React from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { RefreshCcw, Plus } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";

const api = new APIClient();
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
}> = React.memo(({ formState, handleFieldChange, getFieldProps }) => {

  const { t } = useTranslation("inventory");

  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        <div className="flex justify-end w-full">
          <ERPInput
            {...getFieldProps("barcode")}
            label={t("barcode")}
            placeholder={t("barcode")}
            required={false}
            onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
            className="md:w-1/3 sm:w-1/2 w-full"
          />
        </div>

        <div className="flex flex-row gap-1 w-full">
          <div className="flex flex-col gap-1 border border-gray-300 rounded-md p-2 w-full md:w-1/2 min-w-[270px]">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
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

              <div className="flex items-center gap-4 flex-wrap">
                <ERPCheckbox
                  {...getFieldProps("product.manual")}
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
                  getListUrl: Urls.data_products
                }}
                onChangeData={(data: any) => handleFieldChange("product.productName", data.productName)}
                label={t("product_name")}
                className="w-full"
                required={true}
              />

              <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              <div className="flex items-center gap-1 flex-1 min-w-[240px]">
                <ERPDataCombobox
                  {...getFieldProps("product.productCategoryID")}
                  field={{
                    id: "productCategoryID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_productcategory
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.productCategoryID", data.productCategoryID)}
                  label={t("product_category")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <ERPDataCombobox
                  {...getFieldProps("product.productGroupID")}
                  field={{
                    id: "productGroupID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_productgroup
                  }}
                  onChange={async (data: any) => {
                    debugger;
                    handleFieldChange("product.productGroupID", data.value)
                    const sds = await api.getAsync(`${Urls.group_category__}${data.value}`);
                    handleFieldChange("product.groupCategory", sds)
                  }
                  }
                  label={t("product_group")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <ERPDataCombobox
                {...getFieldProps("product.groupCategory")}
                field={{
                  id: "groupCategory",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_groupcategory
                }}
                onChangeData={(data: any) => handleFieldChange("product.groupCategory", data.groupCategory)}
                label={t("group_category")}
                className="flex-1 min-w-[240px]"
              />

              <ERPDataCombobox
                {...getFieldProps("product.section")}
                field={{
                  id: "section",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_sections
                }}
                onChangeData={(data: any) => handleFieldChange("product.section", data.section)}
                label={t("section")}
                className="flex-1 min-w-[240px]"
              />
            </div>

            {/* Base Unit and Unit Qty */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <ERPDataCombobox
                  {...getFieldProps("product.baseUnit")}
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
                className="flex-1 min-w-[140px]"
                onChangeData={(data: any) => handleFieldChange("product.unitQty", data.product.unitQty)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
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

            {/* Tax Category and Weighing Scale */}
            <div className="flex flex-wrap gap-1">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <ERPDataCombobox
                  {...getFieldProps("product.taxCategoryID")}
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

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center flex-1 min-w-[240px]">
                <ERPCheckbox
                  {...getFieldProps("product.isWeighingScaleItem")}
                  label={t("is_weighing_scale_item")}
                  onChange={(e) => handleFieldChange('product.isWeighingScaleItem', e.target.checked)}
                // onChangeData={(data: any) => handleFieldChange("product.isWeighingScaleItem", data.product.isWeighingScaleItem)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 border border-gray-300 rounded-md p-4 w-full md:w-1/2  min-w-[270px]">
            <div className="flex flex-wrap gap-1">
              <ERPInput
                {...getFieldProps("product.purchasePrice")}
                label={t("purchase_price")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.purchasePrice", data.product.purchasePrice)}
              />

              <ERPInput
                {...getFieldProps("product.salesPrice")}
                label={t("sales_price")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.salesPrice", data.product.salesPrice)}
              />

              <ERPInput
                {...getFieldProps("product.markup")}
                label={t("markup") + "%"}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.markup", data.product.markup)}
              />

              <ERPInput
                {...getFieldProps("product.displayCost")}
                label={t("display_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.displayCost", data.product.displayCost)}
              />
            </div>

            <div className="flex flex-wrap gap-1">
              <ERPInput
                {...getFieldProps("product.mrp")}
                label={t("mrp")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.mrp", data.product.mrp)}
              />

              <ERPInput
                {...getFieldProps("product.opStock")}
                label={t("op_stock")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.opStock", data.product.opStock)}
              />

              <ERPInput
                {...getFieldProps("product.msp")}
                label={t("msp")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.msp", data.product.msp)}
              />

              <ERPInput
                {...getFieldProps("product.stock")}
                label={t("stock")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.stock", data.product.stock)}
              />
            </div>

            <ERPInput
              {...getFieldProps("product.foreignLanguage")}
              label={t("foreign_language")}
              placeholder=""
              required={false}
              className="w-full"
              onChangeData={(data: any) => handleFieldChange("product.foreignLanguage", data.product.foreignLanguage)}
            />

            <div className="flex flex-wrap items-center gap-1">
              <div className="flex items-center flex-shrink-0">
                <ERPCheckbox
                  {...getFieldProps("product.batchCriteria")}
                  label={t("batch_criteria")}
                  onChange={(e) => handleFieldChange('product.batchCriteria', e.target.checked)}
                // onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.product.batchCriteria)}
                />
              </div>

              <ERPDataCombobox
                {...getFieldProps("product.batchCriteriaType")}
                field={{
                  id: "batchCriteriaType",
                  valueKey: "value",
                  labelKey: "label",
                  getListUrl: Urls.data_batchcriteria,
                }}
                className="flex-1"
                noLabel={true}
                onChangeData={(data: any) => handleFieldChange("product.batchCriteriaType", data.batchCriteriaType)}
              />
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <ERPDataCombobox
                {...getFieldProps("product.productType")}
                id="productType"
                field={{
                  id: "productType",
                  required: true,
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChangeData={(data: any) => { handleFieldChange("product.productType", data.productType) }}
                label={t("product_type")}
                className="flex-1 min-w-[240px]"
                options={[
                  { value: "Inventory", label: "Inventory" },
                  { value: "Dummy", label: "Dummy" },
                  { value: "Service", label: "Service" },
                  { value: "Discount", label: "Discount" },
                  { value: "Other", label: "Other" },
                  { value: "Fixed Asset", label: "Fixed Asset" },
                ]}
              />

              <div className="flex flex-wrap items-center gap-2">
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

            <div className="flex flex-wrap gap-1">
              <ERPDataCombobox
                {...getFieldProps("product.defaultVendor")}
                field={{
                  id: "defaultVendor",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl:Urls.data_acc_ledgers,
                }}
                className="flex-1 min-w-[240px]"
                onChangeData={(data: any) => handleFieldChange("product.defaultVendor", data.defaultVendor)}
                label={t("default_vendor")}
              />

              <ERPInput
                {...getFieldProps("product.avgCost")}
                label={t("avg_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                disabled={true}
                onChangeData={(data: any) => handleFieldChange("product.avgCost", data.product.avgCost)}
                className="flex-1 min-w-[140px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductManageIndia;
