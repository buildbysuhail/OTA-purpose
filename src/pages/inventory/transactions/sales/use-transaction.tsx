import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCommenPrint } from "../../../transaction-base/use-commen-print";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import VoucherType from "../../../../enums/voucher-types";
import { APIClient } from "../../../../helpers/api-client";
import { merge } from "lodash";
import { useUserRights, UserAction, } from "../../../../helpers/user-right-helper";
import { RootState } from "../../../../redux/store";
import Urls from "../../../../redux/urls";
import { useAppDispatch, useAppSelector, } from "../../../../utilities/hooks/useAppDispatch";
import { customJsonParse, modelToBase64Unicode, safeBase64Decode, } from "../../../../utilities/jsonConverter";
import { isNullOrUndefinedOrZero, isNullOrUndefinedOrEmpty, getExcelCellValue, generateUniqueKey, } from "../../../../utilities/Utils";
import { Attachments, FormElementsState, } from "../../../accounts/transactions/acc-transaction-types";
import { ApplicationSettingsType } from "../../../settings/system/application-settings-types/application-settings-types";
import { updateTransactionEditMode } from "./transaction-functions";
import { isDirtyTransaction, setTransactionForHistory, } from "../../../../helpers/transaction-modified-util";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useTransactionHelper } from "./use-transaction-helper";
import { DeepPartial } from "redux";
import ExcelJS from "exceljs";
import { sanitizeDataAdvanced } from "../../../../utilities/Utils";
import { getStorageString, setStorageString, } from "../../../../utilities/storage-utils";
import { getApLocalData, getApLocalDataByUrl } from "../../../../redux/cached-urls";
import { formStateHandleFieldChangeKeysOnly, formStateHandleFieldChange, formStateTransactionMasterHandleFieldChange, formStateTransactionUpdate, clearState, formStateMasterHandleFieldChange, formStateClearDetails, formStateClearAttachments, formStateTransactionDetailsRowRemove, formStateSetDetails, updateFormElement, } from "../reducer";
import { transactionInitialData, initialInventoryTotals, TransactionMasterInitialData, initialTransactionDetailData, initialTransactionDetails2, initialUserConfig, initialFormElements, TransactionFormStateInitialData, TransactionMaster3InitialData, } from "../transaction-type-data";
import { TransactionDetail, UserConfig, TransactionFormState, SummaryItems, TransactionMaster, TransactionData, LoadProductDetailsByAutoBarcodeProps, CommonParams, DataAutoBarcode, ExcelRowData, LoadSrParams, ColumnModel, TenderResult, } from "../transaction-types";
import PostedTransactionLabel from "./components/PostedTransactionLabel";
import { SalesAuthorization } from "./components/AuthorizationSales";
import { getInitialPreference } from "../../../../utilities/dx-grid-preference-updater";
import { LedgerType } from "../../../../enums/ledger-types";
import { purchaseGridCol } from "./transaction-grid-cols";
import DeliveryBoy from "../../../rpos/deliveryboy";
import { SalesDateChange } from "./components/dateChange"
import { setClientSession } from "../../../../redux/slices/client-session/reducer"
import { usePurchasePrint } from "../../../transaction-base/use-commen-barcode-print";

// export interface UserConfig {
//   keepNarrationForJV: boolean;
//   clearDetailsAfterSaveAccounts: boolean;
//   mnuShowConfirmationForEditOnAccounts: boolean;
//   maximizeBillwiseScreenInitially: boolean;
//   alignment: "left" | "center" | "right";
// }

let tenderResolver: ((value?: TenderResult) => void) | null = null;
// Function to resolve the tender promise from outside
export const resolveTenderPromise = (value?: TenderResult) => {
  if (tenderResolver) {
    tenderResolver(value);
    tenderResolver = null;
  }
};

// E Way bill response manage
let eWayBillResolver: ((value: boolean) => void) | null = null;
export const resolveWayBillPromise = (success: boolean) => {
  if (eWayBillResolver) {
    eWayBillResolver(success);
    eWayBillResolver = null;
  }
};

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
  showLoading?: boolean,
  disablePnlMasters?: boolean,
  invokeUsingVoucherNumber?: boolean,
) => Promise<boolean | undefined>; // ✅ fix return type

export type initializeFormElementsFn = (
  voucherType: string,
  voucherPrefix: string,
  formType: string,
  formCode: string,
  title: string,
  voucherNo: number,
  transactionMasterID: number,
  isInitial?: boolean
) => Promise<void> // ✅ fix return type

const api = new APIClient();
export const useTransaction = (
  transactionType: string,
  btnSaveRef?: any,
  btnAddRef?: any,
  focusToNextColumn?: (
    rowIndex: number,
    column: string,
    excludedColumns?: (keyof TransactionDetail)[]
  ) => { column: string; rowIndex: number } | null,
  focusColumn?: (
    rowIndex: number,
    column: string
  ) => { column: string; rowIndex: number } | null,
  focusCurrentColumn?: (
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
  mobileNumRef?: any,
  transactionDateRef?: any,
  discountRef?: any,
  chequeStatusRef?: any,
  employeeRef?: any,
  handleKeyDown?: (e: any, field: string, rowIndex: number) => void,
  formStateRef?: any,
  purchaseGridRef?: any,
  setIsDropDownOpen?: (value: { open: boolean, autoAddressFocus: boolean }) => void,
  _voucherType?: string,
  _formType?: string,
) => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const dataContainer = useAppSelector((state: RootState) => state.Data);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const deviceInfo = useAppSelector((state: RootState) => state.DeviceInfo);
  const softwareDate = useAppSelector(
    (state: RootState) => state.ClientSession.softwareDate
  );
  const safeFocusToNextColumn =
  focusToNextColumn ??
  ((rowIndex: number, column: string) => null);

const safeFocusColumn =
  focusColumn ??
  ((rowIndex: number, column: string) => null);
const safeFocusCurrentColumn  =
focusCurrentColumn ??
 ((rowIndex: number, column: string) => null);
  const {
    attachDetails,
    attachMaster,
    calculateSummary,
    calculateTotal,
    disableControlsFn,
    refactorDetails,
    // getClosedDate,
    setUserRightsFn,
    validateTransactionDate,
    clearEntryControl,
    changeGrossToUnitRate,
    calculateRowAmount,
    applyDiscountsToItems,
    calculateTaxOnDiscount,
    checkTheProductInSchemes,
    checkTheProductPriceInSchemes,
    setCurrentCell,
    loadProductDetailsByAutoBarcode,
    removeGiftFromGrid,
    enableControls

  } = useTransactionHelper(transactionType, safeFocusToNextColumn, safeFocusColumn);
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const { round, roundAwayFromZero, getFormattedValueIgnoreRounding, getNumericFormat } = useNumberFormat();
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  const { printBarcode } = usePurchasePrint();

  const { printVoucher } = useCommenPrint();
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        const currentRowIndex = formState.currentCell?.rowIndex ?? -1;
        const currentProduct =
          formState.transaction.details[currentRowIndex]?.product ?? "";

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


  const { hasRight, hasBlockedRight } = useUserRights();
  const fetchUserConfig = async () => {
    try {

      const key = btoa(`${userSession.userId}-${transactionType}_LocalSettings`);
      const savedPreferences = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/GetLocalSettings`
      );
      if (
        savedPreferences != "undefined" &&
        savedPreferences != undefined &&
        savedPreferences != null &&
        savedPreferences != `""` &&
        savedPreferences != ""
      ) {
        await setStorageString(key, savedPreferences);
        // Decode the base64 back to JSON string

        const _userConfig = safeBase64Decode(savedPreferences ?? "");
        const userConfig: UserConfig = customJsonParse(_userConfig ?? "{}");

        return userConfig;
      }
      const _bs64 = modelToBase64Unicode(initialUserConfig);
      await setStorageString(key, _bs64);
      return initialUserConfig;
    } catch (error) {
      console.error("Error fetching user config:", error);
    }
  };

  const loadAndSetTransVoucher: LoadAndSetTransVoucherFn = async (
    usingManualInvNumber = false,
    voucherNumber = 0,
    voucherPrefix = "",
    voucherType = "",
    formType,
    manualInvoiceNumber,
    transactionMasterID,
    mode,
    skipPrompt = false,
    setVoucherNo = false,
    loadVType,
    loadFType,
    loadPrefix,
    showLoading,
    disablePnlMasters = true,
    invokeUsingVoucherNumber = true,
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

    if (showLoading) {
      dispatch(
        formStateHandleFieldChange({
          fields: { transactionLoading: true },
        })
      );
    }


    let _formState = await loadTransVoucher(
      usingManualInvNumber,
      voucherNumber || formState.transaction.master.voucherNumber,
      voucherPrefix || formState.transaction.master.voucherPrefix,
      voucherType || formState.transaction.master.voucherType,
      formType ?? formState.transaction.master.voucherForm,
      manualInvoiceNumber,
      transactionMasterID,
      loadVType,
      loadFType,
      loadPrefix,
      transactionMasterID,
      invokeUsingVoucherNumber
    );




    if (typeof _formState == "boolean") {
      return;
    }
    _formState.formElements.btnEdit = {
      ..._formState.formElements.btnEdit,
      disabled: false,
    }
    if (formState.userConfig?.presetCostenterId ?? 0 > 0) {
      _formState.formElements.cbCostCentre = {
        ..._formState.formElements.cbCostCentre,
        disabled: true,
      }
    }
    if (_formState.transaction.master.lblSRAmount != null && _formState.transaction.master.lblSRAmount != "") {
      _formState.formElements.sRAmountLabel = {
        ..._formState.formElements.sRAmountLabel,
        visible: true,
        label: _formState.transaction.master.lblSRAmount,
      }
    }
    if (formState.transaction.master.isPosted) {
      _formState.formElements.postedTransactionLabel = {
        ..._formState.formElements.postedTransactionLabel,
        visible: true,
        label: t("posted_transaction")
      }
    }
    if (clientSession.isAppGlobal && [VoucherType.SalesInvoice, VoucherType.SalesReturn].includes(_formState.transaction.master.voucherType as any)) {
      if (applicationSettings.gSTTaxesSettings.enableEInvoiceIndia ||
        (["WHOLESALE", "INTERSTATE", "INT STATE"].includes(_formState?.transaction.master.voucherForm.toUpperCase()) && _formState.transaction.master.voucherType == VoucherType.SalesInvoice) ||
        (["WHOLESALE", "INT", "B2B"].includes(_formState?.transaction.master.voucherForm.toUpperCase()) && _formState.transaction.master.voucherType == VoucherType.SalesReturn)
      ) {
        if (_formState?.transaction?.eInvoiceStatus === "IRN_GENERATED") {
          _formState.formElements.btnEinvoice = {
            ..._formState.formElements.btnEinvoice,
            visible: true,
          }
          _formState.formElements.einvoiceLabel = {
            ..._formState.formElements.einvoiceLabel,
            visible: true,
            label: "E-Invoice Submitted",
            bg: "bg-green-400",
          }

        } else if (_formState?.transaction?.eInvoiceStatus === "IRN_CANCELLED") {
          _formState.formElements.einvoiceLabel = {
            ..._formState.formElements.einvoiceLabel,
            visible: true,
            label: "E-Invoice Cancelled",
            bg: "bg-yellow-400",
          }
          _formState.formElements.btnSave = {
            ..._formState.formElements.btnSave,
            disabled: true,
          }
          _formState.formElements.btnEdit = {
            ..._formState.formElements.btnEdit,
            disabled: true,
          }
          _formState.formElements.btnDelete = {
            ..._formState.formElements.btnDelete,
            disabled: true,
          }
        }
      }
      if (applicationSettings.gSTTaxesSettings.enableEWB && formState.userConfig?.autoEwayBill) {
        if (_formState?.transaction?.eInvoiceStatus === "EWB_GENERATED") {
          _formState.formElements.btnEWB = {
            ..._formState.formElements.btnEWB,
            visible: true,
          }
          _formState.formElements.eWBLabel = {
            ..._formState.formElements.eWBLabel,
            visible: true,
            label: "EWB Submited",
            bg: "bg-green-400",
          }

        } else if (_formState?.transaction?.ewbStatus === "EWB_CANCELLED") {
          _formState.formElements.eWBLabel = {
            ..._formState.formElements.eWBLabel,
            visible: true,
            label: "EWB Cancelled",
            bg: "bg-yellow-400",
          }
          _formState.formElements.btnSave = {
            ..._formState.formElements.btnSave,
            disabled: true,
          }
          _formState.formElements.btnEdit = {
            ..._formState.formElements.btnEdit,
            disabled: true,
          }
          _formState.formElements.btnDelete = {
            ..._formState.formElements.btnDelete,
            disabled: true,
          }
        }
      }
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
          !["GRN", "PO", "SO"].includes(loadVType ?? "") && disablePnlMasters,
      },
      btnSave: {
        ..._formState.formElements.btnSave,
        disabled:
          _formState.transaction.master.isLocked === true
            ? true
            : _formState.formElements.btnSave.disabled,
      },
      cashPaid: {
        ..._formState.formElements.cashPaid,
        disabled:
          _formState.transaction.master.isLocked === true && userSession.userTypeCode === "BA"
            ? false
            : true,
      }
    };
    if (showLoading) {
      _formState.transactionLoading = false;
    }
    await setTransVoucher(_formState);

    return true;
  };
  const setTransVoucher = async (
    _formState: TransactionFormState,
    loadUserConfig: boolean = false
  ) => {
    const userConfig = _formState.userConfig;

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
      isInitial: true,
    };
    if (userConfig) {
      _formState.userConfig = userConfig;
      _formState.currentTheme = ct;
      _formState.selectedTheme = ct;
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
    manualInvoiceNumber: any = "",
    transactionMasterID?: number,
    loadVType: string = "",
    loadFType?: string,
    loadPrefix?: string,
    pDTInvTransMasterID: number = 0,
    invokeUsingVoucherNumber: boolean = true,
    sbLedgerID?: number,
    isSalesBookingLoaded: boolean = false,
    sbCashReceived?: number | 0,
    sbBillDiscount?: number | 0,
  ) => {
    let voucher: TransactionFormState = JSON.parse(
      JSON.stringify({
        ...formState,
        openUnsavedPrompt: false,
      })
    );
    let url = `${Urls.inv_transaction_base}${transactionType}`;

    let out_voucherType =
      voucherType ?? (formState.transaction?.master?.voucherType || "");
    let out_voucherForm =
      formType ?? (formState.transaction?.master?.voucherForm || "");
    
    // ----------------- Check This condition------------
    let ignoreTaxOnDiscountCalculateTotal = true

    if (loadVType == "SO") {
      url = url + "/LoadSO";
    }
    if (loadVType == "SQ") {
      url = url + "/LoadSQ";
    }
    if (loadVType == "GD") {
      url = url + "/LoadGD";
    }
    if (loadVType == "GDQ") {
      loadVType = "GD"
      url = url + "/LoadGDQuotation";
    }
    // Need to check is this method is good or not
    if(loadVType == "SQinSO" || loadVType == "SQinGR" || loadVType == "SQinGD" || loadVType == "SQinRFQ" || loadVType == "SQinGDR" || loadVType == "SQinGRR"){
      loadVType = "SQ"
    }
    if( loadVType == "GDinGDR"){
      loadVType = "GD"
    }
    // ----------------- Check This condition------------
    if(loadVType == "DR"){
      ignoreTaxOnDiscountCalculateTotal = false;
    }
    if (!usingManualInvNumber) {
      if (voucherNumber == undefined || voucherNumber <= 0) {
        return voucher;

      }
    }
    const params: Record<any, any> = {
      VoucherNumber: loadVType === "" ? voucherNumber ?? formState.transaction.master.voucherNumber : voucherNumber,
      voucherPrefix: loadVType === "" ? voucherPrefix ?? formState.transaction.master.voucherPrefix : loadPrefix,
      voucherType: loadVType === "" ? out_voucherType : loadVType,
      voucherForm: loadVType === "" ? out_voucherForm : formType,
      // InvokeUsingVoucherNumber: !usingManualInvNumber,
      isUsingManualInvNo: usingManualInvNumber,  // This is for load and more manual invoice number
      IsUsingManualInvoiceNo: usingManualInvNumber, // This is for load and more manual invoice number in haeder
      autoEwayBill: formState.userConfig?.autoEwayBill ?? false, // for india sales
      isActualPriceVisible:
        formState.gridColumns.find((x) => x.dataField == "actualSalesPrice")
          ?.visible ?? false,
      manualInvoiceNumber: manualInvoiceNumber,
      invokeUsingVoucherNumber: invokeUsingVoucherNumber,
      pDTInvTransMasterID: pDTInvTransMasterID,
      isStockDetailVisible: formState.gridColumns.find((x) => x.dataField == "stockDetails")
        ?.visible ?? false,
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

    // Under Sales
    if (loadVType == "GD") {
      if (vch?.isOk == false) {
        ERPAlert.show({
          icon: "warning",
          title: t(""),
          text: `${vch?.message}`,
          confirmButtonText: t("ok"),
          showCancelButton: false,
        });
        return false;
      }
    }
    let nextVoucher = { voucherPrefix: "", voucherNumber: 0 };

    if (loadVType === "SO" || loadVType === "SQ" || loadVType === "GD" || loadVType === "GDQ") {
      if (vch.master?.invTransactionMasterID > 0) {
        // uncomment after check - show in 1050 - checkIt
        nextVoucher = await getNextVoucherNumber(     
          formType || (formState.transaction.master.voucherForm ?? ""),
          out_voucherType || (formState.transaction.master.voucherType ?? ""),
          voucherPrefix || (formState.transaction.master.voucherPrefix ?? ""),
          true    // isVoucherPrefix
        );
        voucher.isEdit = false;
        voucher.formElements = {
          ...voucher.formElements,
          btnSave: {
            ...voucher.formElements.btnSave,
            disabled: !hasRight(formState.formCode, UserAction.Add),
          },
          btnEdit: { ...voucher.formElements.btnEdit, disabled: true },
          btnDelete: { ...voucher.formElements.btnDelete, disabled: true },
          btnPrint: { ...voucher.formElements.btnPrint, disabled: true },
        };
        if (vch?.master) {
          vch.master.invTransactionMasterID = 0;
          vch.master.voucherNumber = nextVoucher.voucherNumber;
          vch.master.voucherPrefix = nextVoucher.voucherPrefix;
        }
      }
    }
    // invoice button manage - draft mode case
    if (voucher.formElements.chkDraftMode?.visible && out_voucherType === "SID") {
      voucher.formElements = {
        ...voucher.formElements,
        btnConvertToInvoice: {
          ...voucher.formElements.btnConvertToInvoice,
          visible: true,
          disabled: voucher.formElements.btnEdit?.disabled,
        },
      };
    }
    // The above are newly added for sales

    if (vch == null || vch?.master == null) {
      // const vno = await getNextVoucherNumber(params.formType,params.voucherType,params.voucherPrefix, false);
      vch = {
        ...transactionInitialData,
        master: {
          ...transactionInitialData.master,
          voucherNumber: voucherNumber,
          voucherType: voucherType || (formState.transaction.master.voucherType ?? ""),
          voucherPrefix:
            voucherPrefix || (formState.transaction.master.voucherPrefix ?? ""),
          voucherForm: formType || (formState.transaction.master.voucherForm ?? ""),
        },
      };
    }

    if (usingManualInvNumber) {
      vch.master = {
        ...vch.master,
        voucherNumber: loadVType === "SO" || loadVType === "SQ" || loadVType === "GD" || loadVType === "GDQ" ? nextVoucher.voucherNumber : voucherNumber,
        voucherType: voucherType || (formState.transaction.master.voucherType ?? ""),
        voucherPrefix:
          loadVType === "SO" || loadVType === "SQ" || loadVType === "GD" || loadVType === "GDQ" ? nextVoucher.voucherPrefix : voucherPrefix || (formState.transaction.master.voucherPrefix ?? ""),
        voucherForm: formType || (formState.transaction.master.voucherForm ?? ""),
        invTransactionMasterID: vch.master.invTransactionMasterID,

      };
    }
    // clearControlForNew();
    await undoEditMode(
      formState.isEdit,
      transactionMasterID ?? formState.transaction.master.invTransactionMasterID
    );
    voucher.transaction = {
      ...(vch || {}),
      master: {
        ...(vch?.master || {}),
        voucherNumber: loadVType === "SO" || loadVType === "SQ" || loadVType === "GD" || loadVType === "GDQ" ? nextVoucher.voucherNumber : voucherNumber,
        voucherType: out_voucherType || (formState.transaction.master.voucherType ?? ""),
        voucherForm: out_voucherForm || (formState.transaction.master.voucherForm ?? ""),
        hasroundOff: vch?.master?.roundAmount != 0,

        adjustmentAmount: [VoucherType.SalesQuotation, VoucherType.SalesInvoice, VoucherType.GoodsDeliveryNote, VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn].includes(voucherType as any)
          ? round(vch?.master?.adjustmentAmount)
          : vch?.master?.adjustmentAmount,

        bankAmt: [VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(voucherType as any)
          ? round(vch?.master?.bankAmt)
          : vch?.master?.bankAmt,
        refInvTransactionMasterSOID: vch.master.refInvTransactionMasterSOID ?? 0,
        draftTransactionMasterID: formState.draftMode
          ? vch.master.invTransactionMasterID
          : 0,

        /** ---------------- Dates ---------------- */
        transactionDate:
          loadVType === ""
            ? vch.master.transactionDate
            : formState.transaction.master.transactionDate,

        prevTransDate: vch.master.transactionDate,

        // orderDate: new Date(vch.master.orderDate),
        // deliveryDate: new Date(vch.master.deliveryDate),
        // quotationDate: new Date(vch.master.quotationDate),
        // purchaseInvoiceDate: new Date(vch.master.purchaseInvoiceDate),
        // despatchDate: new Date(vch.master.despatchDate),
        // dueDate: new Date(vch.master.dueDate),

        /** ---------------- Party / Ledger ---------------- */
        ledgerID: sbLedgerID != null && sbLedgerID !== 0 ? sbLedgerID : vch.master.ledgerID,
        // inventoryLedgerID: vch.master.inventoryLedgerID,
        oldLedgerID: vch.master.ledgerID,
        isInvoiced: [VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation, VoucherType.GoodsDeliveryNote].includes(voucherType as any) ? vch.master.isInvoiced : false,

        // partyName: vch.master.partyName,
        // address1: vch.master.address1,
        // address2: vch.master.address2,
        // address3: vch.master.address3,
        // address4: vch.master.address4,

        /** ---------------- Order / Reference ---------------- */
        // orderNumber: vch.master.orderNumber,
        // deliveryNoteNumber:
        //   vch.master.deliveryNoteNumber === "0"
        //     ? ""
        //     : vch.master.deliveryNoteNumber,
        // refNumber: vch.master.deliveryNoteNumber,

        /** ---------------- VAT / Customer ---------------- */
        vatNumber:
          loadVType === "SI" || loadVType === ""
            ? vch.master.tokenNumber
            : "",
        // tokenNumber:
        //   loadVType === "SI" || loadVType === ""
        //     ? vch.master.customerType
        //     : "",

        /** ---------------- Remarks ---------------- */
        // remarks: vch.master.remarks,

        /** ---------------- Amounts ---------------- */    
        cashReceived:
          !isSalesBookingLoaded ?
            [VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(voucherType as any)
              ? vch?.master?.cashReturned
              : voucherType == VoucherType.SalesInvoice && !clientSession.isAppGlobal
                ? getFormattedValueIgnoreRounding(vch?.master?.cashReceived)
                : round(vch?.master?.cashReceived)
            : sbCashReceived,
        refDate: [VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn, VoucherType.ServiceInvoice].includes(voucherType as any)
          ? vch?.master?.orderDate : vch?.master?.deliveryDate,

        billDiscount: !isSalesBookingLoaded
          ? voucherType == VoucherType.SalesInvoice && !clientSession.isAppGlobal ? getFormattedValueIgnoreRounding(vch?.master?.billDiscount)
            : [VoucherType.ServiceInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate, VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(voucherType as any)
              ? vch?.master?.billDiscount : round(vch?.master?.billDiscount)
          : sbBillDiscount,

        taxOnDiscount: !isSalesBookingLoaded
          ? getFormattedValueIgnoreRounding(vch?.master.taxOnDiscount)
          : 0,

        srAmount: round(vch?.master?.srAmount),
        couponAmt: round(vch.master.couponAmt),

        // bankAmount: vch.master.bankAmt,
        // cardAmount: vch.master.bankAmt,

        /** ---------------- Cash Received Flag ---------------- */
        hasCashPaid:
          vch.master.cashReceived >= vch.master.grandTotal,   

        /** ---------------- Lock ---------------- */
        // isLocked: vch.master.isLocked, //not in use added for enable disable in above
        // if(isLocked==true){

        // }
        // isLockedEditable:
        //   vch.master.isLocked && userSession.userTypeCode === "BA",

        /** ---------------- Stock ---------------- */
        // stockUpdate: Boolean(vch.master.StockUpdate), //not a field ,for condition check

        /** ---------------- Dispatch ---------------- */
        // DespatchDate
        // despatchDocumentNumber: vch.master.despatchDocumentNumber,

        /** ---------------- Logistics ---------------- */
        // driverID: vch.master.driverID,
        // deliveryManID: vch.master.deliveryManID,
        // vehicleID: vch.master.vehicelID,
        // gatePassNo: vch.master.gatePassNo,

        // /** ---------------- Sales / Incentive ---------------- */
        // salesmanIncentive: vch.master.salesManIncentive,

        // /** ---------------- Warehouse ---------------- */
        // fromWarehouseID: vch.master.fromWarehouseID,

        /** ---------------- Cost Centre ---------------- */
        costCentreID:
          vch.master.costCentreID > 0
            ? vch.master.costCentreID
            : formState.userConfig?.presetCostenterId ?? 0 > 0
              ? formState.userConfig?.presetCostenterId //disable cost centre -done
              : applicationSettings.accountsSettings.defaultCostCenterID,

        /** ---------------- Project ---------------- */
        // projectID: vch.master.projectID,

        /** ---------------- Posting ---------------- */
        // isPosted: Boolean(vch.master.isPosted),//logic for lblPosted added above 

        /** ---------------- Privilege Card ---------------- */
        // privCardID: vch.master.privCardID,
        // privAddAmount: vch.master.privAddAmount,
        // privRedeem: vch.master.privRedeem,


        /** ---------------- SO Advance Logic ---------------- */
        soTotalAdvance: vch.master.advanceAmt > 0
          ? `Advance : ${vch.master.advanceAmt}`
          : loadVType == 'SO' && vch.master.cashAmt + vch.master.bankAmt > 0
            ? `Tot: ${round(vch.master.grandTotal)} : 
         Adv: ${round(vch.master.cashAmt + vch.master.bankAmt)}, 
         Bal: (${round(vch.master.grandTotal - vch.master.cashAmt + vch.master.bankAmt)}` : '',

        // /** ---------------- Cash / Credit ---------------- */
        // cashOrCredit:
        //   vch.master.cashrOrCredit === "Cash"
        //     ? "CASH"
        //     : "CREDIT", //added logic in UI

      } as TransactionMaster,
      details: await refactorDetails(
        vch.details,
        formType ?? vch.master.voucherForm,
        voucherType ?? vch.master.voucherType,
        { result: {} },
        loadVType
      ),
      attachments: [...(vch?.attachments || [])],
    };
    const summaryRes = calculateSummary(voucher.transaction.details, voucher, {
      result: {},
    });
    debugger;
    if (voucher.transaction.master.billDiscount > 0) {
      // ----------------- Check This condition------------
      if(ignoreTaxOnDiscountCalculateTotal === false){
         const taxOnBillDisc = await calculateTaxOnDiscount(voucher.transaction.master.billDiscount, vch.details, ignoreTaxOnDiscountCalculateTotal)
         voucher.transaction.master.taxOnDiscount = Number(taxOnBillDisc);
      }
      const net = summaryRes.summary?.total ?? 0;
      const bilDis = voucher.transaction.master.billDiscount;

      if (net != 0) {
        voucher.billDiscountPerc = bilDis / net * 100;
      } else {
        voucher.billDiscountPerc = 0
      }
    }
    voucher.summary = (
      summaryRes && summaryRes.summary
        ? summaryRes.summary
        : initialInventoryTotals
    ) as SummaryItems;
    voucher = await calculateTotal(
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
    if (voucher.transaction.master.voucherType == VoucherType.SalesReturn && userSession.dbIdValue === "SAMAPLASTICS") {
      voucher.formElements.lBLCashPaid.visible = true;
      if (voucher.transaction.master.cashReturned < voucher.transaction.master.grandTotal) {
        if (voucher.transaction.master.cashReturned > 0) {
          voucher.formElements.lBLCashPaid.label = "PARTIALLY PAID"
        } else {
          voucher.formElements.lBLCashPaid.label = "CREDIT"
        }
      } else {
        voucher.formElements.lBLCashPaid.label = "CASH PAID"
      }
    }
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
    voucher = (await loadLedgerData(voucher)) as any;
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
    // if (voucherType == "LPO") {
    //   return 0;
    // }
    isVoucherPrefix = isVoucherPrefix ? isVoucherPrefix : false;
    isVoucherPrefix =
      isVoucherPrefix;
    const response = await api.getAsync(
      `${Urls.inv_transaction_base}${transactionType}/GetNextVoucherNumber/`,
      `formType=${formType ? formType : ""}&voucherType=${voucherType ? voucherType : ""
      }&voucherPrefix=${voucherPrefix ? voucherPrefix : ""}&isVoucherPrefix=${isVoucherPrefix ? isVoucherPrefix : false
      }`
    );

    const nextVoucherNumber = response || { voucherNumber: 1, voucherPrefix: "" };

    return nextVoucherNumber;
  };
  const selectVoucherForms = async (voucherType: string) => {
    const response = await api.getAsync(
      `${Urls.voucher_selector}${voucherType}`
    );

    return response;
  };

  type CreditLimitResult = {
    exceeded: boolean;
    message: string;
  };

  const checkThePartyCreditLimit = (
    partyLedgerID: number,
    grandTotal: number,
    oldPartyLedgerID: number,
    previousGrandTotal: number,
    creditAmtFromLedgerData?: number,
    creditDaysFromLedgerData?: number,
    partyBalanceFromLedgerData?: number,
    dueBalanceFromLedgerData?: number
  ): CreditLimitResult => {
    let result = false;
    let msg = "";

    let partyBalance = 0;
    let creditAmt = 0;
    let dueBalance = 0;
    let creditDays = 0;

    try {

      // The four extra parameter is added for ledger load case, in that case, the dispatched ledger data is not getting
      creditAmt = creditAmtFromLedgerData ?? (formState.ledgerData.creditAmount || 0);
      creditDays = creditDaysFromLedgerData ?? (formState?.ledgerData.creditDays || 0);
      partyBalance = partyBalanceFromLedgerData ??  (formState?.ledgerData.ledgerBalance || 0);
      dueBalance = dueBalanceFromLedgerData ?? (formState?.ledgerData.dueBalance || 0);

      /* ---------------- CREDIT AMOUNT CHECK ---------------- */
      if (creditAmt > 0) {

        partyBalance +=
          grandTotal -
          (partyLedgerID === oldPartyLedgerID ? previousGrandTotal : 0);

        if (partyBalance > creditAmt) {
          result = true;
          msg = `Credit Amount: ${creditAmt} is exceeded`;

          if (creditDays > 0) {
            msg = `Credit Amount: ${creditAmt} or Credit days ${creditDays} is exceeded`;
          }
        } else {
          result = false;
        }
      }

      // If credit amount itself exceeded → return immediately (same as C#)
      if (result) {
        return { exceeded: true, message: msg };
      }

      /* ---------------- CREDIT DAYS CHECK ---------------- */
      if (creditDays > 0) {
        if (dueBalance > 0) {
          msg = `\nCredit Days : ${creditDays} is exceeded.`;
          result = true;
        } else {
          result = false;
        }
      }
    } catch {
      return { exceeded: result, message: msg };
    }

    return {
      exceeded: result,
      message: msg,
    };
  };

 async function validate(): Promise<{
    master: TransactionMaster, isValid: boolean
  }> {
    const master = { ...formState.transaction.master };
    const details = formState.transaction.details;
    const formType = master.voucherForm ?? "";
    const voucherType = master.voucherType ?? "";
    const isKSAEInvoice = applicationSettings.branchSettings.maintainKSA_EInvoice;
    const isIndia = clientSession.isAppGlobal;
    const cashReceived = Number(master.cashReceived) || 0;
    const cardAmount = Number(master.bankAmt) || 0;
    const grandTotal = master.grandTotal || 0;
    const vatNumber = (master.tokenNumber ?? "").trim();
    const customerType = master.customerType ?? "";
    const vrPrefix = master.voucherPrefix ?? "";
    const vrNumber = master.voucherNumber || 0;

    // Get first free row index (first row without a product)
    const firstFreeRow = details.findIndex((x) => !x.productID || x.productID === 0);
    const validDetails = firstFreeRow === -1 ? details : details.slice(0, firstFreeRow);
    const toLocalDateOnly = (date: string | Date) => {
      const d = new Date(date);
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
      ).toISOString().split("T")[0]; // yyyy-mm-dd
    };
    const softwareDate = toLocalDateOnly(
      clientSession.softwareDate.split("/").reverse().join("-")
    );
    const transactionDate = toLocalDateOnly(master.transactionDate);
    if (applicationSettings.mainSettings.autoChangeTransactionDateByMidnight
      && (voucherType === VoucherType.SalesInvoice
        && !isIndia)
      && softwareDate != transactionDate) {
      const confirm = await ERPAlert.show({
        icon: "info",
        title: t("date_warning"),
        text: t("system_date_doesn’t_match_transaction_date. Do_you_want_to_update?"),
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
        showCancelButton: true,
      });
      if (!confirm) {
        return {
          master: master,
          isValid: false
        };
      } else {
        master.transactionDate = moment(clientSession.softwareDate, "DD/MM/YYYY").toISOString();
        master.refDate = moment(clientSession.softwareDate, "DD/MM/YYYY").toISOString();
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              transaction: {
                master: {
                  transactionDate: moment(clientSession.softwareDate, "DD/MM/YYYY").toISOString(),
                  refDate: moment(clientSession.softwareDate, "DD/MM/YYYY").toISOString()
                }
              }
            }
          })
        );
      }
    }
    if (clientSession.isDemoVersion) {
      const expiryDate = new Date(clientSession.demoExpiryDate);
      const transDate = new Date(master.transactionDate); // make sure this is a valid date

      // Difference in days
      const diffInDays = Math.floor(
        (expiryDate.getTime() - transDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays < 0 || diffInDays > 30) {
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              formElements: {
                dtpTransDate: {
                  disabled: true
                },
                btnSave: {
                  disabled: true
                },
                dgvInventory: {
                  disabled: true
                }
              }
            }
          })
        );

        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: t("demo_expired_please_activate"),
          confirmButtonText: t("ok"),
          showCancelButton: false
        });

        return {
          master: master,
          isValid: false
        };
      }
    }
    if (
      formState.blnCreateCreditNoteAutomatically &&
      master.invTransactionMasterID > 0 &&
      voucherType === VoucherType.SalesInvoice &&
      !isIndia
    ) {
      const confirm = await ERPAlert.show({
        icon: "question",
        title: t("credit_note_sales_return"),
        text: t("are_you_sure_want_to_create_credit_note_automatically"),
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
        showCancelButton: true,
      });

      if (!confirm) {
        return {
          master: master,
          isValid: false
        };
      }
    }

    // CODE CHECKED########
    // ============ Cash/Card Amount Validations ============ 
    if ((cashReceived < 0 || cardAmount < 0 )&& voucherType==VoucherType.SalesInvoice && !isIndia ) {
      await ERPAlert.show({
        icon: "error",
        title: t("validation_error"),
        text: t("invalid_cash_bank_amount_positive"),
        confirmButtonText: t("ok"),
      });
      return {
        master: master,
        isValid: false
      };
    }

    // CODE CHECKED########
    if (cashReceived + cardAmount > grandTotal * 100 && cashReceived + cardAmount > 10000 && voucherType==VoucherType.SalesInvoice) {
      await ERPAlert.show({
        icon: "error",
        title: t("validation_error"),
        text: t("cash_card_exceeds_100_times_total"),
        confirmButtonText: t("ok"),
      });
      return {
        master: master,
        isValid: false
      };
    }
     //NO india SI and SR added --pending
    // CODE CHECKED########  - Working Not checked/ Tested
    // ============ B2B/B2C Tax Reg Number Validation (KSA) ============
    if (customerType === "B2B" && vatNumber.length !== 15 && applicationSettings.branchSettings.countryName==1 && voucherType==VoucherType.SalesInvoice) {    //For countryId === 1
      await ERPAlert.show({
        icon: "error",
        title: t("validation_error"),
        text: t("b2b_invoice_15_digit_tax_reg_required"),
        confirmButtonText: t("ok"),
      });
      return {
        master: master,
        isValid: false
      };
    }
   //NO india SI and SR added --pending
    // CODE CHECKED########  - Working Not checked/ Tested
    if (customerType === "B2C" && vatNumber.length > 0 && applicationSettings.branchSettings.countryName==1 && voucherType==VoucherType.SalesInvoice) {    // //For countryId === 1
      await ERPAlert.show({
        icon: "error",
        title: t("validation_error"),
        text: t("b2c_invoice_tax_reg_should_be_empty"),
        confirmButtonText: t("ok"),
      });
      return {
        master: master,
        isValid: false
      };
    }

    // CODE CHECKED########
    // Tax Registration number format validation (15 digits, starts with 3, ends with 3)
    if (vatNumber !== "" && applicationSettings.branchSettings.countryName==1 && voucherType==VoucherType.SalesInvoice) {
      if (vatNumber.length !== 15 || !vatNumber.startsWith("3") || !vatNumber.endsWith("3")) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: `${t("invalid_tax_registration_number")} ${master.partyName} ${t("please_check")}`,
          confirmButtonText: t("ok"),
        });
        return {
          master: master,
          isValid: false
        };
      }
    }

    // CODE CHECKED########
    // E-Invoice: Transaction date should not be post-dated
    if (isKSAEInvoice && formType === "VAT" 
      && [VoucherType.SalesInvoice,VoucherType.SalesReturn].includes(voucherType as any)) {
      const transDate = new Date(master.transactionDate);
      const today = new Date();
      transDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (transDate > today) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: t("transaction_date_should_not_be_post_dated_when_ksa_einvoice_is_enabled"),
          confirmButtonText: t("ok"),
        });
        return {
          master: master,
          isValid: false
        };
      }

      // E-Invoice: Grand total should be greater than zero
      //   if (grandTotal <= 0) {
      //     await ERPAlert.show({
      //       icon: "error",
      //       title: t("validation_error"),
      //       text: t("einvoice_total_should_be_greater_than_zero"),
      //       confirmButtonText: t("ok"),
      //     });
      //     return false;
      // }
    }

    // CODE CHECKED########
    // ============ Excess Card Amount Check ============ 
    if (cashReceived + cardAmount > grandTotal 
      && [VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(voucherType as any)) {
      if (cardAmount > 0) {
        if (formState.userConfig?.allowExcessCashReceipt) {
          const confirmed = await ERPAlert.show({
            icon: "error",
            title: t("validation_error"),
            text: t("excess_card_amount_entered, do_you_want_to_continue"),
            confirmButtonText: t("yes"),
            cancelButtonText: t("no"),
          });

          if (!confirmed) {
            return {
              master: master,
              isValid: false
            };
          }
        }
        else {
          await ERPAlert.show({
            icon: "error",
            title: t("validation_error"),
            text: t("excess_card_amount_entered"),
            confirmButtonText: t("ok"),
            showCancelButton: false,
          });
          return {
            master: master,
            isValid: false
          };
        }
      }
    }
    // discount given . So it should be authorised
    if (voucherType == VoucherType.SalesInvoice && applicationSettings.inventorySettings.blockBillDiscount == "If Authentication Fails") {
      if (master.billDiscount > 0 && master.billDiscount > applicationSettings.inventorySettings.discontAuthorizationIfDiscountAbove) {
        let isAuthorized = false;
        const action = `Are you sure to allow discount : ${master.billDiscount} in  ${voucherType}:${formType}:${vrPrefix}${vrNumber}`;
        isAuthorized = await SalesAuthorization(action);
        if (!isAuthorized) {
          return {
            master: master,
            isValid: false
          };
        }
      }
    }
    //present in All
    // CODE CHECKED########
    // ============ Grand Total Check ============
    if (grandTotal < 0) {
      await ERPAlert.show({
        icon: "error",
        title: t("validation_error"),
        text: t("wrong_value_or_discount"),
        confirmButtonText: t("ok"),
      });
      return {
        master: master,
        isValid: false
      };
    }

    // ============ Credit Stopped Validation ============
    // if (formState.ledgerData?.creditStopped) {
    //   if (cashReceived + cardAmount < grandTotal) {
    //     await ERPAlert.show({
    //       icon: "error",
    //       title: t("validation_error"),
    //       text: t("credit_stopped_for_customer"),
    //       confirmButtonText: t("ok"),
    //     });
    //     return false;
    //   }
    // }

    // CODE CHECKED########
    // ============ Stock Update Warning ============
    if (!master.stockUpdate 
      && [VoucherType.SalesInvoice,VoucherType.SalesReturn,VoucherType.SaleReturnEstimate].includes(voucherType as any)) {
      const confirm = await ERPAlert.show({
        icon: "info",
        title: t("stock_update_warning"),
        text: voucherType === "SI"
          ? t("stock_cannot_be_updated_gd_already_deducted . do_you_want_to_continue?")
          : t("stock_cannot_be_updated_gdr_already_updated . do_you_want_to_continue?"),
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
        showCancelButton: true,
      });
      if (!confirm) {
        return {
          master: master,
          isValid: false
        };
      }
    }

    // CODE CHECKED########
    // ============ Cost Centre Validation ============
    if (applicationSettings.accountsSettings.maintainCostCenter 
      && [VoucherType.SalesInvoice,VoucherType.SalesReturn,VoucherType.SaleReturnEstimate].includes(voucherType as any)) {
      if (isNullOrUndefinedOrZero(master.costCentreID)) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: t("select_valid_cost_centre"),
          confirmButtonText: t("ok"),
          showCancelButton: false,
          onConfirm: () => {
            setTimeout(() => {
              costCenterRef?.current?.focus();
              costCenterRef?.current?.click();
            }, 100);
          },
        });
        return {
          master: master,
          isValid: false
        };
      }
    }
    // CODE CHECKED########
    // ============ Salesman Validation ============
    // formState.userConfig?.enableSalesMan - This condition is removed due to some reason - ask ashar
    // In back end they written it is mandatory always - not need to check local settings
    if ([VoucherType.SalesInvoice,
        VoucherType.SalesOrder,VoucherType.GoodRequest,VoucherType.RequestForQuotation,
        VoucherType.SalesQuotation].includes(voucherType as any)) {
      if (isNullOrUndefinedOrZero(master.employeeID)) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: t("select_valid_salesman"),
          confirmButtonText: t("ok"),
          showCancelButton: false,
          onConfirm: () => {
            setIsDropDownOpen?.({ open: true, autoAddressFocus: false });
            setTimeout(() => {
              employeeRef?.current?.focus();
              employeeRef?.current?.click();
            }, 100);
          },
        });
        return {
          master: master,
          isValid: false
        };
      }
    }

    if (userSession.dbIdValue == "543140180640"
      && voucherType == VoucherType.SalesInvoice
      && !clientSession.isAppGlobal
      && formState.voucherNumberLck == true) {
      //no warning in 1050 only block
      await ERPAlert.show({
        title: t("voucher_number_lock_checked"),
        text: t("please_verify_voucher_number_and_disable_it_before_save"),
        icon: "warning",
      });
      return {
        master: master,
        isValid: false
      };
    }
    debugger;
    // CODE CHECKED########
    // ============ Transaction Date Validation ============
    const transDateValidation = validateTransactionDate(
      new Date(master.transactionDate),
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
      return {
        master: master,
        isValid: false
      };
    }
    // WORKING NOT TESTED
    if (voucherType === VoucherType.SalesInvoice) {
      const closedDateResult = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/GetClosedDate/${"Sales"}`
      );
      const closedDate = new Date(closedDateResult);
      const transDate = new Date(master.transactionDate);

      // Normalize time
      closedDate.setHours(0, 0, 0, 0);
      transDate.setHours(0, 0, 0, 0);

      if (closedDate >= transDate) {
        const confirm = await ERPAlert.show({
          icon: "question",
          title: t("day_closed"),
          text: t("day_closed_do_you_want_to_continue_with_next_transaction_date"),
          confirmButtonText: t("yes"),
          cancelButtonText: t("no"),
          showCancelButton: true,
        });

        if (!confirm) {
          return {
            master: master,
            isValid: false
          };
        } else {
          const today = new Date();
          const softwareDate = new Date(clientSession.softwareDate);
          today.setHours(0, 0, 0, 0);
          softwareDate.setHours(0, 0, 0, 0);
          if (today > softwareDate) {
            clientSession.softwareDate = today.toString();
            master.transactionDate = today.toString();
          } else {
            // TO do 
            // Set Software date popup and set that date as clientSession.softwareDate --frmDateChange() in 1050
            // Opens Date Picker Modal
            const selectedDate = await SalesDateChange();
            if (selectedDate) {
              dispatch(setClientSession({ ...clientSession, softwareDate: selectedDate }));
            }
            master.transactionDate = clientSession.softwareDate;
            return {
              master: master,
              isValid: false
            };
          }
        }
      }
    }

    // CODE CHECKED########  - Working Not checked/ Tested
    // ============ Credit Limit Check ============
    const creditMode = applicationSettings.accountsSettings.blockOnCreditLimit;
    const creditRes = checkThePartyCreditLimit(
      master.ledgerID,
      grandTotal,
      formState.oldLedgerId || 0,
      formState.previousGrandTotal || 0
    );

    if (creditMode === "Block" && [VoucherType.SalesInvoice, VoucherType.GoodsDeliveryNote].includes(voucherType as any)) {
      if (creditRes.exceeded) {
        await ERPAlert.show({
          icon: "error",
          title: t("credit_limit_exceeded"),
          text: `${creditRes.message} ${t("cannot_be_proceeded")}`,
          confirmButtonText: t("ok"),
          showCancelButton: false
        });
        return {
          isValid: false,
          master: master
        };
      }
    }

    if ((creditMode === "Allow Cash Sales" && voucherType == VoucherType.SalesInvoice && !applicationSettings.accountsSettings.showTenderDialogInSales && isIndia)
      || (creditMode === "Allow Cash Sales" && voucherType == VoucherType.SalesInvoice && !isIndia)) {
      if (creditRes.exceeded) {
        if (grandTotal > cashReceived + cardAmount) {
          await ERPAlert.show({
            icon: "warning",
            title: t("credit_limit_exceeded"),
            text: `${creditRes.message}. ${t("proceed_with_cash_bank_receipt")}`,
            confirmButtonText: t("ok"),
            showCancelButton: false
          });
          return {
            isValid: false,
            master: master
          };
        }
      }
    }

    if ((creditMode === "Warn" && voucherType == VoucherType.SalesInvoice && !applicationSettings.accountsSettings.showTenderDialogInSales && isIndia)
      || (creditMode === "Warn" && voucherType == VoucherType.SalesInvoice && !isIndia)
      || (creditMode === "Warn" && voucherType == VoucherType.GoodsDeliveryNote)
    ) {
      if (creditRes.exceeded) {
        await ERPAlert.show({
          icon: "warning",
          title: t("warning"),
          text: creditRes.message,
          confirmButtonText: t("ok"),
          showCancelButton: false
        });
      }
    }
    if (applicationSettings.mainSettings.maintainSalesRouteCreditLimit === true && [VoucherType.SalesInvoice, VoucherType.GoodsDeliveryNote].includes(voucherType as any)) {
      const response = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/LoadSalesRouteCreditLimit/${master.ledgerID}`
      );
      if (response) {
        const trnsAmount = Number(response.amount || 0);
        const creditLimit = Number(response.creditLimit || 0);
        const grandTotal = Number(master.grandTotal || 0); // replace if needed
        if (creditLimit > 0 && (trnsAmount + grandTotal > creditLimit)) {
          const confirm = await ERPAlert.show({
            icon: "question",
            title: t("sales_route_credit_limit"),
            text: `${t("current_credit_amount_is")} ${trnsAmount}. ${t("sales_route_credit_limit_reached_do_you_want_to_continue")}`,
            confirmButtonText: t("yes"),
            cancelButtonText: t("no"),
            showCancelButton: true,
          });
          if (!confirm) {
            return {
              isValid: false,
              master: master,
            };
          }
        }
      }
    }

    //#region Counter Shift GCC
    if (applicationSettings.accountsSettings.allowSalesCounter === true
      && userSession.isMaintainShift === true
      && voucherType == VoucherType.SalesInvoice
      && !isIndia
    ) {

      // 1️⃣ If shift not opened
      if (clientSession.counterShiftId === 0) {

        await ERPAlert.show({
          icon: "warning",
          title: t("counter_not_opened"),
          text: t("please_open_the_counter_for_transaction"),
          confirmButtonText: t("ok"),
        });
        // To do
        // await openCounterShiftDialog(); // equivalent to frmCounterShift().ShowDialog()
        return {
          isValid: false,
          master: master
        };
      }

      // 2️⃣ Shift is opened → Get Shift Opened Date
      const response = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/GetShiftOpenedDate`
      );

      if (response) {

        const shiftOpenedTime = new Date(response.transactionDate);
        const transDate = new Date(master.transactionDate);

        shiftOpenedTime.setHours(0, 0, 0, 0);
        transDate.setHours(0, 0, 0, 0);

        const combined = new Date(shiftOpenedTime);
        combined.setHours(combined.getHours() + 29);

        const nowHour = new Date().getHours();

        // 3️⃣ Main Condition
        if (
          shiftOpenedTime.getTime() === transDate.getTime() ||
          (
            shiftOpenedTime <= transDate &&
            transDate <= combined &&
            nowHour < 5
          )
        ) {

          if (!applicationSettings.mainSettings.autoChangeTransactionDateByMidnight) {
            clientSession.softwareDate = shiftOpenedTime.toString();
          }

          master.transactionDate = clientSession.softwareDate;

        }
        else if (
          shiftOpenedTime > transDate &&
          transDate <= combined
        ) {
          clientSession.softwareDate = shiftOpenedTime.toString();
          master.transactionDate = clientSession.softwareDate;
        }
        else {
          if (applicationSettings.accountsSettings.enable24Hours === false) {

            await ERPAlert.show({
              icon: "warning",
              title: t("counter_shift_required"),
              text: t("please_close_old_counter_and_open_new_counter_for_transaction"),
              confirmButtonText: t("ok"),
            });
            // TO DO
            // await openCounterShiftDialog();
            return {
              isValid: false,
              master: master
            };
          }
        }
      }
    }
    //#endregion Counter Shift GCC
    //#region Counter Shift India
    if ([VoucherType.SalesInvoice,
    VoucherType.SalesReturn, VoucherType.SaleReturnEstimate,
    VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation,
    VoucherType.SalesQuotation].includes(voucherType as any)
      && isIndia) {
      try {
        if (
          applicationSettings.accountsSettings.allowSalesCounter &&
          userSession.isMaintainShift
        ) {

          // 1️⃣ Counter not opened
          if (clientSession.counterShiftId === 0) {

            await ERPAlert.show({
              icon: "warning",
              title: t("counter_required"),
              text: t("please_open_the_counter_for_transaction"),
              confirmButtonText: t("ok"),
            });
            //To do
            // await openCounterShiftDialog();
            return {
              isValid: false,
              master: master
            };
          }

          // 2️⃣ Get Shift Data
          const response = await api.getAsync(
            `${Urls.inv_transaction_base}${transactionType}/GetShiftOpenedDate`
          );

          if (!response) return {
            isValid: true,
            master: master
          };;

          const openTime = new Date(response.openTime);
          const transactionDate = new Date(response.transactionDate);
          const openUserID = Number(response.openUserID);

          const shift = new Date(transactionDate);
          shift.setHours(
            openTime.getHours(),
            openTime.getMinutes(),
            openTime.getSeconds()
          );

          const systemDate = new Date(master.transactionDate);
          const timeDifference =
            (systemDate.getTime() - shift.getTime()) / (1000 * 60 * 60);

          // ===============================
          // 🔹 Allow Minimum Shift Duration
          // ===============================
          if (applicationSettings.accountsSettings.allowMinimumShiftDuration) {

            const minimumShiftDuration =
              applicationSettings.accountsSettings.minimumShiftDuration;

            if (timeDifference >= minimumShiftDuration) {

              await ERPAlert.show({
                icon: "warning",
                title: t("shift_duration_exceeded"),
                text: t("please_close_old_counter_and_open_new_counter_for_transaction"),
                confirmButtonText: t("ok"),
              });
              //To do
              // await openCounterShiftDialog();
              return {
                isValid: false,
                master: master
              };
            }

            // 🔹 User validation
            if (
              userSession.userTypeCode !== "BA" &&
              userSession.userTypeCode !== "CA"
            ) {
              if (userSession.userId !== openUserID) {

                await ERPAlert.show({
                  icon: "warning",
                  title: t("shift_user_mismatch"),
                  text: t("please_close_old_counter_and_open_new_counter_for_transaction"),
                  confirmButtonText: t("ok"),
                });
                //To do
                // await openCounterShiftDialog();
                return {
                  isValid: false,
                  master: master
                };
              }
            }
          }
          // ===============================
          // 🔹 Without Minimum Shift Duration
          // ===============================
          else {
            if (!applicationSettings.accountsSettings.enable24Hours) {
              const shiftOpenedTime = new Date(response.transactionDate);
              const combined = new Date(shiftOpenedTime);
              combined.setHours(combined.getHours() + 24);
              const softwareDate = new Date(clientSession.softwareDate);
              if (
                shiftOpenedTime.toDateString() === softwareDate.toDateString() ||
                (shiftOpenedTime >= softwareDate &&
                  softwareDate <= combined)
              ) {
                if (
                  userSession.userTypeCode !== "BA" &&
                  userSession.userTypeCode !== "CA"
                ) {
                  if (userSession.userId !== openUserID) {

                    await ERPAlert.show({
                      icon: "warning",
                      title: t("shift_user_mismatch"),
                      text: t("please_close_old_counter_and_open_new_counter_for_transaction"),
                      confirmButtonText: t("ok"),
                    });
                    //TO do
                    // await openCounterShiftDialog();
                    return {
                      isValid: false,
                      master: master
                    };
                  }
                }
              }
              else if (
                shiftOpenedTime > softwareDate &&
                softwareDate <= combined
              ) {
                const confirm = await ERPAlert.show({
                  icon: "question",
                  title: t("shift_date"),
                  text: `${t("shift_opened_in_new_date_transaction_date_need_to_change_to")} ${shiftOpenedTime.toLocaleDateString()} ${t("do_you_want_to_continue")}`,
                  confirmButtonText: t("yes"),
                  cancelButtonText: t("no"),
                  showCancelButton: true,
                });
                if (confirm) {
                  clientSession.softwareDate = shiftOpenedTime.toString();
                  master.transactionDate = shiftOpenedTime.toString();
                }
              }
              else {

                await ERPAlert.show({
                  icon: "warning",
                  title: t("shift_required"),
                  text: t("please_close_old_counter_and_open_new_counter_for_transaction"),
                  confirmButtonText: t("ok"),
                });
                //To do
                // await openCounterShiftDialog();
                return {
                  isValid: false,
                  master: master
                };
              }
            }
          }
        }
        return {
          isValid: true,
          master: master
        };
      } catch (error) {

        await ERPAlert.show({
          icon: "warning",
          title: t("shift_error"),
          text: t("please_close_old_counter_and_open_new_counter_for_transaction"),
          confirmButtonText: t("ok"),
        });

        // To do
        // await openCounterShiftDialog();
        return {
          isValid: false,
          master: master
        };
      }
    }
    //#endregion Counter Shift India
     //in all
    // CODE CHECKED########
    // ============ Party Selection Check ============
    if (isNullOrUndefinedOrZero(master.ledgerID)) {
      await ERPAlert.show({
        icon: "error",
        title: t("invalid_party"),
        text: t("party_or_cash_account_should_be_selected"),
        confirmButtonText: t("ok"),
        showCancelButton: false
      });
      return {
        master: master,
        isValid: false
      };
    }

    // CODE CHECKED########
    // ============ Mobile Number Mandatory Check ============
    if ((applicationSettings.inventorySettings?.mobileNumberMandotryInSales 
      && voucherType==VoucherType.SalesInvoice && !isIndia)||
    (applicationSettings.inventorySettings?.mobileNumberMandotryInSales 
      && [VoucherType.SalesInvoice,VoucherType.SalesOrder,VoucherType.GoodRequest,VoucherType.RequestForQuotation,VoucherType.SalesQuotation].includes(voucherType as any) && isIndia) ) {
      if (isNullOrUndefinedOrEmpty(master.address4)) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: t("please_enter_mobile_number"),
          confirmButtonText: t("ok"),
          showCancelButton: false,
          onConfirm: () => {
            // Open the sales header dropdown and focus mobile number field
            setIsDropDownOpen?.({ open: true, autoAddressFocus: false });
            setTimeout(() => {
              mobileNumRef?.current?.focus();
              mobileNumRef?.current?.select();
            }, 100);
          },
        });
        return {
          master: master,
          isValid: false
        };
      }
    }

    // ============ Row Level Validations ============
    for (let i = 0; i < validDetails.length; i++) {
      const row = validDetails[i];

      // CODE CHECKED########
      // Tax calculation validation
      if ((row.vatPerc ?? 0) === 0 && (row.vatAmount ?? 0) > 0 
      &&[VoucherType.SalesInvoice,
        VoucherType.SalesOrder,VoucherType.GoodRequest,VoucherType.RequestForQuotation,
        VoucherType.SalesQuotation].includes(voucherType as any)&& !isIndia) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: `${t("invalid_tax_calculation_in_row")} ${i + 1}`,
          confirmButtonText: t("ok"),
        });
        return {
          master: master,
          isValid: false
        };
      }

      // CODE CHECKED########
      // Product batch ID validation
      if (isNullOrUndefinedOrZero(Number(row.productBatchID))) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: `${t("invalid_item_details_in_row")} ${i + 1}. ${t("please_correct_or_remove_row")}`,
          confirmButtonText: t("ok"),
          showCancelButton: false
        });
        return {
          master: master,
          isValid: false
        };
      }
      // CODE CHECKED########
      // Unit validation
      if (isNullOrUndefinedOrZero(row.unitID)) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: `${t("invalid_unit_selection_in_row")} ${i + 1}`,
          confirmButtonText: t("ok"),
          showCancelButton: false
        });
        return {
          master: master,
          isValid: false
        };
      }
      // CODE CHECKED########
      // Zero quantity/rate validation
      if ((row.free ?? 0) === 0 && row.gross === 0 && voucherType == VoucherType.SalesInvoice && !isIndia
        || (row.gross === 0 && voucherType == VoucherType.SalesReturn && !isIndia)
        || (row.gross === 0
          && [VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation, VoucherType.ServiceInvoice].includes(voucherType as any))
        || ((row.free ?? 0) === 0 && row.gross === 0
          && [VoucherType.SalesQuotation, VoucherType.GoodsDeliveryNote, VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn])
      ) {
        const confirm = await ERPAlert.show({
          icon: "question",
          title: t("zero_rate_or_qty"),
          text: `${t("zero_rate_or_qty_entered_in_row")} ${i + 1}. ${t("do_you_want_to_continue")}`,
          confirmButtonText: t("yes"),
          cancelButtonText: t("no"),
          showCancelButton: true,
        });
        if (confirm !== true) {
          const rowIndex = details.findIndex((x) => x.slNo === row.slNo);
          const res = safeFocusColumn(rowIndex, "qty");
          setCurrentCell(res, details[rowIndex] as TransactionDetail, true);
          return {
            master: master,
            isValid: false
          };
        }
      }
      if ((row.free ?? 0) === 0 && row.gross === 0 &&
        [
          VoucherType.SalesInvoice,
          VoucherType.SalesReturn,
          VoucherType.SaleReturnEstimate
        ].includes(voucherType as any) &&
        isIndia
      ) {
        const confirm = await ERPAlert.show({
          icon: "question",
          title: t("zero_value"),
          text: `${t("zero_rate_or_qty_entered_in_row")} ${i + 1}. ${t("do_you_want_to_continue")}`,
          confirmButtonText: t("yes"),
          cancelButtonText: t("no"),
          showCancelButton: true,
        });

        if (confirm !== true) {
          const rowIndex = details.findIndex((x) => x.slNo === row.slNo);
          const res = safeFocusColumn(rowIndex, "qty");
          setCurrentCell(res, details[rowIndex] as TransactionDetail, true);

          return {
            master: master,
            isValid: false
          };
        } else {
          if ((row.qty ?? 0) === 0 && (row.free ?? 0) === 0) {
            await ERPAlert.show({
              icon: "warning",
              title: t("invalid_entry"),
              text: t("both_qty_and_free_cannot_be_zero_please_update_the_values"),
              confirmButtonText: t("ok"),
              showCancelButton: false
            });

            const rowIndex = details.findIndex((x) => x.slNo === row.slNo);
            const res = safeFocusColumn(rowIndex, "qty");
            setCurrentCell(res, details[rowIndex] as TransactionDetail, true);

            return {
              master: master,
              isValid: false
            };
          }
        }
      }


      // Zero quantity/rate validation
      if (formState.userConfig?.blockZeroFigureEntry
        && voucherType == VoucherType.SalesInvoice
        && !isIndia) {
        if ((row.free ?? 0) === 0 && row.qty === 0) {
          const confirm = await ERPAlert.show({
            icon: "question",
            title: t("zero_rate_or_qty"),
            text: `${t("zero_rate_or_qty_entered_in_row")} ${i + 1}. ${t("cant_proceed!")}`,
            confirmButtonText: t("ok"),
            showCancelButton: false,
          });
          if (!confirm) {
            const rowIndex = details.findIndex((x) => x.slNo === row.slNo);
            const res = safeFocusColumn(rowIndex, "qty");
            setCurrentCell(res, details[rowIndex] as TransactionDetail, true);
            return {
              master: master,
              isValid: false
            };
          }
          return {
            master: master,
            isValid: false
          };
        }
      }
      // 🔹 Serial Checking
      if (userSession.dbIdValue !== "543140180640" && [VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(voucherType as any)) {

        for (let i = 0; i < details.length; i++) {

          const row = details[i];

          if ((row.productDescription ?? "").trim() !== "") {

            const serials = row.productDescription.split(",");

            for (const rawSerial of serials) {

              const serial = rawSerial.trim();

              if (serial !== "") {

                try {

                  // 🔹 Block Non Stock Serial Selling
                  if (applicationSettings.inventorySettings.blockNonStockSerialSelling) {

                    const params = new URLSearchParams({
                      SerialNumber: serial,
                      OldInvTransMasterID: master.invTransactionMasterID.toString()
                    });

                    const imeiCount = await api.getAsync(
                      `${Urls.inv_transaction_base}${transactionType}/GetCountofIMEI?${params.toString()}`
                    );
                    if (imeiCount <= 0) {

                      await ERPAlert.show({
                        icon: "error",
                        title: t("non_stock_serial"),
                        text: `${i + 1} ${t("row_serial")} '${serial}' ${t("is_out_of_stock")}`,
                        confirmButtonText: t("ok"),
                        showCancelButton: false
                      });
                      return {
                        master: master,
                        isValid: false
                      };
                    }
                  }
                  const vr = await api.postAsync(
                    `${Urls.inv_transaction_base}${transactionType}/CheckSerial`,
                    {
                      Serial: serial,
                      OldInvTransMasterID: master.invTransactionMasterID ?? 0,
                      VoucherType: voucherType,
                      IsEdit: formState.isEdit
                    }
                  );
                  if (vr && vr !== "") {

                    const confirm = await ERPAlert.show({
                      icon: "question",
                      title: t("duplicate_serial"),
                      text: `${i + 1} ${t("row_serial_exists_in")} ${vr}. ${t("do_you_want_to_continue")}`,
                      confirmButtonText: t("yes"),
                      cancelButtonText: t("no"),
                      showCancelButton: true
                    });

                    if (confirm !== true) {
                      return {
                        master: master,
                        isValid: false
                      };
                    }
                  }

                } catch (error) {
                  // silent catch like C#
                }
              }
            }
          }
        }
      }


      // CODE CHECKED########
      // Bulk quantity warning
      if ((row.qty ?? 0) > 100000 && voucherType == VoucherType.SalesInvoice) {
        const confirm = await ERPAlert.show({
          icon: "question",
          title: t("bulk_qty"),
          text: `${t("bulk_qty_in_row")} ${i + 1}. ${t("do_you_want_to_continue")}`,
          confirmButtonText: t("yes"),
          cancelButtonText: t("no"),
          showCancelButton: true,
        });
        if (!confirm) {
          return {
            master: master,
            isValid: false
          };
        }
      }
    }
    //In all VCH
    // CODE CHECKED########
    // ============ Items After Blank Row Check ============
    if (firstFreeRow !== -1) {
      for (let i = firstFreeRow + 1; i < details.length; i++) {
        if (details[i].productID && details[i].productID > 0) {
          await ERPAlert.show({
            icon: "error",
            title: t("validation_error"),
            text: `${t("items_entered_after_blank_row_will_be_skipped")} ${firstFreeRow + 1}`,
            confirmButtonText: t("ok"),
            showCancelButton: false
          });
          return {
            master: master,
            isValid: false
          };
        }
      }
    }

      // ============ Negative Stock Validation ============

    const showNegStockWarning =
      applicationSettings.inventorySettings?.showNegStockWarning;
    //for sales invoice gcc only
    if (
      master.stockUpdate &&
      (showNegStockWarning === "Block" ||
        applicationSettings.inventorySettings?.showNonStockItemsinSales === false) && voucherType == VoucherType.SalesInvoice && !isIndia
    ) {

      for (let i = 0; i < validDetails.length; i++) {

        const currentRow = validDetails[i];

        if (currentRow.itemType === "Inventory") {

          let totalQty = 0;

          // Determine Warehouse (like C# Wid logic)
          let warehouseID =
            currentRow.warehouseID ?? master.fromWarehouseID ?? 0;

          for (let j = i; j < validDetails.length; j++) {

            const compareRow = validDetails[j];

            // Recalculate warehouse per row (C# logic)
            let compareWarehouseID =
              compareRow.warehouseID ?? master.fromWarehouseID ?? 0;

            const sameProduct =
              compareRow.productBatchID === currentRow.productBatchID;

            const sameWarehouse =
              compareWarehouseID === warehouseID;

            if (sameProduct && sameWarehouse) {

              let qty =
                (compareRow.qty ?? 0) -
                (compareRow.qtyTag ?? 0);

              const multiFactor = await api.getAsync(
                `${Urls.inv_transaction_base}${transactionType}/GetMuQty` +
                `?batchID=${compareRow.productBatchID}` +
                `&unitID=${compareRow.unitID}`
              );

              qty = qty * (multiFactor ?? 1);

              totalQty += qty;
            }
          }
          const stock = currentRow.stock ?? 0;

          if (totalQty > stock) {
            await ERPAlert.show({
              icon: "error",
              title: t("validation_error"),
              text: `${t("negative_stock_in_row")} ${i + 1}. ${t("please_check_items_entered_in_multiple_rows_cannot_proceed")}`,
              confirmButtonText: t("ok"),
            });
            return {
              master,
              isValid: false
            };
          }
        }
      }
    }
    //for all other except sales gcc
    if (
      (master.stockUpdate &&
        (showNegStockWarning === "Block" || applicationSettings.inventorySettings?.showNonStockItemsinSales === false) &&
        (voucherType == VoucherType.SalesInvoice && isIndia))
      || (showNegStockWarning === "Block" &&
        [VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(voucherType as any) &&
        formState.userConfig?.blockNonStockItemsSO)
      || ( showNegStockWarning === "Block" && voucherType == VoucherType.GoodsDeliveryNote)
    ) {
      for (let i = 0; i < validDetails.length; i++) {
        const currentRow = validDetails[i];
        if (currentRow.itemType === "Inventory") {
          let totalQty = 0;
          for (let j = i; j < validDetails.length; j++) {
            const compareRow = validDetails[j];
            const sameProduct =
              compareRow.productBatchID === currentRow.productBatchID;
            if (sameProduct) {
              let qty =
                (compareRow.qty ?? 0) -
                (compareRow.qtyTag ?? 0);
              const multiFactor = await api.getAsync(
                `${Urls.inv_transaction_base}${transactionType}/GetMuQty` +
                `?batchID=${compareRow.productBatchID}` +
                `&unitID=${compareRow.unitID}`
              );
              qty = qty * (multiFactor ?? 1);
              totalQty += qty;
            }
          }
          const stock = currentRow.stock ?? 0;

          if (totalQty > stock) {

            await ERPAlert.show({
              icon: "error",
              title: t("validation_error"),
              text: `${t("negative_stock_in_row")} ${i + 1}. ${t("please_check_items_entered_in_multiple_rows_cannot_proceed")}`,
              confirmButtonText: t("ok"),
            });

            return {
              master,
              isValid: false
            };
          }
        }
      }
    }
    //not added all condition managed in backend
    // CODE CHECKED########  - Working Not checked/ Tested (SAMA PLASTIC CASE, NEEDS TESTING)
    // ============ Rate Warning Check (Sales price less than purchase/min price) ============
    const showRateWarning = applicationSettings.inventorySettings?.showRateWarning;
    if (showRateWarning?.toUpperCase() === "BLOCK" && formType !== "BT" 
    && voucherType == VoucherType.SalesInvoice && !isIndia) {
      // please add password in master --master.AuthorizationPassword
      //please pass header to popup for discount sales etc (Discount Authorisation)
      for (let i = 0; i < validDetails.length; i++) {
        const row = validDetails[i];
        const purchasePrice = row.purchasePrice ?? 0;
        const minSalePrice = row.minSalePrice ?? 0;
        const qty = row.qty ?? 0;
        const netValue = row.netValue ?? 0;
        const isSchemeItem = row.isSchemeItem === "S";

        if (minSalePrice > 0 && minSalePrice * qty > netValue) {
          if (userSession.dbIdValue === "SAMAPLASTICS") {
            if (purchasePrice * qty > netValue && !isSchemeItem) {
              await ERPAlert.show({
                icon: "error",
                title: t("validation_error"),
                text: `${t("sales_price_less_than_purchase_price_in_row")} ${i + 1}. ${t("cant_proceed!")}`,
                confirmButtonText: t("ok"),
              });
              return {
                master: master,
                isValid: false
              };
            }
            await ERPAlert.show({
              icon: "error",
              title: t("validation_error"),
              text: `${t("sales_price_less_than_min_selling_price_in_row")} ${i + 1}. ${t("cant_proceed!")}`,
              confirmButtonText: t("ok"),
            });
            let isAuthorized = false;
            const action = `"User tried to allow Sales Price Less than Min Sales Price ${voucherType}:${formType}:${vrPrefix}${vrNumber}`;
            isAuthorized = await SalesAuthorization(action);
            if (!isAuthorized) {
              return {
                master: master,
                isValid: false
              };
            }

          } else {
            await ERPAlert.show({
              icon: "error",
              title: t("validation_error"),
              text: `${t("sales_price_less_than_min_selling_price_in_row")} ${i + 1}. ${t("cant_proceed!")}`,
              confirmButtonText: t("ok"),
            });
            return {
              master: master,
              isValid: false
            };
          }
        }

        if (purchasePrice * qty > netValue && minSalePrice === 0 && !isSchemeItem) {
          await ERPAlert.show({
            icon: "error",
            title: t("validation_error"),
            text: `${t("sales_price_less_than_purchase_price_in_row")} ${i + 1}. ${t("cant_proceed!")}`,
            confirmButtonText: t("ok"),
          });
          return {
            master: master,
            isValid: false
          };
        }
      }
    }
    //discount validation itemwise
    // 🔹 Discount validation itemwise
    if (userSession.maxDiscPercAllowed > 0.01 && voucherType == VoucherType.SalesInvoice) {

      let maxDisc = userSession.maxDiscPercAllowed;

      for (let i = 0; i < validDetails.length; i++) {

        const discPerc = Number(validDetails[i].discPerc || 0);

        if (maxDisc < discPerc) {
          maxDisc = discPerc;
        }
      }

      if (maxDisc > userSession.maxDiscPercAllowed) {

        const action =
          `give_more_discount_up_to_${maxDisc}_in_${voucherType}:${master.voucherForm}:${master.voucherNumber}`;

        const isAuthorized = await SalesAuthorization(action);
        // const isAuthorised = await SalesAuthorization(
        //   action,
        //   t("discount_authorisation")
        // );

        if (!isAuthorized) {
          return {
            isValid: false,
            master: master,
          };
        }
      }
    }
    //E-invoice validation case 2
    if (applicationSettings.gSTTaxesSettings.enableEInvoiceIndia &&
      ["WHOLESALE", "Int_State", "B2B"].includes((formType).toUpperCase()) &&
      formState.isEdit &&
      (master.invTransactionMasterID ?? 0) > 0 &&
      voucherType == VoucherType.SalesInvoice &&
      isIndia
    ) {
      const response = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/GetEInvoiceDetailsByID/${master.invTransactionMasterID}`
      );
      const dt = response?.tables?.[0] ?? response?.[0] ?? [];
      if (dt.length > 0) {
        if (formState.einvoiceCheckBox === true) {

          await ERPAlert.show({
            icon: "error",
            title: t("e_invoice"),
            text: t("e_invoice_cannot_submit_again_for_same_invoice"),
            confirmButtonText: t("ok"),
            showCancelButton: false
          });

          return {
            master: master,
            isValid: false
          };
        }
      }
    }
    //EWB validation case 2
    if (applicationSettings.gSTTaxesSettings.enableEWB &&
      formState.isEdit &&
      (master.invTransactionMasterID ?? 0) > 0 &&
      voucherType == VoucherType.SalesInvoice &&
      isIndia
    ) {
      const response = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/GetEWBDetailsByID/${master.invTransactionMasterID}`
      );


      const dt = response?.tables?.[0] ?? response?.[0] ?? [];

      if (dt.length > 0) {

        if (formState?.userConfig?.autoEwayBill === true) {

          await ERPAlert.show({
            icon: "error",
            title: t("eway_bill"),
            text: t("ewb_cannot_submit_again_for_same_invoice"),
            confirmButtonText: t("ok"),
            showCancelButton: false
          });

          return {
            master: master,
            isValid: false
          };
        }
      }
    }
    // ============ Voucher Number Zero Check (Edit Mode) ============
    if (formState.isEdit && master.voucherNumber === 0) {
      await ERPAlert.show({
        icon: "error",
        title: t("validation_error"),
        text: t("voucher_number_cannot_be_zero"),
        confirmButtonText: t("ok"),
      });
      return {
        master: master,
        isValid: false
      };
    }

    return {
      master: master,
      isValid: true
    };
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

  const generateLPO = async () => {
    await save("LPO");
  };
  const generateLPQ = async () => {
    await save("LPQ");
  };

  const Tender = (): Promise<any> => {
    return new Promise((resolve) => {
      if (formState.transaction.master.voucherType === "SID") {
        resolve(true);
        return;
      }

      if (applicationSettings.accountsSettings.showTenderDialogInSales) {
        // Store the resolver so it can be called from Tender component
        tenderResolver = resolve;

        dispatch(
          formStateHandleFieldChange({
            fields: { tenderWindow:{ isOpen: true, isFromSave: true }}
          })
        );
      } else {
        resolve(true);
      }
    });
  };

  // E Way bill details modal open manager
  const openEWayBill = (invTransactionMasterIdForeWayBill: number): Promise<boolean> => {
    return new Promise((resolve) => {
      if (clientSession.isAppGlobal) {
        if (formState.eWayBill) {
          if (
            formState.userConfig?.autoEwayBill &&
            applicationSettings.gSTTaxesSettings.enableEWB
          ) {
            eWayBillResolver = resolve;
            dispatch(
              formStateHandleFieldChange({
                fields: {
                  eWayBillDetailOpen: true,
                  eWayBillMasterId: invTransactionMasterIdForeWayBill
                }
              })
            );
            return;
          }
        }
      }
      resolve(true);
    });
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
  const save = async (saveMode: "" | "LPO" | "LPQ" = "") => {
    const validationResult = await validate();
    if (validationResult.isValid == true) {
      let tenderRes;
const isUnderCashOrBank = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/IsCashOrBank/${formState.transaction.master.ledgerID}`)
if([VoucherType.SalesInvoice,VoucherType.DeliveryChallan,VoucherType.GoodsDeliveryNote,VoucherType.PurchaseOrderTransist].includes(formState.transaction.master.voucherType as any) 
  && isUnderCashOrBank){
      tenderRes = await Tender()
      if (!tenderRes) {
        return;
      }
}

      dispatch(
        formStateHandleFieldChange({
          fields: {
            saving: true,
          },
        })
      );
      const master = await attachMaster({
        ...formState,
        transaction: {
          ...formState.transaction,
          master: validationResult.master
        }
      });
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
      // if(formState.isEdit === false){
      //   if(formState.blnCreateCreditNoteAutomatically && formState.transaction.master.invTransactionMasterID > 0){
      //     const voucherType = "SR"
      //     const transactionMasterID = formState.invTransMasterId;
      //     const voucherNumber = formState.transaction.master.voucherNumber;
      //     const res = initializeFormElements(voucherType??"","", "","","",voucherNumber,transactionMasterID??0, false); 
      //   }
      // }
      const sanitizedMaster = sanitizeDataAdvanced({
        ...master,
        voucherType:
          saveMode === "LPO"
            ? "PO"
            : saveMode === "LPQ"
              ? "PQ"
              : master.voucherType,
        customerType:
          !clientSession.isAppGlobal &&
            master.voucherType == "PR" &&
            master.customerType == "" &&
            applicationSettings.branchSettings.maintainKSA_EInvoice
            ? "B2C"
            : master.customerType,
        transactionDate:
          master.transactionDate == "" ? null : master.transactionDate,
      }, transactionInitialData.master);

      let params = {
                    master: {
                      ...sanitizedMaster,
                      deliveryDate: sanitizedMaster.deliveryDate
                        ? sanitizedMaster.deliveryDate
                        : sanitizedMaster.transactionDate
                    },

                    details: dtRes.outputDetails,

                    invAccTransactions: formState.transaction.invAccTransactions ?? [],

                    attachments: attachments ?? [],

                    couponDetails: formState.transaction.couponDetails ?? [],

                    bankCardDetails: formState.transaction.bankCardDetails ?? [],

                    upiDetails: formState.transaction.uPIDetails ?? [],

                    // batchesUnits: formState.transaction.batchesUnits ?? [],

                    privilegeCardDetails: formState.transaction.privilegeCardDetails ?? null,

                    // 🔹 Boolean Flags
                    // isDummyBill: formState.userConfig.isDummyBill ?? false,
                    allowStockUpdate: formState.allowStockUpdate ?? true,
                    isConsoldateSO: formState.isConsolidateSo ?? false,

                    isGatePassPrint: applicationSettings.printerSettings.printGatePass ?? false,
                    isPrintGatepassChecked: formState.gatePassPrint ?? false,

                    lsAlowExcessCashReceipt: formState.userConfig?.allowExcessCashReceipt ?? false,
                    lsBlockZeroFigureEntry: formState.userConfig?.blockZeroFigureEntry ?? false,
                    lsBlockNonStockItemInSO: formState.userConfig?.blockNonStockItemsSO ?? false,
                    // TODO: Ashar
                    isEwayBillChecked: formState.eWayBill ?? false,   // Verify is this correct
                    isEwayBillAutomationChecked: formState.userConfig?.autoEwayBill ?? false,  // Verify is this correct
                    isEInvoiceChecked: formState.einvoiceCheckBox ?? false,  // Verify is this correct


                    // 🔹 Strings
                    pendingOrderListMasterIDs: formState.pendingOrdListMasterIDs ?? null,
                    pendingOrderListBranchIDs: formState.pendingOrdListBranchIDs ?? null,
                    // sr_SalesInvoiceNumber: formState.sr_SalesInvoiceNumber ?? null,
                    // sr_SIPrefix: formState.transaction.sr_SIPrefix ?? null,

                    eInvoiceStatus: formState.transaction.eInvoiceStatus ?? "",
                    ewbStatus: formState.transaction.ewbStatus ?? "",

                    // 🔹 GatePass Items
                    // gatePassItems: formState.transaction.gatePassItems ?? []
                  };
      
      if(tenderRes){
        params.master.cashReceived = tenderRes?.cashReceived;
        params.master.bankAmt = tenderRes.bankAmt;
        params.master.billDiscount = tenderRes?.billDiscount;
        params.bankCardDetails = Array.isArray(tenderRes.bankCardDetails) ? tenderRes.bankCardDetails : [];
        params.upiDetails = tenderRes.upiDetails ?? [];
        params.master.bankLedgerID = tenderRes?.bankCardDetails?.ledgerId  // Check it is needed in non allow multi payment case
      }
      // let params = {
      //   master: {
      //     ...sanitizedMaster,
      //     deliveryDate: sanitizedMaster.deliveryDate ? sanitizedMaster.deliveryDate : sanitizedMaster.transactionDate
      //   },
      //   details: dtRes.outputDetails,
      //   attachments: attachments,
      //   invAccTransactions: formState.transaction.invAccTransactions,
      //   pendingOrderListMasterIDs: formState.pendingOrdListMasterIDs,
      //   PendingOrderListBranchIDs: formState.pendingOrdListBranchIDs,
      //   couponDetails: formState.transaction.couponDetails,
      //   upiDetails: formState.transaction.uPIDetails,
      //   bankCardDetails: formState.transaction.bankCardDetails
      // };
      // params = sanitizeDataAdvanced(params, transactionInitialData);
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
          // If clearDetailsAfterSave is checked, Then clear details, otherwise, disable pnl master
          if (formState.userConfig?.clearDetailsAfterSave) {
            clearControls(true, true);
          } else {
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: {
                  formElements: {
                    pnlMasters: {
                      disabled: true,
                    },
                  },
                },
              })
            );
          }
          dispatch(
            formStateHandleFieldChange({
              fields: {
                savingCompleted: true,
              },
            })
          );
          // to do - ashar
          // E way bill details form opens condition
          // Check the response need to do anything like alert box or something
          if(clientSession.isAppGlobal){
            if(formState.eWayBill){
              if(formState.userConfig?.autoEwayBill && applicationSettings.gSTTaxesSettings.enableEWB){
                 const masterId = saveRes?.item?.master?.invTransactionMasterID;
                  if (masterId) {
                    const response = await openEWayBill(masterId);
                    // check if Manage response needed
                  }
              }
            }
          }
          if (formState.printOnSave == true && saveMode != "LPO" && saveMode != "LPQ") {
            await printVoucher(
              saveRes?.item?.master?.invTransactionMasterID, // masterID
              transactionType ?? "", // transactionType
              formState.transaction?.master.voucherType ?? "", // voucherType
              formState.transaction?.master?.voucherForm ?? "", // formType
              formState.transaction?.master.customerType ?? "", // customerType
              true, //isInv
              formState.userConfig?.printPreview ?? false, // printPreview
              undefined, //template
              formState.transaction?.master.transactionDate ?? "",
              undefined,  //tempData   
              formState?.lastChoosedTemplate?.id //lastChooseTempId
            );
          }

          // ERPToast.show(saveRes.message, "success");
        } else {
          // dispatch(acc)
          const isMobileNumberError = saveRes?.errorCode === 3055 || saveRes?.message?.toLowerCase().includes("please enter the mobile number,invalid mobile number");
          const costCenterError = saveRes?.message?.includes("Select a valid cost centre and try again.");
          const salesManError = saveRes?.message?.includes("Please select a valid  salesman and try again.");
          if (isMobileNumberError) {
            ERPAlert.show({
              icon: "warning",
              title: saveRes.message,
              onConfirm: () => {
                // Open the sales header dropdown and focus mobile number field
                setIsDropDownOpen?.({ open: true, autoAddressFocus: false });
                setTimeout(() => {
                  mobileNumRef?.current?.focus();
                  mobileNumRef?.current?.select();
                }, 100);
              },
            });
          }
          else if (costCenterError) {
            ERPAlert.show({
              icon: "warning",
              title: saveRes.message,
              onConfirm: () => {
                setTimeout(() => {
                  costCenterRef?.current?.focus();
                  costCenterRef?.current?.click();
                }, 100);
              },
            });
          }
          else if (salesManError) {
            ERPAlert.show({
              icon: "warning",
              title: saveRes.message,
              onConfirm: () => {
                setIsDropDownOpen?.({ open: true, autoAddressFocus: false });
                setTimeout(() => {
                  employeeRef?.current?.focus();
                  employeeRef?.current?.click();
                }, 100);
              },
            });
          }
          else {
            ERPAlert.show({
              icon: "warning",
              title: saveRes.message,
            });
          }

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
        dispatch(
          formStateHandleFieldChange({
            fields: {
              saving: false,
              savingCompleted: false,
            },
          })
        );
        ERPAlert.show({
          icon: "warning",
          text: "Please try Again",
          title: "",
        });
      }
    } else {
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
    loadNextVrNo: boolean = true,
    clearMannualInvoiceNumber: boolean = true,
    focusFirstRow: boolean = true
  ) => {
    // UndoEditMode
    initializeFormElements(formState.transaction.master.voucherType ?? ""
      , formState.transaction.master.voucherPrefix ?? "", formState.transaction.master.voucherForm ?? ""
      , formState.formCode ?? "", formState.title ?? "", 0, 0
    );
    return;
    if ((formState.transaction.master.invTransactionMasterID ?? 0) > 0) {
      await undoEditMode(formState.isEdit, formState.transaction.master.invTransactionMasterID ?? 0);
    }

    // Get next voucher number if required
    let vNo = 0;
    let vPrefix = formState.transaction.master.voucherPrefix ?? "";
    if (loadNextVrNo) {
      const vNoRes = await getNextVoucherNumber(
        formState.transaction.master.voucherForm,
        formState.transaction.master.voucherType,
        formState.transaction.master.voucherPrefix,
        false
      );
      vNo = vNoRes.voucherNumber || 0;
      vPrefix = vNoRes.voucherPrefix || "";
    }

    // Determine employee ID
    let employeeID = userSession.employeeId ?? 0;

    // Determine default ledgerID based on settings
    let defaultLedgerID = applicationSettings.accountsSettings.defaultCashAcc;
    if (applicationSettings.accountsSettings?.allowSalesCounter && (userSession.counterwiseCashLedgerId ?? 0) > 0) {
      defaultLedgerID = userSession.counterwiseCashLedgerId;
    }
    if (applicationSettings.accountsSettings?.setDefaultCustomerInSales) {
      defaultLedgerID = applicationSettings.accountsSettings.defaultCustomerLedgerID ?? defaultLedgerID;
    }

    // Determine default customer type
    let customerType = "";
    if (applicationSettings.branchSettings?.maintainKSA_EInvoice) {
      customerType = "B2C";
    }

    // Build the master object with all reset values
    const master: TransactionMaster = {
      ...TransactionMasterInitialData,
      voucherType: formState.transaction.master.voucherType ?? "",
      voucherPrefix: vPrefix ?? formState.transaction.master.voucherPrefix ?? "",
      voucherForm: formState.transaction.master.voucherForm ?? "",
      transactionDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      dueDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      orderDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      quotationDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      purchaseInvoiceDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      deliveryDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      despatchDate: moment(softwareDate, "DD/MM/YYYY").local().toISOString(),
      employeeID: employeeID,
      voucherNumber: vNo,
      inventoryLedgerID:
        formState.transaction.master.voucherType == VoucherType.SalesReturn
          ? applicationSettings.inventorySettings?.defaultSalesReturnAcc
          : applicationSettings.inventorySettings?.defaultSalesAcc,
      ledgerID: defaultLedgerID,
      isLocked: false,
      grandTotal: 0,
      grandTotalFc: 0,
      totalGross: 0,
      totalDiscount: 0,
      billDiscount: 0,
      vatAmount: 0,
      roundAmount: 0,
      cashReceived: 0,
      bankAmt: 0,
      creditAmt: 0,
      srAmount: 0,
      advanceAmt: 0,
      couponAmt: 0,
      taxOnDiscount: 0,
      salesManIncentive: 0,
      partyName: "",
      address1: "",
      address2: "",
      address3: "",
      remarks: "",
      quotationNumber: 0,
      orderNumber: 0,
      purchaseInvoiceNumber: "",
      deliveryNoteNumber: "",
      despatchDocumentNumber: "",
      gatePassNo: "",
      dueDays: 0,
      mannualInvoiceNumber: clearMannualInvoiceNumber ? "" : formState.transaction.master.mannualInvoiceNumber,
      priceCategoryID: formState.defaultPriceCategoryId > 0
        ? formState.defaultPriceCategoryId
        : 0,
      driverID: 0,
      vehicleID: 0,
      deliveryManID: 0,
      salesManID: formState.userConfig?.holdSalesMan ? formState.transaction.master.salesManID : 0,
      customerType: customerType,
      draftTransactionMasterID: 0,
      randomKey: 0,
      privCardID: 0,
      privAddAmount: 0,
      privRedeem: 0,
      fromWarehouseID:
        (formState.userConfig?.presetWarehouseId ?? 0) > 0
          ? formState.userConfig?.presetWarehouseId ?? 0
          : applicationSettings.inventorySettings?.defaultWareHouse,
      costCentreID:
        (formState.userConfig?.presetCostenterId ?? 0) > 0
          ? formState.userConfig?.presetCostenterId ?? 0
          : applicationSettings.accountsSettings.defaultCostCenterID,
    };

    // Reset form state fields specific to sales
    dispatch(
      formStateHandleFieldChange({
        fields: {
          isRowEdit: false,
          isEdit: false,
          total: 0,
          netTotal: 0,
          netAmount: 0,
          amountInWords: "",
          barcodeData: "",
          barcodeTemplate: null,
          summary: initialInventoryTotals,
          printOnSave: true,
          // Sales specific resets
          blnCreateCreditNoteAutomatically: false,
          selectedPartiesDefaultPriceCategoryId: 0,
          giftClaimed: false,
          giftBatchId: 0,
          giftProductBatchId: 0,
          giftProductQty: 0,
          giftProductPrice: 0,
          isSaveClicked: false,
          allowStockUpdate: true,
          creditStopped: false,
          currentLoadedPrefix: "",
          currentLoadedVno: "",
          oldQuoteVatPercentage: 0,
          advanceAmtFromSo: 0,
          randomKey: 0,
          previousGrandTotal: 0,
          partyAccTransDetailId: 0,
          privilegeCardId: 0,
          partyCashRcvdTransDetailId: 0,
          partyBankRcvdTransDetailId: 0,
          oldLedgerId: 0,
          dsBillWiseTrans: null,
          address2: "",
          address3: "",
          guidTransaction: "",
          dtCouponDetails: undefined,
          draftMode: true,
          billDiscountPerc: 0,
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
        },
      })
    );

    // Update master fields
    dispatch(
      formStateMasterHandleFieldChange({
        fields: { ...master },
      })
    );

    // Clear details grid
    dispatch(formStateClearDetails(deviceInfo.isMobile));

    // Clear current cell
    dispatch(
      formStateHandleFieldChange({
        fields: { currentCell: undefined },
      })
    );

    // Clear attachments
    dispatch(formStateClearAttachments());

    // Clear account transactions
    dispatch(
      formStateTransactionUpdate({ key: "invAccTransactions", value: [] })
    );

    // Update form elements state
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: {
          formElements: {
            btnAdd: {
              label: "Add",
            },
            btnSave: {
              disabled: false,
            },
            btnEdit: {
              disabled: false,
            },
            btnDelete: {
              disabled: false,
            },
            btnPrint: {
              disabled: false,
            },
            btnConvertToInvoice: {
              visible: false,
            },
            ledgerID: {
              reload: true,
              disabled: (() => {
                let disabled = false;
                const counterLedgerId = (userSession.counterwiseCashLedgerId ?? 0) > 0;
                const allowSalesCounter = applicationSettings.accountsSettings?.allowSalesCounter === true;
                if (counterLedgerId && allowSalesCounter) {
                  if (formState.transaction.master.voucherType !== "BT") {
                    disabled = true;
                  }
                  if (!userSession?.isMaintainShift && userSession?.dbIdValue !== "SAMAPLASTICS") {
                    disabled = false;
                  }
                }
                return disabled;
              })(),
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
            cbSalesMan: {
              disabled: false,
            },
            pnlMasters: {
              disabled: false,
            },
            pnlPrivilage: {
              visible: false,
            },
            pnlWarehouseStock: {
              visible: false,
            },
            pnlProductInfo: {
              visible: false,
            },
            pnlSearch: {
              visible: false,
            },
            employee: {
              disabled: false,
            },
            transactionDate: {
              disabled: false,
            },
            chkDraftMode: {
              disabled: false,
            },
            chkIsLocked: {
              disabled: false,
            },
            lblSoTotalAdvance: {
              visible: false,
            },
            postedTransactionLabel: {
              visible: false,
            },
            sRAmountLabel: {
              visible: false,
            },
            pendingGoodsDeliveryListMenuItem: {
              disabled: false,
            },
            pendingOrderListMenuItem: {
              disabled: false,
            },
            // grandTotal, dxGrid  - both are included in pnlMaster, Just Added
            grandTotal: {
              disabled: false,
            },
            dxGrid: {
              disabled: false,
            }
          },
        },
        updateOnlyGivenDetailsColumns: true,
      })
    );

    // SetUserRights - check user rights for buttons
    // ------------------- THE SECTION BELOW THIS IS NOT VERIFIED ------------------
    const voucherWithRights = setUserRightsFn(
      { ...formState, formElements: {} } as any,
      userSession,
      hasRight
    );
    if (voucherWithRights?.formElements) {
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: { formElements: voucherWithRights.formElements },
          updateOnlyGivenDetailsColumns: true,
        })
      );
    }
    // ------------------- THE SECTION ABOVE THIS IS NOT VERIFIED ------------------

    // SetPresetPriceCategory - if preset price category is configured
    if ((formState.userConfig?.presetPriceCategoryId ?? 0) > 0) {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: {
            priceCategoryID: formState.userConfig?.presetPriceCategoryId,
          },
        })
      );
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            formElements: {
              cbPriceCategory: { disabled: true },
            },
          },
          updateOnlyGivenDetailsColumns: true,
        })
      );
    }
    if (applicationSettings.mainSettings.maintainBusinessType == "Distribution") {
      setTimeout(() => {
        transactionDateRef?.current?.focus();
      }, 0);
    } else if (formState.userConfig?.initialFocusToCustomer) {
      ledgerIdRef?.current?.focus();
      ledgerIdRef?.current?.select();
    } else {
      const editableColumns = formState.gridColumns?.filter(
        (col) =>
          col.visible != false &&
          col.dataField != null &&
          col.allowEditing == true &&
          col.readOnly !== true
      );

      if (focusFirstRow && editableColumns && editableColumns.length > 0) {
        const res = safeFocusColumn(0, editableColumns[0].dataField ?? "");
        setCurrentCell(
          res,
          formState.transaction.details[0] as TransactionDetail,
          true
        );
      }
    }
  };
  const handleRemoveItem = async (slNo: string) => {
    let allow = true
    if (formState.userConfig?.askConfirmationForRemoveItem) {
      allow = await ERPAlert.show({
        icon: "warning",
        title: t("are_you_sure_to_remove_item"),
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
        showCancelButton: true,
      }) ?? false;
    }
    if (!allow) {
      return;
    }
    if (applicationSettings.productsSettings.giftOnBilling) {
      await removeGiftFromGrid(formState.transaction.details, formState.currentCell);
    }

    dispatch(
      formStateTransactionDetailsRowRemove({
        slNo: slNo,
        applicationSettings: applicationSettings,
        clearEntryControl,
      })
    );
    const details = formState.transaction.details.filter(
      (x) => x.productID > 0 && x.slNo != slNo
    );
    const data = formState.transaction.details.find(
      (x: TransactionDetail) =>
        isNullOrUndefinedOrZero(x.productID) || x.productID <= 0
    );
    const rowIndex = formState.transaction.details.findIndex(
      (x) => x.slNo == data?.slNo
    );
    const editableColumn = formState.gridColumns?.find(
      (col) =>
        col.visible !== false &&
        col.dataField != null &&
        col.allowEditing == true &&
        col.readOnly !== true
    );
    await setStorageString(
      `${formState.transaction.master.voucherType}${formState.transaction.master.voucherForm}`,
      JSON.stringify(details)
    );
    if (formState.giftClaimed) {
      await removeGiftFromGrid(details, {
        reCenterRow: false,
        column: editableColumn?.dataField ?? "",
        data: data ?? initialTransactionDetailData,
        rowIndex: rowIndex ?? 0,
      });
    } else {
      if (
        calculateSummary &&
        calculateTotal &&
        formState &&
        dispatch &&
        formStateHandleFieldChangeKeysOnly
      ) {
        const summaryRes = calculateSummary(details, formState, {
          result: {},
        });

        const totalRes = await calculateTotal(
          formState.transaction.master,
          summaryRes
            ? (summaryRes.summary as SummaryItems)
            : initialInventoryTotals,
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
          totalRes.loading = { isLoading: false, text: "" };
          (totalRes.currentCell = {
            reCenterRow: false,
            column: editableColumn?.dataField ?? "",
            data: data ?? initialTransactionDetailData,
            rowIndex: rowIndex ?? 0,
          }),
            // Dispatch the state update

            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: totalRes,
                updateOnlyGivenDetailsColumns: true,
              })
            );
        }
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

  const handleGridKeyDown = async (
    key: any,
    gridRef: any,
    applicationSettings?: ApplicationSettingsType
  ) => {
    if (key === "e" || key === "E" || key === "Enter") {
      focusLedgerCombo();
    }
    if (key === "a" || key === "A") {
    }
    // if (key === "d" || key === "D") {
    //   ERPAlert.show({
    //     title: t("confirm_delete"),
    //     text: t("you_want_to_delete"),
    //     icon: "warning",
    //     confirmButtonText: t("delete_it"),
    //     onConfirm: async () => {
    //       const dataGridInstance = gridRef.current.instance(); // Access DataGrid instance
    //       const focusedRowIndex = dataGridInstance.option("focusedRowIndex");
    //       const rowData =
    //         dataGridInstance.getVisibleRows()[focusedRowIndex]?.data;
    //       await handleRemoveItem(rowData.slNo);
    //     },
    //   });
    // }
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
        details = [
          ...tmpRows,
          ...Array.from({ length: 30 }, (_, index) => ({
            ...initialTransactionDetailData,
            slNo: generateUniqueKey(),
          })),
        ];
        const batchIds = tmpRows.map((x) => x.productBatchID).join(",");
        const batchUnits = await api.getAsync(
          `${Urls.inv_transaction_base}${transactionType}/BatchUnits`,
          `arrayOfBatchID=${batchIds}`
        );

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

          const totalRes = await calculateTotal(
            formState.transaction.master,
            summaryRes
              ? (summaryRes.summary as SummaryItems)
              : initialInventoryTotals,
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
            totalRes.loading = { isLoading: false, text: "" };

            // Dispatch the state update

            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: totalRes,
                updateOnlyGivenDetailsColumns: true,
              })
            );
            dispatch(formStateSetDetails(details));
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
    if (formState.transaction.master.isLocked &&
      !applicationSettings.branchSettings.createCreditNoteAutomaticallyOnSalesEdit
     ) {
      ERPAlert.show({
        title: t("warning"),
        text: t("voucher_is_locked"),
        icon: "warning",
      });
      return;
    }
    // Edit Authorization
    if (applicationSettings.inventorySettings.setAuthorizationinSales && !applicationSettings.branchSettings.createCreditNoteAutomaticallyOnSalesEdit) {
      let isAuthorized = false;
      const voucherType = formState.transaction.master.voucherType;
      const formType = formState.transaction.master.voucherForm;
      const vrPrefix = formState.transaction.master.voucherPrefix;
      const vrNumber = formState.transaction.master.voucherNumber;
      const action = `User tried to edit the transaction ${voucherType}:${formType}:${vrPrefix}${vrNumber}`;
      isAuthorized = await SalesAuthorization(action); // Edit Authorization changed name to SalesAuthorization
      if (!isAuthorized) {
        return false;
      }
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
              isEditBill: true,
              oldPartyLedId: formState.transaction.master.ledgerID,
              oldLedgerId: formState.transaction.master.ledgerID,
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
              chkDraftMode1: { disabled: true },
              dxGrid: { disabled: true },
              btnConvertToInvoice: { visible: false }
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
      // if(applicationSettings.branchSettings?.createCreditNoteAutomaticallyOnSalesEdit && formState.transaction.master.voucherForm =="VAT" ){
      //   dispatch(
      //       formStateHandleFieldChange({
      //         fields: {
      //           isEdit: false,
      //           blnCreateCreditNoteAutomatically: true
      //         },
      //       })
      //     );
      //   }
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

    if (
      formState.transaction.master.isInvoiced === true &&
      formState.transaction.master.voucherType == "GRN"
    ) {
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
          const deleteResult = (await api.delete(
            `${Urls.inv_transaction_base}${transactionType}`,
            {
              data: {
                invTransactionMasterID:
                  formState.transaction.master.invTransactionMasterID,
                transactionType: transactionType,
              },
            }
          )) as any;

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
              confirmButtonText: t("close"),
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
        true,
        false,
        "PO",
        "",
        formState.transaction.master.voucherPrefix
      );
    }
  }, [formState.transaction.master?.purchaseInvoiceNumber]);

  const handleRefresh = async () => {
    try {
      // const currentLedgerId = formState.row.ledgerID;
      // const currentMasterAccountId = formState.masterAccountID;
      let LedgerIDSelected = formState.transaction.master.ledgerID;
      let partyId = formState.transaction.master.ledgerID;
      let costCenter = applicationSettings.accountsSettings.defaultCostCenterID;
      let constCenterVisible = true;
      let constCenterDisable = false;
      let priceCategory = -2;
      let priceCategoryDisabled = false;
      if (formState.transaction.master.voucherForm == "BT") {
        // cbParty.AccLedgerType = PolosysElements.AccLedgerCombo.LedgerType.Branch_Recv_Payable;
      }
      if (formState.formElements.pnlMasters.disabled === false) {
        partyId = -2;
      }
      let bankAccount = -2;
      let wareHouse = -2;
      let wareHouseDisabled = false;
      // SET WAREHOUSE
      if (formState.userConfig?.presetWarehouseId ?? 0 > 0) {
        wareHouse = formState.userConfig?.presetWarehouseId ?? 0;
        wareHouseDisabled = true;
      } else {
        if (applicationSettings.mainSettings?.maintainBusinessType !== "Distribution") {
          if (applicationSettings.accountsSettings?.allowSalesCounter && (formState.userConfig?.counterWiseWarehouseId ?? 0) > 0) {
            wareHouse = formState.userConfig?.counterWiseWarehouseId ?? 0;
          } else {
            wareHouse = applicationSettings.inventorySettings?.defaultWareHouse;
          }
        }
      }
      // REFRESH COMBO SECTION
      let driver = -2;
      let salesMan = 0;
      let vehicle = -2;
      if (formState?.userConfig?.presetCostenterId ?? 0 > 0) {
        costCenter = formState?.userConfig?.presetCostenterId ?? 0
        constCenterDisable = true;
      }
      if (applicationSettings.accountsSettings?.maintainCostCenter) {
        constCenterVisible = true;
      }
      if (userSession.dbIdValue == "543140180640" || userSession.dbIdValue == "HANAPLASTICS") {
        partyId = applicationSettings.accountsSettings.defaultCustomerLedgerID;
      }
      if (applicationSettings.accountsSettings.setDefaultCustomerInSales) {
        if (!formState.userConfig?.notSetDefaultCustomer) {
          partyId = applicationSettings.accountsSettings?.defaultCustomerLedgerID;
        }
      }
      if (userSession.dbIdValue == "SAMAPLASTICS") {
        if (formState?.userConfig?.presetCostenterId ?? 0 > 0) {
          priceCategory = formState?.userConfig?.presetCostenterId ?? 0;
          priceCategoryDisabled = true;
        }
      }
      let creditAccount = -2;
      creditAccount = applicationSettings.inventorySettings.defaultSalesAcc;
      if (applicationSettings.branchSettings?.defaultSIBTAcc > 0 && formState.transaction.master.voucherForm == "BT") {
        creditAccount = applicationSettings.branchSettings?.defaultSIBTAcc
      }
      if (LedgerIDSelected > 0) {
        partyId = LedgerIDSelected
      }

      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            formElements: {
              ledgerID: { reload: true },
              masterAccount: { reload: true },
              cbCostCentre: { visible: constCenterVisible, disable: constCenterDisable },
              priceCategory: { disable: priceCategoryDisabled },
              cbWarehouseID: { disable: wareHouseDisabled }
            },
            transaction: {
              master: {
                // ledgerID: applicationSettings.accountsSettings.defaultCashAcc,
                ledgerID: partyId,
                costCentreID: costCenter,
                priceCategoryID: priceCategory,
                creditAccount: creditAccount,   // This is currently not in UI, Check after set that value
                bankAccount: bankAccount,  // This also need to check
                fromWarehouseID: wareHouse,
                vehicleID: vehicle,
                driverID: driver,
                employeeID: salesMan,
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
      const getVoucherNumberRes = await getNextVoucherNumber(
        formState.transaction.master.voucherForm,
        formState.transaction.master.voucherType,
        formState.transaction.master.voucherType,
        false
      );

      dispatch(
        formStateTransactionMasterHandleFieldChange({
          fields: {
            voucherNumber: getVoucherNumberRes.voucherNumber,
            voucherPrefix: getVoucherNumberRes.voucherPrefix,
            purchaseInvoiceNumber: "",
            // transactionMasterID: 0,
            transactionDate: moment(clientSession.softwareDate, "DD/MM/YYYY")
              .local()
              .toISOString(),
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

  type LogUserActionParams = {
    action: string;
    actionForm: string;
  };

  const logUserAction = async (input: LogUserActionParams) => {
    const response = await api.postAsync(
      `${Urls.log_user_action}`, input as any
    );
    return response;
  };


  const handleTextDataChange = async (
    value: any,
    columnName: string,
    rowIndex: number,
    isMobRow?: boolean
  ) => {
    try {
      // ==
      const _isMobRow = isMobRow ?? deviceInfo.isMobile;
      console.log("handleTextDataChange");

      if (!_isMobRow && !formState.transaction?.details?.[rowIndex]) {
        return false;
      }

      const detail = _isMobRow ? { ...(formState.row ?? initialTransactionDetailData) } : { ...formState.transaction.details[rowIndex] };
      if (!detail) return;
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
            detail as any,
            actualPriceVisible ?? false,
            outState,
            columnName,
            _isMobRow ? -1 : rowIndex
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
          outState = await calculateRowAmount(
            merge({}, detail, outDetail as any),
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
      } else if (
        columnName === "qty" ||
        columnName === "unitPrice" ||
        columnName === "discPerc" ||
        columnName === "discount" ||
        columnName === "barcodePrinted"
      ) {
        outDetail[columnName] = value;
        // Calculate row amount
        outState = await calculateRowAmount(
          merge({}, detail, outDetail as any),
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
        outState = await calculateRowAmount(
          merge({}, detail, outDetail as any),
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
        outState = await calculateRowAmount(
          merge({}, detail, outDetail as any),
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

      if (_isMobRow) {
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: { row: { ...outState!.transaction!.details![0] } }
          })
        );
        return;
      }
      else if (calculateSummaryAndTotal) {
        const details = [...formState.transaction.details] as any;
        let final = { ...detail, ...outState!.transaction!.details![0] };
        details[rowIndex] = final;
        const summaryRes = calculateSummary(details, formState, { result: {} });

        const totalRes = await calculateTotal(
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


  const handleChangeUnit = async (
    outDetail: DeepPartial<TransactionDetail>,
    detail: TransactionDetail,
    actualPriceVisible: boolean,
    outState: DeepPartial<TransactionFormState>,
    columnName: keyof TransactionDetail,
    rowIndex: number
  ) => {
    const apiParams = {
      productBatchId: detail.productBatchID,
      unitId: outDetail.unitID,
      priceCategoryId: formState.transaction.master.priceCategoryID,
      ledgerId: formState.transaction.master.ledgerID,
      vatPerc: detail.vatPerc,

      // isCustomerLspVisible: formState.gridColumns.find(x => x.dataField == "lsp")?.visible == true,
      // showRateBeforeTax: showRateBeforeTax,
      // userSalesPriceForTransfer: userSalesPriceForTransfer,
      // formType: formType,
    };


    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(apiParams).map(([k, v]) => [k, String(v ?? "")])
      )
    ).toString();
    const url = `${Urls.inv_transaction_base}${transactionType}/change-unit`;
    const customer_LSPVisible = formState.gridColumns?.find(x => x.dataField === "customer_LSP")?.visible
    const body = {
      productBatchID: detail.productBatchID,
      unitID: outDetail.unitID,
      priceCategoryID: formState.transaction.master.priceCategoryID,
      ledgerID: formState.transaction.master.ledgerID,
      vatPerc: detail.vatPerc ?? 0,
      isCustomer_LSP_Visible: customer_LSPVisible,
      showRateBeforeTax: formState.userConfig?.showRateBeforeTax ?? false,
      userSalesPriceForTransfer: formState.userConfig?.UserSalesPriceForTransfer ?? false,
      formType: formState.transaction.master.voucherForm,
    };
    // Not completed - response issue noted
    const res = await api.postAsync(url, body);
    const updatedDetail = {
      ...outDetail,
      unitPrice: res.unitPrice,
      ratePlusTax: res.ratePlusTax,
      purchasePrice: res.purchasePrice,
      minSalePrice: res.minSalePrice,
      boxQty: res.boxQty,
      customerLastSalesPrice: res.customerLastSalesPrice,
      nlaSalesPrice: res.nlaSalesPrice
    };
    outState = await calculateRowAmount(
      Object.assign(detail, { ...outDetail, ...res }),
      columnName as any,
      {
        result: {
          transaction: {
            details: [updatedDetail],
          },
        },
      },
      true
    );
    if (rowIndex > -1) {
      const details = [...formState.transaction.details];
      let final = { ...detail, ...outState!.transaction!.details![0] };
      details[rowIndex] = final;
      const summaryRes = calculateSummary(details, formState, { result: {} });

      const totalRes = await calculateTotal(
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
    return outState;
  };

  const handlePrintBarcode = async () => {
    try {
      const rowIndexes = [];
      const hasReprint =
        formState.transaction.details.filter((x) => x.barcodePrinted == true)
          .length > 0;
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
          const slNos = formState.transaction.details
            .filter(
              (x) =>
                x.productID > 0 &&
                x.barcodePrinted != true &&
                x.stickerQty + x.qty > 0
            )
            .map((x) => x.slNo);
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
        const slNos = formState.transaction.details
          .filter(
            (x) =>
              x.productID > 0 &&
              x.barcodePrinted != true &&
              x.stickerQty + x.qty > 0
          )
          .map((x) => x.slNo);
        printBarcode(
          slNos,
          false,
          true,
          formState.transaction.master.ledgerID,
          formState.transaction.master.fromWarehouseID,
          false
        );
      }
    } catch (error) { }
  };
  const handleTextDataKeyDown = async (
    value: any,
    event: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent,
    columnName: string,
    rowIndex: number,
    commonParams: CommonParams,
    isMobRow?: boolean
  ): Promise<{
    handled: boolean;
    preventDefault?: boolean;
    shouldReturn?: boolean;
    focusAction?: string;
    showDialog?: boolean;
  }> => {
    let { result } = commonParams;
    try {
      const _isMobRow = isMobRow ?? deviceInfo.isMobile;
      const key = event.key;
      console.log('🔑 handleTextDataKeyDown called:', { key, value, columnName, rowIndex });
      const isShiftPressed = event.shiftKey;
      const isCtrlPressed = event.ctrlKey;
      // Newly Adding in sales
      let data = _isMobRow ? { ...(formState.row ?? initialTransactionDetailData) } : { ...formState.transaction.details[rowIndex] };
      if ((event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter") && columnName === "unitPrice") {
        if (event.key === "Enter") {
          if (formState.userConfig?.blockZeroFigureEntry) {
            if (Number(data.qty) === 0) {
              event.preventDefault();
              event.stopPropagation();
              await ERPAlert.show({
                icon: "info",
                title: t("warning"),
                text: t("zero_rate_or_quantity_entered_please_check!"),
                confirmButtonText: t("ok"),
                showCancelButton: true,
              });
            }
          }
          if (formState.userConfig?.showRateBeforeTax) {
            const formattedValue = round(Number(value) || 0, 4);
            data.unitPrice = formattedValue;
          }
        }
        if ((applicationSettings.inventorySettings?.showRateWarning.toUpperCase() == "WARN" && data.minSalePrice > 0) &&
          ((formState.transaction.master?.voucherForm !== "BT" || applicationSettings.inventorySettings?.useCostForStockTransferToBranch === false) ||
            (formState.transaction.master?.voucherForm == "BT" && formState.userConfig?.UserSalesPriceForTransfer))) {
          if (data.unitPrice < data.minSalePrice) {
            event.preventDefault();
            event.stopPropagation();
            const confirm = await ERPAlert.show({
              icon: "info",
              title: t("warning"),
              text: t("sales_price_less_than_the_minimum_sales_price, Do_you_want_to_continue?"),
              confirmButtonText: t("yes"),
              cancelButtonText: t("no"),
              showCancelButton: true,
              onConfirm: () => { return true; },
              onCancel: () => { return false; },
            });
            if (confirm) {
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            } else {
              const res = safeFocusCurrentColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            }
            return { ...result, handled: true, preventDefault: true };
          }
        }
        if (applicationSettings.inventorySettings?.showRateWarning.toUpperCase() == "WARN" && data.purchasePrice > 0 && data.minSalePrice === 0 &&
          ((formState.transaction.master?.voucherForm !== "BT" || applicationSettings.inventorySettings?.useCostForStockTransferToBranch === false) ||
            (formState.transaction.master?.voucherForm == "BT" && formState.userConfig?.UserSalesPriceForTransfer))) {
          if (data.unitPrice < data.purchasePrice) {
            event.preventDefault();
            event.stopPropagation();
            const confirm = await ERPAlert.show({
              icon: "info",
              title: t("warning"),
              text: t("sales_price_less_than_purchase_price.do_you_want_to_continue?"),
              confirmButtonText: t("yes"),
              cancelButtonText: t("no"),
              showCancelButton: true,
              onConfirm: () => { return true; },
              onCancel: () => { return false; },
            });
            if (confirm) {
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            } else {
              const res = safeFocusCurrentColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            }
            return { ...result, handled: true, preventDefault: true };
          }
        }
        if (applicationSettings.inventorySettings?.showRateWarning.toUpperCase() == "BLOCK" && data.minSalePrice > 0 && formState.transaction.master?.voucherForm !== "BT") {
          if (data.unitPrice < data.minSalePrice) {
            event.preventDefault();
            event.stopPropagation();
            const confirm = await ERPAlert.show({
              icon: "info",
              title: t("warning"),
              text: t(`sales_price_less_than_min_sales_price,${data.product}`),
              confirmButtonText: t("yes"),
              cancelButtonText: t("no"),
              showCancelButton: true,
              onConfirm: () => { return true; },
              onCancel: () => { return false; },
            });
            if (confirm) {
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            } else {
              const res = safeFocusCurrentColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            }
            return { ...result, handled: true, preventDefault: true };
          }
        }
        if (applicationSettings.inventorySettings?.showRateWarning.toUpperCase() == "BLOCK" && data.purchasePrice > 0 && data.minSalePrice === 0 && formState.transaction.master?.voucherForm !== "BT") {
          if ((data.unitPrice < data.purchasePrice) && data.isSchemeItem !== "S") {
            event.preventDefault();
            event.stopPropagation();
            const confirm = await ERPAlert.show({
              icon: "info",
              title: t("warning"),
              text: t(`sales_price_less_than_purchase_price,${data.product}`),
              confirmButtonText: t("yes"),
              cancelButtonText: t("no"),
              showCancelButton: true,
              onConfirm: () => { return true; },
              onCancel: () => { return false; },
            });
            if (confirm) {
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            } else {
              const res = safeFocusCurrentColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            }
            return { ...result, handled: true, preventDefault: true };
          }
        } else {
          // Need to check is this will effecting other cases
          const res = safeFocusToNextColumn(rowIndex, columnName);
          setCurrentCell(res, data, false);
        }
      }
      // Above Newly Adding in sales
      // if (columnName === "global") {
      if (event.ctrlKey && event.key.toUpperCase() === "F") {
        event.preventDefault();
        if (voucherNumberRef.current) {
          voucherNumberRef.current.focus();
        }
      }
      // Focus Voucher Number ☝
      if (event.shiftKey && event.key.toUpperCase() === "D") {
        event.preventDefault();
        dispatch(
          formStateHandleFieldChange({
            fields: { documentModal: true },
          })
        );
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
              const data = formState.transaction.details[res.rowIndex];
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
      if (event.key.toUpperCase() === "F5") {
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
      if (event.altKey && event.key.toUpperCase() === "R") {
        // Delete the focused row
        event.preventDefault();
        const currentFormState = formStateRef.current;
        const currentRowIndex = currentFormState.currentCell?.rowIndex ?? -1;
        if (currentRowIndex >= 0 && currentFormState.transaction.details[currentRowIndex]) {
          const slNo = currentFormState.transaction.details[currentRowIndex].slNo;
          if (slNo) {
            handleRemoveItem(slNo);
          }
        }
      }
      if (event.ctrlKey && event.key === "Delete") {
        // Delete the focused row
        event.preventDefault();
        const currentFormState = formStateRef.current;
        const currentRowIndex = currentFormState.currentCell?.rowIndex ?? -1;
        if (currentRowIndex >= 0 && currentFormState.transaction.details[currentRowIndex]) {
          const slNo = currentFormState.transaction.details[currentRowIndex].slNo;
          if (slNo) {
            handleRemoveItem(slNo);
          }
        }
      }
      // Alt + A => party focus
      if (event.altKey && event.key.toUpperCase() === "A") {
        event.preventDefault();
        setTimeout(() => {
          ledgerIdRef?.current?.focus();
          ledgerIdRef?.current?.select();
        }, 100);
      }
      // Alt + M => salesman focus
      if (event.altKey && event.key.toUpperCase() === "M") {
        event.preventDefault();
        setIsDropDownOpen?.({ open: true, autoAddressFocus: false });
        setTimeout(() => {
          employeeRef?.current?.focus();
          employeeRef?.current?.select();
        }, 100);
      }

      // Shift + F1 => toggle product info for focused row
      if (event.shiftKey && event.key.toUpperCase() === "F1") {
        if (!formState.productInfo == true) {
          if (formState.userConfig?.showProductInfoPopup) {
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  productInfo: true,
                },
              })
            );
          }
        } else {
          if (formState.userConfig?.showProductInfoPopup) {
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  productInfo: false,
                },
              })
            );
          }
        }
      }

      // page down => open close product info down popup
      if (event.key === "PageDown") {
        event.preventDefault();
        if (!formState.userConfig?.showProductInfoPopup) {
          if (formState.productInfo == true) {
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  productInfo: false,
                },
              })
            );
          } else {
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  productInfo: true,
                },
              })
            );
          }
        }
      }

      // ctrl + F11 => if draft mode checked then do something
      if (event.ctrlKey && event.key.toUpperCase() === "F11") {
        const currentFormState = formStateRef.current;
        if (currentFormState?.draftMode) {
          dispatch(
            formStateHandleFieldChange({
              fields: { draftModeModal: true },
            })
          );
        }
      }
      if (event.ctrlKey && event.key.toUpperCase() === "D") {
        event.preventDefault();
        ERPAlert.show({
          title: t("confirm_delete"),
          text: t("you_want_to_delete"),
          icon: "warning",
          confirmButtonText: t("delete_it"),
          onConfirm: async () => {
            event.preventDefault();
            const currentFormState = formStateRef.current;
            const currentRowIndex = currentFormState.currentCell?.rowIndex ?? -1;
            if (currentRowIndex >= 0 && currentFormState.transaction.details[currentRowIndex]) {
              const slNo = currentFormState.transaction.details[currentRowIndex].slNo;
              if (slNo) {
                handleRemoveItem(slNo);
              }
            }
          },
        });
      }
      if (event.key.toUpperCase() === "ESCAPE") {
        const currentFormState = formStateRef.current;
        if (currentFormState.isUserConfigOpen === true) {
          dispatch(formStateHandleFieldChange(
            { fields: { isUserConfigOpen: false } }
          ))
        }
      }
      //  }
      // return { handled: true };

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
        case "F":
        case "f":
          if (columnName === "qty") {
            if (formState.gridColumns?.find((x) => x.dataField == "free")?.visible) {
              let data = _isMobRow ? { ...(formState.row ?? initialTransactionDetailData) } : { ...formState.transaction.details[rowIndex] };
              const outRow = {
                free: 1,
                qty: 0
              }

              let sd = await calculateRowAmount(
                data,
                columnName,
                {
                  result: {
                    transaction: {
                      details: [outRow],
                    },
                  },
                  formStateHandleFieldChangeKeysOnly:
                    formStateHandleFieldChangeKeysOnly,
                }, false, rowIndex
              );

              break;
            }
          }
        case "q":
        case "Q":
          if (columnName === "qty") {
            const data: TransactionDetail =
              _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  showQuantityFactors: {
                    visible: true,
                    rowIndex: rowIndex,
                    qtyDesc: data.productDescription,
                  },
                },
              })
            );
          }
          if (columnName === "barCode") {
            const details = formState.transaction.details;
            const res = safeFocusColumn(rowIndex, "qty");
            setCurrentCell(res, details[rowIndex] as TransactionDetail, true);
          }
          break;

        case "m":
        case "M":
          if (columnName === "qty") {
            const data: TransactionDetail =
              _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  showQuantityFactorsM: {
                    visible: true,
                    rowIndex: rowIndex,
                    qtyDesc: data.productDescription,
                  },
                },
              })
            );
          }
          break;

        case "u":
        case "U":
          if (columnName === "barCode") {
            const details = formState.transaction.details;
            const res = safeFocusColumn(rowIndex, "unitPrice");
            setCurrentCell(res, details[rowIndex] as TransactionDetail, true);
          }
          break;

        case "r":
        case "R":
          const details = formState.transaction.details;
          if (columnName === "barCode") {
            if (formState.gridColumns?.find((x) => x.dataField === "ratePlusTax")?.readOnly === false) {
              const res = safeFocusColumn(rowIndex, "ratePlusTax");
              setCurrentCell(res, details[rowIndex] as TransactionDetail, true);
            } else {
              if (formState.gridColumns?.find((x) => x.dataField === "unitPrice")?.readOnly === false) {
                const res = safeFocusColumn(rowIndex, "unitPrice");
                setCurrentCell(res, details[rowIndex] as TransactionDetail, true);
              }
            }
          }
          break;
        // Increase qty
        case "+":
          if (columnName === "barCode") {
            event.preventDefault();
            const data: TransactionDetail = _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            if (formState.userConfig?.autoIncrementQty) {
              if (rowIndex > 0) {
                let prevQuantity = data.qty;
                let newQuantity = prevQuantity + 1;
                const outRow = {
                  qty: newQuantity
                }
                let sd = await calculateRowAmount(
                  data,
                  columnName,
                  {
                    result: {
                      transaction: {
                        details: [outRow],
                      },
                    },
                    formStateHandleFieldChangeKeysOnly:
                      formStateHandleFieldChangeKeysOnly,
                  }, false, rowIndex
                );
                break;
              }
            }
          }
        // Decrease qty
        case "-":
          if (columnName === "barCode") {
            event.preventDefault();
            const data: TransactionDetail = _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            if (formState.userConfig?.autoIncrementQty) {
              if (rowIndex > 0) {
                let prevQuantity = data.qty;
                if (prevQuantity <= 1) break;
                let newQuantity = prevQuantity - 1;
                const outRow = {
                  qty: newQuantity
                }
                let sd = await calculateRowAmount(
                  data,
                  columnName,
                  {
                    result: {
                      transaction: {
                        details: [outRow],
                      },
                    },
                    formStateHandleFieldChangeKeysOnly:
                      formStateHandleFieldChangeKeysOnly,
                  }, false, rowIndex
                );
                break;
              }
            }
          }
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
            if (hasRight("PSUMRPT", UserAction.Show)) {
              dispatch(
                formStateHandleFieldChange({
                  fields: {
                    showProductInformation: { show: true, index: rowIndex },
                  },
                })
              );
            }
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
                  ledgerDetails: true,
                },
              })
            );
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
          let detail = _isMobRow ? { ...(formState.row ?? initialTransactionDetailData) } : { ...formState.transaction.details[rowIndex] };
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
              _isMobRow ? -1 : rowIndex
            );
          }
          else if (columnName === "unitPrice") {
            if (userSession.dbIdValue !== "543140180640") {
              // Change the price category
              const priceCategoryList = await getApLocalData("PriceCategories");
              if (!priceCategoryList || priceCategoryList.length === 0) {
                return {
                  handled: false,
                };
              }
              const priceCategoryCount = priceCategoryList?.length ?? 0;
              const currentId = formState.transaction.master.priceCategoryID;
              let currentIndex = priceCategoryList?.findIndex((x: any) => x.id === currentId) ?? 0;
              if (currentIndex == priceCategoryCount - 1) {
                currentIndex = 0;
              } else {
                currentIndex = currentIndex + 1;
              }

              const nextPriceCategoryId = priceCategoryList[currentIndex].id ?? 0;
              dispatch(
                formStateMasterHandleFieldChange({
                  fields: {
                    priceCategoryID: nextPriceCategoryId,
                  },
                })
              );

              const params = new URLSearchParams({
                ProductBatchID: String(detail.productBatchID ?? "0"),
                PriceCategoryID: String(nextPriceCategoryId ?? "0"),
                UnitID: String(detail.unitID ?? "0"),
              });

              const pData = await api.getAsync(
                `${Urls.inv_transaction_base}${transactionType}/PriceCategoryDetails?${params.toString()}`
              );

              const updatedDetail = {
                ...outDetail,
                unitPrice: pData.unitPrice,
                purchasePrice: pData.purchasePrice,
              };
              outState = await calculateRowAmount(
                Object.assign(detail, { ...outDetail, ...updatedDetail}),
                columnName as any,
                {
                  result: {
                    transaction: {
                      details: [updatedDetail],
                    },
                  },formStateHandleFieldChangeKeysOnly
                }, false, rowIndex, 
              );
            }
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
          if (columnName !== "serial" && columnName !== "imf" && columnName !== "actionCol") {  // Add another btn columns
            event.preventDefault?.();
            event.stopPropagation?.();
          }
          let data = _isMobRow ? { ...(formState.row ?? initialTransactionDetailData) } : { ...formState.transaction.details[rowIndex] };
          if (columnName == "actionCol") {
            if (!isNullOrUndefinedOrEmpty(value)) {
              await handleRemoveItem(value);
            } else {
              // const res = safeFocusToNextColumn(rowIndex, columnName);
              // setCurrentCell(res, data);
            }
            break;
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
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            }
          } else if (columnName == "product") {
            data.product = value;
            if (!isNullOrUndefinedOrEmpty(value)) {
              await loadProductDetailsByAutoBarcode(
                {
                  productCode: data.pCode,
                  autoBarcode: data.barCode,
                  productBatchID: 0,
                  searchText: data.product,
                  detail: data,
                  useProductCode: false,
                  rowIndex: rowIndex,
                  searchColumn: "product",
                  setFocusToNextColumn: true,
                },
                { result: {}, formStateHandleFieldChangeKeysOnly },
                true
              );
            } else {
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, false);
            }
          } else if (columnName == "barCode") {
            console.log('🔍 Enter pressed on barCode column:', { value, rowIndex, columnName });
            data.barCode = value;
            if (!isNullOrUndefinedOrEmpty(value)) {
              console.log('🔍 Loading product by barcode:', data.barCode);
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
              console.log('🔍 loadProductDetailsByAutoBarcode completed');
            } else {
              console.log('⚠️ Barcode value is empty, focusing next column');
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, rowIndex != res?.rowIndex);
            }
          } else if (columnName == "unitDiscount") {
            // Need to check the working
            const res = safeFocusToNextColumn(rowIndex, columnName);
            setCurrentCell(res, data, false);
          } else if (columnName == "qty") {
            const ShowNegativeStockWarning = applicationSettings.inventorySettings.showRateWarning;
            if (ShowNegativeStockWarning === "Block" && data.itemType === "Inventory") {
              event.preventDefault();
              event.stopPropagation();
              let Qty = Number(data.qty)
              const prevQty = (data.qtyTag ?? 0);
              Qty = Qty - prevQty;
              const unitQty = await api.getAsync(`${Urls.products}SelectProductUnits/${data.productBatchID}`);
              const selectedUnit = unitQty?.find((u: any) => u.unitID === data.unitID);
              Qty = Qty * selectedUnit.multiFactor;
              if (Qty > data.stock) {
                event.preventDefault();
                event.stopPropagation();
                await ERPAlert.show({
                  icon: "info",
                  title: t("warning"),
                  text: `${t("available_stock")} ${data.stock} | ` + `${t("shortage")} : ${Qty - data.stock}`,
                  confirmButtonText: t("yes"),
                  cancelButtonText: t("no"),
                  showCancelButton: false,
                });
              }

            } else if (ShowNegativeStockWarning === "Warn" && data.itemType === "Inventory") {
              event.preventDefault();
              event.stopPropagation();
              let Qty = Number(data.qty)
              const prevQty = (data.qtyTag ?? 0);
              Qty = Qty - prevQty;
              const unitQty = await api.getAsync(`${Urls.products}SelectProductUnits/${data.productBatchID}`);
              const selectedUnit = unitQty?.find((u: any) => u.unitID === data.unitID);
              Qty = Qty * selectedUnit.multiFactor;
              if (Qty > data.stock) {
                await ERPAlert.show({
                  icon: "info",
                  title: t("warning"),
                  text: `${t("available_stock")} ${data.stock} | ` + `${t("shortage")} : ${Qty - data.stock}`,
                  confirmButtonText: t("yes"),
                  cancelButtonText: t("no"),
                  showCancelButton: false,
                });

              }
            }
            if (formState.userConfig?.blockZeroFigureEntry) {
              if (Number(data.qty) === 0) {
                ERPAlert.show({
                  icon: "info",
                  title: t("warning"),
                  text: t("zero_rate_or_quantity_entered_please_check!"),
                  confirmButtonText: t("ok"),
                  showCancelButton: true,
                });
              }
            }
            if (applicationSettings.productsSettings.giftOnBilling) {
              await removeGiftFromGrid();
            }
            const res = safeFocusToNextColumn(rowIndex, columnName);
            setCurrentCell(res, data, rowIndex != res?.rowIndex);

          } else if (columnName == "unitPrice") {



            // if (!formState.productInfo == true) {
            //   if (formState.userConfig?.showProductInfoPopup) {
            //     dispatch(
            //       commonParams.formStateHandleFieldChangeKeysOnly({
            //         fields: {
            //           productInfo: true,
            //         },
            //       })
            //     );
            //   }
            // }
            // const res = safeFocusToNextColumn(rowIndex, columnName);
            // setCurrentCell(res, data, rowIndex != res?.rowIndex);
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
              event.stopPropagation();
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
                const res = safeFocusToNextColumn(rowIndex, columnName);
                setCurrentCell(res, data, rowIndex != res?.rowIndex);
                break;
              } else {
                const res = safeFocusCurrentColumn(rowIndex, columnName);
                setCurrentCell(res, data, false);
              }
            }
          } else if (columnName == "margin" || columnName == "salesPrice" || columnName == "ratePlusTax") {
            // check the below written code and compare with 1050 - check its working
            const res = safeFocusToNextColumn(rowIndex, columnName);
            setCurrentCell(res, data, rowIndex != res?.rowIndex);


            // data.margin = columnName == "margin" ? value : data.margin;
            // data.salesPrice =
            //   columnName == "salesPrice" ? value : data.salesPrice;

            // await calculateRowAmount(
            //   data,
            //   columnName,
            //   {
            //     result: {
            //       transaction: {
            //         details: [data],
            //       },
            //     },
            //     formStateHandleFieldChangeKeysOnly:
            //       formStateHandleFieldChangeKeysOnly,
            //   },
            //   false
            // );

            // if (
            //   applicationSettings.inventorySettings?.showRateWarning.toUpperCase() ==
            //   "WARN" &&
            //   data.salesPrice > 0
            // ) {
            //   if (data.unitPrice > data.salesPrice) {
            //     // event.preventDefault();
            //     event.preventDefault();
            //     event.stopPropagation();
            //     const confirm = await ERPAlert.show({
            //       icon: "info",
            //       title: t("warning"),
            //       text: t(
            //         "sales_price_less_than_purchase_price_do_you_want_to_continue"
            //       ),
            //       confirmButtonText: t("yes"),
            //       cancelButtonText: t("no"),
            //       showCancelButton: true,
            //       onCancel: () => {
            //         return false;
            //       },
            //     });
            //     if (confirm) {
            //       const res = safeFocusToNextColumn(rowIndex, columnName);
            //       setCurrentCell(res, data, rowIndex != res?.rowIndex);
            //       break;
            //     } else {
            //       const res = safeFocusCurrentColumn(rowIndex, columnName);
            //       setCurrentCell(res, data, false);
            //     }
            //   }
            // } else if (
            //   applicationSettings.inventorySettings?.showRateWarning.toUpperCase() ==
            //   "BLOCK" &&
            //   data.salesPrice > 0
            // ) {
            //   if (data.unitPrice > data.salesPrice) {
            //     const res = safeFocusCurrentColumn(rowIndex, columnName);
            //     setCurrentCell(res, data, false);
            //   }
            // }
          } else if (columnName == "smCode") {
            if (data.smCode !== "") {
              const employeeList = await getApLocalData("Employees");
              if (!employeeList || employeeList.length === 0) {
                return { handled: false };
              }
              // Get the employee code written in sm code filed
              const empCode = data.smCode.toString();
              // find employee whose name starts with the code
              const employee = employeeList.find((emp: any) =>
                emp.name?.startsWith(empCode + " ")
              );
              if (!employee) {
                return { handled: false };
              }
              // Get the employee name only
              const employeeName = employee.name.replace(empCode, "").trim();
              const updatedDetails = [...formState.transaction.details];
              updatedDetails[rowIndex] = {
                ...updatedDetails[rowIndex],
                salesman: employeeName,
                salesmanID: employee.id
              };
              dispatch(formStateHandleFieldChangeKeysOnly({
                fields: {
                  transaction: {
                    details: updatedDetails
                  }
                }
              }))
              break;
            } else {
              const res = safeFocusToNextColumn(rowIndex, columnName);
              setCurrentCell(res, data, rowIndex != res?.rowIndex);
            }

          } else if (columnName == "btnPrintBarcode") {
            const pbData: TransactionDetail =
              _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            if (
              pbData.qty +
              pbData.stickerQty <=
              0
            ) {
              break;
            }
            const isReprint = pbData.barcodePrinted;
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
                  [pbData.slNo],
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
                [pbData.slNo],
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
              _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];

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
          } else if (columnName == "memoEditor") {
            console.log('Opening memo editor for row:', rowIndex);
            
            const data: TransactionDetail =
              _isMobRow
                ? (formState.row ?? initialTransactionDetailData)
                : formState.transaction.details[rowIndex];
            const memoDetails = {
              memo: data.moreDetail?.memo || "",
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
          } else if (columnName == "grossConvert") {
            debugger;
            changeGrossToUnitRate(rowIndex, columnName);
          } else if (columnName == "serial") {
            const rowData: TransactionDetail =
              _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  serialNoEntryData: {
                    visible: true,
                    data: rowData.productDescription,
                    rowIndex: rowIndex,
                    productName: rowData.product,
                  },
                },
                updateOnlyGivenDetailsColumns: true,
              })
            );
          }
          else if (columnName == "imf") {
            const rowData: TransactionDetail = _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            // const rowIndex = details.findIndex((x) => x.slNo == row.slNo);

            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  imfData: {
                    visible: true,
                    data: rowData.productDescription,
                    slNo: rowIndex,
                    productId: rowData.productID,
                  },
                },
                updateOnlyGivenDetailsColumns: true,
              })
            );

          }
          else if (columnName == "fLV") {
            const rowData: TransactionDetail = _isMobRow ? (formState.row ?? initialTransactionDetailData) : formState.transaction.details[rowIndex];
            dispatch(
              commonParams.formStateHandleFieldChangeKeysOnly({
                fields: {
                  flavourData: {
                    visible: true,
                    data: rowData.productDescription,
                    slNo: rowIndex,
                    productName: rowData.product,
                    productId: rowData.productID,
                    rowIndex: rowIndex // This also use here for slNo instaed
                  },
                },
                updateOnlyGivenDetailsColumns: true,
              })
            );
          }
          else {
            if (columnName === "qty") {
              await removeGiftFromGrid();

            }
            const res = safeFocusToNextColumn(rowIndex, columnName);
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
      workbook.creator = "Sales Import System";
      workbook.created = new Date();

      // Add Sales worksheet
      const worksheet = workbook.addWorksheet("Sales", {
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
      link.download = `Sales_Import_Template_${new Date().toISOString().split("T")[0]
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
      debugger;

      // Read Excel file using ExcelJS
      const workbook = new ExcelJS.Workbook();
      const fileBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(fileBuffer);

      // Get 'Sales' worksheet
      const salesWorksheet = workbook.getWorksheet("Purchase");
      if (!salesWorksheet) {
        throw new Error("Sales worksheet not found in the Excel file");
      }

      // Get the range of used cells
      const rowCount = salesWorksheet.rowCount;

      if (rowCount <= 1) {
        throw new Error("No data rows found in the Excel file");
      }

      // Extract data from Excel (starting from row 2, skipping header)
      const excelData: ExcelRowData[] = [];

      for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
        const row = salesWorksheet.getRow(rowNumber);

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
            const calculatedRow = await calculateRowAmount(
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

        const totalRes = await calculateTotal(
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

  // Preset Price Cateogory
  const setPreSetPriceCategory = () => {
    if(userSession.dbIdValue === "SAMAPLASTICS"){
      if ((formState.userConfig?.presetPriceCategoryId ?? 0) > 0) {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: {
            priceCategoryID: formState.userConfig?.presetPriceCategoryId,
          },
        })
      );
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            formElements: {
              cbPriceCategory: { disabled: true },
            },
          },
          updateOnlyGivenDetailsColumns: true,
        })
      );
    }
    }
  }

  // Changeing ledger Validation
  const ledgerSelectionAlertChecking = async (ledgerData: any) => {
      // -------  This the nelow three lines are needed! --------
      let IsCSI = false;
      if(formState.transaction.master.voucherForm === "CSI"){
        IsCSI = true;
      }
      // -----------------------------------------------------------
      if(ledgerData.stopCredit && IsCSI=== false ){
        ERPAlert.show({
          icon: "warning",
          title: t(""),
          text: t("credit_stopped_for_customer"),
          confirmButtonText: t("ok"),
          showCancelButton: false
        });
        dispatch(
          formStateHandleFieldChange({
            fields: {
              creditAccount : true
            },
          })
        );
        
      }else{
        dispatch(
          formStateHandleFieldChange({
            fields: {
              creditAccount : false
            },
          })
        );
      }

      if(applicationSettings.accountsSettings?.blockOnCreditLimit !=="Ignore"){
        const creditRes = checkThePartyCreditLimit(
          formState.transaction.master.ledgerID,
          formState.transaction.master.grandTotal,
          formState.oldLedgerId || 0,
          formState.previousGrandTotal || 0,
          ledgerData.creditAmount || 0,
          ledgerData.creditDays || 0,
          ledgerData.ledgerBalance || 0,
          ledgerData.dueBalance || 0

        );
        if(creditRes.exceeded){
          await ERPAlert.show({
          icon: "warning",
          title: t("warning"),
          text: creditRes.message,
          confirmButtonText: t("ok"),
          showCancelButton: false
        });
        }
      }
  }

  const loadLedgerData = async (
    _formState?: DeepPartial<TransactionFormState>,
    _dispatch?: any
  ) => {
    //     if (_formState?.transaction?.master?.voucherType == "LPO") {
    // return;
    //     }
    let ledgerData: any;
    const ledgerID = (_formState ?? formState)?.transaction?.master?.ledgerID;
    const voucherType = (_formState ?? formState)?.transaction?.master
      ?.voucherType;
    _formState = _formState ?? {};
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
        let ledgerBalance: any;

        if (_formState?.transaction?.master?.voucherType === "LPO") {
          // ✅ Manually assign values when voucher type is LPO
          ledgerBalance = 0; // or any default value you want
          ledgerData = {
            ledgerName: "",
            ledgerId: ledgerID,
            // ...other manual fields
          };
        } else {
          // ✅ Fetch from API for other voucher types
          [ledgerBalance, ledgerData] = await Promise.all([
            (ledgerID ?? 0) > 0
              ? api.getAsync(
                `${Urls.inv_transaction_base}${transactionType}/LedgerBalance/${ledgerID}`
              )
              : 0,
            api.getAsync(
              `${Urls.inv_transaction_base}${transactionType}/LedgerDetails?LedgerId=${ledgerID}`
            ),
          ]);
        }

        let ret = {
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
              address4: _formState.isInitialLedger
                ? _formState.transaction?.master?.address4
                : ledgerData?.mobileNumber ?? "",
              address3: ledgerData?.address3 ?? "",
              address2: ledgerData?.address2 ?? "",
            },
          },
        };
        if (applicationSettings.branchSettings.maintainTaxes) {
          const vatNo = ledgerData?.taxNumber?.trim() ?? "";

          if (vatNo.length > 0) {
            if (applicationSettings.branchSettings.countryName === 1) {
              const isValidVat =
                vatNo.length === 15 &&
                vatNo.startsWith("3") &&
                vatNo.endsWith("3");

              if (!isValidVat) {
                await ERPAlert.show({
                  icon: "error",
                  title: "invalid_vat_number",
                  text: "invalid_vat_registration_number_please_correct_and_try_again",
                });
                return;
              }
            }
          }
        }

        if (formState.formElements?.priceCategory.visible) {

          const priceCategoryId = Number(ledgerData?.PriceCategoryID || 0);
          const partyCategoryId = Number(ledgerData?.PartyCategoryID || 0);

          if (priceCategoryId > 0) {
            ret = {
              ...ret,
              transaction: {
                ...ret.transaction,
                master: {
                  ...ret.transaction?.master,
                  priceCategoryID: priceCategoryId,
                },
              },
            };
          }

          // DB-specific rule
          if (userSession.dbIdValue === "543140180640") {
            const datas = await getApLocalData("PriceCategories");
            const data = datas?.find((dc: any) => dc.id === priceCategoryId);
            if (data && data.name === "Delivery Customer") {
              await ERPAlert.show({
                icon: "info",
                title: "delivery_customer",
                text: "",
              });
            }
          }
          // set PresetPrice Category
          setPreSetPriceCategory()
          // set party color to the party color box
          if (ledgerData?.partyColor) {
            const hexColor = String(ledgerData.partyColor).trim().split(" ")[0];
            dispatch(
              formStateHandleFieldChange({
                fields: {
                  partyColor: hexColor,
                },
              })
            );
          }else{
            dispatch(
              formStateHandleFieldChange({
                fields: {
                  partyColor: "#E5E7EB",
                },
              })
            );
          }
        }

        if (!clientSession.isAppGlobal) {
          let customerType = "";
          if (["SI","SR"].includes(voucherType ?? "")) {
            if (applicationSettings.branchSettings.maintainKSA_EInvoice) {
              if (
                ledgerData?.taxNumber != null &&
                ledgerData?.taxNumber.length > 0
              ) {
                customerType = "B2B";
              } else {
                customerType = "B2C";
              }
            } else {
              customerType = "";
            }
          } else {
            customerType = "";
          }
          ret = {
            ...ret,
            transaction: {
              ...ret.transaction,
              master: {
                ...ret.transaction?.master,
                customerType: customerType,
              },
            },
          };
        }
        
        // Dunction for checking alert box conditions in ledger Selection
        ledgerSelectionAlertChecking(ledgerData)
        _dispatch &&
          _dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: ret,
            })
          );
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
            },
          },
        };

        // Dunction for checking alert box conditions in ledger Selection
        ledgerSelectionAlertChecking(ledgerData)
        _dispatch &&
          _dispatch(
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
    return {};
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
  async function postBillWiseDetails(data: BillWiseRequest): Promise<any> {
    try {
      dispatch(
        formStateHandleFieldChange({
          fields: { ledgerBillWiseSaving: true },
        })
      );
      const response = await api.postAsync(
        `${Urls.inv_transaction_base}${transactionType}/BillWiseDetail`,
        data
      );
      dispatch(
        formStateHandleFieldChange({
          fields: {
            showbillwise: false, ledgerBillWiseSaving: false
          },
        })
      );
      return response.data;
    } catch (error: any) {
      console.error("Error posting BillWiseDetails:", error);
      throw error;
    }
  }
  interface LoadInvTransactionMasterParams {
    voucherNumber: string;
    voucherPrefix: string;
    voucherType: string;
    voucherForm: string;
  }

  const handleLoadSr = async ({ voucherNumber, voucherPrefix, voucherForm }: LoadSrParams) => {
    const voucherNum = Number(voucherNumber || 0);
    if (voucherNum > 0) {
      const api = new APIClient();

      const params = {
        VoucherNumber: voucherNumber,
        VoucherPrefix: voucherPrefix,
        VoucherType: "SR",
        VoucherForm: voucherForm,
      };
      const query = new URLSearchParams(params as any).toString();
      let srAmount = 0;
      const response = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/LoadSRAmount?${query}`);
      if (response > 0) {
        srAmount = response;
        dispatch(formStateMasterHandleFieldChange({
          fields: {
            srAmount: srAmount,
          },
        }));
        return true;
      } else {
        dispatch(formStateMasterHandleFieldChange({
          fields: {
            srAmount: srAmount,
          },
        }));
        ERPAlert.show({
          icon: "warning",
          title: t("sales_return"),
          text: t("voucher_not_fount_or_this_voucher_is_already_cleared"),
          confirmButtonText: t("ok"),
          showCancelButton: false
        });
      }
    } else {
      dispatch(formStateMasterHandleFieldChange({
        fields: {
          srAmount: 0,
        },
      }));
      ERPAlert.show({
        icon: "warning",
        title: t("sales_return"),
        text: t("voucher_number_cannot_be_empty"),
        confirmButtonText: t("ok"),
        showCancelButton: false
      });
      return false;
    }
  };

  const handleDiscountSlab = async () => {
    if (
      applicationSettings.productsSettings.enableDiscountSlabOffer &&
      applicationSettings.accountsSettings.showTenderDialogInSales === false
    ) {
      try {
        let outState: DeepPartial<TransactionFormState> = {
          transaction: { master: {}, details: [] },
        };
        let discPerc = 0;

        let details = formState.transaction.details.filter(
          (x) => x.productID > 0
        );
        // Apply discount to each item with productID > 0
        if (details.length > 0) {
          const api = new APIClient()
          const pids = formState.transaction.details.filter(x => x.productID && x.productID > 0).map(x => Number(x.productID)).join(',');
          const res = await api.postAsync(`${Urls.inv_transaction_base}${transactionType}/isDiscountable`, { productIDs: pids });
          let lastRowIndex = -1
          if (res && res.pids?.lengh > 0) {
            const netPerc = res.netPerc;
            const _pids: number[] = res.pids.split(',').map((id: string) => Number(id.trim()));
            details = await Promise.all(details.map(async (item, i) => {
              if (_pids.includes(item.productID)) {
                lastRowIndex = details.findIndex(x => x.slNo === item.slNo);
                const detail = { slNo: item.slNo, discPerc: res.discPerc ?? 0 };
                const updatedRow = await calculateRowAmount(
                  item,
                  "discPerc",
                  { result: { transaction: { details: [detail] } } },
                  true
                );
                if (updatedRow?.transaction?.details?.length ?? 0 > 0) {
                  outState.transaction!.details!.push(
                    updatedRow.transaction!.details![0]
                  );
                  return { ...item, ...updatedRow.transaction!.details![0] };
                }
              }
              return item;
            })
            );

            const summaryRes = calculateSummary(details, formState, {
              result: {},
            });
            let totalRes = await calculateTotal(
              formState.transaction.master,
              summaryRes
                ? (summaryRes.summary as SummaryItems)
                : initialInventoryTotals,
              formState.formElements,
              {
                result: {},
              }
            );
            if (totalRes) {
              totalRes.summary = summaryRes.summary;
              totalRes.transaction = totalRes.transaction ?? {};
              totalRes.transaction.master = totalRes.transaction.master ?? {};
              totalRes.transaction.master.billDiscount = 0;
              totalRes.transaction.details = outState?.transaction
                ?.details as TransactionDetail[];

              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: totalRes,
                  updateOnlyGivenDetailsColumns: true,
                })
              );
              const res = safeFocusCurrentColumn(lastRowIndex, "qty");
              setCurrentCell(res, details[lastRowIndex], lastRowIndex != res?.rowIndex);
            }
          }
        }
      } catch (ex: any) {
        console.error("Error applying discounts:", ex);
      }
    }
  };

  function getCustomerTypeAndTitle(
    formType: string,
    title: string,
    isAppGlobal: boolean,
    maintainKSAEInvoice: boolean
  ) {
    let CUSTOMER_TYPE = "";
    let formTitle = title;

    // 🔹 When not global app, override logic
    if (!isAppGlobal) {
      if (maintainKSAEInvoice) {
        CUSTOMER_TYPE = "B2C";
      } else {
        CUSTOMER_TYPE = "";
      }
      return { CUSTOMER_TYPE, formTitle };
    }

    // 🔹 Normal logic based on form type
    switch (formType.toUpperCase()) {
      case "INTERSTATE":
        formTitle = `${title}[${formType}][Ctrl+F2]`;
        CUSTOMER_TYPE = "Interstate";
        break;

      case "INT":
        formTitle = `${title}[${formType}][Ctrl+F2]`;
        CUSTOMER_TYPE = "Int";
        break;

      case "WHOLESALE":
      case "B2B":
        formTitle = `${title}[${formType}][B2B][F2]`;
        CUSTOMER_TYPE = "B2B";
        break;

      default:
        if (formType.toUpperCase() !== "BT") {
          formTitle = `${title}[${formType}][B2C][F3]`;
          CUSTOMER_TYPE = "B2C";
        } else {
          formTitle = `${title}[${formType}]`;
          CUSTOMER_TYPE = "";
        }
        break;
    }

    return { CUSTOMER_TYPE, formTitle };
  }

  const giftOnBilling = async () => {
    try {
      // Gift on billing settings
      const invSettings = applicationSettings.productsSettings;

      if (
        invSettings.giftOnBilling &&
        invSettings.giftOnBillingAs !== "CashCoupons"
      ) {
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              userConfig: {
                duplicationMessage: false
              }
            },
          })
        );

        if (!formState.giftClaimed && !(formState.transaction.master.invTransactionMasterID > 0)) {
          const params = {
            grandTotal: String(formState.transaction.master.grandTotal || 0),
            warehouseID: String(formState.transaction.master.fromWarehouseID),
          };

          const query = new URLSearchParams(params).toString();

          const ds = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/GiftOnBilling`, query)

          if (ds?.giftProducts?.length > 0) {
            const row = ds.giftProductPrice;

            const Qty = Number(row.quantity ?? 0);
            // formState.giftProductQty = Qty;

            const Price = Number(row.specialPrice ?? 0);
            // formState.giftProductPrice = Price;

            const giftProductBatchId = Number(row.giftProductBatchID ?? 0);
            if (Qty > 0 && giftProductBatchId > 0) {

              if (ds?.giftProducts.length > 0) {
                for (const dr of ds?.giftProducts) {

                  const giftModel = {
                    barcode: dr.autoBarcode,
                    productBatchID: Number(dr.productBatchID),
                    productCode: dr.productCode,
                    productID: Number(dr.productID),
                    productName: dr.productName,
                  };
                  dispatch(
                    formStateHandleFieldChangeKeysOnly({
                      fields: {
                        giftProductQty: Qty,
                        giftProductPrice: Price,
                        giftBatchId: giftProductBatchId,
                        giftModels: [giftModel]
                      }
                    })
                  );

                  if (invSettings.giftOnBilling && invSettings.giftOnBillingAs === "Products") {
                    checkTheProductInSchemes(Qty, Price, [giftModel]);
                  }
                  else if (invSettings.giftOnBilling && invSettings.giftOnBillingAs === "Special Price") {
                    checkTheProductInSchemes(Qty, Price, [giftModel]);
                  }
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      // showAlert(err.message || "GiftOnBilling Error");
    }
  };

  // Click Tax on Discount apply Button In Footer
  const taxOnDiscountApplyButton = async () => {
    const currentBillDiscount = formState.transaction.master.billDiscount;
    try {
      const taxPerc = getMaxTaxPercInItemList();
      const billDiscTemp = currentBillDiscount;
      const netDisc = roundAwayFromZero(billDiscTemp / (1 + taxPerc / 100),2);
      let taxOnDisc = 0;
      if(taxPerc > 0){
        if (applicationSettings.branchSettings.enableTaxOnBillDiscount || applicationSettings.branchSettings.maintainKSA_EInvoice) {
        taxOnDisc = roundAwayFromZero((billDiscTemp - netDisc ), 2);
        if (Math.abs(billDiscTemp * 100 - taxOnDisc * 100) >= 0.75) {
          const dp = applicationSettings.mainSettings.decimalPoints;
          const factor = Math.pow(10, dp);
          taxOnDisc =
            Math.sign(taxOnDisc) *
            Math.round(Math.abs(taxOnDisc) * factor) /
            factor;
        } else {
          taxOnDisc = billDiscTemp == 0 ? 0 : formState.transaction.master.taxOnDiscount || 0;
        }
      }
     }
      const res = await calculateTotal({ ...formState.transaction.master, taxOnDiscount: taxOnDisc, billDiscount: netDisc }, formState.summary as SummaryItems, formState.formElements, {
        result: {
          transaction: {
            master: {
              taxOnDiscount: taxOnDisc,
              billDiscount: netDisc,
            }
          }
        }
      });
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: res
        },)
      );

    } catch {
      // intentionally ignored (same as C#)
    }
  };

  const applyTaxOnBillDiscount = async (billDiscount: number,) => {

    

    try {
      const taxPerc = getMaxTaxPercInItemList();
      // if (taxPerc < 0) return;

      const billDiscTemp = billDiscount;

      // Equivalent to MidpointRounding.AwayFromZero (2 decimals)
      const netDisc = roundAwayFromZero(
        billDiscount / (1 + taxPerc / 100),
        2
      );
      let taxOnDisc = 0;
      if (
      applicationSettings.branchSettings.enableTaxOnBillDiscount
    ) {
      
      taxOnDisc = roundAwayFromZero(
        (billDiscTemp * taxPerc / 100), 3
      );
      if (Math.abs(billDiscount * 100 - taxOnDisc * 100) >= 0.75) {
        const dp = applicationSettings.mainSettings.decimalPoints;

        // MidpointRounding.AwayFromZero equivalent
        const factor = Math.pow(10, dp);
        taxOnDisc =
          Math.sign(taxOnDisc) *
          Math.round(Math.abs(taxOnDisc) * factor) /
          factor;
      } else {
        taxOnDisc = billDiscount == 0 ? 0 : formState.transaction.master.taxOnDiscount || 0;
      }
    }
      const res = await calculateTotal({ ...formState.transaction.master, taxOnDiscount: taxOnDisc, billDiscount: billDiscount }, formState.summary as SummaryItems, formState.formElements, {
        result: {
          transaction: {
            master: {
              taxOnDiscount: taxOnDisc,
            }
          }
        }
      });
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: res
        },)
      );

    } catch {
      // intentionally ignored (same as C#)
    }
  };

  const getMaxTaxPercInItemList = (): number => {
    let maxTaxPerc = 0;

    try {
      const list = formState.transaction.details.filter(x => x.productID > 0);
      for (const row of list) {
        const vat = row.vatPerc ?? 0;
        if (vat > maxTaxPerc) {
          maxTaxPerc = vat;
        }
      }
    } catch {
      // silent catch (same as C#)
    }

    return maxTaxPerc;
  };
  const gridCode = `grd_inv_transaction_${(_voucherType ?? "") + (_formType ?? "")}`
  const _purchaseGridCol: ColumnModel[] = purchaseGridCol(applicationSettings, userSession
    , _voucherType || (formState.transaction.master.voucherType ?? "")
    , _formType || (formState.transaction.master.voucherForm ?? ""), t, formState) ?? []
  const initializeFormElements: initializeFormElementsFn = async (
    voucherType,
    voucherPrefix,
    formType,
    formCode,
    title,
    voucherNo,
    transactionMasterID,
    isInitial
  ) => {
    debugger;
    const dataWarranty = voucherType != "LPO" ? await api.getWithCacheAsync(
      `${Urls.inv_transaction_base}${transactionType}/data/warranty/`
    ) : [];
    const dataBrands = voucherType != "LPO" ? await api.getWithCacheAsync(
      `${Urls.inv_transaction_base}${transactionType}/data/brands/`
    ) : [];
    const priceCategory = voucherType != "LPO" ? await api.getWithCacheAsync(
      `${Urls.inv_transaction_base}${transactionType}/Data/PriceCategories/`
    ) : [];

    const key = btoa(`${userSession.userId}-${transactionType}_LocalSettings`);
    const Utc = await getStorageString(key);
    let userConfig: UserConfig | undefined;
    if (Utc) {
      const decoded = safeBase64Decode(Utc) ?? "{}";
      userConfig = customJsonParse(decoded ?? "{}");
    } else {
      userConfig = JSON.parse(JSON.stringify(await fetchUserConfig()));
    }

    let _formState: TransactionFormState = { ...TransactionFormStateInitialData };
    let isInvoker = (voucherNo && voucherNo > 0) || (transactionMasterID && transactionMasterID > 0);

    const softwareDate = moment(
      clientSession.softwareDate,
      "DD/MM/YYYY"
    ).local();

    let employeeID = 0;
    let _voucherNo = 0;
    let _voucherPrefix = "";



    if (isInvoker) {
      _formState = (await loadTransVoucher(
        false,
        voucherNo,
        voucherPrefix,
        voucherType,
        formType,
        undefined,
        transactionMasterID
      )) as TransactionFormState;

      _formState = {
        ..._formState,
        oldLedgerId:
          _formState.transaction.master.ledgerID,
        previousGrandTotal:
          _formState.transaction.master.grandTotal,

      }
      isInvoker = (_formState.transaction.master.invTransactionMasterID && _formState.transaction.master.invTransactionMasterID > 0);
    }
    if (voucherNo == undefined || voucherNo == 0) {
      const vchrNoRslt = await getNextVoucherNumber(
        formType ?? "",
        voucherType ?? "",
        voucherPrefix ?? "",
        false
      );
      _voucherNo = vchrNoRslt.voucherNumber;
      _voucherPrefix = vchrNoRslt.voucherPrefix;

    }

    if (!isInvoker) {
      const voucher: TransactionData = {
        ...transactionInitialData, details: !deviceInfo.isMobile ? Array.from({ length: 30 }, (_, index) => ({
          ...initialTransactionDetailData,
          slNo: generateUniqueKey()
        })) : []
      };
      _formState = {   
        ...TransactionFormStateInitialData,
        initialFormType: formType ?? "",
        initialVrType: voucherType ?? "",
        initialVrPrefix: (voucherNo == undefined || voucherNo == 0) ? _voucherPrefix ?? "" : voucherPrefix ?? "",
        transaction: {
          ...voucher,
          master: {
            ...voucher.master,
            voucherType: voucherType ?? "",
            voucherPrefix: (voucherNo == undefined || voucherNo == 0) ? _voucherPrefix ?? "" : voucherPrefix ?? "",
            voucherForm: formType ?? "",
            transactionDate: softwareDate.toISOString(),
            purchaseInvoiceDate: moment().local().toISOString(),
            voucherNumber: (voucherNo == undefined || voucherNo == 0) ? _voucherNo : voucherNo,
            inventoryLedgerID:
              voucherType == VoucherType.SalesReturn
                ? applicationSettings.inventorySettings?.defaultSalesReturnAcc
                : applicationSettings.inventorySettings?.defaultSalesAcc,
            ledgerID: applicationSettings.accountsSettings?.defaultCashAcc,
            fromWarehouseID:
              applicationSettings.inventorySettings.maintainWarehouse
                ? userConfig?.presetWarehouseId ?? 0 > 0
                  ? userConfig?.presetWarehouseId ?? 0
                  : applicationSettings.accountsSettings.allowSalesCounter &&
                    (userConfig?.counterWiseWarehouseId ?? 0) > 0
                    ? userConfig?.counterWiseWarehouseId ?? 0
                    : applicationSettings.inventorySettings.defaultWareHouse
                : (TransactionFormStateInitialData.transaction.master.fromWarehouseID ?? 0),
            costCentreID:
              userConfig?.presetCostenterId ?? 0 > 0
                ? userConfig?.presetCostenterId ?? 0
                : applicationSettings.accountsSettings.defaultCostCenterID,
            employeeID: formState.userConfig?.holdSalesMan ? formState.transaction.master.employeeID : userSession.employeeId > 0
              ? userSession.employeeId
              : voucher.master.employeeID,

          },
        },
        formElements: {
          ...initialFormElements,
        },
        transactionType: transactionType ?? "",
        formCode: formCode ?? "",
        title:
          (formType == undefined || formType.trim() == ""
            ? t(title)
            : isInitial ? t(title) + "[" + formType + "]" : t(title)) ?? "",

        printOnSave: applicationSettings.inventorySettings?.printInvAfterSave,
      };
      _formState = await loadLedgerData(_formState) as any;
      _formState.isInitialLedger = true;
    }
    _formState.userConfig = userConfig ?? {};
    _formState.dataWarranty = dataWarranty;
    _formState.dataBrands = dataBrands;

    _formState.inSearch =
      applicationSettings.productsSettings?.batchCriteria != "NB"
        ? false
        : true;




    _formState.formElements = {
      ..._formState.formElements,
      ////////////////////////
      cbWarehouse: {
        ..._formState.formElements.cbWarehouse,
        visible: applicationSettings.inventorySettings.maintainWarehouse,
        disabled:
          (_formState.userConfig?.presetWarehouseId ?? 0) > 0 ||
          (
            applicationSettings.accountsSettings.allowSalesCounter &&
            (_formState.userConfig?.counterWiseWarehouseId ?? 0) > 0 &&
            userSession.dbIdValue?.trim() === "BAHAMDOON"
          )
      },



      // 🔘 Round Off checkbox logic
      hasroundOff: {
        ..._formState.formElements.hasroundOff,
        disabled:
          !(applicationSettings.mainSettings.pOSRoundingMethod === "No Rounding" ||
            (applicationSettings.mainSettings.pOSRoundingMethod === "Not Set" &&
              applicationSettings.mainSettings.roundingMethod === "No Rounding")),     
      },

      // 🧾 Cost Centre
      cbCostCentre: {
        ..._formState.formElements.cbCostCentre,
        disabled: (_formState.userConfig?.presetCostenterId ?? 0) > 0,
      },

      // 🧾 Credit Account default

      /////////////////////////////////
      // Reset initial states
      lblCustomerType: { ..._formState.formElements.lblCustomerType, label: "" },

      // Hide or disable elements based on settings
      btnSave: {
        ..._formState.formElements.btnSave,
        disabled: !applicationSettings.branchSettings.maintainInventoryTransactionsEntry
      },
      btnEdit: {
        ..._formState.formElements.btnEdit,
        disabled: !applicationSettings.branchSettings.maintainInventoryTransactionsEntry
      },
      btnDelete: {
        ..._formState.formElements.btnDelete,
        disabled: !applicationSettings.branchSettings.maintainInventoryTransactionsEntry
      },

      // By default
      btnPartySearch: {
        ..._formState.formElements.btnPartySearch,
        visible: _formState.transaction.master.voucherForm !== "BT"
      },

      // Prefix handling

      txtVrPrefix: {
        ..._formState.formElements.voucherPrefix,
        disabled:
          (_formState.transaction.master.voucherForm === "CSI" &&
            applicationSettings.mainSettings.maintainSeperatePrefixforCashSales &&
            !applicationSettings.branchSettings.maintainKSA_EInvoice) ||
          (applicationSettings.branchSettings.maintainCounterWisePrefixForTransaction &&
            userSession.counter_vr_prefix !== "" &&
            !applicationSettings.branchSettings.maintainKSA_EInvoice),
      },


      // Default customer handling


      // Draft mode and import options
      btnDraftList: {
        ..._formState.formElements.btnDraftList,
        visible: applicationSettings.inventorySettings.enableSalesInvoiceDraftOption === true
      },
      chkDraftMode: {
        ..._formState.formElements.chkDraftMode,
        visible: _formState.transaction.master.voucherForm !== "BT" && applicationSettings.inventorySettings.enableSalesInvoiceDraftOption === true
      },
      importFromExcelToolStripMenuItem: {
        ..._formState.formElements.importFromExcelToolStripMenuItem,
        visible: applicationSettings.inventorySettings.enableImportSales ?? false
      },

    };
    _formState.transaction.master.ledgerID = (() => {
      let selectedValue = _formState.transaction.master.ledgerID;

      if (
        ["543140180640", "BAHAMDOON", "HANAPLASTICS"].includes(
          userSession.dbIdValue?.trim()
        )
      ) {
        selectedValue = applicationSettings.accountsSettings.defaultCustomerLedgerID;
      }

      if (applicationSettings.accountsSettings.setDefaultCustomerInSales) {
        if (!_formState.userConfig.notSetDefaultCustomer) {
          selectedValue = applicationSettings.accountsSettings.defaultCustomerLedgerID;
        }
      }

      return selectedValue;
    })(),
      _formState.userConfig.enableVoucherPrefix =
      applicationSettings.branchSettings.maintainCounterWisePrefixForTransaction &&
      userSession.counter_vr_prefix !== "" &&
      !applicationSettings.branchSettings.maintainKSA_EInvoice;

    // _formState.transaction.master.voucherPrefix = _formState.transaction.master.voucherForm === "CSI" &&
    //   applicationSettings.mainSettings.maintainSeperatePrefixforCashSales &&
    //   !applicationSettings.branchSettings.maintainKSA_EInvoice
    //   ? applicationSettings.mainSettings.cashSalesVoucherPrefix
    //   : applicationSettings.branchSettings.maintainCounterWisePrefixForTransaction &&
    //     userSession.counter_vr_prefix !== "" &&
    //     !applicationSettings.branchSettings.maintainKSA_EInvoice
    //     ? userSession.counter_vr_prefix
    //     : _formState.formElements.voucherPrefix.text

    /////////////////////////////////////////////////


    /////////////////////////
    // 1️⃣ Project visibility
    if (applicationSettings.accountsSettings.maintainProjectSite) {
      _formState.formElements = {
        ..._formState.formElements,
        lblProject: {
          ...initialFormElements.lblProject,
          visible: true
        },
        cbProject: {
          ...initialFormElements.cbProject,
          visible: true
        }
      };
    }

    // 2️⃣ KSA E-Invoice logic
    if (applicationSettings.branchSettings.maintainKSA_EInvoice && formType === "VAT") {
      _formState.formElements = {
        ..._formState.formElements,
        btnEdit: {
          ...initialFormElements.btnEdit,
          visible: false
        },
        btnDelete: {
          ...initialFormElements.btnDelete,
          visible: false
        }
      };

      if (applicationSettings.branchSettings.createCreditNoteAutomaticallyOnSalesEdit) {
        _formState.formElements.btnEdit = {
          ..._formState.formElements.btnEdit,
          visible: true
        };
      }
    }
    let disabled = true;

    // 3️⃣ Initial date and field setup
    if (!isInvoker) {
      const today = softwareDate;

      _formState.transaction.master.transactionDate = today.toISOString();
      _formState.transaction.master.purchaseInvoiceDate = today.toISOString();

      _formState.transaction.master.priceCategoryID = priceCategory[0]?.id;

      // Set WareHouse - Testing Needed
      if (formState.userConfig?.presetWarehouseId ?? 0 > 0) {
        _formState.transaction.master.fromWarehouseID = formState.userConfig?.presetWarehouseId ?? 0;
        _formState.formElements.cbWarehouse.disabled = true;
      } else {
        if (applicationSettings.mainSettings?.maintainBusinessType !== "Distribution") {
          if (applicationSettings.accountsSettings?.allowSalesCounter && (formState.userConfig?.counterWiseWarehouseId ?? 0) > 0) {
            _formState.transaction.master.fromWarehouseID = formState.userConfig?.counterWiseWarehouseId ?? 0;
          } else {
            _formState.transaction.master.fromWarehouseID = applicationSettings.inventorySettings?.defaultWareHouse;
          }
        }
      }

      // 4️⃣ Party assignment logic
      const g = userSession;

      if (g.counterwiseCashLedgerId > 0 && applicationSettings.accountsSettings.allowSalesCounter) {

        _formState.transaction.master.ledgerID = g.counterwiseCashLedgerId;


        // if not BT, disable
        if (formType !== "BT") {
          disabled = true;
        }

        // exception: maintain shift = false AND DBID != SAMAPLASTICS
        if (!g.isMaintainShift && g.dbIdValue !== "SAMAPLASTICS") {
          disabled = false;
        }

        _formState.formElements.cbParty = {
          ...initialFormElements.cbParty,
          disabled
        };

      } else {
        // fallback to warehouse cash ledger (NOT defaultCashAcc)
        _formState.transaction.master.ledgerID = applicationSettings.accountsSettings.defaultCashAcc;
      }


      // DBID SPECIFIC OVERRIDE
      const dbid = g.dbIdValue?.trim();
      if (["543140180640", "BAHAMDOON", "HANAPLASTICS"].includes(dbid)) {
        _formState.transaction.master.ledgerID =
          applicationSettings.accountsSettings.defaultCustomerLedgerID;
      }


      // SET DEFAULT CUSTOMER IN SALES
      if (
        applicationSettings.accountsSettings.setDefaultCustomerInSales &&
        !_formState.userConfig?.notSetDefaultCustomer
      ) {
        _formState.transaction.master.ledgerID =
          applicationSettings.accountsSettings.defaultCustomerLedgerID;
      }

      // 5️⃣ Salesman assignment
      _formState.transaction.master.employeeID = 0;

      if (g.employeeId > 0) {
        _formState.transaction.master.employeeID = g.employeeId;
        _formState.formElements.cbSalesMan = {
          ..._formState.formElements.cbSalesMan,
          disabled: ["BAHAMDOON", "DURRAH_RYD"].includes(dbid)
        };
      }


      // 6️⃣ Checkbox defaults
      _formState.userConfig!.showRateBeforeTax = applicationSettings?.productsSettings?.showRateBeforeTax ? true : _formState.userConfig?.showRateBeforeTax
      _formState.userConfig!.printOnSave = _formState.userConfig!.printOnSave ?? applicationSettings.inventorySettings.printInvAfterSave

      _formState.userConfig!.duplicationMessage = _formState.userConfig!.duplicationMessage ?? applicationSettings.inventorySettings.showProductDuplicationMessage
      _formState.userConfig!.focusToQtyAfterBarcode = _formState.userConfig!.focusToQtyAfterBarcode ?? applicationSettings.productsSettings.focusToQtyAfterBarcode
      _formState.userConfig!.roundOff = !(
        applicationSettings.mainSettings.pOSRoundingMethod === "No Rounding" ||
        (applicationSettings.mainSettings.pOSRoundingMethod === "Not Set" &&
          applicationSettings.mainSettings.roundingMethod === "No Rounding")
      )
      _formState.userConfig!.autoEwayBill = applicationSettings.gSTTaxesSettings.enableEWB ? true : false;
      _formState.userConfig!.disableEinvoice = applicationSettings.gSTTaxesSettings.enableEInvoiceIndia ? true : false;
    };

    // 7️⃣ Tender button visibility
    _formState.formElements.btnTender = {
      ...initialFormElements.btnTender,
      visible: applicationSettings.accountsSettings.showTenderDialogInSales
    };

    //////////////////////

    if (userSession.dbIdValue?.trim() === "SEMAKA") {
      _formState.formElements = {
        ..._formState.formElements,
        rbCash: {
          ...initialFormElements.rbCash,
          visible: true
        },
        rbCredit: {
          ...initialFormElements.rbCredit,
          visible: true
        }
      } as any;
    }

    if (userSession.dbIdValue === "543140180640") {
      if (
        userSession.userTypeCode === "BA" ||
        userSession.userTypeCode === "CA"
      ) {
        _formState.formElements = {
          ..._formState.formElements,
          btnSettings: {
            ...initialFormElements.btnSettings,
            visible: true
          }
        } as any;
      } else {
        _formState.formElements = {
          ..._formState.formElements,
          btnSettings: {
            ...initialFormElements.btnSettings,
            visible: false
          }
        } as any;
      }
    }

    if (
      applicationSettings.inventorySettings?.blockBillDiscount === "On Standard Sales" ||
      applicationSettings.inventorySettings?.blockBillDiscount === "On Both"
    ) {
      _formState.formElements = {
        ..._formState.formElements,
        txtBillDiscount: {
          ...initialFormElements.txtBillDiscount,
          disabled: true
        },
        txtBillDiscPerc: {
          ...initialFormElements.txtBillDiscPerc,
          disabled: true
        }
      } as any;
    }

    // if (hasBlockedDiscountRight(_formState.transaction.master.voucherForm) === true) {
    //   // txtBillDiscount.Enabled = txtBillDiscPerc.Enabled = false;
    //   _formState.formElements = {
    //     ..._formState.formElements,
    //     txtBillDiscount: {
    //       ...initialFormElements.txtBillDiscount,
    //       disabled: true
    //     },
    //     txtBillDiscPerc: {
    //       ...initialFormElements.txtBillDiscPerc,
    //       disabled: true
    //     }
    //   } as any;
    // }

    if (!isInvoker) {
      // C# logic: if (PolosysFrameWork.General.DBID_VALUE.Trim() == "543140180640" || PolosysFrameWork.General.DBID_VALUE.Trim() == "BAHAMDOON" || PolosysFrameWork.General.DBID_VALUE.Trim() == "HANAPLASTICS")
      if (applicationSettings.accountsSettings?.setDefaultCustomerInSales) {
        if (_formState.userConfig?.notSetDefaultCustomer !== true) {
          _formState.transaction.master.ledgerID = applicationSettings.accountsSettings?.defaultCustomerLedgerID;
        }
      }
    }
    if (userSession.dbIdValue === "SAMAPLASTICS") {
      _formState.formElements = {
        ..._formState.formElements,
        chkPrintAfterSave: {
          ...initialFormElements.chkPrintAfterSave,
          disabled: true
        }
      } as any;
    }
    logUserAction({
      action: `User Printed Voucher ${formState.transaction.master.voucherType}:${formState.transaction.master.voucherForm}:${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
      actionForm: formState.transaction.master.voucherType
    });

    if (
      applicationSettings.printerSettings?.printSelectedGatePass ||
      applicationSettings.printerSettings?.printGatePass
    ) {
      _formState.gatePassPrint = true;
      _formState.formElements = {
        ..._formState.formElements,
        chkPrintGatepass: {
          ...initialFormElements.chkPrintGatepass,
          disabled: false
        }
      } as any;
    } else {
      _formState.gatePassPrint = false;
      _formState.formElements = {
        ..._formState.formElements,
        chkPrintGatepass: {
          ...initialFormElements.chkPrintGatepass,
          disabled: true,
        }
      } as any;
    }

    if (userSession?.countryId === 1) {
      _formState.formElements = {
        ..._formState.formElements,
        btnSrAmtPnlsShow: {
          ...initialFormElements.btnSrAmtPnlsShow,
          visible: false
        }
      } as any;
    }

    if (
      applicationSettings.productsSettings?.enableDiscountSlabOffer &&
      applicationSettings.accountsSettings?.showTenderDialogInSales === false
    ) {
      _formState.formElements = {
        ..._formState.formElements,
        btnDiscountSlab: {
          ...initialFormElements.btnDiscountSlab,
          visible: true
        }
      } as any;
    }

    if (formType === "BT") {
      _formState.formElements = {
        ..._formState.formElements,
        chkUserSalesPriceForTransfer: {
          ...initialFormElements.chkUserSalesPriceForTransfer,
          visible: true
        }
      } as any;
    }
    let __gridCols = (await getInitialPreference(gridCode, _purchaseGridCol, new APIClient()))
    const _gridCols = __gridCols.columnPreferences.map(x => {
      return {
        ...x,
        visible: (clientSession.isAppGlobal && (_formState.transaction.master.voucherForm.toUpperCase() == "INTERSTATE" ||
          _formState.transaction.master.voucherForm.toUpperCase() == "INT" ||
          _formState.transaction.master.voucherForm.toUpperCase() == "IMPORT") && ["cgst", "sgst", "sgstPerc", "cgstPerc"].includes(x.dataField)) ? false : x.visible
      }
    });

    const mergedUserConfig = merge({}, formState.userConfig, userConfig);
    _formState = {
      ..._formState,
      isInv: true,
      transaction: {
        ..._formState.transaction,
        master: {
          ..._formState.transaction.master,
          hasCashPaid: _formState.userConfig.setDefaultCashReceived ?? false,
          customerType: getCustomerTypeAndTitle(_formState.transaction.master.voucherForm, _formState.title, clientSession.isAppGlobal, applicationSettings.branchSettings.maintainKSA_EInvoice).CUSTOMER_TYPE,
        },
      },
      gridColumns: _gridCols as any,

      userConfig: mergedUserConfig,
      transactionType: transactionType ?? "",
      dummyProducts: applicationSettings.productsSettings?.loadDummyProducts,

      formCode: formCode ?? "",
      title:
        (formType == undefined || formType.trim() == ""
          ? t(title)
          : clientSession.isAppGlobal ?
            getCustomerTypeAndTitle(_formState.transaction.master.voucherForm, _formState.title, clientSession.isAppGlobal, applicationSettings.branchSettings.maintainKSA_EInvoice).formTitle
            :
            isInitial ? t(title) + "[" + formType + "]" : t(title)) ?? "",
      initialTitle:
        (formType == undefined || formType.trim() == ""
          ? t(title)
          : clientSession.isAppGlobal ?
            getCustomerTypeAndTitle(_formState.transaction.master.voucherForm, _formState.title, clientSession.isAppGlobal, applicationSettings.branchSettings.maintainKSA_EInvoice).formTitle
            :
            isInitial ? t(title) + "[" + formType + "]" : t(title)) ?? "",
    };

    _formState.gridColumns?.forEach((x: any) => {
      if (x.dataFiled === "unitPriceFC" || x.dataFiled === "grossFC") {
        x.visible = true;
      }
    });

    _formState.formElements = {
      ..._formState.formElements,
      pnlMasters: { ...initialFormElements.pnlMasters, disabled: isInvoker },

      hasCashPaid: {
        ...initialFormElements.hasCashPaid,
        label:
          voucherType == "SR"
            ? "cash_paid"
            : "cash_received",
      },
      ledgerID: {
        ...initialFormElements.ledgerID,
        accLedgerType: applicationSettings.inventorySettings.showAccountPayableInSales ?
          LedgerType.Cash_Bank_Suppliers_Customers_Employees
          : applicationSettings.accountsSettings.showEmployeesInSales ?
            LedgerType.Cash_Bank_Customers_Employees : LedgerType.Cash_Bank_Suppliers_Customers_Employees,
        label: "customer",

      },
      cbEmployee: {
        ...initialFormElements.cbEmployee,
        label: "sales_man"
      },

      chkTaxNumber: {
        ...initialFormElements.chkTaxNumber,
        label: clientSession.isAppGlobal ? "GSTIN" : "VAT",
      },


    } as any;

    const handleFocusItem = (e?: React.SyntheticEvent | Event) => {
      e?.preventDefault();
      const editableColumn = _formState.gridColumns?.find(
        (col) =>
          col.visible !== false &&
          col.dataField != null &&
          col.allowEditing === true &&
          col.readOnly !== true
      );
      if (!isInitial && !_formState.userConfig?.holdSalesMan) {
        setIsDropDownOpen?.({ open: true, autoAddressFocus: false });
        setTimeout(() => {
          employeeRef?.current?.focus();
          employeeRef?.current?.select();
        }, 100);

      } else if (isInitial && _formState.userConfig?.initialFocusToCustomer) {
        ledgerIdRef?.current?.focus();
        ledgerIdRef?.current?.select();
      } else if (applicationSettings.mainSettings.maintainBusinessType === "Distribution" && _formState.userConfig?.enableTransactionDate) {
        setTimeout(() => {
          transactionDateRef?.current?.focus();
        }, 0);
      } else if (_formState.userConfig?.initialFocusToCustomer) {
        ledgerIdRef?.current?.focus();
        ledgerIdRef?.current?.select();
      } else {
        _formState.currentCell = {
          column: editableColumn?.dataField ?? "",
          data: formState.transaction.details[0],
          rowIndex: 0,
          reCenterRow: false
        };
      }
    };
    handleFocusItem();
    // const editableColumn = _formState.gridColumns?.find(
    //   (col) => col.visible !== false && col.dataField != null && col.allowEditing == true && col.readOnly !== true
    // );
    // if(!isInitial && !_formState.userConfig?.holdSalesMan){
    //    setIsDropDownOpen?.({ open: true, autoAddressFocus: false });
    //     setTimeout(() => {
    //       employeeRef?.current?.focus();
    //       employeeRef?.current?.select();
    //     }, 100);
    // }else if(isInitial && _formState.userConfig?.initialFocusToCustomer){
    //   ledgerIdRef?.current?.focus();
    //   ledgerIdRef?.current?.select();
    // }else if (applicationSettings.mainSettings.maintainBusinessType == "Distribution") {
    //   setTimeout(() => {
    //     transactionDateRef?.current?.focus();
    //   }, 0);
    // } else if (_formState.userConfig?.initialFocusToCustomer) {
    //   ledgerIdRef?.current?.focus();
    //   ledgerIdRef?.current?.select();
    // } else {
    //   _formState.currentCell = {
    //     column: editableColumn?.dataField ?? "",
    //     data: formState.transaction.details[0],
    //     rowIndex: 0,
    //     reCenterRow: false
    //   };
    // }
    // if (_formState.formElements.cbDebitAccount ?? {})
    // }

    // 
    //  
    // _formState = await loadLedgerData(_formState) as any;
    // _formState.isInitialLedger = true;
    const __formState = setUserRightsFn(JSON.parse(JSON.stringify(_formState)), userSession, hasRight);
    setTransVoucher(__formState, true);
    // if (voucherNo != undefined && voucherNo > 0) {
    //   dispatch(
    //     setUserRight({ userSession: userSession, hasRight: hasRight })
    //   );
    // }
  };



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
    generateLPQ: generateLPQ,
    generateLPO: generateLPO,
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
    postBillWiseDetails,
    logUserAction,
    handleLoadSr,
    handleDiscountSlab,
    getCustomerTypeAndTitle,
    giftOnBilling,
    fetchUserConfig, applyTaxOnBillDiscount,
    _purchaseGridCol,
    gridCode,
    initializeFormElements,
    calculateTaxOnDiscount,
    taxOnDiscountApplyButton
  };
};
