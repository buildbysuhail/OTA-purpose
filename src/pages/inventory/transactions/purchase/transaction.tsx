import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TransactionProps,
  TransactionDetail,
} from "./transaction-types";
import {
  TransactionData,
  TransactionFormState,
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
  Menu,
  Bookmark,
  ChevronDown,
  Heart,
  Star,
  Sun,
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
import DataGridTest from "../../../../components/ERPComponents/erp-purchase-grid/dataGrid";
import GrnNumber from "./components/grn-Number";
import BottomSidebar from "../../../../components/ERPComponents/bottom-sidebar";
import BottomSidebarGrid from "./bottom-sidebar-grid";
import ProductSummary from "./components/Product-summary";
import ProductSummaryMaster from "../../reports/product-summary/product-summary-master";
import PartySummaryMaster from "../../../accounts/reports/partywise-summary/party-summary-master";
import { transactionInitialData, TransactionFormStateInitialData, initialFormElements } from "./transaction-type-data";
import ErpPurchaseGrid from "../../../../components/ERPComponents/erp-purchase-grid/dataGrid";


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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const SIDEBAR_WIDTH = "196px";

  const [isDropUpOpen, setIsDropUpOpen] = useState(false);

  const toggleDropup = () => {
    setIsDropUpOpen(!isDropUpOpen);
  };

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
      (x: any) => x.slNo == selectedIndexes[0]
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
          } catch (error) { }
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
            (x: any) => x.templateGroup == _formState.transaction.master.voucherType
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

  const [data, setData] = useState<any[]>(formState.transaction.details);
  const handleAddData = (newItem: any) => {
    setData((prev) => [...prev, newItem]);
  };

  const purchaseGridCol : DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "slNo",
        caption: t("sl_no"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        isLocked: true,
        
      },
      {
        dataField: "pCode",
        caption: t("p_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible: false,
      },
      {
        dataField: "barCode",
        caption: t("bar_code"),
        dataType: "string",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "productBatchID",
        caption: t("product_batch_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "product",
        caption: t("product"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing:true,
        minWidth: 200,
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "brand",
        caption: t("brand"),
        dataType: "string",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "brandID",
        caption: t("brand_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "qty",
        caption: t("qty"),
        dataType: "number",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "free",
        caption: t("free"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit",
        caption: t("unit"),
        dataType: "string",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "unitID",
        caption: t("unit_id"),
        dataType: "number",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unitPrice",
        caption: t("unit_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "gross",
        caption: t("gross"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "discPerc",
        caption: t("disc_perc"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "discount",
        caption: t("discount"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "total",
        caption: t("total"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "manualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "stockDetails",
        caption: t("stock_details"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        minWidth: 200,
      },
      {
        dataField: "margin",
        caption: t("margin"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "lpr",
        caption: t("lpr"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "lpc",
        caption: t("lpc"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "stickerQty",
        caption: t("sticker_qty"),
        dataType: "number",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "profit",
        caption: t("profit"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "size",
        caption: t("size"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "vatPerc",
        caption: t("vat_perc"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "vatAmount",
        caption: t("vat_amount"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cst",
        caption: t("cst"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cstPerc",
        caption: t("cst_perc"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cost",
        caption: t("cost"),
        dataType: "number",
        allowSorting: true,
        allowEditing:true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "batchNo",
        caption: t("batch_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "mfdDate",
        caption: t("mfd_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowEditing:true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "expDate",
        caption: t("exp_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "expDays",
        caption: t("exp_days"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "bd",
        caption: t("bd"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "btnPrintBarcode",
        caption: t("btn_print_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 250,
      },
      {
        dataField: "barcodePrinted",
        caption: t("barcode_printed"),
        dataType: "boolean",
        allowSorting: true,
        visible: false,
        allowSearch: true,
        allowFiltering: true,
        width: 250,
      },
      {
        dataField: "batchCreated",
        caption: t("batch_created"),
        dataType: "boolean",
        visible: false,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "removeCol",
        caption: t("remove_col"),
        dataType: "boolean",
        visible: false,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "productDescription",
        caption: t("product_description"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 250,
      },
      {
        dataField: "serial",
        caption: t("serial"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "minSalePrice",
        caption: t("min_sale_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "additionalExpense",
        caption: t("additional_expense"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 250,
      },
      {
        dataField: "unitPriceFC",
        caption: t("unit_price_fc"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "colour",
        caption: t("colour"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "warranty",
        caption: t("warranty"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "nosQty",
        caption: t("nos_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "totalAddExpense",
        caption: t("total_add_expense"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 180,
      },
      {
        dataField: "grossConvert",
        caption: t("gross_convert"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 140,
      },
      {
        dataField: "grossFC",
        caption: t("gross_fc"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unitID2",
        caption: t("unit_id_2"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit2Qty",
        caption: t("unit_2_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit2SalesRate",
        caption: t("unit_2_sales_rate"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "unit2MRP",
        caption: t("unit_2_mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit2MBarcode",
        caption: t("unit_2_m_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "unit2StickerQty",
        caption: t("unit_2_sticker_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "unitID3",
        caption: t("unit_id_3"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit3Qty",
        caption: t("unit_3_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit3SalesRate",
        caption: t("unit_3_sales_rate"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "unit3MRP",
        caption: t("unit_3_mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit3MBarcode",
        caption: t("unit_3_m_barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 180,
      },
      {
        dataField: "unit3StickerQty",
        caption: t("unit_3_sticker_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 180,
      },
      {
        dataField: "tagQty",
        caption: t("tag_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "barcodeTagPrinted",
        caption: t("barcode_tag_printed"),
        dataType: "boolean",
        visible: false,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 250,
      },
      {
        dataField: "barcodeUnit2Printed",
        caption: t("barcode_unit_2_printed"),
        dataType: "boolean",
        visible: false,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 280,
      },
      {
        dataField: "barcodeUnit3Printed",
        caption: t("barcode_unit_3_printed"),
        dataType: "boolean",
        visible: false,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 280,
      },
      {
        dataField: "location",
        caption: t("location"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "grTransDetailsID",
        caption: t("gr_trans_details_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "supplierReferenceProductCode",
        caption: t("supplier_reference_product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 280,
      },
      {
        dataField: "poTransDetailsID",
        caption: t("po_trans_details_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 180,
      },
      {
        dataField: "ratePlusTax",
        caption: t("rate_plus_tax"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "warehouseID",
        caption: t("warehouse_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "sortOrder",
        caption: t("sort_order"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "profitPercentage",
        caption: t("profit_percentage"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 140,
      },
      {
        dataField: "schemeDiscount",
        caption: t("scheme_discount"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 140,
      },
      {
        dataField: "memo",
        caption: t("memo"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
      },
      {
        dataField: "memoEditor",
        caption: t("memo_editor"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "rowNumber",
        caption: t("row_number"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "actualSalesPrice",
        caption: t("actual_sales_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "unit2",
        caption: t("unit_2"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "unit3",
        caption: t("unit_3"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "btnPrintBarcodeStd",
        caption: t("btn_print_barcode_std"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 250,
      },
    ],
    []
);
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

  const handleChange = (selectedOption: { value: string; label: string }) => { };

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
  const [isOpentwo, setIsOpentwo] = useState(false)

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    fontWeight: "medium",
    cursor: "pointer",
    border: "none",
    marginTop: "16px",
  }


  const sidebarHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    marginBottom: "3px",
  }

  const sidebarTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
  }

  const closeButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    color: "#374151",
    border: "1px solid #e5e7eb",
    // padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  }
  const handleCellChange = (rowIndex: number, dataField: string, value: any) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [dataField]: value };
      return newData;
    });
  };
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

          <div className="mt-8 flex items-end gap-4">
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
            <TransactionDate
              formState={formState}
              dispatch={dispatch}
              t={t}
            />

            <div className="relative w-auto">
              <button
                onClick={toggleDropdown}
                className="text-white font-bold p-2 rounded-lg w-auto inline-flex justify-between items-center shadow-md mb-1"
              // className="bg-[#FDBA74] hover:bg-[#FB923C] text-white font-bold py-2 px-4 rounded-lg w-auto inline-flex justify-between items-center shadow-md"
              >
                <div className="flex items-center space-x-2">
                  <EllipsisVertical size={16} className="text-black" />
                  {/* <Menu size={16} className="text-white" /> */}
                  {/* <span>more</span> */}
                </div>
                {/* <div className={`ml-2 transition-all duration-500 ${isDropDownOpen ? 'rotate-180 opacity-100' : 'opacity-80'}`}>
                  <ChevronDown size={16} className="text-white" />
                </div> */}
              </button>

              <div
                ref={dropdownRef}
                className={`mt-2 bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out border border-gray-200 absolute right-0 z-40 w-full ${isDropDownOpen ? 'opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'
                  }`}
                style={{
                  marginLeft: 0,
                  width: `calc(96vw - ${SIDEBAR_WIDTH})`,
                  maxWidth: "calc(100vw - 220px)"
                }}
              >
                <div ref={contentRef} className="p-6">
                  <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-center gap-1">
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
                        width={600}
                        height={200}
                        closeModal={closeModal}
                        content={
                          <GrnNumber
                            dispatch={dispatch}
                            formState={formState}
                            t={t}
                            handleLoadByRefNo={handleLoadByRefNo}
                            handleFieldChange={handleFieldChange}
                            closeModal={closeModal}

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
                  </div>

                  <div className="flex justify-center mt-4 mb-2">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#FEFEFE] shadow-md transform transition-transform duration-300 hover:scale-110"
                    >
                      <ChevronUp size={20} className="text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ErpPurchaseGrid
            columns={purchaseGridCol}
            keyField={"productID"}
            height={gridHeight}
            gridId={`${gridCode}-grid`}
            onAddData={handleAddData}
            onCellChange={handleCellChange}
          />

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
            {/* <div
              className={
                formState.userConfig?.isExpanded
                  ? "grid grid-rows-2 !mt-[35px]"
                  : "grid grid-cols-2 gap-8 !mt-[35px]"
              }
            >
              <>
                Expanded View - First Row

                <>
                  
                </>
              </>
            </div> */}

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
        className="z-10 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width lg:px-3 py-2 md:px-2"
        style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }}>

        <div className="relative w-full">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
            <button
              onClick={toggleDropup}
              className={`group flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 bg-[#f8f8ff] shadow-md transition-all duration-300 
              ${isDropUpOpen ? 'bg-gray-100' : ''} hover:bg-white hover:shadow-lg`}
            >
              <ChevronUp
                className={`transition-transform duration-500 text-gray-700 
                ${isDropUpOpen ? 'transform rotate-180' : hasAnimated ? '' : 'animate-[bounce_2s_1]'} 
                group-hover:text-black`}
                size={24}
              />
            </button>
          </div>
        </div>

        {/* Dropdown content */}
        <div className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropUpOpen ? 'max-h-[50vh] mb-6' : 'max-h-0'}`}>
          <div className="p-4 md:p-6 bg-white border border-gray-300 rounded-t-lg shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              <div className="w-full">
                <WarehouseID
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
              <div className="w-full">
                <RemarksInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                />
              </div>
              <div className="w-full">
                <PriceCategoryCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleFieldKeyDown={handleFieldKeyDown}
                  handleKeyDown={handleKeyDown}
                />
              </div>
              <div className="w-full">
                <CostCentreCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleFieldKeyDown={handleFieldKeyDown}
                  handleKeyDown={handleKeyDown}
                />
              </div>
              <div className="w-full">
                <SupplyTypeCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
              <div className="w-full">
                <AdjustmentAmountInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-end gap-1">
            <div className="grid grid-cols-1">
              <ERPButton
                title={t("bottom sidebar")}
                // onClick={handleButtonClick}
                // onClick={() => goToPreviousPage()}
                onClick={() => setIsOpentwo(true)}
                className="w-[150px]"
                localInputBox={formState?.userConfig?.inputBoxStyle}
              />
            </div>

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

            <div className="flex items-center gap-2">
              <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
                <button className="text-blue-600">
                  <span className="hover:underline text-[#0ea5e9] capitalize" onClick={selectAttachment}>
                    {t("attachment")}
                  </span>
                </button>
                <CashPaidSection
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  focusDiscount={focusDiscount}
                  focusAmount={focusAmount}
                />
              </div>

              <div className="flex flex-col xl:flex-row items-end gap-1">
                <RoundOffInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  focusDiscount={() => { document.getElementById("discountID")?.focus(); }}
                  focusAmount={() => { document.getElementById("amountID")?.focus(); }}
                />

                <BillDiscountInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="grid grid-cols-1 gap-1">
              <NetAmountInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
              />

              <VatAmountLabel
                formState={formState}
                dispatch={dispatch}
                t={t}
                taxData={taxData}
              />

              <GrandTotalLabel
                formState={formState}
                dispatch={dispatch}
                t={t}
              />

              <NetTotalLabel
                formState={formState}
                dispatch={dispatch}
                t={t}
              />
            </div>

            <div className="flex items-center gap-2">
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
                  disabled={formState.formElements.pnlMasters?.disabled}
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
          </div>
        </div>

        {/* <div className="flex items-center justify-between">
          <div className="flex w-full">

            <BottomSidebar isOpen={isOpen} setIsOpen={setIsOpen} minHeight={200} maxHeight={600} initialHeight={400} children={undefined}/>
            <div className="grid grid-cols-1 sm:grid-cols-3 max-w-[990px]:grid-cols-3 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:gap-4">
              <IsLockedCheckbox
                formState={formState}
                dispatch={dispatch}
                t={t}
              />

              <AutoCalculationCheckbox
                formState={formState}
                dispatch={dispatch}
                t={t}
              />

              <div className="flex flex-wrap justify-between items-center">

              </div>
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
            </div>
          </div>

          </div>

        </div> */}
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
        />
      )}

      {formState.isProductSummaryOpen && (
        <ERPModal
          isOpen={formState.isProductSummaryOpen}
          title={t("product_summary")}
          width={1000}
          height={700}
          isForm={true}
          initialMaximize={true}
          closeModal={() => dispatch(formStateHandleFieldChange({ fields: { isProductSummaryOpen: false } }))}
          content={
            <ProductSummaryMaster
            />
          }
        />
      )}

      {formState.isPartyWiseSummaryOpen && (
        <ERPModal
          isOpen={formState.isPartyWiseSummaryOpen}
          title={t("party_wise_summary")}
          width={1000}
          height={700}
          isForm={true}
          initialMaximize={true}
          closeModal={() => dispatch(formStateHandleFieldChange({ fields: { isPartyWiseSummaryOpen: false } }))}
          content={
            <PartySummaryMaster />
          }
        />
      )}

      {isPartyDetailsOpen && (
        <CustomerDetailsSidebar
          displayType="none"
          isOpen={isPartyDetailsOpen}
          setIsOpen={setIsPartyDetailsOpen}
        />
      )}

      <BottomSidebar isOpen={isOpentwo} setIsOpen={setIsOpentwo} minHeight={200} maxHeight={600} initialHeight={400}>
        <div>
          <div style={sidebarHeaderStyle}>
            {/* <h2 style={sidebarTitleStyle}>Bottom Sidebar</h2> */}
            <button style={closeButtonStyle} onClick={() => setIsOpentwo(false)}>
              <X />
            </button>
          </div>

          {/* <p className="mb-[24px] text-[#6b7280]">
            This sidebar for test.
          </p> */}

          {/* <BottomSidebarGrid /> */}
          {/* <BottomSidebarGrid sidebarHeight={sidebarHeight} /> */}
        </div>
      </BottomSidebar>

      <ERPResizableSidebar
        minWidth={350}
        isOpen={isTemplateOpen}
        setIsOpen={setIsTemplateOpen}
        children={<TemplatesView setIsOpen={setIsTemplateOpen} />}
      />

      <ERPResizableSidebar
        minWidth={350}
        isOpen={isAttachmentOpen}
        setIsOpen={setIsAttachmentOpen}
        children={<ERPAttachment setIsOpen={setIsAttachmentOpen} />}
      />

      <ERPResizableSidebar
        minWidth={350}
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
        children={<ERPAttachment setIsOpen={setIsHistoryOpen} />}
      />

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
