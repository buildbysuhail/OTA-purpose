import ERPDateInput from "../../../components/ERPComponents/erp-date-input";


const CashSummaryReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
  <div className="grid grid-cols-1 gap-4">
    {/* Date Range Section */}
    <div className="flex items-center gap-4">
      <ERPDateInput
        {...getFieldProps("fromDate")}
        label={t("From")}
        onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        autoFocus={true}
      />
      <ERPDateInput
        {...getFieldProps("toDate")}
        label={t("To")}
        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
      />
    </div>


    {/* Cost Centre Section
    //show ledger wise summary always true from meeting polosys
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
    /> */}

  </div>

);
}
export default CashSummaryReportFilter;
export const CashSummaryReportFilterInitialState = {
  fromDate: new Date(), 
  toDate: new Date(),
};