import { formatDate } from "devextreme/localization";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import urls from "../../../../redux/urls";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import ERPDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import {
  TransactionBase,
  transactionRoutes,
} from "../../../../components/common/content/transaction-routes";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { safeBase64Decode, customJsonParse } from "../../../../utilities/jsonConverter";
import { getStorageString } from "../../../../utilities/storage-utils";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { UserConfig } from "../transaction-types";
import { fetchUserConfig } from "../transaction-utils";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import { SearchProvider } from "../../../accounts/transactions/search-context.tsx";
import AccTransactionFormContainerViewContent from "../../../accounts/transactions/acc-transaction-View-container-content";

const toggleTransactionPopup = (payload: {
  isOpen: boolean;
  key: string | null;
  reload: boolean;
}) => ({
  type: "TOGGLE_TRANSACTION_POPUP",
  payload,
});

const TransactionGrid: React.FC<{
  voucherType?: string;
  transactionType?: string;
  title?: string;
  addTitle?: string;
}> = ({ voucherType, transactionType, title, addTitle }) => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation("transaction");
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const navigate = useNavigate();
  const userSession = useSelector((state: RootState) => state.UserSession)
  useEffect(() => {
    if (!userSession?.userId || !transactionType) return;
    const loadUserConfig = async () => {
      try {
        const key = btoa(`${userSession.userId}-${transactionType}_LocalSettings`);
        const Utc = await getStorageString(key);

        let userConfig: UserConfig | undefined;

        if (Utc) {
          const decoded = safeBase64Decode(Utc) ?? "{}";
          userConfig = customJsonParse(decoded ?? "{}");
        } else {
          userConfig = await fetchUserConfig(userSession.userId, transactionType);
        }

        // dispatch(forhanfich({ fie: { userConfig } }));
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              userConfig: userConfig
            }
          })
        );

      } catch (error) {
        console.error("Error loading user config:", error);
      }
    };

    loadUserConfig();
  }, []);

  useEffect (()=>{
    console.log("tg s : ",formState?.userConfig?.editInNewTab);
    
  })

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTransactionData, setDrawerTransactionData] = useState<any>(null);

  const openDrawer = (row: any) => {
    const transactionMasterID = parseInt(row.invTransactionMasterID || "0", 10);
    const vchtype = row.voucherType;
    const voucherform = row.formType ?? row.voucherForm;
    const prefix = row.voucherPrefix;
    const vchno = parseInt(row.voucherNumber || "0", 10);
    const financialYearID = parseInt(row.financialYearID || "0", 10);
    const tr = transactionRoutes.find((x) => x.voucherType === vchtype);

    setDrawerTransactionData({
      transactionMasterID,
      formType: voucherform,
      voucherPrefix: prefix,
      voucherType: vchtype,
      financialYearID,
      voucherNo: vchno,
      formCode: tr?.formCode,
      transactionType: tr?.transactionType ?? transactionType,
      transactionBase: tr?.transactionBase,
      title: tr?.title,
      drCr: tr?.drCr,
    });
    setDrawerOpen(true);
  };

  const [reload, setReload] = useState<boolean>(true);
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "invTransactionMasterID",
        caption: t("inv_transaction_master_id"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
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
          return cellInfo.data?.transactionDate
            ? formatDate(
              new Date(cellInfo.data?.transactionDate),
              "dd-MMM-yyyy"
            )
            : "";
        },
      },
      {
        dataField: "partyName",
        caption: t("party_name"),
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
        dataField: "voucherForm",
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
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "center",
        showInPdf: true,
        bold: true,
        cssClass: "centered-header",
        cellRender: (cellInfo) => {
          const row = cellInfo.data;
          return (
            <div style={{ textAlign: "center" }}>
              <span
                style={{ color: "#1b6de0", textDecoration: "underline", cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  openDrawer(row);
                }}
              >
                {cellInfo.value}
              </span>
            </div>
          );
        }
      },
      {
        dataField: "deliveryNoteNumber",
        caption: t("ref_no"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        showInPdf: true,
      },
      {
        dataField: "purchaseInvoiceDate",
        caption: t("ref_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        width: 150,
        alignment: "left",
        showInPdf: true,
        cellRender: (cellInfo: any) => {
          return cellInfo?.data?.purchaseInvoiceDate
            ? formatDate(
              new Date(cellInfo?.data?.purchaseInvoiceDate),
              "dd-MMM-yyyy"
            )
            : "";
        },
      },
      {
        dataField: "totalGross",
        caption: t("total_gross"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        showInPdf: true,
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "totalDiscount",
        caption: t("total_discount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        showInPdf: true,
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "grandTotal",
        caption: t("grand_total"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        showInPdf: true,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
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
      // Additional hidden fields
      {
        dataField: "adjustmentAmount",
        caption: t("adjustment_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "advanceAmt",
        caption: t("advance_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "bankAmt",
        caption: t("bank_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "billDiscount",
        caption: t("bill_discount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "cashAmt",
        caption: t("cash_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "cashDiscount",
        caption: t("cash_discount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "cashReceived",
        caption: t("cash_received"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "cashReturned",
        caption: t("cash_returned"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "cashrOrCredit",
        caption: t("cash_or_credit"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        format: "dd-MMM-yyyy",
      },
      {
        dataField: "creditAmt",
        caption: t("credit_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "deliveryDate",
        caption: t("delivery_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        format: "dd-MMM-yyyy",
      },
      {
        dataField: "despatchDate",
        caption: t("despatch_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        cellRender: (cellInfo: any) => {
          return cellInfo.data?.despatchDate
            ? formatDate(new Date(cellInfo.data?.despatchDate), "dd-MMM-yyyy")
            : "";
        },
      },
      {
        dataField: "despatchDocumentNumber",
        caption: t("despatch_document_number"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
      },
      {
        dataField: "dueDate",
        caption: t("due_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        cellRender: (cellInfo: any) => {
          return cellInfo.data?.dueDate
            ? formatDate(new Date(cellInfo.data?.dueDate), "dd-MMM-yyyy")
            : "";
        },
      },
      {
        dataField: "exchangeRate",
        caption: t("exchange_rate"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "financialYearID",
        caption: t("financial_year_id"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        format: "dd-MMM-yyyy",
      },
      {
        dataField: "orderDate",
        caption: t("order_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        cellRender: (cellInfo: any) => {
          return cellInfo.data?.orderDate
            ? formatDate(new Date(cellInfo.data?.orderDate), "dd-MMM-yyyy")
            : "";
        },
      },
      {
        dataField: "privAddAmount",
        caption: t("priv_add_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "privRedeem",
        caption: t("priv_redeem"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "quotationDate",
        caption: t("quotation_date"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        cellRender: (cellInfo: any) => {
          return cellInfo.data?.quotationDate
            ? formatDate(new Date(cellInfo.data?.quotationDate), "dd-MMM-yyyy")
            : "";
        },
      },
      {
        dataField: "roundAmount",
        caption: t("round_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "shortageAmount",
        caption: t("shortage_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "srAmount",
        caption: t("sr_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },
      {
        dataField: "systemDateTime",
        caption: t("system_datetime"),
        dataType: "date",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
        format: "dd-MMM-yyyy",
      },
      {
        dataField: "tokenNumber",
        caption: t("token_number"),
        dataType: "string",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "left",
        visible: false,
      },
      {
        dataField: "vatAmount",
        caption: t("vat_amount"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        allowSearch: true,
        alignment: "right",
        visible: false,
        cellRender: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value, false, 4)}`,
      },

      {
        dataField: "actions",
        caption: t("Actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: document?.dir === "rtl" ? "left" : "right",
        width: 100,

        cellRender: (cellElement: any) => {
          return (
            <ERPGridActions
              view={{
                type: "popup",
                action: () => {
                  openDrawer(cellElement.data);
                },
              }}
              edit={{
                type: "popup",
                action: () => {
                  const row = cellElement.data;
                  const transactionMasterID = parseInt(
                    row.invTransactionMasterID || "0",
                    10
                  );

                  const vchtype = row.voucherType;
                  const voucherform = row.voucherForm;

                  const prefix = row.voucherPrefix;
                  const vchno = row.voucherNumber;
                  const financialYearID = parseInt(
                    row.financialYearID || "0",
                    10
                  );

                  const tr = transactionRoutes.find(
                    (x: any) => x.voucherType === vchtype
                  );

                  let transactionData = {};
                  if (parseInt(vchno, 10) > 0) {
                    transactionData = {
                      transactionMasterID,
                      formType: voucherform,
                      voucherPrefix: prefix,
                      voucherType: vchtype,
                      financialYearID,
                      voucherNo: parseInt(vchno, 10),
                      formCode: tr?.formCode,
                      transactionType: tr?.transactionType,
                      transactionBase: tr?.transactionBase,
                      title: tr?.title,
                      drCr: tr?.drCr,
                    };
                  }
                  const url = new URL(
                    `${window.location.origin}/${TransactionBase.Sales}/${transactionType}`
                  );

                  // Append all parameters from the `params` object
                  Object.entries(transactionData).forEach(([key, value]) => {
                    url.searchParams.append(key, String(value));
                  });
                  url.searchParams.append("isEdit", "true");
                  if (formState?.userConfig?.editInNewTab) {
                    window.open(url.toString(), "_blank");
                  } else {
                    const path = url.pathname + url.search;
                    navigate(path);
                  }
                },
              }}
              delete={{
                onSuccess: () => {
                  setReload(true);
                },
                confirmationRequired: true,
                confirmationMessage:
                  "Are you sure you want to delete this transaction?",
                url: `${urls.inv_transaction_base}${transactionType}/`,
                key: cellElement?.data?.invTransactionMasterID,
                postData: {
                  invTransactionMasterID:
                    cellElement?.data?.invTransactionMasterID,
                  transactionType: transactionType,
                }
              }}
            />
          );
        },
      },
    ],
    [t, dispatch , formState.userConfig?.editInNewTab]
  );
  useEffect(() => {
    setReload(true);
  }, [location.pathname]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ERPDevGrid
                gridAddButtonType={"link"}
                gridAddButtonLink={`${import.meta.env.BASE_URL
                  }${TransactionBase.Sales}/${transactionType}`}
                columns={columns}
                dataUrl={`${urls.inv_transaction_base}${transactionType}/List/`}
                method={ActionType.GET}
                // postData={{voucherType: voucherType, transactionType: transactionType}}
                gridHeader={t(`${title}`)}
                gridId={`${addTitle ?? "transactions"}Transactions`}
                gridAddButtonIcon="ri-add-line"
                remoteOperations={true}
                pageSize={40}
                allowExport={true}
                reload={reload}
                changeReload={() => {
                  setReload(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {drawerOpen && drawerTransactionData && (
        <ERPResizableSidebar
          isOpen={drawerOpen}
          setIsOpen={() => setDrawerOpen(false)}
          position="right"
          initialWidth={Math.min(700, window.innerWidth * 0.55)}
          minWidth={500}
          maxWidth={Math.min(1000, window.innerWidth * 0.8)}
          zIndex={55}
          overlayNeeded={true}
        >
          <SearchProvider>
            <AccTransactionFormContainerViewContent
              isInvTrans={true}
              transactionMasterID={drawerTransactionData.transactionMasterID}
              transactionType={drawerTransactionData.transactionType}
              voucherNo={drawerTransactionData.voucherNo}
              voucherType={drawerTransactionData.voucherType}
              voucherPrefix={drawerTransactionData.voucherPrefix}
              formType={drawerTransactionData.formType}
              formCode={drawerTransactionData.formCode}
              title={drawerTransactionData.title}
              drCr={drawerTransactionData.drCr}
              financialYearID={drawerTransactionData.financialYearID}
              isDrawerMode={true}
              onClose={() => setDrawerOpen(false)}
              onDeleteSuccess={() => {
                setDrawerOpen(false);
                setReload(true);
              }}
            />
          </SearchProvider>
        </ERPResizableSidebar>
      )}
    </Fragment>
  );
};

export default React.memo(TransactionGrid);
