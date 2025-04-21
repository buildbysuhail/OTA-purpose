import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import ErpInput from "../../../../components/ERPComponents/erp-input";

const PrivilegeCardReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation("accountsReport")
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

            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <ErpInput
                            id="cardNo"
                            {...getFieldProps("cardNo")}
                            onChangeData={(data) => handleFieldChange("cardNo", data.cardNo)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivilegeCardReportFilter;
export const PrivilegeCardReportFilterInitialState = {
    dateFrom: moment().local().startOf("month").toDate(),
    dateTo: moment().local().endOf("day").toDate(),
    cardNo: "",
    showCardNo: false
};