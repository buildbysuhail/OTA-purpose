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

export const initialGiftOnBilling = {
    data: {
        giftOnBillingID: 0,
        totalBillRangeFrom: 0,
        totalBillRangeTo: 0,
        giftBarcode: "",
        itemName: "",
        qty: 0,
        price: 0,
        loadAllGiftOnBilling: false,
        rangeFrom: 0,
        rangeTo: 0,
        giftItem: "",
        cashCouponValue: 0
    },
    validations: {
        totalBillRangeFrom: "",
        totalBillRangeTo: "",
        giftBarcode: "",
        itemName: "",
        qty: "",
        price: ""
    }
};

export interface GiftOnBillingData {
    giftOnBillingID: number;
    totalBillRangeFrom: number;
    totalBillRangeTo: number;
    giftBarcode: string;
    itemName: string;
    qty: number;
    price: number;
    loadAllGiftOnBilling: boolean;
    rangeFrom: number;
    rangeTo: number;
    giftItem: string;
    cashCouponValue: number;
}

export const GiftOnBilling: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<GiftOnBillingData[]>([]);
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
    } = useFormManager<GiftOnBillingData>({
        initialData: initialGiftOnBilling,
        useApiClient: true,
    });

    const handleLoad = useCallback(async () => {
        try {
            setIsDataLoading(true);
            // const response = await api.get(Urls.gift_on_billing);
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
        const newItem: GiftOnBillingData = {
            ...formState.data,
            giftOnBillingID: gridData.length > 0 ? Math.max(...gridData.map(item => item.giftOnBillingID)) + 1 : 1,
            rangeFrom: formState.data.totalBillRangeFrom,
            rangeTo: formState.data.totalBillRangeTo,
            giftItem: formState.data.itemName,
        };
        setGridData(prevData => [...prevData, newItem]);
    }, [formState.data, gridData]);

    const handleClear = useCallback(() => {
        clearForm();
    }, [clearForm]);

    const handleRemoveRow = useCallback((rowId: number) => {
        setGridData(prevData => prevData.filter(item => item.giftOnBillingID !== rowId));
    }, []);

    const handleSave = useCallback(() => {
        console.log("Saving data:", gridData);
    }, [gridData]);

    const handleSelectAllToDelete = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(e.target.checked);
    }, []);

    const handleClearAll = useCallback(() => {
        setGridData([]);
    }, []);

    const renderDeleteCell = (cellData: any) => {
        return (
            <div className="flex justify-center">
                <button className="text-[#ef4444] font-bold px-2" onClick={() => handleRemoveRow(cellData.data.giftOnBillingID)}>X</button>
            </div>
        );
    };

    return (
        <div className="w-full modal-content flex flex-col gap-4">
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-1 items-end gap-3">
                <ERPInput
                    {...getFieldProps("totalBillRangeFrom")}
                    label={t("total_bill_range_from")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("totalBillRangeFrom", parseFloat(data.totalBillRangeFrom))}
                />
                <ERPInput
                    {...getFieldProps("totalBillRangeTo")}
                    label={t("total_bill_range_to")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("totalBillRangeTo", parseFloat(data.totalBillRangeTo))}
                />
                <ERPCheckbox
                    {...getFieldProps("loadAllGiftOnBilling")}
                    label={t("load_all_gift_on_billing")}
                    onChangeData={(data: any) => handleFieldChange("loadAllGiftOnBilling", data.loadAllGiftOnBilling)}
                />
                <ERPInput
                    {...getFieldProps("giftBarcode")}
                    label={t("gift_barcode")}
                    onChangeData={(data: any) => handleFieldChange("giftBarcode", data.giftBarcode)}
                />
                <ERPDataCombobox
                    {...getFieldProps("itemName")}
                    label={t("item_name")}
                    field={{
                        id: "itemName",
                        // getListUrl: Urls.data_inventory_items,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("itemName", data.itemName)}
                />
                <ERPInput
                    {...getFieldProps("qty")}
                    label={t("qty")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("qty", parseFloat(data.qty))}
                />
                <ERPInput
                    {...getFieldProps("price")}
                    label={t("price")}
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("price", parseFloat(data.price))}
                />
            </div>

            <div className="flex justify-end gap-2">
                <ERPButton
                    title={t("add")}
                    variant="secondary"
                    onClick={handleAdd}
                />
                <ERPButton
                    title={t("delete")}
                    variant="secondary"
                    onClick={handleClear}
                />
            </div>

            <div className="bg-white border border-gray-300">
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
                        width={30}
                        cellRender={(data) => data.rowIndex + 1}
                    />
                    <Column
                        dataField="clear"
                        width={60}
                        caption={t("clear")}
                    />
                    <Column
                        dataField="rangeFrom"
                        width={45}
                        caption={t("range_from")}
                    />
                    <Column
                        dataField="rangeTo"
                        width={45}
                        caption={t("range_to")}
                    />
                    <Column
                        dataField="giftBarcode"
                        width={60}
                        caption={t("barcode")}
                    />
                    <Column
                        dataField="giftItem"
                        width={385}
                        caption={t("gift_item")}
                    />
                    <Column
                        dataField="qty"
                        width={40}
                        caption={t("qty")}
                    />
                    <Column
                        dataField="productBatchId"
                        width={70}
                        caption={t("product_batch_id")}
                    />
                    <Column
                        dataField="cashCouponValue"
                        width={395}
                        caption={t("cash_coupon_value")}
                    />
                    <Column
                        dataField="price"
                        width={100}
                        caption={t("special_price")}
                    />
                    <Column
                        caption="X"
                        cellRender={renderDeleteCell}
                        width={20}
                    />
                </DataGrid>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                    <ERPCheckbox
                        label={t("select_all_to_delete")}
                        checked={selectAll}
                        onChange={handleSelectAllToDelete} id={""} />
                </div>
                <div className="flex gap-2">
                    <ERPButton
                        title={t("clear")}
                        variant="secondary"
                        onClick={handleClearAll}
                    />
                    <ERPButton
                        title={t("save")}
                        variant="primary"
                        onClick={handleSave}
                    />
                </div>
            </div>
        </div>
    );
};

export default GiftOnBilling;