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
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { accFormStateHandleFieldChange, accFormStateRowHandleFieldChange, accFormStateTransactionDetailsRowAdd, accFormStateTransactionMasterHandleFieldChange } from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../helpers/api-client";
import { ApplicationMainSettings, ApplicationMainSettingsInitialState } from "../../settings/system/application-settings-types/application-settings-types-main";
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
import { DummyInvoiceData, DummyVoucherData } from "../../InvoiceDesigner/constants/DummyData";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import ERPResizableSidebar from "../../../components/ERPComponents/erp-resizable-sidebar";
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
  const [gridCode, setGridCode] = useState<string>(`grd_acc_transaction_${voucherType}`);
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const ledgerCodeRef = useRef<HTMLInputElement>(null);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const [loadTemplate, setLoadTemplate] = useState<TemplateState>();
  const {
    undoEditMode,
    getNextVoucherNumber,
    loadAccTransVoucher,
    formElements,
    setFormElements,
    setUserRight,
    enableControls,
    disableControls,
    validate,
    addOrEditRow
  } = useAccTransaction(transactionType ?? "", btnSaveRef, ledgerCodeRef);
  const { validateTransactionDate } = useTransaction(transactionType ?? "");
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const [gridHeight, setGridHeight] = useState(200);

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
    const loadLedgerData = async () => {
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            ledgerBillWiseLoading: true,
          },
        })
      );

      try {
        if (formState.showbillwise && formState.row.ledgerId) {
          const billwise = await api.getAsync(
            `${Urls.acc_transaction_ledger_bill_wise}?LedgerId=${formState.row.ledgerId
            }&DrCr=${formState.transaction.master.drCr
            }&AccTransactionDetailID=${formState.row.accTransactionDetailId ?? 0
            }`
          );
          dispatch(
            accFormStateHandleFieldChange({
              fields: { billwiseData: billwise, ledgerBillWiseLoading: false },
            })
          );
        }
      } catch (error) { }
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
          },
        })
      );

      try {
        if (formState.row.ledgerId) {
          if (applicationSettings.accountsSettings?.billwiseMandatory) {
            if (!isNullOrUndefinedOrZero(formState.row.ledgerId)) {
              if (
                (!formState.isRowEdit && formState.row.BillwiseDetails == "") ||
                (formState.isRowEdit && formElements.amount.disabled == false)
              ) {
                const IsBillwiseTransAdjustmentExists = await api.getAsync(
                  `${Urls.acc_transaction_is_bill_wise_trans_adjustment_exists
                  }?LedgerId=${formState.row.ledgerId}&DrCr=${formState.transaction.master.drCr
                  }&AccTransactionDetailID=${0}`
                );
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: {
                      IsBillwiseTransAdjustmentExists:
                        IsBillwiseTransAdjustmentExists,
                      ledgerIsBillWiseAdjustExistLoading: false,
                    },
                  })
                );
              }
            }
          }
          if (!isNullOrUndefinedOrZero(formState.row.ledgerId)) {
            const ledgerData = await api.getAsync(
              `${Urls.ledgerDataForTransaction}?LedgerId=${formState.row.ledgerId}&DrCr=${formState.transaction.master.drCr}`
            );
            dispatch(
              accFormStateHandleFieldChange({
                fields: {
                  ledgerData: ledgerData,
                  ledgerBillWiseLoading: false,
                },
              })
            );
          }
        }
      } catch (error) { }
    };

    loadLedgerData();
  }, [formState.row.ledgerId]);

  useEffect(() => {
    const initializeFormElements = async () => {
      const newFormElements = { ...formElements };
      newFormElements.btnSave.disabled = true;
      newFormElements.btnEdit.disabled = true;
      newFormElements.btnPrint.disabled = true;
      newFormElements.foreignCurrency.visible =
        applicationSettings.accountsSettings?.maintainMultiCurrencyTransactions;
      newFormElements.lblGroupName.label = "";
      if (!formState.isInvoker && (voucherNo == undefined || voucherNo <= 0)) {
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
          dispatch(
            accFormStateHandleFieldChange({
              fields: {
                masterAccountID:
                  userSession.counterwiseCashLedgerId > 0 &&
                    applicationSettings.accountsSettings.allowSalesCounter
                    ? userSession.counterwiseCashLedgerId
                    : applicationSettings.accountsSettings.defaultCashAcc,
              },
            })
          );
          if (
            userSession.counterwiseCashLedgerId > 0 &&
            applicationSettings.accountsSettings.allowSalesCounter &&
            userSession.counterAssignedCashLedgerId > 0
          ) {
            formElements.masterAccount.disabled = true;
          }
        }
      }
      dispatch(
        accFormStateHandleFieldChange({
          fields: {
            printOnSave: applicationSettings.accountsSettings.printAccAftersave,
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
      formElements.btnBillWise.visible =
        applicationSettings.accountsSettings.maintainBillwiseAccount;
      if (voucherType == "JV") {
        dispatch(
          accFormStateHandleFieldChange({
            fields: {
              masterAccountID: -1,
            },
          })
        );
      }
      if (applicationSettings.accountsSettings.maintainProjectSite) {
        newFormElements.projectId.visible = true;
      }
      if (userSession.dbIdValue == "543140180640") {
        newFormElements.projectId.visible = true;
        if (voucherType == "CP" || voucherType == "CR") {
          let userCashLedgerID = 0;

          userCashLedgerID = await api.getAsync(
            `${Urls.get_userLedger_by_user_id}/${userSession.userId}`
          );
          dispatch(
            accFormStateHandleFieldChange({
              fields: {
                masterAccountID:
                  userCashLedgerID > 0
                    ? userCashLedgerID
                    : applicationSettings.accountsSettings.defaultCashAcc,
              },
            })
          );
        }
      }

      setFormElements(newFormElements);
    };
    initializeFormElements();
    // loadAccTransVoucher();
    if (voucherNo != undefined && voucherNo > 0) {
      setUserRight();
    }
  }, []);

  useEffect(() => {
    if (!voucherType) return;
    const updateFormElementsBasedOnVoucherType = () => {
      const newFormElements = { ...formElements };
      switch (voucherType) {
        case "CR":
        case "CP":
          newFormElements.masterAccount.label = "Cash Account";
          newFormElements.employee.label =
            voucherType === "CR" ? "Collected By" : "Paid By";
          newFormElements.discount.visible = true;
          newFormElements.costCentreId.visible = applicationSettings.accountsSettings.maintainCostCenter == true;
          newFormElements.chequeNumber.visible = false;
          newFormElements.bankDate.visible = false;
          break;

        case "PV":
        case "SV":
          newFormElements.masterAccount.label =
            voucherType === "PV" ? "Purchase Account" : "Sales Account";
          newFormElements.employee.label = "Done By";
          newFormElements.discount.visible = true;
          break;

        case "BR":
        case "CQR":
        case "BP":
        case "CQP":
          newFormElements.masterAccount.label = "Bank Account";
          newFormElements.employee.label =
            voucherType === "BR" || voucherType === "CQR"
              ? "Collected By"
              : "Paid By";
          newFormElements.discount.visible = true;
          newFormElements.chequeNumber.visible = true;
          newFormElements.bankDate.visible = true;
          break;

        case "CN":
        case "DN":
          newFormElements.masterAccount.label = "Party Account";
          newFormElements.employee.label =
            voucherType === "CN" ? "Collected By" : "Paid By";
          break;

        case "JV":
          newFormElements.masterAccount.label = "Master Account";
          newFormElements.employee.label = "Done By";
          newFormElements.drCr.visible = true;
          newFormElements.keepNarration.visible = true;
          newFormElements.discount.visible = false;
          break;

        case "MJV":
          newFormElements.masterAccount.label = "Master Account";
          newFormElements.employee.label = "Done By";
          newFormElements.drCr.visible = true;
          newFormElements.keepNarration.visible = true;
          newFormElements.discount.visible = false;
          break;

        case "OB":
          newFormElements.masterAccount.label = "Master Account";
          newFormElements.employee.label = "Employee";
          newFormElements.masterAccount.visible = false;
          newFormElements.drCr.visible = true;
          break;
      }

      setFormElements(newFormElements);
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


const selectTemplates = useCallback(async() => {
setTemplateLoad(true)
setIsTemplateOpen(true)
  try {
    const response = await api.getAsync(`${Urls.templates}?template_group=${voucherType       }`);
    dispatch(accFormStateHandleFieldChange({fields:{templates:response}}));
    }
    catch (error) {
      console.log(error, "acc-transaction template select error");
    }
    finally {
      setTemplateLoad(false)
    }
  }, [])

  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
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

  return (
    <div className="relative">
      {/* <h1>{transactionType}</h1> */}
      {!deviceInfo?.isMobile && (
        <div className="bg-white space-y-6 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {/* <AccTransactionUserConfig /> */}
              {formElements.foreignCurrency.visible && (
                <ERPCheckbox
                  id="foreignCurrency"
                  label={formElements.foreignCurrency.label}
                  checked={formState.foreignCurrency}
                  onChange={(e) =>
                    dispatch(
                      accFormStateHandleFieldChange({
                        fields: { foreignCurrency: e.target.checked },
                      })
                    )
                  }
                  disabled={
                    formElements.foreignCurrency?.disabled ||
                    formElements.pnlMasters?.disabled
                  }
                />
              )}
            </div>
            <h2 className="text-4xl font-bold text-center text-blue">
              {formState.title}
            </h2>
            <div className="w-[100px]"></div>
          </div>

          <div className="grid grid-cols-2 gap-8 !mt-12">
            <div className="">
              <div className="grid grid-cols-1 leading-none lg:w-3/4">
                <div className="flex items-center gap-2">
                  {formElements.voucherPrefix.visible && (
                    <ERPInput
                      id="master_voucherPrefix"
                      label={formElements.voucherPrefix.label}
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
                        formElements.voucherPrefix?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formElements.voucherNumber.visible && (
                    <ERPInput
                      id="voucherNumber"
                      label={formElements.voucherNumber.label}
                      value={formState.transaction.master.voucherNumber}
                      className="max-w-[200px]"
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { voucherNumber: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formElements.voucherNumber?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>

                {formElements.masterAccount.visible && (
                  <div>
                    <ERPDataCombobox
                      id="masterAccount"
                      label={formElements.masterAccount.label}
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
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                      }}
                      disabled={
                        formElements.masterAccount?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        Bal: {formState.masterBalance || "0.00"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {formElements.drCr.visible && (
                        <ERPDataCombobox
                          id="drCr"
                          className="w-[70px]"
                          label={formElements.drCr.label}
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
                            formElements.drCr?.disabled ||
                            formElements.pnlMasters?.disabled
                          }
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {formElements.chequeNumber.visible && (
                    <ERPInput
                      id="chequeNumber"
                      label={formElements.chequeNumber.label}
                      value={formState.row.chequeNumber}
                      onChange={(e) =>
                        dispatch(
                          accFormStateRowHandleFieldChange({
                            fields: { chequeNumber: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formElements.chequeNumber?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formElements.bankDate.visible && (
                    <ERPDateInput
                      id="bankDate"
                      label={formElements.bankDate.label}
                      value={new Date(formState.row.bankDate)}
                      onChange={(e) =>
                        dispatch(
                          accFormStateRowHandleFieldChange({
                            fields: { bankDate: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formElements.bankDate?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {formElements.currencyID.visible && (
                    <ERPDataCombobox
                      id="currencyID"
                      data={formState.row}
                      label={formElements.currencyID.label}
                      value={formState.transaction.master.currencyId}
                      field={{
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_currencies,
                      }}
                      onChange={(e) => {
                        debugger;
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
                        formElements.currencyID?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formElements.exchangeRate.visible && (
                    <ERPInput
                      id="exchangeRate"
                      min={0}
                      label={formElements.exchangeRate.label}
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
                        formElements.exchangeRate?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="grid grid-cols-1 leading-none lg:full">
                <div className="grid grid-cols-2 gap-2">
                  {formElements.referenceNumber.visible && (
                    <ERPInput
                      id="referenceNumber"
                      label={formElements.referenceNumber.label}
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
                        formElements.referenceNumber?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                  {formElements.transactionDate.visible && (
                    <ERPDateInput
                      id="transactionDate"
                      label={formElements.transactionDate.label}
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
                        formElements.transactionDate?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formElements.referenceDate.visible && (
                    <ERPDateInput
                      id="referenceDate"
                      label={formElements.referenceDate.label}
                       className="lg:max-w-[300px]"
                      value={new Date(formState.transaction.master.referenceDate)}
                      onChange={(e) =>
                        dispatch(
                          accFormStateTransactionMasterHandleFieldChange({
                            fields: { referenceDate: e.target?.value },
                          })
                        )
                      }
                      disabled={
                        formElements.referenceDate?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                  {formElements.employee.visible && (
                    <ERPDataCombobox
                      id="employeeId"
                      label={formElements.employee.label}
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
                        required: true,
                        getListUrl: Urls.data_employees,
                      }}
                      disabled={
                        formElements.employee?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {formElements.remarks.visible && (
                    <ERPInput
                      id="remarks"
                      label={formElements.remarks.label}
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
                        formElements.remarks?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formElements.commonNarration.visible && (
                    <ERPInput
                      id="notes"
                      label={formElements.commonNarration.label}
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
                        formElements.commonNarration?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}

                  {formElements.projectId.visible && (
                    <ERPDataCombobox
                      id="project"
                      label={formElements.projectId.label}
                      field={{
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_projects_by_ledgerid,
                        params: `LedgerID=${formState.row.ledgerId}`,
                      }}
                      onChange={(e) =>
                        dispatch(
                          accFormStateRowHandleFieldChange({
                            fields: { projectId: e.value },
                          })
                        )
                      }
                      disabled={
                        formElements.projectId?.disabled ||
                        formElements.pnlMasters?.disabled
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="leading-none">
            <div className="flex items-center gap-2">
              {formElements.ledgerCode.visible && (
                <ERPInput
                  id="ledgerCode"
                  className=""
                  label={formElements.ledgerCode.label}
                  value={formState.row.ledgerCode}
                  ref={ledgerCodeRef}
                  onChange={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { ledgerCode: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formElements.ledgerCode?.disabled ||
                    formElements.pnlMasters?.disabled
                  }
                />
              )}
              {/* {formState?.row.ledgerId?.toString()} */}
              {formElements.ledgerId.visible && (
                <ERPDataCombobox
                  id="ledgerId"
                  className="w-full"
                  label={formElements.ledgerId.label}
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
                    required: true,
                    getListUrl: Urls.data_acc_ledgers,
                  }}
                  disabled={
                    formElements.ledgerId?.disabled ||
                    formElements.pnlMasters?.disabled
                  }
                />
              )}

              {formElements.amount.visible && (
                <ERPInput
                  id="amount"
                  className=""
                  label={formElements.amount.label}
                  type="number"
                  value={formState.row.amount}
                  onChange={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { amount: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formElements.amount?.disabled ||
                    formElements.pnlMasters?.disabled
                  }
                />
              )}
              <div className="xl:w-[170px] lg:w-[250px]">
                {formElements.hasDiscount.visible && (
                  <ERPCheckbox
                    id="hasDiscount"
                    className="pt-[10px] pr-[10px]"
                    label={formElements.hasDiscount.label}
                    checked={formState.row.hasDiscount}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { hasDiscount: e.target.checked },
                        })
                      )
                    }
                    disabled={
                      formElements.hasDiscount?.disabled ||
                      formElements.pnlMasters?.disabled
                    }
                  />
                )}
              </div>
              {formElements.discount.visible && (
                <ERPInput
                  id="discount"
                  label={formElements.discount.label}
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
                    formElements.discount?.disabled ||
                    formElements.pnlMasters?.disabled
                  }
                />
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <span className="text-blue-600 font-bold self-center">
                Group Name:
              </span>
            </div>
          </div>

          <div className="leading-none">
            <div className="flex items-center gap-2">
              {formElements.narration.visible && (
                <ERPInput
                  id="narration"
                  className="w-full"
                  label={formElements.narration.label}
                  value={formState.row.narration}
                  onChange={(e) =>
                    dispatch(
                      accFormStateRowHandleFieldChange({
                        fields: { narration: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formElements.narration?.disabled ||
                    formElements.pnlMasters?.disabled
                  }
                />
              )}

              {(formState.transaction?.master?.isLocked == undefined ||
                formState.transaction?.master?.isLocked == true) &&
                (userSession.userTypeCode == "CA" ||
                  userSession.userTypeCode == "BA")}
              <div className="flex items-center gap-2 mt-3">
                <ERPButton
                  title="Billwise"
                  variant="secondary"
                  onClick={() => {
                    dispatch(
                      accFormStateHandleFieldChange({
                        fields: { showbillwise: true },
                      })
                    );
                  }}
                  disabled={formState.ledgerBillWiseLoading}
                />
                <ERPButton
                  title="Add"
                  variant="primary"
                  jumpTo="save"
                  loading={formState.rowProcessing}
                  type="button"
                  onClick={addOrEditRow}
                  disabled={
                    formState.ledgerBillWiseLoading ||
                    formState.ledgerIsBillWiseAdjustExistLoading
                  }
                />
              </div>
            </div>
            <div className="text-red-600 font-bold text-sm">
              Amount in Words: {formState.amountInWords}
            </div>
          </div>

          {formElements.drCr.visible && (
            <ERPDataCombobox
              id="drCr"
              className="min-w-[70px] max-w-[70px]"
              label={formElements.drCr.label}
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
                formElements.drCr?.disabled || formElements.pnlMasters?.disabled
              }
            />
          )}

          <div className="flex flex-wrap gap-4">
            {(voucherType == "BP" || voucherType == "CQP") && (
              <>
                {formElements.nameOnCheque.visible && (
                  <ERPInput
                    id="nameOnCheque"
                    className="min-w-[140px] max-w-[200px]"
                    label={formElements.nameOnCheque.label}
                    value={formState.row.nameOnCheque}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { nameOnCheque: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formElements.nameOnCheque?.disabled ||
                      formElements.pnlMasters?.disabled
                    }
                  />
                )}
                {formElements.bankName.visible && (
                  <ERPDataCombobox
                    id="bankName"
                    className="min-w-[180px] max-w-[200px]"
                    label={formElements.bankName.label}
                    value={formState.row.bankName}
                    field={{
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_BankAccounts,
                      params: {
                        ledgerID:
                          formState.row.ledgerId != undefined &&
                            formState.row.ledgerId != null
                            ? formState.row.ledgerId
                            : 0,
                      },
                    }}
                    onChange={(e) =>
                      dispatch(
                        accFormStateRowHandleFieldChange({
                          fields: { bankName: e.value },
                        })
                      )
                    }
                    disabled={
                      formElements.bankName?.disabled ||
                      formElements.pnlMasters?.disabled
                    }
                  />
                )}
              </>
            )}
            {formElements.costCentreId.visible && (
              <ERPDataCombobox
                id="costCentre"
                className="min-w-[180px]"
                label={formElements.costCentreId.label}
                field={{
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_costcentres,
                }}
                disabled={
                  formState.userConfig.presetCostenterId > 0 ||
                  formElements.costCentreId.disabled
                }
                onChange={(e) =>
                  dispatch(
                    accFormStateRowHandleFieldChange({
                      fields: { costCentreId: e.value },
                    })
                  )
                }
              />
            )}
          </div>

          <ErpDevGrid
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
                onClick={() => { }}
                variant="secondary"
                className="flex-1 !m-0 !rounded-none"
              />
              <ERPButton
                title="Save"
                onClick={() => { }}
                variant="primary"
                className="flex-1 !m-0 !rounded-none"
              />
            </div>
          </div>
        </div>
      )}
      <ERPModal
        isForm={true}
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

              <div>

              </div>
              <div className="flex bg-white mt-auto fixed bottom-0 w-full z-10  space-x-2 p-0 m-0 pl-1">
                <ERPButton
                  title="Save & New"
                  onClick={() => { }}
                  variant="secondary"
                  className="flex-1 !m-0 !rounded-none"
                />
                <ERPButton
                  title="Save"
                  onClick={() => { }}
                  variant="primary"
                  className="flex-1 !m-0 !rounded-none"
                />
              </div>
            </div>
          }
        />
      </div>
      <CustomerDetailsSidebar></CustomerDetailsSidebar>
      <AttachmentSidebar></AttachmentSidebar>
      <ActivityLogSidebar></ActivityLogSidebar>
      <div className="fixed top-[3.4rem] right-[465px]">
      <AccTransactionUserConfig />
      </div>
      <div className="flex items-center justify-between z-10 fixed bottom-0 bg-white shadow-lg w-[-webkit-fill-available] p-2">
        <div className=" flex items-center gap-4">
          {formElements.printOnSave.visible && (
            <ERPCheckbox
              id="printOnSave"
              label={formElements.printOnSave.label}
              checked={formState.printOnSave}
              onChange={(e) =>
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: { printOnSave: e.target.checked },
                  })
                )
              }
              disabled={
                formElements.printOnSave?.disabled ||
                formElements.pnlMasters?.disabled
              }
            />
          )}
          {formElements.printPreview.visible && (
            <ERPCheckbox
              id="printPreview"
              label={formElements.printPreview.label}
              checked={formState.printPreview}
              onChange={(e) =>
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: { printPreview: e.target.checked },
                  })
                )
              }
              disabled={
                formElements.printPreview?.disabled ||
                formElements.pnlMasters?.disabled
              }
            />
          )}
          {(voucherType == "BP" || voucherType == "CQP") &&
            formElements.printCheque.visible && (
              <ERPCheckbox
                id="printCheque"
                label={formElements.printCheque.label}
                checked={formState.printCheque}
                onChange={(e) =>
                  dispatch(
                    accFormStateHandleFieldChange({
                      fields: { printCheque: e.target.checked },
                    })
                  )
                }
                disabled={
                  formElements.printCheque?.disabled ||
                  formElements.pnlMasters?.disabled
                }
              />
            )}
          {formElements.keepNarration.visible && (
            <ERPCheckbox
              id="keepNarration"
              label={formElements.keepNarration.label}
              checked={formState.keepNarration}
              onChange={(e) =>
                dispatch(
                  accFormStateHandleFieldChange({
                    fields: { keepNarration: e.target.checked },
                  })
                )
              }
              disabled={
                formElements.keepNarration?.disabled ||
                formElements.pnlMasters?.disabled
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

        </div>
        Total: {formState.transaction.master.totalAmount}
        <div>
          <ERPButton
            ref={btnSaveRef}
            title="save"
            jumpTarget="save"
            variant="primary"
            onClick={addOrEditRow}
          />
        </div>
      </div>

      {/* {formState.transaction && formState.template &&
        <ERPModal
          isOpen={formState.printPreview
          }
          title={t("barcode_print")}
          isForm={true}
          closeModal={() => {
            dispatch(accFormStateHandleFieldChange({fields:{printPreview:false}}));
          }}
          content={<DownloadPreview template={formState?.template} data={DummyVoucherData}/>}>
        </ERPModal>
      } */}

      <ERPResizableSidebar
        isOpen={formState.printPreview && isTemplateOpen}
        setIsOpen={setIsTemplateOpen}
        children={"prev doc"}>
      </ERPResizableSidebar>
    </div>
  );
};

export default AccTransactionForm;
