import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { useTranslation } from "react-i18next";
import moment from "moment";

const DailyStatementPurchaseReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
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
    </div>
  );
}
export default DailyStatementPurchaseReportFilter;
export const DailyStatementPurchaseReportFilterInitialState = {
  // fromDate:moment().local().subtract(30, "days").toDate(),
  fromDate:new Date(),
  // dateFrom: new Date(),
  toDate:new Date(),
};