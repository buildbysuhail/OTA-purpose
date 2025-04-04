import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";

const api = new APIClient();

export const initialQuantityLimit = {
    data: {
        id: 0,
        selectedOption: "department",
        department: "",
        category: "",
        productGroup: "",
        barcode: "",
        quantityLimit: 0,
        itemData: []
    },
    validations: {
        department: "",
        category: "",
        productGroup: "",
        barcode: "",
        quantityLimit: ""
    }
};

export interface QuantityLimitData {
    id: number;
    selectedOption: string;
    department: string;
    category: string;
    productGroup: string;
    barcode: string;
    quantityLimit: number;
    itemData: any[];
}

export interface QuantityLimitItemData {
    id: number;
    sl: number;
    barcode: string;
    product: string;
    qtyLimit: number;
}

export const QuantityLimit: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<QuantityLimitItemData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    const {
        isEdit,
        handleSubmit,
        handleFieldChange,
        handleClear: clearForm,
        getFieldProps,
        isLoading,
        formState,
    } = useFormManager<QuantityLimitData>({
        initialData: initialQuantityLimit,
        useApiClient: true,
    });

    const handleOptionChange = (option: string) => {
        handleFieldChange("selectedOption", option);
    };

    const handleLoad = useCallback(async () => {
        try {
            setIsDataLoading(true);
            // const response = await api.get(Urls.quantity_limit);
            // if (response && response.data) {
            //     setGridData(response.data);
            // }
            setIsDataLoading(false);
        } catch (error) {
            console.error("Error loading data:", error);
            setIsDataLoading(false);
        }
    }, []);

    const handleAdd = useCallback(() => {
        const { selectedOption, department, category, productGroup, barcode, quantityLimit } = formState.data;

        let product = "";
        switch (selectedOption) {
            case "department":
                product = department;
                break;
            case "category":
                product = category;
                break;
            case "productGroup":
                product = productGroup;
                break;
            case "barcode":
                product = barcode;
                break;
        }

        const newItem: QuantityLimitItemData = {
            id: gridData.length > 0 ? Math.max(...gridData.map(item => item.id)) + 1 : 1,
            sl: gridData.length + 1,
            barcode: barcode || "-",
            product: product || "-",
            qtyLimit: quantityLimit || 0
        };

        setGridData(prevData => [...prevData, newItem]);
    }, [formState.data, gridData]);

    const handleClear = useCallback(() => {
        clearForm();
    }, [clearForm]);

    const handleClearAll = useCallback(() => {
        setGridData([]);
    }, []);

    const handleDelete = useCallback(() => {
        if (selectAll) {
            setGridData([]);
        }
    }, [selectAll]);

    const handleRemoveRow = useCallback((rowId: number) => {
        setGridData(prevData => prevData.filter(item => item.id !== rowId));
    }, []);

    const handleSave = useCallback(() => {
        console.log("Saving data:", gridData);
    }, [gridData]);

    const handleSelectAllToDelete = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(e.target.checked);
    }, []);

    const renderDeleteCell = (cellData: any) => {
        return (
            <div className="flex justify-center">
                <button className="text-[#ef4444] font-bold px-2" onClick={() => handleRemoveRow(cellData.data.id)}>X</button>
            </div>
        );
    };

    return (
        <div className="w-full modal-content flex flex-col gap-4">
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-1 items-end gap-3">
                <div >
                    <ERPRadio
                        id="department"
                        name="limitOption"
                        label={t("department")}
                        checked={formState.data.selectedOption === "department"}
                        className="w-full"
                        onChange={() => handleOptionChange("department")}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("department")}
                        value={formState.data.department}
                        noLabel={true}
                        field={{
                            id: "department",
                            valueKey: "id",
                            labelKey: "name",
                            // getListUrl:Urls.
                        }}
                        disabled={formState.data.selectedOption !== "department"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("department", data.department)}
                    />
                </div>

                <div>
                    <ERPRadio
                        id="category"
                        name="limitOption"
                        label={t("category")}
                        className="w-full"
                        checked={formState.data.selectedOption === "category"}
                        onChange={() => handleOptionChange("category")}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("category")}
                        value={formState.data.category}
                        noLabel={true}
                        field={{
                            id: "category",
                            valueKey: "id",
                            labelKey: "name",
                            // getListUrl:Urls.category
                        }}
                        disabled={formState.data.selectedOption !== "category"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("category", data.category)}
                    />
                </div>

                <div>
                    <ERPRadio
                        id="productGroup"
                        name="limitOption"
                        label={t("product_group")}
                        className="w-full"
                        checked={formState.data.selectedOption === "productGroup"}
                        onChange={() => handleOptionChange("productGroup")}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("productGroup")}
                        value={formState.data.productGroup}
                        noLabel={true}
                        field={{
                            id: "productGroup",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.data_productgroup
                        }}
                        disabled={formState.data.selectedOption !== "productGroup"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("productGroup", data.productGroup)}
                    />
                </div>

                <div>
                    <ERPRadio
                        id="barcode"
                        name="barcode"
                        label={t("barcode")}
                        className="w-full"
                        checked={formState.data.selectedOption === "barcode"}
                        onChange={() => handleOptionChange("barcode")}
                    />
                    <ERPInput
                        {...getFieldProps("barcode")}
                        value={formState.data.barcode}
                        noLabel={true}
                        disabled={formState.data.selectedOption !== "barcode"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
                    />
                </div>

                <div>
                    <ERPInput
                        name="quantityLimit"
                        {...getFieldProps("quantityLimit")}
                        value={formState.data.quantityLimit}
                        label={t("Quantity Limit")}
                        type="number"
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("quantityLimit", parseInt(data.quantityLimit))}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <ERPButton
                    title={t("Delete")}
                    variant="primary"
                    onClick={handleDelete}
                />
                <ERPButton
                    title={t("Load")}
                    variant="primary"
                    onClick={handleLoad}
                />
                <ERPButton
                    title={t("Save")}
                    variant="primary"
                    onClick={handleAdd}
                />
                <ERPButton
                    title={t("Clear")}
                    variant="primary"
                    onClick={handleClear}
                />
            </div>

            <div className="bg-white border border-gray-300 mt-4">
                <DataGrid
                    dataSource={gridData}
                    showBorders={true}
                    rowAlternationEnabled={true}
                    className="w-full">
                    <Paging defaultPageSize={10} />
                    <Editing
                        mode="cell"
                        allowUpdating={true}
                        allowDeleting={false}
                        allowAdding={false}
                    />
                    <Column
                        caption="Sl"
                        width={40}
                        cellRender={(data) => data.rowIndex + 1}
                    />
                    <Column
                        dataField="barcode"
                        width={100}
                        caption={t("Barcode")}
                    />
                    <Column
                        dataField="product"
                        width={200}
                        caption={t("Product")}
                    />
                    <Column
                        dataField="qtyLimit"
                        width={80}
                        caption={t("QtyLimit")}
                    />
                    <Column
                        caption="X"
                        cellRender={renderDeleteCell}
                        width={40}
                    />
                </DataGrid>
            </div>

            <div className="flex items-center mt-2">
                <ERPCheckbox
                    id="selectAll"
                    label={t("Select All To Delete")}
                    checked={selectAll}
                    onChange={handleSelectAllToDelete}
                />
            </div>
        </div>
    );
};

export default QuantityLimit;