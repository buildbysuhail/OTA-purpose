import { useEffect, useState } from "react";

// import { handleResponse } from '../HandleResponse';
import { customJsonParse } from "../../../utilities/jsonConverter";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { updateTransactionEditMode } from "./acc-transaction-functions";
import { useDispatch } from "react-redux";
import { accFormStateClearRowForNew } from "./reducer";
export interface AccUserConfig {
  keepNarrationForJV: boolean;
  clearDetailsAfterSaveAccounts: boolean;
  mnuShowConfirmationForEditOnAccounts: boolean;
}
const api = new APIClient();
export const useAccTransaction = (transactionType: string) => {
  const dispatch = useDispatch();
  const clearControlForNew = async () => {
    undoEditMode();
    dispatch(accFormStateClearRowForNew);
  };
  const loadAccTransMaster = async (usingManualInvNumber: boolean) => {
    clearControlForNew();
    try {
      const params = {
        VoucherNumber: formState.transaction?.master?.voucherNumber?.toString() || "",
        VoucherPrefix: formState.transaction?.master?.voucherPrefix || "",
        VoucherType: formState.transaction?.master?.voucherType || "",
        FormType: formState.transaction?.master?.formType || "",
        MannualInvoiceNumber: formState.transaction?.master?.referenceNumber || "",
        SearchUsingMannualInvNo: usingManualInvNumber?.toString() || "",
    };

      const response = await api.getAsync(
        `${Urls.acc_transaction_base}${transactionType}/GetVoucherAsync`,
        new URLSearchParams(params).toString()
      );
      return response
    } catch (error) {
      return null;
    }
  };
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  async function undoEditMode() {
    if (formState.isEdit) {
      try {
        const result = await updateTransactionEditMode(
          "A",
          formState.transaction.master.accTransMasterID,
          ""
        );
        console.log("Undo Edit Mode Result:", result);
        return result;
      } catch (error) {
        console.error("Failed to undo edit mode:", error);
        throw error;
      }
    }
  }
  const getNextVoucherNumber = async (
    formType: string,
    voucherType: string,
    prefix: string
  ) => {
    const response = await api.getAsync(
      Urls.get_last_voucher_no,
      `formType=${formType}&voucherType= ${voucherType}&prefix=${prefix}`
    );

    const nextVoucherNumber = response || 1;

    return nextVoucherNumber;
  };
  return {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransMaster,
    clearControlForNew,
    
  };
};
