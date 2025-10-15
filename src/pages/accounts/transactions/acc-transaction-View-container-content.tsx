import React, {
  useEffect,
  useState,
} from "react";
import { useSearchParams,useParams } from "react-router-dom";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { useTemplateDesigner } from "../../InvoiceDesigner/LandingFolder/useTemplateDesigner"
import {
  Box,
  Paper,
} from "@mui/material";
import {
  ChevronUp,
  Printer,
  Trash2,
} from "lucide-react";
import { useSearch } from "./search-context.tsx";
import SharedTemplatePreview from "../../InvoiceDesigner/DesignPreview/shared";
import { useAccPrint } from "./use-acc-print";
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

const AccTransactionFormContainerViewContent: React.FC<TransactionViewProps> = (
  props
) => {
  // const [searchQuery, setSearchQuery] = useState<string>('');
  //   const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };
  const [searchParams] = useSearchParams();
  const { voucherNo: voucherNoParam } = useParams<{ voucherNo: string }>();
  const { searchQuery } = useSearch();
  
  const getParamOrProp = <T extends string | number>(
    key: keyof TransactionViewProps,
    isNumber: boolean = false
  ): T | undefined => {
    const paramValue = searchParams.get(key as string);
    if (paramValue != undefined && paramValue !== null) {
      return isNumber ? (Number(paramValue) as T) : (paramValue as T);
    }
    return undefined;
  };

  const shallowEqual = (a: Record<string, any>, b: Record<string, any>) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (String(a[k]) !== String(b[k])) return false;
    }
    return true;
  };

  const { t } = useTranslation("transaction");
  const formState: any = useAppSelector((state: RootState) => props.isInvTrans ?  state.InventoryTransaction : state.AccTransaction);
  const { printVoucher,} = useCommenPrint();
  const {
    stableTemplateProps,
    loading,
    templateStyleProperties
  } = useTemplateDesigner({ 
    manuvalTemplateFeatch:true, 
    isInvTrans: props.isInvTrans,
    MasterIDParam:props.transactionMasterID,
    transactionType:props.transactionType
  })

  return (
    <>
      <Box flex={1} bgcolor="#fff" sx={{ overflowY: "auto", marginLeft: { lg: "350px", xl: "350px" } }}>
          <header className="fixed  z-40 w-[-webkit-fill-available] h-[52px] bg-white flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-200">
            <h1 className="text-sm md:text-sm font-semibold tracking-tight text-[color:var(--color-foreground)]">
              {`INV-${String(stableTemplateProps?.data?.master?.voucherNumber || "").padStart(6, "0")}`}
            </h1>
            
            <div className="flex items-center gap-1 border border-gray-200 rounded-md bg-white p-0.5">
              {/* Edit Button */}
              <button
                disabled={loading}
                type="button"
                className="h-8 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded inline-flex items-center gap-1.5 transition-colors"
                title={t("edit")}
                aria-label={t("edit")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>

              <div className="w-px h-6 bg-gray-200" />

              {/* PDF/Print Dropdown Button */}
              <button
                type="button"
                disabled={loading}
                className="h-8 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded inline-flex items-center gap-1.5 transition-colors"
                onClick={() => printVoucher(props.transactionMasterID??0, props.transactionType ?? "",props.voucherType??'',props.formType??'',props.customerType??'',stableTemplateProps?.template,undefined,props.isInvTrans)}
                title={t("print")}
              >
                <Printer className="w-4 h-4" />
                <span>PDF/Print</span>
                <ChevronUp className="w-3.5 h-3.5 opacity-60 rotate-180" />
              </button>

              <div className="w-px h-6 bg-gray-200" />

              {/* Delete Button */}
              <button
                disabled={loading}
                type="button"
                className="h-8 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded inline-flex items-center gap-1.5 transition-colors"
                title={t("Delete")}
                aria-label={t("Delete")}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </header>

          <Paper elevation={0} sx={{ p: 0 }}>
            <div className="flex justify-center px-2 md:px-6 py-4 mt-[60px]">
              <div className="relative">
                <div
                  className="bg-white shadow-sm border border-[color:var(--color-border)] overflow-hidden rounded-sm"
                  style={{
                    width: `${templateStyleProperties.previewWidth ?? 500}pt`,
                    height: `${templateStyleProperties.previewHeight ?? 500}pt`,
                  }}
                >
                  <div
                    className="relative"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {loading  ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                          <div className="flex items-center justify-center h-full text-gray-500 italic">
                            ...No Template Found
                          </div>
                        )
                    )}
                  </div>
                </div>

                <div
                  aria-hidden
                  className="absolute -bottom-2 -right-2 bg-black/5 rounded-md -z-10"
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