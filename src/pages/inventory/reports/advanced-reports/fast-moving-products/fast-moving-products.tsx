import { useTranslation } from "react-i18next";
import ErpDevGrid, { SummaryConfig, } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { Fragment, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import GridId from "../../../../../redux/gridId";
import FastMovingReportFilter, { FastMovingReportFilterInitialState, } from "./fast-moving-products-filter";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const FastMovingProductsReport = () => {
   const [filter, setFilter] = useState<any>(FastMovingReportFilterInitialState);
   
  const userSession = useSelector((state: RootState) => state.UserSession);
  const { t } = useTranslation("accountsReport");
   const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
      dataField: "slNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 50,
    },
    {
      dataField: "mannualBarcode",
      caption: t("manual_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "totalSold",
      caption: t("total_sold"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totalSold == null
              ? 0
              : getFormattedValue(cellElement.data.totalSold);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totalSold == null
            ? 0
            : getFormattedValue(cellElement.data.totalSold);
        }
      },
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "totalValue",
      caption: t("total_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totalValue == null
              ? 0
              : getFormattedValue(cellElement.data.totalValue);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totalValue == null
            ? 0
            : getFormattedValue(cellElement.data.totalValue);
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
      visible: true,
      width: 60,
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
              : getFormattedValue(cellElement.data.stock, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stock == null
            ? 0
            : getFormattedValue(cellElement.data.stock, false, 4);
        }
      },
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "productGroup",
      caption: t("product_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
     {
      dataField: "stdPurchasePrice",
      caption: t("std_purchase_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 60,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stdPurchasePrice == null
              ? 0
              : getFormattedValue(cellElement.data.stdPurchasePrice, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stdPurchasePrice == null
            ? 0
            : getFormattedValue(cellElement.data.stdPurchasePrice, false, 4);
        }
      },
    },
    ];
    return baseColumns.filter((column) => {
      if (
        column.dataField == "routeName"
      ) {
        return filter.routeID > 0;
      }
    
      return true;
    });
  }, [t, filter]);

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
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);
  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "productName",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "totalSold",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totalValue",
      summaryType: "sum",
      valueFormat: "fixedPoint",
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
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                filterText="{branchId > -1 && of Branch : [branch]} {routeID > 0 && ,Route Name :[route]} From Date : {fromDate} - {toDate}"
                columns={columns}
                gridHeader={t("fast_moving_products")}
                dataUrl={Urls.fast_moving_products_reports}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<FastMovingReportFilter />}
                filterWidth={700}
                filterHeight={100}
                filterInitialData={{
                  ...FastMovingReportFilterInitialState,
                  fromDate: userSession.finFrom,
                  branchId: userSession.currentBranchId,
                  branch: userSession.currentBranchName
                }}
                 onFilterChanged={(f: any) => {
                  setFilter(f);
                }}
                reload={true}
                gridId={GridId.fast_moving_products_report}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default FastMovingProductsReport;
