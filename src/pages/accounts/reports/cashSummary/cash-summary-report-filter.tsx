import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

const CashSummaryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
      <ERPDateInput
        {...getFieldProps("fromDate")}
        label={t("from")}
        onChangeData={(data: any) =>
          handleFieldChange("fromDate", data.fromDate)
        }
        autoFocus={true}
      />
      <ERPDateInput
        {...getFieldProps("toDate")}
        label={t("to")}
        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
      />

      {/* show ledger wise summary always true from meeting polosys */}
      {/* <ERPCheckbox
          {...getFieldProps("showLedgerwiseSummary")}
          label={t("show_ledgerwise_summary")}
          onChangeData={(data) => handleFieldChange('showLedgerwiseSummary', data.showLedgerwiseSummary)}
        /> */}
    </div>
  );
};
export default CashSummaryReportFilter;
export const CashSummaryReportFilterInitialState = {
  fromDate: new Date(),
  toDate: new Date(),
};
