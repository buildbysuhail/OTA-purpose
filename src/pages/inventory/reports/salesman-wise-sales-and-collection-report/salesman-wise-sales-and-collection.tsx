import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import SalesmanwiseSalesAndCollectionFilter, {
  SalesmanwiseSalesAndCollectionFilterInitialState,
} from "./salesman-wise-sales-and-collection-filter";

const SalesmanwiseSalesAndCollection = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "salesManID",
      caption: t("salesman_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "salesMan",
      caption: t("salesman"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "salesRouteID",
      caption: t("sales_route_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "salesTarget",
      caption: t("sales_target"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      visible: false,
   cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.salesTarget == null
              ? 0
              : getFormattedValue(cellElement.data.salesTarget);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.salesTarget == null
            ? 0
            : getFormattedValue(cellElement.data.salesTarget);
        }
      },
    },
    {
      dataField: "incentivePercentage",
      caption: t("incentive_percent"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      visible: false,
    cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.incentivePercentage == null
              ? 0
              : getFormattedValue(cellElement.data.incentivePercentage,false,2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.incentivePercentage == null
            ? 0
            : getFormattedValue(cellElement.data.incentivePercentage,false,2);
        }
      },
    },
    {
      dataField: "totSales",
      caption: t("total_sales"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totSales == null
              ? 0
              : getFormattedValue(cellElement.data.totSales);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totSales == null
            ? 0
            : getFormattedValue(cellElement.data.totSales);
        }
      },
    },
    {
      dataField: "profit",
      caption: t("profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      visible: false,
   cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.profit == null
              ? 0
              : getFormattedValue(cellElement.data.profit);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.profit == null
            ? 0
            : getFormattedValue(cellElement.data.profit);
        }
      },
    },
    {
      dataField: "totCollection",
      caption: t("total_collection"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totCollection == null
              ? 0
              : getFormattedValue(cellElement.data.totCollection);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totCollection == null
            ? 0
            : getFormattedValue(cellElement.data.totCollection);
        }
      },
    },
    {
      dataField: "collectionPercentage",
      caption: t("collection_percent"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      visible: false,
    cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.collectionPercentage == null
              ? 0
              : getFormattedValue(cellElement.data.collectionPercentage,false,3);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.collectionPercentage == null
            ? 0
            : getFormattedValue(cellElement.data.collectionPercentage,false,3);
        }
      },
    },
    {
      dataField: "profitAsPerCollection",
      caption: t("profit_as_per_collection"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      visible: false,
     cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.profitAsPerCollection == null
              ? 0
              : getFormattedValue(cellElement.data.profitAsPerCollection);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.profitAsPerCollection == null
            ? 0
            : getFormattedValue(cellElement.data.profitAsPerCollection);
        }
      },
    },
    {
      dataField: "incentiveAsPerProfit",
      caption: t("incentive_as_per_profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      visible: false,
     cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.incentiveAsPerProfit == null
              ? 0
              : getFormattedValue(cellElement.data.incentiveAsPerProfit);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.incentiveAsPerProfit == null
            ? 0
            : getFormattedValue(cellElement.data.incentiveAsPerProfit);
        }
      },
    },
    {
      dataField: "incentiveAsPerCollection",
      caption: t("incentive_as_per_collection"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      visible: false,
     cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.incentiveAsPerCollection == null
              ? 0
              : getFormattedValue(cellElement.data.incentiveAsPerCollection);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.incentiveAsPerCollection == null
            ? 0
            : getFormattedValue(cellElement.data.incentiveAsPerCollection);
        }
      },
    },
  ];

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
  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "routeName",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "salesTarget",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totSales",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "profit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totCollection",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "profitAsPerCollection",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "incentiveAsPerProfit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "incentiveAsPerCollection",
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
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
                columns={columns}
                moreOption={true}
                filterText=": {fromDate} - {toDate}"
                gridHeader={t("salesmanwise_sales_and_collection_report")}
                dataUrl={Urls.salesmanwise_sales_and_collection}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<SalesmanwiseSalesAndCollectionFilter />}
                filterWidth={420}
                filterHeight={170}
                filterInitialData={
                  SalesmanwiseSalesAndCollectionFilterInitialState
                }
                reload={true}
                gridId="grd_salesmanwise_sales_and_collection"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SalesmanwiseSalesAndCollection;
