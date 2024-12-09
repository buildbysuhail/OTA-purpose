import { useEffect, useRef, useState } from "react";

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
  clearState,
  setUserRightInReducer,
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

const api = new APIClient();
export const useAccTransaction = (transactionType: string) => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const softwareDate = useAppSelector(
    (state: RootState) => state.AppState.softwareDate
  );
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  const ledgerCodeRef = useRef<HTMLInputElement>(null);
  const clearControlForNew = async () => {
    undoEditMode();
    dispatch(accFormStateClearRowForNew);
  };
  const focusLedgerCode = () => {
    if (ledgerCodeRef.current) {
      ledgerCodeRef.current.focus();
    }
  };
  

  const { hasRight } = useUserRights();
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
    return setUserRightInReducer({})
  };
  const enableControls = () => {
    dispatch(((prev) => ({
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
  const changeComboVisibility = (visibility: boolean) => {
    setFormElements((prev) => ({
      ...prev,
      employee: {
        ...prev.employee,
        disabled: visibility,
      },
      jvDrCr: {
        ...prev.jvDrCr,
        disabled: visibility,
      },
      masterAccount: {
        ...prev.masterAccount,
        disabled: visibility,
      },
      referenceDate: {
        ...prev.referenceDate,
        disabled: visibility,
      },
      transactionDate: {
        ...prev.transactionDate,
        disabled: visibility,
      },
      btnEdit: {
        ...prev.btnEdit,
        disabled: visibility,
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

      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            masterAccountID: defaultAccID,
            isBahamdoonPOSReceipt: true,
          },
        })
      );
    } else if (master.voucherType === "CR") {
      const cashLedgerID =
        userSession.counterwiseCashLedgerId > 0 &&
        applicationSettings.accountsSettings.allowSalesCounter
          ? userSession.counterwiseCashLedgerId
          : applicationSettings.accountsSettings.defaultCashAcc;

      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            masterAccountID: cashLedgerID,
            isBahamdoonPOSReceipt: true,
          },
        })
      );
    }
    dispatch(accFormStateTransactionUpdate({ key: "master", value: master }));

    setFormElements((prev) => ({
      ...prev,
      voucherPrefix: { ...prev.voucherPrefix, disabled: true },
      voucherNumber: { ...prev.voucherNumber, disabled: true },
      btnDown: { ...prev.btnDown, disabled: true },
      transactionDate: { ...prev.transactionDate, disabled: true },
      ledgerCode: { ...prev.ledgerCode, disabled: true },
      remarks: { ...prev.remarks, disabled: true },
      commonNarration: { ...prev.commonNarration, disabled: true },
      ledgerId: { ...prev.ledgerId, disabled: true },
      btnBillWise: { ...prev.btnBillWise, disabled: true },
      referenceDate: { ...prev.referenceDate, disabled: true },
      masterAccount: { ...prev.masterAccount, disabled: true },
      employee: { ...prev.employee, disabled: true },
      projectId: { ...prev.projectId, disabled: true },
      discount: { ...prev.discount, disabled: true },
      chequeNumber: { ...prev.chequeNumber, disabled: true },
      bankDate: { ...prev.bankDate, disabled: true },
      btnEdit: { ...prev.btnEdit, visible: false },
    }));
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
  const clearControls = async () => {
    dispatch(clearState({
      userSession, softwareDate, defaultCostCenterID: applicationSettings.accountsSettings.defaultCostCenterID,
      counterwiseCashLedgerId: 0,
      allowSalesCounter: 0
    }));
    getNextVoucherNumber(
      formState.transaction.master.formType,
      formState.transaction.master.voucherType,
      formState.transaction.master.voucherPrefix
    );
    enableControls();
    focusLedgerCode();

    changeComboVisibility(true);
    if (
      userSession.counterwiseCashLedgerId > 0 &&
      applicationSettings.accountsSettings.allowSalesCounter
    ) {
      if (
        formState.transaction.master.voucherType == "CP" ||
        formState.transaction.master.voucherType == "CR"
      ) {
        stat.SelectedValue =
          PolosysFrameWork.General.COUNTERWISECASHLEDGERID;

        if (PolosysFrameWork.General.COUNTERASSIGNEDCASHLEDGERID > 0) {
          cbMasterAccount.Enabled = false;
        }
      }
    }
    //else
    //{
    //    cbMasterAccount.SelectedValue = Settings.AccountsSettings.DefaultCashLedgerID;
    //}
    //   if (PolosysFrameWork.General.DBID_VALUE.Trim() == "543140180640" || PolosysFrameWork.General.DBID_VALUE.Trim() == "BAHAMDOON")
    {
      if (PolosysFrameWork.General.EMPLOYEEID > 0)
        cbEmployee.SelectedValue =
          PolosysFrameWork.General.EMPLOYEEID.ToString();
    }
    if (PolosysFrameWork.General.PRESET_COSTCENTER_ID > 0) {
      cbCostCentre.SelectedValue =
        PolosysFrameWork.General.PRESET_COSTCENTER_ID;
      cbCostCentre.Enabled = false;
    } else {
      if (PolosysFrameWork.General.DBID_VALUE == "SAMAPLASTICS") {
        cbCostCentre.SelectedIndex = -1;
        cbCostCentre.SelectedValue = 0;
      }
    }
  };

  return {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransVoucher,
    clearControlForNew,
    setUserRight,
    enableControls,
    disableControls,
    changeComboVisibility,
    validate,
    setupBahamdoonPOSReceipts,
    save,
    clearControls,
    ledgerCodeRef,
  };
};

