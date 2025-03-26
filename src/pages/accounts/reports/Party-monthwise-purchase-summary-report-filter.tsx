"use client"

import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import ERPRadio from "../../../components/ERPComponents/erp-radio"
import Urls from "../../../redux/urls"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { useState, useEffect } from "react"

const PartyMonthwisePurchaseSummaryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
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
    </div>
  )
}

export default PartyMonthwisePurchaseSummaryReportFilter

// Updated initial state to match C# property names
export const PartyMonthwisePurchaseSummaryReportFilterInitialState = {
  fromDate: moment().local().subtract(30, "days").toDate(),
  toDate: new Date(),
}

