import { useTranslation } from "react-i18next"
import moment from "moment"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"

// Updated interface to match C# properties
// interface ReportFilterProps {
//   getFieldProps: (field: string) => any
//   handleFieldChange: (field: string | object, value?: any) => void
// }

const DailyStatementAllReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport")

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("fromDate")} // Changed from dateFrom to FromDate
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)} // Updated field name
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate")} // Changed from dateTo to ToDate
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)} // Updated field name
        />
      </div>
      {/* <ERPDataCombobox
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
      /> */}
    </div>
  )
}

export default DailyStatementAllReportFilter

// Updated initial state to match C# property names
export const DailyStatementAllReportInitialState = {
  // fromDate: moment().local().subtract(45, "days").toDate(),
  fromDate: new Date(),
  toDate: new Date(), // Default empty string
  // bankLedgerID: 0,
}

