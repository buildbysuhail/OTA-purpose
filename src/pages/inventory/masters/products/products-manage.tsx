import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPFormButtons from "../../../../components/ERPComponents/erp-form-buttons";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleProducts } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { productDto } from "./products-type";
import { Plus, RefreshCcw } from "lucide-react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import initialProductData from "./products-data";

export const ProductMaster: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory");
  const { isEdit, handleSubmit, handleClear, handleFieldChange, getFieldProps, isLoading, handleClose } =
    useFormManager<productDto>({
      url: Urls.products,
      onClose: useCallback(() => dispatch(toggleProducts({ isOpen: false, key: null, reload: false })), [dispatch]),
      onSuccess: useCallback(() => dispatch(toggleProducts({ isOpen: false, key: null, reload: true })), [dispatch]),
      key: rootState.PopupData.products?.key,
      useApiClient: true,
      initialData: initialProductData,
    });

  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

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
            <div className="flex items-center gap-4">
              <ERPInput
                {...getFieldProps("product.productCode")}
                label={t("product_code")}
                placeholder={t("enter_product_code")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.productCode", data.productCode)}
              />

              <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                <RefreshCcw className="w-4 h-4" />
              </button>

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

            {/* <ERPInput
              {...getFieldProps("productName")}
              label={t("product_name")}
              placeholder={t("enter_product_name")}
              required={true}
              onChangeData={(data: any) => handleFieldChange("productName", data.productName)}
            /> */}

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

            <div className="flex items-center gap-1">
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
            <div className="grid grid-cols-2 gap-1">
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

            <div className="flex  items-end gap-1">
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

              <ERPButton
                title={t("kit")}
                variant="secondary"
              />

              <div className="flex">
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

        <ERPTab
          tabs={[t("details"), t("multi_units"), t("multi_rates"), t("image"), t("others"), t("sales"), t("purchase"), t("stock"), t("suppliers"), t("re_order"), t("promotion_details"), t("search"), t("nutrition_facts")]}
          activeTab={activeTab}
          onClickTabAt={handleTabChange}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
            <div className="grid grid-cols-3 gap-1 border border-gray-200 rounded-md p-2">
              <div className="grid grid-cols-2 gap-1">
                <ERPInput
                  {...getFieldProps("product.minimumStock")}
                  label={t("stock_min")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.minimumStock", data.minimumStock)}
                />

                <ERPInput
                  {...getFieldProps("product.maximumStock")}
                  label={t("stock_max")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.maximumStock", data.maximumStock)}
                />
              </div>

              <ERPInput
                {...getFieldProps("product.reorderQty")}
                label={t("re_order_qty")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.reorderQty", data.reorderQty)}
              />

              <div className="flex items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("product.warehouseID")}
                  field={{
                    id: "warehouseID",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.warehouseID", data.warehouseID)}
                  className="w-full"
                  label={t("warehouse")}
                  options={[]}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("product.brandID")}
                  field={{
                    id: "brandID",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.brandID", data.brandID)}
                  className="w-full"
                  label={t("brand_mfg")}
                  options={[]}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <ERPInput
                {...getFieldProps("product.commodityCode")}
                label={t("commodity_plu")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.commodityCode", data.commodityCode)}
              />

              <ERPInput
                {...getFieldProps("product.aliasItemName")}
                label={t("alias_name")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.aliasItemName", data.aliasItemName)}
              />

              <ERPInput
                {...getFieldProps("product.specification")}
                label={t("specification")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.specification", data.specification)}
              />

              <ERPInput
                {...getFieldProps("product.hsnCode")}
                label={t("hsn_code")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.hsnCode", data.hsnCode)}
              />

              <ERPDateInput
                {...getFieldProps("product.expiryDate")}
                label={t("exp_date")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.expiryDate", data.expiryDate)}
              />

              <ERPInput
                {...getFieldProps("product.autoBarcode")}
                label={t("auto_barcode")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.autoBarcode", data.autoBarcode)}
              />

              <ERPInput
                {...getFieldProps("product.batchNo")}
                label={t("batch_no")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.batchNo", data.batchNo)}
              />

              <div className="grid grid-cols-2 gap-1">
                <ERPInput
                  {...getFieldProps("product.netWeight")}
                  label={t("net_weight_(in_grams)")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.netWeight", data.netWeight)}
                />

                <ERPInput
                  {...getFieldProps("product.unitName")}
                  label={t("unit_name")}
                  placeholder={t("eg:gm/ml")}
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("product.unitName", data.unitName)}
                />
              </div>

              <ERPDateInput
                {...getFieldProps("product.mfgDate")}
                label={t("mfg_date")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("product.mfgDate", data.mfgDate)}
              />

              <ERPDataCombobox
                {...getFieldProps("product.location")}
                field={{
                  id: "location",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("product.location", data.location)}
                label={t("location")}
                options={[]}
              />
            </div>

            <div className="border border-gray-200 rounded-md p-2 relative">
              <h6 className="absolute top-[-13px] rounded-md bg-gray-500 px-4 py-1">{t("list_in")}</h6>
              <div className="flex flex-wrap items-center gap-6 mt-5">
                <ERPCheckbox
                  {...getFieldProps("product.canPurchase")}
                  label={t("purchase")}
                  onChangeData={(data: any) => handleFieldChange("product.canPurchase", data.canPurchase)}
                />

                <ERPCheckbox
                  {...getFieldProps("product.canSale")}
                  label={t("sales")}
                  onChangeData={(data: any) => handleFieldChange("product.canSale", data.canSale)}
                />

                <ERPCheckbox
                  {...getFieldProps("product.isFinishedGood")}
                  label={t("finished_goods")}
                  onChangeData={(data: any) => handleFieldChange("product.isFinishedGood", data.isFinishedGood)}
                />

                <ERPCheckbox
                  {...getFieldProps("product.isRawMaterial")}
                  label={t("raw_material")}
                  onChangeData={(data: any) => handleFieldChange("product.isRawMaterial", data.isRawMaterial)}
                />

                <ERPCheckbox
                  {...getFieldProps("product.active")}
                  label={t("is_active_batch")}
                  onChangeData={(data: any) => handleFieldChange("product.active", data.active)}
                />

                <ERPCheckbox
                  {...getFieldProps("product.gatePass")}
                  label={t("gate_pass")}
                  onChangeData={(data: any) => handleFieldChange("product.gatePass", data.gatePass)}
                />

                <ERPCheckbox
                  {...getFieldProps("product.hold")}
                  label={t("hold")}
                  onChangeData={(data: any) => handleFieldChange("product.hold", data.hold)}
                />
              </div>
            </div>
          </div>

          <div>
            Multi Units
          </div>

          <div>
            Multi Rates
          </div>

          <div>
            Image
          </div>

          <div>
            Others
          </div>

          <div>
            Sales
          </div>

          <div>
            Purchase
          </div>

          <div>
            Stock
          </div>

          <div>
            Suppliers
          </div>

          <div>
            Re-Order
          </div>

          <div>
            Promotion Details
          </div>

          <div>
            Search
          </div>

          <div>
            Nutrition Facts
          </div>
        </ERPTab>
      </div>

      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default ProductMaster;
