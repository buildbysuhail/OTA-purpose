import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";


const TrialBalanceReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <ERPDataCombobox
        {...getFieldProps("accGroupID")}
        label={t("a/c_group_balance")}
        field={{
          id: "accGroupID",
          getListUrl: Urls.data_acc_groups,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange('accGroupID', data.accGroupID)}
      />
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("asonDate")}
          label={t("as_on_date")}
          onChangeData={(data: any) => handleFieldChange("asonDate", data.asonDate)}
          autoFocus={true}
        />
        {/* <ERPDateInput
        {...getFieldProps("toDate")}
        label={t("To")}
        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
      /> */}
      </div>
      <ERPDataCombobox
        {...getFieldProps("costCentreID")}
        label={t("cost_centre")}
        field={{
          id: "costCentreID",
          getListUrl: Urls.data_costcentres,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange('costCentreID', data.costCentreID)}
      />
      {/* <ERPCheckbox
      {...getFieldProps("isPeriodWise")}
      label={t("Period_wise")}
      onChangeData={(data) => handleFieldChange('isPeriodWise', data.isPeriodWise)}
    /> */}
    </div>
  );
}
export default TrialBalanceReportFilter;
export const TrialBalanceReportFilterInitialState = {
  accGroupID: -1,
  toDate: new Date(),
  asonDate: new Date(),
  costCentreID: 0,
  isPeriodWise: false,
};