import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import ItemWisePurchaseReturnSummaryFilter, { ItemWisePurchaseReturnSummaryFilterInitialState } from "./itemwise-purchase-return-summary-filter";

const ItemWisePurchaseReturnSummary = () => {
  const { t } = useTranslation("accountsReport");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(ItemWisePurchaseReturnSummaryFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const onApplyFilter = useCallback((_filter: any) => { setFilter({ ..._filter }); }, []);
  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      groupIndex:0,
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
      dataField: "productID",
      caption: t("product_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
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
      dataField: "productCode",
      caption: t("code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
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
      dataField: "warehouseName",
      caption: t("warehouse"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
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
  const customizeDate = (itemInfo: any) =>  `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column:"productName",
      summaryType:"max",  
      isGroupItem: true,
      showInGroupFooter:true,
      customizeText: customizeDate,
    },
    {
      column: "totQty",
      summaryType: "sum",
      valueFormat: "currency",
      isGroupItem: true,
      showInGroupFooter:true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "totNetAmount",
      summaryType: "sum",
      valueFormat: "currency",
      isGroupItem: true,
      showInGroupFooter:true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "totFree",
      summaryType: "sum",
      valueFormat: "currency",
      isGroupItem: true,
      showInGroupFooter:true,
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption
                allowGrouping={true}
                groupPanelVisible={true}
                autoExpandAll={true}
                gridHeader={t("item_wise_purchase_return_summary")}
                dataUrl={Urls.item_wise_purchase_return_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<ItemWisePurchaseReturnSummaryFilter />}
                filterHeight={550}
                filterWidth={700}
                filterInitialData={ItemWisePurchaseReturnSummaryFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_item_wise_purchase_return_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ItemWisePurchaseReturnSummary;