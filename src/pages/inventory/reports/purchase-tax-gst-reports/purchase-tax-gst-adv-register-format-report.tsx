import { Fragment, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";
import PurchaseGstReportFilter, { PurchaseGstReportFilterInitialState } from "./purchase-tax-gst-report-filter";

const PurchaseTaxGSTAdvRegisterFormat = () => {
  const { t } = useTranslation("inventory");
  const [filter, setFilter] = useState<any>(PurchaseGstReportFilterInitialState);
  const columns: DevGridColumn[] = [
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
          : moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY"); // Ensures proper formatting
      },
    },
    {
      dataField: "voucherNo",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 75,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "refNumber",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
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
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "address",
      caption: t("address"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "gstin",
      caption: t("gst_in"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "total",
      caption: t("total"),
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
            cellElement.data?.total == null
              ? ""
              : getFormattedValue(cellElement.data.total, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.total == null
            ? ""
            : getFormattedValue(cellElement.data.total, false, 4);
        }
      },
    },
    {
      dataField: "cess",
      caption: t("cess_amount"),
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
      caption: t("addcess_amount"),
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
      dataField: "addnlCessPerc",
      caption: t("addcessperc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "taxAmt0",
      caption: t("tax_amount_0"),
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
      caption: t("taxable_0"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cgsT2_5",
      caption: t("cgst_2_5"),
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
            cellElement.data?.cgsT2_5 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT2_5);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT2_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT2_5));
        }
      },
    },
    {
      dataField: "sgsT2_5",
      caption: t("sgst_2_5"),
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
            cellElement.data?.sgsT2_5 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT2_5);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT2_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT2_5));
        }
      },
    },
    {
      dataField: "igsT5",
      caption: t("igst_5"),
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
            cellElement.data?.igsT5 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT5);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT5));
        }
      },
    },
    {
      dataField: "taxable5",
      caption: t("taxable_5"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cgsT6",
      caption: t("cgst_6"),
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
            cellElement.data?.cgsT6 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT6));
        }
      },
    },
    {
      dataField: "sgsT6",
      caption: t("sgst_6"),
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
            cellElement.data?.sgsT6 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT6));
        }
      },
    },
    {
      dataField: "igsT12",
      caption: t("igst_12"),
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
            cellElement.data?.igsT12 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT12);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT12 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT12));
        }
      },
    },
    {
      dataField: "taxable12",
      caption: t("taxable_12"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cgsT9",
      caption: t("cgst_9"),
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
            cellElement.data?.cgsT9 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT9);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT9 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT9));
        }
      },
    },
    {
      dataField: "sgsT9",
      caption: t("sgst_9"),
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
            cellElement.data?.sgsT9 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT9);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT9 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT9));
        }
      },
    },
    {
      dataField: "igsT18",
      caption: t("igst_18"),
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
            cellElement.data?.igsT18 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT18);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT18 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT18));
        }
      },
    },
    {
      dataField: "taxable18",
      caption: t("taxable_18"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cgsT14",
      caption: t("cgst_14"),
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
            cellElement.data?.cgsT14 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT14);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT14 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT14));
        }
      },
    },
    {
      dataField: "sgsT14",
      caption: t("sgst_14"),
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
            cellElement.data?.sgsT14 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT14);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT14 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT14));
        }
      },
    },
    {
      dataField: "igsT28",
      caption: t("igst_28"),
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
            cellElement.data?.igsT28 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT28);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT28 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT28));
        }
      },
    },
    {
      dataField: "taxable28",
      caption: t("taxable_28"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cgsT14_6",
      caption: t("cgst_14_6"),
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
            cellElement.data?.cgsT14_6 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT14_6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT14_6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT14_6));
        }
      },
    },
    {
      dataField: "sgsT14_6",
      caption: t("sgst_14_6"),
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
            cellElement.data?.sgsT14_6 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT14_6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT14_6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT14_6));
        }
      },
    },
    {
      dataField: "igsT28_12",
      caption: t("igst_28_12"),
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
            cellElement.data?.igsT28_12 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT28_12);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT28_12 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT28_12));
        }
      },
    },
    {
      dataField: "taxable28_12",
      caption: t("taxable_28_12"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cgsT3",
      caption: t("cgst_3"),
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
            cellElement.data?.cgsT3 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT3);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT3 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT3));
        }
      },
    },
    {
      dataField: "sgsT3",
      caption: t("sgst_3"),
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
            cellElement.data?.sgsT3 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT3);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT3 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT3));
        }
      },
    },
    {
      dataField: "igsT6",
      caption: t("igst_6"),
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
            cellElement.data?.igsT6 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT6));
        }
      },
    },
    {
      dataField: "taxable6",
      caption: t("taxable_6"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cgsT1_5",
      caption: t("cgst_1_5"),
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
            cellElement.data?.cgsT1_5 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT1_5);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT1_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT1_5));
        }
      },
    },
    {
      dataField: "sgsT1_5",
      caption: t("sgst_1_5"),
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
            cellElement.data?.sgsT1_5 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT1_5);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT1_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT1_5));
        }
      },
    },
    {
      dataField: "igsT3",
      caption: t("igst_3"),
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
            cellElement.data?.igsT3 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT3);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT3 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT3));
        }
      },
    },
    {
      dataField: "taxable3",
      caption: t("taxable_3"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
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
      column: "form",
      summaryType: "custom",
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
      column: "cgsT1_5",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgsT1_5",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igsT3",
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
      column: "cgsT2_5",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgsT2_5",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igsT5",
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
      column: "cgsT6",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgsT6",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igsT12",
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
      column: "cgsT9",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgsT9",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igsT18",
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
      column: "cgsT14",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgsT14",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igsT28",
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
                gridHeader={t("purchase_gst_report")}
                dataUrl={Urls.purchase_gst_adv_register_format}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PurchaseGstReportFilter />}
                filterHeight={240}
                filterWidth={790}
                filterInitialData={PurchaseGstReportFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_purchase_gst_adv_register_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseTaxGSTAdvRegisterFormat;
