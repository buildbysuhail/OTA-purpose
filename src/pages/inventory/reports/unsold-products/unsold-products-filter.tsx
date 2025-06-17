import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const UnsoldProductReportFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  const userSession = useSelector((state: RootState) => state.UserSession);

  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <h4>Purchase Period</h4>
        <div className="col-span-1">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDate")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("fromDate", data.fromDate)
            }
          />
        </div>
        <div className="col-span-1">
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("toDate")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("toDate", data.toDate)
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <h4>Sales Period</h4>
        <div className="col-span-1">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDateSales")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("fromDateSales", data.fromDateSales)
            }
          />
        </div>
        <div className="col-span-1">
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("toDateSales")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("toDateSales", data.toDateSales)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
        {userSession.currentBranchId > 0 && (
          <div className="col-span-1">
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
