import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";
interface FormState {
  all: boolean;
  ledgerID: number;

}

const LedgerReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => (

  <div className="grid grid-cols-2 gap-4">
  {/* Date Range Section */}
  <div className="flex items-center gap-4">
    <ERPDateInput
      {...getFieldProps("fromDate")}
      label={t("From")}
      onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
    />
    <ERPDateInput
      {...getFieldProps("toDate")}
      label={t("To")}
      onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
    />
  </div>

  {/* All Checkbox */}
  <ERPCheckbox
    {...getFieldProps("all")}
    label={t("All")}
    onChangeData={(data) => handleFieldChange("all", data.all)}
  />

  {/* Ledger Code Section */}
  <ERPDataCombobox
    {...getFieldProps("ledgerCode")}
    label={t("Ledger Code")}
    field={{
      id: "ledgerCode",
      getListUrl: Urls.data_acc_ledgers_Code,
      params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
      valueKey: "id",
      labelKey: "name",
    }}
    onChangeData={(data) => handleFieldChange('ledgerCode', data.ledgerCode)}
  />

  {/* Ledger ID Section */}
  <ERPDataCombobox
    {...getFieldProps("ledgerID")}
    label={t("Ledgers")}
    field={{
      id: "ledgerID",
      getListUrl: Urls.data_acc_ledgers,
      params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
      valueKey: "id",
      labelKey: "name",
    }}
    onChangeData={(data) => handleFieldChange({ledgerID: data.ledgerID})}
  />

  {/* Related Ledger Section */}
  <ERPInput
    {...getFieldProps("relatedLedger")}
    label={t("Related Ledger")}
    field={{
      id: "ledgerID",
      getListUrl: Urls.data_acc_ledgers,
      params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
      valueKey: "id",
      labelKey: "name",
    }}
    onChangeData={(data) => handleFieldChange('relatedLedger', data.relatedLedger)}
  />

  {/* Cost Centre Section */}
  <ERPDataCombobox
    {...getFieldProps("costCentre")}
    label={t("Cost Centre")}
    field={{
      id: "costCentre",
      getListUrl: Urls.data_costcentres,
      valueKey: "id",
      labelKey: "name",
    }}
    onChangeData={(data) => handleFieldChange('costCentre', data.costCentre)}
  />

  {/* Checkboxes Grid */}
  <div className="col-span-2 grid grid-cols-2 gap-4">
    <ERPCheckbox
      {...getFieldProps("summaryWise")}
      label={t("Summary Wise")}
      onChangeData={(data) => handleFieldChange('summaryWise', data.summaryWise)}
    />

    <ERPCheckbox
      {...getFieldProps("ignoreCashSales")}
      label={t("Ignore Cash Sales")}
      onChangeData={(data) => handleFieldChange('ignoreCashSales', data.ignoreCashSales)}
    />

    <ERPCheckbox
      {...getFieldProps("showWithInventoryDetails")}
      label={t("Show With Inventory Details")}
      onChangeData={(data) => handleFieldChange('showWithInventoryDetails', data.showWithInventoryDetails)}
    />

    <ERPCheckbox
      {...getFieldProps("foreignCurrency")}
      label={t("Foreign Currency")}
      onChangeData={(data) => handleFieldChange('foreignCurrency', data.foreignCurrency)}
    />

    <ERPCheckbox
      {...getFieldProps("openingBalance")}
      label={t("Opening Balance")}
      onChangeData={(data) => handleFieldChange('openingBalance', data.openingBalance)}
    />

    <ERPCheckbox
      {...getFieldProps("showSeparateColorForDebitBalance")}
      label={t("Show Separate Color for Debit Balance")}
      onChangeData={(data) => handleFieldChange('showSeparateColorForDebitBalance', data.showSeparateColorForDebitBalance)}
    />

    <ERPCheckbox
      {...getFieldProps("showPendingCheques")}
      label={t("Show Pending Cheques")}
      onChangeData={(data) => handleFieldChange('showPendingCheques', data.showPendingCheques)}
    />
  </div>
</div>

);
export default LedgerReportFilter;
export const LedgerReportFilterInitialState = {
  fromDate: new Date(), // Default empty string
  toDate: null, // Default empty string
  all: false, // Default to false
  ledgerCode: "", // Default empty string
  ledgerID: 0, // Default to 0
  relatedLedger: "", // Default empty string
  costCentre: "", // Default empty string
  summaryWise: false, // Default to false
  ignoreCashSales: false, // Default to false
  showWithInventoryDetails: false, // Default to false
  foreignCurrency: false, // Default to false
  openingBalance: false, // Default to false
  showPendingCheques: false, // Default to false
  showSeparateColorForDebitBalance: false, // Default to false
};