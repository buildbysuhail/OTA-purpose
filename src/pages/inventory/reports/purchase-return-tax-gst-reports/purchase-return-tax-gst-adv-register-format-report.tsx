import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";
import PurchaseReturnGstReportFilter, { PurchaseReturnGstReportFilterInitialState } from "./purchase-return-tax-gst-report-filter";


const PurchaseReturnTaxGSTAdvRegisterFormat = () => {
  const { t } = useTranslation("inventory");
 const [filter, setFilter] = useState<any>(PurchaseReturnGstReportFilterInitialState);
     const columns: DevGridColumn[] = [
       {
         dataField: "date",
         caption: t("date"),
         dataType: "date",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
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
         dataField: "vchNos",
         caption: t("VoucherNumber"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 75,
       },
       {
         dataField: "form",
         caption: t("Form"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 150,
       },
       {
        dataField: "refNumber",
        caption: t("RefNumber"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "refDate",
        caption: t("RefDate"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
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
        dataField: "party",
        caption: t("Party"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "address",
        caption: t("Address"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "gSTIN",
        caption: t("GSTIN"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "total",
        caption: t("Total"),
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
              cellElement.data?.total == null
                ? ""
                : getFormattedValue(cellElement.data.total,false,4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.total == null
              ? ""
              : getFormattedValue(cellElement.data.total,false,4);
          }
        },
      },
      {
        dataField: "cess",
        caption: t("Cess"),
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
              cellElement.data?.cess == null
                ? ""
                : getFormattedValue(cellElement.data.cess);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cess == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cess));
          }
        },
      },
      {
        dataField: "addnlCessAmt",
        caption: t("Add Cess Amount"),
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
              cellElement.data?.addnlCessAmt == null
                ? ""
                : getFormattedValue(cellElement.data.addnlCessAmt);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.addnlCessAmt == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.addnlCessAmt));
          }
        },
      },
      {
        dataField: "AddnlCessPerc",
        caption: t("GST%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "taxAmt0",
        caption: t("Taxable Amount 0"),
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
              cellElement.data?.taxAmt0 == null
                ? ""
                : getFormattedValue(cellElement.data.taxAmt0);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.taxAmt0 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.taxAmt0));
          }
        },
      },
      {
        dataField: "taxable0",
        caption: t("Taxable 0%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGST2_5",
        caption: t("CGST 2.5%"),
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
              cellElement.data?.cGST2_5 == null
                ? ""
                : getFormattedValue(cellElement.data.cGST2_5);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cGST2_5 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cGST2_5));
          }
        },
      },
      {
        dataField: "sGST2_5",
        caption: t("SGST 2.5%"),
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
              cellElement.data?.sGST2_5 == null
                ? ""
                : getFormattedValue(cellElement.data.sGST2_5);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sGST2_5 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST2_5));
          }
        },
      },
      {
        dataField: "iGST5",
        caption: t("IGST 5%"),
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
              cellElement.data?.iGST5 == null
                ? ""
                : getFormattedValue(cellElement.data.iGST5);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.iGST5 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST2_5));
          }
        },
      },
      {
        dataField: "taxable5",
        caption: t("Taxable 5%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGST6",
        caption: t("CGST 6%"),
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
              cellElement.data?.cGST6 == null
                ? ""
                : getFormattedValue(cellElement.data.cGST6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cGST6 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cGST6));
          }
        },
      },
      {
        dataField: "sGST6",
        caption: t("SGST 6%"),
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
              cellElement.data?.sGST6 == null
                ? ""
                : getFormattedValue(cellElement.data.sGST6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sGST6 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST6));
          }
        },
      },
      {
        dataField: "iGST12",
        caption: t("IGST 12%"),
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
              cellElement.data?.iGST12 == null
                ? ""
                : getFormattedValue(cellElement.data.iGST12);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.iGST12 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.iGST12));
          }
        },
      },
      {
        dataField: "taxable12",
        caption: t("Taxable 12%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGST9",
        caption: t("CGST 9%"),
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
              cellElement.data?.cGST9 == null
                ? ""
                : getFormattedValue(cellElement.data.cGST9);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cGST9 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cGST9));
          }
        },
      },
      {
        dataField: "sGST9",
        caption: t("SGST 9%"),
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
              cellElement.data?.sGST9 == null
                ? ""
                : getFormattedValue(cellElement.data.sGST9);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sGST9 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST9));
          }
        },
      },
      {
        dataField: "iGST18",
        caption: t("IGST 18%"),
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
              cellElement.data?.iGST18 == null
                ? ""
                : getFormattedValue(cellElement.data.iGST18);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.iGST18 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.iGST18));
          }
        },
      },
      {
        dataField: "taxable18",
        caption: t("Taxable 18%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGST14",
        caption: t("CGST 14%"),
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
              cellElement.data?.cGST14 == null
                ? ""
                : getFormattedValue(cellElement.data.cGST14);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cGST14 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cGST14));
          }
        },
      },
      {
        dataField: "sGST14",
        caption: t("SGST 14%"),
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
              cellElement.data?.sGST14 == null
                ? ""
                : getFormattedValue(cellElement.data.sGST14);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sGST14 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST14));
          }
        },
      },
      {
        dataField: "iGST28",
        caption: t("IGST 28%"),
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
              cellElement.data?.iGST28 == null
                ? ""
                : getFormattedValue(cellElement.data.iGST28);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.iGST28 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.iGST28));
          }
        },
      },
      {
        dataField: "taxable28",
        caption: t("Taxable 28%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGST14_6",
        caption: t("CGST 14+6%"),
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
              cellElement.data?.cGST14_6 == null
                ? ""
                : getFormattedValue(cellElement.data.cGST14_6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cGST14_6 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cGST14_6));
          }
        },
      },
      {
        dataField: "sGST14_6",
        caption: t("SGST 14+6%"),
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
              cellElement.data?.sGST14_6 == null
                ? ""
                : getFormattedValue(cellElement.data.sGST14_6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sGST14_6 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST14_6));
          }
        },
      },
      {
        dataField: "iGST28_12",
        caption: t("IGST 28+12%"),
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
              cellElement.data?.iGST28_12 == null
                ? ""
                : getFormattedValue(cellElement.data.iGST28_12);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.iGST28_12 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.iGST28_12));
          }
        },
      },
      {
        dataField: "taxable28_12",
        caption: t("Taxable 28+12%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGST3",
        caption: t("CGST 3%"),
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
              cellElement.data?.cGST3 == null
                ? ""
                : getFormattedValue(cellElement.data.cGST3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cGST3 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cGST3));
          }
        },
      },
      {
        dataField: "sGST3",
        caption: t("SGST 3%"),
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
              cellElement.data?.sGST3 == null
                ? ""
                : getFormattedValue(cellElement.data.sGST3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sGST3 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST3));
          }
        },
      },
      {
        dataField: "iGST6",
        caption: t("IGST 6%"),
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
              cellElement.data?.iGST6 == null
                ? ""
                : getFormattedValue(cellElement.data.iGST6);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.iGST6 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.iGST6));
          }
        },
      },
      {
        dataField: "taxable6",
        caption: t("Taxable 6%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGST1_5",
        caption: t("CGST 1.5%"),
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
              cellElement.data?.cGST1_5 == null
                ? ""
                : getFormattedValue(cellElement.data.cGST1_5);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cGST1_5 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cGST1_5));
          }
        },
      },
      {
        dataField: "sGST1_5",
        caption: t("SGST 1.5%"),
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
              cellElement.data?.sGST1_5 == null
                ? ""
                : getFormattedValue(cellElement.data.sGST1_5);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sGST1_5 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sGST1_5));
          }
        },
      },
      {
        dataField: "iGST3",
        caption: t("IGST 3%"),
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
              cellElement.data?.iGST3 == null
                ? ""
                : getFormattedValue(cellElement.data.iGST3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.iGST3 == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.iGST3));
          }
        },
      },
      {
        dataField: "taxable3",
        caption: t("Taxable 3%"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "financialYearID",
        caption: t("FinancialYearID"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
     ];
 
   const { getFormattedValue } = useNumberFormat();
   const customizeSummaryRow = useMemo(() => {
     return (itemInfo: any) => {
       console.log('itemInfo');
       
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
    const _summaryItems: SummaryConfig[] = [
      {
        column:"form",
        summaryType:"custom",  
        customizeText: customizeDate,
      },
      {
        column: "total",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cess",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "taxAmt0",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "taxable3",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cGST1_5",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sGST1_5",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "iGST3",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "taxable5",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cGST2_5",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sGST2_5",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "iGST5",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "taxable12",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cGST6",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sGST6",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "iGST12",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "taxable18",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cGST9",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sGST9",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "iGST18",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "taxable28",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cGST14",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sGST14",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "iGST28",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
    ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
               summaryItems={_summaryItems}
               remoteOperations={{
                 filtering: false,
                 paging: false,
                 sorting: false,
                 summary: false,
               }}
               columns={columns}
               filterText="of From Date : {fromDate} To Date : {toDate}
               {gstPercValue != '' && , Gst Percentage : [gstPercValue]}
               {taxCategoryID > 0 && , GST Category : [taxCategoryName]} 
               {formType > 0 && , Form Type : [formType]}"
                moreOption
                gridHeader={t("purchase_return_gst_report")}
                dataUrl={Urls.purchase_return_gst_adv_register_format}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PurchaseReturnGstReportFilter />}
                filterHeight={450}
                filterWidth={790}
                filterInitialData={PurchaseReturnGstReportFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_purchase_return_gst_adv_register_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseReturnTaxGSTAdvRegisterFormat;
