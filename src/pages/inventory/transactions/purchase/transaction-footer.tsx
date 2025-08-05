import WarehouseID from "./components/warehouse-id ";
import RemarksInput from "./components/RemarksInput.";
import IsLockedCheckbox from "./components/IsLockedCheckbox";
import AutoCalculationCheckbox from "./components/AutoCalculationCheckbox";
import CashPaidSection from "./components/CashPaidSection";
import PriceCategoryCombobox from "./components/PriceCategoryCombobox";
import CostCentreCombobox from "./components/CostCentreCombobox";
import SupplyTypeCombobox from "./components/SupplyTypeCombobox";
import VatAmountLabel from "./components/VatAmountLabel";
import AdjustmentAmountInput from "./components/AdjustmentAmountInput";
import RoundOffInput from "./components/RoundOffInput";
import NetAmountInput from "./components/NetAmountInput";
import BillDiscountInput from "./components/BillDiscountInput";
import BillDiscountLabel from "./components/bill-discount-label";
import NetTotalLabel from "./components/NetTotalLabel";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronUp, X, EllipsisVertical } from "lucide-react";
import BottomSidebar from "../../../../components/ERPComponents/bottom-sidebar";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPTextarea from "../../../../components/ERPComponents/erp-textarea";
import { formStateHandleFieldChange, formStateHandleFieldChangeKeysOnly, formStateTransactionMasterHandleFieldChange } from "./reducer";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { TransactionFormState } from "./transaction-types";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import { accFormStateTransactionMasterHandleFieldChange } from "../../../accounts/transactions/reducer";
import { remToPx } from "../../../../utilities/Utils";

interface TransactionFooterProps {
  formState: TransactionFormState;
  dispatch: any;
  t: any;
  handleKeyDown: any;
  handleFieldKeyDown: any;
  focusDiscount: any;
  focusAmount: any;
  goToPreviousPage: any;
  save: any;
  selectAttachment: any;
  isDropUpOpen: boolean;
  toggleDropup: () => void;
  footerLayout: "horizontal" | "vertical";
  applyDiscountsToItems: any;
  calculateTotal: any
}

const TransactionFooter: React.FC<TransactionFooterProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
  handleFieldKeyDown,
  focusDiscount,
  focusAmount,
  goToPreviousPage,
  save,
  selectAttachment,
  isDropUpOpen,
  toggleDropup,
  footerLayout,
  calculateTotal,
  applyDiscountsToItems,
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isOpentwo, setIsOpentwo] = useState(false);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const { getFormattedValue } = useNumberFormat();
  const dropUpRef = useRef<HTMLDivElement | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSmallHeight, setIsSmallHeight] = useState(false);
  const { appState } = useAppState();
  const isRtl = appState.locale.rtl;
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropUpOpen &&
        dropUpRef.current &&
        !dropUpRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button") &&
        !document.querySelector(".combobox-dropdown")?.contains(event.target as Node) &&
        !document.querySelector(".combobox-dropdown-modal")?.contains(event.target as Node) &&
        !document.querySelector(".MuiAutocomplete-popper")?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".combobox-dropdown") &&
        !(event.target as HTMLElement).closest(".MuiAutocomplete-popper")
      ) {
        toggleDropup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropUpOpen, toggleDropup]);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSmallHeight(window.innerHeight <= 650);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    
    calculateTotal(formState.transaction.master, formState.summary, formState.formElements, {result:{}, formStateHandleFieldChangeKeysOnly: formStateHandleFieldChangeKeysOnly})
  }, [formState.transaction.master.billDiscount, formState.transaction.master.hasroundOff, formState.transaction.master.adjustmentAmount]);
  const taxData = [
    { label: "SGST", value: 0 },
    { label: "CGST", value: 0 },
    { label: "IGST", value: 0 },
    { label: "CESS", value: 0 },
    { label: "AddCESS", value: 0 },
  ];

  const sidebarHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    marginBottom: "3px",
  };

  const closeButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  };

  const renderSecondFooter = () => (
    <div
      className={`dark:bg-dark-bg ${footerLayout === "vertical" ? "flex flex-col justify-between h-full" : ""}`}
      style={{ backgroundColor: formState.userConfig?.footerBg ? `rgb(${formState.userConfig.footerBg})` : undefined, }}>
      <div className={`${footerLayout === "vertical" ? "relative block" : "hidden"}`}>
        <div className="flex justify-end">
          <button ref={buttonRef} onClick={() => setIsPopupVisible((prev) => !prev)} className="flex items-end justify-end dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {isPopupVisible && (
          <div
            ref={popupRef}
            className="absolute rounded-sm dark:bg-dark-bg-card dark:text-dark-text bg-gray-100 shadow-lg p-4 z-50"
            style={{ top: "100%", right: "0", width: "251px", marginTop: "8px", }}>
            <nav className="w-full dark:bg-dark-bg-card dark:text-dark-text bg-gray-100 text-black">
              <ul className="space-y-1">
                <li>
                  {formState.formElements.printOnSave.visible && (
                    <ERPCheckbox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="printOnSave"
                      label={t(formState.formElements.printOnSave.label)}
                      checked={formState.printOnSave}
                      onChange={(e) =>
                        dispatch(
                          formStateHandleFieldChange({
                            fields: { printOnSave: e.target.checked },
                          })
                        )
                      }
                      disabled={formState.formElements.printOnSave?.disabled}
                    />
                  )}
                </li>
                <li>
                  <AutoCalculationCheckbox
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                  />
                </li>
                <li>
                  <IsLockedCheckbox
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                  />
                </li>
                <li>
                  <button className="text-[#2563eb]">
                    <span className="hover:underline text-[#0ea5e9] capitalize" onClick={selectAttachment}>
                      {t("attachment")}
                    </span>
                  </button>
                </li>
                <li>
                  <ERPButton
                    title={t("grn_print")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                  />
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <div className={`dark:bg-dark-bg-card ${footerLayout === "vertical" ? "" : "bg-white rounded-xl shadow-lg border dark:border-dark-border border-gray-200 overflow-hidden"}`}>
        <div className={`${footerLayout === "vertical" && !isSmallHeight ? "block" : "hidden"}`}>
          <div className="mb-2">
            <div className={`grid ${footerLayout === "vertical" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 items-end"}`}>
              <div className="w-full">
                <WarehouseID
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
              <div className="w-full">
                <PriceCategoryCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
              <div className="w-full">
                <CostCentreCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
              <div className="w-full">
                <SupplyTypeCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
              <div className="w-full">
                <AdjustmentAmountInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`grid ${footerLayout === "vertical" ? "grid-cols-1 gap-1" : "grid-cols-1 md:grid-cols-[1fr_400px]"}`}>
          <div className={`flex ${footerLayout === "vertical" ? "flex-col items-start justify-start" : "p-2 flex-col items-end justify-end"}`}>
            <div className={`flex ${footerLayout === "vertical" ? "flex-col items-start" : "items-end"} gap-2 mb-2`}>
              <div className={`flex items-center w-full ${footerLayout === "vertical" ? "justify-between" : "gap-2"}`}>
                <CashPaidSection
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  focusDiscount={focusDiscount}
                  focusAmount={focusAmount}
                />
                <RoundOffInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  focusDiscount={() => document.getElementById("discountID")?.focus()}
                  focusAmount={() => document.getElementById("amountID")?.focus()}
                />
              </div>
              <div className="flex flex-col">
                <BillDiscountInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  footerLayout={footerLayout}
                  applyDiscountsToItems={applyDiscountsToItems}
                />
              </div>
            </div>

            <div className={`${footerLayout === "vertical" ? "w-[265px]" : "w-[345px]"}`}>
              <div className="flex flex-col">
                <ERPTextarea
                  id="remarks"
                  required={true}
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  label={t(formState.formElements.remarks.label)}
                  value={formState.transaction.master.remarks}
                  onChange={(e) =>
                    dispatch(
                      formStateTransactionMasterHandleFieldChange({
                        fields: { remarks: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.remarks?.disabled ||
                    formState.formElements.pnlMasters?.disabled
                  }
                  className="dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
                />
              </div>
            </div>
          </div>

          <div className="p-2 dark:bg-dark-bg-card bg-gray-50 border-l dark:border-dark-border border-gray-200">
            <div className="flex flex-col gap-1.5">
              <NetAmountInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
              />
              <VatAmountLabel
                formState={formState}
                dispatch={dispatch}
                t={t}
                taxData={taxData}
              />
              <BillDiscountLabel
                formState={formState}
                dispatch={dispatch}
                t={t}
              />
              {/* <NetTotalLabel formState={formState} dispatch={dispatch} t={t} /> */}
              {formState.formElements.grandTotalFc.visible && (
                <div>
                  <div className="flex items-center justify-between dark:text-dark-text">
                    <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                    <span>{formState.transaction.master.grandTotalFc}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center border-t-2 border-[#3b82f6] mt-1">
                <span className="text-sm font-bold dark:text-dark-text text-gray-900 uppercase">
                  {t(formState.formElements.grandTotal.label)}
                </span>
                <span className="text-lg font-bold text-[#3b82f6]">
                  {getFormattedValue(
                    formState.transaction.master?.grandTotal ?? 0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-2 dark:bg-dark-bg-card bg-gray-100 border-t dark:border-dark-border border-gray-200 flex ${footerLayout === "vertical" ? "flex-col" : "flex-col md:flex-row justify-end items-center gap-4"}`}>
          <div className="flex justify-end gap-2">
            <ERPButton
              variant="primary"
              ref={btnSaveRef}
              jumpTarget="save"
              onClick={save}
              title={t("save_transaction")}
              startIcon={<Check className="w-3.5 h-3.5" />}
              localInputBox={formState?.userConfig?.inputBoxStyle}
              disabled={
                formState.formElements.pnlMasters?.disabled ||
                formState.transaction.details == null ||
                formState.transaction.details.length == 0
              }
              className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
            />
            <ERPButton
              title={t("cancel")}
              variant="secondary"
              onClick={() => goToPreviousPage()}
              localInputBox={formState?.userConfig?.inputBoxStyle}
              startIcon={<X className="w-3.5 h-3.5" />}
              className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const dropdownContent = (
    <div className="p-4 md:p-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border border-gray-300 rounded-t-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 items-end">
        <div className="w-full">
          <WarehouseID
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
        </div>
        <div className="w-full">
          <PriceCategoryCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
        </div>
        <div className="w-full">
          <CostCentreCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
        </div>
        <div className="w-full">
          <SupplyTypeCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
        </div>
        <div className="w-full">
          <AdjustmentAmountInput
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-center justify-between w-full">
          {formState.formElements.printOnSave.visible && (
            <ERPCheckbox
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="printOnSave"
              label={t(formState.formElements.printOnSave.label)}
              checked={formState.printOnSave}
              onChange={(e) =>
                dispatch(
                  formStateHandleFieldChange({
                    fields: { printOnSave: e.target.checked },
                  })
                )
              }
              disabled={formState.formElements.printOnSave?.disabled}
              className="dark:text-dark-text"
            />
          )}
          <AutoCalculationCheckbox
            formState={formState}
            dispatch={dispatch}
            t={t}
          />
          <IsLockedCheckbox formState={formState} dispatch={dispatch} t={t} />
        </div>
        <button className="text-[#2563eb] dark:text-[#60a5fa]">
          <span className="hover:underline text-[#0ea5e9] dark:text-[#60a5fa] capitalize" onClick={selectAttachment}>
            {t("attachment")}
          </span>
        </button>
        <div className="w-full">
          <ERPButton
            title={t("grn_print")}
            variant="secondary"
            disabled={formState.transactionLoading}
            className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
        </div>
      </div>
    </div>
  );

  const selectedFooter = renderSecondFooter();
    const getInputHeight =() =>{
      return formState.userConfig?.inputBoxStyle?.inputSize == "sm" ? remToPx (0) : formState.userConfig?.inputBoxStyle?.inputSize == "md" ? remToPx (0.75): formState.userConfig?.inputBoxStyle?.inputSize == "lg" ?  remToPx (1.375) : formState.userConfig?.inputBoxStyle?.inputSize == "customize" ? (remToPx (formState.userConfig?.inputBoxStyle?.inputHeight)??0) -23:0
    }

  if (formState.userConfig?.footerPosition === "right") {
    return (
      <div
        className={`fixed  ${isRtl ? "left-0" : "right-0"} h-[-webkit-fill-available] overflow-y-scroll w-[300px] shadow-lg p-2 z-30`}
        style={{ top: `${170 + (getInputHeight())}px`, backgroundColor: formState.userConfig?.footerBg ? `rgb(${formState.userConfig.footerBg})` : '#f8f8ff', }}>
        {renderSecondFooter()}
      </div>
    );
  } else {
    return (
      <>
        {isDropUpOpen && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-30" onClick={toggleDropup} />
        )}
        {!deviceInfo?.isMobile && (
          <div className={`fixed dark:bg-dark-bg ${footerLayout === "vertical" ? `top-[170px] ${isRtl ? "left-0" : "right-0"} h-[-webkit-fill-available] w-[300px] overflow-y-auto p-2 z-20 bg-white border-l dark:border-dark-border border-l-slate-200` : "z-40 bottom-0 shadow-lg full-available-width lg:px-3 py-2 md:px-2 dark:bg-dark-bg bg-[#f8f8ff]"}`}>
            <div className={`${footerLayout === "vertical" ? "hidden" : "block"}`}>
              <div className="relative w-full">
                <div className="absolute left-1/2 transform -translate-x-1/2 top-[-22px]">
                  <button onClick={toggleDropup} className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-[#f8f8ff] rounded-t-full border border-l-0 border-r-0 border-b-0 border-gray-300 transition-all duration-300 ${isDropUpOpen ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`} style={{ boxShadow: "0 -2px 2px rgba(0, 0, 0, 0. gas1)" }}>
                    <ChevronUp className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropUpOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
                  </button>
                </div>
              </div>
              <div ref={dropUpRef} className={`w-full transition-all duration-500 ease-in-out overflow-y-auto ${isDropUpOpen ? "max-h-[50vh] mb-6" : "max-h-0"}`}>
                {dropdownContent}
              </div>
            </div>
            {selectedFooter}
            {setIsOpentwo &&
            <BottomSidebar
              isOpen={isOpentwo}
              setIsOpen={setIsOpentwo}
              minHeight={200}
              maxHeight={600}
              initialHeight={400}>
              <div>
                <div style={sidebarHeaderStyle}>
                  <button style={{ ...closeButtonStyle, color: "var(--dark-text, #374151)", borderColor: "var(--dark-border, #e5e7eb)", }} onClick={() => setIsOpentwo(false)}>
                    <X />
                  </button>
                </div>
              </div>
            </BottomSidebar>
  }
          </div>
        )}
        {deviceInfo?.isMobile && (
          <div className="z-40 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width lg:px-3 py-2 md:px-2 me-[14px] mb-[39px]"
            style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)", }}>
            <div className="relative w-full">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
                <button
                  onClick={toggleDropup}
                  className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-[#f8f8ff] rounded-t-lg border border-b-0 border-gray-300 transition-all duration-300 ${isDropUpOpen ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`}
                  style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)" }}>
                  <ChevronUp className={`mx-2 transition-transform duration-500 dark:text-dark-text ${isDropUpOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
                </button>
              </div>
            </div>
            <div
              ref={dropUpRef}
              className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropUpOpen ? "max-h-[30vh] overflow-y-auto overflow-x-hidden mb-6" : "max-h-0 overflow-hidden"}`}
              style={{ width: "100%", boxSizing: "border-box" }}>
              {dropdownContent}
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-1 ps-[15px]">
                <div className="grid grid-cols-1 gap-1">
                  <NetAmountInput
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleKeyDown={handleKeyDown}
                  />
                  <VatAmountLabel
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    taxData={taxData}
                  />
                  <BillDiscountLabel
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                  />
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="grid grid-cols-1 gap-1">
                  {/* <NetTotalLabel
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                  /> */}
                  <div>
                    <div className="flex items-center justify-between dark:text-dark-text">
                      <span>
                        {t(formState.formElements.grandTotalFc.label)}
                      </span>
                      <span>:{formState.transaction.master.grandTotalFc}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:block mr-2">
                    <h6 className="font-semibold whitespace-nowrap text-[20px] dark:text-dark-text">
                      <span className="!font-medium dark:!text-dark-text !text-gray-600">
                        {t("total")}:{" "}
                      </span>
                      {getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}
                    </h6>
                  </div>
                  <div className="fixed bottom-0 left-0 w-full dark:bg-dark-bg-card bg-white flex p-0 z-10">
                    <ERPButton
                      title={t("close")}
                      onClick={() => goToPreviousPage()}
                      className="flex-1 rounded-none !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                    />
                    <ERPButton
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      ref={btnSaveRef}
                      title={t("save")}
                      jumpTarget="save"
                      variant="primary"
                      className="flex-1 rounded-none !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                      onClick={save}
                      disabled={
                        formState.formElements.pnlMasters?.disabled ||
                        formState.transaction.details == null ||
                        formState.transaction.details.length == 0 ||
                        formState.transactionLoading
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {setIsOpentwo &&
            <BottomSidebar
              isOpen={isOpentwo}
              setIsOpen={setIsOpentwo}
              minHeight={200}
              maxHeight={600}
              initialHeight={400}>
              <div>
                <div style={sidebarHeaderStyle}>
                  <button
                    style={{ ...closeButtonStyle, color: "var(--dark-text, #374151)", borderColor: "var(--dark-border, #e5e7eb)", }}
                    onClick={() => setIsOpentwo(false)} >
                    <X />
                  </button>
                </div>
              </div>
            </BottomSidebar>
  }
          </div>
        )}
      </>
    );
  }
};

export default TransactionFooter;