import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import moment from "moment";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { LedgerType } from "../../../../enums/ledger-types";
import DailySummary from "./dailySummary/daily-summary";
import DailySummaryCreditDetails from "./daily-summary-credit-details";
import DailySummaryReceiptDetails from "./daily-summary-receipt-details";
export interface DailySummaryFilter {
  filter: {
    transactionDate: Date;
    counterID: number;
    costCentreID: number;
    counterShiftId: number;
    employeeID: number;
  };
}
// const PartySummaryMaster = () => {
const DailySummaryMaster = ({ getFieldProps, handleFieldChange, formState }: any) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<DailySummaryFilter>({
    filter: {
      transactionDate: new Date(),
      counterID: 0,
      costCentreID: 0,
      counterShiftId: 0,
      employeeID: 0,
    }
  });

  
  const [activeTab, setActiveTab] = useState("address");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <ERPDateInput
                id="transactionDate"
                value={filter.filter.transactionDate}
                customSize='sm'
                data={filter.filter}
                label={t("transaction_date")}
                onChangeData={(data: any) => setFilter((prev: any) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    transactionDate: data.transactionDate
                  }
                }))}
              />

              <ERPDataCombobox
                id="counterID"
                value={filter.filter.counterID}
                customSize='sm'
                data={filter.filter}
                label={t("counter")}
                field={{
                  id: "counterID",
                  getListUrl: Urls.data_counters,
                  // params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                  valueKey: "id",
                  labelKey: "name",
                }}
                // onChangeData={(data) => handleFieldChange({ ledgerID: data.ledgerID })}
                onChangeData={(data: any) => setFilter((prev: any) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    counterID: data.counterID
                  }
                }))}
              />
              <ERPDataCombobox
                id="costCentreID"
                value={filter.filter.costCentreID}
                customSize='sm'
                data={filter.filter}
                label={t("cost_centre")}
                field={{
                  id: "costCentreID",
                  getListUrl: Urls.data_costcentres,
                  // params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                  valueKey: "id",
                  labelKey: "name",
                }}
                // onChangeData={(data) => handleFieldChange({ ledgerID: data.ledgerID })}
                onChangeData={(data: any) => setFilter((prev: any) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    costCentreID: data.costCentreID
                  }
                }))}
              />
              <ERPDataCombobox
                id="counterShiftId"
                value={filter.filter.counterShiftId}
                customSize='sm'
                data={filter.filter}
                label={t("shift")}
                field={{
                  id: "counterShiftId",
                  getListUrl: Urls.data_costcentres,
                  // params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                  valueKey: "id",
                  labelKey: "name",
                }}
                // onChangeData={(data) => handleFieldChange({ ledgerID: data.ledgerID })}
                onChangeData={(data: any) => setFilter((prev: any) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    counterShiftId: data.counterShiftId
                  }
                }))}
              />
              <ERPDataCombobox
                id="employeeID"
                value={filter.filter.employeeID}
                customSize='sm'
                data={filter.filter}
                label={t("employee")}
                field={{
                  id: "employeeID",
                  getListUrl: Urls.data_employees,
                  // params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                  valueKey: "id",
                  labelKey: "name",
                }}
                // onChangeData={(data) => handleFieldChange({ ledgerID: data.ledgerID })}
                onChangeData={(data: any) => setFilter((prev: any) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    employeeID: data.employeeID
                  }
                }))}
              />
              <div className="grid grid-cols-1 gap-3">
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Sales Report Summary" value="salesReportSummary" className="dark:text-dark-text" />
                  <Tab label="Credit Details" value="creditDetails" className="dark:text-dark-text" />
                  <Tab label="Receipt Details" value="receiptDetails" className="dark:text-dark-text" />
                </Tabs>
                <div className="pt-4">
                  {activeTab === "salesReportSummary" && (
                    <DailySummary filter={filter.filter}></DailySummary>
                  )}
                  {activeTab === "creditDetails" && (
                    <DailySummaryCreditDetails filter={filter.filter}></DailySummaryCreditDetails>
                  )}
                  {activeTab === "receiptDetails" && (
                    <DailySummaryReceiptDetails filter={filter.filter}></DailySummaryReceiptDetails>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DailySummaryMaster;
