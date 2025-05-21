import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const DaywiseSummaryWithProfitFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
      const userSession = useSelector((state: RootState) => state.UserSession);
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

            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-end gap-4">
                <ERPDataCombobox
                    label={t("sales_route")}
                    {...getFieldProps("salesRouteID")}
                    field={{
                        id: "salesRouteID",
                        getListUrl: Urls.data_salesRoute,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                       handleFieldChange({
            salesRouteID: data.value,
            routeName: data.label,
          })
                    }}
                />

                <ERPDataCombobox
                    label={t("cost_center")}
                    {...getFieldProps("costCenterID")}
                    field={{
                        id: "costCenterID",
                        getListUrl: Urls.data_costcentres,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                       handleFieldChange({
            costCentreID: data.value,
            costCenterName: data.label,
          })
                    }}
                />
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-1 items-end gap-4">
                <ERPCheckbox
                    {...getFieldProps("showTransactionTimeProfit")}
                    label={t("show_transaction_profit")}
                    onChangeData={(data) => handleFieldChange("showTransactionTimeProfit", data.showTransactionTimeProfit)}
                />

                <ERPCheckbox
                    {...getFieldProps("showSalesReturn")}
                    label={t("show_sales_return")}
                    onChangeData={(data) => handleFieldChange("showSalesReturn", data.showSalesReturn)}
                />
  {userSession.dbIdValue == "489995732270" && (
                <ERPCheckbox
                    {...getFieldProps("showBatchCost")}
                    label={t("show_with_last_purchase_cost")}
                    onChangeData={(data) => handleFieldChange("showBatchCost", data.showBatchCost)}
                />
                   )}
            </div>
        </div>
    );
}

export default DaywiseSummaryWithProfitFilter;
export const DaywiseSummaryWithProfitFilterInitialState = {
    fromDate: moment().local().startOf("day").toDate(),
    toDate: moment().local().endOf("day").toDate(),
    salesRouteID: -1,
    costCenterID: -1,
    showTransactionTimeProfit: false,
    showSalesReturn: false,
    showBatchCost: false
};