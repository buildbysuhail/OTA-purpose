import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { DailySummaryFilter } from "../daily-summary-master";

interface DailySummary {
  transactionDate: Date;
  counterID: number;
  costCentreID: number;
  counterShiftId: number;
  employeeID: number;
}
const DailySummary: React.FC<DailySummaryFilter> = ({ filter
}) => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  // const [filter, setFilter] =useState<DailySummary>({transactionDate: new Date(), counterID: 0,costCentreID: 0,counterShiftId: 0,employeeID: 0});
  const [voucherType, setVoucherType] = useState<string>();
  const [reload, setReload] = useState<boolean>(false);
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "cType",
      caption: t('c_type'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.cType === "NS" || cellElement.data.cType === "CRS" || cellElement.data.cType === "CASHSI" || cellElement.data.cType === "CB" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.cType}
        </span>
      ),
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.cType === "NS" || cellElement.data.cType === "CRS" || cellElement.data.cType === "CASHSI" || cellElement.data.cType === "CB" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.description}
        </span>
      ),
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
          cellRender: (cellElement: any, cellInfo: any) => (
            <span className={`${cellElement.data.cType==="NS"||cellElement.data.cType==="CRS"||cellElement.data.cType==="CASHSI"||cellElement.data.cType==="CB"?'font-bold text-red':''}`}>
      {`${ cellElement.data?.amount == null ? '0' : cellElement.data.amount < 0 ? getFormattedValue(-1* cellElement.data.amount) : getFormattedValue(cellElement.data.amount)}`}
      </span>
          ),
    },
  ];
  const detailColumnsTemp = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "vrType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "voucherPrefix",
      caption: t("voucherPrefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
          {`${cellElement.data?.ledgerName}`}
        </span>
      ),
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
          {`${cellElement.data?.partyName}`}
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
      dataField: "cashAmount",
      caption: t("cash_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.partyName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.cashAmount == null 
            ? '0'
              : getFormattedValue(cellElement.data.cashAmount)
              }`}
        </span>
      ),
    },
    {
      dataField: "creditAmount",
      caption: t("credit_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.partyName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.creditAmount == null 
            ? '0'
              : getFormattedValue(cellElement.data.creditAmount)
              }`}
        </span>
      ),
    },
    {
      dataField: "bankAmount",
      caption: t("bank_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.partyName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.bankAmount == null 
            ? '0'
              : getFormattedValue(cellElement.data.bankAmount)
              }`}
        </span>
      ),
    },
    {
      dataField: "salesMan",
      caption: t("sales_man"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      dataField: "discount",
      caption: t("discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.discount == null 
            ? '0'
              : getFormattedValue(cellElement.data.discount)
              }`}
        </span>
      ),
    },
    {
      dataField: "employee",
      caption: t("employee"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
   
    {
      dataField: "branchID",
      caption: t("branchId"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "address1",
      caption: t("address"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "totalDiscount",
      caption: t("total_discount"),
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
      dataField: "creditAmt",
      caption: t("credit_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
];
  const [detailsColumns, setDetailsColumns] = useState<any>(detailColumnsTemp);
  useEffect(() => {
    const updatedColumns = [...detailColumnsTemp]
    const filteredColumns = updatedColumns.filter((column) => {
      // Add logic for filtering based on voucherType
      if (["SI"].includes(voucherType ?? "")) {
        return !["invTransactionMasterID", "date", "vrType", "voucherPrefix", "voucherNumber", "partyName","total","cashAmount","creditAmount","bankAmount","salesMan"].includes(column.dataField);
      }
      if (["SR","SRCRD","SRCASH"].includes(voucherType ?? "")) {
        return !["invTransactionMasterID", "date", "vrType", "voucherPrefix", "voucherNumber", "partyName","total","cashAmount","creditAmount","salesMan"].includes(column.dataField);
      }
      if (["NS"].includes(voucherType ?? "")) {
        return !["invTransactionMasterID", "date", "vrType", "voucherPrefix", "voucherNumber", "partyName","total","salesMan"].includes(column.dataField);
      }
      if (["SICRD"].includes(voucherType ?? "")) {
        return !["invTransactionMasterID", "date", "vrType", "voucherPrefix", "voucherNumber", "partyName","total","creditAmt","salesMan"].includes(column.dataField);
      }
      if (["BNKAMT"].includes(voucherType ?? "")) {
        return !["invTransactionMasterID","branchID", "date", "vrType", "voucherPrefix", "voucherNumber", "partyName","address1","grandTotal","bankAmount","userName","signature","salesMan"].includes(column.dataField);
      }
      if (["CASHSI"].includes(voucherType ?? "")) {
        return !["invTransactionMasterID","branchID", "date", "vrType", "voucherPrefix", "voucherNumber", "partyName","address1","grandTotal","cashReceived","bankAmount","totalDiscount","userName","signature"].includes(column.dataField);
      }
      if (["CR", "CP", "BR"].includes(voucherType ?? "")) {
        return !["accTransactionMasterID", "date", "vrType", "voucherPrefix", "voucherNumber","ledgerCode", "ledgerName","amount","discount","employee"].includes(column.dataField);
      } else {
        return !["amount", "discount", "employee", "ledgerName"].includes(column.dataField);
      }
    });
    
    setDetailsColumns(filteredColumns);
  }, [voucherType]);
  const onRowClick = useCallback((event: any) => {
    setVoucherType(event.data?.cType);
    setReload(true)
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                showSerialNo={true}
                gridHeader={t("daily_summary_report")}
                dataUrl={Urls.acc_reports_daily_summary}
                postData={filter}
                onRowClick={onRowClick}
                method={ActionType.POST}
                gridId="grd_cost_centre"
                popupAction={toggleCostCentrePopup}
                remoteOperations={{filtering: false, paging: false, sorting: false}}
                hideGridAddButton={true}
              ></ErpDevGrid>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
              //  remoteOperations={{filtering:true,paging:true,sorting:true}}
                columns={detailsColumns}
                gridHeader={t("daily_summary_detailed")}
                dataUrl={Urls.acc_reports_daily_summary_detailed}
                postData={{
                  ...filter,
                  voucherType: voucherType
                }}
                method={ActionType.POST}
                changeReload={(reload: any) => {
                  if (!reload) {
                    setReload(reload);
                  }
                }}
                gridId="grd_cost_centre_detailed"
                popupAction={toggleCostCentrePopup}
                hideGridAddButton={true}
                reload={reload}
              ></ErpDevGrid>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DailySummary;