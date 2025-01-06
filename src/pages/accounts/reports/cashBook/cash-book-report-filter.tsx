
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

const CashBookReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("asonDate")}
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