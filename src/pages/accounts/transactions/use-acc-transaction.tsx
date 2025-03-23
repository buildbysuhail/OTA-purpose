import { useCallback } from "react";

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
import { deleteAccVoucher, unlockAccTransactionMaster } from "./thunk";
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
  Attachments,
  BillwiseData,
} from "./acc-transaction-types";
import {
  isEnterKey,
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../utilities/Utils";
import { ApplicationSettingsType } from "../../settings/system/application-settings-types/application-settings-types";
import {
  calculateTotal,
  isDirtyAccTransaction,
  setTransactionForHistory,
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
    skipPrompt?: boolean | false,
    setVoucherNo?: boolean | false
  ) => {
    const _s_isDirty = isDirtyAccTransaction(formState.prev, {
      transaction: { ...formState.transaction },
      row: { ...formState.row },
    });
    if (_s_isDirty && skipPrompt != true) {
      // if (mode == "increment" || mode == "decrement") {
      //   // const _voucherNumber =
      //   //   mode == "increment"
      //   //     ? parseFloat(
      //   //       formState.transaction.master.voucherNumber.toString()
      //   //     ) - 1
      //   //     : parseFloat(
      //   //       formState.transaction.master.voucherNumber.toString()
      //   //     ) + 1;

      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            openUnsavedPrompt: true,
            tmpVoucherNo: voucherNumber,
          },
        })
      );
      // dispatch(
      //   accFormStateTransactionMasterHandleFieldChange({
      //     fields: {
      //       voucherNumber: voucherNumber,
      //     },
      //   })
      // );
      // }
      return false;
    }

    if (setVoucherNo) {
      dispatch(
        accFormStateTransactionMasterHandleFieldChange({
          fields: {
            voucherNumber: voucherNumber,
          },
        })
      );
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
        disabled: _formState.transaction.master.accTransactionMasterID > 0,
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

    if (
      userSession.dbIdValue?.trim() == "BAHAMDOON" &&
      formState.isBahamdoonPOSReceipt != true
    ) {
      _formState.row.ledgerCode = "2768";
      _formState.isBahamdoonPOSReceipt = true;

      _formState.transaction.master.commonNarration = `Counter: ${userSession.counterName}, User: ${userSession.userName}`;

      // Handle ledger selection based on voucher type
      if (_formState.transaction.master.voucherType === "BR") {
        _formState.masterAccountID =
          applicationSettings.accountsSettings.defaultCreditCardAcc > 0
            ? applicationSettings.accountsSettings.defaultCreditCardAcc
            : applicationSettings.accountsSettings.defaultBankAcc;
      } else if (_formState.transaction.master.voucherType === "CR") {
        _formState.masterAccountID =
          userSession.counterwiseCashLedgerId > 0 &&
          applicationSettings.accountsSettings.allowSalesCounter
            ? userSession.counterwiseCashLedgerId
            : applicationSettings.accountsSettings.defaultCashAcc;
      }

      // Fetch Ledger ID
      let id = dataContainer?.ledgers?.find(
        (x) => x.alias == _formState.row.ledgerCode
      )?.id;
      if (!(id > 0)) {
        const sds = await api.getAsync(Urls.data_acc_ledgers);
        id = sds?.find((x: any) => x.alias == _formState.row.ledgerCode)?.id;
      }

      if (id > 0) {
        _formState.row.ledgerID = id;
      } else {
        ERPAlert.show({
          title: "",
          text: `Ledger Code: ${_formState.row.ledgerCode} Not found.`,
          icon: "error",
        });
        return false;
      }

      (_formState.printOnSave = true),
        // Disable UI elements after setting values
        (_formState.formElements = {
          ..._formState.formElements,
          voucherPrefix: {
            ..._formState.formElements.voucherPrefix,
            disabled: true,
          },
          ..._formState.formElements,
          voucherNumber: {
            ..._formState.formElements.voucherNumber,
            disabled: true,
          },
          voucherNumberUpDownBtns: {
            ..._formState.formElements.voucherNumberUpDownBtns,
            visible: false,
          },
          transactionDate: {
            ..._formState.formElements.transactionDate,
            disabled: true,
          },
          ledgerCode: {
            ..._formState.formElements.ledgerCode,
            disabled: true,
          },
          remarks: {
            ..._formState.formElements.remarks,
            disabled: true,
          },
          commonNarration: {
            ..._formState.formElements.commonNarration,
            disabled: true,
          },
          masterAccount: {
            ..._formState.formElements.masterAccount,
            disabled: true,
          },
          ledgerID: {
            ..._formState.formElements.ledgerID,
            disabled: true,
          },
          referenceDate: {
            ..._formState.formElements.referenceDate,
            disabled: true,
          },
          btnBillWise: {
            ..._formState.formElements.btnBillWise,
            disabled: true,
          },
          employee: {
            ..._formState.formElements.employee,
            disabled: true,
          },
          projectId: {
            ..._formState.formElements.projectId,
            disabled: true,
          },
          hasDiscount: {
            ..._formState.formElements.hasDiscount,
            disabled: true,
          },
          chequeNumber: {
            ..._formState.formElements.chequeNumber,
            disabled: true,
          },
          bankDate: {
            ..._formState.formElements.bankDate,
            disabled: true,
          },
          linkEdit: {
            ..._formState.formElements.linkEdit,
            visible: false,
          },
        });
    }

    _formState.prev = modelToBase64Unicode(
      setTransactionForHistory(_formState)
    );

    console.log("accFormStateHandleFieldChange1");
    console.log(_formState);

    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          ..._formState,
        },
      })
    );
  };
  const { t } = useTranslation("transaction");
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
      formType: formType ?? (formState.transaction?.master?.formType || ""),
      MannualInvoiceNumber: manualInvoiceNumber ?? "", // Convert undefined to an empty string or appropriate string value
      SearchUsingMannualInvNo: usingManualInvNumber, // Convert boolean to string
    };
    let vch = await api.getAsync(
      `${Urls.acc_transaction_base}${transactionType}`,
      new URLSearchParams(params).toString()
    );

    if (vch == null || vch?.master == null) {
      // const vno = await getNextVoucherNumber(params.formType,params.voucherType,params.voucherPrefix, false);
      vch = {
        ...accTransactionInitialData,
        master: {
          ...accTransactionInitialData.master,
          voucherNumber: _voucherNumber,
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
            ? userSession.employeeId ?? -2
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
          case "CPE":
            voucher.masterAccountID = firstDetail.relatedLedgerID;
            break;

          case "CR":
          case "BR":
          case "DN":
          case "CQR":
          case "PV":
          case "PBR":
          case "CRE":
            voucher.masterAccountID = firstDetail.ledgerID ?? 0;
            break;

          case "JV":
          case "JVSP":
            voucher.masterAccountID =
              voucher.transaction.master.drCr === "Dr"
                ? firstDetail.ledgerID ?? 0
                : firstDetail.relatedLedgerID;
            // voucher.transaction.master.drCr =
            // voucher.transaction.master.drCr === "Dr" ? "Debit" : "Credit";
            break;
        }
      }

      voucher.transaction.details = refactorDetails(voucher.transaction);
      voucher.transaction.attachments = refactorAttachments(
        voucher.transaction
      );
    }
    if (voucher.transaction.attachments) {
      voucher.transaction.attachments = refactorAttachments(
        voucher.transaction
      );
    }

    // Handle attachments

    // Calculate total amount

    voucher.transactionLoading = false;

    voucher.transaction.master.totalAmount = calculateTotal(voucher);

    return voucher;
  };
  const refactorAttachments = (transaction: AccTransactionData) => {
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
  const refactorDetails = (transaction: AccTransactionData) => {
    return transaction.details.map((detail, index) => {
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
      switch (transaction.master.voucherType) {
        case "CP":
        case "BP":
        case "CN":
        case "CQP":
        case "SV":
        case "PBP":
        case "CPE":
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
        case "CRE":
          return {
            ...baseDetail,
            ledgerCode: detail.relatedLedgerCode,
            ledgerName: detail.particulars,
            ledgerID: detail.relatedLedgerID,
          };

        case "JV":
        case "SP":
          if (
            transaction.master.drCr === "Dr" ||
            transaction.master.drCr === "Debit"
          ) {
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
    });
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
          title: t("demo_expired"),
        });
        return false;
      }
    }
    if (["TXP"].includes(formState.transaction.master.voucherType)) {
      if (applicationSettings.accountsSettings.allowUserwiseCounter == true) {
        if (
          clientSession.counterShiftId == undefined ||
          clientSession.counterShiftId == 0
        ) {
          ERPAlert.show({
            icon: "warning",
            title: t("please_open_counter_for_transaction"),
          });
          return false;
        }
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
        title: t("transaction_warning"),
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
      (formState.transaction.master.voucherType == "JV" ||
        formState.transaction.master.voucherType == "JVSP") &&
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
      const totalDebit = Number(
        formState.transaction.details.reduce(
          (sum, x) => sum + (Number(x.debit) || 0),
          0
        )
      ).toFixed(applicationSettings.mainSettings?.decimalPoints || 2);
      const totalCredit = Number(
        formState.transaction.details.reduce(
          (sum, x) => sum + (Number(x.credit) || 0),
          0
        )
      ).toFixed(applicationSettings.mainSettings?.decimalPoints || 2);
      if (totalDebit !== totalCredit) {
        ERPAlert.show({
          icon: "warning",
          title: t("debit/credit"),
          text: t("total_debit_and_credit"),
        });
        return false;
      }
    }
    if (!validateStatus(formState.transaction.details)) {
      ERPAlert.show({
        icon: "warning",
        title: t("debit/credit"),
        text: t("contains_multiple_statuses"),
      });
      return false;
    }
    return true;
  };
  const validateStatus = (accounts: AccTransactionRow[]): boolean => {
    try {
      let hasC = false;
      let hasB = false;
      let hasP = false;

      for (const row of accounts) {
        if (!row.ledgerID) {
          break;
        }

        const checkStatus = row.chequeStatus;

        if (checkStatus === "C") hasC = true;
        else if (checkStatus === "B") hasB = true;
        else if (checkStatus === "P") hasP = true;
      }

      if (hasC && hasP) {
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("Error validating status:", error);
      alert(error.message);
      return false;
    }
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
    const { firstDebitLedgerID, firstCreditLedgerID } =
      getFirstDebitCreditLedgerIDs(formState.transaction);

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
        case "CQE":
          element.ledgerID = element.ledgerID; // Preserve original ledgerID
          element.relatedLedgerID = formState.masterAccountID;
          break;

        case "CR":
        case "BR":
        case "DN":
        case "PV":
        case "CQR":
        case "CRE":
          element.relatedLedgerID = element.ledgerID ?? 0;
          element.ledgerID = formState.masterAccountID;
          break;

        case "JV":
        case "JVSP":
          if (formState.row.drCr === "Dr") {
            element.relatedLedgerID = element.ledgerID ?? 0;
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
            element.relatedLedgerID = element.ledgerID ?? 0;
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
        case "CPT":
        case "BPT":
        case "CNT":
        case "EXP":
        case "TXP":
          element.relatedLedgerID = formState.masterAccountID;
          element.ledgerID = element.ledgerID;
          break;
        case "CRT":
        case "BRT":
        case "DNT":
        case "INC":
          element.relatedLedgerID = element.ledgerID ?? 0;
          element.ledgerID = formState.masterAccountID;
          break;
      }
      element.particularsLedgerId = element.relatedLedgerID;
      element.voucherType = formState.transaction.master.voucherType;
      element.chqDate =
        element.chqDate == ""
          ? moment().local().toISOString()
          : element.chqDate;
      element.bankDate =
        element.bankDate == ""
          ? moment().local().toISOString()
          : element.bankDate;
      element.checkBouncedDate =
        element.checkBouncedDate == ""
          ? moment().local().toISOString()
          : element.checkBouncedDate;

      if (
        billWiseExcludedTransactions.includes(
          formState.transaction.master.voucherType
        )
      ) {
        element.billwiseDetails = "";
        element.chequeStatus = "P";
      }
      element.invoiceDate =
        element.invoiceDate == "" || element.invoiceDate == null
          ? formState.transaction.master.transactionDate
          : element.invoiceDate;
      element.projectId =
        (element.projectId ?? 0).toString() == "" ? 0 : element.projectId;
      updatedDetails.push(element);
    }
    return updatedDetails;
  };
  const attachMaster = (): AccTransactionMaster => {
    const { firstDebitLedgerID, firstCreditLedgerID } =
      getFirstDebitCreditLedgerIDs(formState.transaction);
    const master = {
      ...formState.transaction.master,
      particulars:
        formState.transaction.master.voucherType != "MJV" &&
        formState.transaction.master.voucherType != "OB"
          ? dataContainer.ledgers?.find(
              (x) => x.id == formState.masterAccountID
            )?.name ?? ""
          : formState.transaction.master.voucherType == "OB"
          ? dataContainer.ledgers?.find(
              (x) =>
                x.id == applicationSettings.accountsSettings.defaultSuspenseAcc
            )?.name ?? ""
          : formState.transaction.master.voucherType == "MJV"
          ? dataContainer.ledgers?.find((x) => x.id == firstCreditLedgerID)
              ?.name ?? ""
          : "",
    };

    master.accTransactionMasterID = formState.isEdit
      ? master.accTransactionMasterID
      : 0;
    // master.bankDate = new Date().toISOString();
    master.checkBouncedDate = moment().local().toISOString();
    master.prevTransDate =
      master.transactionDate == ""
        ? moment().local().toISOString()
        : master.prevTransDate;
    master.referenceDate =
      master.referenceDate == ""
        ? moment().local().toISOString()
        : master.referenceDate;
    master.dueDate =
      master.transactionDate == ""
        ? moment().local().toISOString()
        : master.transactionDate;
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

    if (
      master.voucherType === "JV" ||
      master.voucherType === "MJV" ||
      master.voucherType === "JVSP"
    ) {
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
      accFormStateHandleFieldChange({
        fields: {
          saving: true,
        },
      })
    );

    const valid = validate();

    if (valid == true) {
      const master = attachMaster();
      const attachments = formState.transaction.attachments
        ?.filter((x) => x.id > 0)
        ?.map((x) => ({
          aType: x.aType,
          attachmentId: x.id,
          fileName: x.name,
          key: x.key,
          type: x.type,
        }));
      const params = {
        master: {
          ...master,
          transactionDate:
            master.transactionDate == "" ? null : master.transactionDate,
        },
        details: attachDetails(),
        attachments: attachments,
      };

      const saveRes =
        formState.transaction.master.accTransactionMasterID > 0
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
        console.log(`userSession.dbIdValue?.trim()${userSession.dbIdValue?.trim()}`);
        
        if (formState.printOnSave == true) {
          if (
            userSession.dbIdValue?.trim() == "BAHAMDOON" &&
            formState.isBahamdoonPOSReceipt != true
          ) {
            printPaymentReceiptAdvice();
          } else {
            printVoucher();
          }
        }

        if (formState.printCheque) {
          printCheque();
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
            value: refactorDetails({
              ...params,
              master: {
                ...params.master,
                transactionDate:
                  params.master.transactionDate == null
                    ? ""
                    : params.master.transactionDate,
              },
              details: saveRes.item.details,
            }),
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
  const clearRow = async (isEdit: boolean, accTransactionMasterID: number) => {
    await undoEditMode(isEdit, accTransactionMasterID);
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
        fields: {},
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
        let _drCr = getDrCr(formState.transaction.master.voucherType);

        if (formState.isRowEdit != true) {
          if (
            (billwiseDetails == undefined || billwiseDetails == null) &&
            formState.row.billwiseDetails == "" &&
            !formState.isTaxOnExpense
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
            formState.IsBillwiseTransAdjustmentExists == true &&
            !formState.isTaxOnExpense
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
        },
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
    if (
      !["OB", "MJV"].includes(formState.transaction.master.voucherType) &&
      isNullOrUndefinedOrZero(formState.masterAccountID)
    ) {
      ERPAlert.show({
        icon: "info",
        // title: t("select_master_account"),
        title: "Please Select " + formState.formElements.masterAccount.label,
        onConfirm: (result: any) => {
          focusMasterAccount();
          return false;
        },
      });
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
    if (
      formState.formElements.costCentreID.visible == false &&
      (applicationSettings.accountsSettings.maintainBillwiseAccount == true ||
        applicationSettings.accountsSettings.billwiseMandatory == true)
    ) {
      updatedFields.amount = {
        ...formState.formElements.amount,
        disabled: false,
      };
    }
    formState.formElements.btnAdd;

    const costCentreName =
      formState.row.costCentreID ?? 0 > 0
        ? dataContainer.costCentres?.find(
            (x) => x.id == formState.row.costCentreID
          )?.name
        : "";
    dispatch(
      accFormStateTransactionDetailsRowAdd({
        row: {
          ...formState.row,
          costCentreName: costCentreName,
          ledgerName:
            formState.row.ledgerName == undefined ||
            formState.row.ledgerName == null ||
            formState.row.ledgerName == ""
              ? dataContainer.ledgers?.find(
                  (x) => x.id == formState.row.ledgerID
                )?.name
              : formState.row.ledgerName,
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

    // Conditionally update costCentreID if needed
    if (formState.userConfig?.presetCostenterId ?? 0 > 0) {
      updatedFields.costCentreID = {
        ...formState.formElements.costCentreID,
        disabled: true,
      };
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
        `${Urls.validate_cheque_status}`,
        `detailId=${accTransactionDetailsId}`
      );

      return response;
    } catch (error) {
      ERPAlert.show({
        type: "error",
        title: t("error"),
        text:
          error instanceof Error ? error.message : t("failed_to_validate_PDC"),
      });
      return true; // Maintain original behavior of returning true on error
    }
  };
  interface RowClickHandlerParams {
    row: AccTransactionRow;
  }
  const getDrCr = (voucherType: string) => {
    switch (voucherType) {
      case "CP":
      case "CPE":
      case "BP":
      case "DN":
      case "CQP":
      case "SV":
      case "SRV":
      case "PBP":
        return "Dr";
      case "CR":
      case "CRE":
      case "BR":
      case "CN":
      case "CQR":
      case "PV":
      case "PBR":
        return "Cr";

        break;
      case "OB":
      case "MJV":
        if (formState.row.drCr == "Dr") {
          return "Dr";
        } else {
          return "Cr";
        }
        break;
      case "JV":
      case "JVSP":
        if (formState.transaction.master.drCr == "Dr") {
          return "Cr";
        } else {
          return "Dr";
        }
    }
  };
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
            },
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
  const handleFieldKeyDown = async (
    field: string,
    key: any,
    gridRef?: any,
    applicationSettings?: ApplicationSettingsType
  ) => {
    debugger;
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
        if (formState.isTaxOnExpense) {
          focusPartName();
        } else {
          focusBtnAdd();
        }
      }
    } else if (field === "invoiceDate") {
      if (key == "Enter") {
        focusTaxableAmount();
      }
    } else if (field === "voucherNumber") {
      handleVoucherNumberKeyUp(key);
    } else if (field === "narration") {
      handleNarrationKeyDown(key);
    } else if (field === "employee") {
      handleEmployeeKeyDown(key);
    } else if (field === "ledgerID") {
      handleLedgerIdKeyDown(key);
    } else if (field === "btnPartySearch") {
      if (key == "Enter") {
        if (isNullOrUndefinedOrEmpty(formState.row.partyName)) {
          dispatch(
            accFormStateHandleFieldChange({
              fields: { showPartySelection: true },
            })
          );
        }
      }
    } else if (field === "bankDate") {
      if (isEnterKey(key)) {
        if (
          clientSession.isAppGlobal &&
          ["CQP", "CQR"].includes(formState.transaction.master.voucherType)
        ) {
          focusChequeStatus();
        } else {
          let _drCr = getDrCr(formState.transaction.master.voucherType);
          dispatch(
            accFormStateHandleFieldChange({
              fields: { showbillwise: true, billwiseDrCr: _drCr },
            })
          );
          // await showBillwise()
        }
      }
    } else if (field === "commonNarration") {
      if (isEnterKey(key)) {
        if (
          clientSession.isAppGlobal &&
          (formState.transaction.master.voucherType == "CQP" ||
            formState.transaction.master.voucherType == "CQR")
        ) {
          try {
            addOrEditRow();
          } catch (error) {
            return false;
          }
        } else {
          focusLedgerCode();
        }
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
        title: t("confirm_delete"),
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
        debugger;
        const response = await api.getAsync(
          `${Urls.get_ledgerId_by_code}${
            formState.row.ledgerCode == undefined ||
            formState.row.ledgerCode === ""
              ? "___"
              : formState.row.ledgerCode
          }`
        );
        debugger;
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
          dispatch(
            accFormStateRowHandleFieldChange({
              fields: {
                ledgerID: null,
              },
            })
          );
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
    debugger;
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
        // formState.formElements.btnBillWise.visible == true
                            !billWiseExcludedTransactions.includes(
                              formState.transaction.master.voucherType
                            ) 
      ) {
        if (
          (clientSession.isAppGlobal == true && !isChequeVoucher) ||
          (clientSession.isAppGlobal != true &&
            !isPaymentReceipt &&
            !isChequeVoucher)
        ) {
          let _drCr = getDrCr(formState.transaction.master.voucherType);

          dispatch(
            accFormStateHandleFieldChange({
              fields: { showbillwise: true, billwiseDrCr: _drCr },
            })
          );
        } else {
          focusChequeNumber();
        }

        if (isChequeVoucher) {
          focusChequeNumber();
        }
      } else {
        if (
          (clientSession.isAppGlobal == true && isChequeVoucher) ||
          (clientSession.isAppGlobal != true &&
            (isPaymentReceipt || isChequeVoucher))
        ) {
          focusChequeNumber();
        } else {
          if (
            applicationSettings.accountsSettings?.maintainCostCenter &&
            formState.formElements.costCentreID.visible == true &&
            (formState.userConfig?.presetCostenterId ?? 0) <= 0
          ) {
            focusCostCenterRef();
          } else {
            focusBtnAdd();
          }
        }
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

    if (
      clientSession.isAppGlobal &&
      (formState.transaction.master.voucherType === "CQP" ||
        formState.transaction.master.voucherType === "CQR")
    ) {
      const isCleared =
        formState.transaction.details.filter((x) => x.chequeStatus == "C")
          .length > 0;
      const isBounced =
        formState.transaction.details.filter((x) => x.chequeStatus == "B")
          .length > 0;
      if (isCleared) {
        ERPAlert.show({
          title: t("warning"),
          text: t("cleared_pdc_cannot_be_modified"),
          icon: "warning",
        });
        return false;
      } else if (isBounced) {
        ERPAlert.show({
          title: t("warning"),
          text: t("bounced_pdc_cannot_be_modified"),
          icon: "warning",
        });
        return false;
      }
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
  const deleteAccTransVoucher = async () => {
    if (formState.transaction.master?.isLocked) {
      ERPAlert.show({
        title: t("warning"),
        text: t("voucher_is_locked"),
        icon: "warning",
      });
      return;
    }
    if (
      clientSession.isAppGlobal &&
      (formState.transaction.master.voucherType === "CQP" ||
        formState.transaction.master.voucherType === "CQR")
    ) {
      const isCleared =
        formState.transaction.details.filter((x) => x.chequeStatus == "C")
          .length > 0;
      const isBounced =
        formState.transaction.details.filter((x) => x.chequeStatus == "B")
          .length > 0;
      if (isCleared) {
        ERPAlert.show({
          title: t("warning"),
          text: t("cleared_pdc_cannot_be_modified"),
          icon: "warning",
        });
        return false;
      } else if (isBounced) {
        ERPAlert.show({
          title: t("warning"),
          text: t("Bounced PDC Cannot be Modified"),
          icon: "warning",
        });
        return false;
      }
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
  const handleLoadByRefNo = useCallback(async () => {
    if (formState.transaction.master.referenceNumber) {
      await loadAndSetAccTransVoucher(
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
    const _drcr = getDrCr(formState.transaction.master.voucherType);
    let accTransactionDetailID = formState.row.accTransactionDetailID ?? 0;
    switch (formState.transaction.master.voucherType) {
      case "CR":
      case "BR":
      case "CN":
      case "CQR":
      case "PBR":
        if (formState.isEdit && accTransactionDetailID > 0) {
          accTransactionDetailID++; // Debiting ID is returns from stored procedure to get crediting ID increment 1
        }

        break;
      case "JV":
        if (formState.isEdit && accTransactionDetailID > 0) {
          accTransactionDetailID++; // Debiting ID is returns from stored procedure to get crediting ID increment 1
        }

        break;
      case "OB":
        if (
          formState.isEdit &&
          accTransactionDetailID > 0 &&
          formState.row.drCr.toUpperCase() == "CR"
        )
          accTransactionDetailID++; // Debiting ID is returns from stored procedure to get crediting ID increment 1

        break;
    }
    const billwise = await api.getAsync(
      `${Urls.acc_transaction_ledger_bill_wise}?LedgerId=${formState.row.ledgerID}&DrCr=${_drcr}&AccTransactionDetailID=${accTransactionDetailID}`
    );
    if (accTransactionDetailID > 0) {
      billwise.map((x: BillwiseData) => {
        return {
          ...x,
          balanceAfter: x.balance - x.billwiseAmount,
        };
      });
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
  const billWiseExcludedTransactions = [
    "TXP",
    "CPT",
    "BPT",
    "CNT",
    "EXP",
    "CRT",
    "BRT",
    "DNT",
    "INC",
  ];
  const showBillwise = async () => {
    if (
      billWiseExcludedTransactions.includes(
        formState.transaction.master.voucherType
      )
    ) {
      return false;
    }
    if (formState.row.ledgerID && formState.ledgerData != null) {
      const isBillwiseApplicable = await isLedgerBillwiseApplicable(
        formState.transaction.master.voucherType === "CN" ||
          formState.transaction.master.voucherType === "DN"
          ? formState.masterAccountID
          : formState.row.ledgerID
      );
      if (isBillwiseApplicable == true) {
        let _drCr = getDrCr(formState.transaction.master.voucherType);

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
    focusRefNo,
    focusAmount,
    focusDiscount,
    showBillwise,
    billWiseExcludedTransactions,
    getDrCr,
    clearRow,
  };
};
