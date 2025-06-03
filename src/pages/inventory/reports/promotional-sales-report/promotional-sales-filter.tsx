import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from "moment";
import Urls from "../../../../redux/urls";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const PromotionalSalesReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
      const applicationSettings = useSelector(
        (state: RootState) => state.ApplicationSettings
      );
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

            <div className="grid grid-cols-3 gap-4">
                <ERPDataCombobox
                    {...getFieldProps("productGroupID")}
                    field={{
                        id: "productGroupID",
                        getListUrl: Urls.data_productgroup,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("product_group")}
                    onSelectItem={(data) => {
                        handleFieldChange({
            productGroupID: data.value,
            productGroup: data.label,
          })
                    }}
                />
                <ERPDataCombobox
                    {...getFieldProps("brandID")}
                    field={{
                        id: "brandID",
                        getListUrl: Urls.data_brands,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("brand")}
                    onSelectItem={(data) => {
                        handleFieldChange({
            brandID: data.value,
            brand: data.label,
          })
                    }}
                />
                <ERPDataCombobox
                    {...getFieldProps("productID")}
                    field={{
                        id: "productID",
                        getListUrl: Urls.data_products,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("product")}
                    onSelectItem={(data) => {
                        handleFieldChange({
            productID: data.value,
            product: data.label,
          })
                    }}
                />
                <ErpInput
                    label={t("product_code")}
                    {...getFieldProps("productCode")}
                    onChangeData={(data) => handleFieldChange("productCode", data.productCode)}
                />
                <ERPDataCombobox
                    {...getFieldProps("salesmanID")}
                    field={{
                        id: "salesmanID",
                        getListUrl: Urls.data_employees,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("sales_man")}
                    onSelectItem={(data) => {
                      handleFieldChange({
            sectionID: data.value,
            section: data.label,
          })
                    }}
                />
                 {applicationSettings.mainSettings?.allowSalesRouteArea == true && (
                <ERPDataCombobox
                    {...getFieldProps("salesRouteID")}
                    field={{
                        id: "salesRouteID",
                        getListUrl: Urls.data_salesRoute,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("sales_route")}
                    onSelectItem={(data) => {
                        handleFieldChange({
            salesRouteID: data.value,
            salesRoute: data.label,
          })
                    }}
                />
                )}
                  {applicationSettings.inventorySettings?.maintainWarehouse == true && (
                <ERPDataCombobox
                    {...getFieldProps("warehouseID")}
                    field={{
                        id: "warehouseID",
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("warehouse")}
                    onSelectItem={(data) => {
                        handleFieldChange({
            warehouseID: data.value,
            warehouse: data.label,
          })
                    }}
                />
                  )}
                <ERPDataCombobox
                    {...getFieldProps("voucherForm")}
                    field={{
                        id: "voucherForm",
                         getListUrl: Urls.data_form_type,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("voucher_form")}
                    onSelectItem={(data) => {
                        handleFieldChange("voucherForm", data.value);
                    }}
                />
                <ERPDataCombobox
                    {...getFieldProps("groupCategoryID")}
                    field={{
                        id: "groupCategoryID",
                        getListUrl: Urls.data_groupcategory,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("group_category")}
                    onSelectItem={(data) => {
                        handleFieldChange("groupCategoryID", data.value);
                    }}
                />

                <ERPDataCombobox
                    {...getFieldProps("sectionID")}
                    field={{
                        id: "sectionID",
                        getListUrl: Urls.data_sections,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label={t("section")}
                    onSelectItem={(data) => {
                        handleFieldChange({
            sectionID: data.value,
            section: data.label,
          })
                    }}
                />
            </div>
        </div>
    );
}

export default PromotionalSalesReportFilter;
export const PromotionalSalesReportFilterInitialState = {
    fromDate: moment().local().toDate(),
    toDate: moment().local().toDate(),
    productGroupID: 0,
    brandID: 0,
    productID: 0,
    productCode: "",
    salesmanID: 0,
    salesRouteID: 0,
    warehouseID: 0,
    voucherForm: "",
    groupCategoryID: 0,
    sectionID: 0,
};