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
import {
  accFormStateClearRowForNew,
  accFormStateHandleFieldChange,
  accFormStateRowHandleFieldChange,
  accFormStateTransactionMasterHandleFieldChange,
  accFormStateTransactionUpdate,
} from "./reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import { loadAccVoucher } from "./thunk";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { useTransaction } from "../../use-transaction";
import { AccTransactionMaster } from "./acc-transaction-types";
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
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
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
        VoucherNumber: formState.transaction?.master?.voucherNumber,
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
  const { validateTransactionDate } = useTransaction(transactionType);
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
      `formType=${formType ? formType : "null"}&voucherType= ${
        voucherType ? voucherType : "null"
      }&prefix=${prefix ? prefix : "null"}`
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
    setFormElements((prev) => ({
      ...prev,
      pnlMasters: {
        ...prev.pnlMasters,
        disabled: false,
      },
      dxGrid: {
        ...prev.dxGrid,
        disabled: false,
      },
    }));
  };
  const disableControls = () => {
    setFormElements((prev) => ({
      ...prev,
      pnlMasters: {
        ...prev.pnlMasters,
        disabled: true,
      },
      dxGrid: {
        ...prev.dxGrid,
        disabled: true,
      },
    }));
  };
  const disableCombo = () => {
    setFormElements((prev) => ({
      ...prev,
      employee: {
        ...prev.employee,
        disabled: true,
      },
      jvDrCr: {
        ...prev.jvDrCr,
        disabled: true,
      },
      masterAccount: {
        ...prev.masterAccount,
        disabled: true,
      },
      referenceDate: {
        ...prev.referenceDate,
        disabled: true,
      },
      transactionDate: {
        ...prev.transactionDate,
        disabled: true,
      },
      btnEdit: {
        ...prev.btnEdit,
        disabled: true,
      },
    }));
  };
  const validate = (): boolean => {
    // Check if demo version is expired
    if (clientSession.isDemoVersion) {
      const demoExpiryDate = new Date(clientSession.demoExpiryDate);
      const transactionDate = new Date(
        formState.transaction.master.transactionDate
      ); // Assuming `dtpTransDate` is a Date object
      const softwareDate = new Date(clientSession.softwareDate);

      const daysUntilExpiry = Math.floor(
        (demoExpiryDate.getTime() - transactionDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const daysSinceSoftwareDate = Math.floor(
        (transactionDate.getTime() - softwareDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0 || daysSinceSoftwareDate > 30) {
        setFormElements((prev) => ({
          ...prev,
          transactionDate: {
            ...prev.transactionDate,
            disabled: true,
          },
          btnSave: {
            ...prev.btnSave,
            disabled: true,
          },
          btnAdd: {
            ...prev.btnAdd,
            disabled: true,
          },
        }));
        ERPAlert.show({
          icon: "warning",
          title: "Demo expired. Please activate.",
        });
        return false;
      }
    }
    if (
      formState.isEdit &&
      formState.userConfig.mnuShowConfirmationForEditOnAccounts == true
    ) {
      ERPAlert.show({
        icon: "info",
        title: "Are you sure to modify this transaction.",
      });
      return false;
    }
    const validateTransDate = validateTransactionDate(
      new Date(formState.transaction.master.transactionDate)
    );
    if (validateTransDate == 0) {
      ERPAlert.show({
        icon: "warning",
        title:
          "Transaction Date validation failed(Check Financial Year period)",
      });
      return false;
    } else if (validateTransDate == 2) {
      return false;
    }

    // Validate transaction amount
    if (formState.total === null || formState.total == 0) {
      ERPAlert.show({
        icon: "warning",
        title: "Invalid Transaction Amount",
        text: "Zero transaction amount not allowed",
      });
      return false;
    }
    if (
      formState.transaction.master.voucherType == "JV" &&
      (formState.transaction.master.drCr == "" ||
        formState.transaction.master.drCr == null)
    ) {
      ERPAlert.show({
        icon: "warning",
        title: "Please Select Debit/Credit in Master Ledger",
      });
      return false;
    }
    // Validate master ledger existence
    if (
      formState.transaction.master.voucherType !== "OB" &&
      formState.transaction.master.voucherType !== "MJV"
    ) {
      const isExist =
        formState.transaction?.details?.find(
          (x) => x.ledgerId == formState.masterAccountID
        ) != undefined;
      ERPAlert.show({
        icon: "warning",
        title: "Duplicate Ledger",
        text: "Master Ledger Exists in Row",
      });
      return isExist ? false : true;
    }

    if (formState.transaction.master.voucherType == "MJV") {
      const totalDebit = formState.transaction.details
        .reduce((sum, x) => sum + (x.debit || 0), 0)
        .toFixed(applicationSettings.mainSettings.decimalPoints);
      const totalCredit = formState.transaction.details
        .reduce((sum, x) => sum + (x.credit || 0), 0)
        .toFixed(applicationSettings.mainSettings.decimalPoints);
      if (totalDebit !== totalCredit) {
        ERPAlert.show({
          icon: "warning",
          title: "Total Debit and Credit amount should be Same",
        });
        return false;
      }
    }

    return true;
  };
  const attachMaster = (): AccTransactionMaster | undefined => {
    try {
      const master = { ...formState.transaction.master };

      master.accTransMasterID = formState.isEdit ? master.accTransMasterID : 0;
      master.bankDate = new Date().toISOString();
      master.checkBouncedDate = new Date().toISOString();
      master.dueDate = master.transactionDate;
      const totalAmount = formState.total || 0;
      if (master.drCr === "Cr") {
        master.totalCredit = totalAmount;
        master.totalDebit = 0;
      } else if (master.drCr === "Dr") {
        master.totalDebit = totalAmount;
        master.totalCredit = 0;
      } else {
        master.totalDebit = master.totalCredit = totalAmount;
      }

      if (master.voucherType === "JV" || master.voucherType === "MJV") {
        master.totalDebit = master.totalCredit = totalAmount;
      }
      dispatch(accFormStateTransactionUpdate({ key: "master", value: master }));
      return master;
    } catch (error) {
      console.error("Error saving transaction:", error);
      return undefined;
    }
  };
  const setupBahamdoonPOSReceipts = () => {
    let master = { ...formState.transaction.master };
    let row = { ...formState.row };
    dispatch(
      accFormStateRowHandleFieldChange({
        fields: { ledgerCode: "2768", ledgerId: 3107 },
      })
    );

    master.commonNarration = `Counter: ${userSession.counterName}, User: ${userSession.userName}`;

    // Handle master account selection based on voucher type
    if (master.voucherType === "BR" || master.voucherType === "PBR") {
      const defaultAccID =
        applicationSettings.accountsSettings.defaultCreditCardAcc > 0
          ? applicationSettings.accountsSettings.defaultCreditCardAcc
          : applicationSettings.accountsSettings.defaultBankAcc;
    } else if (master.voucherType === "CR") {
      const cashLedgerID =
        userSession.counterwiseCashLedgerId > 0 &&
        applicationSettings.accountsSettings.allowSalesCounter
          ? userSession.counterwiseCashLedgerId
          : applicationSettings.accountsSettings.defaultCashAcc;
    }
    dispatch(
      accFormStateHandleFieldChange({ fields: { isBahamdoonPOSReceipt: true } })
    );
    dispatch(accFormStateTransactionUpdate({ key: "master", value: master }));
  };
  const save = async () => {
    if (validate() == true) {
      const params = {
        master: attachMaster(),
        details: [...formState.transaction.details],
      };
      await api.postAsync(
        `Urls.acc_transaction_base${transactionType}`,
        params
      );
    }
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
    validate,
    setupBahamdoonPOSReceipts,
    save,
  };
};
