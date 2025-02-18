import { FC, Fragment, useEffect, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import CashBookReportFilter, { CashBookReportFilterInitialState } from "../cashBook/cash-book-report-filter";
import CashBookDayWise from "../cashBook/cash-book-daywise";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";
import moment from "moment";
interface CashFlowBankFlowDetailedProps {
  postData?: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  origin?:any;
  isMaximized?: boolean; 
  modalHeight?:any
}
const CashBankFlowDetailedReport: FC<CashFlowBankFlowDetailedProps> = ({ postData, contentProps,rowData,origin,isMaximized,modalHeight  }) => {
// const CashBankFlowDetailedReport = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  // const [filter, setFilter] = useState<IncomeRepor>({ from: new Date() });
  const rootState = useRootState();
      const [gridHeight, setGridHeight] = useState<{
        mobile: number;
        windows: number;
      }>({ mobile: 500, windows: 500 });
    
      useEffect(() => {
        let gridHeightMobile = modalHeight - 50; 
        let gridHeightWindows = modalHeight - 180; 
        setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
      }, [isMaximized,modalHeight]);
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t('transaction_date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true, 
      width: 100,
      showInPdf:true,
      format:"dd-MMM-yyyy"
    },
    {
      dataField: "vchNo",
      caption: t("voucherNumber"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "vType",
      caption: t("voucherType"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 150,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.month;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) + " Cr"
                : getFormattedValue(balance) + " Dr";
          return exportCell != undefined ? {
            ...exportCell,
            text:cellInfo.value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data?.particulars==="TOTAL"?'#DC143C': '',
            font: {
              ...exportCell.font,
              color:cellElement.data?.particulars==="TOTAL"?{ argb: 'FFFF0000' }: '',
              size: 10,
              style: cellElement.data?.particulars==="TOTAL"? "bold" : "normal",
              bold: cellElement.data?.particulars==="TOTAL"?true : false,
            }
          } : undefined;
        }
        else {
          return ( <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.particulars }`}
            </span>)
        }}
    },
    {
      dataField: "debit",
      caption: t("inFlow"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null|| balance==0
              ? ""
              : balance < 0
              ? getFormattedValue(-1 *balance) 
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text:value,
            bold: true,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            textColor: cellElement.data?.particulars==="TOTAL"?'#DC143C': '',
            font: {
              ...exportCell.font,
              color:cellElement.data?.particulars==="TOTAL"?{ argb: 'FFFF0000' }: '',
              size: 10,
              style: cellElement.data?.particulars==="TOTAL"? "bold" : "normal",
              bold: cellElement.data?.particulars==="TOTAL"?true : false,
            }
          } : undefined;
        }
        else {
          return ( <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : getFormattedValue(cellElement.data.debit)}`}
            </span>)
        }}
    },
    {
      dataField: "credit",
      caption: t("outFlow"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
          balance == null|| balance==0
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance)  
              : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text:value,
            bold: true,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            textColor: cellElement.data?.particulars==="TOTAL"?'#DC143C': '',
            font: {
              ...exportCell.font,
              color:cellElement.data?.particulars==="TOTAL"?{ argb: 'FFFF0000' }: '',
              size: 10,
              style: cellElement.data?.particulars==="TOTAL"? "bold" : "normal",
              bold: cellElement.data?.particulars==="TOTAL"?true : false,
            }
          } : undefined;
        }
        else {
          return (  <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : getFormattedValue(cellElement.data.credit)}`}
         </span>)
        }}
    },
    {
      dataField: "balance",
      caption: t("netFlow"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf:true,
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
              :getFormattedValue(balance) ;
          return exportCell != undefined ? {
            ...exportCell,
            text:value,
            bold: true,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            textColor: cellElement.data?.particulars==="TOTAL"?'#DC143C': '',
            font: {
              ...exportCell.font,
              color:cellElement.data?.particulars==="TOTAL"?{ argb: 'FFFF0000' }: '',
              size: 10,
              style: cellElement.data?.particulars==="TOTAL"? "bold" : "normal",
              bold: cellElement.data?.particulars==="TOTAL"?true : false,
            }
          } : undefined;
        }
        else {
          return ( <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : getFormattedValue(cellElement.data.balance)}`}
          </span>)
        }}
    },
    {
      dataField: "remarks",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "branchName",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
  ];
  
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                heightToAdjustOnWindowsInModal={gridHeight.windows}
                rowData={rowData}
                remoteOperations={{filtering:false,paging:false,sorting:false}}
                  allowGrouping={true}
                  columns={columns}
                  filterText="{___ as of (month)} {___(year)}"
                  gridHeader={origin=="cash_flow"? t("cash_flow_report_detailed"):t("bank_flow_report_detailed")}
                  dataUrl={Urls.acc_reports_cash_bank_flow_detailed }
                  method={ActionType.POST}
                  gridId="grd_cashflow_bankflow_drilldown_detailed"
                  popupAction={toggleCostCentrePopup}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  reload={true}
                  hideGridAddButton={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default CashBankFlowDetailedReport;