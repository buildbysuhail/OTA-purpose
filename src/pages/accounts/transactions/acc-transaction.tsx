import React, { useCallback, useEffect, useRef, useState } from "react";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import Urls from "../../../redux/urls";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { useParams } from "react-router-dom";
import { AccTransactionProps } from "./acc-transaction-types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import {
  accFormStateHandleFieldChange,
  accFormStateRowHandleFieldChange,
  accFormStateTransactionDetailsRowAdd,
  accFormStateTransactionMasterHandleFieldChange,
  accFormStateTransactionDetailsSetSlNo,
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
import { useTransaction } from "../../use-transaction";
import { AccTransactionUserConfig } from "./acc-transaction-user-config";
import BillWisePopup from "./billwise-popup";
import CustomerDetailsSidebar from "../../transaction-base/customer-details";
import AttachmentSidebar from "../../transaction-base/Attachment-button";
import ActivityLogSidebar from "../../transaction-base/ActivityLog-button";
import { isNullOrUndefinedOrZero } from "../../../utilities/Utils";
import DownloadPreview from "../../LabelDesigner/download-preview";
import {
  DummyInvoiceData,
  DummyVoucherData,
} from "../../InvoiceDesigner/constants/DummyData";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import ERPResizableSidebar from "../../../components/ERPComponents/erp-resizable-sidebar";
import TemplatesView from "./acc-templates";
import { handleResponse } from "../../../utilities/HandleResponse";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import useFormComponent from "./use-form-components";
import { useUserRights } from "../../../helpers/user-right-helper";
import {
  Delete,
  FileDown,
  Loader,
  Pencil,
  Printer,
  RefreshCw,
  Replace,
  Settings,
  Trash,
  Trash2,
  X,
} from "lucide-react";
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
}) => {
  const { t } = useTranslation();
  const [gridCode, setGridCode] = useState<string>(
    `grd_acc_transaction_${voucherType}`
  );
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const ledgerCodeRef = useRef<HTMLInputElement>(null);
  const ledgerIdRef = useRef<HTMLInputElement>(null);
  const masterAccountRef = useRef<HTMLInputElement>(null);
  const costCenterRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const drCrRef = useRef<HTMLInputElement>(null); // Example for a dropdown/select
  const narrationRef = useRef<HTMLInputElement>(null); // Example for a textarea
  const erpGridRef = useRef<any>(null); // Reference to ERPDevGrid
  const voucherNumberRef = useRef<HTMLInputElement>(null); // Ref for voucherNumber

  const [selectedRows, setSelectedRows] = useState([]);
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRows); // Contains full row data
    const selectedIndexes = e.component
      .getSelectedRowKeys()
      .map((key: any) => e.component.getRowIndexByKey(key));
    console.log("Selected Rows:", selectedIndexes);
    if (selectedIndexes.length > 0) {
      handleRowClick({
        row: formState.transaction.details[selectedIndexes[0]],
      });
    }
  };
  const handleKeyDown = (e: any, field: string) => {
    handleFieldKeyDown(
      field,
      e.event.originalEvent.key,
      erpGridRef,
      applicationSettings
    );
  };

  const [loadTemplate, setLoadTemplate] = useState<TemplateState>();
  const { getFormattedValue, getAmountInWords } = useNumberFormat();
  const {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransVoucher,
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
    printVoucher,
    clearControls,
  } = useAccTransaction(
    transactionType ?? "",
    btnSaveRef,
    ledgerCodeRef,
    ledgerIdRef,
    masterAccountRef,
    costCenterRef,
    amountRef,
    drCrRef,
    narrationRef,
    voucherNumberRef
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
      accFormStateTransactionMasterHandleFieldChange({
        fields: {
          voucherType: voucherType,
          voucherPrefix: voucherPrefix,
          formType: formType,
          drCr: drCr,
        },
      })
    );
    dispatch(
      accFormStateHandleFieldChange({
        fields: {
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
  ]);

  useEffect(() => {
    dispatch(
      accFormStateHandleFieldChange({
        fields: { isInvoker: voucherNo && voucherNo > 0 },
      })
    );
  }, []);

  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: { formCode: formCode } }));
  }, [formCode]);

  useEffect(() => {
    dispatch(
      accFormStateTransactionMasterHandleFieldChange({
        fields: {
          voucherPrefix: voucherPrefix,
          voucherNumber:
            voucherNo != undefined && voucherNo > 0
              ? voucherNo
              : getNextVoucherNumber(formType, voucherType, voucherPrefix),
        },
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      accFormStateTransactionMasterHandleFieldChange({ fields: { drCr: drCr } })
    );
  }, [drCr]);

  // useEffect(() => {
  //   dispatch(
  //     accFormStateTransactionDetailsSetSlNo({})
  //   );
  // }, [formState.transaction.details]);
  useEffect(() => {
    dispatch(
      accFormStateRowHandleFieldChange({
        fields: {
          costCentreId:
            formState.userConfig.presetCostenterId > 0
              ? formState.userConfig.presetCostenterId
              : userSession.dbIdValue == "SAMAPLASTICS"
              ? 0
              : null,
        },
      })
    );
  }, []);

  useEffect(() => {
    let drCr = "";
    const loadLedgerData = async () => {
      switch (formState.transaction.master.voucherType) {
        case "CP":
        case "BP":
        case "DN":
        case "CQP":
        case "SV":
        case "SRV":
        case "PBP":
          drCr = "Dr";

        case "CR":
        case "BR":
        case "CN":
        case "CQR":
        case "PV":
        case "PBR":
          drCr = "Cr";

        case "OB":
        case "MJV":
          drCr = formState.row.drCr == "Dr" ? "Dr" : "Cr";

        case "JV":
          drCr = formState.row.drCr == "Dr" ? "Cr" : "Dr";
      }
      if (
        formState.showbillwise === true &&
        formState.row.ledgerId &&
        formState.ledgerData != null
      ) {
        dispatch(
          accFormStateHandleFieldChange({
            fields: {
              ledgerBillWiseLoading: true,
            },
          })
        );

        try {
          if (
            formState.showbillwise === true &&
            formState.row.ledgerId &&
            formState.ledgerData != null
          ) {
            const billwise = await api.getAsync(
              `${Urls.acc_transaction_ledger_bill_wise}?LedgerId=${
                formState.row.ledgerId
              }&DrCr=${
                formState.transaction.master.drCr
              }&AccTransactionDetailID=${
                formState.row.accTransactionDetailId ?? 0
              }`
            );
            dispatch(
              accFormStateHandleFieldChange({
                fields: {
                  billwiseData: billwise,
                  ledgerBillWiseLoading: false,
                },
              })
            );

            // if (voucherType === "CN" || voucherType === "DN") {
            //   if (isBillwiseApplicable(cbMasterAccount)) {
            //     handleBillwiseDialog(cbMasterAccount, "");
            //     focusNext();
            //   } else {
            //     focusNext();
            //   }
            // } else {
            //   if (isBillwiseApplicable(cbLedger)) {
            //     handleBillwiseDialog(cbLedger, "");
            //     focusNext();
            //   } else {
            //     focusNext();
            //   }
            // }
          }
        } catch (error) {}
      }
    };

    loadLedgerData();
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
        const ledgerId = formState.row.ledgerId;
        const { billwiseMandatory } =
          applicationSettings.accountsSettings ?? {};
        const isRowEdit = formState.isRowEdit;
        
        if (!isNullOrUndefinedOrZero(ledgerId)) {
          if (
            billwiseMandatory &&
            ((!isRowEdit && !formState.row.billwiseDetails) ||
              (isRowEdit && !formState.formElements.amount.disabled))
          ) {
            const IsBillwiseTransAdjustmentExists = await api.getAsync(
              `${Urls.acc_transaction_is_bill_wise_trans_adjustment_exists}?LedgerId=${ledgerId}&DrCr=${formState.transaction.master.drCr}&AccTransactionDetailID=0`
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
            api.getAsync(`${Urls.get_ledger_balance}${ledgerId}`),
            api.getAsync(
              `${Urls.ledgerDataForTransaction}?LedgerId=${ledgerId}&DrCr=${formState.transaction.master.drCr}`
            ),
          ]);
          dispatch(
            updateFormElement({
              fields: {
                costCentreId: {
                  visible: ledgerData?.isCostCentreApplicable ?? false, // Update visibility based on ledgerData
                },
              },
            })
          );

          dispatch(
            accFormStateRowHandleFieldChange({
              fields: { ledgerCode: ledgerData?.ledgerCode },
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
              fields: { ledgerCode: undefined },
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
  }, [formState.row.ledgerId]);
  useEffect(() => {
    if (applicationSettings.mainSettings?.showNumberFormat == "Millions") {
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            amountInWords: getAmountInWords(formState.row.amount ?? 0),
          },
        })
      );
    } else {
    }
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
        `${Urls.get_ledger_balance}${formState.masterAccountID}`
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
      const isBtnBillWiseVisible =
        applicationSettings.accountsSettings?.maintainBillwiseAccount;
      const isProjectIdVisible =
        applicationSettings.accountsSettings?.maintainProjectSite ||
        userSession.dbIdValue == "543140180640";

      // Prepare the fields to update based on conditions
      const fieldsToUpdate = {
        btnSave: { disabled: true },
        btnEdit: { disabled: true },
        btnPrint: { disabled: true },
        foreignCurrency: { visible: isForeignCurrencyVisible },
        lblGroupName: { label: "" }, // Dynamically set the label as needed
        masterAccount: { disabled: true },
        btnBillWise: { visible: isBtnBillWiseVisible },
        discount: { visible: false },
        hasDiscount: { visible: false },
        projectId: { visible: isProjectIdVisible },
      };

      // Dispatch the update action

      if (formState.isInvoker != true) {
        dispatch(
          accFormStateTransactionMasterHandleFieldChange({
            fields: {
              transactionDate: new Date().toISOString(),
              referenceDate: new Date().toISOString(),
            },
          })
        );
        fetchVoucherNumber();
        if (voucherType == "CP" || voucherType == "CR") {
          console.log("masterAccount.disabled5");
          dispatch(
            accFormStateHandleFieldChange({
              fields: {
                masterAccountID:
                  userSession?.counterwiseCashLedgerId > 0 &&
                  applicationSettings.accountsSettings?.allowSalesCounter
                    ? userSession?.counterwiseCashLedgerId
                    : applicationSettings.accountsSettings?.defaultCashAcc,
              },
            })
          );
        }
      }
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            printOnSave:
              applicationSettings.accountsSettings?.printAccAftersave,
          },
        })
      );
      console.log(`userSession.employeeId${userSession.employeeId}`);

      if (userSession.employeeId > 0) {
        dispatch(
          accFormStateTransactionMasterHandleFieldChange({
            fields: {
              employeeId: userSession.employeeId,
            },
          })
        );
      }
      if (voucherType == "JV" || voucherType == "MJV") {
        if (voucherType == "JV") {
          dispatch(
            accFormStateHandleFieldChange({
              fields: {
                masterAccountID: -1,
              },
            })
          );
        }
      }

      if (userSession.dbIdValue === "543140180640") {
        if (voucherType === "CP" || voucherType === "CR") {
          let userCashLedgerID = 0;
          userCashLedgerID = await api.getAsync(
            `${Urls.get_userLedger_by_user_id}/${userSession.userId}`
          );
          console.log("masterAccount.disabled3");

          dispatch(
            accFormStateHandleFieldChange({
              fields: {
                masterAccountID:
                  userCashLedgerID > 0
                    ? userCashLedgerID
                    : applicationSettings.accountsSettings?.defaultCashAcc,
              },
            })
          );
        }
      }
    };
    initializeFormElements();
    if (voucherNo != undefined && voucherNo > 0) {
      loadAccTransVoucher();
      dispatch(setUserRight({ userSession: userSession, hasRight: hasRight }));
    }
  }, []);

  useEffect(() => {
    if (!voucherType) return;
    const updateFormElementsBasedOnVoucherType = () => {
      const fieldsToUpdate: Record<string, any> = {
        masterAccount: {},
        employee: {},
        discount: {},
        costCentreId: {},
        chequeNumber: {},
        bankDate: {},
        drCr: {},
        keepNarration: {},
      };

      switch (voucherType) {
        case "CR":
        case "CP":
          fieldsToUpdate.masterAccount = { label: "Cash Account" };
          fieldsToUpdate.employee = {
            label: voucherType === "CR" ? "Collected By" : "Paid By",
          };
          fieldsToUpdate.discount = { visible: true };
          fieldsToUpdate.costCentreId = {
            visible:
              applicationSettings.accountsSettings?.maintainCostCenter === true,
          };
          fieldsToUpdate.chequeNumber = { visible: false };
          fieldsToUpdate.bankDate = { visible: false };
          break;

        case "PV":
        case "SV":
          fieldsToUpdate.masterAccount = {
            label: voucherType === "PV" ? "Purchase Account" : "Sales Account",
          };
          fieldsToUpdate.employee = { label: "Done By" };
          fieldsToUpdate.discount = { visible: true };
          break;

        case "BR":
        case "CQR":
        case "BP":
        case "CQP":
          fieldsToUpdate.masterAccount = { label: "Bank Account" };
          fieldsToUpdate.employee = {
            label:
              voucherType === "BR" || voucherType === "CQR"
                ? "Collected By"
                : "Paid By",
          };
          fieldsToUpdate.discount = { visible: true };
          fieldsToUpdate.chequeNumber = { visible: true };
          fieldsToUpdate.bankDate = { visible: true };
          break;

        case "CN":
        case "DN":
          fieldsToUpdate.masterAccount = { label: "Party Account" };
          fieldsToUpdate.employee = {
            label: voucherType === "CN" ? "Collected By" : "Paid By",
          };
          break;

        case "JV":
        case "MJV":
          fieldsToUpdate.masterAccount = { label: "Master Account" };
          fieldsToUpdate.employee = { label: "Done By" };
          fieldsToUpdate.drCr = { visible: true };
          fieldsToUpdate.keepNarration = { visible: true };
          fieldsToUpdate.discount = { visible: false };
          break;

        case "OB":
          fieldsToUpdate.masterAccount = {
            label: "Master Account",
            visible: false,
          };
          fieldsToUpdate.employee = { label: "Employee" };
          fieldsToUpdate.drCr = { visible: true };
          break;
      }

      // Dispatch the update action with all the required fields
      dispatch(updateFormElement({ fields: fieldsToUpdate }));
    };
    updateFormElementsBasedOnVoucherType();
  }, [voucherType]);
  const fetchVoucherNumber = useCallback(async () => {
    const nextVoucherNumber = await getNextVoucherNumber(
      formType,
      voucherType,
      voucherPrefix
    );

    dispatch(
      accFormStateTransactionMasterHandleFieldChange({
        fields: {
          voucherNumber: nextVoucherNumber,
        },
      })
    );
  }, [formType, voucherType, voucherPrefix]);

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
      console.log(error, "acc-transaction template select error");
    } finally {
      setTemplateLoad(false);
    }
  }, []);

  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: "SI No",
      width: 60,
      cellRender: (cellElement: any) => <div>{cellElement.value}</div>,
    },
    {
      dataField: "ledgerId",
      caption: "Ledger ID",
      width: 100,
    },
    {
      dataField: "ledgerCode",
      caption: "Ledger Code",
      width: 100,
    },
    {
      dataField: "ledger",
      caption: "Ledger",
    },
    {
      dataField: "amount",
      dataType: "number",
      caption: "Amount",
      customizeText: (cellInfo: any) =>
        `${parseFloat(cellInfo.value).toFixed(2)}`,
      width: 200,
    },
    {
      dataField: "drCr",
      caption: "Dr/Cr",
      width: 100,
    },
    {
      dataField: "chequeNo",
      caption: "Cheque No",
      visible: false,
    },
    {
      dataField: "chequeDate",
      caption: "Cheque Date",
      visible: false,
    },
    {
      dataField: "narration",
      caption: "Narration",
      visible: false,
    },
    {
      dataField: "billwiseDetails",
      caption: "Billwise Details",
      visible: false,
    },
    {
      dataField: "accTransaction",
      caption: "Acc Transaction",
      visible: false,
    },
    {
      dataField: "discount",
      caption: "Discount",
      visible: false,
      customizeText: (cellInfo: any) =>
        `${parseFloat(cellInfo.value).toFixed(2)}`,
    },
    {
      dataField: "costCentreId",
      caption: "Cost Centre ID",
      visible: false,
    },
    {
      dataField: "checkStatus",
      caption: "Check Status",
      visible: false,
    },
    {
      dataField: "amountFC",
      caption: "Amount FC",
      customizeText: (cellInfo: any) =>
        `${parseFloat(cellInfo.value).toFixed(2)}`,
      visible: false,
    },
    {
      dataField: "nameOnCheque",
      caption: "Name on Cheque",
      visible: false,
    },
    {
      dataField: "bankName",
      caption: "Bank Name",
      visible: false,
    },
    {
      dataField: "debit",
      caption: "Debit",
      customizeText: (cellInfo: any) =>
        `${parseFloat(cellInfo.value).toFixed(2)}`,
      visible: false,
    },
    {
      dataField: "credit",
      caption: "Credit",
      customizeText: (cellInfo: any) =>
        `${parseFloat(cellInfo.value).toFixed(2)}`,
      visible: false,
    },
    {
      dataField: "projectId",
      caption: "Project ID",
      visible: false,
    },
    {
      dataField: "projects",
      caption: "Projects",
      visible: false,
    },
    {
      dataField: "action",
      caption: "",
      visible: false,
      cellRender: (cellElement: any, cellInfo: any) => (
        <button
          onClick={() => {
            
            handleRemoveItem(cellElement.rowIndex);
          }}
          disabled={
            formState.isRowEdit &&
            cellElement.data.accTransactionDetailId ==
              formState.row.accTransactionDetailId
          }
          className="ti-btn-link"
          type="button"
        >
          <i className="ri-delete-bin-5-line delete-icon" title="Remove"></i>
        </button>
      ),
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
  const [templateLoad, setTemplateLoad] = useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

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

  const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef && !popupRef.contains(event.target as Node)) {
        setShowPopup(false);
        setIsHovered(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const [showTotalsPopup, setShowTotalsPopup] = useState(false); // State for showing totals popup

  // const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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

  const handleChange = (selectedOption: { value: string; label: string }) => {
    console.log("Selected:", selectedOption);
  };

  const goToPreviousPage = () => {
    window.history.back();
  };
  return (
    <div className="relative">
      {/* <h1>{transactionType}</h1> */}
      {!deviceInfo?.isMobile && (
        <div className="bg-white space-y-6 p-4">
          <div className="flex justify-between items-center mb-0">
            <div className="flex items-center gap-2">
              {/* <AccTransactionUserConfig /> */}
              {/* {formState.formElements.foreignCurrency.visible && (
                <ERPCheckbox
                  id="foreignCurrency"
                  label={formState.formElements.foreignCurrency.label}
                  checked={formState.foreignCurrency}
                  onChange={(e) =>
                    dispatch(
                      accFormStateHandleFieldChange({
                        fields: { foreignCurrency: e.target.checked },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.foreignCurrency?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                />
              )} */}
            </div>
            {/* <h2 className="text-4xl font-bold text-center text-blue">
              {formState.title}
            </h2> */}
            <div className="w-[100px]"></div>
          </div>

          <div className="py-0">
            <div className="max-w-full mx-0">
              <div className="flex items-center p-0 border border-gray-300 rounded-md mb-2">
                <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
                  <h6 className="text-center text-lg font-bold mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
                    {formState.title}
                  </h6>
                  <i className="fas fa-cog ms-1"></i>
                </div>
                <div className="flex items-center justify-end space-x-4 p-1 w-full">
                  {/* Change Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("change")}
                  >
                    <button
                      className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        deleteAccTransVoucher();
                      }}
                    >
                      <Replace className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("delete")}
                  >
                    <button
                      className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        
                        loadTemporaryRows();
                      }}
                    >
                      <Trash2 className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Load Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("load")}
                  >
                    <button
                      className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        
                        handleEdit();
                      }}
                    >
                      <RefreshCw className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Edit Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("edit")}
                  >
                    <button
                      className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        
                        handleEdit();
                      }}
                    >
                      <Pencil className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Print Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("print")}
                  >
                    <button
                      className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        
                        printVoucher(formState.transaction);
                      }}
                    >
                      <Printer className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Clear Button */}
                  <div
                    className="group relative inline-flex flex-col items-center"
                    title={t("clear")}
                  >
                    <button
                      className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        
                        clearControls();
                      }}
                    >
                      <Delete className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Settings  Button */}
                  <div>
                    <AccTransactionUserConfig />
                  </div>

                  {/* Previous Page Button */}
                  <button
                    onClick={goToPreviousPage}
                    className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                    title={t("previous_page")}
                  >
                    <X className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 !mt-12">
            <div className="">
              <div className="grid grid-cols-1 leading-none lg:w-3/4">
                <div className="flex items-center gap-2">
                  {formState.formElements.voucherPrefix.visible && (
                    <ERPInput
                      id="master_voucherPrefix"
                      label={formState.formElements.voucherPrefix.label}
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
                        onKeyUp={(e) => {
                          
                          handleFieldKeyDown("voucherNumber", e);
                        }}
                        label={formState.formElements.voucherNumber.label}
                        value={formState.transaction.master.voucherNumber}
                        type="number"
                        Voucherno={true}
                        className="max-w-[200px]"
                        onChange={(e) =>
                          dispatch(
                            accFormStateTransactionMasterHandleFieldChange({
                              fields: { voucherNumber: e.target?.value },
                            })
                          )
                        }
                        disabled={
                          formState.formElements.voucherNumber?.disabled ||
                          formState.formElements.pnlMasters?.disabled
                        }
                      />
                    </>
                  )}
                </div>
                {formState.formElements.masterAccount.visible && (
                  <div>
                    <ERPDataCombobox
                      id="masterAccount"
                      label={formState.formElements.masterAccount.label}
                      value={formState.masterAccountID}
                      onChange={(e) =>
                        dispatch(
                          accFormStateHandleFieldChange({
                            fields: { masterAccountID: e.value },
                          })
                        )
                      }
                      field={{
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_acc_ledgers,
                      }}
                      disabled={
                        formState.formElements.masterAccount?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                      labelInfo={
                        <div className="">
                          <span className="text-xx text-primary">
                            <button className="pe-3">
                              <CustomerDetailsSidebar displayType="link" />
                            </button>
                            Bal:{" "}
                            {`${formState.masterBalance || "0.00"} ${
                              formState.masterBalance ?? 0 < 0 ? "Cr" : "Dr"
                            }`}
                          </span>
                        </div>
                      }
                    />
                    {/* <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        Bal:{" "}
                        {`${formState.masterBalance || "0.00"} ${
                          formState.masterBalance ?? 0 < 0 ? "Cr" : "Dr"
                        }`}
                      </span>
                    </div> */}
                    <div className="flex flex-wrap gap-4">
                      {formState.formElements.drCr.visible && (
                        <ERPDataCombobox
                          id="drCr"
                          className="w-[70px]"
                          label={formState.formElements.drCr.label}
                          value={formState.transaction.master.drCr}
                          data={formState.transaction.master}
                          onChange={(e) =>
                            dispatch(
                              accFormStateTransactionMasterHandleFieldChange({
                                fields: { drCr: e.target?.value },
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
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {formState.formElements.chequeNumber.visible && (
                    <ERPInput
                      id="chequeNumber"
                      label={formState.formElements.chequeNumber.label}
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
                      id="bankDate"
                      label={formState.formElements.bankDate.label}
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
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {formState.formElements.currencyID.visible && (
                    <ERPDataCombobox
                      id="currencyID"
                      data={formState.row}
                      label={formState.formElements.currencyID.label}
                      value={formState.transaction.master.currencyId}
                      field={{
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_currencies,
                      }}
                      onChange={(e) => {
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: {
                              currencyId: e.value,
                            },
                          })
                        );
                        dispatch(
                          accFormStateRowHandleFieldChange({
                            fields: {
                              currencyName: e.label,
                            },
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
                      id="exchangeRate"
                      min={0}
                      label={formState.formElements.exchangeRate.label}
                      type="number"
                      value={formState.row.exchangeRate}
                      onChange={(e) =>
                        dispatch(
                          accFormStateRowHandleFieldChange({
                            fields: { exchangeRate: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formState.formElements.exchangeRate?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                  {formState.formElements.linkEdit.visible == true && (
                    <button className="">
                      <span
                        className="hover:underline text-[#0ea5e9] capitalize ml-1"
                        onClick={() => {
                          
                          enableCombo();
                        }}
                      >
                        Edit
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
                    <ERPInput
                      id="referenceNumber"
                      label={formState.formElements.referenceNumber.label}
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
                    />
                  )}
                  {formState.formElements.transactionDate.visible && (
                    <ERPDateInput
                      id="transactionDate"
                      label={formState.formElements.transactionDate.label}
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
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formState.formElements.referenceDate.visible && (
                    <ERPDateInput
                      id="referenceDate"
                      label={formState.formElements.referenceDate.label}
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
                      id="employeeId"
                      label={formState.formElements.employee.label}
                      value={formState.masterAccountID}
                      className="lg:max-w-[300px]"
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { employeeId: e.target?.value },
                          })
                        )
                      }
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
                <div className="grid grid-cols-1 gap-2">
                  {formState.formElements.remarks.visible && (
                    <ERPInput
                      id="remarks"
                      label={formState.formElements.remarks.label}
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

                  {formState.formElements.commonNarration.visible && (
                    <ERPInput
                      id="notes"
                      label={formState.formElements.commonNarration.label}
                      className="max-w-full"
                      value={formState.transaction.master.commonNarration}
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { commonNarration: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formState.formElements.commonNarration?.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formState.formElements.projectId.visible && (
                    <ERPDataCombobox
                      id="project"
                      label={formState.formElements.projectId.label}
                      options={
                        formState.row.ledgerId != undefined &&
                        formState.row.ledgerId != 0
                          ? undefined
                          : []
                      }
                      field={{
                        valueKey: "id",

                        labelKey: "name",
                        getListUrl: Urls.data_projects_by_ledgerid,
                        params: `LedgerID=${formState.row.ledgerId}`,
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

          <div className="leading-none">
            <div className="flex items-center gap-2">
              {formState.formElements.ledgerCode.visible && (
                <ERPInput
                  id="ledgerCode"
                  className=""
                  label={formState.formElements.ledgerCode.label}
                  value={formState.row.ledgerCode}
                  ref={ledgerCodeRef}
                  onKeyDown={(e) => {
                    
                    handleFieldKeyDown("ledgerCode", e);
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
              {/* {formState?.row.ledgerId?.toString()} */}
              {formState.formElements.ledgerId.visible && (
                <>
                  <ERPDataCombobox
                    ref={ledgerIdRef}
                    id="ledgerId"
                    className="w-full"
                    label={formState.formElements.ledgerId.label}
                    data={formState.row}
                    onSelectItem={(e) => {
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { ledgerId: e.value, ledgerName: e.label },
                        })
                      );
                    }}
                    field={{
                      id: "ledgerId",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_acc_ledgers,
                    }}
                    disabled={
                      formState.formElements.ledgerId?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    labelInfo={
                      <div className="">
                        <span className="text-xs text-primary">
                          <button className="pe-3">
                            <CustomerDetailsSidebar displayType="link" />
                          </button>
                          Bal:{" "}
                          {`${formState.ledgerBalance || "0.00"} ${
                            formState.ledgerBalance ?? 0 < 0 ? "Cr" : "Dr"
                          }`}
                        </span>
                      </div>
                    }
                  />
                  {/* <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Bal:{" "}
                      {`${formState.ledgerBalance || "0.00"} ${
                        formState.ledgerBalance ?? 0 < 0 ? "Cr" : "Dr"
                      }`}
                    </span>
                  </div> */}
                </>
              )}

              {formState.formElements.amount.visible && (
                <ERPInput
                  ref={amountRef}
                  id="amount"
                  className=""
                  label={formState.formElements.amount.label}
                  type="number"
                  value={formState.row.amount}
                  onKeyDown={(e) => {
                    
                    handleFieldKeyDown("amount", e);
                  }}
                  onChange={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { amount: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.amount?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                />
              )}
              <div className="xl:w-[170px] lg:w-[250px]">
                {formState.formElements.hasDiscount.visible && (
                  <ERPCheckbox
                    id="hasDiscount"
                    className="pt-[10px] pr-[10px]"
                    label={formState.formElements.hasDiscount.label}
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
              </div>
              {formState.formElements.discount.visible && (
                <ERPInput
                  id="discount"
                  label={formState.formElements.discount.label}
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

            <div className="flex flex-wrap gap-4">
              <span className="text-blue-600 font-bold self-center">
                Group Name: {formState.row.groupName}
              </span>
            </div>
          </div>

          <div className="leading-none">
            <div className="flex items-center gap-2">
              {formState.formElements.narration.visible && (
                <ERPInput
                  ref={narrationRef}
                  id="narration"
                  className="w-full"
                  label={formState.formElements.narration.label}
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

              {formState.transaction?.master?.isLocked !== undefined &&
                formState.transaction?.master?.isLocked == true &&
                (userSession.userTypeCode == "CA" ||
                  userSession.userTypeCode == "BA") && <>unlock</>}
              <div className="flex items-center gap-2 mt-3">
                {formState.formElements.btnBillWise.visible == true && (
                  <ERPButton
                    title={formState.formElements.btnBillWise.label}
                    variant="secondary"
                    onClick={() => {
                      dispatch(
                        accFormStateHandleFieldChange({
                          fields: { showbillwise: true },
                        })
                      );
                    }}
                    disabled={
                      formState.ledgerBillWiseLoading ||
                      formState.formElements.btnBillWise.disabled == true
                    }
                  />
                )}
                {formState.formElements.btnAdd.visible == true && (
                  <ERPButton
                    title={formState.formElements.btnAdd.label}
                    variant="primary"
                    jumpTo="save"
                    loading={formState.rowProcessing}
                    type="button"
                    onClick={addOrEditRow}
                    disabled={
                      formState.formElements.btnAdd.disabled == true ||
                      formState.ledgerBillWiseLoading ||
                      formState.ledgerIsBillWiseAdjustExistLoading
                    }
                  />
                )}
              </div>
            </div>
          </div>
          {formState.formElements.drCr.visible && (
            <ERPDataCombobox
              id="drCr"
              className="min-w-[70px] max-w-[70px]"
              label={formState.formElements.drCr.label}
              value={formState.row.drCr}
              onChange={(e) =>
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

          <div className="flex flex-wrap gap-4">
            {(voucherType == "BP" || voucherType == "CQP") && (
              <>
                {formState.formElements.nameOnCheque.visible && (
                  <ERPInput
                    id="nameOnCheque"
                    className="min-w-[140px] max-w-[200px]"
                    label={formState.formElements.nameOnCheque.label}
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
                    id="bankName"
                    className="min-w-[180px] max-w-[200px]"
                    label={formState.formElements.bankName.label}
                    value={formState.row.bankName}
                    options={formState.row.ledgerId ? undefined : []}
                    field={bankAccountField}
                    onChange={handleBankNameChange}
                    disabled={
                      formState.formElements.bankName?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                  />
                )}
              </>
            )}
            {formState.formElements.costCentreId.visible && (
              <ERPDataCombobox
                id="costCentre"
                className="min-w-[180px]"
                label={formState.formElements.costCentreId.label}
                field={{
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_costcentres,
                }}
                disabled={
                  formState.userConfig.presetCostenterId > 0 ||
                  formState.formElements.costCentreId.disabled
                }
                onSelectItem={(e) =>
                  dispatch(
                    accFormStateRowHandleFieldChange({
                      fields: {
                        costCentreId: e.value,
                        costCentreName: e.label,
                      },
                    })
                  )
                }
              />
            )}
            <div
              className="text-red-600"
              style={{ fontSize: "12px", color: "chocolate" }}
            >
              Amount in Words: {formState.amountInWords}
            </div>
          </div>

          <ErpDevGrid
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
            data={formState.transaction.details}
            gridId={gridCode}
            onKeyDown={(e) => handleFieldKeyDown("grid", e)}
            onSelectionChanged={onSelectionChanged}
            // summary={[
            //   { column: "debit", summaryType: "sum" }, // Count the total number of rows
            //   { column: "amount", summaryType: "sum", valueFormat: "currency" }, // Sum of the "value" column, formatted as currency
            // ]}
          />
          {formState.showSaveDialog && (
            <ERPAlert
              showAnimation="animate__fadeIn"
              hideAnimation="animate__fadeOut"
              title="In Progress......"
              icon="warning"
              position="center"
              confirmButtonText="Ok"
              cancelButtonText="Cancel"
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
              Cash payment
            </h1>
            <i className="ri-settings-3-line" style={{ fontSize: "23px" }}></i>
          </div>
          {/* Scrollable Content */}
          <div className="flex flex-col mt-[58px] w-full overflow-scroll"></div>
          <div className="flex items-center space-x-4 bg-white mb-0 p-0 rounded-none shadow-md text-gray-600">
            <div className="flex-1  px-2  rounded-md">
              <label className="block mb-0 font-medium text-center text-sm text-gray-700">
                Voucher No
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
                Date
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
                  label="Cash Account"
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
                  id="autoUpdateReleaseUpTo"
                  label="Remark"
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
                  {showInputBox ? "View Less" : "View More"}
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
                      id="autoUpdateReleaseUpTo"
                      label="Ref No"
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
                      Ref Date
                    </label>
                    <input
                      type="date"
                      placeholder="Ref Date"
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
                      label="Paid By"
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
                      id="autoUpdateReleaseUpTo"
                      label="Notes"
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
                <h2 className="font-light text-sm">Billed Items</h2>
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
                      Discount (%): {item.discount}
                    </p>
                    {/* <p className="text-gray-600 text-sm">Tax: {item.tax}%</p> */}
                  </div>
                ))}

                {/* Total Summary */}
                <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                  <div className="flex justify-between mb-2 text-gray-600 text-sm">
                    <span>
                      Total Disc:{" "}
                      {items
                        .reduce((total, item) => total + item.discount, 0)
                        .toFixed(1)}
                    </span>
                    <span>
                      Total Tax Amt:{" "}
                      {items
                        .reduce((total, item) => total + item.tax, 0)
                        .toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm">
                    <span>
                      Total Qty: {calculateTotalQuantity().toFixed(1)}
                    </span>
                    <span>Subtotal: ₹ {calculateSubtotal().toFixed(2)}</span>
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
                    Add Items{" "}
                  </div>
                  <div className="pl-1 text-gray-500">(Optional)</div>
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
                title="Save & New"
                onClick={() => {}}
                variant="secondary"
                className="flex-1 !m-0 !rounded-none"
              />
              <ERPButton
                title="Save"
                onClick={() => {}}
                variant="primary"
                className="flex-1 !m-0 !rounded-none"
              />
            </div>
          </div>
        </div>
      )}
      <ERPModal
        isFullHeight={true}
        isOpen={formState.showbillwise ?? false}
        title="Billwise"
        closeModal={() => {
          dispatch(
            accFormStateHandleFieldChange({ fields: { showbillwise: false } })
          );
        }}
        width="!w-[80rem] !max-w-[60rem]"
        content={<BillWisePopup />}
      />
      <div>
        {/* The ERPModal component */}
        <ERPModal
          isForm={true}
          isOpen={isOpen}
          closeButton="LeftArrow"
          hasSubmit={false}
          closeTitle="Close"
          title="Add Ledger"
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
                        id="autoUpdateReleaseUpTo"
                        label="Ledger Code"
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
                        label="Ledger"
                      />
                    </div>
                    <div className="mb-4">
                      <ERPInput
                        id="autoUpdateReleaseUpTo"
                        label="Amount"
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
                        id="autoUpdateReleaseUpTo"
                        label="Narration"
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
                        label="Cost Center"
                      />
                    </div>
                  </div>
                </form>
                <div className="max-w-none mx-auto mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className=" pt-1">
                    {/* Discount Section */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Discount</span>
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
                          Total Amount:
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
                  title="Save & New"
                  onClick={() => {}}
                  variant="secondary"
                  className="flex-1 !m-0 !rounded-none"
                />
                <ERPButton
                  title="Save"
                  onClick={() => {}}
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
      <div className="flex items-center justify-between z-10 fixed bottom-0 bg-white shadow-lg w-[-webkit-fill-available] p-2">
        <div className=" flex items-center gap-4">
          {formState.formElements.printOnSave.visible && (
            <ERPCheckbox
              id="printOnSave"
              label={formState.formElements.printOnSave.label}
              checked={formState.printOnSave}
              onChange={(e) =>
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: { printOnSave: e.target.checked },
                  })
                )
              }
              disabled={
                formState.formElements.printOnSave?.disabled ||
                formState.formElements.pnlMasters?.disabled
              }
            />
          )}
          {formState.formElements.printPreview.visible && (
            <ERPCheckbox
              id="printPreview"
              label={formState.formElements.printPreview.label}
              checked={formState.printPreview}
              onChange={(e) =>
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: { printPreview: e.target.checked },
                  })
                )
              }
              disabled={
                formState.formElements.printPreview?.disabled ||
                formState.formElements.pnlMasters?.disabled
              }
            />
          )}
          {(voucherType == "BP" || voucherType == "CQP") &&
            formState.formElements.printCheque.visible && (
              <ERPCheckbox
                id="printCheque"
                label={formState.formElements.printCheque.label}
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
              />
            )}
          {formState.formElements.keepNarration.visible && (
            <ERPCheckbox
              id="keepNarration"
              label={formState.formElements.keepNarration.label}
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
          {(voucherType == "BP" || voucherType == "CQP") && (
            <ERPButton
              title="Print Cheque"
              variant="secondary"
              onClick={() => {
                /* Handle print cheque */
              }}
            />
          )}
          <button className="text-blue-600">
            Template: 'Elite Template'
            <span
              className="hover:underline text-[#0ea5e9] capitalize ml-1"
              onClick={selectTemplates}
            >
              Change
            </span>
          </button>
          <button className="text-blue-600">
            <AttachmentSidebar displayType="link" />
          </button>
        </div>
        Total:{" "}
        {getFormattedValue(formState.transaction.master?.totalAmount ?? 0)}
        <div>
          <ERPButton
            ref={btnSaveRef}
            title="save"
            jumpTarget="save"
            variant="primary"
            onClick={save}
          />
        </div>
      </div>

      {formState.transaction && formState.template && (
        <ERPModal
          isOpen={formState.printPreview}
          title={t("barcode_print")}
          isForm={true}
          closeModal={() => {
            dispatch(
              accFormStateHandleFieldChange({ fields: { printPreview: false } })
            );
          }}
          content={
            <DownloadPreview
              template={formState?.template}
              data={DummyVoucherData}
            />
          }
        ></ERPModal>
      )}

      <ERPResizableSidebar
        minWidth={350}
        isOpen={isTemplateOpen}
        setIsOpen={setIsTemplateOpen}
        children={<TemplatesView setIsOpen={setIsTemplateOpen} />}
      ></ERPResizableSidebar>
    </div>
  );
};

export default AccTransactionForm;
