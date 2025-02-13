import { useEffect, useState } from "react";
import { APIClient } from "../../../helpers/api-client";
import { useUserRights } from "../../../helpers/user-right-helper";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/Utils";
import { printCheque_AccTransaction } from "./acc-print-trans-service";
import { AccTransactionData, AccTransactionFormState } from "./acc-transaction-types";
import { logUserAction } from "../../../redux/slices/user-action/thunk";
import { useDispatch } from "react-redux";
import { accFormStateHandleFieldChange, acctemplatesData } from "./reducer";
import { pdf, BlobProvider } from "@react-pdf/renderer";
import { renderSelectedTemplate } from "./acc-renderSelected-template";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import { customJsonParse } from "../../../utilities/jsonConverter";
import Urls from "../../../redux/urls";
const api = new APIClient();
export const useAccPrint = () => {
  const currentBranch = useCurrentBranch();
  const dispatch = useDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
const {hasRight} = useUserRights();


const handleDirectPrint = async (template:any) => {
  try {
    // Generate the PDF for the selected template
    const pdfDocument = renderSelectedTemplate({
      template: template,
      data: formState.transaction,
      currentBranch: currentBranch,
      userSession: userSession,
    });

    // Create a PDF blob
    const blob = await pdf(pdfDocument).toBlob();

    // Create a URL for the blob
    const pdfUrl = URL.createObjectURL(blob);

    // Open the PDF in a new tab for printing
    const printWindow = window.open(pdfUrl);
    if (!printWindow) {
      console.error("Failed to open print window. Please check your browser settings.");
      alert("Failed to open print window. Please allow popups and try again.");
      return;
    }

    // Wait for the PDF to load in the new tab
    printWindow.onload = () => {
      printWindow.print(); // Trigger print
    };

    // Log user action
    logUserAction({
      action: `User Printed Voucher ${formState.transaction.master.voucherType}:${formState.transaction.master.formType}:${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
      module: "Voucher Print",
      voucherType: formState.transaction.master.voucherType,
      voucherNumber: `${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
    });
  } catch (error) {
    console.error("Error printing voucher:", error);
  //  ERPAlert.show({
  //         title: "Warning",
  //         text: "An error occurred while printing. Please try again.",
  //         icon: "warning",
  //       });
  }
};

  const fetchDefaultTemplates = async (voucherType:any) => {
      try {
          const res = await api.getAsync(
            `${Urls.default_template}?template_group=${voucherType}`
          );
          const cc: TemplateState = customJsonParse(res.content);
          const _template = {
            ...cc,
            id: res.id,
            background_image: res?.payload?.data?.background_image as string | undefined,
            background_image_header: res?.payload?.data?.background_image_header as string | undefined,
            background_image_footer: res?.payload?.data?.background_image_footer as string | undefined,
            signature_image: res?.payload?.data?.signature_image as string | undefined,
            branchId: res.branchId,
            content: res.content,
            isCurrent: res.isCurrent,
            templateGroup: res.templateGroup,
            templateKind: res.templateKind,
            templateName: res.templateName,
            templateType: res.templateType,
            thumbImage: res.thumbImage as string | undefined,
          };
         
          dispatch(acctemplatesData(_template));
          // const template = formState.templatesData?.find(item=>item.templateGroup===voucherType) 
          if(voucherType !== "AP"){
            dispatch(accFormStateHandleFieldChange({fields:{template:_template}}));
          } 
          return _template;
     
        
     
      } catch (error) {
        console.error("Error fetching Default templates:", error);
      }
    };

  const printVoucher = async (setIsPrintModalOpen?:any,voucherType?:any,voucher?: AccTransactionFormState) => {
   voucher = voucher == undefined ? formState : voucher
     // Check if template is null, undefined, or an empty object
  // if (!formState?.template || Object.keys(formState.template).length === 0) {
  //   ERPAlert.show({
  //     title: "Warning",
  //     text: "Please Select Your Template!!!",
  //     icon: "warning",
  //   });
  //   return; 
  // }
  
   const existingTemplate = formState.templatesData?.find(
    (template: any) => template.templateGroup === voucherType
  );
  let template = formState.template;
 
    if(formState.template== undefined || formState.template ==null)
    {
      if(existingTemplate){
        dispatch(accFormStateHandleFieldChange({fields:{template:existingTemplate}}));
        template = existingTemplate
      } else{
        template = await fetchDefaultTemplates(voucherType)
      }
    }
 
 
  // If template is valid, proceed with printing
  if (formState.printPreview) {
    setIsPrintModalOpen(true);
  } else {
    await handleDirectPrint(template);
  }
  };

   const printPaymentReceiptAdvice = async(voucher?: AccTransactionFormState,voucherType?:any) => {
    voucher = voucher == undefined ? formState : voucher
    const existingTemplate = voucher.templatesData?.find(
      (template: any) => template.templateGroup === voucherType
    );

    let template;
      if(existingTemplate){
        template = existingTemplate
      } else{
        template = await fetchDefaultTemplates(voucherType)
      }
    await handleDirectPrint(template);
   };
    const printCheque = async (voucher?: AccTransactionFormState) => {
      try {
        voucher = voucher == undefined ? formState : voucher
        for (const detail of formState.transaction.details) {
          if (isNullOrUndefinedOrEmpty(detail.ledgerID)) break;
  
          const nameOnCheque = detail.nameOnCheque || detail.ledgerName;
          
          // Call your print service
          await printCheque_AccTransaction();
  
          // Log user action
          await logUserAction({
            action: `User Printed Cheque ${formState.transaction.master.voucherType}:${formState.transaction.master.formType}:${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
            module: "Cheque Print",
            voucherType: formState.transaction.master.voucherType,
            voucherNumber: `${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`
          });
        }
      } catch (error) {
        console.error('Error printing cheque:', error);
        // Handle error appropriately
      }
    };
  return {
    printVoucher,
    printCheque,
    printPaymentReceiptAdvice
  };
};
