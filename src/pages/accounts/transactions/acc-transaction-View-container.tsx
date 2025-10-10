import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Urls from "../../../redux/urls";
import { useSearchParams,useParams,useNavigate,useLocation } from "react-router-dom";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { APIClient } from "../../../helpers/api-client";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { isChooseVoucherEnabled, TransactionBase, transactionRoutes } from "../../../components/common/content/transaction-routes";
import AccTransactionForm from "./acc-transaction";
import VoucherSelector from "../../transaction-base/voucher-selector";
import { useUnsavedChangesWarning } from "../../use-unsaved-changes-warning";
import HistorySidebar from "../../inventory/transactions/purchase/historySidebar";
import Header from "../../inventory/transactions/purchase/components/header";
import { useTemplateDesigner } from "../../InvoiceDesigner/LandingFolder/useTemplateDesigner"
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
} from "@mui/material";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import urls from "../../../redux/urls";
import { ActionType } from "../../../redux/types";
import {
  CalendarDays,
  ChevronUp,
  EllipsisVertical,
  Mail,
  MessageCircle,
  MessageSquare,
  Printer,
  Trash2,
} from "lucide-react";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useSearch } from "./search-context.tsx";
import { useAccPrint } from "./use-print";
import SharedTemplatePreview from "../../InvoiceDesigner/DesignPreview/shared";


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

const AccTransactionFormContainerView: React.FC<TransactionViewProps> = (
  props
) => {
  debugger;
  const { printVoucher } = useAccPrint();
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

  // State initialization
  const [input, setInput] = useState({
    voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
    transactionType:
      getParamOrProp<string>("transactionType") || props.transactionType,
    isInvTrans: (props.isInvTrans) as boolean,
    formCode: getParamOrProp<string>("formCode") || props.formCode,
    voucherPrefix:
      getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
    formType: getParamOrProp<string>("formType") || props.formType,
    title: getParamOrProp<string>("title") || props.title,
    drCr: getParamOrProp<string>("drCr") || props.drCr,
    voucherNo: Number(voucherNoParam) || props.voucherNo || 0,
    transactionMasterID:
      getParamOrProp<number>("transactionMasterID", true) ||
      props.transactionMasterID ||
      0,
    financialYearID:
      getParamOrProp<number>("financialYearID", true) ||
      props.financialYearID ||
      0,
  });

  const shallowEqual = (a: Record<string, any>, b: Record<string, any>) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (String(a[k]) !== String(b[k])) return false;
    }
    return true;
  };

  useEffect(() => {
    const newInput = {
      voucherType: getParamOrProp<string>("voucherType") || input.voucherType,
      isInvTrans: (getParamOrProp<string>("isInvTrans") || input.isInvTrans) as boolean,
      transactionType: input.transactionType,
      formCode: getParamOrProp<string>("formCode") || input.formCode,
      voucherPrefix: getParamOrProp<string>("voucherPrefix") || input.voucherPrefix,
      formType: getParamOrProp<string>("formType") || input.formType,
      title: getParamOrProp<string>("title") || input.title,
      drCr: getParamOrProp<string>("drCr") || input.drCr,
      voucherNo: Number(voucherNoParam) || input.voucherNo,
      transactionMasterID: getParamOrProp<number>("transactionMasterID", true) || input.transactionMasterID,
      financialYearID: getParamOrProp<number>("financialYearID", true) || input.financialYearID,
    };

    if (!shallowEqual(newInput, input)) {
      setInput(newInput);
    }
  }, [searchParams, voucherNoParam, props, input.transactionMasterID]);

  const { t } = useTranslation("transaction");
  const formState: any = useAppSelector((state: RootState) => props.isInvTrans ?  state.InventoryTransaction : state.AccTransaction);

  const navigate = useNavigate();
  const location = useLocation();
  const { hasUnsavedChanges, setIsModalOpen } = useUnsavedChangesWarning();
  const dispatch = useDispatch();

  const goBack = async () => {
    const has = await hasUnsavedChanges();
    if (has) {
      setIsModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(null);

  const onRowClick = useCallback(
    async (event: any) => {
      const _event = event.data != undefined ? event : event?.event;
      const clickedRow = _event.data;
      
      const transactionMasterID = parseInt(clickedRow.accTransactionMasterID || "0", 10);
      const vchtype = clickedRow.voucherType;
      const voucherform = clickedRow.formType;
      const prefix = clickedRow.lastPrefix || clickedRow.voucherPrefix;
      const vchno = clickedRow.lastVNo || clickedRow.voucherNumber;
      const financialYearID = parseInt(clickedRow.financialYearID || "0", 10);

      // Set selected row ID for highlighting - use the ID as number
      setSelectedRowId(transactionMasterID);

      const tr = transactionRoutes.find((x) => x.voucherType === vchtype);
      const newInput = {
        voucherType: vchtype,
        isInvTrans: input.isInvTrans,
        transactionType: input.transactionType,
        formCode: clickedRow?.formCode,
        voucherPrefix: prefix,
        formType: voucherform,
        title:  input.title,
        drCr:  input.drCr,
        voucherNo: vchno,
        transactionMasterID: transactionMasterID,
        financialYearID: financialYearID,
      };

      if (!shallowEqual(newInput, input)) {
        setInput(newInput);
      }
      
      let transactionData: Record<string, string | number | undefined> = {};
      if (Number.parseInt(vchno, 10) > 0) {
        transactionData = {
          transactionMasterID,
          formType: voucherform,
          voucherPrefix: prefix?.toUpperCase(),
          voucherType: vchtype,
          financialYearID,
          formCode: tr?.formCode,
          transactionBase: tr?.transactionBase,
          title: tr?.title,
          drCr: tr?.drCr,
        };
      }

      const queryString = new URLSearchParams(
        Object.entries(transactionData).reduce((acc, [key, value]) => {
          acc[key] = String(value ?? "");
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const newUrl = `/accounts/transactions/CashPayment/${vchno}${queryString ? `?${queryString}` : ""}`;

      setSelectedRow(clickedRow);
    },
    [input]
  );

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "accTransactionMasterID",
        caption: t("Actions"),
        allowSearch: true,
        allowSorting: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          const rowId = parseInt(cellElement.data?.accTransactionMasterID || "0", 10);
          const isSelected = rowId === selectedRowId && selectedRowId !== null && selectedRowId !== 0;
          return (
            <div className={`bg-white p-4 shadow-md transition-all duration-300 ease-in-out 
              ${isSelected 
                ? 'bg-[#e3f2fd] border-l-4 border-blue-500 ring-2 ring-blue-300' 
                : 'hover:bg-gradient-to-r hover:from-[#dfe7f9] hover:to-[#f1f7ff] hover:ring-2 hover:ring-blue-300 hover:scale-105'
              }`}
            >
              <div className="w-full flex flex-row">
                <div className="w-1/2  flex items-center ">
                  <CalendarDays className="mr-1 w-4 h-4 text-gray-500 font-semibold !text-[10px]" />
                  <p className="text-gray-600 font-medium !text-[12px]">
                    {new Date(
                      cellElement.data?.transactionDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="w-1/2  flex items-center justify-end ">
                  <p className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {cellElement.data?.voucherNumber}
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <div className="text-right">
                  <p className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {cellElement.data?.amount}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-gray-600 font-normal  overflow-hidden text-ellipsis whitespace-nowrap ">
                  {cellElement.data?.particulars}
                </p>
              </div>
            </div>
          );
        },
      },
    ],
    [t, selectedRowId]
  );

  const columnstwo: DevGridColumn[] = useMemo(() => [
    {
      dataField: "accTransactionMasterID",
      caption: t("Actions"),
      allowSearch: true,
      allowSorting: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => {
        const rowId = parseInt(cellElement.data?.accTransactionMasterID || "0", 10);
        const isSelected = rowId === selectedRowId && selectedRowId !== null && selectedRowId !== 0;
        return (
          <div className={`bg-white p-4 transition-all duration-300 ease-in-out 
            ${isSelected 
              ? 'bg-[#e3f2fd] border-l-4 border-blue-500 ring-2 ring-blue-300' 
              : 'hover:bg-[#f1f1fa] hover:ring-2 hover:ring-blue-300'
            }`}
          >
            <div className="w-full flex flex-row">
              <div className="w-1/2 flex items-center">
                <CalendarDays className="mr-1 w-4 h-4 text-gray-500 font-semibold !text-[10px]" />
                <p className="text-gray-600 font-medium !text-[12px]">
                  {new Date(
                    cellElement.data?.transactionDate
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="w-1/2 flex items-center justify-end">
                <p className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                  {cellElement.data?.voucherNumber}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <div className="text-right">
                <p className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                  {cellElement.data?.amount}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-gray-600 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                {cellElement.data?.particulars}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      dataField: "transactionDate",
      visible: false,
      allowFiltering: true,
      dataType: "date",
    },
    {
      dataField: "voucherNumber",
      visible: false,
      allowFiltering: true,
      dataType: "string",
    },
    {
      dataField: "amount",
      visible: false,
      allowFiltering: true,
      dataType: "number",
    },
    {
      dataField: "particulars",
      visible: false,
      allowFiltering: true,
      dataType: "string",
    },
  ], [t, selectedRowId]);
  
  const phone = window.innerWidth <= 600;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    stableTemplateProps,
    loading,
    templateStyleProperties
  } = useTemplateDesigner({ 
    manuvalTemplateFeatch:true, 
    isInvTrans: input.isInvTrans,
    MasterIDParam:input.transactionMasterID,
    transactionType:input.transactionType
  })

  const MemoizedGrid = useMemo(() => {
    return (
      <ERPDevGrid
        columns={columnstwo}
        height={"89vh"}
        dataUrl={`${input.isInvTrans ? urls.inv_transaction_base: urls.acc_transaction_base}${input.transactionType}/List/`}
        method={ActionType.GET}
        postData={{ searchQuery }}
        gridHeader={t("All invoices")}
        gridId="transaction-grid"
        remoteOperations={{
          paging: true,
          filtering: true,
          sorting: true,
        }}
        gridAddButtonIcon="ri-add-line"
        showPrintButton={false}
        pageSize={40}
        scrollingMode="virtual"
        allowExport={false}
        allowSearching={true}
        hideDefaultExportButton={true}
        hideDefaultSearchPanel={false}
        hideGridAddButton={true}
        hideGridHeader={true}
        showColumnHeaders={false}
        className="HistorySidebarcustomtwo"
        ShowGridPreferenceChooser={false}
        onRowClick={onRowClick}
      />
    );
  }, [columnstwo, onRowClick, searchQuery]);

  return (
    <>
      <Box display="flex" height="100vh">
        {/* Sidebar */}
        <Box
          width={350}
          bgcolor="#fafbfc"
          borderRight="1px solid #eee"
          position="fixed"
          sx={{
            overflowY: "auto",
            height: "100vh",
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "block",
              xl: "block",
            },
          }}
        >
          <div className="py-0 bg-gray-50 h-[94vh]">
            <div className="flex items-center justify-between px-3">
            </div>

            <div className="space-y-4">
              {MemoizedGrid}
            </div>
          </div>
        </Box>

        {/* Main Content */}
        <Box flex={1} bgcolor="#fff" sx={{ overflowY: "auto", marginLeft: { lg: "350px", xl: "350px" } }}>
          <header className="fixed  z-40 w-[-webkit-fill-available] h-[52px] bg-white flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-200">
            <h1 className="text-sm md:text-sm font-semibold tracking-tight text-[color:var(--color-foreground)]">
              {`INV-${String(input?.voucherNo || "").padStart(6, "0")}`}
            </h1>
            
            <div className="flex items-center gap-1 border border-gray-200 rounded-md bg-white p-0.5">
              {/* Edit Button */}
              <button
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
                className="h-8 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded inline-flex items-center gap-1.5 transition-colors"
                onClick={() => printVoucher(input.transactionMasterID, input.transactionType ?? "", stableTemplateProps.template, input.voucherType, formState.transaction.master.transactionDate)}
                title={t("print")}
              >
                <Printer className="w-4 h-4" />
                <span>PDF/Print</span>
                <ChevronUp className="w-3.5 h-3.5 opacity-60 rotate-180" />
              </button>

              <div className="w-px h-6 bg-gray-200" />

              {/* Delete Button */}
              <button
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
      </Box>
    </>
  );
};

export default AccTransactionFormContainerView;