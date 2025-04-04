import React, { useState } from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
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
                        handleFieldChange("config.blockConvertProductNameToUpperCase", e.target.checked)
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

            {/* Popup for Fast Moving Items */}
            {activePopup === "fastMoving" && (
                <div className="fixed inset-0 rounded-md flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-xl font-bold mb-4">{t("pos_fast_moving_items")}</h2>
                        <POSFastMovingItems></POSFastMovingItems>
                        <ERPButton title="Close" variant="primary" onClick={closePopup} />
                    </div>
                </div>
            )}

            {/* Popup for Change Auto Barcode */}
            {activePopup === "autoBarcode" && (
                <div className="fixed inset-0 rounded-md flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-xl font-bold mb-4">{t("change_autobarcode")}</h2>
                        <ERPButton title="Close" variant="primary" onClick={closePopup} />
                    </div>
                </div>
            )}
        </div>
    );
});

export default ProductOthersIndia;
