import { useEffect, useState } from "react";

// import { handleResponse } from '../HandleResponse';
import { customJsonParse } from "../../../utilities/jsonConverter";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { updateTransactionEditMode } from "./acc-transaction-functions";
import { useDispatch } from "react-redux";
import { accFormStateClearRowForNew } from "./reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import { loadAccVoucher } from "./thunk";
import ERPToast from "../../../components/ERPComponents/erp-toast";
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
  const appDispatch = useAppDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const clientSession = useAppSelector((state: RootState) => state.ClientSession);
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
    pnlMasters: { visible: true, disabled: false, label: "" },
    dxGrid: { visible: true, disabled: false, label: "" },
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
    btnDelete: { visible: true, disabled: false, label: "Delete" },
    btnPrint: { visible: true, disabled: false, label: "Print" },
    btnRef: { visible: true, disabled: false, label: "..." },
    btnSave: { visible: true, disabled: false, label: "Save" },
    btnPrintCheque: { visible: true, disabled: false, label: "Print Cheque" },
    btnAttachment: { visible: true, disabled: false, label: "Attachments" },
  };
  type FormElementsState = {
    [key in keyof typeof initialFormElements]: FormElementState;
  };

  const { hasRight } = useUserRights();
  const [formElements, setFormElements] =
    useState<FormElementsState>(initialFormElements);
  const loadAccTransVoucher = async (usingManualInvNumber: boolean = false) => {
    clearControlForNew();
    try {
      const params = {
        VoucherNumber:
          formState.transaction?.master?.voucherNumber,
        VoucherPrefix: formState.transaction?.master?.voucherPrefix || "",
        VoucherType: formState.transaction?.master?.voucherType || "",
        FormType: formState.transaction?.master?.formType || "",
        MannualInvoiceNumber:
          formState.transaction?.master?.referenceNumber || "",
        SearchUsingMannualInvNo: usingManualInvNumber?.toString() || "",
      };
      await appDispatch(
        loadAccVoucher({ params: params, transactionType: transactionType })
      );
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
      `formType=${formType? formType : "null"}&voucherType= ${(voucherType? voucherType : "null")}&prefix=${prefix? prefix : "null"}`
    );

    const nextVoucherNumber = response || 1;

    return nextVoucherNumber;
  };
  const setUserRight = () => {
    setFormElements((prev: any) => ({
      ...prev,
      btnSave: {
        ...prev.btnSave,
        visible:
          userSession.financialYearStatus == "Closed"
            ? false
            : hasRight(formState.formCode, UserAction.Add) &&
              formState?.transaction?.details?.length > 0,
      },
      btnEdit: {
        ...prev.btnEdit,
        visible:
          userSession.financialYearStatus == "Closed"
            ? false
            : hasRight(formState.formCode, UserAction.Edit),
      },
      btnDelete: {
        ...prev.btnDelete,
        visible:
          userSession.financialYearStatus == "Closed"
            ? false
            : hasRight(formState.formCode, UserAction.Delete),
      },
      btnPrint: {
        ...prev.btnPrint,
        visible:
          userSession.financialYearStatus == "Closed"
            ? false
            : hasRight(formState.formCode, UserAction.Print),
      },
    }));
    hasRight;
  };
  const enableControls = () => {
    setFormElements((prev) =>({
      ...prev,
      pnlMasters: {
        ...prev.pnlMasters,
        disabled: false
      },
      dxGrid: {
        ...prev.dxGrid,
        disabled: false
      },

    }))
  };
  const disableControls = () => {
    setFormElements((prev) =>({
      ...prev,
      pnlMasters: {
        ...prev.pnlMasters,
        disabled: true
      },
      dxGrid: {
        ...prev.dxGrid,
        disabled: true
      },

    }))
  };
  const disableCombo = () => {
    setFormElements((prev) =>({
      ...prev,
      employee: {
        ...prev.employee,
        disabled: true
      },
      jvDrCr: {
        ...prev.jvDrCr,
        disabled: true
      },
      masterAccount: {
        ...prev.masterAccount,
        disabled: true
      },
      referenceDate: {
        ...prev.referenceDate,
        disabled: true
      },
      transactionDate: {
        ...prev.transactionDate,
        disabled: true
      },
      btnEdit: {
        ...prev.btnEdit,
        disabled: true
      },

    }))
  };
  const validate = (): boolean => {
    // Check if demo version is expired
    if (clientSession.isDemoVersion) {
        const demoExpiryDate = new Date(clientSession.demoExpiryDate);
        const transactionDate = new Date(formState.transaction.master.transactionDate); // Assuming `dtpTransDate` is a Date object
        const softwareDate = new Date(clientSession.softwareDate);

        const daysUntilExpiry = Math.floor((demoExpiryDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysSinceSoftwareDate = Math.floor((transactionDate.getTime() - softwareDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0 || daysSinceSoftwareDate > 30) {
          setFormElements((prev) =>({
            ...prev,
            transactionDate: {
              ...prev.transactionDate,
              disabled: true
            },
            btnSave: {
              ...prev.btnSave,
              disabled: true
            },
            btnAdd: {
              ...prev.btnAdd,
              disabled: true
            },
      
          }));
          ERPToast.showWith("Demo expired. Please activate.", "warning");
            return false;
        }
    }

    // Handle "MJV" voucher type logic
    

    // // Confirmation for editing
    // if (isEdit && mnuShowConfirmationForEdit.checked) {
    //     const confirmation = PolosysFrameWork.General.ShowMessageBox("Are you sure to modify this transaction?", "Edit", "YesNo");
    //     if (confirmation === "No") {
    //         return false;
    //     }
    // }

    // // Validate transaction date
    // const transactionValidation = PolosysFrameWork.General.ValiddateTransactionDate(dtpTransDate);
    // if (transactionValidation === 0) {
    //     PolosysFrameWork.General.ShowMessageBox("Transaction Date validation failed (Check Financial Year period)", "Invalid Transaction Date");
    //     return false;
    // } else if (transactionValidation === 2) {
    //     return false;
    // }

    // // Check if day is closed
    // const closedDate = new PolosysERPInventoryClass.Transaction.InvAccTransactions().GetClosedDate("Accounts");
    // if (new Date(closedDate) >= new Date(dtpTransDate)) {
    //     PolosysFrameWork.General.ShowMessageBox("Day Closed", "Invalid Transaction Date");
    //     return false;
    // }

    // // Check for editing restriction
    // if (isEdit && new Date(closedDate) >= new Date(PrevTransDate)) {
    //     PolosysFrameWork.General.ShowMessageBox("Cannot be edited. Day is Closed", "Invalid Transaction Date");
    //     return false;
    // }

    // // Validate transaction amount
    // const totalAmount = PolosysFrameWork.General.Val(txtTotAmount.text);
    // if (totalAmount === 0) {
    //     PolosysFrameWork.General.ShowMessageBox("Zero transaction amount not allowed", "Invalid Transaction Amount");
    //     return false;
    // }

    // // Validate master ledger existence
    // if (VOUCHERTYPE !== "OB" && VOUCHERTYPE !== "MJV") {
    //     for (let i = 0; i < dgvAccounts.rows.length; i++) {
    //         const ledgerID = dgvAccounts.rows[i]?.cells["LedgerIDCol"].formattedValue;
    //         if (cbMasterAccount.selectedValue === ledgerID) {
    //             PolosysFrameWork.General.ShowMessageBox(`Master Ledger Exists in Row ${i + 1}`, "Duplicate Ledger");
    //             return false;
    //         }
    //     }
    // }

    // // "JV" specific validation
    // if (VOUCHERTYPE === "JV" && !cbJVDebitCredit.text) {
    //     PolosysFrameWork.General.ShowMessageBox("Please Select Debit/Credit in Master Ledger", "Debit/Credit");
    //     return false;
    // }

    // // "MJV" specific validation
    // if (VOUCHERTYPE === "MJV") {
    //     const totalDebit = Math.round(dgvAccounts.calculateColumnSum("Debit"), PolosysFrameWork.Settings.MainSettings.decimalPoints);
    //     const totalCredit = Math.round(dgvAccounts.calculateColumnSum("Credit"), PolosysFrameWork.Settings.MainSettings.decimalPoints);

    //     if (totalDebit !== totalCredit) {
    //         PolosysFrameWork.General.ShowMessageBox("Total Debit and Credit amount should be the same", "Debit/Credit");
    //         return false;
    //     }
    // }
console.log(formState.transaction.master.transactionDate);

    return true;
};

  return {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransVoucher,
    clearControlForNew,
    formElements,
    setFormElements,
    setUserRight,
    enableControls,
    disableControls,
    disableCombo,
    validate
  };
};
