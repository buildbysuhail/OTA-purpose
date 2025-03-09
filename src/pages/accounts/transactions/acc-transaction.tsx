import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import Urls from "../../../redux/urls";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../components/ERPComponents/erp-dev-grid";
import {
  AccTransactionData,
  AccTransactionFormState,
  accTransactionFormStateInitialData,
  accTransactionInitialData,
  AccTransactionMasterInitialData,
  AccTransactionProps,
  AccTransactionRow,
  AccTransactionRowInitialData,
  initialFormElements,
} from "./acc-transaction-types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import {
  accFormStateHandleFieldChange,
  accFormStateRowHandleFieldChange,
  accFormStateTransactionMasterHandleFieldChange,
  setUserRight,
  updateFormElement,
} from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../helpers/api-client";
import {
  ApplicationMainSettings,
  ApplicationMainSettingsInitialState,
} from "../../settings/system/application-settings-types/application-settings-types-main";
import ERPPreviousUrlButton from "../../../components/ERPComponents/erp-previous-uirl-button";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAccTransaction } from "./use-acc-transaction";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { AccTransactionUserConfig } from "./acc-transaction-user-config";
import BillWisePopup from "./billwise-popup";
import CustomerDetailsSidebar from "../../transaction-base/customer-details";
import { isNullOrUndefinedOrZero } from "../../../utilities/Utils";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import ERPResizableSidebar from "../../../components/ERPComponents/erp-resizable-sidebar";
import TemplatesView from "./acc-templates";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import useFormComponent from "./use-form-components";
import { useUserRights } from "../../../helpers/user-right-helper";
import { Link } from "react-router-dom";
import {
  Ellipsis,
  EllipsisVertical,
  KeyRound,
  Pencil,
  Printer,
  RefreshCw,
  Trash2,
  ChevronUp,
  BadgePlusIcon,
  Eraser,
  X,
  FileUp,
  History,
  Search,
  AlignHorizontalSpaceBetween,
} from "lucide-react";
import { LedgerType } from "../../../enums/ledger-types";
import AccExcelImport from "./acc-Excel-Import";
import { PDFViewer } from "@react-pdf/renderer";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import { renderSelectedTemplate } from "./acc-renderSelected-template";
import moment from "moment";
import ERPAttachment from "../../../components/ERPComponents/erp-attachment";
import VoucherType from "../../../enums/voucher-types";
import HistorySidebar from "./historySidebar";
import {
  customJsonParse,
  modelToBase64,
  modelToBase64Unicode,
} from "../../../utilities/jsonConverter";
import VoucherNumberDetailsSidebar from "../../transaction-base/Voucher-number-details";
import UnsavedChangesModal from "./unsavedChangesModal";
import PartySelectionModal from "./party-selection-modal";
import { Countries } from "../../../redux/slices/user-session/user-branches-reducer";
import AccMasterAccount from "./components/acc-master-account";
import AccDrCrJv from "./components/acc-drcr-jv";
import AccNotes from "./components/acc-notes";
import AccCurrencyID from "./components/acc-currency-ID";
import AccCurrencyRate from "./components/acc-currency-Rate";
import AccEdit from "./components/acc-edit";
import AccReferenceNumber from "./components/acc-reference-number";
import AccTransactionDate from "./components/acc-transaction-Date";
import AccReferenceDate from "./components/acc-reference-Date";
import AccEmployeeID from "./components/acc-employee-ID";
import AccRemarks from "./components/acc-remarks";
import AccProject from "./components/acc-project";
import AccTaxDetails from "./components/acc-tax-details";
import Amount from "./components/amount";
import BankCharge from "./components/bank-charge";
import BankDate from "./components/bank-date";
import BankName from "./components/bank-name";
import ChequeNumber from "./components/cheque-number";
import ChequeStatus from "./components/cheque-status";
import CostCentre from "./components/cost-centre";
import Discount from "./components/discount";
import Drcr from "./components/drcr";
import Ledger from "./components/ledger";
import LedgerCode from "./components/ledger-code";
import NameOnCheque from "./components/name-on-cheque";
import Narration from "./components/narration";
import AccVoucherPrefix from "./components/acc-voucher-prefix";
import AccVoucherNo from "./components/acc-voucher-no";
import BtnAdd from "./components/btn-add";
import AccHeader from "./components/acc-header";
interface BilledItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  cashacc?: string;
  discount: number;
  tax: number;
}

interface FormData {
  itemName: string;
  quantity: string;
  cashacc?: string;
  unit: string;
  rate: string;
  taxOption: "Without Tax" | "With Tax";
}

const api = new APIClient();

const AccTransactionForm: React.FC<AccTransactionProps> = ({
  voucherType,
  voucherPrefix,
  formType,
  formCode,
  title,
  drCr,
  voucherNo,
  transactionType,
  transactionMasterID,
  financialYearID,
  isTeller = false,
}) => {
  const [triggerEffect, setTriggerEffect] = useState(false);

  useEffect(() => {
    if (triggerEffect) {
      const timer = setTimeout(() => {
        setTriggerEffect(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [triggerEffect]);

  const handleClearControls = () => {
    clearControls(
      formState.isEdit,
      formState.transaction.master.accTransactionMasterID
    );
    // setTriggerEffect(prev => !prev); // Toggle the triggerEffect state
    // setTriggerEffect(true);
  };

  const { t } = useTranslation("transaction");
  const [gridCode, setGridCode] = useState<string>(
    `grd_acc_transaction_${(voucherType ?? "") + (formType ?? "")}`
  );
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const currentBranch = useCurrentBranch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const btnAddRef = useRef<HTMLButtonElement>(null);
  const ledgerCodeRef = useRef<HTMLInputElement>(null);
  const ledgerIdRef = useRef<any>(null);
  const masterAccountRef = useRef<HTMLInputElement>(null);
  const costCenterRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const chequeNumberRef = useRef<HTMLInputElement>(null);
  const remarksRef = useRef<HTMLInputElement>(null);
  const drCrRef = useRef<HTMLInputElement>(null); // Example for a dropdown/select
  const narrationRef = useRef<HTMLInputElement>(null); // Example for a textarea
  const erpGridRef = useRef<any>(null); // Reference to ERPDevGrid
  const voucherNumberRef = useRef<HTMLInputElement>(null); // Ref for voucherNumber
  const taxableAmountRef = useRef<HTMLInputElement>(null);
  const partyNameRef = useRef<HTMLInputElement>(null);
  const refNoRef = useRef<HTMLInputElement>(null);
  const taxNoRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const chequeStatusRef = useRef<HTMLInputElement>(null);

  const [showValidation, setShowValidation] = useState(false);
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  const focusTaxNoField = () => {
    setTimeout(() => {
      if (taxNoRef.current) {
        taxNoRef.current.select();
        taxNoRef.current.focus();
      }
    }, 0);
  };
  const onSelectionChanged = (
    e: any,
    state: RootState,
    isRowClick: boolean
  ) => {
    if (state.AccTransaction.formElements.pnlMasters?.disabled == true) {
      return false;
    }
    const selectedIndexes = e.component.getSelectedRowKeys();
    const row = formState?.transaction?.details.find(
      (x) => x.slNo == selectedIndexes[0]
    );
    if (selectedIndexes.length > 0 && row) {
      if(deviceInfo.isMobile){(setIsOpen(true))}
      handleRowClick({
        row: row,
      });
    }
  };
  const handleKeyDown = (e: any, field: string) => {
    handleFieldKeyDown(
      field,
      e?.key ?? e?.event?.originalEvent?.key,
      erpGridRef,
      applicationSettings
    );
    if (e.key === "Enter") {
      if (field === "ledgerCode") {
        const ledgerCodeExists =
          formState.row.ledgerCode && formState.row.ledgerCode.trim() !== "";
        if (!ledgerCodeExists) {
          dispatch(
            accFormStateRowHandleFieldChange({
              fields: { ledgerID: "", ledgerName: "" },
            })
          );
        }
      }
      handleFieldKeyDown(field, e.key, erpGridRef, applicationSettings);
    }
  };

  const [loadTemplate, setLoadTemplate] = useState<TemplateState>();
  const { getFormattedValue, getAmountInWords } = useNumberFormat();
  const {
    undoEditMode,
    getNextVoucherNumber,
    loadAndSetAccTransVoucher,
    loadAccTransVoucher,
    setAccTransVoucher,
    deleteAccTransVoucher,
    validate,
    addOrEditRow,
    handleRemoveItem,
    handleRowClick,
    handleFieldKeyDown,
    loadTemporaryRows,
    save,
    enableCombo,
    disableCombo,
    handleEdit,
    clearControls,
    printCheque,
    printVoucher,
    printPaymentReceiptAdvice,
    handleLoadByRefNo,
    unlockVoucher,
    handleRefresh,
    createNewVoucher,
    billwiseChanged,
    focusCostCenterRef,
    focusLedgerCode,
    focusRefNo,
    focusAmount,
    focusDiscount,
    showBillwise,
    billWiseExcludedTransactions,
    getDrCr,
    clearRow
  } = useAccTransaction(
    transactionType ?? "",
    btnSaveRef,
    btnAddRef,
    ledgerCodeRef,
    ledgerIdRef,
    masterAccountRef,
    costCenterRef,
    amountRef,
    drCrRef,
    narrationRef,
    voucherNumberRef,
    chequeNumberRef,
    remarksRef,
    partyNameRef,
    taxableAmountRef,
    refNoRef,
    discountRef,
    chequeStatusRef
  );
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const [gridHeight, setGridHeight] = useState(200);
  const { hasRight } = useUserRights();

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightWindows = wh - 800;
    setGridHeight(gridHeightWindows);
  }, [window.innerHeight]);
  useEffect(() => {
    dispatch(
      accFormStateHandleFieldChange({
        fields: { masterAccountActive: isTeller },
      })
    );
  }, [isTeller]);
  useEffect(() => {
    dispatch(
      updateFormElement({
        fields: {
          btnEdit: {
            visible:
              financialYearID == undefined ||
              (financialYearID != undefined &&
                financialYearID == userSession.finId),
          },
        },
      })
    );
  }, [financialYearID]);

  useEffect(() => {
    billwiseChanged(formState.showbillwise);
  }, [formState.showbillwise]);

  useEffect(() => {
    const loadLedgerData = async () => {
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            ledgerDataLoading: true,
            ledgerIsBillWiseAdjustExistLoading: true,
            ledgerBalanceLoading: true,
          },
        })
      );

      try {
        const _drcr = getDrCr(formState.transaction.master.voucherType);
        const ledgerID = formState.row.ledgerID;
        const { billwiseMandatory } =
          applicationSettings.accountsSettings ?? {};
        const isRowEdit = formState.isRowEdit;
        let formElmns = {
          ...formState.formElements,
        };
        if (!isNullOrUndefinedOrZero(ledgerID)) {
          if (
            billwiseMandatory &&
            ((!isRowEdit && !formState.row.billwiseDetails) ||
              (isRowEdit && !formState.formElements.amount.disabled))
          ) {
            const IsBillwiseTransAdjustmentExists = await api.getAsync(
              `${Urls.acc_transaction_is_bill_wise_trans_adjustment_exists}?LedgerId=${ledgerID}&DrCr=${_drcr}&AccTransactionDetailID=0`
            );
            (formElmns = {
              ...formElmns,
              amount: {
                ...formElmns.amount,
                disabled:
                  (formState.transaction.master.voucherType == "CQP" ||
                    formState.transaction.master.voucherType == "CQR") &&
                  IsBillwiseTransAdjustmentExists
                    ? true
                    : false, // Update visibility based on ledgerData
              },
            }),
              dispatch(
                accFormStateHandleFieldChange({
                  fields: {
                    IsBillwiseTransAdjustmentExists,
                    ledgerIsBillWiseAdjustExistLoading: false,
                  },
                })
              );
          }

          const [ledgerBalance, ledgerData] = await Promise.all([
            (ledgerID ?? 0) > 0
              ? api.getAsync(`${Urls.get_ledger_balance}${ledgerID ?? 0}`)
              : 0,
            api.getAsync(
              `${Urls.ledgerDataForTransaction}?LedgerId=${ledgerID}&DrCr=${_drcr}`
            ),
          ]);
          dispatch(
            updateFormElement({
              fields: {
                ...formElmns,
                costCentreID: {
                  visible:
                    applicationSettings?.accountsSettings?.maintainCostCenter ||
                    ledgerData?.isCostCentreApplicable, // Update visibility based on ledgerData
                },
              },
            })
          );

          dispatch(
            accFormStateHandleFieldChange({
              fields: {
                ledgerBalance,
                groupName: ledgerData?.accGroupName,
                ledgerData,
                ledgerDataLoading: false,
              },
            })
          );
          dispatch(
            accFormStateRowHandleFieldChange({
              fields: {
                ledgerCode: ledgerData?.ledgerCode,
                ledgerName: ledgerData?.partyName,
                partyName:
                  formState.isTaxOnExpense && ledgerData != null
                    ? ledgerData.partyName ?? ""
                    : "",
                taxNo:
                  formState.isTaxOnExpense && ledgerData != null
                    ? // ? ledgerData.taxNumber??""
                      ledgerData.taxNumber ?? ""
                    : "",
              },
            })
          );
        } else {
          dispatch(
            accFormStateHandleFieldChange({
              fields: {
                ledgerBalance: 0,
                groupName: "",
                ledgerData: undefined,
              },
            })
          );
          dispatch(
            accFormStateRowHandleFieldChange({
              fields: { ledgerCode: "" },
            })
          );
        }
      } catch (error) {
        // Handle error
      }
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            ledgerDataLoading: false,
            ledgerIsBillWiseAdjustExistLoading: false,
            ledgerBalanceLoading: false,
          },
        })
      );
    };

    loadLedgerData();
  }, [formState.row.ledgerID]);
  useEffect(() => {
    // if (applicationSettings.mainSettings?.showNumberFormat == "Millions") {
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          amountInWords: getAmountInWords(formState.row.amount ?? 0),
        },
      })
    );
    // } else {
    // }
  }, [formState.row.amount]);
  useEffect(() => {
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          ledgerBalanceLoading: true,
        },
      })
    );
    const loadLedgerData = async () => {
      const ledgerBalance =
        formState.masterAccountID > 0
          ? await api.getAsync(
              `${Urls.get_ledger_balance}${formState.masterAccountID ?? 0}`
            )
          : 0;
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            masterBalance: ledgerBalance,
            ledgerBalanceLoading: false,
          },
        })
      );
    };
    loadLedgerData();
  }, [formState.masterAccountID]);

  useEffect(() => {
    const initializeFormElements = async () => {
      console.log("initializeFormElements");

      const isForeignCurrencyVisible =
        applicationSettings.accountsSettings?.maintainMultiCurrencyTransactions;
      const isProjectIdVisible =
        applicationSettings.accountsSettings?.maintainProjectSite ||
        userSession.dbIdValue == "543140180640";

      // Prepare the fields to update based on conditions

      // dispatch(updateFormElement({ fields: fieldsToUpdate }));
      // // Dispatch the update action

      let _formState: AccTransactionFormState;
      const isInvoker = voucherNo && voucherNo > 0;
      if (isInvoker) {
      }
      const softwareDate = moment(
        clientSession.softwareDate,
        "DD/MM/YYYY"
      ).local();

      console.log("masterAccountID = -2;");

      let masterAccountID = -2;
      let employeeID = 0;
      let _voucherNo = 0;
      if (!isInvoker) {
        _voucherNo = await getNextVoucherNumber(
          formType ?? "",
          voucherType ?? "",
          voucherPrefix ?? "",
          false
        );

        employeeID = userSession.employeeId ?? -2;
        if (voucherType == "CP" || voucherType == "CR") {
          masterAccountID =
            userSession?.counterwiseCashLedgerId > 0 &&
            applicationSettings.accountsSettings?.allowSalesCounter
              ? userSession?.counterwiseCashLedgerId
              : applicationSettings.accountsSettings?.defaultCashAcc;
        }

        if (voucherType == "JV" || voucherType == "MJV") {
          masterAccountID = 0;
        }

        if (userSession.dbIdValue === "543140180640") {
          if (voucherType === "CP" || voucherType === "CR") {
            let userCashLedgerID = 0;
            userCashLedgerID = await api.getAsync(
              `${Urls.get_userLedger_by_user_id}${userSession.userId}`
            );

            masterAccountID =
              userCashLedgerID > 0
                ? userCashLedgerID
                : applicationSettings.accountsSettings?.defaultCashAcc;
          }
        }
      }
      const prevNation = formState.row.narration;
      const templates = formState.templates;
      const templatesData = formState.templatesData;
      const template = formState.template;
      if (!isInvoker) {
        
        const voucher: AccTransactionData = accTransactionInitialData;
        _formState = {
          ...accTransactionFormStateInitialData,
          masterAccountID: masterAccountID,
          transaction: {
            ...voucher,
            master: {
              ...voucher.master,
              voucherType: voucherType ?? "",
              voucherPrefix: voucherPrefix ?? "",
              formType: formType ?? "",
              transactionDate: softwareDate.toISOString(),
              referenceDate: moment().local().toISOString(),
              drCr:
                drCr == undefined || drCr == ""
                  ? AccTransactionMasterInitialData.drCr
                  : drCr,
              employeeID: employeeID,
              voucherNumber: _voucherNo,
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
              : t(title) + "[" + formType + "]") ?? "",
          row: {
            ...AccTransactionRowInitialData,
            narration:
              (voucherType == "JV" || voucherType == "JVSP") &&
              formState?.userConfig?.keepNarrationForJV
                ? prevNation
                : "",
            bankDate: ["CR", "CP"].includes(voucher.master.voucherType)
              ? moment.utc("2000-01-01").startOf("day").toISOString()
              : moment().local().toISOString(),
            costCentreID:
              (formState.userConfig?.presetCostenterId ?? 0) > 0
                ? formState.userConfig?.presetCostenterId ?? 0
                : userSession.dbIdValue == "SAMAPLASTICS121212121"
                ? 0
                : applicationSettings.accountsSettings?.defaultCostCenterID,
          },

          printOnSave: applicationSettings.accountsSettings?.printAccAftersave,
        };
      } else {
        _formState = await loadAccTransVoucher(
          false,
          voucherNo,
          voucherPrefix,
          voucherType,
          formType,
          undefined,
          transactionMasterID
        );
      }
      
      _formState = {
        ..._formState,
        transactionType: transactionType ?? "",
        formCode: formCode ?? "",
        title:
          (formType == undefined || formType.trim() == ""
            ? t(title)
            : t(title) + "[" + formType + "]") ?? "",
      };
      _formState.isTaxOnExpense = [
        "TXP",
        "CPT",
        "BPT",
        "CNT",
        "EXP",
        "CRT",
        "BRT",
        "DNT",
        "INC",
      ].includes(_formState.transaction.master.voucherType);

      let fieldsToUpdate = {
        ...initialFormElements,
        pnlMasters: { ...initialFormElements.pnlMasters, disabled: isInvoker },
        btnSave: { ...initialFormElements.btnSave, disabled: true },
        btnEdit: { ...initialFormElements.btnEdit, disabled: true },
        btnPrint: { ...initialFormElements.btnPrint, disabled: true },
        foreignCurrency: {
          ...initialFormElements.foreignCurrency,
          visible: isForeignCurrencyVisible,
        },
        lblGroupName: { ...initialFormElements.lblGroupName, label: "" }, // Dynamically set the label as needed
        masterAccount: {
          ...initialFormElements.masterAccount,
          disabled:
            (_formState.transaction.master.voucherType ==
              VoucherType.CashPayment ||
              _formState.transaction.master.voucherType ==
                VoucherType.CashReceipt) &&
            userSession?.counterwiseCashLedgerId > 0 &&
            applicationSettings.accountsSettings?.allowSalesCounter &&
            userSession?.counterAssignedCashLedgerId > 0
              ? userSession.countryId == Countries.India
                ? formState.masterAccountActive == true
                  ? false
                  : true
                : true
              : false,
        },
        discount: { ...initialFormElements.discount, visible: true },
        projectId: {
          ...initialFormElements.projectId,
          visible: isProjectIdVisible,
        },
        costCentreID: {
          ...initialFormElements.costCentreID,
          visible: true,
        },
      } as any;
      switch (voucherType) {
        case "CR":
        case "CP":
        case "CPE":
        case "CRE": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("cash_account"),
              accLedgerType: LedgerType.CashInHand,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label:
                voucherType === "CR" || voucherType === "CRE"
                  ? t("collected_by")
                  : t("paid_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: true,
            },
            costCentreID: {
              ...fieldsToUpdate.costCentreID,
              visible: true,
              // applicationSettings?.accountsSettings?.maintainCostCenter ===
              // true,
            },
            bankName: {
              ...fieldsToUpdate.bankDate,
              visible: false,
            },
            nameOnCheque: {
              ...fieldsToUpdate.bankDate,
              visible: false,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: false,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: false,
            },
          };

          break;
        }

        case "PV":
        case "SV": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label:
                voucherType === "PV"
                  ? t("purchase_account")
                  : t("sales_account"),
              accLedgerType:
                voucherType === "PV"
                  ? LedgerType.Purchase_Account
                  : LedgerType.Sales_Account,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("done_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: true,
            },
          };
          break;
        }

        case "BR": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("bank_account"),
              accLedgerType: LedgerType.BankAccount,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("collected_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: true,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: !clientSession.isAppGlobal,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: !clientSession.isAppGlobal,
            },
            bankName: {
              ...fieldsToUpdate.bankName,
              visible: !clientSession.isAppGlobal,
            },
            nameOnCheque: {
              ...fieldsToUpdate.nameOnCheque,
              visible: !clientSession.isAppGlobal,
            },
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showChqNo: !clientSession.isAppGlobal,
              showChqDate: !clientSession.isAppGlobal,
              showNameOnCheque: !clientSession.isAppGlobal,
              showBankName: !clientSession.isAppGlobal,
            },
          };
          break;
        }
        case "CQR": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("bank_account"),
              accLedgerType: LedgerType.BankAccount,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("collected_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: true,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: true,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: true,
            },
            paymentType: {
              ...fieldsToUpdate.paymentType,
              visible: true,
            },
            bankCharge: {
              ...fieldsToUpdate.bankCharge,
              visible: true,
            },
            chequeStatus: {
              ...fieldsToUpdate.chequeStatus,
              visible: true,
            },
            bankName: {
              ...fieldsToUpdate.bankName,
              visible: true,
            },
            nameOnCheque: {
              ...fieldsToUpdate.nameOnCheque,
              visible: true,
            },
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showChqNo: true,
              showChqDate: true,
              showNameOnCheque: true,
              showBankName: true,
              showChequeStatus: true,
              showPaymentType: true,
            },
            ledger: {
              ...fieldsToUpdate.ledger,
              selectedIndex: -1,
            },
          };

          break;
        }

        case "BP": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("bank_account"),
              accLedgerType: LedgerType.BankAccount,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("paid_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: true,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: !clientSession.isAppGlobal,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: !clientSession.isAppGlobal,
            },
            bankName: {
              ...fieldsToUpdate.bankName,
              visible: !clientSession.isAppGlobal,
            },
            nameOnCheque: {
              ...fieldsToUpdate.nameOnCheque,
              visible: !clientSession.isAppGlobal,
            },
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showChqNo: !clientSession.isAppGlobal,
              showChqDate: !clientSession.isAppGlobal,
              showNameOnCheque: !clientSession.isAppGlobal,
              showBankName: !clientSession.isAppGlobal,
            },
          };
          break;
        }
        case "CQP": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("bank_account"),
              accLedgerType: LedgerType.BankAccount,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("paid_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: true,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: true,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: true,
            },
            bankName: {
              ...fieldsToUpdate.bankName,
              visible: true,
            },
            nameOnCheque: {
              ...fieldsToUpdate.nameOnCheque,
              visible: true,
            },
            paymentType: {
              ...fieldsToUpdate.paymentType,
              visible: true,
            },
            bankCharge: {
              ...fieldsToUpdate.bankCharge,
              visible: true,
            },
            chequeStatus: {
              ...fieldsToUpdate.chequeStatus,
              visible: true,
            },
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showChqNo: true,
              showChqDate: true,
              showNameOnCheque: true,
              showBankName: true,
              showChequeStatus: true,
              showPaymentType: true,
            },
            ledger: {
              ...fieldsToUpdate.ledger,
            },
          };
          break;
        }

        case "CN":
        case "DN": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("party_account"),
              accLedgerType: LedgerType.CustomerAndSupplier,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: voucherType === "CN" ? t("collected_by") : t("paid_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: true,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: true,
            },
          };
          break;
        }

        case "JV":
        case "JVSP": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("master_account"),
              accLedgerType: LedgerType.All,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("done_by"),
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            drCr: {
              ...fieldsToUpdate.drCr,
              visible: false,
            },
            jvDrCr: {
              ...fieldsToUpdate.jvDrCr,
              visible: true,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: false,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: true,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: true,
            },
          };
          break;
        }

        case "MJV": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("master_account"),
              visible: false,
              accLedgerType: LedgerType.All,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("employee"),
            },
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showDrCr: false,
              showDebitColumn: true,
              showCreditColumn: true,
              showAmountColumn: false,
              debitIndex: fieldsToUpdate.gridColumns?.amountIndex,
              creditIndex: fieldsToUpdate.gridColumns?.amountIndex + 1,
            },
            drCr: {
              ...fieldsToUpdate.drCr,
              visible: true,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: false,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: true,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: true,
            },
          };
          break;
        }

        case "OB": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("master_account"),
              visible: false,
              accLedgerType: LedgerType.All,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("employee"),
              left: fieldsToUpdate.masterAccount.left,
            },
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showDrCr: true,
            },
            drCr: {
              ...fieldsToUpdate.drCr,
              visible: true,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: true,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: true,
            },
            bankName: {
              ...fieldsToUpdate.bankName,
              visible: false,
            },
            nameOnCheque: {
              ...fieldsToUpdate.nameOnCheque,
              visible: false,
            },
          };
          break;
        }
        case "TXP": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("cash_bank_account"),
              visible: true,
              accLedgerType: LedgerType.Cash_Bank_Suppliers_Customers,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: t("paid_by"),
              disabled:
                isNullOrUndefinedOrZero(userSession.employeeId) == true
                  ? false
                  : true,
            },
            narration: {
              ...fieldsToUpdate.narration,
            },
            discount: {
              ...fieldsToUpdate.discount,
              visible: true,
            },
            costCentreID: {
              ...fieldsToUpdate.costCentreID,
              visible: true,
              // applicationSettings?.accountsSettings?.maintainCostCenter ===
              // true,
            },
            bankName: {
              ...fieldsToUpdate.bankDate,
              visible: false,
            },
            remarks: {
              ...fieldsToUpdate.remarks,
              visible: false,
            },
            nameOnCheque: {
              ...fieldsToUpdate.bankDate,
              visible: false,
            },
            chequeNumber: {
              ...fieldsToUpdate.chequeNumber,
              visible: false,
            },
            bankDate: {
              ...fieldsToUpdate.bankDate,
              visible: false,
            },
          };
          break;
        }
      }
      let fnlFormElmns = { ...fieldsToUpdate };
      if (
        (_formState.transaction.master.voucherType == "BP" ||
          _formState.transaction.master.voucherType == "BR") &&
        userSession.countryId == Countries.India
      ) {
        // fnlFormElmns =
        // {
        //   ...fieldsToUpdate,
        //   bankName: {
        //     ...fieldsToUpdate.bankDate,
        //     visible: false,
        //   },
        //   nameOnCheque: {
        //     ...fieldsToUpdate.bankDate,
        //     visible: false,
        //   },
        //   chequeNumber: {
        //     ...fieldsToUpdate.chequeNumber,
        //     visible: false,
        //   },
        //   bankDate: {
        //     ...fieldsToUpdate.bankDate,
        //     visible: false,
        //   },
        // }
      }

      _formState.formElements = fnlFormElmns;

      if (_formState.isTaxOnExpense) {
        focusRefNo();
      } else {
        focusLedgerCode();
      }
      if (!isInvoker) {
        _formState.row.ledgerCode = "";
      }

      _formState.templates = templates;
      _formState.templatesData = templatesData;
      const _template = templatesData?.find(
        (x) => x.templateGroup == _formState.transaction.master.voucherType
      );
      if (_template != undefined) {
        _formState.template = _template;
      } else {
        _formState.template = null;
      }
      setAccTransVoucher(_formState, true);
      // Fetch templates asynchronously
    };

    initializeFormElements();
    if (voucherNo != undefined && voucherNo > 0) {
      dispatch(setUserRight({ userSession: userSession, hasRight: hasRight }));
    }
  }, [voucherType, voucherPrefix]);

  // useEffect(() => {
  //   if (!voucherType) return;
  //   const updateFormElementsBasedOnVoucherType = () => {

  //     // Dispatch the update action with all the required fields
  //     dispatch(updateFormElement({ fields: fieldsToUpdate }));
  //     focusLedgerCode();
  //   };
  //   updateFormElementsBasedOnVoucherType();
  // }, [voucherType]);
  // const fetchVoucherNumber = useCallback(async () => {
  //   const nextVoucherNumber = await getNextVoucherNumber(
  //     formType ?? "",
  //     voucherType ?? "",
  //     voucherPrefix ?? "",
  //     false
  //   );

  // //   dispatch(
  // //     accFormStateTransactionMasterHandleFieldChange({
  // //       fields: {
  // //         voucherNumber: nextVoucherNumber,
  // //       },
  // //     })
  // //   );
  // // }, [formType, voucherType, voucherPrefix]);

  const selectTemplates = useCallback(async () => {
    setTemplateLoad(true);
    setIsTemplateOpen(true);
    try {
      const response = await api.getAsync(
        `${Urls.templates}?template_group=${voucherType}`
      );
      dispatch(
        accFormStateHandleFieldChange({ fields: { templates: response } })
      );
    } catch (error) {
    } finally {
      setTemplateLoad(false);
    }
  }, []);
  const selectAttachment = useCallback(async () => {
    setIsAttachmentOpen(true);
  }, []);
  const { round } = useNumberFormat();
  const handleCustomSummary = (options: any) => {
    if (options.summaryProcess === "start") {
      options.totalValue = 0; // Initialize the total value
    }

    if (options.summaryProcess === "calculate") {
      options.totalValue += options.value || 0; // Aggregate values, fallback to 0 if undefined
    }

    if (options.summaryProcess === "finalize") {
      options.totalValue = round(options.totalValue); // Apply custom rounding at the end
    }
  };

  const renderCell = (
    cellData: any,
    validation: string,
    enableFormat: boolean = false
  ) => {
    return (
      <div
        className={validation ? "grid-error-cell" : ""}
        title={validation ? validation : ""} // Add validation message as tooltip
      >
        {enableFormat ? getFormattedValue(cellData.value) : cellData.value}
      </div>
    );
  };
  const [key, setKey] = useState<string>("key");
  const columnsMobile: DevGridColumn[] = useMemo(() => {
    const cols = [
      {
        dataField: "slNo",
        caption: t("si_no"),

        cellRender: (cellData: any) => {
          // Declare the constant 'items' using cellData.data
          const items = cellData.data as AccTransactionRow;

          return (
            <div
              key={items.slNo}
              className="bg-[#f3f3f3] shadow-md mb-3 p-1 rounded-sm"
            >
              <div className="flex justify-between items-center mb-0 mt-1 h-[10px]">
                {/* <span className="text-gray-500 text-sm">#{items.id}</span> */}
                <h6 className="mb-1 font-bold text-[16px]">
                  {items.ledgerName}
                </h6>
                <span className="font-bold text-sm">₹ {items.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-1"></div>
              <p className="mb-1 text-yellow info">
                {t("discount")}: {items.discount}
              </p>
              {/* <p className="text-gray-600 text-sm">Tax: {items.tax}%</p> */}
            </div>
          );
        },
      },
    ];
    return cols;
  }, [formState.formElements.gridColumns]);

  const columns: DevGridColumn[] = useMemo(() => {
    const cols = [
      {
        visible: !deviceInfo.isMobile,
        dataField: "slNo",
        caption: t("si_no"),
        width: 60,
        cellRender: (cellData: any) => (
          <div
            className={
              cellData.data?.isValid != undefined &&
              cellData.data?.isValid != true
                ? "grid-error-cell"
                : ""
            }
            title={
              cellData.data?.isValid != undefined &&
              (cellData.data?.isValid != true) != true
                ? t("validation_failed")
                : ""
            } // Add validation message as tooltip
          >
            {cellData.value}
          </div>
        ),
      },
      {
        dataField: "ledgerID",
        visible: !deviceInfo.isMobile,
        caption: t("ledger_ID"),
        width: 100,
        cellRender: (cellData: any) =>
          renderCell(cellData, cellData.data.ledgerID_Validation),
      },
      {
        dataField: "ledgerCode",
        visible: !deviceInfo.isMobile,
        caption: t("ledger_code"),
        width: 100,
      },
      {
        dataField: "ledgerName",
        caption: t("ledger"),
        width: deviceInfo.isMobile? 150 : undefined,
      },
      {
        dataField: "amount",
        dataType: "number" as "number",
        caption: t("amount"),
        width: deviceInfo.isMobile? 100 : 200,
        visible: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value)}`,
        cellRender: (cellData: any) =>
          renderCell(cellData, cellData.data.amount_Validation, true),
      },
      {
        dataField: "debit",
        caption: t("debit"),
        visible: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value)}`,
        cellRender: (cellData: any) =>
          renderCell(cellData, cellData.data.debit_Validation, true),
      },
      {
        dataField: "credit",
        caption: t("credit"),
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value)}`,
        visible: true,
        cellRender: (cellData: any) =>
          renderCell(cellData, cellData.data.credit_Validation, true),
      },
      {
        dataField: "drCr",
        caption: t("dr/cr"),
        visible: true,
        cellRender: (cellData: any) =>
          cellData.data.drCr == "Dr" ? "Debit" : "Credit",
        width: 100,
      },
      {
        dataField: "chequeNo",
        caption: t("cheque_no"),
        visible: false,
      },
      {
        dataField: "chequeDate",
        caption: t("cheque_date"),
        visible: false,
      },
      {
        dataField: "narration",
        caption: t("narration"),
        visible: false,
      },
      {
        dataField: "billwiseDetails",
        caption: t("billwise_details"),
        visible: false,
      },
      {
        dataField: "accTransaction",
        caption: t("acc_transaction"),
        visible: false,
      },
      {
        dataField: "discount",
        caption: t("discount"),
        dataType: "number" as "number",
        visible: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value)}`,
      },
      {
        dataField: "costCentreID",
        caption: t("cost_centre_id"),
        visible: false,
      },
      {
        dataField: "costCentreName",
        caption: t("cost_center"),
        visible: true,
      },
      {
        dataField: "chequeStatus",
        caption: t("check_status"),
        visible: false,
      },
      {
        dataField: "amountFC",
        caption: t("amount_FC"),
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value)}`,
        visible: false,
      },
      {
        dataField: "nameOnCheque",
        caption: t("name_on_cheque"),
        visible: false,
      },
      {
        dataField: "bankName",
        caption: t("bank_name"),
        visible: false,
      },
      {
        dataField: "chequeStatus",
        caption: t("cheque_status"),
        visible: false,
      },
      {
        dataField: "bankCharge",
        caption: t("bank_charge"),
        visible: false,
      },
      {
        dataField: "projectId",
        caption: t("project_ID"),
        visible: false,
      },
      {
        dataField: "projects",
        caption: t("projects"),
        visible: false,
      },
      {
        dataField: "action",
        caption: t("action"),
        visible: true,
        cellRenderDynamicRootState: (
          cellElement: any,
          cellInfo: any,
          state: RootState
        ) =>
          state.AccTransaction.formElements.pnlMasters?.disabled ==
          true ? null : (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemoveItem(cellElement.rowIndex);
              }}
              disabled={
                (formState.isRowEdit &&
                  cellElement.data.accTransactionDetailID ==
                    formState.row.accTransactionDetailID) ||
                formState.formElements.pnlMasters?.disabled
              }
              className="ti-btn-link"
              type="button"
            >
              <i
                className="ri-delete-bin-5-line delete-icon"
                title={t("remove")}
              ></i>
            </button>
          ),
      },
    ].filter((column) => {
      const { gridColumns } = formState.formElements;
      if (
        column.dataField === "amount" &&
        gridColumns?.showAmountColumn === false
      )
        return false;
      if (column.dataField === "drCr" && gridColumns?.showDrCr !== true)
        return false;
      if (column.dataField === "chequeNo" && gridColumns?.showChqNo !== true)
        return false;
      if (
        column.dataField === "chequeDate" &&
        gridColumns?.showChqDate !== true
      )
        return false;
      if (column.dataField === "bankName" && gridColumns?.showBankName !== true)
        return false;
      if (
        column.dataField === "nameOnCheque" &&
        gridColumns?.showNameOnCheque !== true
      )
        return false;
      if (
        column.dataField === "chequeStatus" &&
        gridColumns?.showChequeStatus !== true
      )
        return false;
      if (
        column.dataField === "paymentType" &&
        gridColumns?.showPaymentType !== true
      )
        return false;
      if (column.dataField === "debit" && gridColumns?.showDebitColumn !== true)
        return false;
      if (
        column.dataField === "credit" &&
        gridColumns?.showCreditColumn !== true
      )
        return false;
      return true;
    });
    console.log(cols);
    setKey(modelToBase64Unicode(cols));
    return cols;
  }, [formState.formElements.gridColumns]);

  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0"; // Ensure "0" is displayed when value is missing
      }
      return getFormattedValue(value) || "0"; // Ensure formatted output or fallback to "0"
    };
  }, []);

  const summaryItems: SummaryConfig[] = [
    // {
    //   column: "amount",
    //   summaryType: "sum",
    //   valueFormat: "currency",
    //   customizeText: customizeSummaryRow,
    // },
    // {
    //   column: "amountFC",
    //   summaryType: "sum",
    //   valueFormat: "currency",
    //   customizeText: customizeSummaryRow,
    // },
    // {
    //   column: "debit",
    //   summaryType: "sum",
    //   valueFormat: "currency",
    //   customizeText: customizeSummaryRow,
    // },
    // {
    //   column: "credit",
    //   summaryType: "sum",
    //   valueFormat: "currency",
    //   customizeText: customizeSummaryRow,
    // },
    {
      column: "discount",
      summaryType: "sum",
      customizeText: customizeSummaryRow,
    },
  ];
  const [activeButton, setActiveButton] = useState("credit");
  const [items, setItems] = useState<BilledItem[]>([
    { id: 1, name: "Apple", price: 100, quantity: 2, discount: 0, tax: 0 },
    { id: 2, name: "Banana", price: 50, quantity: 3, discount: 0, tax: 0 },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [templateLoad, setTemplateLoad] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any>(null);
  const [isPartySelectionModalOpen, setIsPartySelectionModalOpen] =
    useState(false);

  const handleHistoryClick = async () => {
    try {
      // const response = await api.getAsync(
      //   `${Urls.acc_transaction_base}${transactionType}/List/`
      // );
      // if (response.data && response.data.length > 0) {
      //   setHistoryData(response.data[0]);
      setIsHistorySidebarOpen(true);
      // }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  // const [invoiceNo, setInvoiceNo] = useState<number>(3); // Default Invoice No.
  // const [date, setDate] = useState<string>("2024-09-23"); // Default Date

  const addItem = () => {
    const newItem: BilledItem = {
      id: items.length + 1,
      name: "New Item",
      price: 0,
      quantity: 1,
      discount: 0,
      tax: 0,
    };
    setItems([...items, newItem]);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    quantity: "",
    unit: "",
    rate: "",
    taxOption: "Without Tax",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleFieldChange = (keys: any, value: any) => {
  //   setFormData((prevSettings = {} as FormData) => ({
  //     ...prevSettings,
  //     [keys]: value ?? "",
  //   }));
  // };
  const handleFieldChange = (settingName: any, value: any) => {
    setSettings((prevSettings = {} as ApplicationMainSettings) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };

  // const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (popupRef && !popupRef.contains(event.target as Node)) {
  //       setShowPopup(false);
  //       setIsHovered(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [popupRef]);

  const [showTotalsPopup, setShowTotalsPopup] = useState(false); // State for showing totals popup

  // const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    // Here you would typically send the data to a server or perform other actions
  };

  const [isPageVisible, setIsPageVisible] = useState(true);

  const closePage = () => {
    setIsPageVisible(false);
  };

  if (!isPageVisible) {
    return null; // Don't render anything if the page is hidden
  }

  const [showInputBox, setShowInputBox] = useState(false);

  const [settings, setSettings] = useState<ApplicationMainSettings>(
    ApplicationMainSettingsInitialState
  );
  const { bankAccountField, handleBankNameChange, handleLedgerChange } =
    useFormComponent();

  const handleChange = (selectedOption: { value: string; label: string }) => {};

  const goToPreviousPage = () => {
    window.history.back();
  };
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
  //       setIsPopupVisible(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };
  const isChequeSectionVisible =
    formState.formElements.nameOnCheque.visible ||
    formState.formElements.bankName.visible ||
    formState.formElements.chequeNumber.visible ||
    formState.formElements.bankDate.visible;

  return (
    <div className="relative">
      {/* <h1>SAFVAN{transactionType}</h1> */}
      {!deviceInfo?.isMobile && (
        <div
          className={`dark:!bg-dark-bg p-4`}
          style={{
            backgroundColor: formState.userConfig?.outerPageBg
              ? `rgb(${formState.userConfig?.outerPageBg})`
              : `transparent`,
          }}
        >
          <div className="flex justify-between items-center mb-0">
            <div className="flex items-center gap-2">
              {/* <AccTransactionUserConfig /> */}
            </div>
            {/* <h2 className="text-4xl font-bold text-center text-blue">
              {formState.title}
            </h2> */}
            <div className="w-[100px]"></div>
          </div>

          <div className="py-0">
            <div
              className="w-full max-w-full mx-0"
              style={{
                position: "fixed",
                top: "60px",
                left: 0,
                right: 0,
                padding: 0,
                zIndex: 10,
              }}
            >
              {formState.isEdit}
              <div className="flex items-center p-0 border dark:border-dark-border border-gray-300 rounded-b-sm mb-2 dark:bg-dark-bg bg-[#f4f4f5] me-[1px]">
                <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
                  <h6 className="text-lg font-bold mb-0 whitespace-nowrap overflow-hidden text-ellipsis ml-0 transition-all duration-300 [@media(min-width:1000px)]:ml-[231px]">
                    {t(formState.title)}
                    {/* - {t(formState.row.ledgerCode)}-  {t(formState.transaction.master.voucherType)}- {t(formState.formElements.masterAccount.visible.toString())} */}
                  </h6>
                  <i className="fas fa-cog ms-1"></i>
                </div>
                <AccHeader
                  formState={formState}
                  dispatch={dispatch}
                  handleKeyDown={handleKeyDown} // Replace with your actual keydown handler
                  t={t} // Replace with your translation function
                  loadTemporaryRows={loadTemporaryRows}
                  deleteAccTransVoucher={deleteAccTransVoucher}
                  handleRefresh={handleRefresh}
                  createNewVoucher={createNewVoucher}
                  handleEdit={handleEdit}
                  printVoucher={printVoucher}
                  handleClearControls={handleClearControls}
                  handleHistoryClick={handleHistoryClick}
                  setIsHistorySidebarOpen={setIsHistorySidebarOpen}
                  transactionType={formState.transactionType} // Replace with your actual transaction type
                  voucherType={formState.transaction.master.voucherType} // Replace with your actual voucher type
                  userSession={userSession} // Replace with your actual user session object
                  unlockVoucher={unlockVoucher}
                  setShowValidation={setShowValidation}
                  showValidation={showValidation}
                  selectTemplates={selectTemplates}
                  goToPreviousPage={goToPreviousPage}
                  isHistorySidebarOpen={isHistorySidebarOpen}
                  setIsPrintModalOpen={setIsPrintModalOpen}
                  printPaymentReceiptAdvice={printPaymentReceiptAdvice}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              maxWidth: formState.userConfig?.maxWidth
                ? `${formState.userConfig?.maxWidth}px`
                : "100%",
              marginLeft:
                formState.userConfig?.alignment === "left" ? "0" : "auto",
              marginRight:
                formState.userConfig?.alignment === "right" ? "0" : "auto",
              textAlign: formState.userConfig?.alignment,
              border:
                formState.userConfig?.maxWidth &&
                formState.userConfig?.maxWidth !== "100%"
                  ? "1px solid #ccc"
                  : "none",
              padding: formState.userConfig?.maxWidth ? "10px" : "0",
              borderRadius:
                formState.userConfig?.maxWidth &&
                formState.userConfig?.maxWidth !== "100%"
                  ? "10px"
                  : "none",
              borderBottomLeftRadius:
                formState.userConfig?.maxWidth ===
                formState.userConfig?.gridMaxWidth
                  ? "0"
                  : "10px",
              borderBottomRightRadius:
                formState.userConfig?.maxWidth ===
                formState.userConfig?.gridMaxWidth
                  ? "0"
                  : "10px",
              borderBottom:
                formState.userConfig?.maxWidth ===
                formState.userConfig?.gridMaxWidth
                  ? "none"
                  : "1px solid #ccc",
              marginTop: "2.5rem",
            }}
          >
            <div
              className={
                formState.userConfig?.isExpanded
                  ? "grid grid-rows-2 !mt-[35px]"
                  : "grid grid-cols-2 gap-8 !mt-[35px]"
              }
            >
              {formState.userConfig?.isExpanded ? (
                <>
                  {/* Expanded View - First Row */}
                  <div className="flex flex-wrap items-center gap-1">
                    <AccVoucherPrefix
                      ref={voucherNumberRef}
                      formState={formState}
                      dispatch={dispatch}
                      handleKeyDown={handleKeyDown}
                      loadAndSetAccTransVoucher={loadAndSetAccTransVoucher}
                      t={t}
                    />
                    <AccVoucherNo
                      ref={voucherNumberRef}
                      formState={formState}
                      dispatch={dispatch}
                      handleKeyDown={handleKeyDown}
                      loadAndSetAccTransVoucher={loadAndSetAccTransVoucher}
                      t={t}
                    />
                    <AccMasterAccount
                      ref={masterAccountRef}
                      formState={formState}
                      dispatch={dispatch}
                      getFormattedValue={getFormattedValue}
                      t={t}
                    />
                    <AccReferenceNumber
                      formState={formState}
                      dispatch={dispatch}
                      handleLoadByRefNo={handleLoadByRefNo}
                      ref={refNoRef}
                      t={t}
                    />
                    <AccReferenceDate
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                    />
                    <AccTransactionDate
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <AccEmployeeID
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                      handleKeyDown={handleKeyDown}
                    />
                    <AccRemarks
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                    />
                    <AccNotes
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <AccDrCrJv
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <AccCurrencyID
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <AccCurrencyRate
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <AccEdit
                      formState={formState}
                      enableCombo={enableCombo}
                      t={t}
                      dispatch={dispatch}
                    />
                  </div>
                  <>
                    <div
                      className={
                        formState.userConfig?.isExpanded
                          ? "flex flex-wrap gap-1 leading-none"
                          : "flex flex-wrap items-center gap-4 leading-none"
                      }
                    >
                      <LedgerCode
                        ref={ledgerCodeRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <Ledger
                        ref={ledgerIdRef}
                        handleFieldKeyDown={handleFieldKeyDown}
                        triggerEffect={triggerEffect}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <Amount
                        ref={amountRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <Drcr
                        ref={drCrRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <Discount
                        ref={discountRef}
                        handleKeyDown={handleKeyDown}
                        focusDiscount={focusDiscount}
                        focusAmount={focusAmount}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <Narration
                        ref={narrationRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <CostCentre
                        ref={costCenterRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                        handleFieldKeyDown={handleFieldKeyDown}
                      />
                      <AccProject
                        dispatch={dispatch}
                        formState={formState}
                        t={t}
                      />
                      <NameOnCheque
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <BankName
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <ChequeNumber
                        ref={chequeNumberRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <BankDate
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <ChequeStatus
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <BankCharge
                        formState={formState}
                        dispatch={dispatch}
                        handleKeyDown={handleKeyDown}
                        t={t}
                      />
                      <AccTaxDetails
                        formState={formState}
                        dispatch={dispatch}
                        handleKeyDown={handleKeyDown}
                        t={t}
                        partyNameRef={partyNameRef}
                        taxNoRef={taxNoRef}
                        taxableAmountRef={taxableAmountRef}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-[-1.5rem]">
                      <div className="flex gap-4">
                        <span className="text-[#2563eb] font-bold self-center">
                          {t("group_name")}:{" "}
                          {formState.ledgerData?.accGroupName}
                        </span>
                      </div>
                      <div
                        className="text-[#dc2626] self-center"
                        style={{ fontSize: "12px", color: "chocolate" }}
                      >
                        {t("amount_in_words")}: {formState.amountInWords}
                      </div>

                      <div className="flex gap-4">
                        {formState.transaction?.master?.isLocked !==
                          undefined &&
                          formState.transaction?.master?.isLocked === true &&
                          formState.isTaxOnExpense !== true &&
                          (userSession.userTypeCode === "CA" ||
                            userSession.userTypeCode === "BA") && (
                            <span>{t("unlock")}</span>
                          )}
                        <div className="flex items-center gap-2 mt-4">
                          {applicationSettings.accountsSettings
                            ?.maintainBillwiseAccount === true &&
                            !billWiseExcludedTransactions.includes(
                              formState.transaction.master.voucherType
                            ) && (
                              <ERPButton
                                localInputBox={
                                  formState?.userConfig?.inputBoxStyle
                                }
                                title={t(
                                  formState.formElements.btnBillWise.label
                                )}
                                variant="secondary"
                                onClick={showBillwise}
                                disabled={
                                  formState.ledgerBillWiseLoading ||
                                  formState.formElements.btnBillWise
                                    .disabled === true ||
                                  formState.formElements.pnlMasters?.disabled
                                }
                              />
                            )}
                        </div>
                        <div className="flex items-end text-end">
                          <BtnAdd
                            ref={btnAddRef}
                            formState={formState}
                            dispatch={dispatch}
                            handleKeyDown={handleKeyDown}
                            rowProcessing={formState.rowProcessing}
                            addOrEditRow={addOrEditRow}
                            t={t}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                </>
              ) : (
                <>
                  {/* Compact View */}
                  <div className="">
                    <div className="grid grid-cols-1 leading-none lg:w-3/4">
                      <div className="flex items-center gap-2">
                        <AccVoucherPrefix
                          ref={voucherNumberRef} // ✅ Pass ref to the child
                          formState={formState}
                          dispatch={dispatch}
                          handleKeyDown={handleKeyDown}
                          loadAndSetAccTransVoucher={loadAndSetAccTransVoucher}
                          t={t}
                        />
                        <AccVoucherNo
                          ref={voucherNumberRef} // ✅ Pass ref to the child
                          formState={formState}
                          dispatch={dispatch}
                          handleKeyDown={handleKeyDown}
                          loadAndSetAccTransVoucher={loadAndSetAccTransVoucher}
                          t={t}
                        />
                      </div>
                      <div className="flex items-center">
                        <AccMasterAccount
                          ref={masterAccountRef}
                          formState={formState}
                          dispatch={dispatch}
                          getFormattedValue={getFormattedValue}
                          t={t}
                        />
                        <div className="flex flex-wrap gap-4">
                          <AccDrCrJv
                            formState={formState}
                            dispatch={dispatch}
                            t={t}
                          />
                        </div>
                      </div>
                      <div>
                        <AccNotes
                          handleKeyDown={handleKeyDown}
                          formState={formState}
                          dispatch={dispatch}
                          t={t}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <>
                          <AccCurrencyID
                            formState={formState}
                            dispatch={dispatch}
                            t={t}
                          />
                          <AccCurrencyRate
                            formState={formState}
                            dispatch={dispatch}
                            t={t}
                          />
                        </>
                        <AccEdit
                          formState={formState}
                          enableCombo={enableCombo}
                          t={t}
                          dispatch={dispatch}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="grid grid-cols-1 leading-none lg:full">
                      <div className="grid grid-cols-2 gap-2">
                        <AccReferenceNumber
                          formState={formState}
                          dispatch={dispatch}
                          handleLoadByRefNo={handleLoadByRefNo}
                          ref={refNoRef}
                          t={t}
                        />
                        <AccTransactionDate
                          formState={formState}
                          dispatch={dispatch}
                          t={t}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <AccReferenceDate
                          dispatch={dispatch}
                          formState={formState}
                          t={t}
                        />
                        <AccEmployeeID
                          dispatch={dispatch}
                          formState={formState}
                          t={t}
                          handleKeyDown={handleKeyDown}
                        />
                      </div>
                      <div className="grid grid-cols-1">
                        <AccRemarks
                          dispatch={dispatch}
                          formState={formState}
                          t={t}
                        />
                        <AccProject
                          dispatch={dispatch}
                          formState={formState}
                          t={t}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {formState.userConfig?.isExpanded ? (
              <></>
            ) : (
              <>
                {/* Compact view – Original multi-row layout */}
                <div className="leading-none">
                  <div className="flex items-center gap-2">
                    <LedgerCode
                      ref={ledgerCodeRef}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    {formState?.row.ledgerID?.toString()}
                    <Ledger
                      ref={ledgerIdRef}
                      handleFieldKeyDown={handleFieldKeyDown}
                      triggerEffect={triggerEffect}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <Amount
                      ref={amountRef}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <Drcr
                      ref={drCrRef}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <Discount
                      ref={discountRef}
                      handleKeyDown={handleKeyDown}
                      focusDiscount={focusDiscount}
                      focusAmount={focusAmount}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="flex flex-wrap gap-4">
                      <span className="text-[#2563eb] font-bold self-center">
                        {t("group_name")}: {formState.ledgerData?.accGroupName}
                      </span>
                    </div>
                    <div
                      className="text-[#dc2626]"
                      style={{ fontSize: "12px", color: "chocolate" }}
                    >
                      {t("amount_in_words")}: {formState.amountInWords}
                    </div>
                  </div>
                </div>

                <div className="leading-none">
                  <div className="flex items-center gap-2">
                    <Narration
                      ref={narrationRef}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <CostCentre
                      ref={costCenterRef}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                      handleFieldKeyDown={handleFieldKeyDown}
                    />
                    {formState.transaction?.master?.isLocked !== undefined &&
                      formState.transaction?.master?.isLocked === true &&
                      formState.isTaxOnExpense !== true &&
                      (userSession.userTypeCode === "CA" ||
                        userSession.userTypeCode === "BA") && (
                        <span>{t("unlock")}</span>
                      )}
                    <div className="flex items-center gap-2 mt-4">
                      {applicationSettings.accountsSettings
                        ?.maintainBillwiseAccount === true &&
                        !billWiseExcludedTransactions.includes(
                          formState.transaction.master.voucherType
                        ) && (
                          <ERPButton
                            localInputBox={formState?.userConfig?.inputBoxStyle}
                            title={t(formState.formElements.btnBillWise.label)}
                            variant="secondary"
                            onClick={showBillwise}
                            disabled={
                              formState.ledgerBillWiseLoading ||
                              formState.formElements.btnBillWise.disabled ===
                                true ||
                              formState.formElements.pnlMasters?.disabled
                            }
                          />
                        )}
                    </div>
                  </div>
                </div>

                <div className="leading-none">
                  <div className="flex justify-between">
                    <div className="flex flex-wrap gap-4">
                      <NameOnCheque
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <BankName
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <ChequeNumber
                        ref={chequeNumberRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <BankDate
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <ChequeStatus
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                      <BankCharge
                        formState={formState}
                        dispatch={dispatch}
                        handleKeyDown={handleKeyDown}
                        t={t}
                      />
                      <AccTaxDetails
                        formState={formState}
                        dispatch={dispatch}
                        handleKeyDown={handleKeyDown}
                        t={t}
                        partyNameRef={partyNameRef}
                        taxNoRef={taxNoRef}
                        taxableAmountRef={taxableAmountRef}
                      />
                    </div>
                    <div className="flex items-end text-end">
                      <BtnAdd
                        ref={btnAddRef}
                        formState={formState}
                        dispatch={dispatch}
                        handleKeyDown={handleKeyDown}
                        rowProcessing={formState.rowProcessing}
                        addOrEditRow={addOrEditRow}
                        t={t}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div
            className="relative"
            style={{
              maxWidth: formState.userConfig?.gridMaxWidth
                ? `${formState.userConfig?.gridMaxWidth}px`
                : "100%",
              marginLeft:
                formState.userConfig?.alignment === "left" ? "0" : "auto",
              marginRight:
                formState.userConfig?.alignment === "right" ? "0" : "auto",
              textAlign: formState.userConfig?.alignment,
              border:
                formState.userConfig?.gridMaxWidth &&
                formState.userConfig?.gridMaxWidth !== "100%"
                  ? "1px solid #ccc"
                  : "none",
              padding: formState.userConfig?.gridMaxWidth ? "10px" : "0",
              borderRadius:
                formState.userConfig?.gridMaxWidth &&
                formState.userConfig?.gridMaxWidth !== "100%"
                  ? "10px"
                  : "none",
              borderTopLeftRadius:
                formState.userConfig?.maxWidth ===
                formState.userConfig?.gridMaxWidth
                  ? "0"
                  : "10px",
              borderTopRightRadius:
                formState.userConfig?.maxWidth ===
                formState.userConfig?.gridMaxWidth
                  ? "0"
                  : "10px",
              borderTop:
                formState.userConfig?.maxWidth ===
                formState.userConfig?.gridMaxWidth
                  ? "none"
                  : "0",
            }}
          >
            {/* <div className="w-full h-full absolute bg-transparent z-9"></div> */}
            <ErpDevGrid
              key={key}
              GridPreferenceChooserAccTrance
              heightToAdjustOnWindows={
                formState.userConfig?.gridHeight ??
                (isChequeSectionVisible ? 650 : 600)
              }
              summaryItems={summaryItems}
              ref={erpGridRef}
              keyExpr="slNo"
              columns={columns}
              height={gridHeight}
              allowFiltering={false}
              dataUrl={Urls.acc_reports_ledger}
              hideGridAddButton={true}
              hideDefaultExportButton={true}
              hideDefaultSearchPanel={true}
              allowSearching={false}
              allowExport={false}
              hideGridHeader={true}
              enablefilter={false}
              remoteOperations={false}
              data={formState.transaction.details}
              gridId={`${gridCode}-grid`}
              onClickByRootState={(e: any, state: RootState) => {
                onSelectionChanged(e, state, true);
              }}
              showTotalCount={false}
              onKeyDown={(e) => handleKeyDown("grid", e)}
              onSelectionChangedByRootState={(e: any, state: RootState) =>
                onSelectionChanged(e, state, false)
              }
              enableScrollButton={false}
              ShowGridPreferenceChooser={false}
              showPrintButton={false}
              className="pb-14"
            ></ErpDevGrid>
          </div>
          {formState.showSaveDialog && (
            <ERPAlert
              showAnimation="animate__fadeIn"
              hideAnimation="animate__fadeOut"
              title={t("in_progress")}
              icon="warning"
              position="center"
              confirmButtonText={t("ok")}
              cancelButtonText={t("cancel")}
              onConfirm={() => {
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: { showSaveDialog: false },
                  })
                );
              }}
              onCancel={() =>
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: { showSaveDialog: false },
                  })
                )
              }
            />
          )}
        </div>
      )}
      {deviceInfo?.isMobile && (
        <div className="top-0 left-0 z-50 fixed flex flex-col bg-gray-100 w-screen h-screen max-h-full font-sans overflow-scroll">
          {/* Sale Header */}
          <div className="flex items-center bg-white shadow-sm p-3 border-b-2 fixed top-0 left-0 w-full z-50">
            <ERPPreviousUrlButton></ERPPreviousUrlButton>
            <h1 className="flex-grow font-semibold text-[18px] text-zinc-800">
              {t("cash_payment")}
            </h1>
            {/* <i className="ri-settings-3-line" style={{ fontSize: "23px" }}></i> */}
          </div>
          <AccHeader
            formState={formState}
            dispatch={dispatch}
            handleKeyDown={handleKeyDown} // Replace with your actual keydown handler
            t={t} // Replace with your translation function
            loadTemporaryRows={loadTemporaryRows}
            deleteAccTransVoucher={deleteAccTransVoucher}
            handleRefresh={handleRefresh}
            createNewVoucher={createNewVoucher}
            handleEdit={handleEdit}
            printVoucher={printVoucher}
            handleClearControls={handleClearControls}
            handleHistoryClick={handleHistoryClick}
            setIsHistorySidebarOpen={setIsHistorySidebarOpen}
            transactionType={formState.transactionType} // Replace with your actual transaction type
            voucherType={formState.transaction.master.voucherType} // Replace with your actual voucher type
            userSession={userSession} // Replace with your actual user session object
            unlockVoucher={unlockVoucher}
            setShowValidation={setShowValidation}
            showValidation={showValidation}
            selectTemplates={selectTemplates}
            goToPreviousPage={goToPreviousPage}
            isHistorySidebarOpen={isHistorySidebarOpen}
            setIsPrintModalOpen={setIsPrintModalOpen}
            printPaymentReceiptAdvice={printPaymentReceiptAdvice}
            phone={true}
          />
          {/* Scrollable Content */}
          <div className="flex flex-col mt-[0px] w-full overflow-scroll"></div>
          <div className="flex items-center justify-between gap-1 bg-white mb-0 px-4 rounded-none shadow-md text-gray-600">
            <div className="flex items-center justify-center gap-1">
              <AccVoucherPrefix
                ref={voucherNumberRef}
                formState={formState}
                dispatch={dispatch}
                handleKeyDown={handleKeyDown}
                loadAndSetAccTransVoucher={loadAndSetAccTransVoucher}
                t={t}
              />
            <AccVoucherNo
                ref={voucherNumberRef}
                formState={formState}
                dispatch={dispatch}
                handleKeyDown={handleKeyDown}
                loadAndSetAccTransVoucher={loadAndSetAccTransVoucher}
                t={t}
                phone={true}
              />
            </div>

            {/* Centered divider */}
            {/* <div className="border-gray-300 border-l h-12"></div> */}

            <div>
              <AccTransactionDate
                formState={formState}
                dispatch={dispatch}
                t={t}
              />
            </div>
          </div>

          <div className="pt-1 pb-[54px]">
            <div className="bg-white mb-0 p-4 rounded-lg text-zinc-800 ">
              {/* <div className="mb-4">
          <label
            htmlFor="cashacc"
            className="block font-medium text-gray-700 text-sm"
          >
            Cash Account
          </label>
          <select
            id="cashacc"
            name="cashacc"
            value={formData.cashacc}
            onChange={handleInputChange}
            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
          >
            <option value="">Select Cash Account</option>
            <option value="cash">cash</option>
            <option value="bank">bank</option>
            <option value="upi">upi</option>
          </select>
        </div> */}
              <div className="mb-1">
                <AccMasterAccount
                  ref={masterAccountRef}
                  formState={formState}
                  dispatch={dispatch}
                  getFormattedValue={getFormattedValue}
                  t={t}
                />
              </div>

              <div className="mb-1">
                <AccRemarks
                  ref={remarksRef}
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                />
              </div>

              <div className="mb-1"></div>

              <div className="flex justify-center mb-2">
                <button
                  className="w-full border border-gray-300 px-4 py-2  text-gray-600 focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200  focus:border-b-0 "
                  onClick={() => setShowInputBox(!showInputBox)}
                >
                  {showInputBox ? t("view_less") : t("view_more")}
                </button>
              </div>
              {showInputBox && (
                // <div className="flex justify-center">
                <div>
                  {/* <div className="mb-1">
              <input
                type="text"
                placeholder="Ref No"
                // className="bg-white p-2 border rounded w-full"
                className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
              />
            </div> */}
                  <div className="mb-1">
                    <AccReferenceNumber
                      formState={formState}
                      dispatch={dispatch}
                      handleLoadByRefNo={handleLoadByRefNo}
                      ref={refNoRef}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <AccReferenceDate
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                    />
                  </div>
                  {/* <div className="mb-4">
              <label
                htmlFor="cashacc"
                className="block font-medium text-gray-700 text-sm"
              >
                Paid By
              </label>
              <select
                id="cashacc"
                name="cashacc"
                value={formData.cashacc}
                onChange={handleInputChange}
                className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
              >
                <option value="">Select Paid By</option>
                <option value="ajmal">ajmal</option>
                <option value="vajid">vajid</option>
                <option value="nizam">nizam</option>
                <option value="safvan">safvan</option>
                <option value="sreeram">sreeram</option>
                <option value="javad">javad</option>
              </select>
            </div> */}
                  <div className="mb-1">
                    <AccEmployeeID
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                      handleKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className="mb-1">
                    <AccDrCrJv
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>

                  <div className="mb-1">
                    <AccCurrencyID
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <AccCurrencyRate
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <AccEdit
                      formState={formState}
                      enableCombo={enableCombo}
                      t={t}
                      dispatch={dispatch}
                    />
                  </div>

                  <div className="mb-1"></div>

                  <div className="mb-1">
                    <AccProject
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                    />
                  </div>
                  {/* <div className="mb-1">
              <input
                type="text"
                placeholder="Notes"
                // className="bg-white p-2 border rounded w-full"
                className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
              />
            </div> */}
                  <div className="mb-2">
                    <AccNotes
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>

                  <div className="mb-1">
                    <NameOnCheque
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <BankName
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <ChequeNumber
                      ref={chequeNumberRef}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <BankDate
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <ChequeStatus
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <BankCharge
                      formState={formState}
                      dispatch={dispatch}
                      handleKeyDown={handleKeyDown}
                      t={t}
                    />
                  </div>
                  <div className="mb-1">
                    <AccTaxDetails
                      formState={formState}
                      dispatch={dispatch}
                      handleKeyDown={handleKeyDown}
                      t={t}
                      partyNameRef={partyNameRef}
                      taxNoRef={taxNoRef}
                      taxableAmountRef={taxableAmountRef}
                    />
                  </div>
                </div>
              )}

              <button
                // onClick={addItem}
                onClick={() => setIsOpen(true)}
                className="flex justify-center items-center border-2 border-gray-400 bg-white mb-4 p-2 rounded w-full text-blue-500"
              >
                {/* <Plus className="mr-2 text-blue-500" size={16} /> Add Items{" "} */}
                <i
                  className="ri-add-circle-fill pr-2"
                  style={{ fontSize: "18px" }}
                ></i>
                <div
                  className="mr-2 text-amber-700"
                  // size={16}
                >
                  {" "}
                  {t("add_items")}{" "}
                </div>
                <div className="pl-1 text-gray-500">{t("optional")}</div>
              </button>

              {/* Billed Items Section */}
              <div className="bg-custom-blue mb-1 p-1 rounded-sm text-white">
                <h2 className="font-light text-sm">{t("billed_items")}</h2>
              </div>
              <div className="pt-1">
                <ErpDevGrid
                  key={key}
                  GridPreferenceChooserAccTrance={false}
                  heightToAdjustOnWindows={
                    formState.userConfig?.gridHeight ??
                    (isChequeSectionVisible ? 650 : 600)
                  }
                  summaryItems={summaryItems}
                  ref={erpGridRef}
                  keyExpr="slNo"
                  columns={columns}
                  // height={gridHeight}
                  height="10px"
                  allowFiltering={false}
                  dataUrl={Urls.acc_reports_ledger}
                  hideGridAddButton={true}
                  hideDefaultExportButton={true}
                  hideDefaultSearchPanel={true}
                  allowSearching={false}
                  allowExport={false}
                  hideGridHeader={true}
                  enablefilter={false}
                  remoteOperations={false}
                  data={formState.transaction.details}
                  gridId={`${gridCode}-grid-mob`}
                  onClickByRootState={(e: any, state: RootState) => {
                    onSelectionChanged(e, state, true);
                  }}
                  showTotalCount={false}
                  onKeyDown={(e) => handleKeyDown("grid", e)}
                  onSelectionChangedByRootState={(e: any, state: RootState) =>
                    onSelectionChanged(e, state, false)
                  }
                  enableScrollButton={false}
                  ShowGridPreferenceChooser={false}
                  showPrintButton={false}
                  className=" HistorySidebadrcustom "
                  showColumnHeaderscustom={false}
                ></ErpDevGrid>

                {/* Total Summary */}
                <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                  <div className="flex justify-between mb-2 text-gray-600 text-sm">
                    {/* <span>
                      {t("total_disc")}:{" "}
                      {items
                        .reduce((total, item) => total + item.discount, 0)
                        .toFixed(1)}
                    </span> */}
                    <span>
                      {t("total_disc")}:{" "}
                      {getFormattedValue(
                        Number(
                          formState.transaction.details.reduce(
                            (total, item) => total + (item.discount ?? 0),
                            0
                          )
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm">
                    {/* <span>
                      {t("total_qty")}: {calculateTotalQuantity().toFixed(1)}
                    </span> */}
                    <span>
                      {t("subtotal")}: {getFormattedValue(
                        Number(
                          formState.transaction.master.totalAmount
                        )
                      )}
                    </span>
                  </div>
                </div>

                {/* Add Items Button */}
              </div>

              {/* Footer Buttons */}
              {/* <div className="flex bg-white mt-auto p-2 fixed bottom-0 w-full z-10 pr-[29px]">
          <ERPButton
            title="Save & New"
            onClick={() => {
         
            }}
            variant="primary"
            className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
          ></ERPButton>

          <ERPButton
            title="Save"
            onClick={() => {
             
            }}
            variant="primary"
            className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
          ></ERPButton>
        </div> */}

              {/* ======= */}
            </div>
            <div className="flex bg-white mt-auto fixed bottom-0 w-full z-10  space-x-2 p-0 m-0">
              <ERPButton
                localInputBox={formState?.userConfig?.inputBoxStyle}
                title={t("save_&_new")}
                onClick={() => {
                  save();
                }}
                // onTouchEnd={() => { save()}}
                variant="secondary"
                className="flex-1 !m-0 !rounded-none"
              />
              <ERPButton
                localInputBox={formState?.userConfig?.inputBoxStyle}
                title={t("save")}
                onClick={() => {
                  save();
                  goToPreviousPage();
                }}
                // onTouchEnd={() => { save()}}
                variant="primary"
                className="flex-1 !m-0 !rounded-none"
              />
            </div>
          </div>
        </div>
      )}
      {(() => {
        console.log("showbillwise:", formState.showbillwise);
        console.log("billwiseData:", formState.billwiseData);
        console.log("billwiseData length:", formState.billwiseData?.length);
        console.log("billwiseDrCr:", formState.billwiseDrCr);
      })()}
      {formState.showbillwise == true &&
        formState.billwiseData != undefined &&
        formState.billwiseData != null &&
        formState.billwiseData.length > 0 &&
        formState.billwiseDrCr != undefined &&
        formState.billwiseDrCr != null &&
        formState.billwiseDrCr != "" && (
          <ERPModal
            isOpen={formState.showbillwise ?? false}
            title={t("billwise")}
            initialMaximize={
              formState?.userConfig?.maximizeBillwiseScreenInitially
            }
            closeModal={() => {
              dispatch(
                accFormStateHandleFieldChange({
                  fields: { showbillwise: false, billwiseData: [] },
                })
              );
            }}
            isForm={true}
            width={1200}
            height={800}
            content={
              <BillWisePopup
                drCr={formState.billwiseDrCr}
                onSave={(
                  billwiseDetails: string,
                  totalAmount: number,
                  vrNumbers: string,
                  fromAutoPost: boolean
                ) => {
                  if (
                    applicationSettings.accountsSettings?.billwiseMandatory &&
                    billwiseDetails != ""
                  ) {
                    setTimeout(() => {
                      dispatch(
                        updateFormElement({
                          fields: { amount: { disabled: true } },
                        })
                      );
                    }, 0);
                  }
                  if (
                    formState.formElements.costCentreID.visible == false ||
                    fromAutoPost
                  ) {
                    addOrEditRow(billwiseDetails, totalAmount);
                    focusLedgerCode();
                  } else {
                    focusCostCenterRef();
                  }
                  dispatch(
                    accFormStateHandleFieldChange({
                      fields: { showbillwise: false, billwiseData: [] },
                    })
                  );
                }}
              />
            }
          />
        )}
      <div>
        {isOpen && (
         <ERPModal
         isForm={true}
         isOpen={isOpen}
         closeButton="LeftArrow"
         hasSubmit={false}
         closeTitle={t("close")}
         title={t("add_ledger")}
         width={1000}
         height={800}
         isFullHeight={true}
         isRemoveSomething={true}
         closeModal={() => {setIsOpen(false); clearRow(
           formState.isEdit,
           formState.transaction.master.accTransactionMasterID
         )}}
            content={
              <div
                className="flex flex-col gap-0 px-0  py-0 pb-[130px] h-screen overflow-y-auto   "
                style={{}} // Inline styles for full screen
              >
                <div className=" max-w-none flex-grow h-full px-5">
                  {/* <div className="flex justify-between items-center mb-1">
                  <div className="text-gray-600"></div>

                  <div className="text-gray-600"></div>
                </div> */}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-1">
                      <LedgerCode
                        ref={ledgerCodeRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                    </div>
                    <div className="mb-1">
                      <Ledger
                        ref={ledgerIdRef}
                        handleFieldKeyDown={handleFieldKeyDown}
                        triggerEffect={triggerEffect}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                    </div>
                    <div className="mb-1">
                      <Amount
                        ref={amountRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                    </div>
                    <div className="mb-1">
                      <Drcr
                        ref={drCrRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                    </div>
                    <div className="mb-1">
                      <Discount
                        ref={discountRef}
                        handleKeyDown={handleKeyDown}
                        focusDiscount={focusDiscount}
                        focusAmount={focusAmount}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                    </div>
                    <div className="mb-1">
                      <Narration
                        ref={narrationRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                    </div>
                    <div className="mb-1">
                      <CostCentre
                        ref={costCenterRef}
                        handleKeyDown={handleKeyDown}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                        handleFieldKeyDown={handleFieldKeyDown}
                      />
                    </div>
                  </form>
                </div>

                <div></div>
                <div className="flex bg-white mt-auto fixed bottom-0 w-full z-10  space-x-2 p-0 m-0 pl-1">
                <ERPButton
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    title={`${t(formState.formElements.btnAdd.label)} ${t('and_new')}`}
                    onClick={() => {
                      addOrEditRow();
                      handleClearControls();
                    }}
                    variant="secondary"
                    className="flex-1 !m-0 !rounded-none"
                  />
                  <ERPButton
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    title={t(formState.formElements.btnAdd.label)}
                    onClick={() => {
                      addOrEditRow();
                      setIsOpen(false);
                    }}
                    variant="primary"
                    className="flex-1 !m-0 !rounded-none"
                  />
                </div>
              </div>
            }
          />
        )}
      </div>
      {/* <CustomerDetailsSidebar></CustomerDetailsSidebar> */}

      {/* <ActivityLogSidebar></ActivityLogSidebar> */}
      {/* <div className="fixed top-[3.4rem] right-[465px]">
        <AccTransactionUserConfig />
      </div> */}
      {/* <div className="flex items-center justify-between z-10 fixed bottom-0 bg-[#f8f8ff] shadow-lg w-[-webkit-fill-available] p-2 "> */}
      <div
        className="flex items-center justify-between h-[65px] z-10 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width lg:px-8 py-2 md:px-2"
        style={{
          boxShadow:
            "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 max-w-[990px]:grid-cols-3 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:gap-4">
            {formState.formElements.printOnSave.visible && (
              <ERPCheckbox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="printOnSave"
                label={t(formState.formElements.printOnSave.label)}
                checked={formState.printOnSave}
                onChange={(e) =>
                  dispatch(
                    accFormStateHandleFieldChange({
                      fields: { printOnSave: e.target.checked },
                    })
                  )
                }
                disabled={formState.formElements.printOnSave?.disabled}
              />
            )}

            {(voucherType == "BP" || voucherType == "CQP") &&
              formState.formElements.printCheque.visible && (
                <ERPCheckbox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="p-rintCheque"
                  label={t(formState.formElements.printCheque.label)}
                  checked={formState.printCheque}
                  onChange={(e) =>
                    dispatch(
                      accFormStateHandleFieldChange({
                        fields: { printCheque: e.target.checked },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.printCheque?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                  className="text-sm xl:text-base"
                />
              )}

            {(voucherType == "BP" || voucherType == "CQP") && (
              <div>
                <ERPButton
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  title={t("print_cheque")}
                  variant="secondary"
                  onClick={() => {
                    /* Handle print cheque */
                  }}
                  className="p-1 m-0 md:p-1 lg:p-1 xl:p-[5px]"
                />
              </div>
            )}

            {formState.formElements.keepNarration.visible && (
              <ERPCheckbox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="keepNarration"
                label={t(formState.formElements.keepNarration.label)}
                checked={formState.keepNarration}
                onChange={(e) =>
                  dispatch(
                    accFormStateHandleFieldChange({
                      fields: { keepNarration: e.target.checked },
                    })
                  )
                }
                disabled={
                  formState.formElements.keepNarration?.disabled ||
                  formState.formElements.pnlMasters?.disabled
                }
              />
            )}

            {formState.formElements.keepNarration.visible && (
              <ERPCheckbox
                id="keepNarrationForJV"
                label={t("keep_narration_for_jv")}
                data={formState.userConfig}
                checked={formState?.userConfig?.keepNarrationForJV}
                onChangeData={(e) => {
                  const updatedUserConfig = {
                    ...formState.userConfig,
                    keepNarrationForJV: e.keepNarrationForJV,
                  };
                  dispatch(
                    accFormStateHandleFieldChange({
                      fields: { userConfig: updatedUserConfig },
                    })
                  );
                }}
              />
            )}

            <button className="text-blue-600">
              <span
                className="hover:underline text-[#0ea5e9] capitalize"
                onClick={selectAttachment}
              >
                {t("attachment")}
              </span>
            </button>
          </div>
        </div>

        {/* </div> */}
        <div className="hidden md:block mr-2">
          <h6 className="font-semibold whitespace-nowrap text-[20px] ">
            {" "}
            <span className="!font-medium !text-gray-600">{t("total")}: </span>
            {getFormattedValue(formState.transaction.master?.totalAmount ?? 0)}
          </h6>
        </div>
        <div className="flex items-center gap-2">
          {/* <ERPButton
            ref={btnSaveRef}
            title={t("close")}
            onClick={goToPreviousPage}
            className="w-24"
          // disabled={formState.formElements.pnlMasters?.disabled}
          /> */}

            <ERPButton
              title={t("close")}
              onClick={() => goToPreviousPage()}
              localInputBox={formState?.userConfig?.inputBoxStyle}
            />

          <ERPButton
            localInputBox={formState?.userConfig?.inputBoxStyle}
            ref={btnSaveRef}
            title={t("save")}
            jumpTarget="save"
            variant="primary"
            onClick={save}
            className="w-24"
            disabled={
              formState.formElements.pnlMasters?.disabled ||
              formState.transaction.details == null ||
              formState.transaction.details.length == 0
            }
          />
        </div>
      </div>

      {formState.transaction && formState.template && (
        <ERPModal
          isOpen={formState.printPreview && isPrintModalOpen}
          title={t("Template")}
          width={1000}
          height={700}
          isForm={true}
          closeModal={() => {
            setIsPrintModalOpen(false);
            dispatch(
              accFormStateHandleFieldChange({ fields: { printPreview: false } })
            );
          }}
          content={
            <PDFViewer
              className="pdf-viewer"
              width="100%"
              height={700}
              style={{ padding: "10px" }}
            >
              {renderSelectedTemplate({
                template: formState.template,
                data: formState.transaction,
                currentBranch: currentBranch,
                userSession: userSession,
              })}
            </PDFViewer>
          }
        ></ERPModal>
      )}

      <ERPResizableSidebar
        minWidth={350}
        isOpen={isTemplateOpen}
        setIsOpen={setIsTemplateOpen}
        children={<TemplatesView setIsOpen={setIsTemplateOpen} />}
      ></ERPResizableSidebar>
      <ERPResizableSidebar
        minWidth={350}
        isOpen={isAttachmentOpen}
        setIsOpen={setIsAttachmentOpen}
        children={<ERPAttachment setIsOpen={setIsAttachmentOpen} />}
      ></ERPResizableSidebar>
      {formState.openUnsavedPrompt == true && (
        <UnsavedChangesModal
          isOpen={formState.openUnsavedPrompt == true}
          onClose={() => {
            dispatch(
              accFormStateHandleFieldChange({
                fields: {
                  openUnsavedPrompt: false,
                },
              })
            );
          }}
          onStay={() => {
            dispatch(
              accFormStateHandleFieldChange({
                fields: {
                  openUnsavedPrompt: false,
                },
              })
            );
          }}
          onLeave={async () => {
            const ret = await loadAndSetAccTransVoucher(
              false,
              formState.tmpVoucherNo,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              true,
              true
            );
          }}
        />
      )}
    </div>
  );
};

export default AccTransactionForm;
