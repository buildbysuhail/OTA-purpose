import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";


const DayBookSummaryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport');
  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      {/* Date Range Section */}
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <ERPDateInput
            {...getFieldProps("dateFrom")}
            label={t("from")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
            autoFocus={true}
          />
          <ERPDateInput
            {...getFieldProps("dateTo")}
            label={t("to")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>
      </div>
    </div>
  );
}
export default DayBookSummaryReportFilter;
export const DayBookSummaryReportFilterInitialState = {
  dateFrom: new Date(),
  dateTo: new Date(),
};