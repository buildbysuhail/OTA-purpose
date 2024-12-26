import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPDateInput  from "../../../../components/ERPComponents/erp-date-input";
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
  const PartySummaryMaster = ({ getFieldProps, handleFieldChange, formState }: any) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<DailySummaryFilter>({filter: {
    transactionDate: new Date(),
    counterID: -1,
    costCentreID: -1,
    counterShiftId: -1,
    employeeID: -1,
  }});

  debugger;
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
                                  label="from_date"
                                  onChangeData={(data: any) => setFilter((prev: any) => ({
                                    ...prev,
                                    filter: {
                                      ...prev.filter,
                                      transactionDate: data.transactionDate
                                    }
                                  }))}
                              />
                                {/* <ERPDateInput
                                  id="dateTo"
                                  value={filter.filter.dateTo}
                                  customSize='sm'
                                  data={filter.filter}
                                  label="from_date"
                                  onChangeData={(data: any) => setFilter((prev: any) => ({
                                    ...prev,
                                    filter: {
                                      ...prev.filter,
                                      dateTo: data.dateTo
                                    }
                                  }))}
                              />
                               <ERPDataCombobox
      id="ledgerID"
      value={filter.filter.ledgerID}
        customSize='sm'
        data={filter.filter}
      label={t("Ledgers")}
      field={{
        id: "ledgerID",
        getListUrl: Urls.data_acc_ledgers,
        params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
        valueKey: "id",
        labelKey: "name",
      }}
      // onChangeData={(data) => handleFieldChange({ ledgerID: data.ledgerID })}
      onChangeData={(data: any) => setFilter((prev: any) => ({
        ...prev,
        filter: {
          ...prev.filter,
          ledgerID: data.ledgerID
        }
      }))}
    /> */}
              <div className="grid grid-cols-1 gap-3">
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Sales Report Summary" value="salesReportSummary" />
                  <Tab label="Credit Details" value="creditDetails" />
                  <Tab label="Dedit Details" value="deditDetails" />
                </Tabs>
                <div className="pt-4">
                  {/* {activeTab === "salesReportSummary" && (
                    // <DailySummary filter={filter.filter}></DailySummary>
                  )} */}
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

export default DailySummaryFilter;
