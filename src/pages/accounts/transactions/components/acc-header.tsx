import { AccTransactionFormState, AccUserConfig, AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateHandleFieldChange } from "../reducer";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import AccExcelImport from "../acc-Excel-Import";
import { AccTransactionUserConfig } from "../acc-transaction-user-config";
import { EllipsisVertical, KeyRound, Pencil, Printer, RefreshCw, Trash2, ChevronUp, BadgePlusIcon, Eraser, X, FileUp, History, AlignHorizontalSpaceBetween, } from "lucide-react";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { setTemplate } from "../../../../redux/slices/templates/reducer";
import { toggleTemplateChooserModal } from "../../../../redux/slices/popup-reducer";

interface AccHeaderProps extends AccVoucherElementProps {
  loadTemporaryRows: () => Promise<void>;
  deleteAccTransVoucher: () => void;
  handleRefresh: () => void;
  createNewVoucher: () => void;
  handleEdit: () => void;
  printVoucher: (
    masterID: number,
    transactionType: string,
    voucherType: string,
    formType: string,
    customerType: string,
    isInvTrans?: boolean,
    printPreview?: boolean,
    printTmeplate?: any,
    transDate?: string,
    printData?: any,
    templateId?: number
  ) => Promise<void>;
  handleClearControls: () => void;
  handleHistoryClick: () => void;
  setIsHistorySidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionType?: string;
  voucherType: string;
  userSession: { dbIdValue: string };
  unlockVoucher: () => void;
  setShowValidation: React.Dispatch<React.SetStateAction<boolean>>;
  showValidation: boolean;
  goToPreviousPage: () => void;
  isHistorySidebarOpen: boolean;
  phone?: boolean;
  printPaymentReceiptAdvice: (voucherType?: any) => Promise<void>
}

const AccHeader = React.forwardRef<HTMLInputElement, AccHeaderProps>(
  (
    {
      formState,
      dispatch,
      handleKeyDown,
      t,
      loadTemporaryRows,
      deleteAccTransVoucher,
      handleRefresh,
      createNewVoucher,
      handleEdit,
      printVoucher,
      handleClearControls,
      handleHistoryClick,
      setIsHistorySidebarOpen,
      transactionType,
      voucherType,
      userSession,
      unlockVoucher,
      setShowValidation,
      showValidation,
      goToPreviousPage,
      isHistorySidebarOpen,
      phone = false,
      printPaymentReceiptAdvice,
    },
    ref
  ) => {
    const { appState } = useAppState();
    const isRtl = appState.locale.rtl;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const popupStyle = {
      top: "44px",
      [isRtl ? "right" : "left"]: "-211px",
      width: "251px",
    };
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        // Check if the click is outside the popup AND not on the button
        if (
          popupRef.current &&
          !popupRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsPopupVisible(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    const selectTemplates = useCallback(async () => {
      dispatch(
        toggleTemplateChooserModal({ isOpen: true, templateGroup: formState.transaction.master?.voucherType, customerType: formState.transaction.master?.customerType, formType: formState.transaction.master?.formType,isInv:false })
      );
    }, [formState.transaction.master?.voucherType]);
    const handleFieldChange = (field: keyof AccUserConfig, value: any) => {
      const updatedUserConfig = {
        ...formState.userConfig,
        [field]: value,
      };
      dispatch(accFormStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }));
    };
    return (
      <div className={`!overflow-visible flex items-center ${phone ? 'justify-evenly' : 'justify-end'}  space-x-2 p-1 w-full overflow-x-auto ${phone ? 'bg-[#f9fafb]' : ''} ${phone ? '' : ''} ${phone ? '' : ''}`}>
        {/* Load Temp Rows */}
        <div className="group relative inline-flex flex-col items-center ps-[5px]" title="Load Details">
          <button
            disabled={formState.formElements.pnlMasters.disabled}
            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
            onClick={loadTemporaryRows}
          >
            <ChevronUp className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* Delete Button */}
        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("delete")}>
          <button
            disabled={formState.transaction.master.accTransactionMasterID < 1 || (formState.transaction.master.accTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
            onClick={deleteAccTransVoucher}
          >
            <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* Refresh Button */}
        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("refresh")}>
          <button
            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* Create New Voucher */}
        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clone")}>
          <button
            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
            onClick={createNewVoucher}
          >
            <BadgePlusIcon className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* Edit Button */}
        {formState.formElements.lnkUnlockVoucher.visible !== true && (
          <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
            <button
              disabled={formState.transaction.master.accTransactionMasterID < 1 || (formState.transaction.master.accTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleEdit}
            >
              <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>
        )}

        {/* Print Button */}
        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("print")}>
          <button
            disabled={formState.transaction.master.accTransactionMasterID < 1 || (formState.transaction.master.accTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}

            onClick={async () =>
              await printVoucher(
                formState.transaction.master.accTransactionMasterID,  // masterID
                transactionType ?? "",                       // transactionType
                voucherType ?? "",        // voucherType
                formState.transaction?.master?.formType ?? "",           // formType
                formState.transaction?.master.customerType ?? "",       // customerType
                false,//is inv
                formState.userConfig?.printPreview ?? false,  //priview
                undefined,                                            // printTmeplate (optional)
                formState.transaction?.master.transactionDate ?? "",
                undefined,  //tmepData
                formState?.lastChoosedTemplate?.id  //lastchoose tempId
              )
            }
          >
            <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* Clear Button */}
        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clear")}>
          <button
            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
            onClick={handleClearControls}
          >
            <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* History Button */}
        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("history")}>
          <button
            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
            onClick={handleHistoryClick}
          >
            <History className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* History Sidebar */}


        {/* Settings Button */}
        <div>
          {phone ? <AccTransactionUserConfig phone={true} /> : <AccTransactionUserConfig />}
        </div>

        {/* Popup Menu */}
        <div className="relative">
          <button ref={buttonRef} onClick={() => setIsPopupVisible((prev: any) => !prev)} className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-0.5' : 'p-3'}  rounded-md hover:bg-gray-200 transition-colors`} title={t("more")}>
            <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
          </button>

          {isPopupVisible && (
            <div ref={popupRef} className="absolute rounded-md dark:bg-dark-bg dark:text-dark-text bg-gray-100 shadow-md border border-gray-300 p-4 z-50" style={popupStyle}>
              <nav className="w-full dark:bg-dark-bg dark:text-dark-text bg-gray-100 text-black">
                <ul className="space-y-1">
                  <li>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-400 hover:text-black transition-colors rounded-sm" onClick={(e) => { printPaymentReceiptAdvice(voucherType,); }}>
                      <Printer className="h-4 w-4" />
                      <span>{t("print_payment_advise")}</span>
                    </button>
                  </li>

                  {formState.formElements.lnkUnlockVoucher.visible && (
                    <li>
                      <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm" onClick={(e) => { unlockVoucher(); }} >
                        <KeyRound className="h-4 w-4" />
                        <span>{t("unlock_voucher")}</span>
                      </button>
                    </li>
                  )}

                  {formState.transaction.master.voucherType === "MJV" && userSession.dbIdValue === "ABCO" && (
                    <li>
                      <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm" onClick={() => setShowValidation(true)}>
                        <FileUp className="h-4 w-4" />
                        <span>{t("MJV_excel_import")}</span>
                      </button>
                    </li>
                  )}

                  {formState.formElements.foreignCurrency.visible && (
                    <li>
                      <ERPCheckbox
                        id="foreignCurrency"
                        label={formState.formElements.foreignCurrency.label}
                        className="test23 w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                        checked={formState.foreignCurrency}
                        onChange={(e) =>
                          dispatch(
                            accFormStateHandleFieldChange({
                              fields: {
                                foreignCurrency: e.target.checked,
                              },
                            })
                          )
                        }
                        disabled={formState.formElements.foreignCurrency?.disabled || formState.formElements.pnlMasters?.disabled}
                      />
                    </li>
                  )}

                  <li>
                    <button onClick={selectTemplates} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm">
                      <AlignHorizontalSpaceBetween className="h-4 w-4" />
                      {t("change_template")}
                    </button>
                  </li>

                  {formState.formElements.printPreview.visible && (
                    <li>
                      <ERPCheckbox
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        id="printPreview"
                        className="test23 w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                        label={t(formState.formElements.printPreview.label)}
                        checked={formState.userConfig?.printPreview}
                        onChange={(e) => handleFieldChange("printPreview", e.target.checked)}
                        disabled={formState.formElements.printPreview?.disabled}
                      />
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
          {showValidation && (
            <ERPModal
              isForm={true}
              isOpen={showValidation}
              closeButton="LeftArrow"
              hasSubmit={false}
              closeTitle={t("close")}
              title={t("MJV_excel_import")}
              width={1000}
              height={800}
              isFullHeight={true}
              closeModal={() => setShowValidation(false)}
              content={<AccExcelImport />}
            />
          )}
        </div>

        {/* Previous Page Button */}
        {!phone && (
          <div className="relative">
            <button
              disabled={formState.transactionLoading}
              onClick={(e) => { e.preventDefault(); goToPreviousPage() }}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
              title={t("close")}>
              <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default React.memo(AccHeader);
