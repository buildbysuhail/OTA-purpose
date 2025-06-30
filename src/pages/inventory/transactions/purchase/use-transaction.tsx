import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAccPrint } from "./use-print";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import VoucherType from "../../../../enums/voucher-types";
import { APIClient } from "../../../../helpers/api-client";
import {
  useUserRights,
  UserAction,
} from "../../../../helpers/user-right-helper";
import { RootState } from "../../../../redux/store";
import Urls from "../../../../redux/urls";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utilities/hooks/useAppDispatch";
import {
  customJsonParse,
  modelToBase64Unicode,
} from "../../../../utilities/jsonConverter";
import {
  isNullOrUndefinedOrZero,
  isNullOrUndefinedOrEmpty,
  isEnterKey,
} from "../../../../utilities/Utils";
import { BillwiseData } from "../../../accounts/transactions/acc-transaction-types";
import { ApplicationSettingsType } from "../../../settings/system/application-settings-types/application-settings-types";
import {
  formStateHandleFieldChange,
  formStateTransactionMasterHandleFieldChange,
  updateFormElement,
  formStateTransactionUpdate,
  clearState,
  formStateTransactionDetailsRowRemove,
  formStateTransactionDetailsRowAdd,
  formStateMasterHandleFieldChange,
  loadTempRows,
  formStateTransactionDetailsRowUpdate,
  formStateHandleFieldChangeKeysOnly,
} from "./reducer";
import { deleteAccVoucher, unlockTransactionMaster } from "./thunk";
import { updateTransactionEditMode } from "./transaction-functions";
import {
  UserConfig,
  TransactionFormState,
  TransactionData,
  Attachments,
  TransactionMaster,
  TransactionDetail,
  SummaryItems,
  CommonParams,
  LoadProductDetailsByAutoBarcodeProps,
  DataAutoBarcode,
} from "./transaction-types";
import {
  initialInventoryTotals,
  initialTransactionDetailData,
  TransactionFormStateInitialData,
  transactionInitialData,
} from "./transaction-type-data";
import {
  isDirtyTransaction,
  setTransactionForHistory,
} from "../../../../helpers/transaction-modified-util";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useTransactionHelper } from "./use-transaction-helper";
import { DeepPartial } from "redux";
import useDebounce from "./use-debounce";
// export interface UserConfig {
//   keepNarrationForJV: boolean;
//   clearDetailsAfterSaveAccounts: boolean;
//   mnuShowConfirmationForEditOnAccounts: boolean;
//   maximizeBillwiseScreenInitially: boolean;
//   alignment: "left" | "center" | "right";
// }

interface FormElementState {
  visible: boolean;
  disabled: boolean;
  label: string;
}

const api = new APIClient();
export const useTransaction = (
  transactionType: string,
  btnSaveRef: any,
  btnAddRef: any,
  focusToNextColumn: (rowIndex: number, column: string) => void,
  focusCurrentColumn: (rowIndex: number, column: string) => void,
  ledgerCodeRef?: any,
  ledgerIdRef?: any,
  masterAccountRef?: any,
  costCenterRef?: any,
  amountRef?: any,
  drCrRef?: any,
  narrationRef?: any,
  voucherNumberRef?: any,
  chequeNumberRef?: any,
  remarksRef?: any,
  partyNameRef?: any,
  taxableAmountRef?: any,
  refNoRef?: any,
  discountRef?: any,
  chequeStatusRef?: any
) => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const dataContainer = useAppSelector((state: RootState) => state.Data);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const softwareDate = useAppSelector(
    (state: RootState) => state.ClientSession.softwareDate
  );
  const {
    attachDetails,
    attachMaster,
    calculateSummary,
    calculateTotal,
    // calculateTotal,
    disableControlsFn,
    refactorDetails,
    // getClosedDate,
    setUserRightsFn,
    validateTransactionDate,
    clearEntryControl,
    disableControls,
    calculateRowAmount,
  } = useTransactionHelper(transactionType);
  const { printVoucher, printCheque, printPaymentReceiptAdvice } =
    useAccPrint();
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const { round } = useNumberFormat();
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  // const clearControlForNew = async () => {

  // };
  const focusBtnSave = () => {
    if (btnSaveRef.current) {
      btnSaveRef.current?.focus();
    }
  };
  const focusBtnAdd = () => {
    if (btnAddRef.current) {
      btnAddRef.current?.focus();
    }
  };
  const focusAmount = () => {
    if (amountRef.current) {
      amountRef.current?.select();
      amountRef.current?.focus();
    }
  };
  const focusDiscount = () => {
    if (discountRef.current) {
      setTimeout(() => {
        discountRef.current?.select();
        discountRef.current?.focus();
      }, 0);
    }
  };
  const focusMasterAccount = () => {
    if (masterAccountRef.current) {
      masterAccountRef.current?.select();
      masterAccountRef.current?.focus();
    }
  };
  const focusCostCenterRef = () => {
    if (costCenterRef.current) {
      setTimeout(() => {
        costCenterRef.current?.select();
        costCenterRef.current?.focus();
      }, 0);
    }
  };
  const focusLedgerCode = () => {
    if (ledgerCodeRef.current) {
      setTimeout(() => {
        ledgerCodeRef.current?.select();
        ledgerCodeRef.current?.focus();
      }, 0);
    }
  };
  const focusRefNo = () => {
    if (refNoRef.current) {
      setTimeout(() => {
        refNoRef.current?.select();
        refNoRef.current?.focus();
      }, 0);
    }
  };
  const focusLedgerCombo = () => {
    if (ledgerIdRef.current) {
      ledgerIdRef.current?.select();
      ledgerIdRef.current?.focus();
    }
  };
  const focusNarration = () => {
    if (narrationRef.current) {
      narrationRef.current?.select();
      narrationRef.current?.focus();
    }
  };
  const focusDrCr = () => {
    if (drCrRef.current) {
      drCrRef.current?.select();
      drCrRef.current?.focus();
    }
  };
  const focusVoucherNumber = () => {
    if (voucherNumberRef.current) {
      voucherNumberRef.current?.select();
      voucherNumberRef.current?.focus();
    }
  };
  const focusChequeNumber = () => {
    if (chequeNumberRef.current) {
      chequeNumberRef.current?.select();
      chequeNumberRef.current?.focus();
    }
  };
  const focusRemarks = () => {
    if (remarksRef.current) {
      remarksRef.current?.select();
      remarksRef.current?.focus();
    }
  };
  const focusChequeStatus = () => {
    if (chequeStatusRef.current) {
      chequeStatusRef.current?.select();
      chequeStatusRef.current?.focus();
    }
  };
  const focusTaxableAmount = () => {
    if (taxableAmountRef.current) {
      taxableAmountRef.current?.select();
      taxableAmountRef.current?.focus();
    }
  };
  const focusPartName = () => {
    if (partyNameRef.current) {
      partyNameRef.current?.select();
      partyNameRef.current?.focus();
    }
  };

  const { hasRight, hasBlockedRight } = useUserRights();
  const fetchUserConfig = async () => {
    try {
      const base64 = await api.get(
        `${Urls.inv_transaction_base}${transactionType}/GetLocalSettings`
      );
      localStorage.setItem("utInvc", base64);
      // Decode the base64 back to JSON string
      const _userConfig = atob(base64);
      const userConfig: UserConfig = customJsonParse(_userConfig);

      return userConfig;
    } catch (error) {
      console.error("Error fetching user config:", error);
    }
  };
  const loadAndSetTransVoucher = async (
    usingManualInvNumber: boolean = false,
    voucherNumber?: number,
    voucherPrefix?: string,
    voucherType?: string,
    formType?: string,
    manualInvoiceNumber?: string,
    transactionMasterID?: number,
    mode?: "increment" | "decrement" | undefined,
    skipPrompt?: boolean | false,
    setVoucherNo?: boolean | false
  ) => {
    const _s_isDirty = isDirtyTransaction(formState.prev, {
      transaction: { ...formState.transaction },
    });
    if (_s_isDirty && skipPrompt != true) {
      dispatch(
        formStateHandleFieldChange({
          fields: {
            openUnsavedPrompt: true,
            tmpVoucherNo: voucherNumber,
          },
        })
      );
      return false;
    }

    if (setVoucherNo) {
      dispatch(
        formStateTransactionMasterHandleFieldChange({
          fields: {
            voucherNumber: voucherNumber,
          },
        })
      );
    }
    let _formState = await loadTransVoucher(
      usingManualInvNumber,
      voucherNumber,
      voucherPrefix,
      voucherType,
      formType,
      manualInvoiceNumber,
      transactionMasterID
    );

    _formState.formElements = {
      ..._formState.formElements,
      btnAdd: {
        ..._formState.formElements.btnAdd,
        label: t("add"),
      },
      amount: {
        ..._formState.formElements.amount,
        disabled: _formState.transaction.master.isLocked === true,
      },
      lnkUnlockVoucher: {
        ..._formState.formElements.lnkUnlockVoucher,
        visible:
          _formState.transaction.master.isLocked === true
            ? true
            : _formState.formElements.lnkUnlockVoucher.visible,
      },
      pnlMasters: {
        ..._formState.formElements.pnlMasters,
        disabled: _formState.transaction.master.invTransactionMasterID > 0,
      },
      btnSave: {
        ..._formState.formElements.btnSave,
        disabled:
          _formState.transaction.master.isLocked === true
            ? true
            : _formState.formElements.btnSave.disabled,
      },
    };
    setTransVoucher(_formState);
    return true;
  };
  const setTransVoucher = async (
    _formState: TransactionFormState,
    loadUserConfig: boolean = false
  ) => {
    const Utc = localStorage.getItem("utInvc");
    let userConfig: UserConfig | undefined;
    if (Utc) {
      const _userConfig = atob(Utc);
      userConfig = customJsonParse(_userConfig);
    } else {
      userConfig = await fetchUserConfig();
    }
    if (userConfig) {
      _formState.userConfig = userConfig;
    }

    _formState.prev = modelToBase64Unicode(
      setTransactionForHistory(_formState)
    );

    dispatch(
      formStateHandleFieldChange({
        fields: {
          ..._formState,
        },
      })
    );
  };
  const { t } = useTranslation("transaction");

  const loadTransVoucher = async (
    usingManualInvNumber: boolean = false,
    voucherNumber?: number,
    voucherPrefix?: string,
    voucherType?: string,
    formType?: string,
    manualInvoiceNumber?: string,
    transactionMasterID?: number
  ) => {
    let voucher: TransactionFormState = JSON.parse(
      JSON.stringify({
        ...formState,
        openUnsavedPrompt: false,
      })
    );
    const _voucherNumber =
      voucherNumber ?? (formState.transaction?.master?.voucherNumber || 0);
    if (_voucherNumber == undefined || _voucherNumber <= 0) {
      return voucher;
    }
    const params: Record<any, any> = {
      VoucherNumber: _voucherNumber, // Ensuring it's always a string
      voucherPrefix:
        voucherPrefix ?? (formState.transaction?.master?.voucherPrefix || ""),
      voucherType:
        voucherType ?? (formState.transaction?.master?.voucherType || ""),
      voucherForm:
        formType ?? (formState.transaction?.master?.voucherForm || ""),
      manualInvoiceNumber: manualInvoiceNumber ?? "", // Convert undefined to an empty string or appropriate string value
      isUsingManualInvNo: usingManualInvNumber, // Convert boolean to string
    };
    let vch = await api.getAsync(
      `${Urls.inv_transaction_base}${transactionType}`,
      new URLSearchParams(params).toString()
    );
    if (vch == null || vch?.master == null) {
      // const vno = await getNextVoucherNumber(params.formType,params.voucherType,params.voucherPrefix, false);
      vch = {
        ...transactionInitialData,
        master: {
          ...transactionInitialData.master,
          voucherNumber: _voucherNumber,
          voucherType: voucherType ?? formState.transaction.master.voucherType,
          voucherPrefix:
            voucherPrefix ?? formState.transaction.master.voucherPrefix,
          formType: formType ?? formState.transaction.master.voucherForm,
        },
      };
    }

    // clearControlForNew();
    await undoEditMode(
      formState.isEdit,
      transactionMasterID ?? formState.transaction.master.invTransactionMasterID
    );

    voucher.transaction = {
      ...(vch || {}),
      details: refactorDetails(
        vch.details,
        vch.master.voucherType,
        vch.master.voucherForm,
        { result: {} },
        voucher
      ),
      attachments: [...(vch.transaction?.attachments || [])],
    };

    const summaryRes = calculateSummary(voucher.transaction.details, voucher, {
      result: {},
    });
    voucher.summary = (
      summaryRes && summaryRes.summary
        ? summaryRes.summary
        : initialInventoryTotals
    ) as SummaryItems;

    voucher = calculateTotal(
      voucher.transaction.master,
      voucher.summary,
      voucher.formElements,
      { result: voucher }
    ) as TransactionFormState;

    voucher.transaction.master.hasroundOff =
      voucher.transaction.master.roundAmount > 0;
    voucher.transaction.master.prevTransDate =
      voucher.transaction.master.transactionDate == ""
        ? moment().local().toISOString()
        : voucher.transaction.master.prevTransDate;
    voucher.transaction.master.oldLedgerID =
      voucher.transaction.master.ledgerID;
    voucher.isPostedTransaction = voucher.transaction.master.isPosted;
    voucher = setUserRightsFn(voucher, userSession, hasRight);
    voucher = disableControlsFn(voucher);

    // Handle master data
    voucher.formElements.lblPosted.visible = voucher.isPostedTransaction;
    voucher.formElements.costCentreID.disabled =
      voucher.transaction.master.costCentreID <= 0 &&
      (formState.userConfig?.presetCostenterId ?? 0) > 0
        ? true
        : false;
    // voucher.transaction = vch;
    if (vch?.master) {
      const updatedMaster: TransactionMaster = {
        ...voucher.transaction.master,
        costCentreID:
          voucher.transaction.master.costCentreID <= 0
            ? formState.userConfig?.presetCostenterId ?? 0 > 0
              ? formState.userConfig?.presetCostenterId ?? 0
              : applicationSettings.accountsSettings.defaultCostCenterID
            : voucher.transaction.master.costCentreID,
      };
      voucher.transaction.master = updatedMaster;
    }
    if (vch?.details) {
      voucher.transaction.attachments = refactorAttachments(
        voucher.transaction
      );
    }
    if (voucher.transaction.attachments) {
      voucher.transaction.attachments = refactorAttachments(
        voucher.transaction
      );
    }

    voucher.transactionLoading = false;

    return voucher;
  };
  const refactorAttachments = (transaction: TransactionData) => {
    return transaction.attachments.map((att, index) => {
      const baseDetail: Attachments = {
        ...att,
        id: att.attachmentId,
        isNew: false,
        name: att.fileName,
      };
      return baseDetail;
    });
  };

  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
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
        return result;
      } catch (error) {
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

  async function validate(): Promise<boolean> {
    const master = formState.transaction.master;
    const details = formState.transaction.details;

    // Stock update restriction
    if (!formState.transaction.master.stockUpdate) {
      const confirm = await ERPAlert.show({
        icon: "info",
        title: t("stock_update_warning"),
        text: t("stock_already_updated_warning"),
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
        showCancelButton: true,
        onCancel: () => {
          return false;
        },
      });
      if (!confirm) {
        return false;
      }
    }

    // Cost centre validation
    // if (
    //   applicationSettings.accountsSettings.maintainCostCenter &&
    //   isNullOrUndefinedOrZero(master.costCentreID)
    // ) {
    //   await ERPAlert.show({
    //     icon: "error",
    //     title: t("validation_error"),
    //     text: t("select_valid_cost_centre"),
    //     confirmButtonText: t("ok"),
    //   });
    //   return false;
    // }

    // Grand total check
    if (master.grandTotal < 0) {
      await ERPAlert.show({
        icon: "error",
        title: t("validation_error"),
        text: t("wrong_discount_or_value"),
        confirmButtonText: t("ok"),
      });
      return false;
    }

    // Transaction date check
    const transDateValidation = validateTransactionDate(
      new Date(new Date(formState.transaction.master.transactionDate)),
      false,
      undefined,
      hasBlockedRight
    );
    if (!transDateValidation.valid) {
      await ERPAlert.show({
        title: t("warning"),
        text: transDateValidation.message,
        icon: "warning",
      });
    }

    // Day close check
    // const closedDate = await getClosedDate(api, formState.transactionType);
    // const tmpDate = new Date(master.transactionDate)
    // tmpDate.setHours(0, 0, 0, 0);
    // if (closedDate >= new Date(tmpDate)) {
    //   await ERPAlert.show({
    //     icon: "error",
    //     title: t("invalid_transaction_date"),
    //     text: t("day_closed"),
    //     confirmButtonText: t("ok"),
    //   });
    //   return false;
    // }

    // if (master.invTransactionMasterID > 0 && new Date(closedDate) >= new Date(formState.prevTransactionDate??"01/01/1900")) {
    //   await ERPAlert.show({
    //     icon: "error",
    //     title: t("invalid_transaction_date"),
    //     text: t("cannot_edit_day_closed"),
    //     confirmButtonText: t("ok"),
    //   });
    //   return false;
    // }

    // Party selection check
    // if (!master.ledgerID) {
    //   await ERPAlert.show({
    //     icon: "error",
    //     title: t("invalid_party"),
    //     text: t("select_cash_or_party"),
    //     confirmButtonText: t("ok"),
    //   });
    //   return false;
    // }

    // // Reference number validation
    // if (
    //   applicationSettings.inventorySettings
    //     .isReferenceNumberMandatoryInPurchase &&
    //   !master.purchaseInvoiceNumber
    // ) {
    //   await ERPAlert.show({
    //     icon: "error",
    //     title: t("reference_number_required"),
    //     text: t("reference_number_not_entered"),
    //     confirmButtonText: t("ok"),
    //   });
    //   return false;
    // }

    // if (master.purchaseInvoiceNumber) {
    //   const refExists = await checkReferenceNumberExists(master);
    //   if (refExists) {
    //     if (!isEdit || refExists.toString() !== master.voucherNumber) {
    //       await ERPAlert.show({
    //         icon: "error",
    //         title: t("invalid_reference_number"),
    //         text: t("reference_exists_in_pi", { ref: refExists }),
    //         confirmButtonText: t("ok"),
    //       });
    //       return false;
    //     }
    //   }
    // }

    // Scheme discount account check
    // if (
    //   DBID_VALUE === "SAMAPLASTICS" &&
    //   getSchemeDiscount(details) > 0 &&
    //   !master.schemeDiscountPostingLedgerId
    // ) {
    //   await ERPAlert.show({
    //     icon: "error",
    //     title: t("scheme_discount_warning"),
    //     text: t("select_scheme_discount_posting_ledger"),
    //     confirmButtonText: t("ok"),
    //   });
    //   return false;
    // }

    // Product validation
    // for (let i = 0; i < details.length; i++) {
    //   const row = details[i];
    //   if (!row.productBatchId || row.productBatchId === 0) {
    //     await ERPAlert.show({
    //       icon: "error",
    //       title: t("validation_error"),
    //       text: t("invalid_item_details_in_row", { row: i + 1 }),
    //       confirmButtonText: t("ok"),
    //     });
    //     return false;
    //   }
    // }

    // // Purchase cost change warning
    // if (Settings.InventorySettings.ShowPurchaseCostChangeWarning && !isEdit) {
    //   let priceChangeItems = "";
    //   for (const item of details) {
    //     if (item.unitPrice !== item.unitPriceOriginal) {
    //       priceChangeItems += `\n${item.product} [${item.barCode}]`;
    //     }
    //   }
    //   if (priceChangeItems) {
    //     await ERPAlert.show({
    //       icon: "info",
    //       title: t("purchase_price_changed"),
    //       text: priceChangeItems,
    //       confirmButtonText: t("ok"),
    //     });
    //   }
    // }

    // Gross amount zero validation
    // for (let i = 0; i < details.length; i++) {
    //   const row = details[i];
    //   if (row.gross === 0) {
    //     const confirm = await ERPAlert.show({
    //       icon: "question",
    //       title: t("zero_value"),
    //       text: t("zero_qty_in_row", { row: i + 1 }),
    //       confirmButtonText: t("yes"),
    //       cancelButtonText: t("no"),
    //       showCancelButton: true,
    //     });
    //     if (!confirm) {
    //       // optionally set focus logic here
    //       return false;
    //     }
    //   }
    // }

    // Check no items after blank rows
    // const firstFreeIndex = details.findIndex((x) => !x.productId);
    // for (let i = firstFreeIndex + 1; i < details.length; i++) {
    //   if (details[i].productId) {
    //     await ERPAlert.show({
    //       icon: "error",
    //       title: t("validation_error"),
    //       text: t("items_after_blank_row", { row: firstFreeIndex + 1 }),
    //       confirmButtonText: t("ok"),
    //     });
    //     return false;
    //   }
    // }

    // Finalize
    // calculateTotal();
    return true;
  }

  // const validateStatus = (accounts: TransactionRow[]): boolean => {
  //   try {
  //     let hasC = false;
  //     let hasB = false;
  //     let hasP = false;

  //     for (const row of accounts) {
  //       if (!row.ledgerID) {
  //         break;
  //       }

  //       const checkStatus = row.chequeStatus;

  //       if (checkStatus === "C") hasC = true;
  //       else if (checkStatus === "B") hasB = true;
  //       else if (checkStatus === "P") hasP = true;
  //     }

  //     if (hasC && hasP) {
  //       return false;
  //     }

  //     return true;
  //   } catch (error: any) {
  //     console.error("Error validating status:", error);
  //     alert(error.message);
  //     return false;
  //   }
  // };
  const getFirstDebitCreditLedgerIDs = (transaction: any) => {
    let firstDebitLedgerID = 0;
    let firstCreditLedgerID = 0;

    if (transaction.master.voucherType === "MJV") {
      for (const row of transaction.details) {
        const ledgerID = Number(row.ledgerID || 0);

        if (Number(row.debit) > 0) {
          if (firstDebitLedgerID === 0) {
            firstDebitLedgerID = ledgerID;
          }
        } else {
          if (firstCreditLedgerID === 0) {
            firstCreditLedgerID = ledgerID;
          }
        }

        // Stop if we found both
        if (firstDebitLedgerID > 0 && firstCreditLedgerID > 0) {
          break;
        }
      }
    }

    return { firstDebitLedgerID, firstCreditLedgerID };
  };

  const preSave = async () => {
    if (
      formState.isEdit &&
      formState.userConfig?.mnuShowConfirmationForEditOnAccounts == true
    ) {
      ERPAlert.show({
        icon: "info",
        title: t("are_you_sure_to_modify"),
        onCancel() {
          return false;
        },
        onConfirm: async () => {
          // Make this an async function
          await save();
        },
      });
    } else {
      await save();
    }
  };
  const save = async () => {
    dispatch(
      formStateHandleFieldChange({
        fields: {
          saving: true,
        },
      })
    );

    const valid = await validate();

    if (valid == true) {
      const master = attachMaster(formState);
      const attachments = formState.transaction.attachments
        ?.filter((x) => x.id > 0)
        ?.map((x) => ({
          aType: x.aType,
          attachmentId: x.id,
          fileName: x.name,
          key: x.key,
          type: x.type,
        }));
      const dtRes = attachDetails(
        formState.transaction.details.filter(
          (x: TransactionDetail) => x.productID > 0
        ),
        formState.transaction.master.voucherForm,
        formState.transaction.master.transactionDate,
        formState.transaction.master.ledgerID,
        formState.transaction.master.fromWarehouseID,
        formState.transaction.master.stockUpdate
      );
      if (dtRes.hasError) {
        ERPAlert.show({
          icon: "warning",
          title: "Failed",
          text: dtRes.errors.join(", "),
        });
        return false;
      }
      const params = {
        master: {
          ...master,
          transactionDate:
            master.transactionDate == "" ? null : master.transactionDate,
        },
        details: dtRes.outputDetails,
        attachments: attachments,
      };

      const saveRes =
        formState.transaction.master.invTransactionMasterID > 0
          ? await api.putAsync(
              `${Urls.inv_transaction_base}${transactionType}`,
              params
            )
          : await api.postAsync(
              `${Urls.inv_transaction_base}${transactionType}`,
              params
            );
      if (saveRes.isOk == true) {
        dispatch(
          formStateTransactionUpdate({
            key: "masterValidations",
            value: undefined,
          })
        );
        if (formState.printOnSave == true) {
          printVoucher();
        }

        ERPToast.show(saveRes.message, "success");
      } else {
        // dispatch(acc)
        ERPAlert.show({
          icon: "warning",
          title: saveRes.message,
        });

        dispatch(
          formStateTransactionUpdate({
            key: "attachments",
            value: saveRes.item.attachments,
          })
        );
        dispatch(
          formStateTransactionUpdate({
            key: "masterValidations",
            value: saveRes.validations,
          })
        );
      }

      dispatch(
        formStateHandleFieldChange({
          fields: {
            saving: false,
          },
        })
      );
    }
  };
  const clearRow = async (isEdit: boolean, transactionMasterID: number) => {
    await undoEditMode(isEdit, transactionMasterID);
    dispatch(
      clearState({
        userSession,
        applicationSettings,
        softwareDate,
        defaultCostCenterID:
          applicationSettings.accountsSettings?.defaultCostCenterID,
        counterwiseCashLedgerId: 0,
        allowSalesCounter: 0,
        voucherNo: 0,
        rowOnly: true,
      })
    );
  };
  const clearControls = async (
    isEdit: boolean,
    transactionMasterID: number
  ) => {
    // await undoEditMode(isEdit, transactionMasterID);
    // const vNo = await getNextVoucherNumber(
    //   formState.transaction.master.formType,
    //   formState.transaction.master.voucherType,
    //   formState.transaction.master.voucherPrefix,
    //   false
    // );

    // dispatch(
    //   clearState({
    //     userSession,
    //     applicationSettings,
    //     softwareDate,
    //     defaultCostCenterID:
    //       applicationSettings.accountsSettings?.defaultCostCenterID,
    //     counterwiseCashLedgerId: 0,
    //     allowSalesCounter: 0,
    //     voucherNo: vNo,
    //   })
    // );
    // Reset combobox specific states
    // dispatch(
    //   formStateRowHandleFieldChange({
    //     fields: {
    //       ledgerID: null,
    //       ledgerCode: "",
    //       costCentreID: 2,
    //     },
    //   })
    // );

    // Force reload combobox data
    dispatch(
      updateFormElement({
        fields: {},
      })
    );
  };
  const handleRemoveItem = async (index: number) => {
    dispatch(
      formStateTransactionDetailsRowRemove({
        index: index,
        applicationSettings: applicationSettings,
        clearEntryControl,
      })
    );
  };
  const addOrEditRow = async (
    billwiseDetails?: string,
    totalAmount?: number
  ) => {
    // if (applicationSettings.accountsSettings?.billwiseMandatory) {
    //   if (!isNullOrUndefinedOrZero(formState.row.ledgerID)) {
    //     let _drCr = getDrCr(formState.transaction.master.voucherType);
    //     if (formState.isRowEdit != true) {
    //       if (
    //         (billwiseDetails == undefined || billwiseDetails == null) &&
    //         formState.row.billwiseDetails == "" &&
    //         !formState.isTaxOnExpense
    //       ) {
    //         if (formState.IsBillwiseTransAdjustmentExists) {
    //           dispatch(
    //             formStateHandleFieldChange({
    //               fields: {
    //                 showbillwise: true,
    //                 billwiseDrCr: _drCr,
    //               },
    //             })
    //           );
    //           return false;
    //         }
    //       }
    //       dispatch(
    //         formStateHandleFieldChange({
    //           fields: { showbillwise: false, billwiseData: [] },
    //         })
    //       );
    //     } else {
    //       if (
    //         formState.formElements.amount.disabled == false &&
    //         formState.IsBillwiseTransAdjustmentExists == true &&
    //         !formState.isTaxOnExpense
    //       ) {
    //         dispatch(
    //           formStateHandleFieldChange({
    //             fields: {
    //               showbillwise: true,
    //               billwiseDrCr: _drCr,
    //             },
    //           })
    //         );
    //         return false;
    //       }
    //       dispatch(
    //         formStateHandleFieldChange({
    //           fields: { showbillwise: false, billwiseData: [] },
    //         })
    //       );
    //     }
    //   }
    // }
    // if (isNullOrUndefinedOrZero(formState.row.ledgerID)) {
    //   ERPAlert.show({
    //     icon: "warning",
    //     title: t("please_select_ledger"),
    //     onConfirm() {
    //       focusLedgerCombo();
    //       return false;
    //     },
    //     onCancel() {
    //       return false;
    //     },
    //   });
    //   return false;
    // }
    // const fdd = isNullOrUndefinedOrZero(totalAmount ?? formState.row.amount);
    // const fdsdd = isNullOrUndefinedOrZero(
    //   formState.transaction.master.totalAmount
    // );
    // if (
    //   isNullOrUndefinedOrZero(totalAmount ?? formState.row.amount) &&
    //   !isNullOrUndefinedOrZero(formState.transaction.master.totalAmount)
    // ) {
    //   if (hasRight(formState.formCode, UserAction.Add)) {
    //     dispatch(
    //       updateFormElement({
    //         fields: {
    //           btnSave: {
    //             disabled: false,
    //             label: t("add"),
    //           },
    //         },
    //       })
    //     );
    //   }
    //   ERPAlert.show({
    //     title: t("are_you_sure_save_now"),
    //     icon: "warning",
    //     confirmButtonText: t("save_now"),
    //     cancelButtonText: t("cancel"),
    //     onConfirm: (result: any) => {
    //       if (result.isConfirmed) {
    //         save();
    //         return false;
    //       }
    //     },
    //     onCancel: () => {
    //       focusLedgerCode();
    //       return false;
    //     },
    //   });
    // }
    // if (isNullOrUndefinedOrZero(totalAmount ?? formState.row.amount)) {
    //   ERPAlert.show({
    //     icon: "info",
    //     onCancel: () => {
    //       focusAmount();
    //       return false;
    //     },
    //     title: t("enter_the_amount"),
    //     onConfirm: (result: any) => {
    //       focusAmount();
    //       return false;
    //     },
    //   });
    //   return false;
    // }
    // if (
    //   !["OB", "MJV"].includes(formState.transaction.master.voucherType) &&
    //   isNullOrUndefinedOrZero(formState.masterAccountID)
    // ) {
    //   ERPAlert.show({
    //     icon: "info",
    //     // title: t("select_master_account"),
    //     title: "Please Select " + formState.formElements.masterAccount.label,
    //   });
    //   focusMasterAccount();
    //   return false;
    // }
    // if (
    //   isNullOrUndefinedOrZero(formState.row.costCentreID) &&
    //   formState.formElements.costCentreID.visible == true
    // ) {
    //   ERPAlert.show({
    //     icon: "info",
    //     title: t("select_cost_center"),
    //   });
    //   focusCostCenterRef();
    //   return false;
    // }
    // if (
    //   formState.formElements.costCentreID.visible == false &&
    //   (applicationSettings.accountsSettings.maintainBillwiseAccount == true ||
    //     applicationSettings.accountsSettings.billwiseMandatory == true)
    // ) {
    //   formState.formElements.amount.disabled = false;
    // }
    // formState.formElements.btnAdd;
    // const costCentreName =
    //   formState.row.costCentreID ?? 0 > 0
    //     ? dataContainer.costCentres?.find(
    //         (x) => x.id == formState.row.costCentreID
    //       )?.name
    //     : "";
    // dispatch(
    //   formStateTransactionDetailsRowAdd({
    //     row: {
    //       ...formState.row,
    //       costCentreName: costCentreName,
    //       ledgerName:
    //         formState.row.ledgerName == undefined ||
    //         formState.row.ledgerName == null ||
    //         formState.row.ledgerName == ""
    //           ? dataContainer.ledgers?.find(
    //               (x) => x.id == formState.row.ledgerID
    //             )?.name
    //           : formState.row.ledgerName,
    //       amount: totalAmount ?? formState.row.amount,
    //       billwiseDetails:
    //         billwiseDetails != undefined
    //           ? billwiseDetails
    //           : formState.row.billwiseDetails,
    //     },
    //     applicationSettings: applicationSettings,
    //     exchangeRate: formState.transaction.master.currencyRate ?? 1,
    //     isForeignCurrencyEnabled: formState.foreignCurrency,
    //     userSession: userSession,
    //   })
    // );
    // const updatedFields: Record<string, any> = {
    //   employee: { disabled: true },
    //   jvDrCr: { disabled: true },
    //   masterAccount: { disabled: true },
    //   // referenceNumber: { disabled: true },
    //   referenceDate: { disabled: true },
    //   transactionDate: { disabled: true },
    //   btnEdit: { visible: true },
    //   amount: { disabled: false },
    //   linkEdit: { visible: true },
    // };
    // // Conditionally update costCentreID if needed
    // if (formState.userConfig?.presetCostenterId ?? 0 > 0) {
    //   updatedFields.costCentreID = { disabled: true };
    // }
    // // Dispatch the updateFormElement action
    // dispatch(
    //   updateFormElement({
    //     fields: updatedFields,
    //   })
    // );
    // focusLedgerCombo();
  };

  interface RowClickHandlerParams {
    row: any;
  }
  const getDrCr = (voucherType: string) => {
    // switch (voucherType) {
    //   case "CP":
    //   case "CPE":
    //   case "BP":
    //   case "DN":
    //   case "CQP":
    //   case "SV":
    //   case "SRV":
    //   case "PBP":
    //     return "Dr";
    //   case "CR":
    //   case "CRE":
    //   case "BR":
    //   case "CN":
    //   case "CQR":
    //   case "PV":
    //   case "PBR":
    //     return "Cr";
    //     break;
    //   case "OB":
    //   case "MJV":
    //     if (formState.row.drCr == "Dr") {
    //       return "Dr";
    //     } else {
    //       return "Cr";
    //     }
    //     break;
    //   case "JV":
    //   case "JVSP":
    //     if (formState.transaction.master.drCr == "Dr") {
    //       return "Cr";
    //     } else {
    //       return "Dr";
    //     }
    // }
  };
  const handleRowClick = async ({ row }: RowClickHandlerParams) => {
    // try {
    //   // Check PDC validation first
    //   if (row?.transactionDetailID) {
    //     const isPDCValid = await validatePDC(row?.transactionDetailID);
    //     if (isPDCValid) {
    //       ERPAlert.show({
    //         title: t("warning"),
    //         text: t("can't_edit"),
    //         icon: "warning",
    //       });
    //       // clearControls(formState.isEdit, formState.transaction.master.transactionMasterID);
    //       dispatch(
    //         updateFormElement({
    //           fields: {
    //             btnSave: { disabled: true },
    //             btnAdd: { disabled: true },
    //           },
    //         })
    //       );
    //       return;
    //     }
    //   }
    //   // Handle empty row
    //   if (!row) {
    //     // clearControls();
    //     return;
    //   }
    //   // Enable buttons
    //   dispatch(
    //     updateFormElement({
    //       fields: {
    //         btnSave: { disabled: false },
    //         btnAdd: { disabled: false, label: t("modify") },
    //       },
    //     })
    //   );
    //   // Update row data in form state
    //   dispatch(
    //     formStateHandleFieldChange({
    //       fields: {
    //         row: {
    //           ...row,
    //           // amount: row.amountFC?.toString() || row.amount?.toString() || "0",
    //         },
    //       },
    //     })
    //   );
    //   let transDetailsID = row.transactionDetailID;
    //   // Handle special voucher type cases
    //   if (
    //     ["CR", "BR", "CN", "CQR", "PBR", "JV"].includes(
    //       formState.transaction.master.voucherType
    //     )
    //   ) {
    //     if (formState.isEdit && transDetailsID > 0) {
    //       transDetailsID = transDetailsID + 1;
    //     }
    //   } else if (formState.transaction.master.voucherType === "OB") {
    //     if (formState.isEdit && transDetailsID > 0 && row.drCr === "Cr") {
    //       transDetailsID = transDetailsID + 1;
    //     }
    //   }
    //   // Update row edit state
    //   dispatch(
    //     formStateHandleFieldChange({
    //       fields: {
    //         isRowEdit: true,
    //         transDetailsID: transDetailsID,
    //       },
    //     })
    //   );
    // } catch (error) {
    //   console.error("Row click handler error:", error);
    //   ERPAlert.show({
    //     title: t("error"),
    //     text: t("error_occurred"),
    //     icon: "error",
    //   });
    // }
  };
  const handleFieldKeyDown = async (
    field: string,
    key: any,
    gridRef?: any,
    applicationSettings?: ApplicationSettingsType
  ) => {
    // if (field === "test") {
    //   focusLedgerCombo();
    // } else if (field === "grid") {
    //   handleGridKeyDown(key, gridRef, applicationSettings);
    // } else if (field === "ledgerCode") {
    //   handleLedgerCodeKeyDown(key);
    // } else if (field === "amount") {
    //   handleAmountKeyDown(key);
    // } else if (field === "drCr") {
    //   handleDrCrKeyDown(key);
    // } else if (field === "costCentre") {
    //   if (key == "Enter") {
    //     if (formState.isTaxOnExpense) {
    //       focusPartName();
    //     } else {
    //       focusBtnAdd();
    //     }
    //   }
    // } else if (field === "invoiceDate") {
    //   if (key == "Enter") {
    //     focusTaxableAmount();
    //   }
    // } else if (field === "voucherNumber") {
    //   handleVoucherNumberKeyUp(key);
    // } else if (field === "narration") {
    //   handleNarrationKeyDown(key);
    // } else if (field === "employee") {
    //   handleEmployeeKeyDown(key);
    // } else if (field === "ledgerID") {
    //   handleLedgerIdKeyDown(key);
    // } else if (field === "btnPartySearch") {
    //   if (key == "Enter") {
    //     if (isNullOrUndefinedOrEmpty(formState.row.partyName)) {
    //       dispatch(
    //         formStateHandleFieldChange({
    //           fields: { showPartySelection: true },
    //         })
    //       );
    //     }
    //   }
    // } else if (field === "bankDate") {
    //   if (isEnterKey(key)) {
    //     if (
    //       clientSession.isAppGlobal &&
    //       ["CQP", "CQR"].includes(formState.transaction.master.voucherType)
    //     ) {
    //       focusChequeStatus();
    //     } else {
    //       let _drCr = getDrCr(formState.transaction.master.voucherType);
    //       dispatch(
    //         formStateHandleFieldChange({
    //           fields: { showbillwise: true, billwiseDrCr: _drCr },
    //         })
    //       );
    //       // await showBillwise()
    //     }
    //   }
    // } else if (field === "commonNarration") {
    //   if (isEnterKey(key)) {
    //     if (
    //       clientSession.isAppGlobal &&
    //       (formState.transaction.master.voucherType == "CQP" ||
    //         formState.transaction.master.voucherType == "CQR")
    //     ) {
    //       try {
    //         addOrEditRow();
    //       } catch (error) {
    //         return false;
    //       }
    //     } else {
    //       focusLedgerCode();
    //     }
    //   }
    // }
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
        title: t("confirm_delete"),
        text: t("you_want_to_delete"),
        icon: "warning",
        confirmButtonText: t("delete_it"),
        onConfirm: () => {
          const dataGridInstance = gridRef.current.instance(); // Access DataGrid instance
          const focusedRowIndex = dataGridInstance.option("focusedRowIndex");
          dispatch(
            formStateTransactionDetailsRowRemove({
              applicationSettings: applicationSettings,
              index: focusedRowIndex,
              clearEntryControl,
            })
          );
        },
      });
    }
  };

  // Ledger code keydown handler
  // const handleLedgerCodeKeyDown = async (e: any) => {
  //   if (e === "Enter" || e === "Tab") {
  //     try {
  //       const response = await api.getAsync(
  //         `${Urls.get_ledgerId_by_code}${
  //           formState.row.ledgerCode == undefined ||
  //           formState.row.ledgerCode === ""
  //             ? 0
  //             : formState.row.ledgerCode
  //         }`
  //       );

  //       if (response && response > 0) {
  //         dispatch(
  //           formStateRowHandleFieldChange({
  //             fields: {
  //               ledgerID: response,
  //             },
  //           })
  //         );
  //         focusAmount();
  //       } else {
  //         dispatch(
  //           formStateRowHandleFieldChange({
  //             fields: {
  //               ledgerID: null,
  //             },
  //           })
  //         );
  //         focusLedgerCombo();
  //       }
  //     } catch (error) {
  //       console.error("Error fetching ledger:", error);
  //     }
  //   }
  // };

  // const handleLedgerIdKeyDown = async (id: any) => {
  //   if (id > 0) {
  //     setTimeout(() => {
  //       focusAmount();
  //     }, 0);
  //   }
  // };

  // // Amount keydown handler
  // const handleAmountKeyDown = (e: any) => {
  //   if (e === "Enter") {
  //     const voucherType = formState.transaction.master.voucherType;
  //     if (voucherType !== "OB" && voucherType !== "MJV") {
  //       focusNarration();
  //     } else {
  //       focusDrCr();
  //     }
  //   }
  // };

  // // DrCr keydown handler
  // const handleDrCrKeyDown = (e: any) => {
  //   if (
  //     e === "Enter" &&
  //     (formState.row.drCr == "Dr" || formState.row.drCr == "Cr")
  //   ) {
  //     const voucherType = formState.transaction.master.voucherType;

  //     if (formState.formElements.costCentreID.visible == true) {
  //       focusCostCenterRef();
  //     } else {
  //       focusBtnAdd();
  //     }
  //   }
  // };
  // const handleEmployeeKeyDown = (e: any) => {
  //   // Handle Enter key
  //   focusLedgerCode();
  // };
  // const handleNarrationKeyDown = (e: any) => {
  //   // Handle Enter key
  //   if (e === "Enter") {
  //     const isChequeVoucher =
  //       formState.transaction.master.voucherType === "CQP" ||
  //       formState.transaction.master.voucherType === "CQR";
  //     const isPaymentReceipt =
  //       formState.transaction.master.voucherType === "BP" ||
  //       formState.transaction.master.voucherType === "BR";

  //     if (
  //       applicationSettings.accountsSettings?.maintainBillwiseAccount &&
  //       formState.formElements.btnBillWise.visible == true
  //     ) {
  //       if (
  //         (clientSession.isAppGlobal == true && !isChequeVoucher) ||
  //         (clientSession.isAppGlobal != true &&
  //           !isPaymentReceipt &&
  //           !isChequeVoucher)
  //       ) {
  //         let _drCr = getDrCr(formState.transaction.master.voucherType);

  //         dispatch(
  //           formStateHandleFieldChange({
  //             fields: { showbillwise: true, billwiseDrCr: _drCr },
  //           })
  //         );
  //       } else {
  //         focusChequeNumber();
  //       }

  //       if (isChequeVoucher) {
  //         focusChequeNumber();
  //       }
  //     } else {
  //       if (
  //         (clientSession.isAppGlobal == true && isChequeVoucher) ||
  //         (clientSession.isAppGlobal != true &&
  //           (isPaymentReceipt || isChequeVoucher))
  //       ) {
  //         focusChequeNumber();
  //       } else {
  //         if (
  //           applicationSettings.accountsSettings?.maintainCostCenter &&
  //           formState.formElements.costCentreID.visible == true &&
  //           (formState.userConfig?.presetCostenterId ?? 0) <= 0
  //         ) {
  //           focusCostCenterRef();
  //         } else {
  //           focusBtnAdd();
  //         }
  //       }
  //     }
  //     // Final check for cheque vouchers
  //     if (isChequeVoucher) {
  //       focusChequeNumber();
  //     }
  //   }
  //   // Handle Down arrow key
  //   else if (e.key === "ArrowDown") {
  //     if (formState.previousNarration) {
  //       // Update narration with previous value
  //       formState.row.narration = formState.previousNarration;
  //     }
  //   }
  // };

  // Voucher number navigation handlers
  const handleVoucherNumberKeyUp = async (e: any) => {
    const currentNumber = Number(formState.transaction.master.voucherNumber);

    if (e == "ArrowDown" || e == "ArrowUp" || e == "Enter") {
      if (currentNumber > 0) {
        await loadAndSetTransVoucher(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          e == "ArrowDown"
            ? "decrement"
            : e == "ArrowUp"
            ? "increment"
            : undefined,
          true
        );
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
          referenceNumber: { disabled: false },
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
      undefined,
      hasBlockedRight
    );
    if (!validateTransactionDateRes.valid) {
      ERPAlert.show({
        title: t("warning"),
        text: validateTransactionDateRes.message,
        icon: "warning",
      });
    }
    if (formState.transaction.master.isLocked) {
      ERPAlert.show({
        title: t("warning"),
        text: t("voucher_is_locked"),
        icon: "warning",
      });
      return;
    }
    try {
      const result = await api.postAsync(
        `${Urls.inv_transaction_base}${transactionType}/GetAndSetTransactionEditMode`,
        {
          transactionType: "I",
          transactionMasterId:
            formState.transaction.master.invTransactionMasterID ?? 0,
        }
      );
      if (result?.isOk == true) {
        dispatch(
          formStateHandleFieldChange({
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
          title: t("voucher_in_use"),
          text: `This Voucher is already in use by ${editInfo[1]} on system ${editInfo[0]} at ${editInfo[2]}`,
          icon: "warning",
        });
      }
    } catch (error) {
      console.error("Error handling edit:", error);
    }
  };

  // Delete button handler
  const deleteTransVoucher = async () => {
    // if (formState.transaction.master?.isLocked) {
    //   ERPAlert.show({
    //     title: t("warning"),
    //     text: t("voucher_is_locked"),
    //     icon: "warning",
    //   });
    //   return;
    // }
    // if (
    //   clientSession.isAppGlobal &&
    //   (formState.transaction.master.voucherType === "CQP" ||
    //     formState.transaction.master.voucherType === "CQR")
    // ) {
    //   const isCleared =
    //     formState.transaction.details.filter((x) => x.chequeStatus == "C")
    //       .length > 0;
    //   const isBounced =
    //     formState.transaction.details.filter((x) => x.chequeStatus == "B")
    //       .length > 0;
    //   if (isCleared) {
    //     ERPAlert.show({
    //       title: t("warning"),
    //       text: t("cleared_pdc_cannot_be_modified"),
    //       icon: "warning",
    //     });
    //     return false;
    //   } else if (isBounced) {
    //     ERPAlert.show({
    //       title: t("warning"),
    //       text: t("Bounced PDC Cannot be Modified"),
    //       icon: "warning",
    //     });
    //     return false;
    //   }
    // }
    // ERPAlert.show({
    //   title: t("confirm_delete"),
    //   text: t("delete_this_voucher"),
    //   icon: "warning",
    //   confirmButtonText: t("delete_it"),
    //   onConfirm: async () => {
    //     try {
    //       if (formState.transaction?.master?.transactionMasterID > 0) {
    //         const res = await appDispatch(
    //           deleteAccVoucher({
    //             transactionMasterID:
    //               formState.transaction?.master?.transactionMasterID,
    //             transactionType: transactionType,
    //           })
    //         ).unwrap();
    //         if (res != undefined && res.isOk != true) {
    //           ERPAlert.show({
    //             title: t("failed"),
    //             text: res.message,
    //             onConfirm: () => {
    //               return false;
    //             },
    //           });
    //         } else if (res?.isOk == true) {
    //           ERPAlert.show({
    //             icon: "success",
    //             title: t("deleted"),
    //             text: res.message,
    //           });
    //           clearControls(
    //             formState.isEdit,
    //             formState.transaction.master.transactionMasterID
    //           );
    //         }
    //       }
    //     } catch (error) {
    //       console.error("Error deleting voucher:", error);
    //     }
    //   },
    // });
  };
  const handleLoadByRefNo = useCallback(async () => {
    if (formState.transaction.master.purchaseInvoiceDate) {
      await loadAndSetTransVoucher(
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        formState.transaction.master.purchaseInvoiceNumber,
        undefined,
        undefined,
        true
      );
    }
  }, [formState.transaction.master.purchaseInvoiceNumber]);

  const handleRefresh = async () => {
    try {
      // const currentLedgerId = formState.row.ledgerID;
      // const currentMasterAccountId = formState.masterAccountID;

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
        formStateHandleFieldChange({
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
      // dispatch(formStateClearBillWiseInDetails());

      // Get new voucher details
      const selectVoucherData = await selectVoucherForms(
        formState.transaction.master.voucherType
      );

      const lastPrefix = selectVoucherData
        ? selectVoucherData[0].lastPrefix
        : "";
      const getVoucherNumber = await getNextVoucherNumber(
        formState.transaction.master.voucherForm,
        formState.transaction.master.voucherType,
        formState.transaction.master.voucherType,
        false
      );

      dispatch(
        formStateTransactionMasterHandleFieldChange({
          fields: {
            // voucherPrefix: lastPrefix,
            voucherNumber: getVoucherNumber,
            // transactionMasterID: 0,
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
    // try {
    //   await appDispatch(
    //     unlockTransactionMaster(
    //       formState.transaction.master.transactionMasterID
    //     )
    //   );
    // } catch (error) {
    //   console.error("Error creating new voucher:", error);
    //   // Handle error appropriately
    // }
  };

  const handleTextDataChange = (
    value: any,
    columnName: string,
    rowIndex: number
  ) => {
    try {
      console.log("handleTextDataChange");
      debugger;
      if (!formState.transaction?.details?.[rowIndex]) {
        return false;
      }

      const detail = { ...formState.transaction.details[rowIndex] };
      let outState: DeepPartial<TransactionFormState> = {
        transaction: { details: [{ [columnName]: value, slNo: detail.slNo }] },
      };
      const outDetail: DeepPartial<TransactionDetail> = { slNo: detail.slNo };
      if (detail == undefined) {
        return;
      }

      let calculateSummaryAndTotal = false;
      if (columnName === "unitPriceFC") {
        if (formState.transaction.master.voucherForm === "Import") {
          outDetail.unitPriceFC = value;
          const unitPriceFC = Number(outDetail.unitPriceFC || 0);
          const qty = Number(detail.qty || 0);
          const exchangeRate = Number(
            formState.transaction.master.exchangeRate || 1
          );

          outDetail.unitPrice = round(unitPriceFC * exchangeRate, 4);
          outDetail.grossFC = round(unitPriceFC * qty, 3);
          outState = calculateRowAmount(
            Object.assign(detail, outDetail),
            columnName,
            {
              result: {
                transaction: {
                  details: [outDetail],
                },
              },
            },
            true
          );
          calculateSummaryAndTotal = true;
        }
      } else if (columnName === "qty" || columnName === "unitPrice") {
        
debugger;
        outDetail[columnName] = value;
        // Calculate row amount
        outState = calculateRowAmount(
          Object.assign(detail, outDetail),
          columnName,
          {
            result: {
              transaction: {
                details: [outDetail],
              },
            },
          },
          true
        );
        calculateSummaryAndTotal = true;
      } else if (columnName === "margin") {
        outDetail.margin = value;
        outState.transaction?.details?.push(outDetail);
      } else if (columnName === "salesPrice") {
        outDetail.salesPrice = value;
        const sp = Number(outDetail.salesPrice || 0);
        const netAmount = Number(detail.total || 0);
        let qty = Number(detail.qty || 0);

        if (qty === 0) qty = 1;
        const cost = netAmount / qty;

        let marginPerc = 0;
        if (cost !== 0) {
          marginPerc = (sp / cost - 1) * 100;
        }

        outDetail.margin = round(marginPerc, 6);
        outState.transaction!.details = [outDetail];
      }
debugger;
      if (calculateSummaryAndTotal) {
        const details = [...formState.transaction.details];
        let final = { ...detail, ...outState!.transaction!.details![0] };
        details[rowIndex] = final;
        const summaryRes = calculateSummary(details, formState, { result: {} });

        const totalRes = calculateTotal(
          formState.transaction.master,
          summaryRes.summary as SummaryItems,
          formState.formElements,
          { result: {} }
        );
        if (totalRes) {
          totalRes.summary = summaryRes.summary;
          totalRes.transaction = totalRes.transaction ?? {};
          totalRes.transaction.details = outState?.transaction
            ?.details as TransactionDetail[];
        }
        outState = totalRes;
      } 
      dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: outState,
            updateOnlyGivenDetailsColumns: true,
            rowIndex: rowIndex,
          })
        );
    } catch (error) {
      console.error("Error in handleTextDataChange:", error);
    } finally {
    }
  };
  const loadProductDetailsByAutoBarcode = async (
    data: LoadProductDetailsByAutoBarcodeProps,
    commonParams: CommonParams
  ): Promise<DeepPartial<TransactionFormState> | null> => {
    let { result } = commonParams;

    try {
      let detail = data.detail;
      let outDetail: DeepPartial<TransactionDetail> = {};

      outDetail.slNo = detail.slNo;
      outDetail.warehouseID = detail.warehouseID;
      outDetail.salesPrice = detail.salesPrice;
      outDetail.unitID = detail.unitID;
      outDetail.productBatchID = detail.productBatchID;
      if (!detail) {
        return {};
      }
      let warehouseId = 1;
      if (applicationSettings?.inventorySettings?.maintainWarehouse === true) {
        warehouseId = formState.transaction.master.fromWarehouseID;
      }
      if (applicationSettings?.productsSettings?.enableMultiWarehouseBilling) {
        const detailWarehouseId = outDetail.warehouseID;
        if (detailWarehouseId ?? 0 > 0) {
          warehouseId = detailWarehouseId ?? 0;
        }
      }
      const _lastSelectedWarehouseIDOfItemPopupsSearch = (() => {
        try {
          const stored = localStorage.getItem(
            "lastSelectedWarehouseIDOfItemPopupsSearch"
          );
          return stored ? Number(stored) || 0 : 0;
        } catch (error) {
          console.warn("Failed to read from localStorage:", error);
          return 0;
        }
      })();

      let payload = {
        useProductCode: data.useProductCode,
        productCode: data.productCode,
        barCode: data.autoBarcode,
        wareHouseId: warehouseId,
        txtData: data.searchText,
        partyId: formState.transaction.master.ledgerID,
        isCheckUseSupplierProductCode:
          formState.userConfig?.useSupplierProductCode,
        isActualPriceVisible: formState.gridColumns?.find(
          (x) => x.dataField == "actualSalesPrice"
        )?.visible,
        isStockDetailsVisible: formState.gridColumns?.find(
          (x) => x.dataField == "stockDetails"
        )?.visible,
        lastSelectedWareHouseIdOfItemPopUpsSearch:
          _lastSelectedWarehouseIDOfItemPopupsSearch,
      };
      const queryParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, value as any);
        }
      });
      const res: DataAutoBarcode = await api.getAsync(
        `${
          Urls.inv_transaction_base
        }${transactionType}/LoadProductDetailsByAutoBarCode?${queryParams.toString()}`
      );

      if (res?.isShowItemPopUp) {
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              formElements: {
                productSearchPopupWindow: {
                  visible: true,
                  data: {
                    searchColumn: data.searchColumn,
                    rowIndex: data.rowIndex,
                    searchCriteria: data.useProductCode ? "pCode" : "product",
                    searchText: data.searchText,
                    voucherType: formState.transaction.master.voucherType,
                    warehouseId: 1,
                  },
                },
              },
            },
          })
        );
      } else if (res?.products?.length === 1) {
        let product = res.products[0];
        outDetail.pCode = product.productCode;
        outDetail.product = product.productName;
        outDetail.productID = product.productID;
        outDetail.barCode = product.autoBarcode;
        outDetail.manualBarcode = product.manualBarcode;
        outDetail.productBatchID = product.productBatchID;

        // Set default quantity if configured
        if (applicationSettings?.productsSettings?.setDefaultQty1) {
          outDetail.qty = 1;
        }

        outDetail.unit = product.unitName;
        outDetail.unitID = product.basicUnitID;
        outDetail.brandID = product.brandID;
        outDetail.brand = product.brandName;
        outDetail.size = product.specification;
        outDetail.batchNo = product.batchNo;
        outDetail.expDate = product.expiryDate;
        outDetail.expDays = 100;
        outDetail.mfdDate = product.mfgDate;
        outDetail.lpc = round(product.lastPurchaseCost || 0);
        outDetail.lpr = round(product.lastPurchaseRate || 0);
        outDetail.stock = product.stock;
        outDetail.productDescription = product.serialNumber;
        outDetail.warranty = product.warranty;
        outDetail.location = product.location;
        outDetail.arabicName = product.itemNameinSecondLanguage;
        outDetail.colour = product.colour;
        outDetail.multiFactor = product.multiFactor;

        // Handle Unit2 barcode
        if (product.isUnit2BarCode) {
          outDetail.unit = product.unit2;
          outDetail.unitID = product.unit2ID;
          outDetail.unitPrice = Number(product.stdPurchasePrice || 0);
        }

        // Handle Unit3 barcode
        if (product.isUnit3BarCode) {
          outDetail.unit = product.unit3;
          outDetail.unitID = product.unit3ID;
          outDetail.unitPrice = Number(product.stdPurchasePrice || 0);
        }

        // Unit 2 information
        outDetail.unitID2 = product.unit2ID;
        outDetail.unit2Qty = product.unit2Qty;
        outDetail.unit2MBarcode = product.unit2Barcode;
        outDetail.unit2SalesRate = product.unit2SalesPrice;
        outDetail.unit2MRP = product.unit2MRP;

        // Unit 3 information
        outDetail.unitID3 = product.unit3ID;
        outDetail.unit3Qty = product.unit3Qty;
        outDetail.unit3MBarcode = product.unit3Barcode;
        outDetail.unit3SalesRate = product.unit3SalesPrice;
        outDetail.unit3MRP = product.unit3MRP;

        // Handle supplier reference code
        if (formState.userConfig?.useSupplierProductCode) {
          outDetail.supplierReferenceProductCode =
            product.supplierReferenceProductCode;
        }

        // Handle default purchase unit
        if (
          Number(product.defPurchaseUnitID || 0) > 0 &&
          !product.isMultiUnitBarCode &&
          product.basicUnitID !== product.defPurchaseUnitID &&
          product.isBasicUnitBarcode
        ) {
          if (!isNullOrUndefinedOrEmpty(product.defUnitName)) {
            outDetail.unit = product.defUnitName;
            outDetail.multiFactor = product.defUnitMultiFactor;
          }
          outDetail.unitID = product.defPurchaseUnitID;
        }

        // Handle stock details if visible
        if (payload.isStockDetailsVisible) {
          outDetail.stockDetails = product.stockDetails;
        }

        // Set MRP
        outDetail.mrp = round(product.mrp);

        // Calculate pricing based on multi-factor
        if (outDetail.multiFactor > 0) {
          const pPrice = Number(product.stdPurchasePrice || 0);
          outDetail.unitPrice = pPrice * outDetail.multiFactor;

          const sPrice = Number(product.stdSalesPrice || 0);
          outDetail.salesPrice = sPrice * outDetail.multiFactor;

          const minSPrice = Number(product.minSalePrice || 0);
          outDetail.minSalePrice = minSPrice * outDetail.multiFactor;
        } else {
          outDetail.unitPrice = Number(product.stdPurchasePrice || 0);
          outDetail.salesPrice = round(product.stdSalesPrice || 0);
          outDetail.minSalePrice = Number(product.minSalePrice || 0);
        }

        // Handle actual sales price if column is visible
        if (payload.isActualPriceVisible) {
          outDetail.actualSalesPrice = product.actualSalesPrice;
        }

        // Handle listed product prices
        if (product.hasListedProductPrice) {
          outDetail.unitPrice = product.listedProductPrice;
        }

        // Handle VAT and CST based on form type
        if (formState.transaction.master.voucherForm === "VAT") {
          outDetail.vatPerc = Number(product.pVatPerc || 0);
          outDetail.cstPerc = Number(product.purchaseExciseTaxPerc || 0);
        } else {
          outDetail.vatPerc = 0;
          outDetail.cstPerc = 0;
        }

        // Special handling for meter units
        const unitName = product.unitName?.toUpperCase().trim();
        if (unitName === "MTR" || unitName === "MTRS" || unitName === "METER") {
          outDetail.stickerQty = 4;
        }

        // Handle empty form type
        if (formState.transaction.master.voucherForm == "") {
          outDetail.vatPerc = 0;
        }

        // Set row header
        outDetail.unitPriceTag = outDetail.unitPrice;
        if (!result.transaction) {
          result.transaction = {};
        }
        result.transaction.details = [outDetail];

        // Update UI state for button enabling
        result.formElements = {
          ...result.formElements,
          btnSave: {
            disabled:
              !hasRight(formState.userRightsFormCode, UserAction.Add) ||
              applicationSettings?.branchSettings
                ?.maintainInventoryTransactionsEntry == false,
          },
          btnEdit: {
            disabled:
              applicationSettings?.branchSettings
                ?.maintainInventoryTransactionsEntry == false,
          },
          btnDelete: {
            disabled:
              applicationSettings?.branchSettings
                ?.maintainInventoryTransactionsEntry == false,
          },
        };

        commonParams.formStateHandleFieldChangeKeysOnly &&
          dispatch &&
          dispatch(
            commonParams.formStateHandleFieldChangeKeysOnly({
              fields: result,
              updateOnlyGivenDetailsColumns: true,
            })
          );

        if (data.setFocusToNextColumn) {
          focusToNextColumn(data.rowIndex, data.searchColumn);
        }
        return result;
      } else if (res?.products?.length > 1) {
        // Multiple products
      } else {
        return null;
      }

      return result;
    } catch (err) {
      return {};
    }
  };

  const handleTextDataKeyDown = async (
    value: any,
    event: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent,
    columnName: string,
    rowIndex: number,
    commonParams: CommonParams
  ): Promise<{
    handled: boolean;
    preventDefault?: boolean;
    shouldReturn?: boolean;
    focusAction?: string;
    showDialog?: boolean;
  }> => {
    let { result } = commonParams;

    try {
      const key = event.key;
      const isShiftPressed = event.shiftKey;

      if (!result.formElements) {
        result.formElements = {};
      }
      switch (key) {
        case "Escape":
        case "escape":
          (result.formElements.dgvProduct ??= {}).visible = false;
          (result.formElements.dgvProductBatches ??= {}).visible = false;

          break;

        case "q":
        case "Q":
          if (columnName === "qty") {
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  showQuantityFactors: { visible: true, rowIndex: rowIndex },
                },
              })
            );
          }
          break;

        //  case ' ': // Space key
        //    if (columnName === "qty") {
        //      await handleUnitCycling(detail, rowIndex, commonParams, applicationSettings);
        //      return { handled: true };
        //    }
        //    break;

        case "F2":
          if (isShiftPressed) {
            if (columnName === "barCode" || columnName === "pCode") {
              dispatch(
                commonParams.formStateHandleFieldChangeKeysOnly({
                  fields: { showPcode: true },
                })
              );
              //  uiCallbacks.onShowItemListSearch(columnName);
              //  return { handled: true };
            }
          }
          break;

        case "Enter":
          if (columnName == "pCode") {
            let data = { ...formState.transaction.details[rowIndex] };
            data.pCode = value;
            if (!isNullOrUndefinedOrEmpty(value)) {
              loadProductDetailsByAutoBarcode(
                {
                  productCode: data.pCode,
                  autoBarcode: data.barCode,
                  productBatchID: 0,
                  searchText: data.pCode,
                  detail: data,
                  useProductCode: true,
                  rowIndex: rowIndex,
                  searchColumn: "pCode",
                  setFocusToNextColumn: true,
                },
                { result: {}, formStateHandleFieldChangeKeysOnly }
              );
            } else {
              focusToNextColumn(rowIndex, columnName);
            }
          } else if (columnName == "barCode") {
            let data = { ...formState.transaction.details[rowIndex] };
            data.barCode = value;
            if (!isNullOrUndefinedOrEmpty(value)) {
              loadProductDetailsByAutoBarcode(
                {
                  productCode: data.pCode,
                  autoBarcode: data.barCode,
                  productBatchID: 0,
                  searchText: data.barCode,
                  detail: data,
                  useProductCode: false,
                  rowIndex: rowIndex,
                  searchColumn: "barCode",
                  setFocusToNextColumn: true,
                },
                { result: {}, formStateHandleFieldChangeKeysOnly }
              );
            } else {
              focusToNextColumn(rowIndex, columnName);
            }
          } else if (columnName == "unitPriceFC") {
            if (
              (() => {
                try {
                  return parseFloat(value ?? "0");
                } catch {
                  return 0;
                }
              })() === 0
            ) {
              event.preventDefault();
              const confirm = await ERPAlert.show({
                icon: "info",
                title: t("warning"),
                text: t("Unit Price Zero, Do you Want to Continue"),
                confirmButtonText: t("yes"),
                cancelButtonText: t("no"),
                showCancelButton: true,
                onCancel: () => {
                  return false;
                },
              });
              if (confirm) {
                focusToNextColumn(rowIndex, columnName);
                break;
              } else {
                focusCurrentColumn(rowIndex, columnName);
              }
            }
          } else if (columnName == "margin" || columnName == "salesPrice") {
            let data = { ...formState.transaction.details[rowIndex] };
            data.margin = columnName == "margin" ? value : data.margin;
            data.salesPrice =
              columnName == "salesPrice" ? value : data.salesPrice;

            calculateRowAmount(data, columnName, {
              result: {
                transaction: {
                  details: [data],
                },
              },
              formStateHandleFieldChangeKeysOnly:
                formStateHandleFieldChangeKeysOnly,
            });

            if (
              applicationSettings.inventorySettings.showRateWarning.toUpperCase() ==
                "WARN" &&
              data.salesPrice > 0
            ) {
              if (data.unitPrice > data.salesPrice) {
                event.preventDefault();
                const confirm = await ERPAlert.show({
                  icon: "info",
                  title: t("warning"),
                  text: t(
                    "Sales Price Less than Purchase Price, Do you Want to Continue"
                  ),
                  confirmButtonText: t("yes"),
                  cancelButtonText: t("no"),
                  showCancelButton: true,
                  onCancel: () => {
                    return false;
                  },
                });
                if (confirm) {
                  focusToNextColumn(rowIndex, columnName);
                  break;
                } else {
                  focusCurrentColumn(rowIndex, columnName);
                }
              }
            } else if (
              applicationSettings.inventorySettings.showRateWarning.toUpperCase() ==
                "BLOCK" &&
              data.salesPrice > 0
            ) {
              if (data.unitPrice > data.salesPrice) {
                focusCurrentColumn(rowIndex, columnName);
              }
            }
          } 
          else if (columnName == "btnPrintBarcode")
          {
              btnBarcode_Click(null, null);
              dgvInventory.CurrentCell = dgvInventory[dgvInventory.FirstVisibleWritableColumnIndex, dgvInventory.FirstFreeRow];
          }
          // else if (columnName == "btnPrintBarcodeStd")
          // {
          //     btnBarcodeStd_Click(null, null);
          //     dgvInventory.CurrentCell = dgvInventory[dgvInventory.FirstVisibleWritableColumnIndex, dgvInventory.FirstFreeRow];
          // }
          else if (columnName == "BD")
          {
              ShowBatchForm();
          }
          else if (columnName == "GrossConvert")
          {
              ChangeGrossToUnitRate();
          }
          else if (columnName == "Serial")
          {
              ShowProductSerialForm();
          }
           else {
            focusToNextColumn(rowIndex, columnName);
          }

        default:
          break;
      }

      // Dispatch changes if any state was modified
      if (result) {
        console.log(result);

        commonParams.formStateHandleFieldChangeKeysOnly &&
          dispatch &&
          dispatch(
            commonParams.formStateHandleFieldChangeKeysOnly({ fields: result })
          );
      }

      return { handled: false };
    } catch (error) {
      console.error("Error in handleTextDataKeyDown:", error);
      return { handled: true, shouldReturn: true };
    }
  };

  // Handle unit cycling when space is pressed on quantity column
  // const handleUnitCycling = async (detail: any) => {
  //   try {
  //     const productBatchId = Number(detail.productBatchId || 0);
  //     const currentUnitId = Number(detail.unitId || 0);

  //     const batches = formState.batchesUnits?.filter(
  //       (x: any) => x.productBatchID == productBatchId
  //     );

  //     // Get next unit ID (this would be an API call)
  //     const nextUnitId = await getNextUnitId(productBatchId, currentUnitId);

  //     if (currentUnitId !== nextUnitId) {
  //       // Update unit information
  //       const unitDetails = await getUnitDetails(productBatchId, nextUnitId);

  //       if (unitDetails) {
  //         detail.unitId = nextUnitId;
  //         detail.unit = unitDetails.unitName;
  //         detail.unitPrice = unitDetails.standardPurchasePrice;
  //         detail.unitPriceTag = unitDetails.standardPurchasePrice;
  //         detail.salesPrice = unitDetails.standardSalesPrice;
  //         detail.minSalePrice = unitDetails.standardMinSalePrice;

  //         // Handle actual sales price if visible
  //         if (result.ui?.visibleColumns?.includes("actualSalesPrice")) {
  //           detail.actualSalesPrice = detail.salesPrice;

  //           try {
  //             const otherUnitPrice = await getProductOtherUnitPrice(
  //               productBatchId,
  //               nextUnitId
  //             );
  //             if (otherUnitPrice > 0) {
  //               detail.actualSalesPrice = otherUnitPrice;
  //             }
  //           } catch (error) {
  //             console.error("Error getting other unit price:", error);
  //           }
  //         }

  //         // Handle price category pricing
  //         try {
  //           const priceCategoryId = result.ui?.selectedPriceCategory || 0;
  //           const priceCategoryPrice =
  //             await getProductPriceCategoryPurchasePrice(
  //               productBatchId,
  //               priceCategoryId,
  //               nextUnitId
  //             );
  //           if (priceCategoryPrice !== 0) {
  //             detail.unitPrice = priceCategoryPrice;
  //           }
  //         } catch (error) {
  //           console.error("Error getting price category price:", error);
  //         }

  //         // Calculate row amounts
  //         const calculateResult = calculateRowAmount(
  //           detail,
  //           "slNo",
  //           applicationSettings,
  //           commonParams,
  //           true
  //         );
  //         if (calculateResult?.transaction?.details?.[0]) {
  //           result.transaction.details[rowIndex] =
  //             calculateResult.transaction.details[0];
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error in handleUnitCycling:", error);
  //   }
  // };

  // Handle Enter key press

  return {
    undoEditMode,
    handleTextDataKeyDown,
    getNextVoucherNumber,
    loadAndSetTransVoucher,
    loadTransVoucher,
    setTransVoucher,
    deleteTransVoucher,
    validate,
    // setupBahamdoonPOSReceipts,
    save: preSave,
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
    handleTextDataChange,
    focusCostCenterRef,
    focusLedgerCode,
    focusRefNo,
    focusAmount,
    focusDiscount,
    loadProductDetailsByAutoBarcode,
    getDrCr,
    clearRow,
    calculateRowAmount,
    calculateSummary,
    calculateTotal,
  };
};
