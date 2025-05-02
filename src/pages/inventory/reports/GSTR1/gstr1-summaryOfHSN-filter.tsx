import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../../redux/urls";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";


const GSTR1HSNSummaryFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
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
                        {...getFieldProps("si")}
                        label={t("si")}
                        onChangeData={(data) => handleFieldChange("si", data.si)}
                    />
                    <ERPCheckbox
                        {...getFieldProps("bsi")}
                        label={t("bsi")}
                        onChangeData={(data) => handleFieldChange("bsi", data.bsi)}
                    />
                    <ERPCheckbox
                        {...getFieldProps("sr")}
                        label={t("sr")}
                        onChangeData={(data) => handleFieldChange("sr", data.sr)}
                    />
                    <ERPCheckbox
                        {...getFieldProps("includeSr")}
                        label={t("includeSr")}
                        onChangeData={(data) => handleFieldChange("includeSr", data.includeSr)}
                    />
                </div>
            </div>
        </div>
    );
}

export default GSTR1HSNSummaryFilter;

export const GSTR1HSNSummaryFilterInitialState = {
    fromDate: moment().local().toDate(),
    toDate: moment().local().toDate(),
    voucherForm: "",
    excludeNA: false,
    includeSr: false,
    si:false,
    bsi:false,
    sr:false,
};