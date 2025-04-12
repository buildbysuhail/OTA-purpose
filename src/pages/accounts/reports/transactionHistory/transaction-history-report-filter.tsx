
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from 'moment';
import { useTranslation } from "react-i18next";


const TransactrionHistoryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')

  return (
    <div className="flex flex-col gap-4">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
        {/* Modified Date Range */}
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("modified_date_from")}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          label={t("modified_date_to")}
          onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
        />

        <ERPDateInput
          {...getFieldProps("transDateFrom")}
          label={t("transaction_date_from")}
          onChangeData={(data: any) => handleFieldChange("transDateFrom", data.transDateFrom)}
        />
        <ERPDateInput
          {...getFieldProps("transDateTo")}
          label={t("transaction_date_to")}
          onChangeData={(data: any) => handleFieldChange("transDateTo", data.transDateTo)}
        />
      </div>

      {/* Edited and Deleted Checkboxes */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("isEdited")}
          label={t("edited")}
          onChangeData={(data) => handleFieldChange("isEdited", data.isEdited)}
        />
        <ERPCheckbox
          {...getFieldProps("deleted")}
          label={t("deleted")}
          onChangeData={(data) => handleFieldChange("deleted", data.deleted)}
        />
      </div>
    </div>

  );
}
export default TransactrionHistoryReportFilter;
export const TransactrionHistoryReportFilterInitialState = {
  dateFrom: moment().local().subtract(10, 'days').toDate(),
  dateTo: new Date(),
  transDateFrom: moment().local().subtract(90, 'days').toDate(),
  transDateTo: new Date(),
  isEdited: true,
  deleted: false,
};