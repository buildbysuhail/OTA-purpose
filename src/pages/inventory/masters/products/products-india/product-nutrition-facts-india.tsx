import React, { useEffect, useState } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { FormField } from "../../../../../utilities/form-types";
import { ProductFieldPath, PathValue, productDto, ProductNutrientsInputDto } from "../products-type";
import Urls from "../../../../../redux/urls";
import { X } from "lucide-react";

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
    isMaximized?: boolean;
    modalHeight?: any
    isView: boolean;
    getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ formState, handleFieldChange, getFieldProps, isMaximized, modalHeight, isView }) => {

    const { t } = useTranslation('inventory');
    const [nutrition, setNutrition] = useState<ProductNutrientsInputDto>(initialNutrientData);
    const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });

    useEffect(() => {
        let gridHeightMobile = modalHeight - 500;
        let gridHeightWindows = modalHeight - 600;
        setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [isMaximized, modalHeight]);

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
                        disabled={isView}
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
                        disabled={isView}
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
                        title={t("add")}
                        variant="primary"
                        disabled={isView}
                        onClick={handleAddNutrient}
                    />
                </div>
            </div>

            <div className="mt-2">
                <DataGrid
                    dataSource={getFieldProps("nutrients").value}
                    showBorders={true}
                    columnAutoWidth={true}
                    rowAlternationEnabled={true}
                    height={gridHeight.windows}
                >
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
                        cellRender={(cellData) =>
                        (
                            <a
                                className="cursor-pointer bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                onClick={() => handleRemoveNutrient(cellData.rowIndex)}>
                                <X className="w-4 h-4" />
                            </a>
                        )}
                    />
                </DataGrid>
            </div>
        </div >
    );
});

export default NutritionFactsIndia;
