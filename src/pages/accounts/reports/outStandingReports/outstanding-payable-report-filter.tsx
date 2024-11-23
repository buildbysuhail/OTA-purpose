
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";


const OutstandingPayableReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
      <div className="grid grid-cols-1 gap-4">
      {/* As On Date */}
      <ERPDateInput
        {...getFieldProps("asonDate")}
        label={t("As On")}
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
      label={t("Cost Centre")}
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
      label={t("Cost Centre")}
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
          label={t("Show/Include Zero Balance Report")}
          onChangeData={(data) => handleFieldChange('showZeroBalance', data.showZeroBalance)}
        />

        {/* <ERPCheckbox
          {...getFieldProps("showPayable")}
          label={t("Show Payable")}
          onChangeData={(data) => handleFieldChange('showPayable', data.showPayable)}
        />

        <ERPCheckbox
          {...getFieldProps("showReceivable")}
          label={t("Show Receivable")}
          onChangeData={(data) => handleFieldChange('showReceivable', data.showReceivable)}
        /> */}
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
};