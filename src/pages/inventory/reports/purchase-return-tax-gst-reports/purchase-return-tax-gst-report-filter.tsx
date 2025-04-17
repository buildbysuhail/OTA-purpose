import { useTranslation } from "react-i18next"
import moment from "moment"
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox"
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"
import Urls from "../../../../redux/urls"
import ERPInput from "../../../../components/ERPComponents/erp-input"

const PurchaseReturnGstReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation("accountsReport")
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center gap-2">
        <ERPDateInput
          label={t("from_date")}
          {...getFieldProps("fromDate")}
          className="max-w-[150px]"
          datatype="date"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        />
        <ERPDateInput
          label={t("to_date")}
          {...getFieldProps("toDate")}
          className="max-w-[150px]"
          datatype="date"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
        <ERPCheckbox
          {...getFieldProps("isTransactionDate")}
          label={t("Transaction Date")}
          datatype="number"
          onChangeData={(data) => handleFieldChange("isTransactionDate", data.isTransactionDate)}
        />
      </div>

      <div className="grid grid-cols-4 items-end gap-4">
        <ERPInput
          {...getFieldProps("gSTPerc")}
          className="w-32"
          placeholder="0.00"
          datatype="number"
          onChangeData={(val: string) => handleFieldChange("gSTPerc", val)}
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
              taxCategory: data.label,
              taxCategoryName: data.label
            });
          }}
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

        <ERPCheckbox
          {...getFieldProps("excludeNA")}
          label={t("Exclude NA")}
          onChangeData={(data) => handleFieldChange("excludeNA", data.excludeNA)}
        />
      </div>
    </div>
  )
}

export default PurchaseReturnGstReportFilter

export const PurchaseReturnGstReportFilterInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  gSTPerc: null,
  voucherType: "",
  voucherForm: "",
  isTransactionDate: 0,
  taxCategory: "",
  excludeNA: 0,
  rdbCash: 0,
  rdbBank: 0,
  refDate: 0,
  gstCategory: 0,
  formType: 0,
  taxWiseHSN: 0,
}
