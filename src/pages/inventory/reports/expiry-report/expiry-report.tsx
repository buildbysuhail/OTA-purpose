import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import ExpiryReportFilter, { ExpiryReportFilterInitialState } from "./expiry-report-filter";
import Urls from "../../../../redux/urls";

const ExpiryReport = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "id",
            caption: t("id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 50,
            visible:false,
        },
        {
            dataField: "code",
            caption: t("code"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "product",
            caption: t("product"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
            showInPdf:true,
        },
        {
            dataField: "group",
            caption: t("group"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "category",
            caption: t("category"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "brand",
            caption: t("brand"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "stock",
            caption: t("stock"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
            showInPdf:true,
      cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stock == null
                ? ""
                : getFormattedValue(cellElement.data.stock);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stock == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.stock)
                );
          }
        },
      },
        {
            dataField: "stdSPrice",
            caption: t("std_s_price"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
            showInPdf:true,
      cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stdSPrice == null
                ? ""
                : getFormattedValue(cellElement.data.stdSPrice);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stdSPrice == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.stdSPrice)
                );
          }
        },
      },
        {
            dataField: "stdPPrice",
            caption: t("std_p_price"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
            showInPdf:true,
       cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stdPPrice == null
                ? ""
                : getFormattedValue(cellElement.data.stdPPrice);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stdPPrice == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.stdPPrice)
                );
          }
        },
      },
        {
            dataField: "stockValue",
            caption: t("stock_value"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
      cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stockValue == null
                ? ""
                : getFormattedValue(cellElement.data.stockValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stockValue == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.stockValue)
                );
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
            width: 80,
            showInPdf:true,
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
                : getFormattedValue(cellElement.data.mrp);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.mrp == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.mrp)
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
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "specification",
            caption: t("specification"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "modelNo",
            caption: t("model_no"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "autoBarcode",
            caption: t("auto_barcode"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "mannualBarcode",
            caption: t("mannual_barcode"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 130,
            showInPdf:true,
        },
        {
            dataField: "expiryDate",
            caption: t("expiry_date"),
            dataType: "date",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
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
            column: "stock",
            summaryType: "sum",
            valueFormat: "fixedPoint",
            customizeText: customizeSummaryRow,
        },
        {
            column: "stockValue",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
    ];

    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                    <div className="px-4 pt-4 pb-2 ">
                        <div className="grid grid-cols-1 gap-3">
                            <ErpDevGrid
                                summaryItems={summaryItems}
                                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                                columns={columns}
                                moreOption={true}
                                gridHeader={t("expiry_report")}
                                dataUrl={Urls.expiry_report}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<ExpiryReportFilter />}
                                filterWidth={790}
                                filterHeight={400}
                                filterInitialData={ExpiryReportFilterInitialState}
                                reload={true}
                                gridId="grd_expiry_report"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ExpiryReport;