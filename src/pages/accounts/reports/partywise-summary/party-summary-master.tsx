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
      dateFrom: moment().local().subtract(30, "days").toDate(),
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
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-full md:w-auto">
                    <ERPDateInput
                      id="dateFrom"
                      value={filter.filter.dateFrom}
                      customSize="sm"
                      className="w-full md:w-[150px]"
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
                  </div>
                  <div className="w-full md:w-auto">
                    <ERPDateInput
                      id="dateTo"
                      value={filter.filter.dateTo}
                      customSize="sm"
                      className="w-full md:w-[150px]"
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
                  </div>
                  <div className="w-full md:w-auto">
                    <ERPDataCombobox
                      id="ledgerID"
                      value={filter.filter.ledgerID}
                      customSize="sm"
                      className="max-w-[325px]"
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
                  </div>
                  <div className="mt-[24px]">
                    <ERPButton
                      type="button"
                      variant="primary"
                      className="h-[32px]"
                      onClick={handleShowButtonClick}
                      title={t("show")}
                    />
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
                <div className="overflow-x-auto">
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto">
                    <Tab className="dark:text-dark-text" label={t("basic_info")} value="basicInfo" />
                    <Tab className="dark:text-dark-text" label={t("account_ledger")} value="accountLedger" />
                    <Tab className="dark:text-dark-text" label={t("payments")} value="payments" />
                    <Tab className="dark:text-dark-text" label={t("collections")} value="collections" />
                    <Tab className="dark:text-dark-text" label={t("purchase")} value="purchase" />
                    <Tab className="dark:text-dark-text" label={t("sales")} value="sales" />
                    <Tab className="dark:text-dark-text" label={t("purchase_return")} value="purchaseReturn" />
                    <Tab className="dark:text-dark-text" label={t("purchase_order")} value="purchaseOrder" />
                    <Tab className="dark:text-dark-text" label={t("sales_return")} value="salesReturn" />
                    <Tab className="dark:text-dark-text" label={t("sales_order")} value="salesOrder" />
                  </Tabs>
                </div>
                <div className="pt-2">
                  {
                    activeTab === "basicInfo" && (
                      <PartySummaryBasicInfo
                        filter={filter.filter}
                        ref={childRef}
                      />
                    )
                  }

                  {
                    activeTab === "accountLedger" && (
                      <PartySummaryLedger
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "payments" && (
                      <PartySummaryPayment
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "collections" && (
                      <PartySummaryCollection
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "purchase" && (
                      <PartySummaryPurchase
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "sales" && (
                      <PartySummarySales
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "purchaseReturn" && (
                      <PartySummaryPurchaseReturn
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "purchaseOrder" && (
                      <PartySummaryPurchaseOrder
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "salesReturn" && (
                      <PartySummarySalesReturn
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "salesOrder" && (
                      <PartySummarySalesOrder
                        filter={filter.filter}
                      />
                    )
                  }

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
