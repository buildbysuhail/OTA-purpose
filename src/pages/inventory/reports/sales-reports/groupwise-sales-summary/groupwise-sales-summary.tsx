import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { FC, useEffect, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import { useLocation } from "react-router-dom";
import GroupwiseSalesSummaryFilter from "./groupwise-sales-summary-filter";
import { erpParseFloat } from "../../../../../utilities/Utils";

interface SummaryProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
  filterInitialData: any;
}

const GroupwiseSalesSummary: FC<SummaryProps> = ({
  gridHeader,
  dataUrl,
  gridId,
  filterInitialData,
}) => {
  const location = useLocation();
  const { t } = useTranslation("accountsReport");
  const [marginPercentage, setMarginPercentage] = useState(0)

  const handleCalculateSummary = (e: any) => {
    if (e.name !== "marginPerc") return;
    switch (e.summaryProcess) {
      case "start":
        e.totalMargin = 0;
        e.totalNetValue = 0;
        break;
      case "calculate":
        const dataSource = e.component.getDataSource();
        console.log("dataSource", dataSource);

        const allRows = dataSource.items();
        console.log("allRows", allRows);
        const row = allRows[e.rowIndex];
        if (row) {
          const margin = Number(row.margin) || 0;
          const netValue = Number(row.netValue) || 0;
          e.totalMargin += margin;
          e.totalNetValue += netValue;
        }
        break;
      case "finalize":
        e.totalValue = e.totalNetValue
          ? (e.totalMargin / e.totalNetValue) * 100
          : 0;
        break;
    }
  };

  const handleContentReady = (e:any) => {
      setTimeout(() => {
        // Calculating margin pecentage by (margin/netValue)*100
        const netValueTotal = e.component.getTotalSummaryValue("netValue");
        const netMarginTotal = e.component.getTotalSummaryValue("margin");
        const marginPercent = netValueTotal !== 0
            ? (netMarginTotal / netValueTotal) * 100
            : 0;
        setMarginPercentage(marginPercent)
      }, 100);
    };

  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "productGroup",
        caption: t("product_group"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
      },
      {
        dataField: "category",
        caption: t("category"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
      },
      {
        dataField: "sectionName",
        caption: t("section"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
      },
      {
        dataField: "productCategory",
        caption: t("product_category"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
      },
      {
        dataField: "brandName",
        caption: t("brand"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
      },
      {
        dataField: "salesman",
        caption: t("salesman"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
      },
      {
        dataField: "quantity",
        caption: t("quantity"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.quantity == null
                ? ""
                : getFormattedValue(cellElement.data.quantity);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.quantity == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.quantity));
          }
        },
      },
      {
        dataField: "grossValue",
        caption: t("gross_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 200,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.grossValue == null
                ? ""
                : getFormattedValue(cellElement.data.grossValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.grossValue == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.grossValue));
          }
        },
      },
      {
        dataField: "totalDiscount",
        caption: t("total_discount"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 200,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.totalDiscount == null
                ? ""
                : getFormattedValue(cellElement.data.totalDiscount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalDiscount == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.totalDiscount));
          }
        },
      },
      {
        dataField: "netAmount",
        caption: t("net_amount"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.netAmount == null
                ? ""
                : getFormattedValue(cellElement.data.netAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netAmount == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.netAmount));
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
        width: 150,
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
                ? ""
                : getFormattedValue(cellElement.data.cost);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cost == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.cost));
          }
        },
      },
      {
        dataField: "marginPerc",
        caption: t("margin_percentage"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.marginPerc == null
                ? ""
                : getFormattedValue(cellElement.data.marginPerc);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.marginPerc == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.marginPerc));
          }
        },
      },
      {
        dataField: "margin",
        caption: t("margin"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.margin == null
                ? ""
                : getFormattedValue(cellElement.data.margin);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.margin == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.margin));
          }
        },
      },
      {
        dataField: "salesPerc",
        caption: t("sales_percentage"),
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
              cellElement.data?.salesPerc == null
                ? ""
                : getFormattedValue(cellElement.data.salesPerc);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesPerc == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.salesPerc));
          }
        },
      },
      {
        dataField: "marginSharePerc",
        caption: t("margin_share_percentage"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.marginSharePerc == null
                ? ""
                : getFormattedValue(cellElement.data.marginSharePerc);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.marginSharePerc == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.marginSharePerc));
          }
        },
      },

      //margin %
      // margin
      //sales %
      //margin share %

      {
        dataField: "branchName",
        caption: t("branch_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 200,
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.netValue == null
                ? ""
                : getFormattedValue(cellElement.data.netValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.netValue == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.netValue));
          }
        },
      },
      {
        dataField: "free",
        caption: t("free"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.free == null
                ? ""
                : getFormattedValue(cellElement.data.free);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.free == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.free));
          }
        },
      },
      // {
      //   dataField: "unitPrice",
      //   caption: t("unit_price"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   allowSorting: true,
      //   width: 100,
      // },
      // {
      //   dataField: "stdSalesPrice",
      //   caption: t("std_sales_price"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   allowSorting: true,
      //   width: 120,
      // },
      // {
      //   dataField: "stdPurchasePrice",
      //   caption: t("std_purchase_price"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   allowSorting: true,
      //   width: 120,
      // },
      // {
      //   dataField: "profit",
      //   caption: t("profit"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   allowSorting: true,
      //   width: 100,
      // },
      // {
      //   dataField: "costAsPerStdRate",
      //   caption: t("std_rate_cost"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   allowSorting: true,
      //   width: 120,
      // },
      // {
      //   dataField: "profitAsPerStdRate",
      //   caption: t("std_rate_profit"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   allowSorting: true,
      //   width: 120,
      // },
    ];
    return baseColumns.filter((column) => {
      if (column.dataField == "productGroup") {
        return filterInitialData.isGroupWise;
      }
      if (column.dataField == "category") {
        return filterInitialData.isCategoryWise;
      }
      if (column.dataField == "productCategory") {
        return filterInitialData.isProductCatWise;
      }
      if (column.dataField == "sectionName") {
        return filterInitialData.isSectionWise;
      }
      if (column.dataField == "brandName") {
        return filterInitialData.isBrandWise;
      }
      if (column.dataField == "salesman") {
        return filterInitialData.isSalesmanwise;
      }
      return true;
    });

    //   .map((column) => {
    //     if (column.dataField !== "productGroup") return column;

    //     switch (true) {
    //       case filterInitialData.isCategoryWise:
    //         return {
    //           ...column,
    //           caption: "category",
    //           dataField: "category",
    //         };
    //       case filterInitialData.isProductCatwise:
    //         return {
    //           ...column,
    //           caption: "product_category",
    //           dataField: "productCategory",
    //         };
    //       case filterInitialData.IsSectionwise:
    //         return {
    //           ...column,
    //           caption: "section",
    //           dataField: "sectionName",
    //         };
    //       case filterInitialData.isBrandwise:
    //         return {
    //           ...column,
    //           caption: "brand_name",
    //           dataField: "brandName",
    //         };
    //       default:
    //         return column;
    //     }
    //   });

    // .map((column) => {
    //     if (column.dataField == "productGroup" && filterInitialData.isCategoryWise) {
    //       return {
    //         ...column,
    //         caption: "category",
    //         dataField: "category"
    //       };
    //     } else if (column.dataField == "productGroup" && filterInitialData.isProductCatwise) {
    //       return {
    //         ...column,
    //         caption: "product_category",
    //         dataField: "productCategory"
    //       };
    //     } else if (column.dataField == "productGroup" && filterInitialData.IsSectionwise) {
    //       return {
    //         ...column,
    //         caption: "section",
    //         dataField: "section"
    //       };
    //     }
    //     else if (column.dataField == "productGroup" && filterInitialData.isBrandwise) {
    //       return {
    //         ...column,
    //         caption: "brand_name",
    //         dataField: "brandName"
    //       };
    //     }

    //     return column;
    //   });
  }, [t, filterInitialData]);

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

  // const customizeSummaryRowCalc = useMemo(() => {
  //   return (itemInfo: { value: any }) => {
  //     const value = itemInfo.value;
  //     if (
  //       value === null ||
  //       value === undefined ||
  //       value === "" ||
  //       isNaN(value)
  //     ) {
  //       return "0";
  //     }
  //     return getFormattedValue(value) || "0";
  //   };
  // }, [getFormattedValue]);

  const customizeSummaryRow100 = (itemInfo: any) => `100.00`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "quantity",
      summaryType: "custom",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "grossValue",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "totalDiscount",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "netAmount",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "cost",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    //total margin/ netvalue *100 as margin%
    {
      column: "marginPerc",
      summaryType: "custom", //summaryType: "custom",
      valueFormat: "percent",
      showInColumn: "marginPerc",
      customizeText: (e: any) => {
        const result = erpParseFloat(getFormattedValue(marginPercentage));
        return result.toString()
      },
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "margin",
      summaryType: "custom",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "salesPerc",
      summaryType: "max", // Check
      customizeText: customizeSummaryRow100,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "marginSharePerc",
      summaryType: "max", // check
      customizeText: customizeSummaryRow100,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "netValue",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "free",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
  ];

  const [key, setKey] = useState(1);
  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
              // not working head from direct
              // {isCategorywise == true && , Categorywise Sales Report From:} 
              //    {isSectionwise == true && , Sectionwise Sales Report From:} 
              //    {isProductCatwise == true && , ProductCategorywise Sales Report From:} 
              //    {isBrandwise == true && , Brandwise Sales Report From:} 
              //    {isSalesmanwise == true && , Salesmanwise Sales Report From: } 
              //    {isProductCatwise == false & isCategorywise == false & isSectionwise == false & isBrandwise==false & isSalesmanwise==false && ,Groupwise Sales Report From:}
                 
                filterText=" From: {fromDate} - {toDate}
                 {productGroupID > 0 && , Group : [productGroup]} 
                 {groupCategoryID > 0 && , Category :  [groupCategory]}
                 {sectionID > 0 && , Section :  [section]}
                 {salesmanID > 0 && , salesman :  [salesman]}
                 "
                key={key}
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                handleCalculateSummary={handleCalculateSummary}
                onContentReady={handleContentReady}
                columns={columns}
                gridHeader={t(gridHeader)}
                dataUrl={Urls.groupwise_sales_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                //  allowEditing={{
                //   allow: true,
                //   config: {
                //     edit: true,
                //     add: false,
                //     delete: false,
                //   },
                // }}
                filterContent={<GroupwiseSalesSummaryFilter />}
                filterWidth={790}
                filterHeight={250}
                filterInitialData={filterInitialData}
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

export default GroupwiseSalesSummary;
