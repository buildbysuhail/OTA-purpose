import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import { useLocation } from "react-router-dom";
import GroupwiseSalesSummaryFilter from "./groupwise-sales-summary-filter";

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
        dataField: "quantity",
        caption: t("quantity"),
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
        caption: t("sales_Percentage"),
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
        width: 100,
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
        width: 100,
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
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
        width: 100,
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
      //     dataField: "unitPrice",
      //     caption: t("unit_price"),
      //     dataType: "number",
      //     allowSearch: true,
      //     allowFiltering: true,
      //     allowSorting: true,
      //     width: 100,
      // },

      // {
      //     dataField: "stdSalesPrice",
      //     caption: t("std_sales_price"),
      //     dataType: "number",
      //     allowSearch: true,
      //     allowFiltering: true,
      //     allowSorting: true,
      //     width: 120,
      // },
      // {
      //     dataField: "stdPurchasePrice",
      //     caption: t("std_purchase_price"),
      //     dataType: "number",
      //     allowSearch: true,
      //     allowFiltering: true,
      //     allowSorting: true,
      //     width: 120,
      // },

      // {
      //     dataField: "profit",
      //     caption: t("profit"),
      //     dataType: "number",
      //     allowSearch: true,
      //     allowFiltering: true,
      //     allowSorting: true,
      //     width: 100,
      // },
      // {
      //     dataField: "costAsPerStdRate",
      //     caption: t("std_rate_cost"),
      //     dataType: "number",
      //     allowSearch: true,
      //     allowFiltering: true,
      //     allowSorting: true,
      //     width: 120,
      // },
      // {
      //     dataField: "profitAsPerStdRate",
      //     caption: t("std_rate_profit"),
      //     dataType: "number",
      //     allowSearch: true,
      //     allowFiltering: true,
      //     allowSorting: true,
      //     width: 120,
      // },
    ];
    return baseColumns
      .filter((column) => {
        if (column.dataField == "productGroup") {
          return filterInitialData.isGroupItem;
        }
        if (column.dataField == "category") {
          return !filterInitialData.isCategorywise;
        }
        if (column.dataField == "product_category") {
          return !filterInitialData.isProductCatwise;
        }
        if (column.dataField == "sectionName") {
          return !filterInitialData.IsSectionwise;
        }
        if (column.dataField == "brandName") {
          return !filterInitialData.isBrandwise;
        }
        return true;
      })
      .map((column) => {
        if (column.dataField !== "productGroup") return column;

        switch (true) {
          case filterInitialData.isCategoryWise:
            return {
              ...column,
              caption: "category",
              dataField: "category",
            };
          case filterInitialData.isProductCatwise:
            return {
              ...column,
              caption: "product_category",
              dataField: "productCategory",
            };
          case filterInitialData.IsSectionwise:
            return {
              ...column,
              caption: "section",
              dataField: "sectionName",
            };
          case filterInitialData.isBrandwise:
            return {
              ...column,
              caption: "brand_name",
              dataField: "brandName",
            };
          default:
            return column;
        }
      });

    //   .map((column) => {
    //       if (column.dataField == "productGroup" && filterInitialData.isCategoryWise) {
    //         return {
    //           ...column,
    //           caption: "category",
    //           dataField:"category"
    //         };
    //       }else if(column.dataField == "productGroup" && filterInitialData.isProductCatwise)

    //         {
    //             return {
    //               ...column,
    //               caption: "product_category",
    //               dataField:"productCategory"
    //             };
    //           }else if(column.dataField == "productGroup" && filterInitialData.IsSectionwise)

    //             {
    //                 return {
    //                   ...column,
    //                   caption: "section",
    //                   dataField:"section"
    //                 };
    //               }
    //               else if(column.dataField == "productGroup" && filterInitialData.isBrandwise)

    //                 {
    //                     return {
    //                       ...column,
    //                       caption: "brand_name",
    //                       dataField:"brandName"
    //                     };
    //                   }

    //       return column;
    //     });;
  }, [t, filterInitialData]);
  //   {
  //     dataField: "category",
  //     caption: t("category"),
  //     dataType: "string",
  //     allowSearch: true,
  //     allowFiltering: true,
  //     allowSorting: true,
  //     width: 100,
  // },
  // {
  //     dataField: "section",
  //     caption: t("section"),
  //     dataType: "string",
  //     allowSearch: true,
  //     allowFiltering: true,
  //     allowSorting: true,
  //     width: 100,
  // },
  // {
  //     dataField: "productCategory",
  //     caption: t("product_category"),
  //     dataType: "string",
  //     allowSearch: true,
  //     allowFiltering: true,
  //     allowSorting: true,
  //     width: 120,
  // },
  // {
  //     dataField: "brandName",
  //     caption: t("brand"),
  //     dataType: "string",
  //     allowSearch: true,
  //     allowFiltering: true,
  //     allowSorting: true,
  //     width: 100,
  // }
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
  const customizeSummaryRow100 = (itemInfo: any) => `100.00`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "quantity",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "grossValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totalDiscount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "netAmount",
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
    //total margin/ netvalue *100 as margin%
    {
      column: "marginPerc",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "margin",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "salesPerc",
      summaryType: "max",
      customizeText: customizeSummaryRow100,
    },
    {
      column: "marginSharePerc",
      summaryType: "max",
      customizeText: customizeSummaryRow100,
    },
    {
      column: "netValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },

    {
      column: "free",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
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
                filterText="From: {fromDate} - {toDate}"
                key={key}
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption={true}
                gridHeader={gridHeader}
                dataUrl={Urls.groupwise_sales_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<GroupwiseSalesSummaryFilter />}
                filterWidth={790}
                filterHeight={370}
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
