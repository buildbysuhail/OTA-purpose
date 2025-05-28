import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { SummaryFilterInitialState } from "./summary-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import SummaryFilter from "./summary-report-filter";
import { useLocation } from "react-router-dom";
import { isNullOrUndefinedOrEmpty } from "../../../../utilities/Utils";
interface SummaryProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}

const SummaryReport: FC<SummaryProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<any>(SummaryFilterInitialState);
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "si",
        caption: t("si"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "date",
        caption: t("date"),
        dataType: "date",
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
          return cellElement.data.date == null || cellElement.data.date == ""
            ? ""
            : moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY");
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
        width: 75,
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
        dataField: "gross",
        caption: t("gross"),
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
              cellElement.data?.gross == null
                ? ""
                : getFormattedValue(cellElement.data.gross);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.gross == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.gross));
          }
        },
      },
      {
        dataField: "disc",
        caption: t("disc"),
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
              cellElement.data?.disc == null
                ? ""
                : getFormattedValue(cellElement.data.disc);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.disc == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.disc));
          }
        },
      },
      {
        dataField: "billDiscount",
        caption: t("bill_discount"),
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
              cellElement.data?.billDiscount == null
                ? ""
                : getFormattedValue(cellElement.data.billDiscount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.billDiscount == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.billDiscount));
          }
        },
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
              : getFormattedValue(cellElement.data.vat, false, 4);
          }
        },
      },
      {
        dataField: "grandTotal",
        caption: t("grand_total"),
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
              cellElement.data?.grandTotal == null
                ? ""
                : getFormattedValue(cellElement.data.grandTotal);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.grandTotal == null
              ? ""
              : getFormattedValue(cellElement.data.grandTotal);
          }
        },
      },
      {
        dataField: "cashDiscount",
        caption: t("cash_discount"),
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
              cellElement.data?.cashDiscount == null
                ? ""
                : getFormattedValue(cellElement.data.cashDiscount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cashDiscount == null
              ? ""
              : getFormattedValue(cellElement.data.cashDiscount);
          }
        },
      },
      {
        dataField: "adjustmentAmount",
        caption: t("adjustment_amount"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
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
              cellElement.data?.adjustmentAmount == null
                ? ""
                : getFormattedValue(cellElement.data.adjustmentAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.adjustmentAmount == null
              ? ""
              : getFormattedValue(cellElement.data.adjustmentAmount);
          }
        },
      },
      {
        dataField: "cashAmt",
        caption: t("cash_amount"),
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
              cellElement.data?.cashAmt == null
                ? ""
                : getFormattedValue(cellElement.data.cashAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cashAmt == null
              ? ""
              : getFormattedValue(cellElement.data.cashAmt);
          }
        },
      },
      {
        dataField: "creditAmt",
        caption: t("credit_amount"),
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
              cellElement.data?.creditAmt == null
                ? ""
                : getFormattedValue(cellElement.data.creditAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.creditAmt == null
              ? ""
              : getFormattedValue(cellElement.data.creditAmt);
          }
        },
      },
      {
        dataField: "bankAmt",
        caption: t("bank_amount"),
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
              cellElement.data?.bankAmt == null
                ? ""
                : getFormattedValue(cellElement.data.bankAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.bankAmt == null
              ? ""
              : getFormattedValue(cellElement.data.bankAmt);
          }
        },
      },
      {
        dataField: "cardAmt",
        caption: t("card_amount"),
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
              cellElement.data?.cardAmt == null
                ? 0
                : getFormattedValue(cellElement.data.cardAmt, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cardAmt == null
              ? 0
              : getFormattedValue(cellElement.data.cardAmt, false, 4);
          }
        },
      },
      //if AccountsSettings.AllowMultiPayments start
      {
        dataField: "upi",
        caption: t("upi"),
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
              cellElement.data?.upi == null
                ? 0
                : getFormattedValue(cellElement.data.upi, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.upi == null
              ? 0
              : getFormattedValue(cellElement.data.upi, false, 4);
          }
        },
      },

      {
        dataField: "financialYearID",
        caption: t("financial_year_id"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        width: 100,
      },
      // if (this.VoucherForm != "Import")
      //   {
      //     dgvReport.Columns["ExchangeRate"].Visible = false;
      // }
      {
        dataField: "exchangeRate",
        caption: t("exchange_rate"),
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
              cellElement.data?.exchangeRate == null
                ? ""
                : getFormattedValue(cellElement.data.exchangeRate, false, 6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.exchangeRate == null
              ? ""
              : getFormattedValue(cellElement.data.exchangeRate, false, 6);
          }
        },
      },
      {
        dataField: "couponAmt",
        caption: t("coupon_amount"),
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
              cellElement.data?.couponAmt == null
                ? ""
                : getFormattedValue(cellElement.data.couponAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.couponAmt == null
              ? ""
              : getFormattedValue(cellElement.data.couponAmt);
          }
        },
      },
      {
        dataField: "masterID",
        caption: t("master_id"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        width: 100,
      },
      {
        dataField: "branch",
        caption: t("branch"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "mInvoiceNo",
        caption: t("m_invoice_no"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "refNo",
        caption: t("ref_no"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "refNo2",
        caption: t("ref_no2"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "refDate",
        caption: t("ref_date"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "salesmanName",
        caption: t("salesman_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "warehouseName",
        caption: t("warehouse_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "roundAmount",
        caption: t("round_amount"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
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
              cellElement.data?.roundAmount == null
                ? 0
                : getFormattedValue(cellElement.data.roundAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.roundAmount == null
              ? 0
              : getFormattedValue(cellElement.data.roundAmount);
          }
        },
      },
      {
        dataField: "taxNumber",
        caption: t("tax_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "taxOnDiscount",
        caption: t("tax_on_discount"),
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
              cellElement.data?.taxOnDiscount == null
                ? 0
                : getFormattedValue(cellElement.data.taxOnDiscount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.taxOnDiscount == null
              ? 0
              : getFormattedValue(cellElement.data.taxOnDiscount);
          }
        },
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
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
              cellElement.data?.netValue == null
                ? 0
                : getFormattedValue(cellElement.data.netValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netValue == null
              ? 0
              : getFormattedValue(cellElement.data.netValue);
          }
        },
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        format: "dd-MMM-yyyy hh:mm a",
        width: 100,
      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
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
        dataField: "mobileNumber",
        caption: t("mobile_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "totalExciseTax",
        caption: t("total_excise_tax"),
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
              cellElement.data?.totalExciseTax == null
                ? 0
                : getFormattedValue(cellElement.data.totalExciseTax);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalExciseTax == null
              ? 0
              : getFormattedValue(cellElement.data.totalExciseTax);
          }
        },
      },

      {
        dataField: "srAmount",
        caption: t("sr_amount"),
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
              cellElement.data?.srAmount == null
                ? 0
                : getFormattedValue(cellElement.data.srAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.srAmount == null
              ? 0
              : getFormattedValue(cellElement.data.srAmount);
          }
        },
      },

      //in 1050 shown only on summary calculation

      {
        dataField: "toWarehouseName",
        caption: t("to_warehouse_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "salesAmount",
        caption: t("sales_amount"),
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
              cellElement.data?.salesAmount == null
                ? 0
                : getFormattedValue(cellElement.data.salesAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesAmount == null
              ? 0
              : getFormattedValue(cellElement.data.salesAmount);
          }
        },
      },
      {
        dataField: "totalProfit",
        caption: t("total_profit"),
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
              cellElement.data?.totalProfit == null
                ? 0
                : getFormattedValue(cellElement.data.totalProfit);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalProfit == null
              ? 0
              : getFormattedValue(cellElement.data.totalProfit);
          }
        },
      },
      // {
      //   dataField: "totalProfitPercentage",
      //   caption: t("total_profit_percentage"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },
      // {
      //   dataField: "costCentreName",
      //   caption: t("cost_centre_name"),
      //   dataType: "string",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },
      // {
      //   dataField: "deliveryStatus",
      //   caption: t("delivery_status"),
      //   dataType: "string",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },
      // {
      //   dataField: "paidStatus",
      //   caption: t("paid_status"),
      //   dataType: "string",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },
      // {
      //   dataField: "orderNumber",
      //   caption: t("order_number"),
      //   dataType: "string",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      // },

      //////// end
      // show when dbidvalue=543140180640
      {
        dataField: "printCount",
        caption: t("print_count"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
    ];
    // Filter columns based on the `visible` property
    return baseColumns
      .filter((column) => {
        if (
          column.dataField == "salesAmount" ||
          column.dataField == "totalProfit"
        ) {
          return userSession.dbIdValue == "489995732270";
        }
        if (column.dataField == "upi" || column.dataField == "cardAmt") {
          return applicationSettings.accountsSettings.allowMultiPayments;
        }
        if (column.dataField == "printCount") {
          return userSession.dbIdValue == "543140180640";
        }
        if (
          column.dataField == "mobileNumber" ||
          column.dataField == "totalExciseTax" ||
          column.dataField == "toWarehouseName"
        ) {
          return (
            clientSession.isAppGlobal &&
            !applicationSettings.accountsSettings.allowMultiPayments
          );
        }
        return true;
      })
      .map((column) => {
        if (column.dataField == "upi" && !clientSession.isAppGlobal) {
          return {
            ...column,
            caption: t("qr_pay"),
          };
        }
        if (column.dataField == "exchangeRate") {
          return {
            ...column,
            visible: filter.voucher_form == "Import",
          };
          // return filter.voucher_form !== "Import";
        }
        return column;
      });
  }, [t, filter, userSession.dbIdValue]);

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: any) => {
      console.log("itemInfo");

      console.log(itemInfo);

      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, []);

  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = useMemo(() => {
    const _summaryItems: SummaryConfig[] = [
      {
        column: "address2",
        summaryType: "max",
        customizeText: customizeDate,
      },
      {
        column: "gross",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "vat",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: (itemInfo: { value: any }) => {
          return (
            getFormattedValue(
              parseFloat(
                getFormattedValue(
                  isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value
                ).replace(/,/g, "") || "0"
              ),
              false,
              4
            ) || "0"
          );
        },
      },
      {
        column: "disc",
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
        column: "billDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cashDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cashAmt",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "creditAmt",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "bankAmt",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },

      {
        column: "adjustmentAmount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //only in multipayment and inventorysumary
      {
        column: "netValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //only in multipayment and inventorysumary
      {
        column: "srAmount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //not in inactive and nahla
      // usersession.dbIdValue!== "543140180640"&&(
      {
        column: "couponAmt",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      // )
      //not in inactive
      {
        column: "taxOnDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //not in inactive
      {
        column: "roundAmount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },

      //dbid value="489995732270"
      //asmari only
      {
        column: "salesAmount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //asmari only
      {
        column: "totalProfit",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      // //inventory summary only+09
      {
        column: "totalExciseTax",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
    ];
    // Filter columns based on the `visible` property
    return _summaryItems.filter((column) => {
      if (column.column == "salesAmount" || column.column == "totalProfit") {
        return userSession.dbIdValue == "489995732270";
      }
      if (column.column == "totalExciseTax") {
        return clientSession.isAppGlobal;
      }
      if (column.column == "srAmount") {
        return (
          userSession.dbIdValue !== "489995732270" &&
          userSession.dbIdValue !== "543140180640" &&
          !filter.IsInactive
        );
      }
      if (column.column == "couponAmt") {
        return userSession.dbIdValue !== "543140180640" && !filter.IsInactive;
      }
      // if (column.column == "roundAmount") {
      //   return !filter.IsInactive;
      // }

      return true;
    });
  }, [t, filter, userSession.dbIdValue]);
  const location = useLocation();
  const [key, setKey] = useState(1);
  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                key={key}
                groupPanelVisible={true}
                // autoExpandAll={true}
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
                columns={columns}
                // moreOption
                // {productID > 0 && , Product Name : [productName]} removed always visible false in 1050
                //condition in case of sales
                //  case "SI":
                //     this.Text = lblReportTitle.Text = "Sales Summary Report";
                //     if (CashSales)
                //     {
                //         lblReportTitle.Text = lblReportTitle.Text + " of Cash:";
                //         this.Text = this.Text + lblReportTitle.Text;
                //     }
                //     else if(CreditSales)

                //     {
                //         lblReportTitle.Text = lblReportTitle.Text + " of Credit:";
                //         this.Text = this.Text + lblReportTitle.Text;

                //     }
                //     else if (CardSales)

                //     {
                //         lblReportTitle.Text = lblReportTitle.Text + " of Card/Bank:";
                //         this.Text = this.Text + lblReportTitle.Text;
                //     }
                filterText="of {voucherForm!=''&& , Voucher Form : [voucherForm]} 
                 {salesRouteID > 0 && , Route Name : [routeName]} 
                {counterID > 0 && , Counter : [counterName]} 
                {salesmanID > 0 && , Sales Man : [salesMan]} 
                From Date : {fromDate} To Date : {toDate} 
                {isTimeBased == true &&  , Time between  :
                 [fromTime] And [toTime]}"
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<SummaryFilter />}
                // columnResizingMode={"widget"}
                filterHeight={300}
                filterWidth={790}
                filterInitialData={{
                  ...SummaryFilterInitialState,
                  fromDate: moment(
                    clientSession.softwareDate,
                    "DD/MM/YYYY"
                  ).local(),
                }}
                onFilterChanged={(f: any) => {
                  setFilter(f);
                }}
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

export default SummaryReport;
