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
import Employee from "./components/cb-employee";
import DebitAccount from "./components/cb-debit-account";
import Project from "./components/cb-project";
import InvoiceValue from "./components/invoice-value";
import GrnNumber from "./components/grn-Number";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";
import { formStateHandleFieldChange, formStateMasterHandleFieldChange } from "./reducer";
import MoreOptionsModalContent from "./transaction-more";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import WarehouseID from "./components/warehouse-id ";
import { TransactionFormState } from "./transaction-types";
import AdjustmentAmountInput from "./components/AdjustmentAmountInput";
import CostCentreCombobox from "./components/CostCentreCombobox";
import PriceCategoryCombobox from "./components/PriceCategoryCombobox";
import SupplyTypeCombobox from "./components/SupplyTypeCombobox";
import LedgerDetails from "./ledger-details";
import { isEnterKey, loadTemplateById } from "../../../../utilities/Utils";

interface TransactionHeaderProps {
  formState: TransactionFormState;
  dispatch: any;
  handleKeyDown: any;
  focusToNextColumn: (rowIndex: number, column: string) => {
    column: string;
    rowIndex: number;
} | null;
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
  focusToNextColumn
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

  const headerStyle = {
    left: isRtl ? "0" : headerLeft,
    right: isRtl ? headerLeft : "0"
  };

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
        !(event.target as HTMLElement).closest("button")
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
      {isDropDownOpen && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-30" onClick={toggleDropdown} />
      )}

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
                <Search className="w-5 h-5 dark:text-dark-text text-gray-700" />
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
              handleKeyDown={(e) => {
                if(isEnterKey(e.key)) {
                  debugger;
                  if(formState.currentCell && formState.currentCell.rowIndex > 0&& formState.currentCell.column != "") {
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
              <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-end gap-1">
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

                <div>
                  <ERPButton
                    title={t("grn_number")}
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
                        t={t}
                        loadAndSetTransVoucher={loadAndSetTransVoucher}
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

                <div>
                  {formState.formElements.chkVat?.visible && (
                    <ERPCheckbox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="enableTaxNumber"
                      className="text-left dark:text-dark-text"
                      label={t(formState.formElements.chkVat.label)}
                      checked={formState.enableTaxNumber}
                      onChange={(e) => {
                        dispatch(
                          formStateHandleFieldChange({
                            fields: { enableTaxNumber: e.target.checked },
                          })
                        );
                      }}
                      disabled={formState.formElements.pnlMasters?.disabled}
                    />
                  )}

                  {formState.formElements.cbVatAccount?.visible && (
                    <ERPInput
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="tokenNumber"
                      label={t(formState.formElements.chkVat.label)}
                      className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                      noLabel={true}
                      fetching={formState.transactionLoading}
                      data={formState.transaction.master}
                      onChange={(e) => {
                        dispatch(
                          formStateMasterHandleFieldChange({
                            fields: {
                              tokenNumber: e.target.value,
                            },
                          })
                        );
                        handleFieldKeyDown &&
                          handleFieldKeyDown("tokenNumber", "Enter");
                      }}
                      value={formState.transaction.master.tokenNumber}
                      disabled={
                        formState.formElements.cbVatAccount.disabled ||
                        formState.enableTaxNumber === false ||
                        formState.formElements.pnlMasters?.disabled
                      }
                      disableEnterNavigation
                      onKeyDown={(e: any) => {
                        handleKeyDown && handleKeyDown(e, "tokenNumber");
                      }}
                    />
                  )}
                </div>

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
                      let barcodeTem = await loadTemplateById(e.value);
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
                    disabled={
                      formState.formElements.cbLabelDesign.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    disableEnterNavigation
                    onKeyDown={(e: any) => {
                      handleKeyDown && handleKeyDown(e, "labelDesign");
                    }}
                  />
                )}

                <div>
                  <ERPButton
                    title={t("more")}
                    variant="secondary"
                    onClick={handleMoreButtonClick}
                    disabled={formState.transactionLoading}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                  />
                </div>

                {isMoreModalOpen && (
                  <ERPModal
                    isOpen={isMoreModalOpen}
                    title={t("more_options")}
                    width={650}
                    height={580}
                    closeModal={closeMoreModal}
                    content={
                      <MoreOptionsModalContent
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
                className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-white rounded-b-full border border-l-0 border-r-0 border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`}
                style={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transform: isDropDownOpen ? "translateY(0)" : "translateY(0)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <ChevronDown className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropDownOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {deviceInfo?.isMobile && (
        <div style={{ left: headerLeft }} className="fixed top-[110px] right-0 z-[39] dark:bg-dark-bg bg-white shadow-md transition-all duration-300">
          <div className="flex items-end gap-1 relative px-2 !pb-3">
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

            <ReferenceNumber
              formState={formState}
              dispatch={dispatch}
              handleLoadByRefNo={handleLoadByRefNo}
              ref={refNoRef}
              t={t}
            />
          </div>

          <div
            ref={dropdownRef}
            className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropDownOpen ? "max-h-[30vh] overflow-y-auto overflow-x-hidden" : "max-h-0 overflow-hidden"}`}
            style={{
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div className="p-4 md:p-2 dark:bg-dark-bg-card bg-white border-t dark:border-dark-border border-gray-300 shadow-lg">
              <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 items-end gap-1">
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

                <div>
                  <ERPButton
                    title={t("grn_number")}
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
                    height={300}
                    closeModal={closeModal}
                    content={
                      <GrnNumber
                        dispatch={dispatch}
                        formState={formState}
                        t={t}
                        loadAndSetTransVoucher={loadAndSetTransVoucher}
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

                <div>
                  {formState.formElements.chkVat?.visible && (
                    <ERPCheckbox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="enableTaxNumber"
                      className="text-left dark:text-dark-text"
                      label={t(formState.formElements.chkVat.label)}
                      checked={formState.enableTaxNumber}
                      onChange={(e) => {
                        dispatch(
                          formStateHandleFieldChange({
                            fields: { enableTaxNumber: e.target.checked },
                          })
                        );
                      }}
                      disabled={formState.formElements.pnlMasters?.disabled}
                    />
                  )}

                  {formState.formElements.cbVatAccount?.visible && (
                    <ERPDataCombobox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      enableClearOption={false}
                      id="tokenNumber"
                      className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                      noLabel={true}
                      fetching={formState.transactionLoading}
                      data={formState.transaction.master}
                      onSelectItem={(e) => {
                        dispatch(
                          formStateMasterHandleFieldChange({
                            fields: {
                              tokenNumber: e.value,
                            },
                          })
                        );
                        handleFieldKeyDown &&
                          handleFieldKeyDown("tokenNumber", "Enter");
                      }}
                      value={formState.transaction.master.tokenNumber}
                      field={{
                        id: "tokenNumber",
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_employees,
                        params: `ledgerType=${formState.formElements?.cbVatAccount?.accLedgerType ||
                          LedgerType.All
                          }`,
                      }}
                      disabled={
                        formState.formElements.cbVatAccount.disabled ||
                        formState.enableTaxNumber === false ||
                        formState.formElements.pnlMasters?.disabled
                      }
                      disableEnterNavigation
                      onKeyDown={(e: any) => {
                        handleKeyDown && handleKeyDown(e, "tokenNumber");
                      }}
                    />
                  )}
                </div>

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

                {formState.formElements.cbLabelDesign?.visible && (
                  <ERPDataCombobox
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    enableClearOption={false}
                    fetching={formState.transactionLoading}
                    id="labelDesignID"
                    className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                    label={t(formState.formElements.cbLabelDesign.label)}
                    data={formState.transaction.master}
                    onSelectItem={(e) => {
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: {
                            labelDesignID: e.value,
                          },
                        })
                      );
                      handleFieldKeyDown("labelDesignID", "Enter");
                    }}
                    value={formState.transaction.master.labelDesignID}
                    field={{
                      id: "labelDesignID",
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    disabled={
                      formState.formElements.cbLabelDesign.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    disableEnterNavigation
                    onKeyDown={(e: any) => {
                      handleKeyDown && handleKeyDown(e, "labelDesign");
                    }}
                  />
                )}

                <div>
                  <ERPButton
                    title={t("more")}
                    variant="secondary"
                    onClick={handleMoreButtonClick}
                    className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                    disabled={formState.transactionLoading}
                  />
                </div>

                {isMoreModalOpen && (
                  <ERPModal
                    isOpen={isMoreModalOpen}
                    title={t("more_options")}
                    width={650}
                    height={600}
                    closeModal={closeMoreModal}
                    content={
                      <MoreOptionsModalContent
                        formState={formState}
                        dispatch={dispatch}
                        handleFieldChange={handleFieldChange}
                        loadAndSetTransVoucher={loadAndSetTransVoucher}
                        t={t}
                      />
                    }
                  />
                )}
              </div>
              {conditionalFooterComponents}
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
                          },
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
                )}

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
                  className="min-w-[180px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                  disabled={
                    formState.formElements.exchangeRate?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                />

                {/* <ERPButton
                  title={t("set")}
                  variant="secondary"
                  className="!m-0"
                  disabled={formState.transactionLoading}
                /> */}
              </div>
            </div>
          </div>

          {/* Chevron button - moves with dropdown content */}
          <div className="relative w-full">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
              <button
                onClick={toggleDropdown}
                className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-white rounded-b-lg border border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`}
                style={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transform: isDropDownOpen ? "translateY(0)" : "translateY(0)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <ChevronDown className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropDownOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
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
        content={<LedgerDetails closeModal={closeLedgerDetailsModal} t={t} />}
      />
    </div>
  );
};

export default TransactionHeader;