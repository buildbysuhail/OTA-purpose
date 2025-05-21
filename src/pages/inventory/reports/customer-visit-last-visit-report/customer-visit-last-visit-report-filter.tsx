import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../redux/urls";

const CustomerVisitLastVisitFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport');

  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-1 items-end gap-4">
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("sales_route")}
            {...getFieldProps("salesRouteID")}
            field={{
              id: "salesRouteID",
              getListUrl: Urls.data_salesRoute,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("salesRouteID", data.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerVisitLastVisitFilter;

export const CustomerVisitLastVisitFilterInitialState = {
  fromDate: moment().subtract(3, 'months').startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  salesRouteID: 0,
};
