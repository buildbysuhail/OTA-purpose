import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import { useTranslation } from "react-i18next";
import { LedgerType } from "../../../enums/ledger-types";
import moment from "moment";

const BankStatementReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
        />
      </div>
      <ERPDataCombobox
        {...getFieldProps("bankLedgerID")}
        label={t("bank_ledger")}
        field={{
          id: "bankLedgerID",
          getListUrl: Urls.data_acc_ledgers,
          params: `ledgerID=0&ledgerType=${LedgerType.BankAccount}`,
          // getListUrl: Urls.data_acc_ledgers,
          // params: `ledgerID = 0 & ledgerType=${LedgerType.BankAccount}`,
          valueKey: "id",
          labelKey: "name",
        }}
        // onChangeData={(data) => handleFieldChange('bankLedgerID', data.bankLedgerID)}
        onSelectItem={(data) => handleFieldChange({bankLedgerID: data.value,BankLedgerName:data.label})}
      />

    </div>
  );
}
export default BankStatementReportFilter;
export const BankStatementReportFilterInitialState = {
   dateFrom: moment().local().subtract(30, "days").toDate(),
  // dateFrom: new Date(),
  dateTo: new Date(),
  bankLedgerID: 0,
};