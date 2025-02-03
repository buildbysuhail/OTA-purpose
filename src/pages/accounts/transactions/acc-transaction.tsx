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
import AttachmentSidebar from "../../transaction-base/Attachment-button";
import { isNullOrUndefinedOrZero } from "../../../utilities/Utils";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import ERPResizableSidebar from "../../../components/ERPComponents/erp-resizable-sidebar";
import TemplatesView from "./acc-templates";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import useFormComponent from "./use-form-components";
import { useUserRights } from "../../../helpers/user-right-helper";
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
    setTriggerEffect(true);
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

  const [showValidation, setShowValidation] = useState(false);
  const onSelectionChanged = (e: any, state: RootState, isRowClick: boolean) => {
    if (state.AccTransaction.formElements.pnlMasters?.disabled == true) {
      return false;
    }
    const selectedIndexes = e.component
      .getSelectedRowKeys()
      .map((key: any) => e.component.getRowIndexByKey(key));
    debugger;
    if (selectedIndexes.length > 0) {
      handleRowClick({
        row: formState?.transaction?.details[selectedIndexes[0]],
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
    showBillwise,
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
    remarksRef
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
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          transactionType: transactionType,
          formCode: formCode,
          title:
            formType == undefined || formType.trim() == ""
              ? title
              : title + "[" + formType + "]",
        },
      })
    );
  }, [
    dispatch,
    formType,
    title,
    formCode,
    voucherType,
    voucherPrefix,
    formType,
    drCr,
    transactionType
  ]);

  useEffect(() => {
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
          isInvoker: voucherNo && voucherNo > 0,
          // foreignCurrency:
          //   applicationSettings.accountsSettings
          //     ?.maintainMultiCurrencyTransactions,
        },
      })
    );
  }, []);

  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: { formCode: formCode } }));
  }, [formCode]);

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
        const ledgerID = formState.row.ledgerID;
        const { billwiseMandatory } =
          applicationSettings.accountsSettings ?? {};
        const isRowEdit = formState.isRowEdit;

        if (!isNullOrUndefinedOrZero(ledgerID)) {
          if (
            billwiseMandatory &&
            ((!isRowEdit && !formState.row.billwiseDetails) ||
              (isRowEdit && !formState.formElements.amount.disabled))
          ) {
            const IsBillwiseTransAdjustmentExists = await api.getAsync(
              `${Urls.acc_transaction_is_bill_wise_trans_adjustment_exists}?LedgerId=${ledgerID}&DrCr=${formState.transaction.master.drCr}&AccTransactionDetailID=0`
            );
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
            api.getAsync(`${Urls.get_ledger_balance}${ledgerID ?? 0}`),
            api.getAsync(
              `${Urls.ledgerDataForTransaction}?LedgerId=${ledgerID}&DrCr=${formState.transaction.master.drCr}`
            ),
          ]);
          dispatch(
            updateFormElement({
              fields: {
                costCentreID: {
                  visible:
                    applicationSettings?.accountsSettings?.maintainCostCenter ||
                    ledgerData?.isCostCentreApplicable, // Update visibility based on ledgerData
                },
              },
            })
          );

          dispatch(
            accFormStateRowHandleFieldChange({
              fields: { ledgerCode: ledgerData?.ledgerCode, ledgerName: ledgerData?.partyName },
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
      const ledgerBalance = await api.getAsync(
        `${Urls.get_ledger_balance}${formState.masterAccountID ?? 0}`
      );
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
      debugger;
      console.log('masterAccountID = -2;');

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
        debugger;
        employeeID = userSession.employeeId ?? 0;
        if (voucherType == "CP" || voucherType == "CR") {
          masterAccountID =
            userSession?.counterwiseCashLedgerId > 0 &&
              applicationSettings.accountsSettings?.allowSalesCounter
              ? userSession?.counterwiseCashLedgerId
              : applicationSettings.accountsSettings?.defaultCashAcc;
        }
        debugger;
        if (voucherType == "JV" || voucherType == "MJV") {
          masterAccountID = 0;
        }
        debugger;
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
      debugger;
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
              drCr: drCr == undefined || drCr == "" ? AccTransactionMasterInitialData.drCr : drCr,
              employeeID: employeeID,
              voucherNumber: _voucherNo,
            },
          },
          formElements: {
            ...initialFormElements,
          },
          formCode: formCode ?? "",
          title:
            (formType == undefined || formType.trim() == ""
              ? title
              : title + "[" + formType + "]") ?? "",
          row: {
            ...AccTransactionRowInitialData,
            bankDate: ["CR", "CP"].includes(voucher.master.voucherType) ? moment.utc("2000-01-01").startOf("day").toISOString() : moment().local().toISOString(),
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
        debugger;
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
      // const ledgerData = await api.getAsync(
      //   `${Urls.ledgerDataForTransaction}?LedgerId=${_formState.row.ledgerID}&DrCr=${_formState.transaction.master.drCr}`
      // );
      // _formState.row.ledgerCode = ledgerData.ledgerCode;
      debugger;
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
          ...initialFormElements.masterAccount, disabled: (
            (_formState.transaction.master.voucherType == VoucherType.CashPayment
              || _formState.transaction.master.voucherType == VoucherType.CashReceipt) &&
            userSession?.counterwiseCashLedgerId > 0 &&
            applicationSettings.accountsSettings?.allowSalesCounter)
        },
        discount: { ...initialFormElements.discount, visible: true },
        projectId: {
          ...initialFormElements.projectId,
          visible: isProjectIdVisible,
        },
        costCentreID: {
          ...initialFormElements.costCentreID,
          visible: true,
        }
      } as any;
      switch (voucherType) {
        case "CR":
        case "CP": {
          fieldsToUpdate = {
            ...fieldsToUpdate,
            masterAccount: {
              ...fieldsToUpdate.masterAccount,
              label: t("cash_account"),
              accLedgerType: LedgerType.CashInHand,
            },
            employee: {
              ...fieldsToUpdate.employee,
              label: voucherType === "CR" ? t("collected_by") : t("paid_by"),
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
                voucherType === "PV" ? t("purchase_account") : t("sales_account"),
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

        case "BR":
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
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showChqNo: true,
              showChqDate: true,
            },
          };

          if (voucherType === "CQR") {
            fieldsToUpdate.ledger = {
              ...fieldsToUpdate.ledger,
              selectedIndex: -1,
            };
          }
          break;
        }

        case "BP":
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
            gridColumns: {
              ...fieldsToUpdate.gridColumns,
              showChqNo: true,
              showChqDate: true,
            },
          };

          if (voucherType === "CQP") {
            fieldsToUpdate.ledger = {
              ...fieldsToUpdate.ledger,
            };
          }
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

        case "JV": {
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
      }
      _formState.formElements = fieldsToUpdate;
      debugger;
      setAccTransVoucher(_formState, true);
      focusLedgerCode();
      debugger;
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

  const renderCell = (cellData: any, validation: string, enableFormat: boolean = false) => {
    return (
      <div
        className={validation ? "grid-error-cell" : ""}
        title={validation ? validation : ""} // Add validation message as tooltip
      >
        {enableFormat ? getFormattedValue(cellData.value) : cellData.value}
      </div>
    );
  };

  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("si_no"),
      width: 60,
      cellRender: (cellData) => (
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
      caption: t("ledger_ID"),
      width: 100,
      cellRender: (cellData) =>
        renderCell(cellData, cellData.data.ledgerID_Validation),
    },
    {
      dataField: "ledgerCode",
      caption: t("ledger_code"),
      width: 100,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger"),
    },
    {
      dataField: "amount",
      dataType: "number",
      caption: t("amount"),
      width: 200,
      customizeText: (cellInfo: any) =>
        `${getFormattedValue(cellInfo.value)}`,
      cellRender: (cellData) =>
        renderCell(cellData, cellData.data.amount_Validation, true)
    },
    {
      dataField: "drCr",
      caption: t("dr/cr"),
      cellRender: (cellData) =>
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
      visible: false,
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
      dataField: "checkStatus",
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
      dataField: "debit",
      caption: t("debit"),
      customizeText: (cellInfo: any) =>
        `${getFormattedValue(cellInfo.value)}`,
      visible: false,
      cellRender: (cellData) =>
        renderCell(cellData, cellData.data.debit_Validation, true)
    },
    {
      dataField: "credit",
      caption: t("credit"),
      customizeText: (cellInfo: any) =>
        `${getFormattedValue(cellInfo.value)}`,
      visible: false,
      cellRender: (cellData) =>
        renderCell(cellData, cellData.data.credit_Validation, true)
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
  ];

  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) =>
      `${getFormattedValue(itemInfo.value)}`;
  }, []);

  const summaryItems: SummaryConfig[] = [
    {
      column: "amount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "amountFC",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "debit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "credit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "discount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
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

  const handleChange = (selectedOption: { value: string; label: string }) => { };

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is outside the popup AND not on the button
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  return (
    <div className="relative">
      <h1>SAFVAN{transactionType}</h1>
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
                  </h6>
                  <i className="fas fa-cog ms-1"></i>
                </div>
                <div className="flex items-center justify-end space-x-4 p-1 w-full">
                  {/* Load Temp Rows */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("load_details")}
                  >
                    <button
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        loadTemporaryRows();
                      }}
                    >
                      <ChevronUp className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("delete")}
                  >
                    <button
                      disabled={formState.transaction.master.accTransactionMasterID < 1 || (formState.transaction.master.accTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled != true)}
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        deleteAccTransVoucher();
                      }}
                    >
                      <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Load Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("load")}
                  >
                    <button
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={handleRefresh}
                    >
                      <RefreshCw className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>
                  {/* createNewVoucher */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("create_new")}
                  >
                    <button
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={createNewVoucher}
                    >
                      <BadgePlusIcon className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Edit Button */}
                  {formState.formElements.lnkUnlockVoucher.visible != true && (
                    <div
                      className="group relative inline-flex flex-col items-center"
                      title={t("edit")}
                    >
                      <button
                        disabled={formState.transaction.master.accTransactionMasterID < 1 || (formState.transaction.master.accTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled != true)}
                        className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                        onClick={() => {
                          handleEdit();
                        }}
                      >
                        <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                      </button>
                    </div>
                  )}
                  {/* Print Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("print")}
                  >
                    <button
                      disabled={formState.transaction.master.accTransactionMasterID < 1 || (formState.transaction.master.accTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled != true)}
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        printVoucher(setIsPrintModalOpen);
                      }}
                    >
                      <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Clear Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("clear")}
                  >
                    <button
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={handleClearControls}
                    // onClick={() => {
                    //   clearControls(
                    //     formState.isEdit,
                    //     formState.transaction.master.accTransactionMasterID
                    //   );
                    // }}
                    >
                      <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("history")}
                  >
                    <button
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={handleHistoryClick}
                    >
                      <History className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  <HistorySidebar
                  transactionType={transactionType??""}
                    isOpen={isHistorySidebarOpen}
                    onClose={() => setIsHistorySidebarOpen(false)}
                    // data={historyData}
                  />

                  {/* Settings  Button */}
                  <div>
                    <AccTransactionUserConfig />
                  </div>

                  <div className="relative">
                    <button
                      ref={buttonRef}
                      onClick={() => setIsPopupVisible(!isPopupVisible)}
                      // onClick={handleButtonClick}
                      className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      title={t("previous_page")}
                    >
                      <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>

                    {isPopupVisible && (
                      <div
                        ref={popupRef} // Attach ref to the popup
                        className="absolute  rounded-sm dark:bg-dark-bg dark:text-dark-text  bg-gray-100 shadow-lg p-4 z-50 "
                        style={{
                          top: "100%", // Position the popup right below the button
                          left: "-180px", // Align it with the left edge of the button
                          width: "221px", // Set your desired width
                          marginTop: "8px", // Add some spacing between the button and the popup
                        }}
                      >
                        <nav className="w-full dark:bg-dark-bg dark:text-dark-text  bg-gray-100 text-black">
                          <ul className="space-y-1">
                            <li>
                              <button
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-400 hover:text-black transition-colors rounded-sm"
                                onClick={(e) => {
                                  // Prevent default link behavior
                                  printPaymentReceiptAdvice(formState);
                                }}
                              >
                                <Printer className="h-4 w-4" />
                                {/* <span>printPaymentReceiptAdvice</span> */}
                                <span>{t("print_payment")}</span>
                              </button>
                            </li>

                            {formState.formElements.lnkUnlockVoucher
                              .visible && (
                                <li>
                                  <button
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                                    onClick={(e) => {
                                      // Prevent default link behavior

                                      unlockVoucher();
                                    }}
                                  >
                                    <KeyRound className="h-4 w-4" />
                                    {/* <span>UnlockVoucher_Click</span> */}
                                    <span>{t("unlock_voucher")}</span>
                                  </button>
                                </li>
                              )}

                            {formState.transaction.master.voucherType ===
                              "MJV" &&
                              userSession.dbIdValue === "ABCO" && (
                                <li>
                                  <button
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                                    onClick={() => setShowValidation(true)}
                                  >
                                    <FileUp className="h-4 w-4" />
                                    <span>{t("MJV_excel_import")}</span>
                                  </button>
                                </li>
                              )}

                            {formState.formElements.foreignCurrency.visible && (
                              <li>
                                <ERPCheckbox
                                  id="foreignCurrency"
                                  label={
                                    formState.formElements.foreignCurrency.label
                                  }
                                  className="test23 w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                                  checked={formState.foreignCurrency}
                                  onChange={(e) =>
                                    dispatch(
                                      accFormStateHandleFieldChange({
                                        fields: {
                                          foreignCurrency: e.target.checked,
                                        },
                                      })
                                    )
                                  }
                                  disabled={
                                    formState.formElements.foreignCurrency
                                      ?.disabled ||
                                    formState.formElements.pnlMasters?.disabled
                                  }
                                />
                              </li>
                            )}
                          </ul>
                        </nav>
                      </div>
                    )}
                    {showValidation && (
                      <ERPModal
                        isForm={true}
                        isOpen={showValidation}
                        closeButton="LeftArrow"
                        hasSubmit={false}
                        closeTitle={t("close")}
                        title={t("MJV_excel_import")}
                        width="w-full"
                        isFullHeight={true}
                        closeModal={() => setShowValidation(false)}
                        content={<AccExcelImport />}
                      ></ERPModal>
                    )}
                  </div>

                  {/* Previous Page Button */}
                  <button
                    onClick={goToPreviousPage}
                    className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                    title={t("previous_page")}
                  >
                    <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-8 !mt-12"
            style={{
              maxWidth: `${formState.userConfig?.maxWidth}px`,
              marginLeft:
                formState.userConfig?.alignment === "left" ? "0" : "auto",
              marginRight:
                formState.userConfig?.alignment === "right" ? "0" : "auto",
              textAlign: formState.userConfig?.alignment,
            }}
          >
            <div className="">
              <div className="grid grid-cols-1 leading-none lg:w-3/4">
                <div className="flex items-center gap-2">
                  {formState.formElements.voucherPrefix.visible && (
                    <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="master_voucherPrefix"
                      label={t(formState.formElements.voucherPrefix.label)}
                      value={formState.transaction.master.voucherPrefix}
                      className="max-w-[100px]"
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { voucherPrefix: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formState.formElements.voucherPrefix?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formState.formElements.voucherNumber.visible && (
                    <>
                      <ERPInput
                        disableEnterNavigation={true}
                        ref={voucherNumberRef}
                        id="voucherNumber"
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        onKeyUp={(e) => {
                          handleKeyDown(e, "voucherNumber");
                        }}
                        min={1}
                        label={t(formState.formElements.voucherNumber.label)}
                        value={formState.transaction.master.voucherNumber}
                        type="number"
                        showCustomNumberChanger={true}
                        className="max-w-[200px]"
                        onChange={async (e: any) => {
                          if (e.isCustomNumberChangerEvent == true) {
                            const ret = await loadAndSetAccTransVoucher(
                              false,
                              e.target?.value
                              , undefined, undefined, undefined, undefined, undefined, undefined, false
                            );
                            // if(ret) {
                            //   dispatch(
                            //     accFormStateTransactionMasterHandleFieldChange({
                            //       fields: { voucherNumber: e.target?.value },
                            //     })
                            //   );
                            // }
                          } else {
                            dispatch(
                              accFormStateTransactionMasterHandleFieldChange({
                                fields: { voucherNumber: e.target?.value },
                              })
                            );
                          }
                        }}
                        disabled={
                          formState.formElements.voucherNumber?.disabled ||
                          formState.formElements.pnlMasters?.disabled
                        }
                      />
                    </>
                  )}
                </div>
                {formState.formElements.masterAccount.visible &&
                  formState.formElements?.masterAccount?.accLedgerType !=
                  undefined && (
                    <div className="flex items-center">
                      <ERPDataCombobox
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        isInModal={false}
                        className="w-full"
                        id="masterAccount"
                        label={t(formState.formElements.masterAccount.label)}
                        value={formState.masterAccountID}
                        onChange={(e) =>
                          dispatch(
                            accFormStateHandleFieldChange({
                              fields: { masterAccountID: e.value },
                            })
                          )
                        }
                        reload={formState.formElements.masterAccount.reload}
                        changeReload={(reload: boolean) =>
                          dispatch(
                            updateFormElement({
                              fields: { masterAccount: { reload: reload } },
                            })
                          )
                        }
                        field={{
                          valueKey: "id",
                          labelKey: "name",
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerType=${formState.formElements?.masterAccount?.accLedgerType}`,
                        }}
                        disabled={
                          formState.formElements.masterAccount?.disabled ||
                          formState.formElements.pnlMasters?.disabled
                        }
                        labelInfo={
                          <div className="">
                            <span className="text-xx text-primary">
                              <button className="pe-3">
                                {/* <CustomerDetailsSidebar displayType="link" /> */}
                              </button>
                              {t("bal")}:{" "}
                              {`${getFormattedValue(formState.masterBalance < 0
                                ? (-1 * formState.masterBalance)
                                : (formState.masterBalance || 0))

                                } ${(formState.masterBalance ?? 0) < 0 ? "Cr" : "Dr"
                                }`}
                            </span>
                          </div>
                        }
                      />
                      <div className="flex flex-wrap gap-4">
                        {formState.formElements.jvDrCr.visible && (
                          <ERPDataCombobox
                            localInputBox={formState?.userConfig?.inputBoxStyle}
                            enableClearOption={false}
                            id="drCr"
                            className="min-w-[70px] max-w-[170px] ml-4"
                            label={t(formState.formElements.jvDrCr.label)}
                            value={formState.transaction.master.drCr == undefined || formState.transaction.master.drCr == "" ? "Dr" : formState.transaction.master.drCr}
                            data={formState.transaction.master}
                            onChange={(e) => {
                              dispatch(
                                accFormStateTransactionMasterHandleFieldChange({
                                  fields: { drCr: e.value },
                                })
                              );
                            }}
                            field={{
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            options={[
                              { value: "Dr", label: "Debit" },
                              { value: "Cr", label: "Credit" },
                            ]}
                            disabled={
                              formState.formElements.jvDrCr?.disabled ||
                              formState.formElements.pnlMasters?.disabled
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}
                <div>
                  {formState.formElements.commonNarration.visible && (
                    <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="notes"
                      label={t(formState.formElements.commonNarration.label)}
                      className="max-w-full"
                      value={formState.transaction.master.commonNarration}
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { commonNarration: e.target?.value },
                          })
                        )
                      }
                      disableEnterNavigation={true}
                      onKeyDown={(e) => {
                        handleKeyDown(e, "commonNarration");
                      }}
                      disabled={
                        formState.formElements.commonNarration?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formState.formElements.foreignCurrency.visible == true &&
                    formState.foreignCurrency == true && (
                      <>
                        {formState.formElements.currencyID.visible && (
                          <ERPDataCombobox
                            localInputBox={formState?.userConfig?.inputBoxStyle}
                            id="currencyID"
                            data={formState.row}
                            label={t(formState.formElements.currencyID.label)}
                            value={formState.transaction.master.currencyID}
                            field={{
                              valueKey: "id",
                              labelKey: "name",
                              nameKey: "rate",
                              getListUrl: Urls.data_currencies,
                            }}
                            onSelectItem={(e) => {
                              dispatch(
                                accFormStateTransactionMasterHandleFieldChange({
                                  fields: {
                                    currencyID: e.value,
                                    currencyRate: e.rate,
                                    currencyName: e.label,
                                  },
                                })
                              );
                              dispatch(
                                accFormStateRowHandleFieldChange({
                                  fields: {},
                                })
                              );
                            }}
                            disabled={
                              formState.formElements.currencyID?.disabled ||
                              formState.formElements.pnlMasters?.disabled
                            }
                          />
                        )}

                        {formState.formElements.exchangeRate.visible && (
                          <ERPInput
                            localInputBox={formState?.userConfig?.inputBoxStyle}
                            id="currencyRate"
                            min={0}
                            label={t(formState.formElements.exchangeRate.label)}
                            type="number"
                            value={formState.transaction.master.currencyRate}
                            onChange={(e) =>
                              dispatch(
                                accFormStateTransactionMasterHandleFieldChange({
                                  fields: { currencyRate: e.target?.value },
                                })
                              )
                            }
                            disabled={
                              formState.formElements.exchangeRate?.disabled ||
                              formState.formElements.pnlMasters?.disabled
                            }
                          />
                        )}
                      </>
                    )}
                  {formState.formElements.linkEdit.visible == true && (
                    <button className="">
                      <span
                        className="hover:underline text-[#0ea5e9] capitalize ml-1"
                        onClick={() => {
                          enableCombo();
                        }}
                      >
                        {t("edit")}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="grid grid-cols-1 leading-none lg:full">
                <div className="grid grid-cols-2 gap-2">
                  {formState.formElements.referenceNumber.visible && (
                    <>
                      <div>
                        <ERPInput
                          localInputBox={formState?.userConfig?.inputBoxStyle}
                          id="referenceNumber"
                          label={t(
                            formState.formElements.referenceNumber.label
                          )}
                          value={formState.transaction.master.referenceNumber}
                          className="lg:max-w-[300px]"
                          onChange={(e) =>
                            dispatch(
                              accFormStateTransactionMasterHandleFieldChange({
                                fields: { referenceNumber: e.target?.value },
                              })
                            )
                          }
                          disabled={
                            formState.formElements.referenceNumber?.disabled ||
                            formState.formElements.pnlMasters?.disabled
                          }
                          labelInfo={
                            // <ERPButton
                            //   id="btnLoadByRef"
                            //   title=":"
                            //   className="!p-0 !m-0 !bg-none"
                            //   onClick={handleLoadByRefNo}
                            // ></ERPButton>
                            <div className="relative">
                              {/* <button onClick={handleLoadByRefNo} className="m-[-1px_0_-13px_0] p-[0px_0_7px_0] text-[#0ea5e9]"> */}
                              <button
                                onClick={handleLoadByRefNo}
                                className="absolute right-0 top-[-5px] text-[#0ea5e9]"
                              >
                                <Ellipsis />
                              </button>
                            </div>
                          }
                        />
                      </div>
                      {/* {formState.formElements.lnkUnlockVoucher.visible ==
                        true && (
                        <ERPButton
                          id="UnlockVoucher_Click"
                          title="UnlockVoucher_Click"
                          onClick={() => {
                            
                            unlockVoucher();
                          }}
                        ></ERPButton>
                      )}
                      <ERPButton
                        id="printPaymentReceiptAdvice"
                        title="printPaymentReceiptAdvice"
                        onClick={() => printPaymentReceiptAdvice(formState)}
                      ></ERPButton> */}
                    </>
                  )}
                  {formState.formElements.transactionDate.visible && (
                    <ERPDateInput
                      localInputBox={formState.userConfig?.inputBoxStyle}
                      id="transactionDate"
                      label={t(formState.formElements.transactionDate.label)}
                      className="lg:max-w-[300px]"
                      value={
                        new Date(formState.transaction.master.transactionDate)
                      }
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { transactionDate: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formState.formElements.transactionDate?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                      validation={
                        formState.transaction.masterValidations?.transactionDate
                      }
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formState.formElements.referenceDate.visible && (
                    <ERPDateInput
                      localInputBox={formState.userConfig?.inputBoxStyle}
                      id="referenceDate"
                      label={t(formState.formElements.referenceDate.label)}
                      className="lg:max-w-[300px]"
                      value={
                        new Date(formState.transaction.master.referenceDate)
                      }
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { referenceDate: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formState.formElements.referenceDate?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                  {formState.formElements.employee.visible && (
                    <ERPDataCombobox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="employeeID"
                      label={t(formState.formElements.employee.label)}
                      value={formState.transaction.master.employeeID}
                      className="lg:max-w-[300px]"
                      onChange={(e) => {
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { employeeID: e.value },
                          })
                        );
                      }}
                      onSelectItem={(e) => {
                        handleKeyDown("ledgerCode", e);
                      }}
                      field={{
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_employees,
                      }}
                      disabled={
                        formState.formElements.employee?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>
                <div className="grid grid-cols-1">
                  {formState.formElements.remarks.visible && (
                    <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="remarks"
                      label={t(formState.formElements.remarks.label)}
                      value={formState.transaction.master.remarks}
                      className="max-w-full"
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { remarks: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formState.formElements.remarks?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formState.formElements.projectId.visible && (
                    <ERPDataCombobox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="project"
                      label={t(formState.formElements.projectId.label)}
                      options={
                        formState.row.ledgerID != undefined &&
                          formState.row.ledgerID != 0
                          ? undefined
                          : []
                      }
                      field={{
                        valueKey: "id",

                        labelKey: "name",
                        getListUrl: Urls.data_projects_by_ledgerid,
                        params: `LedgerID=${formState.row.ledgerID}`,
                      }}
                      onSelectItem={(e) =>
                        dispatch(
                          accFormStateRowHandleFieldChange({
                            fields: {
                              projectId: e.value,
                              projectName: e.label,
                            },
                          })
                        )
                      }
                      disabled={
                        formState.formElements.projectId?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="leading-none"
            style={{
              maxWidth: `${formState.userConfig?.maxWidth}px`,
              marginLeft:
                formState.userConfig?.alignment === "left" ? "0" : "auto",
              marginRight:
                formState.userConfig?.alignment === "right" ? "0" : "auto",
              textAlign: formState.userConfig?.alignment,
            }}
          >
            <div className="flex items-center gap-2">
              {formState.formElements.ledgerCode.visible && (
                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="ledgerCode"
                  className=""
                  label={t(formState.formElements.ledgerCode.label)}
                  value={formState.row.ledgerCode}
                  ref={ledgerCodeRef}
                  disableEnterNavigation={true}
                  onKeyDown={(e) => {
                    handleKeyDown(e, "ledgerCode");
                  }}
                  onChange={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { ledgerCode: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.ledgerCode?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                />
              )}
              {/* {formState?.row.ledgerID?.toString()} */}
              {formState.formElements.ledgerID.visible && (
                <>
                  <ERPDataCombobox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    ref={ledgerIdRef}
                    triggerEffect={triggerEffect}
                    id="ledgerID"
                    className="w-full"
                    label={t(formState.formElements.ledgerID.label)}
                    data={formState.row}
                    reload={formState.formElements.ledgerID.reload}
                    disableEnterNavigation={true}
                    changeReload={(reload: boolean) =>
                      dispatch(
                        updateFormElement({
                          fields: { ledgerID: { reload: false } },
                        })
                      )
                    }
                    onKeyDown={(e) => {
                      handleKeyDown(e, "ledgerID");
                    }}
                    onSelectItem={(e) => {
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { ledgerID: e.value, ledgerName: e.label },
                        })
                      );
                      handleFieldKeyDown("ledgerID", e.value);
                    }}
                    field={{
                      id: "ledgerID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_acc_ledgers,
                    }}
                    disabled={
                      formState.formElements.ledgerID?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    labelInfo={
                      formState.formElements.pnlMasters?.disabled ==
                        true ? null : (
                        <div>
                          <span className="text-xs text-primary">
                            <button className="pe-3">
                              <CustomerDetailsSidebar displayType="link" />
                            </button>
                            {t("bal")}:{" "}
                            {
                              `${getFormattedValue(formState.ledgerBalance < 0
                                ? (-1 * formState.ledgerBalance)
                                : (formState.ledgerBalance || 0))

                              } ${(formState.ledgerBalance ?? 0) < 0 ? "Cr" : "Dr"
                              }`}
                          </span>
                        </div>
                      )
                    }
                  />
                </>
              )}
              {formState.formElements.amount.visible && (
                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  ref={amountRef}
                  id="amount"
                  className=""
                  label={t(formState.formElements.amount.label)}
                  type="number"
                  min={0}
                  value={formState.row.amount}
                  onKeyDown={(e) => {
                    handleKeyDown(e, "amount");
                  }}
                  disableEnterNavigation={true}
                  onChange={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { amount: parseFloat(e.target?.value) },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.amount?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                />
              )}
              {formState.formElements.drCr.visible && (
                <ERPDataCombobox
                  onKeyDown={(e) => {
                    handleKeyDown(e, "drCr");
                  }}
                  ref={drCrRef}
                  disableEnterNavigation={true}
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="drCr"
                  enableClearOption={false}
                  className="min-w-[70px] max-w-[150px]"
                  label={t(formState.formElements.drCr.label)}
                  value={formState.row.drCr == undefined || formState.row.drCr == "" ? "Dr" : formState.row.drCr}
                  onSelectItem={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { drCr: e.value },
                      })
                    )
                  }
                  field={{
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  options={[
                    { value: "Dr", label: "Debit" },
                    { value: "Cr", label: "Credit" },
                  ]}
                  disabled={
                    formState.formElements.drCr?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                />
              )}
              <div className="xl:w-[170px] lg:w-[250px]">
                {formState.formElements.discount.visible && (
                  <ERPCheckbox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="hasDiscount"
                    className="text-left"
                    label={t(formState.formElements.hasDiscount.label)}
                    checked={formState.row.hasDiscount}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { hasDiscount: e.target.checked },
                        })
                      )
                    }
                    disabled={
                      formState.formElements.hasDiscount?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                  />
                )}

                {formState.formElements.discount.visible && (
                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="discount"
                    type="number"
                    min={0}
                    className=""
                    label=" "
                    value={formState.row.discount}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { discount: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formState.row.hasDiscount != true ||
                      formState.formElements.discount?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3">
              <div className="flex flex-wrap gap-4">
                <span className="text-blue-600 font-bold self-center">
                  {t("group_name")}: {formState.ledgerData?.accGroupName}
                </span>
              </div>
              <div className="text-red-600" style={{ fontSize: "12px", color: "chocolate" }}>
                {t("amount_in_words")}: {formState.amountInWords}
              </div>
            </div>
          </div>

          <div
            className="leading-none"
            style={{
              maxWidth: `${formState.userConfig?.maxWidth}px`,
              marginLeft:
                formState.userConfig?.alignment === "left" ? "0" : "auto",
              marginRight:
                formState.userConfig?.alignment === "right" ? "0" : "auto",
              textAlign: formState.userConfig?.alignment,
            }}
          >
            <div className="flex items-center gap-2">
              {formState.formElements.narration.visible && (
                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  ref={narrationRef}
                  id="narration"
                  className="w-full"
                  disableEnterNavigation
                  onKeyDown={(e) => {
                    handleKeyDown(e, "narration");
                  }}
                  label={t(formState.formElements.narration.label)}
                  value={formState.row.narration}
                  onChange={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { narration: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.narration?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                />
              )}

              {formState.formElements.costCentreID.visible && (
                <ERPDataCombobox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  enableClearOption={false}
                  ref={costCenterRef}
                  id="costCentreID"
                  // nameField="costCentreName"
                  className="min-w-[180px]"
                  label={t(formState.formElements.costCentreID.label)}
                  data={formState.row}
                  onSelectItem={(e) => {
                    debugger;
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: {
                          costCentreID: e.value,
                          costCentreName: e.label,
                        },
                      })
                    );
                    handleFieldKeyDown("costCentreID", "Enter");
                  }}
                  value={formState.row.costCentreID}
                  field={{
                    id: "costCentreID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_costcentres,
                  }}
                  disabled={
                    (formState.userConfig?.presetCostenterId ?? 0) > 0 ||
                    formState.formElements.costCentreID.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                  disableEnterNavigation
                  onKeyDown={(e: any) => {
                    handleKeyDown(e, "costCentre");
                  }}
                />
              )}

              {formState.transaction?.master?.isLocked !== undefined &&
                formState.transaction?.master?.isLocked == true &&
                (userSession.userTypeCode == "CA" ||
                  userSession.userTypeCode == "BA") && <>{t("unlock")}</>}
              <div className="flex items-center gap-2 mt-4">
                {applicationSettings.accountsSettings
                  ?.maintainBillwiseAccount == true && (
                    <ERPButton
                      title={formState.formElements.btnBillWise.label}
                      variant="secondary"
                      onClick={showBillwise}
                      disabled={
                        formState.ledgerBillWiseLoading ||
                        formState.formElements.btnBillWise.disabled == true ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                {formState.formElements.btnAdd.visible == true && (
                  <ERPButton
                    ref={btnAddRef}
                    title={formState.formElements.btnAdd.label}
                    variant="primary"
                    loading={formState.rowProcessing}
                    type="button"
                    onClick={() => addOrEditRow()}
                    onKeyDown={(e) => {
                      console.log(`Key:${e.key}`);

                      if (e.key == "Enter") {
                        addOrEditRow();
                      }
                    }}
                    disabled={
                      formState.formElements.btnAdd.disabled == true ||
                      formState.ledgerBillWiseLoading ||
                      formState.ledgerIsBillWiseAdjustExistLoading ||
                      formState.formElements.pnlMasters?.disabled

                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div
            className="leading-none "
            style={{
              maxWidth: `${formState.userConfig?.maxWidth}px`,
              marginLeft:
                formState.userConfig?.alignment === "left" ? "0" : "auto",
              marginRight:
                formState.userConfig?.alignment === "right" ? "0" : "auto",
              textAlign: formState.userConfig?.alignment,
            }}
          >
            <div className="flex flex-wrap gap-4">
              {/* {(voucherType == "BP" || voucherType == "BR" || voucherType == "CQP" || voucherType == "CQP") && ( */}
              <>
                {formState.formElements.nameOnCheque.visible && (
                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="nameOnCheque"
                    className="min-w-[140px] max-w-[200px]"
                    label={t(formState.formElements.nameOnCheque.label)}
                    value={formState.row.nameOnCheque}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { nameOnCheque: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formState.formElements.nameOnCheque?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                  />
                )}
                {formState.formElements.bankName.visible && (
                  <ERPDataCombobox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="bankName"
                    className="min-w-[180px] max-w-[200px]"
                    label={t(formState.formElements.bankName.label)}
                    value={formState.row.bankName}
                    options={formState.row.ledgerID ? undefined : []}
                    field={bankAccountField}
                    onChange={handleBankNameChange}
                    disabled={
                      formState.formElements.bankName?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                  />
                )}
                {formState.formElements.chequeNumber.visible && (
                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="chequeNumber"
                    label={t(formState.formElements.chequeNumber.label)}
                    value={formState.row.chequeNumber}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { chequeNumber: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formState.formElements.chequeNumber?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                  />
                )}

                {formState.formElements.bankDate.visible && (
                  <ERPDateInput
                    localInputBox={formState.userConfig?.inputBoxStyle}
                    id="bankDate"
                    label={t(formState.formElements.bankDate.label)}
                    value={new Date(formState.row.bankDate)}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { bankDate: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formState.formElements.bankDate?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    disableEnterNavigation
                    onKeyDown={(e) => {
                      handleKeyDown(e, "bankDate");
                    }}
                  />
                )}
              </>
            </div>

          </div>
          <div className="relative">
            {/* <div className="w-full h-full absolute bg-transparent z-9"></div> */}
            <ErpDevGrid
              summaryItems={summaryItems}
              ref={erpGridRef}
              key={"slNo"}
              keyExpr="slNo"
              columns={columns}
              height={gridHeight}
              allowFiltering={false}
              dataUrl={Urls.acc_reports_ledger}
              hideGridAddButton={true}
              hideDefaultExportButton={true}
              hideDefaultSearchPanel={true}
              hideGridHeader={true}
              enablefilter={false}
              remoteOperations={false}
              data={formState.transaction.details}
              gridId={`${gridCode}-grid`}
              onClickByRootState={(e: any, state: RootState) => { debugger; onSelectionChanged(e, state, true) }}
              showTotalCount={false}
              onKeyDown={(e) => handleKeyDown("grid", e)}
              onSelectionChangedByRootState={(e: any, state: RootState) =>
                onSelectionChanged(e, state, false)
              }
              enableScrollButton={false}
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
            <i className="ri-settings-3-line" style={{ fontSize: "23px" }}></i>
          </div>
          {/* Scrollable Content */}
          <div className="flex flex-col mt-[58px] w-full overflow-scroll"></div>
          <div className="flex items-center space-x-4 bg-white mb-0 p-0 rounded-none shadow-md text-gray-600">
            <div className="flex-1  px-2  rounded-md">
              <label className="block mb-0 font-medium text-center text-sm text-gray-700">
                {t("voucher_no")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="3"
                  className="bg-transparent px-3 py-2 w-full text-center border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[10px]"
                />
                {/* <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i> */}
              </div>
            </div>

            {/* Centered divider */}
            <div className="border-gray-300 border-l h-12"></div>

            <div className="flex-1  px-2 rounded-md">
              <label className="block mb-0 font-medium text-center text-sm text-gray-700">
                {t("date")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="bg-transparent px-3 py-2 w-full text-center border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[10px]"
                />
              </div>
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
                <ERPDataCombobox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="cashacc"
                  field={{
                    id: "cashacc",
                    // required: true,
                    getListUrl: Urls.data_CashLedgers,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  data={formData}
                  onChangeData={(data) =>
                    handleFieldChange("cashacc", data.cashacc)
                  }
                  // label={t("cost_center")}
                  label={t("cash_account")}
                />
              </div>
              {/* <div className="mb-4">
          <input
            type="text"
            placeholder="Remark"
            // className="bg-white p-2 border rounded w-full"
            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
          />
        </div> */}
              <div className="mb-1">
                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="autoUpdateReleaseUpTo"
                  label={t("remark")}
                  type="text"
                  data={settings}
                  value={settings?.autoUpdateReleaseUpTo}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "autoUpdateReleaseUpTo",
                      data.autoUpdateReleaseUpTo
                    )
                  }
                />
              </div>

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
                    <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="autoUpdateReleaseUpTo"
                      label={t("ref_no")}
                      type="text"
                      data={settings}
                      value={settings?.autoUpdateReleaseUpTo}
                      onChangeData={(data) =>
                        handleFieldChange(
                          "autoUpdateReleaseUpTo",
                          data.autoUpdateReleaseUpTo
                        )
                      }
                    />
                  </div>
                  <div className="mb-1">
                    <label
                      className="block font-medium text-gray-700 text-sm"
                      htmlFor=""
                    >
                      {t("ref_date")}
                    </label>
                    <input
                      type="date"
                      placeholder={t("ref_date")}
                      // className="bg-white p-2 border rounded w-full"
                      className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
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
                    <ERPDataCombobox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="cashacc"
                      field={{
                        id: "cashacc",
                        // required: true,
                        getListUrl: Urls.data_employees,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      data={formData}
                      onChangeData={(data) =>
                        handleFieldChange("cashacc", data.cashacc)
                      }
                      // label={t("cost_center")}
                      label={t("paid_by")}
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
                    <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="autoUpdateReleaseUpTo"
                      label={t("notes")}
                      type="text"
                      data={settings}
                      value={settings?.autoUpdateReleaseUpTo}
                      onChangeData={(data) =>
                        handleFieldChange(
                          "autoUpdateReleaseUpTo",
                          data.autoUpdateReleaseUpTo
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {/* Billed Items Section */}
              <div className="bg-custom-blue mb-1 p-1 rounded-sm text-white">
                <h2 className="font-light text-sm">{t("billed_items")}</h2>
              </div>
              <div className="pt-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f3f3f3] shadow-md mb-3 p-1 rounded-sm"
                  >
                    <div className="flex justify-between items-center mb-0 mt-1 h-[10px]">
                      {/* <span className="text-gray-500 text-sm">#{item.id}</span> */}
                      <h6 className="mb-1 font-bold text-[16px]">
                        {item.name}
                      </h6>
                      <span className="font-bold text-sm">
                        ₹ {item.price * item.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1"></div>
                    <p className="mb-1 text-yellow info">
                      {t("discount")}: {item.discount}
                    </p>
                    {/* <p className="text-gray-600 text-sm">Tax: {item.tax}%</p> */}
                  </div>
                ))}

                {/* Total Summary */}
                <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                  <div className="flex justify-between mb-2 text-gray-600 text-sm">
                    <span>
                      {t("total_disc")}:{" "}
                      {items
                        .reduce((total, item) => total + item.discount, 0)
                        .toFixed(1)}
                    </span>
                    <span>
                      {t("total_tax_amt")}:{" "}
                      {items
                        .reduce((total, item) => total + item.tax, 0)
                        .toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm">
                    <span>
                      {t("total_qty")}: {calculateTotalQuantity().toFixed(1)}
                    </span>
                    <span>
                      {t("subtotal")}: ₹ {calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add Items Button */}
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
                title={t("save_&_new")}
                onClick={() => { }}
                variant="secondary"
                className="flex-1 !m-0 !rounded-none"
              />
              <ERPButton
                title={t("save")}
                onClick={() => { }}
                variant="primary"
                className="flex-1 !m-0 !rounded-none"
              />
            </div>
          </div>
        </div>
      )}
      {formState.showbillwise == true &&
        formState.billwiseData != undefined &&
        formState.billwiseData != null &&
        formState.billwiseData.length > 0 &&
        formState.billwiseDrCr != undefined &&
        formState.billwiseDrCr != null &&
        formState.billwiseDrCr != "" && (
          <ERPModal
            isFullHeight={true}
            isOpen={formState.showbillwise ?? false}
            title={t("billwise")}
            initailMaximize={
              formState?.userConfig?.maximizeBillwiseScreenInitially
            }
            closeModal={() => {
              dispatch(
                accFormStateHandleFieldChange({
                  fields: { showbillwise: false, billwiseData: [] },
                })
              );
            }}
            onSubmit={() => { }}
            width="!w-[80rem] !max-w-[60rem]"
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
        {/* The ERPModal component */}
        <ERPModal
          isForm={true}
          isOpen={isOpen}
          closeButton="LeftArrow"
          hasSubmit={false}
          closeTitle={t("close")}
          title={t("add_ledger")}
          width="w-full"
          isFullHeight={true}
          isRemoveSomething={true}
          closeModal={() => setIsOpen(false)}
          content={
            <div
              className="flex flex-col gap-0 px-0  py-0 pb-[130px] h-screen overflow-y-auto   "
              style={{}} // Inline styles for full screen
            >
              <div className=" max-w-none flex-grow h-full px-5">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-gray-600"></div>

                  <div className="text-gray-600"></div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="mb-4">
                      <ERPInput
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        id="autoUpdateReleaseUpTo"
                        label={t("ledger_code")}
                        type="text"
                        data={settings}
                        value={settings?.autoUpdateReleaseUpTo}
                        onChangeData={(data) =>
                          handleFieldChange(
                            "autoUpdateReleaseUpTo",
                            data.autoUpdateReleaseUpTo
                          )
                        }
                      />
                    </div>
                    <div className="mb-1">
                      <ERPDataCombobox
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        id="cashacc"
                        field={{
                          id: "cashacc",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        data={formData}
                        onChangeData={(data) =>
                          handleFieldChange("cashacc", data.cashacc)
                        }
                        // label={t("cost_center")}
                        label={t("ledger")}
                      />
                    </div>
                    <div className="mb-4">
                      <ERPInput
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        id="autoUpdateReleaseUpTo"
                        label={t("amount")}
                        type="number"
                        data={settings}
                        value={settings?.autoUpdateReleaseUpTo}
                        onChangeData={(data) =>
                          handleFieldChange(
                            "autoUpdateReleaseUpTo",
                            data.autoUpdateReleaseUpTo
                          )
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <ERPInput
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        id="autoUpdateReleaseUpTo"
                        label={t("narration")}
                        type="string"
                        data={settings}
                        value={settings?.autoUpdateReleaseUpTo}
                        onChangeData={(data) =>
                          handleFieldChange(
                            "autoUpdateReleaseUpTo",
                            data.autoUpdateReleaseUpTo
                          )
                        }
                      />
                    </div>

                    <div className="mb-1">
                      <ERPDataCombobox
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        id="cashacc"
                        field={{
                          id: "cashacc",
                          // required: true,
                          getListUrl: Urls.data_costcentres,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        data={formData}
                        onChangeData={(data) =>
                          handleFieldChange("cashacc", data.cashacc)
                        }
                        // label={t("cost_center")}
                        label={t("cost_center")}
                      />
                    </div>
                  </div>
                </form>
                <div className="max-w-none mx-auto mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className=" pt-1">
                    {/* Discount Section */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">{t("discount")}</span>
                      <div className="flex items-center">
                        <input
                          type="number"
                          defaultValue="0"
                          className=" px-4 py-2 pr-5 border border-orange rounded-l-md text-orange-400 focus:outline-none w-16"
                        />
                        <button className="bg-orange mr-2 px-4 py-2 pt-[11px] pb-[10px] border border-b border-orange rounded-r-md text-orange-400 focus:outline-none">
                          %
                        </button>
                        <button className="bg-gray-400 px-4 py-2 pt-[11px] pb-[10px] border border-b border-gray-400 rounded-l-md text-orange-400 focus:outline-none">
                          ₹
                        </button>
                        <input
                          type="number"
                          defaultValue="0"
                          className=" px-4 py-2 pr-5 border border-gray-400 rounded-r-md text-orange-400 focus:outline-none w-16"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200">
                      <div>
                        <span className="text-sm font-semibold">
                          {t("total_amount")}:
                        </span>
                      </div>
                      <div>
                        <span className="text-sm  font-semibold">₹</span>
                        <span className="text-sm font-semibold">200.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div></div>
              <div className="flex bg-white mt-auto fixed bottom-0 w-full z-10  space-x-2 p-0 m-0 pl-1">
                <ERPButton
                  title={t("save_&_new")}
                  onClick={() => { }}
                  variant="secondary"
                  className="flex-1 !m-0 !rounded-none"
                />
                <ERPButton
                  title={t("save")}
                  onClick={() => { }}
                  variant="primary"
                  className="flex-1 !m-0 !rounded-none"
                />
              </div>
            </div>
          }
        />
      </div>
      {/* <CustomerDetailsSidebar></CustomerDetailsSidebar> */}

      {/* <ActivityLogSidebar></ActivityLogSidebar> */}
      {/* <div className="fixed top-[3.4rem] right-[465px]">
        <AccTransactionUserConfig />
      </div> */}
      {/* <div className="flex items-center justify-between z-10 fixed bottom-0 bg-[#f8f8ff] shadow-lg w-[-webkit-fill-available] p-2 "> */}
      <div
        className="flex items-center justify-between h-[65px] z-10 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg w-[-webkit-fill-available] lg:px-8 py-2 md:px-2"
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

            {formState.formElements.printPreview.visible && (
              <ERPCheckbox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="printPreview"
                label={t(formState.formElements.printPreview.label)}
                checked={formState.printPreview}
                onChange={(e) =>
                  dispatch(
                    accFormStateHandleFieldChange({
                      fields: { printPreview: e.target.checked },
                    })
                  )
                }
                disabled={formState.formElements.printPreview?.disabled}
              />
            )}

            {(voucherType == "BP" || voucherType == "CQP") &&
              formState.formElements.printCheque.visible && (
                <ERPCheckbox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="printCheque"
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
              <ERPButton
                title={t("print_cheque")}
                variant="secondary"
                onClick={() => {
                  /* Handle print cheque */
                }}
              />
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
                onClick={selectTemplates}
              >
                {t("template_elite")}
              </span>
            </button>

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
          <ERPButton
            ref={btnSaveRef}
            title={t("cancel")}
            onClick={goToPreviousPage}
            className="w-24"
          // disabled={formState.formElements.pnlMasters?.disabled}
          />
          <ERPButton
            ref={btnSaveRef}
            title={t("save")}
            jumpTarget="save"
            variant="primary"
            onClick={save}
            className="w-24"
            disabled={formState.formElements.pnlMasters?.disabled || formState.transaction.details == null || formState.transaction.details.length == 0}
          />
        </div>
      </div>

      {formState.transaction && formState.template && (
        <ERPModal
          isOpen={formState.printPreview && isPrintModalOpen}
          title={t("Template")}
          isForm={true}
          closeModal={() => {
            setIsPrintModalOpen(false)
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
    </div>
  );
};

export default AccTransactionForm;
