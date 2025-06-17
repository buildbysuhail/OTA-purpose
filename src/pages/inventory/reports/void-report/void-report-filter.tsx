import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const VoidReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')
    const applicationSettings = useSelector(
      (state: RootState) => state.ApplicationSettings
    );
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-1 sm:col-span-1 md:col-span-1">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDate")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 md:col-span-1">
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("toDate")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-end gap-4">
           {applicationSettings.accountsSettings?.allowSalesCounter == true && (
     
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("counter")}
            {...getFieldProps("counterID")}
            field={{
              id: "counterID",
              getListUrl: Urls.data_counters,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
             handleFieldChange({
              counterID: data.value,
              counter: data.label,
            });
            }}
          />
        </div>
           )}
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("user")}
            {...getFieldProps("userID")}
            field={{
              id: "userID",
              getListUrl: Urls.data_users,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
            handleFieldChange({
              userID: data.value,
              user: data.label,
            });
            }}
          />
        </div>

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("status")}
            {...getFieldProps("status")}
                options={[
          { value: "All", label: "All" },
          { value: "Void", label: "Void" },
          { value: "Cancel", label: "Cancel" },
        ]}
            field={{
              id: "status",
              valueKey: "value",
              labelKey: "label",
            }}
            onSelectItem={(data) => {
              handleFieldChange("status", data.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default VoidReportFilter;

export const VoidReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  counterID: -1,
  userID: -1,
  status: "All",
};