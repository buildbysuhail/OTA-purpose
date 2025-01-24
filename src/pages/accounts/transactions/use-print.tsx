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
import { accFormStateHandleFieldChange } from "./reducer";
import { pdf, BlobProvider } from "@react-pdf/renderer";
import { renderSelectedTemplate } from "./acc-renderSelected-template";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
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


const handleDirectPrint = async () => {
  try {
    // Generate the PDF for the selected template
    const pdfDocument = renderSelectedTemplate({
      template: formState.template,
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
   ERPAlert.show({
          title: "Warning",
          text: "An error occurred while printing. Please try again.",
          icon: "warning",
        });
  }
};


  const printVoucher = async (setIsPrintModalOpen?:any,voucher?: AccTransactionFormState) => {
   voucher = voucher == undefined ? formState : voucher
  // Check if template is null, undefined, or an empty object
  if (!formState?.template || Object.keys(formState.template).length === 0) {
    ERPAlert.show({
      title: "Warning",
      text: "Please Select Your Template!!!",
      icon: "warning",
    });
    return; // Exit the function early if no template is selected
  }

  // If template is valid, proceed with printing
  if (formState.printPreview) {
    setIsPrintModalOpen(true);
  } else {
    await handleDirectPrint();
  }
 
  };
   const printPaymentReceiptAdvice = (voucher?: AccTransactionFormState) => {
    voucher = voucher == undefined ? formState : voucher

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
