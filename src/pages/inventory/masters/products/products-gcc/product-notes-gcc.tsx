import React, { useState } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";

const ProductNotesGcc: React.FC = () => {
    const [notes, setNotes] = useState<string[]>(Array(10).fill(""));
    const handleNoteChange = (index: number, value: string) => {
        const updatedNotes = [...notes];
        updatedNotes[index] = value;
        setNotes(updatedNotes);
    };

    const handleTransformToUpper = (fromIndex: number, toIndex: number) => {
        const updatedNotes = [...notes];
        updatedNotes[toIndex] = notes[fromIndex].toUpperCase();
        setNotes(updatedNotes);
    };
    const { t } = useTranslation('inventory')
    return (
        <div className="border border-[#ccc] rounded-md p-4 inline-block w-1/2">
            {[[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]].map(([leftIdx, rightIdx], rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2">
                    <ERPInput
                        label={`${t('note')} ${leftIdx + 1}`}
                        value={notes[leftIdx]}
                        onChange={(e: { target: { value: string; }; }) => handleNoteChange(leftIdx, e.target.value)}
                        className="w-11/12"
                        id={""}
                    />

                    <div className="flex items-end gap-2 w-full">
                        <ERPButton
                            title=">ar"
                            onClick={() => handleTransformToUpper(leftIdx, rightIdx)}
                        />
                        <ERPInput
                            label={`${t('note')} ${rightIdx + 1}`}
                            value={notes[rightIdx]}
                            onChange={(e: { target: { value: string; }; }) => handleNoteChange(rightIdx, e.target.value)}
                            className="w-full"
                            id={""}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductNotesGcc;
