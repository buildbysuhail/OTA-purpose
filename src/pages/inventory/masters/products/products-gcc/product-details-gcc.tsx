import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { Ellipsis } from "lucide-react";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import { useTranslation } from "react-i18next";

const ProductDetailsGcc: React.FC = React.memo(() => {
    const { t } = useTranslation("inventory");
    const { handleFieldChange, getFieldProps } = useFormManager<productDto>({ initialData: initialProductData, });
    return (
        <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
            <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded-md p-2">
                <div className="grid grid-cols-3 gap-1">
                    <ERPInput
                        {...getFieldProps("product.minimumStock")}
                        label={t("stock_min")}
                        placeholder="0.00"
                        type="number"
                        required={false}
                        onChangeData={(data) => handleFieldChange("product.minimumStock", data.minimumStock)}
                    />

                    <ERPInput
                        {...getFieldProps("product.maximumStock")}
                        label={t("stock_max")}
                        placeholder="0.00"
                        type="number"
                        required={false}
                        onChangeData={(data) => handleFieldChange("product.maximumStock", data.maximumStock)}
                    />
                    <ERPInput
                        {...getFieldProps("product.reorderQty")}
                        label={t("re_order_qty")}
                        placeholder="0.00"
                        type="number"
                        required={false}
                        onChangeData={(data) => handleFieldChange("product.reorderQty", data.reorderQty)}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <ERPDataCombobox
                        {...getFieldProps("product.warehouseID")}
                        field={{
                            id: "warehouseID",
                            valueKey: "id",
                            labelKey: "name",
                        }}
                        onChangeData={(data) => handleFieldChange("product.warehouseID", data.warehouseID)}
                        className="w-full"
                        label={t("warehouse")}
                        options={[]}
                    />

                    <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                        <Ellipsis className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <ERPDataCombobox
                        {...getFieldProps("product.brandID")}
                        field={{
                            id: "brandID",
                            valueKey: "id",
                            labelKey: "name",
                        }}
                        onChangeData={(data) => handleFieldChange("product.brandID", data.brandID)}
                        className="w-full"
                        label={t("brand_mfg")}
                        options={[]}
                    />

                    <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                        <Ellipsis className="w-4 h-4" />
                    </button>
                </div>

                <ERPInput
                    {...getFieldProps("product.commodityCode")}
                    label={t("commodity_plu")}
                    placeholder=""
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.commodityCode", data.commodityCode)}
                />

                <ERPDataCombobox
                    {...getFieldProps("product.productCategoryID")}
                    field={{
                        id: "productCategoryID",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("product.productCategoryID", data.productCategoryID)}
                    label={t("product_category")}
                    className="w-full"
                    options={[]}
                />

                <ERPInput
                    {...getFieldProps("product.specification")}
                    label={t("specification")}
                    placeholder=""
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.specification", data.specification)}
                />

                <ERPInput
                    {...getFieldProps("product.hsnCode")}
                    label={t("hsn_code")}
                    placeholder=""
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.hsnCode", data.hsnCode)}
                />

                <ERPInput
                    {...getFieldProps("product.aliasItemName")}
                    label={t("alias_name")}
                    placeholder=""
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.aliasItemName", data.aliasItemName)}
                />

                <ERPInput
                    {...getFieldProps("product.autoBarcode")}
                    label={t("auto_barcode")}
                    placeholder=""
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.autoBarcode", data.autoBarcode)}
                />

                <ERPInput
                    {...getFieldProps("product.batchNo")}
                    label={t("batch_no")}
                    placeholder=""
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.batchNo", data.batchNo)}
                />

                <ERPDateInput
                    {...getFieldProps("product.expiryDate")}
                    label={t("exp_date")}
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.expiryDate", data.expiryDate)}
                />

                <ERPDateInput
                    {...getFieldProps("product.mfgDate")}
                    label={t("mfg_date")}
                    required={false}
                    onChangeData={(data) => handleFieldChange("product.mfgDate", data.mfgDate)}
                />

                <ERPInput
                    {...getFieldProps("product.mrp")}
                    label={t("mrp")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data: any) => handleFieldChange("product.mrp", data.mrp)}
                />

                <ERPDataCombobox
                    {...getFieldProps("product.location")}
                    field={{
                        id: "location",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data) => handleFieldChange("product.location", data.location)}
                    label={t("location")}
                    options={[]}
                />
            </div>

            <div className="border border-gray-200 rounded-md p-2 relative">
                <h6 className="absolute top-[-13px] rounded-md bg-gray-500 px-4 py-1">{t("list_in")}</h6>
                <div className="flex flex-wrap items-center gap-6 mt-5">
                    <ERPCheckbox
                        {...getFieldProps("product.canPurchase")}
                        label={t("purchase")}
                        onChangeData={(data) => handleFieldChange("product.canPurchase", data.canPurchase)}
                    />

                    <ERPCheckbox
                        {...getFieldProps("product.canSale")}
                        label={t("sales")}
                        onChangeData={(data) => handleFieldChange("product.canSale", data.canSale)}
                    />

                    <ERPCheckbox
                        {...getFieldProps("product.isFinishedGood")}
                        label={t("finished_goods")}
                        onChangeData={(data) => handleFieldChange("product.isFinishedGood", data.isFinishedGood)}
                    />

                    <ERPCheckbox
                        {...getFieldProps("product.isRawMaterial")}
                        label={t("raw_material")}
                        onChangeData={(data) => handleFieldChange("product.isRawMaterial", data.isRawMaterial)}
                    />

                    <ERPCheckbox
                        {...getFieldProps("product.active")}
                        label={t("is_active_batch")}
                        onChangeData={(data) => handleFieldChange("product.active", data.active)}
                    />

                    <ERPCheckbox
                        {...getFieldProps("product.hold")}
                        label={t("hold")}
                        onChangeData={(data) => handleFieldChange("product.hold", data.hold)}
                    />
                </div>
            </div>
        </div>
    );
});

export default ProductDetailsGcc;