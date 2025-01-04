import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { PartySummaryFilter } from "./party-summary-master";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
const PartySummaryLedger: React.FC<PartySummaryFilter> = ({ filter }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
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
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-red' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
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
      width: 170,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-red' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
          {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-red' : cellElement.data.particulars === "Pending Cheques" || cellElement.data.particulars === "Total Pending Cheque Amt" ? 'font-bold text-blue' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${"font-bold text-red"}`}>
          {`${cellElement.data?.balance == null
            ? '0'
            : cellElement.data.balance < 0
              ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
              : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
        </span>
      ),
    },
    {
      dataField: "ledger",
      caption: t("ledger"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "invTransactionID",
      caption: t("invTransaction_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "chequeNumber",
      caption: t("cheque_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "checkStatus",
      caption: t("check_status"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "chequeDate",
      caption: t("cheque_date"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "costCenter",
      caption: t("cost_center"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
    {
      dataField: "accTransactionDetailID",
      caption: t("accTransaction_detail_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 170,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("party_summary_ledger_report")}
                  dataUrl={Urls.acc_reports_party_summary_ledger}
                  method={ActionType.POST}
                  gridId="grd_party_summary_ledger_report"
                  postData={filter}
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
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
export default PartySummaryLedger;