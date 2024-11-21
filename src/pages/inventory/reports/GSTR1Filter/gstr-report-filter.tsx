import { useState } from "react";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";

const GstrReportFilter = ({ getFieldProps, handleFieldChange, t, formState }: any) => {

    // const [reload,setReload]= useState(false);
    return (
  <div className="grid grid-cols-2 gap-4">
    {/* Date Range Section */}
    <div className="flex items-center gap-4">
      <ERPDateInput
        {...getFieldProps("dateFrom")}
        label={t("From")}
        onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
      />
      <ERPDateInput
        {...getFieldProps("dateTo")}
        label={t("To")}
        onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
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
      {...getFieldProps("ledgerID")}
      label={t("Ledger Code")}
      field={{
        id: "ledgerID",
        getListUrl: Urls.data_acc_ledgers_Code,
        params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => { handleFieldChange('ledgerID', data.ledgerID); 
        // setReload(!reload);
      }}
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
      onChangeData={(data) => handleFieldChange({ ledgerID: data.ledgerID })}
    />

    {/* Related Ledger Section */}
    <ERPDataCombobox
      {...getFieldProps("relLedgerID")}
      label={t("Related Ledger")}
      field={{
        id: "relLedgerID",
        getListUrl: Urls.data_acc_ledgers,
        params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('relLedgerID', data.relLedgerID)}
    />

    {/* Cost Centre Section */}
    <ERPDataCombobox
      {...getFieldProps("costCentreID")}
      label={t("Cost Centre")}
      field={{
        id: "costCentreID",
        getListUrl: Urls.data_costcentres,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('costCentreID', data.costCentreID)}
    />

    <ERPDataCombobox
      {...getFieldProps("counterID")}
      label={t("counterID")}
      field={{
        id: "counterID",
        getListUrl: Urls.data_counters,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('counterID', data.counterID)}
    />
    {formState.ledgerID != undefined && formState.ledgerID != null && formState.ledgerID != 0 &&
      < ERPDataCombobox
        {...getFieldProps("project")}
        label={t("project")}
        field={{
          id: "project",
          getListUrl: Urls.data_projects_by_ledgerid,
          params: `ledgerID=${formState.ledgerID}`,
          valueKey: "id",
          labelKey: "name",
        }}
        // reload={reload}
        onChangeData={(data: any) => handleFieldChange('project', data.project)}
      />
    }

    {/* Checkboxes Grid */}
    {/* <div className="col-span-2 grid grid-cols-2 gap-4">
    <ERPCheckbox
      {...getFieldProps("summaryWise")}
      label={t("Summary Wise")}
      onChangeData={(data) => handleFieldChange('summaryWise', data.summaryWise)}
    /> */}

    {/* <ERPCheckbox
      {...getFieldProps("ignoreCashSales")}
      label={t("Ignore Cash Sales")}
      onChangeData={(data) => handleFieldChange('ignoreCashSales', data.ignoreCashSales)}
    /> */}

    {/* <ERPCheckbox
      {...getFieldProps("showWithInventoryDetails")}
      label={t("Show With Inventory Details")}
      onChangeData={(data) => handleFieldChange('showWithInventoryDetails', data.showWithInventoryDetails)}
    /> */}

    {/* <ERPCheckbox
      {...getFieldProps("foreignCurrency")}
      label={t("Foreign Currency")}
      onChangeData={(data) => handleFieldChange('foreignCurrency', data.foreignCurrency)}
    /> */}

    <ERPCheckbox
      {...getFieldProps("showOpeningBal")}
      label={t("Opening Balance")}
      onChangeData={(data) => handleFieldChange('showOpeningBal', data.showOpeningBal)}
    />

    <ERPCheckbox
      {...getFieldProps("showSeparateColorForDebitBalance")}
      label={t("Show Separate Color for Debit Balance")}
      onChangeData={(data) => handleFieldChange('showSeparateColorForDebitBalance', data.showSeparateColorForDebitBalance)}
    />

    {/* <ERPCheckbox
      {...getFieldProps("showPendingCheques")}
      label={t("Show Pending Cheques")}
      onChangeData={(data) => handleFieldChange('showPendingCheques', data.showPendingCheques)}
    /> */}
  </div>
  // </div>

);
}
export default GstrReportFilter;
export const GstrReportFilterInitialState = {
  dateFrom: new Date(), // Default empty string
  dateTo: new Date(), // Default empty string 
  all: false, // Default to false
  ledgerCode: "", // Default empty string
  ledgerID: 0, // Default to 0
  relLedgerID: -1, // Default empty string
  costCentreID: -1, // Default empty string
  summaryWise: false, // Default to false
  counterID:0,
  ignoreCashSales: false, // Default to false
  // showWithInventoryDetails: false, // Default to false
  foreignCurrency: false, // Default to false
  showOpeningBal: true, // Default to false
  showPendingCheques: false, // Default to false
  showSeparateColorForDebitBalance: false, // Default to false
};