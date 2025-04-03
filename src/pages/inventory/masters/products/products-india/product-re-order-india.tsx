import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { Plus } from "lucide-react";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../../utilities/form-types";

const ProductReOrderIndia: React.FC<{
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
}> = React.memo(({formState,handleFieldChange,getFieldProps}) => {

    const { t } = useTranslation("inventory");
  
    return (
        <div className="border border-[#ccc] inline-block rounded-md p-4">
            <div className="flex items-center gap-4">
                <ERPCheckbox
                    {...getFieldProps("product.poFrequency")}
                    label={t("po_frequency")}
                    onChange={(data) => handleFieldChange("product.poFrequency", data.target.checked)}
                />
                <ERPDataCombobox
                    {...getFieldProps("product.poFrequencyData")}
                    id="poFrequencyData"
                    field={{
                        id: "poFrequencyData",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data) => handleFieldChange("product.poFrequencyData", data.poFrequencyData)}
                    noLabel={true}
                    options={[]}
                    className="w-full"
                />
                <button className="bg-gray-300 text-black p-2 rounded-full hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <ERPInput
                    {...getFieldProps("product.minimumStock")}
                    label={t("stock_min")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.minimumStock", data.product.minimumStock)}
                />
                <ERPInput
                    {...getFieldProps("product.maximumStock")}
                    label={t("stock_max")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.maximumStock", data.product.maximumStock)}
                />
                <ERPInput
                    {...getFieldProps("product.reorderQty")}
                    label={t("re_order_qty")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.reorderQty", data.product.reorderQty)}
                />
                <ERPInput
                    {...getFieldProps("product.reorderLevel")}
                    label={t("re_order_level")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.reorderLevel", data.product.reorderLevel)}
                />
                <ERPInput
                    {...getFieldProps("product.avgSales")}
                    label={t("avg_sales")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.avgSales", data.product.avgSales)}
                />
                <ERPInput
                    {...getFieldProps("product.avgCost")}
                    label={t("avg_cost")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.avgCost", data.product.avgCost)}
                />
                <ERPInput
                    {...getFieldProps("product.avgRate")}
                    label={t("avg_rate")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.avgRate", data.product.avgRate)}
                />
            </div>
        </div>
    );
});

export default ProductReOrderIndia;