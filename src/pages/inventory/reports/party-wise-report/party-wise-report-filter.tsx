import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { LedgerType } from "../../../../enums/ledger-types";

const PartyWiseReportFilter = ({
    getFieldProps,
    handleFieldChange,
    formState,
}: any) => {
    const { t } = useTranslation("accountsReport");

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
                <ERPDateInput
                    label={t("from_date")}
                    {...getFieldProps("fromDate")}
                    className="w-full"
                    onChangeData={(data: any) =>
                        handleFieldChange("fromDate", data.fromDate)
                    }
                />
                <ERPDateInput
                    label={t("to_date")}
                    {...getFieldProps("toDate")}
                    className="w-full"
                    onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
                />
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
                <ERPDataCombobox
                    label={t("party")}
                    {...getFieldProps("ledgerID")}
                    field={{
                        id: "ledgerID",
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("ledgerID", data.value);
                    }}
                />

                {/* <div className="flex items-center gap-2">
                    <div className="flex flex-col"> */}
                {/* <ERPCheckbox
                            {...getFieldProps("isProductChecked")}
                            label={t("products")}
                            onChangeData={(data) =>
                                handleFieldChange("isProductChecked", data.isProductChecked)
                            }
                        /> */}
                <ERPDataCombobox
                    {...getFieldProps("productID")}
                    label={t("products")}
                    field={{
                        id: "productID",
                        getListUrl: Urls.data_products,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("productID", data.value);
                    }}
                />
                {/* </div>
                </div> */}

            </div>
        </div>
    );
};

export default PartyWiseReportFilter;

export const PartyWiseReportFilterInitialState = {
    fromDate: moment().startOf("day").toDate(),
    toDate: moment().endOf("day").toDate(),
    ledgerID: 0,
    productID: 0,
};
