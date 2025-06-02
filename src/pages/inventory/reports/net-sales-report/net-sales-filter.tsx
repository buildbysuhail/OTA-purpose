import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

const NetSalesReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <ERPDateInput
                        label={t("date_from")}
                        {...getFieldProps("dateFrom")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
                    />
                    <ERPDateInput
                        label={t("date_to")}
                        {...getFieldProps("dateTo")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4">
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
                        handleFieldChange("salesRouteID", data.salesRouteID);
                    }}
                />

                <ERPDataCombobox
                    label={t("salesman")}
                    {...getFieldProps("salesmanID")}
                    field={{
                        id: "salesmanID",
                        getListUrl: Urls.data_users,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("salesmanID", data.salesmanID);
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
                        handleFieldChange("partyID", data.partyID);
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
                        handleFieldChange("partyCategoryID", data.partyCategoryID);
                    }}
                />

                <ERPCheckbox
                    {...getFieldProps("groupByParty")}
                    label={t("group_by_party")}
                    onChangeData={(data) => handleFieldChange("groupByParty", data.groupByParty)}
                />
            </div>
        </div>
    );
}

export default NetSalesReportFilter;
export const NetSalesReportFilterInitialState = {
    dateFrom: moment().local().toDate(),
    dateTo: moment().local().toDate(),
    salesRouteID: 0,
    salesmanID: 0,
    partyID: 0,
    groupByParty: false,
    partyCategoryID: 0,
};