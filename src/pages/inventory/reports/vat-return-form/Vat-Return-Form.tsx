import { useTranslation } from "react-i18next"
import { Fragment, useMemo } from "react"
import moment from "moment"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import GridId from "../../../../redux/gridId"
import { ActionType } from "../../../../redux/types"
import Urls from "../../../../redux/urls"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"
import PurchaseTaxReportFilter, { PurchaseTaxReportFilterInitialState } from "../Purchase-Tax-report/Purchase-Tax-report-filter"

const VatReturnForm = () => {
  const { t } = useTranslation("accountsReport")
  const { getFormattedValue } = useNumberFormat()

  const columns: DevGridColumn[] = [
    {
      dataField: "title",
      caption: t("title"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,

     cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) + " Cr"
                : getFormattedValue(balance) + " Dr";
          return  {
            ...exportCell,
            text: cellInfo.value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.title === "TOTAL" ? '#FF0000' : cellElement.data.title === "Pending Cheques" || cellElement.data.title === "Total Pending Cheque Amt" ?'#0000FF':'',
            font: {
              ...exportCell.font,
              color: cellElement.data.title === "TOTAL" ? { argb: 'FFFF0000' } :cellElement.data.title === "Pending Cheques" || cellElement.data.title === "Total Pending Cheque Amt" ?{ argb: 'FF0000FF' }: "",
              size: 10,
              style:cellElement.data.title === "TOTAL" ||cellElement.data.title === "Pending Cheques" || cellElement.data.title === "Total Pending Cheque Amt" ?'bold':'normal',
              bold: cellElement.data.title === "TOTAL" ||cellElement.data.title === "Pending Cheques" || cellElement.data.title === "Total Pending Cheque Amt" ?true:false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data?.title=="Total sales"||
            cellElement.data?.title=="Total purchases"||
            cellElement.data?.title=="Total VAT due for current period"||
               cellElement.data?.title=="Net VAT due (or claim)"
            ? 'font-bold text-[#DC143C]' : 
            cellElement.data?.title=="VAT on sales"?'font-bold bg-[#1b7c47] text-[#fcfafb]':
            cellElement.data?.title=="VAT On Purchases"?'font-bold bg-[#eb9d29] text-[#fcfafb]':
            
            ''}`}>
            {cellElement.data.title}
          </span>)
        }
      },
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      visible: true,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.amount == null
              ? ""
              :cellElement.data?.title=="Total sales"||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"?
              getFormattedValue(Number.parseFloat(cellElement.data.amount))
              :cellElement.data.amount
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span className={`${cellElement.data?.title=="Total sales"||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
                 cellElement.data?.title=="Net VAT due (or claim)"
              ? 'font-bold text-[#DC143C]' : ''}`}>
              {cellElement.data?.amount == null
                ? ""
          
                :cellElement.data?.title=="Total sales"||
                cellElement.data?.title=="Total purchases"||
                cellElement.data?.title=="Total VAT due for current period"?
                getFormattedValue(Number.parseFloat(cellElement.data.amount))
                :cellElement.data?.amount == 0?
                0:
                getFormattedValue(cellElement.data.amount,false,4)}
            </span>
          )
        }
      }
      },
    {
      dataField: "adjustment",
      caption: t("adjustment"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      visible: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.adjustment == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.adjustment))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span className={`${cellElement.data?.title=="Total sales"||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
                 cellElement.data?.title=="Net VAT due (or claim)"
              ? 'font-bold text-[#DC143C]' : ''}`}>
              {cellElement.data?.adjustment == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.adjustment))}
            </span>
          )
        }
      }
      },
     {
      dataField: "vatAmount",
      caption: t("vatAmount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      visible: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.vatAmount == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.vatAmount))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (
            <span className={`${cellElement.data?.title=="Total sales"||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
                 cellElement.data?.title=="Net VAT due (or claim)"
              ? 'font-bold text-[#DC143C]' : cellElement.data?.title=="VAT on sales"?'font-bold bg-[#DC143C]':''}`}>
              {cellElement.data?.vatAmount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.vatAmount))}
            </span>
          )
        }
      }
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
                  filterText="From : {fromDate} - {toDate}"
                  gridHeader={t("VAT Return Form")}
                  dataUrl={Urls.vat_return_form}
                  method={ActionType.POST}
                  gridId="grd_vat_return_form"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={335}
                  filterHeight={230}
                  filterContent={<PurchaseTaxReportFilter/>}
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

export default VatReturnForm

