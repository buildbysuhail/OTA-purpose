import { useTranslation } from "react-i18next"
import { Fragment, useMemo } from "react"
import  {  DailyStatementReportInitialState } from "./daily-statement-report -filter"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import GridId from "../../../../redux/gridId"
import { ActionType } from "../../../../redux/types"
import Urls from "../../../../redux/urls"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import DailyStatementReportFilter from "./daily-statement-report -filter"

const DailyStatementAllReport = () => {
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
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      groupIndex: 0,
      showInPdf: true,
    },
    {
      dataField: "vchNo",
      caption: t("voucherNo"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "formType",
      caption: t("form_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 130,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "cash",
      caption: t("cash"),
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
            cellElement.data?.cash == null ? "" : cellElement.data?.cash >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.cash)) : getFormattedValue(-1 * cellElement.data.cash)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.cash == null ? "" : cellElement.data?.cash >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.cash)) : getFormattedValue(-1 * cellElement.data.cash)}
            </span>
          )
        }
      },
    },
    {
      dataField: "bank",
      caption: t("bank"),
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
            cellElement.data?.bank == null ? "" : cellElement.data?.bank >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.bank)) : getFormattedValue(-1 * cellElement.data.bank)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.bank == null ? "" : cellElement.data?.bank >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.bank)) : getFormattedValue(-1 * cellElement.data.bank)}
            </span>
          )
        }
      },
    },
    {
      dataField: "credit",
      caption: t("credit"),
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
            cellElement.data?.credit == null ? "" : cellElement.data?.credit >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.credit)) : getFormattedValue(-1 * cellElement.data.credit)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.credit == null ? "" : cellElement.data?.credit >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.credit)) : getFormattedValue(-1 * cellElement.data.credit)}
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
      width: 80,
      visible: true,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.total == null ? "" : cellElement.data?.total >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.total)) : getFormattedValue(-1 * cellElement.data.total)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.total == null ? "" : cellElement.data?.total >= 0 ? getFormattedValue(Number.parseFloat(cellElement.data.total)) : getFormattedValue(-1 * cellElement.data.total)}
            </span>
          )
        }
      },
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      visible: false,
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
      return value >= 0 ? getFormattedValue(value, false, 2) : getFormattedValue(-1 * value, false, 2) || "0"; // Ensure formatted output or fallback to "0"
    };
  }, []);
  const customizeDate = (itemInfo: any) => `TOTAL`;
  const customizeGroup = (itemInfo: any) => `Group Total`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "party",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "cash",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "credit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "bank",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "total",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "party",
      summaryType: "max",
      isGroupItem: true,
      showInGroupFooter: true,
      customizeText: customizeGroup,
    },
    {
      column: "cash",
      summaryType: "sum",
      isGroupItem: true,
      valueFormat: "currency",
      showInGroupFooter: true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "credit",
      summaryType: "sum",
      isGroupItem: true,
      valueFormat: "currency",
      showInGroupFooter: true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "bank",
      summaryType: "sum",
      isGroupItem: true,
      valueFormat: "currency",
      showInGroupFooter: true,
      customizeText: customizeSummaryRow,
    },
    {
      column: "total",
      summaryType: "sum",
      isGroupItem: true,
      valueFormat: "currency",
      showInGroupFooter: true,
      customizeText: customizeSummaryRow,
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
                  autoExpandAll={true}
                  columns={columns}
                  filterText=" From {fromDate} To {toDate}"
                  gridHeader={t("daily_statement_report_of_all")}
                  dataUrl={Urls.daily_statement_all}
                  summaryItems={summaryItems}
                  remoteOperations={{ filtering: false, paging: false, sorting: false, summary: false, grouping: false, groupPaging: false }}
                  allowGrouping={true}
                  groupPanelVisible={true}
                  method={ActionType.POST}
                  gridId={GridId.daily_statement_all}
                  enablefilter={true}
                  showFilterInitially={false}
                  filterWidth={360}
                  filterHeight={150}
                  filterContent={<DailyStatementReportFilter />}
                  filterInitialData={DailyStatementReportInitialState}
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

export default DailyStatementAllReport;