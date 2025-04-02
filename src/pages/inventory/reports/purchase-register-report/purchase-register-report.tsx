import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import PurchaseRegisterFilter, { PurchaseRegisterFilterInitialState } from "./purchase-register-report-filter";
import moment from "moment";

interface PurchaseRegisterReport {
  masterID: number;
  date: string;
  vchNo: string;
  form: string;
  party: string;
  address1: string;
  address2: string;
  detailID: number;
  unitPrice: number;
  batchNo: string;
  productCode: string;
  product: string;
  productGroup: string;
  brand: string;
  categoryCode: string;
  category: string;
  quantity: number;
  free: number;
  unitCode: string;
  unitPrice1: number;
  vat: number;
  netAmount: number;
  freeValue: number;
  cost: number;
  freeCost: number;
  totalProfit: number;
  specification: string;
  counterName: string;
  routeName: string;
  financialYearID: number;
  XRate: number;
  autoBarcode: string;
  additionalExpenses: number;
  branchName: string;
  productDescription: string;
  color: string;
  warranty: string;
  qtyNos: number;
  mrp: number;
  groupCategory: string;
  sectionName: string;
  stdPurchasePrice: number;
  stdSalesPrice: number;
  employeeName: string;
  expiryDate: Date | null;
  batchNoAgain: string;
  warrantyPeriod: string;
  costCentreName: string;
  totalDiscount: number;
  netValue: number;
  grossValue: number;
  VATNumber: string;
  autoBarcode1: string;
  manualBarcode: string;
  purchaseInvoice: string;
  schemeDisc: number;
  exciseTax: number;
  from?: Date;
  to?: Date;
  branchId?: number;
  productId?: number;
  partyId?: number;
  financialYearId?: number;
}

const PurchaseRegisterReport = () => {
  const { t } = useTranslation("accountsReport");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(PurchaseRegisterFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const onApplyFilter = useCallback((_filter: any) => { setFilter({ ..._filter }); }, []);
  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const columns: DevGridColumn[] = [
    {
      dataField: "masterID",
      caption: t("master_ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    cellRender: (
            cellElement: any,
            cellInfo: any,
            filter: any,
            exportCell: any
          ) => {
            return cellElement.data.date == null || cellElement.data.date == ""
              ? ""
              : moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY"); // Ensures proper formatting
          },
        },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
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
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      dataField: "detailID",
      caption: t("detail_ID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "unitPrice",
      caption: t("unit_price"),
      dataType: "number",
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
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
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
      dataField: "brand",
      caption: t("brand"),
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
      dataField: "category",
      caption: t("category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
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
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "unitPrice1",
      caption: t("unit_price_1"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "vat",
      caption: t("vat"),
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
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
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
      dataField: "counterName",
      caption: t("counter_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
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
      visible: false,
      width: 100,
    },
    {
      dataField: "XRate",
      caption: t("x_rate"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
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
      dataField: "additionalExpenses",
      caption: t("additional_expenses"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
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
      dataField: "color",
      caption: t("color"),
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
      dataField: "qtyNos",
      caption: t("qty_nos"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "groupCategory",
      caption: t("group_category_name"),
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
      dataField: "stdPurchasePrice",
      caption: t("std_purchase_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "stdSalesPrice",
      caption: t("std_sales_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "employeeName",
      caption: t("employee_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "expiryDate",
      caption: t("expiry_date"),
      dataType: "date",
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
      dataField: "warrantyPeriod",
      caption: t("warranty_period"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "costCentreName",
      caption: t("cost_centre_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "totalDiscount",
      caption: t("total_discount"),
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
      width: 100,
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
      dataField: "VATNumber",
      caption: t("vat_number"),
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
      dataField: "manualBarcode",
      caption: t("manual_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "purchaseInvoiceNumber",
      caption: t("purchase_invoice_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "schemeDisc",
      caption: t("scheme_disc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "exciseTax",
      caption: t("excise_tax"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },

    {
      dataField: "VNUM",
      caption: t("VNUM"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },

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
      column: "netValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cashAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                   filterText=" From : {fromDate} - {toDate} 
                  {productID > 0 && , Product Name : [productName]}
                  {productGroupID > 0 && , Group Name : [groupName]}
                  {brandID > 0 && , Brand : [brand]}
                  {salesRouteID > 0 && , Route Name : [routeName]} 
                  {salesmanID > 0 && , Sales Man : [salesMan]} 
                  {warehouseID > 0 && ,  Warehouse : [warehouse]} 
                  {supplierID > 0 && , Supplier :[supplier]} "
                 
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption
                gridHeader={t("purchase_register_report")}
                dataUrl={Urls.purchase_register_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PurchaseRegisterFilter />}
                filterHeight={690}
                filterWidth={700}
                filterInitialData={PurchaseRegisterFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_purchase_register_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseRegisterReport;
