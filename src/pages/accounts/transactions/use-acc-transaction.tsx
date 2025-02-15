import {
  useCallback,
} from "react";

// import { handleResponse } from '../HandleResponse';
import {
  customJsonParse,
  modelToBase64Unicode,
} from "../../../utilities/jsonConverter";
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
  accFormStateHandleFieldChange,
  accFormStateRowHandleFieldChange,
  accFormStateTransactionDetailsRowAdd,
  accFormStateTransactionDetailsRowRemove,
  accFormStateTransactionMasterHandleFieldChange,
  accFormStateTransactionUpdate,
  loadTempRows,
  clearState,
  updateFormElement,
  accFormStateClearBillWiseInDetails,
} from "./reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import {
  deleteAccVoucher,
  unlockAccTransactionMaster,
} from "./thunk";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import {
  AccTransactionData,
  AccTransactionFormState,
  accTransactionInitialData,
  AccTransactionMaster,
  AccTransactionRow,
  AccTransactionRowInitialData,
  AccUserConfig,
  BillwiseData,
} from "./acc-transaction-types";
import {
  isEnterKey,
  isNullOrUndefinedOrZero,
} from "../../../utilities/Utils";
import { ApplicationSettingsType } from "../../settings/system/application-settings-types/application-settings-types";
import {
  calculateTotal,
  isDirtyAccTransaction,
  validateTransactionDate,
} from "./functions";
import { useAccPrint } from "./use-print";
import moment from "moment";
import VoucherType from "../../../enums/voucher-types";
import { useTranslation } from "react-i18next";
// export interface AccUserConfig {
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
  const dataContainer = useAppSelector((state: RootState) => state.Data);
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
  const fetchUserConfig = async () => {
    try {
      const base64 = await api.get(Urls.get_acc_user_config);
      localStorage.setItem("utc", base64);
      // Decode the base64 back to JSON string
      const _userConfig = atob(base64);
      const userConfig: AccUserConfig = customJsonParse(_userConfig);

      return userConfig;
    } catch (error) {
      console.error("Error fetching user config:", error);
    }
  };
  const loadAndSetAccTransVoucher = async (
    usingManualInvNumber: boolean = false,
    voucherNumber?: number,
    voucherPrefix?: string,
    voucherType?: string,
    formType?: string,
    manualInvoiceNumber?: string,
    accTransactionMasterID?: number,
    mode?: "increment" | "decrement" | undefined,
    skipPrompt?: boolean | false
  ) => {

    const _s_isDirty = isDirtyAccTransaction(formState.prev, {
      transaction: { ...formState.transaction },
      row: { ...formState.row },
    });

    if (_s_isDirty && skipPrompt != true) {
      alert("changed");
      if (mode == "increment" || mode == "decrement") {
        const _voucherNumber =
          mode == "increment"
            ? parseFloat(
              formState.transaction.master.voucherNumber.toString()
            ) - 1
            : parseFloat(
              formState.transaction.master.voucherNumber.toString()
            ) + 1;
        dispatch(
          accFormStateTransactionMasterHandleFieldChange({
            fields: {
              voucherNumber: _voucherNumber,
            },
          })
        );
      }
      return false;
    }
    let _formState = await loadAccTransVoucher(
      usingManualInvNumber,
      voucherNumber,
      voucherPrefix,
      voucherType,
      formType,
      manualInvoiceNumber,
      accTransactionMasterID
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
        disabled: true,
      },
      btnSave: {
        ..._formState.formElements.btnSave,
        disabled:
          _formState.transaction.master.isLocked === true
            ? true
            : _formState.formElements.btnSave.disabled,
      },
    };
    setAccTransVoucher(_formState);
    return true;
  };
  const setAccTransVoucher = async (
    _formState: AccTransactionFormState,
    loadUserConfig: boolean = false
  ) => {
    const Utc = localStorage.getItem("utc");
    let userConfig: AccUserConfig | undefined;
    if (Utc) {
      const _userConfig = atob(Utc);
      userConfig = customJsonParse(_userConfig);
    } else {
      userConfig = await fetchUserConfig();
    }
    if (userConfig) {
      // If userConfig is available in localStorage, use it

      _formState.row.costCentreID =
        (userConfig?.presetCostenterId ?? 0 > 0
          ? userConfig?.presetCostenterId
          : userSession.dbIdValue == "SAMAPLASTICS12121212121"
            ? 0
            : applicationSettings?.accountsSettings?.defaultCostCenterID) ?? 0;
      _formState.userConfig = userConfig;
    }
    _formState.prev = modelToBase64Unicode({
      transaction: { ..._formState.transaction },
      row: { ..._formState.row },
    });
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          ..._formState,
        },
      })
    );
  };
  const { t } = useTranslation('transaction');
  const loadAccTransVoucher = async (
    usingManualInvNumber: boolean = false,
    voucherNumber?: number,
    voucherPrefix?: string,
    voucherType?: string,
    formType?: string,
    manualInvoiceNumber?: string,
    accTransactionMasterID?: number
  ) => {
    let voucher: AccTransactionFormState = JSON.parse(
      JSON.stringify({
        ...formState,
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
      formType: formType ?? (formState.transaction?.master?.formType || ""),
      MannualInvoiceNumber: manualInvoiceNumber ?? "", // Convert undefined to an empty string or appropriate string value
      SearchUsingMannualInvNo: usingManualInvNumber, // Convert boolean to string
    };
    let vch = await api.getAsync(
      `${Urls.acc_transaction_base}${transactionType}`,
      new URLSearchParams(params).toString()
    );

    if (vch == null || vch?.master == null) {
      vch = {
        ...accTransactionInitialData,
        master: {
          ...accTransactionInitialData.master,
          voucherNumber: voucherNumber,
          voucherType: voucherType ?? formState.transaction.master.voucherType,
          voucherPrefix:
            voucherPrefix ?? formState.transaction.master.voucherPrefix,
          formType: formType ?? formState.transaction.master.formType,
        },
      };
    }
    
    // clearControlForNew();
    await undoEditMode(
      formState.isEdit,
      accTransactionMasterID ??
      formState.transaction.master.accTransactionMasterID
    );

    // voucher.formElements.btnAdd = {
    //   ...voucher.formElements.btnAdd,
    //   text: "Add",
    // };
    // voucher.formElements.amount = {
    //   ...voucher.formElements.amount,
    //   disabled: false,
    // };
    voucher.transaction = {
      ...(vch || {}),
      attachments: [...(vch.transaction?.attachments || [])],
    };
    voucher.row = { ...AccTransactionRowInitialData };
    // Handle master data
    
    voucher.transaction = vch;
    if (vch?.master) {
      const updatedMaster = {
        ...voucher.transaction.master,
        employeeID:
          userSession.dbIdValue == "543140180640" && userSession.employeeId > 0
            ? userSession.employeeId
            : voucher.transaction.master.employeeID,
      };
      voucher.transaction.master = updatedMaster;
    }
    // if (voucher.transaction.master.isLocked === true) {
    //   voucher.formElements.lnkUnlockVoucher.visible = true;
    // }
    if (vch?.details) {

      if (voucher.transaction.details?.length > 0) {
        voucher.total = voucher.transaction.details.reduce((total, detail) => {
          const amount =
            voucher.transaction.master.voucherType !== VoucherType.MultiJournal
              ? detail.amount
              : detail.debit;
          return total + (amount || 0);
        }, 0);
  
        // Set master account ID based on voucher type
        const firstDetail = voucher.transaction.details[0];
  
        switch (voucher.transaction.master.voucherType) {
          case "CP":
          case "BP":
          case "CN":
          case "CQP":
          case "SV":
          case "PBP":
            voucher.masterAccountID = firstDetail.relatedLedgerID;
            break;
  
          case "CR":
          case "BR":
          case "DN":
          case "CQR":
          case "PV":
          case "PBR":
            voucher.masterAccountID = firstDetail.ledgerID;
            break;
  
          case "JV":
            
           
            voucher.masterAccountID =
              voucher.transaction.master.drCr === "Dr"
                ? firstDetail.ledgerID
                : firstDetail.relatedLedgerID;
                // voucher.transaction.master.drCr =
                // voucher.transaction.master.drCr === "Dr" ? "Debit" : "Credit";
            break;
        }
      }

      
      let BillwiseaccTransactionDetailID = 0;
      voucher.transaction.details = voucher.transaction.details.map(
        (detail, index) => {
          const baseDetail = {
            ...detail,
            slNo: index + 1,
            amountFC: detail.amount,
            bankDate: detail.bankDate
              ? new Date(detail.bankDate).toISOString()
              : moment.utc("2000-01-01").startOf("day").toISOString(),
            chqDate: detail.chqDate
              ? new Date(detail.chqDate).toISOString()
              : moment.utc("2000-01-01").startOf("day").toISOString(),
            checkBouncedDate: detail.checkBouncedDate
              ? new Date(detail.checkBouncedDate).toISOString()
              : moment.utc("2000-01-01").startOf("day").toISOString(),
          };

          // Handle voucher type specific logic
          switch (voucher.transaction.master.voucherType) {
            case "CP":
            case "BP":
            case "CN":
            case "CQP":
            case "SV":
            case "PBP":
              return {
                ...baseDetail,
                ledgerCode: detail.ledgerCode,
                ledgerName: detail.ledgerName,
                ledgerID: detail.ledgerID,
              };

            case "CR":
            case "BR":
            case "DN":
            case "CQR":
            case "PV":
            case "PBR":
              BillwiseaccTransactionDetailID++;
              return {
                ...baseDetail,
                ledgerCode: detail.relatedLedgerCode,
                ledgerName: detail.particulars,
                ledgerID: detail.relatedLedgerID,
              };

            case "JV":
              BillwiseaccTransactionDetailID++;
              if (voucher.transaction.master.drCr === "Dr" || voucher.transaction.master.drCr === "Debit") {
                return {
                  ...baseDetail,
                  ledgerCode: detail.relatedLedgerCode,
                  ledgerName: detail.particulars,
                  ledgerID: detail.relatedLedgerID,
                };
              } else {
                return {
                  ...baseDetail,
                  ledgerCode: detail.ledgerCode,
                  ledgerName: detail.ledgerName,
                  ledgerID: detail.ledgerID,
                };
              }

            case "OB":
            case "MJV":
              return {
                ...baseDetail,
                ledgerCode: detail.ledgerCode,
                ledgerName: detail.ledgerName,
                ledgerID: detail.ledgerID,
                drCr: Number(detail.debit) > 0 ? "Dr" : "Cr",
              };

            default:
              return baseDetail;
          }
        }
      );
    }
    // Handle attachments

    // Calculate total amount
   
    voucher.transactionLoading = false;

    voucher.transaction.master.totalAmount = calculateTotal(voucher);

    return voucher;
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
          title: t("demo_expired"),
        });
        return false;
      }
    }

    const isvld = finalSave();
    return isvld;
  };
  const finalSave = () => {
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
        title:t("transaction_warning"),
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
        title: t("invalid_transaction"),
        text: t("zero_transaction"),
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
        title: t("debit_or_credit_in_master_ledger"),
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
          title: t("duplicate_ledger"),
          text: t("master_ledger_exists_in_row"),
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
          title: t("debit/credit"),
          text: t("total_debit_and_credit")
        });
        return false;
      }
    }

    return true;

  };
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
  const attachDetails = (): AccTransactionRow[] => {
    const details = JSON.parse(
      JSON.stringify([...formState.transaction.details])
    );
    let updatedDetails = [];
    let debtorID = 0,
      arra = 0,
      detailID = 0;
    const { firstDebitLedgerID, firstCreditLedgerID } = getFirstDebitCreditLedgerIDs(formState.transaction);

    for (let index = 0; index < details.length; index++) {
      const element: AccTransactionRow = details[index];
      if (isNullOrUndefinedOrZero(element.ledgerID)) {
        break;
      }
      element.adjAmount = 0;
      element.checkBouncedDate = element.bankDate;
      element.currencyID = 1;
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
          debugger;
          if (formState.row.drCr === "Dr") {
            element.relatedLedgerID =
              applicationSettings.accountsSettings.defaultSuspenseAcc; // Suspense account
            element.ledgerID = element.ledgerID; // Keep original ledger ID
          } else {
            element.relatedLedgerID = element.ledgerID;
            element.ledgerID =
              applicationSettings.accountsSettings.defaultSuspenseAcc; // Suspense account
          }
          break;

        case "MJV":
          if (element.drCr === "Dr") {
            element.ledgerID = element.ledgerID; // Keep original ledger ID
            element.relatedLedgerID = firstCreditLedgerID;
            element.debit = element.amount;
            element.credit = 0;
          } else {
            element.ledgerID = element.ledgerID; // Keep original ledger ID
            element.relatedLedgerID = firstDebitLedgerID;
            element.credit = element.amount;
            element.debit = 0;
          }
          break;
      }
      element.particularsLedgerId = element.relatedLedgerID;
      element.voucherType = formState.transaction.master.voucherType;
      element.chqDate = element.chqDate == "" ? moment().local().toISOString() : element.chqDate;
      element.bankDate = element.bankDate == "" ? moment().local().toISOString() : element.bankDate;
      element.checkBouncedDate = element.checkBouncedDate == "" ? moment().local().toISOString() : element.checkBouncedDate;
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
    master.checkBouncedDate = moment().local().toISOString();
    master.prevTransDate = master.transactionDate == "" ? moment().local().toISOString() : master.prevTransDate;
    master.referenceDate = master.referenceDate == "" ? moment().local().toISOString() : master.referenceDate;;
    master.dueDate =master.transactionDate == "" ? moment().local().toISOString() : master.transactionDate;;
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
    // dispatch(accFormStateTransactionUpdate({ key: "master", value: master }));
    return master;
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
        onConfirm: async () => { // Make this an async function
          await save();
        },
      });
    }
    else {
      await save()
    }
  }
  const save = async () => {


    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          saving: true,
        },
      })
    );
    
    const valid = validate()
    if (valid == true) {
      
const master = attachMaster();
      const params = {
        master: {...master,      
    transactionDate: master.transactionDate == "" ? null : master.transactionDate
        },
        details: attachDetails(),
        attachments: [...formState.transaction.attachments],
      };
      const saveRes = formState.transaction.master.accTransactionMasterID > 0
        ? await api.putAsync(
          `${Urls.acc_transaction_base}${transactionType}`,
          params
        )
        : await api.postAsync(
          `${Urls.acc_transaction_base}${transactionType}`,
          params
        );
      if (saveRes.isOk == true) {
        dispatch(
          accFormStateTransactionUpdate({
            key: "masterValidations",
            value: undefined,
          })
        );
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
        if (formState.userConfig?.clearDetailsAfterSaveAccounts == true) {
          clearControls(
            formState.isEdit,
            formState.transaction.master.accTransactionMasterID
          );
        } else {
          const isFinancialYearClosed =
            userSession.financialYearStatus === "Closed";
          const fieldsToUpdate: Record<string, any> = {
            // employee: { disabled: false },
            // jvDrCr: { disabled: false },
            // masterAccount: { disabled: false },
            // referenceDate: { disabled: false },
            // referenceNumber: { disabled: false },
            // transactionDate: { disabled: false },
            // linkEdit: { visible: false },

            pnlMasters: { disabled: true },

            linkEdit: { visible: false },
            // dxGrid: { disabled: false },
            // btnSave: { disabled: true },
            // btnEdit: {
            //   disabled:
            //     !isFinancialYearClosed &&
            //     hasRight(formState.formCode, UserAction.Edit)
            //       ? false
            //       : true,
            // },
            // btnDelete: { disabled: true },
            // btnPrint: { disabled: true },
          };

          // Dispatch the update action with all the required fields
          dispatch(updateFormElement({ fields: fieldsToUpdate }));
        }
        ERPToast.show(saveRes.message, "success");
      } else {
        // dispatch(acc)
        ERPAlert.show({
          icon: "warning",
          title: saveRes.message,
        });
        dispatch(
          accFormStateTransactionUpdate({
            key: "details",
            value: saveRes.item.details,
          })
        );
        dispatch(
          accFormStateTransactionUpdate({
            key: "attachments",
            value: saveRes.item.attachments,
          })
        );
        dispatch(
          accFormStateTransactionUpdate({
            key: "masterValidations",
            value: saveRes.validations,
          })
        );
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
    // dispatch(
    //   accFormStateRowHandleFieldChange({
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
        fields: {

        },
      })
    );
  };
  const handleRemoveItem = async (index: number) => {
    dispatch(
      accFormStateTransactionDetailsRowRemove({
        index: index,
        applicationSettings: applicationSettings,
      })
    );
  };
  const addOrEditRow = async (
    billwiseDetails?: string,
    totalAmount?: number
  ) => {

    if (applicationSettings.accountsSettings?.billwiseMandatory) {
      if (!isNullOrUndefinedOrZero(formState.row.ledgerID)) {
        let _drCr;
        switch (formState.transaction.master.voucherType) {
          case "CP":
          case "BP":
          case "DN":
          case "CQP":
          case "SV":
          case "SRV":
          case "PBP":
            _drCr = "Dr";
            break;
          case "CR":
          case "BR":
          case "CN":
          case "CQR":
          case "PV":
          case "PBR":
            _drCr = "Cr";

            break;
          case "OB":
          case "MJV":
            if (formState.row.drCr == "Dr") {
              _drCr = "Dr";
            } else {
              _drCr = "Cr";
            }
            break;
          case "JV":
            if (formState.transaction.master.drCr == "Dr") {
              _drCr = "Cr";
            } else {
              _drCr = "Dr";
            }
            break;
        }
        if (formState.isRowEdit != true) {
          if (
            (billwiseDetails == undefined || billwiseDetails == null) &&
            formState.row.billwiseDetails == ""
          ) {
            if (formState.IsBillwiseTransAdjustmentExists) {
              dispatch(
                accFormStateHandleFieldChange({
                  fields: {
                    showbillwise: true,
                    billwiseDrCr: _drCr,
                  },
                })
              );
              return false;
            }
          }
          dispatch(
            accFormStateHandleFieldChange({
              fields: { showbillwise: false, billwiseData: [] },
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
                  billwiseDrCr: _drCr,
                },
              })
            );
            return false;
          }
          dispatch(
            accFormStateHandleFieldChange({
              fields: { showbillwise: false, billwiseData: [] },
            })
          );
        }
      }
    }
    if (isNullOrUndefinedOrZero(formState.row.ledgerID)) {
      ERPAlert.show({
        icon: "warning",
        title: t("please_select_ledger"),
        onConfirm() {
          focusLedgerCombo();
          return false;
        },
        onCancel() {
          return false;
        },
      });
      return false;
    }
    const fdd = isNullOrUndefinedOrZero(totalAmount ?? formState.row.amount);
    const fdsdd = isNullOrUndefinedOrZero(
      formState.transaction.master.totalAmount
    );
    if (
      isNullOrUndefinedOrZero(totalAmount ?? formState.row.amount) &&
      !isNullOrUndefinedOrZero(formState.transaction.master.totalAmount)
    ) {
      if (hasRight(formState.formCode, UserAction.Add)) {
        dispatch(
          updateFormElement({
            fields: {
              btnSave: {
                disabled: false,
                label: t("add"),
              },
            },
          })
        );
      }
      ERPAlert.show({
        title: t("are_you_sure_save_now"),
        icon: "warning",
        confirmButtonText: t("save_now"),
        cancelButtonText: t("cancel"),
        onConfirm: (result: any) => {
          if (result.isConfirmed) {
            save();
            return false;
          }
        },
        onCancel: () => {
          focusLedgerCode();
          return false;
        }
      });
     
    }

    if (isNullOrUndefinedOrZero(totalAmount ?? formState.row.amount)) {
      ERPAlert.show({
        icon: "info",
        onCancel: () => {
          focusAmount();
          return false;
        },
        title: t("enter_the_amount"),
        onConfirm: (result: any) => {
          focusAmount();
          return false;
        },
      });

      return false;
    }
    if (!["OB", "MJV"].includes(formState.transaction.master.voucherType) && isNullOrUndefinedOrZero(formState.masterAccountID)) {
      ERPAlert.show({
        icon: "info",
        // title: t("select_master_account"),
        title: "Please Select " + formState.formElements.masterAccount.label ,
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
        title: t("select_cost_center"),
      });
      focusCostCenterRef();
      return false;
    }
    if (
      formState.formElements.costCentreID.visible == false
      && (applicationSettings.accountsSettings.maintainBillwiseAccount == true 
          || applicationSettings.accountsSettings.billwiseMandatory == true
      )
    ) {
      formState.formElements.amount.disabled = false;
    }
    formState.formElements.btnAdd;
debugger;
const sdsd = formState.row.costCentreID > 0 ? dataContainer.costCentres?.find(x => x.value == formState.row.costCentreID)?.name: "";
    dispatch(
      accFormStateTransactionDetailsRowAdd({
        row: {
          ...formState.row,
          costCentreName: formState.row.costCentreID > 0 ? dataContainer.costCentres?.find(x => x.id == formState.row.costCentreID)?.name: "",
          // ledgerName: formState.row.ledgerID > 0 ? ledgerData?.find(x => x.value == formState.row.ledgerID)?.name: "",
          amount: totalAmount ?? formState.row.amount,
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
      // referenceNumber: { disabled: true },
      referenceDate: { disabled: true },
      transactionDate: { disabled: true },
      btnEdit: { visible: true },
      amount: { disabled: false },
      linkEdit: { visible: true },
    };

    // Conditionally update costCentreID if needed
    if (formState.userConfig?.presetCostenterId ?? 0 > 0) {
      updatedFields.costCentreID = { disabled: true };
    }

    // Dispatch the updateFormElement action
    dispatch(
      updateFormElement({
        fields: updatedFields,
      })
    );
    focusLedgerCombo();
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
        `${Urls.validate_cheque_status}`, `detailId=${accTransactionDetailsId}`,
      );

      return response;
    } catch (error) {
      ERPAlert.show({
        type: "error",
        title: t("error"),
        text: error instanceof Error ? error.message : t("failed_to_validate_PDC"),
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
      if (row?.accTransactionDetailID) {
        const isPDCValid = await validatePDC(row?.accTransactionDetailID);
        
        if (isPDCValid) {
          ERPAlert.show({
            title: t("warning"),
            text: t("can't_edit"),
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
            btnAdd: { disabled: false, label: t("modify") },
          },
        })
      );

      // Update row data in form state
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            row: {
              ...row,
              // amount: row.amountFC?.toString() || row.amount?.toString() || "0",
            }
          },
        })
      );

      let accTransDetailsID = row.accTransactionDetailID;

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
        title: t("error"),
        text: t("error_occurred"),
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
    } else if (field === "drCr") {
      handleDrCrKeyDown(key);
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
        text: t("you_want_to_delete"),
        icon: "warning",
        confirmButtonText: t("delete_it"),
        onConfirm: () => {
          const dataGridInstance = gridRef.current.instance(); // Access DataGrid instance
          const focusedRowIndex = dataGridInstance.option("focusedRowIndex");
          dispatch(
            accFormStateTransactionDetailsRowRemove({
              applicationSettings: applicationSettings,
              index: focusedRowIndex,
            })
          );
        },
      });
    }
  };

  // Ledger code keydown handler
  const handleLedgerCodeKeyDown = async (e: any) => {
    if (e === "Enter" || e === "Tab") {
      try {
        const response = await api.getAsync(
          `${Urls.get_ledgerId_by_code}${formState.row.ledgerCode == undefined ||
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

  // DrCr keydown handler
  const handleDrCrKeyDown = (e: any) => {

    if (
      e === "Enter" &&
      (formState.row.drCr == "Dr" || formState.row.drCr == "Cr")
    ) {
      const voucherType = formState.transaction.master.voucherType;

      if (formState.formElements.costCentreID.visible == true) {
        focusCostCenterRef();
      } else {
        focusBtnAdd();
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
        formState.formElements.costCentreID.visible == true &&
        (formState.userConfig?.presetCostenterId ?? 0) <= 0
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

        await loadAndSetAccTransVoucher(
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
        title: t("warning"),
        text: t("voucher_is_locked"),
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
        text: t("voucher_is_locked"),
        icon: "warning",
      });
      return;
    }

    ERPAlert.show({
      title: t("confirm_delete"),
      text: t("delete_this_voucher"),
      icon: "warning",
      confirmButtonText: t("delete_it"),
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
                title: t("failed"),
                text: res.message,
                onConfirm: () => {
                  return false;
                },
              });
            } else if (res?.isOk == true) {
              ERPAlert.show({
                icon: "success",
                title: t("deleted"),
                text: res.message,
              });
              clearControls(
                formState.isEdit,
                formState.transaction.master.accTransactionMasterID
              );
            }
          }
        } catch (error) {
          console.error("Error deleting voucher:", error);
        }
      },
    });
  };
  const handleLoadByRefNo = useCallback(() => {
    if (formState.transaction.master.referenceNumber) {
      loadAndSetAccTransVoucher(
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        formState.transaction.master.referenceNumber,
        undefined,
        undefined,
        true
      );
    }
  }, [formState.transaction.master.referenceNumber]);

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

      const lastPrefix = selectVoucherData
        ? selectVoucherData[0].lastPrefix
        : "";
      const getVoucherNumber = await getNextVoucherNumber(
        formState.transaction.master.formType,
        formState.transaction.master.voucherType,
        formState.transaction.master.voucherType,
        false
      );

      dispatch(
        accFormStateTransactionMasterHandleFieldChange({
          fields: {
            // voucherPrefix: lastPrefix,
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
      `${Urls.acc_transaction_ledger_bill_wise}?LedgerId=${formState.row.ledgerID
      }&DrCr=${formState.transaction.master.drCr}&AccTransactionDetailID=${formState.row.accTransactionDetailID ?? 0
      }`
    );
    if (formState.row.accTransactionDetailID ?? 0 > 0) {
      billwise.map((x: BillwiseData) => {
        return {
          ...x,
          balanceAfter: x.balance - x.billwiseAmount
        }
      })
    }
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

        let _drCr;
        switch (formState.transaction.master.voucherType) {
          case "CP":
          case "BP":
          case "DN":
          case "CQP":
          case "SV":
          case "SRV":
          case "PBP":
            _drCr = "Dr";
            break;
          case "CR":
          case "BR":
          case "CN":
          case "CQR":
          case "PV":
          case "PBR":
            _drCr = "Cr";

            break;
          case "OB":
          case "MJV":
            if (formState.row.drCr == "Dr") {
              _drCr = "Dr";
            } else {
              _drCr = "Cr";
            }
            break;
          case "JV":
            if (formState.transaction.master.drCr == "Dr") {
              _drCr = "Cr";
            } else {
              _drCr = "Dr";
            }
            break;
        }
        dispatch(
          accFormStateHandleFieldChange({
            fields: { showbillwise: true, billwiseDrCr: _drCr },
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
    loadAndSetAccTransVoucher,
    loadAccTransVoucher,
    setAccTransVoucher,
    deleteAccTransVoucher,
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
    billwiseChanged,
    focusCostCenterRef,
    focusLedgerCode,
    showBillwise,
  };
};
