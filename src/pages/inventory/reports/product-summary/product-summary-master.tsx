import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useRef, useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import { Tab, Tabs } from "@mui/material";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import moment from "moment";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ProductSummaryReportByTransaction from "./product-summary-report-by-transaction";
import ProductSummaryReport from "./product-summary-report-basic-info";
import ProductSummaryReportStockLedger from "./product-summary-report-stock-ledger";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import React from "react";
import { APIClient } from "../../../../helpers/api-client";

export interface ProductSummaryFilter {
  filter: {
    dateFrom: Date;
    dateTo: Date;
    productID: number;
    productBatchID: number;
    warehouseID: number;
    showBatchWise: boolean;
    voucherType: string;
    productCode: string;
  };
}

export interface ProductSummaryRef {
  reloadData: () => void;
}
const api = new APIClient();
interface ProductSummaryMasterProps {
  productID?: number;
  getFieldProps: any;
  handleFieldChange: any;
  formState: any;
}

const ProductSummaryMaster = ({
  productID,
  getFieldProps,
  handleFieldChange,
  formState,
}: ProductSummaryMasterProps) => {
  const childRef = useRef<ProductSummaryRef>(null);
  const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  const dispatch = useAppDispatch();
  const [reload, setReload] = useState<boolean>(true);
  const [reload2, setReload2] = useState<boolean>(true);
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<ProductSummaryFilter>({
    filter: {
      dateFrom: moment().local().subtract(90, "days").toDate(),
      dateTo: new Date(),
      productID: 1,
      productBatchID: 0,
      voucherType: "PI",
      productCode: "",
      warehouseID: 0,
      showBatchWise: true,
    },
  });
  const [_filter, _setFilter] = useState<ProductSummaryFilter>({
    filter: {
      dateFrom: moment().local().subtract(90, "days").toDate(),
      dateTo: new Date(),
      productID: 1,
      productBatchID: 0,
      voucherType: "PI",
      productCode: "",
      warehouseID: 0,
      showBatchWise: false,
    },
  });

  const [batchID, setBatchID] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [activeId, setActiveId] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue == "basicInfo") {
      setReload(true)
      setReload2(true)
    }
    setActiveTab(newValue);
  };

  const popupData = useSelector((state: RootState) => state.PopupData);
  // const onKeyChange = (id: any) => {
  //   setActiveId(id);
  //   // dispatch(updateProductSummaryData({...popupData.productSummaryReport, key: id} ));
  // }
  const activeIdRef = useRef<number | null>(null);

  const onKeyChange = (id: any) => {
    activeIdRef.current = id;
    // Optionally, call any side effects here without causing a re-render
    // e.g., dispatch(updateProductSummaryData({...popupData.productSummaryReport, key: id}));
  };
  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-x-6">
        <div className="col-span-1">
          <div className="">
            <div className="p-2 md:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 md:gap-4">
                <ERPDateInput
                  id="dateFrom"
                  value={filter.filter.dateFrom}
                  customSize="sm"
                  className="w-full sm:max-w-[150px]"
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
                  className="w-full sm:max-w-[150px]"
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
                <ERPInput
                  id="productCode"
                  value={filter.filter.productCode}
                  customSize="sm"
                  data={filter.filter}
                  className="w-full sm:max-w-[200px]"
                  label={t("product_code")}
                  onChangeData={(val: any) =>
                    setFilter((prev: any) => ({
                      ...prev,
                      filter: {
                        ...prev.filter,
                        productCode: val.productCode,
                      },
                    }))
                  }

                  onEnterKeyDown={async (e: any) => {
                    console.log("Enter key pressed",e.target.value);
                    
                   const val = await api.getAsync(`${Urls.summary_product_code}${e.target.value}`);
                   if(val){
                     setFilter((prev: any) => ({
                      ...prev,
                      filter: {
                        ...prev.filter,
                        productID:val,
                      },
                    }))
                   }
                  }}
                  disableEnterNavigation


                />
                <ERPDataCombobox
                  id="productID"
                  value={filter.filter.productID}
                  customSize="sm"
                  className="min-w-[300px]"
                  data={filter.filter}
                  label={t("product")}
                  field={{
                    id: "productID",
                    getListUrl: Urls.data_products,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) =>
                    setFilter((prev: any) => ({
                      ...prev,
                      filter: {
                        ...prev.filter,
                        productID: data.productID,
                      },
                    }))
                  }
                />
                {
                  applicationSettings.inventorySettings?.maintainWarehouse == true && (
                    <ERPDataCombobox
                      id="warehouseID"
                      value={filter.filter.warehouseID}
                      customSize="sm"
                      className="min-w-[300px]"
                      data={filter.filter}
                      label={t("warehouse")}
                      field={{
                        id: "warehouseID",
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      onChangeData={(data: any) =>
                        setFilter((prev: any) => ({
                          ...prev,
                          filter: {
                            ...prev.filter,
                            warehouseID: data.warehouseID,
                          },
                        }))
                      }
                    />
                  )
                }
                <div className="flex items-center">
                  <ERPCheckbox
                    id="showBatchWise"
                    label={t("show_batch_wise")}
                    checked={filter.filter.showBatchWise}
                    data={filter.filter}
                    onChangeData={(data: any) => {
                      return setFilter((prev: any) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          showBatchWise: data.showBatchWise,
                        },
                      }))
                    }}
                  />
                </div>
                <div className="mt-[24px] sm:mt-0 sm:self-end">
                  <ERPButton
                    type="button"
                    variant="primary"
                    className="h-[32px] w-full sm:w-auto"
                    onClick={() => {
                      setReload(true)
                      setReload2(true)
                      // First, turn the reload flags off
                      _setFilter(filter);
                      //  Promise.resolve().then(() => setReload(true));
                    }}
                    title={t("show")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="overflow-x-auto">
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="min-w-full">
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("basic_info")} value="basicInfo" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("stock_ledger")} value="stockLedger" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("purchase")} value="purchase" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("sales")} value="sales" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("purchase_return")} value="purchase_return" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("purchase_order")} value="purchase_order" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("sales_return")} value="sales_return" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("sales_order")} value="sales_order" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("damage")} value="damage" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("excess")} value="excess" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("shortage")} value="shortage" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("op_stock")} value="op_stock" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("purchase_estimate")} value="purchase_estimate" />
                    <Tab className="dark:text-dark-text text-xs md:text-sm" label={t("others")} value="others" />
                  </Tabs>
                </div>

                <div className="pt-2">
                  {
                    activeTab === "basicInfo" && (
                      <ProductSummaryReport onKeyChange={onKeyChange}
                        filter={_filter}
                        onReloadChange={() => { setReload(false) }}
                        reloadBase={reload} onReloadChange2={() => setReload2(false)} reloadBase2={reload2}
                      />
                    )
                  }

                  {
                    activeTab === "stockLedger" && (
                      <ProductSummaryReportStockLedger
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload}
                      />
                    )
                  }

                  {
                    activeTab === "purchase" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload}
                        voucherType={"PI"}
                      />
                    )
                  }

                  {
                    activeTab === "sales" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"SI"}
                      />
                    )
                  }

                  {
                    activeTab === "purchase_return" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"PR"}
                      />
                    )
                  }

                  {
                    activeTab === "purchase_order" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"PO"}
                      />
                    )
                  }

                  {
                    activeTab === "sales_return" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"SR"}
                      />
                    )
                  }

                  {
                    activeTab === "sales_order" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"SO"}
                      />
                    )
                  }

                  {
                    activeTab === "damage" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"DMG"}
                      />
                    )
                  }

                  {
                    activeTab === "excess" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"EX"}
                      />
                    )
                  }

                  {
                    activeTab === "shortage" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"SH"}
                      />
                    )
                  }

                  {
                    activeTab === "op_stock" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"OS"}
                      />
                    )
                  }

                  {
                    activeTab === "purchase_estimate" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"PE"}
                      />
                    )
                  }

                  {
                    activeTab === "others" && (
                      <ProductSummaryReportByTransaction
                        filter={{
                          ...filter, filter: {
                            ...filter.filter,
                            productBatchID: activeIdRef.current ?? 0
                          }
                        }} setFilter={setFilter} onReloadChange={() => setReload(false)} reloadBase={reload} voucherType={"OT"}
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

export default React.memo(ProductSummaryMaster);
