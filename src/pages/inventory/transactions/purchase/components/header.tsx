import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import { TransactionUserConfig } from "../../purchase/transaction-user-config";
import { EllipsisVertical, KeyRound, Pencil, Printer, RefreshCw, Trash2, ChevronUp, BadgePlusIcon, Eraser, X, FileUp, History, AlignHorizontalSpaceBetween, Boxes, Group, DollarSign, Download, Package, ShoppingCart, Upload, } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import PendingOrderList from "../pending-order-list";
import ERPFileUploadButton from "../../../../../components/ERPComponents/erp-file-upload-button";
import VoucherType from "../../../../../enums/voucher-types";
import { useAppState } from "../../../../../utilities/hooks/useAppState";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { formStateHandleFieldChange } from "../../reducer";
import { VoucherElementProps, BillwiseData } from "../../transaction-types";

interface HeaderProps extends VoucherElementProps {
  loadTemporaryRows: () => Promise<void>;
  deleteTransVoucher: () => void;
  handleRefresh: () => void;
  createNewVoucher: () => void;
  handleEdit: () => void;
  printVoucher: ( masterID: number,transactionType: string,voucherType: string,formType:string,customerType:string,isInvTrans: boolean,printPreview:boolean, printTmeplate?:any ,transDate?: string,
   ) => void;
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
  onProcessSelected: ((masterIds: string, branchIDs: string, voucherNumbers: string, referenceNumber: string, loadType: string, voucherType: string) => void) | undefined;
  downloadImportTemplateHeadersOnly: any;
  importFromExcel: any;

  undoEditMode: (
    isEdit: boolean,
    transactionMasterId: number
  ) => void;
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  return matches;
};



const Header = React.forwardRef<HTMLInputElement, HeaderProps>(
  (
    {
      formState,
      dispatch,
      handleKeyDown,
      t,
      loadTemporaryRows,
      deleteTransVoucher,
      handleRefresh,
      createNewVoucher,
      handleEdit,
      printVoucher,
      handleClearControls,
      handleHistoryClick,
      transactionType,
      voucherType,
      userSession,
      unlockVoucher,
      setShowValidation,
      showValidation,
      goToPreviousPage,
      phone = false,
      onProcessSelected,
      downloadImportTemplateHeadersOnly,
      importFromExcel,
      undoEditMode
    }, ref) => {
    const { appState } = useAppState();
    const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
    const isRtl = appState.locale.rtl;
    const popupRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isLoadMultiModalOpen, setIsLoadMultiModalOpen] = useState(false);
    const [isPendingOrderOpen, setIsPendingOrderOpen] = useState({ open: false, type: "PO" });
    const [isImportExcelOpen, setIsImportExcelOpen] = useState(false)

    const popupStyle = {
      top: "45px",
      [isRtl ? "right" : "left"]: "-231px",
      width: "273px",
    };

    const closeMenuPopup = () => {
      dispatch(formStateHandleFieldChange({ fields: { headerMenuOpen: false }, }));
    };
    const selectTemplates = () => {
      dispatch(formStateHandleFieldChange({ fields: {templateChooserModal: true }, }));
    }
    const openMenuPopup = () => {
      dispatch(formStateHandleFieldChange({ fields: { headerMenuOpen: true }, }));
    };

    const handleBillwiseClick = useCallback(async () => {
      try {
        // 1. Check if ledger is billwise applicable
        const isBillwise = formState.ledgerData.billwiseApplicable;

        if (isBillwise) {
          let billwiseStr = formState.transaction.master.billWiseString;

          // 2. Fetch transaction details for billwise
          const accTransactionDetailId =
            formState.transaction.master.accTransactionDetailIDForBillwise;

          try {
            const api = new APIClient();
            const billwise = await api.getAsync(
              `${Urls.inv_transaction_base}${formState.transactionType}/BillwiseMaster/?LedgerId=${formState.transaction.master.ledgerID}&DrCr=Dr&AccTransactionDetailID=${accTransactionDetailId}`
            );

            if (accTransactionDetailId > 0) {
              billwise.map((x: BillwiseData) => ({
                ...x,
                balanceAfter: x.balance - x.billwiseAmount,
              }));
            }

            setTimeout(() => {
              dispatch(
                formStateHandleFieldChange({
                  fields: {
                    billwiseData: billwise,
                    billwiseDetails: formState.transaction.master.billWiseString,
                    ledgerBillWiseLoading: false,
                    showbillwise: true,
                    billwiseDrCr: "Dr",
                  },
                })
              );
            }, 0);
          } catch (err) {
            console.error("Error opening Billwise form", err);
          }
        } else {
          alert("Please check selected party is bill wise or not.");
        }
      } catch (err) {
        console.error("Error in Billwise Click", err);
      }
    }, [formState, dispatch]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          popupRef.current &&
          !popupRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          closeMenuPopup();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
    const onChooseTemplate = async () => { downloadImportTemplateHeadersOnly && downloadImportTemplateHeadersOnly() }
    const onSelectExcel = async (event: React.ChangeEvent<HTMLInputElement>) => { importFromExcel && importFromExcel(event) };
    const isAbove768 = useMediaQuery('(min-width: 768px)');
    const isAbove640 = useMediaQuery('(min-width: 640px)');
    const isAbove480 = useMediaQuery('(min-width: 480px)');

    return (
      <>
        <div className={`!overflow-visible flex items-center justify-evenly md:justify-end space-x-2 p-1 w-full overflow-x-auto bg-[#f9fafb] md:bg-transparent`}>
          {/* Load Temp Rows */}
          <div className="group relative inline-flex flex-col items-center ps-[5px]" title="Load Details">
            <button
              disabled={formState.formElements.pnlMasters?.disabled}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
              onClick={loadTemporaryRows}>
              <ChevronUp className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Delete Button */}
          {isAbove480 && (
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("delete")}>
              <button
                disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master?.invTransactionMasterID > 0 && formState.formElements?.pnlMasters?.disabled !== true)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
                onClick={deleteTransVoucher}>
                <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* Refresh Button */}
          <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("refresh")}>
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Create New Voucher */}
          <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clone")}>
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
              onClick={createNewVoucher}>
              <BadgePlusIcon className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Edit Button */}
          {formState.formElements.lnkUnlockVoucher?.visible !== true && isAbove480 && (
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
              <button
                disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
                onClick={handleEdit}>
                <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* Print Button */}
          {isAbove640 && (
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("print")}>
              <button
                disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
                 onClick={() =>
                    printVoucher(
                      formState.transaction?.master.invTransactionMasterID,  // masterID
                      transactionType ?? "",                       // transactionType
                      voucherType ?? "",        // voucherType
                      formState.transaction?.master?.voucherForm?? "",           // formType
                      formState.transaction?.master.customerType ?? "",       // customerType
                      true,  
                      formState.userConfig?.printPreview??false,
                      undefined,                                            // printTmeplate (optional)
                      formState.transaction?.master.transactionDate ?? "",
                      
                    )
                  }
                >
                <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* Clear Button */}
          {isAbove640 && (
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clear")}>
              <button
                disabled={formState.transactionLoading}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
                onClick={handleClearControls}>
                <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* Product Summary */}
          {formState.formElements.btnProductSummary.visible == true && isAbove768 && (
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("product_summary")}>
              <button
                disabled={formState.transactionLoading}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() => dispatch(formStateHandleFieldChange({ fields: { isProductSummaryOpen: true }, }))}>
                <Boxes className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* partywise summary */}
          {isAbove768 && (
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("party_wise_summary")}>
              <button
                disabled={formState.transactionLoading}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() => dispatch(formStateHandleFieldChange({ fields: { isPartyWiseSummaryOpen: true }, }))}>
                <Group className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* History Button */}
          {isAbove768 && (
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("history")}>
              <button
                disabled={formState.transactionLoading}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3 rounded-md hover:bg-gray-200 transition-colors`}
                onClick={handleHistoryClick}>
                <History className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* Settings Button */}
          <button disabled={formState.transactionLoading} >
            {phone ? (<TransactionUserConfig phone={true} transactionType={transactionType ?? ""} undoEditMode={undoEditMode} />) : (<TransactionUserConfig transactionType={transactionType ?? ""} undoEditMode={undoEditMode} />)}
          </button>

          {/* Popup Menu */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={openMenuPopup}
              disabled={formState.transactionLoading}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-1.5 md:p-3  rounded-md hover:bg-gray-200 transition-colors`}
              title={t("more")}>
              <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>

            {formState.headerMenuOpen && (
              <div
                ref={popupRef}
                className="absolute rounded-lg bg-white dark:bg-[#1f2937] text-black dark:text-[#f3f4f6] shadow-xl border border-[#e5e7eb] dark:border-[#374151] p-2 z-50 backdrop-blur-sm"
                style={popupStyle}>
                <nav className="w-full">
                  <ul className={`space-y-1 max-h-80 overflow-y-auto scrollbar-thin ${formState.transactionLoading ? 'pointer-events-none blur-sm' : ''}`}>
                    {formState.formElements.lnkUnlockVoucher?.visible && (
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#eff6ff] hover:text-[#1d4ed8] dark:hover:bg-[#1e3a8a4d] dark:hover:text-[#93c5fd] transition-all duration-200 rounded-md group text-left"
                          onClick={unlockVoucher}>
                          <div className="w-8 h-8 bg-[#dbeafe] dark:bg-[#1e40af4d] rounded-full flex items-center justify-center group-hover:bg-[#bfdbfe] dark:group-hover:bg-[#1e3a8a4d] group-hover:scale-110 transition-all duration-200">
                            <KeyRound className="h-4 w-4 text-[#1e40af] dark:text-[#93c5fd]" />
                          </div>
                          <span className="font-medium">{t("unlock_voucher")}</span>
                        </button>
                      </li>
                    )}

                    {formState.transaction.master.voucherType === "MJV" &&
                      userSession.dbIdValue === "ABCO" && (
                        <li>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#f0fdf4] hover:text-[#15803d] dark:hover:bg-[#14532d4d] dark:hover:text-[#86efac] transition-all duration-200 rounded-md group text-left"
                            onClick={() => setShowValidation(true)}>
                            <div className="w-8 h-8 bg-[#bbf7d0] dark:bg-[#1665344d] rounded-full flex items-center justify-center group-hover:bg-[#86efac] dark:group-hover:bg-[#16653499] group-hover:scale-110 transition-all duration-200">
                              <FileUp className="h-4 w-4 text-[#166534] dark:text-[#bbf7d0]" />
                            </div>
                            <span className="font-medium">{t("MJV_excel_import")}</span>
                          </button>
                        </li>
                      )}

                    {formState.formElements.foreignCurrency?.visible && (
                      <li>
                        <div className="px-3 py-[5px] hover:bg-[#f5f3ff] hover:text-[#7e22ce] dark:hover:bg-[#581c874d] dark:hover:text-[#d8b4fe] transition-all duration-200 rounded-md group">
                          <div className="w-full flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#f3e8ff] dark:bg-[#7c3aed4d] rounded-full flex items-center justify-center group-hover:bg-[#e9d5ff] dark:group-hover:bg-[#7c3aed99] group-hover:scale-110 transition-all duration-200">
                              <DollarSign className="h-4 w-4 text-[#7c3aed] dark:text-[#f3e8ff]" />
                            </div>
                            <ERPCheckbox
                              id="foreignCurrency"
                              label={formState.formElements.foreignCurrency.label}
                              className="flex-1"
                              checked={formState.foreignCurrency}
                              onChange={(e) => dispatch(formStateHandleFieldChange({ fields: { foreignCurrency: e.target.checked, }, }))}
                              disabled={formState.formElements.foreignCurrency?.disabled || formState.formElements.pnlMasters?.disabled}
                            />
                          </div>
                        </div>
                      </li>
                    )}

                    <li>
                      <button
                        onClick={selectTemplates}
                        disabled={formState.formElements?.pnlMasters?.disabled}
                        className={`w-full flex items-center gap-3 px-3 py-[5px] transition-all duration-200 rounded-md group text-left  ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-[#fff7ed] hover:text-[#c2410c] dark:hover:bg-[#7c2d124d] dark:hover:text-[#fdba74]'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200   ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-300 text-gray-500' : 'bg-[#ffedd5] dark:bg-[#7c2d124d] group-hover:bg-[#fed7aa] dark:group-hover:bg-[#7c2d1299] group-hover:scale-110'}`}>
                          <AlignHorizontalSpaceBetween className={`h-4 w-4 ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500' : 'text-[#ea580c] dark:text-[#ffedd5]'}`} />
                        </div>
                        <span className="font-medium">{t("change_template")}</span>
                      </button>
                    </li>

                    {formState.formElements.printPreview?.visible && (
                      <li>
                        <div className="px-3 py-[5px] hover:bg-[#eef2ff] hover:text-[#4338ca] dark:hover:bg-[#312e814d] dark:hover:text-[#c7d2fe] transition-all duration-200 rounded-md group">
                          <div className="w-full flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#eef2ff] dark:bg-[#312e81] rounded-full flex items-center justify-center group-hover:bg-[#c7d2fe] dark:group-hover:bg-[#312e81cc] group-hover:scale-110 transition-all duration-200">
                              <Printer className="h-4 w-4 text-[#4338ca] dark:text-[#c7d2fe]" />
                            </div>
                            <ERPCheckbox
                              localInputBox={formState?.userConfig?.inputBoxStyle}
                              id="printPreview"
                              className="flex-1"
                              label={t(formState.formElements.printPreview.label)}
                              checked={formState.printPreview}
                              onChange={(e) => dispatch(formStateHandleFieldChange({ fields: { printPreview: e.target.checked, }, }))}
                              disabled={formState.formElements.printPreview?.disabled}
                            />
                          </div>
                        </div>
                      </li>
                    )}

                    {["PI", "GRN"].includes(formState.transaction.master.voucherType) && (
                      <li>
                        <button
                          disabled={formState.formElements?.pnlMasters?.disabled}
                          onClick={(e) => {
                            closeMenuPopup();
                            setIsPendingOrderOpen({ open: true, type: "PO" });
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-[5px] transition-all duration-200 rounded-md group text-left ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-[#fff1f2] hover:text-[#be123c] dark:hover:bg-[#8813374d] dark:hover:text-[#fda4af]'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-300 text-gray-500' : 'bg-[#ffe4e6] dark:bg-[#8813374d] group-hover:bg-[#fecdd3] dark:group-hover:bg-[#88133799] group-hover:scale-110'}`} >
                            <ShoppingCart className={`h-4 w-4 ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500' : 'text-[#be123c] dark:text-[#fda4af]'}`} />
                          </div>
                          <span className="font-medium">{t('pending_purchase_order_list')}</span>
                        </button>
                      </li>
                    )}

                    {
                      formState.transaction.master.voucherType == 'PI' &&
                      (
                        <li>
                          <button
                            disabled={formState.formElements?.pnlMasters?.disabled}
                            onClick={(e) => {
                              closeMenuPopup();
                              setIsPendingOrderOpen({ open: true, type: "GRN" });
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-[5px] transition-all duration-200 rounded-md group text-left ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-[#fefce8] hover:text-[#a16207] dark:hover:bg-[#78350f4d] dark:hover:text-[#fde047]'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-300 text-gray-500' : 'bg-[#fef3c7] dark:bg-[#78350f4d] group-hover:bg-[#fde68a] dark:group-hover:bg-[#78350fcc] group-hover:scale-110'}`} >
                              <Package className={`h-4 w-4 ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500' : 'text-[#a16207] dark:text-[#fde047]'}`} />
                            </div>
                            <span className="font-medium">{t('pending_goods_receipt_list')}</span>
                          </button>
                        </li>
                      )
                    }

                    {
                      ["PO", VoucherType.PurchaseQuotation].includes(formState.transaction.master.voucherType) &&
                      (
                        <li>
                          <button
                            disabled={formState.formElements?.pnlMasters?.disabled}
                            onClick={(e) => {
                              closeMenuPopup();
                              setIsPendingOrderOpen({ open: true, type: "POC" });
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-[5px] transition-all duration-200 rounded-md group text-left ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-[#fefce8] hover:text-[#a16207] dark:hover:bg-[#78350f4d] dark:hover:text-[#fde047]'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-300 text-gray-500' : 'bg-[#fef3c7] dark:bg-[#78350f4d] group-hover:bg-[#fde68a] dark:group-hover:bg-[#78350fcc] group-hover:scale-110'}`} >
                              <Package className={`h-4 w-4 ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500' : 'text-[#a16207] dark:text-[#fde047]'}`} />
                            </div>
                            <span className="font-medium">{t('consolidated_all_branch_purchase_order_list')}</span>
                          </button>
                        </li>
                      )
                    }

                    {
                      ["PO"].includes(formState.transaction.master.voucherType) &&
                      (
                        <li>
                          <button
                            disabled={formState.formElements?.pnlMasters?.disabled}
                            onClick={(e) => {
                              closeMenuPopup();
                              setIsPendingOrderOpen({ open: true, type: "PQ" });
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-[5px] transition-all duration-200 rounded-md group text-left ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-[#fefce8] hover:text-[#a16207] dark:hover:bg-[#78350f4d] dark:hover:text-[#fde047]'}`}   >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-300 text-gray-500' : 'bg-[#fef3c7] dark:bg-[#78350f4d] group-hover:bg-[#fde68a] dark:group-hover:bg-[#78350fcc] group-hover:scale-110'}`}>
                              <Package className={`h-4 w-4  ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500' : 'text-[#a16207] dark:text-[#fde047]'}`} />
                            </div>
                            <span className="font-medium">{t('pending_purchase_quotation_list')}</span>
                          </button>
                        </li>
                      )
                    }

                    <li>
                      <button
                        disabled={formState.formElements?.pnlMasters?.disabled}
                        onClick={(e) => {
                          closeMenuPopup();
                          onChooseTemplate();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-[5px] transition-all duration-200 rounded-md group text-left ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-[#ecfeff] hover:text-[#0e7490] dark:hover:bg-[#164e634d] dark:hover:text-[#67e8f9]'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-300 text-gray-500' : 'bg-[#cffafe] dark:bg-[#164e634d] group-hover:bg-[#a5f3fc] dark:group-hover:bg-[#164e6399] group-hover:scale-110'}`}>
                          <Download className={`h-4 w-4  ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500' : 'text-[#0e7490] dark:text-[#67e8f9]'}`} />
                        </div>
                        <span className="font-medium">{t("download_excel_template")}</span>
                      </button>
                    </li>

                    <li>
                      <button
                        disabled={formState.formElements?.pnlMasters?.disabled}
                        onClick={(e) => {
                          closeMenuPopup();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-[5px] transition-all duration-200 rounded-md group text-left ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-[#ecfdf5] hover:text-[#047857] dark:hover:bg-[#064e3b4d] dark:hover:text-[#6ee7b7]'}`}   >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200  ${formState.formElements?.pnlMasters?.disabled ? 'bg-gray-300 text-gray-500' : 'bg-[#d1fae5] dark:bg-[#065f46]/30 group-hover:bg-[#a7f3d0] dark:group-hover:bg-[#065f46]/50 group-hover:scale-110'}`}        >
                          <Upload className={`h-4 w-4 ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500' : 'text-[#065f46] dark:text-[#6ee7b7]'}`} />
                        </div>
                        <ERPFileUploadButton
                          buttonText={t("import_from_excel")}
                          handleFileChange={onSelectExcel}
                          hideIcon={true}
                          buttonClassName={`font-medium bg-transparent border-none p-0 hover:bg-transparent ${formState.formElements?.pnlMasters?.disabled ? 'text-gray-500 cursor-not-allowed' : ''}`}
                          disabled={formState.formElements?.pnlMasters?.disabled}
                        />
                      </button>
                    </li>

                    <li>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-lime-50 hover:text-lime-800 dark:hover:bg-lime-900/30 dark:hover:text-lime-300 transition-all duration-200 rounded-md group text-left"
                        onClick={() => { closeMenuPopup() }}>
                        <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center group-hover:bg-lime-200 dark:group-hover:bg-lime-900/50 group-hover:scale-110 transition-all duration-200">
                          <Printer className="h-4 w-4 text-lime-800 dark:text-lime-300" />
                        </div>
                        <span className="font-medium">{t("print_barcode")}</span>
                      </button>
                    </li>

                    {formState.transaction.master.voucherType === 'PI' && (
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#f5f3ff] hover:text-[#6d28d9] dark:hover:bg-[#4c1d954d] dark:hover:text-[#ddd6fe] transition-all duration-200 rounded-md group text-left"
                      
                          onClick={() =>
                            { printVoucher(
                              formState.transaction?.master.invTransactionMasterID,  // masterID
                              "GoodsReceipt",                       // transactionType
                               "GRN",        // voucherType
                              formState.transaction?.master?.voucherForm?? "",           // formType
                              formState.transaction?.master.customerType ??"",       // customerType
                              true,  
                              formState.userConfig?.printPreview??false,
                              undefined,                                            // printTmeplate (optional)
                              formState.transaction?.master.transactionDate ?? "",
                            );
                            closeMenuPopup();}
                          }
                          disabled={formState.transactionLoading}
                        >
                          <div className="w-8 h-8 bg-[#ede9fe] dark:bg-[#4c1d954d] rounded-full flex items-center justify-center group-hover:bg-[#ddd6fe] dark:group-hover:bg-[#4c1d9599] group-hover:scale-110 transition-all duration-200">
                            <Printer className="h-4 w-4 text-[#6d28d9] dark:text-[#ddd6fe]" />
                          </div>
                          <span className="font-medium">{t("grn_print")}</span>
                        </button>
                      </li>
                    )}
                    {formState.transaction.master.invTransactionMasterID > 0 && formState.transaction.master.voucherType === 'PR' && applicationSettings.accountsSettings.maintainBillwiseAccount && (
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#f5f3ff] hover:text-[#6d28d9] dark:hover:bg-[#4c1d954d] dark:hover:text-[#ddd6fe] transition-all duration-200 rounded-md group text-left"
                          onClick={() => { closeMenuPopup(); handleBillwiseClick() }}
                          disabled={formState.transactionLoading}
                        >
                          <div className="w-8 h-8 bg-[#ede9fe] dark:bg-[#4c1d954d] rounded-full flex items-center justify-center group-hover:bg-[#ddd6fe] dark:group-hover:bg-[#4c1d9599] group-hover:scale-110 transition-all duration-200">
                            <Printer className="h-4 w-4 text-[#6d28d9] dark:text-[#ddd6fe]" />
                          </div>
                          <span className="font-medium">{t("billwise")}</span>
                        </button>
                      </li>
                    )}

                    {!isAbove768 && (
                      <>
                        {formState.formElements.btnProductSummary.visible == true && (
                          <li>
                            <button
                              className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#ecfeff] hover:text-[#0e7490] dark:hover:bg-[#164e634d] dark:hover:text-[#67e8f9] transition-all duration-200 rounded-md group text-left"
                              onClick={() => dispatch(formStateHandleFieldChange({ fields: { isProductSummaryOpen: true }, }))}>
                              <div className="w-8 h-8 bg-[#cffafe] dark:bg-[#164e634d] rounded-full flex items-center justify-center group-hover:bg-[#a5f3fc] dark:group-hover:bg-[#164e6399] group-hover:scale-110 transition-all duration-200">
                                <Boxes className="h-4 w-4 text-[#0e7490] dark:text-[#67e8f9]" />
                              </div>
                              <span className="font-medium">{t("product_summary")}</span>
                            </button>
                          </li>
                        )}
                        <li>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#ecfdf5] hover:text-[#047857] dark:hover:bg-[#064e3b4d] dark:hover:text-[#6ee7b7] transition-all duration-200 rounded-md group text-left"
                            onClick={() => dispatch(formStateHandleFieldChange({ fields: { isPartyWiseSummaryOpen: true }, }))}>
                            <div className="w-8 h-8 bg-[#d1fae5] dark:bg-[#064e3b4d] rounded-full flex items-center justify-center group-hover:bg-[#a7f3d0] dark:group-hover:bg-[#064e3b99] group-hover:scale-110 transition-all duration-200">
                              <Group className="h-4 w-4 text-[#065f46] dark:text-[#6ee7b7]" />
                            </div>
                            <span className="font-medium">{t("party_wise_summary")}</span>
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#fefce8] hover:text-[#a16207] dark:hover:bg-[#78350f4d] dark:hover:text-[#fde047] transition-all duration-200 rounded-md group text-left"
                            onClick={handleHistoryClick}>
                            <div className="w-8 h-8 bg-[#fef3c7] dark:bg-[#78350f4d] rounded-full flex items-center justify-center group-hover:bg-[#fde68a] dark:group-hover:bg-[#78350fcc] group-hover:scale-110 transition-all duration-200">
                              <History className="h-4 w-4 text-[#a16207] dark:text-[#fde047]" />
                            </div>
                            <span className="font-medium">{t("history")}</span>
                          </button>
                        </li>
                      </>
                    )}

                    {!isAbove640 && (
                      <>
                        <li>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#fff7ed] hover:text-[#c2410c] dark:hover:bg-[#7c2d124d] dark:hover:text-[#fdba74] transition-all duration-200 rounded-md group text-left"
                            onClick={handleClearControls}>
                            <div className="w-8 h-8 bg-[#ffedd5] dark:bg-[#7c2d124d] rounded-full flex items-center justify-center group-hover:bg-[#fed7aa] dark:group-hover:bg-[#7c2d1299] group-hover:scale-110 transition-all duration-200">
                              <Eraser className="h-4 w-4 text-[#ea580c] dark:text-[#ffedd5]" />
                            </div>
                            <span className="font-medium">{t("clear")}</span>
                          </button>
                        </li>
                        <li>
                          <button
                            disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                            className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#f5f3ff] hover:text-[#6d28d9] dark:hover:bg-[#4c1d954d] dark:hover:text-[#ddd6fe] transition-all duration-200 rounded-md group text-left"
                        onClick={() =>
                    printVoucher(
                      formState.transaction?.master.invTransactionMasterID,  // masterID
                      transactionType ?? "",                       // transactionType
                      voucherType ?? "",        // voucherType
                      formState.transaction?.master?.voucherForm?? "",           // formType
                      formState.transaction?.master.customerType ?? "",       // customerType
                      true,  
                      formState.userConfig?.printPreview??false,
                      undefined,                                            // printTmeplate (optional)
                      formState.transaction?.master.transactionDate ?? "",
                      
                    )
                          }
                          >
                            <div className="w-8 h-8 bg-[#ede9fe] dark:bg-[#4c1d954d] rounded-full flex items-center justify-center group-hover:bg-[#ddd6fe] dark:group-hover:bg-[#4c1d9599] group-hover:scale-110 transition-all duration-200">
                              <Printer className="h-4 w-4 text-[#6d28d9] dark:text-[#ddd6fe]" />
                            </div>
                            <span className="font-medium">{t("print")}</span>
                          </button>
                        </li>
                      </>
                    )}

                    {!isAbove480 && (
                      <>
                        <li>
                          <button
                            disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master?.invTransactionMasterID > 0 && formState.formElements?.pnlMasters?.disabled !== true)}
                            className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#fff1f2] hover:text-[#be123c] dark:hover:bg-[#8813374d] dark:hover:text-[#fda4af] transition-all duration-200 rounded-md group text-left"
                            onClick={deleteTransVoucher}>
                            <div className="w-8 h-8 bg-[#ffe4e6] dark:bg-[#8813374d] rounded-full flex items-center justify-center group-hover:bg-[#fecdd3] dark:group-hover:bg-[#88133799] group-hover:scale-110 transition-all duration-200">
                              <Trash2 className="h-4 w-4 text-[#be123c] dark:text-[#fda4af]" />
                            </div>
                            <span className="font-medium">{t("delete")}</span>
                          </button>
                        </li>
                        {formState.formElements.lnkUnlockVoucher?.visible !== true && (
                          <li>
                            <button
                              disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                              className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#eef2ff] hover:text-[#4338ca] dark:hover:bg-[#312e814d] dark:hover:text-[#c7d2fe] transition-all duration-200 rounded-md group text-left"
                              onClick={handleEdit}>
                              <div className="w-8 h-8 bg-[#eef2ff] dark:bg-[#312e814d] rounded-full flex items-center justify-center group-hover:bg-[#c7d2fe] dark:group-hover:bg-[#312e81cc] group-hover:scale-110 transition-all duration-200">
                                <Pencil className="h-4 w-4 text-[#4338ca] dark:text-[#c7d2fe]" />
                              </div>
                              <span className="font-medium">{t("edit")}</span>
                            </button>
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </nav>


              </div>
            )}
          </div>
          {/* Modals */}
          {isPendingOrderOpen && isPendingOrderOpen.open &&
            <ERPModal
              isOpen={isPendingOrderOpen.open}
              closeModal={() => setIsPendingOrderOpen({ open: false, type: "" })}
              title={t("pending_order")}
              width={800}
              height={780}
              content={
                <PendingOrderList
                  partyLedgerID={formState.transaction.master.ledgerID}
                  branchID={formState.transaction.master.fromWarehouseID}
                  formType={formState.transaction.master.voucherForm ?? ""}

                  closeModal={() => setIsPendingOrderOpen({ open: false, type: "" })}
                  t={t}
                  voucherType={isPendingOrderOpen.type}
                  onProcessSelected={onProcessSelected}
                />
              }
            />
          }
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
      </>
    );
  }
);

export default React.memo(Header);