import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";

const api = new APIClient();

export const initialFOCScheme = {
    data: {
        focSchemeID: 0,
        scheme: "",
        quantity: 0,
        itemBarcode: "",
        freeItemBarcode: "",
        freeQuantity: 0,
        itemUnit: "",
        nameCode: "",
        code: false,
        stdSalesPrice: 0,
        stdPurchasePrice: 0,
        itemName: "",
        freeItemName: "",
        remarks: ""
    },
    validations: {
        scheme: "",
        quantity: "",
        itemBarcode: "",
        freeItemBarcode: "",
        freeQuantity: "",
        itemUnit: ""
    }
};

export interface FOCSchemeData {
    focSchemeID: number;
    scheme: string;
    quantity: number;
    itemBarcode: string;
    freeItemBarcode: string;
    freeQuantity: number;
    itemUnit: string;
    nameCode: string;
    code: boolean;
    stdSalesPrice: number;
    stdPurchasePrice: number;
    itemName: string;
    freeItemName: string;
    remarks: string;
}

export const FOCScheme: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<FOCSchemeData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const {
        isEdit,
        handleSubmit,
        handleFieldChange,
        handleClear: clearForm,
        getFieldProps,
        isLoading,
        formState,
    } = useFormManager<FOCSchemeData>({
        initialData: initialFOCScheme,
        useApiClient: true,
    });

    const handleLoad = useCallback(async () => {
        try {
            setIsDataLoading(true);
            // const response = await api.get(Urls.foc_scheme);
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
        const newItem: FOCSchemeData = {
            ...formState.data,
            focSchemeID: gridData.length > 0 ? Math.max(...gridData.map(item => item.focSchemeID)) + 1 : 1
        };
        setGridData(prevData => [...prevData, newItem]);
    }, [formState.data, gridData]);

    const handleClear = useCallback(() => {
        clearForm();
    }, [clearForm]);

    const handleRemoveRow = useCallback((rowId: number) => {
        setGridData(prevData => prevData.filter(item => item.focSchemeID !== rowId));
    }, []);

    const renderDeleteCell = (cellData: any) => {
        return (
            <div className="flex justify-center">
                <button className="text-[#ef4444] font-bold px-2" onClick={() => handleRemoveRow(cellData.data.focSchemeID)}>X</button>
            </div>
        );
    };

    return (
        <div className="w-full modal-content flex flex-col gap-4">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-3">
                <ERPDataCombobox
                    {...getFieldProps("scheme")}
                    field={{
                        id: "scheme",
                        getListUrl: Urls.data_parties,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("scheme")}
                    onChangeData={(data: any) => handleFieldChange("scheme", data.scheme)}
                />

                <ERPInput
                    {...getFieldProps("quantity")}
                    label={t("quantity")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("quantity", parseFloat(data.quantity))}
                />

                <ERPInput
                    {...getFieldProps("freeQuantity")}
                    label={t("free_quantity")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("freeQuantity", parseFloat(data.freeQuantity))}
                />

                <ERPInput
                    {...getFieldProps("stdSalesPrice")}
                    label={t("std_sales_price")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("stdSalesPrice", parseFloat(data.stdSalesPrice))}
                />

                <ERPInput
                    {...getFieldProps("itemBarcode")}
                    label={t("item_barcode")}
                    onChangeData={(data: any) => handleFieldChange("itemBarcode", data.itemBarcode)}
                />

                <ERPInput
                    {...getFieldProps("freeItemBarcode")}
                    label={t("free_item_barcode")}
                    onChangeData={(data: any) => handleFieldChange("freeItemBarcode", data.freeItemBarcode)}
                />

                <ERPInput
                    {...getFieldProps("itemUnit")}
                    label={t("item_unit")}
                    onChangeData={(data: any) => handleFieldChange("itemUnit", data.itemUnit)}
                />

                <ERPInput
                    {...getFieldProps("stdPurchasePrice")}
                    label={t("std_purchase_price")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("stdPurchasePrice", parseFloat(data.stdPurchasePrice))}
                />

                <div className="flex items-end gap-2">
                    <ERPInput
                        {...getFieldProps("nameCode")}
                        label={t("name_code")}
                        className="flex-grow"
                        onChangeData={(data: any) => handleFieldChange("nameCode", data.nameCode)}
                    />
                    <ERPCheckbox
                        {...getFieldProps("code")}
                        label={t("code")}
                        onChangeData={(data: any) => handleFieldChange("code", data.code)}
                    />
                </div>
                <ERPInput
                    {...getFieldProps("remarks")}
                    label={t("remarks")}
                    onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
                />

                <ERPInput
                    {...getFieldProps("itemName")}
                    label={t("item_name")}
                    onChangeData={(data: any) => handleFieldChange("itemName", data.itemName)}
                />
                <ERPInput
                    {...getFieldProps("freeItemName")}
                    label={t("free_item_name")}
                    onChangeData={(data: any) => handleFieldChange("freeItemName", data.freeItemName)}
                />
            </div>

            <div className="flex justify-end gap-4">
                <ERPButton
                    title={t("load")}
                    variant="secondary"
                    onClick={handleLoad}
                    disabled={isDataLoading}
                />
                <ERPButton
                    title={t("add")}
                    variant="secondary"
                    onClick={handleAdd}
                />
                <ERPButton
                    title={t("clear")}
                    variant="secondary"
                    onClick={handleClear}
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
                        dataField="itemName"
                        width={300}
                        caption={t("name")}
                    />
                    <Column
                        dataField="itemBarcode"
                        width={100}
                        caption={t("barcode")}
                    />
                    <Column
                        dataField="stdSalesPrice"
                        width={80}
                        caption={t("sales_price")}
                    />
                    <Column
                        dataField="itemUnit"
                        width={80}
                        caption={t("unit")}
                    />
                    <Column
                        dataField="quantity"
                        width={70}
                        caption={t("qty")}
                    />
                    <Column
                        dataField="freeItemName"
                        width={100}
                        caption={t("free_item")}
                    />
                    <Column
                        dataField="freeQuantity"
                        width={70}
                        caption={t("free_qty")}
                    />
                    <Column
                        dataField="qtyDiscountId"
                        width={100}
                        caption={t("qty_discount_id")}
                    />
                    <Column
                        caption="X"
                        cellRender={renderDeleteCell}
                        width={30}
                    />
                </DataGrid>
            </div>

            <div>
                {/* <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-3"> */}
                <ERPInput
                    {...getFieldProps("searchBarcodeToRemove")}
                    label={t("search_barcode_to_remove")}
                    className="max-w-[200px]"
                    onChangeData={(data: any) => handleFieldChange("searchBarcodeToRemove", data.searchBarcodeToRemove)}
                />
            </div>
        </div>
    );
};

export default FOCScheme;