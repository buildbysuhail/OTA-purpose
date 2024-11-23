
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";


const DayBookReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
  <div className="grid grid-cols-1 gap-4">
    {/* Date Range Section */}
    <div className="flex items-center gap-4">
      <ERPDateInput
        {...getFieldProps("dateFrom")}
        label={t("From")}
        onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
        autoFocus={true}
      />
      <ERPDateInput
        {...getFieldProps("dateTo")}
        label={t("To")}
        onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
      />
    </div>


    {/* Cost Centre Section */}
    <ERPDataCombobox
      {...getFieldProps("costCenterID")}
      label={t("Cost Centre")}
      field={{
        id: "costCenterID",
        getListUrl: Urls.data_costcentres,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('costCenterID', data.costCenterID)}
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