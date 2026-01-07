import WarehouseID from "./components/warehouse-id ";
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
import { useEffect, useRef, useState } from "react";
import { Check, ChevronUp, X, EllipsisVertical, PanelBottom, PanelRight } from "lucide-react";
import BottomSidebar from "../../../../components/ERPComponents/bottom-sidebar";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPTextarea from "../../../../components/ERPComponents/erp-textarea";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import VoucherType from "../../../../enums/voucher-types";
import React from "react";
import { TransactionFormState } from "../transaction-types";
import { formStateHandleFieldChangeKeysOnly, formStateHandleFieldChange, formStateTransactionMasterHandleFieldChange } from "../reducer";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

interface TransactionFooterProps {
  formState: TransactionFormState;
  transactionType: string;
  dispatch: any;
  t: any;
  handleKeyDown: any;
  handleFieldKeyDown: any;
  focusDiscount: any;
  focusAmount: any;
  goToPreviousPage: any;
  save: any;
  generateLPQ: any
  generateLPO: any
  selectAttachment: any;
  isDropUpOpen: boolean;
  toggleDropup: () => void;
  footerLayout: "horizontal" | "vertical";
  applyDiscountsToItems: any;
  calculateTotal: any
  applicationSettings: any;
  clientSession: any;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocity: { x: number; y: number };
  life: number;
}

interface ConfettiWrapperProps {
  children: React.ReactElement;
  onOriginalClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  triggerConfetti?: boolean;
}

// Confetti Wrapper Component
const ConfettiWrapper: React.FC<ConfettiWrapperProps> = ({ children, onOriginalClick, triggerConfetti }) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const createConfetti = (clickX: number, clickY: number) => {
    const newConfetti: Confetti[] = [];
    for (let i = 0; i < 20; i++) {
      newConfetti.push({
        id: Date.now() + i,
        x: clickX,
        y: clickY,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 250,
          y: Math.random() * -150 - 80
        },
        life: 100
      });
    }
    setConfetti(prev => [...prev, ...newConfetti]);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick handler
    if (onOriginalClick) {
      onOriginalClick(e);
    }
  };

  useEffect(() => {
    if (triggerConfetti && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;
      createConfetti(clickX, clickY);
    }
  }, [triggerConfetti]);

  useEffect(() => {
    if (confetti.length === 0) return;
    const interval = setInterval(() => {
      setConfetti(prev =>
        prev
          .map(piece => ({
            ...piece,
            x: piece.x + piece.velocity.x * 0.02,
            y: piece.y + piece.velocity.y * 0.02,
            velocity: {
              x: piece.velocity.x * 0.98,
              y: piece.velocity.y + 4
            },
            rotation: piece.rotation + 4,
            life: piece.life - 1
          }))
          .filter(piece => piece.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [confetti]);

  // Clone the child element and add our click handler
  const clonedChild = React.cloneElement(children, {
    onClick: handleClick,
    ref: buttonRef
  });

  return (
    <>
      {/* Confetti particles */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="fixed w-2 h-2 pointer-events-none z-[9999]"
          style={{
            left: piece.x,
            top: piece.y,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: piece.life / 100,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
      {clonedChild}
    </>
  );
};

const TransactionFooter: React.FC<TransactionFooterProps> = ({
  formState,
  transactionType,
  dispatch,
  t,
  handleKeyDown,
  handleFieldKeyDown,
  focusDiscount,
  focusAmount,
  goToPreviousPage,
  save,
  generateLPQ,
  generateLPO,
  selectAttachment,
  isDropUpOpen,
  toggleDropup,
  footerLayout,
  calculateTotal,
  applyDiscountsToItems,
  applicationSettings,
  clientSession,
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
  const isNewFooter = formState.userConfig?.useNewFooter ?? false;
  const isSidebar = formState.userConfig?.footerPosition === "right";
  const [showWarehouseOutside, setShowWarehouseOutside] = useState(false);
  const [showCostCentreOutside, setShowCostCentreOutside] = useState(false);
  const [showAdjustmentOutside, setShowAdjustmentOutside] = useState(false);
  const [showCheckboxesOutside, setShowCheckboxesOutside] = useState(false);
  const [showAttachmentOutside, setShowAttachmentOutside] = useState(false);
  const [dropupState, setDropupState] = useState<'closed' | 'minimal' | 'full'>('closed');
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  const remToPx = (rem: number) => rem * 16;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallDevice(width >= 320 && width <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropupState !== 'closed' &&
        dropUpRef.current &&
        !dropUpRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button") &&
        !document.querySelector(".combobox-dropdown")?.contains(event.target as Node) &&
        !document.querySelector(".combobox-dropdown-modal")?.contains(event.target as Node) &&
        !document.querySelector(".MuiAutocomplete-popper")?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".combobox-dropdown") &&
        !(event.target as HTMLElement).closest(".MuiAutocomplete-popper")
      ) {
        setDropupState('closed');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropupState]);

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
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallHeight(window.innerHeight <= 650);
      if (isSidebar) {
        setShowAttachmentOutside(width >= 1540);
        setShowCheckboxesOutside(width >= 1500);
        setShowAdjustmentOutside(width >= 1400);
        setShowCostCentreOutside(width >= 1400);
        setShowWarehouseOutside(width >= 1400);
      } else {
        setShowAttachmentOutside(width >= 1300);
        setShowCheckboxesOutside(width >= 1250);
        setShowAdjustmentOutside(width >= 1200);
        setShowCostCentreOutside(width >= 1200);
        setShowWarehouseOutside(width >= 1200);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebar]);

  useEffect(() => {
    calculateTotal(formState.transaction.master, formState.summary, formState.formElements, { result: {}, formStateHandleFieldChangeKeysOnly: formStateHandleFieldChangeKeysOnly })
  }, [formState.transaction.master.billDiscount, formState.transaction.master.hasroundOff, formState.transaction.master.adjustmentAmount]);

  let clickTimer: NodeJS.Timeout | null = null;

  const handleIconClick = () => {
    if (!isSmallDevice) {
      setDropupState(prev => prev === 'closed' ? 'full' : 'closed');
      return;
    }

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
      setDropupState('closed');
      return;
    }

    clickTimer = setTimeout(() => {
      clickTimer = null;
      if (dropupState === 'closed') {
        setDropupState('minimal');
      } else if (dropupState === 'minimal') {
        setDropupState('full');
      } else if (dropupState === 'full') {
        setDropupState('closed');
      }
    }, 250);
  };

  const generateLPOLPQ = () => {
    const master = formState.transaction.master;
    const details = formState.transaction.details;

    // Check if "Skip Zero Quantity Validation" is unchecked
    // if (!formState.chkSkipZeroQtyValidation) {
    //   for (let i = 0; i < details.length; i++) {
    //     const qty = Number(details[i].qty) || 0;

    //     if (qty === 0) {
    //       ERPAlert.show(
    //         {text:`Please set quantity in row ${i + 1}. Please correct it or remove the row.`, title:"Failed"}
    //       );
    //       return false;
    //     }
    //   }
    // }

    return true;
  };

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

  const warehouseComponent = (
    <div className="w-full max-w-none sm:max-w-[180px]">
      <WarehouseID
        formState={formState}
        dispatch={dispatch}
        t={t}
        handleKeyDown={handleKeyDown}
        handleFieldKeyDown={handleFieldKeyDown}
      />
    </div>
  );

  const costCentreComponent = (
    <div className="w-full max-w-none sm:max-w-[180px]">
      <CostCentreCombobox
        formState={formState}
        dispatch={dispatch}
        t={t}
        handleKeyDown={handleKeyDown}
        handleFieldKeyDown={handleFieldKeyDown}
      />
    </div>
  );

  const adjustmentComponent = (
    <div className="flex flex-col w-full max-w-none sm:max-w-[180px]">
      <AdjustmentAmountInput
        transactionType={transactionType}
        formState={formState}
        dispatch={dispatch}
        t={t}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );

  // const checkboxesComponent = (
  //   <div className="flex items-center gap-2 w-full justify-start sm:justify-center">
  //     <AutoCalculationCheckbox
  //       formState={formState}
  //       dispatch={dispatch}
  //       t={t}
  //     />
  //     <IsLockedCheckbox
  //       formState={formState}
  //       dispatch={dispatch}
  //       t={t}
  //     />
  //   </div>
  // );

  const attachmentComponent = (
    applicationSettings.branchSettings.fileAttachmentMethod !== 'No' && (
      <button className="text-[#2563eb] dark:text-[#60a5fa] w-full text-left">
        <span className="hover:underline text-[#0ea5e9] dark:text-[#60a5fa] capitalize" onClick={selectAttachment}>
          {t("attachment")}
        </span>
      </button>
    )
  );

  const outsideComponents = (
    <div className="flex flex-col gap-1 pr-4">
      {showCheckboxesOutside ? (
        <>
          <div className="flex flex-wrap items-end gap-1">
            {showWarehouseOutside && warehouseComponent}
            {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
              <>
                {showAdjustmentOutside && adjustmentComponent}
              </>
            )}
          </div>
          <div className="flex items-end gap-1">
            {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
              <>
                {showCostCentreOutside && costCentreComponent}
              </>
            )}
            {
              (applicationSettings.branchSettings.fileAttachmentMethod !== 'No' && showAttachmentOutside) && (
                attachmentComponent
              )
            }
            {clientSession.isAppGlobal && (
              <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
                <PriceCategoryCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
            )}
          </div>
          <div>
            {clientSession.isAppGlobal && (
              <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
                <SupplyTypeCombobox
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  handleKeyDown={handleKeyDown}
                  handleFieldKeyDown={handleFieldKeyDown}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {showWarehouseOutside && warehouseComponent}
          {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
            <>{showCostCentreOutside && costCentreComponent}</>
          )}
          {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
            <>{showAdjustmentOutside && adjustmentComponent}</>
          )}
        </>
      )}
    </div>
  );

  const toggleFooterPosition = () => {
    const newPosition: "bottom" | "right" = formState.userConfig?.footerPosition === "bottom" ? "right" : "bottom";
    const updatedUserConfig = {
      ...formState.userConfig,
      footerPosition: newPosition,
    };
    dispatch(formStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }));
  };

  const hasDropupContent = isNewFooter &&
    !showWarehouseOutside ||
    !showCostCentreOutside ||
    !showAdjustmentOutside ||
    !showAttachmentOutside ||
    formState.formElements.printOnSave.visible

  const renderSecondFooter = () => (
    <div
      className={`dark:bg-dark-bg ${footerLayout === "vertical" ? "flex flex-col justify-between h-full" : ""}`}
      style={{ backgroundColor: formState.userConfig?.footerBg ? `rgb(${formState.userConfig.footerBg}) dark:bg-dark-bg` : undefined }}>
      {formState.transaction.master.voucherType !== "LPO" && (
        <div className={`${footerLayout === "vertical" ? "relative block" : "hidden"}`}>
          <div className="flex justify-between space-x-2">
            <button onClick={toggleFooterPosition} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-dark-bg opacity-50 hover:opacity-100 transition-all duration-300" title={t("display_the_footer_at_the_bottom")}>
              <PanelBottom className="text-[#b3b3b9] dark:text-dark-text w-4 h-4" />
            </button>

            <button ref={buttonRef} onClick={() => setIsPopupVisible((prev) => !prev)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-dark-bg opacity-50 hover:opacity-100 transition-all duration-300" title={t("more_options")} >
              <EllipsisVertical className="w-4 h-4 text-gray-600 dark:text-dark-text" />
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
                        checked={formState.userConfig?.printOnSave}
                        onChange={(e) => dispatch(formStateHandleFieldChange({ fields: { printOnSave: e.target.checked }, }))}
                        disabled={formState.formElements.printOnSave?.disabled}
                      />
                    )}
                  </li>
                  {/* <li>
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
                  </li> */}
                  <li>
                    <button className="text-[#2563eb]">
                      {applicationSettings.branchSettings.fileAttachmentMethod !== 'No' && (
                        <span className="hover:underline text-[#0ea5e9] capitalize" onClick={selectAttachment}>
                          {t("attachment")}
                        </span>
                      )}
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
      )}

      <div className={`dark:bg-dark-bg-card ${footerLayout === "vertical" ? "" : "bg-white shadow-lg border dark:border-dark-border border-gray-200 overflow-hidden"}`}>
        {formState.transaction.master.voucherType !== "LPO" && (
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
                    transactionType={transactionType}
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {formState.transaction.master.voucherType !== "LPO" && (
          <div className={`grid ${footerLayout === "vertical" ? "grid-cols-1 gap-1" : "grid-cols-1 md:grid-cols-[1fr_400px]"}`}>
            <div className={`flex ${footerLayout === "vertical" ? "flex-col items-start justify-start" : "px-2 py-1 flex-col md:flex-row items-end justify-end gap-4"}`}>
              <div className={`${footerLayout === "vertical" ? "hidden" : "block"}`}>
                <div className="absolute top-1.5 left-1">
                  <button onClick={toggleFooterPosition} className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-dark-bg opacity-50 hover:opacity-100 transition-all duration-300" title={t("display_the_footer_on_the_right")}>
                    <PanelRight className="text-[#b3b3b9] dark:text-dark-text w-4 h-4" />
                  </button>
                </div>
              </div>
              {footerLayout !== "vertical" && outsideComponents}
              <div className={`hidden md:flex ${footerLayout === "vertical" ? "flex-col items-start w-full" : "flex-col items-start w-full md:w-auto"}`}>
                <div className={`flex ${footerLayout === "vertical" ? "flex-col items-start" : "items-end"} gap-2 mb-2`}>
                  <div className={`flex items-center w-full ${footerLayout === "vertical" ? "justify-between" : "gap-2"}`}>
                    {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && formState.transaction.master.voucherType !== VoucherType.PurchaseEstimate && (
                      <CashPaidSection
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                        focusDiscount={focusDiscount}
                        focusAmount={focusAmount}
                      />
                    )}
                    <RoundOffInput
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                      handleKeyDown={handleKeyDown}
                      focusDiscount={() => document.getElementById("discountID")?.focus()}
                      focusAmount={() => document.getElementById("amountID")?.focus()}
                    />
                  </div>
                  <div className="flex flex-col w-full">
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

                <div className={`${footerLayout === "vertical" ? "w-full max-w-[265px]" : "w-full md:w-[345px]"}`}>
                  <div className="flex flex-col">
                    <ERPTextarea
                      id="remarks"
                      required={true}
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      label={t(formState.formElements.remarks.label)}
                      value={formState.transaction.master.remarks}
                      onChange={(e) => dispatch(formStateTransactionMasterHandleFieldChange({ fields: { remarks: e.target?.value }, }))}
                      disabled={formState.formElements.remarks?.disabled || formState.formElements.pnlMasters?.disabled}
                      className={`dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text ${isNewFooter ? "h-[42px]" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-2 pl-2 pr-4 dark:bg-dark-bg-card bg-gray-50 border-l dark:border-dark-border border-gray-200">
              <div className="flex flex-col gap-1">
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
                      <span className="text-xs dark:text-dark-text text-gray-600 font-medium w-20">{t(formState.formElements.grandTotalFc.label)}</span>
                      <span className="text-xs dark:text-dark-text text-gray-600 mr-2">:</span>
                      <span className={`text-sm font-semibold dark:text-dark-text text-gray-900 flex-1 ${isRtl ? "text-left" : "text-right"}`}>{formState.transaction.master.grandTotalFc}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center border-t-2 border-[#3b82f6] mt-1">
                  <span className="text-sm font-bold dark:text-dark-text text-gray-900 uppercase">
                    {t(formState.formElements.grandTotal.label)}
                  </span>
                  <span className="text-lg font-bold text-[#3b82f6]">
                    {getFormattedValue(formState.transaction.master?.grandTotal ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`p-2 dark:bg-dark-bg-card bg-gray-100 border-t dark:border-dark-border border-gray-200 flex ${footerLayout === "vertical" ? "flex-col" : "flex-col md:flex-row justify-between items-center gap-4"}`}>
          <div>
            {formState.transaction.master.voucherType !== "LPO" && (
              <ERPCheckbox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="printOnSave"
                label={t(formState.formElements.printOnSave.label)}
                checked={formState.printOnSave}
                onChange={(e) => dispatch(formStateHandleFieldChange({ fields: { printOnSave: e.target.checked }, }))}
                disabled={formState.formElements.printOnSave?.disabled}
                className="dark:text-dark-text"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 w-full sm:w-auto">
            {formState.transaction.master.voucherType === "LPO" && (
              <ConfettiWrapper onOriginalClick={generateLPQ} triggerConfetti={formState.savingCompleted}>
                <ERPButton
                  variant="custom"
                  ref={btnSaveRef}
                  jumpTarget="save"
                  title={t("generate_lpq")}
                  startIcon={<Check className="w-3.5 h-3.5" />}
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  disabled={formState.formElements.pnlMasters?.disabled || formState.transaction.details == null || formState.transaction.details.length == 0}
                  className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg flex-1 sm:flex-none"
                  customVariant="bg-green-500 hover:bg-green-600 text-white"
                />
              </ConfettiWrapper>
            )}
            <ConfettiWrapper onOriginalClick={formState.transaction.master.voucherType === "LPO" ? generateLPO : save} triggerConfetti={formState.savingCompleted}>
              <ERPButton
                variant="primary"
                ref={btnSaveRef}
                jumpTarget="save"
                title={formState.transaction.master.voucherType === "LPO" ? t("generate_lpo") : t("save")}
                startIcon={<Check className="w-3.5 h-3.5" />}
                localInputBox={formState?.userConfig?.inputBoxStyle}
                disabled={formState.formElements.pnlMasters?.disabled || formState.transaction.details == null || formState.transaction.details.length == 0}
                className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg flex-1 sm:flex-none"
              />
            </ConfettiWrapper>
            <ERPButton
              title={t("cancel")}
              variant="secondary"
              onClick={() => goToPreviousPage()}
              localInputBox={formState?.userConfig?.inputBoxStyle}
              startIcon={<X className="w-3.5 h-3.5" />}
              className="dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg flex-1 sm:flex-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const dropdownContent = (
    <div className="p-2 dark:bg-dark-bg-card bg-white border border-gray-300 dark:border md:border-t md:border-r md:border-l md:border-b-0 md:rounded-t-lg rounded-lg md:rounded-none">
      <div className="flex items-end gap-2 flex-wrap">
        {clientSession.isAppGlobal && (
          <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
            <PriceCategoryCombobox
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              handleFieldKeyDown={handleFieldKeyDown}
            />
          </div>
        )}
        {clientSession.isAppGlobal && (
          <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
            <SupplyTypeCombobox
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              handleFieldKeyDown={handleFieldKeyDown}
            />
          </div>
        )}
        {!showWarehouseOutside && (
          <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
            {warehouseComponent}
          </div>
        )}
        {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
          <>
            {!showCostCentreOutside && (
              <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
                {costCentreComponent}
              </div>
            )}
          </>
        )}
        {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
          <>
            {!showAdjustmentOutside && (
              <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
                {adjustmentComponent}
              </div>
            )}
          </>
        )}
        {applicationSettings.branchSettings.fileAttachmentMethod !== 'No' && !showAttachmentOutside && (
          <div className="w-full mb-2 sm:mb-0 sm:w-auto">
            {attachmentComponent}
          </div>
        )}
        {/* <div className="w-full mb-2 sm:mb-0 sm:w-auto">
            {checkboxesComponent}
          </div> */}
        <div className="flex items-center justify-between w-full">
          {formState.formElements.printOnSave.visible && (
            <ERPCheckbox
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="printOnSave"
              label={t(formState.formElements.printOnSave.label)}
              checked={formState.printOnSave}
              onChange={(e) => dispatch(formStateHandleFieldChange({ fields: { printOnSave: e.target.checked }, }))}
              disabled={formState.formElements.printOnSave?.disabled}
              className="dark:text-dark-text"
            />
          )}
        </div>
        <div className="flex md:hidden flex-col w-full max-w-full">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-wrap items-end gap-2 w-full">
              {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && formState.transaction.master.voucherType !== VoucherType.PurchaseEstimate && (
                <CashPaidSection
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  focusDiscount={focusDiscount}
                  focusAmount={focusAmount}
                />
              )}
              <RoundOffInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
                focusDiscount={() => document.getElementById("discountID")?.focus()}
                focusAmount={() => document.getElementById("amountID")?.focus()}
              />
              <BillDiscountInput
                formState={formState}
                dispatch={dispatch}
                t={t}
                handleKeyDown={handleKeyDown}
                applyDiscountsToItems={applyDiscountsToItems}
              />
            </div>
            <ERPTextarea
              id="remarks"
              required={true}
              localInputBox={formState?.userConfig?.inputBoxStyle}
              label={t(formState.formElements.remarks.label)}
              value={formState.transaction.master.remarks}
              onChange={(e) => dispatch(formStateTransactionMasterHandleFieldChange({ fields: { remarks: e.target?.value } }))}
              disabled={formState.formElements.remarks?.disabled || formState.formElements.pnlMasters?.disabled}
              className={`dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text ${isNewFooter ? "h-[42px]" : ""} w-full`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const minimalContent = (
    <div className="p-2 mt-1 mb-2 sm:mb-3 dark:bg-dark-bg-card bg-gray-50 border dark:border-dark-border border-gray-200 rounded-lg">
      <div className="grid grid-cols-1 gap-1.5">
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
        {/* <NetTotalLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        /> */}
        {formState.formElements.grandTotalFc.visible && (
          <div>
            <div className="flex items-center justify-between dark:text-dark-text">
              <span>
                {t(formState.formElements.grandTotalFc.label)}:
              </span>
              <span>{formState.transaction.master.grandTotalFc}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const selectedFooter = renderSecondFooter();
  const getInputHeight = () => {
    return formState.userConfig?.inputBoxStyle?.inputSize == "sm" ? remToPx(0) : formState.userConfig?.inputBoxStyle?.inputSize == "md" ? remToPx(0.75) : formState.userConfig?.inputBoxStyle?.inputSize == "lg" ? remToPx(1.375) : formState.userConfig?.inputBoxStyle?.inputSize == "customize" ? (remToPx(formState.userConfig?.inputBoxStyle?.inputHeight) ?? 0) - 23 : 0
  }

  if (formState.userConfig?.footerPosition === "right") {
    return (
      <div
        className={`fixed ${isRtl ? "left-0" : "right-0"} h-[-webkit-fill-available] overflow-y-scroll w-[280px] sm:w-[300px] shadow-lg p-2 z-30 dark:bg-dark-bg`}
        style={{ top: `${170 + (getInputHeight())}px`, backgroundColor: formState.userConfig?.footerBg ? `rgb(${formState.userConfig.footerBg}) dark:bg-dark-bg` : '#f8f8ff', }}>
        {renderSecondFooter()}
      </div>
    );
  } else {
    return (
      <>
        {dropupState !== 'closed' && hasDropupContent && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-30" onClick={() => setDropupState('closed')} />
        )}
        {!deviceInfo?.isMobile && (
          <div className={`fixed dark:bg-dark-bg ${footerLayout === "vertical" ? `top-[170px] ${isRtl ? "left-0" : "right-0"} h-[-webkit-fill-available] w-[280px] sm:w-[300px] overflow-y-auto p-2 z-20 bg-white border-l dark:border-dark-border border-l-slate-200` : "z-40 bottom-0 shadow-lg full-available-width dark:bg-dark-bg bg-[#f8f8ff]"}`}>
            {formState.transaction.master.voucherType !== "LPO" && hasDropupContent && (
              <div className={`${footerLayout === "vertical" ? "hidden" : "block"}`}>
                <div className="relative w-full">
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-[-18px]">
                    <button onClick={handleIconClick} className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-[#f8f8ff] rounded-t-full border border-l-0 border-r-0 border-b-0 border-gray-300 transition-all duration-300 ${dropupState !== 'closed' ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`} style={{ boxShadow: "0 -2px 2px rgba(0, 0, 0, 0.1)" }}>
                      <ChevronUp className={`mx-2 transition-transform duration-500 dark:text-dark-text ${dropupState === 'full' ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
                    </button>
                  </div>
                </div>
                <div ref={dropUpRef} className={`w-full pt-2 transition-all duration-500 ease-in-out overflow-y-auto ${dropupState === 'full' ? "max-h-[50vh]" : "max-h-0"}`}>
                  {dropdownContent}
                </div>
              </div>
            )}
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
          <div className="z-40 fixed bottom-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg full-available-width px-2 sm:px-3 py-2 mb-[65px]"
            style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)", }}>
            {formState.transaction.master.voucherType !== "LPO" && hasDropupContent && (
              <>
                <div className="relative w-full">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
                    <button
                      onClick={handleIconClick}
                      className={`flex items-center justify-center dark:bg-dark-bg-card dark:border-dark-border bg-[#f8f8ff] rounded-t-lg border border-b-0 border-gray-300 transition-all duration-300 ${dropupState !== 'closed' ? "dark:bg-dark-hover-bg bg-gray-100" : ""}`}
                      style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <ChevronUp className={`mx-2 transition-transform duration-500 dark:text-dark-text ${dropupState === 'full' ? "transform rotate-180" : hasAnimated ? "" : "animate-[bounce_2s_1]"}`} size={24} />
                    </button>
                  </div>
                </div>
                <div
                  ref={dropUpRef}
                  className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${dropupState !== 'closed' ? "max-h-[50vh] overflow-y-auto overflow-x-hidden" : "max-h-0 overflow-hidden"}`}
                  style={{ width: "100%", boxSizing: "border-box" }}>
                  {dropupState === 'minimal' ? minimalContent : <> {dropdownContent} {minimalContent} </>}
                </div>
              </>
            )}
            <div className="flex items-end justify-end gap-2 sm:gap-4">
              {formState.transaction.master.voucherType !== "LPO" && (
                <div className="grid grid-cols-1 gap-1">
                  {formState.formElements.grandTotalFc.visible && (
                    <div>
                      <div className="flex items-center justify-between dark:text-dark-text text-xs sm:text-sm">
                        <span>
                          {t(formState.formElements.grandTotalFc.label)}
                        </span>
                        <span>:{formState.transaction.master.grandTotalFc}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                {/* <div className="hidden sm:block mr-2">
                  <h6 className="font-semibold whitespace-nowrap text-[18px] sm:text-[20px] dark:text-dark-text">
                    <span className="!font-medium dark:!text-dark-text !text-gray-600 text-sm sm:text-base">
                        {t("total")}:{" "}
                      </span>
                      {getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}
                    </h6>
                </div> */}
                <div className="fixed bottom-0 left-0 w-full dark:bg-dark-bg-card bg-[#f8f8ff] flex flex-col py-2 z-10">
                  {formState.transaction.master.voucherType !== "LPO" && (
                    <div>
                      <div className="flex justify-between items-center px-2">
                        <span className="text-xs sm:text-sm font-bold dark:text-dark-text text-gray-900 uppercase">
                          {t(formState.formElements.grandTotal.label)}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-[#3b82f6]">
                          {getFormattedValue(formState.transaction.master?.grandTotal ?? 0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 px-2 sm:px-4">
                    <ERPButton
                      title={t("cancel")}
                      onClick={() => goToPreviousPage()}
                      className="flex-1 rounded-none !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg text-sm sm:text-base"
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                    />
                    <ConfettiWrapper onOriginalClick={save}>
                      <ERPButton
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        ref={btnSaveRef}
                        title={formState.transaction.master.voucherType === "LPO" ? t("generate_lpo") : t("save")}
                        jumpTarget="save"
                        variant="primary"
                        className="flex-1 rounded-none !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg text-sm sm:text-base"
                        disabled={formState.formElements.pnlMasters?.disabled || formState.transaction.details == null || formState.transaction.details.length == 0 || formState.transactionLoading}
                      />
                    </ConfettiWrapper>
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