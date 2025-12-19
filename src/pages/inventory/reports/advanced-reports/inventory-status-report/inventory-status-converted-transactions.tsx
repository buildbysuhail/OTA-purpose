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

export interface InventoryStatusConvertedTransactionsProps {
  masterId: any;
}
const api = new APIClient();
const InventoryStatusConvertedTransactions = ({ masterId }: InventoryStatusConvertedTransactionsProps ) => {
  const { t } = useTranslation("accountsReport");
  const [gridDataSource, setGridDataSource] = useState<any[]>([]);
  const columns: DevGridColumn[] = [
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "prefix",
      caption: t("prefix"),
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
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
  ];

  useEffect(() => {
      const fetchGridData = async () => {
          try {
              const priceCatData = await api.getAsync(`${Urls.inventory_status_converted_transactions}${masterId}`);
              setGridDataSource(priceCatData.data);
          } catch (error) {
              console.error("Error fetching price categories:", error);
          }
      };
      fetchGridData();
  }, []);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                gridHeader={t("converted_transactions")}
                // dataUrl={`${Urls.inventory_status_converted_transactions}${masterId}`}
                data={gridDataSource}
                hideGridAddButton={true}
                method={ActionType.GET}
                reload={true}
                gridId="grd_converted_transactions"
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
export default InventoryStatusConvertedTransactions;
