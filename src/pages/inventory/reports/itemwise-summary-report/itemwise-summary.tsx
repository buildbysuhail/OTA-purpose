import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ItemWiseSummaryFilter, { ItemWiseSummaryFilterInitialState } from "./itemwise-summary-filter";

interface ItemWiseSummaryReportProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const ItemWiseSummaryReport: FC<ItemWiseSummaryReportProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport");
  const [filter, setFilter] = useState<any>(
    ItemWiseSummaryFilterInitialState
  );
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );


  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      //iscategorywise  groupindex =0 for category
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "productCode",
        caption: t("code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 70,
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        width: 100,
      },
      {
        dataField: "productName",
        caption: t("product"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "totQty",
        caption: t("total_qty"),
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
              cellElement.data?.totQty == null
                ? 0
                : getFormattedValue(cellElement.data.totQty);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totQty == null
              ? 0
              : getFormattedValue(cellElement.data.totQty);
          }
        },
      },
      {
        dataField: "totFree",
        caption: t("free"),
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
              cellElement.data?.totFree == null
                ? 0
                : getFormattedValue(cellElement.data.totFree);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totFree == null
              ? 0
              : getFormattedValue(cellElement.data.totFree);
          }
        },
      },
      {
        dataField: "unitCode",
        caption: t("unit"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 70,
      },
      {
        dataField: "totGross",
        caption: t("total_gross"),
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
              cellElement.data?.totGross == null
                ? 0
                : getFormattedValue(cellElement.data.totGross);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totGross == null
              ? 0
              : getFormattedValue(cellElement.data.totGross);
          }
        },
      },
      {
        dataField: "totDisc",
        caption: t("total_discount"),
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
              cellElement.data?.totDisc == null
                ? 0
                : getFormattedValue(cellElement.data.totDisc);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totDisc == null
              ? 0
              : getFormattedValue(cellElement.data.totDisc);
          }
        },
      },
      {
        dataField: "totNetValue",
        caption: t("total_net_value"),
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
              cellElement.data?.totNetValue == null
                ? 0
                : getFormattedValue(cellElement.data.totNetValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totNetValue == null
              ? 0
              : getFormattedValue(cellElement.data.totNetValue);
          }
        },
      },

      {
        dataField: "totVat",
        caption: t("total_vat"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 85,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.totVat == null
                ? 0
                : getFormattedValue(cellElement.data.totVat);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totVat == null
              ? 0
              : getFormattedValue(cellElement.data.totVat);
          }
        },
      },
      {
        dataField: "totNetAmount",
        caption: t("total_net_amount"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 85,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.totNetAmount == null
                ? 0
                : getFormattedValue(cellElement.data.totNetAmount);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totNetAmount == null
              ? 0
              : getFormattedValue(cellElement.data.totNetAmount);
          }
        },
      },
      {
        dataField: "warehouseName",
        caption: t("warehouse"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        width: 100,
      },
      {
        dataField: "branchName",
        caption: t("branch_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        width: 70,
      },
      {
        dataField: "qtyDetails",
        caption: t("qty_details"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },

      {
        dataField: "groupCategoryName",
        caption: t("group_category_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "sectionName",
        caption: t("section_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "category",
        caption: t("category"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "brandName",
        caption: t("brand_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "totalTaxAmount",
        caption: t("total_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
    ];
    // Filter columns based on the `visible` property
    return baseColumns.filter((column) => {
      if (column.dataField == "totVat") {
        return applicationSettings.branchSettings.maintainTaxes && !clientSession.isAppGlobal;
      }
      if (column.dataField == "branchName") {
        return userSession.currentBranchId == 0;
      }
      if (column.dataField == "siNo") {
        return filter.isCategoryWise == false;
      }
      if (column.dataField == "totalTaxAmount" || column.dataField == "brandName" || column.dataField == "category") {
        return clientSession.isAppGlobal || filter.isCategoryWise == true;
      }
      return true;
    })
      // .map((column) => {
      //   debugger;
      //   if (column.dataField == "groupName") {
      //     column.groupIndex = filter.isCategoryWise == true ? undefined : 0 ;
      //   }
      //   if (column.dataField == "category") {
      //     column.groupIndex = filter.isCategoryWise == true ? 0 : undefined ;
      //   }
      //   return column;
      // }) as DevGridColumn[]
      ;
  }, [t, filter, filter.isCategoryWise, userSession.dbIdValue]);
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
  const customizeDate = (itemInfo: any) => `Net Total`;
  const customizeGroup = (itemInfo: any) => `Group Total`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "productName",
      summaryType: "max",
      isGroupItem: true,
      showInGroupFooter: true,
      customizeText: customizeGroup,
    },
    {
      column: "totQty",
      summaryType: "sum",
      valueFormat: "currency",
      isGroupItem: true,
      showInGroupFooter: true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "totNetAmount",
      summaryType: "sum",
      valueFormat: "currency",
      isGroupItem: true,
      showInGroupFooter: true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "totFree",
      summaryType: "sum",
      valueFormat: "currency",
      isGroupItem: true,
      showInGroupFooter: true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "productName",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "totQty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totNetAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totFree",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];

  const dataGridRef = useRef<any>(null);
  useEffect(() => {
    const gridInstance = dataGridRef.current?.instance();
    if (gridInstance) {
      gridInstance.clearGrouping(); // Explicitly clear existing grouping
      gridInstance.columnOption(
        filter.isCategoryWise ? "category" : "groupName",
        "groupIndex",
        0
      );
    }
  }, [filter.isCategoryWise]);
  
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                ref={dataGridRef}
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                // moreOption
                filterText=" From : {fromDate} - {toDate} 
                {partyID > 0 && , Party :[party]} 
                {supplierID > 0 && ,  Supplier :[supplier]} 
                {productGroupID > 0 && , Product Group: [productGroup]} 
                {warehouseID > 0 && , Warehouse: [warehouse]} 
                {brandID > 0 && , Brand: [brand]}
                {salesmanID > 0 && , Sales Man: [salesman]}"
                // {salesRouteID > 0 && , Route: [salesRoute]} salesRouteID is always visible false
                allowGrouping={true}
                groupPanelVisible={true}
                autoExpandAll={true}
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<ItemWiseSummaryFilter />}
                filterHeight={550}
                filterWidth={700}
                filterInitialData={
                  ItemWiseSummaryFilterInitialState
                }
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

export default ItemWiseSummaryReport;
