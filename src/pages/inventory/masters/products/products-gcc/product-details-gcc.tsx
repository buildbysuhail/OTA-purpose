import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import ProductDetailsBatches from "../products-india/product-details-batches";
import { productDto } from "../products-type";

export const ProductDetailsGcc: React.FC<{
  clientSession: any;
  handleFieldChange: (fields: | string | { [fieldId: string]: any; },
    value?: any
  ) => void;
  getFieldProps: (fieldId: string, type?: string) => FormField;
  isView: boolean;
  formState: any;
}> = React.memo(({ clientSession, handleFieldChange, getFieldProps, isView, formState }) => {
  const { t } = useTranslation("inventory");
  return (
    <>
      {getFieldProps("details").value == true && (
        <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 items-end border border-gray-200 rounded-md p-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <ERPInput
                disabled={isView}
                {...getFieldProps("product.minimumStock")}
                label={t("stock_min")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data) =>
                  handleFieldChange(
                    "product.minimumStock",
                    data.product.minimumStock
                  )
                }
                fetching={formState?.loading !== false ? true : false}
              />

              <ERPInput
                disabled={isView}
                {...getFieldProps("product.maximumStock")}
                label={t("stock_max")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data) =>
                  handleFieldChange(
                    "product.maximumStock",
                    data.product.maximumStock
                  )
                }
                fetching={formState?.loading !== false ? true : false}
              />

              <ERPInput
                disabled={isView}
                {...getFieldProps("product.reorderQty")}
                label={t("re_order_qty")}
                placeholder="0.00"
                type="number"
                required={false}
                onChangeData={(data) =>
                  handleFieldChange(
                    "product.reorderQty",
                    data.product.reorderQty
                  )
                }
                fetching={formState?.loading !== false ? true : false}
              />
            </div>

            <div className="flex items-center gap-1">
              <ERPDataCombobox
                disabled={isView}
                {...getFieldProps("batch.warehouseID")}
                id="warehouseID"
                field={{
                  getListUrl: Urls.data_warehouse,
                  id: "warehouseID",
                  valueKey: "id",
                  labelKey: "name",
                }}
                onSelectItem={(data) =>
                  handleFieldChange("batch.warehouseID", data.value)
                }
                className="w-full"
                label={t("warehouse")}
                fetching={formState?.loading !== false ? true : false}
              />
            </div>

            <div className="flex items-center gap-1">
              <ERPDataCombobox
                disabled={isView}
                {...getFieldProps("batch.brandID")}
                id="brandID"
                field={{
                  id: "brandID",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_brands,
                }}
                onSelectItem={(data) =>
                  handleFieldChange("batch.brandID", data.value)
                }
                className="w-full"
                label={t("brand_mfg")}
                fetching={formState?.loading !== false ? true : false}
              />
            </div>

            <ERPInput
              disabled={isView}
              {...getFieldProps("product.commodityCode")}
              label={t("commodity_plu")}
              placeholder=""
              required={false}
              onChangeData={(data) =>
                handleFieldChange(
                  "product.commodityCode",
                  data.product.commodityCode
                )
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPDataCombobox
              disabled={isView}
              {...getFieldProps("product.productCategoryID")}
              id="productCategoryID"
              field={{
                id: "productCategoryID",
                valueKey: "id",
                labelKey: "name",
                getListUrl: Urls.data_productcategory,
              }}
              onSelectItem={(data: any) =>
                handleFieldChange("product.productCategoryID", data.value)
              }
              label={t("product_category")}
              className="w-full"
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              disabled={isView}
              {...getFieldProps("batch.specification")}
              label={t("specification")}
              placeholder=""
              required={false}
              onChangeData={(data) =>
                handleFieldChange(
                  "batch.specification",
                  data.batch.specification
                )
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              disabled={isView}
              {...getFieldProps("product.hsnCode")}
              label={t("hsn_code")}
              placeholder=""
              required={false}
              onChangeData={(data) =>
                handleFieldChange("product.hsnCode", data.product.hsnCode)
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              disabled={isView}
              {...getFieldProps("product.aliasItemName")}
              label={t("alias_name")}
              placeholder=""
              required={false}
              onChangeData={(data) =>
                handleFieldChange(
                  "product.aliasItemName",
                  data.product.aliasItemName
                )
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              {...getFieldProps("batch.autoBarcode")}
              label={t("auto_barcode")}
              placeholder=""
              required={false}
              disabled
              onChangeData={(data) => handleFieldChange("batch.autoBarcode", data.batch.autoBarcode)}
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              disabled={isView}
              {...getFieldProps("batch.batchNo")}
              label={t("batch_no")}
              placeholder=""
              required={false}
              onChangeData={(data) =>
                handleFieldChange("batch.batchNo", data.batch.batchNo)
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              disabled={isView}
              {...getFieldProps("product.netWt")}
              label={t("net_weight_(in_grams)")}
              placeholder="0.00"
              type="number"
              required={false}
              onChangeData={(data: productDto) =>
                handleFieldChange("product.netWt", data.product.netWt)
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              disabled={isView}
              {...getFieldProps("product.netWeightUnit")}
              label={t("unit_name")}
              placeholder={t("eg:gm/ml")}
              required={false}
              onChangeData={(data: productDto) =>
                handleFieldChange(
                  "product.netWeightUnit",
                  data.product.netWeightUnit
                )
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPDateInput
              disabled={isView}
              {...getFieldProps("batch.expiryDate")}
              label={t("exp_date")}
              required={false}
              onChange={(data) =>
                handleFieldChange("batch.expiryDate", data.target.value)
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPDateInput
              disabled={isView}
              {...getFieldProps("batch.mfgDate")}
              label={t("mfg_date")}
              required={false}
              onChange={(data) =>
                handleFieldChange("batch.mfgDate", data.target.value)
              }
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPDataCombobox
              disabled={isView}
              {...getFieldProps("batch.locationId")}
              id="locationId"
              field={{
                id: "locationId",
                valueKey: "id",
                labelKey: "name",
                getListUrl: Urls.data_locations
              }}
              onSelectItem={(data: any) =>
                handleFieldChange({ "batch.locationId": data.value, "batch.location": data.label })
              }
              label={t("location")}
              className="w-full"
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPCheckbox
              disabled={isView}
              {...getFieldProps("product.isActive")}
              label={t("is_active_batch")}
              onChange={(data) =>
                handleFieldChange("product.isActive", data.target.checked)
              }
            />
          </div>

          <div className="border border-gray-200 rounded-md p-2 relative">
            <h6 className="absolute top-[-13px] rounded-md px-4 py-1 bg-slate-50">
              {t("list_in")}
            </h6>
            <div className="flex flex-wrap items-center gap-6 mt-5">
              <ERPCheckbox
                disabled={isView}
                {...getFieldProps("product.canPurchase")}
                label={t("purchase")}
                onChange={(data) =>
                  handleFieldChange("product.canPurchase", data.target.checked)
                }
              />

              <ERPCheckbox
                disabled={isView}
                {...getFieldProps("product.canSale")}
                label={t("sales")}
                onChange={(data) =>
                  handleFieldChange("product.canSale", data.target.checked)
                }
              />

              <ERPCheckbox
                disabled={isView}
                {...getFieldProps("product.isFinishedGood")}
                label={t("finished_goods")}
                onChange={(data) =>
                  handleFieldChange(
                    "product.isFinishedGood",
                    data.target.checked
                  )
                }
              />

              <ERPCheckbox
                disabled={isView}
                {...getFieldProps("product.isRawMaterial")}
                label={t("raw_material")}
                onChange={(data) =>
                  handleFieldChange(
                    "product.isRawMaterial",
                    data.target.checked
                  )
                }
              />

              <ERPCheckbox
                disabled={isView}
                {...getFieldProps("batch.gatePass")}
                label={t("gate_pass")}
                onChange={(e) =>
                  handleFieldChange("batch.gatePass", e.target.checked)
                }
              />

              {clientSession.dbIdValue == "543140180640" && (
                <ERPCheckbox
                  disabled={isView}
                  {...getFieldProps("product.hold")}
                  label={t("hold")}
                  onChange={(data) =>
                    handleFieldChange("product.hold", data.target.checked)
                  }
                />
              )}
            </div>
          </div>
          {getFieldProps("product.productID").value > 0 &&
            <ProductDetailsBatches
              getFieldProps={getFieldProps}
              handleFieldChange={handleFieldChange}
              t={t}
            />
          }
        </div>
      )}
    </>
  );
});

export default ProductDetailsGcc;