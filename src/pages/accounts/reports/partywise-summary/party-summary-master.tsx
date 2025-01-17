import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useRef, useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import { Tab, Tabs } from "@mui/material";
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
import ERPButton from "../../../../components/ERPComponents/erp-button";
export interface PartySummaryFilter {
  filter: {
    dateFrom: any;
    dateTo: Date;
    ledgerID: number;
  };
}
export interface PartySummaryRef {
  reloadData: () => void;
}
// const PartySummaryMaster = () => {
const PartySummaryMaster = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const childRef = useRef<PartySummaryRef>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<PartySummaryFilter>({
    filter: {
      dateFrom: moment().local().toISOString(),
      dateTo: new Date(),
      ledgerID: -1,
    },
  });
 
  const [activeTab, setActiveTab] = useState("basicInfo");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  const handleShowButtonClick = () => {
    if (childRef.current) {
      childRef.current.reloadData(); // Call the exposed function in the child
    }
  };
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div>
                <div className="flex items-center gap-4">
                  <ERPDateInput
                    id="dateFrom"
                    value={filter.filter.dateFrom}
                    customSize="sm"
                    className="max-w-[150px]"
                    data={filter.filter}
                    label={t("date_from")}
                    onChangeData={(data: any) =>
                      setFilter((prev: any) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          dateFrom: data.dateFrom,
                        },
                      }))
                    }
                  />
                  <ERPDateInput
                    id="dateTo"
                    value={filter.filter.dateTo}
                    customSize="sm"
                    className="max-w-[150px]"
                    data={filter.filter}
                    label={t("date_to")}
                    onChangeData={(data: any) =>
                      setFilter((prev: any) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          dateTo: data.dateTo,
                        },
                      }))
                    }
                  />
                  <ERPDataCombobox
                    id="ledgerID"
                    value={filter.filter.ledgerID}
                    customSize="sm"
                    className="min-w-[325px]"
                    data={filter.filter}
                    label={t("ledgers")}
                    field={{
                      id: "ledgerID",
                      getListUrl: Urls.data_acc_ledgers,
                      params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    // onChangeData={(data) => handleFieldChange({ ledgerID: data.ledgerID })}
                    onChangeData={(data: any) =>
                      setFilter((prev: any) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          ledgerID: data.ledgerID,
                        },
                      }))
                    }
                  />
                  <div>
                    <ERPButton
                      type="button"
                      variant="primary"
                      onClick={handleShowButtonClick}
                      title={t("show")}
                    ></ERPButton>
                  </div>
                </div>
              </div>
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
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
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
                    <PartySummaryBasicInfo
                      filter={filter.filter}
                      ref={childRef} // Pass the ref to the child
                    ></PartySummaryBasicInfo>
                  )}
                  {activeTab === "accountLedger" && (
                    <PartySummaryLedger
                      filter={filter.filter}
                    ></PartySummaryLedger>
                  )}
                  {activeTab === "payments" && (
                    <PartySummaryPayment
                      filter={filter.filter}
                    ></PartySummaryPayment>
                  )}
                  {activeTab === "collections" && (
                    <PartySummaryCollection
                      filter={filter.filter}
                    ></PartySummaryCollection>
                  )}
                  {activeTab === "purchase" && (
                    <PartySummaryPurchase
                      filter={filter.filter}
                    ></PartySummaryPurchase>
                  )}
                  {activeTab === "sales" && (
                    <PartySummarySales
                      filter={filter.filter}
                    ></PartySummarySales>
                  )}
                  {activeTab === "purchaseReturn" && (
                    <PartySummaryPurchaseReturn
                      filter={filter.filter}
                    ></PartySummaryPurchaseReturn>
                  )}
                  {activeTab === "purchaseOrder" && (
                    <PartySummaryPurchaseOrder
                      filter={filter.filter}
                    ></PartySummaryPurchaseOrder>
                  )}
                  {activeTab === "salesReturn" && (
                    <PartySummarySalesReturn
                      filter={filter.filter}
                    ></PartySummarySalesReturn>
                  )}
                  {activeTab === "salesOrder" && (
                    <PartySummarySalesOrder
                      filter={filter.filter}
                    ></PartySummarySalesOrder>
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
