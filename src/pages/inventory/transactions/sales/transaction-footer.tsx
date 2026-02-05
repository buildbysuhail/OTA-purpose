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
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
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
import { formStateHandleFieldChangeKeysOnly, formStateHandleFieldChange, formStateTransactionMasterHandleFieldChange, formStateMasterHandleFieldChange } from "../reducer";
import { useDebouncedInput } from "../../../../utilities/hooks/useDebounce";
import { TransactionFormState, UserConfig } from "../transaction-types";
import PrivilegeCardEntry from "./privilege-card-entry";
import Tender from "./tender";
import AutoCalculationCheckbox from "./components/AutoCalculationCheckbox";
import IsLockedCheckbox from "./components/IsLockedCheckbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import VoucherLoader from "./components/grn-Number";
import BtnOfferAchieved from "./components/btnGiftOnBilling";
import BtnDiscountSlab from "./components/btnDiscountSlab";
import BtnTender from "./components/btnTender";
import BtnPrivilegeCard from "./components/btnPrivilegeCard";
import BtnPending from "./components/btnPending";
import BtnSr from "./components/btnSr";
import TaxOnDiscount from "./components/tax-on-discount";
import { tr } from "date-fns/locale";
import EinvoiceLabel from "./components/EinvoiceLabel";
import EWBLabel from "./components/EWBLabel";
import PostedTransactionLabel from "./components/PostedTransactionLabel";
import SRAmountLabel from "./components/SRAmountLabel";

interface TransactionFooterProps {
  formState: TransactionFormState;
  transactionType: string;
  loadAndSetTransVoucher: any;
  dispatch: any;
  t: any;
  handleKeyDown: any;
  handleFieldKeyDown: any;
  focusDiscount: any;
  focusAmount: any;
  goToPreviousPage: any;
  save: any;
  selectAttachment: any;
  isAppGlobal: boolean;
  toggleDropup: () => void;
  footerLayout: "horizontal" | "vertical";
  applyDiscountsToItems: any;
  calculateTotal: any
  applicationSettings: any;
  handleDiscountSlab: any;
  applyTaxOnBillDiscount: any;
  giftOnBilling: any;
  costCenterRef?: any;
  onFooterHeightChange?: (height: number) => void;
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
  selectAttachment,
  isAppGlobal,
  toggleDropup,
  footerLayout,
  calculateTotal,
  applyDiscountsToItems,
  applicationSettings,
  loadAndSetTransVoucher,
  handleDiscountSlab,
  giftOnBilling,
  applyTaxOnBillDiscount,
  costCenterRef,
  onFooterHeightChange,
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
  const [verticalVisibleFields, setVerticalVisibleFields] = useState(20); // Number of fields visible in vertical layout main area
  const footerContainerRef = useRef<HTMLDivElement | null>(null);
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
  const [showSecondHalf, setShowSecondHalf] = useState(false);
  const [showButtonsOutside, setShowButtonsOutside] = useState(false);
  const [dropupState, setDropupState] = useState<'closed' | 'minimal' | 'full'>('closed');
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState({ visible: false, type: "" });

  // Debounced input hooks for transaction master fields
  const { value: creditAmtValue, onChange: onCreditAmtChange } = useDebouncedInput(
    formState.transaction.master.bankAmt || "",
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { bankAmt: debouncedValue },
        })
      );
    },
    300
  );

  const { value: couponAmtValue, onChange: onCouponAmtChange } = useDebouncedInput(
    formState.transaction.master.couponAmt || "",
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { couponAmt: debouncedValue },
        })
      );
    },
    300
  );

  const { value: srAmountValue, onChange: onSrAmountChange } = useDebouncedInput(
    formState.transaction.master.srAmount || "",
    async (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { srAmount: debouncedValue },
        })
      );
    },
    300
  );

  const { value: tokenNumberValue, onChange: onTokenNumberChange } = useDebouncedInput(
    formState.transaction.master.tokenNumber || "",
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { tokenNumber: debouncedValue },
        })
      );
    },
    300
  );

  const handleFieldChange = (field: keyof UserConfig, value: any) => {
    const updatedUserConfig = {
      ...formState.userConfig,
      [field]: value,
    };
    dispatch(formStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }));
  };

  const remToPx = (rem: number) => rem * 16;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallDevice(width >= 320 && width <= 768);
      setIsMobileView(width <= 768);
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
      const height = window.innerHeight;
      setIsSmallHeight(height <= 650);

      // Calculate visible fields for vertical (right) footer based on height
      // Bottom section includes: Cash Paid, Round Off, Bill Discount, Remarks, Einvoice/EWB labels,
      // Net Amount, VAT Amount, Tax on Discount, Bill Discount Label, Grand Total, Print on Save, Save/Cancel buttons
      if (isSidebar) {
        const headerOffset = 170; // top-[170px] in styles
        const bottomSectionHeight = 520; // Fixed bottom section height (all totals, remarks, buttons)
        const containerPadding = 16; // p-2 = 8px * 2
        const availableHeight = height - headerOffset - bottomSectionHeight - containerPadding;
        const fieldHeight = 48; // average height per field including margins
        const maxFields = Math.max(0, Math.floor(availableHeight / fieldHeight));
        setVerticalVisibleFields(maxFields);

        setShowAttachmentOutside(width >= 1540);
        setShowCheckboxesOutside(width >= 1632);
        setShowAdjustmentOutside(width >= 1400);
        setShowCostCentreOutside(width >= 1400);
        setShowWarehouseOutside(width >= 1400);
      } else {
        setShowAttachmentOutside(width >= 1300);
        setShowCheckboxesOutside(width >= 1632);
        setShowAdjustmentOutside(width >= 1200);
        setShowCostCentreOutside(width >= 1200);
        setShowWarehouseOutside(width >= 1200);
      }
      setShowSecondHalf(width >= 1440);
      setShowButtonsOutside(width >= 1816);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebar]);

 

  // Footer height measurement and reporting
  useLayoutEffect(() => {
    if (!onFooterHeightChange || !footerContainerRef.current) return;

    const measureAndReportHeight = () => {
      if (footerContainerRef.current) {
        const height = footerContainerRef.current.getBoundingClientRect().height;
        onFooterHeightChange(height);
      }
    };

    // Initial measurement
    measureAndReportHeight();

    // Create ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(() => {
      measureAndReportHeight();
    });

    resizeObserver.observe(footerContainerRef.current);

    // Also listen for window resize
    window.addEventListener('resize', measureAndReportHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureAndReportHeight);
    };
  }, [onFooterHeightChange, dropupState, footerLayout]);

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

  const handlePrivilegeCardOpen = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { privilegeCardOpen: true }
      })
    )
  }

  const handlePrivilegeCardClose = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { privilegeCardOpen: false }
      })
    )
  }

  // Have some discussion
  const handleTenderOpen = () => {
    // Allow multi payment settings is used in tender page,
    //  so here check only showTenderDialogInSales
      if(applicationSettings.accountsSettings.showTenderDialogInSales){
        dispatch(
          formStateHandleFieldChange({
            fields: { tenderOpen: true }
          })
        )
    }
  }

  const handleTenderClose = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { tenderOpen: false }
      })
    )
  }

  const handleSalesReturnOpen = (type: string) => {
    setIsModalOpen({ visible: true, type: type });
    // dispatch(
    //   formStateHandleFieldChange({
    //     fields: { srOpen: true }
    //   })
    // )
  }

  const handleSalesReturnClose = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { srOpen: false }
      })
    )
  }

  const closeModal = () => {
    setIsModalOpen({ visible: false, type: "" });
  };

  const warehouseComponent = (
    <div className="w-full max-w-none sm:max-w-[140px] lg:max-w-[160px] xl:max-w-[180px] flex-shrink">
      <WarehouseID
        formState={formState}
        dispatch={dispatch}
        t={t}
        handleKeyDown={handleKeyDown}
        handleFieldKeyDown={handleFieldKeyDown}
      />
    </div>
  );

  const priceCategoryComponent = (
    <div>
      <PriceCategoryCombobox
        formState={formState}
        dispatch={dispatch}
        t={t}
        handleKeyDown={handleKeyDown}
        handleFieldKeyDown={handleFieldKeyDown}
      />
    </div>
  )

  const costCentreComponent = (
    <div className="w-full max-w-none sm:max-w-[140px] lg:max-w-[160px] xl:max-w-[180px] flex-shrink">
      {(
        formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
        formState.transaction.master.voucherType === VoucherType.SalesReturn
      ) && (
          <CostCentreCombobox
            ref={costCenterRef}
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
        )}
    </div>
  );

  const adjustmentComponent = (
    <div className="flex flex-col w-full max-w-none sm:max-w-[140px] lg:max-w-[160px] xl:max-w-[180px] flex-shrink">
      <AdjustmentAmountInput
        transactionType={transactionType}
        formState={formState}
        dispatch={dispatch}
        t={t}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );

  const checkboxesComponent = (
    <div className="flex items-center gap-2 w-full justify-start sm:justify-center">
      {(
        formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
        formState.transaction.master.voucherType === VoucherType.SalesQuotation
      ) && (
          <AutoCalculationCheckbox
            formState={formState}
            dispatch={dispatch}
            t={t}
          />
        )}
      <IsLockedCheckbox
        formState={formState}
        dispatch={dispatch}
        t={t}
      />
        {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && (
        <ERPCheckbox
          id="gatePassPrint"
          label={t("gate_pass")}
          disabled={!(applicationSettings.printerSettings.printGatePass || applicationSettings.printerSettings.printSelectedGatePass)}
          data={formState}
          checked={formState.gatePassPrint}
          onChangeData={(e) => dispatch(formStateHandleFieldChange({
            fields:{
              gatePassPrint:e.gatePassPrint
            }
          }))}
        />
      )}
      {/* Make the below for vat# in si footer instead of gatepass */}
      {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && (
        <><ERPCheckbox
          id="vat"
          label={t("vat_#")}
          data={formState}
          checked={formState?.vatChecked}
          onChange={(e) => {
            debugger;
            dispatch(formStateHandleFieldChangeKeysOnly({ fields: { vatChecked: e.target.checked } }))
          }}
        />
          <ERPInput
            id="vatNo"
            label={t("Tax no")}
            type="string"
            value={tokenNumberValue}
            readOnly={!formState?.vatChecked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTokenNumberChange(e.target.value)}
          />
        </>
      )}
    </div>
  );

  const attachmentComponent = (
    applicationSettings?.branchSettings?.fileAttachmentMethod !== 'No' && (
      <button className="text-[#2563eb] dark:text-[#60a5fa] w-full text-left">
        <span
          className="hover:underline text-[#0ea5e9] dark:text-[#60a5fa] capitalize"
          onClick={selectAttachment}
        >
          {t("attachment")}
        </span>
      </button>
    )
  );


  const outsideComponents = (
    <div className="flex flex-col gap-1 pr-2 lg:pr-4 flex-1 min-w-0">
      {showCheckboxesOutside ? (
        <>
          {/* ----------------------------------------------------- */}
          <div className="flex flex-wrap items-end gap-1">
            {showWarehouseOutside && warehouseComponent}
            {priceCategoryComponent}
            <SupplyTypeCombobox
              isAppGlobal={isAppGlobal}
              formState={formState}
              dispatch={dispatch}
              t={t}
              handleKeyDown={handleKeyDown}
              handleFieldKeyDown={handleFieldKeyDown}
            />
            {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
              <>
                {showAdjustmentOutside && adjustmentComponent}
                {showCostCentreOutside && costCentreComponent}
              </>
            )}
            {(applicationSettings.branchSettings.fileAttachmentMethod !== 'No' && showAttachmentOutside) && (
              attachmentComponent
            )}
            <div className="w-full sm:w-auto sm:max-w-[270px] gap-0.5 flex flex-wrap sm:flex-nowrap">
              {formState.transaction.master.voucherType !== VoucherType.SalesReturn && (
                <ERPInput
                  id="creditCardAmount"
                  label={t("credit_card_amount")}
                  type="number"
                  value={creditAmtValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCreditAmtChange(e.target.value)}
                />
              )}
              {(formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                <ERPInput
                  id="couponAmount"
                  label={t("coupon_amount")}
                  type="number"
                  value={couponAmtValue}
                  disabled
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCouponAmtChange(e.target.value)}
                />
              ))}
            </div>
            <div className="flex items-end gap-1">
              {
                formState.formElements.lBLCashPaid.visible && (
                  <>
                    {formState.formElements.lBLCashPaid.label}
                  </>
                )
              }
            </div>
            <div className="flex items-end gap-1 flex-wrap">
              {formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                <div className="w-full sm:w-[130px]">
                  <ERPInput
                    id="srAmount"
                    label={t('sr_amount')}
                    type="number"
                    value={srAmountValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSrAmountChange(e.target.value)}
                  />
                </div>
              )}
              {(formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                formState.transaction.master.voucherType === VoucherType.SalesReturn) && (
                  // <ERPButton
                  //   title={t("sr")}
                  //   className="!h-[38px] !px-3"
                  //   onClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                  // />
                  <BtnSr
                    formState={formState}
                    dispatch={dispatch}
                    srBtnClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                    t={t}
                  />
                )}
            </div>
            <div className="flex items-center gap-2 text-sm dark:text-dark-text">
              {checkboxesComponent}
              {/* {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && (
                <div className="flex gap-1">
                  <span className="text-xs font-medium whitespace-nowrap">{t("l_bill_amount")}:</span><span className="text-xs font-semibold">0.00</span>
                  <span className="text-xs font-medium whitespace-nowrap">{t("adv_bal")}:</span><span className="text-xs font-semibold">0.00</span>
                </div>
              )} */}
              {(
                formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                formState.transaction.master.voucherType === VoucherType.SalesQuotation
              ) && formState.formElements.lblBillBalance.visible && (
                  <div>
                    <span className="text-xs font-bold text-blue-700 whitespace-nowrap">{t("bal")}: {formState.formElements.lblBillBalance.label}</span><span className="text-xs font-semibold"></span>
                  </div>
                )}
            </div>
          </div>

          {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && showButtonsOutside && (
            <div className="flex items-center gap-1">
              <BtnTender
                formState={formState}
                dispatch={dispatch}
                tenderBtnClick={() => handleTenderOpen()}
                t={t}
              />
              {/* <ERPButton
                title={t('tender')}
                onClick={handleTenderOpen}
              /> */}
              {/* <ERPButton
                title={t('pending')}
                variant="custom"
                customVariant="bg-[#0d7377] hover:bg-[#0a5c5f] text-white"
              /> */}
              {/* <BtnPending
                formState={formState}
                dispatch={dispatch}
                pendingBtnClick={() => window.open(window.location.href, "_blank")}
                t={t}
              /> */}
              <BtnPrivilegeCard
                formState={formState}
                dispatch={dispatch}
                privilegeCardBtnClick={() => handlePrivilegeCardOpen()}
                t={t}
              />
              {/* <ERPButton
                title={t('privilege_card')}
                onClick={handlePrivilegeCardOpen}
                variant="custom"
                customVariant="bg-[#9b87f5] hover:bg-[#8b75e5] text-white"
              /> */}
              <BtnOfferAchieved
                formState={formState}
                dispatch={dispatch}
                offerAchievedBtnClick={() => giftOnBilling()}
                t={t}
              />
              <BtnDiscountSlab
                formState={formState}
                dispatch={dispatch}
                discSlabBtnClick={() => handleDiscountSlab()}
                t={t}
              />
              {/* <ERPButton
                title={t('disc_slab')}
                onClick={() => handleDiscountSlab()}
                variant="custom"
                customVariant="bg-[#ff0000] hover:bg-[#dd0000] text-white"
              /> */}
              {/* {formState.srOpen && (
                <div>
                  <SalesReturn
                    isOpen={formState.srOpen}
                    onClose={handleSalesReturnClose}
                    t={t} />
                </div>
              )} */}
            </div>
          )}
          {(formState.transaction.master.voucherType === VoucherType.SalesQuotation) && showButtonsOutside && (
            <div className="flex items-center gap-1">
              <BtnTender
                formState={formState}
                dispatch={dispatch}
                tenderBtnClick={() => handleTenderOpen()}
                t={t}
              />
              {/* <ERPButton
                title={t('tender')}
                onClick={handleTenderOpen}
              /> */}
              {/* <ERPButton
                title={t('pending')}
                variant="custom"
                customVariant="bg-[#0d7377] hover:bg-[#0a5c5f] text-white"
              /> */}
              {/* <BtnPending
                formState={formState}
                dispatch={dispatch}
                pendingBtnClick={() => window.open(window.location.href, "_blank")}
                t={t}
              /> */}
              {/* Need to make the P button into standard btn component format */}
              <ERPButton
                title={t("p")}
                variant="secondary"
                onClick={() => alert("P Button clicked")}
              />
            </div>
          )}
          {(formState.transaction.master.voucherType === VoucherType.SalesOrder) && showButtonsOutside && (
            <div className="flex gap-1">
              <ERPButton
                title={t('load_excel')}
                onClick={handleTenderOpen}
                className="px-2 w-fit"
              />
              {/* If needed make this component */}
              <div className="flex flex-col p-1 border border-gray-300 ">
                <label>{t("advance_amount")}</label>
                <div className="flex flex-row  gap-1">
                  <ERPInput
                    id="AdvanceCashAmount"
                    label={t("cash")}
                    labelDirection="horizontal"
                    type="number"
                    value={0.00}
                  />
                  <ERPInput
                    id="AdvanceCardAmount"
                    label={t("card")}
                    labelDirection="horizontal"
                    type="number"
                    value={0.00}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* first half - Warehouse and Cost Centre on same row */}
          <div className="flex flex-row flex-wrap items-end gap-2 min-w-0">
            {showWarehouseOutside && warehouseComponent}
            {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
              <>{showCostCentreOutside && costCentreComponent}</>
            )}
            {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
              <>{showAdjustmentOutside && adjustmentComponent}</>
            )}
          </div>
          {/* second half */}
          {showSecondHalf && (
            <div className="flex flex-wrap gap-1 min-w-0">

              {formState.transaction.master.voucherType !== VoucherType.SalesReturn && (
                <ERPInput
                  id="creditCardAmount"
                  label={t("credit_card_amount")}
                  type="number"
                  value={creditAmtValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCreditAmtChange(e.target.value)}
                />
              )}
              {(formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                <ERPInput
                  id="couponAmount"
                  label={t("coupon_amount")}
                  type="number"
                  disabled
                  value={couponAmtValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCouponAmtChange(e.target.value)}
                />
              ))}
              <div className="flex items-end gap-1 flex-wrap">

                <div className="flex items-end gap-1">
                  {
                    formState.formElements.lBLCashPaid.visible && (
                      <>
                        {formState.formElements.lBLCashPaid.label}
                      </>
                    )
                  }
                </div>
                {formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                  <div className="w-full sm:w-[140px]">
                    <ERPInput
                      id="srAmount"
                      label={t('sr_amount')}
                      type="number"
                      value={srAmountValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSrAmountChange(e.target.value)}
                    />
                  </div>
                )}
                {(formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                  formState.transaction.master.voucherType === VoucherType.SalesReturn) && (
                    // <ERPButton
                    //   title={t("sr")}
                    //   className="!h-[38px] !px-3"
                    //   onClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                    // />
                    <BtnSr
                      formState={formState}
                      dispatch={dispatch}
                      srBtnClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                      t={t}
                    />
                  )}
              </div>
              <div className="flex items-center gap-2 text-sm dark:text-dark-text">
                {/* {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && (
                <div className="flex gap-1">
                  <span className="text-xs font-medium whitespace-nowrap">{t("l_bill_amount")}:</span><span className="text-xs font-semibold">0.00</span>
                  <span className="text-xs font-medium whitespace-nowrap">{t("adv_bal")}:</span><span className="text-xs font-semibold">0.00</span>
                </div>
              )} */}
                {(
                  formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                  formState.transaction.master.voucherType === VoucherType.SalesQuotation
                ) && formState.formElements.lblBillBalance.visible && (
                    <div>
                      <span className="text-xs font-bold text-blue-700 whitespace-nowrap">{t("bal")}: {formState.formElements.lblBillBalance.label}</span><span className="text-xs font-semibold"></span>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
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
    formState.formElements.printOnSave.visible ||
    (formState.transaction.master.voucherType === VoucherType.SalesInvoice && !showButtonsOutside)

  const renderSecondFooter = () => (
    <div className={`dark:bg-dark-bg ${footerLayout === "vertical" ? "flex flex-col justify-between h-full" : ""}`} style={{ backgroundColor: formState.userConfig?.footerBg ? `rgb(${formState.userConfig.footerBg})` : undefined, }}>
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
          <div ref={popupRef} className="absolute rounded-sm dark:bg-dark-bg-card dark:text-dark-text bg-gray-100 shadow-lg p-4 z-50 max-h-[60vh] overflow-y-auto" style={{ top: "100%", right: "0", width: "280px", marginTop: "8px", }}>
            <nav className="w-full dark:bg-dark-bg-card dark:text-dark-text bg-gray-100 text-black">
              <ul className="space-y-2">
                {/* Show fields only if hidden from main area (verticalVisibleFields <= fieldIndex) */}
                {/* Field 5: Checkboxes - show in popup if not visible in main */}
                {verticalVisibleFields <= 5 && (
                  <>
                    <li>
                      {(formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                        formState.transaction.master.voucherType === VoucherType.SalesQuotation) && (
                        <AutoCalculationCheckbox
                          formState={formState}
                          dispatch={dispatch}
                          t={t}
                        />
                      )}
                    </li>
                    <li>
                      <IsLockedCheckbox
                        formState={formState}
                        dispatch={dispatch}
                        t={t}
                      />
                    </li>
                      {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && (
                      <ERPCheckbox
                        id="gatePassPrint"
                        label={t("gate_pass")}
                        disabled={!(applicationSettings.printerSettings.printGatePass || applicationSettings.printerSettings.printSelectedGatePass)}
                        data={formState}
                        checked={formState.gatePassPrint}
                        onChangeData={(e) => dispatch(formStateHandleFieldChange({
                          fields:{
                            gatePassPrint:e.gatePassPrint
                          }
                        }))}
                      />
                    )}
                  </>
                )}
                {/* Field 6: VAT # and Tax No */}
                {verticalVisibleFields <= 6 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                  <li className="flex items-center gap-2">
                    <ERPCheckbox
                      id="vatVertical"
                      label={t("vat_#")}
                      data={formState}
                      checked={formState?.vatChecked}
                      onChange={(e) => dispatch(formStateHandleFieldChangeKeysOnly({ fields: { vatChecked: e.target.checked } }))}
                    />
                    <ERPInput
                      id="vatNoVertical"
                      label={t("Tax no")}
                      type="string"
                      value={tokenNumberValue}
                      readOnly={!formState?.vatChecked}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTokenNumberChange(e.target.value)}
                      className="flex-1"
                    />
                  </li>
                )}
                {/* Field 7: Attachment */}
                {verticalVisibleFields <= 7 && applicationSettings.branchSettings.fileAttachmentMethod !== 'No' && (
                  <li>
                    <button className="text-[#2563eb]">
                      <span className="hover:underline text-[#0ea5e9] capitalize" onClick={selectAttachment}>
                        {t("attachment")}
                      </span>
                    </button>
                  </li>
                )}
                {/* Field 8: Credit Card Amount */}
                {verticalVisibleFields <= 8 && formState.transaction.master.voucherType !== VoucherType.SalesReturn && (
                  <li>
                    <ERPInput
                      id="creditCardAmountVertical"
                      label={t("credit_card_amount")}
                      type="number"
                      value={creditAmtValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCreditAmtChange(e.target.value)}
                    />
                  </li>
                )}
                {/* Field 9: Coupon Amount */}
                {verticalVisibleFields <= 9 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                  <li>
                    <ERPInput
                      id="couponAmountVertical"
                      label={t("coupon_amount")}
                      type="number"
                      value={couponAmtValue}
                      disabled
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCouponAmtChange(e.target.value)}
                    />
                  </li>
                )}
                {/* Field 10: SR Amount and SR Button */}
                {verticalVisibleFields <= 10 && (
                  formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                  formState.transaction.master.voucherType === VoucherType.SalesReturn
                ) && (
                  <li className="flex items-end gap-1">
                    {formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                      <ERPInput
                        id="srAmountVertical"
                        label={t('sr_amount')}
                        type="number"
                        value={srAmountValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSrAmountChange(e.target.value)}
                        className="flex-1"
                      />
                    )}
                    <BtnSr
                      formState={formState}
                      dispatch={dispatch}
                      srBtnClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                      t={t}
                    />
                  </li>
                )}
                {/* Field 11: GRN Print Button */}
                {verticalVisibleFields <= 11 && (
                  <li>
                    <ERPButton
                      title={t("grn_print")}
                      variant="secondary"
                      disabled={formState.transactionLoading}
                    />
                  </li>
                )}
                {/* Field 12: Tender, Pending, Privilege Card Buttons (SalesInvoice) */}
                {verticalVisibleFields <= 12 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                  <li className="flex flex-wrap gap-1 pt-2 border-t border-gray-200 dark:border-dark-border">
                    <BtnTender
                      formState={formState}
                      dispatch={dispatch}
                      tenderBtnClick={() => handleTenderOpen()}
                      t={t}
                    />
                    {/* <BtnPending
                      formState={formState}
                      dispatch={dispatch}
                      pendingBtnClick={() => window.open(window.location.href, "_blank")}
                      t={t}
                    /> */}
                    <BtnPrivilegeCard
                      formState={formState}
                      dispatch={dispatch}
                      privilegeCardBtnClick={() => handlePrivilegeCardOpen()}
                      t={t}
                    />
                  </li>
                )}
                {/* Field 12: Tender, Pending Buttons (SalesQuotation) */}
                {verticalVisibleFields <= 12 && formState.transaction.master.voucherType === VoucherType.SalesQuotation && (
                  <li className="flex flex-wrap gap-1 pt-2 border-t border-gray-200 dark:border-dark-border">
                    <BtnTender
                      formState={formState}
                      dispatch={dispatch}
                      tenderBtnClick={() => handleTenderOpen()}
                      t={t}
                    />
                    {/* <BtnPending
                      formState={formState}
                      dispatch={dispatch}
                      pendingBtnClick={() => window.open(window.location.href, "_blank")}
                      t={t}
                    /> */}
                  </li>
                )}
                {/* Field 13: Offer Achieved & Discount Slab Buttons */}
                {verticalVisibleFields <= 13 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                  <li className="flex flex-wrap gap-1">
                    <BtnOfferAchieved
                      formState={formState}
                      dispatch={dispatch}
                      offerAchievedBtnClick={() => giftOnBilling()}
                      t={t}
                    />
                    <BtnDiscountSlab
                      formState={formState}
                      dispatch={dispatch}
                      discSlabBtnClick={() => handleDiscountSlab()}
                      t={t}
                    />
                  </li>
                )}
                {/* Field 14: Balance Label */}
                {verticalVisibleFields <= 14 && (
                  formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                  formState.transaction.master.voucherType === VoucherType.SalesQuotation
                ) && formState.formElements.lblBillBalance.visible && (
                  <li>
                    <span className="text-xs font-medium whitespace-nowrap dark:text-dark-text">{t("bal")}: {formState.formElements.lblBillBalance.label}</span>
                  </li>
                )}
                {/* Field 15: SalesQuotation P Button */}
                {verticalVisibleFields <= 15 && formState.transaction.master.voucherType === VoucherType.SalesQuotation && (
                  <li>
                    <ERPButton
                      title={t("p")}
                      variant="secondary"
                      onClick={() => alert("P Button clicked")}
                    />
                  </li>
                )}
                {/* Field 16: SalesOrder - Load Excel & Advance Amount */}
                {verticalVisibleFields <= 16 && formState.transaction.master.voucherType === VoucherType.SalesOrder && (
                  <li className="flex flex-col gap-1">
                    <ERPButton
                      title={t('load_excel')}
                      onClick={handleTenderOpen}
                      className="px-2 w-fit"
                    />
                    <div className="flex flex-col p-1 border border-gray-300 dark:border-dark-border">
                      <label className="text-xs dark:text-dark-text">{t("advance_amount")}</label>
                      <div className="flex flex-row gap-1">
                        <ERPInput
                          id="AdvanceCashAmountVertical"
                          label={t("cash")}
                          labelDirection="horizontal"
                          type="number"
                          value={0.00}
                        />
                        <ERPInput
                          id="AdvanceCardAmountVertical"
                          label={t("card")}
                          labelDirection="horizontal"
                          type="number"
                          value={0.00}
                        />
                      </div>
                    </div>
                  </li>
                )}
                {/* Print on Save - always in popup */}
                <li>
                  {formState.formElements.printOnSave.visible && (
                    <ERPCheckbox
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                      id="printOnSavePopup"
                      label={t(formState.formElements.printOnSave.label)}
                      checked={formState.printOnSave}
                      onChange={(e) => dispatch(formStateHandleFieldChange({ fields: { printOnSave: e.target.checked }, }))}
                      disabled={formState.formElements.printOnSave?.disabled}
                    />
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <div className={`dark:bg-dark-bg-card ${footerLayout === "vertical" ? "" : "bg-white shadow-lg border dark:border-dark-border border-gray-200 overflow-hidden"}`}>
        {/* Vertical Layout Fields - show based on verticalVisibleFields count */}
        <div className={`${footerLayout === "vertical" ? "block" : "hidden"}`}>
          <div className="mb-2">
            <div className="grid grid-cols-1">
              {/* Field 0: Warehouse */}
              {verticalVisibleFields > 0 && (
                <div className="w-full">
                  <WarehouseID
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                </div>
              )}
              {/* Field 1: Price Category */}
              {verticalVisibleFields > 1 && (
                <div className="w-full">
                  <PriceCategoryCombobox
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                </div>
              )}
              {/* Field 2: Cost Centre */}
              {verticalVisibleFields > 2 && (
                <div className="w-full">
                  <CostCentreCombobox
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                </div>
              )}
              {/* Field 3: Supply Type */}
              {verticalVisibleFields > 3 && (
                <div className="w-full">
                  <SupplyTypeCombobox
                    isAppGlobal={isAppGlobal}
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleKeyDown={handleKeyDown}
                    handleFieldKeyDown={handleFieldKeyDown}
                  />
                </div>
              )}
              {/* Field 4: Add Amount Or JV */}
              {verticalVisibleFields > 4 && (
                <div className="w-full">
                  <AdjustmentAmountInput
                    transactionType={transactionType}
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                    handleKeyDown={handleKeyDown}
                  />
                </div>
              )}
              {/* Field 5: Checkboxes (Auto calculation, LB, Gate Pass) */}
              {verticalVisibleFields > 5 && (
                <div className="w-full flex flex-wrap items-center gap-2 mt-2">
                  {(formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                    formState.transaction.master.voucherType === VoucherType.SalesQuotation) && (
                    <AutoCalculationCheckbox
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                    />
                  )}
                  <IsLockedCheckbox
                    formState={formState}
                    dispatch={dispatch}
                    t={t}
                  />
                    {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && (
                      <ERPCheckbox
                        id="gatePassPrint"
                        label={t("gate_pass")}
                        disabled={!(applicationSettings.printerSettings.printGatePass || applicationSettings.printerSettings.printSelectedGatePass)}
                        data={formState}
                        checked={formState.gatePassPrint}
                        onChangeData={(e) => dispatch(formStateHandleFieldChange({
                          fields:{
                            gatePassPrint:e.gatePassPrint
                          }
                        }))}
                      />
                    )}
                </div>
              )}
              {/* Field 6: VAT # and Tax No */}
              {verticalVisibleFields > 6 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                <div className="w-full flex items-center gap-2 mt-1">
                  <ERPCheckbox
                    id="vatVerticalMain"
                    label={t("vat_#")}
                    data={formState}
                    checked={formState?.vatChecked}
                    onChange={(e) => dispatch(formStateHandleFieldChangeKeysOnly({ fields: { vatChecked: e.target.checked } }))}
                  />
                  <ERPInput
                    id="vatNoVerticalMain"
                    label={t("Tax no")}
                    type="string"
                    value={tokenNumberValue}
                    readOnly={!formState?.vatChecked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTokenNumberChange(e.target.value)}
                    className="flex-1"
                  />
                </div>
              )}
              {/* Field 7: Attachment */}
              {verticalVisibleFields > 7 && applicationSettings.branchSettings.fileAttachmentMethod !== 'No' && (
                <div className="w-full mt-1">
                  <button className="text-[#2563eb] dark:text-[#60a5fa]">
                    <span className="hover:underline text-[#0ea5e9] dark:text-[#60a5fa] capitalize" onClick={selectAttachment}>
                      {t("attachment")}
                    </span>
                  </button>
                </div>
              )}
              {/* Field 8: Credit Card Amount */}
              {verticalVisibleFields > 8 && formState.transaction.master.voucherType !== VoucherType.SalesReturn && (
                <div className="w-full mt-1">
                  <ERPInput
                    id="creditCardAmountVerticalMain"
                    label={t("credit_card_amount")}
                    type="number"
                    value={creditAmtValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCreditAmtChange(e.target.value)}
                  />
                </div>
              )}
              {/* Field 9: Coupon Amount */}
              {verticalVisibleFields > 9 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                <div className="w-full mt-1">
                  <ERPInput
                    id="couponAmountVerticalMain"
                    label={t("coupon_amount")}
                    type="number"
                    value={couponAmtValue}
                    disabled
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCouponAmtChange(e.target.value)}
                  />
                </div>
              )}
              {/* Field 10: SR Amount and SR Button */}
              {verticalVisibleFields > 10 && (
                formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                formState.transaction.master.voucherType === VoucherType.SalesReturn
              ) && (
                <div className="w-full flex items-end gap-1 mt-1">
                  {formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                    <div className="flex-1">
                      <ERPInput
                        id="srAmountVerticalMain"
                        label={t('sr_amount')}
                        type="number"
                        value={srAmountValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSrAmountChange(e.target.value)}
                      />
                    </div>
                  )}
                  <BtnSr
                    formState={formState}
                    dispatch={dispatch}
                    srBtnClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                    t={t}
                  />
                </div>
              )}
              {/* Field 11: GRN Print Button */}
              {verticalVisibleFields > 11 && (
                <div className="w-full mt-1">
                  <ERPButton
                    title={t("grn_print")}
                    variant="secondary"
                    disabled={formState.transactionLoading}
                  />
                </div>
              )}
              {/* Field 12: Tender, Pending, Privilege Card Buttons (SalesInvoice) */}
              {verticalVisibleFields > 12 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                <div className="w-full flex flex-wrap gap-1 mt-2">
                  <BtnTender
                    formState={formState}
                    dispatch={dispatch}
                    tenderBtnClick={() => handleTenderOpen()}
                    t={t}
                  />
                  {/* <BtnPending
                    formState={formState}
                    dispatch={dispatch}
                    pendingBtnClick={() => window.open(window.location.href, "_blank")}
                    t={t}
                  /> */}
                  <BtnPrivilegeCard
                    formState={formState}
                    dispatch={dispatch}
                    privilegeCardBtnClick={() => handlePrivilegeCardOpen()}
                    t={t}
                  />
                </div>
              )}
              {/* Field 12: Tender, Pending Buttons (SalesQuotation) */}
              {verticalVisibleFields > 12 && formState.transaction.master.voucherType === VoucherType.SalesQuotation && (
                <div className="w-full flex flex-wrap gap-1 mt-2">
                  <BtnTender
                    formState={formState}
                    dispatch={dispatch}
                    tenderBtnClick={() => handleTenderOpen()}
                    t={t}
                  />
                  {/* <BtnPending
                    formState={formState}
                    dispatch={dispatch}
                    pendingBtnClick={() => window.open(window.location.href, "_blank")}
                    t={t}
                  /> */}
                </div>
              )}
              {/* Field 13: Offer Achieved & Discount Slab Buttons */}
              {verticalVisibleFields > 13 && formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
                <div className="w-full flex flex-wrap gap-1 mt-1">
                  <BtnOfferAchieved
                    formState={formState}
                    dispatch={dispatch}
                    offerAchievedBtnClick={() => giftOnBilling()}
                    t={t}
                  />
                  <BtnDiscountSlab
                    formState={formState}
                    dispatch={dispatch}
                    discSlabBtnClick={() => handleDiscountSlab()}
                    t={t}
                  />
                </div>
              )}
              {/* Field 14: Balance Label */}
              {verticalVisibleFields > 14 && (
                formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
                formState.transaction.master.voucherType === VoucherType.SalesQuotation
              ) && formState.formElements.lblBillBalance.visible && (
                <div className="w-full mt-1">
                  <span className="text-xs font-medium whitespace-nowrap dark:text-dark-text">{t("bal")}: {formState.formElements.lblBillBalance.label}</span>
                </div>
              )}
              {/* Field 15: SalesQuotation P Button */}
              {verticalVisibleFields > 15 && formState.transaction.master.voucherType === VoucherType.SalesQuotation && (
                <div className="w-full mt-1">
                  <ERPButton
                    title={t("p")}
                    variant="secondary"
                    onClick={() => alert("P Button clicked")}
                  />
                </div>
              )}
              {/* Field 16: SalesOrder - Load Excel & Advance Amount */}
              {verticalVisibleFields > 16 && formState.transaction.master.voucherType === VoucherType.SalesOrder && (
                <div className="w-full flex flex-col gap-1 mt-1">
                  <ERPButton
                    title={t('load_excel')}
                    onClick={handleTenderOpen}
                    className="px-2 w-fit"
                  />
                  <div className="flex flex-col p-1 border border-gray-300 dark:border-dark-border">
                    <label className="text-xs dark:text-dark-text">{t("advance_amount")}</label>
                    <div className="flex flex-row gap-1">
                      <ERPInput
                        id="AdvanceCashAmountVerticalMain"
                        label={t("cash")}
                        labelDirection="horizontal"
                        type="number"
                        value={0.00}
                      />
                      <ERPInput
                        id="AdvanceCardAmountVerticalMain"
                        label={t("card")}
                        labelDirection="horizontal"
                        type="number"
                        value={0.00}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`grid ${footerLayout === "vertical" ? "grid-cols-1 gap-1" : "grid-cols-1 md:grid-cols-[1fr_minmax(200px,280px)] lg:grid-cols-[1fr_minmax(240px,320px)] xl:grid-cols-[1fr_minmax(280px,400px)]"}`}>
          <div className={`flex ${footerLayout === "vertical" ? "flex-col items-start justify-start" : "px-2 ps-[25px] py-1 flex-col md:flex-row items-end justify-end gap-4 min-w-0 overflow-x-auto"}`}>
            {footerLayout !== "vertical" && outsideComponents}
            <div className={`${footerLayout === "vertical" ? "flex flex-col items-start w-full" : "hidden md:flex flex-col items-start w-full md:w-auto"}`}>
              <div className={`flex ${footerLayout === "vertical" ? "flex-col items-start" : "items-end"} gap-2 mb-2`}>
                <div className={`flex items-center w-full ${footerLayout === "vertical" ? "justify-between" : "gap-2"}`}>
                  {1==1 && (
                    <CashPaidSection
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                      focusDiscount={focusDiscount}
                      focusAmount={focusAmount}
                      cashPaidVoucherType={formState.transaction.master.voucherType} // Managing cash paid or received
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
                    // required={true}
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    label={t(formState.formElements.remarks.label)}
                    value={formState.transaction.master.remarks}
                    onChange={(e) => dispatch(formStateTransactionMasterHandleFieldChange({ fields: { remarks: e.target?.value }, }))}
                    disabled={formState.formElements.remarks?.disabled || formState.formElements.pnlMasters?.disabled}
                    className={`dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text ${isNewFooter ? "h-[42px]" : ""}`}
                  />
                </div>
              </div>
              
              <div className={`${footerLayout === "vertical" ? "w-full max-w-[265px]" : "w-full md:w-[345px]"}`}>
                <div className="flex flex-col">
                      <EinvoiceLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
          <EWBLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
        <PostedTransactionLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
         <SRAmountLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
                </div>
              </div>
            </div>
          </div>

          <div className="py-2 px-2 md:pl-2 md:pr-4 dark:bg-dark-bg-card bg-gray-50 border-t md:border-t-0 md:border-l dark:border-dark-border border-gray-200 min-w-0">
            <div className="flex flex-col gap-1 sm:gap-1.5 max-w-full lg:max-w-none">
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
              <TaxOnDiscount
                formState={formState}
                dispatch={dispatch}
                taxOnDiscBtnClick={applyTaxOnBillDiscount}
                t={t}
              />
              <BillDiscountLabel
                formState={formState}
                dispatch={dispatch}
                t={t}
              />
              {/* <NetTotalLabel formState={formState} dispatch={dispatch} t={t} /> */}
              {formState.formElements.grandTotalFc.visible && (
                <div>
                  <div className="flex items-center justify-between dark:text-dark-text text-xs sm:text-sm">
                    <span className="truncate mr-2">{t(formState.formElements.grandTotalFc.label)}:</span>
                    <span className="flex-shrink-0">{formState.transaction.master.grandTotalFc}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center border-t-2 border-[#3b82f6] mt-1 pt-1">
                <span className="text-xs sm:text-sm font-bold dark:text-dark-text text-gray-900 uppercase truncate mr-2">
                  {t(formState.formElements.grandTotal.label)}
                </span>
                <span className="text-base sm:text-lg md:text-xl font-bold text-[#3b82f6] flex-shrink-0">
                  {getFormattedValue(formState.transaction.master?.grandTotal ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-2 dark:bg-dark-bg-card bg-gray-100 border-t dark:border-dark-border border-gray-200 flex ${footerLayout === "vertical" ? "flex-col" : "flex-col md:flex-row justify-between items-center gap-4"}`}>
          <div>
            {/* {formState.formElements.printOnSave.visible && ( */}
            <ERPCheckbox
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="printOnSave"
              label={t(formState.formElements.printOnSave.label)}
              checked={formState.printOnSave}
              onChange={(e) => dispatch(formStateHandleFieldChange({ fields: { printOnSave: e.target.checked }, }))}
              disabled={formState.formElements.printOnSave?.disabled}
              className="dark:text-dark-text"
            />
            {/* )} */}
          </div>
          <div className="flex justify-end gap-2 w-full sm:w-auto">
            <ConfettiWrapper onOriginalClick={save} triggerConfetti={formState.savingCompleted}>
              <ERPButton
                variant="primary"
                ref={btnSaveRef}
                jumpTarget="save"
                title={t("save")}
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
        {/* <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
          <PriceCategoryCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
        </div>
          <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
          <SupplyTypeCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            handleKeyDown={handleKeyDown}
            handleFieldKeyDown={handleFieldKeyDown}
          />
          </div> */}
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
        {!showSecondHalf && (
          <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0 flex">
            {formState.transaction.master.voucherType !== VoucherType.SalesReturn && (
              <ERPInput
                id="creditCardAmount"
                label={t("credit_card_amount")}
                type="number"
                value={creditAmtValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCreditAmtChange(e.target.value)}
              />
            )}
            {(formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
              <ERPInput
                id="couponAmount"
                label={t("coupon_amount")}
                type="number"
                disabled
                value={couponAmtValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCouponAmtChange(e.target.value)}
              />
            ))}
          </div>
        )}
        {!showSecondHalf && (

          <div className="flex items-end gap-1">

            <div className="flex items-end gap-1">
              {
                formState.formElements.lBLCashPaid.visible && (
                  <>
                    {formState.formElements.lBLCashPaid.label}
                  </>
                )
              }
            </div>
            {formState.transaction.master.voucherType === VoucherType.SalesInvoice && (
              <div className="w-full sm:max-w-[180px] mb-2 sm:mb-0">
                <ERPInput
                  id="srAmount"
                  label={t('sr_amount')}
                  type="number"
                  value={srAmountValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSrAmountChange(e.target.value)}
                />
              </div>
            )}
            {(formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
              formState.transaction.master.voucherType === VoucherType.SalesReturn) && (
                // <ERPButton
                //   title={t("sr")}
                //   className="!h-[38px] !px-3"
                //   onClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                // />
                <BtnSr
                  formState={formState}
                  dispatch={dispatch}
                  srBtnClick={() => handleSalesReturnOpen(formState.transaction.master.voucherType)}
                  t={t}
                />
              )}
          </div>
        )}
        {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && !showButtonsOutside && (
          <>
            <BtnTender
              formState={formState}
              dispatch={dispatch}
              tenderBtnClick={() => handleTenderOpen()}
              t={t}
            />
            {/* <ERPButton
              title={t('tender')}
              onClick={handleTenderOpen}
            /> */}
            {/* <ERPButton
              title={t('pending')}
              variant="custom"
              customVariant="bg-[#0d7377] hover:bg-[#0a5c5f] text-white"
            /> */}
            {/* <BtnPending
              formState={formState}
              dispatch={dispatch}
              pendingBtnClick={() => window.open(window.location.href, "_blank")}
              t={t}
            /> */}

            <BtnPrivilegeCard
              formState={formState}
              dispatch={dispatch}
              privilegeCardBtnClick={() => handlePrivilegeCardOpen()}
              t={t}
            />
            {/* <ERPButton
              title={t('privilege_card')}
              onClick={handlePrivilegeCardOpen}
              variant="custom"
              customVariant="bg-[#9b87f5] hover:bg-[#8b75e5] text-white"
            /> */}
            <BtnOfferAchieved
              formState={formState}
              dispatch={dispatch}
              offerAchievedBtnClick={() => giftOnBilling()}
              t={t}
            />

            <BtnDiscountSlab
              formState={formState}
              dispatch={dispatch}
              discSlabBtnClick={() => handleDiscountSlab()}
              t={t}
            />
          </>
        )}
        {(formState.transaction.master.voucherType === VoucherType.SalesQuotation) && !showButtonsOutside && (
          <div className="flex items-center gap-1">
            <BtnTender
              formState={formState}
              dispatch={dispatch}
              tenderBtnClick={() => handleTenderOpen()}
              t={t}
            />
            {/* <ERPButton
                title={t('tender')}
                onClick={handleTenderOpen}
              /> */}
            {/* <ERPButton
                title={t('pending')}
                variant="custom"
                customVariant="bg-[#0d7377] hover:bg-[#0a5c5f] text-white"
              /> */}
            {/* <BtnPending
              formState={formState}
              dispatch={dispatch}
              pendingBtnClick={() => window.open(window.location.href, "_blank")}
              t={t}
            /> */}
            {/* Need to make the P button into standard btn component format */}
            <ERPButton
              title={t("p")}
              variant="secondary"
              onClick={() => alert("P Button clicked")}
            />
          </div>
        )}
        {(formState.transaction.master.voucherType === VoucherType.SalesOrder) && !showButtonsOutside && (
          <div className="flex gap-1">
            <ERPButton
              title={t('load_excel')}
              onClick={handleTenderOpen}
              className="px-2 w-fit"
            />
            <div className="flex flex-col p-1 border border-gray-300 ">
              <label>{t("advance_amount")}</label>
              <div className="flex flex-row  gap-1">
                <ERPInput
                  id="AdvanceCashAmount"
                  label={t("cash")}
                  labelDirection="horizontal"
                  type="number"
                  value={0.00}
                />
                <ERPInput
                  id="AdvanceCardAmount"
                  label={t("card")}
                  labelDirection="horizontal"
                  type="number"
                  value={0.00}
                />
              </div>
            </div>
          </div>
        )}
        {!showSecondHalf && (
          <div className="flex items-center gap-2 text-sm dark:text-dark-text">
            {/* {(formState.transaction.master.voucherType === VoucherType.SalesInvoice) && (
                <div className="flex gap-1">
                  <span className="text-xs font-medium whitespace-nowrap">{t("l_bill_amount")}:</span><span className="text-xs font-semibold">0.00</span>
                  <span className="text-xs font-medium whitespace-nowrap">{t("adv_bal")}:</span><span className="text-xs font-semibold">0.00</span>
                </div>
              )} */}
            {(
              formState.transaction.master.voucherType === VoucherType.SalesInvoice ||
              formState.transaction.master.voucherType === VoucherType.SalesQuotation
            ) && formState.formElements.lblBillBalance.visible && (
                <div>
                  <span className="text-xs font-bold text-blue-700 whitespace-nowrap">{t("bal")}: {formState.formElements.lblBillBalance.label}</span><span className="text-xs font-semibold"></span>
                </div>
              )}

          </div>
        )}
        {!showCheckboxesOutside && (
          <div className="w-full mb-2 sm:mb-0 sm:w-auto">
            {checkboxesComponent}
          </div>
        )}
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
              {1 == 1 && (
                <CashPaidSection
                  formState={formState}
                  dispatch={dispatch}
                  t={t}
                  focusDiscount={focusDiscount}
                  focusAmount={focusAmount}
                  cashPaidVoucherType={formState.transaction.master.voucherType} // Managing cash paid or received
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
              onChange={(e) => dispatch(formStateTransactionMasterHandleFieldChange({ fields: { remarks: e.target?.value }, }))}
              disabled={formState.formElements.remarks?.disabled || formState.formElements.pnlMasters?.disabled}
              className={`dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text ${isNewFooter ? "h-[42px]" : ""} w-full`}
            />
              <EinvoiceLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
          <EWBLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
        <PostedTransactionLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
         <SRAmountLabel
          formState={formState}
          dispatch={dispatch}
          t={t}
        />
          </div>
        </div>
      </div>
    </div>
  );

  const minimalContent = (
    <div className="p-2 mt-1 mb-2 sm:mb-3 dark:bg-dark-bg-card bg-gray-50 border dark:border-dark-border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 gap-1 sm:gap-1.5">
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
        <TaxOnDiscount
          formState={formState}
          dispatch={dispatch}
          taxOnDiscBtnClick={applyTaxOnBillDiscount}
          t={t}
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
            <div className="flex items-center justify-between dark:text-dark-text text-xs sm:text-sm">
              <span className="truncate mr-2">
                {t(formState.formElements.grandTotalFc.label)}:
              </span>
              <span className="flex-shrink-0">{formState.transaction.master.grandTotalFc}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const selectedFooter = renderSecondFooter();
  const getInputHeight = () => {
    return formState.userConfig?.inputBoxStyle?.inputSize == "sm"
      ? remToPx(0) : formState.userConfig?.inputBoxStyle?.inputSize == "md"
        ? remToPx(0.75) : formState.userConfig?.inputBoxStyle?.inputSize == "lg"
          ? remToPx(1.375) : formState.userConfig?.inputBoxStyle?.inputSize == "customize"
            ? (remToPx(formState.userConfig?.inputBoxStyle?.inputHeight) ?? 0) - 23 : 0
  }

  if (formState.userConfig?.footerPosition === "right") {
    return (
      <>
        {formState.tenderOpen && (
          <Tender
            isOpen={formState.tenderOpen}
            onClose={handleTenderClose}
            t={t}
          />
        )}
        {formState.privilegeCardOpen && (
          <PrivilegeCardEntry
            isOpen={formState.privilegeCardOpen}
            onClose={handlePrivilegeCardClose}
            formState={formState}
            t={t}
            data={""}
          />
        )}
        {isModalOpen && isModalOpen.visible && [VoucherType.SalesInvoice, VoucherType.SalesReturn,].includes(formState.transaction.master.voucherType as VoucherType) && (
          <ERPModal
            isOpen={isModalOpen.visible}
            title={isModalOpen.type}
            width={550}
            height={200}
            closeModal={closeModal}
            content={
              // Need to update this based on the upcoming condition
              <VoucherLoader
                updateDeliveryNoteNumber={["SI", "SR"].includes(isModalOpen.type)}
                fromVoucherType={
                  isModalOpen.type == "SI_Ref" ? VoucherType.SalesInvoice : formState.transaction.master.voucherType === VoucherType.SalesInvoice ? VoucherType.GoodsReceiptNote : ""
                  
                }
                dispatch={dispatch}
                formState={formState}
                closeModal={closeModal}
                t={t}
                loadAndSetTransVoucher={loadAndSetTransVoucher}
              />
            }
          />
        )}
        <div
          className={`fixed ${isRtl ? "left-0" : "right-0"} h-[-webkit-fill-available] overflow-y-scroll w-[280px] sm:w-[300px] shadow-lg p-2 z-30`}
          style={{ top: `${170 + (getInputHeight())}px`, backgroundColor: formState.userConfig?.footerBg ? `rgb(${formState.userConfig.footerBg})` : '#f8f8ff', }}>
          {renderSecondFooter()}
        </div>
      </>
    );
  } else {
    return (
      <>
        {dropupState !== 'closed' && hasDropupContent && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-30" onClick={() => setDropupState('closed')} />
        )}
        {formState.tenderOpen && (
          <Tender
            isOpen={formState.tenderOpen}
            onClose={handleTenderClose}
            t={t}
          />
        )}
        {formState.privilegeCardOpen && (
          <PrivilegeCardEntry
            isOpen={formState.privilegeCardOpen}
            onClose={handlePrivilegeCardClose}
            formState={formState}
            t={t}
            data={""}
          />
        )}
        {isModalOpen && isModalOpen.visible && [VoucherType.SalesInvoice, VoucherType.SalesReturn,].includes(formState.transaction.master.voucherType as VoucherType) && (
          <ERPModal
            isOpen={isModalOpen.visible}
            title={isModalOpen.type}
            width={550}
            height={200}
            closeModal={closeModal}
            content={
              <VoucherLoader
                // Need to update this based on the upcoming condition
                updateDeliveryNoteNumber={["SI", "SR"].includes(isModalOpen.type)}
                fromVoucherType={isModalOpen.type == "SI_Ref" ? VoucherType.SalesInvoice : formState.transaction.master.voucherType === VoucherType.SalesInvoice ? VoucherType.GoodsReceiptNote : ""
                
                }
                dispatch={dispatch}
                formState={formState}
                closeModal={closeModal}
                t={t}
                loadAndSetTransVoucher={loadAndSetTransVoucher}
              />
            }
          />
        )}
        {!(isMobileView || deviceInfo?.isMobile) && (
          <div ref={footerContainerRef} className={`fixed dark:bg-dark-bg ${footerLayout === "vertical" ? `top-[170px] ${isRtl ? "left-0" : "right-0"} h-[-webkit-fill-available] w-[280px] sm:w-[300px] overflow-y-auto p-2 z-20 bg-white border-l dark:border-dark-border border-l-slate-200` : "z-40 bottom-0 left-0 right-0 lg:ps-60 shadow-lg dark:bg-dark-bg bg-[#f8f8ff]"}`}>
            {footerLayout !== "vertical" && (
              <div className="absolute top-1.5 left-1 lg:left-[15.25rem] z-10">
                <button onClick={toggleFooterPosition} className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-dark-bg opacity-50 hover:opacity-100 transition-all duration-300" title={t("display_the_footer_on_the_right")}>
                  <PanelRight className="text-[#b3b3b9] dark:text-dark-text w-4 h-4" />
                </button>
              </div>
            )}
            {hasDropupContent && (
              <div className={`${footerLayout === "vertical" ? "hidden" : "block"}`}>
                <div className="relative w-full">
                  {/* ChevronUp button - at footer when closed */}
                  {dropupState === 'closed' && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-[-18px] z-50">
                      <button
                        onClick={handleIconClick}
                        className="flex items-center h-[20px] justify-center rounded-t-full border border-b-0 border-gray-300 dark:border-dark-border dark:bg-dark-bg-card bg-[#f8f8ff] transition-all duration-300 ease-in-out"
                        style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)" }}
                      >
                        <ChevronUp
                          className={`mx-2 my-0.5  dark:text-dark-text ${hasAnimated ? "" : "animate-[bounce_2s_1]"}`}
                          size={24}
                        />
                      </button>
                    </div>
                  )}
                  {/* Dropdown expands upward - fixed positioned above footer */}
                  <div
                    ref={dropUpRef}
                    className={`absolute left-0 right-0 bottom-full transition-all duration-300 ease-in-out dark:bg-dark-bg bg-[#f8f8ff] border dark:border-dark-border border-gray-200 rounded-t-lg z-50 ${dropupState === 'full' ? "max-h-[40vh] overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
                  >
                    {/* ChevronUp at TOP of dropdown when open */}
                    {dropupState === 'full' && (
                      <div className="sticky top-0 z-10 h-[10px] flex justify-center dark:bg-dark-bg bg-[#f8f8ff]">
                        <button
                          onClick={handleIconClick}
                          className="flex items-center justify-center rounded-b-full h-[20px] border border-t-0 border-gray-300 dark:border-dark-border dark:bg-dark-bg-card bg-[#f8f8ff] transition-all duration-300 ease-in-out"
                          style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                        >
                          <ChevronUp
                            className="mx-2 my-0.5  dark:text-dark-text rotate-180"
                            size={24}
                          />
                        </button>
                      </div>
                    )}
                    {dropdownContent}
                  </div>
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
        {(isMobileView || deviceInfo?.isMobile) && (
          <div className="z-40 fixed bottom-0 left-0 right-0 dark:bg-dark-bg bg-[#f8f8ff] shadow-lg px-2 sm:px-3 py-2 mb-[65px]"
            style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)", }}>
            {hasDropupContent && (
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
              <div className="grid grid-cols-1 gap-1">
                {formState.formElements.grandTotalFc.visible && (
                  <div>
                    <div className="flex items-center justify-between dark:text-dark-text text-xs sm:text-sm">
                      <span className="truncate mr-2">
                        {t(formState.formElements.grandTotalFc.label)}
                      </span>
                      <span className="flex-shrink-0">:{formState.transaction.master.grandTotalFc}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* <div className="hidden sm:block mr-2">
                  <h6 className="font-semibold whitespace-nowrap text-[18px] sm:text-[20px] dark:text-dark-text">
                    <span className="!font-medium dark:!text-dark-text !text-gray-600 text-sm sm:text-base">
                        {t("total")}:{" "}
                      </span>
                      {getFormattedValue(formState.transaction.master?.roundAmount ?? 0)}
                    </h6>
                </div> */}
                <div className="fixed bottom-0 left-0 right-0 w-full dark:bg-dark-bg-card bg-[#f8f8ff] flex flex-col py-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <div className="border-b border-gray-200 dark:border-dark-border">
                    <div className="flex justify-between items-center px-2 sm:px-4">
                      <span className="text-xs sm:text-sm font-bold dark:text-dark-text text-gray-900 uppercase truncate mr-2">
                        {t(formState.formElements.grandTotal.label)}
                      </span>
                      {/* <span className="text-lg sm:text-xl font-bold text-[#3b82f6] flex-shrink-0"> */}
                         <span className="text-base sm:text-lg font-bold text-[#3b82f6]">
                        {getFormattedValue(formState.transaction.master?.grandTotal ?? 0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 px-2 sm:px-4">
                    <ERPButton
                      title={t("close")}
                      onClick={() => goToPreviousPage()}
                      className="flex-1 rounded-none !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg text-sm sm:text-base"
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                    />
                    <ConfettiWrapper onOriginalClick={save}>
                      <ERPButton
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        ref={btnSaveRef}
                        title={t("save")}
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