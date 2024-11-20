import { useState } from "react";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";

const CollectionReportFilter = ({ getFieldProps, handleFieldChange, t}: any) => {
    return (
  <div className="grid grid-cols-2 gap-4">
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
    <ERPDataCombobox   
      {...getFieldProps("voucherType")}
      label={t("Cash/Bank A/c")}
      field={{
        id: "voucherType",
        valueKey: "value",
        labelKey: "label",
      }}
      id= "voucherType"
      options={[
        { value: "All", label: "All" },
        { value: "Bank", label: "Bank" },
        { value: "Cash", label: "Cash" },
        { value: "Cheque", label: "Cheque" },
      ]}
      onChangeData={(data) => { handleFieldChange('voucherType', data.voucherType); 
      }}
    />

    <ERPDataCombobox
      {...getFieldProps("accGroupID")}
      label={t("account_group")}
      field={{
        id: "accGroupID",
        getListUrl: Urls.data_acc_groups,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange({ accGroupID: data.accGroupID })}
    />
    <ERPDataCombobox
      {...getFieldProps("accLedgerID")}
      label={t("account_ledger")}
      field={{
        id: "accLedgerID",
        getListUrl: Urls.data_acc_ledgers,
        params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('accLedgerID', data.accLedgerID)}
    />

    <ERPDataCombobox
      {...getFieldProps("salesRouteID")}
      label={t("sales_route")}
      field={{
        id: "salesRouteID",
        getListUrl: Urls.data_salesRoute,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('salesRouteID', data.salesRouteID)}
    />
      <ERPDataCombobox
      {...getFieldProps("employeeID")}
      label={t("employee")}
      field={{
        id: "employeeID",
        getListUrl: Urls.data_employees,
        valueKey: "id",
        labelKey: "name",
      }}
      onChangeData={(data) => handleFieldChange('employeeID', data.employeeID)}
    />
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
      <ERPCheckbox
      {...getFieldProps("isIncludePI_CP")}
      label={t("include_SI_cash_receipt_amount")}
      onChangeData={(data) => handleFieldChange("isIncludePI_CP", data.isIncludePI_CP)}
    />
  </div>
);
}
export default CollectionReportFilter;
export const CollectionReportFilterInitialState = {
  dateFrom: new Date(), 
  dateTo: new Date(), 
  voucherType: "All", 
  accGroupID: 0, 
  accLedgerID: 0, 
  salesRouteID: 0, 
  employeeID:0,
  costCentreID: -1, 
  isIncludePI_CP:false,
};