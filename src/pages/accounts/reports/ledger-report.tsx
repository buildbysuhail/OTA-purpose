import { Fragment, useCallback, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ErpDevGrid, {
  DrillDownCellTemplate,
} from "../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../redux/types";
import LedgerReportFilter, {
  LedgerReportFilterInitialState,
} from "./ledger-report-filter";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import { APIClient } from "../../../helpers/api-client";
import { Bold } from "lucide-react";
import AccTransactionForm from "../transactions/acc-transaction";

interface LedgerReport {
  from: Date;
}
const api = new APIClient();
const LedgerReport = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>([]);
  const { t } = useTranslation("accountsReport");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(LedgerReportFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const rootState = useRootState();
  const LoadAsync = async (_filter?: any) => {
    setLoading(true);
    const res = await api.postAsync(
      Urls.acc_reports_profit_and_loss,
      _filter || filter
    );
    setData(res?.data || []);
    setLoading(false);
  };
  const { getFormattedValue } = useNumberFormat();
  const onApplyFilter = useCallback((_filter: any) => {
    setFilter({ ..._filter });
    LoadAsync(_filter);
  }, []);

  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
      showInPdf: true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return  (
          <DrillDownCellTemplate
            data={cellElement}
            field="vchNo"
          ></DrillDownCellTemplate>
        ) 
      },
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "particulars",
      caption: t("account"),
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
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) + " Cr"
                : getFormattedValue(balance) + " Dr";
          return  {
            ...exportCell,
            text: cellInfo.value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?'#0000FF':'',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } :cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?{ argb: 'FF0000FF' }: "",
              size: 10,
              style:cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?'bold':'normal',
              bold: cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?true:false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
            {cellElement.data.particulars}
          </span>)
        }
      },
    },
    {
      dataField: "debit",
      caption: t("debit"),
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
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?'#0000FF':'',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } :cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?{ argb: 'FF0000FF' }: "",
              size: 10,
              style:cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?'bold':'normal',
              bold: cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?true:false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
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
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?'#0000FF':'',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } :cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?{ argb: 'FF0000FF' }: "",
              size: 10,
              style:cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?'bold':'normal',
              bold: cellElement.data.particulars === "TOTAL" ||cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ?true:false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
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
      showInPdf: true,
      width: 150,
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
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: filter?.showSeparateColorForDebitBalance == true && cellElement?.data?.balance >= 0 ? '#129151' :cellElement.data.particulars === "Total Pending Cheque Amt" ?'#0000FF': '#FF0000',
            font: {
              ...exportCell.font,
              color: filter?.showSeparateColorForDebitBalance == true && cellElement?.data?.balance >= 0 ? { argb: 'FF129151' } :cellElement.data.particulars === "Total Pending Cheque Amt" ?{ argb: 'FF0000FF' }: { argb: 'FFFF0000' },
              size: 10,
              style:'bold',
              bold:true,
            },
          };
        }
        else {
          return (<span
            className={`${filter?.showSeparateColorForDebitBalance == true && cellElement?.data?.balance >= 0 ? "text-[#129151]" :cellElement.data.particulars === "Total Pending Cheque Amt" ?'text-blue': 'text-[#DC143C]'} font-bold`}
          >
            {`${cellElement.data?.balance == null
              ? ''
              : cellElement.data.balance < 0
                ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
                : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
          </span>)
        }
      }
    },
    {
      dataField: "chequeNumber",
      caption: t("cheque_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "checkStatus",
      caption: t("check_status"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "chequeDate",
      caption: t("cheque_date"),
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
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center bg-gray-100 p-0 rounded-md"></button>
                <ErpDevGrid
                  remoteOperations={{ filtering: false, paging: false, sorting: false }}
                  columns={columns}
                  // remoteOperations={{filtering:false,paging:false,sorting:false}}
                  filterText="of {showAll == true && All} {showAll == false && [ledgerName] ([ledgerCode])}, from {dateFrom} to {dateTo} {costCentreID > 0 && , Cost Center: [CostCenterName]}"
                  gridHeader="Ledger Report"
                  dataUrl={Urls.acc_reports_ledger}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<LedgerReportFilter />}
                  filterInitialData={LedgerReportFilterInitialState}
                  onFilterChanged={(filter: any) => { setFilter(filter) }}
                  reload={true}
                  gridId="grd_ledger_report"
                  childPopupProps={{
                    content: null,
                    title: "",
                    isForm: false,
                    isTransactionScreen:true,
                    width: "",
                    drillDownCells: "vchNo,",
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

export default LedgerReport;
