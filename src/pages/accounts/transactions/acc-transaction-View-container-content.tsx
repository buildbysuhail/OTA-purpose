import React from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTemplateDesigner } from "../../InvoiceDesigner/LandingFolder/useTemplateDesigner"
import { Box, Paper, } from "@mui/material";
import { Pencil, Printer, Trash2, } from "lucide-react";
import { useSearch } from "./search-context.tsx";
import SharedTemplatePreview from "../../InvoiceDesigner/DesignPreview/shared";
import { useCommenPrint } from "../../transaction-base/use-commen-print";


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
  const { searchQuery } = useSearch();
  const { t } = useTranslation("transaction");
  const { printVoucher, } = useCommenPrint();
  const {
    stableTemplateProps,
    loading,
    templateStyleProperties
  } = useTemplateDesigner({
    manuvalTemplateFeatch: true,
    isInvTrans: props.isInvTrans,
    MasterIDParam: props.transactionMasterID,
    transactionType: props.transactionType
  })

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
            {`INV-${String(stableTemplateProps?.data?.master?.voucherNumber || "").padStart(6, "0")}`}
          </h1>

          <div className="flex items-center gap-1 border border-gray-200 dark:border-dark-border rounded-md bg-white dark:bg-dark-bg-card p-0.5">
            {/* Edit Button */}
            <button
              disabled={loading}
              type="button"
              className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded inline-flex items-center gap-1.5 transition-all duration-200"
              title="Edit"
              aria-label="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-dark-border" />

            {/* PDF/Print Button */}
            <button
              type="button"
              disabled={loading}
              className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded inline-flex items-center gap-1.5 transition-all duration-200"
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
                  width: `${templateStyleProperties.previewWidth ?? 500}pt`,
                  height: `${templateStyleProperties.previewHeight ?? 500}pt`,
                }}
              >
                <div
                  className="relative"
                  style={{ width: "100%", height: "100%" }}
                >
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
                      />
                      : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 italic">
                          ...No Template Found
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