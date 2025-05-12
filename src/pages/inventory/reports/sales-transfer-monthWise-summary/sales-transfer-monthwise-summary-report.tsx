import { useTranslation } from "react-i18next"
import { FC, Fragment, useMemo } from "react"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import { ActionType } from "../../../../redux/types"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"
import SalesTransferMonthWiseSummaryReportFilter, { SalesTransferMonthWiseSummaryReportFilterInitialState } from "./sales-transfer-monthwise-summary-report-filter"

interface SalesTransferMonthWiseSummaryReportProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}

const SalesTransferMonthWiseSummaryReport: FC<SalesTransferMonthWiseSummaryReportProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport")
  const { getFormattedValue } = useNumberFormat()

  const columns: DevGridColumn[] = [
    {
      dataField: "year",
      caption: t("year"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "salesMan",
      caption: t("sales_man"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "january",
      caption: "January",
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
            cellElement.data?.january == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.january))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.january == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.january)))
        }
      },
    },
    {
      dataField: "february",
      caption: "February",
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
            cellElement.data?.february == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.february))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.february == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.february)))
        }
      },
    },
        {
      dataField: "march",
      caption: "March",
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
            cellElement.data?.march == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.march))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.march == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.march)))
        }
      },
    },
        {
      dataField: "april",
      caption: "April",
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
            cellElement.data?.april == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.april))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.april == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.april)))
        }
      },
    },
        {
      dataField: "may",
      caption: "May",
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
            cellElement.data?.may == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.may))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.may == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.may)))
        }
      },
    },
        {
      dataField: "june",
      caption: "June",
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
            cellElement.data?.june == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.june))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.june == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.june)))
        }
      },
    },
        {
      dataField: "july",
      caption: "July",
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
            cellElement.data?.july == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.july))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.july == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.july)))
        }
      },
    },
        {
      dataField: "august",
      caption: "August",
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
            cellElement.data?.august == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.august))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.august == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.august)))
        }
      },
    },
        {
      dataField: "september",
      caption: "September",
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
            cellElement.data?.september == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.september))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.september == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.september)))
        }
      },
    },
        {
      dataField: "october",
      caption: "October",
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
            cellElement.data?.october == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.october))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.october == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.october)))
        }
      },
    },
        {
      dataField: "november",
      caption: "November",
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
            cellElement.data?.november == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.november))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.november == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.november)))
        }
      },
    },
        {
      dataField: "december",
      caption: "December",
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
            cellElement.data?.december == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.december))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.december == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.december)))
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
            cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total)))
        }
      },
    },
  ];
  
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: any) => {
      console.log('itemInfo');

      console.log(itemInfo);

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
  }, []);
  const customizeDate = (itemInfo: any) => `TOTAL`;

    const summaryItems: SummaryConfig[] = [
      {
        column: "salesMan",
        summaryType: "custom",
        valueFormat:"string",
        customizeText: customizeDate,
      },
      {
        column: "january",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "february",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "march",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "april",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "may",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "june",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "july",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "august",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "september",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },

      {
        column: "october",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "november",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "december",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "total",
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
                  filterText="of {voucherForm!=''&& , Voucher Form : [voucherForm]}
                  {salesRouteID > 0 && , Route Name : [routeName]} 
                  {counterID > 0 && , Counter : [counterName]} 
                  {salesmanID > 0 && , Sales Man : [salesMan]} 
                  From Date : {fromDate} To Date : {toDate}"
                  gridHeader={t(gridHeader)}
                  dataUrl={dataUrl}
                  method={ActionType.POST}
                  gridId={gridId}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={400}
                  filterHeight={230}
                  filterContent={<SalesTransferMonthWiseSummaryReportFilter />}
                  filterInitialData={SalesTransferMonthWiseSummaryReportFilterInitialState}
                  hideGridAddButton={true}
                  reload={true}
                   remoteOperations={{
                  filtering: true,
                  paging: true,
                  sorting: true,
                  summary: true,
                }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default SalesTransferMonthWiseSummaryReport

