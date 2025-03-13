import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { Plus } from "lucide-react";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { useTranslation } from "react-i18next";

const ProductReOrderIndia: React.FC = React.memo(() => {
    const { t } = useTranslation("inventory");
    const { handleFieldChange, getFieldProps } = useFormManager<productDto>({ initialData: initialProductData, });
    return (
        <div className="border border-[#ccc] inline-block rounded-md p-4">
            <div className="flex items-center gap-4">
                <ERPCheckbox
                    {...getFieldProps("product.poFrequency")}
                    label={t("po_frequency")}
                    onChangeData={(data) => handleFieldChange("product.poFrequency", data.poFrequency)}
                />
                <ERPDataCombobox
                    {...getFieldProps("product.poFrequencyData")}
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
                    onChangeData={(data) => handleFieldChange("product.minimumStock", data.minimumStock)}
                />
                <ERPInput
                    {...getFieldProps("product.maximumStock")}
                    label={t("stock_max")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.maximumStock", data.maximumStock)}
                />
                <ERPInput
                    {...getFieldProps("product.reorderQty")}
                    label={t("re_order_qty")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.reorderQty", data.reorderQty)}
                />
                <ERPInput
                    {...getFieldProps("product.reorderLevel")}
                    label={t("re_order_level")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.reorderLevel", data.reorderLevel)}
                />
                <ERPInput
                    {...getFieldProps("product.avgSales")}
                    label={t("avg_sales")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.avgSales", data.avgSales)}
                />
                <ERPInput
                    {...getFieldProps("product.avgCost")}
                    label={t("avg_cost")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.avgCost", data.avgCost)}
                />
                <ERPInput
                    {...getFieldProps("product.avgRate")}
                    label={t("avg_rate")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.avgRate", data.avgRate)}
                />
            </div>
        </div>
    );
});

export default ProductReOrderIndia;