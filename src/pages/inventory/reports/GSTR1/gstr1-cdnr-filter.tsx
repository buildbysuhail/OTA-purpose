import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from "moment";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";

const GSTR1CDNRFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport');
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
                <ERPDataCombobox
                    label={t("voucher_form")}
                    {...getFieldProps("voucherForm")}
                    field={{
                        id: "voucherForm",
                         getListUrl: Urls.data_form_type,
                        valueKey: "name",
                        labelKey: "name",
                    }}
                    className="w-full"
                    onSelectItem={(data) => {
                        handleFieldChange("voucherForm", data.value);
                    }}
                />
                <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
                    <ERPCheckbox
                        {...getFieldProps("excludeNA")}
                        label={t("exclude_na")}
                        onChangeData={(data) => handleFieldChange("excludeNA", data.excludeNA)}
                    />
                    <ERPCheckbox
                        {...getFieldProps("cdnr_pr")}
                        label={t("exclude_pr")}
                        onChangeData={(data) => handleFieldChange("cdnr_pr", data.cdnr_pr)}
                    />
                </div>
            </div>
        </div>
    );
}

export default GSTR1CDNRFilter;

export const GSTR1CDNRFilterInitialState = {
    fromDate: moment().local().toDate(),
    toDate: moment().local().toDate(),
    voucherForm: "",
    excludeNA: false,
    cdnr_pr: false,
};