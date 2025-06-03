import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";

const InventorySummaryReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')

    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <ERPDateInput
                        label={t("as_on_date")}
                        {...getFieldProps("asonDate")}
                        className="max-w-[150px]"
                        onChangeData={(data: any) => handleFieldChange("asonDate", data.asonDate)}
                    />
                </div>

                <ERPDataCombobox
                    label={t("branch")}
                    {...getFieldProps("branchID")}
                    field={{
                        id: "branchID",
                        // getListUrl: Urls.branch,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("branchID", data.value);
                    }}
                    showCheckbox={true}
                />
            </div>
        </div>
    );
}

export default InventorySummaryReportFilter;
export const InventorySummaryReportFilterInitialState = {
    asonDate: moment().local().toDate(),
    branchID: 0
};