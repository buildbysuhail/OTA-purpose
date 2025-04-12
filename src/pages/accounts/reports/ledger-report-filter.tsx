import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { LedgerType } from "../../../enums/ledger-types";
import Urls from "../../../redux/urls";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const LedgerReportFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  const { t } = useTranslation("accountsReport");
  // const [reload,setReload]= useState(false);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
        />

        <ERPDateInput
          {...getFieldProps("dateTo")}
          className="w-full"
          label={t("to")}
          onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
        />
      </div>

      <ERPDataCombobox
        {...getFieldProps("ledgerID")}
        label={t("ledger_code")}
        field={{
          id: "ledgerID",
          getListUrl: Urls.data_acc_ledgers,
          params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
          valueKey: "id",
          labelKey: "alias",
          nameKey: "name",
        }}
        onSelectItem={(data) => {
          handleFieldChange({
            ledgerID: data.value,
            ledgerName: data.name,
            ledgerCode: data.label,
          });
          // setReload(!reload);
        }}
      />

      <ERPDataCombobox
        {...getFieldProps("ledgerID")}
        label={t("ledgers")}
        field={{
          id: "ledgerID",
          getListUrl: Urls.data_acc_ledgers,
          params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => {
          handleFieldChange({
            ledgerID: data.value,
            ledgerName: data.label,
            ledgerCode: data.name,
          });
        }}
      />

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
        onChangeData={(data) => handleFieldChange("relLedgerID", data.relLedgerID)}
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
        onSelectItem={(data) =>
          handleFieldChange({
            costCentreID: data.value,
            CostCenterName: data.label,
          })
        }
      />

      {
        applicationSettings.accountsSettings?.allowSalesCounter == true && (
          <ERPDataCombobox
            {...getFieldProps("counterID")}
            label={t("counter_id")}
            field={{
              id: "counterID",
              getListUrl: Urls.data_counters,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data) => handleFieldChange("counterID", data.counterID)}
          />
        )
      }

      {
        formState.ledgerID != undefined &&
        formState.ledgerID != null &&
        formState.ledgerID != 0 &&
        applicationSettings.accountsSettings?.maintainProjectSite == true && (
          <ERPDataCombobox
            {...getFieldProps("project")}
            label={t("project")}
            field={{
              id: "project",
              // getListUrl: `${Urls.data_projects_by_ledgerid}${formState.ledgerID}`,
              // params: `ledgerID=${formState.ledgerID}`,
              getListUrl: Urls.data_projects_by_ledgerid,
              params: `LedgerID=${formState.ledgerID}`,
              valueKey: "id",
              labelKey: "name",
            }}
            // reload={reload}
            onChangeData={(data: any) =>
              handleFieldChange("project", data.project)
            }
          />
        )
      }

      <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-left">
          <ERPCheckbox
            {...getFieldProps("showAll")}
            label={t("all")}
            onChangeData={(data) => handleFieldChange("showAll", data.showAll)}
          />

          <ERPCheckbox
            {...getFieldProps("showSummary")}
            label={t("summary_wise")}
            onChangeData={(data) => handleFieldChange("showSummary", data.showSummary)}
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
            onChangeData={(data) => handleFieldChange("showOpeningBal", data.showOpeningBal)}
          />

          <ERPCheckbox
            {...getFieldProps("showSeparateColorForDebitBalance")}
            label={t("show_separate_color_for_debit_balance")}
            onChangeData={(data) => handleFieldChange("showSeparateColorForDebitBalance", data.showSeparateColorForDebitBalance)}
          />

          <ERPCheckbox
            {...getFieldProps("showPendingCheques")}
            label={t("show_pending_cheques")}
            onChangeData={(data) => handleFieldChange("showPendingCheques", data.showPendingCheques)}
          />
        </div>
      </div>
    </div>
  );
};
export default LedgerReportFilter;
export const LedgerReportFilterInitialState = {
  // dateFrom: new Date(-45),
  dateFrom: moment().local().subtract(45, "days").toDate(),
  dateTo: new Date(),
  showAll: false,
  ledgerCode: "",
  ledgerID: 0,
  relLedgerID: -1,
  costCentreID: -1,
  showSummary: false,
  counterID: 0,
  ignoreCashSales: false,
  // showWithInventoryDetails: false, 
  foreignCurrency: false,
  showOpeningBal: true,
  showPendingCheques: false,
  showSeparateColorForDebitBalance: false,
};
