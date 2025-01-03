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
const DailySummaryReceiptDetails : React.FC<DailySummaryFilter> = ({ filter
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
     const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] =useState<DailySummaryReceiptDetails>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "accTransactionMasterID",
      caption: t("acc_transaction_masterID"),
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
      width: 150,
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
      dataField: "formType",
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
      dataField: "ledgerCode",
      caption: t("ledger_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 110,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.ledgerName
           
              }`}
        </span>
      ),
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.amount == null 
            ? '0'
              : getFormattedValue(cellElement.data.amount)
              }`}
        </span>
      ),
    },
    {
      dataField: "balanceAmount",
      caption: t('balance_amount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,

    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => {
        debugger;
        return (
          <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
            {`${cellElement.data.ledgerName === "TOTAL"?  
                 getFormattedValue(parseFloat(cellElement.data?.balance)):cellElement.data?.balance
                }`}
          </span>
        )
      }
    },
    {
      dataField: "ledger_Balance",
      caption: t("ledger_balance"),
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
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                //  remoteOperations={{filtering:true,paging:true,sorting:true}}
                  columns={columns}
                  gridHeader={t("daily_summary_receipt_details")}
                  dataUrl= {Urls.acc_reports_daily_summary_receipt_details}
                  method={ActionType.POST}
                  postData={filter}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
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

export default DailySummaryReceiptDetails;