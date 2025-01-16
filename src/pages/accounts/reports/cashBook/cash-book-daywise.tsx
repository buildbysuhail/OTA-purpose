import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashBookDetailed from "./cash-book-detailed";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";
interface CashBookMonthDayWiseProps {
  postData: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  isMaximized?: boolean; 
  modalHeight?:any
}
// interface CashBookMonthWiseProps {
//   postData: any;
//   groupName?: string;
//   contentProps?: any;
// }

const CashBookDayWise: FC<CashBookMonthDayWiseProps> = ({ postData, contentProps,rowData,isMaximized,modalHeight }) => {
// const CashBookDayWise = ({ contentProps, enablefilter = false,}: CashBookMonthDayWiseProps) => {
  // 
  
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] =useState<CashBookDayWise>({from: new Date()});
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
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement}  field="transactionDate" ></DrillDownCellTemplate>
    },
    {
      dataField: "ledgerName",
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
        debugger;
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
            bold: true,
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
               color:cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' }:"",
              size: 15,
            }
          } : undefined;
        }
        else {
          return(  <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {cellElement.data.ledgerName}
          </span>)
      
          }}
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
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
            bold: true,
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color:cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' }:'',
              size: 15,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
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
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
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
            bold: true,
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              color:cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' }:'',
              ...exportCell.font,
              size: 15,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
          </span>)
       
          }}
    },
    {
      dataField: "monthBal",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.monthBal;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance) + " Cr"
              : getFormattedValue(balance) + " Dr";
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              color:cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' }:'',
              ...exportCell.font,
              size: 15,
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57] ' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data.monthBal < 0 ? getFormattedValue(-1 * cellElement.data.monthBal) : getFormattedValue(cellElement.data.monthBal)} ${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data?.monthBal >= 0 ? 'Dr' : 'Cr'}`}
          </span>)
       
          }}
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },

    {
      dataField: "closingBalance",
      caption: t("closing_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.closingBalance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance) + " Cr"
              : getFormattedValue(balance) + " Dr";
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              color:cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' }:'',
              ...exportCell.font,
              size: 15,
            },
          };
        }
        else {
          return( <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data.closingBalance < 0 ? getFormattedValue(-1 * cellElement.data.closingBalance) : getFormattedValue(cellElement.data.closingBalance)} ${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data?.closingBalance >= 0 ? 'Dr' : 'Cr'}`}
          </span>)
          }
        }
    },
  ];
  // const [gridHeight, setGridHeight] = useState<number>(() => {
  //   
  //   const modals = document.querySelectorAll('.erp-modal-opened');
  //   if (modals.length > 0) {
  //     const latestModal = modals[modals.length - 1] as HTMLElement;
  //     return (window.innerHeight - latestModal.offsetHeight) + 200;
  //   } else {
  //     return window.innerHeight - 400;
  //   }
  // });
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div>
            <div>
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  showSerialNo={true}
                  columns={columns}
                  remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  filterText="for {___(ledgerName)},{___ month of (month)} {___ (year)}"
                  gridHeader={t("ledger_report_daywise")}
                  dataUrl={Urls.acc_reports_cash_book_daywise}
                  method={ActionType.POST}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  gridId="grd_cash_book_daywise"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  rowData={rowData}
                  childPopupProps={{
                    content: <CashBookDetailed postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)}}/>,
                    title: t("acc_group_detailed"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "transactionDate",
                    bodyProps: "transactionDate",
                  }}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CashBookDayWise;