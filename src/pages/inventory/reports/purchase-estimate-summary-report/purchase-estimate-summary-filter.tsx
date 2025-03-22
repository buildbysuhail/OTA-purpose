import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";

const PurchaseEstimateFilter = ({
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
                <div className="flex items-center gap-2">
                    <ERPCheckbox
                        label={t("consider_time")}
                        {...getFieldProps("isTimeBased")}
                        onChangeData={(val: boolean) => handleFieldChange("isTimeBased", val ? 1 : 0)}
                    />
                    <div>
                        <label>{t("time_from")}</label>
                        <input
                            type="time"
                            className="form-control w-full border rounded px-2 py-1"
                            value={formState.fromTime}
                            onChange={(e) => handleFieldChange("fromTime", e.target.value)}
                            disabled={!getFieldProps("isTimeBased").value}
                        />
                    </div>
                    <div>
                        <label>{t("time_to")}</label>
                        <input
                            type="time"
                            className="form-control w-full border rounded px-2 py-1"
                            value={formState.toTime}
                            onChange={(e) => handleFieldChange("toTime", e.target.value)}
                            disabled={!getFieldProps("isTimeBased").value}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <ERPDataCombobox
                    label={t("transfer_voucher")}
                    {...getFieldProps("transferVoucher")}
                    field={{
                        id: "transferVoucher",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("transferVoucher", data.value);
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
                    label={t("sales_route")}
                    {...getFieldProps("salesRouteID")}
                    field={{
                        id: "salesRouteID",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("salesRouteID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("sales_man")}
                    {...getFieldProps("salesmanID")}
                    field={{
                        id: "salesmanID",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("salesmanID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("counter")}
                    {...getFieldProps("counterID")}
                    field={{
                        id: "counterID",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("counterID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("party")}
                    {...getFieldProps("partyID")}
                    field={{
                        id: "partyID",
                        getListUrl: Urls.data_parties,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("partyID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("party_category")}
                    {...getFieldProps("partyCategoryID")}
                    field={{
                        id: "partyCategoryID",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("partyCategoryID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("voucher_form")}
                    {...getFieldProps("voucherForm")}
                    field={{
                        id: "voucherForm",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("voucherForm", data.value);
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
                    label={t("cost_center")}
                    {...getFieldProps("costCenterID")}
                    field={{
                        id: "costCenterID",
                        getListUrl: Urls.data_costcentres,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("costCenterID", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("transaction_type")}
                    {...getFieldProps("voucherType")}
                    field={{
                        id: "voucherType",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("voucherType", data.value);
                    }}
                />

                <ERPDataCombobox
                    label={t("report_of")}
                    {...getFieldProps("reportOf")}
                    field={{
                        id: "reportOf",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("reportOf", data.value);
                    }}
                />
            </div>
        </div>
    );
};

export default PurchaseEstimateFilter;

export const PurchaseEstimateFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    voucherType: "",
    salesRouteID: 0,
    counterID: 0,
    salesmanID: 0,
    productID: 0,
    partyID: 0,
    voucherForm: "",
    warehouseID: 0,
    partyCategoryID: 0,
    isTimeBased: 0,
    fromTime: moment().local().format("HH:mm"),
    toTime: moment().local().format("HH:mm"),
    costCenterID: 0,
    transferVoucher: "",
    reportOf: "",
};