
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";


const CashBookReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
  <div className="grid grid-cols-1 gap-4">
    {/* Date Range Section */}
    <div className="flex items-center gap-4">
      <ERPDateInput
        {...getFieldProps("asonDate")}
        label={t("To")}
        onChangeData={(data: any) => handleFieldChange("asonDate", data.asonDate)}
      />
    </div>
  </div>

);
}
export default CashBookReportFilter;
export const CashBookReportFilterInitialState = {
  asonDate: new Date(),
};