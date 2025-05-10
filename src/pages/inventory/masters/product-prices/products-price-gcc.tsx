import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Urls from "../../../../redux/urls";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../../helpers/api-client";
import { handleResponse } from "../../../../utilities/HandleResponse";

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

export interface ProductPriceFormData {
    data: {
        isBrandValue: boolean;
        brandValue: number;
        searchProducts: string;
        updateStdRate: boolean;
        standard: boolean;
        productGroup: boolean;
        productGroupValue: number;
    };
    validations: {
        brandValue: string;
        searchProducts: string;
        productGroupValue: string;
    }
}

const api = new APIClient();
const initailProductPriceFormData: ProductPriceFormData = {
    data: {
        isBrandValue: false,
        brandValue: -1,
        searchProducts: "",
        updateStdRate: false,
        standard: false,
        productGroup: false,
        productGroupValue: -1,
    },
    validations: {
        brandValue: "",
        searchProducts: "",
        productGroupValue: "",
    }
}

const ProductPricesGCC: React.FC = React.memo(() => {
    const dispatch = useDispatch();
    const { t } = useTranslation('inventory');
    const [productPform, setproductPform] = useState<ProductPriceFormData>(initailProductPriceFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [gridData, setGridData] = useState<ProductPriceGCCData[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    // const handleAddToGrid = () => {
    //     // Add current form data to grid
    //     const newItem: ProductPriceGCCData = {
    //         slNo: String(gridData.length + 1),
    //         productCode: "",
    //         productName: "",
    //         priceCategory: "",
    //         groupName: "",
    //         unit: "",
    //         salesRate: "",
    //         salesDisc: "",
    //         stock: ""
    //     };
    //     setGridData([...gridData, newItem]);
    // };
    const handelGetGridData = async () => {
        setIsLoading(true)
        try {
            const postBody = {
                isBrandValue: productPform.data.isBrandValue ? 1 : -1,
                brandValue: productPform.data.brandValue,
                searchProducts: productPform.data.searchProducts,
                updateStdRate: productPform.data.updateStdRate ? 1 : -1,
                standard: productPform.data.standard ? 1 : -1,
                productGroup: productPform.data.productGroup ? 1 : -1,
                productGroupValue: productPform.data.productGroupValue,
            };
            const response = await api.postAsync(Urls.productPrice, postBody);
            handleResponse(response, () => {
                if (response) {
                    setGridData(response)
                }
            });
        } catch (error) {
            console.error("Error loading flavors:", error);
        } finally {
            setIsLoading(false)
        }
    }

    const saveProductPrices = async () => {
        setIsSaving(true);
        try {
            const response = await api.postAsync(Urls.productPrice, { products: gridData });
            handleResponse(response, () => {
                alert("Product prices updated successfully.");
            });
        } catch (error) {
            console.error("Error saving product prices:", error);
            alert("Error saving product prices.");
        } finally {
            setIsSaving(false);
        }
    };

    const clearAll = () => {
        setproductPform(initailProductPriceFormData);
        setGridData([]);
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
        }], []);

    return (
        <div className="p-4 bg-gray-100">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 max-sm:grid-cols-1 items-start gap-2">
                        <div className="flex flex-col w-full gap-2 border border-[#ededed] p-4 rounded-md">
                            <div className="flex sm:flex-row sm:items-center items-start flex-col gap-3">
                                <ERPCheckbox
                                    label={t("brand")}
                                    id="isBrandValue"
                                    data={productPform.data}
                                    checked={productPform.data?.isBrandValue}
                                    onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                />
                                <ERPDataCombobox
                                    id="brandValue"
                                    field={{
                                        id: "brandValue",
                                        getListUrl: Urls.data_brands,
                                        valueKey: "id",
                                        labelKey: "name",
                                    }}
                                    noLabel
                                    className="w-full"
                                    disabled={!productPform.data?.isBrandValue}
                                    required={true}
                                    data={productPform.data}
                                    defaultData={productPform?.data}
                                    value={productPform.data?.brandValue}
                                    validation={productPform?.validations?.brandValue}
                                    onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                />
                            </div>
                            <ERPInput
                                id="searchProducts"
                                label={t("search_products")}
                                type="text"
                                value={productPform.data?.searchProducts}
                                className="w-full"
                                placeholder={t("searchProducts")}
                                data={productPform.data}
                                validation={productPform?.validations?.searchProducts}
                                onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                            />
                            <ERPCheckbox
                                label={t("update_std_rate")}
                                id="updateStdRate"
                                data={productPform.data}
                                checked={productPform.data?.updateStdRate}
                                onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                            />
                        </div>
                        <div className="h-[11.4rem] w-full overflow-y-auto border border-gray-200 rounded-md">
                            <div className="p-4">
                                <div className="flex flex-col gap-2">
                                    {
                                        /* <ERPMultiSelect
                                                label="Countries"
                                                options={[
                                                    { id: 1, name: "Urgent" },
                                                    { id: 2, name: "Important" },
                                                    { id: 3, name: "Review" },
                                                    { id: 4, name: "Pending" },
                                                    { id: 5, name: "Completed" },
                                                ]}
                                                selectedValues={getFieldProps("sdsd").value}
                                                onChange={(data) => handleFieldChange("sdsd", data)}
                                                placeholder="Select countries"
                                                searchPlaceholder="Search countries..."
                                                outputFormat="array"
                                        /> */
                                    }
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                    <ERPCheckbox
                                        label={t("standard")}
                                        id="standard"
                                        data={productPform.data}
                                        checked={productPform.data?.standard}
                                        onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 border border-[#ededed] p-4 rounded-md">
                        <div className="flex sm:flex-row flex-col sm:items-end items-start gap-2">
                            <ERPCheckbox
                                label={t("product_group")}
                                id="productGroup"
                                data={productPform.data}
                                checked={productPform.data?.productGroup}
                                onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                            />
                            <ERPDataCombobox
                                id="productGroupValue"
                                field={{
                                    id: "productGroupValue",
                                    getListUrl: Urls.data_brands,
                                    valueKey: "id",
                                    labelKey: "name",
                                }}
                                noLabel
                                // disabled={!productPform.data?.productGroup}
                                required={true}
                                data={productPform.data}
                                defaultData={productPform?.data}
                                value={productPform.data?.productGroupValue}
                                validation={productPform?.validations?.productGroupValue}
                                onChangeData={(data: any) => { setproductPform((prev: any) => ({ ...prev, data: data, })); }}
                            />
                        </div>
                        <div>
                            <ERPButton
                                title={t("load_items")}
                                variant="primary"
                                loading={isLoading}
                                onClick={handelGetGridData}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-white border rounded-lg shadow-sm p-2">
                <ErpDevGrid
                    heightToAdjustOnWindows={430}
                    columns={columns}
                    gridId="grd_product_prices_gcc"
                    data={gridData}
                    hideDefaultExportButton={false}
                    hideGridAddButton={true}
                    gridHeader={t("product_prices_gcc")}
                    allowUpdating={true}
                    onRowUpdated={(e) => {
                        const updatedData = gridData.map((row) =>
                            row.slNo === e.key ? { ...row, ...e.data } : row
                        );
                        setGridData(updatedData);
                    }}
                />
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-10 px-2 sm:px-4 py-2 bg-white dark:bg-dark-bg border-t dark:border-dark-border shadow-lg"
                style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
                <div className="flex items-center justify-end">
                    <ERPButton
                        type="button"
                        title={t("clear")}
                        variant="secondary"
                        className="mr-2"
                        onClick={clearAll}
                    />

                    <ERPButton
                        type="button"
                        variant="primary"
                        title={t("Save")}
                        onClick={saveProductPrices}
                        disabled={isSaving}
                    />
                </div>
            </div>
        </div>
    );
});

export default ProductPricesGCC;