import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from "moment";
import Urls from "../../../../redux/urls";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";

const StockSummaryFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-2 md:gap-4">
                <ERPDateInput
                    label={t("as_on_date")}
                    {...getFieldProps("asOnDate")}
                    className="w-full"
                    onChangeData={(data: any) => handleFieldChange("asOnDate", data.asOnDate)}
                />
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4">
                <ERPDataCombobox
                    label={t("product_group")}
                    {...getFieldProps("productGroupID")}
                    field={{
                        id: "productGroupID",
                        getListUrl: Urls.data_productgroup,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("productGroupID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("product")}
                    {...getFieldProps("productID")}
                    field={{
                        id: "productID",
                        getListUrl: Urls.data_products,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("productID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("brand")}
                    {...getFieldProps("brandID")}
                    field={{
                        id: "brandID",
                        getListUrl: Urls.data_brands,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("brandID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("product_category")}
                    {...getFieldProps("productCategoryID")}
                    field={{
                        id: "productCategoryID",
                        getListUrl: Urls.data_productcategory,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("productCategoryID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("product_code")}
                    {...getFieldProps("productCode")}
                    field={{
                        id: "productCode",
                        // getListUrl: Urls.,
                        valueKey: "value",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("productCode", data.value);
                    }}
                />

                <ErpInput
                    label={t("barcode")}
                    {...getFieldProps("barcode")}
                    onChange={(e: any) => {
                        handleFieldChange("barcode", e.target.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("warehouse")}
                    {...getFieldProps("wareHouseID")}
                    field={{
                        id: "wareHouseID",
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("wareHouseID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("supplier")}
                    {...getFieldProps("supplierID")}
                    field={{
                        id: "supplierID",
                        // getListUrl: Urls.data_suppliers,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("supplierID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("group_category")}
                    {...getFieldProps("groupCategoryID")}
                    field={{
                        id: "groupCategoryID",
                        getListUrl: Urls.data_groupcategory,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("groupCategoryID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("section")}
                    {...getFieldProps("sectionID")}
                    field={{
                        id: "sectionID",
                        getListUrl: Urls.data_sections,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("sectionID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("location")}
                    {...getFieldProps("location")}
                    field={{
                        id: "location",
                        getListUrl: Urls.data_locations,
                        valueKey: "value",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("location", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("stock_value")}
                    {...getFieldProps("valuationUsing")}
                    field={{
                        id: "valuationUsing",
                        // getListUrl: Urls.data_valuation_methods,
                        valueKey: "value",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("valuationUsing", data.value);
                    }}
                />
                <ERPCheckbox
                    id="showBatchWise"
                    {...getFieldProps("showBatchWise")}
                    label={t("show_batch_wise")}
                    onChangeData={(data) => handleFieldChange("showBatchWise", data.showBatchWise)}
                />
                <ERPCheckbox
                    id="standardFormat"
                    {...getFieldProps("standardFormat")}
                    label={t("standard_format")}
                    onChangeData={(data) => handleFieldChange("standardFormat", data.standardFormat)}
                />
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 p-4 rounded-md border border-gray-200">
                <ERPRadio
                    id="allStock"
                    name="stockFilter"
                    value="all"
                    label={t("all_stock")}
                    checked={formState.stockFilter === "all"}
                    onChange={() => handleFieldChange("stockFilter", "all")}
                    className="items-center"
                />
                <ERPRadio
                    id="zeroStock"
                    name="stockFilter"
                    value="zero"
                    label={t("zero_stock")}
                    checked={formState.stockFilter === "zero"}
                    onChange={() => handleFieldChange("stockFilter", "zero")}
                    className="items-center"
                />
                <ERPRadio
                    id="positiveStock"
                    name="stockFilter"
                    value="positive"
                    label={t("positive_stock")}
                    checked={formState.stockFilter === "positive"}
                    onChange={() => handleFieldChange("stockFilter", "positive")}
                    className="items-center"
                />
                <ERPRadio
                    id="negativeStock"
                    name="stockFilter"
                    value="negative"
                    label={t("negative_stock")}
                    checked={formState.stockFilter === "negative"}
                    onChange={() => handleFieldChange("stockFilter", "negative")}
                    className="items-center"
                />
                <ERPRadio
                    id="aboveMaxStock"
                    name="stockFilter"
                    value="aboveMax"
                    label={t("above_max_stock")}
                    checked={formState.stockFilter === "aboveMax"}
                    onChange={() => handleFieldChange("stockFilter", "aboveMax")}
                    className="items-center"
                />
                <ERPRadio
                    id="belowMinStock"
                    name="stockFilter"
                    value="belowMin"
                    label={t("below_min_stock")}
                    checked={formState.stockFilter === "belowMin"}
                    onChange={() => handleFieldChange("stockFilter", "belowMin")}
                    className="items-center"
                />
                <ERPRadio
                    id="belowReorderLevel"
                    name="stockFilter"
                    value="belowReorder"
                    label={t("below_reorder_level")}
                    checked={formState.stockFilter === "belowReorder"}
                    onChange={() => handleFieldChange("stockFilter", "belowReorder")}
                    className="items-center"
                />
            </div>
        </div>
    );
}

export default StockSummaryFilter;
export const StockSummaryFilterInitialState = {
    asOnDate: moment().local().endOf("day").toDate(),
    productGroupID: 0,
    productID: 0,
    brandID: 0,
    productCategoryID: 0,
    wareHouseID: 0,
    supplierID: 0,
    valuationUsing: "",
    showBatchWise: false,
    barcode: "",
    productCode: "",
    groupCategoryID: 0,
    sectionID: 0,
    location: "",
    stockFilter: "",
    standardFormat: false,
};