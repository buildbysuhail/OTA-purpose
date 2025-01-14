import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../redux/urls";
import { ActionType } from "../../../redux/types";
import { toggleCostCentrePopup } from "../../../redux/slices/popup-reducer";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import BankStatementReportFilter, { BankStatementReportFilterInitialState } from "./bank-statement-report-filter";

const BankStatementReport = () => {
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const columns: DevGridColumn[] = [
    {
      dataField: "iD",
      caption: t("id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      visible:false,
      showInPdf:true,
    },
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      format: 'MMMM dd, yyyy',
      showInPdf:true,
    },
    {
      dataField: "bankDate",
      caption: t('bank_date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      format: 'MMMM dd, yyyy',
      showInPdf:true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf:true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "ledger",
      caption: t("ledger"),
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
      width: 200,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {cellElement.data.particulars}
        </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.debit == null || cellElement.data?.debit == 0
            ? ''
            : cellElement.data.particulars === "TOTAL"
              ? getFormattedValue(parseFloat(cellElement.data.debit))
              : cellElement.data.debit}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.credit == null || cellElement.data?.credit == 0
            ? ''
            : cellElement.data.particulars === "TOTAL"
              ? getFormattedValue(parseFloat(cellElement.data.credit) )
              : cellElement.data.credit}`}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${"font-bold text-[#DC143C]"}`}>
          {`${cellElement.data?.balance == null
            ? '0'
            : cellElement.data.balance < 0
              ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
              : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
        </span>
      ),
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
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "invtransactionID",
      caption: t("invtransaction_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "chequeNumber",
      caption: t("cheque_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "checkStatus",
      caption: t("check_status"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
            
    {
      dataField: "chequeDate",
      caption: t("cheque_date"),
      dataType: "date",
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
                  filterText="from {dateFrom} to {dateTo} {bankLedgerID > 0 && , Bank Ledger: [BankLedgerName]}"
                  gridHeader={t("bank_statement")}
                  dataUrl={Urls.acc_reports_bank_statement}
                  method={ActionType.POST}
                  gridId="grd_bank_statement"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth="100"
                  filterContent={<BankStatementReportFilter />}
                  filterInitialData={BankStatementReportFilterInitialState}
                  hideGridAddButton={true}
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default BankStatementReport;