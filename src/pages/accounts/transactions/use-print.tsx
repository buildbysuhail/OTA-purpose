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

const api = new APIClient();
export const useAccPrint = () => {
   const dispatch = useDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
const {hasRight} = useUserRights();
  
  const printVoucher = async (setIsPrintModalOpen?:any,voucher?: AccTransactionFormState) => {
   voucher = voucher == undefined ? formState : voucher

   if (formState.printPreview) {
    // If printPreview is true, open the modal for preview
    setIsPrintModalOpen(true); 
  } else {

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
