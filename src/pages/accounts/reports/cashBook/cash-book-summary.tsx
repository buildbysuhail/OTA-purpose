import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import CashBookReportFilter, { CashBookReportFilterInitialState } from "./cash-book-report-filter";
import CashBookMonthWise from "./cash-book-monthwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import dxColorBox from "devextreme/ui/color_box";

const CashBookSummary = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const [isOpenDetails, setIsOpenDetails] = useState<{ isOpen: boolean; key: number; groupName?: string }>({ isOpen: false, key: 0 });
  const [filter, setFilter] = useState<any>(CashBookReportFilterInitialState);
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
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
          return cellElement.data.ledgerName === "TOTAL" ? (
            <span
              className={`${cellElement.data.ledgerName === "TOTAL"
                  ? "font-bold text-[#DC143C]"
                  : ""
                }`}
            >
              {cellElement.data.ledgerName}
            </span>
          ) : (
            <DrillDownCellTemplate
              data={cellElement}
              field="ledgerName"
            ></DrillDownCellTemplate>
          );
        }
      },
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf: true,
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
          return (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
          </span>)

        }
      },
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf: true,
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
          return (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
          </span>)
        }
      },
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
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
          return (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
          </span>)
        }
      },
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      showInPdf: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
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
                  remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  filterWidth="100"
                  filterText="as of {asonDate}"
                  gridHeader={t("cash_book_summary")}
                  dataUrl={Urls.acc_reports_cash_book}
                  method={ActionType.POST}
                  gridId="grd_cash_book_summary"
                  enablefilter={true}
                  showFilterInitially={false}
                  filterContent={<CashBookReportFilter />}
                  filterInitialData={CashBookReportFilterInitialState}
                  reload={true}
                  hideGridAddButton={true}
                  onFilterChanged={(filter: any) => { setFilter(filter) }}
                  childPopupProps={{
                    content: <CashBookMonthWise />,
                    title: t("acc_group_monthview"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "ledgerName,",
                    bodyProps: "ledgerID",
                    enableFn: (data: any) => data?.ledgerID != 0

                  }}
                  postData={
                    { ...filter }}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CashBookSummary;