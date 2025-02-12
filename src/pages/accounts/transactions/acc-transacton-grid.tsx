import { formatDate } from "devextreme/localization";
import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import urls from "../../../redux/urls";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../redux/types";

const toggleTransactionPopup = (payload: {
  isOpen: boolean;
  key: string | null;
  reload: boolean;
}) => ({
  type: "TOGGLE_TRANSACTION_POPUP",
  payload,
});


const AccTransactionGrid: React.FC<{voucherType?: string, transactionType?: string,title?: string}> = ({
  voucherType,
  transactionType,
  title,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('transaction');

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "accTransactionMasterID",
        caption: t("acc_transaction_master_id"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible:false,
      },
      {
        dataField: "transactionDate",
        caption: t("transaction_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        width: 150,
        alignment: "left",
        showInPdf: true,
        cellRender: (cellInfo: any) => {
          return cellInfo.value
            ? formatDate(new Date(cellInfo.value), "MMM dd, yyyy")
            : "";
        },
      },
      {
        dataField: "particulars",
        caption: t("particulars"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "voucherType",
        caption: t("voucher_type"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "formType",
        caption: t("form"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "voucherPrefix",
        caption: t("voucher_prefix"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "voucherNumber",
        caption: t("voucher_number"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "referenceNumber",
        caption: t("ref_no"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "referenceDate",
        caption: t("ref_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        width: 150,
        alignment: "left",
        showInPdf: true,
        cellRender: (cellInfo: any) => {
          return cellInfo.value
            ? formatDate(new Date(cellInfo.value), "MMM dd, yyyy")
            : "";
        },
      },
      {
        dataField: "totalDebit",
        caption: t("debit"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "totalCredit",
        caption: t("credit"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "discount",
        caption: t("discount"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "amount",
        caption: t("amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        showInPdf: true,
        cellRender: (cellInfo: any) =>
          `${cellInfo.value?.toLocaleString("en-UK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
      {
        dataField: "commonNarration",
        caption: t("narration"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "actions",
        caption: t("Actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <ERPGridActions
              view={{
                type: "popup",
                action: () =>
                  dispatch(
                    toggleTransactionPopup({
                      isOpen: true,
                      key: cellElement?.data?.accTransactionDetailID,
                      reload: false,
                    })
                  ),
              }}
              edit={{
                type: "popup",
                action: () =>
                  dispatch(
                    toggleTransactionPopup({
                      isOpen: true,
                      key: cellElement?.data?.accTransactionDetailID,
                      reload: false,
                    })
                  ),
              }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleTransactionPopup({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                confirmationRequired: true,
                confirmationMessage:
                  "Are you sure you want to delete this transaction?",
                url: "/api/transactions",
                key: cellElement?.data?.accTransactionDetailID,
              }}
            />
          );
        },
      },
    ],
    [t, dispatch]
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ERPDevGrid
              gridAddButtonType={"link"}
              gridAddButtonLink={`${import.meta.env.BASE_URL}accounts/transactions/${transactionType}`}
                columns={columns}
                dataUrl={`${urls.acc_transaction_base}${transactionType}/List/`}
                method={ActionType.GET}
                // postData={{voucherType: voucherType, transactionType: transactionType}} 
                gridHeader={t(`${title}`)}
                gridId="transaction-grid"
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
                allowExport={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(AccTransactionGrid);
