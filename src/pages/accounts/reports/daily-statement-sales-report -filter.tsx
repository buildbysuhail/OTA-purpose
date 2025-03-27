import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import { useTranslation } from "react-i18next";
import { LedgerType } from "../../../enums/ledger-types";
import moment from "moment";

const DailySalesStatementReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
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
export default DailySalesStatementReportFilter;
export const DailySalesStatementReportFilterInitialState = {
  fromDate:moment().local().subtract(30, "days").toDate(),
  // dateFrom: new Date(),
  toDate:new Date(),
};