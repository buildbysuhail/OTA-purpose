import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from "moment";

const KsaEInvoiceReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
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

            <div className="flex flex-wrap sm:flex-nowrap flex-col sm:flex-row items-center gap-4">
                <div className="w-full">
                    <span className="font-medium text-[#8b8b8b]">{t('transactions')}</span>
                    <div className="flex flex-col sm:flex-row items-left sm:items-center justify-between gap-4 p-4 rounded border border-[#ccc] rounded-md w-full mt-1">
                        <ERPCheckbox
                            {...getFieldProps("includeSI")}
                            label={t("invoice")}
                            onChangeData={(data: any) => handleFieldChange("includeSI", data.includeSI)}
                        />
                        <ERPCheckbox
                            {...getFieldProps("includeSR")}
                            label={t("credit_note_sales_return")}
                            onChangeData={(data: any) => handleFieldChange("includeSR", data.includeSR)}
                        />
                        <ERPCheckbox
                            {...getFieldProps("includeDN")}
                            label={t("debit_note")}
                            onChangeData={(data: any) => handleFieldChange("includeDN", data.includeDN)}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <span className="font-medium text-[#8b8b8b]">{t("type")}</span>
                    <div className="flex flex-col sm:flex-row items-left sm:items-center justify-between gap-4 p-4 rounded border border-[#ccc] rounded-md w-full mt-1">
                        <ERPCheckbox
                            {...getFieldProps("b2b")}
                            label={t("b2b")}
                            onChangeData={(data: any) => handleFieldChange("b2b", data.b2b)}
                        />
                        <ERPCheckbox
                            {...getFieldProps("b2c")}
                            label={t("b2c")}
                            onChangeData={(data: any) => handleFieldChange("b2c", data.b2c)}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <span className="font-medium text-[#8b8b8b]">{t('results')}</span>
                    <div className="flex flex-col sm:flex-row items-left sm:items-center justify-between gap-4 p-4 rounded border border-[#ccc] rounded-md w-full mt-1">
                        <ERPCheckbox
                            {...getFieldProps("passed")}
                            label={t("passed")}
                            onChangeData={(data: any) => handleFieldChange("passed", data.passed)}
                        />
                        <ERPCheckbox
                            {...getFieldProps("failed")}
                            label={t("failed")}
                            onChangeData={(data: any) => handleFieldChange("failed", data.failed)}
                        />
                        <ERPCheckbox
                            {...getFieldProps("other")}
                            label={t("other")}
                            onChangeData={(data: any) => handleFieldChange("other", data.other)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <a href="#">{t("show_xml")}</a>

                {/* <ERPButton
                    type="button"
                    title={t("save_template")}
                />
                <ERPButton
                    type="button"
                    title={t("fix_&_send_again")}
                /> */}
            </div>
        </div>
    );
}

export default KsaEInvoiceReportFilter;
export const KsaEInvoiceReportFilterInitialState = {
    fromDate: moment().local().subtract(2, "day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    includeSI: true,
    includeSR: true,
    includeDN: true,
    b2b: true,
    b2c: true,
    passed: false,
    failed: true,
    other: true
};