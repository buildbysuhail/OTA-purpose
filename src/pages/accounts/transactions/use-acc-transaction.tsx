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
  accFormStateTransactionDetailsRowAdd,
  accFormStateTransactionDetailsRowRemove,
  accFormStateTransactionMasterHandleFieldChange,
  accFormStateTransactionUpdate,
  clearState,
  setUserRight,
  updateFormElement,
} from "./reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import { loadAccVoucher } from "./thunk";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { useTransaction } from "../../use-transaction";
import {
  AccTransactionData,
  AccTransactionFormState,
  AccTransactionMaster,
} from "./acc-transaction-types";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../utilities/Utils";
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
export const useAccTransaction = (
  transactionType: string,
  btnSaveRef: any,
  ledgerCodeRef?: any,
  ledgerIdRef?: any,
  masterAccountRef?: any,
  costCenterRef?: any,
  amountRef?: any
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
  const focusLedgerCombo = () => {
    if (ledgerIdRef.current) {
      // ledgerIdRef.current.focus();
    }
  };

  const { hasRight } = useUserRights();
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
      dispatch(setUserRight({userSession: userSession, hasRight: hasRight}));
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
        dispatch(updateFormElement({
          fields: {
            transactionDate: { disabled: true }, 
            btnSave: { disabled: true },
            btnAdd: { disabled: true }, 
          }
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
  const PrintPaymentReceiptAdvice = (voucher: AccTransactionData) => {};
  const PrintVoucher = (voucher: AccTransactionData) => {};
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
        applicationSettings.accountsSettings?.defaultCreditCardAcc > 0
          ? applicationSettings.accountsSettings?.defaultCreditCardAcc
          : applicationSettings.accountsSettings?.defaultBankAcc;

      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            masterAccountID: defaultAccID,
            isBahamdoonPOSReceipt: true,
          },
        })
      );
    } else if (master.voucherType === "CR" || master.voucherType === "CP") {
      const cashLedgerID =
        userSession.counterwiseCashLedgerId > 0 &&
        applicationSettings.accountsSettings?.allowSalesCounter
          ? userSession.counterwiseCashLedgerId
          : applicationSettings.accountsSettings?.defaultCashAcc;

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

    dispatch(updateFormElement({
      fields: {
        voucherPrefix: { disabled: true },
        voucherNumber: { disabled: true },
        btnDown: { disabled: true },
        transactionDate: { disabled: true },
        ledgerCode: { disabled: true },
        remarks: { disabled: true },
        commonNarration: { disabled: true },
        ledgerId: { disabled: true },
        btnBillWise: { disabled: true },
        referenceDate: { disabled: true },
        masterAccount: { disabled: true },
        employee: { disabled: true },
        projectId: { disabled: true },
        discount: { disabled: true },
        chequeNumber: { disabled: true },
        bankDate: { disabled: true },
        btnEdit: { visible: false },
      }
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
            formState.isBahamdoonPOSReceipt != true
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
          const fieldsToUpdate: Record<string, any> = {
            pnlMasters: { disabled: false },
            dxGrid: { disabled: false },
            btnSave: { disabled: true },
            btnEdit: {
              disabled:
                !isFinancialYearClosed && hasRight(formState.formCode, UserAction.Edit)
                  ? false
                  : true,
            },
            btnDelete: { disabled: true },
            btnPrint: { disabled: true },
          };
        
          // Dispatch the update action with all the required fields
          dispatch(updateFormElement({ fields: fieldsToUpdate }));
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
          applicationSettings.accountsSettings?.defaultCostCenterID,
        counterwiseCashLedgerId: 0,
        allowSalesCounter: 0,
      })
    );
    dispatch(updateFormElement({
      fields: {
        amount: { disabled: false },
        btnSave: { disabled: true },
        btnEdit: { disabled: !(userSession.financialYearStatus === "Closed" || hasRight(formState.formCode, UserAction.Edit)) },
        btnDelete: { disabled: true },
        btnPrint: { disabled: true },
        lnkUnlockVoucher: { visible: false },
        pnlMasters: { disabled: false },
        masterAccount: {
          disabled:
            userSession.counterwiseCashLedgerId > 0 &&
            applicationSettings.accountsSettings?.allowSalesCounter &&
            (formState.transaction.master.voucherType === "CP" ||
              formState.transaction.master.voucherType === "CR") &&
            userSession.counterAssignedCashLedgerId > 0
              ? true
              : undefined, // Keep existing value if condition is not met
        },
        costCentreId: {
          disabled:
            formState.userConfig.presetCostenterId > 0
              ? true
              : formState.formElements.costCentreId.disabled
        },
        employee: { disabled: false },
        jvDrCr: { disabled: false },
        referenceDate: { disabled: false },
        transactionDate: { disabled: false },
      }
    }));
    getNextVoucherNumber(
      formState.transaction.master.formType,
      formState.transaction.master.voucherType,
      formState.transaction.master.voucherPrefix
    );
    focusLedgerCode();
  };
  const handleRemoveItem = async (index: number) => {
    dispatch(
      accFormStateTransactionDetailsRowRemove({
        index: index,
        applicationSettings: applicationSettings
      })

    );
    
  }
  const addOrEditRow = async () => {
    debugger;
    if (applicationSettings.accountsSettings?.billwiseMandatory) {
      
      if (!isNullOrUndefinedOrZero(formState.row.ledgerId)) {
        if (formState.isRowEdit != true) {
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
        }
        else {
                if (
                  formState.formElements.amount.disabled == false &&
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
        
        if (isNullOrUndefinedOrZero(formState.row.ledgerId)) {
          ERPAlert.show({
            icon: "warning",
            title: "Please select Ledger..!",
          });
          return false;
        }
          const fdd = isNullOrUndefinedOrZero(formState.row.amount);
          const fdsdd = isNullOrUndefinedOrZero(formState.transaction.master.totalAmount);
        if (
          isNullOrUndefinedOrZero(formState.row.amount) &&
          !isNullOrUndefinedOrZero(formState.transaction.master.totalAmount)
        ) {
          if (hasRight(formState.formCode, UserAction.Add)) {
            dispatch(updateFormElement({
              fields: {
                btnSave: {
                  disabled: false,
                  label: "Add",
                },
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
            icon: "info",
            title: "Please Enter the Amount..!",
          });
          focusAmount();
          return false;
        }
        if (isNullOrUndefinedOrZero(formState.masterAccountID)) {
          ERPAlert.show({
            icon: "info",
            title: "Please select master account..!",
          });
          focusMasterAccount();
          return false;
        }
        if (
          isNullOrUndefinedOrZero(formState.row.costCentreId) &&
          formState.formElements.costCentreId.visible == true
        ) {
          ERPAlert.show({
            icon: "info",
            title: "Please select a cost center..!",
          });
          focusCostCenterRef();
          return false;
        }
        formState.formElements.btnAdd

        dispatch(
          accFormStateTransactionDetailsRowAdd({
            row: formState.row,
            applicationSettings: applicationSettings,
            exchangeRate: formState.row.exchangeRate ?? 1,
            isForeignCurrencyEnabled: formState.foreignCurrency,
            userSession: userSession,
          })
        );
        const updatedFields: Record<string, any> = {
          employee: { disabled: true },
          jvDrCr: { disabled: true },
          masterAccount: { disabled: true },
          referenceNumber: { disabled: true },
          referenceDate: { disabled: true },
          transactionDate: { disabled: true },
          btnEdit: { visible: true },
          amount: { disabled: false },
        };
      
        // Conditionally update costCentreId if needed
        if (formState.userConfig.presetCostenterId > 0) {
          updatedFields.costCentreId = { disabled: true };
        }
      
        // Dispatch the updateFormElement action
        dispatch(updateFormElement({
          fields: updatedFields,
        }));
        focusLedgerCombo();
      }
    }
  };

  return {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransVoucher,
    validate,
    setupBahamdoonPOSReceipts,
    save,
    clearControls,
    addOrEditRow,
    handleRemoveItem
  };
};
