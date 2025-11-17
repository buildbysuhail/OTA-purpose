import React, { useEffect, useState } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../../utilities/form-types";
import { ProductFieldPath, PathValue, productDto } from "../products-type";
interface ProductNotesGccProps {
    getFieldProps: (fieldId: string, type?: string) => FormField | any;
    isView: boolean;
    formState: any;
    handleFieldChange: <Path extends ProductFieldPath>(
        fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
        value?: PathValue<productDto, Path>
    ) => void;
}
const ProductNotesGcc: React.FC<ProductNotesGccProps> = ({ getFieldProps, handleFieldChange, isView, formState }) => {
    const moreInfo = getFieldProps("moreInfo").value || {};
    const [notes, setNotes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const updatedNotes: { [key: string]: string } = {};
        for (let i = 1; i <= 10; i++) {
            const key = `notes${i}`;
            updatedNotes[key] = moreInfo[key] || "";
        }
        setNotes(updatedNotes);
    }, [moreInfo]);

    const handleNoteChange = (key: string, value: string) => {
        const updated = { ...notes, [key]: value };
        setNotes(updated);
        handleFieldChange("moreInfo", { ...moreInfo, [key]: value });
    };

    const handleTransformToUpper = (fromKey: string, toKey: string) => {
        const updated = { ...notes, [toKey]: (notes[fromKey] || "").toUpperCase() };
        setNotes(updated);
        handleFieldChange("moreInfo", { ...moreInfo, [toKey]: updated[toKey] });
    };

    const { t } = useTranslation('inventory')

    return (
        <div className="border border-[#ccc] rounded-md p-4 w-full lg:w-1/2">
            {[1, 3, 5, 7, 9].map((i, rowIndex) => {
                const leftKey = `notes${i}`;
                const rightKey = `notes${i + 1}`;
                return (
                    <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <ERPInput
                            disabled={isView}
                            label={`${t('note')} ${i}`}
                            value={notes[leftKey] || ""}
                            onChange={(e) => handleNoteChange(leftKey, e.target.value)}
                            className="w-full"
                            id=""
                            fetching={formState?.loading !== false ? true : false}
                        />
                        <div className="flex items-end gap-2 w-full">
                            <ERPButton
                                disabled={isView}
                                title=">ar"
                                onClick={() => handleTransformToUpper(leftKey, rightKey)}
                                className="flex-shrink-0"
                            />
                            <ERPInput
                                disabled={isView}
                                label={`${t('note')} ${i + 1}`}
                                value={notes[rightKey] || ""}
                                onChange={(e) => handleNoteChange(rightKey, e.target.value)}
                                className="w-full"
                                id=""
                                fetching={formState?.loading !== false ? true : false}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductNotesGcc;