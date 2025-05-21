import React, { useRef, useState } from "react";
import { EllipsisVertical, ChevronUp } from "lucide-react";
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
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);
  const SIDEBAR_WIDTH = "196px";
  const ledgerIdRef = useRef<any>(null);

  const toggleDropdown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
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
      <ReferenceNumber
        formState={formState}
        dispatch={dispatch}
        handleLoadByRefNo={handleLoadByRefNo}
        ref={refNoRef}
        t={t}
      />
      <ReferenceDate dispatch={dispatch} formState={formState} t={t} />
      <TransactionDate formState={formState} dispatch={dispatch} t={t} />
      <div className="relative w-auto">
        <button onClick={toggleDropdown} className="text-white font-bold p-2 rounded-lg w-auto inline-flex justify-between items-center shadow-md mb-1">
          <div className="flex items-center space-x-2">
            <EllipsisVertical size={16} className="text-black" />
          </div>
        </button>

        <div
          ref={dropdownRef}
          className={`bg-white rounded-xl shadow-md overflow-hidden absolute right-0 z-40 w-full
            transition-all duration-500 ease-in-out
            ${isDropDownOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          style={{
            marginLeft: 0,
            width: `calc(96vw - ${SIDEBAR_WIDTH})`,
            maxWidth: "calc(100vw - 220px)",
          }}
        >
          <div ref={contentRef} className="p-6 transition-opacity duration-500 ease-in-out">
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
                />
              </div>
              {isModalOpen && (
                <ERPModal
                  isOpen={isModalOpen}
                  title={t("grn_number")}
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
                    className="min-w-[180px]"
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
                  className="text-left"
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
                  className="min-w-[180px]"
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

            </div>

            <div className="flex items-end gap-4 border border-dashed border-gray-400 p-2 rounded-md inline-flex">
              {formState.formElements.cbCurrency?.visible && (
                <ERPDataCombobox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  enableClearOption={false}
                  id="currencyId"
                  className="min-w-[180px]"
                  label={t(formState.formElements.cbCurrency.label)}
                  data={formState.transaction.master}
                  onSelectItem={(e) => {
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: {
                          currencyId: e.value,
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
                className="min-w-[180px]"
                disabled={
                  formState.formElements.exchangeRate?.disabled ||
                  formState.formElements.pnlMasters?.disabled
                }
              />
              <ERPButton title={t("set")} variant="secondary" />
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
  );
};

export default TransactionHeader;
