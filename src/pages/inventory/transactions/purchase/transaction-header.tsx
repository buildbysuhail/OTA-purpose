import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
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
import GrnNumber from "./components/grn-Number";
import Urls from "../../../../redux/urls";
import { formStateHandleFieldChange, formStateMasterHandleFieldChange } from "./reducer";
import MoreOptionsModalContent from "./transaction-more";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import WarehouseID from "./components/warehouse-id ";
import { TransactionDetail, TransactionFormState } from "./transaction-types";
import AdjustmentAmountInput from "./components/AdjustmentAmountInput";
import CostCentreCombobox from "./components/CostCentreCombobox";
import PriceCategoryCombobox from "./components/PriceCategoryCombobox";
import SupplyTypeCombobox from "./components/SupplyTypeCombobox";
import LedgerDetails from "./ledger-details";
import { isEnterKey, loadTemplateById } from "../../../../utilities/Utils";
import VoucherType from "../../../../enums/voucher-types";
import axios from "axios";

interface TransactionHeaderProps {
  formState: TransactionFormState;
  dispatch: any;
  handleKeyDown: any;
  focusToNextColumn: (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]) => { column: string; rowIndex: number; } | null;
  loadAndSetTransVoucher: any;
  t: any;
  handleLoadByRefNo: any;
  handleFieldChange: any;
  setIsPartyDetailsOpen: any;
  transactionType: string;
  handleFieldKeyDown: any;
  ledgerCodeRef: any;
  voucherNumberRef: any;
  refNoRef: any;
  isDropDownOpen: boolean;
  toggleDropdown: () => void;
  footerLayout: "horizontal" | "vertical";
  userSession: any;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  formState,
  dispatch,
  handleKeyDown,
  loadAndSetTransVoucher,
  t,
  handleLoadByRefNo,
  handleFieldChange,
  setIsPartyDetailsOpen,
  transactionType,
  handleFieldKeyDown,
  ledgerCodeRef,
  voucherNumberRef,
  refNoRef,
  isDropDownOpen,
  toggleDropdown,
  footerLayout,
  focusToNextColumn,
  userSession,
}) => {
  const { appState } = useAppState();
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isSmallHeight, setIsSmallHeight] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const ledgerIdRef = useRef<any>(null);
  const isMinimized = appState.toggled && appState.toggled.includes("close");
  const sidebarWidth = isMinimized ? "80px" : "240px";
  const isLargeScreen = window.innerWidth >= 1000;
  const headerLeft = isLargeScreen ? sidebarWidth : "0";
  const isRtl = appState.locale.rtl;
  const headerStyle = { left: isRtl ? "0" : headerLeft, right: isRtl ? headerLeft : "0" };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallHeight(window.innerHeight <= 650);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropDownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button") &&
        !document.querySelector(".combobox-dropdown")?.contains(event.target as Node) &&
        !document.querySelector(".combobox-dropdown-modal")?.contains(event.target as Node) &&
        !document.querySelector(".MuiAutocomplete-popper")?.contains(event.target as Node) &&
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
  }, [isDropDownOpen, toggleDropdown]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [updateTriggered, setUpdateTriggered] = useState(false);

  useEffect(() => {
    if (updateTriggered) {
      const fetchData = async () => {
        try {
          const response = await axios.post(Urls.update_order_status, {
            params: {
              vocherNumber: formState.transaction.master.voucherNumber,
              vocherForm: formState.transaction.master.voucherForm,
              voucherType: formState.transaction.master.voucherType,
              vocherPrefix: formState.transaction.master.voucherPrefix,
              status: formState.orderStatus,
            },
          });
          console.log('API Response:', response.data);
        } catch (error) {
          console.error('Error updating order status:', error);
        } finally {
          setUpdateTriggered(false);
        }
      };

      fetchData();
    }
  }, [updateTriggered]);

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

  return (
    <PartyLedger
              ref={ledgerIdRef}
              handleFieldKeyDown={handleFieldKeyDown}
              transactionType={transactionType}
              handleKeyDown={handleKeyDown}
              formState={formState}
              dispatch={dispatch}
              t={t}
              setIsPartyDetailsOpen={() => { setIsPartyDetailsOpen((prev: any) => { return !prev; }); }}
            />
  );
};

export default TransactionHeader;