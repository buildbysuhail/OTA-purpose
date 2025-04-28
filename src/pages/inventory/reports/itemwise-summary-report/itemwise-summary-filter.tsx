import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { LedgerType } from "../../../../enums/ledger-types";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const ItemWiseSummaryFilter = ({
    getFieldProps,
    handleFieldChange,
    formState,
}: any) => {
    const { t } = useTranslation("accountsReport");
    const clientSession = useSelector((state: RootState) => state.ClientSession);
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    clientSession.isAppGlobal == true && (
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
                    )
                }

                <ERPDataCombobox
                    label={t("party")}
                    {...getFieldProps("partyID")}
                    field={{
                        id: "partyID",
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            partyID: data.value,
                            party: data.label,
                        });
                    }}
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
                    onSelectItem={(data) => {
                        handleFieldChange({
                            productGroupID: data.value,
                            productGroup: data.label,
                        });
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
                        handleFieldChange({
                            brandID: data.value,
                            brand: data.label,
                        });
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

                <ERPInput
                    label={t("product_code")}
                    {...getFieldProps("productCode")}
                    className="w-full"
                    onChangeData={(val: string) => handleFieldChange("productCode", val)}
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
                    onSelectItem={(data) => {
                        handleFieldChange({
                            salesmanID: data.value,
                            salesman: data.label,
                        });
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
                        handleFieldChange({
                            warehouseID: data.value,
                            warehouse: data.label,
                        });
                    }}
                />

                <ERPDataCombobox
                    disabled={true}
                    label={t("to_branch")}
                    {...getFieldProps("toBranchID")}
                    field={{
                        id: "toBranchID",
                        getListUrl: Urls.Branch,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("toBranchID", data.value);
                    }}
                />

                <ERPDataCombobox
                    disabled={true}
                    label={t("to_warehouse")}
                    {...getFieldProps("toWarehouseID")}
                    field={{
                        id: "toWarehouseID",
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("toWarehouseID", data.value);
                    }}
                />

                {/* always visible false */}
                {/* <ERPDataCombobox
                    label={t("sales_route")}
                    {...getFieldProps("salesRouteID")}
                    field={{
                        id: "salesRouteID",
                        getListUrl: Urls.data_salesRoute,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("salesRouteID", data.value);
                    }}
                /> */}

                <ERPDataCombobox
                    label={t("supplier")}
                    {...getFieldProps("supplierID")}
                    field={{
                        id: "supplierID",
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerType=${LedgerType.Supplier}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            supplierID: data.value,
                            supplier: data.label,
                        });
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
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("location", data.value);
                    }}
                />
                {
                    clientSession.isAppGlobal == true && (
                        <ERPCheckbox
                            label={t("category_wise_summary")}
                            {...getFieldProps("isCategoryWise")}
                            onChangeData={(data: any) => handleFieldChange("isCategoryWise", data.isCategoryWise)}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default ItemWiseSummaryFilter;

export const ItemWiseSummaryFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    productGroupID: 0,
    brandID: 0,
    productID: 0,
    salesRouteID: 0,
    salesmanID: 0,
    warehouseID: 0,
    partyID: 0,
    supplierID: 0,
    groupCategoryID: 0,
    sectionID: 0,
    productCode: "",
    toBranchID: 0,
    toWarehouseID: 0,
    location: "",
    productCategoryID: 0,
    isCategoryWise: false,
};