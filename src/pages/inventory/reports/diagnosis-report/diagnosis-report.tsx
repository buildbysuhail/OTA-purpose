import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig, } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import DiagnosisReportFilter, { DiagnosisReportFilterInitialState } from "./diagnosis-report-filter";
import Urls from "../../../../redux/urls";

const DiagnosisReport = () => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<any>(DiagnosisReportFilterInitialState);
  const { getFormattedValue } = useNumberFormat();

  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "slNo",
        caption: t("sl_no"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 50,
        showInPdf: true,
      },
      {
        dataField: "code",
        caption: t("code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "manualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
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
                ? 0
                : getFormattedValue(cellElement.data.salesPrice);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesPrice == null
              ? 0
              : getFormattedValue(cellElement.data.salesPrice);
          }
        },
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
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
              cellElement.data?.purchasePrice == null
                ? 0
                : getFormattedValue(cellElement.data.purchasePrice);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.purchasePrice == null
              ? 0
              : getFormattedValue(cellElement.data.purchasePrice);
          }
        },
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
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
              cellElement.data?.mrp == null
                ? 0
                : getFormattedValue(cellElement.data.mrp);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.mrp == null
              ? 0
              : getFormattedValue(cellElement.data.mrp);
          }
        },
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
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
              cellElement.data?.stock == null
                ? 0
                : getFormattedValue(cellElement.data.stock);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stock == null
              ? 0
              : getFormattedValue(cellElement.data.stock);
          }
        },
      },
      {
        dataField: "cost",
        caption: t("cost"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
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
              cellElement.data?.cost == null
                ? 0
                : getFormattedValue(cellElement.data.cost);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cost == null
              ? 0
              : getFormattedValue(cellElement.data.cost);
          }
        },
      },
    ];

    // Filter columns based on the `visible` property
    return baseColumns.filter((column) => {
      if (
        column.dataField == "slNo" ||
        column.dataField == "code" ||
        column.dataField == "autoBarcode" ||
        column.dataField == "manualBarcode"
      ) {
        return filter.groupByProduct == false;
      }
      return true;
    });
  }, [t, filter]);

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
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = useMemo(() => {
    const _summaryItems: SummaryConfig[] = [
      {
        column: "salesPrice",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "purchasePrice",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "mrp",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "stock",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cost",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
    ];

    return _summaryItems.filter((column) => {
      return true;
    });
  }, [customizeSummaryRow]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: true, paging: true, sorting: false, summary: true, }}
                columns={columns}
                moreOption={true}
                gridHeader={t("diagnosis_report")}
                dataUrl={Urls.diagnosis_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<DiagnosisReportFilter />}
                filterWidth={800}
                filterHeight={560}
                filterInitialData={DiagnosisReportFilterInitialState}
                reload={true}
                gridId="grd_diagnosis_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DiagnosisReport;