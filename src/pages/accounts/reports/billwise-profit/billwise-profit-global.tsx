import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import BillwiseProfitReportFilter, { BillwiseProfitReportFilterInitialState } from "./billwise-profit-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const BillwiseProfitGlobal = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "description",
      caption: t('description'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.discount;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) 
                : getFormattedValue(balance);

          return {
            ...exportCell,
            text: cellInfo.value,
            alignment: "right",
            // alignmentExcel:{ horizontal: 'right' },
            textColor: '#0000FF',
            font: {
              ...exportCell.font,
              color: { argb: 'FF0000FF' },
              size: 10,
              style:'bold',
              bold: true,
            },
          };
        }
        else {
          return (  <span className={'font-bold text-blue'}>
          {cellElement.data.description}
        </span>)
 }}
    },
    {
      dataField: "productName",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.discount;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) 
                : getFormattedValue(balance);

          return {
            ...exportCell,
            text: cellInfo.value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            // alignmentExcel:{ horizontal: 'right' },
            textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-[#DC143C] ' : ''}`}>
  {cellElement.data.productName}
  </span>)
}}
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.qty;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) 
                : getFormattedValue(balance);

          return {
            ...exportCell,
            text: value,
            // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            // textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              // style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return (  <span>
          {`${cellElement.data?.qty == 0 || cellElement.data?.qty == null ? '' :  getFormattedValue(cellElement.data.qty)}`}
        </span>)
}}
    },
    {
      dataField: "free",
      visible: false,
      caption: t("free"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.free;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance,false,4) 

          return {
            ...exportCell,
            text: value,
            // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            // textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              // style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span>
          {`${cellElement.data?.free == 0 || cellElement.data?.free == null ? '' :  getFormattedValue(cellElement.data.free,false,4)}`}
        </span>)
          }}
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
      visible: false,
      showInPdf:true,
    },
    {
      dataField: "rate",
      caption: t("rate"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "grossAmount",
      caption: t("gross_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.grossAmount;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance,false,4) 

          return {
            ...exportCell,
            text: value,
            // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            // textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              // style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return (  <span>
          {`${cellElement.data?.grossAmount == 0 || cellElement.data?.grossAmount == null ? ''  : getFormattedValue(cellElement.data.grossAmount)}`}
        </span>)
}}
    },
    {
      dataField: "discAmt",
      caption: t("disc_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.discAmt;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance,false,4) 

          return {
            ...exportCell,
            text: value,
            // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            // textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              // style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              // bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span>
          {`${cellElement.data?.discAmt == 0 || cellElement.data?.discAmt == null ? '' : getFormattedValue(cellElement.data.discAmt,false,4)}`}
        </span>)
        }}
    },
    {
      dataField: "salesPrice",
      caption: t('sales_price'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.salesPrice;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?getFormattedValue(balance): getFormattedValue(balance,false,3) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.salesPrice == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.salesPrice):getFormattedValue(cellElement.data.salesPrice,false,3)}`}
          </span>)
        }}
    },
    {
      dataField: "cost",
      caption: t("tot_cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.totCost;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.totCost == 0 || cellElement.data?.totCost == null ? '' :  getFormattedValue(cellElement.data.totCost)}`}
        </span>)
}}
    },
    {
      dataField: "netAmt",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.netAmount;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return (  <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.netAmount == 0 || cellElement.data?.netAmount == null ? '' :  getFormattedValue(cellElement.data.netAmount)}`}
        </span>)
}}
    },
    {
      dataField: "profit",
      caption: t("profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 110,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.profit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.profit == 0 || cellElement.data?.profit == null ? '' :  getFormattedValue(cellElement.data.profit)}`}
        </span>)
}}
    },
    {
      dataField: "markupPerc",
      caption: t("markup_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.markupPerc;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.markupPerc == 0 || cellElement.data?.markupPerc == null ? '' :  getFormattedValue(cellElement.data.markupPerc)}`}
        </span>)
}}
    },
    {
      dataField: "marginPerc",
      caption: t("margin_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.marginPerc;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return (   <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.marginPerc == 0 || cellElement.data?.marginPerc == null ? '' : getFormattedValue(cellElement.data.marginPerc)}`}
        </span>)
}}
    },
    {
      dataField: "sgst",
      caption: t("sgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.sgst;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?getFormattedValue(balance): getFormattedValue(balance,false,3) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.sgst == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.sgst):getFormattedValue(cellElement.data.sgst,false,3)}`}
          </span>)
        }}},
    {
      dataField: "cgst",
      caption: t("cgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.cgst;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?getFormattedValue(balance): getFormattedValue(balance,false,3) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.cgst == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.cgst):getFormattedValue(cellElement.data.cgst,false,3)}`}
          </span>)
        }}},
    {
      dataField: "igst",
      caption: t("igst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.igst;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?getFormattedValue(balance): getFormattedValue(balance,false,3) 
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.igst == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.igst):getFormattedValue(cellElement.data.igst,false,3)}`}
          </span>)
        }}},
    {
      dataField: "cess",
      caption: t("cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.cess;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?getFormattedValue(balance): getFormattedValue(balance,false,3) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.cess == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.cess):getFormattedValue(cellElement.data.cess,false,3)}`}
          </span>)
        }}},
    {
      dataField: "addCess",
      caption: t("add_cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.addCess;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?getFormattedValue(balance): getFormattedValue(balance,false,3) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.addCess == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.addCess):getFormattedValue(cellElement.data.addCess,false,3)}`}
          </span>)
        }}},
    {
      dataField: "calmityCess",
      caption: t("calamity_cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.calmityCess;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?getFormattedValue(balance): getFormattedValue(balance,false,3) 

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
             textColor: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
               color:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?'bold':'normal',
              bold: cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.calmityCess == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.calmityCess):getFormattedValue(cellElement.data.calmityCess,false,3)}`}
          </span>)
        }}},
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  showTotalCount={false}
                  filterText="from {fromDate} to {toDate} {brandID > 0 && ,Brand : [brandName]} {colour != '' && , Colour : [colour]} {warranty != '' && , Warranty : [warranty]}"
                  gridHeader={t("billwise_profit_report_sales")}
                  dataUrl={Urls.acc_reports_billwise_profit_global}
                  method={ActionType.POST}
                  gridId="grd_billwise_profit_global"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<BillwiseProfitReportFilter />}
                  filterInitialData={BillwiseProfitReportFilterInitialState}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default BillwiseProfitGlobal;