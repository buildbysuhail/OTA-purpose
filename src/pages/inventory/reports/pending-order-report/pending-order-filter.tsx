import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";

const PendingOrderReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
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

            <div className="grid grid-cols-1 gap-4">
                <ERPDataCombobox
                    label={t("transaction_type")}
                    {...getFieldProps("voucherType")}
                    field={{
                        id: "voucherType",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("voucherType", data.id);
                    }}
                    className="w-full"
                    options={[
                        { id: "SI", name: "Sales Invoice" },
                        { id: "SR", name: "Sales Return" },
                        { id: "PI", name: "Purchase Invoice" },
                        { id: "PR", name: "Purchase Return" },
                        { id: "SO", name: "Sales Order" },
                        { id: "SQ", name: "Sales Quotation" },
                        { id: "GD", name: "Goods Delivery" },
                        { id: "DR", name: "Goods Delivery Return" },
                        { id: "GRN", name: "Goods Receipt" },
                        { id: "GRR", name: "Goods Receipt Return" },
                        { id: "GR", name: "Goods Request" },
                        { id: "PO", name: "Purchase Order" },
                        { id: "ILR", name: "Item Load Request" },
                    ]}
                />
            </div>
        </div>
    );
}

export default PendingOrderReportFilter;
export const PendingOrderReportFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    voucherType: "",
};