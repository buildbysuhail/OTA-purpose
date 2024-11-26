
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";


const ProfitAndLossReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
  <div className="grid grid-cols-1 gap-4">
    {/* Date Range Section */}
    <div className="flex items-center gap-4">
      <ERPDateInput
        {...getFieldProps("fromDate")}
        label={t("fromDate")}
        onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        autoFocus={true}
      />
      <ERPDateInput
        {...getFieldProps("toDate")}
        label={t("To")}
        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
      />
    </div>
    <ERPDataCombobox
      {...getFieldProps("valuationUsing")}
      label={t("stock_value")}
      field={{
        id: "valuationUsing",
        getListUrl: Urls.data_stock_valuation_methods,
        valueKey: "name",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('valuationUsing', data.valuationUsing)}
    />
    {/* <ERPCheckbox
      {...getFieldProps("showDetailed")}
      label={t("showDetailed")}
      onChangeData={(data) => handleFieldChange('showDetailed', data.showDetailed)}
    /> */}
  </div>
);
}
export default ProfitAndLossReportFilter;
export const ProfitAndLossReportFilterInitialState = {
  fromDate: new Date(), 
  toDate: new Date(),
  valuationUsing: "SPP", 
};