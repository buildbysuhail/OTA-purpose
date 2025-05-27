import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Urls from "../../../redux/urls";
import { useSearchParams } from "react-router-dom";
import { AccTransactionProps } from "./acc-transaction-types";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { APIClient } from "../../../helpers/api-client";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { isChooseVoucherEnabled } from "../../../components/common/content/transaction-routes";
import AccTransactionForm from "./acc-transaction";
import VoucherSelector from "../../transaction-base/voucher-selector";
import { useUnsavedChangesWarning } from "../../use-unsaved-changes-warning";
import { useNavigate } from "react-router-dom";
import HistorySidebar from "../../inventory/transactions/purchase/historySidebar";
import Header from "../../inventory/transactions/purchase/components/header";
import TransactionDetailsDesigner from "../../InvoiceDesigner/Designer/TransactionDetailsDesigner";
import { Box, Button, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from "@mui/material";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import urls from "../../../redux/urls";
import { ActionType } from "../../../redux/types";
import { BadgePlusIcon, Boxes, CalendarDays, ChevronUp, CopyPlus, EllipsisVertical, Eraser, FileText, Group, Mail, MessageCircle, MessageSquare, Pencil, Printer, RefreshCw, Share2, Trash2 } from "lucide-react";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import StandardPreviewWrapper from "../../InvoiceDesigner/DesignPreview/StandardPreview";
import { PDFViewer } from "@react-pdf/renderer";
import { renderSelectedTemplate } from "./acc-renderSelected-template";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import { useSearch } from "./search-context.tsx";

const invoices = [
  { id: 1, customer: "xcvcxc", number: "INV-000003", date: "20/01/2025", amount: 255, status: "DRAFT" },
  { id: 2, customer: "xcvcxc", number: "INV-000002", date: "20/01/2025", amount: 255, status: "DRAFT" },
  { id: 3, customer: "xcvcxc", number: "INV-000001", date: "09/12/2024", amount: 255, status: "PAID" },
];

const api = new APIClient();
const AccTransactionFormContainerView: React.FC<AccTransactionProps> = (props) => {
  // const [searchQuery, setSearchQuery] = useState<string>('');
  //   const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };
  
  const [searchParams] = useSearchParams();
   const { searchQuery } = useSearch();
    const getParamOrProp = <T extends string | number >(
      key: keyof AccTransactionProps,
      isNumber: boolean = false
    ): T | undefined => {
      const paramValue = searchParams.get(key as string);
      if (paramValue != undefined && paramValue !== null) {
        return isNumber ? (Number(paramValue) as T) : (paramValue as T);
      }
      return undefined ;
    };
  
    // State initialization
    const [input, setInput] = useState({
      voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
      transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
      formCode: getParamOrProp<string>("formCode") || props.formCode,
      voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
      formType: getParamOrProp<string>("formType") || props.formType,
      title: getParamOrProp<string>("title") || props.title,
      drCr: getParamOrProp<string>("drCr") || props.drCr,
      voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
      transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
      financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
    });
  
    // Sync state when query parameters or props change
    useEffect(() => {
      
      setInput({
        voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
        transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
        formCode: getParamOrProp<string>("formCode") || props.formCode,
        voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
        formType: getParamOrProp<string>("formType") || props.formType,
        title: getParamOrProp<string>("title") || props.title,
        drCr: getParamOrProp<string>("drCr") || props.drCr,
        voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
        transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
        financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
      });
    }, [searchParams, props]); // Runs when query params or props change

  const { t } = useTranslation("transaction");
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const [openVoucherSelector, setOpenVoucherSelector] = useState<boolean>(false);
  const [store, setStore] = useState<{ data: any; totalCount: number }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{
    voucherPrefix: string;
    formType: string;
    voucherNo: number;
  }>({ voucherPrefix: "", formType: input.formType ?? "", voucherNo: 1 });
  const [readyToShowVoucher, setReadyToShowVoucher] = useState<{ready: boolean, input: any, data: any}>({ready: false, input: null, data: null});
  const  {hasUnsavedChanges, setIsModalOpen} = useUnsavedChangesWarning();
  const dispatch = useDispatch();
  const [prevState, setPrevState] = useState({
    voucherType: undefined as string | undefined,
    transactionType: undefined as string | undefined,
    formCode: undefined as string | undefined,
    voucherPrefix: undefined as string | undefined,
    formType: undefined as string | undefined,
    title: undefined as string | undefined,
    drCr: undefined as string | undefined,
    voucherNo: undefined as number | undefined,
    transactionMasterID: undefined as number | undefined,
    financialYearID: undefined as number | undefined,
  });

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
  const initializeVoucher = async (_input: any, _data: any) => {
    try {
      setReadyToShowVoucher({ready: true, input: _input, data: _data});
    } catch (error) {
      console.error("Error initializing voucher:", error);
    }
  };

  useEffect(() => {
    
    const _input = {
      voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
      transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
      formCode: getParamOrProp<string>("formCode") || props.formCode,
      voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
      formType: getParamOrProp<string>("formType") || props.formType,
      title: getParamOrProp<string>("title") || props.title,
      drCr: getParamOrProp<string>("drCr") || props.drCr,
      voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
      transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
      financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
    }
    let isDirty =false;
    Object.keys(_input).forEach((key) => {
      if (_input[key as keyof typeof _input] !== prevState[key as keyof typeof prevState]) {
        console.log(`Value changed for ${key}:`, prevState[key as keyof typeof prevState], "→", _input[key as keyof typeof _input]);
        isDirty =true;
      }
    });
    if(isDirty) {
    
    if (isChooseVoucherEnabled(_input.title ?? "", userSession) && (_input.voucherNo ==  undefined ||  _input.voucherNo <= 0)) {
      const fetchData = async () => {
        try {
          const res = await api.getAsync(
            `${Urls.voucher_selector}${_input.voucherType}`
          );

          
          if (
            res == undefined ||
            res == null ||
            (res != undefined && res != null && res.length <= 1)
          ) {
            if (res?.length == 1) {
              setData((prev: any) => ({
                ...prev,
                formType: res[0].formType,
                voucherNo: res[0].lastVNo,
                voucherPrefix: res[0].lastPrefix?.toUpperCase(),
              }));

              await initializeVoucher(
                _input,
                {
                  formType: res[0].formType,
                  voucherNo: res[0].lastVNo,
                  voucherPrefix: res[0].lastPrefix?.toUpperCase()
                }
              ); // Call initializeVoucher here
            }
            else {
              setReadyToShowVoucher({ready:true,input: _input, data: {
                formType: _input.formType,
              voucherNo: 0,
              voucherPrefix: _input.voucherPrefix
              }});
            }
          } else {
            setStore(res);
            setOpenVoucherSelector(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      
      initializeVoucher(
        _input, {
          formType: _input.formType,
        voucherNo: 0,
        voucherPrefix: _input.voucherPrefix
        })
    }
    setPrevState(_input);
  }
  }, [searchParams, props]);

const [selectedRow, setSelectedRow] = useState<any>(null);

  const onRowDblClick = useCallback(async (event: any) => {
    const _event = event.data != undefined ? event : event?.event;
    setSelectedRow(_event.data); // Set the selected row data
    setData((prev: any) => ({
      ...prev,
      formType: _event.data.formType,
      voucherNo: _event.data.lastVNo,
      voucherPrefix: _event.data.lastPrefix?.toUpperCase(),
    }));
    const asd = {
      voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
      transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
      formCode: getParamOrProp<string>("formCode") || props.formCode,
      voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
      formType: getParamOrProp<string>("formType") || props.formType,
      title: getParamOrProp<string>("title") || props.title,
      drCr: getParamOrProp<string>("drCr") || props.drCr,
      voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
      transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
      financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
    };
    const asf = {
      formType: _event.data.formType,
      voucherNo: _event.data.lastVNo,
      voucherPrefix: _event.data.lastPrefix?.toUpperCase()
    };
    await initializeVoucher(asd, asf);
    setOpenVoucherSelector(false);
  }, [searchParams, props]);

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
                      {new Date(cellElement.data?.transactionDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="w-1/2 flex items-center justify-end">
                    <p className="text-gray-800 font-medium">{cellElement.data?.voucherNumber}</p>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">{cellElement.data?.amount}</p>
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

        
          
          // console.log("searchQuery acc v t" );
          // console.log({ searchQuery });
          

  return (
    <>
     {/* <InvoiceView/> */}
         <Box display="flex" height="100vh">
           {/* Sidebar */}
           <Box width={350} bgcolor="#fafbfc" borderRight="1px solid #eee" p={2} 
             sx={{
              display: {
                xs: "none",    // visible on extra-small
                sm: "none",    // visible on small
                md: "none",    // visible on medium
                lg: "block",    // visible on large (<1280px)
                xl: "block",     // hidden on extra-large (>=1280px)
              },
            }}
           >
             <div className="py-0 bg-gray-50 h-[94vh] ">
                     {/* Header */}
                     <div className="flex justify-between items-center mb-1 px-4">
                       <h6 className=" font-semibold text-[15px] text-gray-800">All invoices</h6>
                     </div>
             
                     {/* Content */}
                     <div className="space-y-4">
                       {/* {isOpen && */}
                       <ERPDevGrid 
                        //  columns={columns}
                         columns={columnstwo}
                         dataUrl={`${urls.acc_transaction_base}${input.transactionType}/List/`}
                         method={ActionType.GET}
                         postData={{ searchQuery }}
                         // postData={{voucherType: voucherType, transactionType: transactionType}}
                         gridHeader={t("transactions")}
                         gridId="transaction-grid"
                         remoteOperations={{ paging: true, filtering: true, sorting: true }}
                         gridAddButtonIcon="ri-add-line"
                         pageSize={40}
                        // onSearch={handleSearch}
                        // postData={{ searchQuery }}
                         allowExport={true}
                         allowSearching={true}
                         hideDefaultExportButton={true}
                         // showFilterRow ={false}
                         hideDefaultSearchPanel={false}
                        //  allowSearching={false}
                         hideGridAddButton={true}
                         hideGridHeader={true}
                         showColumnHeaders={false}
                         className="HistorySidebarcustom "
                         ShowGridPreferenceChooser={false}
                         onRowDblClick={onRowDblClick} // Add this line
                       />
             {/* } */}
                       {/* Transaction Date */}
                     </div>
                   </div>
           </Box>
           
     
           {/* Main Content */}
           <Box flex={1} p={3} bgcolor="#fff">
             <Box display="flex" alignItems="center" justifyContent="space-between">
               <Typography variant="h5">
  {selectedRow?.voucherNumber ?? selectedInvoice.number}
</Typography>
               <Box>
                 <div className={`!overflow-visible flex items-center ${phone ? 'justify-evenly' : 'justify-end'}  space-x-2 p-1 w-full overflow-x-auto ${phone ? 'bg-[#f9fafb]' : ''} ${phone ? '' : ''} ${phone ? '' : ''}`}>
                         
                 
                         {/* Edit Button */}
                           <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
                             <button
                              //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                               className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
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
                                       className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'}  rounded-md hover:bg-gray-200 transition-colors`}
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
                                                     <MessageSquare  className="w-4 h-4 mr-2" />
                                                    SMS
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    className="flex items-center w-full px-3 py-2 rounded-md hover:bg-[#bfdbfe] transition text-gray-700"
                                                    style={{ gap: 8 }}
                                                  >
                                                    <MessageCircle  className="w-4 h-4 mr-2" />  
                                                  whatsapp
                                                  </button>
                                                </li>
                                           </ul>
                                         </nav>
                                       </div>
                                     )}
                                     
                                   </div>
                         {/* share Button */}
                           <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
                             <button
                              //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                               className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
                              //  onClick={handleEdit}
                             >
                               <Share2   className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                             </button>
                           </div>

                         {/* pdf Button */}
                           <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
                             <button
                              //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                               className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
                              //  onClick={handleEdit}
                             >
                               <FileText    className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                             </button>
                           </div>
                            {/* Print Button */}
                         <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("print")}>
                           <button
                            //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                             className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
                            //  onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}
                           >
                             <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                           </button>
                         </div>
                          {/* clone Button */}
                         <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("print")}>
                           <button
                            //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                             className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
                            //  onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}
                           >
                             <CopyPlus  className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                           </button>
                         </div>
                         {/* Delete Button */}
                         <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("delete")}>
                           <button
                            //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master?.invTransactionMasterId > 0 && formState.formElements?.pnlMasters?.disabled !== true)}
                             className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
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
               <Grid container spacing={2}>
                 <Grid item xs={12} md={8}>
                   <Typography variant="subtitle2" gutterBottom>
                     Bill To
                   </Typography>
                   <Typography variant="body1">{selectedInvoice.customer}</Typography>
                   <Typography variant="body2">Kerala, India</Typography>
                   <Typography variant="body2">satvan.work@gmail.com</Typography>
                   <Divider sx={{ my: 2 }} />
                   <Typography variant="body2">
                     <strong>Invoice Date:</strong> {selectedInvoice.date}
                   </Typography>
                   <Typography variant="body2">
                     <strong>Terms:</strong> Due On Receipt
                   </Typography>
                   <Typography variant="body2">
                     <strong>Due Date:</strong> {selectedInvoice.date}
                   </Typography>
                 </Grid>
                 <Grid item xs={12} md={4}>
                   <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                     TAX INVOICE
                   </Typography>
                 </Grid>
               </Grid>
               <Divider sx={{ my: 2 }} />
               <Box>
                 <Typography variant="subtitle2">Item & Description</Typography>
                 <Box display="flex" justifyContent="space-between" mt={1}>
                   <span>Apple</span>
                   <span>Qty: 1</span>
                   <span>Rate: 255.00</span>
                   <span>Amount: 255.00</span>
                 </Box>
               </Box>
               <Divider sx={{ my: 2 }} />
               <Box display="flex" justifyContent="flex-end">
                 <Box>
                   <Typography>Sub Total: ₹255.00</Typography>
                   <Typography>Total: <strong>₹255.00</strong></Typography>
                   <Typography>Balance Due: <strong>₹255.00</strong></Typography>
                 </Box>
               </Box>
               <Divider sx={{ my: 2 }} />
               <Typography variant="body2" sx={{ mt: 2 }}>
                 <strong>Total In Words:</strong> Indian Rupees Two Hundred Fifty-Five Only
               </Typography>
               <Typography variant="body2" sx={{ mt: 1 }}>
                 <strong>Notes:</strong> Thanks for your business.
               </Typography>
             </Paper>
             {/* <StandardPreviewWrapper data={{}} /> */}
             {/* <PDFViewer
                           className="pdf-viewer"
                           width="100%"
                           height={700}
                           style={{ padding: "10px" }}
                         >
                           {renderSelectedTemplate({
                             template: formState.template,
                             data: formState.transaction,
                             currentBranch: currentBranch,
                             userSession: userSession,
                           })}
                         </PDFViewer> */}
           </Box>
         </Box>
    </>
  );
};

export default AccTransactionFormContainerView;
