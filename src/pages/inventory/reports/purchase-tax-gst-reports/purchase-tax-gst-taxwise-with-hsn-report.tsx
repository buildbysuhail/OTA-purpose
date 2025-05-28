import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import PurchaseGstReportFilter, {
  PurchaseGstReportFilterInitialState,
} from "./purchase-tax-gst-report-filter";
import { useLocation } from "react-router-dom";
interface PurchaseTaxGSTTaxwiseWithHSNProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const PurchaseTaxGSTTaxwiseWithHSN: FC<PurchaseTaxGSTTaxwiseWithHSNProps> = ({
  gridHeader,
  dataUrl,
  gridId,
}) => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<any>(
    PurchaseGstReportFilterInitialState
  );
  const columns: DevGridColumn[] = [
    {
      dataField: "gstPercentage",
      caption: t("gst_percentage"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      groupIndex: 0,
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
      dataField: "hsnCode",
      caption: t("hsn_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "qty",
      caption: t("quantity"),
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
            cellElement.data?.qty == null
              ? ""
              : getFormattedValue(cellElement.data.qty);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.qty == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.qty));
        }
      },
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "taxableValue",
      caption: t("taxable_value"),
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
            cellElement.data?.taxableValue == null
              ? ""
              : getFormattedValue(cellElement.data.taxableValue);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxableValue == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxableValue));
        }
      },
    },
    {
      dataField: "cgstPerc",
      caption: t("cgst_perc"),
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
            cellElement.data?.cgstPerc == null
              ? ""
              : getFormattedValue(cellElement.data.cgstPerc);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgstPerc == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgstPerc));
        }
      },
    },
    {
      dataField: "cgst",
      caption: t("cgst"),
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
              : getFormattedValue(cellElement.data.cgst);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cgst == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cgst));
        }
      },
    },
    {
      dataField: "sgstPerc",
      caption: t("sgst_%"),
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
            cellElement.data?.sgstPerc == null
              ? ""
              : getFormattedValue(cellElement.data.sgstPerc);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgstPerc == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgstPerc));
        }
      },
    },
    {
      dataField: "sgst",
      caption: t("sgst"),
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
              : getFormattedValue(cellElement.data.sgst);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sgst == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sgst));
        }
      },
    },
    {
      dataField: "igstPerc",
      caption: t("igst_%"),
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
            cellElement.data?.igstPerc == null
              ? ""
              : getFormattedValue(cellElement.data.igstPerc);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igstPerc == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igstPerc));
        }
      },
    },
    {
      dataField: "igst",
      caption: t("igst"),
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
              : getFormattedValue(cellElement.data.igst);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.igst == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.igst));
        }
      },
    },
    {
      dataField: "cessPerc",
      caption: t("cess_%"),
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
            cellElement.data?.cessPerc == null
              ? ""
              : getFormattedValue(cellElement.data.cessPerc);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cessPerc == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cessPerc));
        }
      },
    },
    {
      dataField: "cessAmt",
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
            cellElement.data?.cessAmt == null
              ? ""
              : getFormattedValue(cellElement.data.cessAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cessAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cessAmt));
        }
      },
    },
    {
      dataField: "addCessPerc",
      caption: t("add_cess_%"),
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
            cellElement.data?.addCessPerc == null
              ? ""
              : getFormattedValue(cellElement.data.addCessPerc);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.addCessPerc == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.addCessPerc));
        }
      },
    },
    {
      dataField: "addCess",
      caption: t("add_cess_amount"),
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
            cellElement.data?.addCess == null
              ? ""
              : getFormattedValue(cellElement.data.addCess);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.addCess == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.addCess));
        }
      },
    },
    {
      dataField: "total",
      caption: t("total"),
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
            cellElement.data?.total == null
              ? ""
              : getFormattedValue(cellElement.data.total);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.total == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.total));
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
      visible: false,
      showInPdf: true,
    },
    // {
    //   dataField: "groupName",
    //   caption: t("group_name"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 100,
    //   showInPdf: true,
    // },
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
  const customizeDateGroup = (itemInfo: any) => `Group Total`;
  const _summaryItems: SummaryConfig[] = [
    {
      column: "form",
      summaryType: "custom",
      customizeText: customizeDate,
    },
    {
      column: "qty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "taxableValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cgst",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgst",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igst",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "total",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cessAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "addCess",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "form",
      summaryType: "custom",
      isGroupItem: true,
      showInGroupFooter: true,
      customizeText: customizeDateGroup,
    },
    {
      column: "qty",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "taxableValue",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cgst",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "sgst",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "igst",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "total",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cessAmt",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "addCess",
      summaryType: "sum",
      isGroupItem: true,
      showInGroupFooter: true,
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];
  const location = useLocation();
  const [key, setKey] = useState(1);
  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);
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
                filterHeight={220}
                filterWidth={600}
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

export default PurchaseTaxGSTTaxwiseWithHSN;
