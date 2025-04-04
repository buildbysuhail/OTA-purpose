import React, { useState } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { FormField } from "../../../../../utilities/form-types";
import { ProductFieldPath, PathValue, productDto, ProductNutrientsInputDto } from "../products-type";

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

const initialNutrientData: ProductNutrientsInputDto = {
    nutrients: "",
    valuePerServing: ""
};
const NutritionFactsIndia: React.FC<{
    formState: any;
    handleFieldChange: <Path extends ProductFieldPath>(
        fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
        value?: PathValue<productDto, Path>
      ) => void;
    
    getFieldProps: (fieldId: string, type?: string) => FormField;
  }> = React.memo(({formState,handleFieldChange,getFieldProps}) => {
    const { t } = useTranslation('inventory');
    
    const [nutrition, setNutrition] = useState<ProductNutrientsInputDto>(initialNutrientData);
    const handleAddNutrient = () => {
        let nutritionData = getFieldProps("nutrients").value as ProductNutrientsInputDto[];
        handleFieldChange("nutrients",[...nutritionData, nutrition])
        setNutrition(initialNutrientData);
    };
    const handleRemoveNutrient = (rowId: number) => {
        let nutritionData = getFieldProps("nutrients").value as ProductNutrientsInputDto[];
        handleFieldChange("nutrients",[...nutritionData?.filter((_, index) => index !== rowId)])
      };
    return (
        <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-end gap-4">
                    <ERPDataCombobox
                    id="nutrient"
                    value={nutrition.valuePerServing}
                        field={{
                            id: "nutrient",
                            valueKey: "id",
                            labelKey: "name",
                        }}
                        label="Nutrients"
                        options={nutrientOptions}
                        onChange={(e) =>
                           {
                            debugger;
                            setNutrition((prev: any) => ({
                                ...prev,
                                nutrients: e.value,
                              }))
                           }
                        }
                    />

                    <ERPInput
                    id="percentage"
                    value={nutrition.valuePerServing}
                        label="%"
                        onChange={(e) =>
                            setNutrition((prev: any) => ({
                                ...prev,
                                valuePerServing: e.target.value,
                              }))
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
                    dataSource={getFieldProps("nutrients").value }
                    showBorders={true}
                    columnAutoWidth={true}
                    rowAlternationEnabled={true}
                    height="300">
                    <Column dataField="nutrients" dataType="string" caption="Nutrients" />
                    <Column dataField="valuePerServing" caption="Value Per Serving" />
                    <Column
                        caption="Remove"
                        width={80}
                        cellRender={(cellData) => (
                            <a
      className="cursor-pointer text-red-600 hover:text-red-800 font-semibold"
      onClick={() => handleRemoveNutrient(cellData.rowIndex)}
    >
      X
    </a>
                        )}
                        />
                </DataGrid>
            </div>
        </div>
    );
});

export default NutritionFactsIndia;