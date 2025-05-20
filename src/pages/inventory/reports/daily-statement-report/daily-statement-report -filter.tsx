import { useTranslation } from "react-i18next"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"

// Updated interface to match C# properties
// interface ReportFilterProps {
//   getFieldProps: (field: string) => any
//   handleFieldChange: (field: string | object, value?: any) => void
// }

const DailyStatementReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport")

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
        /* <ERPDataCombobox
          {...getFieldProps("bankLedgerID")}
          label={t("bank_ledger")}
          field={{
            id: "bankLedgerID",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerType=${LedgerType.BankAccount}`,
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) => handleFieldChange({ bankLedgerID: data.value, BankLedgerName: data.label })}
        /> */
      }
    </div>
  )
}

export default DailyStatementReportFilter

// Updated initial state to match C# property names
export const DailyStatementReportInitialState = {
  // fromDate: moment().local().subtract(45, "days").toDate(),
  fromDate: new Date(),
  toDate: new Date(), // Default empty string
  // bankLedgerID: 0,
}

