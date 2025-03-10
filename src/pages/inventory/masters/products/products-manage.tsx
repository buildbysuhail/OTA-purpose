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
import { ProductData, initialProductData } from "./products-type";
import { Plus, RefreshCcw } from "lucide-react";
import ERPButton from "../../../../components/ERPComponents/erp-button";

export const ProductMaster: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory");
  const { isEdit, handleSubmit, handleClear, handleFieldChange, getFieldProps, isLoading, handleClose } =
    useFormManager<ProductData>({
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
            <div className="flex items-center gap-1">
              <ERPInput
                {...getFieldProps("productCode")}
                label={t("product_code")}
                placeholder={t("enter_product_code")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("productCode", data.productCode)}
              />

              <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                <RefreshCcw className="w-4 h-4" />
              </button>

              <ERPCheckbox
                {...getFieldProps("manual")}
                label={t("manual")}
                onChangeData={(data: any) => handleFieldChange("manual", data.manual)}
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
                {...getFieldProps("productName")}
                field={{
                  id: "productName",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("productName", data.productName)}
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
                  {...getFieldProps("productCategory")}
                  field={{
                    id: "productCategory",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("productCategory", data.productCategory)}
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
                  {...getFieldProps("productGroup")}
                  field={{
                    id: "productGroup",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("productGroup", data.productGroup)}
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
                {...getFieldProps("groupCategory")}
                field={{
                  id: "groupCategory",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("groupCategory", data.groupCategory)}
                label={t("group_category")}
                options={[]}
              />

              <ERPDataCombobox
                {...getFieldProps("section")}
                field={{
                  id: "section",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("section", data.section)}
                label={t("section")}
                options={[]}
              />
            </div>

            <div className="flex items-center gap-1">
              <ERPDataCombobox
                {...getFieldProps("baseUnit")}
                field={{
                  id: "baseUnit",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("baseUnit", data.baseUnit)}
                label={t("base_unit")}
                className="w-full"
                required={true}
                options={[]}
              />

              <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                <Plus className="w-4 h-4" />
              </button>

              <ERPInput
                {...getFieldProps("unitQty")}
                label={t("unit_qty")}
                placeholder="1"
                type="number"
                required={false}
                className="w-full"
                onChangeData={(data: any) => handleFieldChange("unitQty", data.unitQty)}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <ERPCheckbox
                {...getFieldProps("upcBarcode")}
                label={t("upc_barcode")}
                onChangeData={(data: any) => handleFieldChange("upcBarcode", data.upcBarcode)}
              />

              <ERPCheckbox
                {...getFieldProps("mu")}
                label={t("mu")}
                onChangeData={(data: any) => handleFieldChange("mu", data.mu)}
              />

              <ERPCheckbox
                {...getFieldProps("mr")}
                label={t("mr")}
                onChangeData={(data: any) => handleFieldChange("mr", data.mr)}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-1">
              <div className="flex items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("taxCategory")}
                  field={{
                    id: "taxCategory",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("taxCategory", data.taxCategory)}
                  label={t("tax_category")}
                  className="w-full"
                  options={[]}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <ERPCheckbox
                {...getFieldProps("isWeighingScaleItem")}
                label={t("is_weighing_scale_item")}
                onChangeData={(data: any) => handleFieldChange("isWeighingScaleItem", data.isWeighingScaleItem)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 border border-[#ccc] rounded-md p-2 w-1/2">
            <div className="grid grid-cols-2 gap-1">
              <ERPInput
                {...getFieldProps("purchasePrice")}
                label={t("purchase_price")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("purchasePrice", data.purchasePrice)}
              />

              <ERPInput
                {...getFieldProps("salesPrice")}
                label={t("sales_price")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("salesPrice", data.salesPrice)}
              />

              <ERPInput
                {...getFieldProps("markup")}
                label={t("markup") + "%"}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("markup", data.markup)}
              />

              <ERPInput
                {...getFieldProps("displayCost")}
                label={t("display_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("displayCost", data.displayCost)}
              />

              <ERPInput
                {...getFieldProps("mrp")}
                label={t("mrp")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("mrp", data.mrp)}
              />

              <ERPInput
                {...getFieldProps("opStock")}
                label={t("op_stock")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("opStock", data.opStock)}
              />

              <ERPInput
                {...getFieldProps("msp")}
                label={t("msp")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("msp", data.msp)}
              />

              <ERPInput
                {...getFieldProps("stock")}
                label={t("stock")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("stock", data.stock)}
              />
            </div>

            <ERPInput
              {...getFieldProps("foreignLanguage")}
              label={t("foreign_language")}
              placeholder=""
              required={false}
              onChangeData={(data: any) => handleFieldChange("foreignLanguage", data.foreignLanguage)}
            />

            <div className="flex items-center gap-1">
              <ERPCheckbox
                {...getFieldProps("batchCriteria")}
                label={t("batch_criteria")}
                className="w-1/4"
                onChangeData={(data: any) => handleFieldChange("batchCriteria", data.batchCriteria)}
              />

              <ERPDataCombobox
                {...getFieldProps("batchCriteriaType")}
                field={{
                  id: "batchCriteriaType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                className="w-full"
                noLabel={true}
                onChangeData={(data: any) => handleFieldChange("batchCriteriaType", data.batchCriteriaType)}
                options={[]}
              />
            </div>

            <div className="flex  items-end gap-1">
              <ERPDataCombobox
                {...getFieldProps("productType")}
                field={{
                  id: "productType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChangeData={(data: any) => handleFieldChange("productType", data.productType)}
                label={t("product_type")}
                options={[{ value: "Inventory", label: t("inventory") }]}
              />

              <ERPButton
                title={t("kit")}
                variant="secondary"
              />

              <div className="flex">
                <ERPCheckbox
                  {...getFieldProps("details")}
                  label={t("details")}
                  onChangeData={(data: any) => handleFieldChange("details", data.details)}
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ERPDataCombobox
                {...getFieldProps("defaultVendor")}
                field={{
                  id: "defaultVendor",
                  valueKey: "id",
                  labelKey: "name",
                }}
                className="w-full"
                onChangeData={(data: any) => handleFieldChange("defaultVendor", data.defaultVendor)}
                label={t("default_vendor")}
                options={[]}
              />

              <ERPInput
                {...getFieldProps("avgCost")}
                label={t("avg_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                disabled={true}
                onChangeData={(data: any) => handleFieldChange("avgCost", data.avgCost)}
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
                  {...getFieldProps("stockMin")}
                  label={t("stock_min")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("stockMin", data.stockMin)}
                />

                <ERPInput
                  {...getFieldProps("stockMax")}
                  label={t("stock_max")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("stockMax", data.stockMax)}
                />
              </div>

              <ERPInput
                {...getFieldProps("reOrderQty")}
                label={t("re_order_qty")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data: any) => handleFieldChange("reOrderQty", data.reOrderQty)}
              />

              <div className="flex items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("warehouse")}
                  field={{
                    id: "warehouse",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("warehouse", data.warehouse)}
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
                  {...getFieldProps("brand")}
                  field={{
                    id: "brand",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("brand", data.brand)}
                  className="w-full"
                  label={t("brand_mfg")}
                  options={[]}
                />
                
                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <ERPInput
                {...getFieldProps("commodityCode")}
                label={t("commodity_plu")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("commodityCode", data.commodityCode)}
              />

              <ERPInput
                {...getFieldProps("aliasName")}
                label={t("alias_name")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("aliasName", data.aliasName)}
              />

              <ERPInput
                {...getFieldProps("specification")}
                label={t("specification")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("specification", data.specification)}
              />

              <ERPInput
                {...getFieldProps("hsnCode")}
                label={t("hsn_code")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("hsnCode", data.hsnCode)}
              />

              <ERPDateInput
                {...getFieldProps("expDate")}
                label={t("exp_date")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("expDate", data.expDate)}
              />

              <ERPInput
                {...getFieldProps("autoBarcode")}
                label={t("auto_barcode")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("autoBarcode", data.autoBarcode)}
              />

              <ERPInput
                {...getFieldProps("batchNo")}
                label={t("batch_no")}
                placeholder=""
                required={false}
                onChangeData={(data: any) => handleFieldChange("batchNo", data.batchNo)}
              />

              <div className="grid grid-cols-2 gap-1">
                <ERPInput
                  {...getFieldProps("netWeight")}
                  label={t("net_weight_(in_grams)")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("netWeight", data.netWeight)}
                />

                <ERPInput
                  {...getFieldProps("unitName")}
                  label={t("unit_name")}
                  placeholder={t("eg:gm/ml")}
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("unitName", data.unitName)}
                />
              </div>

              <ERPDateInput
                {...getFieldProps("mfgDate")}
                label={t("mfg_date")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("mfgDate", data.mfgDate)}
              />

              <ERPDataCombobox
                {...getFieldProps("location")}
                field={{
                  id: "location",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) => handleFieldChange("location", data.location)}
                label={t("location")}
                options={[]}
              />
            </div>

            <div className="border border-gray-200 rounded-md p-2 relative">
              <h6 className="absolute top-[-13px] rounded-md bg-gray-500 px-4 py-1">{t("list_in")}</h6>
              <div className="flex flex-wrap items-center gap-6 mt-5">
                <ERPCheckbox
                  {...getFieldProps("canPurchase")}
                  label={t("purchase")}
                  onChangeData={(data: any) => handleFieldChange("canPurchase", data.canPurchase)}
                />

                <ERPCheckbox
                  {...getFieldProps("canSale")}
                  label={t("sales")}
                  onChangeData={(data: any) => handleFieldChange("canSale", data.canSale)}
                />

                <ERPCheckbox
                  {...getFieldProps("isFinishedGood")}
                  label={t("finished_goods")}
                  onChangeData={(data: any) => handleFieldChange("isFinishedGood", data.isFinishedGood)}
                />

                <ERPCheckbox
                  {...getFieldProps("isRawMaterial")}
                  label={t("raw_material")}
                  onChangeData={(data: any) => handleFieldChange("isRawMaterial", data.isRawMaterial)}
                />

                <ERPCheckbox
                  {...getFieldProps("isActiveBatch")}
                  label={t("is_active_batch")}
                  onChangeData={(data: any) => handleFieldChange("isActiveBatch", data.isActiveBatch)}
                />

                <ERPCheckbox
                  {...getFieldProps("gatePass")}
                  label={t("gate_pass")}
                  onChangeData={(data: any) => handleFieldChange("gatePass", data.gatePass)}
                />

                <ERPCheckbox
                  {...getFieldProps("hold")}
                  label={t("hold")}
                  onChangeData={(data: any) => handleFieldChange("hold", data.hold)}
                />
              </div>
            </div>
          </div>

          <div>
            {/* Multi Units content */}
          </div>

          <div>
            {/* Multi Rates content */}
          </div>

          <div>
            {/* Image content */}
          </div>

          <div>
            {/* Others content */}
          </div>

          <div>
            {/* Sales content */}
          </div>

          <div>
            {/* Purchase content */}
          </div>

          <div>
            {/* Stock content */}
          </div>

          <div>
            {/* Suppliers content */}
          </div>

          <div>
            {/* Re-Order content */}
          </div>

          <div>
            {/* Promotion Details content */}
          </div>

          <div>
            {/* Search content */}
          </div>

          <div>
            {/* Nutrition Facts content */}
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
