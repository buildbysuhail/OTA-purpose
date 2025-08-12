import { VoucherElementProps, } from "../../purchase/transaction-types";
import { formStateHandleFieldChange } from "../../purchase/reducer";
import { useEffect, useRef, useState } from "react";
import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import { TransactionUserConfig } from "../../purchase/transaction-user-config";
import { EllipsisVertical, KeyRound, Pencil, Printer, RefreshCw, Trash2, ChevronUp, BadgePlusIcon, Eraser, X, FileUp, History, AlignHorizontalSpaceBetween, Boxes, Group, ListPlus, DollarSign, Download, Package, ShoppingCart, Upload, } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import PendingOrderList from "../pending-order-list";
import ERPFileUploadButton from "../../../../../components/ERPComponents/erp-file-upload-button";

interface HeaderProps extends VoucherElementProps {
  loadTemporaryRows: () => Promise<void>;
  deleteTransVoucher: () => void;
  handleRefresh: () => void;
  createNewVoucher: () => void;
  handleEdit: () => void;
  printVoucher: (setIsPrintModalOpen: React.Dispatch<React.SetStateAction<boolean>>, voucherType: string) => void;
  handleClearControls: () => void;
  handleHistoryClick: () => void;
  setIsHistorySidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionType?: string;
  voucherType: string;
  userSession: { dbIdValue: string };
  unlockVoucher: () => void;
  setShowValidation: React.Dispatch<React.SetStateAction<boolean>>;
  showValidation: boolean;
  selectTemplates: () => void;
  goToPreviousPage: () => void;
  isHistorySidebarOpen: boolean;
  phone?: boolean;
  setIsPrintModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProcessSelected: ((masterIds: string, loadType: string) => void) | undefined;
  downloadImportTemplateHeadersOnly: any;
  importFromExcel: any;
}

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
      selectTemplates,
      goToPreviousPage,
      phone = false,
      setIsPrintModalOpen,
      onProcessSelected,
      downloadImportTemplateHeadersOnly,
      importFromExcel
    },
    ref
  ) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isLoadMultiModalOpen, setIsLoadMultiModalOpen] = useState(false);
    const [isPendingOrderOpen, setIsPendingOrderOpen] = useState({ open: false, type: "PO" });
    const [isImportExcelOpen, setIsImportExcelOpen] = useState(false)

    const openExcelImport = () => {
      setIsImportExcelOpen(true)
    }

    const openLoadMultiModal = () => {
      setIsLoadMultiModalOpen(true);
    };

    const closePopupVisible = () => {
      dispatch(
        formStateHandleFieldChange({
          fields: { isPopupVisible: false },
        })
      );
    };

    const togglePopupVisible = () => {
      dispatch(
        formStateHandleFieldChange({
          fields: { isPopupVisible: !formState.isPopupVisible },
        })
      );
    };


    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          popupRef.current &&
          !popupRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          closePopupVisible();
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

    return (
      <>
        {!deviceInfo?.isMobile && (
          <div className={`!overflow-visible flex items-center ${phone ? "justify-evenly" : "justify-end"}  space-x-2 p-1 w-full overflow-x-auto ${phone ? "bg-[#f9fafb]" : ""} ${phone ? "" : ""} ${phone ? "" : ""}`}>

            {/* Load Temp Rows */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title="Load Details">
              <button disabled={formState.formElements.pnlMasters?.disabled}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={loadTemporaryRows}>
                <ChevronUp className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Delete Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("delete")}>
              <button
                disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master?.invTransactionMasterID > 0 && formState.formElements?.pnlMasters?.disabled !== true)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={deleteTransVoucher}>
                <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Refresh Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("refresh")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Create New Voucher */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clone")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={createNewVoucher} >
                <BadgePlusIcon className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Edit Button */}
            {formState.formElements.lnkUnlockVoucher?.visible !== true && (
              <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
                <button
                  disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                  className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                  onClick={handleEdit}>
                  <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              </div>
            )}

            {/* Print Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("print")}>
              <button
                disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}>
                <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Clear Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clear")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={handleClearControls}>
                <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Product Summary */}
            {formState.formElements.btnProductSummary.visible == true && (
              <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("product_summary")}>
                <button
                  className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                  onClick={() => dispatch(formStateHandleFieldChange({ fields: { isProductSummaryOpen: true }, }))}>
                  <Boxes className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              </div>
            )}
            {/* partywise summary */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("party_wise_summary")}>
              <button
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() => dispatch(formStateHandleFieldChange({ fields: { isPartyWiseSummaryOpen: true }, }))}>
                <Group className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* History Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("history")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={handleHistoryClick}>
                <History className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* History Sidebar */}

            {/* Settings Button */}
            <div>
              {phone ? (<TransactionUserConfig phone={true} transactionType={transactionType ?? ""} />) : (<TransactionUserConfig transactionType={transactionType ?? ""} />)}
            </div>

            {/* Popup Menu */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={togglePopupVisible}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"}  rounded-md hover:bg-gray-200 transition-colors`}
                title={t("previous_page")}>
                <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>

              {formState.isPopupVisible && (
                <div
                  ref={popupRef}
                  className="absolute rounded-lg bg-white dark:bg-[#1f2937] text-black dark:text-[#f3f4f6] shadow-xl border border-[#e5e7eb] dark:border-[#374151] p-2 z-50 backdrop-blur-sm"
                  style={{ top: "45px", left: "-231px", width: "273px", }}>
                  <nav className="w-full">
                    <ul className="space-y-1">
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

                      {/* MJV Excel Import */}
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

                      {/* Foreign Currency Checkbox */}
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
                                onChange={(e) =>
                                  dispatch(
                                    formStateHandleFieldChange({
                                      fields: {
                                        foreignCurrency: e.target.checked,
                                      },
                                    })
                                  )
                                }
                                disabled={
                                  formState.formElements.foreignCurrency?.disabled ||
                                  formState.formElements.pnlMasters?.disabled
                                }
                              />
                            </div>
                          </div>
                        </li>
                      )}

                      {/* Change Template */}
                      <li>
                        <button onClick={selectTemplates} className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#fff7ed] hover:text-[#c2410c] dark:hover:bg-[#7c2d124d] dark:hover:text-[#fdba74] transition-all duration-200 rounded-md group text-left">
                          <div className="w-8 h-8 bg-[#ffedd5] dark:bg-[#7c2d124d] rounded-full flex items-center justify-center group-hover:bg-[#fed7aa] dark:group-hover:bg-[#7c2d1299] group-hover:scale-110 transition-all duration-200">
                            <AlignHorizontalSpaceBetween className="h-4 w-4 text-[#ea580c] dark:text-[#ffedd5]" />
                          </div>
                          <span className="font-medium">{t("change_template")}</span>
                        </button>
                      </li>

                      {/* Print Preview Checkbox */}
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
                                onChange={(e) =>
                                  dispatch(
                                    formStateHandleFieldChange({
                                      fields: {
                                        printPreview: e.target.checked,
                                      },
                                    })
                                  )
                                }
                                disabled={formState.formElements.printPreview?.disabled}
                              />
                            </div>
                          </div>
                        </li>
                      )}

                      {/* Load Multi */}
                      {/* <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#f0fdfa] hover:text-[#0f766e] dark:hover:bg-[#134e4a4d] dark:hover:text-[#5eead4] transition-all duration-200 rounded-md group text-left"
                          onClick={openLoadMultiModal}>
                          <div className="w-8 h-8 bg-[#ccfbf1] dark:bg-[#134e4a4d] rounded-full flex items-center justify-center group-hover:bg-[#99f6e4] dark:group-hover:bg-[#134e4a99] group-hover:scale-110 transition-all duration-200">
                            <Layers className="h-4 w-4 text-[#134e4a] dark:text-[#ccfbf1]" />
                          </div>
                          <span className="font-medium">{t('load_multi')}</span>
                        </button>
                      </li> */}

                      {/* Pending Order */}
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#fff1f2] hover:text-[#be123c] dark:hover:bg-[#8813374d] dark:hover:text-[#fda4af] transition-all duration-200 rounded-md group text-left"
                          onClick={(e) => setIsPendingOrderOpen({ open: true, type: "PO" })}>
                          <div className="w-8 h-8 bg-[#ffe4e6] dark:bg-[#8813374d] rounded-full flex items-center justify-center group-hover:bg-[#fecdd3] dark:group-hover:bg-[#88133799] group-hover:scale-110 transition-all duration-200">
                            <ShoppingCart className="h-4 w-4 text-[#be123c] dark:text-[#fda4af]" />
                          </div>
                          <span className="font-medium">{t('pending_purchase_order_list')}</span>
                        </button>
                      </li>

                      {/* Pending GRN */}
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#fefce8] hover:text-[#a16207] dark:hover:bg-[#78350f4d] dark:hover:text-[#fde047] transition-all duration-200 rounded-md group text-left"
                          onClick={(e) => setIsPendingOrderOpen({ open: true, type: "GRN" })}>
                          <div className="w-8 h-8 bg-[#fef3c7] dark:bg-[#78350f4d] rounded-full flex items-center justify-center group-hover:bg-[#fde68a] dark:group-hover:bg-[#78350fcc] group-hover:scale-110 transition-all duration-200">
                            <Package className="h-4 w-4 text-[#a16207] dark:text-[#fde047]" />
                          </div>
                          <span className="font-medium">{t('pending_goods_receipt_list')}</span>
                        </button>
                      </li>

                      {/* Choose Template */}
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#ecfeff] hover:text-[#0e7490] dark:hover:bg-[#164e634d] dark:hover:text-[#67e8f9] transition-all duration-200 rounded-md group text-left"
                          onClick={onChooseTemplate}>
                          <div className="w-8 h-8 bg-[#cffafe] dark:bg-[#164e634d] rounded-full flex items-center justify-center group-hover:bg-[#a5f3fc] dark:group-hover:bg-[#164e6399] group-hover:scale-110 transition-all duration-200">
                            <Download className="h-4 w-4 text-[#0e7490] dark:text-[#67e8f9]" />
                          </div>
                          <span className="font-medium">{t("download_excel_template")}</span>
                        </button>
                      </li>

                      {/* Import Excel Template */}
                      <li>
                        <div className="px-3 py-[5px] hover:bg-[#ecfdf5] hover:text-[#047857] dark:hover:bg-[#064e3b4d] dark:hover:text-[#6ee7b7] transition-all duration-200 rounded-md group">
                          <div className="w-full flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#d1fae5] dark:bg-[#065f46]/30 rounded-full flex items-center justify-center group-hover:bg-[#a7f3d0] dark:group-hover:bg-[#065f46]/50 group-hover:scale-110 transition-all duration-200">
                              <Upload className="h-4 w-4 text-[#065f46] dark:text-[#6ee7b7]" />
                            </div>
                            <ERPFileUploadButton
                              buttonText={t("import_from_excel")}
                              handleFileChange={onSelectExcel}
                              hideIcon={true}
                              buttonClassName="font-medium bg-transparent border-none p-0 hover:bg-transparent text-left flex-1"
                            />
                          </div>
                        </div>
                      </li>

                      {/* Print Barcode */}
                      <li>
                        <div className="px-3 py-[5px] hover:bg-lime-50 hover:text-lime-800 dark:hover:bg-lime-900/30 dark:hover:text-lime-300 transition-all duration-200 rounded-md group">
                          <div className="w-full flex items-center gap-3">
                            <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center group-hover:bg-lime-200 dark:group-hover:bg-lime-900/50 group-hover:scale-110 transition-all duration-200">
                              <Printer className="h-4 w-4 text-lime-800 dark:text-lime-300" />
                            </div>
                            <button
                              className="font-medium bg-transparent border-none p-0 hover:bg-transparent text-left flex-1"
                            >
                              {t("print_barcode")}
                            </button>
                          </div>
                        </div>
                      </li>

                      {/* GRN Print */}
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#f5f3ff] hover:text-[#6d28d9] dark:hover:bg-[#4c1d954d] dark:hover:text-[#ddd6fe] transition-all duration-200 rounded-md group text-left"
                          // onClick={handlePrint}
                          disabled={formState.transactionLoading}
                        >
                          <div className="w-8 h-8 bg-[#ede9fe] dark:bg-[#4c1d954d] rounded-full flex items-center justify-center group-hover:bg-[#ddd6fe] dark:group-hover:bg-[#4c1d9599] group-hover:scale-110 transition-all duration-200">
                            <Printer className="h-4 w-4 text-[#6d28d9] dark:text-[#ddd6fe]" />
                          </div>
                          <span className="font-medium">{t("grn_print")}</span>
                        </button>
                      </li>

                    </ul>
                  </nav>

                  {/* Modals */}
                  {/* {isLoadMultiModalOpen &&
                    <ERPModal
                      isOpen={isLoadMultiModalOpen}
                      closeModal={() => setIsLoadMultiModalOpen(false)}
                      title={t("load_multi")}
                      width={800}
                      height={200}
                      content={<LoadMulti closeModal={() => setIsLoadMultiModalOpen(false)} t={t} />}
                      footer={<LoadMultiFooter closeModal={() => setIsLoadMultiModalOpen(false)} t={t} />}
                    />
                  } */}
                  {isPendingOrderOpen && isPendingOrderOpen.open &&
                    <ERPModal
                      isOpen={isPendingOrderOpen.open}
                      closeModal={() => setIsPendingOrderOpen({ open: false, type: "PO" })}
                      title={t("pending_order")}
                      width={800}
                      height={780}
                      content={
                        <PendingOrderList
                          closeModal={() => setIsPendingOrderOpen({ open: false, type: "PO" })}
                          t={t}
                          voucherType="PO"
                          onProcessSelected={onProcessSelected}
                        />
                      }
                    />
                  }
                </div>
              )}
            </div>

            {/* Previous Page Button */}
            {!phone && (
              <button
                onClick={goToPreviousPage}
                className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                title={t("previous_page")}>
                <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            )}
          </div>
        )}

        {deviceInfo?.isMobile && (
          <div
            className={`!overflow-visible flex items-center ${phone ? "justify-evenly" : "justify-end"}  space-x-2 p-1 w-full overflow-x-auto ${phone ? "bg-[#f9fafb]" : ""} ${phone ? "" : ""} ${phone ? "" : ""}`}>
            {/* formState details */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title="Form State Details">
              <button
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() => dispatch(formStateHandleFieldChange({ fields: { isFormStateDetailOpen: true }, }))} >
                <ListPlus className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
            {/* Load Temp Rows */}

            <div className="group relative inline-flex flex-col items-center ps-[5px]" title="Load Details" >
              <button
                disabled={formState.formElements.pnlMasters?.disabled}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={loadTemporaryRows}>
                <ChevronUp className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Delete Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("delete")}>
              <button
                disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master?.invTransactionMasterID > 0 && formState.formElements?.pnlMasters?.disabled !== true)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={deleteTransVoucher} >
                <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Refresh Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("refresh")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={handleRefresh} >
                <RefreshCw className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Create New Voucher */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clone")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={createNewVoucher} >
                <BadgePlusIcon className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Edit Button */}
            {formState.formElements.lnkUnlockVoucher?.visible !== true && (
              <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("edit")}>
                <button
                  disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                  className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                  onClick={handleEdit}>
                  <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              </div>
            )}

            {/* Print Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("print")}>
              <button
                disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}>
                <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Clear Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clear")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={handleClearControls}>
                <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* Product Summary */}
            {formState.formElements.btnProductSummary.visible == true && (
              <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("product_summary")}>
                <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                  onClick={() => dispatch(formStateHandleFieldChange({ fields: { isProductSummaryOpen: true }, }))}>
                  <Boxes className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              </div>
            )}
            {/* partywise summary */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("party_wise_summary")}>
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() => dispatch(formStateHandleFieldChange({ fields: { isPartyWiseSummaryOpen: true }, }))}>
                <Group className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* History Button */}
            <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("history")} >
              <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={handleHistoryClick} >
                <History className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* History Sidebar */}

            {/* Settings Button */}
            <div>
              {phone ? (<TransactionUserConfig phone={true} transactionType={transactionType ?? ""} />) : (<TransactionUserConfig transactionType={transactionType ?? ""} />)}
            </div>

            {/* Popup Menu */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsPopupVisible((prev: any) => !prev)}
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"}  rounded-md hover:bg-gray-200 transition-colors`}
                title={t("previous_page")}>
                <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>

              {isPopupVisible && (
                <div
                  ref={popupRef}
                  className="absolute rounded-sm dark:bg-dark-bg dark:text-dark-text bg-gray-100 shadow-lg p-4 z-50"
                  style={{ top: "100%", left: "-180px", width: "251px", marginTop: "8px", }}>
                  <nav className="w-full dark:bg-dark-bg dark:text-dark-text bg-gray-100 text-black">
                    <ul className="space-y-1">
                      {formState.formElements.lnkUnlockVoucher?.visible && (
                        <li>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                            onClick={(e) => { unlockVoucher(); }}>
                            <KeyRound className="h-4 w-4" />
                            <span>{t("unlock_voucher")}</span>
                          </button>
                        </li>
                      )}

                      {formState.transaction.master.voucherType === "MJV" &&
                        userSession.dbIdValue === "ABCO" && (
                          <li>
                            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm" onClick={() => setShowValidation(true)}>
                              <FileUp className="h-4 w-4" />
                              <span>{t("MJV_excel_import")}</span>
                            </button>
                          </li>
                        )}

                      {formState.formElements.foreignCurrency?.visible && (
                        <li>
                          <ERPCheckbox
                            id="foreignCurrency"
                            label={formState.formElements.foreignCurrency.label}
                            className="test23 w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                            checked={formState.foreignCurrency}
                            onChange={(e) =>
                              dispatch(
                                formStateHandleFieldChange({
                                  fields: {
                                    foreignCurrency: e.target.checked,
                                  },
                                })
                              )
                            }
                            disabled={
                              formState.formElements.foreignCurrency?.disabled ||
                              formState.formElements.pnlMasters?.disabled
                            }
                          />
                        </li>
                      )}
                      <li>
                        <button onClick={selectTemplates} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm" >
                          <AlignHorizontalSpaceBetween className="h-4 w-4" />
                          {t("change_template")}
                        </button>
                      </li>
                      {formState.formElements.printPreview?.visible && (
                        <li>
                          <ERPCheckbox
                            localInputBox={formState?.userConfig?.inputBoxStyle}
                            id="printPreview"
                            className="test23 w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                            label={t(formState.formElements.printPreview.label)}
                            checked={formState.printPreview}
                            onChange={(e) =>
                              dispatch(
                                formStateHandleFieldChange({
                                  fields: {
                                    printPreview: e.target.checked,
                                  },
                                })
                              )
                            }
                            disabled={
                              formState.formElements.printPreview?.disabled
                            }
                          />
                        </li>
                      )}
                      <li>
                        {/* Clear Button */}
                        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("clear")}>
                          <button className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`} onClick={handleClearControls}>
                            <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                          </button>
                        </div>
                      </li>
                      <li>
                        {/* Print Button */}
                        <div className="group relative inline-flex flex-col items-center ps-[5px]" title={t("print")}>
                          <button
                            disabled={formState.transaction.master.invTransactionMasterID < 1 || (formState.transaction.master.invTransactionMasterID > 0 && formState.formElements.pnlMasters.disabled !== true)}
                            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-0.5" : "p-3"} rounded-md hover:bg-gray-200 transition-colors`}
                            onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}>
                            <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                          </button>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>

            {/* Previous Page Button */}
            {!phone && (
              <button
                onClick={goToPreviousPage}
                className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                title={t("previous_page")}>
                <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            )}
          </div>
        )}
      </>
    );
  }
);

export default React.memo(Header);
