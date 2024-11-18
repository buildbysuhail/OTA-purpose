import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

const LedgerReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => (
  <div>
    <ERPDateInput
      {...getFieldProps("fromDate")}
      label={t("From Date")}
      onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
    />
    <ERPDateInput
      {...getFieldProps("toDate")}
      label={t("To Date")}
      onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
    />
  </div>
);
export default LedgerReportFilter;