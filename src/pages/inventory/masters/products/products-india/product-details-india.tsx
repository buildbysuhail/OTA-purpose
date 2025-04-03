import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { Plus } from "lucide-react";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../../utilities/form-types";

const ProductDetailsIndia: React.FC<{
  formState: any;
  handleFieldChange: (
    fields:
      | string
      | {
          [fieldId: string]: any;
        },
    value?: any
  ) => void;
  t: any;
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({formState,handleFieldChange,t,getFieldProps}) => {
  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
      <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded-md p-2">
        <div className="grid grid-cols-3 gap-1">
          <ERPInput
            {...getFieldProps("product.minimumStock")}
            label={t("stock_min")}
            placeholder="0.00"
            type="number"
            required={false}
            onChangeData={(data) =>
              handleFieldChange("product.minimumStock", data.product.minimumStock)
            }
          />

          <ERPInput
            {...getFieldProps("product.maximumStock")}
            label={t("stock_max")}
            placeholder="0.00"
            type="number"
            required={false}
            onChangeData={(data) =>
              handleFieldChange("product.maximumStock", data.product.maximumStock)
            }
          />
          <ERPInput
            {...getFieldProps("product.reorderQty")}
            label={t("re_order_qty")}
            placeholder="0.00"
            type="number"
            required={false}
            onChangeData={(data) =>
              handleFieldChange("product.reorderQty", data.product.reorderQty)
            }
          />
        </div>

        <div className="flex items-center gap-1">
          <ERPDataCombobox
            {...getFieldProps("product.warehouseID")}
            id= "warehouseID"
            field={{
              id: "warehouseID",
              valueKey: "id",
              // getListUrl: Urls.data_user_types,
              labelKey: "name",
            }}
            onChangeData={(data) =>
              handleFieldChange("product.warehouseID", data.product.warehouseID)
            }
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
            id= "brandID"
            field={{
              id: "brandID",
              valueKey: "id",
              // getListUrl: Urls.data_user_types,
              labelKey: "name",
            }}
            onChangeData={(data) =>
              handleFieldChange("product.brandID", data.product.brandID)
            }
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
          onChangeData={(data) =>
            handleFieldChange("product.commodityCode", data.product.commodityCode)
          }
        />

        <ERPInput
          {...getFieldProps("product.aliasItemName")}
          label={t("alias_name")}
          placeholder=""
          required={false}
          onChangeData={(data) =>
            handleFieldChange("product.aliasItemName", data.product.aliasItemName)
          }
        />

        <ERPInput
          {...getFieldProps("product.specification")}
          label={t("specification")}
          placeholder=""
          required={false}
          onChangeData={(data) =>
            handleFieldChange("product.specification", data.product.specification)
          }
        />

        <ERPInput
          {...getFieldProps("product.hsnCode")}
          label={t("hsn_code")}
          placeholder=""
          required={false}
          onChangeData={(data) =>
            handleFieldChange("product.hsnCode", data.product.hsnCode)
          }
        />

        <ERPDateInput
          {...getFieldProps("product.expiryDate")}
          label={t("exp_date")}
          required={false}
          onChange={(e) => handleFieldChange('product.expiryDate', e.target.value)}
          // onChangeData={(data) =>
          //   handleFieldChange("product.expiryDate", data.product.expiryDate)
          // }
        />

        <ERPInput
          {...getFieldProps("product.autoBarcode")}
          label={t("auto_barcode")}
          placeholder=""
          required={false}
          onChangeData={(data) =>
            handleFieldChange("product.autoBarcode", data.product.autoBarcode)
          }
        />

        <ERPInput
          {...getFieldProps("product.batchNo")}
          label={t("batch_no")}
          placeholder=""
          required={false}
          onChangeData={(data) =>
            handleFieldChange("product.batchNo", data.product.batchNo)
          }
        />

        <div className="grid grid-cols-2 gap-1">
          <ERPInput
            {...getFieldProps("product.netWeight")}
            label={t("net_weight_(in_grams)")}
            placeholder="0.00"
            type="number"
            required={false}
            onChangeData={(data) =>
              handleFieldChange("product.netWeight", data.product.netWeight)
            }
          />

          <ERPInput
            {...getFieldProps("product.unitName")}
            label={t("unit_name")}
            placeholder={t("eg:gm/ml")}
            required={false}
            onChangeData={(data) =>
              handleFieldChange("product.unitName", data.product.unitName)
            }
          />
        </div>

        <ERPDateInput
          {...getFieldProps("product.mfgDate")}
          id="mfgDate"
          label={t("mfg_date")}
          required={false}
          onChange={(e) => handleFieldChange('product.mfgDate', e.target.value)}
          // onChangeData={(data) =>
          //   handleFieldChange("product.mfgDate", data.product.mfgDate)
          // }
        />

        <ERPDataCombobox
          {...getFieldProps("product.location")}
          field={{
            id: "location",
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange("product.location", data.product.location)
          }
          label={t("location")}
          options={[]}
        />
      </div>

      <div className="border border-gray-200 rounded-md p-2 relative">
        <h6 className="absolute top-[-13px] rounded-md bg-gray-500 px-4 py-1">
          {t("list_in")}
        </h6>
        <div className="flex flex-wrap items-center gap-6 mt-5">
          <ERPCheckbox
            {...getFieldProps("product.canPurchase")}
            label={t("purchase")}
            onChange={(e) => handleFieldChange('product.canPurchase', e.target.checked)}
          />

          <ERPCheckbox
            {...getFieldProps("product.canSale")}
            label={t("sales")}
            onChange={(e) => handleFieldChange('product.canSale', e.target.checked)}
            // onChangeData={(data) =>
            //   handleFieldChange("product.canSale", data.canSale)
            // }
          />

          <ERPCheckbox
            {...getFieldProps("product.isFinishedGood")}
            label={t("finished_goods")}
            onChange={(e) => handleFieldChange('product.isFinishedGood', e.target.checked)}
            // onChangeData={(data) =>
            //   handleFieldChange("product.isFinishedGood", data.isFinishedGood)
            // }
          />

          <ERPCheckbox
            {...getFieldProps("product.isRawMaterial")}
            label={t("raw_material")}
            onChange={(e) => handleFieldChange('product.isRawMaterial', e.target.checked)}
            // onChangeData={(data) =>
            //   handleFieldChange("product.isRawMaterial", data.isRawMaterial)
            // }
          />

          <ERPCheckbox
            {...getFieldProps("product.active")}
            label={t("is_active_batch")}
            onChange={(e) => handleFieldChange('product.active', e.target.checked)}
            // onChangeData={(data) =>
            //   handleFieldChange("product.active", data.active)
            // }
          />

          <ERPCheckbox
            {...getFieldProps("product.gatePass")}
            label={t("gate_pass")}
            onChange={(e) => handleFieldChange('product.gatePass', e.target.checked)}

            // onChangeData={(data) =>
            //   handleFieldChange("product.gatePass", data.gatePass)
            // }
          />

          <ERPCheckbox
            {...getFieldProps("product.hold")}
            label={t("hold")}
            onChange={(e) => handleFieldChange('product.hold', e.target.checked)}
            // onChangeData={(data) =>
            //   handleFieldChange("product.hold", data.hold)
            // }
          />
        </div>
      </div>
    </div>
  );
});

export default ProductDetailsIndia;
