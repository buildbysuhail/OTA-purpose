import { useTranslation } from "react-i18next"
import moment from "moment"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"

const PurchaseTaxReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport")

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
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
  )
}

export default PurchaseTaxReportFilter
export const PurchaseTaxReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: new Date(), 
}

