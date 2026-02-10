import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowBigDownDash, BadgePlus, ChevronDown, Ellipsis, Search, X } from "lucide-react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import PartyLedger from "./components/cb-ledger";
import AccVoucherPrefix from "./components/voucher-prefix";
import AccVoucherNo from "./components/voucher-no";
import ReferenceNumber from "./components/reference-number";
import ReferenceDate from "./components/reference-Date";
import TransactionDate from "./components/transaction-Date";
import LedgerCode from "./components/ledger-code";
import VatTokenInput from "./components/cb-vat-tocken";
import Employee from "./components/cb-employee";
import DebitAccount from "./components/cb-debit-account";
import Project from "./components/cb-project";
import InvoiceValue from "./components/invoice-value";
import VoucherLoader from "./components/grn-Number";
import Urls from "../../../../redux/urls";
import { formStateHandleFieldChange, formStateHandleFieldChangeKeysOnly, formStateMasterHandleFieldChange, } from '../reducer';
import MoreOptionsModalContent from "./transaction-more";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import WarehouseID from "./components/warehouse-id ";
import { TransactionDetail, TransactionFormState } from "../transaction-types";
import AdjustmentAmountInput from "./components/AdjustmentAmountInput";
import CostCentreCombobox from "./components/CostCentreCombobox";
import PriceCategoryCombobox from "./components/PriceCategoryCombobox";
import SupplyTypeCombobox from "./components/SupplyTypeCombobox";
import LedgerDetails from "./ledger-details";
import { isEnterKey, loadTemplateById } from "../../../../utilities/Utils";
import VoucherType from "../../../../enums/voucher-types";
import axios from "axios";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import ManualInvNo from "./components/mannual-invoice-number";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import DraftMode from "./draft-mode";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import WareHouseStock from "./components/warehouse-stock";
import PartiesManage from "../../../accounts/masters/parties/parties-manage";
import { APIClient } from "../../../../helpers/api-client";
import { DeepPartial } from "redux";
import { UserAction, useUserRights } from "../../../../helpers/user-right-helper";
import moment from "moment";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";

const api = new APIClient();
interface TransactionHeaderProps {
  formState: TransactionFormState;
  dispatch: any;
  handleKeyDown: any;
  focusToNextColumn: (
    rowIndex: number,
    column: string,
    excludedColumns?: (keyof TransactionDetail)[]
  ) => { column: string; rowIndex: number } | null;
  loadAndSetTransVoucher: any;
  initializeFormElements: any;
  t: any;
  handleLoadByRefNo: any;
  handleFieldChange: any;
  setIsPartyDetailsOpen: any;
  transactionType: string;
  handleFieldKeyDown: any;
  ledgerCodeRef: any;
  ledgerIdRef: any;
  voucherNumberRef: any;
  refNoRef: any;
  isAppGlobal: boolean;
  mobileNumRef: any;
  transactionDateRef: any;
  employeeRef?: any;
  isDropDownOpen: {
    open: boolean;
    autoAddressFocus: boolean;
  };
  toggleDropdown: () => void;
  onHeightChange?: (height: number) => void;
  footerLayout: "horizontal" | "vertical";
  userSession: any;
  inputRefs: Record<string, React.RefObject<HTMLInputElement>>
  partyNameRef: any;
  getNextVoucherNumber: any;
}
// clientSession
const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  formState,
  dispatch,
  handleKeyDown,
  loadAndSetTransVoucher,
  initializeFormElements,
  t,
  handleLoadByRefNo,
  handleFieldChange,
  setIsPartyDetailsOpen,
  transactionType,
  handleFieldKeyDown,
  ledgerCodeRef,
  ledgerIdRef,
  voucherNumberRef,
  refNoRef,
  mobileNumRef,
  transactionDateRef,
  employeeRef,
  isDropDownOpen,
  toggleDropdown,
  onHeightChange,
  footerLayout,
  focusToNextColumn,
  userSession,
  isAppGlobal,
  inputRefs,
  partyNameRef,
  getNextVoucherNumber
}) => {
  const { appState } = useAppState();
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({ visible: false, type: "" });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [updateTriggered, setUpdateTriggered] = useState(false);
  const [isSmallHeight, setIsSmallHeight] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isMinimized = appState.toggled && appState.toggled.includes("close");
  const sidebarWidth = isMinimized ? "80px" : "240px";
  const isLargeScreen = window.innerWidth >= 1000;
  const headerLeft = isLargeScreen ? sidebarWidth : "0";
  const isRtl = appState.locale.rtl;
  const headerStyle = {
    left: isRtl ? "0" : headerLeft,
    right: isRtl ? headerLeft : "0",
  };
  const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  const { hasRight } = useUserRights();
  const clientSession = useAppSelector((state: RootState) => state.ClientSession);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallHeight(window.innerHeight <= 650);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleButtonClick = (type: string) => {

    setIsModalOpen({ visible: true, type: type });
  };

  const closeModal = () => {
    setIsModalOpen({ visible: false, type: "" });
  };

  const handleMoreButtonClick = () => {
    setIsMoreModalOpen(true);
  };

  const closeMoreModal = () => {
    setIsMoreModalOpen(false);
  };

  const handleLedgerDetailsClick = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { ledgerDetails: true },
      })
    );
  };

  const closeLedgerDetailsModal = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { ledgerDetails: false },
      })
    );
  };

  const handleDraftModeOpen = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { draftModeModal: true },
      })
    );
  };

  const handleDraftModeClose = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { draftModeModal: false },
      })
    );
  };

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit" | null>(null);

  const handleChange = (value: string) => {
    dispatch(formStateHandleFieldChangeKeysOnly({
      fields: {
        transaction: {
          master: {
            cashrOrCredit: value
          }
        }
      }
    }))
  };

  // Input navigation refs
  // const partyNameRef = React.useRef<HTMLInputElement | null>(null);
  const address1Ref = useRef<HTMLInputElement>(null);
  // const mobileNumberRef = useRef<HTMLInputElement>(null);
  const mobileNumberRef = React.useRef<HTMLInputElement | null>(null);
  // const ordCardNoRef = useRef<HTMLInputElement>(null);
  // const ReferenceNumberRef = useRef<HTMLInputElement>(null);
  const referenceNumberInputRef = useRef<HTMLInputElement>(null);

const [openPartyModal, setOpenPartyModal] = useState(false);  // Customer add master modal opens
const MemoizedPartiesManage = useMemo(() => React.memo(PartiesManage), []);
  // Handle sequential input navigation
  const handleInputNavigation = useCallback(
    async(e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement | any>) => {
      if (e.key === "Enter") {
        // const mobileNo = formState.transaction.master.address4;
        const mobileNo = e.currentTarget.value;
        if (applicationSettings.inventorySettings.allowCustomerCreationByMobNo && mobileNo?.trim()) {
          const resLedgerId = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/LoadCustomerByMobileNumber/${mobileNo}`);
          if(Number(resLedgerId)>0){
            dispatch(
              formStateMasterHandleFieldChange({
                fields: { ledgerID: Number(resLedgerId) },
              })
            );
          }
          if(Number(resLedgerId) === 0){
            // Opens the modal for customer creation
            setOpenPartyModal(true);
             return;
          }
        }else{
          e.preventDefault();
          e.stopPropagation();
          setTimeout(() => {
            nextRef.current?.focus();
            nextRef.current?.select?.();
          }, 0);
          return;
        }
         e.preventDefault();
         e.stopPropagation();
          setTimeout(() => {
            nextRef.current?.focus();
            nextRef.current?.select?.();
          }, 0);
         return;
      }
    },
    []
  );

  const udateApproval = useCallback(async () => {
    try {
      const response = await api.postAsync(
        `${Urls.inv_transaction_base}${transactionType}/udateApproval/${formState.transaction.master.invTransactionMasterID}/${formState.transaction.hasApproved ? true : false}`,
        {}
      );
      return response;
    } catch (error) {
      console.error("Error updating sales approval status:", error);
    }
  }, [formState.transaction.master.invTransactionMasterID]);

  const handleApproveClick = async () => {
    const result: any = await ERPAlert.show({
      title: t("Confirmation"),
      text: t("Mark as shown?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (result?.isConfirmed || result === true || result?.value === true) {
      try {
       const res = await udateApproval();
       if(res.isOk !== true){ return}

        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: { transaction:{hasApproved: true} },
          })
        );
        ERPToast.show("Approved Successfully", "success");
      } catch (error) {
        ERPToast.show("Failed to approve", "error");
      }
    }
  };

  const getGRNTitle = (voucherType: string) => {
    switch (voucherType) {
      case "PR":
        return t("grr_number");
      case "GRN":
        return t("po");
      case "PI_Ref":
        return t("pi");
      default:
        return t("grn_number");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropDownOpen.open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button") &&
        !document
          .querySelector(".combobox-dropdown")
          ?.contains(event.target as Node) &&
        !document
          .querySelector(".combobox-dropdown-modal")
          ?.contains(event.target as Node) &&
        !document
          .querySelector(".MuiAutocomplete-popper")
          ?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".combobox-dropdown") &&
        !(event.target as HTMLElement).closest(".MuiAutocomplete-popper")
      ) {
        toggleDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen.open, toggleDropdown]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


  // Open W-stock list modal
  const handleWStockList = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { wStockListOpen: true }
      })
    )
  }
  // close W-stock list modal
  const CloseWStockList = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { wStockListOpen: false }
      })
    )
  }

  // The draft mode call is not need to run on the initial load
  const isFirstRender = useRef(true); 
  // When draft mode check box tick changes - change voucher number
   useEffect(() => {
      const onDraftModeChange = async (checked: boolean) => {
      const isDraft = checked;
      const vrForm = formState.transaction.master.voucherForm;
      const vrType = formState.transaction.master.voucherType;
      const vrPrefix = formState.transaction.master.voucherPrefix;
      let nextVrNumber: any = null;
      let nextActiveVrNumber: any = null;
      const softwareDate = moment(clientSession.softwareDate,"DD/MM/YYYY").local();
      let btnEditVisible = true;
      let btnDeleteVisible = true;
      if(isDraft){
        btnEditVisible = true;
        btnDeleteVisible = true;
        if (!hasRight(formState.formCode, UserAction.Edit)) {
          btnEditVisible = false;
        }
        if (!hasRight(formState.formCode, UserAction.Delete)) {
          btnDeleteVisible = false;
        }
        nextActiveVrNumber = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/GetNextVoucherNumber/`,
              `formType=${formState.initialFormType}&voucherType=${"SID"}&voucherPrefix=${""}&isVoucherPrefix=${false}`) ;
      }else{
        btnEditVisible = false;
        btnDeleteVisible = false;
        if(formState.transaction.master.draftTransactionMasterID > 0){
          dispatch(
            formStateHandleFieldChange({
              fields: { 
                isEdit : false,
               },
            })
          )
        }
        nextVrNumber = await getNextVoucherNumber(vrForm,vrType,vrPrefix,false);
      }
      const nextNo = isDraft ? nextActiveVrNumber.voucherNumber : nextVrNumber.voucherNumber; 
      let outResult : DeepPartial<TransactionFormState> = {
        transaction: {
          master: {
            voucherType: isDraft ? "SID" : formState.initialVrType,
            voucherForm: isDraft ? "" : formState.initialFormType,
            voucherPrefix: isDraft ? "" : formState.initialVrPrefix,
            voucherNumber: nextNo,
            transactionDate: isDraft ? formState.transaction?.master?.transactionDate : softwareDate.toISOString(),
            invTransactionMasterID: isDraft ? formState.transaction.master.invTransactionMasterID : formState.transaction.master.draftTransactionMasterID > 0 ? 0 : formState.transaction.master.invTransactionMasterID,
          },
        },
        formElements: {
          btnEdit: { disabled: btnEditVisible },
          btnDelete: { disabled: btnDeleteVisible },
          chkDraftMode: { disabled: !isDraft && formState.transaction.master.draftTransactionMasterID > 0}

        },
      }
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: outResult
        })
      );
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }else{
      onDraftModeChange(formState.draftMode)
    }
  }, [formState.draftMode]);

  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  const conditionalFooterComponents =
    footerLayout === "vertical" && isSmallHeight ? (
      <>
        <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-end gap-1">
          <WarehouseID
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
          <PriceCategoryCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
          <CostCentreCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
          <SupplyTypeCombobox
            isAppGlobal={isAppGlobal}
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
          <AdjustmentAmountInput
            transactionType={transactionType}
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </>
    ) : null;

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        if (typeof onHeightChange === "function") {
          onHeightChange(height);
        }
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onHeightChange]);

  function mergeRefs<T>(...refs: React.Ref<T>[]) {
    return (value: T | null) => {
      refs.forEach(ref => {
        if (!ref) return;

        if (typeof ref === "function") {
          ref(value);
        } else {
          // ✅ cast is required because RefObject.current is readonly
          (ref as React.MutableRefObject<T | null>).current = value;
        }
      });
    };
  }

  return (
    <div>
      {isDropDownOpen.open && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-30 "
          onClick={toggleDropdown}
        />
      )}
      {!deviceInfo?.isMobile && (
        <div
          style={headerStyle}
          className={`fixed top-[110px] z-[39] dark:bg-dark-bg ${formState.draftMode ? "bg-sky-200" : "bg-white"} shadow-md transition-all duration-300`}
        >
          {/* {((formState.transaction.master.voucherType == VoucherType.SalesInvoice || formState.transaction.master.voucherType == VoucherType.SalesInvoiceDraft) &&
          <ERPCheckbox
            id="creditAccount"
            label={t("credit_account")}
            checked={formState.creditAccount}
            onChange={(e) => {
              dispatch(
                formStateHandleFieldChange({
                  fields: { creditAccount: e.target.checked },
                })
              );
            }}
          />
          )} */}

          {/* {((formState.transaction.master.voucherType == VoucherType.SalesInvoice || formState.transaction.master.voucherType == VoucherType.SalesInvoiceDraft) &&
          <ERPDataCombobox
            value={formState.creditAccount}
             className="w-[950px]"
            field={{
              id: "creditAccountID",
              required: true,
              //  getListUrl: "",
              //  valueKey: "",
              //  labelKey: "",
            }}
            onChangeData={(data: any) => {
              dispatch(
                formStateHandleFieldChange({
                  fields: {creditAccount: data.ledgerID },
                })
              );
            } }
            label={t("credit_account")} id={""}
            />
            )} */}

            {/* {(formState.transaction.master.voucherType == VoucherType.SalesReturn &&
          <ERPCheckbox
            id="debitAccount"
            label={t("debit_account")}
            checked={formState.debitAccount}
            onChange={(e) => {
              dispatch(
                formStateHandleFieldChange({
                  fields: { debitAccount: e.target.checked },
                })
              );
            }}
          />
          )}  */}


          {/* {(formState.transaction.master.voucherType == VoucherType.SalesReturn &&
          <ERPDataCombobox
            value={formState.debitAccount}
            className="w-[800px]"
            field={{
              id: "debitAccountID",
              required: true,
              //  getListUrl: "",
              //  valueKey: "",
              //  labelKey: "",
            }}
            onChangeData={(data: any) => {
              dispatch(
                formStateHandleFieldChange({
                  fields: { debitAccount: data.ledgerID },
                })
              );
            } }
            label={t("debit_account")} id={""}
            
            />
            )} */}





          <div ref={containerRef} className="flex items-end gap-1 relative px-2 !pb-3">
            <PartyLedger
              ref={ledgerIdRef}
              handleFieldKeyDown={handleFieldKeyDown}
              transactionType={transactionType}
              handleKeyDown={handleKeyDown}
              formState={formState}
              dispatch={dispatch}
              t={t}
              setIsPartyDetailsOpen={() => {
                setIsPartyDetailsOpen((prev: any) => {
                  return !prev;
                });
              }}
            />
            <div>
              <button
                onClick={handleLedgerDetailsClick}
                aria-label="View Ledger Details"
                className="p-2 rounded-md shadow-md dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg hover:bg-gray-300 focus:outline-none transition-colors duration-200"
              >
                <Search className="w-4 h-4 dark:text-dark-text text-gray-700" />
              </button>
            </div>

            <AccVoucherPrefix
              ref={voucherNumberRef}
              formState={formState}
              dispatch={dispatch}
              handleKeyDown={handleKeyDown}
              initializeFormElements={initializeFormElements}
              t={t}
            />

            <AccVoucherNo
              ref={voucherNumberRef}
              formState={formState}
              dispatch={dispatch}
              handleKeyDown={handleKeyDown}
              initializeFormElements={initializeFormElements}
              t={t}
            />

            {formState.transaction.master.voucherType !==
              VoucherType.GoodsReceiptNote && (
                <ReferenceNumber
                  formState={formState}
                  dispatch={dispatch}
                  handleLoadByRefNo={handleLoadByRefNo}
                  // ref={referenceNumberInputRef}
                  ref={mergeRefs(referenceNumberInputRef, refNoRef)}

                  t={t}
                  onKeyDown={(e: any) => handleInputNavigation(e, mobileNumberRef)}

                />
              )}

            <ReferenceDate
              ref={inputRefs?.refDate}
              dispatch={dispatch}
              formState={formState}
              handleKeyDown={(e) => { handleKeyDown(e, "refDate") }}
              t={t}
            />

            <TransactionDate formState={formState} dispatch={dispatch} t={t} ref={transactionDateRef}/>
          </div>

          {/* Dropdown content */}
          <div
            ref={dropdownRef}
            className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropDownOpen.open ? "max-h-[50vh]" : "max-h-0"
              }`}
          >
            <div className={`p-4 md:p-2 dark:bg-dark-bg-card ${formState.draftMode ? "bg-sky-200" : "bg-white"} border-t dark:border-dark-border border-gray-300 shadow-lg`}>
              <div className="flex flex-wrap !items-end gap-1">
                {/* <Employee
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                  transactionType={transactionType}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                /> */}

                {/* <div className={`${isRtl ? "mr-0 ml-3" : "mr-3 ml-0"}`}>
                  <DebitAccount
                    dispatch={dispatch}
                    transactionType={transactionType}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                </div> */}

                {/* {formState.transaction.master.voucherType !==
                  VoucherType.GoodsReceiptNote && ( */}
                 {(formState.transaction.master.voucherType == VoucherType.SalesReturn &&
                  <ERPInput
                  id="SalesInvoice"
                  label={t("Sales Invoice #")}
                  placeholder={t("enter_Sales_Invoice_#")}
                  className="w-[100px]"
                  />
                   
                )} 

                {(formState.transaction.master.voucherType == VoucherType.SalesReturn &&
                  <ERPInput
                    id=""
                    label={t("")}
                    placeholder={t("")}
                    className="w-[100px]"
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.SalesReturn &&
                  <ERPInput
                    id="DRNO"
                    label={t("DR_NO")}
                    placeholder={t("enter_DR_NO")}
                    className="w-[100px]"
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.SalesReturn &&
                  <ERPButton
                    title={t("...")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg h-4"
                  />
                )}




                {([VoucherType.GoodRequest,VoucherType.SalesOrder].includes(formState.transaction.master.voucherType as any)&&
                  <ERPInput
                    id="SQ"
                    label={t("SQ #")}
                    placeholder={t("enter_SQ_#")}
                    className="w-[80px]"
                    
                  />
                )}

                {([VoucherType.GoodRequest,VoucherType.SalesOrder].includes(formState.transaction.master.voucherType as any)&&
                  <ERPInput
                    id=""
                    label={t("")}
                    placeholder={t("")}
                    className="w-[100px]"
                  />
                )}

                {([VoucherType.GoodRequest,VoucherType.SalesOrder].includes(formState.transaction.master.voucherType as any)&&
                  <ERPButton
                    title={t("Load")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg w-10 h-6"
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.SalesQuotation &&
                  <ERPInput
                    id="MQuotNo"
                    label={t("M Quot.No#")}
                    placeholder={t("enter_MQuot_No_#")}
                    className="w-[80px]"
                    
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.SalesQuotation &&
                  <ERPButton
                    title={t("...")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg h-4"
                  />
                )}

                 {(formState.transaction.master.voucherType == VoucherType.SalesQuotation &&
                  <ERPInput
                    id="RFQ"
                    label={t("RFQ #")}
                    placeholder={t("enter_RFQ_#")}
                    className="w-[80px]"
                    
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.SalesQuotation &&
                  <ERPButton
                    title={t("Load")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg w-10 h-6"
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.GoodsDeliveryNote &&
                  <ERPInput
                    id="Ouot_No"
                    label={t("Ouot_No")}
                    placeholder={t("enter_Ouot_No")}
                    className="w-[80px]"
                    
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.GoodsDeliveryNote &&
                  <ERPInput
                    id=""
                    label={t("")}
                    placeholder={t("")}
                    className="w-[150px]"
                  />
                )}

                {(formState.transaction.master.voucherType == VoucherType.GoodsDeliveryNote &&
                  <ERPButton
                    title={t("...")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg h-4"
                  />
                )}



                <Project
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
                

                <Employee
                  ref={employeeRef}
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                  transactionType={transactionType}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  // disableEnterNavigation
                  ref={partyNameRef}
                  id="partyName"
                  label={t("name")}
                  value={formState.transaction.master.partyName}
                  className="max-w-full"
                  onChange={(e) =>
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: { partyName: e.target?.value },
                      })
                    )
                  }
                  // onKeyDown={(e) => handleInputNavigation(e, address1Ref)}
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  disableEnterNavigation
                  ref={address1Ref}
                  id="address1"
                  label={t("address_1")}
                  value={formState.transaction.master.address1}
                  className="max-w-full"
                  onChange={(e) =>
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: { address1: e.target?.value },
                      })
                    )
                  }
                  onKeyDown={(e) => handleInputNavigation(e, mobileNumberRef)}
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                {/* <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  disableEnterNavigation
                  ref={mobileNumberRef}
                  onKeyDown={(e) => handleInputNavigation(e, ReferenceNumberRef)}
                  id="address4"
                  label={t("mobile_number")}
                  value={formState.transaction.master.address4}
                  className="max-w-full"
                  onChange={(e) =>
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: { address4: e.target?.value },
                      })
                    )
                  }
                  disabled={formState.formElements.pnlMasters?.disabled}
                /> */}
                {(formState.transaction.master.voucherType !== VoucherType.SalesReturn &&
                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  disableEnterNavigation
                  // ref={mobileNumberRef}
                  // ref={mobileNumRef}
                  ref={(el) => {
                    mobileNumRef.current = el;
                    mobileNumberRef.current = el;
                  }}
                  onKeyDown={(e) => handleInputNavigation(e, referenceNumberInputRef)}
                  id="address4"
                  label={t("mobile_number")}
                  value={formState.transaction.master.address4}
                  className="max-w-full"
                  onChange={(e) =>
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: { address4: e.target?.value },
                      })
                    )
                  }
                  disabled={formState.formElements.pnlMasters?.disabled}
                />
                )}

                {([VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation, VoucherType.ServiceInvoice].includes(formState.transaction.master.voucherType as any) &&
                  <ERPInput
                    id="orderCardNo"
                    label={t("token_no")}
                    type="number"
                    placeholder={t("enter_token_number")}
                    value={formState.transaction.master.orderCardNo}
                    onChange={(e) => {
                      const value = e.target.value; // remove non-numbers

                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { orderCardNo: value },
                        })
                      );
                    }}
                  />

                )}
                {(formState.transaction.master.voucherType == VoucherType.SalesQuotation &&
                  <ERPInput
                    id="notes1"
                    label={t("notes_1")}
                    placeholder={t("enter_notes")}
                    value={formState.transaction.master.master2.notes1}
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master2: {
                                  notes1: e.target.value,
                                },
                              }
                            }
                          },
                        })
                      )
                    }
                  />
                )}
                {(formState.transaction.master.voucherType == VoucherType.SalesQuotation &&
                  <ERPInput
                    id="notes2"
                    label={t("notes_2")}
                    placeholder={t("enter_notes")}
                    value={formState.transaction.master.master2.notes2}
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master2: {
                                  notes2: e.target.value,
                                },
                              }
                            }
                          },
                        })
                      )
                    }
                  />
                )}

                {userSession.dbIdValue == "SEMAKA" && (formState.transaction.master.voucherType == VoucherType.SalesInvoice || formState.transaction.master.voucherType == VoucherType.SalesInvoiceDraft ) && (
                  <div className="flex items-end gap-3 ml-2">
                    <ERPRadio
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      label={t("cash")}
                      checked={formState.transaction.master.cashrOrCredit === "cash"}
                      onChange={(e) => handleChange(e.target.value)}
                    />
                    <ERPRadio
                      id="credit"
                      name="paymentMethod"
                      value="credit"
                      label={t("credit")}
                      checked={formState.transaction.master.cashrOrCredit !== "cash"}
                      onChange={(e) => handleChange(e.target.value)}
                    />
                  </div>
                )}

                {formState.formElements.inSearch?.visible && (
                  <ERPCheckbox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="inSearch"
                    className="text-left !m-0 dark:text-dark-text"
                    label={t(formState.formElements.inSearch.label)}
                    checked={formState.inSearch}
                    onChange={(e) => {
                      dispatch(
                        formStateHandleFieldChange({
                          fields: { inSearch: e.target.checked },
                        })
                      );
                    }}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}
                {((formState.transaction.master.voucherType == VoucherType.SalesInvoice || formState.transaction.master.voucherType == VoucherType.SalesInvoiceDraft) &&
                  <div className="flex items-end gap-2">
                    <ERPCheckbox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="draftMode"
                      className="text-left !m-0 dark:text-dark-text"
                      label={t(formState.formElements.draftMode?.label)}
                      checked={formState.draftMode}
                      onChange={(e) => {
                        dispatch(
                          formStateHandleFieldChange({
                            fields: { draftMode: e.target.checked },
                          })
                        );
                      }}
                      disabled={formState.formElements.pnlMasters?.disabled}
                    />
                    <button
                      disabled={!formState.draftMode}
                      onClick={handleDraftModeOpen}
                      className={`bg-gray-300 p-2 rounded-md transition duration-300 flex-shrink-0   ${!formState.draftMode ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}>
                      <ArrowBigDownDash className="w-4 h-4" />
                    </button>

                    {formState.draftModeModal && (
                      <ERPModal
                        isOpen={formState.draftModeModal}
                        closeModal={handleDraftModeClose}
                        title={t('draft_mode')}
                        width={800}
                        height={500}
                        content={
                          <DraftMode
                            closeModal={handleDraftModeClose}
                            formState={formState}
                            loadAndSetTransVoucher={loadAndSetTransVoucher}
                            t={t}
                          />
                        }
                      />
                    )}
                  </div>
                )}


                
                <span className="text-xs dark:text-dark-text text-[#191155] font-bold px-4 py-1">
                      {t(formState.transaction.master.customerType)}
                    </span>

                

                {([VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate, VoucherType.SalesInvoiceDraft].includes(formState.transaction.master.voucherType as any) &&
                  <div>
                    <ERPButton
                      title={t("more")}
                      variant="secondary"
                      onClick={handleMoreButtonClick}
                      disabled={formState.transactionLoading}
                      className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                    />
                  </div>
                )}
                {([VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate, VoucherType.SalesInvoiceDraft].includes(formState.transaction.master.voucherType as any) &&
                  isMoreModalOpen && (
                    <ERPModal
                      isOpen={isMoreModalOpen}
                      title={t("more_options")}
                      width={710}
                      height={450}
                      closeModal={closeMoreModal}
                      closeOnEscape={true}
                      content={
                        <MoreOptionsModalContent
                          transactionType={transactionType}
                          loadAndSetTransVoucher={loadAndSetTransVoucher}
                          formState={formState}
                          dispatch={dispatch}
                          handleFieldChange={handleFieldChange}
                          t={t}
                        />
                      }
                    />
                  )
                )}
                {((formState.transaction.master.voucherType == VoucherType.SalesInvoice || formState.transaction.master.voucherType == VoucherType.SalesInvoiceDraft) &&

                  <ERPButton
                    title={t("w_stock")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                    onClick={handleWStockList}
                  />
                )}
                {([VoucherType.SalesInvoice,VoucherType.GoodsDeliveryNote, VoucherType.SalesInvoiceDraft].includes(formState.transaction.master.voucherType as any) &&
                <ManualInvNo
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    type="PI_Ref"
                    label={t("m_invoice_no")}
                    loadAndSetTransVoucher={loadAndSetTransVoucher}
                  />
                  )}
                {formState.wStockListOpen && (
                  <ERPModal
                    isOpen={formState.wStockListOpen}
                    title={t("stock_details")}
                    width={500}
                    height={300}
                    closeModal={CloseWStockList}
                    content={<WareHouseStock t={t} closeModal={CloseWStockList} productName={formState.currentCell?.data?.product || ""} productBatchID={formState.currentCell?.data?.productBatchID} />}
                  />
                )}

                {["DURRAH_RYD", "986797588010", "BRIDCO"].includes(userSession.dbIdValue) && (
                  <ERPButton
                    title={t("b_stock")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                  />
                )}
              </div>

              {conditionalFooterComponents}
              {formState.formElements.pnlImport.visible && (
                <div className="inline-flex items-end gap-1 border border-dashed dark:border-dark-border border-gray-400 p-2 rounded-md mt-2">
                  {formState.formElements.cbCurrency?.visible && (
                    <ERPDataCombobox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      enableClearOption={false}
                      fetching={formState.transactionLoading}
                      id="currencyId"
                      className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                      label={t(formState.formElements.cbCurrency.label)}
                      data={formState.transaction.master}
                      onSelectItem={(e) => {
                        dispatch(
                          formStateMasterHandleFieldChange({
                            fields: {
                              currencyID: e.value,
                              exchangeRate: e.name,
                            },
                          })
                        );
                        handleFieldKeyDown("currencyId", "Enter");
                      }}
                      value={formState.transaction.master.currencyID}
                      field={{
                        id: "currencyId",
                        valueKey: "id",
                        labelKey: "name",
                        nameKey: "alias",
                        getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/Currency`,
                      }}
                      disabled={
                        formState.formElements.cbCurrency.disabled ||
                        formState.formElements.pnlMasters?.disabled
                      }
                      disableEnterNavigation
                      onKeyDown={(e: any) => {
                        handleKeyDown && handleKeyDown(e, "currency");
                      }}
                    />
                  )}

                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="exchangeRate"
                    label={t(formState.formElements.exchangeRate.label)}
                    value={formState.transaction.master.exchangeRate}
                    disableEnterNavigation={true}
                    fetching={formState.transactionLoading}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "exchangeRate");
                    }}
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { exchangeRate: e.target?.value },
                        })
                      )
                    }
                    className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                    disabled={
                      formState.formElements.exchangeRate?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                  />

                  <ERPButton
                    title={t("set")}
                    variant="secondary"
                    className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                    disabled={formState.transactionLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Chevron button - moves with dropdown content */}
          <div className="relative w-full">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[-8px]">
              <button
                onClick={toggleDropdown}
                className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-white rounded-b-full border border-l-0 border-r-0 border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen.open ? "dark:bg-dark-hover-bg bg-gray-100" : ""
                  }`}
                style={{
                  transform: isDropDownOpen ? "translateY(0)" : "translateY(0)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <ChevronDown
                  className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropDownOpen.open
                    ? "transform rotate-180"
                    : hasAnimated
                      ? ""
                      : "animate-[bounce_2s_1]"
                    }`}
                  size={24}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {deviceInfo?.isMobile && (
        <div
          style={{ left: headerLeft }}
          className="fixed top-[87px] right-0 z-[39] dark:bg-dark-bg bg-white shadow-md transition-all duration-300 w-full"
        >
          {/* Top Section - Always visible */}
          <div className="flex items-end gap-1 border-b dark:border-dark-border border-gray-300 relative px-2 !pb-3">
            <PartyLedger
              ref={ledgerIdRef}
              handleFieldKeyDown={handleFieldKeyDown}
              transactionType={transactionType}
              handleKeyDown={handleKeyDown}
              formState={formState}
              dispatch={dispatch}
              t={t}
              setIsPartyDetailsOpen={() => {
                setIsPartyDetailsOpen((prev: any) => {
                  return !prev;
                });
              }}
            />

            {formState.transaction.master.voucherType !==
              VoucherType.GoodsReceiptNote && (
                <ReferenceNumber
                  formState={formState}
                  dispatch={dispatch}
                  handleLoadByRefNo={handleLoadByRefNo}
                  ref={refNoRef}
                  t={t}
                />
              )}
          </div>

          {/* Collapsible Dropdown Section */}
          <div
            ref={dropdownRef}
            className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropDownOpen.open
              ? "max-h-[50vh] overflow-y-auto overflow-x-hidden"
              : "max-h-0 overflow-hidden"
              }`}
            style={{ width: "100%", boxSizing: "border-box" }}
          >
            <div className="p-2 dark:bg-dark-bg-card bg-white shadow-lg">
              <div className="flex items-end flex-wrap gap-2">
                <AccVoucherPrefix
                  ref={voucherNumberRef}
                  formState={formState}
                  dispatch={dispatch}
                  handleKeyDown={handleKeyDown}
                  initializeFormElements={initializeFormElements}
                  t={t}
                />
                <AccVoucherNo
                  ref={voucherNumberRef}
                  formState={formState}
                  dispatch={dispatch}
                  handleKeyDown={handleKeyDown}
                  initializeFormElements={initializeFormElements}
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
              </div>
              <div className="grid items-end grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 my-2">
                <Employee
                  ref={employeeRef}
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                  transactionType={transactionType}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
                <DebitAccount
                  transactionType={transactionType}
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
                {formState.transaction.master.voucherType !==
                  VoucherType.GoodsReceiptNote && (
                    <Project
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                      handleKeyDown={handleKeyDown}
                      handleFieldKeyDown={handleFieldKeyDown}
                    />
                  )}

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="partyName"
                  label={t("name")}
                  value={formState.transaction.master.partyName}
                  className="max-w-full"
                  onChange={(e) =>
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: { partyName: e.target?.value },
                      })
                    )
                  }
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="address1"
                  label={t("address_1")}
                  value={formState.transaction.master.address1}
                  className="max-w-full"
                  onChange={(e) =>
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: { address1: e.target?.value },
                      })
                    )
                  }
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="address2"
                      label={t("address_2")}
                      value={formState.transaction.master.address2}
                      className="max-w-full"
                      onChange={(e) =>
                        dispatch(
                          formStateMasterHandleFieldChange({
                            fields: { address2: e.target?.value },
                          })
                        )
                      }
                      disabled={formState.formElements.pnlMasters?.disabled}
                    />

                <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="address4"
                      label={t("mobile_number")}
                      ref={mobileNumRef}
                      value={formState.transaction.master.address4}
                      className="max-w-full"
                      disableEnterNavigation
                      onChange={(e) =>
                        dispatch(
                          formStateMasterHandleFieldChange({
                            fields: { address4: e.target?.value },
                          })
                        )
                      }
                      disabled={formState.formElements.pnlMasters?.disabled}
                    />
              </div>

              <div className="flex flex-wrap items-end gap-2">
                <InvoiceValue
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                  handleKeyDown={handleKeyDown}
                />
                <LedgerCode
                  ref={ledgerCodeRef}
                  handleKeyDown={handleKeyDown}
                  formState={formState}
                  dispatch={dispatch}
                  transactionType={transactionType}
                  t={t}
                />
                
                <VatTokenInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleFieldKeyDown={handleFieldKeyDown}
                  handleKeyDown={handleKeyDown}
                />
                {/* )} */}
                {/* Conditional Elements */}
                {formState.formElements.inSearch?.visible && (
                  <ERPCheckbox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="inSearch"
                    className="text-left !m-0 dark:text-dark-text"
                    label={t(formState.formElements.inSearch.label)}
                    checked={formState.inSearch}
                    onChange={(e) => {
                      dispatch(
                        formStateHandleFieldChange({
                          fields: { inSearch: e.target.checked },
                        })
                      );
                    }}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}
                
                {formState.transaction.master.voucherType ===
                  VoucherType.SalesOrder &&
                  formState.transaction.hasApproved !== true && (
                    <div>
                      <ERPButton
                        title={t("approve")}
                        variant="secondary"
                        onClick={handleApproveClick}
                      />
                    </div>
                  )}

              

                    <span className="text-xs dark:text-dark-text text-[#191155] font-bold px-4 py-1">
                      {t(formState.transaction.master.customerType)}
                    </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                

                {([VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate, VoucherType.SalesInvoiceDraft].includes(formState.transaction.master.voucherType as any) &&

                  <ERPButton
                    title={t("more")}
                    variant="secondary"
                    onClick={handleMoreButtonClick}
                    className=" dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                    disabled={formState.transactionLoading}
                  />
                )}
              </div>

             
              {
                isMoreModalOpen && (
                  <ERPModal
                    isOpen={isMoreModalOpen}
                    title={t("more_options")}
                    width={710}
                    height={450}
                    closeModal={closeMoreModal}
                    closeOnEscape={true}
                    content={
                      <MoreOptionsModalContent
                        transactionType={transactionType}
                        loadAndSetTransVoucher={loadAndSetTransVoucher}
                        formState={formState}
                        dispatch={dispatch}
                        handleFieldChange={handleFieldChange}
                        t={t}
                      />
                    }
                  />
                )
              }

              {/* Conditional Footer Components */}
              {conditionalFooterComponents}

              {/* Currency Section */}
              {formState.formElements.pnlImport.visible && (
                <div className="border border-dashed dark:border-dark-border border-gray-400 p-3 rounded-md mt-2">
                  <div className="grid items-end grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
                    {formState.formElements.cbCurrency?.visible && (
                      <div className="w-full">
                        <ERPDataCombobox
                          localInputBox={formState?.userConfig?.inputBoxStyle}
                          enableClearOption={false}
                          fetching={formState.transactionLoading}
                          id="currencyId"
                          className="w-full !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                          label={t(formState.formElements.cbCurrency.label)}
                          data={formState.transaction.master}
                          onSelectItem={(e) => {
                            dispatch(
                              formStateMasterHandleFieldChange({
                                fields: { currencyID: e.value },
                              })
                            );
                            handleFieldKeyDown("currencyId", "Enter");
                          }}
                          value={formState.transaction.master.currencyID}
                          field={{
                            id: "currencyId",
                            valueKey: "id",
                            labelKey: "code",
                            getListUrl: Urls.data_currencies,
                          }}
                          disabled={
                            formState.formElements.cbCurrency.disabled ||
                            formState.formElements.pnlMasters?.disabled
                          }
                          disableEnterNavigation
                          onKeyDown={(e: any) => {
                            handleKeyDown && handleKeyDown(e, "currency");
                          }}
                        />
                      </div>
                    )}

                    <div className="w-full">
                      <ERPInput
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        id="exchangeRate"
                        label={t(formState.formElements.exchangeRate.label)}
                        value={formState.transaction.master.exchangeRate}
                        fetching={formState.transactionLoading}
                        disableEnterNavigation={true}
                        onKeyDown={(e) => {
                          handleKeyDown && handleKeyDown(e, "exchangeRate");
                        }}
                        onChange={(e) =>
                          dispatch(
                            formStateMasterHandleFieldChange({
                              fields: { exchangeRate: e.target?.value },
                            })
                          )
                        }
                        className="w-full !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                        disabled={
                          formState.formElements.exchangeRate?.disabled ||
                          formState.formElements.pnlMasters?.disabled
                        }
                      />
                    </div>

                    <div>
                      <ERPButton
                        title={t("set")}
                        variant="secondary"
                        className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                        disabled={formState.transactionLoading}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chevron Toggle Button */}
          <div className="relative w-full">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
              <button
                onClick={toggleDropdown}
                className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-white rounded-b-lg border border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen.open ? "dark:bg-dark-hover-bg bg-gray-100" : ""
                  }`}
                style={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transform: isDropDownOpen ? "translateY(0)" : "translateY(0)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <ChevronDown
                  className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropDownOpen.open
                    ? "transform rotate-180"
                    : hasAnimated
                      ? ""
                      : "animate-[bounce_2s_1]"
                    }`}
                  size={24}
                />
              </button>
            </div>
          </div>
        </div>
      )}
      <ERPModal
        isOpen={formState.ledgerDetails}
        title={t("ledger_details")}
        width={600}
        height={610}
        closeModal={closeLedgerDetailsModal}
        content={<LedgerDetails t={t} closeModal={closeLedgerDetailsModal} />}
      />
      <ERPModal
        isOpen={openPartyModal}
        title="Customer"
        width={950}
        height={700}
        closeModal={() => setOpenPartyModal(false)}
        content={<MemoizedPartiesManage type={"Cust"} />}
      />
    </div>
  );
};

export default TransactionHeader;
