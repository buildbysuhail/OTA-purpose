import { useEffect, useRef, useState } from "react";

// import { handleResponse } from '../HandleResponse';
import { customJsonParse } from "../../../utilities/jsonConverter";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { updateTransactionEditMode } from "./acc-transaction-functions";
import { useDispatch } from "react-redux";
import { accFormStateClearRowForNew, accFormStateHandleFieldChange, accFormStateRowHandleFieldChange, accFormStateTransactionDetailsRowAdd, accFormStateTransactionMasterHandleFieldChange, accFormStateTransactionUpdate, clearState } from "./reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import { loadAccVoucher } from "./thunk";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { useTransaction } from "../../use-transaction";
import {  AccTransactionData,  AccTransactionMaster,} from "./acc-transaction-types";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../utilities/Utils";
export interface AccUserConfig {  keepNarrationForJV: boolean;  clearDetailsAfterSaveAccounts: boolean;  mnuShowConfirmationForEditOnAccounts: boolean;}

interface FormElementState {
  visible: boolean;
  disabled: boolean;
  label: string;
}

const api = new APIClient();
export const useAccTransaction = (
  transactionType: string,
  btnSaveRef: any,
  ledgerCodeRef: any,
  masterAccountRef: any,
  costCenterRef: any,
  amountRef: any
) => {
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
  // const clearControlForNew = async () => {

  // };
  const focusBtnSave = () => {
    if (btnSaveRef.current) {
      // btnSaveRef.current.style.backgroundColor = '#000'
      btnSaveRef.current.focus();
    }
  };
  const focusAmount = () => {
    if (amountRef.current) {
      amountRef.current.focus();
    }
  };
  const focusMasterAccount = () => {
    if (masterAccountRef.current) {
      masterAccountRef.current.focus();
    }
  };
  const focusCostCenterRef = () => {
    if (costCenterRef.current) {
      costCenterRef.current.focus();
    }
  };
  const focusLedgerCode = () => {
    if (ledgerCodeRef.current) {
      ledgerCodeRef.current.focus();
    }
  };
  const initialFormElements = {
    foreignCurrency: {
      visible: true,
      disabled: false,
      label: "Foreign Currency",
    },
    voucherPrefix: { visible: true, disabled: false, label: "Prefix" },
    voucherNumber: { visible: true, disabled: false, label: "Voucher Number" },
    btnDown: { visible: true, disabled: false, label: "" },
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
    lnkUnlockVoucher: { visible: false, disabled: false, label: "Unlock" },
  };
  type FormElementsState = {
    [key in keyof typeof initialFormElements]: FormElementState;
  };

  const { hasRight } = useUserRights();
  const [formElements, setFormElements] =
    useState<FormElementsState>(initialFormElements);
  const loadAccTransVoucher = async (usingManualInvNumber: boolean = false) => {
    // clearControlForNew();
    undoEditMode();
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
      setUserRight();
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
      `formType=${formType ? formType : "null"}&voucherType= ${voucherType ? voucherType : "null"
      }&prefix=${prefix ? prefix : "null"}`
    );
    debugger;
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
  const attachMaster = (): AccTransactionMaster => {
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
  };
  const PrintPaymentReceiptAdvice = (voucher: AccTransactionData) => { };
  const PrintVoucher = (voucher: AccTransactionData) => { };
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
      const params: AccTransactionData = {
        master: attachMaster(),
        details: [...formState.transaction.details],
        attachments: [...formState.transaction.attachments],
      };
      const saveRes = await api.postAsync(
        `Urls.acc_transaction_base${transactionType}`,
        params
      );
      if (saveRes.isOk == true) {
        if (formState.printOnSave == true) {
          if (
            userSession.dbIdValue.trim() == "BAHAMDOON" &&
            !formState.isBahamdoonPOSReceipt
          ) {
            PrintPaymentReceiptAdvice(params);
          } else {
            PrintVoucher(params);
          }
        }
        if (formState.userConfig.clearDetailsAfterSaveAccounts == true) {
          clearControls();
        } else {
          const isFinancialYearClosed =
            userSession.financialYearStatus === "Closed";

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
            btnSave: {
              ...prev.btnSave,
              disabled: true,
            },
            btnEdit: {
              ...prev.btnEdit,
              disabled:
                !isFinancialYearClosed &&
                  hasRight(formState.formCode, UserAction.Edit)
                  ? false
                  : true,
            },
            btnDelete: {
              ...prev.btnDelete,
              disabled: true,
            },
            btnPrint: {
              ...prev.btnPrint,
              disabled: true,
            },
          }));
        }
      } else {
        ERPAlert.show({
          icon: "warning",
          title: saveRes.message,
        });
      }
    }
  };
  const clearControls = async () => {
    await undoEditMode();
    dispatch(
      clearState({
        userSession,
        softwareDate,
        defaultCostCenterID:
          applicationSettings.accountsSettings.defaultCostCenterID,
        counterwiseCashLedgerId: 0,
        allowSalesCounter: 0,
      })
    );
    setFormElements((prev: any) => {
      const isFinancialYearClosed =
        userSession.financialYearStatus === "Closed";
      let updatedFormElements = {
        ...prev,
        amount: {
          ...prev.amount,
          disabled: false,
        },
        btnSave: {
          ...prev.btnSave,
          disabled: true,
        },
        btnEdit: {
          ...prev.btnEdit,
          disabled:
            !isFinancialYearClosed &&
              hasRight(formState.formCode, UserAction.Edit)
              ? false
              : true,
        },
        btnDelete: {
          ...prev.btnDelete,
          disabled: true,
        },
        btnPrint: {
          ...prev.btnPrint,
          disabled: true,
        },
        lnkUnlockVoucher: {
          ...prev.lnkUnlockVoucher,
          visible: false,
        },
        pnlMasters: {
          ...prev.pnlMasters,
          disabled: false,
        },
        masterAccount: {
          ...prev.masterAccount,
          disabled:
            userSession.counterwiseCashLedgerId > 0 &&
              applicationSettings.accountsSettings?.allowSalesCounter &&
              (formState.transaction.master.voucherType === "CP" ||
                formState.transaction.master.voucherType === "CR") &&
              userSession.counterAssignedCashLedgerId > 0
              ? true
              : prev.masterAccount.disabled,
        },
        costCentreId: {
          ...prev.costCentreId,
          disabled:
            formState.userConfig.presetCostenterId > 0
              ? formState.userConfig.presetCostenterId
              : userSession.dbIdValue == "SAMAPLASTICS"
                ? 0
                : prev.costCentreId,
        },
        employee: {
          ...prev.employee,
          disabled: false,
        },
        jvDrCr: {
          ...prev.jvDrCr,
          disabled: false,
        },
        referenceDate: {
          ...prev.referenceDate,
          disabled: false,
        },
        transactionDate: {
          ...prev.transactionDate,
          disabled: false,
        },
      };

      return updatedFormElements;
    });
    getNextVoucherNumber(
      formState.transaction.master.formType,
      formState.transaction.master.voucherType,
      formState.transaction.master.voucherPrefix
    );
    focusLedgerCode();
  };
  const addOrEditRow = async () => {
    if (applicationSettings.accountsSettings?.billwiseMandatory) {
      debugger;
      if (!isNullOrUndefinedOrZero(formState.row.ledgerId)) {
        if (!formState.isRowEdit) {
          if (formState.row.BillwiseDetails == "") {
            if (formState.IsBillwiseTransAdjustmentExists) {
        if (!formState.isRowEdit) {
          if (formState.row.BillwiseDetails == "") {
            if (formState.IsBillwiseTransAdjustmentExists) {
              dispatch(
                accFormStateHandleFieldChange({
                  fields: {
                    showbillwise: true,
                  },
                })
              );
              return false;
            }
          }
        } else {
          if (
            formElements.amount.disabled == false &&
            formState.IsBillwiseTransAdjustmentExists == true
          ) {
            dispatch(
              accFormStateHandleFieldChange({
                fields: {
                  showbillwise: true,
                },
              })
            );
            return false;
          }
        }
      } else {
        ERPAlert.show({
          icon: "warning",
          title: "Please select Ledger..!",
        });
      }
    }
  }
    if (isNullOrUndefinedOrZero(formState.row.ledgerId)) {
      ERPAlert.show({
        icon: "warning",
        title: "Please select Ledger..!",
      });
      return false;
    }
    if (
      isNullOrUndefinedOrZero(formState.row.amount) &&
      !isNullOrUndefinedOrZero(formState.transaction.master.totalAmount)
    ) {
      if (hasRight(formState.formCode, UserAction.Add)) {
        setFormElements((prev) => ({
          ...prev,
          btnSave: {
            ...prev.btnSave,
            disabled: false,
          },
        }));
      }
      ERPAlert.show({
        title: "Are you sure save now?",
        icon: "warning",
        confirmButtonText: "Yes, Save now!",
        cancelButtonText: "Cancel",
        onConfirm: (result: any) => {
          if (result.isConfirmed) {
            save();
            return false;
          }
        },
      });
      focusLedgerCode();
      return false;
    }
    if (isNullOrUndefinedOrZero(formState.row.amount)) {
      ERPAlert.show({
        icon:"info",
        title: "Please Enter the Amount..!"
      })
      focusAmount();
      return false;
    }
    if (isNullOrUndefinedOrZero(formState.masterAccountID)) {
      ERPAlert.show({
        icon:"info",
        title: "Please select master account..!"
      })
      focusMasterAccount();
      return false;
    }
    if (isNullOrUndefinedOrZero(formState.row.costCentreId) && formElements.costCentreId.visible == true) {
      ERPAlert.show({
        icon:"info",
        title: "Please select a cost center..!"
      })
      focusCostCenterRef();
      return false;
    }


    // dispatch(
    //   accFormStateHandleFieldChange({
    //     fields: { showSaveDialog: true },
    //   })
    // )
 
       } };
      }

  return {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransVoucher,
    formElements,
    setFormElements,
    setUserRight,
    enableControls,
    disableControls,
    validate,
    setupBahamdoonPOSReceipts,
    save,
    clearControls,
    addOrEditRow,
  };
};
