import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import OutstandingReceivableReportFilter, { OutstandingReceivableReportFilterInitialState } from "./outstanding-receivable-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";

interface OutstandingAccountReceivableReport {
  from: Date
}
const OutstandingAccountReceivableReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const [filter, setFilter] = useState<OutstandingAccountReceivableReport>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('SiNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf:true,
    },
    {
      dataField: "party",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
              : balance < 0
                ? getFormattedValue(-1 * balance) + " Cr"
                : getFormattedValue(balance) + " Dr";
          return exportCell != undefined ? {
            ...exportCell,
            text: cellInfo.value,
            bold:cellElement.data.party === "TOTAL" ? true:'',
            alignment: "right",
            textColor: cellElement.data.party === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
               color:cellElement.data.party === "TOTAL" ? { argb: 'FFFF0000' }:"",
              size: 10,
              style:cellElement.data.party === "TOTAL" ?'bold':'normal',
              bold: cellElement.data.party === "TOTAL" ?true:false,
            }
          } : undefined;
        }
        else {
          return ( <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {cellElement.data.party}
        </span>)
     }
    }
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null||balance==''
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.party === "TOTAL" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            textColor: cellElement.data.party === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.party === "TOTAL" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.party === "TOTAL" ?'bold':'normal',
              bold: cellElement.data.party === "TOTAL" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
        </span>)
}}
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      visible:false,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null||balance==''
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.party === "TOTAL" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            textColor: cellElement.data.party === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.party === "TOTAL" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.party === "TOTAL" ?'bold':'normal',
              bold: cellElement.data.party === "TOTAL" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-[#DC143C] ' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>)
}}
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null||balance==''
              ? ""
              : getFormattedValue(balance);

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.party === "TOTAL" ?true:false,
            alignment: "right",
            alignmentExcel:{ horizontal: 'right' },
            textColor: cellElement.data.party === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.party === "TOTAL" ? { argb: 'FFFF0000' }:'',
              size: 10,
              style:cellElement.data.party === "TOTAL" ?'bold':'normal',
              bold: cellElement.data.party === "TOTAL" ?true:false,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1 *cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
        </span>)
}}
    },
   {
         dataField: "ltDate",
         caption: t("last_transaction_date"),
         dataType: "date",
         allowSearch: true,
         allowFiltering: true,
         width: 130,
         format:"dd-MMM-yyyy"
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
                remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  filterText="as of {asonDate}, Interval : Daily {routeID > 0 && , Sales Route : [routeName]}"
                  gridHeader={t("account_receivable")}
                  dataUrl={Urls.acc_reports_receivable}
                  method={ActionType.POST}
                  gridId="grd_outstanding_account_receivable"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  filterWidth="150"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<OutstandingReceivableReportFilter />}
                  filterInitialData={OutstandingReceivableReportFilterInitialState}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default OutstandingAccountReceivableReport;