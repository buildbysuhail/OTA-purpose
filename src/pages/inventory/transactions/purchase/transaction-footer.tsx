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
import { Check, ChevronUp, Eye, Paperclip, X, Repeat } from "lucide-react";
import BottomSidebar from "../../../../components/ERPComponents/bottom-sidebar";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPTextarea from "../../../../components/ERPComponents/erp-textarea";
import { formStateHandleFieldChange } from "./reducer";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { TransactionFormState } from "./transaction-types";

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
  footerLayout: 'horizontal' | 'vertical';
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
  footerLayout
}) => {
  const [showFirstFooter, setShowFirstFooter] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isOpentwo, setIsOpentwo] = useState(false);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const { getFormattedValue, getAmountInWords } = useNumberFormat();
  const dropUpRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropUpOpen &&
        dropUpRef.current &&
        !dropUpRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        toggleDropup(); // Use prop handler to close dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropUpOpen, toggleDropup]);

  // const toggleDropup = () => {
  //   setIsDropUpOpen(!isDropUpOpen);
  // };

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

  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);

  const renderFirstFooter = () => (
    <div className={`flex ${footerLayout === 'vertical' ? 'flex-col' : 'flex-row'} items-end justify-between`}>
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <RemarksInput
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-end gap-1">
          <div className="flex items-center gap-1">
            <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
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
      </div>

      <div className="flex items-end gap-4">
        <div className="p-2 bg-gray-50 w-[400px]">
          <div className="flex flex-col gap-1.5">
            <NetAmountInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              showFirstFooter={showFirstFooter}
            />
            <VatAmountLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              taxData={taxData}
              showFirstFooter={showFirstFooter}
            />
            <GrandTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            <NetTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            {formState.formElements.grandTotalFc.visible && (
              <div>
                <div className="flex items-center justify-between">
                  <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                  <span>{formState.transaction.master.grandTotalFc}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center border-t-2 border-[#3b82f6] mt-1">
              <span className="text-sm font-bold text-gray-900 uppercase">Grand Total</span>
              <span className="text-lg font-bold text-[#3b82f6]">{getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}</span>
            </div>
          </div>
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
  );

  const renderSecondFooter = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_400px]">
        <div className="p-2 flex flex-col items-end justify-end">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex flex-col">
              <CashPaidSection
                formState={formState}
                dispatch={dispatch}
                t={t}
                focusDiscount={focusDiscount}
                focusAmount={focusAmount}
              />
            </div>
            <div className="flex flex-col">
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
            </div>
            <div className="flex flex-col">
              <BillDiscountInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="w-[345px]">
            <div className="flex flex-col">
              {/* <RemarksInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
              /> */}
              <ERPTextarea
                id="remarks"
                required={true}
                label={t(formState.formElements.remarks.label)}
                value={formState.transaction.master.remarks}
              />
            </div>
          </div>
        </div>

        <div className="p-2 bg-gray-50 border-l border-gray-200">
          <div className="flex flex-col gap-1.5">
            <NetAmountInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              showFirstFooter={showFirstFooter}
            />
            <VatAmountLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              taxData={taxData}
              showFirstFooter={showFirstFooter}
            />
            <GrandTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            <NetTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            {formState.formElements.grandTotalFc.visible && (
              <div>
                <div className="flex items-center justify-between">
                  <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                  <span>{formState.transaction.master.grandTotalFc}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center border-t-2 border-[#3b82f6] mt-1">
              <span className="text-sm font-bold text-gray-900 uppercase">Grand Total</span>
              <span className="text-lg font-bold text-[#3b82f6]">{getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 bg-gray-100 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full"></div>
          <span className="text-xs text-[#16a34a] font-medium">Ready to save</span>
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-md text-xs font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-md text-xs font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3b82f6] text-white rounded-md text-xs font-semibold hover:bg-[#2563eb] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3b82f6]/30 transition-all duration-200"
          >
            <Check className="w-3.5 h-3.5" />
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );

  const renderThirdFooter = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_400px]">
        <div className="p-2 flex flex-col items-left justify-end">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex flex-col">
              <CashPaidSection
                formState={formState}
                dispatch={dispatch}
                t={t}
                focusDiscount={focusDiscount}
                focusAmount={focusAmount}
              />
            </div>
            <div className="flex flex-col">
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
            </div>
            <div className="flex flex-col">
              <BillDiscountInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="w-[345px]">
            <div className="flex flex-col">
              <RemarksInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        <div className="p-2 bg-gray-50">
          <div className="flex flex-col gap-1.5">
            <NetAmountInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              showFirstFooter={showFirstFooter}
            />
            <VatAmountLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              taxData={taxData}
              showFirstFooter={showFirstFooter}
            />
            <GrandTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            <NetTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            {formState.formElements.grandTotalFc.visible && (
              <div>
                <div className="flex items-center justify-between">
                  <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                  <span>{formState.transaction.master.grandTotalFc}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center border-t-2 border-[#3b82f6] mt-1">
              <span className="text-sm font-bold text-gray-900 uppercase">Grand Total</span>
              <span className="text-lg font-bold text-[#3b82f6]">{getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 bg-gray-100 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full"></div>
          <span className="text-xs text-[#16a34a] font-medium">Ready to save</span>
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-md text-xs font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-md text-xs font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3b82f6] text-white rounded-md text-xs font-semibold hover:bg-[#2563eb] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3b82f6]/30 transition-all duration-200"
          >
            <Check className="w-3.5 h-3.5" />
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );

  const renderFourthFooter = () => (
    <div className="flex items-end justify-end">
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <RemarksInput
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-end gap-1">
          <div className="flex items-center gap-1">
            <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
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
      </div>

      <div className="flex items-end gap-4">
        <div className="p-2 bg-gray-50 w-[400px]">
          <div className="flex flex-col gap-1.5">
            <NetAmountInput
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              showFirstFooter={showFirstFooter}
            />
            <VatAmountLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              taxData={taxData}
              showFirstFooter={showFirstFooter}
            />
            <GrandTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            <NetTotalLabel
              formState={formState}
              dispatch={dispatch}
              t={t}
              showFirstFooter={showFirstFooter}
            />
            {formState.formElements.grandTotalFc.visible && (
              <div>
                <div className="flex items-center justify-between">
                  <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                  <span>{formState.transaction.master.grandTotalFc}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center border-t-2 border-[#3b82f6] mt-1">
              <span className="text-sm font-bold text-gray-900 uppercase">Grand Total</span>
              <span className="text-lg font-bold text-[#3b82f6]">{getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}</span>
            </div>
          </div>
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
  );

  const renderFifthFooter = () => (
    <div className="flex items-end justify-between">
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <RemarksInput
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-end gap-1">
          <div className="flex items-center gap-1">
            <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
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
      </div>

      <div className="flex items-end gap-4">
        <div className="grid grid-cols-1 gap-1 w-96">
          <NetAmountInput
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            showFirstFooter={showFirstFooter}
          />

          <VatAmountLabel
            formState={formState}
            dispatch={dispatch}
            t={t}
            taxData={taxData}
            showFirstFooter={showFirstFooter}
          />

          <GrandTotalLabel
            formState={formState}
            dispatch={dispatch}
            t={t}
            showFirstFooter={showFirstFooter}
          />

          <NetTotalLabel
            formState={formState}
            dispatch={dispatch}
            t={t}
            showFirstFooter={showFirstFooter}
          />

          {formState.formElements.grandTotalFc.visible && (
            <div>
              <div className="flex items-center justify-between">
                <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                <span>{formState.transaction.master.grandTotalFc}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="hidden md:block mr-2">
            <h6 className="font-semibold whitespace-nowrap text-[20px] ">
              {" "}
              <span className="!font-medium !text-gray-600">
                {t("total")}:{" "}
              </span>
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
  );
  const renderSixthFooter = () => (
    <div className="flex items-end justify-between">
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <RemarksInput
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-end gap-1">
          <div className="flex items-center gap-1">
            <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
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
      </div>

      <div className="flex items-end gap-4">
        <div className="grid grid-cols-1 gap-1 w-96">
          <NetAmountInput
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            showFirstFooter={showFirstFooter}
          />

          <VatAmountLabel
            formState={formState}
            dispatch={dispatch}
            t={t}
            taxData={taxData}
            showFirstFooter={showFirstFooter}
          />

          <GrandTotalLabel
            formState={formState}
            dispatch={dispatch}
            t={t}
            showFirstFooter={showFirstFooter}
          />

          <NetTotalLabel
            formState={formState}
            dispatch={dispatch}
            t={t}
            showFirstFooter={showFirstFooter}
          />

          {formState.formElements.grandTotalFc.visible && (
            <div>
              <div className="flex items-center justify-between">
                <span>{t(formState.formElements.grandTotalFc.label)}:</span>
                <span>{formState.transaction.master.grandTotalFc}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          {/* Total section on the left */}
          <div className="hidden md:block">
            <h6 className="font-semibold whitespace-nowrap text-[20px]">
              <span className="!font-medium !text-gray-600">
                {t("total")}:{" "}
              </span>
              {getFormattedValue(
                formState.transaction.master?.roundAmount ?? 0
              )}
            </h6>
          </div>

          {/* Buttons section on the right */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => goToPreviousPage()}
              title={t("close")}
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#f87171] bg-[#fef2f2] hover:bg-[#fee2e2] hover:border-[#ef4444] transition-all duration-200 text-[#dc2626] hover:text-[#b91c1c] shadow-sm hover:shadow-md"
            >
              <X size={20} />
            </button>

            <button
              title={t("save")}
              disabled={formState.transactionLoading}
              onClick={save}
              ref={btnSaveRef}
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#4ade80] bg-[#f0fdf4] hover:bg-[#dcfce7] hover:border-[#22c55e] transition-all duration-200 text-[#16a34a] hover:text-[#15803d] shadow-sm hover:shadow-md"
            >
              <Check size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isDropUpOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={toggleDropup} />
      )}

      {!deviceInfo?.isMobile && (
        <div className="z-40 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width lg:px-3 py-2 md:px-2"
          style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
          <button
            onClick={() => setShowFirstFooter(!showFirstFooter)}
            className="absolute bottom-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-30"
          >
            <Repeat size={20} />
          </button>
          <div className="relative w-full">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[-22px]">
              <button onClick={toggleDropup}
                className={`flex items-center justify-center bg-[#f8f8ff] rounded-t-full border border-l-0 border-r-0 border-b-0 border-gray-300 transition-all duration-300 ${isDropUpOpen ? "bg-gray-100" : ""}`}
                style={{ boxShadow: "0 -2px 2px rgba(0, 0, 0, 0.1)" }}>
                <ChevronUp className={`mx-2 transition-transform duration-500 ${isDropUpOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
              </button>
            </div>
          </div>

          {/* Dropdown content */}
          <div ref={dropUpRef} className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropUpOpen ? "max-h-[50vh] mb-6" : "max-h-0"}`}>
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

                <button className="text-[#2563eb]">
                  <span className="hover:underline text-[#0ea5e9] capitalize" onClick={selectAttachment}>
                    {t("attachment")}
                  </span>
                </button>

                <div className="w-full">
                  <ERPButton
                    title={t("grn_print")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {
            formState.transaction.master.billDiscount == 1 ? renderFirstFooter()
              : formState.transaction.master.billDiscount == 2 ? renderSecondFooter()
                : formState.transaction.master.billDiscount == 3 ? renderThirdFooter()
                  : formState.transaction.master.billDiscount == 4 ? renderFourthFooter()
                    : formState.transaction.master.billDiscount == 5 ? renderFifthFooter()
                      : formState.transaction.master.billDiscount == 6 ? renderSixthFooter()
                        : renderSixthFooter()}

          <BottomSidebar
            isOpen={isOpentwo}
            setIsOpen={setIsOpentwo}
            minHeight={200}
            maxHeight={600}
            initialHeight={400}
          >
            <div>
              <div style={sidebarHeaderStyle}>
                <button style={closeButtonStyle} onClick={() => setIsOpentwo(false)}>
                  <X />
                </button>
              </div>
            </div>
          </BottomSidebar>
        </div>
      )}

      {deviceInfo?.isMobile && (
        <div className="z-40 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width lg:px-3 py-2 md:px-2 me-[14px] mb-[39px]"
          style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
          <div className="relative w-full">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
              <button
                onClick={toggleDropup}
                className={`flex items-center justify-center bg-[#f8f8ff] rounded-t-lg border border-b-0 border-gray-300 transition-all duration-300 ${isDropUpOpen ? "bg-gray-100" : ""}`}
                style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)" }}>
                <ChevronUp className={`mx-2 transition-transform duration-500 ${isDropUpOpen ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
              </button>
            </div>
          </div>

          {/* Dropdown content */}
          <div ref={dropUpRef}
            className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isDropUpOpen ? "max-h-[30vh] overflow-y-auto overflow-x-hidden mb-6" : "max-h-0 overflow-hidden"}`}
            style={{
              width: "100%", // Ensures the dropdown fits the mobile width
              boxSizing: "border-box", // Prevents horizontal overflow
            }}
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

                <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
                  <button className="text-[#2563eb]">
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
                    disabled={formState.transactionLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex items-end gap-1 ps-[15px]">
              {/* <div className="flex items-center gap-1"> */}
              <div className="grid grid-cols-1 gap-1">
                {/* <div className="flex flex-col xl:flex-row items-start xl:items-end gap-1">
                  <button className="text-blue-600">
                    <span
                      className="hover:underline text-[#0ea5e9] capitalize"
                      onClick={selectAttachment}
                    >
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
                </div> */}

                {/* <div className="flex flex-col xl:flex-row items-end gap-1">
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
                </div> */}

                <NetAmountInput
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  showFirstFooter={showFirstFooter}
                />

                <VatAmountLabel
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  taxData={taxData}
                  showFirstFooter={showFirstFooter}
                />

                <GrandTotalLabel
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  showFirstFooter={showFirstFooter}
                />
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="grid grid-cols-1 gap-1">
                {/* <NetAmountInput
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

                <GrandTotalLabel
                  formState={formState}
                  dispatch={dispatch}
                  t={t} /> */}

                <NetTotalLabel
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  showFirstFooter={showFirstFooter}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span>{t(formState.formElements.grandTotalFc.label)}</span>
                    <span>:{formState.transaction.master.grandTotalFc}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:block mr-2">
                  <h6 className="font-semibold whitespace-nowrap text-[20px] ">
                    {" "}
                    <span className="!font-medium !text-gray-600">
                      {t("total")}:{" "}
                    </span>
                    {getFormattedValue(
                      formState.transaction.master?.roundAmount ?? 0
                    )}
                  </h6>
                </div>

                <div className="  fixed bottom-0 left-0 w-full bg-white flex  p-0 z-10">
                  <ERPButton
                    title={t("close")}
                    onClick={() => goToPreviousPage()}
                    className="flex-1 rounded-none !m-0"
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                  />

                  <ERPButton
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    ref={btnSaveRef}
                    title={t("save")}
                    jumpTarget="save"
                    variant="primary"
                    className="flex-1 rounded-none !m-0"
                    onClick={save}
                    // className="w-24"
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

          <BottomSidebar
            isOpen={isOpentwo}
            setIsOpen={setIsOpentwo}
            minHeight={200}
            maxHeight={600}
            initialHeight={400}
          >
            <div>
              <div style={sidebarHeaderStyle}>
                <button style={closeButtonStyle} onClick={() => setIsOpentwo(false)}>
                  <X />
                </button>
              </div>
            </div>
          </BottomSidebar>
        </div>
      )}
    </>
  );
};

export default TransactionFooter;
