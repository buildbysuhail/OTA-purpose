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

export interface ProductSummaryFilter {
  filter: {
    dateFrom: Date;
    dateTo: Date;
    productID: number;
    productBatchID: number;
    warehouseID: number;
    showBatchWise: boolean;
    voucherType: string;
  };
}

export interface ProductSummaryRef {
  reloadData: () => void;
}

const ProductSummaryMaster = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const childRef = useRef<ProductSummaryRef>(null);
const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  const dispatch = useAppDispatch();
  const [reload, setReload] = useState<boolean>(false);
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<ProductSummaryFilter>({
    filter: {
      dateFrom: moment().local().subtract(90, "days").toDate(),
      dateTo: new Date(),
      productID: 1,
      productBatchID: 0,
      voucherType:"PI",
      warehouseID: 0,
      showBatchWise: false,
    },
  });

  const [activeTab, setActiveTab] = useState("basicInfo");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };


  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
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
                <ERPInput
                  id="productBatchID"
                  value={filter.filter.productBatchID}
                  customSize="sm"
                  className="max-w-[200px]"
                  label={t("product_code")}
                  onChangeData={(val: string) =>
                    setFilter((prev: any) => ({
                      ...prev,
                      filter: {
                        ...prev.filter,
                        productBatchID: val,
                      },
                    }))
                  }
                />
                <ERPDataCombobox
                  id="productID"
                  value={filter.filter.productID}
                  customSize="sm"
                  className="min-w-[325px]"
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
                  className="min-w-[325px]"
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
              )}
                <ERPCheckbox
                  id="showBatchWise"
                  label={t("show_batch_wise")}
                  checked={filter.filter.showBatchWise}
                  onChangeData={(data: any) =>
                    setFilter((prev: any) => ({
                      ...prev,
                      filter: {
                        ...prev.filter,
                        showBatchWise: data.showBatchWise,
                      },
                    }))
                  }
                />
                <div className="mt-[24px]">
                  <ERPButton
                    type="button"
                    variant="primary"
                    className="h-[32px]"
                    onClick={() =>{ 
                      setReload(true)
                    }}
                    title={t("show")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto">
                  <Tab className="dark:text-dark-text" label={t("basic_info")} value="basicInfo" />
                  <Tab className="dark:text-dark-text" label={t("stock_ledger")} value="stockLedger" />
                  <Tab className="dark:text-dark-text" label={t("purchase")} value="purchase" />
                  <Tab className="dark:text-dark-text" label={t("sales")} value="sales" />
                  <Tab className="dark:text-dark-text" label={t("purchase_return")} value="purchase_return" />
                  <Tab className="dark:text-dark-text" label={t("purchase_order")} value="purchase_order" />
                  <Tab className="dark:text-dark-text" label={t("sales_return")} value="sales_return" />
                  <Tab className="dark:text-dark-text" label={t("sales_order")} value="sales_order" />
                  <Tab className="dark:text-dark-text" label={t("damage")} value="damage" />
                  <Tab className="dark:text-dark-text" label={t("excess")} value="excess" />
                  <Tab className="dark:text-dark-text" label={t("shortage")} value="shortage" />
                  <Tab className="dark:text-dark-text" label={t("op_stock")} value="op_stock" />
                  <Tab className="dark:text-dark-text" label={t("purchase_estimate")} value="purchase_estimate" />
                  <Tab className="dark:text-dark-text" label={t("others")} value="others" />
                </Tabs>
                <div className="pt-2">
                  {
                    activeTab === "basicInfo" && (
                      <ProductSummaryReport
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      />
                    )
                  }

                  {
                    activeTab === "stockLedger" && (
                      <ProductSummaryReportStockLedger
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      />
                    )
                  }

                  {
                    activeTab === "purchase" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"PI"}
                      />
                    )
                  }
                    {
                    activeTab === "sales" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"SI"}
                      />
                    )
                  }
                    {
                    activeTab === "purchase_return" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"PR"}
                      />
                    )
                  }
                    {
                    activeTab === "purchase_order" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"PO"}
                      />
                    )
                  }
                    {
                    activeTab === "sales_return" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"SR"}
                      />
                    )
                  }
                    {
                    activeTab === "sales_order" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"SO"}
                      />
                    )
                  }
                    {
                    activeTab === "damage" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"DMG"}
                      />
                    )
                  }
                    {
                    activeTab === "excess" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"EX"}
                      />
                    )
                  }
                    {
                    activeTab === "shortage" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"SH"}
                      />
                    )
                  }
                    {
                    activeTab === "op_stock" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"OS"}
                      />
                    )
                  }
                    {
                    activeTab === "purchase_estimate" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"PE"}
                      />
                    )
                  }
                    {
                    activeTab === "others" && (
                      <ProductSummaryReportByTransaction
                      filter={filter} setFilter={setFilter} onReloadChange={()=> setReload(false)} reloadBase={reload}
                      voucherType={"OT"}
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

export default ProductSummaryMaster;