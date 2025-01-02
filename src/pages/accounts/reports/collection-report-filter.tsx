import { useState } from "react";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { LedgerType } from "../../../enums/ledger-types";
import Urls from "../../../redux/urls";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const CollectionReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const userSession = useSelector((state:RootState)=>state.UserSession)
  const { t } = useTranslation('accountsReport');
  return (
    <div className="grid grid-cols-2 gap-4">
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
      <ERPDataCombobox
        {...getFieldProps("voucherType")}
        label={t("cash/bank_A/c")}
        field={{
          id: "voucherType",
          valueKey: "value",
          labelKey: "label",
        }}
        id="voucherType"
        options={[
          { value: "All", label: "All" },
          { value: "Bank", label: "Bank" },
          { value: "Cash", label: "Cash" },
          { value: "Cheque", label: "Cheque" },
        ]}
        onChangeData={(data) => {
          handleFieldChange('voucherType', data.voucherType);
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
      {applicationSettings.mainSettings.allowSalesRouteArea == true &&
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
      />}
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
        {...getFieldProps("costCenterID")}
        label={t("cost_centre")}
        field={{
          id: "costCenterID",
          getListUrl: Urls.data_costcentres,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange('costCenterID', data.costCenterID)}
      />
      <ERPCheckbox
        {...getFieldProps("isIncludePI_CP")}
        label={t("include_SI_cash_receipt_amount")}
        onChangeData={(data) => handleFieldChange("isIncludePI_CP", data.isIncludePI_CP)}
      /> 
      {userSession.dbIdValue == '543140180640' &&
      <ERPCheckbox
        {...getFieldProps("isBillToBill")}
        label={t("billToBill")}
        onChangeData={(data) => handleFieldChange("isBillToBill", data.isBillToBill)}
      />}
    </div>
  );
}
export default CollectionReportFilter;
export const CollectionReportFilterInitialState = {
  dateFrom: new Date(),
  dateTo: new Date(),
  voucherType: "All",
  accGroupID: 154,
  accLedgerID: -1,
  salesRouteID: -1,
  employeeID: -1,
  costCenterID: -1,
  isIncludePI_CP: false,
};