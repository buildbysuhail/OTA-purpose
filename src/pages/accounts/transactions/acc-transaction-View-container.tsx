import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import { useSearchParams,useParams,useNavigate,useLocation } from "react-router-dom";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { useUnsavedChangesWarning } from "../../use-unsaved-changes-warning";
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

const [selectedRowId, setSelectedRow] = useState(0);
  const onRowClick = useCallback(
    async (event: any) => {
      debugger;
      const _event = event.data != undefined ? event : event?.event;
      const clickedRow = _event.data;
      
      const transactionMasterID = parseInt( (input.isInvTrans ? clickedRow.invTransactionMasterID : clickedRow.accTransactionMasterID) || "0", 10);

      setInput((prev: any) => {
        return {
          ...prev,
          transactionMasterID: transactionMasterID
        }
      });
      // setSelectedRow(transactionMasterID);
    },
    [input]
  );


  const columnstwo: DevGridColumn[] = useMemo(() => [
    {
      dataField:input.isInvTrans ?  "invTransactionMasterID" :  "accTransactionMasterID",
      caption: t("Actions"),
      allowSearch: true,
      allowSorting: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => {
        const rowId = parseInt((input.isInvTrans ? cellElement.data?.invTransactionMasterID: cellElement.data?.accTransactionMasterID) || "0", 10);
        // const isSelected = rowId === selectedRowId && selectedRowId !== null && selectedRowId !== 0;
        const isSelected = false;
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
  
  const MemoizedGrid = useMemo(() => {
    return (
      <ERPDevGrid
        columns={columnstwo}
        keyExpr={input.isInvTrans ?  "invTransactionMasterID" :  "accTransactionMasterID"}
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
  }, [columnstwo, searchQuery]);

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
        <AccTransactionFormContainerViewContent isInvTrans={input.isInvTrans} transactionMasterID={input.transactionMasterID} transactionType={input.transactionType}>

        </AccTransactionFormContainerViewContent>
      </Box>
    </>
  );
};

export default AccTransactionFormContainerView;