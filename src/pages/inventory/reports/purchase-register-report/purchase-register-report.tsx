import { Fragment, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";

interface PurchaseRegisterReport {
  from: Date
}
const PurchaseRegisterReport = () => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<PurchaseRegisterReport>({ from: new Date() });
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 125,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "manualBarcode",
      caption: t("manual_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 88,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 165,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 54,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 183,
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 104,
    },
    {
      dataField: "unitPrice1",
      caption: t("unit_price_1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 61,
    },
    {
      dataField: "quantity",
      caption: t('quantity'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "free",
      caption: t("free"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
    },
    {
      dataField: "unitCode",
      caption: t("unit_code"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 43,
    },
    {
      dataField: "unitPrice",
      caption: t("unit_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 92,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 86,
    },
    {
      dataField: "stdSalesPrice",
      caption: t("std_sales_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 87,
    },
    {
      dataField: "costCentreName",
      caption: t("cost_centre_name"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "netValue",
      caption: t("net_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 105,
    },
    {
      dataField: "additionalExpenses",
      caption: t("additional_expenses"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "grossValue",
      caption: t("gross_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "warrantyPeriod",
      caption: t("warranty_period"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "VAT",
      caption: t("vat"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "freeValue",
      caption: t("free_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "cost",
      caption: t("cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "freeCost",
      caption: t("free_cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "totalProfit",
      caption: t("total_profit"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "category",
      caption: t("category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "totalDiscount",
      caption: t("total_discount"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "purchaseInvoice",
      caption: t("purchase_invoice"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "color",
      caption: t("color"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "expiryDate",
      caption: t("expiry_date"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "employeeName",
      caption: t("employee_name"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "qtyNos",
      caption: t("qty_nos"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productDescription",
      caption: t("product_description"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },

    {
      dataField: "sectionName",
      caption: t("section_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "MRP",
      caption: t("mrp"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "stdPurchasePrice",
      caption: t("std_purchase_price"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "groupCategory",
      caption: t("group_category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "categoryCode",
      caption: t("category_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "autoBarcode",
      caption: t("autobarcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
    },
    {
      dataField: "productGroup",
      caption: t("product_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "batchNo",
      caption: t("batch_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "XRate",
      caption: t("x_rate"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "detailID",
      caption: t("detail_ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "VATNumber",
      caption: t("vat_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "specification",
      caption: t("specification"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "autoBarcode1",
      caption: t("autobarcode1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "counterName",
      caption: t("counter_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "schemeDisc",
      caption: t("scheme_disc"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "batchNo",
      caption: t("batch_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "warranty",
      caption: t("warranty"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "masterID",
      caption: t("master_ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "exciseTax",
      caption: t("excise_tax"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("purchase_register_report")}
                  dataUrl={Urls.acc_reports_ledger}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  hideGridAddButton={true}
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseRegisterReport;