import { useTranslation } from "react-i18next"
import { Fragment } from "react"
import type { DevGridColumn } from "../../../components/types/dev-grid-column"
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid"
import Urls from "../../../redux/urls"
import { ActionType } from "../../../redux/types"
import { useNumberFormat } from "../../../utilities/hooks/use-number-format"
import moment from "moment"
import GridId from "../../../redux/gridId"
import ItemwisePurchaseSummaryReportFilter, { ItemwisePurchaseSummaryReportFilterInitialState } from "./itemwise-purchase-summary-report-filter"

const  ItemwisePurchaseSummaryReport = () => {
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
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "productName",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 200,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "totQty",
      caption: t("tot_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totQty == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totQty))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.totQty == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totQty))}
            </span>
          )
        }
      },
    },
    {
      dataField: "totGross",
      caption: t("tot_gross"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totGross == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totGross))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.totGross == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.totGross))}
            </span>
          )
        }
      },
    },
    {
      dataField: "totDisc",
      caption: t("tot_disc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totDisc == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totDisc))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.totDisc == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totDisc))}
            </span>
          )
        }
      },
    },
    {
      dataField: "totNetValue",
      caption: t("tot_net_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totNetValue == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.totNetValue))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.totNetValue == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.totNetValue))}
            </span>
          )
        }
      },
    },
    {
      dataField: "totVat",
      caption: t("tot_vat"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 85,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totVat == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totVat))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.totVat == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totVat))}
            </span>
          )
        }
      },
    },
    {
      dataField: "totNetAmount",
      caption: t("tot_net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 85,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totNetAmount == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.totNetAmount))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.totNetAmount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.totNetAmount))}
            </span>
          )
        }
      },
    },
    {
      dataField: "productID",
      caption: t("product_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "unitCode",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "totFree",
      caption: t("free"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totFree == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totFree))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.totFree == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.totFree))}
            </span>
          )
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
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "qtyDetails",
      caption: t("qty_details"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "groupCategoryName",
      caption: t("group_category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "sectionName",
      caption: t("section_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "warehouseName",
      caption: t("warehouse"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
      showInPdf: true,
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
                  filterText="from {fromDate} to {toDate}"
                  gridHeader={t("invoice_transaction_report")}
                  dataUrl={Urls.itemwise_purchase_summary}
                  method={ActionType.POST}
                  gridId={GridId.grid_id}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={550}
                  filterHeight={650}
                  filterContent={<ItemwisePurchaseSummaryReportFilter />}
                  filterInitialData={ItemwisePurchaseSummaryReportFilterInitialState}
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

export default  ItemwisePurchaseSummaryReport