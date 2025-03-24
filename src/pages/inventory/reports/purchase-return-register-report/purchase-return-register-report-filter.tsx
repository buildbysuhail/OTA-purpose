import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import ERPInput from "../../../../components/ERPComponents/erp-input";

const PurchaseReturnRegisterFilter = ({
    getFieldProps,
    handleFieldChange,
    formState,
}: any) => {
    const { t } = useTranslation("accountsReport");

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <ERPDateInput
                        label="from_date"
                        {...getFieldProps("fromDate")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
                    />
                    <ERPDateInput
                        label="to_date"
                        {...getFieldProps("toDate")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <ERPDataCombobox
                    label={t("transfer_voucher")}
                    {...getFieldProps("transferVoucher")}
                    options={[
                        { value: 'si-bt', label: 'SI-BT' },
                        { value: 'se-bt', label: 'SE-BT' }
                    ]}
                    field={{
                        id: "transferVoucher",
                        valueKey: "value",
                        labelKey: "label",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("transferVoucher", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("product_category")}
                    {...getFieldProps("productCategoryID")}
                    field={{
                        id: "productCategoryID",
                        getListUrl: Urls.productCategory,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("productCategoryID", data.value)}
                />

                <ERPDataCombobox
                    label={t("product_group")}
                    {...getFieldProps("productGroupID")}
                    field={{
                        id: "productGroupID",
                        getListUrl: Urls.data_productgroup,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("productGroupID", data.value)}
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
                    onSelectItem={(data) => handleFieldChange("brandID", data.value)}
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
                    onSelectItem={(data) => handleFieldChange("productID", data.value)}
                />

                <ERPInput
                    label={t("product_code")}
                    id="productCode"
                    type="text"
                    value={formState.productCode}
                    onChange={(e) => handleFieldChange("productCode", e.target.value)}
                />

                <ERPDataCombobox
                    label={t("sales_man")}
                    {...getFieldProps("salesmanID")}
                    field={{
                        id: "salesmanID",
                        getListUrl: Urls.data_employees,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("salesmanID", data.value)}
                />

                <ERPDataCombobox
                    label={t("sales_route")}
                    {...getFieldProps("salesRouteID")}
                    field={{
                        id: "salesRouteID",
                        getListUrl: Urls.data_salesRoute,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("salesRouteID", data.value)}
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
                    onSelectItem={(data) => handleFieldChange("warehouseID", data.value)}
                />

                <ERPDataCombobox
                    label={t("voucher_form")}
                    {...getFieldProps("voucherForm")}
                    field={{
                        id: "voucherForm",
                        getListUrl: Urls.data_form_type,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("voucherForm", data.value)}
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
                    onSelectItem={(data) => handleFieldChange("groupCategoryID", data.value)}
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
                    onSelectItem={(data) => handleFieldChange("sectionID", data.value)}
                />

                <ERPDataCombobox
                    label={t("price_category")}
                    {...getFieldProps("priceCategoryID")}
                    field={{
                        id: "priceCategoryID",
                        getListUrl: Urls.data_pricectegory,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("priceCategoryID", data.value)}
                />

                <ERPDataCombobox
                    label={t("party")}
                    {...getFieldProps("partyLedgerID")}
                    field={{
                        id: "partyLedgerID",
                        getListUrl: Urls.data_parties,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("partyLedgerID", data.value)}
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
                    onSelectItem={(data) => handleFieldChange("supplierID", data.value)}
                />

                <ERPDataCombobox
                    label={t("cost_center")}
                    {...getFieldProps("costCenterID")}
                    field={{
                        id: "costCenterID",
                        getListUrl: Urls.data_costcentres,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("costCenterID", data.value)}
                />

                <ERPDataCombobox
                    label={t("manufacture")}
                    {...getFieldProps("manufactureID")}
                    field={{
                        id: "manufactureID",
                        // getListUrl: Urls.data_manufactures,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("manufactureID", data.value)}
                />

                <ERPDataCombobox
                    label="transaction_type"
                    {...getFieldProps("voucherType")}
                    field={{
                        id: "voucherType",
                        getListUrl: Urls.data_vouchertype,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => handleFieldChange("voucherType", data.value)}
                />
                <div>
                    <ERPCheckbox
                        {...getFieldProps("showVAT")}
                        label={t("vat_%")}
                        onChangeData={(data) => handleFieldChange("showVAT", data.showVAT)}
                    />
                    <ERPInput
                        noLabel={true}
                        id="vatPerc"
                        type="number"
                        value={formState.vatPerc}
                        onChange={(e) => handleFieldChange("vatPerc", parseInt(e.target.value))}
                        disabled={!getFieldProps("showVAT").value}
                    />
                </div>

                <ERPDataCombobox
                    label={t("report_of")}
                    {...getFieldProps("reportOf")}
                    options={[
                        { value: 'all', label: 'All' },
                        { value: 'below-cost', label: 'Below Cost' },
                    ]}
                    field={{
                        id: "reportOf",
                        valueKey: "value",
                        labelKey: "label",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("reportOf", data.value);
                    }}
                />

                <div className="flex items-center">
                    <ERPCheckbox
                        {...getFieldProps("exportToExcel")}
                        label={t("export_data_to_excel")}
                        onChangeData={(data) => handleFieldChange("exportToExcel", data.exportToExcel)}
                    />
                </div>

                <div className="flex items-center">
                    <ERPCheckbox
                        {...getFieldProps("standardFormat")}
                        label={t("standard_format")}
                        onChangeData={(data) => handleFieldChange("standardFormat", data.standardFormat)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PurchaseReturnRegisterFilter;

export const PurchaseReturnRegisterFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    voucherType: "",
    transferVoucher: "",
    productCategoryID: 0,
    productGroupID: 0,
    brandID: 0,
    productID: 0,
    productCode: "",
    vatPerc: 0,
    salesRouteID: 0,
    salesmanID: 0,
    warehouseID: 0,
    voucherForm: "",
    groupCategoryID: 0,
    sectionID: 0,
    priceCategoryID: 0,
    partyLedgerID: 0,
    costCenterID: 0,
    supplierID: 0,
    manufactureID: 0,

    // Checkbox states
    showVAT: false,
    exportToExcel: false,
    standardFormat: false,
    reportOf: ""
};