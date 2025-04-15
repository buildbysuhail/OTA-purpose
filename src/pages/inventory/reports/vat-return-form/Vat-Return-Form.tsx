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
import { useSelector } from "react-redux"
import { RootState } from "../../../../redux/store"
import CashSummaryReportFilter, { CashSummaryReportFilterInitialState } from "../../../accounts/reports/cashSummary/cash-summary-report-filter"

const VatReturnForm = () => {
  const { t } = useTranslation("accountsReport")
  const { getFormattedValue } = useNumberFormat()
const userSession = useSelector((state: RootState) => state.UserSession);
const setupCurrencyCode = (countryId: number): string => {
  let currencyCode = '';

  switch (countryId) {
    case 1: // Saudi Arabia
      currencyCode = 'SAR';
      break;
    case 120: // UAE
      currencyCode = 'AED';
      break;
    case 122: // Bahrain
      currencyCode = 'BHD';
      break;
    case 124: // Qatar
      currencyCode = 'QAR';
      break;
    case 118: // Kuwait
      currencyCode = 'KWD';
      break;
    case 104: // Oman
      currencyCode = 'OMR';
      break;
    default:
      currencyCode = '';
      break;
  }

  return currencyCode;
};
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
      dataField: "title",
      caption: t("title"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
     cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          return  {
            ...exportCell,
            text: cellInfo.value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data?.title=="Total sales" ||
            cellElement.data?.title=="Total purchases"||
            cellElement.data?.title=="Total VAT due for current period"||
            cellElement.data?.title=="Net VAT due (or claim)"
             ? '#FF0000':'',
            font: {
              ...exportCell.font,
              color:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?'bold':'normal',
              bold:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?true:false,
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
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"?
              getFormattedValue(Number.parseFloat(cellElement.data.amount))
              :cellElement.data?.amount == 0?
              0:
              getFormattedValue(cellElement.data.amount,false,4)
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor: cellElement.data?.title=="Total sales" ||
            cellElement.data?.title=="Total purchases"||
            cellElement.data?.title=="Total VAT due for current period"||
            cellElement.data?.title=="Net VAT due (or claim)"
             ? '#FF0000':'',
             font: {
              ...exportCell.font,
              color:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?'bold':'normal',
              bold:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?true:false,
            },
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
                cellElement.data?.title=="Total VAT due for current period"||
                cellElement.data?.title=="Net VAT due (or claim)"?
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
      showInPdf: true,
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
            textColor: cellElement.data?.title=="Total sales" ||
            cellElement.data?.title=="Total purchases"||
            cellElement.data?.title=="Total VAT due for current period"||
            cellElement.data?.title=="Net VAT due (or claim)"
             ? '#FF0000':'',
             font: {
              ...exportCell.font,
              color:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?'bold':'normal',
              bold:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?true:false,
            },
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
      caption: t("vat_amount "),
      dataType: "number",
      showInPdf: true,
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
            textColor: cellElement.data?.title=="Total sales" ||
            cellElement.data?.title=="Total purchases"||
            cellElement.data?.title=="Total VAT due for current period"||
            cellElement.data?.title=="Net VAT due (or claim)"
             ? '#FF0000':'',
             font: {
              ...exportCell.font,
              color:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?'bold':'normal',
              bold:cellElement.data?.title=="Total sales" ||
              cellElement.data?.title=="Total purchases"||
              cellElement.data?.title=="Total VAT due for current period"||
              cellElement.data?.title=="Net VAT due (or claim)"||
              cellElement.data?.title=="VAT on sales"||
              cellElement.data?.title=="VAT On Purchases"
              ?true:false,
            },
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
    // Filter columns based on the `visible` property
    return baseColumns
     
      .map((column) => {
        if (column.dataField !== "title") {
          return {
            ...column,
            caption: `${column.caption} (${setupCurrencyCode(userSession.countryId??0)})`,

          };
        }
        return column;
      });
  }, [t]);

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
                  filterWidth={350}
                  filterHeight={200}
                  filterContent={<CashSummaryReportFilter/>}
                  filterInitialData={CashSummaryReportFilterInitialState}
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

