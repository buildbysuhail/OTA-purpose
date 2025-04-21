import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../redux/urls";

const ExpiryReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <ERPDateInput
                        label={t("from_date")}
                        {...getFieldProps("fromDate")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
                    />
                    <ERPDateInput
                        label={t("to_date")}
                        {...getFieldProps("toDate")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
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
                    label={t("warehouse")}
                    {...getFieldProps("warehouseID")}
                    field={{
                        id: "warehouseID",
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("warehouseID", data.value);
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
                    label={t("stock_valuation")}
                    {...getFieldProps("valuationUsing")}
                    field={{
                        id: "valuationUsing",
                        getListUrl: Urls.data_stock_valuation_methods,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("valuationUsing", data.value);
                    }}
                />
            </div>
        </div>
    );
}

export default ExpiryReportFilter;
export const ExpiryReportFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    productGroupID: 0,
    productID: 0,
    brandID: 0,
    productCategoryID: 0,
    warehouseID: 0,
    supplierID: 0,
    valuationUsing: "",
};