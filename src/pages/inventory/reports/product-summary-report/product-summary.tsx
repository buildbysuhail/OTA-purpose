import { Fragment, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import ProductSummaryFilter, { ProductSummaryFilterInitialState } from "./product-summary-filter";

interface ProductSummary {
  vNo: string;
  vPrefix: string;
  voucherType: string;
  voucherForm: string;
  date: string;
  ledgerName: string;
  partyName: string;
  address1: string;
  quantity: number;
  unitName: string;
  unitPrice: number;
  grossValue: number;
  rateWithTax: number;
  netValue: number;
  totalVatAmount: number;
  netAmount: number;
}

const ProductSummary = () => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<any>(ProductSummaryFilterInitialState);

  const columns: DevGridColumn[] = [
    {
      dataField: "vNo",
      caption: t("vno"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
    },
    {
      dataField: "vPrefix",
      caption: t("v_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 75,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 75,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "address1",
      caption: t("address"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "voucherForm",
      caption: t("voucher_form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 75,
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 48,
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "unitPrice",
      caption: t("unit_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
    },
    {
      dataField: "grossValue",
      caption: t("gross_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "rateWithTax",
      caption: t("cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "netValue",
      caption: t("net_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "totalVatAmount",
      caption: t("total_vat_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "number",
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
      width: 100,
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
      column: "netValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "netAmount",
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
                moreOption
                gridHeader={t("product_summary")}
                dataUrl={Urls.product_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<ProductSummaryFilter />}
                filterHeight={270}
                filterWidth={600}
                filterInitialData={ProductSummaryFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_product_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductSummary;