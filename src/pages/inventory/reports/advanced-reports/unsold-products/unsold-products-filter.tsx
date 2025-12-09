import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const UnsoldProductReportFilter = ({  getFieldProps,  handleFieldChange,  formState,}: any) => {
  const { t } = useTranslation("accountsReport");
  const userSession = useSelector((state: RootState) => state.UserSession);
  const fromDate = getFieldProps("fromDate").value;
  const fromDateSales = getFieldProps("fromDateSales").value;
  const toDate = getFieldProps("toDate").value;
  const toDateSales = getFieldProps("toDateSales").value;

  return (
  <div className="grid grid-cols-1 gap-6">
    {/* Top Row: Purchase & Sales Period */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Purchase Period */}
      <div className="relative border border-gray-300 dark:border-gray-700 rounded-xl p-4 pt-6 bg-white dark:bg-dark-bg shadow-sm transition-shadow">
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

      {/* Sales Period */}
      <div className="relative border border-gray-300 dark:border-gray-700 rounded-xl p-4 pt-6 bg-white dark:bg-dark-bg shadow-sm transition-shadow">
        <h5 className="absolute -top-3 left-4 bg-white dark:bg-dark-bg px-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          {t("sales_period")}
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDateSales")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("fromDateSales", data.fromDateSales)
            }
          />
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("toDateSales")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("toDateSales", data.toDateSales)
            }
          />
        </div>
        {fromDateSales && toDateSales && (
          <div className="mt-4 p-3 bg-white dark:bg-dark-bg-card rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-slate-600 dark:text-gray-300">
              {t("selected_range")}:{" "}
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                {Math.ceil(
                  (new Date(toDateSales).getTime() - new Date(fromDateSales).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                {t("days")}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Bottom Row: Sales Route */}
    {userSession.currentBranchId > 0 && (
      <div className="relative border border-gray-300 dark:border-gray-700 rounded-xl p-4 pt-6 bg-white dark:bg-dark-bg shadow-sm transition-shadow">
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

export default UnsoldProductReportFilter;

export const UnsoldProductReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  fromDateSales: moment().local().toDate(),
  toDate: moment().local().toDate(),
  toDateSales: moment().local().toDate(),
  routeID: -1,
};
