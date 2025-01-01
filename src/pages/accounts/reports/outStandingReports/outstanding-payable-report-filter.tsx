import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";

const OutstandingPayableReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* As On Date */}
      <ERPDateInput
        {...getFieldProps("asonDate")}
        label={t("as_on")}
        onChangeData={(data: any) => handleFieldChange("asonDate", data.asonDate)}
      />
      {/* Due Period Dropdown */}
      {/* <ERPDataCombobox
        {...getFieldProps("duePeriod")}
        label={t("Due Period")}
        field={{
          id: "duePeriod",
          options: [
            { id: "weekly", name: "Weekly" },
            { id: "monthly", name: "Monthly" },
            { id: "quarterly", name: "Quarterly" }
          ],
          valueKey: "id",
          labelKey: "name"
        }}
        value="Weekly"
        onChangeData={(data) => handleFieldChange('duePeriod', data.duePeriod)}
      /> */}

      {/* Sales Route Selection */}
      <div className="flex items-center gap-2">
        <ERPDataCombobox
          {...getFieldProps("routeID")}
          label={t("sales_route")}
          field={{
            id: "routeID",
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('routeID', data.routeID)}
        />
        <ERPDataCombobox
          {...getFieldProps("costCentreID")}
          label={t("cost_centre")}
          field={{
            id: "costCentreID",
            getListUrl: Urls.data_costcentres,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('costCentreID', data.costCentreID)}
        />
      </div>
      {/* Report Options */}
      <div className="space-y-2">
        <ERPCheckbox
          {...getFieldProps("showZeroBalance")}
          label={t("show/include_zero_balance_report")}
          onChangeData={(data) => handleFieldChange('showZeroBalance', data.showZeroBalance)}
        />
        <ERPCheckbox
          {...getFieldProps("payable")}
          label={t("show_payable")}
          onChangeData={(data) => handleFieldChange('payable', data.payable)}
        />
        <ERPCheckbox
          {...getFieldProps("receivable")}
          label={t("show_receivable")}
          onChangeData={(data) => handleFieldChange('receivable', data.receivable)}
        />
      </div>
    </div>
  );
}
export default OutstandingPayableReportFilter;
export const OutstandingPayableReportFilterInitialState = {
  asonDate: new Date(),
  routeID: 0,
  costCentreID: 0,
  showZeroBalance: false,
  payable: true,
  receivable: false,
};