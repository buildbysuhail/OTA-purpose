import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../redux/urls";

const SalesSummaryFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
        <ERPDateInput
          label={t("from_date")}
          {...getFieldProps("fromDate")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        />
        <ERPDateInput
          label={t("to_date")}
          {...getFieldProps("toDate")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>
      
      <ERPDataCombobox
        label={t("voucher_type")}
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
      
      <ERPDataCombobox
        label={t("voucher_form")}
        {...getFieldProps("voucherForm")}
        field={{
          id: "voucherForm",
          // getListUrl: Urls.data_voucher_forms,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => {
          handleFieldChange("voucherForm", data.value);
        }}
      />
      
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
      
      <ERPDataCombobox
        label={t("salesman")}
        {...getFieldProps("salesmanID")}
        field={{
          id: "salesmanID",
          getListUrl: Urls.data_users,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => {
          handleFieldChange("salesmanID", data.value);
        }}
      />
      
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
      
      <ERPDataCombobox
        label={t("party")}
        {...getFieldProps("partyID")}
        field={{
          id: "partyID",
          getListUrl: Urls.data_parties,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => {
          handleFieldChange("partyID", data.value);
        }}
      />
      
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
      
      <ERPDataCombobox
        label={t("party_category")}
        {...getFieldProps("partyCategoryID")}
        field={{
          id: "partyCategoryID",
          getListUrl: Urls.data_party_categories,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => {
          handleFieldChange("partyCategoryID", data.value);
        }}
      />
      
      <ERPDataCombobox
        label={t("is_time_based")}
        {...getFieldProps("isTimeBased")}
        field={{
          id: "isTimeBased",
          // getListUrl: Urls.data_boolean_options,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => {
          handleFieldChange("isTimeBased", data.value);
        }}
      />
      
      {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
        <ERPTimeInput
          label={t("from_time")}
          {...getFieldProps("fromTime")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromTime", data.fromTime)}
        />
        <ERPTimeInput
          label={t("to_time")}
          {...getFieldProps("toTime")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toTime", data.toTime)}
        />
      </div> */}
    </div>
  );
}

export default SalesSummaryFilter;
export const SalesSummaryFilterInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  voucherType: "",
  voucherForm: "",
  salesRouteID: 0,
  counterID: 0,
  salesmanID: 0,
  productID: 0,
  partyID: 0,
  warehouseID: 0,
  partyCategoryID: 0,
  isTimeBased: 0,
  fromTime: "",
  toTime: "",
};