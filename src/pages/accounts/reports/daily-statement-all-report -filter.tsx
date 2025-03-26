import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import Urls from "../../../redux/urls"
import { useTranslation } from "react-i18next"
import { LedgerType } from "../../../enums/ledger-types"
import moment from "moment"
import { useEffect, useState } from "react"
import ERPRadio from "../../../components/ERPComponents/erp-radio"

const DailyStatementAllReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport")

    // State for warehouse type radio buttons
    const [warehouseTypeRadio, setWarehouseTypeRadio] = useState({
      physical: false,
      van: false,
    })
  
    // Update the WarehouseType value when radio selection changes
    useEffect(() => {
      if (warehouseTypeRadio.physical || warehouseTypeRadio.van) {
        const warehouseType = warehouseTypeRadio.physical ? "Physical" : "Van";
        handleFieldChange("WarehouseType", warehouseType);
      }
    }, [warehouseTypeRadio, handleFieldChange]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("fromDate ")}
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromDate ", data.fromDate )}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate ")}
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate ", data.toDate )}
        />
      </div>
    </div>
  )
}

export default DailyStatementAllReportFilter

// Updated initial state to match C# property names
export const DailyStatementAllReportInitialState = {
  fromDate : moment().local().subtract(30, "days").toDate(),
  toDate : new Date(),
}