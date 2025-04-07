import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { Plus } from "lucide-react";
import { PathValue, productDto, ProductFieldPath } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";

const ProductDetailsIndia: React.FC<{
  formState: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;
  t: any;
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ formState, handleFieldChange, t, getFieldProps }) => {
  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
      <div className="flex flex-wrap gap-1 border border-gray-200 rounded-md p-2">
        <div className="flex flex-wrap gap-1 w-full">
          <div className="flex flex-1 flex-wrap gap-1 min-w-[250px]">
            <ERPInput
              {...getFieldProps("product.minimumStock")}
              label={t("stock_min")}
              placeholder="0.00"
              type="number"
              required={false}
              onChangeData={(data: productDto) =>
                handleFieldChange("product.minimumStock", data.product.minimumStock)
              }
              className="flex-1 min-w-[100px]"
            />

            <ERPInput
              {...getFieldProps("product.maximumStock")}
              label={t("stock_max")}
              placeholder="0.00"
              type="number"
              required={false}
              onChangeData={(data: productDto) =>
                handleFieldChange("product.maximumStock", data.product.maximumStock)
              }
              className="flex-1 min-w-[100px]"
            />
            <ERPInput
              {...getFieldProps("product.reorderQty")}
              label={t("re_order_qty")}
              placeholder="0.00"
              type="number"
              required={false}
              onChangeData={(data: productDto) =>
                handleFieldChange("product.reorderQty", data.product.reorderQty)
              }
              className="flex-1 min-w-[100px]"
            />
          </div>

          <div className="flex flex-1 items-end gap-1 min-w-[200px]">
            <ERPDataCombobox
              {...getFieldProps("batch.warehouseID")}
              id="warehouseID"
              field={{
                id: "warehouseID",
                valueKey: "id",
                getListUrl: Urls.data_warehouse,
                labelKey: "name",
              }}
              onChangeData={(data: productDto) =>
                handleFieldChange("batch.warehouseID", data.batch.warehouseID)
              }
              className="flex-1"
              label={t("warehouse")}
              options={[]}
            />

            <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300 flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-1 items-end gap-1 min-w-[200px]">
            <ERPDataCombobox
              {...getFieldProps("batch.brandID")}
              id="brandID"
              field={{
                id: "brandID",
                valueKey: "id",
                getListUrl: Urls.data_brands,
                labelKey: "name",
              }}
              onChangeData={(data: productDto) =>
                handleFieldChange("batch.brandID", data.batch.brandID)
              }
              className="flex-1"
              label={t("brand_mfg")}
            />

            <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300 flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 w-full">
          <ERPInput
            {...getFieldProps("product.commodityCode")}
            label={t("commodity_plu")}
            placeholder=""
            required={false}
            onChangeData={(data: productDto) =>
              handleFieldChange("product.commodityCode", data.product.commodityCode)
            }
            className="flex-1 min-w-[200px]"
          />

          <ERPInput
            {...getFieldProps("product.aliasItemName")}
            label={t("alias_name")}
            placeholder=""
            required={false}
            onChangeData={(data: productDto) =>
              handleFieldChange("product.aliasItemName", data.product.aliasItemName)
            }
            className="flex-1 min-w-[200px]"
          />

          <ERPInput
            {...getFieldProps("batch.specification")}
            label={t("specification")}
            placeholder=""
            required={false}
            onChangeData={(data: productDto) =>
              handleFieldChange("batch.specification", data.batch.specification)
            }
            className="flex-1 min-w-[200px]"
          />
        </div>

        <div className="flex flex-wrap gap-1 w-full">
          <ERPInput
            {...getFieldProps("product.hsnCode")}
            label={t("hsn_code")}
            placeholder=""
            required={false}
            onChangeData={(data: productDto) =>
              handleFieldChange("product.hsnCode", data.product.hsnCode)
            }
            className="flex-1 min-w-[200px]"
          />

          <ERPDateInput
            {...getFieldProps("batch.expiryDate")}
            label={t("exp_date")}
            required={false}
            onChange={(e) => handleFieldChange('batch.expiryDate', e.target.value as any)}
            className="flex-1 min-w-[200px]"
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.expiryDate", data.product.expiryDate)
          // }
          />

          <ERPInput
            {...getFieldProps("product.autoBarcode")}
            label={t("auto_barcode")}
            placeholder=""
            required={false}
            onChangeData={(data: productDto) =>
              handleFieldChange("product.autoBarcode", data.product.autoBarcode)
            }
            className="flex-1 min-w-[200px]"
          />
        </div>

        <div className="flex flex-wrap gap-1 w-full">
          <ERPInput
            {...getFieldProps("batch.batchNo")}
            label={t("batch_no")}
            placeholder=""
            required={false}
            onChangeData={(data: productDto) =>
              handleFieldChange("batch.batchNo", data.batch.batchNo)
            }
            className="flex-1 min-w-[200px]"
          />

          <div className="flex flex-1 gap-1 min-w-[200px]">
            <ERPInput
              {...getFieldProps("product.netWeight")}
              label={t("net_weight_(in_grams)")}
              placeholder="0.00"
              type="number"
              required={false}
              onChangeData={(data: productDto) =>
                handleFieldChange("product.marginPercentage", data.product.marginPercentage)
              }
              className="truncate flex-1 min-w-[100px]"
            />

            <ERPInput
              {...getFieldProps("product.unitName")}
              label={t("unit_name")}
              placeholder={t("eg:gm/ml")}
              required={false}
              onChangeData={(data: productDto) =>
                handleFieldChange("product.unitName", data.product.unitName)
              }
              className="flex-1 min-w-[80px]"
            />
          </div>

          <ERPDateInput
            {...getFieldProps("batch.mfgDate")}
            id="mfgDate"
            label={t("mfg_date")}
            required={false}
            onChange={(e) => handleFieldChange('batch.mfgDate', e.target.value as any)}
            className="flex-1 min-w-[200px]"
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.mfgDate", data.product.mfgDate)
          // }
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full">
          <ERPDataCombobox
            {...getFieldProps("batch.location")}
            field={{
              id: "location",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_locations
            }}
            onChangeData={(data: productDto) =>
              handleFieldChange("batch.location", data.batch.location)
            }
            label={t("location")}
            options={[]}
            className="flex-2 min-w-[200px]"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-2 pt-6 relative">
        <h6 className="absolute top-[-13px] left-4 rounded-md bg-gray-500 px-4 py-1 text-white">
          {t("list_in")}
        </h6>
        <div className="flex flex-wrap gap-x-6 gap-y-4 mt-2">
          <ERPCheckbox
            {...getFieldProps("product.canPurchase")}
            label={t("purchase")}
            onChange={(e) => handleFieldChange('product.canPurchase', e.target.checked)}
          />

          <ERPCheckbox
            {...getFieldProps("product.canSale")}
            label={t("sales")}
            onChange={(e) => handleFieldChange('product.canSale', e.target.checked)}
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.canSale", data.canSale)
          // }
          />

          <ERPCheckbox
            {...getFieldProps("product.isFinishedGood")}
            label={t("finished_goods")}
            onChange={(e) => handleFieldChange('product.isFinishedGood', e.target.checked)}
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.isFinishedGood", data.isFinishedGood)
          // }
          />

          <ERPCheckbox
            {...getFieldProps("product.isRawMaterial")}
            label={t("raw_material")}
            onChange={(e) => handleFieldChange('product.isRawMaterial', e.target.checked)}
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.isRawMaterial", data.isRawMaterial)
          // }
          />

          <ERPCheckbox
            {...getFieldProps("product.isActive")}
            label={t("is_active_batch")}
            onChange={(e) => handleFieldChange('product.isActive', e.target.checked)}
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.active", data.active)
          // }
          />

          <ERPCheckbox
            {...getFieldProps("batch.gatePass")}
            label={t("gate_pass")}
            onChange={(e) => handleFieldChange('batch.gatePass', e.target.checked)}
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.gatePass", data.gatePass)
          // }
          />

          <ERPCheckbox
            {...getFieldProps("product.hold")}
            label={t("hold")}
            onChange={(e) => handleFieldChange('product.hold', e.target.checked)}
          // onChangeData={(data: productDto) =>
          //   handleFieldChange("product.hold", data.hold)
          // }
          />
        </div>
      </div>
    </div>
  );
});

export default ProductDetailsIndia;
