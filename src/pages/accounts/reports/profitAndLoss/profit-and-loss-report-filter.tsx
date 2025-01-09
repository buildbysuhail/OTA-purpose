import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";

const ProfitAndLossReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("fromDate")}
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>
      <ERPDataCombobox
        {...getFieldProps("valuationUsing")}
        label={t("stock_value")}
        field={{
          id: "valuationUsing",
          getListUrl: Urls.data_stock_valuation_methods,
          valueKey: "id",
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