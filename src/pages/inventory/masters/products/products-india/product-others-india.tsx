import React, { useState } from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import { FormField } from "../../../../../utilities/form-types";
import POSFastMovingItems from "../common/fast-mooving";

const ProductOthersIndia: React.FC<{
    formState: any;
    handleFieldChange: (
        fields: string | { [fieldId: string]: any },
        value?: any
    ) => void;
    getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ formState, handleFieldChange, getFieldProps }) => {
    const { t } = useTranslation("inventory");

    const [activePopup, setActivePopup] = useState<string | null>(null);
    const openPopup = (popupType: string) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);

    return (
        <div className="grid grid-cols-2 gap-4 border border-[#ccc] inline-block rounded-md p-4">
            <div className="flex items-center gap-4">
                <ERPButton
                    title={t("pos_fast_moving_items")}
                    variant="secondary"
                    onClick={() => openPopup("fastMoving")}
                />
                <ERPButton
                    title={t("change_autobarcode")}
                    variant="secondary"
                    onClick={() => openPopup("autoBarcode")}
                />
            </div>
            <div className="flex flex-wrap gap-4">
                <ERPCheckbox
                    {...getFieldProps("config.blockConvertProductNameToUpperCase")}
                    label={t("block_convert_product_name_to_upper_case")}
                    onChange={(e: any) =>
                        handleFieldChange(
                            "config.blockConvertProductNameToUpperCase",
                            e.target.checked
                        )
                    }
                />
                <ERPCheckbox
                    {...getFieldProps("config.calculateMarkUpValue")}
                    label={t("calculate_markup_value")}
                    onChange={(e: any) =>
                        handleFieldChange("config.calculateMarkUpValue", e.target.checked)
                    }
                />
                <ERPCheckbox
                    {...getFieldProps("config.showDisplayCost")}
                    label={t("show_display_cost")}
                    onChange={(e: any) =>
                        handleFieldChange("config.showDisplayCost", e.target.checked)
                    }
                />
                <ERPCheckbox
                    {...getFieldProps("config.showProductDuplicateWarning")}
                    label={t("show_product_duplicate_warning_message")}
                    onChange={(e: any) =>
                        handleFieldChange("config.showProductDuplicateWarning", e.target.checked)
                    }
                />
                <ERPCheckbox
                    {...getFieldProps("config.showProductDetailesAfterSave")}
                    label={t("show_product_details_after_save")}
                    onChange={(e: any) =>
                        handleFieldChange("config.showProductDetailesAfterSave", e.target.checked)
                    }
                />
            </div>

            {activePopup === "fastMoving" && (
                <ERPModal
                    isOpen={true}
                    closeModal={(reload: boolean) => closePopup()}
                    title={t("pos_fast_moving_items")}
                    content={<POSFastMovingItems />}
                    width={780}
                    height={570}
                    disableOutsideClickClose={false}
                />
            )}

            {/* Modal for Change Auto Barcode */}
            {activePopup === "autoBarcode" && (
                <ERPModal
                    isOpen={true}
                    closeModal={(reload: boolean) => closePopup()}
                    title={t("change_autobarcode")}
                    content={<div>Hello</div>}
                    width={780}
                    height={570}
                    disableOutsideClickClose={false}
                />
            )}
        </div>
    );
});

export default ProductOthersIndia;
