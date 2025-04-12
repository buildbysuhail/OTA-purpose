"use client"
import { useTranslation } from "react-i18next"
import moment from "moment"
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"
import Urls from "../../../../redux/urls"

const CreditPurchaseSummaryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("inventory")
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <ERPDateInput
          {...getFieldProps("fromDate")}
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ERPDataCombobox
          {...getFieldProps("salesRouteID")}
          label={t("sales_route")}
          field={{
            id: "salesRouteID",
            getListUrl: Urls.data_salesRoute,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ salesRouteID: data.value, SalesRouteName: data.label })}
        />

        <ERPDataCombobox
          {...getFieldProps("counterID")}
          label={t("counter")}
          field={{
            id: "counterID",
            getListUrl: Urls.data_counters,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ counterID: data.value, CounterName: data.label })}
        />

        <ERPDataCombobox
          {...getFieldProps("salemanID")}
          label={t("saleman")}
          field={{
            id: "salemanID",
            getListUrl: Urls.data_employees,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ salemanID: data.value, SalemanName: data.label })}
        />

        <ERPDataCombobox
          {...getFieldProps("productID")}
          label={t("product")}
          field={{
            id: "productID",
            getListUrl: Urls.data_products,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ productID: data.value, ProductName: data.label })}
        />

        <ERPDataCombobox
          {...getFieldProps("partyID")}
          label={t("party")}
          field={{
            id: "partyID",
            getListUrl: Urls.data_acc_ledgers,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ partyID: data.value, PartyName: data.label })}
        />

        <ERPDataCombobox
          {...getFieldProps("voucherForm")}
          label={t("voucher_form")}
          field={{
            id: "voucherForm",
            getListUrl: Urls.data_form_type,
            params: "",
            valueKey: "name",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ voucherForm: data.value, VoucherFormName: data.label })}
        />

        <ERPDataCombobox
          {...getFieldProps("warehouseID")}
          label={t("warehouse")}
          field={{
            id: "warehouseID",
            getListUrl: Urls.data_warehouse,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ warehouseID: data.value, WarehouseName: data.label })}
        />
      </div>
    </div>
  )
}

export default CreditPurchaseSummaryReportFilter

export const CreditPurchaseSummaryReportFilterInitialState = {
  fromDate: moment().local().subtract(30, "days").toDate(),
  toDate: new Date(),
  salesRouteID: 0,
  counterID: 0,
  salemanID: 0,
  productID: 0,
  partyID: 0,
  voucherForm: "",
  warehouseID: 0
}