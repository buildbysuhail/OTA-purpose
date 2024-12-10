import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";


const CashSummaryReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
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
    {/* show ledger wise summary always true from meeting polosys */}
    {/* <ERPCheckbox
          {...getFieldProps("showLedgerwiseSummary")}
          label={t("show_ledgerwise_summary")}
          onChangeData={(data) => handleFieldChange('showLedgerwiseSummary', data.showLedgerwiseSummary)}
        /> */}
  </div>

);
}
export default CashSummaryReportFilter;
export const CashSummaryReportFilterInitialState = {
  fromDate: new Date(), 
  toDate: new Date(),
  showLedgerwiseSummary:true
};