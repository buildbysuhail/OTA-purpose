
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

const TrialBalancePeriodwiseReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
    const userSession = useSelector(
      (state: RootState) => state.UserSession
    );
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("asonDate")}
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("asonDate", data.asonDate)}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>
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
         <ERPCheckbox
          {...getFieldProps("showGroupSummaryOnly")}
          label={t("show_group_summary")}
          onChangeData={(data) =>
            handleFieldChange("showGroupSummaryOnly", data.showGroupSummaryOnly)
          }
        />
      {userSession.countryId==Countries.India &&
      <ERPCheckbox
      {...getFieldProps("isExcludeZeroBalance")}
      label={t("excludeZeroBalance")}
      onChangeData={(data) => handleFieldChange('isExcludeZeroBalance', data.isExcludeZeroBalance)}
    />}
    </div>
  );
}
export default TrialBalancePeriodwiseReportFilter;
export const TrialBalancePeriodwiseReportFilterInitialState = {
  accGroupID: -1,
  toDate: new Date(),
  asonDate: new Date(),
  costCentreID: 0,
  isPeriodWise: true,
  isExcludeZeroBalance:false,
  showGroupSummaryOnly:false
};