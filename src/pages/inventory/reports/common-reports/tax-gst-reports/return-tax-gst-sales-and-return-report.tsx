import { FC, Fragment, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../../redux/types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import GstReportFilter, { GstReportFilterInitialState } from "./gst-report-filter";
import { erpParseFloat } from "../../../../../utilities/Utils";
interface ReturnTaxGSTProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
  const ReturnTaxGSTSalesAndReturn: FC<ReturnTaxGSTProps> = ({
    gridHeader,
    dataUrl,
    gridId,
  }) => {
  const [filter, setFilter] = useState<any>(GstReportFilterInitialState);
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "hsn",
      caption: t("hsn_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "qty",
      caption: t("quantity"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 75,
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
              : getFormattedValue(cellElement.data.qty,false,4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.qty == null
            ? ""
            : getFormattedValue(cellElement.data.qty,false,4);
        }
      },
    },
    {
      dataField: "taxableValue",
      caption: t("taxable_value"),
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
            cellElement.data?.taxableValue == null
              ? ""
              : getFormattedValue(cellElement.data.taxableValue,false,4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxableValue == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.taxableValue),false,4);
        }
      },
    },
    {
      dataField: "cgst",
      caption: t("cgst"),
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
      dataField: "sgst",
      caption: t("sgst"),
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
      dataField: "igst",
      caption: t("igst"),
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
      dataField: "cess",
      caption: t("cess"),
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
      dataField: "addCess",
      caption: t("addcess"),
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
            : getFormattedValue(cellElement.data.total);
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
      visible:false
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
      column: "hsn",
      summaryType: "custom",
      customizeText: customizeDate,
    },
      {
      column: "qty",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "taxableValue",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "cgst",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "sgst",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "igst",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "total",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "cess",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "addCess",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction:(value: number) => {
            return erpParseFloat(getFormattedValue(value));
      },
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
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<GstReportFilter />}
                filterHeight={270}
                filterWidth={600}
                filterInitialData={GstReportFilterInitialState}
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

export default ReturnTaxGSTSalesAndReturn;
