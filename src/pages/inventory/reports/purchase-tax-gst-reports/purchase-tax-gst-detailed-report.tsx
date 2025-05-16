import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useLocation } from "react-router-dom";
import PurchaseGstReportFilterGstCat, { PurchaseGstReportFilterGstCatInitialState } from "./purchase-tax-gst-report-filter-gst";

interface PurchaseTaxGSTDetailedProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const PurchaseTaxGSTDetailed: FC<PurchaseTaxGSTDetailedProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("inventory");
  const [filter, setFilter] = useState<any>(PurchaseGstReportFilterGstCatInitialState);
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf: true
    },
    {
      dataField: "vchNo",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
      showInPdf: true
    },
    {
      dataField: "gstin",
      caption: t("gst_in"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "party",
      caption: t("Party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true
    },
    {
      dataField: "address1",
      caption: t("Address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "address2",
      caption: t("Address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "form",
      caption: t("From"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      showInPdf: true
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
      }
    },
    {
      dataField: "cgstPerc",
      caption: t("cgstperc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 55,
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
      }
    },
    {
      dataField: "cgst",
      caption: t("cgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
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
      }
    },
    {
      dataField: "sgstPerc",
      caption: t("sgstperc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 55,
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
      }
    },
    {
      dataField: "sgst",
      caption: t("sgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
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
      }
    },
    {
      dataField: "igstPerc",
      caption: t("igstperc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 55,
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
      }
    },
    {
      dataField: "igst",
      caption: t("igst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
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
      }
    },
    {
      dataField: "cessPerc",
      caption: t("cessperc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 55,
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
      }
    },
    {
      dataField: "cessAmt",
      caption: t("cess"),
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
      }
    },
    {
      dataField: "addCessPerc",
      caption: t("addcessperc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
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
      }
    },
    {
      dataField: "addCess",
      caption: t("addcess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 65,
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
      }
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
      }
    },
    {
      dataField: "refNumber",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
      showInPdf: true
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf: true
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf: true
    },
    {
      dataField: "id",
      caption: t("MasterId"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      visible: false
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    // {
    //   dataField: "gstPercentage",
    //   caption: t("gstperc"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 100,
    //   showInPdf: true
    // }
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
                filterContent={<PurchaseGstReportFilterGstCat />}
                filterHeight={240}
                filterWidth={790}
                filterInitialData={PurchaseGstReportFilterGstCatInitialState}
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

export default PurchaseTaxGSTDetailed;
