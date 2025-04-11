import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Ellipsis } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import initialProductData from "../products-data";
import { PathValue, productDto, ProductFieldPath } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";

export const ProductManageGcc: React.FC<{
  appSettings: ApplicationSettingsType;
  formState: any;
 handleFieldChange: <Path extends ProductFieldPath>(
       fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
       value?: PathValue<productDto, Path>
     ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
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
                  {...getFieldProps("product.basicUnitID")}
                  id="basicUnitID"
                  field={{
                    id: "basicUnitID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_units,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.basicUnitID", data.basicUnitID)}
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
                {...getFieldProps("upcBarcode")}
                label={t("upc_barcode")}
                onChange={(data) => handleFieldChange("upcBarcode", data.target.checked)}
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

            <div className="flex flex-wrap gap-2">
              <div className="flex flex-1 min-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("product.defaultVendorID")}
                  id="defaultVendorID"
                  field={{
                    id: "defaultVendorID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_acc_ledgers,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.defaultVendorID", data.product.defaultVendorID)}
                  label={t("default_vendor")}
                  className="w-full"
                />
              </div>

              <div className="flex flex-1 min-w-[200px] items-center">
                <ERPCheckbox
                  {...getFieldProps("product.isWeighingScale")}
                  label={t("is_weighing_scale_item")}
                  onChange={(data) => handleFieldChange("product.isWeighingScale", data.target.checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[300px] border border-[#ccc] rounded-md p-2">
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.stdPurchasePrice")}
                  label={t("purchase_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.stdPurchasePrice", data.product.stdPurchasePrice)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("product.stdSalesPrice")}
                  label={t("sales_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.stdSalesPrice", data.product.stdSalesPrice)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("markup")}
                  label={t("markup") + "%"}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("markup", data.markup)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("batch.displayCost")}
                  label={t("display_cost")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("batch.displayCost", data.batch.displayCost)}
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("batch.msp")}
                  label={t("min_sale_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("batch.msp", data.batch.msp)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("batch.openingStock")}
                  label={t("op_stock")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("batch.openingStock", data.batch.openingStock)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("batch.aPC")}
                  label={t("avg_cost")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("batch.aPC", data.batch.aPC)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ERPInput
                  {...getFieldProps("batch.stock")}
                  label={t("stock")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("batch.stock", data.batch.stock)}
                />
              </div>
            </div>

            <div className="mb-3">
              <ERPInput
                {...getFieldProps("product.secondLanguage")}
                label={t("product_(arabic)")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.secondLanguage", data.product.secondLanguage)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 mb-3">
              <div className="flex items-center">
                <ERPCheckbox
                  {...getFieldProps("batchCriteria")}
                  label={t("batch_criteria")}
                  onChange={(data) => handleFieldChange("batchCriteria", data.target.checked)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("product.batchCriteria")}
                  id="batchCriteria"
                  field={{
                    id: "batchCriteria",
                    valueKey: "value",
                    labelKey: "label",
                    getListUrl: Urls.data_batchcriteria,
                  }}
                  className="w-full"
                  noLabel={true}
                  onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.batchCriteria)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex-1 min-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("product.itemType")}
                  id="itemType"
                  field={{
                    id: "itemType",
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.itemType", data.itemType)}
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
                {...getFieldProps("details")}
                label={t("details")}
                onChange={(data) => handleFieldChange("details", data.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductManageGcc;