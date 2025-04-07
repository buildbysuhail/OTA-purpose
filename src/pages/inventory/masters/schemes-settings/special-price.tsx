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

export const initialSpecialPrice = {
    data: {
        specialPriceID: 0,
        isGroup: false,
        group: "",
        scheme: "",
        barcode: "",
        unit: "",
        price: 0,
        groupPrice: 0,
        nameCode: "",
        code: false,
        product: "",
        batch: {
            stdSalesPrice: 0,
            stdPurchasePrice: 0
        },
        isActive: true,
        isEditable: true,
        isDeletable: true,
        remarks: ""
    },
    validations: {
        group: "",
        scheme: "",
        barcode: "",
        price: ""
    }
};

export interface SpecialPriceData {
    specialPriceID: number;
    isGroup: boolean;
    group: string;
    scheme: string;
    barcode: string;
    unit: string;
    price: number;
    groupPrice: number;
    nameCode: string;
    code: boolean;
    product: string;
    batch: {
        stdSalesPrice: number;
        stdPurchasePrice: number;
    };
    isActive: boolean;
    isEditable: boolean;
    isDeletable: boolean;
    remarks: string;
}

export const SpecialPrice: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<SpecialPriceData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const {
        isEdit,
        handleSubmit,
        handleFieldChange,
        handleClear: clearForm,
        getFieldProps,
        isLoading,
        formState,
    } = useFormManager<SpecialPriceData>({
        initialData: initialSpecialPrice,
        useApiClient: true,
    });

    const handleLoad = useCallback(async () => {
        try {
            setIsDataLoading(true);
            // const response = await api.get(Urls.special_price);
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
        const newItem: SpecialPriceData = {
            ...formState.data,
            specialPriceID: gridData.length > 0 ? Math.max(...gridData.map(item => item.specialPriceID)) + 1 : 1
        };
        setGridData(prevData => [...prevData, newItem]);
    }, [formState.data, gridData]);

    const handleClear = useCallback(() => {
        clearForm();
    }, [clearForm]);

    const handleRemoveRow = useCallback((rowId: number) => {
        setGridData(prevData => prevData.filter(item => item.specialPriceID !== rowId));
    }, []);

    const renderDeleteCell = (cellData: any) => {
        return (
            <div className="flex justify-center">
                <button className="text-[#ef4444] font-bold px-2" onClick={() => handleRemoveRow(cellData.data.specialPriceID)}>X</button>
            </div>
        );
    };

    return (
        <div className="w-full modal-content flex flex-col gap-4">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-3">
                <div>
                    <ERPCheckbox
                        {...getFieldProps("isGroup")}
                        label={t("group")}
                        onChangeData={(data: any) => handleFieldChange("isGroup", data.isGroup)}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("group")}
                        noLabel={true}
                        disabled={!formState.data.isGroup}
                        field={{
                            id: "group",
                            getListUrl: Urls.data_acc_groups,
                            valueKey: "id",
                            labelKey: "name",
                            required: true
                        }}
                        onChangeData={(data: any) => handleFieldChange("group", data.group)}
                    />
                </div>

                <div className="flex items-end gap-4">
                    <ERPInput
                        {...getFieldProps("groupPrice")}
                        label={t("group_price")}
                        type="number"
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("groupPrice", parseFloat(data.groupPrice))}
                    />
                    <ERPCheckbox
                        {...getFieldProps("code")}
                        label={t("code")}
                        onChangeData={(data: any) => handleFieldChange("code", data.code)}
                    />
                </div>

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
                    {...getFieldProps("nameCode")}
                    label={t("name_code")}
                    onChangeData={(data: any) => handleFieldChange("nameCode", data.nameCode)}
                />
            </div>

            <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-2 max-sm:grid-cols-1 gap-3">
                <ERPInput
                    {...getFieldProps("barcode")}
                    label={t("barcode")}
                    onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
                />

                <ERPInput
                    {...getFieldProps("price")}
                    label={t("price")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("price", parseFloat(data.price))}
                />

                <ERPInput
                    {...getFieldProps("unit")}
                    label={t("unit")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("unit", parseFloat(data.unit))}
                />

                <ERPInput
                    {...getFieldProps("stdSalesPrice")}
                    label={t("std_sales_price")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("stdSalesPrice", parseFloat(data.stdSalesPrice))}
                />

                <ERPInput
                    {...getFieldProps("stdPurchasePrice")}
                    label={t("std_purchase_price")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("stdPurchasePrice", parseFloat(data.stdPurchasePrice))}
                />

                <ERPInput
                    {...getFieldProps("product")}
                    label={t("product")}
                    onChangeData={(data: any) => handleFieldChange("product", data.product)}
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
                    <Paging defaultPageSize={5} />
                    <Editing mode="cell" allowUpdating={true} allowDeleting={false} allowAdding={false} />
                    <Column
                        dataField="group"
                        width={375}
                        caption={t("name")}
                    />
                    <Column
                        dataField="barcode"
                        width={125}
                        caption={t("barcode")}
                    />
                    <Column
                        dataField="unit"
                        width={60}
                        caption={t("unit")}
                    />
                    <Column
                        dataField="product"
                        width={60}
                        caption={t("product_batch_id")}
                    />
                    <Column
                        dataField="specialPriceID"
                        width={100}
                        caption={t("special_price_id")}
                    />
                    <Column
                        dataField="stdSalesPrice"
                        width={100}
                        caption={t("sales_price")}
                    />
                    <Column
                        dataField="scheme"
                        width={100}
                        caption={t("scheme_price")}
                    />
                    <Column
                        caption="X"
                        cellRender={renderDeleteCell}
                        width={30}
                    />
                </DataGrid>
            </div>

            <div>
                <ERPInput
                    {...getFieldProps("searchBarcodeToRemove")}
                    label={t("search_barcode_to_remove")}
                    className="max-w-[200px]"
                    onChangeData={(data: any) => handleFieldChange("searchBarcodeToRemove", parseFloat(data.searchBarcodeToRemove))}
                />
            </div>
        </div>
    );
};

export default SpecialPrice;