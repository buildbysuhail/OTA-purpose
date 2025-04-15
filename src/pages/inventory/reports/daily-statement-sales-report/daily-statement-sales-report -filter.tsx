import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

const DailySalesStatementReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
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
  );
}
export default DailySalesStatementReportFilter;
export const DailySalesStatementReportFilterInitialState = {
  // fromDate:moment().local().subtract(30, "days").toDate(),
  fromDate: new Date(),
  // dateFrom: new Date(),
  toDate: new Date(),
};