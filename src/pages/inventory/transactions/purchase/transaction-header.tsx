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
  const [updateTriggered, setUpdateTriggered] = useState(false);
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

  useEffect(() => {
    if (updateTriggered) {
      const updateOrderStatus = async () => {
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
          console.log('Order API Response:', response.data);
          await updatePurchaseApproval();
        } catch (error) {
          console.error('Error updating order status:', error);
        } finally {
          setUpdateTriggered(false);
        }
      };
      updateOrderStatus();

    }
  }, [updateTriggered]);

  const updatePurchaseApproval = async () => {
    try {
      const response = await axios.post(`${Urls.purchase_approved}${formState.transaction.master.invTransactionMasterID}`, {});
      console.log('Purchase Approved API Response:', response.data);
    } catch (error) {
      console.error('Error updating purchase approval status:', error);
    }
  };
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
    <div>
      {isDropDownOpen && (<div className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-30" onClick={toggleDropdown} />)}
      {!deviceInfo?.isMobile && (
        <div style={headerStyle} className="fixed top-[110px] z-[39] dark:bg-dark-bg bg-white shadow-md transition-all duration-300">
          <div className="flex items-end gap-1 relative px-2 !pb-3">
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
            <div>
              <button onClick={handleLedgerDetailsClick} aria-label="View Ledger Details" className="p-2 rounded-md shadow-md dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg hover:bg-gray-300 focus:outline-none transition-colors duration-200">
                <Search className="w-4 h-4 dark:text-dark-text text-gray-700" />
              </button>
            </div>

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

            {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
              <ReferenceNumber
                formState={formState}
                dispatch={dispatch}
                handleLoadByRefNo={handleLoadByRefNo}
                ref={refNoRef}
                t={t}
              />
            )}

            <ReferenceDate
              dispatch={dispatch}
              formState={formState}
              handleKeyDown={(e) => {
                if (isEnterKey(e.key)) {
                  if (formState.currentCell && formState.currentCell.rowIndex > 0 && formState.currentCell.column != "") {
                    focusToNextColumn(formState.currentCell.rowIndex, formState.currentCell.column);
                  } else {
                    focusToNextColumn(0, "slNo");
                  }
                }
              }}
              t={t}
            />

            <TransactionDate
              formState={formState}
              dispatch={dispatch}
              t={t}
            />
          </div>

          {/* Dropdown content */}
          <div ref={dropdownRef} className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropDownOpen ? "max-h-[50vh]" : "max-h-0"}`}>
            <div className="p-4 md:p-2 dark:bg-dark-bg-card bg-white border-t dark:border-dark-border border-gray-300 shadow-lg">
              <div className="flex flex-wrap !items-end gap-1">
                <Employee
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />

                <div className={`${isRtl ? "mr-0 ml-3" : "mr-3 ml-0"}`}>
                  <DebitAccount
                    dispatch={dispatch}
                    transactionType={transactionType}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                </div>

                {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
                  <Project
                    dispatch={dispatch}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                )}

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
                {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
                  <VatTokenInput
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleFieldKeyDown={handleFieldKeyDown}
                    handleKeyDown={handleKeyDown}
                  />
                )}

                {formState.formElements.cbLabelDesign?.visible && (
                  <ERPDataCombobox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    enableClearOption={false}
                    fetching={formState.transactionLoading}
                    id="labelDesignID"
                    className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                    label={t(formState.formElements.cbLabelDesign.label)}
                    data={formState.transaction.master}
                    onSelectItem={async (e) => {
                      let barcodeTem = await loadTemplateById<TransactionDetail>(e.value);
                      dispatch(formStateHandleFieldChange({ fields: { barcodeTemplate: barcodeTem } }));
                      dispatch(formStateMasterHandleFieldChange({ fields: { labelDesignID: e.value, }, }));
                      handleFieldKeyDown("labelDesignID", "Enter");
                    }}
                    value={formState.transaction.master.labelDesignID}
                    field={{
                      params: `TemplateType=barcode`,
                      id: "labelDesignID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_templates,
                    }}
                    disabled={formState.formElements.cbLabelDesign.disabled || formState.formElements.pnlMasters?.disabled}
                    disableEnterNavigation
                    onKeyDown={(e: any) => { handleKeyDown && handleKeyDown(e, "labelDesign"); }}
                  />
                )}

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="partyName"
                  label={t("name")}
                  value={formState.transaction.master.partyName}
                  className="max-w-full"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { partyName: e.target?.value }, }))}
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="address1"
                  label={t("address_1")}
                  value={formState.transaction.master.address1}
                  className="max-w-full"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { address1: e.target?.value }, }))}
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                {formState.transaction.master.voucherType !== VoucherType.PurchaseReturn && (
                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="address2"
                    label={t('address_2')}
                    value={formState.transaction.master.address2}
                    className="max-w-full"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { address2: e.target?.value }, }))}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}

                {formState.transaction.master.voucherType === VoucherType.PurchaseReturn && (
                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="address4"
                    label={t('mobile_number')}
                    value={formState.transaction.master.address4}
                    className="max-w-full"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { address4: e.target?.value }, }))}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}

                {formState.transaction.master.voucherType === VoucherType.PurchaseOrder && userSession.dbIdValue === "572054329920" &&
                  <ERPDataCombobox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    enableClearOption={false}
                    fetching={formState.transactionLoading}
                    id="orderStatus"
                    className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                    label={t(formState.formElements.orderStatus.label)}
                    data={formState.transaction.master}
                    // onSelectItem={async (e) => {
                    //   let barcodeTem = await loadTemplateById<TransactionDetail>(e.value);
                    //   dispatch(formStateHandleFieldChange({ fields: { barcodeTemplate: barcodeTem } }));
                    //   dispatch(formStateMasterHandleFieldChange({ fields: { labelDesignID: e.value, }, }));
                    //   handleFieldKeyDown("labelDesignID", "Enter");
                    // }}
                    // value={formState.transaction.master.labelDesignID}
                    field={{
                      // params: `TemplateType=barcode`,
                      // id: "labelDesignID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_order_status,
                    }}
                    disabled={formState.formElements.cbLabelDesign.disabled || formState.formElements.pnlMasters?.disabled}
                    disableEnterNavigation
                    onKeyDown={(e: any) => { handleKeyDown && handleKeyDown(e, "labelDesign"); }}
                  />
                }

                {formState.transaction.master.voucherType == VoucherType.PurchaseOrder && formState.transaction.master.gatePassNo == "Approved" && formState.formElements.orderApprovalStatus.visible && (
                  <span className="bg-danger p-2 rounded-xl text-white font-medium">
                    {(formState.formElements.orderApprovalStatus.label)}
                  </span>
                )}
                {formState.transaction.master.voucherType == VoucherType.PurchaseOrder && formState.transaction.master.gatePassNo != "Approved" && (
                  <div>
                    <ERPButton
                      title={t('approve')}
                      variant="secondary"
                      onClick={() => updatePurchaseApproval()}
                    />
                  </div>
                )}

                {formState.transaction.master.voucherType === VoucherType.PurchaseOrder &&
                  <div>
                    <ERPButton
                      title={t('update_status')}
                      variant="secondary"
                      onClick={() => setUpdateTriggered(true)}
                    />
                  </div>
                }

                {formState.formElements.inSearch?.visible && (
                  <ERPCheckbox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="inSearch"
                    className="text-left !m-0 dark:text-dark-text"
                    label={t(formState.formElements.inSearch.label)}
                    checked={formState.inSearch}
                    onChange={(e) => { dispatch(formStateHandleFieldChange({ fields: { inSearch: e.target.checked }, })); }}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}

                {formState.transaction.master.voucherType === VoucherType.PurchaseReturn && (
                  <ERPCheckbox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="inventoryUpdate"
                    className="text-left !m-0 dark:text-dark-text"
                    label={t("inventory_update")}
                    checked={formState.transaction.master.stockUpdate}
                    onChange={(e) => { dispatch(formStateMasterHandleFieldChange({ fields: { stockUpdate: e.target.checked }, })); }}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}

                {formState.transaction.master.voucherType === VoucherType.PurchaseReturn && (
                  <span className="text-xs dark:text-dark-text text-[#191155] font-bold px-4 py-1">{t(formState.transaction.master.customerType)}</span>
                )}

                <div>
                  <ERPButton
                    title={t(formState.transaction.master.voucherType == "PR" ? "grr_number" : "grn_number")}
                    onClick={handleButtonClick}
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                    disabled={formState.transactionLoading}
                  />
                </div>

                {isModalOpen && (
                  <ERPModal
                    isOpen={isModalOpen}
                    title={t("grn_number")}
                    width={600}
                    height={280}
                    closeModal={closeModal}
                    content={
                      <GrnNumber
                        dispatch={dispatch}
                        formState={formState}
                        closeModal={closeModal}
                        t={t}
                        loadAndSetTransVoucher={loadAndSetTransVoucher}
                      />
                    }
                  />
                )}
                {formState.transaction.master.voucherType != VoucherType.PurchaseOrder &&
                  <div>
                    <ERPButton
                      title={t("more")}
                      variant="secondary"
                      onClick={handleMoreButtonClick}
                      disabled={formState.transactionLoading}
                      className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                    />
                  </div>
                }
                {isMoreModalOpen && (
                  <ERPModal
                    isOpen={isMoreModalOpen}
                    title={t("more_options")}
                    width={710}
                    height={450}
                    closeModal={closeMoreModal}
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
                      onSelectItem={(e) => { dispatch(formStateMasterHandleFieldChange({ fields: { currencyID: e.value, exchangeRate: e.name, }, })); handleFieldKeyDown("currencyId", "Enter"); }}
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
                    onKeyDown={(e) => { handleKeyDown && handleKeyDown(e, "exchangeRate"); }}
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { exchangeRate: e.target?.value }, }))}
                    className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                    disabled={formState.formElements.exchangeRate?.disabled || formState.formElements.pnlMasters?.disabled}
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
                className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-white rounded-b-full border border-l-0 border-r-0 border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`}
                style={{ transform: isDropDownOpen ? "translateY(0)" : "translateY(0)", transition: "transform 0.5s ease-in-out", }} >
                <ChevronDown className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropDownOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {deviceInfo?.isMobile && (
        <div style={{ left: headerLeft }} className="fixed top-[87px] right-0 z-[39] dark:bg-dark-bg bg-white shadow-md transition-all duration-300 w-full">
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
              setIsPartyDetailsOpen={() => { setIsPartyDetailsOpen((prev: any) => { return !prev; }); }}
            />

            {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
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
          <div ref={dropdownRef} className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropDownOpen ? "max-h-[50vh] overflow-y-auto overflow-x-hidden" : "max-h-0 overflow-hidden"}`} style={{ width: "100%", boxSizing: "border-box" }}>
            <div className="p-2 dark:bg-dark-bg-card bg-white shadow-lg">
              <div className="flex items-end flex-wrap gap-2">
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
                  dispatch={dispatch}
                  formState={formState}
                  t={t}
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
                {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
                  <Project
                    dispatch={dispatch}
                    formState={formState}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                )}

                {formState.formElements.cbLabelDesign?.visible && (
                  <ERPDataCombobox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    enableClearOption={false}
                    fetching={formState.transactionLoading}
                    id="labelDesignID"
                    className="w-full !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                    label={t(formState.formElements.cbLabelDesign.label)}
                    data={formState.transaction.master}
                    onSelectItem={(e) => { dispatch(formStateMasterHandleFieldChange({ fields: { labelDesignID: e.value, }, })); handleFieldKeyDown("labelDesignID", "Enter"); }}
                    value={formState.transaction.master.labelDesignID}
                    field={{ id: "labelDesignID", valueKey: "id", labelKey: "name", }}
                    disabled={formState.formElements.cbLabelDesign.disabled || formState.formElements.pnlMasters?.disabled}
                    disableEnterNavigation
                    onKeyDown={(e) => { handleKeyDown && handleKeyDown(e, "labelDesign"); }}
                  />
                )}

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="partyName"
                  label={t("name")}
                  value={formState.transaction.master.partyName}
                  className="max-w-full"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { partyName: e.target?.value }, }))}
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="address1"
                  label={t("address_1")}
                  value={formState.transaction.master.address1}
                  className="max-w-full"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { address1: e.target?.value }, }))}
                  disabled={formState.formElements.pnlMasters?.disabled}
                />

                {formState.transaction.master.voucherType !== VoucherType.PurchaseReturn && (
                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="address2"
                    label={t('address_2')}
                    value={formState.transaction.master.address2}
                    className="max-w-full"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { address2: e.target?.value }, }))}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}

                {formState.transaction.master.voucherType === VoucherType.PurchaseReturn && (
                  <ERPInput
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="address4"
                    label={t('mobile_number')}
                    value={formState.transaction.master.address4}
                    className="max-w-full"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { address4: e.target?.value }, }))}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}
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
                {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
                  <VatTokenInput
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleFieldKeyDown={handleFieldKeyDown}
                    handleKeyDown={handleKeyDown}
                  />
                )}
                {/* Conditional Elements */}
                {formState.formElements.inSearch?.visible && (
                  <ERPCheckbox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="inSearch"
                    className="text-left !m-0 dark:text-dark-text"
                    label={t(formState.formElements.inSearch.label)}
                    checked={formState.inSearch}
                    onChange={(e) => { dispatch(formStateHandleFieldChange({ fields: { inSearch: e.target.checked }, })); }}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}
                {formState.transaction.master.voucherType === VoucherType.PurchaseOrder && userSession.dbIdValue === "572054329920" && (
                  <ERPDataCombobox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    enableClearOption={false}
                    fetching={formState.transactionLoading}
                    id="orderStatus"
                    className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                    label={t(formState.formElements.orderStatus.label)}
                    data={formState.transaction.master}
                    field={{
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_order_status,
                    }}
                    disabled={formState.formElements.cbLabelDesign.disabled || formState.formElements.pnlMasters?.disabled}
                    disableEnterNavigation
                    onKeyDown={(e: any) => { handleKeyDown && handleKeyDown(e, "labelDesign"); }}
                  />
                )}
                {formState.transaction.master.voucherType === VoucherType.PurchaseOrder && formState.transaction.master.gatePassNo === "Approved" && formState.formElements.orderApprovalStatus.visible && (
                  <span>{t(formState.formElements.orderApprovalStatus.label)}</span>
                )}
                {formState.transaction.master.voucherType === VoucherType.PurchaseOrder && formState.transaction.master.gatePassNo !== "Approved" && (
                  <div>
                    <ERPButton
                      title={t('update_status')}
                      variant="secondary"
                      onClick={() => setUpdateTriggered(true)}
                    />
                  </div>
                )}
                {formState.transaction.master.voucherType === VoucherType.PurchaseOrder && (
                  <div>
                    <ERPButton
                      title={t('update_status')}
                      variant="secondary"
                      onClick={() => setUpdateTriggered(true)}
                    />
                  </div>
                )}
                {formState.transaction.master.voucherType === VoucherType.PurchaseReturn && (
                  <ERPCheckbox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    id="inventoryUpdate"
                    className="text-left !m-0 dark:text-dark-text"
                    label={t("inventory_update")}
                    checked={formState.transaction.master.stockUpdate}
                    onChange={(e) => { dispatch(formStateMasterHandleFieldChange({ fields: { stockUpdate: e.target.checked }, })); }}
                    disabled={formState.formElements.pnlMasters?.disabled}
                  />
                )}
                {formState.transaction.master.voucherType === VoucherType.PurchaseReturn && (
                  <span className="text-xs dark:text-dark-text text-[#191155] font-bold px-4 py-1">{t(formState.transaction.master.customerType)}</span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <ERPButton
                  title={t("grn_number")}
                  onClick={handleButtonClick}
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  className="!m-0  dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                  disabled={formState.transactionLoading}
                />

                {formState.transaction.master.voucherType !=
                  VoucherType.PurchaseOrder && (
                    <ERPButton
                      title={t("more")}
                      variant="secondary"
                      onClick={handleMoreButtonClick}
                      className=" dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                      disabled={formState.transactionLoading}
                    />
                  )
                }
              </div>

              {/* Modals */}
              {isModalOpen && (
                <ERPModal
                  isOpen={isModalOpen}
                  title={t("grn_number")}
                  width={600}
                  height={300}
                  closeModal={closeModal}
                  content={
                    <GrnNumber
                      dispatch={dispatch}
                      formState={formState}
                      t={t}
                      loadAndSetTransVoucher={loadAndSetTransVoucher}
                      closeModal={closeModal}
                    />
                  }
                />
              )}

              {isMoreModalOpen && (
                <ERPModal
                  isOpen={isMoreModalOpen}
                  title={t("more_options")}
                  width={650}
                  height={600}
                  closeModal={closeMoreModal}
                  content={
                    <MoreOptionsModalContent
                      transactionType={transactionType}
                      formState={formState}
                      dispatch={dispatch}
                      handleFieldChange={handleFieldChange}
                      loadAndSetTransVoucher={loadAndSetTransVoucher}
                      t={t}
                    />
                  }
                />
              )}

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
                          onSelectItem={(e) => { dispatch(formStateMasterHandleFieldChange({ fields: { currencyID: e.value, }, })); handleFieldKeyDown("currencyId", "Enter"); }}
                          value={formState.transaction.master.currencyID}
                          field={{ id: "currencyId", valueKey: "id", labelKey: "code", getListUrl: Urls.data_currencies, }}
                          disabled={formState.formElements.cbCurrency.disabled || formState.formElements.pnlMasters?.disabled}
                          disableEnterNavigation
                          onKeyDown={(e: any) => { handleKeyDown && handleKeyDown(e, "currency"); }}
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
                        onKeyDown={(e) => { handleKeyDown && handleKeyDown(e, "exchangeRate"); }}
                        onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { exchangeRate: e.target?.value }, }))}
                        className="w-full !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                        disabled={formState.formElements.exchangeRate?.disabled || formState.formElements.pnlMasters?.disabled}
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
              <button onClick={toggleDropdown} className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-white rounded-b-lg border border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`}
                style={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transform: isDropDownOpen ? "translateY(0)" : "translateY(0)",
                  transition: "transform 0.5s ease-in-out",
                }}>
                <ChevronDown className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropDownOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
              </button>
            </div>
          </div>
        </div>
      )
      }
      <ERPModal
        isOpen={formState.ledgerDetails}
        title={t("ledger_details")}
        width={600}
        height={610}
        closeModal={closeLedgerDetailsModal}
        content={<LedgerDetails closeModal={closeLedgerDetailsModal} t={t} />}
      />
    </div>
  );
};

export default TransactionHeader;