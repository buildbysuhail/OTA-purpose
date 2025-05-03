import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";
import PurchaseGstReportFilter, { PurchaseGstReportFilterInitialState } from "./purchase-tax-gst-report-filter";
import { useLocation } from "react-router-dom";
interface PurchaseTaxGSTAdvRegisterFormatProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const PurchaseTaxGSTAdvRegisterFormat: FC<PurchaseTaxGSTAdvRegisterFormatProps> = ({ gridHeader, dataUrl, gridId }) => {
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
      format:"dd-MMM-yyyy"
    },
    {
      dataField: "voucherNo",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "refNumber",
      caption: t("ref_no"),
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
        format:"dd-MMM-yyyy"
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "address",
      caption: t("address"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "gstin",
      caption: t("gst_in"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
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
            cellElement.data?.cess == null
              ? ""
              : getFormattedValue(cellElement.data.cess,false,4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cess == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cess),false,4);
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
              : getFormattedValue(cellElement.data.addnlCessAmt,false,4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.addnlCessAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.addnlCessAmt),false,4);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.addnlCessPerc == null
              ? ""
              : getFormattedValue(cellElement.data.addnlCessPerc,false,4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.addnlCessPerc == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.addnlCessPerc),false,4);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable0 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable0,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable0 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable0),false,6);
        }
      },
    },
    {
      dataField: "taxAmt0",
      caption: t("tax_amount_0"),
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
            cellElement.data?.taxAmt0 == null
              ? ""
              : getFormattedValue(cellElement.data.taxAmt0,false,2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxAmt0 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxAmt0),false,2);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable3 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable3,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable3 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable3),false,6);
        }
      },
    },
    {
      dataField: "cgsT1_5",
      caption: t("cgst_1_5"),
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
            cellElement.data?.cgsT1_5 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT1_5,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT1_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT1_5),false,6);
        }
      },
    },
    {
      dataField: "sgsT1_5",
      caption: t("sgst_1_5"),
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
            cellElement.data?.sgsT1_5 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT1_5,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT1_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT1_5),false,6);
        }
      },
    },
    {
      dataField: "igsT3",
      caption: t("igst_3"),
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
            cellElement.data?.igsT3 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT3,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT3 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT3),false,6);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable5 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable5,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable5),false,6);
        }
      },
    },
    {
      dataField: "cgsT2_5",
      caption: t("cgst_2_5"),
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
            cellElement.data?.cgsT2_5 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT2_5,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT2_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT2_5),false,6);
        }
      },
    },
    {
      dataField: "sgsT2_5",
      caption: t("sgst_2_5"),
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
            cellElement.data?.sgsT2_5 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT2_5,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT2_5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT2_5),false,6);
        }
      },
    },
    {
      dataField: "igsT5",
      caption: t("igst_5"),
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
            cellElement.data?.igsT5 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT5,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT5 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT5),false,6);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable6 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable6,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable6),false,6);
        }
      },
    },
    {
      dataField: "cgsT3",
      caption: t("cgst_3"),
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
            cellElement.data?.cgsT3 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT3,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT3 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT3),false,6);
        }
      },
    },
    {
      dataField: "sgsT3",
      caption: t("sgst_3"),
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
            cellElement.data?.sgsT3 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT3,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT3 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT3),false,6);
        }
      },
    },
    {
      dataField: "igsT6",
      caption: t("igst_6"),
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
            cellElement.data?.igsT6 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT6,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT6),false,6);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable12 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable12,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable12 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable12),false,6);
        }
      },
    },
    {
      dataField: "cgsT6",
      caption: t("cgst_6"),
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
            cellElement.data?.cgsT6 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT6,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT6),false,6);
        }
      },
    },
    {
      dataField: "sgsT6",
      caption: t("sgst_6"),
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
            cellElement.data?.sgsT6 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT6,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT6),false,6);
        }
      },
    },
    {
      dataField: "igsT12",
      caption: t("igst_12"),
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
            cellElement.data?.igsT12 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT12,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT12 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT12),false,6);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable18 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable18,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable18 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable18),false,6);
        }
      },
    },
    {
      dataField: "cgsT9",
      caption: t("cgst_9"),
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
            cellElement.data?.cgsT9 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT9,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT9 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT9),false,6);
        }
      },
    },
    {
      dataField: "sgsT9",
      caption: t("sgst_9"),
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
            cellElement.data?.sgsT9 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT9,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT9 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT9),false,6);
        }
      },
    },
    {
      dataField: "igsT18",
      caption: t("igst_18"),
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
            cellElement.data?.igsT18 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT18,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT18 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT18),false,6);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable28 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable28,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable28 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable28),false,6);
        }
      },
    },
    {
      dataField: "cgsT14",
      caption: t("cgst_14"),
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
            cellElement.data?.cgsT14 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT14,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT14 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT14),false,6);
        }
      },
    },
    {
      dataField: "sgsT14",
      caption: t("sgst_14"),
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
            cellElement.data?.sgsT14 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT14,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT14 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT14),false,6);
        }
      },
    },
    {
      dataField: "igsT28",
      caption: t("igst_28"),
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
            cellElement.data?.igsT28 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT28,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT28 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT28),false,6);
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxable28_12 == null
              ? ""
              : getFormattedValue(cellElement.data.taxable28_12,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxable28_12 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxable28_12),false,6);
        }
      },
    },
    {
      dataField: "cgsT14_6",
      caption: t("cgst_14_6"),
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
            cellElement.data?.cgsT14_6 == null
              ? ""
              : getFormattedValue(cellElement.data.cgsT14_6,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgsT14_6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgsT14_6),false,6);
        }
      },
    },
    {
      dataField: "sgsT14_6",
      caption: t("sgst_14_6"),
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
            cellElement.data?.sgsT14_6 == null
              ? ""
              : getFormattedValue(cellElement.data.sgsT14_6,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgsT14_6 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgsT14_6),false,6);
        }
      },
    },
    {
      dataField: "igsT28_12",
      caption: t("igst_28_12"),
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
            cellElement.data?.igsT28_12 == null
              ? ""
              : getFormattedValue(cellElement.data.igsT28_12,false,6);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igsT28_12 == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igsT28_12),false,6);
        }
      },
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
  const _summaryItems: SummaryConfig[] = [
    {
      column: "form",
      summaryType: "custom",
      customizeText: customizeDate,
    },
    {
      column: "cess",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "taxable0",
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
    {
      column: "taxable28_12",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cgsT14_6",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgsT14_6",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igsT28_12",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];
  const location = useLocation();
  const [key, setKey] = useState(1);
  useEffect(() => {
      setKey((prev: any) => prev+1)
  },[location]);
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
                filterText="of From Date : {fromDate} To Date : {toDate}"
                moreOption
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
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
                gridId={gridId}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseTaxGSTAdvRegisterFormat;
