import { useTranslation } from "react-i18next"
import { Fragment, useMemo } from "react"
import moment from "moment"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import GridId from "../../../../redux/gridId"
import { ActionType } from "../../../../redux/types"
import Urls from "../../../../redux/urls"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"
import { useSelector } from "react-redux"
import { RootState } from "../../../../redux/store"
import CashSummaryReportFilter, { CashSummaryReportFilterInitialState } from "../../../accounts/reports/cashSummary/cash-summary-report-filter"

const VatReturnFormArabic = () => {
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
  // const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
      dataField: "title",
      caption: t("العنوان"),
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
            textColor: cellElement.data?.title=="اجمالي المبيعات" ||
            cellElement.data?.title=="اجمالي المشتريات"||
            cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
            cellElement.data?.title=="صافي الضريبة المستحقة"
             ? '#FF0000':'',
            font: {
              ...exportCell.font,
              color:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?'bold':'normal',
              bold:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?true:false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data?.title=="اجمالي المبيعات"||
            cellElement.data?.title=="اجمالي المشتريات"||
            cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
               cellElement.data?.title=="صافي الضريبة المستحقة"
            ? 'font-bold text-[#DC143C]' : 
            cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"?'font-bold bg-[#1b7c47] text-[#fcfafb]':
            cellElement.data?.title=="الضريبة على المشتريات"?'font-bold bg-[#eb9d29] text-[#fcfafb]':
            
            ''}`}>
            {cellElement.data.title}
          </span>)
        }
      },
    },
    {
      dataField: "amount",
      caption: t("المبلغ    ( ريال )"),
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
              :cellElement.data?.title=="اجمالي المبيعات"||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"?
              getArabicNumber(getFormattedValue(Number.parseFloat(cellElement.data.amount)))  
              :cellElement.data?.amount == 0?
              0:
              getArabicNumber(getFormattedValue(cellElement.data.amount,false,4)) 
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor: cellElement.data?.title=="اجمالي المبيعات" ||
            cellElement.data?.title=="اجمالي المشتريات"||
            cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
            cellElement.data?.title=="صافي الضريبة المستحقة"
             ? '#FF0000':'',
             font: {
              ...exportCell.font,
              color:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?'bold':'normal',
              bold:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?true:false,
            },
          }
        } else {
          return (
            <span className={`${cellElement.data?.title=="اجمالي المبيعات"||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
                 cellElement.data?.title=="صافي الضريبة المستحقة"
              ? 'font-bold text-[#DC143C]' : ''}`}>
              {cellElement.data?.amount == null
                ? ""
                :cellElement.data?.title=="اجمالي المبيعات"||
                cellElement.data?.title=="اجمالي المشتريات"||
                cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
                cellElement.data?.title=="صافي الضريبة المستحقة"?
                getArabicNumber(getFormattedValue(Number.parseFloat(cellElement.data.amount)))  
                :cellElement.data?.amount == 0?
                0:
                getArabicNumber(getFormattedValue(cellElement.data.amount,false,4))  }
            </span>
          )
        }
      }
      },
    {
      dataField: "adjustment",
      caption: t("مبلغ التعديل ( ريال )"),
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
              :getArabicNumber(getFormattedValue(Number.parseFloat(cellElement.data.adjustment))) 
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor: cellElement.data?.title=="اجمالي المبيعات" ||
            cellElement.data?.title=="اجمالي المشتريات"||
            cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
            cellElement.data?.title=="صافي الضريبة المستحقة"
             ? '#FF0000':'',
             font: {
              ...exportCell.font,
              color:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?'bold':'normal',
              bold:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?true:false,
            },
          }

        } else {
          return (
            <span className={`${cellElement.data?.title=="اجمالي المبيعات"||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
                 cellElement.data?.title=="صافي الضريبة المستحقة"
              ? 'font-bold text-[#DC143C]' : ''}`}>
              {cellElement.data?.adjustment == null
                ? ""
                :getArabicNumber(getFormattedValue(Number.parseFloat(cellElement.data.adjustment))) }
            </span>
          )
        }
      }
      },
     {
      dataField: "vatAmount",
      caption: t("مبلغ ضريبة القيمة المضافة ( ريال )"),
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
              :getArabicNumber(getFormattedValue(Number.parseFloat(cellElement.data.vatAmount))) 
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
            textColor: cellElement.data?.title=="اجمالي المبيعات" ||
            cellElement.data?.title=="اجمالي المشتريات"||
            cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
            cellElement.data?.title=="صافي الضريبة المستحقة"
             ? '#FF0000':'',
             font: {
              ...exportCell.font,
              color:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?'bold':'normal',
              bold:cellElement.data?.title=="اجمالي المبيعات" ||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
              cellElement.data?.title=="صافي الضريبة المستحقة"||
              cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"||
              cellElement.data?.title=="الضريبة على المشتريات"
              ?true:false,
            },
          }
        } else {
          return (
            <span className={`${cellElement.data?.title=="اجمالي المبيعات"||
              cellElement.data?.title=="اجمالي المشتريات"||
              cellElement.data?.title=="اجمالي ضريبة القيمة المضافة المستحقة عن الفترة الضريبية الحالية"||
                 cellElement.data?.title=="صافي الضريبة المستحقة"
              ? 'font-bold text-[#DC143C]' : cellElement.data?.title=="ضريبة القيمة المضافة على المبيعات"?'font-bold bg-[#DC143C]':''}`}>
              {cellElement.data?.vatAmount == null
                ? ""
                :getArabicNumber(getFormattedValue(Number.parseFloat(cellElement.data.vatAmount))) }
            </span>
          )
        }
      }
      },
    ];
  //   // Filter columns based on the `visible` property
  //   return baseColumns
     
  //     .map((column) => {
  //       if (column.dataField !== "title") {
  //         return {
  //           ...column,
  //           caption: `${column.caption} (${setupCurrencyCode(userSession.countryId??0)})`,

  //         };
  //       }
  //       return column;
  //     });
  // }, [t]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={baseColumns}
                  filterText="{fromDate} - {toDate}"
                  gridHeader={"إرجاع ضريبة القيمة المضافة من : "}
                  dataUrl={Urls.vat_return_form_arabic}
                  method={ActionType.POST}
                  gridId="grd_vat_return_form_arabic"
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

export default VatReturnFormArabic

export function getArabicNumber(number: string): string {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let arabicNumber = "";

  try {
    for (let i = 0; i < number.length; i++) {
      const digit = number.charAt(i);
      if (digit !== "." && digit !== "-" && digit !== ",") {
        const index = parseInt(digit, 10);
        if (!isNaN(index)) {
          arabicNumber += arabicDigits.charAt(index);
        } else {
          arabicNumber += digit;
        }
      } else {
        arabicNumber += digit;
      }
    }
  } catch (error) {
    // Optionally handle error
    console.error("Error converting to Arabic number:", error);
  }

  return arabicNumber;
}

