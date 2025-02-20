
import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

const CashBookReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport');

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center gap-4">
        <ERPDateInput
          label={t("as_on_date")}
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