import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { RefreshCcw, Plus } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";
import { PathValue, productDto, ProductFieldPath } from "../products-type";

const api = new APIClient();

export const ProductManageIndia: React.FC<{
  appSettings: ApplicationSettingsType;
  formState: any;
  handleFieldChange: <Path extends ProductFieldPath>(
      fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
      value?: PathValue<productDto, Path>
    ) => void;

  getFieldProps: (fieldId: string, type?: any) => FormField;
}> = React.memo(({ formState, handleFieldChange, getFieldProps, appSettings }) => {
  
  const { t } = useTranslation("inventory");
    const productNameRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  productNameRef?.current?.focus()
  productNameRef?.current?.select()
},[productNameRef])
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
            className="w-full md:w-1/3"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <div className="flex-1 min-w-[270px] border border-gray-300 rounded-md p-3">
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-2">
                <ERPInput
                  {...getFieldProps("product.productCode")}
                  label={t("product_code")}
                  placeholder={t("enter_product_code")}
                  required={false}
                  className="w-full"
                  disabled={!getFieldProps("product.manual").value}
                  onChangeData={(data: any) => handleFieldChange("product.productCode", data.product.productCode)}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
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

            <div className="flex items-center gap-1 mb-3">
              <ERPDataCombobox
              ref={productNameRef}
                {...getFieldProps("product.productId")}
                id="productName"
                field={{
                  id: "productName",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_products
                }}
                onTextChange={(data: any) => handleFieldChange("product.productName", data)}
                // onChangeData={(data: any) => handleFieldChange("product.productName", data.productName)}
                label={t("product_name")}
                className="w-full"
                required={true}
              />

              <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-1">
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

              <div className="flex flex-1 min-w-[240px] items-center gap-2">
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
                    handleFieldChange("product.productGroupID", data.value);
                    const sds = await api.getAsync(`${Urls.group_category__}${data.value}`);
                    handleFieldChange("product.groupCategoryID", sds);
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

            <div className="flex flex-wrap gap-1 mb-3">
              <ERPDataCombobox
                {...getFieldProps("product.groupCategory")}
                field={{
                  id: "groupCategory",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_groupcategory
                }}
                onChangeData={(data: any) => handleFieldChange("product.groupCategoryID", data.groupCategory)}
                label={t("group_category")}
                className="flex-1 min-w-[240px]"
              />

              <ERPDataCombobox
                {...getFieldProps("product.sectionID")}
                field={{
                  id: "section",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_sections
                }}
                onChangeData={(data: any) => handleFieldChange("sectionID", data.sectionID)}
                label={t("section")}
                className="flex-1 min-w-[240px]"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.basicUnitID")}
                  field={{
                    id: "basicUnitID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_units,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.basicUnitID", data.BasicUnitID)}
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

            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <ERPCheckbox
                {...getFieldProps("upcBarcode")}
                label={t("upc_barcode")}
                // onChangeData={(data: any) => handleFieldChange("product.upcBarcode", data.product.upcBarcode)}
                onChange={(e) => handleFieldChange('upcBarcode', e.target.checked)}
              />

              <ERPCheckbox
                {...getFieldProps("mu")}
                label={t("mu")}
                disabled={!appSettings.productsSettings.allowMultiUnits}
                // onChangeData={(data: any) => handleFieldChange("product.mu", data.product.mu)}
                onChange={(e) => handleFieldChange('mu', e.target.checked)}
              />

              <ERPCheckbox
                {...getFieldProps("mr")}
                label={t("mr")}
                disabled={!appSettings.productsSettings.allowMultirate}
                // onChangeData={(data: any) => handleFieldChange("product.mr", data.product.mr)}
                onChange={(e) => handleFieldChange('mr', e.target.checked)}
              />
            </div>

            {/* Tax Category and Weighing Scale */}
            <div className="flex flex-wrap gap-1">
              <div className="flex flex-1 min-w-[240px] items-center gap-2">
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

              <div className="flex flex-1 min-w-[240px] items-center">
                <ERPCheckbox
                  {...getFieldProps("product.isWeighingScale")}
                  label={t("is_weighing_scale_item")}
                  onChange={(e) => handleFieldChange('product.isWeighingScale', e.target.checked)}
                // onChangeData={(data: any) => handleFieldChange("product.isWeighingScaleItem", data.product.isWeighingScaleItem)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[270px] border border-gray-300 rounded-md p-4">
            <div className="flex flex-wrap gap-1 mb-3">
              <ERPInput
                {...getFieldProps("product.stdPurchasePrice")}
                label={t("purchase_price")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.stdPurchasePrice", data.product.stdPurchasePrice)}
              />

              <ERPInput
                {...getFieldProps("product.stdSalesPrice")}
                label={t("sales_price")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.stdSalesPrice", data.product.stdSalesPrice)}
              />

              <ERPInput
                {...getFieldProps("markup")}
                label={t("markup") + "%"}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("markup", data.markup)}
              />

              <ERPInput
                {...getFieldProps("batch.displayCost")}
                label={t("display_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.displayCost", data.batch.displayCost)}
              />

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
                {...getFieldProps("batch.openingStock")}
                label={t("op_stock")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.openingStock", data.batch.openingStock)}
              />

              <ERPInput
                {...getFieldProps("batch.msp")}
                label={t("msp")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.msp", data.batch.msp)}
              />

              <ERPInput
                {...getFieldProps("batch.stock")}
                label={t("stock")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.stock", data.batch.stock)}
              />
            </div>

            <div className="mb-3">
              <ERPInput
                {...getFieldProps("product.secondLanguage")}
                label={t("foreign_language")}
                placeholder=""
                required={false}
                className="w-full"
                onChangeData={(data: any) => handleFieldChange("product.secondLanguage", data.product.secondLanguage)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 mb-3">
              <div className="flex items-center flex-shrink-0">
                <ERPCheckbox
                  {...getFieldProps("product.batchCriteria")}
                  label={t("batch_criteria")}
                  onChange={(e) => handleFieldChange('batchCriteria', e.target.checked)}
                  className="flex-1 min-w-[120px]"
                // onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.product.batchCriteria)}
                />
              </div>

              <ERPDataCombobox
                {...getFieldProps("product.batchCriteria")}
                field={{
                  id: "batchCriteria",
                  valueKey: "value",
                  labelKey: "label",
                  getListUrl: Urls.data_batchcriteria,
                }}
                className="flex-1 min-w-[120px]"
                noLabel={true}
                onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.batchCriteria)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3 items-end">
              <ERPDataCombobox
                {...getFieldProps("product.itemType")}
                id="itemType"
                field={{
                  id: "itemType",
                  required: true,
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChangeData={(data: any) => { handleFieldChange("product.itemType", data.itemType) }}
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
                  onChange={(e) => handleFieldChange('details', e.target.checked)}
                // onChangeData={(data: any) => handleFieldChange("product.details", data.product.details)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <ERPDataCombobox
                {...getFieldProps("product.defaultVendorID")}
                field={{
                  id: "defaultVendorID",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_acc_ledgers,
                }}
                className="flex-1 min-w-[240px]"
                onChangeData={(data: any) => handleFieldChange("product.defaultVendorID", data.defaultVendorID)}
                label={t("default_vendor")}
              />

              <ERPInput
                {...getFieldProps("batch.aPC")}
                label={t("avg_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                disabled={true}
                onChangeData={(data: any) => handleFieldChange("batch.aPC", data.batch.aPC)}
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
