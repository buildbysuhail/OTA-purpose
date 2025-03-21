import React, { useState } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import DataGrid, { Column } from "devextreme-react/data-grid";

interface NutrientOption {
    id: string;
    name: string;
}

interface NutritionDataItem {
    id: number;
    nutrient: string;
    valuePerServing: string;
}

const nutrientOptions: NutrientOption[] = [
    { id: "Protein", name: "Protein" },
    { id: "Carbohydrates", name: "Carbohydrates" },
    { id: "Fat", name: "Fat" },
    { id: "Fiber", name: "Fiber" },
    { id: "Vitamin A", name: "Vitamin A" },
    { id: "Vitamin C", name: "Vitamin C" },
    { id: "Calcium", name: "Calcium" },
    { id: "Iron", name: "Iron" },
];

const initialNutrientData = {
    nutrient: {
        id: "",
        name: ""
    },
    percentage: ""
};

const NutritionFactsIndia: React.FC = () => {
    const { t } = useTranslation('inventory');
    const { handleFieldChange, getFieldProps } = useFormManager({ initialData: initialNutrientData });
    const [nutritionData, setNutritionData] = useState<NutritionDataItem[]>([]);
    const handleAddNutrient = () => {
        const nutrientValue = getFieldProps("nutrient").value || initialNutrientData.nutrient;
        const percentageValue = getFieldProps("percentage").value || '';
        const newEntry: NutritionDataItem = {
            id: Date.now(),
            nutrient: typeof nutrientValue === 'object' ? nutrientValue.name : nutrientValue,
            valuePerServing: percentageValue ? percentageValue + '%' : ''
        };
        setNutritionData([...nutritionData, newEntry]);
        handleFieldChange("percentage", "");
    };

    const handleRemoveNutrient = (rowId: number) => {
        setNutritionData(nutritionData.filter(item => item.id !== rowId));
    };

    return (
        <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-end gap-4">
                    <ERPDataCombobox
                        {...getFieldProps("nutrient")}
                        field={{
                            id: "nutrient",
                            valueKey: "id",
                            labelKey: "name",
                        }}
                        label="Nutrients"
                        options={nutrientOptions}
                        onChangeData={(data) =>
                            handleFieldChange("nutrient", data)
                        }
                    />

                    <ERPInput
                        {...getFieldProps("percentage")}
                        label="%"
                        onChangeData={(data) =>
                            handleFieldChange("percentage", data)
                        }
                        className="w-32"
                    />

                    <ERPButton
                        onClick={handleAddNutrient}
                        title="Add"
                        variant="primary"
                    />
                </div>
            </div>

            <div className="mt-2">
                <DataGrid
                    dataSource={nutritionData}
                    showBorders={true}
                    columnAutoWidth={true}
                    rowAlternationEnabled={true}
                    height="auto">
                    <Column dataField="nutrient" caption="Nutrients" />
                    <Column dataField="valuePerServing" caption="Value Per Serving" />
                    <Column
                        caption="Remove"
                        width={80}
                        cellRender={(cellData) => (
                            <ERPButton
                                title="X"
                                onClick={() => handleRemoveNutrient(cellData.data.id)}
                            />
                        )}
                    />
                </DataGrid>
            </div>
        </div>
    );
};

export default NutritionFactsIndia;