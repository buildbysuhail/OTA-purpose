import React, { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { toggleSpecialSchemes } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";

export interface ProductPriceGCCData {
    slNo: string;
    productCode: string;
    productName: string;
    priceCategory: string;
    groupName: string;
    unit: string;
    salesRate: string;
    salesDisc: string;
    stock: string;
}

const ProductPricesGCC: React.FC = React.memo(() => {
    const dispatch = useDispatch();
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<ProductPriceGCCData[]>([]);

    const {
        isEdit,
        handleSubmit,
        handleClear,
        handleFieldChange,
        getFieldProps,
        isLoading,
    } = useFormManager<ProductPriceGCCData>({
        url: Urls.CompanyProfiles,
        onSuccess: useCallback(() => dispatch(toggleSpecialSchemes({ isOpen: false })), [dispatch]),
        method: ActionType.POST,
        useApiClient: true
    });

    const handleAddToGrid = () => {
        // Add current form data to grid
        const newItem: ProductPriceGCCData = {
            slNo: String(gridData.length + 1),
            productCode: "",
            productName: "",
            priceCategory: "",
            groupName: "",
            unit: "",
            salesRate: "",
            salesDisc: "",
            stock: ""
        };
        setGridData([...gridData, newItem]);
    };

    const columns: DevGridColumn[] = useMemo(() => [
        {
            dataField: "slNo",
            caption: t("si_no"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 60
        },
        {
            dataField: "productCode",
            caption: t("product_code"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 120
        },
        {
            dataField: "productName",
            caption: t("product_name"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 180
        },
        {
            dataField: "priceCategory",
            caption: t("price_category"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 120
        },
        {
            dataField: "groupName",
            caption: t("group_name"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 120
        },
        {
            dataField: "unit",
            caption: t("unit"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 80
        },
        {
            dataField: "salesRate",
            caption: t("sales_rate"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100
        },
        {
            dataField: "salesDisc",
            caption: t("sales_disc_%"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100
        },
        {
            dataField: "stock",
            caption: t("stock"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 80
        }
    ], []);

    return (
        <div className="p-4 bg-gray-100">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 items-start gap-2">
                        <div className="flex flex-col w-full gap-2 border border-[#ededed] p-4 rounded-md">
                            <ERPDataCombobox
                                {...getFieldProps("brandValue")}
                                id="brandValue"
                                field={{
                                    id: "brandValue",
                                    getListUrl: Urls.data_brands,
                                    valueKey: "id",
                                    labelKey: "name",
                                }}
                                label={t("brand")}
                                onChangeData={(data: any) => handleFieldChange("brandValue", data.brandValue)}
                            />
                            <ERPInput
                                {...getFieldProps("searchProducts")}
                                id="searchProducts"
                                label={t("search_products")}
                                onChangeData={(data: any) => handleFieldChange("searchProducts", data.searchProducts)}
                            />
                            <ERPCheckbox
                                {...getFieldProps('updateStdRate')}
                                label={t("update_std_rate")}
                                onChangeData={(data: any) => handleFieldChange('updateStdRate', data.updateStdRate)}
                            />
                        </div>
                        <div className="h-[11.4rem] w-full overflow-y-auto border border-gray-200 rounded-md">
                            <div className="p-4">
                                <div className="flex flex-col gap-2">
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                    <ERPCheckbox
                                        {...getFieldProps('standard')}
                                        label={t("standard")}
                                        onChangeData={(data: any) => handleFieldChange('standard', data.standard)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border border-[#ededed] p-4 rounded-md">
                        <div className="flex items-end gap-2">
                            <ERPCheckbox
                                {...getFieldProps('productGroup')}
                                label={t("product_group")}
                                onChangeData={(data: any) => handleFieldChange('productGroup', data.productGroup)}
                            />
                            <ERPDataCombobox
                                {...getFieldProps("productGroupValue")}
                                id="productGroupValue"
                                field={{
                                    id: "productGroupValue",
                                    getListUrl: Urls.data_productgroup,
                                    valueKey: "id",
                                    labelKey: "name",
                                }}
                                label={t("product_group")}
                                onChangeData={(data: any) => handleFieldChange('productGroupValue', data.productGroupValue)}
                            />
                        </div>
                        <div>
                            <ERPButton
                                title={t("load_items")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-white border rounded-lg shadow-sm p-2">
                <ErpDevGrid
                    columns={columns}
                    gridId="grd_product_prices_gcc"
                    data={gridData}
                    hideDefaultExportButton={false}
                    hideGridAddButton={true}
                    gridHeader={t("product_prices_gcc")}
                />
            </div>
        </div>
    );
});

export default ProductPricesGCC;