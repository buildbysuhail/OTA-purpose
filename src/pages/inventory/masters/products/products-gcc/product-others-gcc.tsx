import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";

const ProductOthersGcc: React.FC = React.memo(() => {
    const { t } = useTranslation("inventory");
    const { handleFieldChange, getFieldProps } = useFormManager<productDto>({ initialData: initialProductData, });
    return (
        <div className="grid grid-cols-2 gap-4 border border-[#ccc] inline-block rounded-md p-4">
            <div className="flex items-center gap-4">
                <ERPButton
                    title={t("change_autobarcode")}
                    variant="secondary"
                />
                <ERPButton
                    title={t("pos_fast_moving_items")}
                    variant="secondary"
                    className="whitespace-nowrap"
                />
                <ERPButton
                    title={t("price_list_editor")}
                    variant="secondary"
                />
            </div>
            <div className="flex flex-wrap gap-4">
                <ERPCheckbox
                    {...getFieldProps("config.showProductDuplicateWarning")}
                    label={t("show_product_duplicate_warning_message")}
                    onChangeData={(data) => handleFieldChange("config.showProductDuplicateWarning", data.showProductDuplicateWarning)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.showProductDetailesAfterSave")}
                    label={t("show_product_details_after_save")}
                    onChangeData={(data) => handleFieldChange("config.showProductDetailesAfterSave", data.showProductDetailesAfterSave)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.blockConvertProductNameToUpperCase")}
                    label={t("block_convert_product_name_to_upper_case")}
                    onChangeData={(data) => handleFieldChange("config.blockConvertProductNameToUpperCase", data.blockConvertProductNameToUpperCase)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.calculateMarkUpValue")}
                    label={t("calculate_markup_value")}
                    onChangeData={(data) => handleFieldChange("config.calculateMarkUpValue", data.calculateMarkUpValue)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.showDisplayCost")}
                    label={t("show_display_cost")}
                    onChangeData={(data) => handleFieldChange("config.showDisplayCost", data.showDisplayCost)}
                />
            </div>
        </div>
    );
});

export default ProductOthersGcc;