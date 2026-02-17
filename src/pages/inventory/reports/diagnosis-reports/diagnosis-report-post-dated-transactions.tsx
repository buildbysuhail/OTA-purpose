import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

interface DiagnosisReportPostDatedTransactionProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}

const DiagnosisReportPostDatedTransactions: FC<DiagnosisReportPostDatedTransactionProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport");
  const location = useLocation();
  const [key, setKey] = useState(1);
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "voucher",
        caption: t("voucher"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "voucherNumber",
        caption: t("voucher_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "transactionDate",
        caption: t("transaction_date"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
        showInPdf: true,
        format: "dd-MMM-yyyy",
      },
      {
        dataField: "ledgerID",
        caption: t("ledger_id"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "relatedLedgerID",
        caption: t("related_ledger_id"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
        showInPdf: true,
      },
    ];
    return baseColumns.filter((column) => {
      if (
        column.dataField == "ledgerID" ||
        column.dataField == "relatedLedgerID"
      ) {
        return location.pathname.includes(
          "inventory/diagnosis_report_invalid_ledger_or_related_ledger"
        );
      }
      return true;
    });
  }, [t, key]);

  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);

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
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                method={ActionType.POST}
                reload={true}
                gridId={gridId}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DiagnosisReportPostDatedTransactions;