
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";


const DayBookReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport');
  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      {/* Date Range Section */}
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
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
        onSelectItem={(data) => handleFieldChange({ costCenterID: data.value, CostCenterName: data.label })}
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