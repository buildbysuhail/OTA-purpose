import { useTranslation } from "react-i18next"
import { Fragment } from "react"
import type { DevGridColumn } from "../../../components/types/dev-grid-column"
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid"
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
    {
      dataField: "iD",
      caption: t("id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      visible: false,
      showInPdf: true,
    },
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
          return (
            <span>
              {cellElement.data?.stockInWarehouse == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.stockInWarehouse))}
            </span>
          )
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
          return (
            <span>
              {cellElement.data?.stockInTransit == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.stockInTransit))}
            </span>
          )
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
          return (
            <span>
              {cellElement.data?.orderPending == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.orderPending))}
            </span>
          )
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
          return (
            <span>
              {cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total))}
            </span>
          )
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
          return (
            <span>
              {cellElement.data?.orderManual == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.orderManual))}
            </span>
          )
        }
      },
    },
  ]

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  filterText="from {dateFrom} to {dateTo}"
                  gridHeader={t("product_inventory")}
                  dataUrl={Urls.inventory_reports_product_inventory}
                  method={ActionType.POST}
                  gridId={GridId.grid_id}
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

