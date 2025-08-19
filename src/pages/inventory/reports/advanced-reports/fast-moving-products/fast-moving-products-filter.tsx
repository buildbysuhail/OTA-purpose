import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const FastMovingReportFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  const userSession = useSelector(
    (state: RootState) => state.UserSession
  );
  const fromDate = getFieldProps("fromDate").value;
  const toDate = getFieldProps("toDate").value;

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

    {/* Purchase Period Group */}
    <div className="relative border border-gray-300 dark:border-gray-700 rounded-xl p-4 pt-6 bg-gradient-to-b from-white to-gray-50 dark:from-dark-bg dark:to-dark-bg-card shadow-sm transition-shadow">
      <h5 className="absolute -top-3 left-4 bg-white dark:bg-dark-bg px-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        {t("purchase_period")}
      </h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <ERPDateInput
          label={t("from_date")}
          {...getFieldProps("fromDate")}
          className="w-full"
          onChangeData={(data: any) =>
            handleFieldChange("fromDate", data.fromDate)
          }
        />
        <ERPDateInput
          label={t("to_date")}
          {...getFieldProps("toDate")}
          className="w-full"
          onChangeData={(data: any) =>
            handleFieldChange("toDate", data.toDate)
          }
        />
      </div>

      {/* Selected Range */}
      {fromDate && toDate && (
        <div className="mt-4 p-3 bg-white dark:bg-dark-bg-card rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-slate-600 dark:text-gray-300">
            {t("selected_range")}:{" "}
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              {Math.ceil(
                (new Date(toDate).getTime() - new Date(fromDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              {t("days")}
            </span>
          </p>
        </div>
      )}
    </div>

    {/* Sales Route Group */}
    {userSession.currentBranchId > 0 && (
      <div className="relative border border-gray-300 dark:border-gray-700 rounded-xl p-4 pt-6 bg-gradient-to-b from-white to-gray-50 dark:from-dark-bg dark:to-dark-bg-card shadow-sm transition-shadow">
        <h5 className="absolute -top-3 left-4 bg-white dark:bg-dark-bg px-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          {t("sales_route")}
        </h5>
        <ERPDataCombobox
          label={t("sales_route")}
          {...getFieldProps("routeID")}
          field={{
            id: "routeID",
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              routeID: data.value,
              route: data.label,
            });
          }}
        />
      </div>
    )}

  </div>

  );
};

export default FastMovingReportFilter;

export const FastMovingReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  routeID: -1,
};
