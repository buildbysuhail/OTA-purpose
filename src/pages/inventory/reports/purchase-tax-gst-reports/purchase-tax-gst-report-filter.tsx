import { useTranslation } from "react-i18next"
import moment from "moment"
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox"
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"
import Urls from "../../../../redux/urls"
import ERPInput from "../../../../components/ERPComponents/erp-input"

const PurchaseGstReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation("accountsReport")
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Report Type Options - First Row */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("dailySummary")}
          label={t("Daily Summary")}
          onChangeData={(data) => handleFieldChange("dailySummary", data.dailySummary)}
        />
        <ERPCheckbox
          {...getFieldProps("salesAndReturn")}
          label={t("Sales And Sales Return")}
          onChangeData={(data) => handleFieldChange("salesAndReturn", data.salesAndReturn)}
        />
        <ERPCheckbox
          {...getFieldProps("taxWise")}
          label={t("Tax Wise")}
          onChangeData={(data) => handleFieldChange("taxWise", data.taxWise)}
        />
      </div>

      {/* Report Type Options - Second Row */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("taxWiseHSN")}
          label={t("Tax Wise HSN")}
          onChangeData={(data) => handleFieldChange("taxWiseHSN", data.taxWiseHSN)}
        />
        <ERPCheckbox
          {...getFieldProps("monthlySummary")}
          label={t("Monthly Summary")}
          onChangeData={(data) => handleFieldChange("monthlySummary", data.monthlySummary)}
        />
        <ERPCheckbox
          {...getFieldProps("detailed")}
          label={t("Detailed")}
          onChangeData={(data) => handleFieldChange("detailed", data.detailed)}
        />
      </div>

      {/* Report Format Options */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("registerFormat")}
          label={t("Register Format")}
          onChangeData={(data) => handleFieldChange("registerFormat", data.registerFormat)}
        />
        <ERPCheckbox
          {...getFieldProps("advRegisterFormat")}
          label={t("Adv Register Format")}
          onChangeData={(data) => handleFieldChange("advRegisterFormat", data.advRegisterFormat)}
        />
      </div>

      {/* Date Options */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("transDate")}
          label={t("Transaction Date")}
          onChangeData={(data) => handleFieldChange("transDate", data.transDate)}
        />
        <ERPCheckbox
          {...getFieldProps("RefDate")}
          label={t("Reference Date")}
          onChangeData={(data) => handleFieldChange("RefDate", data.RefDate)}
        />
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-4">
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

      {/* GST Percentage */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("gstPerc")}
          label={t("GST Perc")}
          onChangeData={(data) => handleFieldChange("gstPerc", data.gstPerc)}
        />
        <ERPInput
          {...getFieldProps("gstPercValue")}
          className="w-32"
          onChangeData={(val: string) => handleFieldChange("gstPercValue", val)}
        />
      </div>

      {/* GST Category */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("gstCategory")}
          label={t("GST Category")}
          onChangeData={(data) => handleFieldChange("gstCategory", data.gstCategory)}
        />
        <ERPDataCombobox
          {...getFieldProps("taxCategoryID")}
          field={{
            id: "taxCategoryID",
            getListUrl: Urls.data_taxCategory,
            valueKey: "id",
            labelKey: "name",
          }}
          className="w-full"
          onSelectItem={(data) => handleFieldChange("taxCategoryID", data.value)}
        />
      </div>

      {/* Form Type */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("voucherForm")}
          label={t("Voucher Form")}
          onChangeData={(data) => handleFieldChange("voucherForm", data.voucherForm)}
        />
        <ERPDataCombobox
          {...getFieldProps("formType")}
          field={{
            id: "formType",
            getListUrl: Urls.data_form_type,
            valueKey: "id",
            labelKey: "name",
          }}
          className="w-full"
          onSelectItem={(data) => handleFieldChange("formType", data.value)}
        />
      </div>

      {/* Exclude NA */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("excludeNA")}
          label={t("Exclude NA")}
          onChangeData={(data) => handleFieldChange("excludeNA", data.excludeNA)}
        />
      </div>

      {/* Report Format Selection */}
      <div className="flex items-center gap-4 mt-2">
        <ERPCheckbox
          {...getFieldProps("classicReport")}
          label={t("Classic Report")}
          onChangeData={(data) => handleFieldChange("classicReport", data.classicReport)}
        />
        <ERPCheckbox
          {...getFieldProps("standardReport")}
          label={t("Standard Report")}
          onChangeData={(data) => handleFieldChange("standardReport", data.standardReport)}
        />
      </div>
    </div>
  )
}

export default PurchaseGstReportFilter

export const PurchaseGstReportFilterInitialState = {
  dailySummary: 0,
  salesAndReturn: 0,
  taxWise: 0,
  taxWiseHSN: 0,
  monthlySummary: 0,
  detailed: 0,
  registerFormat: 0,
  advRegisterFormat: 0,
  transDate: 0,
  RefDate: 0,
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  gstPercValue: "0.00",
  gstPerc: 0,
  gstCategory: 0,
  taxCategoryID: 0,
  voucherForm: 0,
  formType: 0,
  excludeNA: 0,
  classicReport: 1,
  standardReport: 0,
}
