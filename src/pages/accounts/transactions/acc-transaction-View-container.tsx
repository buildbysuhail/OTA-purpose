import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useUnsavedChangesWarning } from "./use-unsaved-changes-warning";
import { useNavigate } from "react-router-dom";
import HistorySidebar from "../../inventory/transactions/purchase/historySidebar";
import Header from "../../inventory/transactions/purchase/components/header";
import TransactionDetailsDesigner from "../../InvoiceDesigner/Designer/TransactionDetailsDesigner";
import { Box, Button, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from "@mui/material";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import urls from "../../../redux/urls";
import { ActionType } from "../../../redux/types";
import { BadgePlusIcon, Boxes, CalendarDays, ChevronUp, CopyPlus, EllipsisVertical, Eraser, FileText, Group, Mail, Pencil, Printer, RefreshCw, Share2, Trash2 } from "lucide-react";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import StandardPreviewWrapper from "../../InvoiceDesigner/DesignPreview/StandardPreview";
import { PDFViewer } from "@react-pdf/renderer";
import { renderSelectedTemplate } from "./acc-renderSelected-template";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";

const invoices = [
  { id: 1, customer: "xcvcxc", number: "INV-000003", date: "20/01/2025", amount: 255, status: "DRAFT" },
  { id: 2, customer: "xcvcxc", number: "INV-000002", date: "20/01/2025", amount: 255, status: "DRAFT" },
  { id: 3, customer: "xcvcxc", number: "INV-000001", date: "09/12/2024", amount: 255, status: "PAID" },
];

const api = new APIClient();
const AccTransactionFormContainerView: React.FC<AccTransactionProps> = (props) => {
  
  const [searchParams] = useSearchParams();
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

  const onRowDblClick = useCallback(async (event: any) => {
    const _event = event.data != undefined ? event : event?.event
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
    const asf = {formType: _event.data.formType,
      voucherNo: _event.data.lastVNo,
      voucherPrefix: _event.data.lastPrefix?.toUpperCase()}
    await initializeVoucher(asd,asf); // Call initializeVoucher here
    setOpenVoucherSelector(false);
  }, [searchParams, props]);

  const selectedInvoice = invoices[0];
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    //  const { t } = useTranslation("transaction");
      // const formState = useAppSelector((state: RootState) => state.AccTransaction);
    
      const columns: DevGridColumn[] = useMemo(
        () => [
          {
            dataField: "actions",
            caption: t("Actions"),
            allowSearch: true,
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
      const phone = window.innerWidth <= 600;
      const currentBranch = useCurrentBranch();



  return (
    <>
     {/* <InvoiceView/> */}
         <Box display="flex" height="100vh">
           {/* Sidebar */}
           <Box width={300} bgcolor="#fafbfc" borderRight="1px solid #eee" p={2}>
             {/* <Typography variant="h6" gutterBottom>
               All Invoices
             </Typography>
             <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
               +
             </Button>
             <List>
               {invoices.map((inv) => (
                 <ListItem key={inv.id} selected={inv.id === selectedInvoice.id} button>
                   <ListItemText
                     primary={
                       <Box display="flex" justifyContent="space-between">
                         <span>{inv.customer}</span>
                         <span>₹{inv.amount.toFixed(2)}</span>
                       </Box>
                     }
                     secondary={
                       <Box display="flex" justifyContent="space-between">
                         <span>{inv.number} • {inv.date}</span>
                         <span style={{ color: inv.status === "PAID" ? "green" : "#aaa" }}>{inv.status}</span>
                       </Box>
                     }
                   />
                 </ListItem>
               ))}
             </List> */}
             {/* <HistorySidebar/> */}
                          {/* <Button variant="outlined" fullWidth onClick={() => setIsHistoryOpen(true)}>
               Show Transaction History
             </Button>
             <HistorySidebar
               isOpen={isHistoryOpen}
               onClose={() => setIsHistoryOpen(false)}
               transactionType={input.transactionType ?? ""}
             /> */}
             <div className="py-3 bg-gray-50 h-[94vh] ">
                     {/* Header */}
                     <div className="flex justify-between items-center mb-1 px-4">
                       <h6 className=" font-semibold text-[15px] text-gray-800">All invoices</h6>
                       {/* <button
                         onClick={onClose}
                         className="text-gray-500 hover:text-gray-700 transition-colors"
                       >
                         <X className="w-[22px] h-[22px] p-1 rounded-full text-[12px] hover:shadow-lg transition-all duration-300 ease-in-out" />
                       </button> */}
                     </div>
             
                     {/* Content */}
                     <div className="space-y-4">
                       {/* {isOpen && */}
                       <ERPDevGrid 
                         columns={columns}
                         dataUrl={`${urls.acc_transaction_base}${input.transactionType}/List/`}
                         method={ActionType.GET}
                         // postData={{voucherType: voucherType, transactionType: transactionType}}
                         gridHeader={t("transactions")}
                         gridId="transaction-grid"
                         remoteOperations={{ paging: true, filtering: true, sorting: true }}
                         gridAddButtonIcon="ri-add-line"
                         pageSize={40}
                         allowExport={true}
                         hideDefaultExportButton={true}
                         // showFilterRow ={false}
                         hideDefaultSearchPanel={false}
                         allowSearching={false}
                         hideGridAddButton={true}
                         hideGridHeader={true}
                         showColumnHeaders={false}
                         className="HistorySidebarcustom "
                         ShowGridPreferenceChooser={false}
                       />
             {/* } */}
                       {/* Transaction Date */}
                     </div>
                   </div>
           </Box>
           
     
           {/* Main Content */}
           <Box flex={1} p={3} bgcolor="#fff">
             <Box display="flex" alignItems="center" justifyContent="space-between">
               <Typography variant="h5">{selectedInvoice.number}</Typography>
               <Box>
                 {/* <Button variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                 <Button variant="outlined" sx={{ mr: 1 }}>Send</Button>
                 <Button variant="outlined" sx={{ mr: 1 }}>PDF/Print</Button>
                 <Button variant="outlined">Record Payment</Button> */}
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
                           <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
                             <button
                              //  disabled={formState.transaction.master.invTransactionMasterId < 1 || (formState.transaction.master.invTransactionMasterId > 0 && formState.formElements.pnlMasters.disabled !== true)}
                               className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
                              //  onClick={handleEdit}
                             >
                               <Mail  className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                             </button>
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
