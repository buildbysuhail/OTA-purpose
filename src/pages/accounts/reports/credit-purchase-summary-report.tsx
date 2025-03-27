import { useTranslation } from "react-i18next"
import { Fragment } from "react"
import type { DevGridColumn } from "../../../components/types/dev-grid-column"
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid"
import Urls from "../../../redux/urls"
import { ActionType } from "../../../redux/types"
import { useNumberFormat } from "../../../utilities/hooks/use-number-format"
import moment from "moment"
import GridId from "../../../redux/gridId"
import CreditPurchaseSummaryReportFilter, { CreditPurchaseSummaryReportFilterInitialState } from "./credit-purchase-summary-report-filter "

const CreditPurchaseSummaryReport = () => {
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
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        return cellElement.data.date == null || cellElement.data.date == ""
          ? ""
          : moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY")
      },
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "gross",
      caption: t("gross"),
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
            cellElement.data?.gross == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.gross))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.gross == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.gross))}
            </span>
          )
        }
      },
    },
    {
      dataField: "disc",
      caption: t("discount"),
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
            cellElement.data?.disc == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.disc))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.disc == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.disc))}
            </span>
          )
        }
      },
    },
    {
      dataField: "billDiscount",
      caption: t("bill_discount"),
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
            cellElement.data?.billDiscount == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.billDiscount))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.billDiscount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.billDiscount))}
            </span>
          )
        }
      },
    },
    {
      dataField: "vat",
      caption: t("vat"),
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
          const value = cellElement.data?.vat == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.vat))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.vat == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.vat))}
            </span>
          )
        }
      },
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.grandTotal == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.grandTotal))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.grandTotal == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.grandTotal))}
            </span>
          )
        }
      },
    },
    {
      dataField: "cashDiscount",
      caption: t("cash_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cashDiscount == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.cashDiscount))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.cashDiscount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.cashDiscount))}
            </span>
          )
        }
      },
    },
    {
      dataField: "adjustmentAmount",
      caption: t("adjustment_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.adjustmentAmount == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.adjustmentAmount))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.adjustmentAmount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.adjustmentAmount))}
            </span>
          )
        }
      },
    },
    {
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cashReceived == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.cashReceived))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.cashReceived == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.cashReceived))}
            </span>
          )
        }
      },
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "exchangeRate",
      caption: t("exchange_rate"),
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
            cellElement.data?.exchangeRate == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.exchangeRate))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.exchangeRate == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.exchangeRate))}
            </span>
          )
        }
      },
    },
    {
      dataField: "masterID",
      caption: t("master_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "mInvoiceNo",
      caption: t("m_invoice_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        return cellElement.data.refDate == null || cellElement.data.refDate == ""
          ? ""
          : moment(cellElement.data.refDate, "DD-MM-YYYY").format("DD-MMM-YYYY")
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
                  filterText="from {fromDate} to {toDate}"
                  gridHeader={t("Credit_purchase_summary")}
                  dataUrl={Urls.Credit_purchase_summary}
                  method={ActionType.POST}
                  gridId={GridId.Credit_purchase_summary}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={550}
                  filterHeight={400}
                  filterContent={<CreditPurchaseSummaryReportFilter />}
                  filterInitialData={CreditPurchaseSummaryReportFilterInitialState}
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

export default CreditPurchaseSummaryReport