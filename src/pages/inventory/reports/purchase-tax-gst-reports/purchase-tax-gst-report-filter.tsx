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
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="flex items-end gap-2">
        <ERPDateInput
          label={t("date_from")}
          {...getFieldProps("fromDate")}
          className="max-w-[150px]"
          datatype="date"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        />

        <ERPDateInput
          label={t("date_to")}
          {...getFieldProps("toDate")}
          className="max-w-[150px]"
          datatype="date"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />

        <ERPCheckbox
          {...getFieldProps("isTransactionDate")}
          label={t("Transaction Date")}
          datatype="number"
          className="w-full"
          onChangeData={(data) => handleFieldChange("isTransactionDate", data.isTransactionDate)}
        />
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 items-end gap-4">
        <ERPInput
          {...getFieldProps("gSTPerc")}
          className="w-32"
          placeholder="0.00"
          datatype="number"
          onChangeData={(data) => handleFieldChange("gSTPerc", data.gSTPerc)}
        />

        {/* <ERPDataCombobox
          {...getFieldProps("taxCategoryID")}
          field={{
            id: "taxCategoryID",
            getListUrl: Urls.data_taxCategory,
            valueKey: "id",
            labelKey: "name",
          }}
          className="w-full"
          onSelectItem={(data) => {
            handleFieldChange({
              taxCategoryID: data.value,
              taxCategory: (data.value)?.toString(),
            });
          }}
        /> */}

      <ERPDataCombobox
          {...getFieldProps("voucherFormId")}
          label="voucherForm"
          field={{
            id: "voucherFormId",
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

        <ERPCheckbox
          {...getFieldProps("excludeNA")}
          label={t("Exclude NA")}
          onChangeData={(data) => handleFieldChange("excludeNA", data.excludeNA)}
        />
      </div>
    </div>
  )
}

export default PurchaseGstReportFilter

export const PurchaseGstReportFilterInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  gSTPerc: null,
  isVchForm: false,
  voucherForm: "",
  isTransactionDate: false,
  taxCategory: "",
  excludeNA: 0,
  rdbCash: false,
  rdbBank: false,
}
