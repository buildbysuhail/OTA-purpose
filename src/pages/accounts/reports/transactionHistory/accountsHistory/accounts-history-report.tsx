import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  DrillDownCellTemplate,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import TransactrionHistoryReportFilter, {
  TransactrionHistoryReportFilterInitialState,
} from "../transaction-history-report-filter";
import AccountsHistoryPopup from "./accounts-history-popup";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import moment from "moment";


const AccountsHistoryReport = () => {
  const dispatch = useAppDispatch();
    const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation("accountsReport");
  // const [filter, setFilter] =useState<AccountsHistoryReport>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf: true,
    },
    {
      dataField: "date",
      caption: t("transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
      showInPdf: true,
        cellRender: (
                          cellElement: any,
                          cellInfo: any,
                          filter: any,
                          exportCell: any
                        ) => {
                           return  (cellElement.data.date==null||cellElement.data.date==""?"":moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY")) ; // Ensures proper formatting
                        }
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
    },
    // {
    //   dataField: "timeStamp",
    //   caption: t("time"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 120,
    // },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.oldAccTransactionMasterID > 0 ? (
          <DrillDownCellTemplate
            data={cellElement}
            field="vchNo"
          ></DrillDownCellTemplate>
        ) : (
          cellElement.value
        );
      },
    },
    {
      dataField: "form",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "accountName",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,

      showInPdf: true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,

      showInPdf: true,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null 
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance,false,4) 
              : getFormattedValue(balance,false,4) ;

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == null 
              ? '':getFormattedValue(cellElement.data.debit,false,4) }`}
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
      width: 100,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null 
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance,false,4) 
              : getFormattedValue(balance,false,4) ;

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == null 
              ? '':getFormattedValue(cellElement.data.credit,false,4) }`}
          </span>)
        }
      }
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf: true,
    },
    {
      dataField: "actionStatus",
      caption: t("action"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "userName",
      caption: t("user_name"),
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
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("accounts_transaction_history")}
                  dataUrl={Urls.acc_reports_accounts_history}
                  method={ActionType.POST}
                  gridId="grd_accounts_history_report"
                  // popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<TransactrionHistoryReportFilter />}
                  filterInitialData={
                    TransactrionHistoryReportFilterInitialState
                  }
                  filterWidth="150"
                  // gridAddButtonType="popup"
                  reload={true}
                  childPopupProps={{
                    content: <AccountsHistoryPopup />,
                    title: t("accounts_transaction_history_popup"),
                    isForm: true,
                    width: "max-w-[1100px]",
                    drillDownCells: "vchNo",
                    bodyProps: "oldAccTransactionMasterID",
                    enableFn: (data: any) => data.oldAccTransactionMasterID > 0,
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

export default AccountsHistoryReport;
