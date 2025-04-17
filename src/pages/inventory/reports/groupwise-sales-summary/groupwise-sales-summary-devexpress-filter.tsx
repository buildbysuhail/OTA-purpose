import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import { LedgerType } from "../../../../enums/ledger-types";

const GroupwiseSalesSummaryDevexpressFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2"> */}
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
                {/* </div>
            </div> */}

            {/* <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4"> */}
                <ERPDataCombobox
                    label={t("supplier")}
                    {...getFieldProps("supplierLedgerID")}
                    field={{
                        id: "supplierLedgerID",
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerType=${LedgerType.Supplier}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => { handleFieldChange("supplierLedgerID", data.value); }}
                />

            {/* </div> */}
        </div>
    );
}

export default GroupwiseSalesSummaryDevexpressFilter;
export const GroupwiseSalesSummaryDevexpressFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    supplierLedgerID: 0,
};