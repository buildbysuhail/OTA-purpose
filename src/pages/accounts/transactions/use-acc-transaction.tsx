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
import { useUserRights } from "../../../helpers/user-right-helper";
export interface AccUserConfig {
  keepNarrationForJV: boolean;
  clearDetailsAfterSaveAccounts: boolean;
  mnuShowConfirmationForEditOnAccounts: boolean;
}

interface FormElementState {
  visible: boolean;
  disabled: boolean;
  label: string;
}

const api = new APIClient();
export const useAccTransaction = (transactionType: string) => {
  const dispatch = useDispatch();
  const clearControlForNew = async () => {
    undoEditMode();
    dispatch(accFormStateClearRowForNew);
  };

  
const initialFormElements = {
  foreignCurrency: {
    visible: true,
    disabled: false,
    label: "Foreign Currency",
  },
  voucherPrefix: { visible: true, disabled: false, label: "Prefix" },
  voucherNumber: { visible: true, disabled: false, label: "Voucher Number" },
  transactionDate: {
    visible: true,
    disabled: false,
    label: "Transaction Date",
  },
  referenceNumber: {
    visible: true,
    disabled: false,
    label: "Reference Number",
  },
  referenceDate: { visible: true, disabled: false, label: "Reference Date" },
  masterAccount: { visible: true, disabled: false, label: "Default Account" },
  jvDrCr: { visible: false, disabled: false, label: "Dr/Cr" },
  employee: { visible: true, disabled: false, label: "Employee" },
  remarks: { visible: true, disabled: false, label: "Remarks" },
  commonNarration: { visible: true, disabled: false, label: "Notes" },
  ledgerCode: { visible: true, disabled: false, label: "Ledger Code" },
  ledgerId: { visible: true, disabled: false, label: "Ledger" },
  amount: { visible: true, disabled: false, label: "Amount" },
  drCr: { visible: false, disabled: false, label: "Amount" },
  narration: { visible: true, disabled: false, label: "Narration" },
  currencyID: { visible: true, disabled: false, label: "Currency" },
  exchangeRate: { visible: true, disabled: false, label: "Exchange Rate" },
  hasDiscount: { visible: true, disabled: false, label: "Has Discount" },
  discount: { visible: true, disabled: false, label: "Discount" },
  chequeNumber: { visible: true, disabled: false, label: "Cheque Number" },
  bankDate: { visible: false, disabled: false, label: "Bank Date" },
  nameOnCheque: { visible: true, disabled: false, label: "Name on Cheque" },
  bankName: { visible: true, disabled: false, label: "Bank Name" },
  projectId: { visible: false, disabled: false, label: "Project" },
  costCentreId: { visible: false, disabled: false, label: "Cost Centre" },
  lblGroupName: { visible: true, disabled: false, label: "Group Name" },
  printOnSave: { visible: true, disabled: false, label: "Print on Save" },
  printPreview: { visible: true, disabled: false, label: "Print Preview" },
  printCheque: { visible: true, disabled: false, label: "Print Cheque" },
  keepNarration: { visible: false, disabled: false, label: "Keep Narration" },
  btnBillWise: { visible: true, disabled: false, label: "Bill Wise" },
  btnAdd: { visible: true, disabled: false, label: "Add" },
  btnEdit: { visible: true, disabled: false, label: "Edit" },
  btnPrint: { visible: true, disabled: false, label: "Edit" },
  btnRef: { visible: true, disabled: false, label: "..." },
  btnSave: { visible: true, disabled: false, label: "Save" },
  btnPrintCheque: { visible: true, disabled: false, label: "Print Cheque" },
  btnAttachment: { visible: true, disabled: false, label: "Attachments" },
};
type FormElementsState = {
  [key in keyof typeof initialFormElements]: FormElementState;
};

// const {hasRight} = useUserRights;
const [formElements, setFormElements] =
useState<FormElementsState>(initialFormElements);
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
  // const setUserRight = () => {
  //   setFormElements((prev: any) => {
      

  //   })
  //   hasRight
  // };
  return {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransMaster,
    clearControlForNew,
    formElements,
    setFormElements
    
  };
};
