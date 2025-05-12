import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import PurchaseRegisterFilter, {
  PurchaseRegisterFilterInitialState,
} from "./purchase-register-report-filter";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface RegisterProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}

const RegisterReport: FC<RegisterProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(PurchaseRegisterFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const onApplyFilter = useCallback((_filter: any) => {
    setFilter({ ..._filter });
  }, []);
  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
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
        showInPdf: true,
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
        showInPdf: true,
      },
      {
        dataField: "form",
        caption: t("form"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        showInPdf: true,
      },
      {
        dataField: "party",
        caption: t("party"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "address1",
        caption: t("address1"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
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
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.unitPrice == null
                ? ""
                : getFormattedValue(cellElement.data.unitPrice, false, 3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.unitPrice == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.unitPrice),
                  false,
                  3
                );
          }
        },
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
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        visible: false,
      },
      {
        dataField: "product",
        caption: t("product"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
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
        visible: false,
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
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.quantity == null
                ? ""
                : getFormattedValue(cellElement.data.quantity, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.quantity == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.quantity),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "free",
        caption: t("free"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 60,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.free == null
                ? ""
                : getFormattedValue(cellElement.data.free, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.free == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.free), false, 4);
          }
        },
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
        dataField: "vat",
        caption: t("vat"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.vat == null
                ? ""
                : getFormattedValue(cellElement.data.vat, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.vat == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.vat), false, 4);
          }
        },
      },
      {
        dataField: "netAmount",
        caption: t("net_amount"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.netAmount == null
                ? ""
                : getFormattedValue(cellElement.data.netAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netAmount == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.netAmount));
          }
        },
      },
      {
        dataField: "freeValue",
        caption: t("free_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.freeValue == null
                ? ""
                : getFormattedValue(cellElement.data.freeValue, false, 7);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.freeValue == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.freeValue),
                  false,
                  7
                );
          }
        },
      },
      {
        dataField: "cost",
        caption: t("cost"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cost == null
                ? ""
                : getFormattedValue(cellElement.data.cost, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cost == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cost), false, 4);
          }
        },
      },
      {
        dataField: "freeCost",
        caption: t("free_cost"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.freeCost == null
                ? ""
                : getFormattedValue(cellElement.data.freeCost, false, 8);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.freeCost == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.freeCost),
                  false,
                  8
                );
          }
        },
      },
      {
        dataField: "totalProfit",
        caption: t("total_profit"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.totalProfit == null
                ? ""
                : getFormattedValue(cellElement.data.totalProfit);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalProfit == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.totalProfit));
          }
        },
      },
      {
        dataField: "specification",
        caption: t("specification"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
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
        showInPdf: true,
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
        dataField: "xRate",
        caption: t("x_rate"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        // visible: false,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.xRate == null
                ? ""
                : getFormattedValue(cellElement.data.xRate, false, 6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.xRate == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.xRate), false, 6);
          }
        },
      },
      {
        dataField: "autoBarcode",
        caption: t("autobarcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 90,
        showInPdf: true,
      },
      {
        dataField: "additionalExpense",
        caption: t("additional_expenses"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.additionalExpense == null
                ? ""
                : getFormattedValue(cellElement.data.additionalExpense);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.additionalExpense == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.additionalExpense)
                );
          }
        },
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
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.qtyNos == null
                ? "0"
                : cellElement.data.qtyNos.toString();
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.qtyNos == null
              ? ""
              : cellElement.data.qtyNos.toString();
          }
        },
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.mrp == null
                ? ""
                : getFormattedValue(cellElement.data.mrp, false, 3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.mrp == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.mrp), false, 3);
          }
        },
      },
      {
        dataField: "groupCategoryName",
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
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stdPurchasePrice == null
                ? ""
                : getFormattedValue(cellElement.data.stdPurchasePrice);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stdPurchasePrice == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.stdPurchasePrice)
                );
          }
        },
      },
      {
        dataField: "stdSalesPrice",
        caption: t("std_sales_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stdSalesPrice == null
                ? ""
                : getFormattedValue(cellElement.data.stdSalesPrice);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stdSalesPrice == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.stdSalesPrice));
          }
        },
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
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.totalDiscount == null
                ? ""
                : getFormattedValue(cellElement.data.totalDiscount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalDiscount == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.totalDiscount));
          }
        },
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.netValue == null
                ? ""
                : getFormattedValue(cellElement.data.netValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netValue == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.netValue));
          }
        },
      },
      {
        dataField: "grossValue",
        caption: t("gross_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.grossValue == null
                ? ""
                : getFormattedValue(cellElement.data.grossValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.grossValue == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.grossValue));
          }
        },
      },
      {
        dataField: "vatNumber",
        caption: t("vat_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "manualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
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
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.schemeDisc == null
                ? ""
                : getFormattedValue(cellElement.data.schemeDisc);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.schemeDisc == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.schemeDisc));
          }
        },
      },
      {
        dataField: "exciseTax",
        caption: t("excise_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.exciseTax == null
                ? ""
                : getFormattedValue(cellElement.data.exciseTax);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.exciseTax == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.exciseTax));
          }
        },
      },
      {
        dataField: "vNUM",
        caption: t("VNUM"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "cgstPerc",
        caption: t("CGST %"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cgstPerc == null
                ? ""
                : getFormattedValue(cellElement.data.cgstPerc, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cgstPerc == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.cgstPerc),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "cgst",
        caption: t("CGST"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cgst == null
                ? ""
                : getFormattedValue(cellElement.data.cgst, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cgst == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cgst), false, 4);
          }
        },
      },
      {
        dataField: "sgstPerc",
        caption: t("SGST %"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.sgstPerc == null
                ? ""
                : getFormattedValue(cellElement.data.sgstPerc, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sgstPerc == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.sgstPerc),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "sgst",
        caption: t("SGST"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.sgst == null
                ? ""
                : getFormattedValue(cellElement.data.sgst, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sgst == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sgst), false, 4);
          }
        },
      },
      {
        dataField: "igstPerc",
        caption: t("IGST %"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.igstPerc == null
                ? ""
                : getFormattedValue(cellElement.data.igstPerc, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.igstPerc == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.igstPerc),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "igst",
        caption: t("IGST"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.igst == null
                ? ""
                : getFormattedValue(cellElement.data.igst, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.igst == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.igst), false, 4);
          }
        },
      },
      {
        dataField: "gstPercent",
        caption: t("GST %"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.gstPercent == null
                ? ""
                : getFormattedValue(cellElement.data.gstPercent, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.gstPercent == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.gstPercent),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "gstAmt",
        caption: t("GST Amt"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.gstAmt == null
                ? ""
                : getFormattedValue(cellElement.data.gstAmt, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.gstAmt == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.gstAmt),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "hsnCode",
        caption: t("HSNCode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "gstin",
        caption: t("GSTIN"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "salesPrice",
        caption: t("SalesPrice"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.salesPrice == null
                ? ""
                : getFormattedValue(cellElement.data.salesPrice);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesPrice == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.salesPrice));
          }
        },
      },
      {
        dataField: "remarks",
        caption: t("Remarks"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cessPerc",
        caption: t("Cess %"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cessPerc == null
                ? ""
                : getFormattedValue(cellElement.data.cessPerc, false, 2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cessPerc == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.cessPerc),
                  false,
                  2
                );
          }
        },
      },
      {
        dataField: "cessAmt",
        caption: t("Cess"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cessAmt == null
                ? ""
                : getFormattedValue(cellElement.data.cessAmt, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cessAmt == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.cessAmt),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "additionalCessPerc",
        caption: t("Additional Cess %"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.additionalCessPerc == null
                ? ""
                : getFormattedValue(
                    cellElement.data.additionalCessPerc,
                    false,
                    4
                  );
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.additionalCessPerc == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.additionalCessPerc),
                  false,
                  4
                );
          }
        },
      },
      {
        dataField: "additionalCess",
        caption: t("Additional Cess"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.additionalCess == null
                ? ""
                : getFormattedValue(cellElement.data.additionalCess, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.additionalCess == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.additionalCess),
                  false,
                  4
                );
          }
        },
      },
      // {
      //   dataField: "taxNo",
      //   caption: t("TaxNo"),
      //   dataType: "string",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },
      {
        dataField: "gstNo",
        caption: t("GSTNo"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      // {
      //   dataField: "sl",
      //   caption: t("Sl"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },
      // {
      //   dataField: "unitName",
      //   caption: t("UnitName"),
      //   dataType: "string",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },
      {
        dataField: "priceCategoryID",
        caption: t("PriceCategoryID"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible: false,
      },
      // {
      //   dataField: "totalProfitPercent",
      //   caption: t("Total Profit%"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      //   cellRender: (
      //     cellElement: any,
      //     cellInfo: any,
      //     filter: any,
      //     exportCell: any
      //   ) => {
      //     if (exportCell != undefined) {
      //       const value =
      //         cellElement.data?.totalProfitPercent == null
      //           ? ""
      //           : getFormattedValue(
      //             cellElement.data.totalProfitPercent,
      //             false,
      //             2
      //           );
      //       return {
      //         ...exportCell,
      //         text: value,
      //         alignment: "right",
      //         alignmentExcel: { horizontal: "right" },
      //       };
      //     } else {
      //       return cellElement.data?.totalProfitPercent == null
      //         ? ""
      //         : getFormattedValue(
      //           parseFloat(cellElement.data.totalProfitPercent),
      //           false,
      //           2
      //         );
      //     }
      //   },
      // },
      // {
      //   dataField: "avgPrice",
      //   caption: t("AvgPrice"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      //   cellRender: (
      //     cellElement: any,
      //     cellInfo: any,
      //     filter: any,
      //     exportCell: any
      //   ) => {
      //     if (exportCell != undefined) {
      //       const value =
      //         cellElement.data?.avgPrice == null
      //           ? ""
      //           : getFormattedValue(cellElement.data.avgPrice);
      //       return {
      //         ...exportCell,
      //         text: value,
      //         alignment: "right",
      //         alignmentExcel: { horizontal: "right" },
      //       };
      //     } else {
      //       return cellElement.data?.avgPrice == null
      //         ? ""
      //         : getFormattedValue(parseFloat(cellElement.data.avgPrice));
      //     }
      //   },
      // },
      {
        dataField: "referenceNumber",
        caption: t("ReferenceNumber"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "baseUnitQuantity",
        caption: t("BaseUnitQuantity"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.baseUnitQuantity == null
                ? ""
                : getFormattedValue(cellElement.data.baseUnitQuantity);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.baseUnitQuantity == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.baseUnitQuantity)
                );
          }
        },
      },
    ];
    // Filter columns based on the `visible` property
    return baseColumns
      .filter((column) => {
        // if (column.dataField == "xRate") {
        //   return filter.voucherForm == "Import";
        // }
        if (column.dataField == "baseUnitQuantity") {
          return userSession.dbIdValue == "543140180640";
        }
        if (column.dataField == "vat") {
          return !clientSession.isAppGlobal;
        }
        if (
          [
            "cgstPerc",
            "cgst",
            "sgstPerc",
            "sgst",
            "igstPerc",
            "igst",
            "gstPercent",
            "gstAmt",
            "hsnCode",
            "gstin",
            "vNUM",
            "remarks",
            "cessPerc",
            "cessAmt",
            "additionalCessPerc",
            "additionalCess",
            "gstNo",
            "priceCategoryID",
            "referenceNumber",
          ].includes(column.dataField ?? "")
        ) {
          return clientSession.isAppGlobal;
        }
        return true;
      })
      .map((column) => {
        if (column.dataField == "uPI" && !clientSession.isAppGlobal) {
          return {
            ...column,
            caption: "QRPay",
          };
        }
        if (column.dataField == "xRate" && filter.voucherForm != "Import") {
          return {
            ...column,
            visible: false,
          };
        }
        return column;
      });
  }, [t, filter, userSession.dbIdValue]);
  // Filter columns based on the `visible` property
  //   return baseColumns.filter((column) => {
  //     if (column.dataField == "xRate") {
  //       return filter.voucherForm == "Import";
  //     }
  //     if (column.dataField == "baseUnitQuantity") {
  //       return userSession.dbIdValue == "543140180640";
  //     }
  //     if (column.dataField == "vat") {
  //       return !clientSession.isAppGlobal;
  //     }
  //     if (["CGSTPerc", "CGST", "SGSTPerc", "SGST", "IGSTPerc", "IGST", "GSTPercent", "GSTAmt",
  //       "HSNCode", "GSTIN", "SalesPrice", "Remarks", "CessPerc", "CessAmt", "AdditionalCessPerc",
  //       "AdditionalCess", "TaxNo", "GSTNo", "Sl", "UnitName", "PriceCategoryID", "TotalProfitPercent",
  //       "AvgPrice", "ReferenceNumber", "BaseUnitQuantity"].includes(column.dataField??"")) {
  //      return false;
  //  }
  //     return true;
  //   });
  // }, [t, filter]);
  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(parseFloat(value)) || "0";
    };
  }, [getFormattedValue]);
  const customizeSummaryRow4 = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(parseFloat(value), false, 4) || "0";
    };
  }, [getFormattedValue]);

  const customizeSummaryRowString = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return value.toString() || "0";
    };
  }, [getFormattedValue]);

  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = useMemo(() => {
    const _summaryItems: SummaryConfig[] = [
      {
        column: "party",
        summaryType: "max",
        customizeText: customizeDate,
      },
      {
        column: "totalProfit",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "netAmount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "additionalExpenses",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //is not is appglobal + 4 decimal
      {
        column: "vat",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow4,
      },
      {
        column: "stdPurchasePrice",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "stdSalesPrice",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "quantity",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "free",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "freeValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "freeCost",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "qtyNos",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "xRate",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "additionalExpense",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //.DBID_VALUE == "543140180640"
      {
        column: "baseUnitQuantity",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "totalDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "grossValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "netValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "schemeDisc",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "exciseTax",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
    ];
    return _summaryItems.filter((column) => {
      return true;
    });
  }, [t, filter, userSession.dbIdValue]);

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
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
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
                gridId={gridId}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterReport;
