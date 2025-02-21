import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";



const DailyBalanceReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("fromDate")}
          label={t("From")}
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("To")}
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>
    </div>
  );
}
export default DailyBalanceReportFilter;
export const DailyBalanceReportFilterInitialState = {
  fromDate: new Date(),
  toDate: new Date(),
};