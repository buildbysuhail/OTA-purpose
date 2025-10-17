import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../../redux/urls";

const DiscountReportInventoryFilter = ({ getFieldProps, handleFieldChange, formState, }: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("transaction_type")}
            {...getFieldProps("voucherType")}
            options={[
              { value: "SI", label: "Sales Invoice" },
              { value: "SR", label: "Sales Return" },
              { value: "PI", label: "Purchase Invoice" },
              { value: "PR", label: "Purchase Return" },
              { value: "SO", label: "Sales Order" },
              { value: "SQ", label: "Sales Quotation" },
              { value: "SUB", label: "Substitute" },
              { value: "PO", label: "Purchase Order" },
              { value: "OS", label: "Opening Stock" },
            ]}
            field={{
              id: "voucherType",
              valueKey: "value",
              labelKey: "label",
            }}
            onSelectItem={(data) => {
              handleFieldChange("voucherType", data.value);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
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
              handleFieldChange({
                salesRouteID: data.value,
                salesRoute: data.label,
              });
            }}
          />
        </div>
        {/* always visible false  */}
        {/* <div className="col-span-1">
          <ERPDataCombobox
            label={t("salesman")}
            {...getFieldProps("partyID")}
            field={{
              id: "partyID",
              getListUrl: Urls.data_employees,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("partyID", data.value);
            }}
          />
        </div>

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
              handleFieldChange("counterID", data.value);
            }}
          />
        </div>

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("brand")}
            {...getFieldProps("brandID")}
            field={{
              id: "brandID",
              getListUrl: Urls.data_brands,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("brandID", data.value);
            }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default DiscountReportInventoryFilter;
export const DiscountReportInventoryFilterInitialState = {
  voucherType: "",
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  salesRouteID: 0,
  // partyID: 0,
  // counterID: 0,
  // brandID: 0,
};
