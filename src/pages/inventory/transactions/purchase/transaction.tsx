import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TransactionData,
  TransactionFormState,
  TransactionFormStateInitialData,
  transactionInitialData,
  TransactionMasterInitialData,
  TransactionProps,
  initialFormElements,
  TransactionDetail,
} from "./transaction-types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import {
  formStateHandleFieldChange,
  // formStateMaster3HandleFieldChange,
  formStateMasterHandleFieldChange,
  formStateTransactionMaster3HandleFieldChange,
  formStateTransactionMasterHandleFieldChange,
  setUserRight,
  updateFormElement,
} from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../../helpers/api-client";
import {
  ApplicationMainSettings,
  ApplicationMainSettingsInitialState,
} from "../../../settings/system/application-settings-types/application-settings-types-main";
import ERPPreviousUrlButton from "../../../../components/ERPComponents/erp-previous-uirl-button";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTransaction } from "./use-transaction";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { TransactionUserConfig } from "./transaction-user-config";
import CustomerDetailsSidebar from "../../../transaction-base/customer-details";
import { isNullOrUndefinedOrZero } from "../../../../utilities/Utils";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import TemplatesView from "./templates";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import useFormComponent from "./use-form-components";
import { useUserRights } from "../../../../helpers/user-right-helper";
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
import { LedgerType } from "../../../../enums/ledger-types";
import ExcelImport from "./excel-Import";
import { PDFViewer } from "@react-pdf/renderer";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { renderSelectedTemplate } from "./renderSelected-template";
import moment from "moment";
import ERPAttachment from "../../../../components/ERPComponents/erp-attachment";
import VoucherType from "../../../../enums/voucher-types";
import HistorySidebar from "./historySidebar";
import {
  customJsonParse,
  modelToBase64,
  modelToBase64Unicode,
} from "../../../../utilities/jsonConverter";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import UnsavedChangesModal from "./unsavedChangesModal";
import PartySelectionModal from "./party-selection-modal";
import { Countries } from "../../../../redux/slices/user-session/user-branches-reducer";
import ReferenceNumber from "./components/reference-number";
import TransactionDate from "./components/transaction-Date";
import ReferenceDate from "./components/reference-Date";
import LedgerCode from "./components/ledger-code";
import Employee from "./components/cb-employee";
import DebitAccount from "./components/cb-debit-account";
import InvoiceValue from "./components/invoice-value";
import Project from "./components/cb-project";
import PartyLedger from "./components/cb-ledger";
import AccVoucherPrefix from "./components/voucher-prefix";
import AccVoucherNo from "./components/voucher-no";
import BtnAdd from "./components/btn-add";
import AccHeader from "./components/header";
import Urls from "../../../../redux/urls";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPLabel from "../../../../components/ERPComponents/erp-label";
import WarehouseID from "./components/warehouse-id ";
import RemarksInput from "./components/RemarksInput.";
import IsLockedCheckbox from "./components/IsLockedCheckbox";
import AutoCalculationCheckbox from "./components/AutoCalculationCheckbox";
import CashPaidSection from "./components/CashPaidSection";
import PriceCategoryCombobox from "./components/PriceCategoryCombobox";
import CostCentreCombobox from "./components/CostCentreCombobox";
import SupplyTypeCombobox from "./components/SupplyTypeCombobox";
import VatAmountLabel from "./components/VatAmountLabel";
import AdjustmentAmountInput from "./components/AdjustmentAmountInput";
import RoundOffInput from "./components/RoundOffInput";
import TotalTCSInput from "./components/TotalTCSInput";
import GrandTotalFcInput from "./components/GrandTotalFcInput";
import NetAmountInput from "./components/NetAmountInput";
import BillDiscountInput from "./components/BillDiscountInput";
import GrandTotalLabel from "./components/GrandTotalLabel";
import NetTotalLabel from "./components/NetTotalLabel";
import DataGridTest from "../../masters/test/dataGrid";
import GrnNumber from "./components/grn-Number";

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

const TransactionForm: React.FC<TransactionProps> = ({
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
      formState.transaction.master.invTransactionMasterId
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
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleButtonClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const [isPartyDetailsOpen, setIsPartyDetailsOpen] = useState(false);

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
    if (state.InventoryTransaction.formElements.pnlMasters?.disabled == true) {
      return false;
    }
    const selectedIndexes = e.component.getSelectedRowKeys();
    const row = formState?.transaction?.details.find(
      (x) => x.slNo == selectedIndexes[0]
    );
    if (selectedIndexes.length > 0 && row) {
      if (deviceInfo.isMobile) {
        setIsOpen(true);
      }
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
          formState.partyId && formState.partyId.trim() !== "";
        if (!ledgerCodeExists) {
          try {
            const id = Number.parseInt(formState.partyId ?? "");
          } catch (error) {}
        } else {
          dispatch(
            formStateMasterHandleFieldChange({
              fields: { ledgerID: 0, partyName: "" },
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
    loadAndSetTransVoucher,
    loadTransVoucher,
    setTransVoucher,
    deleteTransVoucher,
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
    // showBillwise,
    // billWiseExcludedTransactions,
    getDrCr,
    clearRow,
  } = useTransaction(
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
    const loadLedgerData = async () => {
      dispatch(
        formStateHandleFieldChange({
          fields: {
            ledgerDataLoading: true,
            ledgerBalanceLoading: true,
          },
        })
      );

      try {
        const _drcr = getDrCr(formState.transaction.master.voucherType);
        const ledgerID = formState.transaction.master.ledgerID;
        const { billwiseMandatory } =
          applicationSettings.accountsSettings ?? {};
        const isRowEdit = formState.isRowEdit;
        let formElmns = {
          ...formState.formElements,
        };
        if (!isNullOrUndefinedOrZero(ledgerID)) {
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
            formStateHandleFieldChange({
              fields: {
                ledgerBalance,
                groupName: ledgerData?.accGroupName,
                ledgerData,
                ledgerDataLoading: false,
              },
            })
          );
        } else {
          dispatch(
            formStateHandleFieldChange({
              fields: {
                ledgerBalance: 0,
                groupName: "",
                ledgerData: undefined,
              },
            })
          );
          dispatch(
            formStateHandleFieldChange({
              fields: { partyId: "" },
            })
          );
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
    };

    loadLedgerData();
  }, [formState.transaction.master.ledgerID]);

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

      let _formState: TransactionFormState;
      const isInvoker = voucherNo && voucherNo > 0;
      if (isInvoker) {
      }
      const softwareDate = moment(
        clientSession.softwareDate,
        "DD/MM/YYYY"
      ).local();

      console.log("masterAccountID = -2;");

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
      }
      const templates = formState.templates;
      const templatesData = formState.templatesData;
      const template = formState.template;
      if (!isInvoker) {
        const voucher: TransactionData = transactionInitialData;
        _formState = {
          ...TransactionFormStateInitialData,
          transaction: {
            ...voucher,
            master: {
              ...voucher.master,
              voucherType: voucherType ?? "",
              voucherPrefix: voucherPrefix ?? "",
              voucherForm: formType ?? "",
              transactionDate: softwareDate.toISOString(),
              referenceDate: moment().local().toISOString(),
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

          printOnSave: applicationSettings.accountsSettings?.printAccAftersave,
        };
      } else {
        _formState = await loadTransVoucher(
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

      let fieldsToUpdate = {
        ...initialFormElements,
        pnlMasters: { ...initialFormElements.pnlMasters, disabled: isInvoker },
        chkTaxNumber: {
          ...initialFormElements.chkTaxNumber,
          label: clientSession.isAppGlobal ? "GSTIN" : "VAT",
        },
      } as any;
      switch (voucherType) {
        case "PI":
          {
            fieldsToUpdate = {
              ...fieldsToUpdate,

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

          // focusLedgerCode();

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
          setTransVoucher(_formState, true);
        // Fetch templates asynchronously
      }
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
  // //     formStateTransactionMasterHandleFieldChange({
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
      dispatch(formStateHandleFieldChange({ fields: { templates: response } }));
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
        dataField: "code",
        caption: t("code"),
        width: 50,
        visible: true,
      },
      {
        dataField: "barCode",
        caption: t("bar_code"),
        width: 100,
        visible: true,
      },
      {
        dataField: "mBarcode",
        caption: t("m_barcode"),
        width: 70,
        visible: true,
      },
      {
        dataField: "itemBatchID",
        caption: t("item_batch_id"),
        width: 100,
        visible: true,
      },
      {
        dataField: "product",
        caption: t("product"),
        width: 150,
        visible: true,
        allowEditing:true
      },
      {
        dataField: "hsnCode",
        caption: t("hsn_code"),
        width: 72,
        visible: true,
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        width: 100,
        visible: false,
      },
      {
        dataField: "brand",
        caption: t("brand"),
        width: 40,
        visible: true,
      },
      {
        dataField: "warranty",
        caption: t("warranty"),
        width: 70,
        visible: true,
      },
      {
        dataField: "brandID",
        caption: t("brand_id"),
        width: 100,
        visible: true,
      },
      {
        dataField: "qty",
        caption: t("qty"),
        width: 40,
        visible: true,
      },
      {
        dataField: "free",
        caption: t("free"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit",
        caption: t("unit"),
        width: 40,
        visible: true,
      },
      {
        dataField: "unitID",
        caption: t("unit_id"),
        width: 100,
        visible: true,
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        width: 66,
        visible: true,
      },
      {
        dataField: "unitPrice",
        caption: t("unit_price"),
        width: 75,
        visible: true,
      },
      {
        dataField: "gross",
        caption: t("gross"),
        width: 75,
        visible: true,
      },
      {
        dataField: "discPercent",
        caption: t("disc_percent"),
        width: 40,
        visible: true,
      },
      {
        dataField: "discount",
        caption: t("discount"),
        width: 55,
        visible: true,
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
        width: 75,
        visible: true,
      },
      {
        dataField: "total",
        caption: t("total"),
        width: 80,
        visible: true,
      },
      {
        dataField: "stock",
        caption: t("stock"),
        width: 75,
        visible: true,
      },
      {
        dataField: "stockDetails",
        caption: t("stock_details"),
        width: 100,
        visible: true,
      },
      {
        dataField: "margin",
        caption: t("margin"),
        width: 50,
        visible: true,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        width: 67,
        visible: true,
      },
      {
        dataField: "lpr",
        caption: t("lpr"),
        width: 70,
        visible: false,
      },
      {
        dataField: "lpc",
        caption: t("lpc"),
        width: 70,
        visible: false,
      },
      {
        dataField: "sticker",
        caption: t("sticker"),
        width: 20,
        visible: false,
      },
      {
        dataField: "profit",
        caption: t("profit"),
        width: 75,
        visible: true,
      },
      {
        dataField: "size",
        caption: t("size"),
        width: 30,
        visible: false,
      },
      {
        dataField: "vatPercent",
        caption: t("vat_percent"),
        width: 35,
        visible: false,
      },
      {
        dataField: "vat",
        caption: t("vat"),
        width: 55,
        visible: false,
      },
      {
        dataField: "cst",
        caption: t("cst"),
        width: 100,
        visible: false,
      },
      {
        dataField: "cstPercent",
        caption: t("cst_percent"),
        width: 100,
        visible: false,
      },
      {
        dataField: "cost",
        caption: t("cost"),
        width: 60,
        visible: true,
      },
      {
        dataField: "batchNo",
        caption: t("batch_no"),
        width: 100,
        visible: false,
      },
      {
        dataField: "mr",
        caption: t("mr"),
        width: 30,
        visible: false,
      },
      {
        dataField: "mfdDate",
        caption: t("mfd_date"),
        width: 100,
        visible: false,
      },
      {
        dataField: "expDate",
        caption: t("exp_date"),
        width: 100,
        visible: false,
      },
      {
        dataField: "expDays",
        caption: t("exp_days"),
        width: 100,
        visible: false,
      },
      {
        dataField: "bd",
        caption: t("bd"),
        width: 30,
        visible: false,
      },
      {
        dataField: "pb",
        caption: t("pb"),
        width: 30,
        visible: false,
      },
      {
        dataField: "barcodePrinted",
        caption: t("barcode_printed"),
        width: 100,
        visible: false,
      },
      {
        dataField: "batchCreated",
        caption: t("batch_created"),
        width: 100,
        visible: false,
      },
      {
        dataField: "x",
        caption: t("x"),
        width: 20,
        visible: true,
      },
      {
        dataField: "productDescription",
        caption: t("product_description"),
        width: 100,
        visible: false,
      },
      {
        dataField: "sl",
        caption: t("sl"),
        width: 30,
        visible: false,
      },
      {
        dataField: "minSalePrice",
        caption: t("min_sale_price"),
        width: 70,
        visible: false,
      },
      {
        dataField: "additionalExpenses",
        caption: t("additional_expenses"),
        width: 60,
        visible: false,
      },
      {
        dataField: "unitPriceFC",
        caption: t("unit_price_fc"),
        width: 90,
        visible: false,
      },
      {
        dataField: "colour",
        caption: t("colour"),
        width: 70,
        visible: false,
      },
      {
        dataField: "nos",
        caption: t("nos"),
        width: 50,
        visible: false,
      },
      {
        dataField: "totalAddExpenses",
        caption: t("total_add_expenses"),
        width: 70,
        visible: false,
      },
      {
        dataField: "grossConvert",
        caption: t("gross_convert"),
        width: 50,
        visible: false,
      },
      {
        dataField: "grossFC",
        caption: t("gross_fc"),
        width: 75,
        visible: false,
      },
      {
        dataField: "unitD2",
        caption: t("unit_d2"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit2Qty",
        caption: t("unit2_qty"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit2SalesRate",
        caption: t("unit2_sales_rate"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit2MRP",
        caption: t("unit2_mrp"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit2MBarcode",
        caption: t("unit2_m_barcode"),
        width: 100,
        visible: false,
      },
      {
        dataField: "sq2",
        caption: t("sq2"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unitD3",
        caption: t("unit_d3"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit3Qty",
        caption: t("unit3_qty"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit3SalesRate",
        caption: t("unit3_sales_rate"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit3MRP",
        caption: t("unit3_mrp"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit3MBarcode",
        caption: t("unit3_m_barcode"),
        width: 100,
        visible: false,
      },
      {
        dataField: "sq3",
        caption: t("sq3"),
        width: 100,
        visible: false,
      },
      {
        dataField: "tagQty",
        caption: t("tag_qty"),
        width: 100,
        visible: false,
      },
      {
        dataField: "barcodeTagPrint",
        caption: t("barcode_tag_print"),
        width: 100,
        visible: false,
      },
      {
        dataField: "barcodeUnit2Print",
        caption: t("barcode_unit2_print"),
        width: 100,
        visible: false,
      },
      {
        dataField: "barcodeUnit3Print",
        caption: t("barcode_unit3_print"),
        width: 100,
        visible: false,
      },
      {
        dataField: "location",
        caption: t("location"),
        width: 100,
        visible: false,
      },
      {
        dataField: "grTransDetails",
        caption: t("gr_trans_details"),
        width: 100,
        visible: false,
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        width: 100,
        visible: false,
      },
      {
        dataField: "supplierPCode",
        caption: t("supplier_p_code"),
        width: 100,
        visible: false,
      },
      {
        dataField: "poTransDetails",
        caption: t("po_trans_details"),
        width: 100,
        visible: false,
      },
      {
        dataField: "rate",
        caption: t("rate"),
        width: 100,
        visible: false,
      },
      {
        dataField: "warehouse",
        caption: t("warehouse"),
        width: 100,
        visible: false,
      },
      {
        dataField: "sortOrder",
        caption: t("sort_order"),
        width: 100,
        visible: false,
      },
      {
        dataField: "profitPercent",
        caption: t("profit_percent"),
        width: 100,
        visible: false,
      },
      {
        dataField: "schemeDisc",
        caption: t("scheme_disc"),
        width: 100,
        visible: false,
      },
      {
        dataField: "memo",
        caption: t("memo"),
        width: 100,
        visible: false,
      },
      {
        dataField: "me",
        caption: t("me"),
        width: 100,
        visible: false,
      },
      {
        dataField: "rowNumber",
        caption: t("row_number"),
        width: 55,
        visible: true,
      },
      {
        dataField: "actualSalesPrice",
        caption: t("actual_sales_price"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit2",
        caption: t("unit2"),
        width: 100,
        visible: false,
      },
      {
        dataField: "unit3",
        caption: t("unit3"),
        width: 100,
        visible: false,
      },
      {
        dataField: "cgstPercent",
        caption: t("cgst_percent"),
        width: 60,
        visible: true,
      },
      {
        dataField: "cgst",
        caption: t("cgst"),
        width: 65,
        visible: true,
      },
      {
        dataField: "sgstPercent",
        caption: t("sgst_percent"),
        width: 60,
        visible: true,
      },
      {
        dataField: "sgst",
        caption: t("sgst"),
        width: 65,
        visible: true,
      },
      {
        dataField: "igstPercent",
        caption: t("igst_perc_percent"),
        width: 60,
        visible: false,
      },
      {
        dataField: "igst",
        caption: t("igst"),
        width: 65,
        visible: false,
      },
      {
        dataField: "cessPercent",
        caption: t("cess_percent"),
        width: 60,
        visible: true,
      },
      {
        dataField: "cessAmt",
        caption: t("cess_amt"),
        width: 65,
        visible: true,
      },
      {
        dataField: "addnlCessPercent",
        caption: t("addnl_cess_percent"),
        width: 60,
        visible: false,
      },
      {
        dataField: "addnlCessAmt",
        caption: t("addnl_cess_amt"),
        width: 61,
        visible: true,
      },
      {
        dataField: "mrpFinal",
        caption: t("mrp"),
        width: 100,
        visible: true,
      },
      // {
      //   dataField: "action",
      //   caption: t("action"),
      //   visible: true,
      //   cellRenderDynamicRootState: (
      //     cellElement: any,
      //     cellInfo: any,
      //     state: RootState
      //   ) =>
      //     state.InventoryTransaction.formElements.pnlMasters?.disabled ==
      //     true ? null : (
      //       <button
      //         onClick={(e) => {
      //           e.preventDefault();
      //           handleRemoveItem(cellElement.rowIndex);
      //         }}
      //         // disabled={
      //         //   (formState.isRowEdit &&
      //         //     cellElement.data.transactionDetailID ==
      //         //       formState.row.transactionDetailID) ||
      //         //   formState.formElements.pnlMasters?.disabled
      //         // }
      //         className="ti-btn-link"
      //         type="button"
      //       >
      //         <i
      //           className="ri-delete-bin-5-line delete-icon"
      //           title={t("remove")}
      //         ></i>
      //       </button>
      //     ),
      // },
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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
      setIsHistorySidebarOpen((prev) => !prev);
      // }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };
//for demo purpouse 
// Define the structure of an empty row based on visible columns
const getEmptyRow = useCallback(() => {
  const emptyRow: any = {};
  columns.forEach((col) => {
    if (col.dataField) {
      switch (col.dataField) {
        case "slNo":
          emptyRow[col.dataField] = 1; // Start with 1 for serial number
          break;
        case "qty":
        case "free":
        case "mrp":
        case "unitPrice":
        case "gross":
        case "discPercent":
        case "discount":
        case "netValue":
        case "total":
        case "stock":
        case "margin":
        case "salesPrice":
        case "lpr":
        case "lpc":
        case "profit":
        case "size":
        case "vatPercent":
        case "vat":
        case "cst":
        case "cstPercent":
        case "cost":
        case "mr":
        case "expDays":
        case "bd":
        case "pb":
        case "nos":
        case "unitPriceFC":
        case "grossFC":
        case "unit2Qty":
        case "unit2SalesRate":
        case "unit2MRP":
        case "unit3Qty":
        case "unit3SalesRate":
        case "unit3MRP":
        case "tagQty":
        case "additionalExpenses":
        case "totalAddExpenses":
        case "grossConvert":
        case "sq2":
        case "sq3":
        case "rowNumber":
        case "cgstPercent":
        case "cgst":
        case "sgstPercent":
        case "sgst":
        case "igstPercent":
        case "igst":
        case "cessPercent":
        case "cessAmt":
        case "addnlCessPercent":
        case "addnlCessAmt":
        case "mrpFinal":
          emptyRow[col.dataField] = 0; // Numeric fields default to 0
          break;
        case "barcodePrinted":
        case "batchCreated":
        case "barcodeTagPrint":
        case "barcodeUnit2Print":
        case "barcodeUnit3Print":
          emptyRow[col.dataField] = false; // Boolean fields default to false
          break;
        default:
          emptyRow[col.dataField] = ""; // String fields default to empty string
          break;
      }
    }
  });
  return emptyRow;
}, [columns]);
const [data, setData] = useState<any[]>(() => {
  return formState.transaction.details.length > 0
    ? formState.transaction.details
    : [getEmptyRow()];
});
useEffect(() => {
  setData(
    formState.transaction.details.length > 0
      ? formState.transaction.details
      : [getEmptyRow()]
  );
}, [formState.transaction.details, getEmptyRow]);

const handleAddData = (newItem: any) => {
  setData((prev) => [...prev, newItem]);
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

  const handleChange = (selectedOption: { value: string; label: string }) => {};

  const goToPreviousPage = () => {
    window.history.back();
  };
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const taxData = [
    { label: "SGST", value: 0 },
    { label: "CGST", value: 0 },
    { label: "IGST", value: 0 },
    { label: "CESS", value: 0 },
    { label: "AddCESS", value: 0 },
  ];

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
              {/* <TransactionUserConfig /> */}
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
                  deleteTransVoucher={deleteTransVoucher}
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
              <>
                {/* Expanded View - First Row */}
                <div className="flex flex-wrap items-center gap-1">
                  <AccVoucherPrefix
                    ref={voucherNumberRef}
                    formState={formState}
                    dispatch={dispatch}
                    handleKeyDown={handleKeyDown}
                    loadAndSetTransVoucher={loadAndSetTransVoucher}
                    t={t}
                  />
                  <AccVoucherNo
                    ref={voucherNumberRef}
                    formState={formState}
                    dispatch={dispatch}
                    handleKeyDown={handleKeyDown}
                    loadAndSetTransVoucher={loadAndSetTransVoucher}
                    t={t}
                  />
                  <ReferenceNumber
                    formState={formState}
                    dispatch={dispatch}
                    handleLoadByRefNo={handleLoadByRefNo}
                    ref={refNoRef}
                    t={t}
                  />
                  <ReferenceDate
                    dispatch={dispatch}
                    formState={formState}
                    t={t}
                  />
                  <TransactionDate
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                  />
                  <Employee
                    dispatch={dispatch}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                  <DebitAccount
                    dispatch={dispatch}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                  <Project
                    dispatch={dispatch}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                  <InvoiceValue
                    dispatch={dispatch}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
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
                    <ERPButton
                      title={t("Grn_Number")}
                      onClick={handleButtonClick}
                      // onClick={() => goToPreviousPage()}
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                    />
                    {isModalOpen && (
                    <ERPModal
                      isOpen={isModalOpen}
                      title="GrnNumber"
                      width={500}
                      height={300}
                      closeModal={closeModal} // Close modal on close action
                      content={
                      <GrnNumber
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                      handleLoadByRefNo={handleLoadByRefNo}

                      />
                    }
                    />
                  )}
                    <LedgerCode
                      ref={ledgerCodeRef}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                    <PartyLedger
                      ref={ledgerIdRef}
                      handleFieldKeyDown={handleFieldKeyDown}
                      triggerEffect={triggerEffect}
                      handleKeyDown={handleKeyDown}
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                      setIsPartyDetailsOpen={() => {
                        setIsPartyDetailsOpen((prev: any) => {
                          debugger;
                          return !prev;
                        });
                      }}
                    />
                    <div>
                      <span> more </span>
                    </div>
                  </div>
                </>
              </>
            </div>
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
            {/* <ErpDevGrid
              key={key}
              GridPreferenceChooserTrance
              heightToAdjustOnWindows={formState.userConfig?.gridHeight ?? 700}
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
            ></ErpDevGrid> */}

<DataGridTest
  data={data}
  columns={columns}
  keyField={key}
  height={gridHeight}
  gridId={`${gridCode}-grid`}
  onAddData={handleAddData}
/>
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
                  formStateHandleFieldChange({
                    fields: { showSaveDialog: false },
                  })
                );
              }}
              onCancel={() =>
                dispatch(
                  formStateHandleFieldChange({
                    fields: { showSaveDialog: false },
                  })
                )
              }
            />
          )}
        </div>
      )}

      <div
        className="flex items-center justify-between h-[500px] z-10 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width lg:px-8 py-2 md:px-2"
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
                    formStateHandleFieldChange({
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
                      formStateHandleFieldChange({
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

            <button className="text-blue-600">
              <span
                className="hover:underline text-[#0ea5e9] capitalize"
                onClick={selectAttachment}
              >
                {t("attachment")}
              </span>
            </button>

            <WarehouseID
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              handleFieldKeyDown={handleFieldKeyDown}
            />

            <RemarksInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
            />
            <IsLockedCheckbox formState={formState} dispatch={dispatch} t={t} />
            <AutoCalculationCheckbox
              formState={formState}
              dispatch={dispatch}
              t={t}
            />

            <CashPaidSection
              formState={formState}
              dispatch={dispatch}
              t={t}
              focusDiscount={focusDiscount}
              focusAmount={focusAmount}
            />

            <PriceCategoryCombobox
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleFieldKeyDown={handleFieldKeyDown}
              handleKeyDown={handleKeyDown}
            />

            <CostCentreCombobox
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleFieldKeyDown={handleFieldKeyDown}
              handleKeyDown={handleKeyDown}
            />

            <SupplyTypeCombobox
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              handleFieldKeyDown={handleFieldKeyDown}
            />

            <VatAmountLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              taxData={taxData}
            />

            <AdjustmentAmountInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
            />

            <RoundOffInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              focusDiscount={() => {
                document.getElementById("discountID")?.focus();
              }}
              focusAmount={() => {
                document.getElementById("amountID")?.focus();
              }}
            />

            <TotalTCSInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
            />

            <GrandTotalFcInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
            />

            <NetAmountInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
            />

            <BillDiscountInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
            />

            <GrandTotalLabel formState={formState} dispatch={dispatch} t={t} />

            <NetTotalLabel formState={formState} dispatch={dispatch} t={t} />
          </div>
        </div>

        {/* </div> */}
        <div className="hidden md:block mr-2">
          <h6 className="font-semibold whitespace-nowrap text-[20px] ">
            {" "}
            <span className="!font-medium !text-gray-600">{t("total")}: </span>
            {getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}
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
              formStateHandleFieldChange({ fields: { printPreview: false } })
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
      {isPartyDetailsOpen && (
        <CustomerDetailsSidebar
          displayType="none"
          isOpen={isPartyDetailsOpen}
          setIsOpen={setIsPartyDetailsOpen}
        />
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
      <ERPResizableSidebar
        minWidth={350}
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
        children={<ERPAttachment setIsOpen={setIsHistoryOpen} />}
      ></ERPResizableSidebar>
      {formState.openUnsavedPrompt == true && (
        <UnsavedChangesModal
          isOpen={formState.openUnsavedPrompt == true}
          onClose={() => {
            dispatch(
              formStateHandleFieldChange({
                fields: {
                  openUnsavedPrompt: false,
                },
              })
            );
          }}
          onStay={() => {
            dispatch(
              formStateHandleFieldChange({
                fields: {
                  openUnsavedPrompt: false,
                },
              })
            );
          }}
          onLeave={async () => {
            const ret = await loadAndSetTransVoucher(
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
      {transactionType !== "" && (
        <HistorySidebar
          transactionType={transactionType ?? ""}
          isOpen={isHistorySidebarOpen}
          onClose={() => setIsHistorySidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionForm;
