import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashBookDayWise from "./cash-book-daywise";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { Filter } from "lucide-react";

// interface CashBookMonthWiseProps {
//   contentProps?: any
//   enablefilter?: boolean;
// }
interface CashBookMonthWiseProps {
  postData?: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  origin?: any;
  isMaximized?: boolean; 
  modalHeight?:any
  originTo?:any
}

const CashBookMonthWise: FC<CashBookMonthWiseProps> = ({ postData, contentProps, rowData, origin,isMaximized,modalHeight,originTo}) => {
  // interface CashBookMonthWiseFilters {
  //   from: Date
  // }
  // const CashBookMonthWise = ({contentProps, enablefilter = false}:CashBookMonthWiseProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50; 
    let gridHeightWindows = modalHeight - 180; 
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized,modalHeight]);

  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    // {
    //   dataField: "siNo",
    //   caption: t('si_no'),
    //   dataType: "number",
    //   allowSearch: true, 
    //   allowFiltering: true,
    //   width: 80,
    // },
    {
      dataField: "year",
      caption: t("year"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      visible: false,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "monthNum",
      caption: t("month_num"),
      dataType: "number",
      visible: false,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement} field="month"></DrillDownCellTemplate>
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
          return( <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
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
      width: 200,
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
      caption: t("month_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
                  // textColor:filter?.showSeparateColorForDebitBalance == true && cellElement?.data?.balance >= 0 ?'#129151': '#FF0000',
                  font: {
                    ...exportCell.font,
                    // color:filter?.showSeparateColorForDebitBalance == true && cellElement?.data?.balance >= 0 ?{argb:'FF129151'}:{ argb: 'FFFF0000' },
                    size: 15,
                    Bold:true
                  },
                };
              }
              else {
                return (  <span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-[#DC143C] text-lg' : ''}`}>
                  {`${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data.monthBal < 0 ? getFormattedValue(-1 * cellElement.data.monthBal) : getFormattedValue(cellElement.data.monthBal)} ${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data?.monthBal >= 0 ? 'Dr' : 'Cr'}`}
                </span>)
      
                }}
    },
    {
      dataField: "closingBalance",
      caption: t("closing_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
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
            // textColor:filter?.showSeparateColorForDebitBalance == true && cellElement?.data?.balance >= 0 ?'#129151': '#FF0000',
            font: {
              ...exportCell.font,
              // color:filter?.showSeparateColorForDebitBalance == true && cellElement?.data?.balance >= 0 ?{argb:'FF129151'}:{ argb: 'FFFF0000' },
              size: 15,
              Bold:true
            },
          };
        }
        else {
          return ( <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data.closingBalance < 0 ? getFormattedValue(-1 * cellElement.data.closingBalance) : getFormattedValue(cellElement.data.closingBalance)} ${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data?.closingBalance >= 0 ? 'Dr' : 'Cr'}`}
          </span>)
          }
        }
    }
  ];
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
                  filterText={`for {${origin == "trialBalance" ? '___(particulars)': origin== "PandL" ? '___(groupName)' : '___(ledgerName)'}}, {**** as of (asonDate)}`}
                  gridHeader={t("ledger_report_monthwise")}
                  dataUrl={Urls.acc_reports_cash_book_monthwise}
                  method={ActionType.POST}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  gridId="grd_cash_book_monthwise"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                  rowData={rowData}
                  // CashBookMonthWise
                  childPopupProps={{
                    // content: <CashBookMonthWise postData={
                    //   { ...filter }} />,
                     content : <CashBookDayWise postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)}}/>,
                    title: t("acc_group_dayview"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "month",
                    bodyProps: "year,monthNum",
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

export default CashBookMonthWise;