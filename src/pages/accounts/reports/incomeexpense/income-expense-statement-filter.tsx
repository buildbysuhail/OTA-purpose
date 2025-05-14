import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";

const IncomeExpenseStatementFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-2 md:gap-4 overflow-x-hidden overflow-y-hidden">
      {/* Date Range Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
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
        className="w-full"
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
export default IncomeExpenseStatementFilter;
export const IncomeExpenseStatementFilterInitialState = {
  fromDate: new Date(),
  toDate: new Date(),
  valuationUsing: "SPP",
};