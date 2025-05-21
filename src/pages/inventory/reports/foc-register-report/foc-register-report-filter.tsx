import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../redux/urls";

const FOCRegisterReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
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
            label={t("product_group")}
            {...getFieldProps("productGroupID")}
            field={{
              id: "productGroupID",
              getListUrl: Urls.data_productgroup,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("productGroupID", data.value);
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
        </div>

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("product")}
            {...getFieldProps("productID")}
            field={{
              id: "productID",
              getListUrl: Urls.data_products,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("productID", data.value);
            }}
          />
        </div>

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("salesman")}
            {...getFieldProps("salesmanID")}
            field={{
              id: "salesmanID",
              getListUrl: Urls.data_employees,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("salesmanID", data.value);
            }}
          />
        </div>
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

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("warehouse")}
            {...getFieldProps("warehouseID")}
            field={{
              id: "warehouseID",
              getListUrl: Urls.data_warehouse,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("warehouseID", data.value);
            }}
          />
        </div>

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("transaction_type")}
            {...getFieldProps("voucherType")}
            field={{
              id: "voucherType",
              getListUrl: Urls.data_vouchertype,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("voucherType", data.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FOCRegisterReportFilter;

export const FOCRegisterReportFilterInitialState = {
  fromDate: moment().subtract(3, 'months').startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  productGroupID: 0,
  brandID: 0,
  productID: 0,
  salesRouteID: 0,
  salesmanID: 0,
  warehouseID: 0,
  voucherType: "",
};
