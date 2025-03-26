import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";

const ProductSummaryFilter = ({
    getFieldProps,
    handleFieldChange,
    formState,
}: any) => {
    const { t } = useTranslation("accountsReport");

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-4 gap-4">
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

            <div className="grid grid-cols-3 gap-4">
                <ERPInput
                    label={t("product_code")}
                    {...getFieldProps("productBatchID")}
                    className="w-full"
                    onChangeData={(val: string) => handleFieldChange("productBatchID", val)}
                />

                <ERPDataCombobox
                    label={t("product")}
                    {...getFieldProps("productID")}
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

                <ERPDataCombobox
                    label={t("warehouse")}
                    {...getFieldProps("warehouseID")}
                    field={{
                        id: "warehouseID",
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("warehouseID", data.value);
                    }}
                />

                <ERPCheckbox
                    label={t("show_batch_wise")}
                    {...getFieldProps("showBatchWise")}
                    onChangeData={(data: any) => handleFieldChange("showBatchWise", data.showBatchWise)}
                />
            </div>
        </div>
    );
};

export default ProductSummaryFilter;

export const ProductSummaryFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    productID: 0,
    productBatchID: 0,
    warehouseID: 0,
    showBatchWise: false,
};