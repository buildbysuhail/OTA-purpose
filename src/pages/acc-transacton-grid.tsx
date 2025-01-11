import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DevGridColumn } from "../components/types/dev-grid-column";
import ERPGridActions from "../components/ERPComponents/erp-grid-actions";
import ERPDevGrid from "../components/ERPComponents/erp-dev-grid";
import { useAppDispatch } from "../utilities/hooks/useAppDispatch";
import { useRootState } from "../utilities/hooks/useRootState";
import { formatDate } from "devextreme/localization";
import { DummyVoucherData } from "./InvoiceDesigner/constants/DummyData";

const toggleTransactionPopup = (payload: {
  isOpen: boolean;
  key: string | null;
  reload: boolean;
}) => ({
  type: "TOGGLE_TRANSACTION_POPUP",
  payload,
});

const AccTransactionGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const transformedData = useMemo(() => {
    return DummyVoucherData.details.map((detail) => ({
      accTransactionMasterID: DummyVoucherData.master.accTransactionMasterID,
      accTransactionDetailID: detail.accTransactionDetailID,
      departmentID: DummyVoucherData.master.departmentID,
      costCentreID: DummyVoucherData.master.costCentreID,
      billwiseMasterID: DummyVoucherData.master.billwiseMasterID,
      employeeID: DummyVoucherData.master.employeeID,
      invTransactionID: DummyVoucherData.master.invTransactionID,
      transactionDate: DummyVoucherData.master.transactionDate,
      prevTransDate: DummyVoucherData.master.prevTransDate,
      bankDate: DummyVoucherData.master.bankDate,
      voucherPrefix: DummyVoucherData.master.voucherPrefix,
      voucherNumber: DummyVoucherData.master.voucherNumber,
      referenceNumber: DummyVoucherData.master.referenceNumber,
      referenceDate: DummyVoucherData.master.referenceDate,
      dueDate: DummyVoucherData.master.dueDate,
      particulars: DummyVoucherData.master.particulars,
      totalDebit: DummyVoucherData.master.totalDebit,
      billwiseTotalAdjAmt: DummyVoucherData.master.billwiseTotalAdjAmt,
      billwiseAdjAmt: DummyVoucherData.master.billwiseAdjAmt,
      totalCredit: DummyVoucherData.master.totalCredit,
      totDiscount: DummyVoucherData.master.totDiscount,
      empIncentive: DummyVoucherData.master.empIncentive,
      commonNarration: DummyVoucherData.master.commonNarration,
      remarks: DummyVoucherData.master.remarks,
      voucherType: DummyVoucherData.master.voucherType,
      formType: DummyVoucherData.master.formType,
      debitNoteTransID: DummyVoucherData.master.debitNoteTransID,
      creditNoteTransID: DummyVoucherData.master.creditNoteTransID,
      currencyID: DummyVoucherData.master.currencyID,
      accTransDetailID: DummyVoucherData.master.accTransDetailID,
      adjustedTransDetailID: DummyVoucherData.master.adjustedTransDetailID,
      currencyRate: DummyVoucherData.master.currencyRate,
      isPosted: DummyVoucherData.master.isPosted,
      randomKey: DummyVoucherData.master.randomKey,
      onlineTrans: DummyVoucherData.master.onlineTrans,
      isEdit: DummyVoucherData.master.isEdit,
      checkStatus: DummyVoucherData.master.checkStatus,
      checkBouncedDate: DummyVoucherData.master.checkBouncedDate,
      drCr: DummyVoucherData.master.drCr,
      isSalesView: DummyVoucherData.master.isSalesView,
      branchID: DummyVoucherData.master.branchID,
      counterID: DummyVoucherData.master.counterID,
      refBranchID: DummyVoucherData.master.refBranchID,
      uuid: DummyVoucherData.master.uuid,
      OrderDate: DummyVoucherData.master.transactionDate,
      CustomerStoreCity: "N/A",
      CustomerStoreState: "N/A",
      SaleAmount: detail.amount,
      actions: detail,
    }));
  }, []);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "accTransactionMasterID",
        caption: t("accTransactionMasterID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "accTransactionDetailID",
        caption: t("accTransactionDetailID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "departmentID",
        caption: t("departmentID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "costCentreID",
        caption: t("costCentreID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "billwiseMasterID",
        caption: t("billwiseMasterID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "employeeID",
        caption: t("employeeID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "invTransactionID",
        caption: t("invTransactionID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "transactionDate",
        caption: t("transactionDate"),
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
        dataField: "prevTransDate",
        caption: t("prevTransDate"),
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
        dataField: "bankDate",
        caption: t("bankDate"),
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
        dataField: "voucherPrefix",
        caption: t("voucherPrefix"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "voucherNumber",
        caption: t("voucherNumber"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "referenceNumber",
        caption: t("referenceNumber"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "referenceDate",
        caption: t("referenceDate"),
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
        dataField: "dueDate",
        caption: t("dueDate"),
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
        caption: "particulars",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "totalDebit",
        caption: "totalDebit",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "billwiseTotalAdjAmt",
        caption: "billwiseTotalAdjAmt",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "billwiseAdjAmt",
        caption: "billwiseAdjAmt",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "totalCredit",
        caption: "totalCredit",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "totDiscount",
        caption: "totDiscount",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "empIncentive",
        caption: "empIncentive",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "commonNarration",
        caption: "commonNarration",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "remarks",
        caption: "remarks",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "voucherType",
        caption: "voucherType",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "formType",
        caption: "formType",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "debitNoteTransID",
        caption: "debitNoteTransID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "creditNoteTransID",
        caption: "creditNoteTransID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "currencyID",
        caption: "currencyID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "accTransDetailID",
        caption: "accTransDetailID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "adjustedTransDetailID",
        caption: "adjustedTransDetailID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "currencyRate",
        caption: "currencyRate",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "isPosted",
        caption: "isPosted",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "randomKey",
        caption: "randomKey",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "onlineTrans",
        caption: "onlineTrans",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "isEdit",
        caption: "isEdit",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "checkStatus",
        caption: "checkStatus",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "checkBouncedDate",
        caption: t("checkBouncedDate"),
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
        dataField: "drCr",
        caption: "drCr",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "isSalesView",
        caption: "isSalesView",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "branchID",
        caption: "branchID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "counterID",
        caption: "counterID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "refBranchID",
        caption: "refBranchID",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "uuid",
        caption: "uuid",
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "SaleAmount",
        caption: t("Sale Amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        showInPdf: true,
        cellRender: (cellInfo: any) =>
          `$${cellInfo.value.toLocaleString("en-UK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
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
                columns={columns}
                data={transformedData}
                gridHeader={t("Transactions")}
                gridId="transaction-grid"
                gridAddButtonType="popup"
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
