import { useTranslation } from "react-i18next"
import { FC, Fragment, useEffect, useMemo, useState } from "react"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import Urls from "../../../../redux/urls"
import { ActionType } from "../../../../redux/types"
import GridId from "../../../../redux/gridId"
import DailyStatementReportFilter, { DailyStatementReportInitialState } from "./daily-statement-report -filter"
import { useLocation } from "react-router-dom"
interface DailyStatementReportProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
// const DailyStatementReport = () => {
  const DailyStatementReport: FC<DailyStatementReportProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport")
  const { getFormattedValue } = useNumberFormat()
  const columns: DevGridColumn[] = [
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      groupIndex: 0,
      showInPdf: true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
      showInPdf: true,
    },
    {
      dataField: "formType",
      caption: t("form_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
      showInPdf: true,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 130,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cash",
      caption: t("cash"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cash == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.cash))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.cash == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.cash))}
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
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.credit == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.credit))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.credit == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.credit))}
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
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.bank == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.bank))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span>
              {cellElement.data?.bank == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.bank))}
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
  ];
 const location = useLocation();
  const [key, setKey] = useState(1);
  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 key={key}
                  autoExpandAll={true}
                  columns={columns}
                  gridHeader={t(gridHeader)}
                  filterText=" From {fromDate} To {toDate}"
                  dataUrl={dataUrl}
                  summaryItems={summaryItems}
                  remoteOperations={{ filtering: false, paging: false, sorting: false, summary: false, grouping: false, groupPaging: false }}
                  allowGrouping={true}
                  groupPanelVisible={true}
                  method={ActionType.POST}
                  gridId={gridId}
                  enablefilter={true}
                  showFilterInitially={false}
                  filterWidth={360}
                  filterHeight={250}
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

export default DailyStatementReport

