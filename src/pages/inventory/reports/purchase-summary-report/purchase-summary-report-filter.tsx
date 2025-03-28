import { useSelector } from "react-redux";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";

const PurchaseSummaryFilter = ({
    getFieldProps,
    handleFieldChange,
    formState,
}: any) => {
      const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
      const usersession = useSelector((state: RootState) => state.UserSession);
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
                        {...getFieldProps("isTimeBased")}
                        label={t("consider_time")}
                        onChangeData={(data) => handleFieldChange("isTimeBased", data.isTimeBased)}
                    />
                    <div>
                        <label>{t("time_from")}</label>
                        <input
                            type="time"
                            className="form-control w-full border rounded px-2 py-1"
                            // value={formState.fromTime}
                            // {...getFieldProps("fromTime")}
                            value={formState.fromTime || moment().local().format("HH:mm")}
                            onChange={(e) => handleFieldChange("fromTime", e.target.value)}
                            disabled={!getFieldProps("isTimeBased").value}
                        />
                    {/* </div>
                    <div> */}
                        <label>{t("time_to")}</label>
                        <input
                            type="time"
                            className="form-control w-full border rounded px-2 py-1"
                            value={formState.toTime}
                            // value={formState.toTime || moment().local().format("HH:mm")}
                            onChange={(e) => handleFieldChange("toTime", e.target.value)}
                            disabled={!getFieldProps("isTimeBased").value}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                
                {/* <ERPDataCombobox     shown only  SI-BT
                    label={t("transfer_voucher")}
                    {...getFieldProps("voucherType")}
                    field={{
                        id: "voucherType",
                        getListUrl: Urls.data_vouchertype,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            voucherType: data.value,
                        });
                    }}
                /> */}
                {/* <ERPDataCombobox
                    label={t("product")}
                    {...getFieldProps("productID")}
                    field={{
                        id: "productID",
                        getListUrl: Urls.data_products,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            productID: data.value,
                             productName: data.label,

                        });
                    }}
                /> */}
                 {
        applicationSettings.mainSettings?.allowSalesRouteArea == true && (
                <ERPDataCombobox
                    label={t("sales_route")}
                    {...getFieldProps("salesRouteID")}
                    field={{
                        id: "salesRouteID",
                        getListUrl: Urls.data_salesRoute,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            salesRouteID: data.value,
                            routeName: data.label,
                        });
                    }}
                />)}
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
                            salesMan: data.label,
                        });
                    }}
                />
                  {
        applicationSettings.accountsSettings?.allowSalesCounter == true && (
                <ERPDataCombobox
                    label={t("counter")}
                    {...getFieldProps("counterID")}
                    field={{
                        id: "counterID",
                        getListUrl: Urls.data_counters,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            counterID: data.value,
                            counterName: data.label,
                        });
                    }}
                />)}
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
                        handleFieldChange({
                            partyID: data.value,
                        });
                    }}
                />
                <ERPDataCombobox
                    label={t("party_category")}
                    {...getFieldProps("partyCategoryID")}
                    field={{
                        id: "partyCategoryID",
                        getListUrl: Urls.data_party_categories,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            partyCategoryID: data.value,
                        });
                    }}
                />
                <ERPDataCombobox
                    label={t("voucher_form")}
                    {...getFieldProps("voucherForm")}
                    // options={[
                    //     { value: 'si-bt', label: 'SI-BT' },
                    //     { value: 'se-bt', label: 'SE-BT' }
                    // ]}
                    field={{
                        id: "voucherForm",
                        getListUrl: Urls.data_form_type,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            voucherForm: data.value,
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
                        });
                    }}
                />
                   {
        usersession.dbIdValue== "489995732270" && (
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
                        handleFieldChange({
                            costCenterID: data.value,
                        });
                    }}
                />
        )}
        {/* shows on SI,SR,SI-BT  */}
                {/* <ERPDataCombobox    
                    label={t("report_of")}
                    {...getFieldProps("reportOf")}
                    options={[
                        { value: 'all', label: 'All' },
                        { value: 'credit', label: 'Credit' },
                        { value: 'cash', label: 'Cash' },
                        { value: 'card', label: 'Card' }
                    ]}
                    field={{
                        id: "reportOf",
                        valueKey: "value",
                        labelKey: "label",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange({
                            reportOf: data.value,
                        });
                    }}
                /> */}
            </div>
        </div>
    );
};

export default PurchaseSummaryFilter;

export const PurchaseSummaryFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),//software date as initial
    toDate: moment().local().endOf("day").toDate(),
    voucherType: "PI",
    salesRouteID: 0,
    counterID: 0,
    salesmanID: 0,
    productID: 0,
    partyID: 0,
    voucherForm: "@",
    warehouseID: 0, //PRESETWAREHOUSEID>0 disable with that value
    partyCategoryID: 0,
    isTimeBased: 0,
    fromTime: moment().local().format("hh:mm"), // 12-hour format without seconds
    toTime: moment().local().format("hh:mm"),
    transactionType: "",
    reportOf: "",
    IsInactive:false//true on in shortcut NPIR
};