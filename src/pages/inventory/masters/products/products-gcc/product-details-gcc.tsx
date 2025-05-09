import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { Ellipsis } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import ProductDetailsBatches from "../products-india/product-details-batches";
import { productDto } from "../products-type";

export const ProductDetailsGcc: React.FC<{
    clientSession: any;
    handleFieldChange: (
        fields:
            | string
            | {
                [fieldId: string]: any;
            },
        value?: any
    ) => void;

    getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ clientSession, handleFieldChange, getFieldProps }) => {

    const { t } = useTranslation("inventory");
    return (
        <>
            {getFieldProps("details").value == true &&
                <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
                    <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded-md p-2">
                        <div className="grid grid-cols-3 gap-1">
                            <ERPInput
                                {...getFieldProps("product.minimumStock")}
                                label={t("stock_min")}
                                placeholder="0.00"
                                type="number"
                                required={false}
                                onChangeData={(data) => handleFieldChange("product.minimumStock", data.product.minimumStock)}
                            />

                            <ERPInput
                                {...getFieldProps("product.maximumStock")}
                                label={t("stock_max")}
                                placeholder="0.00"
                                type="number"
                                required={false}
                                onChangeData={(data) => handleFieldChange("product.maximumStock", data.product.maximumStock)}
                            />
                            <ERPInput
                                {...getFieldProps("product.reorderQty")}
                                label={t("re_order_qty")}
                                placeholder="0.00"
                                type="number"
                                required={false}
                                onChangeData={(data) => handleFieldChange("product.reorderQty", data.product.reorderQty)}
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <ERPDataCombobox
                                {...getFieldProps("product.warehouseID")}
                                id="warehouseID"
                                field={{
                                    getListUrl: Urls.data_warehouse,
                                    id: "warehouseID",
                                    valueKey: "id",
                                    labelKey: "name",
                                }}
                                onChangeData={(data) => handleFieldChange("product.warehouseID", data.warehouseID)}
                                className="w-full"
                                label={t("warehouse")}
                            />

                            <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                                <Ellipsis className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-1">
                            <ERPDataCombobox
                                {...getFieldProps("product.brandID")}
                                id="brandID"
                                field={{
                                    id: "brandID",
                                    valueKey: "id",
                                    labelKey: "name",
                                    getListUrl: Urls.data_brands,
                                }}
                                onChangeData={(data) => handleFieldChange("product.brandID", data.brandID)}
                                className="w-full"
                                label={t("brand_mfg")}
                                // options={[]}
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
                            onChangeData={(data) => handleFieldChange("product.commodityCode", data.product.commodityCode)}
                        />

                        <ERPDataCombobox
                            {...getFieldProps("product.productCategoryID")}
                            id="productCategoryID"
                            field={{
                                id: "productCategoryID",
                                valueKey: "id",
                                labelKey: "name",
                                getListUrl: Urls.data_productcategory,
                            }}
                            onChangeData={(data: any) => handleFieldChange("product.productCategoryID", data.productCategoryID)}
                            label={t("product_category")}
                            className="w-full"
                            // options={[]}
                        />

                        <ERPInput
                            {...getFieldProps("product.specification")}
                            label={t("specification")}
                            placeholder=""
                            required={false}
                            onChangeData={(data) => handleFieldChange("product.specification", data.product.specification)}
                        />

                        <ERPInput
                            {...getFieldProps("product.hsnCode")}
                            label={t("hsn_code")}
                            placeholder=""
                            required={false}
                            onChangeData={(data) => handleFieldChange("product.hsnCode", data.product.hsnCode)}
                        />

                        <ERPInput
                            {...getFieldProps("product.aliasItemName")}
                            label={t("alias_name")}
                            placeholder=""
                            required={false}
                            onChangeData={(data) => handleFieldChange("product.aliasItemName", data.product.aliasItemName)}
                        />

                        <ERPInput
                            {...getFieldProps("product.autoBarcode")}
                            label={t("auto_barcode")}
                            placeholder=""
                            required={false}
                            onChangeData={(data) => handleFieldChange("product.autoBarcode", data.product.autoBarcode)}
                        />

                        <ERPInput
                            {...getFieldProps("product.batchNo")}
                            label={t("batch_no")}
                            placeholder=""
                            required={false}
                            onChangeData={(data) => handleFieldChange("product.batchNo", data.product.batchNo)}
                        />
                                        <ERPInput
                                          {...getFieldProps("product.netWt")}
                                          label={t("net_weight_(in_grams)")}
                                          placeholder="0.00"
                                          type="number"
                                          required={false}
                                          onChangeData={(data: productDto) =>
                                            handleFieldChange("product.netWt", data.product.netWt)
                                          }
                                          className="truncate flex-1 min-w-[100px]"
                                        />
                        
                                        <ERPInput
                                          {...getFieldProps("product.netWeightUnit")}
                                          label={t("unit_name")}
                                          placeholder={t("eg:gm/ml")}
                                          required={false}
                                          onChangeData={(data: productDto) =>
                                            handleFieldChange("product.netWeightUnit", data.product.netWeightUnit)
                                          }
                                          className="flex-1 min-w-[80px]"
                                        />
                        <ERPDateInput
                            {...getFieldProps("product.expiryDate")}
                            label={t("exp_date")}
                            required={false}
                            onChange={(data) => handleFieldChange("product.expiryDate", data.target.value)}
                        />

                        <ERPDateInput
                            {...getFieldProps("product.mfgDate")}
                            label={t("mfg_date")}
                            required={false}
                            onChange={(data) => handleFieldChange("product.mfgDate", data.target.value)}
                        />

                        {/* <ERPInput
                            {...getFieldProps("product.mrp")}
                            label={t("mrp")}
                            placeholder="0.00"
                            type="number"
                            required={false}
                            onChangeData={(data: any) => handleFieldChange("product.mrp", data.product.mrp)}
                        /> */}

                        <ERPDataCombobox
                            {...getFieldProps("product.location")}
                            id="location"
                            field={{
                                id: "location",
                                valueKey: "id",
                                labelKey: "name",
                                getListUrl: Urls.data_locations
                            }}
                            onChangeData={(data) => handleFieldChange("product.location", data.location)}
                            label={t("location")}
                        />
                    </div>

                    <div className="border border-gray-200 rounded-md p-2 relative">
                        <h6 className="absolute top-[-13px] rounded-md bg-gray-500 px-4 py-1">{t("list_in")}</h6>
                        <div className="flex flex-wrap items-center gap-6 mt-5">
                            <ERPCheckbox
                                {...getFieldProps("product.canPurchase")}
                                label={t("purchase")}
                                onChange={(data) => handleFieldChange("product.canPurchase", data.target.checked)}
                            />

                            <ERPCheckbox
                                {...getFieldProps("product.canSale")}
                                label={t("sales")}
                                onChange={(data) => handleFieldChange("product.canSale", data.target.checked)}
                            />

                            <ERPCheckbox
                                {...getFieldProps("product.isFinishedGood")}
                                label={t("finished_goods")}
                                onChange={(data) => handleFieldChange("product.isFinishedGood", data.target.checked)}
                            />

                            <ERPCheckbox
                                {...getFieldProps("product.isRawMaterial")}
                                label={t("raw_material")}
                                onChange={(data) => handleFieldChange("product.isRawMaterial", data.target.checked)}
                            />

                            <ERPCheckbox
                                {...getFieldProps("product.active")}
                                label={t("is_active_batch")}
                                onChange={(data) => handleFieldChange("product.active", data.target.checked)}
                            />
                            {clientSession.dbIdValue == "543140180640" && 
                            <ERPCheckbox
                                {...getFieldProps("product.hold")}
                                label={t("hold")}
                                onChange={(data) => handleFieldChange("product.hold", data.target.checked)}
                            />
}
                        </div>
                    </div>
                    <ProductDetailsBatches getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} t={t}></ProductDetailsBatches>
                </div>
            }
        </>
    );
});

export default ProductDetailsGcc;