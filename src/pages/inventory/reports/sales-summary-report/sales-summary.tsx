import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import SalesSummaryFilter, { SalesSummaryFilterInitialState } from "./sales-summary-filter";

interface SalesSummary {
  date: string;
  vchNo: string;
  form: string;
  party: string;
  address1: string;
  address2: string;
  gross: number;
  disc: number;
  billDiscount: number;
  vat: number;
  grandTotal: number;
  cashDiscount: number;
  adjustmentAmount: number;
  cashAmt: number;
  creditAmt: number;
  bankAmt: number;
  financialYearID: number;
  exchangeRate: number;
  couponAmt: number;
  masterID: number;
  branch: string;
  mInvoiceNo: string;
  refNo: string;
  refNo2: string;
  refDate: Date;
  salesmanName: string;
  warehouseName: string;
  roundAmount: number;
  taxNumber: string;
  taxOnDiscount: number;
  netValue: number;
  si: number;
  createdDate: Date;
  remarks: string;
  routeName: string;
  mobileNumber: string;
  totalExciseTax: number;
  srAmount: number;
  toWarehouseName: string;
}

const SalesSummary = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 75,
    },
    {
      dataField: "vchNo",
      caption: t("vch_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 50,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 75,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "gross",
      caption: t("gross"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
    },
    {
      dataField: "disc",
      caption: t("disc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
    },
    {
      dataField: "billDiscount",
      caption: t("bill_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
    },
    {
      dataField: "cashDiscount",
      caption: t("cash_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "adjustmentAmount",
      caption: t("adjustment_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "cashAmt",
      caption: t("cash_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "creditAmt",
      caption: t("credit_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "bankAmt",
      caption: t("bank_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "exchangeRate",
      caption: t("exchange_rate"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "couponAmt",
      caption: t("coupon_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "masterID",
      caption: t("master_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "mInvoiceNo",
      caption: t("m_invoice_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "refNo2",
      caption: t("ref_no2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "salesmanName",
      caption: t("salesman_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "warehouseName",
      caption: t("warehouse_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "roundAmount",
      caption: t("round_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "taxNumber",
      caption: t("tax_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "taxOnDiscount",
      caption: t("tax_on_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "netValue",
      caption: t("net_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
    },
    {
      dataField: "si",
      caption: t("si"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "mobileNumber",
      caption: t("mobile_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "totalExciseTax",
      caption: t("total_excise_tax"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "srAmount",
      caption: t("sr_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "toWarehouseName",
      caption: t("to_warehouse_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    }
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (value === null || value === undefined || value === "" || isNaN(value)) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "gross",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "grandTotal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "netValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption={true}
                gridHeader={t("sales_summary_report")}
                dataUrl={Urls.sales_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<SalesSummaryFilter />}
                filterWidth={360}
                filterHeight={260}
                filterInitialData={SalesSummaryFilterInitialState}
                reload={true}
                gridId="grd_sales_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default SalesSummary;