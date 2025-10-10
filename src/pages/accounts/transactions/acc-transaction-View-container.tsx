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
} from "@mui/material";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import urls from "../../../redux/urls";
import { ActionType } from "../../../redux/types";
import {
  CalendarDays,
} from "lucide-react";
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
        transition: all 0.2s ease-in-out;
      }
      .grid-row-item:hover {
        background-color: #f5f5f5 !important;
      }
      .grid-row-item.selected {
        background-color: #e3f2fd !important;
        border-left-color: #2196f3 !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
      .grid-row-item.selected .text-blue {
        color: #1976d2 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const onRowClick = useCallback(
    (event: any) => {
      const _event = event.data != undefined ? event : event?.event;
      const clickedRow = _event.data;
      
      const transactionMasterID = parseInt(
        (input.isInvTrans ? clickedRow.invTransactionMasterID : clickedRow.accTransactionMasterID) || "0", 
        10
      );

      // Update state for content component
      setInput((prev) => ({
        ...prev,
        transactionMasterID: transactionMasterID
      }));

      // Pure DOM manipulation for selection styling
      requestAnimationFrame(() => {
        // Remove previous selection
        document.querySelectorAll('.grid-row-item.selected').forEach(el => {
          el.classList.remove('selected');
        });
        
        // Add selection to clicked row
        document.querySelectorAll('.grid-row-item').forEach(el => {
          const rowId = el.getAttribute('data-row-id');
          if (rowId === String(transactionMasterID)) {
            el.classList.add('selected');
          }
        });
      });

      // Update ref
      selectedRowIdRef.current = transactionMasterID;
    },
    [input.isInvTrans]
  );

  // Column definitions - static, won't cause re-render
  const columnstwo: DevGridColumn[] = useMemo(() => {
    return [
      {
        dataField: input.isInvTrans ? "invTransactionMasterID" : "accTransactionMasterID",
        caption: t("Actions"),
        allowSearch: true,
        allowSorting: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          const rowId = parseInt(
            (input.isInvTrans ? cellElement.data?.invTransactionMasterID : cellElement.data?.accTransactionMasterID) || "0", 
            10
          );
          
          // Initial render - check if this should be selected
          const isInitiallySelected = rowId === selectedRowIdRef.current && selectedRowIdRef.current !== 0;
          
          return (
            <div 
              data-row-id={rowId}
              className={`grid-row-item p-4 cursor-pointer bg-white border-l-4 border-transparent ${isInitiallySelected ? 'selected' : ''}`}
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
                  <p className="text-blue font-medium text-gray-800">
                    {cellElement.data?.voucherNumber}
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <div className="text-right">
                  <p className="text-blue font-medium text-gray-800">
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
    ];
  }, [t, input.isInvTrans]); // Minimal dependencies

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
      />
    );
  }, [columnstwo, searchQuery, onRowClick, input.isInvTrans, input.transactionType, t]);

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
        <AccTransactionFormContainerViewContent 
          isInvTrans={input.isInvTrans} 
          transactionMasterID={input.transactionMasterID} 
          transactionType={input.transactionType}
        />
      </Box>
    </>
  );
};

export default AccTransactionFormContainerView;