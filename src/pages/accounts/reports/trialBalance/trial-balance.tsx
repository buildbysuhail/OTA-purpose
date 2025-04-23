import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import TrialBalanceReportFilter, { TrialBalanceReportFilterInitialState } from "./trial-balance-report-filter";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
interface TrialBalance {
  from: Date
}
const TrialBalance = () => {
  const [filter, setFilter] = useState<any>(TrialBalanceReportFilterInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const [showValidation, setShowValidation] = useState(false);
  const { getFormattedValue } = useNumberFormat()
  const columns: DevGridColumn[] = [
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 100,
      // cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
    },
    {
      dataField: "accGroupName",
      caption: t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      visible: false,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: cellInfo.value,
            // alignment: "right",
            // alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.isGroup == true ? '#2E8B57' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.isGroup == true ? { argb: 'FF2E8B57' } : '',
              size: 10,
              style: cellElement.data.isGroup == true ? 'bold' : 'normal',
              bold: cellElement.data.isGroup == true ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : ''}`}>
            {cellElement.data.accGroupName}
          </span>)
        }
      }
    },
    {
      dataField: "ledgerName",
      caption: t("account_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: (cellElement.data.isGroup == false ? "   " : "") + (cellInfo.value ?? ""),
            bold: cellElement.data.isGroup == true ? true : false,
            // alignment: "right",
            // alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.isGroup == true ? '#2E8B57' : cellElement.data.ledgerName == "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.isGroup == true ? { argb: 'FF2E8B57' } : cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span style={{ color: cellElement.data.isGroup == true ? '#2E8B57' : cellElement.data.ledgerName == "TOTAL" ? 'rgb(220,20,60)' : '' }} className={`${cellElement.data.isGroup == true ? 'font-bold' : cellElement.data.ledgerName == "TOTAL" ? 'font-bold text-[#DC143C]' : 'pl-4'}`}>
            {
              cellElement.data.isGroup !== true && cellElement.data.ledgerName !== "TOTAL" ? (<DrillDownCellTemplate data={cellElement} field="ledgerName"></DrillDownCellTemplate>) : (<>{cellElement.data.ledgerName}</>)
            }
          </span>)
        }
      }
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null || balance == ""
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.isGroup == true ? '#2E8B57' : cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.isGroup == true ? { argb: 'FF2E8B57' } : cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-[#2E8B57]' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
          </span>)
        }
      }
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null || balance == ""
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.isGroup == true ? '#2E8B57' : cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.isGroup == true ? { argb: 'FF2E8B57' } : cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'pl-4 font-bold text-[#2E8B57]' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
          </span>)
        }
      }
    },
    {
      dataField: "groupNameInArabic",
      caption: t("arabic_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: cellInfo.value,
            // alignment: "right",
            // alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.isGroup == true ? '#2E8B57' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.isGroup == true ? { argb: 'FF2E8B57' } : '',
              size: 10,
              style: cellElement.data.isGroup == true ? 'bold' : 'normal',
              bold: cellElement.data.isGroup == true ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : ''}`}>
            {cellElement.data.groupNameInArabic}
          </span>)
        }
      }
    },
    {
      dataField: "ledgerNameInArabic",
      caption: t("account_name_in_arabic"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      visible: false,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: (cellElement.data.isGroup == false ? "   " : "") + (cellInfo.value ?? ""),
            bold: cellElement.data.isGroup == true ? true : false,
            // alignment: "right",
            // alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.isGroup == true ? '#2E8B57' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.isGroup == true ? { argb: 'FF2E8B57' } : '',
              size: 10,
              style: cellElement.data.isGroup == true ? 'bold' : 'normal',
              bold: cellElement.data.isGroup == true ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : 'pl-4'}`}>
            {cellElement.data.ledgerNameInArabic}
          </span>)
        }
      }
    },
    {
      dataField: "isGroup",
      caption: t("is_group"),
      dataType: "string",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : getFormattedValue(balance)
          return {
            ...exportCell,
            text: cellInfo.value == true ? 'Y' : 'N',
            bold: cellElement.data.isGroup == true ? true : false,
            // alignment: "right",
            // alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.isGroup == true ? '#2E8B57' : cellElement.data.ledgerName == "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.isGroup == true ? { argb: 'FF2E8B57' } : cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.isGroup == true || cellElement.data.ledgerName === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span style={{ color: cellElement.data.isGroup == true ? '#2E8B57' : cellElement.data.ledgerName == "TOTAL" ? 'rgb(220,20,60)' : '' }} className={`${cellElement.data.isGroup == true ? 'font-bold' : cellElement.data.ledgerName == "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {
              cellElement.data.isGroup ? 'Y' : 'N'
            }
          </span>)
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
                  remoteOperations={{ filtering: false, paging: false, sorting: false }}
                  filterText="as of {asonDate}"
                  gridHeader={t("trial_balance")}
                  dataUrl={Urls.acc_reports_trial_balance}
                  method={ActionType.POST}
                  gridId="grd_trial_balance"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  filterHeight={250}
                  filterWidth={500}
                  // rowVisibleFn = {(filter: any,data: any) => filter?.showSummaryOnly != true || (filter?.showSummaryOnly == true && data?.isGroup == true)}
                  customFilterItems={[{
                    keyField: "showSummaryOnly",
                    location: "before",
                    type: "checkbox",
                    label: "Show Summary Only"
                  }]}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<TrialBalanceReportFilter />}
                  filterInitialData={TrialBalanceReportFilterInitialState}
                  onFilterChanged={(filter: any) => { setFilter(filter) }}
                  childPopupProps={{
                    content: <CashBookMonthWise />,
                    title: t("cash_book_monthwise"),
                    isForm: true,
                    drillDownCells: "ledgerName",
                    bodyProps: "ledgerID",
                    origin: "trialBalance",
                    enableFn: (data: any) => data.isGroup == true || data.ledgerName == "TOTAL" ? false : true
                  }}
                  postData={filter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default TrialBalance;