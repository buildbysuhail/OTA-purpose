import { useState } from "react";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { LedgerType } from "../../../enums/ledger-types";
import Urls from "../../../redux/urls";
import moment from 'moment';
import { useTranslation } from "react-i18next";

const LedgerReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {

  const { t } = useTranslation('accountsReport');
  // const [reload,setReload]= useState(false);
  return (
    <div className="grid grid-cols-1 my-4  md:grid-cols-2 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("from")}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          label={t("to")}
          onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
        />
      </div>

      {/* All Checkbox */}
      <ERPCheckbox
        {...getFieldProps("showAll")}
        label={t("all")}
        onChangeData={(data) => handleFieldChange("showAll", data.showAll)}
      />

      {/* Ledger Code Section */}
      <ERPDataCombobox
        {...getFieldProps("ledgerID")}
        label={t("ledger_code")}
        field={{
          id: "ledgerID",
          getListUrl: Urls.data_acc_ledgers_Code,
          params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => {
          handleFieldChange('ledgerID', data.ledgerID);
          // setReload(!reload);
        }}
      />

      {/* Ledger ID Section */}
      <ERPDataCombobox
        {...getFieldProps("ledgerID")}
        label={t("ledgers")}
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
        label={t("related_ledger")}
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
        label={t("cost_centre")}
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
        label={t("counter_id")}
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
      <div className="col-span-2 grid grid-cols-2 gap-4">
        <ERPCheckbox
          {...getFieldProps("showSummary")}
          label={t("summary_wise")}
          onChangeData={(data) => handleFieldChange('showSummary', data.showSummary)}
        />

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
          label={t("opening_balance")}
          onChangeData={(data) => handleFieldChange('showOpeningBal', data.showOpeningBal)}
        />

        <ERPCheckbox
          {...getFieldProps("showSeparateColorForDebitBalance")}
          label={t("show_separate_color_for_debit_balance")}
          onChangeData={(data) => handleFieldChange('showSeparateColorForDebitBalance', data.showSeparateColorForDebitBalance)}
        />

        <ERPCheckbox
          {...getFieldProps("showPendingCheques")}
          label={t("show_pending_cheques")}
          onChangeData={(data) => handleFieldChange('showPendingCheques', data.showPendingCheques)}
        />
      </div>
    </div>
  );
}
export default LedgerReportFilter;
export const LedgerReportFilterInitialState = {
  // dateFrom: new Date(-45), // Default empty string
  dateFrom: moment().subtract(45, 'days').toDate(),
  dateTo: new Date(), // Default empty string 
  showAll: false, // Default to false
  ledgerCode: "", // Default empty string
  ledgerID: 0, // Default to 0
  relLedgerID: -1, // Default empty string
  costCentreID: -1, // Default empty string
  showSummary: false, // Default to false
  counterID: 0,
  ignoreCashSales: false, // Default to false
  // showWithInventoryDetails: false, // Default to false
  foreignCurrency: false, // Default to false
  showOpeningBal: true, // Default to false
  showPendingCheques: false, // Default to false
  showSeparateColorForDebitBalance: false, // Default to false
};