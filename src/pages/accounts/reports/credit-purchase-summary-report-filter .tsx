"use client"

import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import ERPRadio from "../../../components/ERPComponents/erp-radio"
import Urls from "../../../redux/urls"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { useState, useEffect } from "react"

const CreditPurchaseSummaryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport")


  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
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
      <div className="grid grid-cols-3 gap-4">
      {/* Sales Route Selection */}
      <ERPDataCombobox
        {...getFieldProps("salesRouteID")}
        label={t("sales_route")}
        field={{
          id: "salesRouteID",
          getListUrl: Urls.data_salesRoute, // Assuming this URL exists
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ salesRouteID: data.value, SalesRouteName: data.label })}
      />

      {/* Counter Selection */}
      <ERPDataCombobox
        {...getFieldProps("counterID")}
        label={t("counter")}
        field={{
          id: "counterID",
          getListUrl: Urls.data_counters, // Assuming this URL exists
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ counterID: data.value, CounterName: data.label })}
      />

      {/* Saleman Selection */}
      <ERPDataCombobox
        {...getFieldProps("salemanID")}
        label={t("saleman")}
        field={{
          id: "salemanID",
          getListUrl: Urls.data_salesRoute, // Assuming this URL exists
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ salemanID: data.value, SalemanName: data.label })}
      />

      {/* Product Selection */}
      <ERPDataCombobox
        {...getFieldProps("productID")}
        label={t("product")}
        field={{
          id: "productID",
          getListUrl: Urls.data_products, // Assuming this URL exists
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ productID: data.value, ProductName: data.label })}
      />

      {/* Party Selection */}
      <ERPDataCombobox
        {...getFieldProps("partyID")}
        label={t("party")}
        field={{
          id: "partyID",
          getListUrl: Urls.data_parties,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ partyID: data.value, PartyName: data.label })}
      />

      {/* Voucher Form Input */}
      {/* Voucher Form Selection */}
      <ERPDataCombobox
            {...getFieldProps("voucherForm")}
            label={t("voucher_form")}
            field={{
              id: "voucherForm",
              getListUrl: Urls.data_vouchertype, // Assuming this URL exists
              params: "",
              valueKey: "id",
              labelKey: "name",
              nameKey: "alias",
            }}
            onSelectItem={(data) => handleFieldChange({ voucherForm: data.value, VoucherFormName: data.label })}
          />


      {/* Warehouse Selection */}
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

// Updated initial state to match C# property names
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

