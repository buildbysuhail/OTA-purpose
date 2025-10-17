import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Tooltip,
} from "@mui/material";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import urls from "../../../redux/urls";
import { ActionType } from "../../../redux/types";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useSearch } from "./search-context.tsx";
// import { useAccPrint } from "./use-print";
import AccTransactionFormContainerViewContent from "./acc-transaction-View-container-content";

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
  // const [searchQuery, setSearchQuery] = useState<string>('');
  //   const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };
// const { printVoucher } = useAccPrint();
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

  const { t } = useTranslation("transaction");
  
  // Use ref to track selected row without causing re-renders
  const selectedRowIdRef = useRef<number>(0);

  // Add CSS for selection - this runs once on mount
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .grid-row-item {
        transition: all 0.15s ease-in-out;
      }
      .grid-row-item:hover {
        background-color: #f8f9fa !important;
      }
      .grid-row-item.selected {
        background-color: #f0f4ff !important;
        border-left: 3px solid #2563eb !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Sync selected row on mount or when transactionMasterID changes from outside
  useEffect(() => {
    if (input.transactionMasterID && input.transactionMasterID !== selectedRowIdRef.current) {
      selectedRowIdRef.current = input.transactionMasterID;
      
      requestAnimationFrame(() => {
        document.querySelectorAll('.grid-row-item.selected').forEach(el => {
          el.classList.remove('selected');
        });

        document.querySelectorAll('.grid-row-item').forEach(el => {
          const rowId = el.getAttribute('data-row-id');
          if (rowId === String(input.transactionMasterID)) {
            el.classList.add('selected');
          }
        });
      });
    }
  }, [input.transactionMasterID]);

  const onRowClick = useCallback(
    (event: any) => {
      const _event = event.data != undefined ? event : event?.event;
      const clickedRow = _event.data;
      const transactionMasterID = parseInt(
        (input.isInvTrans ? clickedRow.invTransactionMasterID : clickedRow.accTransactionMasterID) || "0",
        10
      );

      // Update ref without causing re-render
      selectedRowIdRef.current = transactionMasterID;

      // Update state to pass to child component
      setInput((prev) => ({
        ...prev,
        transactionMasterID: transactionMasterID
      }));

      // Update UI directly without re-render
      requestAnimationFrame(() => {
        document.querySelectorAll('.grid-row-item.selected').forEach(el => {
          el.classList.remove('selected');
        });

        document.querySelectorAll('.grid-row-item').forEach(el => {
          const rowId = el.getAttribute('data-row-id');
          if (rowId === String(transactionMasterID)) {
            el.classList.add('selected');
          }
        });
      });
    },
    [input.isInvTrans]
  );

  const calculateOverdueDays = (transactionDate: string): number => {
    const today = new Date();
    const txnDate = new Date(transactionDate);
    const diffTime = today.getTime() - txnDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const columnstwo: DevGridColumn[] = useMemo(() => {
    const isPurchase = (input.isInvTrans && (input.transactionType?.toLowerCase() === "purchase"));
    const idField = input.isInvTrans ? "invTransactionMasterID" : "accTransactionMasterID";

    const CardCol: DevGridColumn = {
      dataField: idField,
      caption: t("Actions"),
      allowSearch: true,
      allowSorting: false,
      allowFiltering: false,
      fixed: false,
      width: undefined,
      cellRender: (cellElement: any) => {
        const d = cellElement.data as any;
        const rowId = parseInt(String(d[idField] ?? "0"), 10);
        const dateStr = new Date(d?.transactionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
        const voucher = d?.voucherPrefix ? `${d.voucherPrefix}-${d.voucherNumber}` : `${d?.voucherNumber}`;


        const overdueDays = calculateOverdueDays(d?.transactionDate);
        const isOverdue = overdueDays > 0;
        const isSelected = rowId === selectedRowIdRef.current;

        return (
          <Box
            className={`grid-row-item ${isSelected ? 'selected' : ''}`}
            data-row-id={rowId}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              py: 1.5,
              px: 2,
              borderBottom: "1px solid #e5e7eb",
              cursor: "pointer",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Title/Party Name */}
            <Tooltip title={isPurchase ? (d?.partyName || "") : (d?.particulars || "")} arrow placement="top-start">
              <Box
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                  width: "100%",
                }}
              >
                {isPurchase ? d?.partyName : d?.particulars}
              </Box>
            </Tooltip>

            {/* Invoice Number and Date */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
              <Tooltip title={voucher} arrow placement="top-start">
                <Box
                  sx={{
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    width: "25%",
                  }}
                >
                  {voucher}
                </Box>
              </Tooltip>
              <Box sx={{ fontSize: "13px", color: "#cbd5e1", flexShrink: 0 }}>•</Box>
              <Tooltip title={dateStr} arrow placement="top-start">
                <Box
                  sx={{
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    width: "30%",
                  }}
                >
                  {dateStr}
                </Box>
              </Tooltip>
              <Tooltip 
              title={Math.abs(
                Number(isPurchase ? d?.grandTotal ?? 0 : d?.amount ?? 0)
              ).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              arrow 
              placement="top-start"
            >
              <Box
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                  width: "45%",
                }}
              >
                {Math.abs(
                  Number(isPurchase ? d?.grandTotal ?? 0 : d?.amount ?? 0)
                ).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </Box>
            </Tooltip>
            </Box>

           

            {/* Amount */}
            {/* <Tooltip 
              title={Math.abs(
                Number(isPurchase ? d?.grandTotal ?? 0 : d?.amount ?? 0)
              ).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              arrow 
              placement="top-start"
            >
              <Box
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                  width: "100%",
                }}
              >
                {Math.abs(
                  Number(isPurchase ? d?.grandTotal ?? 0 : d?.amount ?? 0)
                ).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </Box>
            </Tooltip> */}

             {/* Overdue Status */}
            {isOverdue && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#dc2626",
                }}
              >
                <span>OVERDUE BY {overdueDays} DAYS</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.5396 13.6728 12.4604 13.6728 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
            )}
          </Box>
        );
      },
    };

    const hiddenForPurchase: DevGridColumn[] = [
      { dataField: "partyName", visible: false, allowFiltering: true, dataType: "string" },
      { dataField: "grandTotal", visible: false, allowFiltering: true, dataType: "number" },
      { dataField: "transactionDate", visible: false, allowFiltering: true, dataType: "date" },
      { dataField: "voucherPrefix", visible: false, allowFiltering: true, dataType: "string" },
      { dataField: "voucherNumber", visible: false, allowFiltering: true, dataType: "string" },
    ];

    const hiddenForCash: DevGridColumn[] = [
      { dataField: "particulars", visible: false, allowFiltering: true, dataType: "string" },
      { dataField: "amount", visible: false, allowFiltering: true, dataType: "number" },
      { dataField: "transactionDate", visible: false, allowFiltering: true, dataType: "date" },
      { dataField: "voucherPrefix", visible: false, allowFiltering: true, dataType: "string" },
      { dataField: "voucherNumber", visible: false, allowFiltering: true, dataType: "string" },
    ];

    return [CardCol, ...(isPurchase ? hiddenForPurchase : hiddenForCash)];
  }, [t, input.isInvTrans, input.transactionType]);

  const MemoizedGrid = useMemo(() => {
    return (
      <ERPDevGrid
        columns={columnstwo}
        keyExpr={input.isInvTrans ? "invTransactionMasterID" : "accTransactionMasterID"}
        height={"89vh"}
        dataUrl={`${input.isInvTrans ? urls.inv_transaction_base : urls.acc_transaction_base}${input.transactionType}/List/`}
        method={ActionType.GET}
        postData={{ searchQuery }}
        gridHeader={t("All invoices")}
        gridId="transaction-grid"
        remoteOperations={{
          paging: true,
          filtering: true,
          sorting: true,
        }}
        focusedRowEnabled
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
        // searchQuery={searchQuery}
        showOptions={false}
        t={t}
      />
    );
  }, [columnstwo, searchQuery, onRowClick, input.isInvTrans, input.transactionType, t]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Sidebar */}
        <Box
          width={349}
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
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            // marginLeft: { lg: "349px", xl: "349px" },
          }}
        >
          <AccTransactionFormContainerViewContent
            isInvTrans={input.isInvTrans}
            transactionMasterID={input.transactionMasterID}
            transactionType={input.transactionType}
          />
        </Box>
      </Box>
    </>
  );
};

export default AccTransactionFormContainerView;
