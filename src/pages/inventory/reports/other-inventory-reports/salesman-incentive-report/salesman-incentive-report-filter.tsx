import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../../redux/urls";

const SalesmanIncentiveReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
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
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <ERPDataCombobox
                            label={t("sales_man")}
                            {...getFieldProps("employee")}
                            field={{
                                id: "employee",
                                getListUrl: Urls.data_employees,
                                valueKey: "id",
                                labelKey: "name",
                            }}
                            onSelectItem={(data) => {
                                 handleFieldChange({
            employee: data.value,
            employeeName: data.label,
          })
                                }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesmanIncentiveReportFilter;
export const SalesmanIncentiveReportFilterInitialState = {
    fromDate: moment().local().toDate(),
    toDate: moment().local().toDate(),
    employee: 0,
};