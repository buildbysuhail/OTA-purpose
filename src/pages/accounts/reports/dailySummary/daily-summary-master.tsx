import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import { Tab, Tabs } from "@mui/material";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import DailySummary from "./dailySummary/daily-summary";
import DailySummaryCreditDetails from "./daily-summary-credit-details";
import DailySummaryReceiptDetails from "./daily-summary-receipt-details";
import ERPButton from "../../../../components/ERPComponents/erp-button";
export interface DailySummaryFilter {
  transactionDate: Date;
    counterID: number;
    costCentreID: number;
    counterShiftId: number;
    employeeID: number;
}
// const PartySummaryMaster = () => {
const DailySummaryMaster = ({ getFieldProps, handleFieldChange, formState }: any) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const [reload, setReload] = useState<boolean>(false);
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<DailySummaryFilter>({
    transactionDate: new Date(),
      counterID: 0,
      costCentreID: 0,
      counterShiftId: 0,
      employeeID: 0,
  });

  const [activeTab, setActiveTab] = useState("salesReportSummary");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => { setActiveTab(newValue); };
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            <div className="flex items-center gap-4 w-full">
              <ERPDateInput
                id="transactionDate"
                value={filter.transactionDate}
                customSize='sm'
                data={filter}
                label={t("transaction_date")}
                onChangeData={(data: any) => {
                  debugger;
                  setFilter((prev: any) => ({
                    ...prev,
                    transactionDate: data.transactionDate
                  }))
                }}
              />

              <ERPDataCombobox
                id="counterID"
                value={filter.counterID}
                customSize='sm'
                className="w-[300px]"
                data={filter}
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
                  counterID: data.counterID
                }))}
              />

              <ERPDataCombobox
                id="costCentreID"
                value={filter.costCentreID}
                customSize='sm'
                className="w-[300px]"
                data={filter}
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
                    costCentreID: data.costCentreID
                }))}
              />
              <ERPDataCombobox
                id="counterShiftId"
                value={filter.counterShiftId}
                customSize='sm'
                className="w-[300px]"
                data={filter}
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
                  counterShiftId: data.counterShiftId
                }))}
              />
              <ERPDataCombobox
                id="employeeID"
                value={filter.employeeID}
                customSize='sm'
                className="w-[300px]"
                data={filter}
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
                  employeeID: data.employeeID
                }))}
              />
              <ERPButton title="Show" onClick={() =>{ debugger;
                setReload(true)
              }}></ERPButton>{reload?.toString()}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label={t("sales_report_summary")} value="salesReportSummary" className="dark:text-dark-text" />
                <Tab label={t("credit_details")} value="creditDetails" className="dark:text-dark-text" />
                <Tab label={t("receipt_details")} value="receiptDetails" className="dark:text-dark-text" />
              </Tabs>
              <div className="pt-2">
                {activeTab === "salesReportSummary" && (
                  <DailySummary filter={filter} onReloadChange={()=> setReload(false)} reloadBase={reload}></DailySummary>
                )}
                {activeTab === "creditDetails" && (
                  <DailySummaryCreditDetails filter={filter} onReloadChange={()=> setReload(false)} reloadBase={reload}></DailySummaryCreditDetails>
                )}
                {activeTab === "receiptDetails" && (
                  <DailySummaryReceiptDetails filter={filter} onReloadChange={()=> setReload(false)} reloadBase={reload}></DailySummaryReceiptDetails>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DailySummaryMaster;
