import React, { useEffect, useRef, useState } from "react";
import { EllipsisVertical, ChevronDown } from "lucide-react";
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
import {
  formStateHandleFieldChange,
  formStateMasterHandleFieldChange,
} from "./reducer";
import MoreOptionsModalContent from "./transaction-more";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface TransactionHeaderProps {
  formState: any;
  dispatch: any;
  handleKeyDown: any;
  loadAndSetTransVoucher: any;
  t: any;
  handleLoadByRefNo: any;
  handleFieldChange: any;
  setIsPartyDetailsOpen: any;
  triggerEffect: boolean;
  handleFieldKeyDown: any;
  ledgerCodeRef: any;
  voucherNumberRef: any;
  refNoRef: any;
  isDropDownOpen: boolean; 
  toggleDropdown: () => void; 
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
  triggerEffect,
  handleFieldKeyDown,
  ledgerCodeRef,
  voucherNumberRef,
  refNoRef,
  isDropDownOpen, 
  toggleDropdown, 
}) => {
  // const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef(null);
  const ledgerIdRef = useRef<any>(null);

  // const toggleDropdown = () => {
  //   setIsDropDownOpen(!isDropDownOpen);
  // };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropDownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        toggleDropdown(); // Use prop handler to close dropdown
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

  return (
    <div>
    {!deviceInfo?.isMobile && (
    <div
      className={`fixed top-[110px] left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 [@media(min-width:1000px)]:ml-[240px] }`}
    >
      <div className="flex items-end gap-1 relative px-2 !pb-3">
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
        <ReferenceNumber
          formState={formState}
          dispatch={dispatch}
          handleLoadByRefNo={handleLoadByRefNo}
          ref={refNoRef}
          t={t}
        />
        <ReferenceDate dispatch={dispatch} formState={formState} t={t} />
        <TransactionDate formState={formState} dispatch={dispatch} t={t} />
      </div>

      {/* Dropdown content */}
      <div
        ref={dropdownRef}
        className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropDownOpen ? "max-h-[50vh]" : "max-h-0"
          }`}
      >
        <div className="p-4 md:p-2 bg-white border-t border-gray-300 shadow-lg">
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
                title={t("Grn_Number")}
                onClick={handleButtonClick}
                localInputBox={formState?.userConfig?.inputBoxStyle}
                className="!m-0"
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
            <div>
              {formState.formElements.chkVat?.visible && (
                <ERPCheckbox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="enableTaxNumber"
                  className="text-left"
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
                  className="min-w-[180px] !m-0"
                  // label={t(formState.formElements.cbVatAccount.label)}
                  noLabel={true}
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
                className="text-left !m-0"
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
                id="labelDesignID"
                className="min-w-[180px] !m-0"
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
                  // getListUrl: Urls.data_label_designs,
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
                title={"more"}
                variant="secondary"
                onClick={handleMoreButtonClick}
              />
            </div>

            {isMoreModalOpen && (
              <ERPModal
                isOpen={isMoreModalOpen}
                title="More Options"
                width={650}
                height={580}
                closeModal={closeMoreModal}
                content={
                  <MoreOptionsModalContent
                    formState={formState}
                    dispatch={dispatch}
                    handleFieldChange={handleFieldChange}
                    t={t}
                  />
                }
              />
            )}
          </div>
          {formState.formElements.pnlImport.visible &&
          <div className="inline-flex items-end gap-1 border border-dashed border-gray-400 p-2 rounded-md mt-2">
            {formState.formElements.cbCurrency?.visible && (
              <ERPDataCombobox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                enableClearOption={false}
                id="currencyId"
                className="min-w-[180px] !m-0"
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
                value={formState.transaction.master.currencyId}
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
              className="min-w-[180px] !m-0"
              disabled={
                formState.formElements.exchangeRate?.disabled ||
                formState.formElements.pnlMasters?.disabled
              }
            />
            <ERPButton title={t("set")} variant="secondary" className="!m-0" />
          </div>
}
        </div>
      </div>

      {/* Chevron button - moves with dropdown content */}
      <div className="relative w-full">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
          <button
            onClick={toggleDropdown}
            className={`flex items-center justify-center bg-white rounded-b-lg border border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen ? "bg-gray-100" : ""
              }`}
            style={{
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transform: isDropDownOpen ? "translateY(0)" : "translateY(0)",
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <ChevronDown
              className={`mx-2 transition-transform duration-500 ${isDropDownOpen
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
      className={`fixed top-[110px] left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 [@media(min-width:1000px)]:ml-[240px] }`}
    >
      <div className="flex items-end gap-1 relative px-2 !pb-3">
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

      {/* Dropdown content */}
      {/* <div
        ref={dropdownRef}
        className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropDownOpen ? "max-h-[50vh]" : "max-h-0"
          }`}
      > */}
      <div
          ref={dropdownRef}
          className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
            isDropDownOpen ? "max-h-[30vh] overflow-y-auto overflow-x-hidden" : "max-h-0 overflow-hidden"
          }`}
          style={{
            width: "100%", // Ensures the dropdown fits the mobile width
            boxSizing: "border-box", // Prevents horizontal overflow
          }}
        >
        <div className="p-4 md:p-2 bg-white border-t border-gray-300 shadow-lg">
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
        <ReferenceDate dispatch={dispatch} formState={formState} t={t} />
        <TransactionDate formState={formState} dispatch={dispatch} t={t} />
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
                title={t("Grn_Number")}
                onClick={handleButtonClick}
                localInputBox={formState?.userConfig?.inputBoxStyle}
                className="!m-0"
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
            <div>
              {formState.formElements.chkVat?.visible && (
                <ERPCheckbox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="enableTaxNumber"
                  className="text-left"
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
                  className="min-w-[180px] !m-0"
                  // label={t(formState.formElements.cbVatAccount.label)}
                  noLabel={true}
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
                className="text-left !m-0"
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
                id="labelDesignID"
                className="min-w-[180px] !m-0"
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
                  // getListUrl: Urls.data_label_designs,
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
                title={"more"}
                variant="secondary"
                onClick={handleMoreButtonClick}
              />
            </div>

            {isMoreModalOpen && (
              <ERPModal
                isOpen={isMoreModalOpen}
                title="More Options"
                width={650}
                height={600}
                closeModal={closeMoreModal}
                content={
                  <MoreOptionsModalContent
                    formState={formState}
                    dispatch={dispatch}
                    handleFieldChange={handleFieldChange}
                    t={t}
                  />
                }
              />
            )}
          </div>
          <div className=" items-end gap-1 border border-dashed border-gray-400 p-2 rounded-md mt-2">
            {formState.formElements.cbCurrency?.visible && (
              <ERPDataCombobox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                enableClearOption={false}
                id="currencyId"
                className="min-w-[180px] !m-0"
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
                value={formState.transaction.master.currencyId}
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
              className="min-w-[180px] !m-0"
              disabled={
                formState.formElements.exchangeRate?.disabled ||
                formState.formElements.pnlMasters?.disabled
              }
            />
            <ERPButton title={t("set")} variant="secondary" className="!m-0" />
          </div>
        </div>
      </div>

      {/* Chevron button - moves with dropdown content */}
      <div className="relative w-full">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
          <button
            onClick={toggleDropdown}
            className={`flex items-center justify-center bg-white rounded-b-lg border border-t-0 border-gray-300 transition-all duration-500 ${isDropDownOpen ? "bg-gray-100" : ""
              }`}
            style={{
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transform: isDropDownOpen ? "translateY(0)" : "translateY(0)",
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <ChevronDown
              className={`mx-2 transition-transform duration-500 ${isDropDownOpen
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
    </div>
  );
};

export default TransactionHeader;
