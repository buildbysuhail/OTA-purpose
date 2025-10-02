import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePrint } from "./use-print";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import VoucherType from "../../../../enums/voucher-types";
import { APIClient } from "../../../../helpers/api-client";
import { merge } from 'lodash';
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
  safeBase64Decode,
} from "../../../../utilities/jsonConverter";
import {
  isNullOrUndefinedOrZero,
  isNullOrUndefinedOrEmpty,
  isEnterKey,
  getExcelCellValue,
  generateUniqueKey,
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
  formStateHandleFieldChangeKeysOnly,
  formStateClearDetails,
  formStateClearAttachments,
  formStateSetDetails,
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
  FormElementsState,
  EmployeeType,
  ExcelRowData,
} from "./transaction-types";
import {
  initialInventoryTotals,
  initialTransactionDetailData,
  initialTransactionDetails2,
  TransactionFormStateInitialData,
  transactionInitialData,
  TransactionMasterInitialData,
} from "./transaction-type-data";
import {
  isDirtyTransaction,
  setTransactionForHistory,
} from "../../../../helpers/transaction-modified-util";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useTransactionHelper } from "./use-transaction-helper";
import { DeepPartial } from "redux";
import ExcelJS from "exceljs";
import { sanitizeDataAdvanced } from "../../../../utilities/Utils";
import { getStorageString, setStorageString } from "../../../../utilities/storage-utils";
import { getApLocalDataByUrl } from "../../../../redux/cached-urls";
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
export type LoadAndSetTransVoucherFn = (
  usingManualInvNumber?: boolean,
  voucherNumber?: number,
  voucherPrefix?: string,
  voucherType?: string,
  formType?: string,
  manualInvoiceNumber?: string,
  transactionMasterID?: number,
  mode?: "increment" | "decrement" | undefined,
  skipPrompt?: boolean | false,
  setVoucherNo?: boolean | false,
  loadVType?: string,
  loadFType?: string,
  loadPrefix?: string,
) => Promise<boolean | undefined>; // ✅ fix return type

const api = new APIClient();
export const useTransaction = (
  transactionType: string,
  btnSaveRef: any,
  btnAddRef: any,
  focusToNextColumn: (
    rowIndex: number,
    column: string,
    excludedColumns?: (keyof TransactionDetail)[]
  ) => { column: string; rowIndex: number } | null,
  focusColumn: (
    rowIndex: number,
    column: string
  ) => { column: string; rowIndex: number } | null,
  focusCurrentColumn: (
    rowIndex: number,
    column: string
  ) => { column: string; rowIndex: number } | null,
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
  chequeStatusRef?: any,
  handleKeyDown?: (e: any, field: string, rowIndex: number) => void,
  formStateRef?: any,
  purchaseGridRef?: any,
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
    changeGrossToUnitRate,
    calculateRowAmount,
    applyDiscountsToItems,
  } = useTransactionHelper(transactionType);
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const { round } = useNumberFormat();
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  const { printBarcode, printVoucher } = usePrint();
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        const currentRowIndex = formState.currentCell?.rowIndex ?? -1;
        const currentProduct = formState.transaction.details[currentRowIndex]?.product ?? "";

        if (currentProduct.trim() !== "") {
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: { ShowProductBatchUnitDetails: true },
            })
          );
        }
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: { ShowProductBatchUnitDetails: false },
          })
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, formState.currentCell, formState.transaction.details]);

  // useEffect(() => {
  //   const handleGlobalKeyDown = (event: KeyboardEvent) => {
  //     if (event.ctrlKey && event.key.toLowerCase() === "l") {
  //       event.preventDefault();
  //       dispatch(
  //         formStateHandleFieldChange({
  //           fields: {
  //             ledgerDetails: true,
  //           },
  //         })
  //       );
  //     }
  //   };
  //   //  Party Search ☝

  //   window.addEventListener("keydown", handleGlobalKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleGlobalKeyDown);
  //   };
  // }, [dispatch]);

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

  const setCurrentCell = (
    input: { column: string; rowIndex: number } | null,
    data: TransactionDetail,
    reCenterRow: boolean
  ) => {
    if (input) {
      dispatch(
        formStateHandleFieldChange({
          fields: {
            currentCell: {
              reCenterRow: reCenterRow,
              column: input?.column,
              data: data,
              rowIndex: input?.rowIndex,
            },
          },
        })
      );
    }
  };
  const { hasRight, hasBlockedRight } = useUserRights();
  const fetchUserConfig = async () => {
    try {
      const base64 = await api.get(
        `${Urls.inv_transaction_base}${transactionType}/GetLocalSettings`
      );
      await setStorageString("utInvc", base64);
      // Decode the base64 back to JSON string      
      const _userConfig = safeBase64Decode(base64 ?? "");;
      const userConfig: UserConfig = customJsonParse(_userConfig??"{}");


      return userConfig;
    } catch (error) {
      console.error("Error fetching user config:", error);
    }
  };

  const loadAndSetTransVoucher: LoadAndSetTransVoucherFn = async (
    usingManualInvNumber = false,
    voucherNumber,
    voucherPrefix,
    voucherType,
    formType,
    manualInvoiceNumber,
    transactionMasterID,
    mode,
    skipPrompt = false,
    setVoucherNo = false,
    loadVType,
    loadFType,
    loadPrefix,
  ) => {

    const _s_isDirty = isDirtyTransaction(
      formState.prev,
      {
        transaction: { ...formState.transaction },
      },
      "inv"
    );
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
    debugger;
    let _formState = await loadTransVoucher(
      usingManualInvNumber,
      voucherNumber,
      voucherPrefix,
      voucherType,
      formType,
      manualInvoiceNumber,
      transactionMasterID,
      loadVType,
      loadFType,
      loadPrefix
    );

    if (loadVType == "GRN" || loadVType == "GRR") {
       _formState = merge({}, _formState, {transaction:{master:{deliveryNoteNumber: manualInvoiceNumber}}} );
    }
    else if (loadVType == "PO" && (formState.transaction.master.voucherType == "GRN" || formState.transaction.master.voucherType == "PI")) {
       _formState = merge({}, _formState, {transaction:{master:{orderNumber: manualInvoiceNumber}}} );
    }

    if (typeof _formState == "boolean") {
      return;
    }
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
        disabled:
          _formState.transaction.master.invTransactionMasterID > 0 &&
          !["GRN", "PO", "SO"].includes(loadVType ?? ""),
      },
      btnSave: {
        ..._formState.formElements.btnSave,
        disabled:
          _formState.transaction.master.isLocked === true
            ? true
            : _formState.formElements.btnSave.disabled,
      },
    };
    await setTransVoucher(_formState);
    return true;
  };
  const setTransVoucher = async (
    _formState: TransactionFormState,
    loadUserConfig: boolean = false
  ) => {



    const Utc = await getStorageString("utInvc");
    let userConfig: UserConfig | undefined;
    if (Utc) {
      const decoded = safeBase64Decode(Utc)??"{}";
      userConfig = customJsonParse(decoded ?? "{}");
    } else {
      userConfig = await fetchUserConfig();
    }
    const ct = {
      themeName: userConfig?.themeName ?? "Custom",
      gridFontSize: userConfig?.gridFontSize,
      gridIsBold: userConfig?.gridIsBold,
      gridBorderColor: userConfig?.gridBorderColor,
      gridHeaderBg: userConfig?.gridHeaderBg,
      gridHeaderFontColor: userConfig?.gridHeaderFontColor,
      gridHeaderRowHeight: userConfig?.gridHeaderRowHeight,
      gridFooterBg: userConfig?.gridFooterBg,
      gridFooterFontColor: userConfig?.gridFooterFontColor,
      gridBorderRadius: userConfig?.gridBorderRadius,
      showColumnBorder: userConfig?.showColumnBorder,
      activeRowBg: userConfig?.activeRowBg,
      gridRowHeight: userConfig?.gridRowHeight,
      isInitial: true
    }
    if (userConfig) {
      _formState.userConfig = userConfig;
      _formState.currentTheme = ct
      _formState.selectedTheme = ct
    }

    _formState.prev = modelToBase64Unicode(
      setTransactionForHistory(_formState, "inv")
    );

    _formState.transactionLoading = false;
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
    manualInvoiceNumber?: any,
    transactionMasterID?: number,
    loadVType?: string,
    loadFType?: string,
    loadPrefix?: string,
    pDTInvTransMasterID?: number
  ) => {
    loadVType = loadVType ?? "PI";
    let voucher: TransactionFormState = JSON.parse(
      JSON.stringify({
        ...formState,
        openUnsavedPrompt: false,
      })
    );

    let url = `${Urls.inv_transaction_base}${transactionType}`;

    let _voucherNumber =
      voucherNumber ?? (formState.transaction?.master?.voucherNumber || 0);
    let out_voucherNumber =
      voucherNumber ?? (formState.transaction?.master?.voucherNumber || 0);
    let out_voucherType =
      voucherType ?? (formState.transaction?.master?.voucherType || "");
    let out_voucherForm =
      formType ?? (formState.transaction?.master?.voucherForm || "");
    let out_voucherPrefix =
      voucherPrefix ?? (formState.transaction?.master?.voucherPrefix || "");

    if (loadVType == "PO") {
      out_voucherNumber = manualInvoiceNumber ?? 0;
      out_voucherType = loadVType;
      out_voucherForm = loadFType??"";
      out_voucherPrefix = loadPrefix??"";
    }
    if (loadVType == "GRN") {
      out_voucherNumber = manualInvoiceNumber ?? 0;
      out_voucherType = loadVType;
      out_voucherForm = loadFType??"";
      out_voucherPrefix = loadPrefix??"";
      url = url + "/ByGRN";
    }
    if (loadVType == "GRR") {
      out_voucherNumber = manualInvoiceNumber ?? 0;
      out_voucherType = loadVType;
      out_voucherForm = loadFType??"";
      out_voucherPrefix = loadPrefix??"";
      url = url + "/ByGRN";
    }
    if (loadVType == "PI_Ref") {
      out_voucherNumber = manualInvoiceNumber ?? 0;
      out_voucherType = "PI";
      out_voucherForm = "VAT";
      out_voucherPrefix = loadPrefix??"";
      url = url + "/ByReferenceNo";
    }

    if (_voucherNumber == undefined || _voucherNumber <= 0) {
      return voucher;
    }
    const params: Record<any, any> = {
      VoucherNumber: out_voucherNumber, // Ensuring it's always a string
      voucherPrefix:
        out_voucherPrefix,
      voucherType:
        out_voucherType,
      voucherForm:
        out_voucherForm,
      isUsingManualInvNo: usingManualInvNumber, // Convert boolean to string
      isActualPriceVisible: formState.gridColumns.find(x => x.dataField == "actualSalesPrice")?.visible ?? false,
      referenceNumber: loadVType == "PI_Ref" ? out_voucherNumber : null
    };


    // ByGRN
    let vch = await api.getAsync(url, new URLSearchParams(params).toString());
    if (loadVType == "GRN") {
      if (vch?.isOk == false) {
        ERPAlert.show({
          title: "",
          text: `${vch?.message}`,
          icon: t("warning"),
        });
        return false;
      }
    }

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
          voucherForm: formType ?? formState.transaction.master.voucherForm,
        },
      };
    }


    if (usingManualInvNumber) {
      vch.master = {
        ...vch.master,
        voucherNumber: _voucherNumber,
        voucherType: voucherType ?? formState.transaction.master.voucherType,
        voucherPrefix:
          voucherPrefix ?? formState.transaction.master.voucherPrefix,
        voucherForm: formType ?? formState.transaction.master.voucherForm,
        invTransactionMasterID: ["GRN", "PO", "SO"].includes(loadVType ?? "")
          ? null
          : vch.master.invTransactionMasterID,
      };
    }
    // clearControlForNew();
    await undoEditMode(
      formState.isEdit,
      transactionMasterID ?? formState.transaction.master.invTransactionMasterID
    );
    voucher.transaction.master.inventoryLedgerID =
      loadVType == "PR" || loadVType == "DNS"
        ? vch.master.inventoryLedgerID
        : formState.transaction.master.inventoryLedgerID;
    voucher.transaction.master.orderNumber =
      loadVType !== "PO" && loadVType !== "GRN"
        ? voucher.transaction.master.orderNumber
        : undefined;
    if (loadVType == "GRN" && voucherType == "PI") {
      voucher.transaction.master.gRNMasterID =
        voucher.transaction.master.invTransactionMasterID;
    }
    voucher.transaction = {
      ...(vch || {}),
      master: {
        ...(vch?.master || {}),
        hasroundOff: vch?.master?.roundAmount != 0,
        cashReceived: vch?.master?.cashReceived,
        hasCashPaid: vch?.master?.cashReceived != 0
      },
      details: refactorDetails(
        vch.details,
        formType ?? vch.master.voucherForm,
        voucherType ?? vch.master.voucherType,
        { result: {} },
        loadVType
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
    voucher.formElements.cbCostCentre.disabled =
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
    // if (vch?.details) {
    //   voucher.transaction.details = refactorDetails(
    //     vch.details,
    //     "",
    //     { result: {} },
    //     formType ?? ""
    //   );
    // }
    if (voucher.transaction.attachments) {
      voucher.transaction.attachments = refactorAttachments(
        voucher.transaction
      );
    }

    voucher.isInitialLedger = true;
    voucher = await loadLedgerData(voucher) as any;
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

  // const formState = useAppSelector(
  //   (state: RootState) => state.InventoryTransaction
  // );
  async function undoEditMode(
    isEdit: boolean,
    transactionMasterId: number
  ): Promise<any> {
    if (isEdit) {
      try {
        const result = await updateTransactionEditMode(
          "I", // Action type
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
    isVoucherPrefix = isVoucherPrefix ? isVoucherPrefix : false
    isVoucherPrefix = !clientSession.isAppGlobal && voucherType == VoucherType.PurchaseReturn ? true :  isVoucherPrefix
    const response = await api.getAsync(
      `${Urls.inv_transaction_base}${transactionType}/GetNextVoucherNumber/`,
      `formType=${formType ? formType : ""}&voucherType=${voucherType ? voucherType : ""
      }&voucherPrefix=${voucherPrefix ? voucherPrefix : ""}&isVoucherPrefix=${isVoucherPrefix ? isVoucherPrefix : false
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
    debugger;
    // Stock update restriction
    if (!formState.transaction.master.stockUpdate && (formState.transaction.master.voucherType === "PI" || formState.transaction.master.voucherType === "PR")) {
      const voucherType = formState.transaction.master.voucherType;
      const confirm = await ERPAlert.show({
        icon: "info",
        title: t("stock_update_warning"),
        text: voucherType === "PI" ? "Stock cannot be updated in this invoice.In goods Receipt voucher stock already updated. Do you want to continue?" : voucherType === "PR" ? "Stock cannot be updated in this invoice.In Goods Receipt Return voucher stock already updated. Do you want to continue?" : "",
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
        showCancelButton: true,

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
    // if (Settings.inventorySettings?.ShowPurchaseCostChangeWarning && !isEdit) {
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
    for (let i = 0; i < details.length; i++) {
      const row = details[i];
      if (row.gross === 0 && row.productID > 0) {
        const confirm = await ERPAlert.show({
          icon: "question",
          title: t("zero_rate_or_qty"),
          text: `${t('zero_rate_or_qty_entered_in_row')} row: ${i + 1}`,
          confirmButtonText: t("yes"),
          cancelButtonText: t("no"),
          showCancelButton: true,
        });
        if (!confirm) {
          const rowIndex = details.findIndex(x => x.slNo == row.slNo);
          const res = focusColumn(rowIndex, "qty");
          setCurrentCell(res, details[rowIndex] as TransactionDetail, true);
          return false

        }
      }
    }

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
    debugger;
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
      let params = {
        master: {
          ...master,
          transactionDate:
            master.transactionDate == "" ? null : master.transactionDate,
        },
        details: dtRes.outputDetails,
        attachments: attachments,
        invAccTransactions: formState.transaction.invAccTransactions,
        pendingOrderListMasterIDs: formState.pendingOrdListMasterIDs,
        PendingOrderListBranchIDs: formState.pendingOrdListBranchIDs
      };

      params = sanitizeDataAdvanced(params, transactionInitialData)
      try {
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
          clearControls(formState.transaction.master.invTransactionMasterID > 0, formState.transaction.master.invTransactionMasterID)
          if (formState.printOnSave == true) {
            printVoucher();
          }
          dispatch(formStateHandleFieldChange({
            fields: {
              savingCompleted: true,
            },
          }))
          // ERPToast.show(saveRes.message, "success");
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
          dispatch(
            formStateHandleFieldChange({
              fields: {
                saving: false,
                savingCompleted: undefined,
              },
            })
          );
        }
      } catch (error) {
        dispatch(formStateHandleFieldChange({
          fields: {
            saving: false,
            savingCompleted: true,
          },
        }))
        ERPAlert.show({
          icon: "warning",
          text: "Please try Again",
          title: "",
        });
      }

    }
    else{
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
        // formState,
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
    transactionMasterID?: number
  ) => {
    if (transactionMasterID ?? 0 > 0) {
      await undoEditMode(isEdit, transactionMasterID ?? 0);

    }
    const vNo = await getNextVoucherNumber(
      formState.transaction.master.voucherForm,
      formState.transaction.master.voucherType,
      formState.transaction.master.voucherPrefix,
      false
    );
    let employeeID = userSession.employeeId ?? 0;
            if (["PR","PQ","PO"].includes(formState.transaction.master.voucherType ?? "" as any)  && employeeID <= 0) {
      const emps = await getApLocalDataByUrl(`${Urls.inv_transaction_base}${transactionType}/Data/Employee/`);
      employeeID = emps && emps.length > 0 ? emps[0].id : employeeID;
    }
    const master: TransactionMaster = {
      ...TransactionMasterInitialData,
      voucherType: formState.transaction.master.voucherType ?? "",
      voucherPrefix: formState.transaction.master.voucherPrefix ?? "",
      voucherForm: formState.transaction.master.voucherForm ?? "",
      transactionDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      purchaseInvoiceDate: moment().local().toISOString(),
      employeeID: employeeID,
      voucherNumber: vNo ?? 0,
      inventoryLedgerID:
        formState.transaction.master.voucherType == VoucherType.PurchaseReturn ? applicationSettings.inventorySettings?.defaultPurchaseReturnAcc
          : applicationSettings.inventorySettings?.defaultPurchaseAcc,
      ledgerID: applicationSettings.accountsSettings.defaultCashAcc,
      isLocked: false,
      grandTotal: 0,
      grandTotalFc: 0,
      fromWarehouseID:
        formState.userConfig?.presetWarehouseId ?? 0 > 0 ? formState.userConfig?.presetWarehouseId ?? 0
          : applicationSettings.inventorySettings?.defaultWareHouse,
      costCentreID:
        formState.userConfig?.presetCostenterId ?? 0 > 0 ? formState.userConfig?.presetCostenterId ?? 0
          : applicationSettings.accountsSettings.defaultCostCenterID

    };
    dispatch(
      formStateHandleFieldChange({
        fields: {
          isRowEdit: false,
          total: 0,
          netTotal: 0,
          netAmount: 0,
          amountInWords: "",
          barcodeData: "",
          barcodeTemplate: null,
          isEdit: false,
          summary: initialInventoryTotals,
          printOnSave: true,

          prev: modelToBase64Unicode(
            setTransactionForHistory(
              {
                transaction: {
                  master: master,
                  details: [],

                },
              },
              "inv"
            )
          ),
        }
      })
    );

    dispatch(
      formStateMasterHandleFieldChange({
        fields: { ...master }
      })
    );
    dispatch(formStateClearDetails())
    dispatch(formStateClearAttachments())
    dispatch(
      formStateTransactionUpdate({ key: "invAccTransactions", value: [] }));
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        // Form elements
        fields: {
          formElements: {
            btnAdd: {
              label: "Add",
            },
            ledgerID: {
              reload: true,
            },
            cbCostCentre: {
              reload: true,
              visible: applicationSettings?.accountsSettings?.maintainCostCenter,
              disabled: (formState.userConfig?.presetCostenterId ?? 0) > 0,
            },
            cbWarehouse: {
              reload: true,
              visible: applicationSettings?.inventorySettings?.maintainWarehouse,
              disabled: (formState.userConfig?.presetWarehouseId ?? 0) > 0,
            },
            amount: {
              disabled: false,
            },
            pnlMasters: {
              disabled: false,
            },
            employee: {
              disabled: false,
            },
            jvDrCr: {
              disabled: false,
            },
            masterAccount: {
              disabled: false,
            },
            referenceDate: {
              disabled: false,
            },
            referenceNumber: {
              disabled: false,
            },
            transactionDate: {
              disabled: false,
            },
            linkEdit: {
              // visible: !((formState.userConfig?.presetCostenterId ?? 0) > 0),
            },
          },
        },
        updateOnlyGivenDetailsColumns: true,
      })
    );

    const editableColumns = formState.gridColumns?.filter(
      (col) => col.visible != false && col.dataField != null && col.allowEditing == true && col.readOnly !== true
    );

    if (editableColumns && editableColumns.length > 0) {
      const res = focusColumn(0, editableColumns[0].dataField ?? "")
      setCurrentCell(res, formState.transaction.details[0] as TransactionDetail, true);
    }
  };
  const handleRemoveItem = async (slNo: string) => {
    debugger
    dispatch(
      formStateTransactionDetailsRowRemove({
        slNo: slNo,
        applicationSettings: applicationSettings,
        clearEntryControl,
      })
    );
    const details = formState.transaction.details.filter(x => x.productID > 0 && x.slNo != slNo)
    const data = formState.transaction.details.find((x: TransactionDetail) => isNullOrUndefinedOrZero(x.productID) || x.productID <= 0)
    const rowIndex = formState.transaction.details.findIndex(x => x.slNo == data?.slNo)
    const editableColumn = formState.gridColumns?.find(
      (col) => col.visible !== false && col.dataField != null && col.allowEditing == true && col.readOnly !== true
    );
    await setStorageString(
      `${formState.transaction.master.voucherType}${formState.transaction.master.voucherForm}`,
      JSON.stringify(details)
    );
    if (calculateSummary && calculateTotal && formState && dispatch && formStateHandleFieldChangeKeysOnly) {
      const summaryRes = calculateSummary(details, formState, {
        result: {},
      });

      const totalRes = calculateTotal(
        formState.transaction.master,
        summaryRes ? summaryRes.summary as SummaryItems : initialInventoryTotals,
        formState.formElements,
        {
          result: {},
        }
      );

      if (totalRes) {

        totalRes.summary = summaryRes.summary;
        totalRes.transaction = totalRes.transaction ?? {};
        totalRes.transaction.master = { ...totalRes.transaction.master };
        totalRes.transaction.details = [];
        totalRes.loading = { isLoading: false, text: '' }
        totalRes.currentCell = {
          reCenterRow: false,
          column: editableColumn?.dataField ?? "",
          data: data ?? initialTransactionDetailData,
          rowIndex: rowIndex ?? 0,
        },

          // Dispatch the state update

          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: totalRes,
              updateOnlyGivenDetailsColumns: true
            })
          );
      }
    }
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
    //   formState.formElements.cbCostCentre.visible == true
    // ) {
    //   ERPAlert.show({
    //     icon: "info",
    //     title: t("select_cost_center"),
    //   });
    //   focusCostCenterRef();
    //   return false;
    // }
    // if (
    //   formState.formElements.cbCostCentre.visible == false &&
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

  const handleGridKeyDown = async(
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
        onConfirm: async() => {
          const dataGridInstance = gridRef.current.instance(); // Access DataGrid instance
          const focusedRowIndex = dataGridInstance.option("focusedRowIndex");
          const rowData = dataGridInstance.getVisibleRows()[focusedRowIndex]?.data;
          await handleRemoveItem(rowData.slNo)
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

  //     if (formState.formElements.cbCostCentre.visible == true) {
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
  //           formState.formElements.cbCostCentre.visible == true &&
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


  const loadTemporaryRows = async () => {

    let details: Array<TransactionDetail> = [];
    const tmp = await getStorageString(
      `${formState.transaction.master.voucherType}${formState.transaction.master.voucherForm}`
    );
    if (tmp != undefined && tmp != null && tmp != "") {
      const tmpRows = JSON.parse(tmp) as Array<TransactionDetail>;
      if (tmpRows.length > 0) {
        details = [...tmpRows, ...Array.from({ length: 30 }, (_, index) => ({
          ...initialTransactionDetailData,
          slNo: generateUniqueKey()
        }))];
        const batchIds = tmpRows.map(x => x.productBatchID).join(',');
        const batchUnits = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/BatchUnits`, `arrayOfBatchID=${batchIds}`)

        if (details.length > 0 && calculateSummary && calculateTotal && formState && dispatch && formStateHandleFieldChangeKeysOnly) {
          const summaryRes = calculateSummary(details, formState, {
            result: {},
          });

          const totalRes = calculateTotal(
            formState.transaction.master,
            summaryRes ? summaryRes.summary as SummaryItems : initialInventoryTotals,
            formState.formElements,
            {
              result: {},
            }
          );

          if (totalRes) {
            totalRes.summary = summaryRes.summary;
            totalRes.transaction = totalRes.transaction ?? {};
            totalRes.transaction.master = { ...totalRes.transaction.master };
            totalRes.transaction.details = [];
            totalRes.batchesUnits = batchUnits;
            totalRes.loading = { isLoading: false, text: '' }

            // Dispatch the state update

            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: totalRes,
                updateOnlyGivenDetailsColumns: true
              })
            );
            dispatch(
              formStateSetDetails(details)
            );
          }
        }
      }
    }
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
      return;
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
    // Check if voucher is locked
    // if (formState.transaction.master.isLocked) {
    //   ERPAlert.show({
    //     title: t("warning"),
    //     text: t("voucher_is_locked"),
    //     icon: "warning",
    //   });
    //   return;
    // }

    if (formState.transaction.master.isInvoiced === true && (formState.transaction.master.voucherType == "GRN" )) {
      const invoicedConfirmResult = await ERPAlert.show({
        title: t("warning"),
        text: t("transaction_already_invoiced_warning"),
        icon: "warning",
        confirmButtonText: t("ok"),
      });
      if (!invoicedConfirmResult) {
        return;
      }
    }

    try {
      // Check if transaction is in edit mode

      // const result = await api.postAsync(
      //   `${Urls.inv_transaction_base}${transactionType}/GetAndSetTransactionEditMode`,
      //   {
      //     transactionType: "I",
      //     transactionMasterId:
      //       formState.transaction.master.invTransactionMasterID ?? 0,
      //   }
      // );

      // if (result?.isOk && result.message === "") {
      // Check if day is closed
      // const closedDateResult = await api.getAsync(
      //   `${Urls.inv_transaction_base}GetClosedDate`
      // );

      // if (closedDateResult?.isOk) {
      //   const closedDate = new Date(closedDateResult.data);
      //   const prevTransDate = new Date(
      //     formState.transaction.master.prevTransDate
      //   );

      //   if (closedDate.getTime() >= prevTransDate.getTime()) {
      //     ERPAlert.show({
      //       title: t("invalid_transaction_date"),
      //       text: t("cannot_delete_day_closed"),
      //       icon: "warning",
      //     });
      //     return;
      //   }
      // }

      // Validate transaction date
      // const validateTransactionDateRes = validateTransactionDate(
      //   new Date(formState.transaction.master.transactionDate),
      //   false,
      //   undefined,
      //   hasBlockedRight
      // );

      // if (!validateTransactionDateRes.valid) {
      //   ERPAlert.show({
      //     title: t("invalid_transaction_date"),
      //     text: validateTransactionDateRes.message,
      //     icon: "warning",
      //   });
      //   return;
      // }

      // Show delete confirmation dialog
      const deleteConfirmResult = await ERPAlert.show({
        title: t("deleting_transaction_question"),
        text: t("once_deleting_this_transaction_cannot_be_recovered"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
      });

      if (deleteConfirmResult) {
        dispatch(
          formStateHandleFieldChange({
            fields: { deleting: true, deletingCompleted: false },
          })
        );

        try {
          // Begin transaction and delete
          const deleteResult = await api.delete(
            `${Urls.inv_transaction_base}${transactionType}`,
            {
              data: {
                invTransactionMasterID:
                  formState.transaction.master.invTransactionMasterID,
                transactionType: transactionType,
              },
            }
          ) as any;

          if (deleteResult && deleteResult?.isOk) {
            dispatch(
              formStateHandleFieldChange({
                fields: { deletingCompleted: true },
              })
            );

            ERPAlert.show({
              title: t("success"),
              text: t("transaction_deleted_successfully"),
              icon: "success",
              showCancelButton: false,
              confirmButtonText: t("close")
            });

            clearControls(false);
          } else {
            dispatch(
              formStateHandleFieldChange({
                fields: { deleting: false, deletingCompleted: false },
              })
            );

            ERPAlert.show({
              title: t("delete_operation_failed"),
              text: deleteResult?.message,
              icon: "error",
            });
          }


          // Update form elements state
          dispatch(
            updateFormElement({
              fields: {
                btnSave: { disabled: false },
                btnDelete: { disabled: true },
                btnPrint: { disabled: true },
                btnEdit: { disabled: true },
                pnlMasters: { disabled: false },
                dxGrid: { disabled: true },
              },
            })
          );
        } catch (deleteError) {
          console.error("Error during delete operation:", deleteError);
          dispatch(
            formStateHandleFieldChange({
              fields: { deleting: false, deletingCompleted: false },
            })
          );

          ERPAlert.show({
            title: t("error"),
            text: t("delete_operation_failed"),
            icon: "error",
          });
        }
      }
      // } else {
      //   // Voucher is in use by another user
      //   const editInfo = result?.message?.split(";") || [];
      //   ERPAlert.show({
      //     title: t("voucher_in_use"),
      //     text: `This Voucher is already in use by ${editInfo[1]} opened for edit in system ${editInfo[0]} at ${editInfo[2]}`,
      //     icon: "warning",
      //   });
      // }
    } catch (error) {
      console.error("Error handling delete:", error);
      dispatch(
        formStateHandleFieldChange({
          fields: { deleting: false, deletingCompleted: false },
        })
      );

      ERPAlert.show({
        title: t("error"),
        text: t("server_busy_or_system_issue"),
        icon: "error",
      });
    }
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
        true,false, "PO","",formState.transaction.master.voucherPrefix
      );
    }
  }, [formState.transaction.master?.purchaseInvoiceNumber]);

  const handleRefresh = async () => {
    try {
      // const currentLedgerId = formState.row.ledgerID;
      // const currentMasterAccountId = formState.masterAccountID;

      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            formElements: {
              ledgerID: { reload: true },
              masterAccount: { reload: true },
            },
            transaction: {
              master: {
                ledgerID: applicationSettings.accountsSettings.defaultCashAcc,
              },
            },
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
            purchaseInvoiceNumber:"",
            // transactionMasterID: 0,
            transactionDate: moment(
              clientSession.softwareDate,
              "DD/MM/YYYY"
            ).local().toISOString(),
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

  const handleTextDataChange = async (
    value: any,
    columnName: string,
    rowIndex: number
  ) => {
    try {
      console.log("handleTextDataChange");

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
      const actualPriceVisible = formState.gridColumns?.find(
        (x) => x.dataField == "actualSalesPrice"
      )?.visible;
      if (columnName === "unit") {
        if (value > 0) {
          const unitName = formState.batchesUnits?.find(
            (xer) =>
              xer.value == value && xer.productBatchID == detail.productBatchID
          )?.label;
          outDetail.unit = unitName;
          outDetail.unitID = value;

          handleChangeUnit(
            outDetail,
            detail,
            actualPriceVisible ?? false,
            outState,
            columnName,
            rowIndex
          );
        }
      }
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
      } else if (columnName === "qty" || columnName === "unitPrice"
        || columnName === "discPerc" || columnName === "discount"
        || columnName === "barcodePrinted"
      ) {
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
    commonParams: CommonParams,
    proceedAll?: boolean,
    forImport?: boolean
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
      const _lastSelectedWarehouseIDOfItemPopupsSearch = (async() => {
        try {
          const stored = await getStorageString(
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
        isUnitDetailsRequired: true,
        isCheckUseSupplierProductCode:
          formState.userConfig?.useSupplierProductCode,
        isActualPriceVisible: formState.gridColumns?.find(
          (x) => x.dataField == "actualSalesPrice"
        )?.visible,
        isStockDetailsVisible: formState.gridColumns?.find(
          (x) => x.dataField == "stockDetails"
        )?.visible,
        lastSelectedWareHouseIdOfItemPopUpsSearch:
          await _lastSelectedWarehouseIDOfItemPopupsSearch,
      };
      const queryParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, value as any);
        }
      });
      const res: DataAutoBarcode = await api.getAsync(
        `${Urls.inv_transaction_base
        }${transactionType}/LoadProductDetailsByAutoBarCode?${queryParams.toString()}`
      );

      warehouseId = -1;

      if (applicationSettings?.productsSettings?.enableMultiWarehouseBilling) {
        warehouseId = 0;
      }
      if (res?.isShowItemPopUp && forImport != true) {
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
                    warehouseId: warehouseId,
                  },
                },
              },
            },
          })
        );
      } else if (res?.products?.length === 1) {
        let product = res.products[0];
        product.productName = product.productName.replace(/^\s+/, m => "\u00A0".repeat(m.length));
        const _index =
          forImport != true
            ? formState.transaction.details.findIndex(
              (x) =>
                x.barCode == product.autoBarcode &&
                x.productID > 0 &&
                x.slNo != detail.slNo
            )
            : -1;
        if (
          product.autoBarcode != "" &&
          _index > -1 &&
          formState.userConfig?.duplicationMessage
        ) {
          const confirm = await ERPAlert.show({
            icon: "info",
            title: t("warning"),
            text: t("item_already_selected", { row: _index + 1 }),
            confirmButtonText: t("yes"),
            cancelButtonText: t("no"),
            showCancelButton: true,
            onCancel: () => {
              return false;
            },
          });
          if (confirm) {
            let pld: DeepPartial<TransactionFormState> = {
              transaction: {
                details: [
                  { ...initialTransactionDetailData, slNo: detail.slNo },
                ],
              },
            };
            const res = focusColumn(_index, "qty");
            if (res) {
              pld.currentCell = {
                ...res,
                data: formState.transaction.details[_index],
                reCenterRow: false
              };
            }
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: pld,
                updateOnlyGivenDetailsColumns: false,
                rowIndex: data.rowIndex,
              })
            );

            return {};
          } else {
          }
        }

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
        if (clientSession.isAppGlobal) {
          outDetail.hsnCode = product.hsnCode || "";
          outDetail.details2 = { ...outDetail.details2 ?? initialTransactionDetails2 }
          // if (formState.transaction.master.voucherType !== "PI") {
          outDetail.details2!.cgstPerc = Number(product.p_CGSTPerc || 0);
          outDetail.details2!.sgstPerc = Number(product.p_SGSTPerc || 0);
          outDetail.details2!.igstPerc = 0;

          if (
            formState.transaction.master.voucherForm.toLowerCase() === "interstate" || formState.transaction.master.voucherForm.toLowerCase() === "import"
          ) {
            outDetail.details2!.cgstPerc = 0;
            outDetail.details2!.sgstPerc = 0;
            outDetail.details2!.igstPerc = Number(product.p_IGSTPerc || 0);
          }

          outDetail.details2!.cessPerc = Number(product.p_CessPerc || 0);
          outDetail.details2!.additionalCessPerc = Number(product.p_AdditionalCessPerc || 0);
          // } else {
          //   outDetail.details2!.cgstPerc = 0;
          //   outDetail.details2!.sgstPerc = 0;
          //   outDetail.details2!.igstPerc = 0;
          //   outDetail.details2!.cessPerc = 0;
          //   outDetail.details2!.additionalCessPerc = 0;
          // }
        } else {


          const { voucherType, voucherForm } = formState.transaction.master;

          if (
            !clientSession.isAppGlobal && (
              voucherType === "PO" ||
              voucherType === "PE" ||
              (voucherForm === "VAT" && voucherType !== "PO" && voucherType !== "PE"))
          ) {
            outDetail.vatPerc = Number(product.pVatPerc || 0);
            outDetail.cstPerc = Number(product.purchaseExciseTaxPerc || 0);
          } else {
            outDetail.vatPerc = 0;
            outDetail.cstPerc = 0;
          }
        }

        // Special handling for meter units
        const unitName = product.unitName?.toUpperCase().trim();
        if (unitName === "MTR" || unitName === "MTRS" || unitName === "METER") {
          outDetail.stickerQty = 4;
        }

        // Handle empty form type
        // if (formState.transaction.master.voucherForm == "") {
        //   outDetail.vatPerc = 0;
        // }

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
        if (proceedAll) {
          const latestData = outDetail;

          let _res = calculateRowAmount(
            latestData as TransactionDetail,
            "pCode",
            { result: { transaction: { details: [latestData] } } },
            true
          );
          let currentDetails = [
            ...formState.transaction.details.filter(
              (x) => x.productID > 0 || x.slNo == latestData.slNo
            ),
          ];
          let final =
            _res?.transaction?.details != undefined &&
              _res?.transaction?.details.length > 0
              ? (_res?.transaction
                ?.details[0] as DeepPartial<TransactionDetail>)
              : latestData;
          currentDetails[data.rowIndex] = final as TransactionDetail;
          const summaryRes = calculateSummary(currentDetails, formState, {
            result: {},
          });

          const totalRes = calculateTotal(
            formState.transaction.master,
            summaryRes.summary as SummaryItems,
            {
              ...formState.formElements,
              ...result.formElements,
            } as FormElementsState,
            { result: {} }
          );
          result = {
            ...totalRes,
            summary: summaryRes.summary,
            showQuantityFactors: { visible: false, rowIndex: -1 , qtyDesc: "" },
            transaction: {
              ...totalRes.transaction,
              details: [final],
            },
          };
        }

        for (const unit of product.units) {
          if (!result.batchesUnits) {
            result.batchesUnits = [];
          }
          const exists = result.batchesUnits.some(
            (u) =>
              u.productBatchID === unit.productBatchID && u.value == unit.value
          );
          if (!exists) {
            result.batchesUnits.push(unit);
          }
        }

        commonParams.formStateHandleFieldChangeKeysOnly &&
          dispatch &&
          dispatch(
            commonParams.formStateHandleFieldChangeKeysOnly({
              fields: result,
              updateOnlyGivenDetailsColumns: true,
            })
          );
        if (data.setFocusToNextColumn) {
          const res = focusToNextColumn(data.rowIndex, data.searchColumn, [
            "pCode",
            "product",
            "barCode",
          ]);
          setCurrentCell(
            res,
            result.transaction!.details[0] as TransactionDetail, false
          );
        }

        return result;
      } else if (res?.productId > 0 && forImport != true) {

        dispatch(formStateHandleFieldChangeKeysOnly(
          {
            fields: {
              batchGridShowKey: res?.productId
            }
          }
        ));
      } else if (forImport != true) {
        const res = focusToNextColumn(data.rowIndex, data.searchColumn, [
          "pCode",
          "product",
          "barCode",
        ]);
        setCurrentCell(res, data.detail as TransactionDetail, false);
      }

      return result;
    } catch (err) {
      console.log(err);

      return result;

    }
  };

  const handleChangeUnit = async (
    outDetail: DeepPartial<TransactionDetail>,
    detail: TransactionDetail,
    actualPriceVisible: boolean,
    outState: DeepPartial<TransactionFormState>,
    columnName: keyof TransactionDetail,
    rowIndex: number
  ) => {

    const res = await api.getAsync(
      `${Urls.inv_transaction_base}${transactionType}/ProductBatchUnitPrices/${detail.productBatchID}/${outDetail.unitID}/${actualPriceVisible}`
    );
    if (res) {
      outDetail.unitPrice = res.stdPurchasePrice;
      outDetail.unitPriceTag = res.stdPurchasePrice;
      outDetail.salesPrice = res.stdSalesPrice;
      outDetail.minSalePrice = res.minSalePrice;
      outDetail.actualSalesPrice = res.salesPrice;
      if (actualPriceVisible) {
        if (res.actualSalesPrice > 0) {
          outDetail.actualSalesPrice = res.actualSalesPrice;
        }
      }
      outState = calculateRowAmount(
        Object.assign(detail, outDetail),
        columnName as any,
        {
          result: {
            transaction: {
              details: [outDetail],
            },
          },
        },
        true
      );
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

      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: totalRes,
          updateOnlyGivenDetailsColumns: true,
          rowIndex: rowIndex,
        })
      );
    }
  };

  const handlePrintBarcode = async (
  ) => {
    try {
      const rowIndexes = [];
      const hasReprint = formState.transaction.details.filter(x => x.barcodePrinted == true).length > 0
      if (hasReprint) {
        const confirm = await ERPAlert.show({
          icon: "info",
          title: t("reprint_barcode"),
          text: t("do_you_want_to_print_barcode_again"),
          confirmButtonText: t("yes"),
          cancelButtonText: t("no"),
          showCancelButton: true,
          onCancel: () => {
            return false;
          },
        });
        if (confirm) {

          const slNos = formState.transaction.details.filter(x => x.productID > 0 && x.barcodePrinted != true && (x.stickerQty + x.qty) > 0).map(x => x.slNo);
          printBarcode(
            slNos,
            true,
            true,
            formState.transaction.master.ledgerID,
            formState.transaction.master.fromWarehouseID,
            false
          );
        }
      } else {
        const slNos = formState.transaction.details.filter(x => x.productID > 0 && x.barcodePrinted != true && (x.stickerQty + x.qty) > 0).map(x => x.slNo);
        printBarcode(
          slNos,
          false,
          true,
          formState.transaction.master.ledgerID,
          formState.transaction.master.fromWarehouseID,
          false
        );
      }


    } catch (error) {

    }
  }
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
      const isCtrlPressed = event.ctrlKey;
      if (columnName === "global") {
        if (event.shiftKey && event.key === "F") {
          event.preventDefault();
          if (voucherNumberRef.current) {
            voucherNumberRef.current.focus();
          }
        }
        // Focus Voucher Number ☝
        if (event.shiftKey && event.key === "D") {
          event.preventDefault();
          dispatch(
            formStateHandleFieldChange({
              fields: { documentModal: true }
            })
          )
        }
        // Document Properties ☝
        // if (event.shiftKey && event.key === "F2") {
        //   event.preventDefault();
        //   dispatch(
        //     formStateHandleFieldChange({
        //       fields: { ledgerDetails: true },
        //     })
        //   );
        //   return { handled: false }
        // }
        // ledger details ☝
        if (event.ctrlKey && event.key.toLowerCase() === "g") {
          event.preventDefault();
          const currentFormState = formStateRef.current;
          if (
            currentFormState.transaction.details.length > 0 &&
            purchaseGridRef.current
          ) {
            const visibleColumns =
              currentFormState.gridColumns?.filter(
                (col: any) => col.visible !== false && col.dataField != null
              ) || [];
            const firstEditableColumn = visibleColumns.find(
              (col: any) => col.allowEditing == true && !col.readOnly
            );
            if (firstEditableColumn) {
              const columnIndex = visibleColumns.indexOf(firstEditableColumn);
              const res = purchaseGridRef.current.focusCell(0, columnIndex);
              if (res) {
                const data =
                  formState.transaction.details[res.rowIndex];
                dispatch(
                  formStateHandleFieldChange({
                    fields: {
                      currentCell: {
                        column: res.column,
                        rowIndex: res.rowIndex,
                        data: data,
                      },
                    },
                  })
                );
              }
            }
          }
        }
        // Focus Inventory Grid ☝
        if (event.shiftKey && event.key.toUpperCase() === "F5") {
          event.preventDefault();
          const currentFormState = formStateRef.current;
          if (
            !currentFormState.formElements.pnlMasters?.disabled &&
            currentFormState.transaction.details != null &&
            currentFormState.transaction.details.length > 0
          ) {
            save();
          }
        }
        // Save Document ☝
        return { handled: true }
      }
      if (!result.formElements) {
        result.formElements = {};
      }
      switch (key) {
        case "Escape":
        case "escape":
          (result.formElements.dgvProduct ??= {}).visible = false;
          (result.formElements.dgvProductBatches ??= {}).visible = false;
          dispatch(
            commonParams.formStateHandleFieldChangeKeysOnly({
              fields: result,
            })
          );
          break;

        case "q":
        case "Q":
          if (columnName === "qty") {
            const data: TransactionDetail =
              formState.transaction.details[rowIndex];
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  showQuantityFactors: { visible: true, rowIndex: rowIndex, qtyDesc:data.productDescription },
                },
              })
            );
          }
          break;

        // case "M":
        // case "m":
        //   if (isCtrlPressed) {
        //     dispatch(
        //       commonParams.formStateHandleFieldChangeKeysOnly({
        //         fields: { ShowProductBatchUnitDetails: true },
        //       })
        //     );
        //     return { handled: true };
        //   }
        //   break;

        case "i":
        case "I":
          if (isCtrlPressed) {

            dispatch(
              formStateHandleFieldChange({
                fields: {
                  showProductInformation: { show: true, index: rowIndex },
                },
              })
            );
            return { handled: true };
          }
          break;
        // Product Information ☝

        case "b":
        case "B":
          if (isCtrlPressed) {
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  ledgerDetails: true
                }
              })
            )
            return { handled: true };
          }
        //  Party Search ☝

        case " ": {
          // Space key

          let outState: DeepPartial<TransactionFormState> = {
            transaction: { details: [] },
          };
          const actualPriceVisible = formState.gridColumns?.find(
            (x) => x.dataField == "actualSalesPrice"
          )?.visible;
          let detail = { ...formState.transaction.details[rowIndex] };
          let outDetail: DeepPartial<TransactionDetail> = { slNo: detail.slNo };

          if (columnName === "qty") {
            const units = formState.batchesUnits?.filter(
              (xer) => xer.productBatchID == detail.productBatchID
            );
            const unitIndex =
              units?.findIndex((xer) => xer.value == detail.unitID) ?? 0;
            const nextUnitIndex =
              unitIndex < (units?.length ?? 0) - 1 ? unitIndex + 1 : 0;
            if (!units) {
              return { handled: true };
            }
            const unitName = units[nextUnitIndex].label;
            const unitID = units[nextUnitIndex].value;
            outDetail.unit = unitName;
            outDetail.unitID = unitID;

            handleChangeUnit(
              outDetail,
              detail,
              actualPriceVisible ?? false,
              outState,
              columnName,
              rowIndex
            );
          }
          break;
        }

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
          let data = { ...formState.transaction.details[rowIndex] };
          if (columnName == "actionCol") {
            if (!isNullOrUndefinedOrEmpty(value)) {
              await handleRemoveItem(value)
            } else {
              // const res = focusToNextColumn(rowIndex, columnName);
              // setCurrentCell(res, data);
            }
            break
          }
          if (columnName == "pCode") {
            data.pCode = value;
            if (!isNullOrUndefinedOrEmpty(value)) {
              await loadProductDetailsByAutoBarcode(
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
                { result: {}, formStateHandleFieldChangeKeysOnly },
                true
              );
            } else {
              const res = focusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            }
          } else if (columnName == "barCode") {
            data.barCode = value;
            if (!isNullOrUndefinedOrEmpty(value)) {
              await loadProductDetailsByAutoBarcode(
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
                { result: {}, formStateHandleFieldChangeKeysOnly },
                true
              );
            } else {
              const res = focusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, rowIndex != res?.rowIndex);
            }
          }
          // else if (columnName == "unitPrice") {
          // dispatch(
          //   commonParams.formStateHandleFieldChangeKeysOnly({
          //     fields: {
          //       productInfo: true,
          //     },
          //   })
          // );
          // return { handled: true };
          // }
          else if (columnName == "unitPriceFC") {
            if (
              (() => {
                try {
                  return parseFloat(value ?? "0");
                } catch {
                  return 0;
                }
              })() === 0
            ) {
              // event.preventDefault();
              const confirm = await ERPAlert.show({
                icon: "info",
                title: t("warning"),
                text: t("unit_price_zero_do_you_want_to_continue"),
                confirmButtonText: t("yes"),
                cancelButtonText: t("no"),
                showCancelButton: true,
                onCancel: () => {
                  return false;
                },
              });
              if (confirm) {
                const res = focusToNextColumn(rowIndex, columnName);
                setCurrentCell(res, data, rowIndex != res?.rowIndex);
                break;
              } else {
                const res = focusCurrentColumn(rowIndex, columnName);
                setCurrentCell(res, data, false);
              }
            }
          } else if (columnName == "margin" || columnName == "salesPrice") {
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
              applicationSettings.inventorySettings?.showRateWarning.toUpperCase() ==
              "WARN" &&
              data.salesPrice > 0
            ) {
              if (data.unitPrice > data.salesPrice) {
                // event.preventDefault();
                event.preventDefault();
                event.stopPropagation(); 
                const confirm = await ERPAlert.show({
                  icon: "info",
                  title: t("warning"),
                  text: t(
                    "sales_price_less_than_purchase_price_do_you_want_to_continue"
                  ),
                  confirmButtonText: t("yes"),
                  cancelButtonText: t("no"),
                  showCancelButton: true,
                  onCancel: () => {
                    return false;
                  },
                });
                if (confirm) {
                  const res = focusToNextColumn(rowIndex, columnName);
                  setCurrentCell(res, data, rowIndex != res?.rowIndex);
                  break;
                } else {
                  const res = focusCurrentColumn(rowIndex, columnName);
                  setCurrentCell(res, data, false);
                }
              }
            } else if (
              applicationSettings.inventorySettings?.showRateWarning.toUpperCase() ==
              "BLOCK" &&
              data.salesPrice > 0
            ) {
              if (data.unitPrice > data.salesPrice) {
                const res = focusCurrentColumn(rowIndex, columnName);
                setCurrentCell(res, data, false);
              }
            }
          } else if (columnName == "btnPrintBarcode") {

            if ((formState.transaction.details[rowIndex].qty + formState.transaction.details[rowIndex].stickerQty) <= 0) {
              break
            }
            const isReprint =
              formState.transaction.details[rowIndex].barcodePrinted;
            if (isReprint) {
              // event.preventDefault();
              const confirm = await ERPAlert.show({
                icon: "info",
                title: t("reprint_barcode"),
                text: t("do_you_want_to_print_barcode_again"),
                confirmButtonText: t("yes"),
                cancelButtonText: t("no"),
                showCancelButton: true,
                onCancel: () => {
                  return false;
                },
              });
              if (confirm) {
                printBarcode(
                  [data.slNo],
                  true,
                  true,
                  formState.transaction.master.ledgerID,
                  formState.transaction.master.fromWarehouseID,
                  false
                );
                break;
              } else {
                break;
              }
            } else {
              printBarcode(
                [data.slNo],
                false,
                true,
                formState.transaction.master.ledgerID,
                formState.transaction.master.fromWarehouseID,
                false
              );
            }
          }
          // else if (columnName == "btnPrintBarcodeStd")
          // {
          //     btnBarcodeStd_Click(null, null);
          //     dgvInventory.CurrentCell = dgvInventory[dgvInventory.FirstVisibleWritableColumnIndex, dgvInventory.FirstFreeRow];
          // }
          else if (columnName == "bd") {
            const data: TransactionDetail =
              formState.transaction.details[rowIndex];

            const batchDetails = {
              // Required fields
              batchNo: data.batchNo || "",
              expDate: data.expDate || null,
              mfdDate: data.mfdDate || null,
              expDays: data.expDays || "",
              mrp: data.mrp || "",

              // Optional multiunit fields - Unit 2
              unitID2: data.unitID2 || null,
              unit2Qty: data.unit2Qty || undefined,
              unit2SalesRate: data.unit2SalesRate || undefined,
              unit2MRP: data.unit2MRP || undefined,
              unit2MBarcode: data.unit2MBarcode || undefined,
              unit2StickerQty: data.unit2StickerQty || undefined,
              unit2: data.unit2 || undefined,

              // Optional multiunit fields - Unit 3
              unitID3: data.unitID3 || null,
              unit3Qty: data.unit3Qty || undefined,
              unit3SalesRate: data.unit3SalesRate || undefined,
              unit3MRP: data.unit3MRP || undefined,
              unit3MBarcode: data.unit3MBarcode || undefined,
              unit3StickerQty: data.unit3StickerQty || undefined,
              unit3: data.unit3 || undefined,
            };
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  batchEntryData: {
                    visible: true,
                    data: JSON.stringify(batchDetails),
                    rowIndex,
                  },
                },
                updateOnlyGivenDetailsColumns: true,
              })
            );
          }
          else if (columnName == "memoEditor") {
            const data: TransactionDetail = formState.transaction.details[rowIndex];
            const memoDetails = {
              memo: data.moreDetails.memo || "",
            };
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  memoEditor: {
                    visible: true,
                    data: JSON.stringify(memoDetails),
                    rowIndex,
                  },
                },
                updateOnlyGivenDetailsColumns: true,
              })
            );
          }
          else if (columnName == "grossConvert") {
            changeGrossToUnitRate(rowIndex, columnName);
          } else if (columnName == "serial") {
            const rowData: TransactionDetail =
              formState.transaction.details[rowIndex];
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  serialNoEntryData: {
                    visible: true,
                    data: rowData.productDescription,
                    rowIndex: rowIndex,
                  },
                },
                updateOnlyGivenDetailsColumns: true,
              })
            );
          } else {
            const res = focusToNextColumn(rowIndex, columnName);
            setCurrentCell(res, data, rowIndex != res?.rowIndex);
          }
          break;
        default:
          break;
      }

      // Dispatch changes if any state was modified
      // if (result) {
      //   console.log(result);

      //   commonParams.formStateHandleFieldChangeKeysOnly &&
      //     dispatch &&
      //     dispatch(
      //       commonParams.formStateHandleFieldChangeKeysOnly({ fields: result })
      //     );
      // }

      return { handled: false };
    } catch (error) {
      console.error("Error in handleTextDataKeyDown:", error);
      return { handled: true, shouldReturn: true };
    }
  };

  interface TemplateColumn {
    header: string;
    key: string;
    width: number;
  }
  // Alternative version without sample data - just headers
  const downloadImportTemplateHeadersOnly = async (): Promise<void> => {
    try {
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();

      // Set workbook properties
      workbook.creator = "Purchase Import System";
      workbook.created = new Date();

      // Add Purchase worksheet
      const worksheet = workbook.addWorksheet("Purchase", {
        properties: {
          tabColor: { argb: "FF0070C0" },
        },
      });

      // Define columns
      const columns: TemplateColumn[] = [
        { header: "Barcode", key: "barcode", width: 15 },
        { header: "Quantity", key: "quantity", width: 12 },
        { header: "Disc_per", key: "discPerc", width: 12 },
        { header: "Discount", key: "discount", width: 12 },
        { header: "MRP", key: "mrp", width: 12 },
        { header: "SalesPrice", key: "salesPrice", width: 15 },
        { header: "PurchasePrice", key: "purchasePrice", width: 15 },
        { header: "PartyName", key: "partyName", width: 20 },
      ];

      // Set worksheet columns
      worksheet.columns = columns.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.width,
      }));

      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.height = 25;

      columns.forEach((col, index) => {
        const cell = headerRow.getCell(index + 1);

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4472C4" },
        };

        cell.font = {
          name: "Calibri",
          size: 12,
          bold: true,
          color: { argb: "FFFFFFFF" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });

      // Freeze the header row
      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      // Generate and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Purchase_Import_Template_${new Date().toISOString().split("T")[0]
        }.xlsx`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // showSuccessMessage('Import template downloaded successfully!');
    } catch (ex: any) {
      console.error("Error downloading import template:", ex);
      // showErrorMessage("Template Download Error", ex.message || ex.toString(), "Download Failed");
    }
  };
  const importFromExcel = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      // Create file input element
      const file = e.target.files?.[0] || null;
      if (!file) {
        // setIsLoading(false);
        return; // User cancelled
      }

      // Read Excel file using ExcelJS
      const workbook = new ExcelJS.Workbook();
      const fileBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(fileBuffer);

      // Get 'Purchase' worksheet
      const purchaseWorksheet = workbook.getWorksheet("Purchase");
      if (!purchaseWorksheet) {
        throw new Error("Purchase worksheet not found in the Excel file");
      }

      // Get the range of used cells
      const rowCount = purchaseWorksheet.rowCount;

      if (rowCount <= 1) {
        throw new Error("No data rows found in the Excel file");
      }

      // Extract data from Excel (starting from row 2, skipping header)
      const excelData: ExcelRowData[] = [];

      for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
        const row = purchaseWorksheet.getRow(rowNumber);

        // Skip empty rows
        if (!row.hasValues) {
          continue;
        }

        try {
          const rowData: ExcelRowData = {
            Barcode: getExcelCellValue(row.getCell(1)) || "",
            Quantity: parseFloat(getExcelCellValue(row.getCell(2)) || "0") || 0,
            Disc_per: getExcelCellValue(row.getCell(3))
              ? parseFloat(getExcelCellValue(row.getCell(3))!)
              : 0,
            Discount: getExcelCellValue(row.getCell(4))
              ? parseFloat(getExcelCellValue(row.getCell(4))!)
              : 0,
            MRP: getExcelCellValue(row.getCell(5))
              ? parseFloat(getExcelCellValue(row.getCell(5))!)
              : 0,
            SalesPrice:
              parseFloat(getExcelCellValue(row.getCell(6)) || "0") || 0,
            PurchasePrice:
              parseFloat(getExcelCellValue(row.getCell(7)) || "0") || 0,
            PartyName: getExcelCellValue(row.getCell(8)) || "",
          };

          // Only add rows with valid barcode
          if (rowData.Barcode.trim() !== "") {
            excelData.push(rowData);
          }
        } catch (err) {
          console.warn(`Error parsing row ${rowNumber}:`, err);
          continue; // Skip this row and continue with next
        }
      }

      if (excelData.length === 0) {
        throw new Error("No valid data found in the Excel file");
      }

      // Prepare state update for inventory items
      let outState: any = {
        transaction: { master: {}, details: [] },
      };

      // Process each Excel row
      for (let i = 0; i < excelData.length; i++) {
        const rowData = excelData[i];

        try {
          let detailItem: any = {
            slNo: generateUniqueKey(),
            barCode: rowData.Barcode,
            qty: rowData.Quantity,
            discPerc: rowData.Disc_per || 0,
            discount: rowData.Discount || 0,
            mrp: rowData.MRP || 0,
            salesPrice: rowData.SalesPrice,
            unitPrice: rowData.PurchasePrice,
          };
          const productDetails = await loadProductDetailsByAutoBarcode(
            {
              productCode: "",
              autoBarcode: rowData.Barcode,
              productBatchID: 0,
              searchText: rowData.Barcode,
              detail: detailItem,
              useProductCode: false,
              rowIndex: 0,
              searchColumn: "barCode",
              setFocusToNextColumn: false,
            },
            { result: {} },
            false,
            true
          );
          // Load product details by barcode
          if (productDetails) {
            detailItem = Object.assign(
              productDetails.transaction!
                .details![0] as DeepPartial<TransactionDetail>,
              detailItem
            );
            detailItem.isValid = true;
            const calculatedRow = calculateRowAmount(
              detailItem,
              "barCode",
              { result: { transaction: { details: [detailItem] } } },
              true
            );
            outState.batchesUnits = productDetails.batchesUnits;
            outState.transaction.details.push(
              calculatedRow.transaction!.details![0]
            );
          } else {
            detailItem.isValid = false;
            outState.transaction.details.push(detailItem);
          }
        } catch (rowError: any) {
          console.error(`Error processing row ${i + 1}:`, rowError);
          // Continue with next row instead of stopping entire import
        }
      }

      // Handle party information if available
      if (excelData[0]?.PartyName && excelData[0].PartyName.trim() !== "") {
        try {
          const partyDetails = await api.getAsync(
            `${Urls.inv_transaction_base}${transactionType}/partyDetails?partyName=${excelData[0].PartyName}`
          );

          if (partyDetails) {
            outState.transaction.master = {
              ...outState.transaction.master,
              partyId: partyDetails.LedgerID,
              partyName: partyDetails.LedgerName,
            };
          } else {
            throw new Error(
              `PartyName - ${excelData[0].PartyName} - Not Found. Please recheck PartyName`
            );
          }
        } catch (partyError: any) {
          console.error("Error loading party details:", partyError);
          const errorMsg = partyError.message || "Error loading party details";
          // setError(errorMsg);
          // onError?.("Party Loading Error", errorMsg, "1");
          return;
        }
      }

      // Calculate summary and totals if functions are provided
      const _details =
        outState.transaction?.details?.filter((x: any) => x.isValid == true) ||
        [];
      const details = [
        ..._details,
        ...(formState.transaction?.details?.filter(
          (x: any) => x.productID > 0
        ) || []),
      ];
      if (
        details.length > 0 &&
        calculateSummary &&
        calculateTotal &&
        formState &&
        dispatch &&
        formStateHandleFieldChangeKeysOnly
      ) {
        const summaryRes = calculateSummary(details, formState, {
          result: {},
        });

        const totalRes = calculateTotal(
          formState.transaction.master,
          summaryRes
            ? (summaryRes.summary as SummaryItems)
            : initialInventoryTotals,
          formState.formElements,
          {
            result: outState,
          }
        );

        if (totalRes) {
          totalRes.summary = summaryRes.summary;
          totalRes.transaction = totalRes.transaction ?? {};
          totalRes.transaction.master = { ...totalRes.transaction.master };
          totalRes.transaction.details = [];
          totalRes.batchesUnits = outState.batchesUnits;

          // Dispatch the state update
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: totalRes,
              updateOnlyGivenDetailsColumns: true,
              rowIndex: 0,
              itemsToAddToDetails: _details,
            })
          );
        }
      }

      // setImportedCount(excelData.length);
      // const successMsg = `Successfully imported ${excelData.length} items from Excel`;
      // onSuccess?.(successMsg);
    } catch (ex: any) {
      // const errorMsg = ex.message || ex.toString();
      // console.error('Error importing from Excel:', ex);
      // setError(errorMsg);
      // onError?.("Import Failed", errorMsg, "Excel Import Error");
    } finally {
      // setIsLoading(false);
    }
  };
  const loadLedgerData = async (_formState?: DeepPartial<TransactionFormState>, _dispatch?: any) => {
    const ledgerID = (_formState ?? formState)?.transaction?.master?.ledgerID;
    _formState = _formState ?? {}
    dispatch(
      formStateHandleFieldChange({
        fields: {
          ledgerDataLoading: true,
          ledgerBalanceLoading: true,
        },
      })
    );

    try {

      if (!isNullOrUndefinedOrZero(ledgerID)) {
        const [ledgerBalance, ledgerData] = await Promise.all([
          (ledgerID ?? 0) > 0
            ? api.getAsync(`${Urls.inv_transaction_base}${transactionType}/LedgerBalance/${ledgerID}`)
            : 0,
          api.getAsync(
            `${Urls.inv_transaction_base}${transactionType}/LedgerDetails?LedgerId=${ledgerID}`
          ),
        ]);

        const ret = {
          ..._formState,
          formElements: {
            ..._formState.formElements,
            costCentreID: {
              ..._formState.formElements?.costCentreID,
              visible:
                applicationSettings?.accountsSettings?.maintainCostCenter ||
                ledgerData?.isCostCentreApplicable, // Update visibility based on ledgerData
            },
          },
          ledgerBalance: (ledgerBalance ?? 0) as number,
          groupName: ledgerData?.accGroupName,
          ledgerData: ledgerData,
          ledgerDataLoading: false,
          transaction: {
            ..._formState.transaction,
            master: {
              ..._formState.transaction?.master,
              tokenNumber: ledgerData?.taxNumber,
              ledgerID: ledgerID,
              partyName: ledgerData?.partyName ?? "",
              displayName: ledgerData?.displayName ?? "",
              address1: ledgerData?.address1 ?? "",
              address4: _formState.isInitialLedger ? _formState.transaction?.master?.address4: ledgerData?.mobileNumber ?? "",
              address3: ledgerData?.address3 ?? "",
            }
          }
        }
        _dispatch && _dispatch(formStateHandleFieldChangeKeysOnly({
          fields: ret
        }));
        return ret;

      } else {
        const ret = {
          ..._formState,
          ledgerBalance: 0,
          groupName: "",
          ledgerData: undefined,
          partyId: "",
          transaction: {
            ..._formState.transaction,
            master: {
              ..._formState.transaction?.master,

              tokenNumber: "",
              ledgerID: null,
              partyName: "",
              displayName: "",
              address1: "",
              address4: "",
              address3: "",
            }
          }
        }
        _dispatch && _dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: ret,
          })
        );
        return ret;
      }
    } catch (error) {
      // Handle error
    }
    dispatch(
      formStateHandleFieldChange({
        fields: {
          ledgerDataLoading: false,
          ledgerBalanceLoading: false,
        },
      })
    );
    return {}
  };
  interface BillWiseDetail {
    accTransDetailID: number;
    billWiseAdjAmt: number;
    adjustedTransDetailID: number;
  }

  interface BillWiseRequest {
    accTransactionDetailID: number;
    billWiseDetails: BillWiseDetail[];
  }
  async function postBillWiseDetails(
    data: BillWiseRequest
  ): Promise<any> {
    try {
      const response = await api.postAsync(
        `${Urls.inv_transaction_base}${transactionType}/BillWiseDetail`,
        data
      );
      dispatch(
        formStateHandleFieldChange({
          fields: {
            showbillwise: false,
          },
        })
      )
      return response.data;
    } catch (error: any) {
      console.error("Error posting BillWiseDetails:", error);
      throw error;
    }
  }
  return {
    downloadImportTemplateHeadersOnly,
    importFromExcel,
    undoEditMode,
    handleTextDataKeyDown,
    getNextVoucherNumber,
    loadAndSetTransVoucher,
    loadTransVoucher,
    setTransVoucher,
    deleteTransVoucher,
    validate,
    refactorDetails,
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
    printVoucher,
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
    applyDiscountsToItems,
    handlePrintBarcode,
    loadLedgerData,
    postBillWiseDetails
  };
};
