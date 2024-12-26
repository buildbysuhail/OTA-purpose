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
import PartySummaryCollection from "./party-summary-collection";
import PartySummaryLedger from "./party-summary-ledger";
import moment from "moment";
import PartySummaryBasicInfo from "./party-summary-basic-info";
import PartySummaryPayment from "./party-summary-payment";
import PartySummaryPurchase from "./party-summary-purchase";
import PartySummarySales from "./party-summary-sales";
import PartySummaryPurchaseReturn from "./party-summary-purchase-return";
import PartySummaryPurchaseOrder from "./party-summary-purchase-order";
import PartySummarySalesReturn from "./party-summary-sales-return";
import PartySummarySalesOrder from "./party-summary-sales-order";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { LedgerType } from "../../../../enums/ledger-types";
export interface PartySummaryFilter {
  filter: {
    dateFrom: any;
    dateTo: Date;
    ledgerID: number;
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
  const [filter, setFilter] = useState<PartySummaryFilter>({filter: {
    dateFrom: moment().utc().toISOString(),
    dateTo: new Date(),
    ledgerID: -1,
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
                                  id="dateFrom"
                                  value={filter.filter.dateFrom}
                                  customSize='sm'
                                  data={filter.filter}
                                  label="from_date"
                                  onChangeData={(data: any) => setFilter((prev: any) => ({
                                    ...prev,
                                    filter: {
                                      ...prev.filter,
                                      dateFrom: data.dateFrom
                                    }
                                  }))}
                              />
                                <ERPDateInput
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
    />
                                {/* <ERPDataCombobox
                              id="ledgerID"
                              data={formState}
                              label={t("party_name")}
                              field={{
                                id: "ledgerID",
                                // required: true,
                                getListUrl: Urls.data_acc_ledgers, 
                                valueKey: "id",
                                labelKey: "name",
                              }}
                              onChangeData={(data: any) => handleFieldChange("ledgerID", data.ledgerID)}
                            /> */}
                               {/* <ERPDataCombobox
        {...getFieldProp("salesRouteID")}
        label={t("sales_route")}
        field={{
          id: "salesRouteID",
          getListUrl: Urls.data_salesRoute,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange('salesRouteID', data.salesRouteID)}
      /> */}
              <div className="grid grid-cols-1 gap-3">
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Basic Info" value="basicInfo" />
                  <Tab label="Account Ledger" value="accountLedger" />
                  <Tab label="Payments" value="payments" />
                  <Tab label="Collections" value="collections" />
                  <Tab label="Purchase" value="purchase" />
                  <Tab label="Sales" value="sales" />
                  <Tab label="Purchase Return" value="purchaseReturn" />
                  <Tab label="Purchase Order" value="purchaseOrder" />
                  <Tab label="Sales Return" value="salesReturn" />
                  <Tab label="Sales Order" value="salesOrder" />
                </Tabs>
                <div className="pt-4">
                  {activeTab === "basicInfo" && (
                    <PartySummaryBasicInfo filter={filter.filter}></PartySummaryBasicInfo>
                  )}
                  {activeTab === "accountLedger" && (
                    <PartySummaryLedger filter={filter.filter}></PartySummaryLedger>
                  )}
                  {activeTab === "payments" && (
                    <PartySummaryPayment filter={filter.filter}></PartySummaryPayment>
                  )}
                  {activeTab === "collections" && (
                    <PartySummaryCollection filter={filter.filter}></PartySummaryCollection>
                  )}
                  {activeTab === "purchase" && (
                    <PartySummaryPurchase filter={filter.filter}></PartySummaryPurchase>
                  )}
                  {activeTab === "sales" && (
                    <PartySummarySales filter={filter.filter}></PartySummarySales>
                  )}
                  {activeTab === "purchaseReturn" && (
                    <PartySummaryPurchaseReturn filter={filter.filter}></PartySummaryPurchaseReturn>
                  )}
                  {activeTab === "purchaseOrder" && (
                    <PartySummaryPurchaseOrder filter={filter.filter}></PartySummaryPurchaseOrder>
                  )}
                  {activeTab === "salesReturn" && (
                    <PartySummarySalesReturn filter={filter.filter}></PartySummarySalesReturn>
                  )}
                  {activeTab === "salesOrder" && (
                    <PartySummarySalesOrder filter={filter.filter}></PartySummarySalesOrder>
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

export default PartySummaryMaster;
