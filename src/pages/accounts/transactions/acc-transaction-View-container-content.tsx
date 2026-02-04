import React, { act, useEffect, useRef, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTemplateDesigner } from "../../InvoiceDesigner/LandingFolder/useTemplateDesigner"
import { Box, Paper, } from "@mui/material";
import { Pencil, Printer, Trash2, } from "lucide-react";
import { useSearch } from "./search-context.tsx";
import SharedTemplatePreview from "../../InvoiceDesigner/DesignPreview/shared";
import { useCommenPrint } from "../../transaction-base/use-commen-print";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import { fetchTemplateById } from "../../use-print";
import { TransactionBase, transactionRoutes } from "../../../components/common/content/transaction-routes";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../helpers/api-client";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import urls from "../../../redux/urls";
import { TransactionDetail } from "../../inventory/transactions/transaction-types";
import { AccTransactionRow } from "./acc-transaction-types";
import { Link } from "react-router-dom";
import { useDirectPrint } from "../../../utilities/hooks/use-direct-print";

export interface TransactionViewProps {
  voucherType?: string;
  transactionType?: string;
  isInvTrans?: boolean;
  formCode?: string;
  voucherPrefix?: string;
  formType?: string;
  customerType?: string;
  title?: string;
  drCr?: string;
  voucherNo?: number;
  transactionMasterID?: number;
  financialYearID?: number;
  isTeller?: boolean | false;
}

const AccTransactionFormContainerViewContent: React.FC<TransactionViewProps> = (props) => {
  const [searchParams] = useSearchParams();
  const { voucherNo: voucherNoParam } = useParams<{ voucherNo: string }>();
  const navigate = useNavigate();
  const { searchQuery } = useSearch();
  const { t } = useTranslation("transaction");
  const { printVoucher, } = useCommenPrint();
   const { directPrint } = useDirectPrint();
  const formState = props?.isInvTrans
    ? useAppSelector((state: RootState) => state.InventoryTransaction)
    : useAppSelector((state: RootState) => state.AccTransaction);

  const { 
    stableTemplateProps,
    loading,
    templateStyleProperties
  } = useTemplateDesigner({
    
    manuvalTemplateFeatch: true,
    isInvTrans: props.isInvTrans,
    MasterIDParam: props.transactionMasterID,
    transactionType: props.transactionType,
    lastChoosedTemplate: formState?.lastChoosedTemplate,
  })

  const previewWidth = templateStyleProperties.previewWidth ?? 500;
  const previewHeight = templateStyleProperties.previewHeight ?? 500; // Can be number or "auto"
  const isAutoHeight = templateStyleProperties.isAutoHeight ?? false;




  const handleEditClick = () => {
    const master = stableTemplateProps?.data?.master;
    if (!master) return;

    const transactionMasterID = props.isInvTrans
      ? master.invTransactionMasterID || 0
      : master.accTransactionMasterID || 0;
    const vchtype = master.voucherType;
    const voucherform = master.formType || "";
    const prefix = master.voucherPrefix || "";
    const vchno = master.voucherNumber;
    const financialYearID = master.financialYearID || 0;

    const tr = transactionRoutes.find((x: any) => x.voucherType === vchtype);

    let transactionData: any = {};
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
      `${window.location.origin}/${transactionData.transactionBase}/${transactionData.transactionType}`
    );

    Object.entries(transactionData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    if (formState?.userConfig?.editInNewTab) {
      window.open(url.toString(), "_blank");
    } else {
      const path = url.pathname + url.search;
      navigate(path);
    }
  };

  const handleDeleteClick = async () => {
    const master = stableTemplateProps?.data?.master;
    if (!master) return;

    const confirmed = await ERPAlert.show({
      title: t("deleting_transaction_question"),
      text: t("once_deleting_this_transaction_cannot_be_recovered"), // Corrected typo here
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (confirmed) {
      const apiClient = new APIClient();
      try {
        let response;
        if (props.isInvTrans) {
          // Inventory transaction: DELETE with data in the body
          response = await apiClient.delete(
            `${urls.inv_transaction_base}${props.transactionType}/`,
            {
              data: {
                invTransactionMasterID: master.invTransactionMasterID,
                transactionType: props.transactionType,
              },
            }
          );
        } else {
          // Account transaction: DELETE with ID in the URL
          const masterId = master.accTransactionMasterID;
          if (!masterId) {
            console.error("Transaction master ID is missing.");
            return;
          }
          response = await apiClient.delete(
            `${urls.acc_transaction_base}${props.transactionType}/${masterId}`
          );
        }

        if (response.status === 200) {
          ERPToast.show(t("transaction_deleted_successfully"), "success");
          setTimeout(() => {
            navigate(-1); // Go back to the previous page
          }, 500); // Delay navigation to allow toast to be seen
        }
      } catch (error) {
        console.error("Failed to delete transaction", error);
        ERPToast.show(t("delete_operation_failed"), "error");
      }
    }
  };

  return (
    <>
      <Box
        flex={1}
        className="dark:bg-dark-bg-card"
        sx={{
          overflowY: "auto",
          marginLeft: { lg: "350px", xl: "350px" },
          backgroundColor: "#fff",
          '.dark &': {
            backgroundColor: '#111827',
          }
        }}
      >
        <header className="fixed z-40 w-[-webkit-fill-available] h-[52px] bg-white dark:bg-dark-bg-card flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-200 dark:border-dark-border">
          <h1 className="text-sm md:text-sm font-semibold tracking-tight text-[color:var(--color-foreground)] dark:!text-dark-text">
            {`INV-${String(stableTemplateProps?.data?.master?.voucherNumber||"__")}`}
          </h1>

          <div className="flex items-center gap-1 border border-gray-200 dark:border-dark-border rounded-md bg-white dark:bg-dark-bg-card p-0.5">
            {/* Edit Button */}
            <button
              disabled={loading}

              type="button"
              className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded inline-flex items-center gap-1.5 transition-all duration-200"
              title="Edit"
              aria-label="Edit"
              onClick={handleEditClick}
            >
              <Pencil className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-dark-border" />

            {/* PDF/Print Button */}
            <button
              type="button"
              disabled={loading}
              className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded inline-flex items-center gap-1.5 transition-all duration-200"

              onClick={async () =>
                await directPrint({ template:stableTemplateProps?.template, data: stableTemplateProps?.data,})
              }
              title="PDF/Print"
              aria-label="PDF/Print"
            >
              <Printer className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-dark-border" />

            {/* Delete Button */}
            <button
              disabled={loading}
              type="button"
              className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded inline-flex items-center gap-1.5 transition-all duration-200"
              title="Delete"
              aria-label="Delete"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        <Paper
          elevation={0}
          className="dark:bg-dark-bg-card"
          sx={{
            p: 0,
            backgroundColor: 'transparent',
            '.dark &': {
              backgroundColor: '#111827',
            }
          }}
        >
          <div className="flex justify-center px-2 md:px-6 py-4 mt-[60px]">
            <div className="relative">
              <div
                className="bg-white dark:bg-dark-bg-card shadow-sm border border-[color:var(--color-border)] dark:border-dark-border overflow-hidden rounded-sm"

                style={{

                  width: `${previewWidth}pt`,
                  height: isAutoHeight ? 'auto' : `${previewHeight}pt`,
                  minHeight: isAutoHeight ? '200pt' : undefined,
                  transformOrigin: 'top left',
                }}
              >

                <div className={`relative w-full ${isAutoHeight ? 'flex flex-col' : 'h-full'}`}>

                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-blue-400"></div>
                    </div>
                  ) : (
                    stableTemplateProps?.template
                      ?
                      <SharedTemplatePreview
                        template={stableTemplateProps?.template}
                        data={stableTemplateProps?.data}
                        qrCodeImages={stableTemplateProps?.qrCodeImages}
                        isTemplateDesigner={false}
                        isInvTrans={props.isInvTrans}
                      />
                      : (
                      <div className="flex items-center justify-center h-full italic">
                        <span className="text-gray-500 dark:text-gray-400">
                          ...No Template Found.&nbsp;
                        </span>

                        <Link
                          to={`/templates?template_group=${stableTemplateProps?.data?.master?.voucherType?? ""}`}
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Create Template
                        </Link>
                      </div>

                      )
                  )}
                </div>
              </div>

              <div
                aria-hidden
                className="absolute -bottom-2 -right-2 bg-black/5 dark:bg-black/20 rounded-md -z-10"
                style={{
                  width: `${templateStyleProperties.previewWidth}pt`,
                  height: `${templateStyleProperties.previewHeight}pt`,
                  minHeight: "400px",
                }}
              />
            </div>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default AccTransactionFormContainerViewContent;