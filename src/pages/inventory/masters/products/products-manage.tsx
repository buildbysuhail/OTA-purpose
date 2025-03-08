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
      <div className="flex text-end">
        <ERPInput
          {...getFieldProps("barcode")}
          label={t("barcode")}
          placeholder=""
          required={false}
          onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
        />
      </div>


      <div className="flex gap-4">
        <div className="grid grid-cols-1 gap-4 border border-[#ccc] rounded-md p-4 w-1/2">
          <div className="flex items-center gap-2">
            <ERPInput
              {...getFieldProps("productCode")}
              label={t("product_code")}
              placeholder={t("enter_product_code")}
              required={false}
              onChangeData={(data: any) => handleFieldChange("productCode", data.productCode)}
            />
            <ERPCheckbox
              {...getFieldProps("manual")}
              label={t("manual")}
              onChangeData={(data: any) => handleFieldChange("manual", data.manual)}
            />
            <button className="px-3 py-1 bg-[#3b82f6] text-white rounded">{t("create_new")}</button>
          </div>
          <ERPInput
            {...getFieldProps("productName")}
            label={t("product_name")}
            placeholder={t("enter_product_name")}
            required={true}
            onChangeData={(data: any) => handleFieldChange("productName", data.productName)}
          />

          <ERPDataCombobox
            {...getFieldProps("productCategory")}
            field={{
              id: "productCategory",
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("productCategory", data.productCategory)}
            label={t("product_category")}
            required={true}
            options={[]}
          />

          <ERPDataCombobox
            {...getFieldProps("productGroup")}
            field={{
              id: "productGroup",
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("productGroup", data.productGroup)}
            label={t("product_group")}
            required={true}
            options={[]}
          />

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
          <div className="flex items-center gap-2">
            <ERPDataCombobox
              {...getFieldProps("baseUnit")}
              field={{
                id: "baseUnit",
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) => handleFieldChange("baseUnit", data.baseUnit)}
              label={t("base_unit")}
              required={true}
              options={[]}
            />

            <ERPInput
              {...getFieldProps("unitQty")}
              label={t("unit_qty")}
              placeholder="1"
              type="number"
              required={false}
              onChangeData={(data: any) => handleFieldChange("unitQty", data.unitQty)}
            />
          </div>
          <div className="flex items-center mt-2">
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
          <div className="flex items-center gap-2">
            <ERPDataCombobox
              {...getFieldProps("taxCategory")}
              field={{
                id: "taxCategory",
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) => handleFieldChange("taxCategory", data.taxCategory)}
              label={t("tax_category")}
              options={[]}
            />

            <ERPCheckbox
              {...getFieldProps("isWeighingScaleItem")}
              label={t("is_weighing_scale_item")}
              onChangeData={(data: any) => handleFieldChange("isWeighingScaleItem", data.isWeighingScaleItem)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border border-[#ccc] rounded-md p-4 w-1/2">
          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex items-center gap-4">
            <ERPCheckbox
              {...getFieldProps("batchCriteria")}
              label={t("batch_criteria")}
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
              onChangeData={(data: any) => handleFieldChange("batchCriteriaType", data.batchCriteriaType)}
              options={[]}
            />
          </div>
          <div className="flex  items-center gap-4">
            <ERPDataCombobox
              {...getFieldProps("productType")}
              field={{
                id: "productType",
                valueKey: "value",
                labelKey: "label",
              }}
              onChangeData={(data: any) => handleFieldChange("productType", data.productType)}
              label={t("prd_type")}
              options={[{ value: "Inventory", label: t("inventory") }]}
            />

            <ERPCheckbox
              {...getFieldProps("kit")}
              label={t("kit")}
              onChangeData={(data: any) => handleFieldChange("kit", data.kit)}
            />

            <ERPCheckbox
              {...getFieldProps("details")}
              label={t("details")}
              onChangeData={(data: any) => handleFieldChange("details", data.details)}
            />
          </div>
          <div className="flex items-center gap-4">
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
      >
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="mt-2">
                <ERPDataCombobox
                  {...getFieldProps("warehouse")}
                  field={{
                    id: "warehouse",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("warehouse", data.warehouse)}
                  label={t("warehouse")}
                  options={[]}
                />
              </div>

              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("aliasName")}
                  label={t("alias_name")}
                  placeholder=""
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("aliasName", data.aliasName)}
                />
              </div>

              <div className="mt-2">
                <ERPDateInput
                  {...getFieldProps("expDate")}
                  label={t("exp_date")}
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("expDate", data.expDate)}
                />
              </div>

              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("netWeight")}
                  label={t("net_weight")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("netWeight", data.netWeight)}
                />
                <div className="text-xs text-gray-500">{t("in_grams")}</div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("reOrderQty")}
                  label={t("re_order_qty")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("reOrderQty", data.reOrderQty)}
                />
              </div>

              <div className="mt-2">
                <ERPDataCombobox
                  {...getFieldProps("brand")}
                  field={{
                    id: "brand",
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("brand", data.brand)}
                  label={t("brand_mfg")}
                  options={[]}
                />
              </div>

              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("specification")}
                  label={t("specification")}
                  placeholder=""
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("specification", data.specification)}
                />
              </div>

              <div className="mt-2">
                <ERPDateInput
                  {...getFieldProps("mfgDate")}
                  label={t("mfg_date")}
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("mfgDate", data.mfgDate)}
                />
              </div>

              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("unitName")}
                  label={t("unit_name")}
                  placeholder=""
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("unitName", data.unitName)}
                />
              </div>
            </div>

            <div className="col-span-1">
              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("commodityCode")}
                  label={t("commodity_plu")}
                  placeholder=""
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("commodityCode", data.commodityCode)}
                />
              </div>

              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("hsnCode")}
                  label={t("hsn_code")}
                  placeholder=""
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("hsnCode", data.hsnCode)}
                />
              </div>

              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("autoBarcode")}
                  label={t("auto_barcode")}
                  placeholder=""
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("autoBarcode", data.autoBarcode)}
                />
              </div>

              <div className="mt-2">
                <ERPInput
                  {...getFieldProps("batchNo")}
                  label={t("batch_no")}
                  placeholder=""
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("batchNo", data.batchNo)}
                />
              </div>

              <div className="mt-2">
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
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
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

          <div className="mt-4 h-32 bg-gray-200 rounded">{/* List area for product batches */}</div>
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
