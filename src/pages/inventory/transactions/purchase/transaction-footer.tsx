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
import GrandTotalLabel from "./components/GrandTotalLabel";
import NetTotalLabel from "./components/NetTotalLabel";
import { useEffect, useRef, useState } from "react";
import { ChevronUp, X } from "lucide-react";
import BottomSidebar from "../../../../components/ERPComponents/bottom-sidebar";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { formStateHandleFieldChange } from "./reducer";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

interface TransactionFooterProps {
  formState: any;
  dispatch: any;
  t: any;
  handleKeyDown: any;
  handleFieldKeyDown: any;
  focusDiscount: any;
  focusAmount: any;
  goToPreviousPage: any;
  save: any;
  selectAttachment: any;
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
}) => {
  const [isDropUpOpen, setIsDropUpOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isOpentwo, setIsOpentwo] = useState(false);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const { getFormattedValue, getAmountInWords } = useNumberFormat();

  const toggleDropup = () => {
    setIsDropUpOpen(!isDropUpOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const taxData = [
    { label: "SGST", value: 0 },
    { label: "CGST", value: 0 },
    { label: "IGST", value: 0 },
    { label: "CESS", value: 0 },
    { label: "AddCESS", value: 0 },
  ];

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
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  };

  return (
    <div
      className="z-10 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width lg:px-3 py-2 md:px-2"
      style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }}
    >
      <div className="relative w-full">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
          <button
            onClick={toggleDropup}
            className={`flex items-center justify-center bg-[#f8f8ff] rounded-t-lg border border-b-0 border-gray-300 transition-all duration-300 ${isDropUpOpen ? "bg-gray-100" : ""
              }`}
            style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <ChevronUp
              className={`mx-2 transition-transform duration-500 ${isDropUpOpen
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

      {/* Dropdown content */}
      <div
        className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropUpOpen ? "max-h-[50vh] mb-6" : "max-h-0"
          }`}
      >
        <div className="p-4 md:p-2 bg-white border border-gray-300 rounded-t-lg shadow-lg">
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
              <RemarksInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
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
                />
              )}
              <AutoCalculationCheckbox
                formState={formState}
                dispatch={dispatch}
                t={t}
              />
              <IsLockedCheckbox
                formState={formState}
                dispatch={dispatch}
                t={t}
              />
            </div>
            <div className="w-full">
              <ERPButton
                title={t("grn_print")}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-end gap-1">
          <div className="flex items-center gap-1">
            <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
              <button className="text-blue-600">
                <span className="hover:underline text-[#0ea5e9] capitalize" onClick={selectAttachment}>
                  {t("attachment")}
                </span>
              </button>
              <CashPaidSection
                formState={formState}
                dispatch={dispatch}
                t={t}
                focusDiscount={focusDiscount}
                focusAmount={focusAmount}
              />
            </div>

            <div className="flex flex-col xl:flex-row items-end gap-1">
              <RoundOffInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
                focusDiscount={() => {
                  document.getElementById("discountID")?.focus();
                }}
                focusAmount={() => {
                  document.getElementById("amountID")?.focus();
                }}
              />

              <BillDiscountInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        <div className="flex items-end gap-4">
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

            <GrandTotalLabel formState={formState} dispatch={dispatch} t={t} />

            <NetTotalLabel formState={formState} dispatch={dispatch} t={t} />

            <div>
              <div className="flex items-center justify-between">
                <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                <span>{formState.transaction.master.grandTotalFc}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block mr-2">
              <h6 className="font-semibold whitespace-nowrap text-[20px] ">
                {" "}
                <span className="!font-medium !text-gray-600">{t("total")}:{" "}</span>
                {getFormattedValue(
                  formState.transaction.master?.roundAmount ?? 0
                )}
              </h6>
            </div>
            <div className="flex items-center gap-2">
              <ERPButton
                title={t("close")}
                onClick={() => goToPreviousPage()}
                localInputBox={formState?.userConfig?.inputBoxStyle}
              />

              <ERPButton
                localInputBox={formState?.userConfig?.inputBoxStyle}
                ref={btnSaveRef}
                title={t("save")}
                jumpTarget="save"
                variant="primary"
                onClick={save}
                className="w-24"
                disabled={
                  formState.formElements.pnlMasters?.disabled ||
                  formState.transaction.details == null ||
                  formState.transaction.details.length == 0
                }
              />
            </div>
          </div>
        </div>
      </div>

      <BottomSidebar
        isOpen={isOpentwo}
        setIsOpen={setIsOpentwo}
        minHeight={200}
        maxHeight={600}
        initialHeight={400}
      >
        <div>
          <div style={sidebarHeaderStyle}>
            <button
              style={closeButtonStyle}
              onClick={() => setIsOpentwo(false)}
            >
              <X />
            </button>
          </div>
        </div>
      </BottomSidebar>
    </div>
  );
};

export default TransactionFooter;
