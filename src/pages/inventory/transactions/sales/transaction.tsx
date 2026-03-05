import { X } from "lucide-react";
import moment from "moment";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { DeepPartial } from "redux";
import BottomSidebar from "../../../../components/ERPComponents/bottom-sidebar";
import ERPAttachment from "../../../../components/ERPComponents/erp-attachment";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPPreviousUrlButton from "../../../../components/ERPComponents/erp-previous-uirl-button";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { LedgerType } from "../../../../enums/ledger-types";
import VoucherType from "../../../../enums/voucher-types";
import { APIClient } from "../../../../helpers/api-client";
import { useUserRights } from "../../../../helpers/user-right-helper";
import { getApLocalDataByUrl } from "../../../../redux/cached-urls";
import { toggleIsPrintPreviewPopup } from "../../../../redux/slices/popup-reducer";
import { RootState } from "../../../../redux/store";
import Urls from "../../../../redux/urls";
import { getInitialPreference } from "../../../../utilities/dx-grid-preference-updater";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import { safeBase64Decode, customJsonParse } from "../../../../utilities/jsonConverter";
import { getStorageString } from "../../../../utilities/storage-utils";
import { isEnterKey, generateUniqueKey, remToPx } from "../../../../utilities/Utils";
import PartySummaryMaster from "../../../accounts/reports/partywise-summary/party-summary-master";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";
import DownloadBarcodePreview from "../../../LabelDesigner/download-preview-barcode";
import { ApplicationMainSettings, ApplicationMainSettingsInitialState } from "../../../settings/system/application-settings-types/application-settings-types-main";
import CustomerDetailsSidebar from "../../../transaction-base/customer-details";
import TemplatesPreView from "../../../transaction-base/transaction-print-preview";
import ProductSummaryMaster from "../../reports/other-inventory-reports/product-summary/product-summary-master";
import { formStateHandleFieldChangeKeysOnly, resetState, formStateHandleFieldChange, updateFormElement, formStateTransactionDetailsRowAdd } from "../reducer";
import DeletingOverlay from "../transaction-deleting";
import SavingOverlay from "../transaction-saving";
import { initialUserConfig, transactionInitialData, TransactionFormStateInitialData, initialFormElements, initialInventoryTotals, initialTransactionDetailData } from "../transaction-type-data";
import { TransactionProps, UserConfig, TransactionDetail, TransactionFormState, TransactionData, SummaryItems, GridQtyFactors, ColumnModel, GridQtyFactorsM, FormElementsState, TransactionMaster, CommonParams } from "../transaction-types";
import BatchEntryModal from "./batch-entry";
import ObjectViewer from "./components/fomstate-view";
import Header from "./components/header";
import DocumentProperties from "./document-properties";
import GridTheme from "./grid-theme";
import HistorySidebar from "./historySidebar";
import ItemListModal from "./item-list";
import MemoEditorModal from "./memo-editor";
import ProductBatchUnitDetails from "./product-batch-unit-details";
import ProductInformation from "./product-information";
import ProductInfoSlideUp from "./productInfo";
import QtyFactorsModal from "./qty-factors";
import Serials from "./serials";
import Flavours from "./flavours";
import TransactionFooter from "./transaction-footer";
import TransactionHeader from "./transaction-header";
import UnsavedChangesModal from "./unsavedChangesModal";
import { useTransaction } from "./use-transaction";
import BillWisePopup from "../../../transaction-base/billwise-popup";
import ErpPurchaseGrid from "../../../../components/ERPComponents/erp-purchase-grid/dataGrid";
import PosFooter from "./pos-components/pos-footer";
import PosHeader from "./pos-components/pos-header";
import PosSideMenu from "./pos-components/pos-side-menu";
import { fetchUserConfig } from "../transaction-utils";
import MQtyFactorsModal from "./mqty-factors";
import { merge } from "lodash";
import { AuthorizationModal } from "./components/AuthorizationSales";
import DateChangeModal from "./components/dateChange";
import EWayBillDetails from "./e-way-bill-details";
import FlavoursFlv from "./flavours-flv";

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
  isPos = false,
  isEdit = false
  // localInputBox,
}) => {
  const [_st, setSt] = useState<UserConfig>(initialUserConfig);

  useEffect(() => {
    const fetchData = async () => {
      const key = btoa(`${userSession.userId}-${transactionType}_LocalSettings`);
      const storedUtc = await getStorageString(key); // use get, not set
      if (storedUtc &&
        storedUtc !== "" &&
        storedUtc !== "undefined" &&
        storedUtc !== "null" &&
        storedUtc !== undefined &&
        storedUtc !== null) {
        const decoded = safeBase64Decode(storedUtc) ?? "{}";
        setSt(customJsonParse(decoded));
      }
    };

    fetchData();
  }, []);

  const [triggerEffect, setTriggerEffect] = useState(false);

  // Footer height state for dynamic grid height calculation
  const [footerHeight, setFooterHeight] = useState<number>(0);

  // Window height state for dynamic grid height on resize
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  // Callback handler for footer height changes
  const handleFooterHeightChange = useCallback((height: number) => {
    setFooterHeight(height);
  }, []);

  // Window resize listener for dynamic grid height update
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClearControls = async () => {
    // 1) Guard: check voucher locked
    // if (formState?.transaction?.master?.isLocked) {
    //   ERPAlert.show({
    //     title: t("warning"),
    //     text: t("voucher_is_locked"),
    //     icon: "warning",
    //   });
    //   return;
    // }

    try {
      // 2) Ask for confirmation
      const result: any = await ERPAlert.show({
        title: t("clearing_transaction_question"),
        // text: t("one_clearing_this_transaction_cannot_be_recovered"),
        text: t("clearing_transaction_question"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
      });

      console.log("ERPAlert result:", result);

      // 3) Normalize confirmation result (supports multiple shapes)
      const confirmed =
        !!result &&
        (result.isConfirmed === true ||
          result.value === true ||
          result === true);

      if (!confirmed) {
        // user cancelled
        return;
      }

      // 4) Call clearControls and await if it returns a promise
      console.log("Calling clearControls...", {
        isEdit: formState?.isEdit,
        id: formState?.transaction?.master?.invTransactionMasterID,
      });

      const maybePromise = clearControls(
        true, // loadNextVrNo
        true, // clearMannualInvoiceNumber
        false // don't focus first grid row when invoked from header button
      );

      if (maybePromise && typeof maybePromise.then === "function") {
        await maybePromise;
      }

      // 5) Force UI refresh if you used that pattern earlier (uncomment/wire setTriggerEffect)
      if (typeof setTriggerEffect === "function") {
        // toggle to force re-render/update data grid etc.
        setTriggerEffect((prev: any) => !prev);
      }

      // ERPAlert.show({
      //   title: t("success"),
      //   text: t("controls_cleared_successfully"),
      //   icon: "success",
      // });
    } catch (err) {
      console.error("Error in handleClearControls:", err);
      ERPAlert.show({
        title: t("error"),
        text: t("something_went_wrong_clearing_controls"),
        icon: "error",
      });
    }
  };

  const { t } = useTranslation("transaction");
  const popupData = useSelector((state: RootState) => state?.PopupData);
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const formState = useSelector(
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
  const ledgerIdRef = useRef<HTMLInputElement>(null);
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
  const mobileNumRef = useRef<HTMLInputElement>(null);
  const transactionDateRef = useRef<HTMLInputElement>(null);
  const taxNoRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const chequeStatusRef = useRef<HTMLInputElement>(null);
  const employeeRef = useRef<HTMLInputElement>(null);
  const hasTriggeredEditRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);
  const isFooterOnRight = formState.transactionLoading
    ? _st.footerPosition === "right"
    : formState.userConfig?.footerPosition === "right";
  const [isDropDownOpen, setIsDropDownOpen] = useState<{ open: boolean, autoAddressFocus: boolean }>({ open: false, autoAddressFocus: false });
  const [isDropUpOpen, setIsDropUpOpen] = useState(false);
  const { appState } = useAppState();
  const isMinimized = appState.toggled && appState.toggled.includes("close");
  const sidebarWidth = isMinimized ? "90px" : "250px";
  const isLargeScreen = window.innerWidth >= 1000;
  const headerLeft = isLargeScreen ? sidebarWidth : "0";
  const isRtl = appState.locale.rtl;
  const headerStyle = {
    left: isRtl ? "0" : headerLeft,
    right: isRtl ? headerLeft : "0",
  };

  const [tempTheme, setTempTheme] = useState<any>(null);
  const handleSelectTheme = (theme: any) => {
    setTempTheme(theme);
  };

  const handleResetTheme = () => {
    setTempTheme(null);
  };
  const [countdown, setCountdown] = useState(8);
  const [startCountdown, setStartCountdown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cbLedger = useRef<HTMLInputElement>(null);
  const address1 = useRef<HTMLInputElement>(null);
  const address2 = useRef<HTMLInputElement>(null);
  const referenceNumber = useRef<HTMLInputElement>(null);
  const referenceDate = useRef<HTMLInputElement>(null);

  // Start countdown when a theme is selected
  useEffect(() => {
    if (formState.selectedTheme && formState.selectedTheme.isInitial !== true) {
      console.log('Theme selected, triggering countdown');
      setCountdown(8);
      setStartCountdown(true);

      // Apply the preview theme
      dispatch(formStateHandleFieldChangeKeysOnly({
        fields: {
          userConfig: { ...formState.selectedTheme },
          themeChangeCountdown: 8
        }
      }));
    }
  }, [formState.selectedTheme]);

  useEffect(() => {
    if (!startCountdown) return;
    console.log('⏰ Starting countdown timer');
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        const next = prev - 1;
        console.log('⏱️ Tick - countdown:', next);

        dispatch(formStateHandleFieldChangeKeysOnly({
          fields: { themeChangeCountdown: next }
        }));

        // Check for abort condition
        if (formState.themeChangeCountdown === undefined) {
          console.log('🚫 Countdown aborted');
          clearInterval(timerRef.current!);
          setStartCountdown(false);
          return prev; // stop
        }

        // Finish countdown
        if (next <= 0) {
          console.log('🛑 Countdown complete');
          clearInterval(timerRef.current!);
          setStartCountdown(false);

          dispatch(formStateHandleFieldChangeKeysOnly({
            fields: {
              userConfig: { ...formState.userConfig, ...formState.currentTheme },
              selectedTheme: formState.currentTheme,
              themeChangeCountdown: 0,
            }
          }));

          return 0;
        }

        return next;
      });
    }, 1000);

    return () => {
      console.log('🧹 Cleaning up countdown');
      clearInterval(timerRef.current!);
    };
  }, [startCountdown]);

  const onClearThemeChangeInterval = () => {
    clearInterval(timerRef.current!);
    setStartCountdown(false);
    setCountdown(8);
  };


  // Add this to monitor when selectedTheme changes
  useEffect(() => {
    console.log('🔄 selectedTheme changed:', formState.selectedTheme);
    console.log('  - isInitial flag:', formState.selectedTheme?.isInitial);
  }, [formState.selectedTheme]);
  const purchaseGridRef = useRef<{
    focusCell: (
      targetRow: number,
      targetColumnIndex: number
    ) => { column: string; rowIndex: number } | null;
    nextCellFind: (
      rowIndex: number,
      column: string,
      excludedColumns?: (keyof TransactionDetail)[]
    ) => { column: string; rowIndex: number } | null;
    focusCurrentColumn: (
      rowIndex: number,
      column: string
    ) => { column: string; rowIndex: number } | null;
    focusColumn: (
      rowIndex: number,
      column: string
    ) => { column: string; rowIndex: number } | null;
    gridRef: HTMLDivElement;
  }>(null);

  const toggleHeaderDropdown = () => {
    setIsDropDownOpen((prev) => { return { open: !prev.open, autoAddressFocus: false } });
    setIsDropUpOpen(false);
  };

  const toggleFooterDropup = () => {
    setIsDropUpOpen((prev) => !prev);
    setIsDropDownOpen({ open: false, autoAddressFocus: false });
  };

  const SIDEBAR_WIDTH = "196px";
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    dispatch(resetState());
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

  const closeDocumentModal = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { documentModal: false }
      })
    )
  };

  // Close e Way bill Details modal in save - open case
  const handleCloseEWayDetailsModal = ()=> {
    dispatch(
      formStateHandleFieldChange({
        fields: { eWayBillDetailOpen: false },
      })
    );
  }

  const focusCBledger = () => {
    if (cbLedger.current) {
      cbLedger.current.focus();
    }
  };

  const focusAdd1 = () => {
    if (address1.current) {
      address1.current.focus();
    }
  };

  const focusAdd2 = () => {
    if (address2.current) {
      address2.current.focus();
    }
  };

  const focusReferenceNumber = () => {
    if (referenceNumber.current) {
      referenceNumber.current.focus();
    }
  };

  const focusReferenceDate = () => {
    if (referenceDate.current) {
      referenceDate.current.focus();
    }


  };
  const inputRefs = {
    ledgerID: useRef<HTMLInputElement>(null),
    address1: useRef<HTMLInputElement>(null),
    address2: useRef<HTMLInputElement>(null),
    refDate: useRef<HTMLInputElement>(null),
    refNo: useRef<HTMLInputElement>(null)
  };

  const focusInput = (refName: keyof typeof inputRefs) => {
    if (inputRefs[refName]?.current) {
      inputRefs[refName].current.focus();
      inputRefs[refName].current.select();
    }
  };
  const handleKeyDown = (e: any, field: string, rowIndex: number) => {

    if (field === "address4" && isEnterKey(e.key)) {
      //  if (field === "address2" && isEnterKey(e.key)) {
      if (refNoRef?.current) {
        refNoRef?.current.focus();
        refNoRef?.current.select();
      }
    }
    if(field === "employeeID" && isEnterKey(e.key)){
      e.preventDefault();
      e.stopPropagation();
      
      if(formState.isSaveClicked === false){
        if(formState.transaction.master.employeeID > -1 ){
          if(formState.userConfig?.holdSalesMan){
              // Focus the name filed
              partyNameRef?.current?.focus();
              partyNameRef?.current?.select();
              return;
          }
          // Else focus the grid cell
          else{
            const editableColumn = formState.gridColumns?.find(
               (col: any) => col.visible !== false && col.dataField != null && col.allowEditing == true && col.readOnly !== true
            );
            setIsDropDownOpen({ open: false, autoAddressFocus: false })
             let currentCell = {
                column: editableColumn?.dataField ?? "",
                data: formState.transaction.details[0],
                rowIndex: 0,
                reCenterRow: false,
                key: generateUniqueKey()
              }
              if (
                formState.currentCell &&
                formState.currentCell.rowIndex > 0 &&
                formState.currentCell.column != ""
              ) {
                currentCell = {
                  column: formState.currentCell.column ?? "",
                  data: formState.transaction.details[formState.currentCell.rowIndex],
                  rowIndex: formState.currentCell.rowIndex,
                  reCenterRow: false,
                  key: generateUniqueKey()
                }
                focusCurrentColumn(formState.currentCell.rowIndex, formState.currentCell.column)
              } else {
                focusCurrentColumn(0, editableColumn?.dataField ?? "")
              }
              dispatch(formStateHandleFieldChange({ fields: { currentCell: currentCell } }))
          }
        }
      }
    }

    if (field === "refDate" && isEnterKey(e.key)) {
      const editableColumn = formState.gridColumns?.find(
        (col: any) => col.visible !== false && col.dataField != null && col.allowEditing == true && col.readOnly !== true
      );

      setIsDropDownOpen({ open: false, autoAddressFocus: false })

      let currentCell = {
        column: editableColumn?.dataField ?? "",
        data: formState.transaction.details[0],
        rowIndex: 0,
        reCenterRow: false,
        key: generateUniqueKey()
      }
      if (
        formState.currentCell &&
        formState.currentCell.rowIndex > 0 &&
        formState.currentCell.column != ""
      ) {
        currentCell = {
          column: formState.currentCell.column ?? "",
          data: formState.transaction.details[formState.currentCell.rowIndex],
          rowIndex: formState.currentCell.rowIndex,
          reCenterRow: false,
          key: generateUniqueKey()
        }
        focusCurrentColumn(formState.currentCell.rowIndex, formState.currentCell.column)
      } else {
        focusCurrentColumn(0, editableColumn?.dataField ?? "")
      }
      dispatch(formStateHandleFieldChange({ fields: { currentCell: currentCell } }))
    }
  };
  const formStateRef = useRef(formState);
  useEffect(() => {
    formStateRef.current = formState;
  }, [formState]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      handleTextDataKeyDown("", event, "global", -1, { result: {} })
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // If productId is lees than zero, then set isProductSummaryOpen false
  // Need to open only when if a product id exist
  useEffect(() => {
    const productID = Number(formState.currentCell?.data.productID)
    if( productID <= 0 ){
      dispatch(
        formStateHandleFieldChange({
          fields: { isProductSummaryOpen: false },
        })
      )
    }
  }, [formState.isProductSummaryOpen]);

  // Open Party summary only when the ledger id exist
  useEffect(() => {
    const ledgerId = Number(formState.transaction.master.ledgerID)
    if( ledgerId <= 0 ){
      dispatch(
        formStateHandleFieldChange({
          fields: { isPartyWiseSummaryOpen: false },
        })
      )
    }
  }, [formState.isPartyWiseSummaryOpen]);

  

  const [loadTemplate, setLoadTemplate] = useState<TemplateState<TransactionDetail>>();
  const focusToNextColumn = (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]) => {
    return purchaseGridRef?.current?.nextCellFind(rowIndex, column, excludedColumns) ?? null;
  };
  const focusColumn = (rowIndex: number, column: string) => {
    return purchaseGridRef?.current?.focusColumn(rowIndex, column) ?? null;
  };
  const focusCurrentColumn = (rowIndex: number, column: string) => {
    return (
      purchaseGridRef?.current?.focusCurrentColumn(rowIndex, column) ?? null
    );
  };
  const { getFormattedValue, getAmountInWords } = useNumberFormat();
  const {
    undoEditMode,
    getNextVoucherNumber,
    loadAndSetTransVoucher,
    handleTextDataKeyDown,
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
    generateLPQ,
    generateLPO,
    enableCombo,
    disableCombo,
    handleEdit,
    clearControls,
    printVoucher,
    handleLoadByRefNo,
    unlockVoucher,
    handleRefresh,
    createNewVoucher,
    handleTextDataChange,
    refactorDetails,
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
    downloadImportTemplateHeadersOnly,
    importFromExcel,
    loadLedgerData,
    postBillWiseDetails,
    logUserAction,
    handleLoadSr,
    handleDiscountSlab,
    getCustomerTypeAndTitle,
    fetchUserConfig,
    giftOnBilling,
    applyTaxOnBillDiscount,
    _purchaseGridCol,
    gridCode,
    initializeFormElements,
    calculateTaxOnDiscount,
    taxOnDiscountApplyButton

  } = useTransaction(
    transactionType ?? "",
    btnSaveRef,
    btnAddRef,
    focusToNextColumn,
    focusColumn,
    focusCurrentColumn,
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
    mobileNumRef,
    transactionDateRef,
    discountRef,
    chequeStatusRef,
    employeeRef,
    handleKeyDown,
    formStateRef,
    purchaseGridRef,
    setIsDropDownOpen, // For opening heder dropdown when mobile number error alert
    voucherType,
    formType,


  );

  
useEffect(() => {
  // Only auto-trigger if:
  // 1. isEdit prop is true
  // 2. Transaction is loaded (has a real ID)
  // 3. Haven't already triggered it
  if (
    !isEdit ||
    hasTriggeredEditRef.current ||
    !formState.transaction.master.invTransactionMasterID ||
    formState.transaction.master.invTransactionMasterID <= 0
  ) {
    return;
  }

  // Also wait until the form is not in loading state
  if (formState.transactionLoading) return;

  hasTriggeredEditRef.current = true;

  const runEdit = async () => {
    await handleEdit();
  };
  runEdit();
}, [
  isEdit,
  formState.transaction.master.invTransactionMasterID,
  formState.transactionLoading,
]);

  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const onSaveItem = async(item: TransactionDetail, mode:"Save" | "SaveAndNew") => {
    
    if(!(item.productBatchID > 0)) return;
    const exist = formState.transaction.details.find(x => x.slNo == formState.row?.slNo);
                        if(exist) {
                          const ind = formState.transaction.details.findIndex(x => x.slNo == formState.row?.slNo)
                          if(formState.row) {
                            let final = [...formState?.transaction?.details];
                            final[ind] = item
                            final = final.filter(x => x.productID > 0);

                            const summaryRes = calculateSummary(final, formState, {
                                          result: {},
                                        });

                                        const totalRes = await calculateTotal(
                                          formState.transaction.master,
                                          summaryRes.summary as SummaryItems,
                                          {
                                            ...formState.formElements,
                                          } as FormElementsState,
                                          { result: {} }
                                        );
                                        const result = {
                                          ...totalRes,
                                          row: initialTransactionDetailData,
                                          itemPopup: {isOpen:mode=="SaveAndNew", index:0},
                                          summary: summaryRes.summary,
                                          showQuantityFactors: { visible: false, rowIndex: -1, qtyDesc: "" },
                                          transaction: {
                                            ...totalRes.transaction,
                                            details: [item],
                                          },
                                        };
                            dispatch(formStateHandleFieldChangeKeysOnly({fields:{
                              ...result
                            },itemsToAddToDetails: undefined, rowIndex:ind}))
                            dispatch(formStateTransactionDetailsRowAdd({...item,isRowEdit: true}))
                          }
                        } else {
                          if(formState.row) {

                            let final = [...formState?.transaction?.details];
                            final.push(item);
                            final = final.filter(x => x.productID > 0);

                            const summaryRes = calculateSummary(final, formState, {
                                          result: {},
                                        });

                                        const totalRes = await calculateTotal(
                                          formState.transaction.master,
                                          summaryRes.summary as SummaryItems,
                                          {
                                            ...formState.formElements,
                                          } as FormElementsState,
                                          { result: {} }
                                        );
                                        const result = {
                                          ...totalRes,
                                          row: initialTransactionDetailData,
                                          itemPopup: {isOpen:mode=="SaveAndNew", index:0},
                                          summary: summaryRes.summary,
                                          showQuantityFactors: { visible: false, rowIndex: -1, qtyDesc: "" },
                                          transaction: {
                                            ...totalRes.transaction,
                                            details: [],
                                          },
                                        };
                            dispatch(formStateHandleFieldChangeKeysOnly({fields:{
                              ...result
                            },itemsToAddToDetails: undefined}))
                            dispatch(formStateTransactionDetailsRowAdd(item))
                          }
                        }
  }
  const { hasRight } = useUserRights();

  // Constants for layout calculations
  const HEADER_HEIGHT = 170; // Header and toolbar height in pixels
  const HEADER_PADDING = 10; // Additional padding for header area
  const FIXED_FOOTER_HEIGHT = 320; // Fallback footer height (actual height measured dynamically via ResizeObserver)
  const GRID_INTERNAL_OFFSET = 110; // Grid component adds 110px internally (see dataGrid.tsx line 2805)

  const gridHeight = useMemo(() => {
    if (formState?.transaction?.master?.voucherType === "LPO") {
      return windowHeight - 425 - GRID_INTERNAL_OFFSET;
    }

    if (deviceInfo?.isMobile) {
      return windowHeight - 250 - GRID_INTERNAL_OFFSET;
    }

    let height;
    const isFooterOnRight = (formState.transactionLoading && _st.footerPosition === "right") ||
      (!formState.transactionLoading && formState.userConfig?.footerPosition === "right");

    if (isFooterOnRight) {
      // Footer is on the right side, so grid can use full height minus header only
      height = windowHeight - 184 - GRID_INTERNAL_OFFSET;
    } else {
      // Footer is at the bottom - use dynamic footer height for accurate calculation
      const actualFooterHeight = footerHeight > 0 ? footerHeight : FIXED_FOOTER_HEIGHT;
      height = windowHeight - HEADER_HEIGHT - HEADER_PADDING - actualFooterHeight - GRID_INTERNAL_OFFSET;
    }

    return height;
  }, [formState?.transaction?.master?.voucherType, formState.transactionLoading, formState.userConfig?.footerPosition, deviceInfo?.isMobile, _st.footerPosition, footerHeight, windowHeight]);


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
    (async () => {
      if (formState.transaction.master.ledgerID < 1) {
        return;
      }
      if (formState.isInitialLedger != true) {
        setIsDropDownOpen({ open: true, autoAddressFocus: true })
        await loadLedgerData(undefined, dispatch);

        setTimeout(() => {
          focusAdd1();
        }, 1000);
      } else {
        dispatch(
          formStateHandleFieldChange({
            fields: {
              isInitialLedger: false
            },
          })
        );
      }
    })();
  }, [formState.transaction.master.ledgerID]);

  useEffect(() => {
    // if(voucherType??"" == "") return;
   initializeFormElements(voucherType??"", voucherPrefix??"", formType??"",formCode??"",title??"",voucherNo??0,transactionMasterID??0, true);  // IsInitial is true
  }, [voucherType, voucherPrefix, formType]);

  const onProcessSelected = useCallback(async (masterIds: string, branchIDs: string, voucherNumbers: string, referenceNumber: string, loadType: string = "GRN", voucherType: string) => {
    if (masterIds.length > 0) {
const isActualPriceVisible = formState.gridColumns.find(x=>x.dataField=="actualPrice")?.visible ?? false;
      dispatch(formStateHandleFieldChange({ fields: { loading: { isLoading: true, text: `${loadType == "GRN" ? 'Please wait while loading GRN Items' : 'Please wait while loading Order Items'}` } } }));
      const PendingTransDetails: any = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/PendingTransactionsByMasterIds`, `masterIDs=${masterIds}&branchIDs=${branchIDs}&isActualPriceVisible=${isActualPriceVisible}`)
      if (PendingTransDetails && PendingTransDetails.details && PendingTransDetails.details.length > 0) {
        const calculatedDetails: TransactionDetail[] = [];
        const refactoredDetails = await refactorDetails(PendingTransDetails.details?.map((x: any) => {
          return { ...x, quantity: x.pendingQty }
        }), formState.transaction.master.voucherForm, voucherType, { result: {} }, loadType);
        for (let index = 0; index < refactoredDetails.length; index++) {
          const _element = { ...refactoredDetails[index] };

          const element = { ..._element };
           element.orderTransDetailID = _element.invTransactionDetailID ?? 0;
          const calculated =await calculateRowAmount(
            element,
            "barCode",
            { result: { transaction: { details: [element] } } },
            true
          );
          calculatedDetails.push(calculated.transaction!.details![0] as TransactionDetail);
        }

        const details = [...calculatedDetails, ...formState.transaction?.details?.filter((x: any) => x.productID > 0) || []]
        if (details.length > 0 && calculateSummary && calculateTotal && formState && dispatch && formStateHandleFieldChangeKeysOnly) {
          const summaryRes = await calculateSummary(details, formState, {
            result: {},
          });

          const totalRes = await calculateTotal(
            formState.transaction.master,
            summaryRes ? summaryRes.summary as SummaryItems : initialInventoryTotals,
            formState.formElements,
            {
              result: { pendingOrdListMasterIDs: masterIds, pendingOrdListBranchIDs: branchIDs, transaction: { master: { remarks: voucherNumbers } } },
            }
          );

          if (totalRes) {
            totalRes.summary = summaryRes.summary;
            totalRes.transaction = totalRes.transaction ?? {};
            totalRes.transaction.master = { ...totalRes.transaction.master, stockUpdate: (loadType == "GRN" || loadType == "GRR") ? false : true };
            totalRes.transaction.details = [];
            totalRes.batchesUnits = PendingTransDetails.batchesUnits;
            totalRes.loading = { isLoading: false, text: '' }

            // Dispatch the state update

            const lastIndex = formState.transaction.details.findLastIndex(x => x.productID > 0);
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: totalRes,
                updateOnlyGivenDetailsColumns: true,
                rowIndex: lastIndex + 1,
                itemsToAddToDetails: calculatedDetails
              })
            );
          }
        }

      } else {

        dispatch(formStateHandleFieldChange({ fields: { loading: { isLoading: false, text: '' } } }));
      }
    }
  }, [formState.transaction.details, formState.transaction.master]);
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

  useEffect(() => {
    const batchSelectionData = async () => {
      if (formState.batchSelectionData != "") {
        const data = JSON.parse(formState.batchSelectionData);
       let baseDetail = { ...formState.transaction.details[data.rowIndex] };
        if (data.rowIndex < 0) {
          baseDetail = { ...formState.row??initialTransactionDetailData };
        }
        await loadProductDetailsByAutoBarcode(
          {
            productCode: data.productCode,
            autoBarcode: data.autoBarcode,
            productBatchID: data.productBatchID,
            searchText: data.searchText,
            detail: baseDetail,
            useProductCode: data.useProductCode,
            rowIndex: data.rowIndex,
            searchColumn: data.useProductCode ? "pCode" : "product",
            setFocusToNextColumn: true,
          },
          { result: {}, formStateHandleFieldChangeKeysOnly },
          true
        );
      }
    };

    batchSelectionData();
  }, [formState.batchSelectionData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (formState.popupSearchSelectionData != "") {
          const data = JSON.parse(formState.popupSearchSelectionData);

          if (data.items && data.items.length > 0) {
            const rowIndex = data.rowIndex;
            const searchColumn = data.searchColumn;
            const searchText = data.searchText;
            const items = data.items;
            const baseRowData = formState.transaction.details[rowIndex];
            let currentDetails = [
              ...formState.transaction.details.filter((x) => x.productID > 0),
            ];
            if (
              currentDetails.find((x) => x.slNo == baseRowData.slNo) ==
              undefined
            ) {
              currentDetails.push(baseRowData);
            }
            let res: DeepPartial<TransactionFormState> = {};
            let addDetails: TransactionDetail[] = [];

            for (const [index, item] of items.entries()) {
              const input = {
                barCode: item.autoBarcode,
                productBatchID: item.productBatchID,
                warehouseID: item.warehouseID,
                warehouseName: item.warehouse,
              };
              if (index == 0) {
                const rowData: TransactionDetail = { ...baseRowData, ...input };
                const autBarcodeRes = await loadProductDetailsByAutoBarcode(
                  {
                    autoBarcode: rowData.barCode,
                    productBatchID: rowData.productBatchID,
                    rowIndex: rowIndex,
                    searchColumn: searchColumn,
                    searchText: rowData.barCode,
                    detail: rowData,
                    productCode: "",
                    useProductCode: false,
                    setFocusToNextColumn: false,
                  },
                  { result: { transaction: { details: [rowData] } } }
                );

                const latestData =
                  autBarcodeRes?.transaction?.details?.[0] ?? {};
                const mergedRowData: TransactionDetail = {
                  ...rowData,
                  ...latestData,
                };
                currentDetails[rowIndex] = mergedRowData;
                res = await calculateRowAmount(
                  mergedRowData as TransactionDetail,
                  searchColumn,
                  { result: { transaction: { details: [mergedRowData] } } },
                  true
                );
                if (
                  res?.transaction?.details &&
                  res?.transaction?.details.length > 0
                ) {
                  currentDetails[rowIndex] = res.transaction
                    .details[0] as TransactionDetail;
                }
              } else {
                let rowData: DeepPartial<TransactionDetail> = {
                  ...input,
                };
                rowData.slNo = generateUniqueKey();

                const autBarcodeRes = await loadProductDetailsByAutoBarcode(
                  {
                    autoBarcode: rowData.barCode ?? "",
                    productBatchID: rowData.productBatchID ?? 0,
                    rowIndex: rowIndex,
                    searchColumn: searchColumn,
                    searchText: rowData.barCode ?? "",
                    detail: rowData as TransactionDetail,
                    productCode: "",
                    useProductCode: false,
                    setFocusToNextColumn: false,
                  },
                  { result: { transaction: { details: [rowData] } } }
                );

                const latestData =
                  autBarcodeRes?.transaction?.details?.[0] ?? {};
                const mergedRowData: TransactionDetail = {
                  ...(rowData as TransactionDetail),
                  ...latestData,
                };

                let _res = await calculateRowAmount(
                  mergedRowData as TransactionDetail,
                  searchColumn,
                  { result: { transaction: { details: [mergedRowData] } } },
                  true
                );

                if (
                  _res?.transaction?.details &&
                  _res?.transaction?.details.length > 0
                ) {
                  addDetails.push(
                    _res!.transaction!.details![0] as TransactionDetail
                  );
                }
              }
            }

            let final = [...currentDetails, ...addDetails];
            const summaryRes = calculateSummary(final, formState, {
              result: {},
            });

            const totalRes = await calculateTotal(
              formState.transaction.master,
              summaryRes.summary as SummaryItems,
              formState.formElements,
              { result: {} }
            );
            const resw = focusToNextColumn(data.rowIndex, data.searchColumn, [
              "pCode",
              "product",
              "barCode",
            ]);

            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: {
                  ...totalRes,
                  summary: summaryRes.summary,
                  showQuantityFactors: { visible: false, rowIndex: -1, qtyDesc: "" }, // For Q
                  showQuantityFactorsM: { visible: false, rowIndex: -1, qtyDesc: "" }, // For M  CheckIt
                  transaction: {
                    ...totalRes.transaction,
                    details: res.transaction?.details,
                  },
                  currentCell: {
                    reCenterRow: data.rowIndex != rowIndex + addDetails.length,
                    column: resw?.column,
                    data: addDetails.length == 0 ? rowIndex : addDetails[addDetails.length - 1],
                    rowIndex: rowIndex + addDetails.length,
                  },
                },
                updateOnlyGivenDetailsColumns: true,
                rowIndex: rowIndex,
                itemsToAddToDetails: addDetails,
              })
            );


          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [formState.popupSearchSelectionData]);

  useEffect(() => {
     const run = async()=>{
    if (formState.quantityFactorData != "") {

      const data = JSON.parse(formState.quantityFactorData);
      const rowIndex = data.rowIndex;
      const quantityFactor = data.data;
      const baseRowData = formState.transaction.details[rowIndex];
      let currentDetails = [
        ...formState.transaction.details.filter((x) => x.productID > 0),
      ];
      // let res: DeepPartial<TransactionFormState> = {};
      let addDetails: TransactionDetail[] = [];
      for (let index = 0; index < quantityFactor.length; index++) {
        const value = quantityFactor[index];

        if (index === 0) {
          const rowData = { ...baseRowData, qty: value.total };
          const res = await calculateRowAmount(rowData, "qty", { result: { transaction: { details: [{ qty: value.total, slNo: baseRowData.slNo }] } } }, true);
          if (res?.transaction?.details && res.transaction.details.length > 0) {
            res.transaction.details[0]!.productDescription = `${value.width} X ${value.height} X ${value.nos}`;
            currentDetails[rowIndex] = res.transaction.details[0]! as TransactionDetail;
          }
        } else {
          const rowData = {
            ...baseRowData,
            qty: value.total,
            slNo: generateUniqueKey(),
            productDescription: `${value.width} X ${value.height} X ${value.nos}`,
          };
          const res = await calculateRowAmount(rowData, "qty", { result: { transaction: { details: [rowData] } } }, true);
          if (
            res?.transaction?.details &&
            res?.transaction?.details.length > 0
          ) {
            addDetails.push(res.transaction.details[0] as TransactionDetail);
          }
        }
      }

      const final = [...currentDetails, ...addDetails];
      const summaryRes = calculateSummary(final, formState, { result: {} });

      const totalRes = await calculateTotal(
        formState.transaction.master,
        summaryRes.summary as SummaryItems,
        formState.formElements,
        { result: {} }
      );
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            ...totalRes,
            summary: summaryRes.summary,
            showQuantityFactors: { visible: false, rowIndex: -1, qtyDesc: "" }, // For Q
            transaction: {
              ...totalRes.transaction,
              details: final,
            },
          },
          updateOnlyGivenDetailsColumns: true,
          rowIndex: rowIndex,
          itemsToAddToDetails: addDetails,
        })
      );
    }
      
    }
    run()
  }, [formState.quantityFactorData]);

  useEffect(() => {
     const run = async()=>{
    // This for quantity factor factor m, We can also optimize the code from the above if have time - CheckIt
    if (formState.quantityFactorDataM != "") {
      const data = JSON.parse(formState.quantityFactorDataM);
      const rowIndex = data.rowIndex;
      const quantityFactor = data.data;
      const baseRowData = formState.transaction.details[rowIndex];
      let currentDetails = [
        ...formState.transaction.details.filter((x) => x.productID > 0),
      ];
      // let res: DeepPartial<TransactionFormState> = {};
      let addDetails: TransactionDetail[] = [];
      for (let index = 0; index < quantityFactor.length; index++) {
        const value = quantityFactor[index];

        if (index === 0) {
          const rowData = { ...baseRowData, qty: value.total };
          const res = await calculateRowAmount(rowData, "qty", { result: { transaction: { details: [{ qty: value.total, slNo: baseRowData.slNo }] } } }, true);
          if (res?.transaction?.details && res.transaction.details.length > 0) {
            res.transaction.details[0]!.productDescription = `${value.mann} X ${value.kg} X ${value.nos}`;
            currentDetails[rowIndex] = res.transaction.details[0]! as TransactionDetail;
          }
        } else {
          const rowData = {
            ...baseRowData,
            qty: value.total,
            slNo: generateUniqueKey(),
            productDescription: `${value.mann} X ${value.kg} X ${value.nos}`,
          };
          const res = await calculateRowAmount(rowData, "qty", { result: { transaction: { details: [rowData] } } }, true);
          if (res?.transaction?.details && res.transaction.details.length > 0) {
            addDetails.push(res.transaction.details[0]! as TransactionDetail);
          }
        }
      }

      const final = [...currentDetails, ...addDetails];
      const summaryRes = calculateSummary(final, formState, { result: {} });

      const totalRes = await calculateTotal(
        formState.transaction.master,
        summaryRes.summary as SummaryItems,
        formState.formElements,
        { result: {} }
      );
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            ...totalRes,
            summary: summaryRes.summary,
            showQuantityFactorsM: { visible: false, rowIndex: -1, qtyDesc: "" }, // For M
            transaction: {
              ...totalRes.transaction,
              details: final,
            },
          },
          updateOnlyGivenDetailsColumns: true,
          rowIndex: rowIndex,
          itemsToAddToDetails: addDetails,
        })
      );
    }
      
    }
    run()
  }, [formState.quantityFactorDataM]);

  // When The Flavors flv modal updates - test the code
  useEffect(() => {
     const run = async()=>{
    if (formState.flavoursSelectedData != "") {
      const data = JSON.parse(formState.flavoursSelectedData);
      const rowIndex = data.rowIndex;
      const flavoursData = data.data;
      const baseRowData = formState.transaction.details[rowIndex];
      let currentDetails = [
        ...formState.transaction.details.filter((x) => x.productID > 0),
      ];
      let addDetails: TransactionDetail[] = [];
      for (let index = 0; index < flavoursData.length; index++) {
        const value = flavoursData[index];
        if (!value.qty || value.qty <= 0) continue;

        if (index === 0) {
          const rowData = { ...baseRowData, qty: value.qty, flavors: value.flavour };
          const res = await calculateRowAmount(rowData, "qty", { result: { transaction: { details: [{ qty: value.qty, flavors: value.flavour, slNo: baseRowData.slNo }] } } }, true);
          if (res?.transaction?.details && res.transaction.details.length > 0) {
            res.transaction.details[0]!.flavors = value.flavour;
            currentDetails[rowIndex] = res.transaction.details[0]! as TransactionDetail;
          }
        } else {
          const rowData = {
            ...baseRowData,
            qty: value.qty,
            slNo: generateUniqueKey(),
            flavors: value.flavour,
          };
          const res = await calculateRowAmount(rowData, "qty", { result: { transaction: { details: [rowData] } } }, true);
          if (
            res?.transaction?.details &&
            res?.transaction?.details.length > 0
          ) {
            addDetails.push(res.transaction.details[0] as TransactionDetail);
          }
        }
      }

      const final = [...currentDetails, ...addDetails];
      const summaryRes = calculateSummary(final, formState, { result: {} });

      const totalRes = await calculateTotal(
        formState.transaction.master,
        summaryRes.summary as SummaryItems,
        formState.formElements,
        { result: {} }
      );

      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            ...totalRes,
            summary: summaryRes.summary,
            flavoursSelectedData:"",
            transaction: {
              ...totalRes.transaction,
              details: final,
            },
          },
          updateOnlyGivenDetailsColumns: true,
          rowIndex: rowIndex,
          itemsToAddToDetails: addDetails,
        })
      );
    }
      
    }
    run()
  }, [formState.flavoursSelectedData]);

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

    if (window.history.length <= 1) {
      // No history to go back to, attempt to close the tab
      window.close();

      // If window.close() doesn't work (common in modern browsers),
      // you can try this alternative approach
      window.open('', '_self', '');
      window.close();

      // Or as a last resort, redirect to a blank page
      // window.location.href = 'about:blank';
    } else {
      window.history.back();
    }
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
  const [isOpentwo, setIsOpentwo] = useState(false);

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
  };

  const sidebarHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    marginBottom: "3px",
  };

  const sidebarTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
  };

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
  };

  //   useEffect(() => {
  //     console.log('safvan');

  //   console.log('inputHeight changed:', formState.userConfig?.inputBoxStyle?.inputHeight );
  // }, [formState.userConfig?.inputBoxStyle?.inputHeight ]);

  //   const dynamicMarginTop = 123 + (appState?.inputBox?.inputHeight ?? 0);

  //   console.log("mj23stylecheck:" , formState.userConfig?.inputBoxStyle?.inputHeight );


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
  const getInputHeight = () => {
    return formState.userConfig?.inputBoxStyle?.inputSize == "sm" ? remToPx(0) : formState.userConfig?.inputBoxStyle?.inputSize == "md" ? remToPx(0.75) : formState.userConfig?.inputBoxStyle?.inputSize == "lg" ? remToPx(1.375) : formState.userConfig?.inputBoxStyle?.inputSize == "customize" ? (remToPx(formState.userConfig?.inputBoxStyle?.inputHeight) ?? 0) - 23 : 0
  }

  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const handleHeightChange = (height: number) => {
    setHeaderHeight(height)
  }

  const [posGridHeight, setPosGridHeight] = useState(window.innerHeight - 380);

  useEffect(() => {
    const resizeListener = () => {
      setPosGridHeight(window.innerHeight - 380);
    };

    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);


   useEffect(() => {
      async function calculateValues() {
        await calculateTotal(
        {
          ...formState.transaction.master
          , hasroundOff: formState.transaction.master.hasroundOff
          , adjustmentAmount: formState.transaction.master.adjustmentAmount
          , creditAmt: formState.transaction.master.creditAmt
          , couponAmt: formState.transaction.master.couponAmt
          , srAmount: formState.transaction.master.srAmount
          , billDiscount: formState.transaction.master.billDiscount
          , hasCashPaid: formState.transaction.master.hasCashPaid
          ,bankAmt: formState.transaction.master.bankAmt
        }, formState.summary, formState.formElements, {
          result: {
            transaction: {
              master: {
                hasroundOff: formState.transaction.master.hasroundOff,
                adjustmentAmount: formState.transaction.master.adjustmentAmount,
                creditAmt: formState.transaction.master.creditAmt,
                couponAmt: formState.transaction.master.couponAmt,
                srAmount: formState.transaction.master.srAmount,
                billDiscount: formState.transaction.master.billDiscount,
                hasCashPaid: formState.transaction.master.hasCashPaid,
                bankAmt: formState.transaction.master.bankAmt
              }
            }
          }, formStateHandleFieldChangeKeysOnly: formStateHandleFieldChangeKeysOnly
      })
      }
      calculateValues();
  }, [formState.transaction.master.hasCashPaid, formState.transaction.master.hasroundOff
      , formState.transaction.master.adjustmentAmount, formState.transaction.master.bankAmt, formState.transaction.master.couponAmt
      , formState.transaction.master.srAmount]);
      
   useEffect(() => {
      // async function calculateValues() {
      //   console.log('[transaction.tsx] calculateValues() called - about to call _calculateTotal');
      //   let taxOnDisc=calculateTaxOnDiscount()
        
      //   await calculateTotal(
      //   {
      //     ...formState.transaction.master
      //     , billDiscount: formState.transaction.master.billDiscount
      //     , taxOnDiscount: taxOnDisc??0
      //   }, formState.summary, formState.formElements, {
      //     result: {
      //       transaction: {
      //         master: {
      //           billDiscount: formState.transaction.master.billDiscount
      //     , taxOnDiscount: taxOnDisc
      //         }
      //       }
      //     }, formStateHandleFieldChangeKeysOnly: formStateHandleFieldChangeKeysOnly
      // })
      // }
      // calculateValues();
    }, [formState.transaction.master.billDiscount]);
  return (
    <>
      { !isPos ?(
      <div className="relative">
        {/* <h1>SAFVAN{transactionType}</h1> */}
        {!deviceInfo?.isMobile && (
          <div
            className={`dark:!bg-dark-bg px-[4px] py-4`}
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
                  zIndex: 40,
                }}
              >
                {formState.isEdit}
                <div className="flex items-center p-0 border dark:border-dark-border border-gray-300 rounded-b-sm mb-2 dark:bg-dark-bg bg-[#f4f4f5] me-[1px]">
                  <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
                    <h6
                      className="absolute text-lg font-bold mb-0 whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 flex items-center gap-2"
                      style={headerStyle}
                    >
                      {/* - {t(formState.row.ledgerCode)}-  {t(formState.transaction.master.voucherType)}- {t(.toString())} */}
                      {formState.draftMode ? t(formState.title) + " - " + t("draft")  : t(formState.title)}
                      {!formState.formElements.lblPosted.visible && (
                        <div title={t("posted_transaction")}>
                          {/* <Info className="text-[#ef4444] w-4 h-4" /> */}
                        </div>
                      )}
                    </h6>
                    <i className="fas fa-cog ms-1"></i>
                  </div>
                  <Header
                    formState={formState}
                    dispatch={dispatch}
                    // handleKeyDown={handleKeyDown} // Replace with your actual keydown handler
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
                    goToPreviousPage={goToPreviousPage}
                    isHistorySidebarOpen={isHistorySidebarOpen}

                    onProcessSelected={onProcessSelected}
                    downloadImportTemplateHeadersOnly={downloadImportTemplateHeadersOnly}
                    importFromExcel={importFromExcel}
                    undoEditMode={undoEditMode}
                    loadAndSetTransVoucher={loadAndSetTransVoucher}
                  />
                </div>
              </div>
            </div>

            {/* header starts here */}
            <TransactionHeader
              inputRefs={inputRefs}
              onHeightChange={handleHeightChange}
              formState={formState}
              dispatch={dispatch}
              handleKeyDown={handleKeyDown}
              focusToNextColumn={focusToNextColumn}
              loadAndSetTransVoucher={loadAndSetTransVoucher}
              initializeFormElements={initializeFormElements}
              t={t}
              isAppGlobal={clientSession.isAppGlobal}
              handleLoadByRefNo={handleLoadByRefNo}
              handleFieldChange={handleFieldChange}
              setIsPartyDetailsOpen={setIsPartyDetailsOpen}
              transactionType={transactionType ?? formState.transactionType}
              handleFieldKeyDown={handleFieldKeyDown}
              ledgerCodeRef={ledgerCodeRef}
              ledgerIdRef={ledgerIdRef}
              voucherNumberRef={voucherNumberRef}
              refNoRef={refNoRef}
              isDropDownOpen={isDropDownOpen}
              toggleDropdown={toggleHeaderDropdown}
              footerLayout="vertical"
              userSession={userSession}
              mobileNumRef={mobileNumRef}
              transactionDateRef={transactionDateRef}
              employeeRef={employeeRef}
              partyNameRef={partyNameRef}
              getNextVoucherNumber={getNextVoucherNumber}
              refactorDetails={refactorDetails}
              calculateTotal={calculateTotal}
              calculateSummary={calculateSummary}
              // isDropDownOpen={false}
            // refactorDetails={refactorDetails}
            // voucherType={voucherType}
            // focusAdd1={focusAdd1}
            />
            {/* header ends here */}

            <div
              // className="mt-[123px]"
              // className={`mj23stylecheck mt-[${123 + (appState?.inputBox?.inputHeight ?? 0)}px]`}
              // className={`mt-[${dynamicMarginTop}px]`}
              className="mj23stylecheck"
              style={{
                // marginTop: `${123 + (appState?.inputBox?.inputHeight ?? 0)}px`,
                marginTop: formState.transaction.master.voucherType === "LPO" ? `${160 + getInputHeight()}px` : `${headerHeight + 52 + getInputHeight()}px`,
                width: isFooterOnRight ? "calc(100% - 300px)" : "100%",
                // height: `${gridHeight}px`,
                overflow: "auto",
              }}
            >
              <div
                className={
                  (formState.transactionLoading &&
                    _st.footerPosition === "right") ||
                    formState.userConfig?.footerPosition === "right"
                    ? "flex flex-row items-center gap-2"
                    : "flex flex-col"
                }
              >
                <div
                  style={{
                    width: "100%",
                    // height: `${gridHeight}px`,
                  }}
                >
                  <ErpPurchaseGrid
                    ref={purchaseGridRef}
                    onChange={handleTextDataChange}
                    zIndexController={40}
                    onKeyDown={(
                      value: any,
                      e: React.KeyboardEvent<any>,
                      column: keyof TransactionDetail,
                      rowIndex: number
                    ) => {
                      handleTextDataKeyDown(value, e, column, rowIndex, {
                        result: {},
                        formStateHandleFieldChangeKeysOnly:
                          formStateHandleFieldChangeKeysOnly,
                      });
                    }}
                    onSaveItem={onSaveItem}
                    transactionType={transactionType}
                    _columns={_purchaseGridCol}
                    keyField={"productID"}
                    height={gridHeight}
                    gridId={`${gridCode}`}
                    onAddData={handleAddData}
                    summaryConfig={formState.summaryConfig}
                    gridFontSize={formState.userConfig?.gridFontSize}
                    gridIsBold={formState.userConfig?.gridIsBold}
                    rowHeight={
                      formState.userConfig?.gridRowHeight ?? _st.gridRowHeight
                    }
                    headerRowHeight={formState.userConfig?.gridHeaderRowHeight ?? _st.gridHeaderRowHeight}
                    gridBorderColor={formState.userConfig?.gridBorderColor}
                    gridHeaderBg={formState.userConfig?.gridHeaderBg}
                    gridHeaderFontColor={
                      formState.userConfig?.gridHeaderFontColor
                    }
                    gridBorderRadius={formState.userConfig?.gridBorderRadius}
                    showColumnBorder={formState.userConfig?.showColumnBorder ?? true}
                    activeRowBg={formState.userConfig?.activeRowBg}
                    gridFooterBg={formState.userConfig?.gridFooterBg}
                    gridFooterFontColor={formState.userConfig?.gridFooterFontColor}
                    ignoreKeyMovesInCell={true}
                  />
                  {/* Grid Under Modification */}
                </div>
                <div className="w-[300px]">
                  {((formState.transactionLoading &&
                    _st.footerPosition === "right") ||
                    (!formState.transactionLoading &&
                      formState.userConfig?.footerPosition === "right")) && (
                      <TransactionFooter
                        transactionType={transactionType ?? ""}
                        calculateTotal={calculateTotal}
                        applyDiscountsToItems={applyDiscountsToItems}
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                        handleKeyDown={handleKeyDown}
                        handleFieldKeyDown={handleFieldKeyDown}
                        focusDiscount={focusDiscount}
                        focusAmount={focusAmount}
                        goToPreviousPage={goToPreviousPage}
                        save={save}
                        selectAttachment={selectAttachment}
                        isAppGlobal={clientSession.isAppGlobal}
                        toggleDropup={toggleFooterDropup}
                        footerLayout={"vertical"}
                        applicationSettings={applicationSettings}
                        loadAndSetTransVoucher={loadAndSetTransVoucher}
                        handleDiscountSlab={handleDiscountSlab}
                        giftOnBilling={giftOnBilling}
                        applyTaxOnBillDiscount={calculateTaxOnDiscount}
                      // generateLPO={generateLPO}
                      // generateLPQ={generateLPQ}
                      // clientSession={clientSession}
                       costCenterRef={costCenterRef}
                       onFooterHeightChange={handleFooterHeightChange}
                       handleLoadSr={handleLoadSr}
                       importFromExcel={importFromExcel}
                       taxOnDiscountApplyButton={taxOnDiscountApplyButton}
                      />
                    )}
                </div>
              </div>
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

        {deviceInfo?.isMobile && (
          <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 w-full h-full font-sans overflow-hidden">
            {/* Sale Header */}
            <div className="flex items-center bg-white shadow-sm p-3 border-b-2 fixed top-0 left-0 w-full z-50 h-12">
              <ERPPreviousUrlButton />
              {/* test mj23 */}
              <h1 className="flex-grow font-semibold text-lg text-zinc-800">
                {/* {t("cash_payment")} */}
                {t(formState.title)}
              </h1>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full h-full mt-12 overflow-y-auto pb-[150px]">
              <div className="py-0">
                <div
                  className="w-full max-w-full mx-0"
                  style={{
                    position: "fixed",
                    top: "47px",
                    left: 0,
                    right: 0,
                    padding: 0,
                    zIndex: 39,
                  }}
                >
                  {formState.isEdit}
                  <div className="flex items-center p-0 border-b dark:border-dark-border border-gray-100 dark:bg-dark-bg bg-[#f4f4f5]">
                    <Header
                      formState={formState}
                      dispatch={dispatch}
                      // handleKeyDown={handleKeyDown} // Replace with your actual keydown handler
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
                      goToPreviousPage={goToPreviousPage}
                      isHistorySidebarOpen={isHistorySidebarOpen}
                      onProcessSelected={onProcessSelected}
                      downloadImportTemplateHeadersOnly={downloadImportTemplateHeadersOnly}
                      importFromExcel={importFromExcel}
                      undoEditMode={undoEditMode}
                      loadAndSetTransVoucher={loadAndSetTransVoucher}
                    />
                  </div>
                </div>
              </div>

              {/* Voucher Info */}
              <div className="flex items-center justify-between gap-2 bg-white px-4 py-2 shadow-md text-gray-600 h-[70px]">
                <div className="flex items-center gap-2 flex-1">
                  <TransactionHeader
                    inputRefs={inputRefs}
                    focusToNextColumn={focusToNextColumn}
                    formState={formState}
                    dispatch={dispatch}
                    handleKeyDown={handleKeyDown}
                    initializeFormElements={initializeFormElements}
                    loadAndSetTransVoucher={loadAndSetTransVoucher}
                    t={t}
                    isAppGlobal={clientSession.isAppGlobal}
                    handleLoadByRefNo={handleLoadByRefNo}
                    handleFieldChange={handleFieldChange}
                    setIsPartyDetailsOpen={setIsPartyDetailsOpen}
                    transactionType={transactionType ?? formState.transactionType}
                    handleFieldKeyDown={handleFieldKeyDown}
                    ledgerCodeRef={ledgerCodeRef}
                    ledgerIdRef={ledgerIdRef}
                    voucherNumberRef={voucherNumberRef}
                    refNoRef={refNoRef}
                    isDropDownOpen={isDropDownOpen}
                    toggleDropdown={toggleHeaderDropdown}
                    footerLayout="vertical"
                    userSession={userSession}
                    mobileNumRef={mobileNumRef}
                    transactionDateRef={transactionDateRef}
                    employeeRef={employeeRef}
                    partyNameRef={partyNameRef}
                    getNextVoucherNumber={getNextVoucherNumber}
                    refactorDetails={refactorDetails}
                    calculateTotal={calculateTotal}
                    calculateSummary={calculateSummary}
                    // isDropDownOpen={false}
                  // refactorDetails={refactorDetails}
                  // voucherType={voucherType}
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 bg-white text-zinc-800 min-h-0">
                <div className="space-y-2"></div>
                <ErpPurchaseGrid
                onSaveItem={onSaveItem}
                  isMobile={true}
                  ref={purchaseGridRef}
                  zIndexController={40}
                  onChange={handleTextDataChange}
                  onKeyDown={(
                    value: any,
                    e: React.KeyboardEvent<any>,
                    column: keyof TransactionDetail,
                    rowIndex: number
                  ) => {
                    handleTextDataKeyDown(value, e, column, rowIndex, {
                      result: {},
                      formStateHandleFieldChangeKeysOnly:
                        formStateHandleFieldChangeKeysOnly,
                    });
                  }}
                  transactionType={transactionType}
                  _columns={_purchaseGridCol}
                  keyField={"productID"}
                  height={windowHeight - 330}
                  gridId={`${gridCode}`}
                  onAddData={handleAddData}
                  summaryConfig={formState.summaryConfig}
                  gridFontSize={formState.userConfig?.gridFontSize}
                  gridIsBold={formState.userConfig?.gridIsBold}
                  rowHeight={
                    formState.userConfig?.gridRowHeight ?? _st.gridRowHeight
                  }
                  headerRowHeight={formState.userConfig?.gridHeaderRowHeight ?? _st.gridHeaderRowHeight}
                  gridBorderColor={formState.userConfig?.gridBorderColor}
                  gridHeaderBg={formState.userConfig?.gridHeaderBg}
                  gridHeaderFontColor={
                    formState.userConfig?.gridHeaderFontColor
                  }
                  gridBorderRadius={formState.userConfig?.gridBorderRadius}
                  showColumnBorder={formState.userConfig?.showColumnBorder ?? true}
                  activeRowBg={formState.userConfig?.activeRowBg}
                  gridFooterBg={formState.userConfig?.gridFooterBg}
                  gridFooterFontColor={formState.userConfig?.gridFooterFontColor}
                  ignoreKeyMovesInCell={true}
                />
                {/* Grid Under Modification */}
                <TransactionFooter
                  transactionType={transactionType ?? ""}
                  calculateTotal={calculateTotal}
                  applyDiscountsToItems={applyDiscountsToItems}
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                  focusDiscount={focusDiscount}
                  focusAmount={focusAmount}
                  goToPreviousPage={goToPreviousPage}
                  save={save}
                  selectAttachment={selectAttachment}
                  isAppGlobal={clientSession.isAppGlobal}
                  toggleDropup={toggleFooterDropup}
                  applicationSettings={applicationSettings}
                  loadAndSetTransVoucher={loadAndSetTransVoucher}
                  handleDiscountSlab={handleDiscountSlab}
                  giftOnBilling={giftOnBilling}
                  applyTaxOnBillDiscount={calculateTaxOnDiscount}
                  // generateLPO={generateLPO}
                  // generateLPQ={generateLPQ}
                  // clientSession={clientSession}
                  footerLayout={
                    ((formState.transactionLoading
                      ? _st.footerPosition
                      : formState.userConfig?.footerPosition) || "bottom") ===
                      "right"
                      ? "vertical"
                      : "horizontal"
                  }
                  costCenterRef={costCenterRef}
                  onFooterHeightChange={handleFooterHeightChange}
                  handleLoadSr={handleLoadSr}
                  importFromExcel={importFromExcel}
                  taxOnDiscountApplyButton={taxOnDiscountApplyButton}
                />

                {/* Total Summary */}
                {/* <div className="bg-white shadow-md p-[10px] rounded-lg mt-0">
                <div className="flex justify-between mb-2 text-gray-600 text-sm">
                  <span className="flex-1">
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
              </div> */}
              </div>
            </div>
          </div>
        )}

        {/* footer starts here */}
        {formState.userConfig?.footerPosition !== "right" && (
          <TransactionFooter
            transactionType={transactionType ?? ""}
            calculateTotal={calculateTotal}
            applyDiscountsToItems={applyDiscountsToItems}
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
            focusDiscount={focusDiscount}
            focusAmount={focusAmount}
            goToPreviousPage={goToPreviousPage}
            save={save}
            selectAttachment={selectAttachment}
            isAppGlobal={clientSession.isAppGlobal}
            toggleDropup={toggleFooterDropup}
            footerLayout={"horizontal"}
            applicationSettings={applicationSettings}
            loadAndSetTransVoucher={loadAndSetTransVoucher}
            handleDiscountSlab={handleDiscountSlab}
            giftOnBilling={giftOnBilling}
            applyTaxOnBillDiscount={applyTaxOnBillDiscount}
          // generateLPO={generateLPO}
          // generateLPQ={generateLPQ}
          // clientSession={clientSession}
            costCenterRef={costCenterRef}
            onFooterHeightChange={handleFooterHeightChange}
            handleLoadSr={handleLoadSr}
            importFromExcel={importFromExcel}
            taxOnDiscountApplyButton={taxOnDiscountApplyButton}
          />
        )}
        {/* footer ends here */}
</div>
      // If pos
      
      ) : (
      <div className="flex w-full h-[100dvh]  ">
        <div className="h-full flex flex-col gap-2 md:w-[calc(100%-440px)] lg:w-[calc(100%-450px)] xl:w-[calc(100%-500px)]">
          <div className="flex flex-col gap-1 h-24 py-1 ">
            <PosHeader formState={formState} dispatch={dispatch} />
            <div className="flex items-center justify-between px-2">
              <div className="font-bold text-danger text-md">
                {" "}
                NAFTALIN WHITE FAMILY 20PSC{" "}
              </div>
              <div className="font-bold text-back text-md">
                {t("expiry_date")}:{new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full">
            {/* <div className="h-[calc(100%-(350)px)]"> */}
              <ErpPurchaseGrid
                onSaveItem={onSaveItem}
              ref={purchaseGridRef}
              onChange={handleTextDataChange}
              zIndexController={40}
              onKeyDown={(
                value: any,
                e: React.KeyboardEvent<any>,
                column: keyof TransactionDetail,
                rowIndex: number
              ) => {
                handleTextDataKeyDown(value, e, column, rowIndex, {
                  result: {},
                  formStateHandleFieldChangeKeysOnly:
                    formStateHandleFieldChangeKeysOnly,
                });
              }}
              transactionType={transactionType}
              _columns={_purchaseGridCol}
              keyField={"productID"}
              height={posGridHeight}  // 260 footer/ 32 header
              // height={300} //window.innerHeight-350
              gridId={`${gridCode}`}
              onAddData={handleAddData}
              summaryConfig={formState.summaryConfig}
              gridFontSize={formState.userConfig?.gridFontSize}
              gridIsBold={formState.userConfig?.gridIsBold}
              rowHeight={formState.userConfig?.gridRowHeight ?? _st.gridRowHeight}
              headerRowHeight={
                formState.userConfig?.gridHeaderRowHeight ?? _st.gridHeaderRowHeight
              }
              gridBorderColor={formState.userConfig?.gridBorderColor}
              gridHeaderBg={formState.userConfig?.gridHeaderBg}
              gridHeaderFontColor={formState.userConfig?.gridHeaderFontColor}
              gridBorderRadius={formState.userConfig?.gridBorderRadius}
              showColumnBorder={formState.userConfig?.showColumnBorder ?? true}
              activeRowBg={formState.userConfig?.activeRowBg}
              gridFooterBg={formState.userConfig?.gridFooterBg}
              gridFooterFontColor={formState.userConfig?.gridFooterFontColor}
              ignoreKeyMovesInCell={true}
            />
            {/* </div> */}
            <PosFooter formState={formState} dispatch={dispatch} />
          </div>
        </div>

        <div className=" md:w-[440px] lg:w-[450px] xl:w-[500px] h-full">
          <PosSideMenu formState={formState} dispatch={dispatch} />
        </div>
      </div>

    
      )}
        {formState.transaction && (
          <ERPModal
            isOpen={(formState.userConfig?.printPreview ?? false) && (popupData.IsPrintPreviewPopup.isOpen ?? false)}
            title={t("Template")}
            width={1000}
            height={700}
            isForm={true}
            isPrintButton={true}
            closeModal={() => {
              dispatch(toggleIsPrintPreviewPopup({ isOpen: false }));
            }}
            content={
              <TemplatesPreView
                voucherType={formState.transaction.master?.voucherType ?? ""}
                printPreviwPopupInfo={popupData.IsPrintPreviewPopup}
                transactionType={formState.transactionType}
                isInvTrans
                lastChooseTemp={formState.lastChoosedTemplate}
              />
            }
          />
        )}

        {formState.isFormStateDetailOpen && (
          <ERPModal
            isOpen={formState.isFormStateDetailOpen}
            title={t("formstate_summary")}
            width={2500}
            height={2500}
            isForm={true}
            disableParentInteraction={false}
            closeModal={() =>
              dispatch(
                formStateHandleFieldChange({
                  fields: { isFormStateDetailOpen: false },
                })
              )
            }
            content={
              <ObjectViewer
                value={formState}
                label="formState"
                expandByDefault={true}
              />
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
            closeModal={() =>
              dispatch(
                formStateHandleFieldChange({
                  fields: { isProductSummaryOpen: false },
                })
              )
            }
            content={
              <ProductSummaryMaster
                productID={formState.currentCell?.data.productID}
                productBatchID={formState.currentCell?.data.productBatchID}
                warehouseID={formState.transaction.master.fromWarehouseID}
              />
            }
          />
        )}

        {formState.userConfig?.barCodePrev && (
          <ERPModal
            isOpen={formState.barcodePrevOpen || false}
            title={t("barcode_print")}
            isForm={true}
            closeModal={() =>
              dispatch(
                formStateHandleFieldChange({
                  fields: { barcodePrevOpen: false },
                })
              )
            }
            content={
              <DownloadBarcodePreview
                template={formState?.barcodeTemplate}
                data={formState?.barcodeData}
              />
            }
            width={5000}
            height={5000}
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
            closeModal={() =>
              dispatch(
                formStateHandleFieldChange({
                  fields: { isPartyWiseSummaryOpen: false },
                })
              )
            }
            content={
              <PartySummaryMaster
                partyId={formState.transaction.master.ledgerID}
              />
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

        <BottomSidebar
          isOpen={isOpentwo}
          setIsOpen={setIsOpentwo}
          minHeight={200}
          maxHeight={600}
          initialHeight={400}
        >
          <div>
            <div style={sidebarHeaderStyle}>
              {/* <h2 style={sidebarTitleStyle}>Bottom Sidebar</h2> */}
              <button
                style={closeButtonStyle}
                onClick={() => setIsOpentwo(false)}
              >
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

        {/* <ERPResizableSidebar
          minWidth={350}
          isOpen={formState.templateChooserModal ?? false}
          setIsOpen={() =>
            dispatch(
              formStateHandleFieldChange({ fields: { templateChooserModal: false } })
            )
          }
        >
          {formState.templateChooserModal && (
            <TemplatesView
              voucherType={formState.transaction.master?.voucherType ?? ""}
              formType={formState.transaction.master?.voucherForm}
              customerType={formState.transaction.master?.customerType}
              onTemplateChoosed={(template: any) => {
                  dispatch(formStateHandleFieldChange({fields:{lastChoosedTemplate: template}}))
              }}              
              setIsOpen={() =>
                dispatch(
                  formStateHandleFieldChange({ fields: { templateChooserModal: false } })
                )
              }
            />
          )}
        </ERPResizableSidebar> */}

        {/* <ERPResizableSidebar
          minWidth={350}
          isOpen={isAttachmentOpen}
          setIsOpen={setIsAttachmentOpen}
          children={<ERPAttachment setIsOpen={setIsAttachmentOpen} />}
        /> */}

        {/* <ERPResizableSidebar
          minWidth={350}
          isOpen={isHistoryOpen}
          setIsOpen={setIsHistoryOpen}
          children={<ERPAttachment setIsOpen={setIsHistoryOpen} />}
        /> */}

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

        {transactionType !== "" && isHistorySidebarOpen && (
          <HistorySidebar
            transactionType={transactionType ?? ""}
            isOpen={isHistorySidebarOpen}
            onClose={() => setIsHistorySidebarOpen(false)}
          />
        )}

        {formState.showQuantityFactors.visible && (
          <QtyFactorsModal
            qtyDesc={formState.showQuantityFactors.qtyDesc}
            isOpen={formState.showQuantityFactors.visible}
            rowIndex={formState.showQuantityFactors.rowIndex}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { showQuantityFactors: false },
                })
              )
            }
            t={t}
          />
        )}
         {/* This is qty factors for mass(M) */}
        {formState.showQuantityFactorsM.visible && (
          <MQtyFactorsModal
            qtyDesc={formState.showQuantityFactorsM.qtyDesc}
            isOpen={formState.showQuantityFactorsM.visible}
            rowIndex={formState.showQuantityFactorsM.rowIndex}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { showQuantityFactorsM: false },
                })
              )
            }
            t={t}
          />
        )}

        {formState.showPcode && (
          <ItemListModal
            isOpen={formState.showPcode}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { showPcode: false },
                })
              )
            }
            t={t}
          />
        )}

        {formState.batchEntryData && formState.batchEntryData.visible && (
          <BatchEntryModal
            data={formState.batchEntryData.data}
            isOpen={formState.batchEntryData.visible}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { batchEntryData: { visible: false, data: "" } },
                  updateOnlyGivenDetailsColumns: true,
                })
              )
            }
            rowIndex={formState.batchEntryData.rowIndex}
            t={t}
          />
        )}

        {formState.serialNoEntryData && formState.serialNoEntryData.visible && (
          <Serials
            data={formState.serialNoEntryData.data}
            isOpen={formState.serialNoEntryData.visible}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { serialNoEntryData: { visible: false, data: "" } },
                  updateOnlyGivenDetailsColumns: true,
                })
              )
            }
            t={t}
            productId={null}
            rowIndex={formState.serialNoEntryData.rowIndex}
            productName={formState.serialNoEntryData.productName}
          />
        )}

        {formState.imfData && formState.imfData.visible && (
          <Flavours
          data={formState.imfData.data}
            isOpen={formState.imfData.visible}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { imfData: { visible: false, data: "", rowIndex: 0, slNo: 0} },
                  updateOnlyGivenDetailsColumns: true,
                })
              )
            }
            t={t}
            productId={null}
            rowIndex={formState.imfData.rowIndex}/>
        )}

        {/* Flavour modal setup */}
        {formState.flavourData && formState.flavourData.visible && (
          <FlavoursFlv
            data={formState.flavourData.data}
            isOpen={formState.flavourData.visible}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { flavourData: { visible: false, data: "", rowIndex: 0, slNo: 0} },
                  updateOnlyGivenDetailsColumns: true,
                })
              )
            }
            t={t}
            productId={formState.flavourData.productId}
            rowIndex={formState.flavourData.rowIndex}
            productName={formState.flavourData.productName}
          /> 
        )}

        {formState.productInfo && (
          <ProductInfoSlideUp
            isOpen={formState.productInfo}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { productInfo: false },
                })
              )
            }
            t={t}
          />
        )}

        {formState.ShowProductBatchUnitDetails && (
          <ProductBatchUnitDetails
            isOpen={formState.ShowProductBatchUnitDetails}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { ShowProductBatchUnitDetails: false },
                })
              )
            }
            t={t}
          />
        )}

        {formState.showProductInformation?.show && (
          <ProductInformation
            index={formState.showProductInformation.index}
            formState={formState}
            isOpen={formState.showProductInformation?.show}
            transactionType={transactionType ?? formState.transactionType ?? ""}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { showProductInformation: { show: false, index: 0 } },
                })
              )
            }
          />
        )}

        {formState.showGridTheme && (
          <GridTheme
            t={t}
            isOpen={formState.showGridTheme}
            onClose={() =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { showGridTheme: false },
                })
              )
            }
            transactionType={transactionType}
            formState={formState}
            onClearThemeChangeInterval={onClearThemeChangeInterval}
          />
        )}

        {formState.documentModal && (
          <ERPModal
            isOpen={formState.documentModal}
            closeModal={closeDocumentModal}
            title={t("document_properties")}
            width={700}
            height={620}
            content={
              <DocumentProperties closeModal={closeDocumentModal} t={t} />
            }
          />
        )}
      {formState.saving && (
        <SavingOverlay
          saving={true}
          saveCompleted={formState.savingCompleted ?? false}
          savingSwitchAction={formStateHandleFieldChange({
            fields: { savingCompleted: undefined, saving: false },
          })}
        />
      )}

      {formState.deleting && (
        <DeletingOverlay
          deleting={true}
          deleteCompleted={formState.deletingCompleted ?? false}
          deletingSwitchAction={formStateHandleFieldChange({
            fields: { deletingCompleted: undefined, deleting: false },
          })}
        />
      )}

      {formState.memoEditor && formState.memoEditor.visible && (
        <MemoEditorModal
          data={formState.memoEditor.data}
          isOpen={formState.memoEditor.visible}
          onClose={() =>
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: { memoEditor: { visible: false, data: "" } },
                updateOnlyGivenDetailsColumns: true,
              })
            )
          }
          rowIndex={formState.memoEditor.rowIndex}
          t={t}
        />
      )}

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
                formStateHandleFieldChange({
                  fields: { showbillwise: false, billwiseData: [], ledgerBillWiseSaving: false },
                })
              );
            }}
            isForm={true}
            width={1200}
            height={800}
            content={
              <BillWisePopup
                isInv={true}
                drCr={formState.billwiseDrCr}
                onSave={async (
                  billwiseDetails: string,
                  totalAmount: number,
                  vrNumbers: string,
                  fromAutoPost: boolean,
                  bills?: any[]
                ) => {
                  if (
                    applicationSettings.accountsSettings?.maintainBillwiseAccount
                  ) {
                    await postBillWiseDetails({ accTransactionDetailID: formState.transaction.master.accTransactionDetailIDForBillwise, billWiseDetails: bills ?? [] })
                  }
                }}
              />
            }
          />
        )}

      {/* Authorization Modal for edit authorization */}
      <AuthorizationModal />
      {/* Date Picker Modal */}
      <DateChangeModal />

      {/* E-Way bill details modal */}
      {/* Make sure that the modal open section code is need to place in this page or some where else */}
      {formState.eWayBillDetailOpen && (
            <ERPModal
              isOpen={formState.eWayBillDetailOpen}
              closeModal={handleCloseEWayDetailsModal}
              title={t('e_way_bill_details')}
              width={1400}
              height={900}
              content={
                <EWayBillDetails
                  closeModal={handleCloseEWayDetailsModal}
                  formState={formState}
                  loadAndSetTransVoucher={loadAndSetTransVoucher}
                  t={t}
                />
              }
            />
          )}
    </>
  );
};

export default TransactionForm;


