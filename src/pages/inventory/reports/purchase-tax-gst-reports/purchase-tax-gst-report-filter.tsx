import { useTranslation } from "react-i18next"
import moment from "moment"
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox"
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"
import Urls from "../../../../redux/urls"
import ERPInput from "../../../../components/ERPComponents/erp-input"

const PurchaseGstReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation("inventory")
  return (
    <div className="grid grid-cols-1 gap-4">
          {/* Report Type Options - First Row
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
      </div> */}

      {/* Report Type Options - Second Row
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
      </div> */}

      {/* Report Format Options
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
      </div> */}
      {/* Date Options */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("isTransactionDate")}
          label={t("Transaction Date")}
          datatype="number"
          onChangeData={(data) => handleFieldChange("isTransactionDate", data.isTransactionDate)}
        />
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          label={t("from_date")}
          {...getFieldProps("fromDate")}
          className="w-full"
          datatype="date"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        />
        <ERPDateInput
          label={t("to_date")}
          {...getFieldProps("toDate")}
          className="w-full"
          datatype="date"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>

      {/* GST Percentage */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("isGstPerc")}
          label={t("GST Perc")}
          onChangeData={(data) => handleFieldChange("isGstPerc", data.isGstPerc)}
        />
        <ERPInput
          {...getFieldProps("gSTPerc")}
          className="w-32"
          datatype="number"
          onChangeData={(val: string) => handleFieldChange("gSTPerc", val)}
        />
      </div>

      {/* GST Category */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("isGstCategory")}
          label={t("GST Category")}
          onChangeData={(data) => handleFieldChange("isGstCategory", data.isGstCategory)}
        />
        <ERPDataCombobox
          {...getFieldProps("taxCategory")}
          field={{
            id: "taxCategoryID",
            getListUrl: Urls.data_taxCategory,
            valueKey: "id",
            labelKey: "name",
          }}
          className="w-full"
          onSelectItem={(data) => {
            handleFieldChange({
              taxCategory: data.value,
              taxCategoryName: data.label
          });
        }}
        />
      </div>

      {/* Form Type */}
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("isFormType")}
          label={t("Voucher Form")}
          onChangeData={(data) => handleFieldChange("isFormType", data.isFormType)}
        />
        <ERPDataCombobox
          {...getFieldProps("voucherForm")}
          field={{
            id: "formType",
            getListUrl: Urls.data_form_type,
            valueKey: "id",
            labelKey: "name",
          }}
          className="w-full"
          onSelectItem={(data) => {
            handleFieldChange({
              voucherFormId: data.value,
              voucherForm: data.label
          });
        }}
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

      {/* Report Format Selection
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
      </div> */}

    </div>
  )
}

export default PurchaseGstReportFilter

export const PurchaseGstReportFilterInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  gSTPerc: "0.00",
  voucherType:"",
  voucherForm:"",
  isTransactionDate: 0,
  taxCategory: 0,
  excludeNA: 0,
  rdbCash:0,
  rdbBank:0,
  refDate: 0,
  gstCategory: 0,
  formType: 0,
  taxWiseHSN: 0,

  // dailySummary: 0,
  // salesAndReturn: 0,
  // taxWise: 0,
  // monthlySummary: 0,
  // detailed: 0,
  // registerFormat: 0,
  // advRegisterFormat: 0,

}
