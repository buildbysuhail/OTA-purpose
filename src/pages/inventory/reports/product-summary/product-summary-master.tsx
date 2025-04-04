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
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<ProductSummaryFilter>({
    filter: {
      dateFrom: moment().local().subtract(90, "days").toDate(),
      dateTo: new Date(),
      productID: 0,
      productBatchID: 0,
      warehouseID: 0,
      showBatchWise: false,
    },
  });

  const [activeTab, setActiveTab] = useState("basicInfo");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleShowButtonClick = () => {
    if (childRef.current) {
      childRef.current.reloadData();
    }
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
                    onClick={handleShowButtonClick}
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
                  <Tab className="dark:text-dark-text" label={t("transaction")} value="transaction" />
                </Tabs>
                <div className="pt-2">
                  {
                    activeTab === "basicInfo" && (
                      <ProductSummaryReport
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "stockLedger" && (
                      <ProductSummaryReportStockLedger
                        filter={filter.filter}
                      />
                    )
                  }

                  {
                    activeTab === "transaction" && (
                      <ProductSummaryReportByTransaction
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

export default ProductSummaryMaster;