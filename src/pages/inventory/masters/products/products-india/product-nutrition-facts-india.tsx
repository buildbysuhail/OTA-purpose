import React, { useState } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { FormField } from "../../../../../utilities/form-types";
import { ProductFieldPath, PathValue, productDto, ProductNutrientsInputDto } from "../products-type";
import Urls from "../../../../../redux/urls";

interface NutrientOption {
    id: string;
    name: string;
}

const initialNutrientData: ProductNutrientsInputDto = {
    nutrients: "",
    valuePerServing: 0
};

const NutritionFactsIndia: React.FC<{
    formState: any;
    handleFieldChange: <Path extends ProductFieldPath>(
        fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
        value?: PathValue<productDto, Path>
    ) => void;
    getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ formState, handleFieldChange, getFieldProps }) => {

    const { t } = useTranslation('inventory');
    const [nutrition, setNutrition] = useState<ProductNutrientsInputDto>(initialNutrientData);

    const handleAddNutrient = () => {
        let nutritionData = getFieldProps("nutrients").value as ProductNutrientsInputDto[];
        handleFieldChange("nutrients", [...nutritionData, nutrition]);
        setNutrition(initialNutrientData);
    };

    const handleRemoveNutrient = (rowId: number) => {
        let nutritionData = getFieldProps("nutrients").value as ProductNutrientsInputDto[];
        handleFieldChange("nutrients", [...nutritionData?.filter((_, index) => index !== rowId)]);
    };

    return (
        <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-end gap-4">
                    <ERPDataCombobox
                        id="nutrient"
                        value={nutrition.nutrients}
                        field={{
                            id: "nutrient",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.data_nutrients
                        }}
                        label={t("nutrients")}
                        onSelectItem={(e) => {
                            setNutrition((prev) => ({
                                ...prev,
                                nutrientsID: e.value,
                                nutrients: e.label,
                            }));
                        }}
                    />

                    <ERPInput
                        id="percentage"
                        value={nutrition.valuePerServing}
                        label="%"
                        onChange={(e) =>
                            setNutrition((prev) => ({
                                ...prev,
                                valuePerServing: Number(e.target.value), 
                            }))
                        }
                        className="w-32"
                    />

                    <ERPButton
                        onClick={handleAddNutrient}
                        title={t("add")}
                        variant="primary"
                    />
                </div>
            </div>

            <div className="mt-2">
                <DataGrid
                    dataSource={getFieldProps("nutrients").value}
                    showBorders={true}
                    columnAutoWidth={true}
                    rowAlternationEnabled={true}
                    height="300">
                    <Column
                        dataField="nutrients"
                        dataType="string"
                        caption={t("nutrients")}
                    />

                    <Column
                        dataField="valuePerServing"
                        caption={t("value_per_serving")}
                    />

                    <Column
                        caption={t("remove")}
                        width={80}
                        cellRender={(cellData) => (
                            <a className="cursor-pointer text-[#EF4444] hover:text-[#B91C1C] font-semibold" onClick={() => handleRemoveNutrient(cellData.rowIndex)}>X</a>
                        )}
                    />
                </DataGrid>
            </div>
        </div>
    );
});

export default NutritionFactsIndia;
