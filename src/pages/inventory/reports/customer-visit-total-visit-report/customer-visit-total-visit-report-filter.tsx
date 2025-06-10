import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from "moment";
import Urls from "../../../../redux/urls";

const CustomerVisitTotalVisitFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport');

  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDate")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
          />
        </div>
        <div className="col-span-1">
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("toDate")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("main_route")}
            {...getFieldProps("salesRouteID")}
            field={{
              id: "salesRouteID",
              getListUrl: Urls.data_mainsalesroute, 
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange({
            salesRouteID: data.value,
            salesRoute: data.label,
          })
            }}
          />
        </div>

        {/* <div className="col-span-1">
          <ERPDataCombobox
            label={t("sales_route")}
            {...getFieldProps("salesRoute")}
            field={{
              id: "salesRoute",
              getListUrl: Urls.data_salesRoute, 
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("salesRoute", data.value);
            }}
          />
        </div> */}
      </div>

      <div className="col-span-1">
        <ERPCheckbox
          id="zeroVisit"
          {...getFieldProps("zeroVisit")}
          label={t("zero_visit")}
          checked={formState.zeroVisit}
          onChange={(e) => handleFieldChange("zeroVisit", e.target.checked)}
        />
      </div>
    </div>
  );
};

export default CustomerVisitTotalVisitFilter;

export const CustomerVisitTotalVisitFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  // mainRoute: 0, 
  salesRouteID: 0, 
  zeroVisit: false,
};
