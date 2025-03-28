import { useTranslation } from "react-i18next"
import { Fragment, useMemo } from "react"
import type { DevGridColumn } from "../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../components/ERPComponents/erp-dev-grid"
import Urls from "../../../redux/urls"
import { ActionType } from "../../../redux/types"
import { useNumberFormat } from "../../../utilities/hooks/use-number-format"
import GridId from "../../../redux/gridId"
import PurchaseOrderTransitReportFilter, { PurchaseOrderTransitReportInitialState } from "./Purchase-order-transit-report-filter"
// import ProductInventoryReportFilter, {
//   ProductInventoryReportFilterInitialState,
// } from "./product-inventory-report-filter"

const PurchaseOrderTransitReport = () => {
  // const { t } = useTranslation("inventoryReport")
  const { t } = useTranslation("accountsReport")
  const { getFormattedValue } = useNumberFormat()

  const columns: DevGridColumn[] = [
    // {
    //   dataField: "iD",
    //   caption: t("id"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 80,
    //   visible: false,
    //   showInPdf: true,
    // },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "stockInWareHouse",
      caption: t("stock_in_warehouse"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockInWarehouse == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.stockInWarehouse))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return ( cellElement.data?.stockInWarehouse == null? "" : getFormattedValue(Number.parseFloat(cellElement.data.stockInWarehouse)))
        }
      },
    },
    {
      dataField: "stockInTransit",
      caption: t("stock_in_transit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockInTransit == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.stockInTransit))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return ( cellElement.data?.stockInTransit == null? "" : getFormattedValue(Number.parseFloat(cellElement.data.stockInTransit)))
        }
      },
    },
    {
      dataField: "orderPending",
      caption: t("order_pending"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.orderPending == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.orderPending))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return ( cellElement.data?.orderPending == null? "" : getFormattedValue(Number.parseFloat(cellElement.data.orderPending)))
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
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return ( cellElement.data?.total == null? "" : getFormattedValue(Number.parseFloat(cellElement.data.total)))
        }
      },
    },
    {
      dataField: "orderManual",
      caption: t("order_manual"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.orderManual == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.orderManual))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return ( cellElement.data?.orderManual == null? "" : getFormattedValue(Number.parseFloat(cellElement.data.orderManual)))
        }
      },
    },
  ]
   const customizeSummaryRow = useMemo(() => {
      return (itemInfo: { value: any }) => {
        const value = itemInfo.value;
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          isNaN(value)
        ) {
          return "0"; // Ensure "0" is displayed when value is missing
        }
        return getFormattedValue(value) || "0"; // Ensure formatted output or fallback to "0"
      };
    }, []);
  
const summaryItems: SummaryConfig[] = [
    {
      column: "productName",
      summaryType: "custom",
      valueFormat: "string",
      displayFormat:"TOTAL"
    },
    {
      column: "stockInWareHouse",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stockInTransit",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    },
    {
      column: "orderPending",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    },
    {
      column: "total",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    },
    {
      column: "orderManual",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: customizeSummaryRow,
    }
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  summaryItems={summaryItems}
                  filterText="from {dateFrom} to {dateTo}"
                  gridHeader={t("Purchase_Order_Transit_Report")}
                  dataUrl={Urls.Purchase_Order_Transit_And_Stock_Details}
                  method={ActionType.POST}
                  gridId={GridId.Purchase_Order_Transit_Report}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={335}
                  filterHeight={350}
                  filterContent={<PurchaseOrderTransitReportFilter />}
                  filterInitialData={PurchaseOrderTransitReportInitialState}
                  hideGridAddButton={true}
                  reload={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default PurchaseOrderTransitReport

