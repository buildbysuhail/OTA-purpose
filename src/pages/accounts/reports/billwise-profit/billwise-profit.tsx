import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import BillwiseProfitReportFilter, { BillwiseProfitReportFilterInitialState } from "./billwise-profit-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
const BillwiseProfit = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const { getFormattedValue } = useNumberFormat()
  const columns: DevGridColumn[] = [
    {
      dataField: "description",
      caption: t('description'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 240,
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
            alignmentExcel:{ horizontal: 'right' },
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
          return ( <span>
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
          return ( <span>
          {`${cellElement.data?.grossAmount == 0 || cellElement.data?.grossAmount == null ? '' : getFormattedValue(cellElement.data.grossAmount)}`}
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
    },
    {
      dataField: "salesPrice",
      caption: t('sales_price'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
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
          return ( <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${ cellElement.data?.salesPrice == null ? '0' :cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ?  getFormattedValue(cellElement.data.salesPrice):getFormattedValue(cellElement.data.salesPrice)}`}
          </span>)
        }
        // const productName = cellElement.data?.productName;
        // const salesPrice = cellElement.data?.salesPrice;
        // // Apply special formatting only for "Grand Total" and "Disc+AddAmt"
        // if (productName === "Grand Total" || productName === "Disc+AddAmt") {
        //   const formattedValue =
        //     salesPrice == null
        //       ? '0'
        //       // : salesPrice < 0
        //       //   ? getFormattedValue(-1 * salesPrice)
        //         : getFormattedValue(salesPrice);

        //   return (
        //     <span className="font-bold text-[#DC143C]">
        //       {formattedValue}
        //     </span>
        //   );
        // }

        // // For other rows, display the salesPrice as it is (with decimal points from the API)
        // // return <span>{salesPrice != null ? salesPrice.toFixed(2) : '0.00'}</span>;
        // return <span>{salesPrice || '0'}</span>;
      },
    },
    {
      dataField: "totCost",
      caption: t("tot_cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.totCost == 0 || cellElement.data?.totCost == null ? '' :  getFormattedValue(cellElement.data.totCost)}`}
        </span>
      ),
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.netAmount == 0 || cellElement.data?.netAmount == null ? '' :  getFormattedValue(cellElement.data.netAmount)}`}
        </span>
      ),
    },
    {
      dataField: "profit",
      caption: t("profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 110,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.profit == 0 || cellElement.data?.profit == null ? '' :  getFormattedValue(cellElement.data.profit)}`}
        </span>
      ),
    },
    {
      dataField: "markupPerc",
      caption: t("markup_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.markupPerc == 0 || cellElement.data?.markupPerc == null ? '' :  getFormattedValue(cellElement.data.markupPerc)}`}
        </span>
      ),
    },
    {
      dataField: "marginPerc",
      caption: t("margin_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.marginPerc == 0 || cellElement.data?.marginPerc == null ? '' : getFormattedValue(cellElement.data.marginPerc)}`}
        </span>
      ),
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        const productName = cellElement.data?.productName;
        const vat = cellElement.data?.vat;

        // Apply special formatting only for "Grand Total" and "Disc+AddAmt"
        if (productName === "Grand Total" || productName === "Disc+AddAmt") {
          const formattedValue =
            vat == null
              ? '0'
              // : vat < 0
              //   ? getFormattedValue(-1 * vat)
                : getFormattedValue(vat);

          return (
            <span className="font-bold text-[#DC143C]">
              {formattedValue}
            </span>
          );
        }

        // For other rows, display the salesPrice as it is (with decimal points from the API)
        // return <span>{vat != null ? vat.toFixed(2) : '0.00'}</span>;
        // Return the default value for other rows
        return <span>{vat || '0'}</span>;
      },
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
                showTotalCount={false}
                remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  filterText="from {fromDate} to {toDate} {brandID > 0 && ,Brand : [brandName]} {colour != '' && , Colour : [colour]} {warranty != '' && , Warranty : [warranty]}"
                  gridHeader={t("billwise_profit_report_sales")}
                  dataUrl={Urls.acc_reports_billwise_profit}
                  method={ActionType.POST}
                  gridId="grd_billwise_profit"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth="200"
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
export default BillwiseProfit;