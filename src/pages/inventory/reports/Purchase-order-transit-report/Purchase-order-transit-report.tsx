import { useTranslation } from "react-i18next"
import { Fragment, useMemo } from "react"
import PurchaseOrderTransitReportFilter, { PurchaseOrderTransitReportInitialState } from "./Purchase-order-transit-report-filter"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import GridId from "../../../../redux/gridId"
import { ActionType } from "../../../../redux/types"
import Urls from "../../../../redux/urls"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"
import { isNullOrUndefinedOrEmpty } from "../../../../utilities/Utils"
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
      showInPdf: true,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 100,
      showInPdf: true,
    },
    {
      dataField: "stockInWarehouse",
      caption: t("stock_in_warehouse"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockInWarehouse == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.stockInWarehouse), false, 4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.stockInWarehouse == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.stockInWarehouse), false, 4))
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
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stockInTransit == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.stockInTransit), false, 4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.stockInTransit == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.stockInTransit), false, 4))
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
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.orderPending == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.orderPending), false, 4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.orderPending == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.orderPending), false, 4))
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
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total), false, 4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total), false, 4))
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
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.orderManual == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.orderManual), false, 4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.orderManual == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.orderManual), false, 4))
        }
      },
    },
  ]
  //  const customizeSummaryRow = useMemo(() => {
  //     return (itemInfo: { value: any }) => {
  //       const value = itemInfo.value;
  //       if (
  //         value === null ||
  //         value === undefined ||
  //         value === "" ||
  //         isNaN(value)
  //       ) {
  //         return "0"; // Ensure "0" is displayed when value is missing
  //       }
  //       return getFormattedValue(value,false,2) || "0"; // Ensure formatted output or fallback to "0"
  //     };
  //   }, []);
  
  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [

    {
      column: "productName",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "stockInWarehouse",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: (itemInfo: { value: any })=>{
             return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
           },
         },
    {
      column: "stockInTransit",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: (itemInfo: { value: any })=>{
             return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
           },
         },
    {
      column: "orderPending",
      summaryType: "sum",
      valueFormat: "number",
     customizeText: (itemInfo: { value: any })=>{
            return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
          },
        },
    {
      column: "total",
      summaryType: "sum",
      valueFormat: "number",
     customizeText: (itemInfo: { value: any })=>{
            return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
          },
        },
    {
      column: "orderManual",
      summaryType: "sum",
      valueFormat: "number",
      customizeText: (itemInfo: { value: any })=>{
             return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
           },
         },
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
                  remoteOperations={{ filtering: false, paging: false, sorting: false, summary: false }}
                  summaryItems={summaryItems}
                  filterText="from {dateFrom} to {dateTo} {partyID > 0 && , Party Name : [PartyName]}"
                  gridHeader={t("purchase_order_transit_report")}
                  dataUrl={Urls.Purchase_Order_Transit_And_Stock_Details}
                  method={ActionType.POST}
                  gridId={GridId.Purchase_Order_Transit_Report}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={500}
                  filterHeight={250}
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

