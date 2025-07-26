import {
  TransactionFormState,
  VoucherElementProps,
} from "../../purchase/transaction-types";
import { formStateHandleFieldChange } from "../../purchase/reducer";
import { useEffect, useRef, useState } from "react";
import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import { TransactionUserConfig } from "../../purchase/transaction-user-config";
import {
  EllipsisVertical,
  KeyRound,
  Pencil,
  Printer,
  RefreshCw,
  Trash2,
  ChevronUp,
  BadgePlusIcon,
  Eraser,
  X,
  FileUp,
  History,
  AlignHorizontalSpaceBetween,
  Boxes,
  Group,
  ListPlus,
  FileDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { LoadMulti, LoadMultiFooter } from "../load-multi";
import PendingOrderList from "../pending-order-list";
import ERPFileUploadButton from "../../../../../components/ERPComponents/erp-file-upload-button";
import ERPButton from "../../../../../components/ERPComponents/erp-button";

interface HeaderProps extends VoucherElementProps {
  loadTemporaryRows: () => Promise<void>;
  deleteTransVoucher: () => void;
  handleRefresh: () => void;
  createNewVoucher: () => void;
  handleEdit: () => void;
  printVoucher: (
    setIsPrintModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    voucherType: string
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
    const [isPendingOrderOpen, setIsPendingOrderOpen]=useState({open: false, type: "PO"});
    const [isImportExcelOpen,setIsImportExcelOpen]=useState(false)

    const openExcelImport = () =>{
      setIsImportExcelOpen(true)
    }

        const openLoadMultiModal = () => {
      setIsLoadMultiModalOpen(true);
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
    const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);

      const onChooseTemplate = async () => {
    debugger;
      downloadImportTemplateHeadersOnly && downloadImportTemplateHeadersOnly()
  }

      const onSelectExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
        debugger;
        importFromExcel && importFromExcel(event)
      };

    return (
      <>
        {!deviceInfo?.isMobile && (
        <div
          className={`!overflow-visible flex items-center ${
            phone ? "justify-evenly" : "justify-end"
          }  space-x-2 p-1 w-full overflow-x-auto ${
            phone ? "bg-[#f9fafb]" : ""
          } ${phone ? "" : ""} ${phone ? "" : ""}`}
        >
          {/* formState details */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title="Form State Details"
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={() =>
                dispatch(
                  formStateHandleFieldChange({
                    fields: { isFormStateDetailOpen: true },
                  })
                )
              }
            >
              <ListPlus className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>
          {/* Load Temp Rows */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title="Load Details"
          >
            <button
              disabled={formState.formElements.pnlMasters?.disabled}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={loadTemporaryRows}
            >
              <ChevronUp className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Delete Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("delete")}
          >
            <button
              disabled={
                formState.transaction.master.invTransactionMasterID < 1 ||
                (formState.transaction.master?.invTransactionMasterID > 0 &&
                  formState.formElements?.pnlMasters?.disabled !== true)
              }
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={deleteTransVoucher}
            >
              <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Refresh Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("refresh")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Create New Voucher */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("clone")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={createNewVoucher}
            >
              <BadgePlusIcon className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Edit Button */}
          {formState.formElements.lnkUnlockVoucher?.visible !== true && (
            <div
              className="group relative inline-flex flex-col items-center ps-[5px]"
              title={t("edit")}
            >
              <button
                disabled={
                  formState.transaction.master.invTransactionMasterID < 1 ||
                  (formState.transaction.master.invTransactionMasterID > 0 &&
                    formState.formElements.pnlMasters.disabled !== true)
                }
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                  phone ? "p-0.5" : "p-3"
                } rounded-md hover:bg-gray-200 transition-colors`}
                onClick={handleEdit}
              >
                <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* Print Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("print")}
          >
            <button
              disabled={
                formState.transaction.master.invTransactionMasterID < 1 ||
                (formState.transaction.master.invTransactionMasterID > 0 &&
                  formState.formElements.pnlMasters.disabled !== true)
              }
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}
            >
              <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Clear Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("clear")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleClearControls}
            >
              <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Product Summary */}
          {formState.formElements.btnProductSummary.visible == true && (
            <div
              className="group relative inline-flex flex-col items-center ps-[5px]"
              title={t("product_summary")}
            >
              <button
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                  phone ? "p-0.5" : "p-3"
                } rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() =>
                  dispatch(
                    formStateHandleFieldChange({
                      fields: { isProductSummaryOpen: true },
                    })
                  )
                }
              >
                <Boxes className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}
          {/* partywise summary */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("party_wise_summary")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={() =>
                dispatch(
                  formStateHandleFieldChange({
                    fields: { isPartyWiseSummaryOpen: true },
                  })
                )
              }
            >
              <Group className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* History Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("history")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleHistoryClick}
            >
              <History className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* History Sidebar */}

          {/* Settings Button */}
          <div>
            {phone ? (
              <TransactionUserConfig phone={true} transactionType={transactionType??""}/>
            ) : (
              <TransactionUserConfig transactionType={transactionType??""} />
            )}
          </div>

          {/* Popup Menu */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsPopupVisible((prev: any) => !prev)}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              }  rounded-md hover:bg-gray-200 transition-colors`}
              title={t("previous_page")}
            >
              <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>

            {isPopupVisible && (
              <div
                ref={popupRef}
                className="absolute rounded-lg bg-white dark:bg-[#1f2937] text-black dark:text-[#f3f4f6] shadow-xl border border-[#e5e7eb] dark:border-[#374151] p-2 z-50 backdrop-blur-sm"
                style={{
                  top: "45px",
                  left: "-233px",
                  width: "275px",
                }}
              >
                <nav className="w-full">
                  <ul className="space-y-1">

                    {formState.formElements.lnkUnlockVoucher?.visible && (
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#eff6ff] hover:text-[#1d4ed8] dark:hover:bg-[#1e3a8a4d] dark:hover:text-[#93c5fd] transition-all duration-200 rounded-md group text-left"
                          onClick={unlockVoucher}
                        >
                          <KeyRound className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{t("unlock_voucher")}</span>
                        </button>
                      </li>
                    )}

                    {/* MJV Excel Import */}
                    {formState.transaction.master.voucherType === "MJV" &&
                      userSession.dbIdValue === "ABCO" && (
                        <li>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f0fdf4] hover:text-[#15803d] dark:hover:bg-[#14532d4d] dark:hover:text-[#86efac] transition-all duration-200 rounded-md group text-left"
                            onClick={() => setShowValidation(true)}
                          >
                            <FileUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{t("MJV_excel_import")}</span>
                          </button>
                        </li>
                      )}

                    {/* Foreign Currency Checkbox */}
                    {formState.formElements.foreignCurrency?.visible && (
                      <li>
                        <div className="px-3 py-2.5 hover:bg-[#f5f3ff] hover:text-[#7e22ce] dark:hover:bg-[#581c874d] dark:hover:text-[#d8b4fe] transition-all duration-200 rounded-md">
                          <ERPCheckbox
                            id="foreignCurrency"
                            label={formState.formElements.foreignCurrency.label}
                            className="w-full flex items-center gap-3"
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
                      </li>
                    )}

                    {/* Change Template */}
                    <li>
                      <button
                        onClick={selectTemplates}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#fff7ed] hover:text-[#c2410c] dark:hover:bg-[#7c2d124d] dark:hover:text-[#fdba74] transition-all duration-200 rounded-md group text-left"
                      >
                        <AlignHorizontalSpaceBetween className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{t("change_template")}</span>
                      </button>
                    </li>

                    {/* Print Preview Checkbox */}
                    {formState.formElements.printPreview?.visible && (
                      <li>
                        <div className="px-3 py-2.5 hover:bg-[#eef2ff] hover:text-[#4338ca] dark:hover:bg-[#312e814d] dark:hover:text-[#c7d2fe] transition-all duration-200 rounded-md">
                          <ERPCheckbox
                            localInputBox={formState?.userConfig?.inputBoxStyle}
                            id="printPreview"
                            className="w-full flex items-center gap-3"
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
                      </li>
                    )}

                    {/* Divider */}
                    <li>
                      <hr className="my-2 border-[#e5e7eb] dark:border-[#4b5563]" />
                    </li>

                    {/* Load Multi */}
                    <li>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f0fdfa] hover:text-[#0f766e] dark:hover:bg-[#134e4a4d] dark:hover:text-[#5eead4] transition-all duration-200 rounded-md group text-left"
                        onClick={openLoadMultiModal}
                      >
                        <span className="font-medium">{t('load_multi')}</span>
                      </button>
                    </li>

                    {/* Pending Order */}
                    <li>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#fff1f2] hover:text-[#be123c] dark:hover:bg-[#8813374d] dark:hover:text-[#fda4af] transition-all duration-200 rounded-md group text-left"
                        onClick={(e) => setIsPendingOrderOpen({open: true, type:"PO"})}
                      >
                        <span className="font-medium">{t('pending_order')}</span>
                      </button>
                    </li>
                    {/* Pending GRN */}
                    <li>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#fff1f2] hover:text-[#be123c] dark:hover:bg-[#8813374d] dark:hover:text-[#fda4af] transition-all duration-200 rounded-md group text-left"
                        onClick={(e) => setIsPendingOrderOpen({open: true, type:"GRN"})}
                      >
                        <span className="font-medium">{t('pending_order')}</span>
                      </button>
                    </li>

                    {/* Choose Template */}
                    <li>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#ecfeff] hover:text-[#0e7490] dark:hover:bg-[#164e634d] dark:hover:text-[#67e8f9] transition-all duration-200 rounded-md group text-left"
                        onClick={onChooseTemplate}
                      >
                        <span className="font-medium">{t("download_for_excel_template_import")}</span>
                      </button>
                    </li>

                    {/* Import Excel Template */}
                    <li>
                      <div className="px-3 py-2.5 hover:bg-[#ecfdf5] hover:text-[#047857] dark:hover:bg-[#064e3b4d] dark:hover:text-[#6ee7b7] transition-all duration-200 rounded-md">
                        <ERPFileUploadButton
                          buttonText={t("import_excel_template")}
                          handleFileChange={onSelectExcel}
                          buttonClassName="w-full text-left font-medium bg-transparent border-none p-0 hover:bg-transparent"
                        />
                      </div>
                    </li>
                  </ul>
                </nav>

                {/* Modals */}
                {isLoadMultiModalOpen &&
                <ERPModal
                  isOpen={isLoadMultiModalOpen}
                  closeModal={() => setIsLoadMultiModalOpen(false)}
                  title={t("load_multi")}
                  width={800}
                  height={200}
                  content={<LoadMulti closeModal={() => setIsLoadMultiModalOpen(false)} t={t} />}
                  footer={<LoadMultiFooter />}
                />
  }
{isPendingOrderOpen && isPendingOrderOpen.open &&
                <ERPModal
                  isOpen={isPendingOrderOpen.open}
                  closeModal={() => setIsPendingOrderOpen({open: false, type:"PO"})}
                  title={t("pending_order")}
                  width={800}
                  height={780}
                  content={
                    <PendingOrderList
                      closeModal={() => setIsPendingOrderOpen({open: false, type:"PO"})}
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
              title={t("previous_page")}
            >
              <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          )}
        </div>
        )}

        {deviceInfo?.isMobile && (
        <div
          className={`!overflow-visible flex items-center ${
            phone ? "justify-evenly" : "justify-end"
          }  space-x-2 p-1 w-full overflow-x-auto ${
            phone ? "bg-[#f9fafb]" : ""
          } ${phone ? "" : ""} ${phone ? "" : ""}`}
        >
          {/* formState details */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title="Form State Details"
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={() =>
                dispatch(
                  formStateHandleFieldChange({
                    fields: { isFormStateDetailOpen: true },
                  })
                )
              }
            >
              <ListPlus className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>
          {/* Load Temp Rows */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title="Load Details"
          >
            <button
              disabled={formState.formElements.pnlMasters?.disabled}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={loadTemporaryRows}
            >
              <ChevronUp className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Delete Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("delete")}
          >
            <button
              disabled={
                formState.transaction.master.invTransactionMasterID < 1 ||
                (formState.transaction.master?.invTransactionMasterID > 0 &&
                  formState.formElements?.pnlMasters?.disabled !== true)
              }
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={deleteTransVoucher}
            >
              <Trash2 className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Refresh Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("refresh")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Create New Voucher */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("clone")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={createNewVoucher}
            >
              <BadgePlusIcon className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Edit Button */}
          {formState.formElements.lnkUnlockVoucher?.visible !== true && (
            <div
              className="group relative inline-flex flex-col items-center ps-[5px]"
              title={t("edit")}
            >
              <button
                disabled={
                  formState.transaction.master.invTransactionMasterID < 1 ||
                  (formState.transaction.master.invTransactionMasterID > 0 &&
                    formState.formElements.pnlMasters.disabled !== true)
                }
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                  phone ? "p-0.5" : "p-3"
                } rounded-md hover:bg-gray-200 transition-colors`}
                onClick={handleEdit}
              >
                <Pencil className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}

          {/* Print Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("print")}
          >
            <button
              disabled={
                formState.transaction.master.invTransactionMasterID < 1 ||
                (formState.transaction.master.invTransactionMasterID > 0 &&
                  formState.formElements.pnlMasters.disabled !== true)
              }
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}
            >
              <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Clear Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("clear")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleClearControls}
            >
              <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* Product Summary */}
          {formState.formElements.btnProductSummary.visible == true && (
            <div
              className="group relative inline-flex flex-col items-center ps-[5px]"
              title={t("product_summary")}
            >
              <button
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                  phone ? "p-0.5" : "p-3"
                } rounded-md hover:bg-gray-200 transition-colors`}
                onClick={() =>
                  dispatch(
                    formStateHandleFieldChange({
                      fields: { isProductSummaryOpen: true },
                    })
                  )
                }
              >
                <Boxes className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          )}
          {/* partywise summary */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("party_wise_summary")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={() =>
                dispatch(
                  formStateHandleFieldChange({
                    fields: { isPartyWiseSummaryOpen: true },
                  })
                )
              }
            >
              <Group className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* History Button */}
          <div
            className="group relative inline-flex flex-col items-center ps-[5px]"
            title={t("history")}
          >
            <button
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              } rounded-md hover:bg-gray-200 transition-colors`}
              onClick={handleHistoryClick}
            >
              <History className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
          </div>

          {/* History Sidebar */}

          {/* Settings Button */}
          <div>
            {phone ? (
              <TransactionUserConfig phone={true} transactionType={transactionType??""}/>
            ) : (
              <TransactionUserConfig transactionType={transactionType??""}/>
            )}
          </div>

          {/* Popup Menu */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsPopupVisible((prev: any) => !prev)}
              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                phone ? "p-0.5" : "p-3"
              }  rounded-md hover:bg-gray-200 transition-colors`}
              title={t("previous_page")}
            >
              <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>

            {isPopupVisible && (
              <div
                ref={popupRef}
                className="absolute rounded-sm dark:bg-dark-bg dark:text-dark-text bg-gray-100 shadow-lg p-4 z-50"
                style={{
                  top: "100%",
                  left: "-180px",
                  width: "251px",
                  marginTop: "8px",
                }}
              >
                <nav className="w-full dark:bg-dark-bg dark:text-dark-text bg-gray-100 text-black">
                  <ul className="space-y-1">


                    {formState.formElements.lnkUnlockVoucher?.visible && (
                      <li>
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                          onClick={(e) => {
                            unlockVoucher();
                          }}
                        >
                          <KeyRound className="h-4 w-4" />
                          <span>{t("unlock_voucher")}</span>
                        </button>
                      </li>
                    )}

                    {formState.transaction.master.voucherType === "MJV" &&
                      userSession.dbIdValue === "ABCO" && (
                        <li>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                            onClick={() => setShowValidation(true)}
                          >
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
                      <button
                        onClick={selectTemplates}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                      >
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
                          <div
                            className="group relative inline-flex flex-col items-center ps-[5px]"
                            title={t("clear")}
                          >
                            <button
                              className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                                phone ? "p-0.5" : "p-3"
                              } rounded-md hover:bg-gray-200 transition-colors`}
                              onClick={handleClearControls}
                            >
                              <Eraser className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                            </button>
                          </div>
                    </li>
                    <li>
                      {/* Print Button */}
                        <div
                          className="group relative inline-flex flex-col items-center ps-[5px]"
                          title={t("print")}
                        >
                          <button
                            disabled={
                              formState.transaction.master.invTransactionMasterID < 1 ||
                              (formState.transaction.master.invTransactionMasterID > 0 &&
                                formState.formElements.pnlMasters.disabled !== true)
                            }
                            className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${
                              phone ? "p-0.5" : "p-3"
                            } rounded-md hover:bg-gray-200 transition-colors`}
                            onClick={() => printVoucher(setIsPrintModalOpen, voucherType)}
                          >
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
              title={t("previous_page")}
            >
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
