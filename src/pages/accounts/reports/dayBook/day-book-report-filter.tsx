
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";


const DayBookReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport');
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("from")}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          label={t("to")}
          onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
        />
      </div>
      {/* Cost Centre Section */}
      <ERPDataCombobox
        {...getFieldProps("costCenterID")}
        label={t("cost_centre")}
        field={{
          id: "costCenterID",
          getListUrl: Urls.data_costcentres,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => handleFieldChange({costCenterID: data.value,CostCenterName:data.label})}
      />
    </div>
  );
}
export default DayBookReportFilter;
export const DayBookReportFilterInitialState = {
  dateFrom: new Date(),
  dateTo: new Date(),
  costCenterID: 0,
};