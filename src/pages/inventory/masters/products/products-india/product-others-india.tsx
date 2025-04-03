import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { FormField } from "../../../../../utilities/form-types";

const ProductOthersIndia: React.FC<{
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
        <div className="grid grid-cols-2 gap-4 border border-[#ccc] inline-block rounded-md p-4">
            <div className="grid grid-cols-3 items-center gap-4">
                <div>
                    <ERPButton
                        title={t("pos_fast_moving_items")}
                        variant="secondary"
                    />
                </div>
                <div>
                    <ERPButton
                        title={t("change_autobarcode")}
                        variant="secondary"
                    />
                </div>
                <div>
                    <ERPButton
                        title={t("price_list_editor")}
                        variant="secondary"
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-4">
                <ERPCheckbox
                    {...getFieldProps("config.blockConvertProductNameToUpperCase")}
                    label={t("block_convert_product_name_to_upper_case")}
                    onChange={(e:any) => handleFieldChange("config.blockConvertProductNameToUpperCase", e.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.calculateMarkUpValue")}
                    label={t("calculate_markup_value")}
                    onChange={(e:any) => handleFieldChange("config.calculateMarkUpValue", e.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.showDisplayCost")}
                    label={t("show_display_cost")}
                    onChange={(e:any) => handleFieldChange("config.showDisplayCost", e.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.showProductDuplicateWarning")}
                    label={t("show_product_duplicate_warning_message")}
                    onChange={(e:any) => handleFieldChange("config.showProductDuplicateWarning", e.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.showProductDetailesAfterSave")}
                    label={t("show_product_details_after_save")}
                    onChange={(e:any) => handleFieldChange("config.showProductDetailesAfterSave", e.target.checked)}
                />
            </div>
        </div>
    );
});

export default ProductOthersIndia;