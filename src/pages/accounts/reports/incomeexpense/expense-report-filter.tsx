import { useState } from "react";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";

const ExpenseReportFilter = ({ getFieldProps, handleFieldChange,filter }: any) => {
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
        {...getFieldProps("accGroupID")}
        label={t("group_under")}
        field={{
          id: "accGroupID",
          getListUrl: `${Urls.data_SelectAccGroupsUnderAccGroupIDForCombo}${9}`,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange({ accGroupID: data.accGroupID })}
      />
      <ERPDataCombobox
        {...getFieldProps("accLedgerID")}
        label={t("ledger")}
        field={{
          id: "accLedgerID",
          getListUrl:`${Urls.data_SelectAccLedgersByAccGroupIDForCombo}${filter?.accGroupID}`,
        //  params: filter?.accGroupID == undefined || filter?.accGroupID == null || filter?.accGroupID == 0 ? `ledgerID=0&ledgerType=${LedgerType.All}` : '',
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange('accLedgerID', data.accLedgerID)}
      />
        <ERPDataCombobox
        {...getFieldProps("salesmanID")}
        label={t("salesman")}
        field={{
          id: "salesmanID",
          getListUrl: Urls.data_employees,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange('salesmanID', data.salesmanID)}
      />
        <ERPDataCombobox
        {...getFieldProps("costCentreID")}
        label={t("cost_centre")}
        field={{
          id: "costCentreID", 
          getListUrl: Urls.data_costcentres,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => handleFieldChange({costCentreID: data.value,costCentreName:data.name})}
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
        onSelectItem={(data) => handleFieldChange({salesRouteID:data.value,salesRouteName:data.name})}
      />
    </div>
  );
}
export default ExpenseReportFilter;
export const ExpenseReportFilterInitialState = {
  dateFrom: new Date(),
  dateTo: new Date(),
  ledgerID: -1,
  accGroupID: 9,
  // accLedgerID: -1,
  salesRouteID: -1,
  salesmanID: -1,
  costCentreID: -1,
  // isIncludePI_CP: false,
};