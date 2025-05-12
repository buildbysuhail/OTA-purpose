"use client"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { useState, useEffect } from "react"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"
import { useSelector } from "react-redux"
import { RootState } from "../../../../redux/store"
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls"


const SalesTransferMonthWiseSummaryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport")
  const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  const clientSession = useSelector((state: RootState) => state.ClientSession);

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
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
      {
        applicationSettings.mainSettings?.allowSalesRouteArea == true && (
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
                      routeName: data.label,
                  });
              }}
          />
          )
      },
      <ERPDataCombobox
          label={t("sales_man")}
          {...getFieldProps("salesmanID")}
          field={{
              id: "salesmanID",
              getListUrl: Urls.data_employees,
              valueKey: "id",
              labelKey: "name",
          }}
          onSelectItem={(data) => {
              handleFieldChange({
                  salesmanID: data.value,
                  salesMan: data.label,
              });
          }}
      />
      {
        applicationSettings.accountsSettings?.allowSalesCounter == true && (
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
                    handleFieldChange({
                        counterID: data.value,
                        counterName: data.label,
                    });
                }}
            />
        )
      },
      <ERPDataCombobox
          label={t("voucher_form")}
          {...getFieldProps("voucherForm")}
          field={{
              id: "voucherForm",
              getListUrl: clientSession.isAppGlobal ? Urls.data_FormTypeByPI : Urls.data_form_type,
              valueKey: "id",
              labelKey: "name",
          }}
          onSelectItem={(data) => {
              handleFieldChange({
                  voucherForm: data.value,
              });
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
              handleFieldChange({
                  warehouseID: data.value,
              });
          }}
      />
    </div>
  )
}

export default SalesTransferMonthWiseSummaryReportFilter
export const SalesTransferMonthWiseSummaryReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: new Date(),
  salesRouteID:0,
  counterID:0,
  salesManID:0,
  voucherForm:"",
  wareHouseID:0
}