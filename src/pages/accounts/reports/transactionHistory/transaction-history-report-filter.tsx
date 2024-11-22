
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from 'moment';


const TransactrionHistoryReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
  <div className="grid grid-cols-1 gap-4">
     <div className="grid grid-cols-1 gap-4">
        {/* Modified Date Range */}
        <div className="flex gap-4">
          <ERPDateInput
            {...getFieldProps("dateFrom")}
            label={t("Modified Date From")}
            onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          />
          <ERPDateInput
            {...getFieldProps("dateTo")}
            label={t("Modified Date To")}
            onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>

        {/* Transaction Date Range */}
        <div className="flex gap-4">
          <ERPDateInput
            {...getFieldProps("transDateFrom")}
            label={t("Transaction Date From")}
            onChangeData={(data: any) => handleFieldChange("transDateFrom", data.transDateFrom)}
          />
          <ERPDateInput
            {...getFieldProps("transDateTo")}
            label={t("Transaction Date To")}
            onChangeData={(data: any) => handleFieldChange("transDateTo", data.transDateTo)}
          />
        </div>

        {/* Edited and Deleted Checkboxes */}
        <div className="flex items-center gap-2">
          <ERPCheckbox
            {...getFieldProps("isEdited")}
            label={t("Edited")}
            onChangeData={(data) => handleFieldChange("isEdited", data.isEdited)}
          />
          <ERPCheckbox
            {...getFieldProps("deleted")}
            label={t("Deleted")}
            onChangeData={(data) => handleFieldChange("deleted", data.deleted)}
          />
        </div>
      </div>
   </div>

);
}
export default TransactrionHistoryReportFilter;
export const TransactrionHistoryReportFilterInitialState = {
  dateFrom:  moment().subtract(10, 'days').toDate(), 
  dateTo: new Date(),
  transDateFrom: moment().subtract(90, 'days').toDate(),  
  transDateTo: new Date(), 
  isEdited :true, 
  deleted:false, 
};