import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";

const GroupedBrandwiseSalesFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
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
    );
}

export default GroupedBrandwiseSalesFilter;
export const GroupedBrandwiseSalesFilterInitialState = {
    fromDate: moment().local().toDate(),
    toDate: moment().local().toDate(),
};