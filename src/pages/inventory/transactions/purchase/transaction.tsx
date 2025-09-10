import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ColumnModel,
  EmployeeType,
  GridQtyFactors,
  SummaryItems,
  TransactionDetail,
  TransactionProps,
  UserConfig,
} from "./transaction-types";
import { TransactionData, TransactionFormState } from "./transaction-types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import {
  formStateHandleFieldChange,
  formStateHandleFieldChangeKeysOnly,
  formStateMasterHandleFieldChange,
  formStateSetDetails,
  resetState,
  themeChangeCountdownTick,
  updateFormElement,
} from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../../helpers/api-client";
import {
  ApplicationMainSettings,
  ApplicationMainSettingsInitialState,
} from "../../../settings/system/application-settings-types/application-settings-types-main";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTransaction } from "./use-transaction";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import CustomerDetailsSidebar from "../../../transaction-base/customer-details";
import {
  generateUniqueKey,
  isNullOrUndefinedOrZero,
  remToPx,
} from "../../../../utilities/Utils";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import TemplatesView from "./templates";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useUserRights } from "../../../../helpers/user-right-helper";
import { Info, X } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { renderSelectedTemplate } from "./renderSelected-template";
import moment from "moment";
import ERPAttachment from "../../../../components/ERPComponents/erp-attachment";
import HistorySidebar from "./historySidebar";
import UnsavedChangesModal from "./unsavedChangesModal";
import Header from "./components/header";
import Urls from "../../../../redux/urls";
import BottomSidebar from "../../../../components/ERPComponents/bottom-sidebar";
import ProductSummaryMaster from "../../reports/other-inventory-reports/product-summary/product-summary-master";
import PartySummaryMaster from "../../../accounts/reports/partywise-summary/party-summary-master";
import {
  transactionInitialData,
  TransactionFormStateInitialData,
  initialFormElements,
  initialInventoryTotals,
} from "./transaction-type-data";
import ErpPurchaseGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-purchase-grid/dataGrid";
import TransactionFooter from "./transaction-footer";
import TransactionHeader from "./transaction-header";
import { LedgerType } from "../../../../enums/ledger-types";
import VoucherType from "../../../../enums/voucher-types";
import ObjectViewer from "./components/fomstate-view";
import ERPPreviousUrlButton from "../../../../components/ERPComponents/erp-previous-uirl-button";
import QtyFactorsModal from "./qty-factors";
import ItemListModal from "./item-list";
import { DeepPartial } from "redux";
import BatchEntryModal from "./batch-entry";
import Serials from "./serials";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import ProductInfoSlideUp from "./productInfo";
import ProductBatchUnitDetails from "./product-batch-unit-details";
import DocumentProperties from "./document-properties";
import ProductInformation from "./product-information";
import DownloadBarcodePreview from "../../../LabelDesigner/download-preview-barcode";
import { barCodeField } from "../../../LabelDesigner/fields";
import { customJsonParse, modelToBase64, safeBase64Decode } from "../../../../utilities/jsonConverter";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import BlurLoader from "../../../../components/ERPComponents/erp-loader";
import { getInitialPreference } from "../../../../utilities/dx-grid-preference-updater";
import GridTheme from "./grid-theme";
import { purchaseGridCol } from "./transaction-grid-cols";
import SavingOverlay from "../transaction-saving";
import { BusinessType } from "../../../../enums/business-types";
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
  // localInputBox,
}) => {
  const Utc = localStorage.getItem("utInvc");
  const st = safeBase64Decode(Utc ?? "");
  const _st: UserConfig = customJsonParse(st??"{}");

  const [triggerEffect, setTriggerEffect] = useState(false);
  // const handleClearControls = () => {
  //   clearControls(
  //     formState.isEdit,
  //     formState.transaction.master.invTransactionMasterID
  //   );
  //   // setTriggerEffect(prev => !prev); // Toggle the triggerEffect state
  //   // setTriggerEffect(true);
  // };
  const handleClearControls = async () => {
    // 1) Guard: check voucher locked
    if (formState?.transaction?.master?.isLocked) {
      ERPAlert.show({
        title: t("warning"),
        text: t("voucher_is_locked"),
        icon: "warning",
      });
      return;
    }

    try {
      // 2) Ask for confirmation
      const result: any = await ERPAlert.show({
        title: t("clearing_transaction_question"),
        text: t("once_clearing_this_transaction_cannot_be_recovered"),
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
        formState.isEdit,
        formState.transaction.master.invTransactionMasterID
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
  const [gridCode, setGridCode] = useState<string>(
    `grd_inv_transaction_${(voucherType ?? "") + (formType ?? "")}`
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
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);
  const isFooterOnRight = formState.transactionLoading
    ? _st.footerPosition === "right"
    : formState.userConfig?.footerPosition === "right";
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
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
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const onClearThemeChangeInterval = () => {
    clearInterval(timerRef.current);
  }

  // javascript// Add a new state to track when countdown should start
  const [startCountdown, setStartCountdown] = useState(false);

  useEffect(() => {
    if (formState.selectedTheme && formState.selectedTheme.isInitial !== true) {
      console.log('Theme selected, triggering countdown');
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


  // Separate effect for countdown - not dependent on selectedTheme
  useEffect(() => {
    if (!startCountdown) return;
    console.log('⏰ Starting countdown timer');
    let countdown = 8;

    const interval = setInterval(() => {
      countdown -= 1;
      console.log('⏱️ Tick - countdown:', countdown);
      dispatch(formStateHandleFieldChangeKeysOnly({
        fields: { themeChangeCountdown: countdown }
      }));
      debugger
      if (formState.themeChangeCountdown === undefined) {
        clearInterval(interval);
        setStartCountdown(false);
        return
      }

      if (countdown <= 0) {
        dispatch(formStateHandleFieldChangeKeysOnly({
          fields: {
            userConfig: { ...formState.currentTheme },
            selectedTheme: formState.currentTheme,
            themeChangeCountdown: 0
          }
        }));

        console.log('🛑 Countdown complete');
        clearInterval(interval);
        setStartCountdown(false);
        // Revert to original theme
      }
    }, 1000);

    return () => {
      console.log('Cleanup countdown timer');
      clearInterval(interval);
    };
  }, [startCountdown, formState.currentTheme, formState.userConfig?.themeName, formState.themeChangeCountdown]);

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
    setIsDropDownOpen((prev) => !prev);
    setIsDropUpOpen(false);
  };

  const toggleFooterDropup = () => {
    setIsDropUpOpen((prev) => !prev);
    setIsDropDownOpen(false);
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
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
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

  const handleDocumentModalClick = () => {
    setIsDocumentModalOpen(true);
  };

  const closeDocumentModal = () => {
    setIsDocumentModalOpen(false);
  };

  const handleKeyDown = (e: any, field: string, rowIndex: number) => { };
  const formStateRef = useRef(formState);
  useEffect(() => {
    formStateRef.current = formState;
  }, [formState]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "F") {
        event.preventDefault();
        if (voucherNumberRef.current) {
          voucherNumberRef.current.focus();
        }
      }
      // Focus Voucher Number ☝
      if (event.shiftKey && event.key === "D") {
        event.preventDefault();
        handleDocumentModalClick();
      }
      // Document Properties ☝
      if (event.ctrlKey && event.key.toLowerCase() === "g") {
        event.preventDefault();
        const currentFormState = formStateRef.current;
        if (
          currentFormState.transaction.details.length > 0 &&
          purchaseGridRef.current
        ) {
          const visibleColumns =
            currentFormState.gridColumns?.filter(
              (col) => col.visible !== false && col.dataField != null
            ) || [];
          const firstEditableColumn = visibleColumns.find(
            (col) => col.allowEditing == true && !col.readOnly
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
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

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
    loadLedgerData
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
    discountRef,
    chequeStatusRef,
    handleKeyDown,
  );

  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const { hasRight } = useUserRights();
  const gridHeight = useMemo(() => {
    if (deviceInfo?.isMobile) {
      return window.innerHeight - 330
    }
    let height;
    if (
      (formState.transactionLoading && _st.footerPosition === "right") ||
      (!formState.transactionLoading &&
        formState.userConfig?.footerPosition === "right")
    ) {
      height = window.innerHeight - 303;
    } else {
      height = window.innerHeight - 480;
    }

    console.log('Max safe integer:', Number.MAX_SAFE_INTEGER);
    console.log('Max value:', Number.MAX_VALUE);
    console.log('Positive infinity:', Number.POSITIVE_INFINITY);
    console.log('Current grid height:', height);

    return height;
  }, [formState.transactionLoading, formState.userConfig?.footerPosition, _st.footerPosition]);


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
    if (formState.isInitialLedger != true) {
      await loadLedgerData(undefined, dispatch);
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
    const initializeFormElements = async () => {
      const dataWarranty = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/data/warranty`
      );
      const dataBrands = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/data/brands`
      );
      let _formState: TransactionFormState;
      const isInvoker = (voucherNo && voucherNo > 0) || (transactionMasterID && transactionMasterID > 0);

      const softwareDate = moment(
        clientSession.softwareDate,
        "DD/MM/YYYY"
      ).local();

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
              purchaseInvoiceDate: moment().local().toISOString(),
              employeeID: employeeID,
              voucherNumber: _voucherNo,
              inventoryLedgerID:
                voucherType == VoucherType.PurchaseReturn
                  ? applicationSettings.inventorySettings?.defaultPurchaseReturnAcc
                  : voucherType == "DNS"
                    ? applicationSettings.inventorySettings?.defaultSalesAcc
                    : applicationSettings.inventorySettings?.defaultPurchaseAcc,
              ledgerID: applicationSettings.accountsSettings?.defaultCashAcc,
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
        _formState = await loadLedgerData(_formState) as any;
      _formState.isInitialLedger = true;
      } else {
        _formState = (await loadTransVoucher(
          false,
          voucherNo,
          voucherPrefix,
          voucherType,
          formType,
          undefined,
          transactionMasterID
        )) as TransactionFormState;
      }

      _formState.dataWarranty = dataWarranty;
      _formState.dataBrands = dataBrands;

      _formState.inSearch =
        applicationSettings.productsSettings?.batchCriteria != "NB"
          ? false
          : true;
      _formState.userRightsFormCode = formCode ?? "";
      if (voucherType == "PI") {
        if (isInvoker && formType == "IMPORT") {
          _formState.userRightsFormCode = "PIIMPORT"
        }
      }
      const _gridCols = (await getInitialPreference(gridCode, _purchaseGridCol, new APIClient()))

      _formState = {
        ..._formState,
        isInv: true,
        transaction: {
          ..._formState.transaction,
          master: {
            ..._formState.transaction.master,
            costCentreID: applicationSettings.accountsSettings?.defaultCostCenterID,
            hasroundOff:
              formType == "Import"
                ? true
                : _formState.transaction.master.hasroundOff,
          },
        },
        gridColumns: _gridCols.columnPreferences,
        userConfig: {
          ...formState.userConfig,
        },
        transactionType: transactionType ?? "",
        dummyProducts: applicationSettings.productsSettings?.loadDummyProducts,

        formCode: formCode ?? "",
        title:
          (formType == undefined || formType.trim() == ""
            ? t(title)
            : t(title) + "[" + formType + "]") ?? "",
      };

      _formState.gridColumns?.forEach((x: any) => {
        if (x.dataFiled === "unitPriceFC" || x.dataFiled === "grossFC") {
          x.visible = true;
        }
      });

      _formState.formElements = {
        ..._formState.formElements,
        pnlMasters: { ...initialFormElements.pnlMasters, disabled: isInvoker },
        pnlImport: {
          ...initialFormElements.pnlImport,
          visible:
            formType == "Import"
              ? true
              : _formState.formElements.pnlImport.visible,
        },
        grandTotalFc: {
          ...initialFormElements.grandTotalFc,
          visible:
            formType == "Import"
              ? true
              : _formState.formElements.grandTotalFc.visible,
        },
        cbCostCentre: {
          ...initialFormElements.cbCostCentre,
          visible:
            applicationSettings?.accountsSettings?.maintainCostCenter,
          disabled: _formState.userConfig?.presetCostenterId ?? 0 > 0 ? true : initialFormElements.cbCostCentre.disabled
        },
        cbWarehouse: {
          ...initialFormElements.cbWarehouse,
          visible: applicationSettings.inventorySettings?.maintainWarehouse,
          disabled: _formState.userConfig?.presetWarehouseId ?? 0 > 0 ? true : initialFormElements.cbWarehouse.disabled
        },
        cbEmployee: {
          ...initialFormElements.cbEmployee,
          employeeType: _formState.userConfig
            ?.showPurchaserOnly
            ? EmployeeType.Purchaser
            : _formState.formElements.cbEmployee.employeeType
        },
        ledgerID: {
          ...initialFormElements.ledgerID,
          accLedgerType:
            voucherType == VoucherType.PurchaseReturn
              ?
              LedgerType.Cash_Bank_Suppliers_Customers
              :
              formType == "BT"
                ? LedgerType.Branch_Recv_Payable
                : !applicationSettings.inventorySettings
                  ?.showAccountReceivableInPurchase
                  ? LedgerType.Cash_Bank_Suppliers
                  : LedgerType.Cash_Bank_Suppliers_Customers,
        },
        chkTaxNumber: {
          ...initialFormElements.chkTaxNumber,
          label: clientSession.isAppGlobal ? "GSTIN" : "VAT",
        },
        orderApprovalStatus: {
          ...initialFormElements.orderApprovalStatus,
          visible: _formState.transaction.master.voucherType == VoucherType.PurchaseOrder,
          label: _formState.transaction.master.voucherType == VoucherType.PurchaseOrder && _formState.transaction.master.gatePassNo == "Approved"
            ? "PO Approved"
            : _formState.transaction.master.voucherType == VoucherType.PurchaseOrder && _formState.transaction.master.gatePassNo != "Approved"
              ? "PO Not Approved"
              : ""
        }
      } as any;
      _formState.transaction.master.costCentreID =
        applicationSettings.accountsSettings?.defaultCostCenterID;
      if (applicationSettings.accountsSettings?.maintainCostCenter) {


        if (_formState.userConfig?.presetCostenterId ?? 0 > 0) {
          _formState.transaction.master.costCentreID =
            _formState.userConfig?.presetCostenterId ?? 0;
        }
      }
      _formState.transaction.master.fromWarehouseID =
        applicationSettings.inventorySettings?.defaultWareHouse;
      if (applicationSettings.inventorySettings?.maintainWarehouse) {


        if (_formState.userConfig?.presetWarehouseId ?? 0 > 0) {
          _formState.transaction.master.fromWarehouseID =
            _formState.userConfig?.presetWarehouseId ?? 0;

        } else {
          if (applicationSettings.mainSettings?.maintainBusinessType != BusinessType.Distribution) {
            if (
              applicationSettings.accountsSettings?.allowSalesCounter &&
              (_formState.userConfig?.counterWiseWarehouseId ?? 0) > 0
            ) {
              _formState.transaction.master.fromWarehouseID =
                _formState.userConfig?.counterWiseWarehouseId ?? 0;
            } else {
              _formState.transaction.master.fromWarehouseID =
                applicationSettings.inventorySettings?.defaultWareHouse;
            }
          }
        }
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
      const editableColumn = _formState.gridColumns?.find(
        (col) => col.visible !== false && col.dataField != null && col.allowEditing == true && col.readOnly !== true
      );
      _formState.currentCell = {
        column: editableColumn?.dataField ?? "",
        data: formState.transaction.details[0],
        rowIndex: 0,
      }
      // debugger;
      // _formState = await loadLedgerData(_formState) as any;
      // _formState.isInitialLedger = true;
      setTransVoucher(_formState, true);
      // if (voucherNo != undefined && voucherNo > 0) {
      //   dispatch(
      //     setUserRight({ userSession: userSession, hasRight: hasRight })
      //   );
      // }
    };
    initializeFormElements();
  }, [voucherType, voucherPrefix, formType]);
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
  const onProcessSelected = useCallback(async (masterIds: string, loadType: string = "GRN") => {
    if (masterIds.length > 0) {

      dispatch(formStateHandleFieldChange({ fields: { loading: { isLoading: true, text: `${loadType == "GRN" ? 'Please wait while loading GRN Items' : 'Please wait while loading Order Items'}` } } }));
      const PendingTransDetails: any = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/PendingTransactionsByMasterIds`, `masterIDs=${masterIds}`)
      if (PendingTransDetails && PendingTransDetails.details && PendingTransDetails.details.length > 0) {

        const calculatedDetails: TransactionDetail[] = [];
        const refactoredDetails = refactorDetails(PendingTransDetails.details, loadType, { result: {} }, formState.transaction.master.voucherForm);
        for (let index = 0; index < refactoredDetails.length; index++) {
          const element = refactoredDetails[index];
          const calculated = calculateRowAmount(
            element,
            "barCode",
            { result: { transaction: { details: [element] } } },
            true
          );
          calculatedDetails.push(calculated.transaction!.details![0] as TransactionDetail);
        }

        const details = [...calculatedDetails, ...formState.transaction?.details?.filter((x: any) => x.productID > 0) || []]
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

  useEffect(() => {
    const batchSelectionData = async () => {
      if (formState.batchSelectionData != "") {
        const data = JSON.parse(formState.batchSelectionData);
        if (data.rowIndex < 0) {
          return;
        }
        const baseDetail = { ...formState.transaction.details[data.rowIndex] };
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
                res = calculateRowAmount(
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

                let _res = calculateRowAmount(
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

            const totalRes = calculateTotal(
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
            debugger;
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: {
                  ...totalRes,
                  summary: summaryRes.summary,
                  showQuantityFactors: { visible: false, rowIndex: -1 },
                  transaction: {
                    ...totalRes.transaction,
                    details: res.transaction?.details,
                  },
                  currentCell: {
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
            debugger;

          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [formState.popupSearchSelectionData]);

  useEffect(() => {
    if (formState.quantityFactorData != "") {
      const data = JSON.parse(formState.quantityFactorData);
      const rowIndex = data.rowIndex;
      const quantityFactor = data.data;
      const baseRowData = formState.transaction.details[rowIndex];
      let currentDetails = [
        ...formState.transaction.details.filter((x) => x.productID > 0),
      ];
      let res: DeepPartial<TransactionFormState> = {};
      let addDetails: TransactionDetail[] = [];
      quantityFactor.forEach((value: GridQtyFactors, index: number) => {
        if (index == 0) {
          const rowData = { ...baseRowData, qty: value.total };
          currentDetails[rowIndex] = rowData;
          res = calculateRowAmount(rowData, "qty", { result: {} }, true);
          res!.transaction!.details![0]!.productDescription = `${value.width} X ${value.height} X ${value.nos}`;
        } else {
          const rowData = {
            ...baseRowData,
            qty: value.total,
            slNo: generateUniqueKey(),
            productDescription: `${value.width} X ${value.height} X ${value.nos}`,
          };
          res = calculateRowAmount(rowData, "qty", { result: {} }, true);
          if (
            res?.transaction?.details &&
            res?.transaction?.details.length > 0
          ) {
            addDetails.push(res!.transaction!.details![0] as TransactionDetail);
          }
        }
      });

      let final = [...currentDetails, ...addDetails];
      const summaryRes = calculateSummary(final, formState, { result: {} });

      const totalRes = calculateTotal(
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
            showQuantityFactors: { visible: false, rowIndex: -1 },
            transaction: {
              ...totalRes.transaction,
              details: res.transaction?.details,
            },
          },
          updateOnlyGivenDetailsColumns: true,
          rowIndex: rowIndex,
          itemsToAddToDetails: addDetails,
        })
      );
    }
  }, [formState.quantityFactorData]);



  const _purchaseGridCol: ColumnModel[] = purchaseGridCol(applicationSettings, userSession
    , voucherType ?? formState.transaction.master.voucherType
    , formType ?? formState.transaction.master.voucherForm, t, formState) ?? []
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
    debugger;
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

  return (
    <>
      {/* { !formState.transactionLoading ?( */}
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
                      {t(formState.title)}
                      {!formState.formElements.lblPosted.visible && (
                        <div title={t("posted_transaction")}>
                          <Info className="text-[#ef4444] w-4 h-4" />
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
                    selectTemplates={selectTemplates}
                    goToPreviousPage={goToPreviousPage}
                    isHistorySidebarOpen={isHistorySidebarOpen}
                    setIsPrintModalOpen={setIsPrintModalOpen}
                    onProcessSelected={onProcessSelected}
                    downloadImportTemplateHeadersOnly={downloadImportTemplateHeadersOnly}
                    importFromExcel={importFromExcel}
                  />
                </div>
              </div>
            </div>

            {/* header starts here */}
            <TransactionHeader
              formState={formState}
              dispatch={dispatch}
              handleKeyDown={handleKeyDown}
              focusToNextColumn={focusToNextColumn}
              loadAndSetTransVoucher={loadAndSetTransVoucher}
              t={t}
              handleLoadByRefNo={handleLoadByRefNo}
              handleFieldChange={handleFieldChange}
              setIsPartyDetailsOpen={setIsPartyDetailsOpen}
              transactionType={transactionType ?? formState.transactionType}
              handleFieldKeyDown={handleFieldKeyDown}
              ledgerCodeRef={ledgerCodeRef}
              voucherNumberRef={voucherNumberRef}
              refNoRef={refNoRef}
              isDropDownOpen={isDropDownOpen}
              toggleDropdown={toggleHeaderDropdown}
              footerLayout="vertical"
              userSession={userSession}
            />
            {/* header ends here */}

            <div
              // className="mt-[123px]"
              // className={`mj23stylecheck mt-[${123 + (appState?.inputBox?.inputHeight ?? 0)}px]`}
              // className={`mt-[${dynamicMarginTop}px]`}
              className="mj23stylecheck"
              style={{
                // marginTop: `${123 + (appState?.inputBox?.inputHeight ?? 0)}px`,
                marginTop: `${97 + (getInputHeight())}px`,
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
                        isDropUpOpen={isDropUpOpen}
                        toggleDropup={toggleFooterDropup}
                        footerLayout={"vertical"}
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
            <div className="flex flex-col w-full h-full mt-12 overflow-y-auto pb-[43px]">
              <div className="py-0">
                <div
                  className="w-full max-w-full mx-0"
                  style={{
                    position: "fixed",
                    top: "47px",
                    left: 0,
                    right: 0,
                    padding: 0,
                    zIndex: 40,
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
                      selectTemplates={selectTemplates}
                      goToPreviousPage={goToPreviousPage}
                      isHistorySidebarOpen={isHistorySidebarOpen}
                      setIsPrintModalOpen={setIsPrintModalOpen}
                      onProcessSelected={onProcessSelected}
                      downloadImportTemplateHeadersOnly={downloadImportTemplateHeadersOnly}
                      importFromExcel={importFromExcel}
                    />
                  </div>
                </div>
              </div>

              {/* Voucher Info */}
              <div className="flex items-center justify-between gap-2 bg-white px-4 py-2 shadow-md text-gray-600 h-[70px]">
                <div className="flex items-center gap-2 flex-1">
                  <TransactionHeader
                    focusToNextColumn={focusToNextColumn}
                    formState={formState}
                    dispatch={dispatch}
                    handleKeyDown={handleKeyDown}
                    loadAndSetTransVoucher={loadAndSetTransVoucher}
                    t={t}
                    handleLoadByRefNo={handleLoadByRefNo}
                    handleFieldChange={handleFieldChange}
                    setIsPartyDetailsOpen={setIsPartyDetailsOpen}
                    transactionType={
                      transactionType ?? formState.transactionType
                    }
                    handleFieldKeyDown={handleFieldKeyDown}
                    ledgerCodeRef={ledgerCodeRef}
                    voucherNumberRef={voucherNumberRef}
                    refNoRef={refNoRef}
                    isDropDownOpen={isDropDownOpen}
                    toggleDropdown={toggleHeaderDropdown}
                    footerLayout="vertical"
                    userSession={userSession}
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 bg-white text-zinc-800 overflow-y-auto">
                <div className="space-y-2"></div>
                <ErpPurchaseGrid
                  isMobile={true}
                  ref={purchaseGridRef}
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
                  isDropUpOpen={isDropUpOpen}
                  toggleDropup={toggleFooterDropup}
                  footerLayout={
                    ((formState.transactionLoading
                      ? _st.footerPosition
                      : formState.userConfig?.footerPosition) || "bottom") ===
                      "right"
                      ? "vertical"
                      : "horizontal"
                  }
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
        {(formState.transactionLoading && _st.footerPosition !== "right") ||
          (!formState.transactionLoading &&
            formState.userConfig?.footerPosition !== "right" && (
              <TransactionFooter
                transactionType={transactionType ?? ""}
                calculateTotal={calculateTotal}
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
                isDropUpOpen={isDropUpOpen}
                toggleDropup={toggleFooterDropup}
                footerLayout={"horizontal"}
                applyDiscountsToItems={applyDiscountsToItems}
              />
            ))}
        {/* footer ends here */}

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
        {formState.isFormStateDetailOpen && (
          <ERPModal
            isOpen={formState.isFormStateDetailOpen}
            title={t("formState_summary")}
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
            content={<ProductSummaryMaster productID={formState.currentCell?.data.productID} productBatchID={formState.currentCell?.data.productBatchID} />}
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
            content={<PartySummaryMaster partyId={formState.transaction.master.ledgerID} />}
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
        {formState.showQuantityFactors.visible && (
          <QtyFactorsModal
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
            isOpen={formState.showProductInformation.show}
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
        {isDocumentModalOpen && (
          <ERPModal
            isOpen={isDocumentModalOpen}
            title={t("document_properties")}
            width={700}
            height={620}
            closeModal={closeDocumentModal}
            content={
              <DocumentProperties closeModal={closeDocumentModal} t={t} />
            }
          />
        )}
      </div>
      {formState.saving && (
        <SavingOverlay saving={true} saveCompleted={formState.savingCompleted ?? false} savingSwitchAction={formStateHandleFieldChange({
          fields: {
            savingCompleted: undefined, saving: false
          },
        })}
        />
      )}
    </>
  );
};

export default TransactionForm;
