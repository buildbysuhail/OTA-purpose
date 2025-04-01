import React, { Fragment } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { ProductSummaryFilter } from "./product-summary-master";

interface ProductSummaryReportStockLedger {
  siNo: number;
  date: string;
  particulars: string;
  voucherType: string;
  form: string;
  voucherNo: string;
  inwardQty: number;
  outwardQty: number;
  balance: number;
  unit: string;
  prefix: string;
}

const ProductSummaryReportStockLedger: React.FC<ProductSummaryFilter> = ({ filter }) => {
  const { t } = useTranslation("accountsReport");

  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 40,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
    },
    {
      dataField: "voucherNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "inwardQty",
      caption: t("inward_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "outwardQty",
      caption: t("outward_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "prefix",
      caption: t("prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    }
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = (itemInfo: { value: any }) => {
    const value = itemInfo.value;
    if (value === null || value === undefined || value === "" || isNaN(value)) {
      return "0";
    }
    return getFormattedValue(value) || "0";
  };

  const summaryItems: SummaryConfig[] = [
    {
      column: "inwardQty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "outwardQty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "balance",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                gridHeader={t("product_summary_stock_ledger")}
                dataUrl={Urls.product_summary_stock_ledger}
                method={ActionType.POST}
                gridId="grd_product_summary_stock_ledger"
                hideGridAddButton={true}
                postData={filter}
                filterHeight={270}
                filterWidth={600}
                reload={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductSummaryReportStockLedger;