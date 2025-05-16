import { useTranslation } from "react-i18next"
import { Fragment, useMemo } from "react"
import moment from "moment"
import PurchaseTaxReportFilter, { PurchaseTaxReportFilterInitialState } from "./Purchase-Tax-report-filter"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import GridId from "../../../../redux/gridId"
import { ActionType } from "../../../../redux/types"
import Urls from "../../../../redux/urls"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"

const PurchaseTaxReport = () => {
  const { t } = useTranslation("accountsReport")
  const { getFormattedValue } = useNumberFormat()

  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      format: "dd-MMM-yyyy"
    },
    {
      dataField: "customerName",
      caption: t("customer_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 200,
      showInPdf: true,
    },
    {
      dataField: "invoiceNumber",
      caption: t("invoice_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "taxableAmount",
      caption: t("taxable_amount"),
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
            cellElement.data?.taxableAmount == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.taxableAmount))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.taxableAmount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.taxableAmount))}
            </span>
          )
        }
      },
    },
    {
      dataField: "vatPercentage",
      caption: t("vat_percentage"),
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
            cellElement.data?.vatPercentage == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.vatPercentage), false, 4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.vatPercentage == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.vatPercentage), false, 4)}
            </span>
          )
        }
      },
    },
    {
      dataField: "vatAmount",
      caption: t("vat_amount"),
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
            cellElement.data?.vatAmount == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.vatAmount), false, 4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.vatAmount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.vatAmount), false, 4)}
            </span>
          )
        }
      },
    },
    {
      dataField: "amount",
      caption: t("amount"),
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
            cellElement.data?.amount == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.amount))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.amount == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.amount))}
            </span>
          )
        }
      },
    },
    {
      dataField: "taxNumber",
      caption: t("tax_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "crNumber",
      caption: t("cr_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "creditOrCash",
      caption: t("credit_or_cash"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "transactionType",
      caption: t("transaction_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
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
    const customizeSummaryRow1 = useMemo(() => {
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
      return getFormattedValue(value,false,4) || "0"; // Ensure formatted output or fallback to "0"
    };
  }, []);
  const summaryItems: SummaryConfig[] = [
    {
      column: "customerName",
      summaryType: "custom",
      valueFormat: "string",
      displayFormat: "TOTAL"
    },
    {
      column: "taxableAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "vatAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow1,
    },
    {
      column: "amount",
      summaryType: "sum",
      valueFormat: "currency",
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
                  filterText="from {fromDate} to {toDate}"
                  gridHeader={t("purchase_tax_report")}
                  dataUrl={Urls.Purchase_tax}
                  method={ActionType.POST}
                  gridId={GridId.Purchase_tax}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={335}
                  filterHeight={230}
                  filterContent={<PurchaseTaxReportFilter />}
                  filterInitialData={PurchaseTaxReportFilterInitialState}
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

export default PurchaseTaxReport

