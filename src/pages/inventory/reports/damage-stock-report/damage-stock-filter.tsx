import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import moment from "moment";

const DamageStockFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Fields */}
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

      {/* Main Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            label={t("product_group")}
            {...getFieldProps("productGpID")}
            field={{
              id: "productGpID",
              getListUrl: Urls.productGroup,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("productGpID", data.value);
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
            label={t("from_warehouse")}
            {...getFieldProps("fromWarehouse")}
            field={{
              id: "fromWarehouse",
              getListUrl: Urls.data_warehouse,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("fromWarehouse", data.value);
            }}
          />
        </div>

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("to_warehouse")}
            {...getFieldProps("toWarehouse")}
            field={{
              id: "toWarehouse",
              getListUrl: Urls.data_warehouse,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("toWarehouse", data.value);
            }}
          />
        </div>

        <div className="col-span-1">
          <ERPInput
            label={t("voucher_number")}
            {...getFieldProps("voucherNumber")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("voucherNumber", data.voucherNumber)}
          />
        </div>

        <div className="col-span-1">
          <ERPInput
            label={t("vehicle")}
            {...getFieldProps("vehicleID")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("vehicleID", data.vehicleID)}
          />
        </div>

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("employee")}
            {...getFieldProps("employeeID")}
            field={{
              id: "employeeID",
              getListUrl: Urls.data_employees,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("employeeID", data.value);
            }}
          />
        </div>
        <div className="flex items-center space-x-4">
          <ERPRadio
            id="summary"
            name="reportType"
            value="summary"
            label={t("summary")}
            checked={formState.reportType === "summary"}
            onChange={(e) => handleFieldChange("reportType", e.target.value)}
          />
          <ERPRadio
            id="details"
            name="reportType"
            value="details"
            label={t("details")}
            checked={formState.reportType === "details"}
            onChange={(e) => handleFieldChange("reportType", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
export default DamageStockFilter;
export const DamageStockFilterInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  fromWarehouse: 0,
  toWarehouse: 0,
  productID: 0,
  productGpID: 0,
  brandID: 0,

  voucherNumber: "",  // newly added
  vehicleID: "",     // newly added
  employeeID: 0,    // newly added
  reportType: "",  // newly added
};