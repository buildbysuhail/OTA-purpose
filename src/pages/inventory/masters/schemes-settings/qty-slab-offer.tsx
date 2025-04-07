import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";

const api = new APIClient();

export const initialQuantitySlab = {
    data: {
        slabId: 0,
        itemName: "",
        amtPerc: "",
        value: 0,
        qtyFrom: 0,
        qtyTo: 0,
        product: "",
        isActive: true,
        isEditable: true,
        isDeletable: true
    },
    validations: {
        itemName: "",
        amtPerc: "",
        value: "",
        qtyFrom: "",
        qtyTo: ""
    }
};

export interface QuantitySlabData {
    slabId: number;
    itemName: string;
    amtPerc: string;
    value: number;
    qtyFrom: number;
    qtyTo: number;
    product: string;
    isActive: boolean;
    isEditable: boolean;
    isDeletable: boolean;
}

export const QuantitySlabOffer: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<QuantitySlabData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [loadAllSlabs, setLoadAllSlabs] = useState(false);
    const [selectAllToDelete, setSelectAllToDelete] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const {
        isEdit,
        handleSubmit,
        handleFieldChange,
        handleClear: clearForm,
        getFieldProps,
        isLoading,
        formState,
    } = useFormManager<QuantitySlabData>({
        initialData: initialQuantitySlab,
        useApiClient: true,
    });

    const handleLoad = useCallback(async () => {
        try {
            setIsDataLoading(true);
            // const response = await api.get(Urls.quantity_slab_offer);
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
        const newItem: QuantitySlabData = {
            ...formState.data,
            slabId: gridData.length > 0 ? Math.max(...gridData.map(item => item.slabId)) + 1 : 1
        };
        setGridData(prevData => [...prevData, newItem]);
    }, [formState.data, gridData]);

    const handleClear = useCallback(() => {
        clearForm();
    }, [clearForm]);

    const handleSave = useCallback(() => {
        console.log("Saving data:", gridData);
    }, [gridData]);

    const handleDelete = useCallback(() => {
        if (selectedRows.length > 0) {
            setGridData(prevData => prevData.filter(item => !selectedRows.includes(item.slabId)));
            setSelectedRows([]);
        }
    }, [selectedRows]);

    const handleRemoveRow = useCallback((rowId: number) => {
        setGridData(prevData => prevData.filter(item => item.slabId !== rowId));
    }, []);

    const handleSelectAllChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAllToDelete(e.target.checked);
        if (e.target.checked) {
            setSelectedRows(gridData.map(item => item.slabId));
        } else {
            setSelectedRows([]);
        }
    }, [gridData]);

    const handleRowSelection = useCallback((rowId: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedRows(prev => [...prev, rowId]);
        } else {
            setSelectedRows(prev => prev.filter(id => id !== rowId));
        }
    }, []);

    const renderDeleteCell = (cellData: any) => {
        return (
            <div className="flex justify-center">
                <button className="text-[#ef4444] font-bold px-2" onClick={() => handleRemoveRow(cellData.data.slabId)}>X</button>
            </div>
        );
    };

    const renderSelectionCell = (cellData: any) => {
        const isSelected = selectedRows.includes(cellData.data.slabId);
        return (
            <div className="flex justify-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleRowSelection(cellData.data.slabId, e.target.checked)}
                />
            </div>
        );
    };

    return (
        <div className="w-full modal-content flex flex-col gap-4">
            <div className="flex justify-end mb-2">
                <ERPCheckbox
                    checked={loadAllSlabs}
                    onChange={(e) => setLoadAllSlabs(e.target.checked)}
                    label={t("load_all_qty_slab_offer")}
                    id={""}
                />
            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 items-end gap-3">
                <ERPDataCombobox
                    {...getFieldProps("itemName")}
                    label={t("item_name")}
                    field={{
                        id: "itemName",
                        // getListUrl: Urls.data_items,
                        valueKey: "id",
                        labelKey: "name",
                        required: true
                    }}
                    onChangeData={(data: any) => handleFieldChange("itemName", data.itemName)}
                />

                <ERPDataCombobox
                    {...getFieldProps("amtPerc")}
                    field={{
                        id: "amtPerc",
                        valueKey: "value",
                        labelKey: "label",
                    }}
                    onChangeData={(data: any) =>
                        handleFieldChange("amtPerc", data.amtPerc)
                    }
                    label={t("amt_perc")}
                    enableClearOption={false}
                    options={[
                        { value: "Amt", label: t("amt") },
                        { value: "Perc", label: t("perc") },
                    ]}
                />

                <ERPInput
                    {...getFieldProps("value")}
                    label={t("value")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("value", parseFloat(data.value))}
                />

                <ERPInput
                    {...getFieldProps("qtyFrom")}
                    label={t("qty_from")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("qtyFrom", parseFloat(data.qtyFrom))}
                />

                <ERPInput
                    {...getFieldProps("qtyTo")}
                    label={t("qty_to")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("qtyTo", parseFloat(data.qtyTo))}
                />
            </div>

            <div className="flex justify-end">
                <ERPButton
                    title={t("add")}
                    variant="primary"
                    onClick={handleAdd}
                />
            </div>

            <div>
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
                        caption={t("si")}
                        cellRender={renderSelectionCell}
                        width={40}
                    />
                    <Column
                        caption={t("clear")}
                        width={60}
                    />
                    <Column
                        dataField="product"
                        width={150}
                        caption={t("product")}
                    />
                    <Column
                        dataField="amtPerc"
                        width={100}
                        caption={t("amt_perc")}
                    />
                    <Column
                        dataField="value"
                        width={100}
                        caption={t("value")}
                    />
                    <Column
                        dataField="qtyFrom"
                        width={100}
                        caption={t("qty_from")}
                    />
                    <Column
                        dataField="qtyTo"
                        width={100}
                        caption={t("qty_to")}
                    />
                    <Column
                        caption={t("X")}
                        cellRender={renderDeleteCell}
                        width={40}
                    />
                </DataGrid>
            </div>

            <div className="flex flex-row max-md:flex-col items-center mt-2">
                <p className="text-[#F87171] text-sm font-medium mr-auto">{t("this_offer_price_is_only_applicable_on_standard_price")}</p>
                <div className="flex items-center">
                    <ERPCheckbox
                        checked={selectAllToDelete}
                        onChange={handleSelectAllChange}
                        label={t("select_all_to_delete")}
                        id={""}
                    />
                    <div className="flex gap-2 ml-4">
                        <ERPButton
                            title={t("delete")}
                            onClick={handleDelete}
                            disabled={selectedRows.length === 0}
                        />
                        <ERPButton
                            title={t("clear")}
                            variant="secondary"
                            onClick={handleClear}
                        />
                        <ERPButton
                            title={t("save")}
                            variant="primary"
                            onClick={handleSave}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuantitySlabOffer;