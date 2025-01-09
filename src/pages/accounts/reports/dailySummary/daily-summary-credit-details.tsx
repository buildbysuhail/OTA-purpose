import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { DailySummaryFilter } from "./daily-summary-master";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
const DailySummaryCreditDetails: React.FC<DailySummaryFilter> = ({ filter
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
    const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] =useState<DailySummaryCreditDetails>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "invTransactionMasterID",
      caption: t("invTransaction_master_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "voucherPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "voucherForm",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "voucherNumber",
      caption:  t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.partyName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.partyName }`}
        </span>
      ),
    },
    {
      dataField: "total",
      caption: t("total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.partyName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.total == null 
            ? '0'
              : getFormattedValue(cellElement.data.total)
              }`}
        </span>
      ),
    },
    {
      dataField: "receivedAmount",
      caption: t('received_amount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.partyName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.receivedAmount == null 
            ? '0'
              : getFormattedValue(cellElement.data.receivedAmount)
              }`}
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
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.partyName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.balance == null 
            ? '0'
              : getFormattedValue(cellElement.data.balance)
              }`}
        </span>
      ),
    },
    {
      dataField: "ledgerBalance",
      caption: t("ledgerBalance"),
      dataType: "string",
      allowSearch: true,
      alignment: "right",
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "ledger_Balance",
      caption: t("ledger_Balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "creditLimit",
      caption: t("credit_limit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "userName",
      caption: t("user_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
     {
      dataField: "signature",
      caption: t("signature"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
{
      dataField: "cashDiscount",
      caption: t("cash_discount"),
      dataType: "number",
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
                remoteOperations={{filtering:true,paging:true,sorting:true}}
                  columns={columns}
                  gridHeader={t("daily_summary_sales_credit_details")}
                  dataUrl= {Urls.acc_reports_daily_summary_credit_details}
                  method={ActionType.POST}
                  gridId="grd_daily_summary_credit_details"
                  popupAction={toggleCostCentrePopup}
                  postData={filter}
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

export default DailySummaryCreditDetails;