import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useEffect, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { APIClient } from "../../../../../helpers/api-client";

export interface InventoryStatusPaymentAdjustmentTransactionsProps {
  masterId: any;
  branchId: any;
  ledgerId: any;
}

const api = new APIClient();

const InventoryStatusPaymentAdjustmentTransactions = ({branchId, ledgerId, masterId}:InventoryStatusPaymentAdjustmentTransactionsProps) => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();
  const [gridDataSource, setDataSource] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>("")
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "voucherPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.amount == null
              ? 0
              : getFormattedValue(cellElement.data.amount, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.amount == null
            ? 0
            : getFormattedValue(cellElement.data.amount, false, 4);
        }
      },
    },
  ];

 useEffect(() => {
  if (!branchId || !ledgerId || !masterId) return;

  const fetchData = async () => {
    try {
      const response = await api.postAsync(
        Urls.inventory_status_payment_adjustment_transactions,
        {
          branchId,
          ledgerId,
          masterId,
        }
      );
      setDataSource(response.data);
      setPaymentStatus(response.status);
    } catch (error) {
      console.error("Payment adjustment API error", error);
    }
  };

  fetchData();
}, [branchId, ledgerId, masterId]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="w-full flex justify-center py-2">
              <div className="font-semibold text-lg">{t("payment_status")}:{paymentStatus}</div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                filterText="{Status}"
                gridHeader={t("payment_adjusted_transactions")}
                data={gridDataSource} 
                hideGridAddButton={true}
                method={ActionType.POST}
                reload={true}
                gridId="grd_inventory_status_payment_adjustment_transactions"
                height={500}
                hideGridHeader={true}
                hideToolbar={true}
                allowExport={false}
                allowSearching={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default InventoryStatusPaymentAdjustmentTransactions;
