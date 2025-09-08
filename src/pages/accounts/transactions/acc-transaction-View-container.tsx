import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Urls from "../../../redux/urls";
import { useSearchParams,useParams,useNavigate,useLocation } from "react-router-dom";
import { AccTransactionProps } from "./acc-transaction-types";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { APIClient } from "../../../helpers/api-client";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { isChooseVoucherEnabled, transactionRoutes } from "../../../components/common/content/transaction-routes";
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
  BadgePlusIcon,
  Boxes,
  CalendarDays,
  ChevronUp,
  CopyPlus,
  EllipsisVertical,
  Eraser,
  FileText,
  Group,
  Mail,
  MessageCircle,
  MessageSquare,
  Pencil,
  Printer,
  RefreshCw,
  Share2,
  Trash2,
} from "lucide-react";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import StandardPreviewWrapper from "../../InvoiceDesigner/DesignPreview/StandardPreview";
import { PDFViewer } from "@react-pdf/renderer";
import { renderSelectedTemplate } from "./acc-renderSelected-template";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import { useSearch } from "./search-context.tsx";
import { useAccPrint } from "./use-print";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import { useAccTransaction } from "./use-acc-transaction";
import { templateConfig } from "../../InvoiceDesigner/LandingFolder/designSection";
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar";
import { TransactionFormState } from "../../inventory/transactions/purchase/transaction-types";

const invoices = [
  {
    id: 1,
    customer: "xcvcxc",
    number: "INV-000003",
    date: "20/01/2025",
    amount: 255,
    status: "DRAFT",
  },
  {
    id: 2,
    customer: "xcvcxc",
    number: "INV-000002",
    date: "20/01/2025",
    amount: 255,
    status: "DRAFT",
  },
  {
    id: 3,
    customer: "xcvcxc",
    number: "INV-000001",
    date: "09/12/2024",
    amount: 255,
    status: "PAID",
  },
];

const api = new APIClient();

const AccTransactionFormContainerView: React.FC<AccTransactionProps> = (
  props
) => {
  // const [searchQuery, setSearchQuery] = useState<string>('');
  //   const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };
debugger;
const { printVoucher, getTemplate } = useAccPrint();
  const [searchParams] = useSearchParams();
  const { voucherNo: voucherNoParam } = useParams<{ voucherNo: string }>();
  const { searchQuery } = useSearch();
  const getParamOrProp = <T extends string | number>(
    key: keyof AccTransactionProps,
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
    if (String(a[k]) !== String(b[k])) return false; // string compare to normalize types
  }
  return true;
};

useEffect(() => {
  const newInput = {
    voucherType: getParamOrProp<string>("voucherType") || input.voucherType,
    transactionType: input.transactionType, // keep existing transactionType unless you REALLY need to change it
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
  // intentionally exclude `input` from deps to avoid infinite loop,
  // but include searchParams and voucherNoParam so effect runs when URL changes
}, [searchParams, voucherNoParam, props]); // if you need props in compare, include them too

  // Set max height based on window size

  const [template,setTemplate]= useState<any>(null)
  const { t } = useTranslation("transaction");
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const userSession = useAppSelector((state: RootState) => state.UserSession);

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
  // const goBack = () => {
  //   navigate(-1); // Goes back to the previous page
  // };




  const [selectedRow, setSelectedRow] = useState<any>(null);

  const onRowClick = useCallback(
   
    async (event: any) => {
       
      const _event = event.data != undefined ? event : event?.event;
      const clickedRow = _event.data;
        // Extract values
    const transactionMasterID = parseInt(clickedRow.accTransactionMasterID || "0", 10);
    const vchtype = clickedRow.voucherType;
    const voucherform = clickedRow.formType;
    const prefix = clickedRow.lastPrefix || clickedRow.voucherPrefix;
    const vchno = clickedRow.lastVNo || clickedRow.voucherNumber;
    const financialYearID = parseInt(clickedRow.financialYearID || "0", 10);

    //  Find transaction route details
    const tr = transactionRoutes.find((x) => x.voucherType === vchtype);

    //  Prepare full transaction data object (same as Component A)
    let transactionData: Record<string, string | number | undefined> = {};
    if (parseInt(vchno, 10) > 0) {
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

    //  Convert object to query string
    const queryString = new URLSearchParams(
      Object.entries(transactionData).reduce((acc, [key, value]) => {
        acc[key] = String(value ?? "");
        return acc;
      }, {} as Record<string, string>)
    ).toString();

const newUrl = `/accounts/transactions/CashPayment/${vchno}${queryString ? `?${queryString}` : ""}`;

  // IMPORTANT: Only navigate when URL actually changes
  const currentFullUrl = `${location.pathname}${location.search || ""}`;
  if (currentFullUrl !== newUrl) {
    navigate(newUrl, { replace: true });
  }
      setSelectedRow(clickedRow); // Set the selected row data

    },
    []
  );

  const selectedInvoice = invoices[0];
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  //  const { t } = useTranslation("transaction");
  // const formState = useAppSelector((state: RootState) => state.AccTransaction);

  // useEffect(() => {
  //       console.log("searchQuery acc v t" );
  //       console.log({ searchQuery });
  //   }, []);

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
          return (
            <div className="bg-white p-4 hover:bg-[#0f0f0f83] shadow-md transition-transform transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r hover:from-[#dfe7f9] hover:to-[#f1f7ff] hover:ring-2 hover:ring-blue-300">
              <div className="w-full flex flex-row">
                <div className="w-1/2  flex items-center ">
                  <CalendarDays className="mr-1 w-4 h-4 text-gray-500 font-semibold !text-[10px]" />
                  <p className="text-gray-600 font-medium !text-[12px]">
                    {/* <CalendarDays /> */}
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
                  {/* <p className="text-gray-800 font-medium">
                        {cellElement.data?.amount}
                      </p> */}
                  {/* <p className="text-gray-800 font-medium">
                        =and=
                      </p> */}
                  <p className="text-gray-800 font-medium">
                    {cellElement.data?.voucherNumber}
                  </p>
                </div>
              </div>
              {/* <div className="w-full flex flex-row">
                    <div className="  flex items-center justify-end ">
                      <p className="text-gray-800 font-medium !text-right" >
                        {cellElement.data?.amount}
                      </p>
                    </div>
                  </div> */}
              <div className="w-full flex justify-end">
                <div className="text-right">
                  <p className="text-gray-800 font-medium">
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
    [t] // Dependency for columns
  );

  const columnstwo: DevGridColumn[] = [
    {
      dataField: "accTransactionMasterID",
      caption: t("Actions"),
      allowSearch: true,
      allowSorting: false,
      allowFiltering: false, // Disable filtering on ID since it’s not relevant
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => {
        return (
          <div className="bg-white p-4 hover:bg-[#0f0f0f83] shadow-md transition-transform transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r hover:from-[#dfe7f9] hover:to-[#f1f7ff] hover:ring-2 hover:ring-blue-300">
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
                <p className="text-gray-800 font-medium">
                  {cellElement.data?.voucherNumber}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <div className="text-right">
                <p className="text-gray-800 font-medium">
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
      dataType: "date", // Ensures proper date filtering
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
      dataType: "number", // Ensures proper numeric filtering
    },
    {
      dataField: "particulars",
      visible: false,
      allowFiltering: true,
      dataType: "string",
    },
  ];
  const phone = window.innerWidth <= 600;
  const currentBranch = useCurrentBranch();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is outside the popup AND not on the button
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

  const {loadAccTransVoucher} = useAccTransaction(input.transactionType??"",
    undefined,
    undefined)
  useEffect(() => {
    const fetchTemplate = async () => {
      const result = await getTemplate(input?.voucherType, formState);
      setTemplate(result);
 
    };
    fetchTemplate();
  }, [input, formState]); 

    const groupKey =input?.voucherType || "";
    const typeKey = template?.templateType?.toUpperCase() ?? "STANDARD";
    const kindKey = template?.templateKind ;
    const templateToRender = useMemo(() => {
      return templateConfig?.[groupKey]?.[typeKey]?.[kindKey] ?? null;
    }, [groupKey, typeKey, kindKey]);

     
        const {
          maxHeight,
          stableTemplateProps,
          templateStyleProperties
        } = useTemplateDesigner({ templateGroup:groupKey, templateKind: kindKey, designerType:typeKey,template
          ,invTransMasterIDParam:input.transactionMasterID,transactionType:input.transactionType
         })

const MemoizedGrid = useMemo(() => {
  return (
    <ERPDevGrid
      columns={columnstwo} // already stable? If dynamic, memoize separately
      dataUrl={`${urls.acc_transaction_base}${input.transactionType}/List/`}
      method={ActionType.GET}
      postData={{ searchQuery }}
      gridHeader={t("transactions")}
      gridId="transaction-grid"
      remoteOperations={{
        paging: true,
        filtering: true,
        sorting: true,
      }}
      gridAddButtonIcon="ri-add-line"
      pageSize={40}
      scrollingMode="virtual"
      allowExport={true}
      allowSearching={true}
      hideDefaultExportButton={true}
      hideDefaultSearchPanel={false}
      hideGridAddButton={true}
      hideGridHeader={true}
      showColumnHeaders={false}
      className="HistorySidebarcustom"
      ShowGridPreferenceChooser={false}
      onRowClick={onRowClick}
    />
  );
}, []);


  return (
    <>
      {/* <InvoiceView/> */}
      <Box display="flex" height="100vh">
        {/* Sidebar */}
        <Box
          width={350}
          bgcolor="#fafbfc"
          borderRight="1px solid #eee"
          p={2}
          sx={{
            display: {
              xs: "none", // visible on extra-small
              sm: "none", // visible on small
              md: "none", // visible on medium
              lg: "block", // visible on large (<1280px)
              xl: "block", // hidden on extra-large (>=1280px)
            },
          }}
        >
          <div className="py-0 bg-gray-50 h-[94vh] ">
            {/* Header */}
            <div className="flex justify-between items-center mb-1 px-4">
              <h6 className=" font-semibold text-[15px] text-gray-800">
                All invoices
              </h6>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* {isOpen && */}
     {MemoizedGrid}
              {/* } */}
              {/* Transaction Date */}
            </div>
          </div>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={3} bgcolor="#fff">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              {input?.voucherNo}
            </Typography>
            <Box>
              <div
                className={`!overflow-visible flex items-center ${
                  phone ? "justify-evenly" : "justify-end"
                }  space-x-2 p-1 w-full overflow-x-auto ${
                  phone ? "bg-[#f9fafb]" : ""
                } ${phone ? "" : ""} ${phone ? "" : ""}`}
              >
                {/* Edit Button */}
                <div
                  className="group relative inline-flex flex-col items-center ps-[5px]"
                  title={t("edit")}
                >
                  <button
                    //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                    className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                      phone ? "p-0.5" : "p-3"
                    } rounded-md hover:bg-gray-200 transition-colors`}
                    //  onClick={handleEdit}
                  >
                    <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>
                {/* send Button */}

                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={() => setIsPopupVisible((prev: any) => !prev)}
                    className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                      phone ? "p-0.5" : "p-3"
                    }  rounded-md hover:bg-gray-200 transition-colors`}
                    title={t("previous_page")}
                  >
                    <Mail className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>

                  {isPopupVisible && (
                    <div
                      ref={popupRef}
                      className="absolute rounded-sm dark:bg-dark-bg dark:text-dark-text bg-gray-100 shadow-lg p-4 z-50"
                      style={{
                        top: "100%",
                        left: "-180px",
                        width: "251px",
                        marginTop: "8px",
                      }}
                    >
                      <nav className="w-full dark:bg-dark-bg dark:text-dark-text bg-gray-100 text-black">
                        <ul className="space-y-1">
                          {/* <p>test23</p> */}
                          <li>
                            <button
                              className="flex items-center w-full px-3 py-2 rounded-md   hover:bg-[#bfdbfe] transition text-gray-700"
                              style={{ gap: 8 }}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </button>
                          </li>
                          <li>
                            <button
                              className="flex items-center w-full px-3 py-2 rounded-md hover:bg-[#bfdbfe] transition text-gray-700"
                              style={{ gap: 8 }}
                            >
                              {/* You can use another icon here, e.g., MessageCircle */}
                              <MessageSquare className="w-4 h-4 mr-2" />
                              SMS
                            </button>
                          </li>
                          <li>
                            <button
                              className="flex items-center w-full px-3 py-2 rounded-md hover:bg-[#bfdbfe] transition text-gray-700"
                              style={{ gap: 8 }}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              whatsapp
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
                {/* share Button */}
                <div
                  className="group relative inline-flex flex-col items-center ps-[5px]"
                  title={t("edit")}
                >
                  <button
                    //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                    className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                      phone ? "p-0.5" : "p-3"
                    } rounded-md hover:bg-gray-200 transition-colors`}
                    //  onClick={handleEdit}
                  >
                    <Share2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>

                {/* pdf Button */}
                <div
                  className="group relative inline-flex flex-col items-center ps-[5px]"
                  title={t("edit")}
                >
                  <button
                    //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                    className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                      phone ? "p-0.5" : "p-3"
                    } rounded-md hover:bg-gray-200 transition-colors`}
                    //  onClick={handleEdit}
                  >
                    <FileText className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>
                {/* Print Button */}
                <div
                  className="group relative inline-flex flex-col items-center ps-[5px]"
                  title={t("print")}
                >
                  <button
                    //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                    className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                      phone ? "p-0.5" : "p-3"
                    } rounded-md hover:bg-gray-200 transition-colors`}
                    //  onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}
                  >
                    <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>
                {/* clone Button */}
                <div
                  className="group relative inline-flex flex-col items-center ps-[5px]"
                  title={t("print")}
                >
                  <button
                    //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                    className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                      phone ? "p-0.5" : "p-3"
                    } rounded-md hover:bg-gray-200 transition-colors`}
                    //  onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}
                  >
                    <CopyPlus className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>
                {/* Delete Button */}
                <div
                  className="group relative inline-flex flex-col items-center ps-[5px]"
                  title={t("delete")}
                >
                  <button
                    //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master?.invTransactionMasterId > 0 && formState.formElements?.pnlMasters?.disabled !== true)}
                    className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                      phone ? "p-0.5" : "p-3"
                    } rounded-md hover:bg-gray-200 transition-colors`}
                    //  onClick={deleteTransVoucher}
                  >
                    <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>
              </div>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>

                        <div className="flex justify-center p-6 "  >
                          <div className="relative">
                            {/* Preview Container with Modern Styling */}
                            <div
                              
                              className=" shadow-lg border border-gray-200 overflow-hidden"
                              style={{
                                      width: `${templateStyleProperties.previewWidth??500}pt`,
                                      height: `${templateStyleProperties.previewHeight??500}pt`,
                                      // paddingTop: `${templateStyleProperties.paddingTop ?? 0}pt`,
                                      // paddingRight: `${templateStyleProperties.paddingRight ?? 0}pt`,
                                      // paddingBottom: `${templateStyleProperties.paddingBottom ?? 0}pt`,
                                      // paddingLeft: `${templateStyleProperties.paddingLeft ?? 0}pt`,

                                    }}
                            >

            
                              {/* Template Content */}
                              <div className="relative "
                              style={{
                              width: "100%", 
                              height: "100%",

                              }}
                              >
                        {templateToRender?.PreviewComponent && template ? (
                          React.cloneElement(templateToRender.PreviewComponent, {
                            ...stableTemplateProps,
                            template,
                          })
                        ) : (
                          <div>Loading...</div>
                        )}


                              </div>
                            </div>
            
                            {/* Drop Shadow Effect */}
                            <div
                              className="absolute -bottom-2 -right-2 bg-gray-400/20 dark:bg-gray-600/20 rounded-lg -z-10"
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
