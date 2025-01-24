import { useCallback, useEffect, useRef, useState } from "react";

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
  loadTempRows,
  clearState,
  setUserRight,
  updateFormElement,
  accFormStateClearBillWiseInDetails,
  accFormStateClearDetails,
} from "./reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import {
  loadAccVoucher,
  deleteAccVoucher,
  unlockAccTransactionMaster,
} from "./thunk";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { useTransaction } from "../../use-transaction";
import {
  AccTransactionData,
  AccTransactionFormState,
  AccTransactionMaster,
  AccTransactionRow,
  PrintTransProps,
} from "./acc-transaction-types";
import {
  isEnterKey,
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../utilities/Utils";
import { handleResponse } from "../../../utilities/HandleResponse";
import { ApplicationSettingsType } from "../../settings/system/application-settings-types/application-settings-types";
import { validateTransactionDate } from "./functions";
import { printCheque_AccTransaction } from "./acc-print-trans-service";
import { useAccPrint } from "./use-print";
import moment from "moment";
export interface AccUserConfig {
  keepNarrationForJV: boolean;
  clearDetailsAfterSaveAccounts: boolean;
  mnuShowConfirmationForEditOnAccounts: boolean;
  maximizeBillwiseScreenInitially: boolean;
  alignment: "left" | "center" | "right";
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
  btnAddRef: any,
  ledgerCodeRef?: any,
  ledgerIdRef?: any,
  masterAccountRef?: any,
  costCenterRef?: any,
  amountRef?: any,
  drCrRef?: any,
  narrationRef?: any,
  voucherNumberRef?: any,
  chequeNumberRef?: any,
  remarksRef?: any
) => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const softwareDate = useAppSelector(
    (state: RootState) => state.ClientSession.softwareDate
  );
  const { printVoucher, printCheque, printPaymentReceiptAdvice } =
    useAccPrint();
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
      btnSaveRef.current.focus();
    }
  };
  const focusBtnAdd = () => {
    if (btnAddRef.current) {
      btnAddRef.current.focus();
    }
  };
  const focusAmount = () => {
    if (amountRef.current) {
      amountRef.current.select();
      amountRef.current.focus();
    }
  };
  const focusMasterAccount = () => {
    if (masterAccountRef.current) {
      masterAccountRef.current.select();
      masterAccountRef.current.focus();
    }
  };
  const focusCostCenterRef = () => {
    if (costCenterRef.current) {
      setTimeout(() => {
        costCenterRef.current.select();
        costCenterRef.current.focus();
      }, 0);
    }
  };
  const focusLedgerCode = () => {
    if (ledgerCodeRef.current) {
      setTimeout(() => {
        ledgerCodeRef.current.select();
        ledgerCodeRef.current.focus();
      }, 0);
    }
  };
  const focusLedgerCombo = () => {
    if (ledgerIdRef.current) {
      ledgerIdRef.current.select();
      ledgerIdRef.current.focus();
    }
  };
  const focusNarration = () => {
    if (narrationRef.current) {
      narrationRef.current.select();
      narrationRef.current.focus();
    }
  };
  const focusDrCr = () => {
    if (drCrRef.current) {
      drCrRef.current.select();
      drCrRef.current.focus();
    }
  };
  const focusVoucherNumber = () => {
    if (voucherNumberRef.current) {
      voucherNumberRef.current.select();
      voucherNumberRef.current.focus();
    }
  };
  const focusChequeNumber = () => {
    if (chequeNumberRef.current) {
      chequeNumberRef.current.select();
      chequeNumberRef.current.focus();
    }
  };
  const focusRemarks = () => {
    if (remarksRef.current) {
      remarksRef.current.select();
      remarksRef.current.focus();
    }
  };

  const { hasRight, hasBlockedRight } = useUserRights();
  const loadAccTransVoucher = async (
    usingManualInvNumber: boolean = false,
    voucherNumber?: number,
    voucherPrefix?: string,
    voucherType?: string,
    formType?: string,
    manualInvoiceNumber?: number,
    accTransactionMasterID?: number
  ) => {
    const tmpVoucherNumber =
      voucherNumber != undefined
        ? voucherNumber
        : Number(formState.transaction.master.voucherNumber);
    if (tmpVoucherNumber <= 0) {
      return false;
    }
debugger;
    // clearControlForNew();
    await undoEditMode(
      formState.isEdit,
      accTransactionMasterID ??
        formState.transaction.master.accTransactionMasterID
    );
    dispatch(
      accFormStateTransactionMasterHandleFieldChange({
        fields: {
          remarks: "",
          commonNarration: "",
          employeeID:
            userSession.dbIdValue == "543140180640" &&
            userSession.employeeId > 0
              ? userSession.employeeId
              : formState.transaction.master.employeeID,
        },
      })
    );
    dispatch(accFormStateClearDetails());
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          masterAccountID: 0,
        },
      })
    );
    dispatch(
      accFormStateRowHandleFieldChange({
        fields: {
          narration: "",
          amount: 0,
          discount: 0,
        },
      })
    );
    dispatch(
      updateFormElement({
        fields: {
          btnAdd: { text: "Add" },
          amount: { disabled: false },
        },
      })
    );

    try {
      const params = {
        VoucherNumber: tmpVoucherNumber,
        voucherPrefix:
          voucherPrefix ?? (formState.transaction?.master?.voucherPrefix || ""),
        voucherType:
          voucherType ?? (formState.transaction?.master?.voucherType || ""),
        formType: formType ?? (formState.transaction?.master?.formType || ""),
        MannualInvoiceNumber:
          manualInvoiceNumber ??
          (formState.transaction?.master?.referenceNumber || ""),
        SearchUsingMannualInvNo: usingManualInvNumber?.toString() || "",
      };
      await appDispatch(
        loadAccVoucher({ params: params, transactionType: transactionType })
      );
      dispatch(setUserRight({ userSession: userSession, hasRight: hasRight }));
    } catch (error) {
      return null;
    }
  };

  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  async function undoEditMode(
    isEdit: boolean,
    transactionMasterId: number
  ): Promise<any> {
    if (isEdit) {
      try {
        const result = await updateTransactionEditMode(
          "A", // Action type
          transactionMasterId,
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
    voucherPrefix: string,
    isVoucherPrefix: boolean
  ) => {
    const response = await api.getAsync(
      Urls.get_last_voucher_no,
      `formType=${formType ? formType : ""}&voucherType=${
        voucherType ? voucherType : ""
      }&voucherPrefix=${voucherPrefix ? voucherPrefix : ""}&isVoucherPrefix=${
        isVoucherPrefix ? isVoucherPrefix : false
      }`
    );

    const nextVoucherNumber = response || 1;

    return nextVoucherNumber;
  };
  const selectVoucherForms = async (voucherType: string) => {
    const response = await api.getAsync(
      `${Urls.voucher_selector}${voucherType}`
    );

    return response;
  };

  const validate = (): boolean => {
    // Check if demo version is expired
    if (clientSession.isDemoVersion) {
      const demoExpiryDate = new Date(clientSession.demoExpiryDate);
      const transactionDate = new Date(
        formState.transaction.master.transactionDate
      ); // Assuming `dtpTransDate` is a Date object
      const softwareDate = moment(clientSession.softwareDate, "DD/MM/YYYY")
        .local()
        .toDate();

      const daysUntilExpiry = Math.floor(
        (demoExpiryDate.getTime() - transactionDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const daysSinceSoftwareDate = Math.floor(
        (transactionDate.getTime() - softwareDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0 || daysSinceSoftwareDate > 30) {
        dispatch(
          updateFormElement({
            fields: {
              transactionDate: { disabled: true },
              btnSave: { disabled: true },
              btnAdd: { disabled: true },
            },
          })
        );
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
      new Date(formState.transaction.master.transactionDate),
      false,
      userSession,
      clientSession,
      applicationSettings,
      undefined,
      hasBlockedRight
    );
    if (!validateTransDate.valid) {
      ERPAlert.show({
        icon: "warning",
        title:
          "Transaction Date validation failed(Check Financial Year period)",
        text: validateTransDate.message,
      });
      return false;
    }

    // Validate transaction amount
    if (
      formState.transaction.master.totalAmount === null ||
      formState.transaction.master.totalAmount == 0
    ) {
      ERPAlert.show({
        icon: "warning",
        title: "Invalid Transaction Amount",
        text: "Zero transaction amount not allowed",
      });
      return false;
    }

    if (formState.transaction.master.voucherType == "MJV") {
      for (let i = 0; i < formState.transaction.details.length; i++) {
        const row = formState.transaction.details[i];

        // Check if debit amount is greater than 0
        if (Number(row.debit) > 0) {
          if (formState.firstDebitLedgerID === 0) {
            formState.firstDebitLedgerID = Number(row.ledgerID || 0);
          }
        } else {
          if (formState.firstCreditLedgerID === 0) {
            formState.firstCreditLedgerID = Number(row.ledgerID || 0);
          }
        }

        // Break if we found both
        if (
          formState.firstCreditLedgerID > 0 &&
          formState.firstDebitLedgerID > 0
        )
          break;
      }
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
          (x) => x.ledgerID == formState.masterAccountID
        ) != undefined;
      if (isExist) {
        ERPAlert.show({
          icon: "warning",
          title: "Duplicate Ledger",
          text: "Master Ledger Exists in Row",
        });
        return false;
      }
    }

    if (formState.transaction.master.voucherType == "MJV") {
      const totalDebit = formState.transaction.details
        .reduce((sum, x) => sum + (x.debit || 0), 0)
        .toFixed(applicationSettings.mainSettings?.decimalPoints);
      const totalCredit = formState.transaction.details
        .reduce((sum, x) => sum + (x.credit || 0), 0)
        .toFixed(applicationSettings.mainSettings?.decimalPoints);
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

  const attachDetails = (): AccTransactionRow[] => {
    const details = JSON.parse(
      JSON.stringify([...formState.transaction.details])
    );
    let updatedDetails = [];
    let debtorID = 0,
      arra = 0,
      detailID = 0;

    for (let index = 0; index < details.length; index++) {
      const element: AccTransactionRow = details[index];
      if (isNullOrUndefinedOrZero(element.ledgerID)) {
        break;
      }
      element.adjAmount = 0;
      element.checkBouncedDate = element.bankDate;
      element.currencyId = 1;
      element.exchangeRate = 1;
      element.isDisplay = true;
      element.isDr = true;
      switch (formState.transaction.master.voucherType) {
        case "CP":
        case "BP":
        case "CN":
        case "SV":
        case "CQP":
          element.ledgerID = element.ledgerID; // Preserve original ledgerID
          element.relatedLedgerID = formState.masterAccountID;
          break;

        case "CR":
        case "BR":
        case "DN":
        case "PV":
        case "CQR":
          element.relatedLedgerID = element.ledgerID;
          element.ledgerID = formState.masterAccountID;
          break;

        case "JV":
          if (formState.row.drCr === "Dr") {
            element.relatedLedgerID = element.ledgerID;
            element.ledgerID = formState.masterAccountID;
          } else {
            element.ledgerID = element.ledgerID; // Preserve original ledgerID
            element.relatedLedgerID = formState.masterAccountID;
          }
          break;

        case "OB":
          if (formState.row.drCr === "Dr") {
            element.relatedLedgerID =
              applicationSettings.accountsSettings.defaultSuspenseAcc; // Suspense account
            element.ledgerID = element.ledgerID; // Keep original ledger ID
          } else {
            element.ledgerID =
              applicationSettings.accountsSettings.defaultSuspenseAcc; // Suspense account
            element.relatedLedgerID = element.ledgerID;
          }
          break;

        case "MJV":
          if (formState.row.drCr === "Dr") {
            element.ledgerID = element.ledgerID; // Keep original ledger ID
            element.relatedLedgerID = formState.firstCreditLedgerID;
            element.debit = Number(formState.row.amount);
            element.credit = 0;
          } else {
            element.ledgerID = element.ledgerID; // Keep original ledger ID
            element.relatedLedgerID = formState.firstCreditLedgerID;
            element.credit = Number(formState.row.amount);
            element.debit = 0;
          }
          break;
      }
      element.particularsLedgerId = element.relatedLedgerID;
      element.voucherType = formState.transaction.master.voucherType;
      updatedDetails.push(element);
    }
    return updatedDetails;
  };
  const attachMaster = (): AccTransactionMaster => {
    const master = { ...formState.transaction.master };

    master.accTransactionMasterID = formState.isEdit
      ? master.accTransactionMasterID
      : 0;
    // master.bankDate = new Date().toISOString();
    master.checkBouncedDate = new Date().toISOString();
    master.dueDate = master.transactionDate;
    const totalAmount = master.totalAmount || 0;

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

  const setupBahamdoonPOSReceipts = () => {
    let master = { ...formState.transaction.master };
    let row = { ...formState.row };
    dispatch(
      accFormStateRowHandleFieldChange({
        fields: { ledgerCode: "2768", ledgerID: 3107 },
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

    dispatch(
      updateFormElement({
        fields: {
          voucherPrefix: { disabled: true },
          voucherNumber: { disabled: true },
          btnDown: { disabled: true },
          transactionDate: { disabled: true },
          ledgerCode: { disabled: true },
          remarks: { disabled: true },
          commonNarration: { disabled: true },
          ledgerID: { disabled: true },
          btnBillWise: { disabled: true },
          referenceDate: { disabled: true },
          masterAccount: { disabled: true },
          employee: { disabled: true },
          projectId: { disabled: true },
          discount: { disabled: true },
          chequeNumber: { disabled: true },
          bankDate: { disabled: true },
          btnEdit: { visible: false },
        },
      })
    );
  };
  const save = async () => {
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          saving: true,
        },
      })
    );
    if (validate() == true) {
      const params: AccTransactionData = {
        master: attachMaster(),
        details: attachDetails(),
        attachments: [...formState.transaction.attachments],
      };
      const saveRes = await api.postAsync(
        `${Urls.acc_transaction_base}${transactionType}`,
        params
      );
      if (saveRes.isOk == true) {
        if (formState.printOnSave == true) {
          if (
            userSession.dbIdValue.trim() == "BAHAMDOON" &&
            formState.isBahamdoonPOSReceipt != true
          ) {
            printPaymentReceiptAdvice();
          } else {
            printVoucher();
          }
        }
        if (formState.userConfig.clearDetailsAfterSaveAccounts == true) {
          clearControls(
            formState.isEdit,
            formState.transaction.master.accTransactionMasterID
          );
        } else {
          const isFinancialYearClosed =
            userSession.financialYearStatus === "Closed";
          const fieldsToUpdate: Record<string, any> = {
            pnlMasters: { disabled: false },
            dxGrid: { disabled: false },
            btnSave: { disabled: true },
            btnEdit: {
              disabled:
                !isFinancialYearClosed &&
                hasRight(formState.formCode, UserAction.Edit)
                  ? false
                  : true,
            },
            btnDelete: { disabled: true },
            btnPrint: { disabled: true },
          };

          // Dispatch the update action with all the required fields
          dispatch(updateFormElement({ fields: fieldsToUpdate }));
        }
        ERPToast.show(saveRes.message,"success");
      } else {
        // dispatch(acc)
        ERPAlert.show({
          icon: "warning",
          title: saveRes.message,
        });
      }

      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            saving: false,
          },
        })
      );
    }
  };
  const clearControls = async (
    isEdit: boolean,
    accTransactionMasterID: number
  ) => {
    await undoEditMode(isEdit, accTransactionMasterID);
    const vNo = await getNextVoucherNumber(
      formState.transaction.master.formType,
      formState.transaction.master.voucherType,
      formState.transaction.master.voucherPrefix,
      false
    );
    
    dispatch(
      clearState({
        userSession,
        applicationSettings,
        softwareDate,
        defaultCostCenterID:
          applicationSettings.accountsSettings?.defaultCostCenterID,
        counterwiseCashLedgerId: 0,
        allowSalesCounter: 0,
        voucherNo: vNo,
      })
    );
  
    // Reset combobox specific states
    dispatch(
      accFormStateRowHandleFieldChange({
        fields: { 
          ledgerID: null,
          ledgerCode: '',
          costCentreID: null
        }
      })
    );
    
    // Force reload combobox data
    dispatch(updateFormElement({
      fields: {
        ledgerID: { reload: true },
        costCentreID: { reload: true }
      }
    }));
  };
  const handleRemoveItem = async (index: number) => {
    dispatch(
      accFormStateTransactionDetailsRowRemove({
        index: index,
        applicationSettings: applicationSettings,
      })
    );
  };
  const addOrEditRow = async (billwiseDetails?: string) => {
    
    if (applicationSettings.accountsSettings?.billwiseMandatory) {
      if (!isNullOrUndefinedOrZero(formState.row.ledgerID)) {
        if (formState.isRowEdit != true) {
          if (billwiseDetails == null && formState.row.billwiseDetails == "") {
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
          dispatch(
            accFormStateHandleFieldChange({
              fields: { showbillwise: false },
            })
          );
        } else {
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
          dispatch(
            accFormStateHandleFieldChange({
              fields: { showbillwise: false },
            })
          );
        }
      }
      if (isNullOrUndefinedOrZero(formState.row.ledgerID)) {
        ERPAlert.show({
          icon: "warning",
          title: "Please select Ledger..!",
        });
        return false;
      }
      const fdd = isNullOrUndefinedOrZero(formState.row.amount);
      const fdsdd = isNullOrUndefinedOrZero(
        formState.transaction.master.totalAmount
      );
      if (
        isNullOrUndefinedOrZero(formState.row.amount) &&
        !isNullOrUndefinedOrZero(formState.transaction.master.totalAmount)
      ) {
        if (hasRight(formState.formCode, UserAction.Add)) {
          dispatch(
            updateFormElement({
              fields: {
                btnSave: {
                  disabled: false,
                  label: "Add",
                },
              },
            })
          );
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
        isNullOrUndefinedOrZero(formState.row.costCentreID) &&
        formState.formElements.costCentreID.visible == true
      ) {
        ERPAlert.show({
          icon: "info",
          title: "Please select a cost center..!",
        });
        focusCostCenterRef();
        return false;
      }
      formState.formElements.btnAdd;

      dispatch(
        accFormStateTransactionDetailsRowAdd({
          row: {
            ...formState.row,
            billwiseDetails:
              billwiseDetails != undefined
                ? billwiseDetails
                : formState.row.billwiseDetails,
          },
          applicationSettings: applicationSettings,
          exchangeRate: formState.transaction.master.currencyRate ?? 1,
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
        linkEdit: { visible: true },
      };

      // Conditionally update costCentreID if needed
      if (formState.userConfig.presetCostenterId > 0) {
        updatedFields.costCentreID = { disabled: true };
      }

      // Dispatch the updateFormElement action
      dispatch(
        updateFormElement({
          fields: updatedFields,
        })
      );
      focusLedgerCombo();
    }
  };
  const validatePDC = async (
    accTransactionDetailsId: number
  ): Promise<boolean> => {
    try {
      if (!accTransactionDetailsId) {
        return false;
      }

      const params = {
        accDetailId: accTransactionDetailsId,
      };

      const response = await api.getAsync(
        `${Urls.validate_cheque_status}${accTransactionDetailsId}`
      );

      if (response == undefined || response.isOk === false) {
        return false;
      }
      return true;
    } catch (error) {
      ERPAlert.show({
        type: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to validate PDC",
      });
      return true; // Maintain original behavior of returning true on error
    }
  };
  interface RowClickHandlerParams {
    row: AccTransactionRow;
  }
  const handleRowClick = async ({ row }: RowClickHandlerParams) => {
    try {
      // Check PDC validation first
      if (row.accTransactionDetailId) {
        const isPDCValid = await validatePDC(row.accTransactionDetailId);
        if (isPDCValid) {
          ERPAlert.show({
            title: "Warning",
            text: "Sorry You can't Edit Cleared/Bounced PDC....!!",
            icon: "warning",
          });
          // clearControls(formState.isEdit, formState.transaction.master.accTransactionMasterID);
          dispatch(
            updateFormElement({
              fields: {
                btnSave: { disabled: true },
                btnAdd: { disabled: true },
              },
            })
          );
          return;
        }
      }

      // Handle empty row
      if (!row) {
        // clearControls();
        return;
      }

      // Enable buttons
      dispatch(
        updateFormElement({
          fields: {
            btnSave: { disabled: false },
            btnAdd: { disabled: false, label: "Modify" },
          },
        })
      );

      // Update row data in form state
      dispatch(
        accFormStateRowHandleFieldChange({
          fields: {
            slNo: row.slNo,
            amount: row.amountFC?.toString() || row.amount?.toString() || "0",
            discount: row.discount?.toString() || "0",
            ledgerCode: row.ledgerCode || "",
            ledgerID: row.ledgerID || 0,
            narration: row.narration || "",
            nameOnCheque: row.nameOnCheque || "",
            bankName: row.bankName || "",
            costCentreID: row.costCentreID || 0,
            projectId: row.projectId || 0,
            billwiseDetails: row.billwiseDetails || "",
            chequeNumber: row.chequeNumber || "",
            checkStatus: row.checkStatus || "",
            bankDate: row.bankDate || new Date().toISOString(),
            drCr: row.drCr || "",
          },
        })
      );

      let accTransDetailsID = row.accTransactionDetailId;

      // Handle special voucher type cases
      if (
        ["CR", "BR", "CN", "CQR", "PBR", "JV"].includes(
          formState.transaction.master.voucherType
        )
      ) {
        if (formState.isEdit && accTransDetailsID > 0) {
          accTransDetailsID = accTransDetailsID + 1;
        }
      } else if (formState.transaction.master.voucherType === "OB") {
        if (formState.isEdit && accTransDetailsID > 0 && row.drCr === "Cr") {
          accTransDetailsID = accTransDetailsID + 1;
        }
      }

      // Update row edit state
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            isRowEdit: true,
            accTransDetailsID: accTransDetailsID,
          },
        })
      );
    } catch (error) {
      console.error("Row click handler error:", error);
      ERPAlert.show({
        title: "Error",
        text: "An error occurred while processing the row click",
        icon: "error",
      });
    }
  };
  const handleFieldKeyDown = (
    field: string,
    key: any,
    gridRef?: any,
    applicationSettings?: ApplicationSettingsType
  ) => {
    if (field === "test") {
      focusLedgerCombo();
    } else if (field === "grid") {
      handleGridKeyDown(key, gridRef, applicationSettings);
    } else if (field === "ledgerCode") {
      handleLedgerCodeKeyDown(key);
    } else if (field === "amount") {
      handleAmountKeyDown(key);
    } else if (field === "costCentre") {
      if (key == "Enter") {
        focusBtnAdd();
      }
    } else if (field === "voucherNumber") {
      handleVoucherNumberKeyUp(key);
    } else if (field === "narration") {
      handleNarrationKeyDown(key);
    } else if (field === "employee") {
      handleEmployeeKeyDown(key);
    } else if (field === "ledgerID") {
      handleLedgerIdKeyDown(key);
    } else if (field === "bankDate") {
      if (isEnterKey(key)) {
        dispatch(
          accFormStateHandleFieldChange({ fields: { showbillwise: true } })
        );
      }
    } else if (field === "commonNarration") {
      if (isEnterKey(key)) {
        focusLedgerCode();
      }
    }
  };

  const handleGridKeyDown = (
    key: any,
    gridRef: any,
    applicationSettings?: ApplicationSettingsType
  ) => {
    if (key === "e" || key === "E" || key === "Enter") {
      focusLedgerCombo();
    }
    if (key === "a" || key === "A") {
    }
    if (key === "d" || key === "D") {
      ERPAlert.show({
        title: "Confirm Delete",
        text: "Are you sure you want to delete this row?",
        icon: "warning",
        confirmButtonText: "Yes, delete it!",
        onConfirm: () => {
          const dataGridInstance = gridRef.current.instance(); // Access DataGrid instance
          const focusedRowIndex = dataGridInstance.option("focusedRowIndex");
          dispatch(
            accFormStateTransactionDetailsRowRemove({
              applicationSettings: applicationSettings,
              index: focusedRowIndex,
            })
          );
          console.log("Row Data:", focusedRowIndex);
        },
      });
    }
  };

  // Ledger code keydown handler
  const handleLedgerCodeKeyDown = async (e: any) => {
    if (e === "Enter" || e === "Tab") {
      try {
        const response = await api.getAsync(
          `${Urls.get_ledgerId_by_code}${
            formState.row.ledgerCode == undefined ||
            formState.row.ledgerCode === ""
              ? 0
              : formState.row.ledgerCode
          }`
        );

        if (response && response > 0) {
          dispatch(
            accFormStateRowHandleFieldChange({
              fields: {
                ledgerID: response,
              },
            })
          );
          focusAmount();
        } else {
          focusLedgerCombo();
        }
      } catch (error) {
        console.error("Error fetching ledger:", error);
      }
    }
  };

  const handleLedgerIdKeyDown = async (id: any) => {
    if (id > 0) {
      setTimeout(() => {
        focusAmount();
      }, 0);
    }
  };

  // Amount keydown handler
  const handleAmountKeyDown = (e: any) => {
    if (e === "Enter") {
      const voucherType = formState.transaction.master.voucherType;
      if (voucherType !== "OB" && voucherType !== "MJV") {
        focusNarration();
      } else {
        focusDrCr();
      }
    }
  };
  const handleEmployeeKeyDown = (e: any) => {
    // Handle Enter key
    focusLedgerCode();
  };
  const handleNarrationKeyDown = (e: any) => {
    // Handle Enter key
    if (e === "Enter") {
      
      const isChequeVoucher =
        formState.transaction.master.voucherType === "CQP" ||
        formState.transaction.master.voucherType === "CQR";
      const isPaymentReceipt =
        formState.transaction.master.voucherType === "BP" ||
        formState.transaction.master.voucherType === "BR";

      if (
        applicationSettings.accountsSettings?.maintainBillwiseAccount &&
        formState.formElements.btnBillWise.visible == true
      ) {
        if (!isPaymentReceipt || !isChequeVoucher) {
          // Handle billwise click
          dispatch(
            accFormStateHandleFieldChange({ fields: { showbillwise: true } })
          );
        } else {
          focusChequeNumber();
        }

        if (isChequeVoucher) {
          focusChequeNumber();
        }
      } else if (
        applicationSettings.accountsSettings?.maintainCostCenter &&
        formState.formElements.costCentreID.visible == true
      ) {
        focusCostCenterRef();
      } else {
        focusBtnAdd();
      }

      // Final check for cheque vouchers
      if (isChequeVoucher) {
        focusChequeNumber();
      }
    }
    // Handle Down arrow key
    else if (e.key === "ArrowDown") {
      if (formState.previousNarration) {
        // Update narration with previous value
        formState.row.narration = formState.previousNarration;
      }
    }
  };

  // Voucher number navigation handlers
  const handleVoucherNumberKeyUp = async (e: any) => {
    const currentNumber = Number(formState.transaction.master.voucherNumber);

    if (e == "ArrowDown" || e == "ArrowUp" || e == "Enter") {
      if (currentNumber > 0) {
        await loadAccTransVoucher();
      }
    }
  };

  const loadTemporaryRows = async () => {
    dispatch(loadTempRows());
  };

  const enableCombo = async () => {
    dispatch(
      updateFormElement({
        fields: {
          employee: { disabled: false },
          jvDrCr: { disabled: false },
          masterAccount: { disabled: false },
          referenceDate: { disabled: false },
          transactionDate: { disabled: false },
          linkEdit: { visible: false },
        },
      })
    );
  };
  const disableCombo = async () => {
    dispatch(
      updateFormElement({
        fields: {
          employee: { disabled: true },
          jvDrCr: { disabled: true },
          masterAccount: { disabled: true },
          referenceDate: { disabled: true },
          transactionDate: { disabled: true },
          linkEdit: { visible: true },
        },
      })
    );
  };

  // Edit button handler
  const handleEdit = async () => {
    const validateTransactionDateRes = validateTransactionDate(
      new Date(new Date(formState.transaction.master.transactionDate)),
      false,
      userSession,
      clientSession,
      applicationSettings,
      undefined,
      hasBlockedRight
    );
    if (!validateTransactionDateRes.valid) {
      ERPAlert.show({
        title: "Warning",
        text: validateTransactionDateRes.message,
        icon: "warning",
      });
    }

    if (formState.transaction.master.isLocked) {
      ERPAlert.show({
        title: "Warning",
        text: "This voucher is locked. Cannot be edited/deleted.",
        icon: "warning",
      });
      return;
    }

    try {
      const result = await api.postAsync(
        Urls.get_and_set_transaction_edit_mode,
        {
          transactionType: "A",
          transactionMasterId:
            formState.transaction.master.accTransactionMasterID ?? 0,
        }
      );

      if (result?.isOk == true) {
        dispatch(
          accFormStateHandleFieldChange({
            fields: {
              isEdit: true,
            },
          })
        );
        dispatch(
          updateFormElement({
            fields: {
              btnSave: {
                disabled: !hasRight(formState.formCode, UserAction.Add),
              },
              btnDelete: { disabled: true },
              btnPrint: { disabled: true },
              btnEdit: { disabled: true },
              pnlMasters: { disabled: false },
              dxGrid: { disabled: true },
            },
          })
        );
      } else {
        const editInfo = result.message.split(";");
        ERPAlert.show({
          title: "Voucher in Use",
          text: `This Voucher is already in use by ${editInfo[1]} on system ${editInfo[0]} at ${editInfo[2]}`,
          icon: "warning",
        });
      }
    } catch (error) {
      console.error("Error handling edit:", error);
    }
  };

  // Delete button handler
  const deleteAccTransVoucher = async () => {
    if (formState.transaction.master?.isLocked) {
      ERPAlert.show({
        title: "Warning",
        text: "This voucher is locked. Cannot be edited/deleted.",
        icon: "warning",
      });
      return;
    }

    ERPAlert.show({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this voucher?",
      icon: "warning",
      confirmButtonText: "Yes, delete it!",
      onConfirm: async () => {
        try {
          if (formState.transaction?.master?.accTransactionMasterID > 0) {
            const res = await appDispatch(
              deleteAccVoucher({
                accTransactionMasterID:
                  formState.transaction?.master?.accTransactionMasterID,
                transactionType: transactionType,
              })
            ).unwrap();
            if (res != undefined && res.isOk != true) {
              ERPAlert.show({
                title: "failed",
                text: res.message,
                onConfirm: () => {
                  return false;
                },
              });
            }
          }
          clearControls(
            formState.isEdit,
            formState.transaction.master.accTransactionMasterID
          );
        } catch (error) {
          console.error("Error deleting voucher:", error);
        }
      },
    });
  };
  const handleLoadByRefNo = useCallback(() => {
    if (formState.transaction.master.referenceNumber) {
      loadAccTransVoucher(true);
    }
  }, [loadAccTransVoucher]);

  const handleRefresh = async () => {
    try {
      const currentLedgerId = formState.row.ledgerID;
      const currentMasterAccountId = formState.masterAccountID;

      dispatch(
        updateFormElement({
          fields: {
            ledgerID: { reload: true },
            masterAccount: { reload: true },
          },
        })
      );
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };
  const createNewVoucher = async () => {
    try {
      dispatch(
        accFormStateHandleFieldChange({
          fields: { isEdit: false },
        })
      );
      dispatch(
        updateFormElement({
          fields: {
            btnEdit: { disabled: true },
            btnDelete: { disabled: true },
            btnPrint: { disabled: true },
            btnSave: {
              disabled: !hasRight(formState.formCode, UserAction.Add),
            },
            pnlMasters: { disabled: false },
            dxGrid: { disabled: false },
          },
        })
      );

      // Clear billwise details
      dispatch(accFormStateClearBillWiseInDetails());

      // Get new voucher details
      const selectVoucherData = await selectVoucherForms(
        formState.transaction.master.voucherType
      );
      
      const getVoucherNumber = await getNextVoucherNumber(
        formState.transaction.master.formType,
        formState.transaction.master.voucherType,
        formState.transaction.master.voucherPrefix,
        false
      );

      dispatch(
        accFormStateTransactionMasterHandleFieldChange({
          fields: {
            voucherPrefix: selectVoucherData.lastPrefix,
            voucherNumber: getVoucherNumber,
            accTransactionMasterID: 0,
            transactionDate: moment(
              clientSession.softwareDate,
              "DD/MM/YYYY"
            ).local(),
          },
        })
      );
    } catch (error) {
      console.error("Error creating new voucher:", error);
      // Handle error appropriately
    }
  };
  const unlockVoucher = async () => {
    try {
      await appDispatch(
        unlockAccTransactionMaster(
          formState.transaction.master.accTransactionMasterID
        )
      );
    } catch (error) {
      console.error("Error creating new voucher:", error);
      // Handle error appropriately
    }
  };
  const isLedgerBillwiseApplicable = async (ledgerID: number) => {
    try {
      return await api.getAsync(
        `${Urls.is_ledger_billwise_applicable}${ledgerID}`
      );
    } catch (error) {
      return false;
      // Handle error appropriately
    }
  };
  const openBillwise = async () => {
    
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          ledgerBillWiseLoading: true,
        },
      })
    );
    const billwise = await api.getAsync(
      `${Urls.acc_transaction_ledger_bill_wise}?LedgerId=${
        formState.row.ledgerID
      }&DrCr=${formState.transaction.master.drCr}&AccTransactionDetailID=${
        formState.row.accTransactionDetailId ?? 0
      }`
    );
    setTimeout(() => {
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            billwiseData: billwise,
            ledgerBillWiseLoading: false,
          },
        })
      );
    }, 0);
  };
  const showBillwise = async () => {
    
    if (formState.row.ledgerID && formState.ledgerData != null) {
      const isBillwiseApplicable = await isLedgerBillwiseApplicable(
        formState.transaction.master.voucherType === "CN" ||
          formState.transaction.master.voucherType === "DN"
          ? formState.masterAccountID
          : formState.row.ledgerID
      );
      if (isBillwiseApplicable == true) {
        dispatch(
          accFormStateHandleFieldChange({
            fields: { showbillwise: true },
          })
        );
      } else {
        if (formState.formElements?.costCentreID.visible == true) {
          focusCostCenterRef();
        } else {
          addOrEditRow();
          focusLedgerCode();
        }
      }
    }
  };
  const billwiseChanged = async (showBillwise: boolean) => {
    try {
      let drCr = "";
      const loadLedgerData = async () => {
        
        // switch (formState.transaction.master.voucherType) {
        //   case "CP":
        //   case "BP":
        //   case "DN":
        //   case "CQP":
        //   case "SV":
        //   case "SRV":
        //   case "PBP":
        //     drCr = "Dr";
        //     break;

        //   case "CR":
        //   case "BR":
        //   case "CN":
        //   case "CQR":
        //   case "PV":
        //   case "PBR":
        //     drCr = "Cr";
        //     break;

        //   case "OB":
        //   case "MJV":
        //     drCr = formState.row.drCr == "Dr" ? "Dr" : "Cr";
        //     break;

        //   case "JV":
        //     drCr = formState.row.drCr == "Dr" ? "Cr" : "Dr";
        //     break;
        // }

        if (
          formState.showbillwise === true &&
          formState.row.ledgerID &&
          formState.ledgerData != null
        ) {
          openBillwise();
        } else {
        }
      };

      loadLedgerData();
    } catch (error) {
      return false;
      // Handle error appropriately
    }
  };

  return {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransVoucher,
    deleteAccTransVoucher,
    validate,
    setupBahamdoonPOSReceipts,
    save,
    clearControls,
    addOrEditRow,
    handleRemoveItem,
    handleRowClick,
    handleFieldKeyDown,
    loadTemporaryRows,
    enableCombo,
    disableCombo,
    handleEdit,
    handleLoadByRefNo,
    printCheque,
    printVoucher,
    printPaymentReceiptAdvice,
    handleRefresh,
    createNewVoucher,
    unlockVoucher,
    billwiseChanged,
    focusCostCenterRef,
    focusLedgerCode,
    showBillwise,
  };
};
